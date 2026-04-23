/**
 * @license
 * Copyright 2019 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */const oi=globalThis,Yi=oi.ShadowRoot&&(oi.ShadyCSS===void 0||oi.ShadyCSS.nativeShadow)&&"adoptedStyleSheets"in Document.prototype&&"replace"in CSSStyleSheet.prototype,Zi=Symbol(),nr=new WeakMap;let or=class{constructor(e,t,a){if(this._$cssResult$=!0,a!==Zi)throw Error("CSSResult is not constructable. Use `unsafeCSS` or `css` instead.");this.cssText=e,this.t=t}get styleSheet(){let e=this.o;const t=this.t;if(Yi&&e===void 0){const a=t!==void 0&&t.length===1;a&&(e=nr.get(t)),e===void 0&&((this.o=e=new CSSStyleSheet).replaceSync(this.cssText),a&&nr.set(t,e))}return e}toString(){return this.cssText}};const Wn=i=>new or(typeof i=="string"?i:i+"",void 0,Zi),ye=(i,...e)=>{const t=i.length===1?i[0]:e.reduce(((a,r,s)=>a+(n=>{if(n._$cssResult$===!0)return n.cssText;if(typeof n=="number")return n;throw Error("Value passed to 'css' function must be a 'css' function result: "+n+". Use 'unsafeCSS' to pass non-literal values, but take care to ensure page security.")})(r)+i[s+1]),i[0]);return new or(t,i,Zi)},Yn=(i,e)=>{if(Yi)i.adoptedStyleSheets=e.map((t=>t instanceof CSSStyleSheet?t:t.styleSheet));else for(const t of e){const a=document.createElement("style"),r=oi.litNonce;r!==void 0&&a.setAttribute("nonce",r),a.textContent=t.cssText,i.appendChild(a)}},lr=Yi?i=>i:i=>i instanceof CSSStyleSheet?(e=>{let t="";for(const a of e.cssRules)t+=a.cssText;return Wn(t)})(i):i;/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */const{is:Zn,defineProperty:Kn,getOwnPropertyDescriptor:Xn,getOwnPropertyNames:Jn,getOwnPropertySymbols:eo,getPrototypeOf:to}=Object,li=globalThis,cr=li.trustedTypes,io=cr?cr.emptyScript:"",ao=li.reactiveElementPolyfillSupport,jt=(i,e)=>i,Ki={toAttribute(i,e){switch(e){case Boolean:i=i?io:null;break;case Object:case Array:i=i==null?i:JSON.stringify(i)}return i},fromAttribute(i,e){let t=i;switch(e){case Boolean:t=i!==null;break;case Number:t=i===null?null:Number(i);break;case Object:case Array:try{t=JSON.parse(i)}catch{t=null}}return t}},dr=(i,e)=>!Zn(i,e),ur={attribute:!0,type:String,converter:Ki,reflect:!1,useDefault:!1,hasChanged:dr};Symbol.metadata??=Symbol("metadata"),li.litPropertyMetadata??=new WeakMap;let ht=class extends HTMLElement{static addInitializer(e){this._$Ei(),(this.l??=[]).push(e)}static get observedAttributes(){return this.finalize(),this._$Eh&&[...this._$Eh.keys()]}static createProperty(e,t=ur){if(t.state&&(t.attribute=!1),this._$Ei(),this.prototype.hasOwnProperty(e)&&((t=Object.create(t)).wrapped=!0),this.elementProperties.set(e,t),!t.noAccessor){const a=Symbol(),r=this.getPropertyDescriptor(e,a,t);r!==void 0&&Kn(this.prototype,e,r)}}static getPropertyDescriptor(e,t,a){const{get:r,set:s}=Xn(this.prototype,e)??{get(){return this[t]},set(n){this[t]=n}};return{get:r,set(n){const o=r?.call(this);s?.call(this,n),this.requestUpdate(e,o,a)},configurable:!0,enumerable:!0}}static getPropertyOptions(e){return this.elementProperties.get(e)??ur}static _$Ei(){if(this.hasOwnProperty(jt("elementProperties")))return;const e=to(this);e.finalize(),e.l!==void 0&&(this.l=[...e.l]),this.elementProperties=new Map(e.elementProperties)}static finalize(){if(this.hasOwnProperty(jt("finalized")))return;if(this.finalized=!0,this._$Ei(),this.hasOwnProperty(jt("properties"))){const t=this.properties,a=[...Jn(t),...eo(t)];for(const r of a)this.createProperty(r,t[r])}const e=this[Symbol.metadata];if(e!==null){const t=litPropertyMetadata.get(e);if(t!==void 0)for(const[a,r]of t)this.elementProperties.set(a,r)}this._$Eh=new Map;for(const[t,a]of this.elementProperties){const r=this._$Eu(t,a);r!==void 0&&this._$Eh.set(r,t)}this.elementStyles=this.finalizeStyles(this.styles)}static finalizeStyles(e){const t=[];if(Array.isArray(e)){const a=new Set(e.flat(1/0).reverse());for(const r of a)t.unshift(lr(r))}else e!==void 0&&t.push(lr(e));return t}static _$Eu(e,t){const a=t.attribute;return a===!1?void 0:typeof a=="string"?a:typeof e=="string"?e.toLowerCase():void 0}constructor(){super(),this._$Ep=void 0,this.isUpdatePending=!1,this.hasUpdated=!1,this._$Em=null,this._$Ev()}_$Ev(){this._$ES=new Promise((e=>this.enableUpdating=e)),this._$AL=new Map,this._$E_(),this.requestUpdate(),this.constructor.l?.forEach((e=>e(this)))}addController(e){(this._$EO??=new Set).add(e),this.renderRoot!==void 0&&this.isConnected&&e.hostConnected?.()}removeController(e){this._$EO?.delete(e)}_$E_(){const e=new Map,t=this.constructor.elementProperties;for(const a of t.keys())this.hasOwnProperty(a)&&(e.set(a,this[a]),delete this[a]);e.size>0&&(this._$Ep=e)}createRenderRoot(){const e=this.shadowRoot??this.attachShadow(this.constructor.shadowRootOptions);return Yn(e,this.constructor.elementStyles),e}connectedCallback(){this.renderRoot??=this.createRenderRoot(),this.enableUpdating(!0),this._$EO?.forEach((e=>e.hostConnected?.()))}enableUpdating(e){}disconnectedCallback(){this._$EO?.forEach((e=>e.hostDisconnected?.()))}attributeChangedCallback(e,t,a){this._$AK(e,a)}_$ET(e,t){const a=this.constructor.elementProperties.get(e),r=this.constructor._$Eu(e,a);if(r!==void 0&&a.reflect===!0){const s=(a.converter?.toAttribute!==void 0?a.converter:Ki).toAttribute(t,a.type);this._$Em=e,s==null?this.removeAttribute(r):this.setAttribute(r,s),this._$Em=null}}_$AK(e,t){const a=this.constructor,r=a._$Eh.get(e);if(r!==void 0&&this._$Em!==r){const s=a.getPropertyOptions(r),n=typeof s.converter=="function"?{fromAttribute:s.converter}:s.converter?.fromAttribute!==void 0?s.converter:Ki;this._$Em=r,this[r]=n.fromAttribute(t,s.type)??this._$Ej?.get(r)??null,this._$Em=null}}requestUpdate(e,t,a){if(e!==void 0){const r=this.constructor,s=this[e];if(a??=r.getPropertyOptions(e),!((a.hasChanged??dr)(s,t)||a.useDefault&&a.reflect&&s===this._$Ej?.get(e)&&!this.hasAttribute(r._$Eu(e,a))))return;this.C(e,t,a)}this.isUpdatePending===!1&&(this._$ES=this._$EP())}C(e,t,{useDefault:a,reflect:r,wrapped:s},n){a&&!(this._$Ej??=new Map).has(e)&&(this._$Ej.set(e,n??t??this[e]),s!==!0||n!==void 0)||(this._$AL.has(e)||(this.hasUpdated||a||(t=void 0),this._$AL.set(e,t)),r===!0&&this._$Em!==e&&(this._$Eq??=new Set).add(e))}async _$EP(){this.isUpdatePending=!0;try{await this._$ES}catch(t){Promise.reject(t)}const e=this.scheduleUpdate();return e!=null&&await e,!this.isUpdatePending}scheduleUpdate(){return this.performUpdate()}performUpdate(){if(!this.isUpdatePending)return;if(!this.hasUpdated){if(this.renderRoot??=this.createRenderRoot(),this._$Ep){for(const[r,s]of this._$Ep)this[r]=s;this._$Ep=void 0}const a=this.constructor.elementProperties;if(a.size>0)for(const[r,s]of a){const{wrapped:n}=s,o=this[r];n!==!0||this._$AL.has(r)||o===void 0||this.C(r,void 0,s,o)}}let e=!1;const t=this._$AL;try{e=this.shouldUpdate(t),e?(this.willUpdate(t),this._$EO?.forEach((a=>a.hostUpdate?.())),this.update(t)):this._$EM()}catch(a){throw e=!1,this._$EM(),a}e&&this._$AE(t)}willUpdate(e){}_$AE(e){this._$EO?.forEach((t=>t.hostUpdated?.())),this.hasUpdated||(this.hasUpdated=!0,this.firstUpdated(e)),this.updated(e)}_$EM(){this._$AL=new Map,this.isUpdatePending=!1}get updateComplete(){return this.getUpdateComplete()}getUpdateComplete(){return this._$ES}shouldUpdate(e){return!0}update(e){this._$Eq&&=this._$Eq.forEach((t=>this._$ET(t,this[t]))),this._$EM()}updated(e){}firstUpdated(e){}};ht.elementStyles=[],ht.shadowRootOptions={mode:"open"},ht[jt("elementProperties")]=new Map,ht[jt("finalized")]=new Map,ao?.({ReactiveElement:ht}),(li.reactiveElementVersions??=[]).push("2.1.0");/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */const Xi=globalThis,ci=Xi.trustedTypes,hr=ci?ci.createPolicy("lit-html",{createHTML:i=>i}):void 0,pr="$lit$",He=`lit$${Math.random().toFixed(9).slice(2)}$`,_r="?"+He,ro=`<${_r}>`,rt=document,Dt=()=>rt.createComment(""),Ot=i=>i===null||typeof i!="object"&&typeof i!="function",Ji=Array.isArray,so=i=>Ji(i)||typeof i?.[Symbol.iterator]=="function",ea=`[ 	
\f\r]`,Rt=/<(?:(!--|\/[^a-zA-Z])|(\/?[a-zA-Z][^>\s]*)|(\/?$))/g,mr=/-->/g,fr=/>/g,st=RegExp(`>|${ea}(?:([^\\s"'>=/]+)(${ea}*=${ea}*(?:[^ 	
\f\r"'\`<>=]|("|')|))|$)`,"g"),yr=/'/g,vr=/"/g,gr=/^(?:script|style|textarea|title)$/i,no=i=>(e,...t)=>({_$litType$:i,strings:e,values:t}),_=no(1),nt=Symbol.for("lit-noChange"),v=Symbol.for("lit-nothing"),br=new WeakMap,ot=rt.createTreeWalker(rt,129);function xr(i,e){if(!Ji(i)||!i.hasOwnProperty("raw"))throw Error("invalid template strings array");return hr!==void 0?hr.createHTML(e):e}const oo=(i,e)=>{const t=i.length-1,a=[];let r,s=e===2?"<svg>":e===3?"<math>":"",n=Rt;for(let o=0;o<t;o++){const l=i[o];let c,h,u=-1,p=0;for(;p<l.length&&(n.lastIndex=p,h=n.exec(l),h!==null);)p=n.lastIndex,n===Rt?h[1]==="!--"?n=mr:h[1]!==void 0?n=fr:h[2]!==void 0?(gr.test(h[2])&&(r=RegExp("</"+h[2],"g")),n=st):h[3]!==void 0&&(n=st):n===st?h[0]===">"?(n=r??Rt,u=-1):h[1]===void 0?u=-2:(u=n.lastIndex-h[2].length,c=h[1],n=h[3]===void 0?st:h[3]==='"'?vr:yr):n===vr||n===yr?n=st:n===mr||n===fr?n=Rt:(n=st,r=void 0);const m=n===st&&i[o+1].startsWith("/>")?" ":"";s+=n===Rt?l+ro:u>=0?(a.push(c),l.slice(0,u)+pr+l.slice(u)+He+m):l+He+(u===-2?o:m)}return[xr(i,s+(i[t]||"<?>")+(e===2?"</svg>":e===3?"</math>":"")),a]};class ii{constructor({strings:e,_$litType$:t},a){let r;this.parts=[];let s=0,n=0;const o=e.length-1,l=this.parts,[c,h]=oo(e,t);if(this.el=ii.createElement(c,a),ot.currentNode=this.el.content,t===2||t===3){const u=this.el.content.firstChild;u.replaceWith(...u.childNodes)}for(;(r=ot.nextNode())!==null&&l.length<o;){if(r.nodeType===1){if(r.hasAttributes())for(const u of r.getAttributeNames())if(u.endsWith(pr)){const p=h[n++],m=r.getAttribute(u).split(He),f=/([.?@])?(.*)/.exec(p);l.push({type:1,index:s,name:f[2],strings:m,ctor:f[1]==="."?co:f[1]==="?"?uo:f[1]==="@"?ho:di}),r.removeAttribute(u)}else u.startsWith(He)&&(l.push({type:6,index:s}),r.removeAttribute(u));if(gr.test(r.tagName)){const u=r.textContent.split(He),p=u.length-1;if(p>0){r.textContent=ci?ci.emptyScript:"";for(let m=0;m<p;m++)r.append(u[m],Dt()),ot.nextNode(),l.push({type:2,index:++s});r.append(u[p],Dt())}}}else if(r.nodeType===8)if(r.data===_r)l.push({type:2,index:s});else{let u=-1;for(;(u=r.data.indexOf(He,u+1))!==-1;)l.push({type:7,index:s}),u+=He.length-1}s++}}static createElement(e,t){const a=rt.createElement("template");return a.innerHTML=e,a}}function pt(i,e,t=i,a){if(e===nt)return e;let r=a!==void 0?t._$Co?.[a]:t._$Cl;const s=Ot(e)?void 0:e._$litDirective$;return r?.constructor!==s&&(r?._$AO?.(!1),s===void 0?r=void 0:(r=new s(i),r._$AT(i,t,a)),a!==void 0?(t._$Co??=[])[a]=r:t._$Cl=r),r!==void 0&&(e=pt(i,r._$AS(i,e.values),r,a)),e}class lo{constructor(e,t){this._$AV=[],this._$AN=void 0,this._$AD=e,this._$AM=t}get parentNode(){return this._$AM.parentNode}get _$AU(){return this._$AM._$AU}u(e){const{el:{content:t},parts:a}=this._$AD,r=(e?.creationScope??rt).importNode(t,!0);ot.currentNode=r;let s=ot.nextNode(),n=0,o=0,l=a[0];for(;l!==void 0;){if(n===l.index){let c;l.type===2?c=new ai(s,s.nextSibling,this,e):l.type===1?c=new l.ctor(s,l.name,l.strings,this,e):l.type===6&&(c=new po(s,this,e)),this._$AV.push(c),l=a[++o]}n!==l?.index&&(s=ot.nextNode(),n++)}return ot.currentNode=rt,r}p(e){let t=0;for(const a of this._$AV)a!==void 0&&(a.strings!==void 0?(a._$AI(e,a,t),t+=a.strings.length-2):a._$AI(e[t])),t++}}class ai{get _$AU(){return this._$AM?._$AU??this._$Cv}constructor(e,t,a,r){this.type=2,this._$AH=v,this._$AN=void 0,this._$AA=e,this._$AB=t,this._$AM=a,this.options=r,this._$Cv=r?.isConnected??!0}get parentNode(){let e=this._$AA.parentNode;const t=this._$AM;return t!==void 0&&e?.nodeType===11&&(e=t.parentNode),e}get startNode(){return this._$AA}get endNode(){return this._$AB}_$AI(e,t=this){e=pt(this,e,t),Ot(e)?e===v||e==null||e===""?(this._$AH!==v&&this._$AR(),this._$AH=v):e!==this._$AH&&e!==nt&&this._(e):e._$litType$!==void 0?this.$(e):e.nodeType!==void 0?this.T(e):so(e)?this.k(e):this._(e)}O(e){return this._$AA.parentNode.insertBefore(e,this._$AB)}T(e){this._$AH!==e&&(this._$AR(),this._$AH=this.O(e))}_(e){this._$AH!==v&&Ot(this._$AH)?this._$AA.nextSibling.data=e:this.T(rt.createTextNode(e)),this._$AH=e}$(e){const{values:t,_$litType$:a}=e,r=typeof a=="number"?this._$AC(e):(a.el===void 0&&(a.el=ii.createElement(xr(a.h,a.h[0]),this.options)),a);if(this._$AH?._$AD===r)this._$AH.p(t);else{const s=new lo(r,this),n=s.u(this.options);s.p(t),this.T(n),this._$AH=s}}_$AC(e){let t=br.get(e.strings);return t===void 0&&br.set(e.strings,t=new ii(e)),t}k(e){Ji(this._$AH)||(this._$AH=[],this._$AR());const t=this._$AH;let a,r=0;for(const s of e)r===t.length?t.push(a=new ai(this.O(Dt()),this.O(Dt()),this,this.options)):a=t[r],a._$AI(s),r++;r<t.length&&(this._$AR(a&&a._$AB.nextSibling,r),t.length=r)}_$AR(e=this._$AA.nextSibling,t){for(this._$AP?.(!1,!0,t);e&&e!==this._$AB;){const a=e.nextSibling;e.remove(),e=a}}setConnected(e){this._$AM===void 0&&(this._$Cv=e,this._$AP?.(e))}}class di{get tagName(){return this.element.tagName}get _$AU(){return this._$AM._$AU}constructor(e,t,a,r,s){this.type=1,this._$AH=v,this._$AN=void 0,this.element=e,this.name=t,this._$AM=r,this.options=s,a.length>2||a[0]!==""||a[1]!==""?(this._$AH=Array(a.length-1).fill(new String),this.strings=a):this._$AH=v}_$AI(e,t=this,a,r){const s=this.strings;let n=!1;if(s===void 0)e=pt(this,e,t,0),n=!Ot(e)||e!==this._$AH&&e!==nt,n&&(this._$AH=e);else{const o=e;let l,c;for(e=s[0],l=0;l<s.length-1;l++)c=pt(this,o[a+l],t,l),c===nt&&(c=this._$AH[l]),n||=!Ot(c)||c!==this._$AH[l],c===v?e=v:e!==v&&(e+=(c??"")+s[l+1]),this._$AH[l]=c}n&&!r&&this.j(e)}j(e){e===v?this.element.removeAttribute(this.name):this.element.setAttribute(this.name,e??"")}}let co=class extends di{constructor(){super(...arguments),this.type=3}j(e){this.element[this.name]=e===v?void 0:e}},uo=class extends di{constructor(){super(...arguments),this.type=4}j(e){this.element.toggleAttribute(this.name,!!e&&e!==v)}},ho=class extends di{constructor(e,t,a,r,s){super(e,t,a,r,s),this.type=5}_$AI(e,t=this){if((e=pt(this,e,t,0)??v)===nt)return;const a=this._$AH,r=e===v&&a!==v||e.capture!==a.capture||e.once!==a.once||e.passive!==a.passive,s=e!==v&&(a===v||r);r&&this.element.removeEventListener(this.name,this,a),s&&this.element.addEventListener(this.name,this,e),this._$AH=e}handleEvent(e){typeof this._$AH=="function"?this._$AH.call(this.options?.host??this.element,e):this._$AH.handleEvent(e)}};class po{constructor(e,t,a){this.element=e,this.type=6,this._$AN=void 0,this._$AM=t,this.options=a}get _$AU(){return this._$AM._$AU}_$AI(e){pt(this,e)}}const _o=Xi.litHtmlPolyfillSupport;_o?.(ii,ai),(Xi.litHtmlVersions??=[]).push("3.3.0");const mo=(i,e,t)=>{const a=t?.renderBefore??e;let r=a._$litPart$;if(r===void 0){const s=t?.renderBefore??null;a._$litPart$=r=new ai(e.insertBefore(Dt(),s),s,void 0,t??{})}return r._$AI(i),r};/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */const ta=globalThis;let Ge=class extends ht{constructor(){super(...arguments),this.renderOptions={host:this},this._$Do=void 0}createRenderRoot(){const e=super.createRenderRoot();return this.renderOptions.renderBefore??=e.firstChild,e}update(e){const t=this.render();this.hasUpdated||(this.renderOptions.isConnected=this.isConnected),super.update(e),this._$Do=mo(t,this.renderRoot,this.renderOptions)}connectedCallback(){super.connectedCallback(),this._$Do?.setConnected(!0)}disconnectedCallback(){super.disconnectedCallback(),this._$Do?.setConnected(!1)}render(){return nt}};Ge._$litElement$=!0,Ge.finalized=!0,ta.litElementHydrateSupport?.({LitElement:Ge});const fo=ta.litElementPolyfillSupport;fo?.({LitElement:Ge}),(ta.litElementVersions??=[]).push("4.2.0");/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */const yo={ATTRIBUTE:1},vo=i=>(...e)=>({_$litDirective$:i,values:e});let go=class{constructor(e){}get _$AU(){return this._$AM._$AU}_$AT(e,t,a){this._$Ct=e,this._$AM=t,this._$Ci=a}_$AS(e,t){return this.update(e,t)}update(e,t){return this.render(...t)}};/**
 * @license
 * Copyright 2018 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */const wr=vo(class extends go{constructor(i){if(super(i),i.type!==yo.ATTRIBUTE||i.name!=="class"||i.strings?.length>2)throw Error("`classMap()` can only be used in the `class` attribute and must be the only part in the attribute.")}render(i){return" "+Object.keys(i).filter((e=>i[e])).join(" ")+" "}update(i,[e]){if(this.st===void 0){this.st=new Set,i.strings!==void 0&&(this.nt=new Set(i.strings.join(" ").split(/\s/).filter((a=>a!==""))));for(const a in e)e[a]&&!this.nt?.has(a)&&this.st.add(a);return this.render(e)}const t=i.element.classList;for(const a of this.st)a in e||(t.remove(a),this.st.delete(a));for(const a in e){const r=!!e[a];r===this.st.has(a)||this.nt?.has(a)||(r?(t.add(a),this.st.add(a)):(t.remove(a),this.st.delete(a)))}return nt}});var bo={common:{not_found:"Entity not found.",search:"Search",power:"Power",favorite:"Favorite",loading:"Loading...",no_results:"No results.",close:"Close",vol_up:"Volume Up",vol_down:"Volume Down",media_player:"Media Player",edit_entity:"Edit Entity Settings",edit_action:"Edit Action Settings",mute:"Mute",unmute:"Unmute",seek:"Seek",volume:"Volume",play_now:"Play Now",more_options:"More Options",unavailable:"Unavailable",back:"Back",cancel:"Cancel",reset_default:"Reset to default"},editor:{tabs:{entities:"Entities",behavior:"Behavior",look_and_feel:"Look and Feel",artwork:"Artwork",actions:"Actions"},placeholders:{search:"Search music..."},sections:{artwork:{general:{title:"General Settings",description:"Global controls for how artwork is displayed and retrieved."},idle:{title:"Idle Artwork",description:"Show a static image or entity snapshot whenever nothing is playing."},overrides:{title:"Artwork Overrides",description:"Overrides are evaluated from top to bottom. Drag to reorder."}},entities:{title:"Entities*",description:"Add the media players you want to control. Drag entities to reorder the chip row."},behavior:{idle_chips:{title:"Idle & Chips",description:"Choose when the card goes idle and how entity chips behave."},interactions_search:{title:"Interactions & Search",description:"Fine-tune how entities are pinned and how many results show at once."},lyrics:{title:"Lyrics",description:"Configure how lyrics are displayed and when they appear."}},look_and_feel:{theme_layout:{title:"Theme & Layout",description:"Match dashboard styling and control the overall footprint."},controls_typography:{title:"Controls & Typography",description:"Tune button sizing, entity labels, and adaptive text."},collapsed_idle:{title:"Collapsed & Idle States",description:"Control when the card collapses and which views show while idle."}},actions:{title:"Actions",description:"Build the action chips that appear in the card or its menu. Drag to reorder, click the pencil to configure each action."}},subtitles:{idle_timeout:"Time in milliseconds before the card enters idle mode. Set to 0 to disable idle behavior.",show_chip_row:'"Auto" hides the chip row when only one entity is configured. "In Menu" moves the chips into the menu overlay. "In Menu on Idle" shows chips inline when active but moves them to the menu when idle.',dim_chips:"When the card enters idle mode with an image, dim the entity and action chips for a cleaner look.",hold_to_pin:"Long press on entity chips instead of short press to pin them, preventing auto-switching during playback.",always_show_group:"Quick grouping controls (+/-/star) will be visible by default on page load. You can still toggle it manually via double-tap.",disable_autofocus:"Keep the search box from stealing focus so on-screen keyboards stay hidden.",search_within_filter:"Enable this to search within the current active filter (Favorites, Recently Played, etc) instead of clearing it.",close_search_on_play:"Automatically close the search screen when a track is played.",pin_search_headers:"Keep search input and filters fixed at the top while scrolling results.",hide_search_headers_on_idle:"Hide search input and filters when the player is idle.",disable_mass:"Disable the optional Mass Queue integration even if it is installed.",swap_pause_stop:"Replace the pause button with stop while using the modern layout.",adaptive_controls:"Let the playback buttons grow or shrink to fit the available space.",hide_menu_player:"When chips live in the menu, hide the entity label at the bottom of the card.",adaptive_text:"Choose which text groups should scale with available space (leave empty to disable adaptive text).",collapse_expand:"Always Collapsed creates mini player mode. Expand on Search temporarily expands when searching.",idle_screen:"Choose which screen to display automatically when the card becomes idle.",hide_controls:"Select which controls to hide for this entity (all are shown by default)",hide_search_chips:"Hide specific search filter chips for this entity",follow_active_entity:"When enabled, the volume entity will automatically follow the active playback entity. Note: This overrides the selected volume entity.",search_limit_full:"Maximum number of search results to display (1-1000, default: 20)",default_search_filter_full:"Choose which filter is active by default when the search screen opens.",default_search_favorites:"Start search with favorites active",result_sorting_full:"Choose how results are ordered.",card_height_full:"Leave blank for automatic height",control_layout_full:"Choose between the legacy evenly sized controls or the modern Home Assistant layout.",artwork_extend:"Let the artwork background continue underneath the chip and action rows.",artwork_extend_label:"Extend artwork",no_artwork_overrides:"No artwork overrides configured. Use the plus button below to add one.",entity_current_hint:"Use 'entity_id: current' to target the card's currently selected media player entity. Note: The 'Test Action' button will be disabled when using this feature.",service_data_note:"Changes to the service data below are not committed to the config until the 'Save Service Data' button is clicked!",jinja_template_hint:"Enter a Jinja template that resolves to a single entity_id. Example switching MA based on a source selector:",jinja_template_vol_hint:"Enter a Jinja template that resolves to an entity_id (e.g. media_player.office_homepod or remote.soundbar). Example switching volume entity based on a boolean:",not_available_alt_collapsed:"Not available with Alternate Progress Bar or Always Collapsed mode",not_available_collapsed:"Not available when Always Collapsed is enabled",only_available_collapsed:"Only available when Always Collapsed is enabled",only_available_modern:"Only available with Modern layout",image_url_helper:"Enter a direct URL to an image or a local file path",selected_entity_helper:"Input text helper that will be updated with the currently selected media player entity ID.",select_entity_helper:"Input text helper to read the entity ID from. The card will automatically select the matching chip.",sync_entity_type:"Choose which entity ID to sync to the helper (defaults to Music Assistant entity if configured).",disable_auto_select:"Prevent this entity's chip from automatically being selected when it starts playing.",search_view:"Choose between a standard list or a card-based grid for search results.",search_card_columns:"Specify how many columns to use in the card view. Artwork will scale automatically.",card_type:"Choose the card mode. 'Default' is the standard media player. 'Dedicated Search' makes the card a permanent search interface.",always_show_lyrics:"Automatically open the lyrics view when the page is refreshed.",lyrics_source:"Music Assistant requires the mass_queue integration to fetch lyrics from its internal metadata engine.",lyrics_pre_roll:"Shift the lyrics highlight timing. Positive values speed it up, negative values slow it down (default: 0)."},titles:{edit_entity:"Edit Entity",edit_action:"Edit Action",service_data:"Service Data",add_artwork_override:"Add Artwork Override"},labels:{dim_chips:"Dim Chips on Idle",hold_to_pin:"Hold to Pin",always_show_group:"Quick Group by Default",disable_autofocus:"Disable Search Autofocus",keep_filters:"Keep Filters on Search",dismiss_on_play:"Dismiss search on play",pin_headers:"Pin search headers",hide_search_headers_on_idle:"Hide search headers on idle",default_search_filter:"Default Search Filter",default_search_favorites:"Default to Favorites Filter",disable_mass:"Disable Mass Queue",match_theme:"Match Theme",alt_progress:"Alternate Progress Bar",display_timestamps:"Display Timestamps",swap_pause_stop:"Swap Pause with Stop",adaptive_controls:"Adaptive Control Size",hide_active_entity:"Hide Active Entity Label",collapse_on_idle:"Collapse on Idle",hide_menu_player_toggle:"Hide Menu Player",always_collapsed:"Always Collapsed",expand_on_search:"Expand on Search",script_var:"Script Variable (yamp_entity)",use_ma_template:"Use template for Music Assistant Entity",use_vol_template:"Use template for Volume Entity",follow_active_entity:"Volume Entity Follows Active Entity",use_url_path:"Use URL or Path",adaptive_text_elements:"Adaptive Text Size Elements",disable_auto_select:"Disable Auto-Select",always_show_lyrics:"Always Show Lyrics",lyrics_mode:"Lyrics Mode",lyrics_source:"Lyrics Source",lyrics_pre_roll:"Lyrics Pre-Roll (seconds)"},fields:{artwork_fit:"Artwork Fit",artwork_position:"Artwork Position",artwork_hostname:"Artwork Hostname",match_field:"Match Field",match_value:"Match Value",size_percent:"Size (%)",object_fit:"Object Fit",idle_timeout:"Idle Timeout (ms)",show_chip_row:"Show Chip Row",search_limit:"Search Results Limit",result_sorting:"Result Sorting",vol_step:"Volume Step (0.05 = 5%)",card_height:"Card Height (px)",control_layout:"Control Layout",save_service_data:"Save Service Data",image_url:"Image URL",fallback_image_url:"Fallback Image URL",move_to_main:"Move action to main chips",move_to_menu:"Move action into menu",delete_action:"Delete Action",revert_service_data:"Revert to Saved Service Data",test_action:"Test Action",volume_mode:"Volume Mode",idle_screen:"Idle Screen",name:"Name",hidden_controls:"Hidden Controls",ma_template:"Music Assistant Entity Template (Jinja)",hidden_chips:"Hidden Search Filter Chips",vol_template:"Volume Entity Template (Jinja)",icon:"Icon",action_type:"Action Type",menu_item:"Menu Item",nav_path:"Navigation Path",service:"Service",service_data:"Service Data",idle_image_entity:"Idle Image Entity",match_entity:"Match Entity",ma_entity:"Music Assistant Entity",vol_entity:"Volume Entity",selected_entity_helper:"Selected Entity Helper",sync_entity_type:"Sync Entity Type",placement:"Placement",card_trigger:"Card Trigger",search_view:"Search Result View",search_card_columns:"Card Columns",card_type:"Card Type",appearance:"Appearance",no_artwork_option:"No Artwork",details_alignment:"Details Alignment"},action_types:{menu:"Open a Card Menu Item",service:"Call a Service",navigate:"Navigate",prev_entity:"Previous Entity Chip",next_entity:"Next Entity Chip",sync_selected_entity:"Sync Selected Entity",select_entity:"Select Entity from Helper",toggle_lyrics:"Toggle Lyrics Overlay"},action_helpers:{sync_selected_entity:"Sync Selected Entity \u2192",select_entity:"Select Entity \u2190",select_helper:"(select helper)"},sync_entity_options:{yamp_entity:"yamp_entity (Music Assistant Entity if configured)",yamp_main_entity:"yamp_main_entity (Main Media Player Entity)",yamp_playback_entity:"yamp_playback_entity (Current Active Playback Entity)"},placements:{chip:"Action Chip",menu:"In Menu",hidden:"Hidden (Artwork Tap)",not_triggerable:"Not Triggerable"},triggers:{none:"None",tap:"Tap",hold:"Hold",double_tap:"Double Tap",swipe_left:"Swipe Left",swipe_right:"Swipe Right"},search_view_options:{list:"List",card:"Card",card_minimal:"Minimal Card"},card_type_options:{default:"Default",search:"Search",group_players:"Group Players"},appearance_options:{automatic:"Automatic",light:"Light",dark:"Dark"},artwork_fit:{default:"Default",cover:"Cover (default)",contain:"Contain",fill:"Fill","scale-down":"Scale Down","scaled-contain":"Scaled Contain","scaled-contain-alternate":"Scaled Contain Alternate",none:"None"}},card:{sections:{details:"Now Playing Details",menu:"Menu & Search Sheets",action_chips:"Action Chips"},media_controls:{shuffle:"Shuffle",previous:"Previous",play_pause:"Play/Pause",stop:"Stop",next:"Next",repeat:"Repeat"},menu:{more_info:"More Info",search:"Search",source:"Source",show_lyrics:"Show Lyrics",hide_lyrics:"Hide Lyrics",transfer_queue:"Transfer Queue",group_players:"Group Players",select_entity:"Select Entity for More Info",transfer_to:"Transfer Queue To",no_players:"No other Music Assistant players available."},grouping:{title:"Group Players",sync_volume:"Sync Volume",group_all:"Group All",ungroup_all:"Ungroup All",unavailable:"Player is unavailable",no_players:"No other group-capable players available.",master:"Master",joined:"Joined",available:"Available",current:"Current",unjoin_from:"Unjoin from {master}",join_with:"Join with {master}"}},search:{favorites:"Favorites",recently_played:"Recently Played",next_up:"Next Up",recommendations:"Recommendations",radio_mode:"Radio Mode",play_similar:"Play similar songs",close:"Close Search",no_results:"No results.",play_next:"Play next",replace_play:"Replace existing queue and play now",replace:"Replace queue",add_queue:"Add to the end of the queue",move_up:"Move Up",move_down:"Move Down",move_next:"Move to Next",remove:"Remove from Queue",added:"Added to queue!",added_to_playlist:"Added to playlist!",select_playlist:"Select Playlist for '{track}'",add_to_playlist:"Add to playlist",select_track_for_playlist:"Select the track to add for '{track}' by {artist}",labels:{replace:"Replace",next:"Next",replace_next:"Replace Next",add:"Add",add_to_playlist:"Add to Playlist"},results:"results",result:"result",filters:{all:"All",artist:"Artist",album:"Album",track:"Track",playlist:"Playlist",radio:"Radio",music:"Music",station:"Station",podcast:"Podcast",audiobook:"Audiobook"},search_artist:"Search for this artist",browse_album:"Browse tracks from {album}",play_collection:"Play this collection",play_collection_error:"Unable to play this collection directly",play_item:"Play {item}"},lyrics:{finding:"Finding Lyrics...",none_found:"No lyrics found",not_available:"Lyrics not available",instrumental:"Instrumental Track"},lyrics_sources:{mass_lrclib:"Music Assistant (Fallback to LRCLIB)",mass:"Music Assistant Only",lrclib:"LRCLIB Only",lrclib_mass:"LRCLIB (Fallback to Music Assistant)"},lyrics_modes:{default:"Default (Highlight & Scroll)",scroll:"Scroll Only",text:"Text Only"}},xo={common:{not_found:"Entit\xE4t nicht gefunden.",search:"Suchen",power:"Ein/Aus",favorite:"Favorit",loading:"Laden...",no_results:"Keine Ergebnisse.",close:"Schlie\xDFen",vol_up:"Lauter",vol_down:"Leiser",media_player:"Mediaplayer",edit_entity:"Entit\xE4tseinstellungen bearbeiten",edit_action:"Aktionseinstellungen bearbeiten",mute:"Stumm",unmute:"Stummschaltung aufheben",seek:"Suchen",volume:"Lautst\xE4rke",play_now:"Jetzt abspielen",more_options:"Weitere Optionen",unavailable:"Nicht verf\xFCgbar",back:"Zur\xFCck",cancel:"Abbrechen",reset_default:"Auf Standard zur\xFCcksetzen"},editor:{tabs:{entities:"Entit\xE4ten",behavior:"Verhalten",look_and_feel:"Design",artwork:"Artwork",actions:"Aktionen"},placeholders:{search:"Musik suchen..."},sections:{artwork:{general:{title:"Allgemeine Einstellungen",description:"Globale Steuerung der Artwork-Anzeige und -Abrufung."},idle:{title:"Artwork im Leerlauf",description:"Zeigt ein statisches Bild oder einen Entit\xE4ts-Schnappschuss an, wenn nichts abgespielt wird."},overrides:{title:"Artwork-\xDCberschreibungen",description:"\xDCberschreibungen werden von oben nach unten ausgewertet. Zum Neusortieren ziehen."}},entities:{title:"Entit\xE4ten*",description:"F\xFCgen Sie die zu steuernden Mediaplayer hinzu. Entit\xE4ten ziehen, um sie neu anzuordnen."},behavior:{idle_chips:{title:"Leerlauf & Chips",description:"W\xE4hlen Sie, wann die Karte in den Leerlauf wechselt und wie sich Entit\xE4ts-Chips verhalten."},interactions_search:{title:"Interaktionen & Suche",description:"Feineinstellung des Anpinnens von Entit\xE4ten und der Anzahl der Suchergebnisse."},lyrics:{title:"Liedtexte",description:"Konfigurieren Sie, wie Liedtexte angezeigt werden und wann sie erscheinen."}},look_and_feel:{theme_layout:{title:"Theme & Layout",description:"Anpassung an das Dashboard-Styling und Kontrolle des Platzbedarfs."},controls_typography:{title:"Steuerung & Typografie",description:"Anpassung von Schaltfl\xE4chengr\xF6\xDFe, Entit\xE4ts-Labels und adaptivem Text."},collapsed_idle:{title:"Eingeklappte & Leerlaufzust\xE4nde",description:"Steuerung der Karteneinklappung und der Ansichten im Leerlauf."}},actions:{title:"Aktionen",description:"Erstellen Sie Aktions-Chips f\xFCr die Karte oder das Men\xFC. Ziehen zum Sortieren, Stift zum Konfigurieren anklicken."}},subtitles:{idle_timeout:"Zeit in Millisekunden vor dem Wechsel in den Leerlaufmodus. 0 zum Deaktivieren.",show_chip_row:'"Auto" blendet die Chip-Leiste bei nur einer Entit\xE4t aus. "Im Men\xFC" verschiebt sie ins Men\xFC. "Im Men\xFC bei Inaktivit\xE4t" zeigt Chips inline wenn aktiv, verschiebt sie aber ins Men\xFC bei Inaktivit\xE4t.',dim_chips:"Entit\xE4ts- und Aktions-Chips im Leerlauf mit Bild abdunkeln f\xFCr einen sauberen Look.",hold_to_pin:"Langes Dr\xFCcken statt kurzem Dr\xFCcken zum Anpinnen, um automatisches Umschalten zu verhindern.",always_show_group:"Schnellgruppierungs-Steuerelemente (+/-/Stern) sind standardm\xE4\xDFig beim Laden der Seite sichtbar. Sie k\xF6nnen sie weiterhin manuell per Doppeltipp umschalten.",disable_autofocus:"Suchfeld-Autofokus deaktivieren, damit Bildschirmtastaturen ausgeblendet bleiben.",search_within_filter:"Innerhalb des aktiven Filters suchen (Favoriten, etc.), anstatt ihn zu l\xF6schen.",close_search_on_play:"Suchbildschirm beim Abspielen automatisch schlie\xDFen.",pin_search_headers:"Sucheingabe und Filter beim Scrollen oben fixieren.",hide_search_headers_on_idle:"Sucheingabe und Filter im Leerlauf ausblenden.",disable_mass:"Optionale Mass Queue Integration deaktivieren, auch wenn sie installiert ist.",swap_pause_stop:"Pause-Taste durch Stop-Taste im modernen Layout ersetzen.",adaptive_controls:"Wiedergabetasten an verf\xFCgbaren Platz anpassen.",hide_menu_player:"Entit\xE4ts-Label unten ausblenden, wenn Chips im Men\xFC sind.",adaptive_text:"Textgruppen w\xE4hlen, die mit dem Platz skalieren (leer lassen zum Deaktivieren).",collapse_expand:"Immer eingeklappt aktiviert den Mini-Player-Modus. Bei Suche ausklappen aktiviert ihn tempor\xE4r.",idle_screen:"W\xE4hlen Sie, welcher Bildschirm im Leerlauf automatisch angezeigt wird.",hide_controls:"W\xE4hlen Sie Steuerelemente aus, die f\xFCr diese Entit\xE4t ausgeblendet werden sollen.",hide_search_chips:"Bestimmte Suchfilter-Chips f\xFCr diese Entit\xE4t ausblenden.",follow_active_entity:"Lautst\xE4rke-Entit\xE4t folgt automatisch der aktiven Wiedergabe-Entit\xE4t.",search_limit_full:"Maximale Anzahl an Suchergebnissen (1-1000, Standard: 20).",default_search_filter_full:"W\xE4hlen Sie den Filter, der beim \xD6ffnen der Suche standardm\xE4\xDFig aktiv ist.",default_search_favorites:"Suche mit aktiven Favoriten starten",result_sorting_full:"Sortierung der Suchergebnisse w\xE4hlen. Standard beh\xE4lt die Quellreihenfolge bei.",card_height_full:"Leer lassen f\xFCr automatische H\xF6he.",control_layout_full:"W\xE4hlen Sie zwischen manuellem oder modernem Home Assistant Layout.",artwork_extend:"Artwork-Hintergrund unter die Chip- und Aktionsleisten erweitern.",artwork_extend_label:"Artwork erweitern",no_artwork_overrides:"Keine Artwork-\xDCberschreibungen konfiguriert.",entity_current_hint:"'entity_id: current' verwenden, um den aktuell ausgew\xE4hlten Mediaplayer anzusteuern.",service_data_note:"\xC4nderungen an den Servicedaten werden erst beim Klicken auf 'Servicedaten speichern' \xFCbernommen!",jinja_template_hint:"Jinja-Template eingeben, das eine entity_id ergibt.",jinja_template_vol_hint:"Jinja-Template eingeben, das eine Lautst\xE4rke-entity_id ergibt.",not_available_alt_collapsed:"Nicht verf\xFCgbar mit alternativem Fortschrittsbalken oder im Modus 'Immer eingeklappt'.",not_available_collapsed:"Nicht verf\xFCgbar, wenn 'Immer eingeklappt' aktiviert ist.",only_available_collapsed:"Nur verf\xFCgbar, wenn 'Immer eingeklappt' aktiviert ist.",only_available_modern:"Nur verf\xFCgbar im modernen Layout.",image_url_helper:"Direkte Bild-URL oder lokalen Dateipfad eingeben.",selected_entity_helper:"Input-Text-Helper, der mit der aktuell ausgew\xE4hlten Mediaplayer-Entit\xE4ts-ID aktualisiert wird.",select_entity_helper:"Input-Text-Helper, aus dem die Entit\xE4ts-ID gelesen wird. Die Karte w\xE4hlt automatisch den passenden Chip aus.",sync_entity_type:"W\xE4hlen Sie, welche Entit\xE4ts-ID mit dem Helper synchronisiert werden soll (Standard: Music Assistant Entit\xE4t, falls konfiguriert).",disable_auto_select:"Verhindert, dass der Chip dieser Entit\xE4t automatisch ausgew\xE4hlt wird, wenn die Wiedergabe startet.",search_view:"W\xE4hlen Sie zwischen einer Standardliste oder einem kartenbasierten Raster f\xFCr Suchergebnisse.",search_card_columns:"Geben Sie an, wie viele Spalten in der Kartenansicht verwendet werden sollen. Das Artwork wird automatisch skaliert.",card_type:"W\xE4hlen Sie den Kartenmodus. 'Standard' ist der normale Mediaplayer. 'Dedizierte Suche' macht die Karte zu einer permanenten Suchoberfl\xE4che.",always_show_lyrics:"Liedtextansicht bei Seitenaktualisierung automatisch \xF6ffnen.",lyrics_pre_roll:"Passen Sie das Timing der Songtext-Hervorhebung an. Positive Werte beschleunigen sie, negative verz\xF6gern sie (Standard: 0)."},titles:{edit_entity:"Entit\xE4t bearbeiten",edit_action:"Aktion bearbeiten",service_data:"Servicedaten",add_artwork_override:"Artwork-\xDCberschreibung hinzuf\xFCgen"},labels:{dim_chips:"Chips im Leerlauf abdunkeln",hold_to_pin:"Gedr\xFCckt halten zum Anpinnen",always_show_group:"Schnellgruppierung standardm\xE4\xDFig aktivieren",disable_autofocus:"Such-Autofocus deaktivieren",keep_filters:"Filter bei Suche beibehalten",dismiss_on_play:"Suche beim Abspielen beenden",default_search_filter:"Standard-Suchfilter",default_search_favorites:"Standardm\xE4\xDFig Favoritenfilter verwenden",pin_headers:"Such-Header fixieren",hide_search_headers_on_idle:"Such-Header im Leerlauf ausblenden",disable_mass:"Mass Queue deaktivieren",match_theme:"Theme anpassen",alt_progress:"Alternativer Fortschrittsbalken",display_timestamps:"Zeitstempel anzeigen",swap_pause_stop:"Pause durch Stop ersetzen",adaptive_controls:"Adaptive Tastengr\xF6\xDFe",hide_active_entity:"Aktives Entit\xE4ts-Label ausblenden",collapse_on_idle:"Bei Leerlauf einklappen",hide_menu_player_toggle:"Men\xFC-Player ausblenden",always_collapsed:"Immer eingeklappt",expand_on_search:"Bei Suche ausklappen",script_var:"Skript-Variable (yamp_entity)",use_ma_template:"Template f\xFCr Music Assistant Entit\xE4t verwenden",use_vol_template:"Template f\xFCr Lautst\xE4rke-Entit\xE4t verwenden",follow_active_entity:"Lautst\xE4rke folgt aktiver Entit\xE4t",use_url_path:"URL oder Pfad verwenden",adaptive_text_elements:"Elemente f\xFCr adaptive Textgr\xF6\xDFe",disable_auto_select:"Auto-Auswahl deaktivieren",always_show_lyrics:"Liedtexte immer anzeigen",lyrics_mode:"Liedtext-Modus",lyrics_pre_roll:"Liedtext Pre-Roll (Sekunden)"},fields:{artwork_fit:"Artwork-Anpassung",artwork_position:"Artwork-Position",artwork_hostname:"Artwork-Hostname",match_field:"Match-Feld",match_value:"Match-Wert",size_percent:"Gr\xF6\xDFe (%)",object_fit:"Object-Fit",idle_timeout:"Leerlauf-Timeout (ms)",show_chip_row:"Chip-Leiste anzeigen",search_limit:"Suchlimit",result_sorting:"Ergebnissortierung",vol_step:"Lautst\xE4rke-Schritt (0.05 = 5%)",card_height:"Kartenh\xF6he (px)",control_layout:"Steuerungs-Layout",save_service_data:"Servicedaten speichern",image_url:"Bild-URL",fallback_image_url:"Fallback Bild-URL",move_to_main:"Aktion in Haupt-Chips verschieben",move_to_menu:"Aktion ins Men\xFC verschieben",delete_action:"Aktion l\xF6schen",revert_service_data:"Auf gespeicherte Servicedaten zur\xFCcksetzen",test_action:"Aktion testen",volume_mode:"Lautst\xE4rke-Modus",idle_screen:"Leerlauf-Bildschirm",name:"Name",hidden_controls:"Ausgeblendete Steuerungen",ma_template:"Music Assistant Entit\xE4ts-Template (Jinja)",hidden_chips:"Ausgeblendete Suchfilter-Chips",vol_template:"Lautst\xE4rke-Entit\xE4ts-Template (Jinja)",icon:"Icon",action_type:"Aktionstyp",menu_item:"Men\xFCpunkt",nav_path:"Navigationspfad",service:"Dienst",service_data:"Servicedaten",idle_image_entity:"Leerlauf-Bild-Entit\xE4t",match_entity:"Match-Entit\xE4t",ma_entity:"Music Assistant Entit\xE4t",vol_entity:"Lautst\xE4rke-Entit\xE4t",selected_entity_helper:"Ausgew\xE4hlter Entit\xE4ts-Helper",sync_entity_type:"Synchronisierungs-Entit\xE4tstyp",placement:"Platzierung",card_trigger:"Karten-Trigger",search_view:"Suchergebnis-Ansicht",search_card_columns:"Spaltenanzahl",card_type:"Kartentyp",no_artwork_option:"Kein Coverbild",details_alignment:"Detail-Ausrichtung"},action_types:{menu:"Kartenmen\xFCpunkt \xF6ffnen",service:"Dienst aufrufen",navigate:"Navigieren",prev_entity:"Vorheriger Entit\xE4ts-Chip",next_entity:"N\xE4chster Entit\xE4ts-Chip",sync_selected_entity:"Ausgew\xE4hlte Entit\xE4t synchronisieren",select_entity:"Entit\xE4t aus Helper ausw\xE4hlen",toggle_lyrics:"Liedtext-Overlay ein-/ausschalten"},action_helpers:{sync_selected_entity:"Entit\xE4t synchronisieren \u2192",select_entity:"Entit\xE4t ausw\xE4hlen \u2190",select_helper:"(Helper ausw\xE4hlen)"},sync_entity_options:{yamp_entity:"yamp_entity (Music Assistant Entit\xE4t, falls konfiguriert)",yamp_main_entity:"yamp_main_entity (Haupt-Mediaplayer-Entit\xE4t)",yamp_playback_entity:"yamp_playback_entity (Aktuelle aktive Wiedergabe-Entit\xE4t)"},placements:{chip:"Aktions-Chip",menu:"Im Men\xFC",hidden:"Ausgeblendet (Artwork-Tippen)",not_triggerable:"Nicht triggerbar"},triggers:{none:"Keiner",tap:"Tippen",hold:"Halten",double_tap:"Doppeltippen",swipe_left:"Nach links wischen",swipe_right:"Nach rechts wischen"},search_view_options:{list:"Liste",card:"Karte",card_minimal:"Minimal-Karte"},card_type_options:{default:"Standard",search:"Suche",group_players:"Player gruppieren"},artwork_fit:{default:"Standard",cover:"Cover (Standard)",contain:"Einpassen",fill:"F\xFCllen","scale-down":"Verkleinern","scaled-contain":"Skaliertes Einpassen","scaled-contain-alternate":"Skaliertes Einpassen (Alternativ)",none:"Keine"}},card:{sections:{details:"Details zur Wiedergabe",menu:"Men\xFC & Suchbl\xE4tter",action_chips:"Aktions-Chips"},media_controls:{shuffle:"Zufall",previous:"Zur\xFCck",play_pause:"Play/Pause",stop:"Stop",next:"Weiter",repeat:"Wiederholen"},menu:{more_info:"Mehr Info",search:"Suche",source:"Quelle",show_lyrics:"Songtext anzeigen",hide_lyrics:"Songtext ausblenden",transfer_queue:"Warteschlange \xFCbertragen",group_players:"Player gruppieren",select_entity:"Entit\xE4t f\xFCr mehr Info w\xE4hlen",transfer_to:"Warteschlange \xFCbertragen zu",no_players:"Keine anderen Music Assistant Player verf\xFCgbar."},grouping:{title:"Player gruppieren",sync_volume:"Lautst\xE4rke synchronisieren",group_all:"Alle gruppieren",ungroup_all:"Alle trennen",unavailable:"Player ist nicht verf\xFCgbar",no_players:"Keine anderen gruppierungsf\xE4higen Player verf\xFCgbar.",master:"Master",joined:"Verbunden",available:"Verf\xFCgbar",current:"Aktuell",unjoin_from:"Von {master} trennen",join_with:"Mit {master} gruppieren"}},search:{favorites:"Favoriten",recently_played:"Zuletzt geh\xF6rt",next_up:"Als N\xE4chstes",recommendations:"Empfehlungen",radio_mode:"Radiomodus",play_similar:"\xC4hnliche Lieder abspielen",close:"Suche schlie\xDFen",no_results:"Keine Ergebnisse.",play_next:"Als N\xE4chstes spielen",replace_play:"Warteschlange ersetzen und jetzt spielen",replace:"Warteschlange ersetzen",add_queue:"Am Ende der Warteschlange hinzuf\xFCgen",move_up:"Nach oben",move_down:"Nach unten",move_next:"Als N\xE4chstes verschieben",remove:"Aus Warteschlange entfernen",added:"Zur Warteschlange hinzugef\xFCgt!",added_to_playlist:"Zur Playlist hinzugef\xFCgt!",select_playlist:"Playlist f\xFCr '{track}' ausw\xE4hlen",add_to_playlist:"Zur Playlist hinzuf\xFCgen",select_track_for_playlist:"Titel zum Hinzuf\xFCgen f\xFCr '{track}' von {artist} ausw\xE4hlen",labels:{replace:"Ersetzen",next:"Weiter",replace_next:"Weiter ersetzen",add:"Hinzuf\xFCgen",add_to_playlist:"Zur Playlist hinzuf\xFCgen"},results:"Ergebnisse",result:"Ergebnis",filters:{all:"Alle",artist:"K\xFCnstler",album:"Album",track:"Titel",playlist:"Playlist",radio:"Radio",music:"Musik",station:"Station",podcast:"Podcast",audiobook:"H\xF6rbuch"},search_artist:"Nach diesem K\xFCnstler suchen",play_collection:"Diese Sammlung abspielen",play_collection_error:"Diese Sammlung kann nicht direkt abgespielt werden",browse_album:"Albentitel von {album} durchsuchen",play_item:"{item} abspielen"},lyrics:{finding:"Suche Songtext...",none_found:"Kein Songtext gefunden",not_available:"Songtext nicht verf\xFCgbar"},lyrics_modes:{default:"Standard (Hervorheben & Scrollen)",scroll:"Nur Scrollen",text:"Nur Text"}},wo={common:{not_found:"Entidad no encontrada.",search:"Buscar",power:"Encender/Apagar",favorite:"Favorito",loading:"Cargando...",no_results:"Sin resultados.",close:"Cerrar",vol_up:"Subir volumen",vol_down:"Bajar volumen",media_player:"Reproductor multimedia",edit_entity:"Editar ajustes de entidad",edit_action:"Editar ajustes de acci\xF3n",mute:"Silenciar",unmute:"Activar sonido",seek:"Buscar",volume:"Volumen",play_now:"Reproducir ahora",more_options:"M\xE1s opciones",unavailable:"No disponible",back:"Atr\xE1s",cancel:"Cancelar",reset_default:"Restablecer valores"},editor:{tabs:{entities:"Entidades",behavior:"Comportamiento",look_and_feel:"Apariencia",artwork:"Portada",actions:"Acciones"},placeholders:{search:"Buscar m\xFAsica..."},sections:{artwork:{general:{title:"Ajustes generales",description:"Controles globales para la portada."},idle:{title:"Portada en reposo",description:"Mostrar imagen est\xE1tica cuando nada se reproduce."},overrides:{title:"Reemplazos de portada",description:"Los reemplazos se eval\xFAan de arriba a abajo. Arrastre para reordenar."}},entities:{title:"Entidades*",description:"A\xF1ada los reproductores multimedia. Arrastre para reordenar."},behavior:{idle_chips:{title:"Reposo y chips",description:"Elija cu\xE1ndo pasa a reposo y el comportamiento de los chips."},interactions_search:{title:"Interacciones y b\xFAsqueda",description:"Ajuste el fijado de entidades y l\xEDmite de resultados."},lyrics:{title:"Letras",description:"Configure c\xF3mo se muestran las letras y cu\xE1ndo aparecen."}},look_and_feel:{theme_layout:{title:"Tema y dise\xF1o",description:"Combine con el estilo de su dashboard."},controls_typography:{title:"Controles y tipograf\xEDa",description:"Ajuste tama\xF1o de botones y etiquetas."},collapsed_idle:{title:"Estados de reposo y contra\xEDdo",description:"Controle el contra\xEDdo de la tarjeta."}},actions:{title:"Acciones",description:"Cree chips de acci\xF3n. Arrastre para reordenar, pulse el l\xE1piz para configurar."}},subtitles:{idle_timeout:"Tiempo antes de reposo (ms). 0 para desactivar.",show_chip_row:'"Auto" oculta la fila si solo hay una entidad. "En men\xFA" mueve los chips. "En men\xFA en reposo" muestra los chips en l\xEDnea cuando est\xE1 activo pero los mueve al men\xFA cuando est\xE1 en reposo.',dim_chips:"Atenuar los chips en reposo para un aspecto m\xE1s limpio.",hold_to_pin:"Mantener pulsado para fijar en vez de pulsaci\xF3n corta.",always_show_group:"Los controles de agrupaci\xF3n r\xE1pida (+/-/estrella) estar\xE1n visibles por defecto al cargar la p\xE1gina. Todav\xEDa puedes cambiarlos manualmente mediante doble pulsaci\xF3n.",disable_autofocus:"Evitar que la b\xFAsqueda tome el foco autom\xE1ticamente.",search_within_filter:"Buscar dentro del filtro activo (Favoritos, etc.).",close_search_on_play:"Cerrar b\xFAsqueda al reproducir.",pin_search_headers:"Fijar encabezados de b\xFAsqueda al hacer scroll.",hide_search_headers_on_idle:"Ocultar encabezados de b\xFAsqueda en inactividad.",disable_mass:"Desactivar integraci\xF3n con Mass Queue.",swap_pause_stop:"Cambiar pausa por stop en dise\xF1o moderno.",adaptive_controls:"Permitir que los botones se adapten al espacio.",hide_menu_player:"Ocultar nombre de entidad cuando est\xE1 en el men\xFA.",adaptive_text:"Elegir qu\xE9 textos se adaptan al espacio.",collapse_expand:"Siempre contra\xEDdo activa el modo mini. Expandir al buscar expande temporalmente.",idle_screen:"Elegir pantalla a mostrar en reposo.",hide_controls:"Seleccionar controles a ocultar.",hide_search_chips:"Ocultar chips de filtro de b\xFAsqueda.",follow_active_entity:"La entidad de volumen seguir\xE1 a la activa.",search_limit_full:"M\xE1ximo de resultados (1-1000, defecto: 20).",default_search_filter_full:"Elige qu\xE9 filtro est\xE1 activo por defecto cuando se abre la pantalla de b\xFAsqueda.",default_search_favorites:"Iniciar b\xFAsqueda con favoritos activos",result_sorting_full:"Elegir orden de resultados.",card_height_full:"Dejar vac\xEDo para altura autom\xE1tica.",control_layout_full:"Elegir entre dise\xF1o antiguo o moderno.",artwork_extend:"Extender portada bajo los chips.",artwork_extend_label:"Extender portada",no_artwork_overrides:"Sin reemplazos de portada configurados.",entity_current_hint:"Use 'entity_id: current' para el reproductor actual.",service_data_note:"Los cambios se guardan al pulsar 'Guardar'.",jinja_template_hint:"Plantilla Jinja para entity_id.",jinja_template_vol_hint:"Plantilla para entidad de volumen.",not_available_alt_collapsed:"No disponible en modo contra\xEDdo.",not_available_collapsed:"No disponible si est\xE1 contra\xEDdo.",only_available_collapsed:"Solo disponible si est\xE1 contra\xEDdo.",only_available_modern:"Solo disponible con dise\xF1o Moderno.",image_url_helper:"Ingrese una URL directa a una imagen o una ruta de archivo local",selected_entity_helper:"Helper de texto de entrada que se actualizar\xE1 con el ID de la entidad del reproductor de medios seleccionado actualmente.",select_entity_helper:"Helper de texto de entrada del que leer el ID de la entidad. La tarjeta seleccionar\xE1 autom\xE1ticamente el chip correspondiente.",sync_entity_type:"Elija qu\xE9 ID de entidad sincronizar con el helper (por defecto la entidad de Music Assistant si est\xE1 configurada).",disable_auto_select:"Evita que el chip de esta entidad se seleccione autom\xE1ticamente cuando comienza la reproducci\xF3n.",search_view:"Elegir entre una lista est\xE1ndar o una cuadr\xEDcula de tarjetas para los resultados de la b\xFAsqueda.",search_card_columns:"Especifica cu\xE1ntas columnas usar en la vista de tarjetas. El artwork se adaptar\xE1 autom\xE1ticamente.",card_type:"Elija el modo de tarjeta. 'Por defecto' es el reproductor de medios est\xE1ndar. 'B\xFAsqueda dedicada' convierte la tarjeta en una interfaz de b\xFAsqueda permanente.",always_show_lyrics:"Abrir autom\xE1ticamente la vista de letras al actualizar la p\xE1gina.",lyrics_pre_roll:"Ajusta el tiempo de resaltado de la letra. Los valores positivos lo aceleran, los negativos lo retrasan (por defecto: 0)."},titles:{edit_entity:"Editar entidad",edit_action:"Editar acci\xF3n",service_data:"Datos del servicio",add_artwork_override:"A\xF1adir reemplazo"},labels:{dim_chips:"Atenuar chips en reposo",hold_to_pin:"Mantener para fijar",always_show_group:"Grupo r\xE1pido por defecto",disable_autofocus:"Desactivar autofoco",keep_filters:"Mantener filtros",dismiss_on_play:"Cerrar al reproducir",default_search_filter:"Filtro de b\xFAsqueda predeterminado",default_search_favorites:"Filtro de favoritos por defecto",pin_headers:"Fijar encabezados",hide_search_headers_on_idle:"Ocultar encabezados en inactividad",disable_mass:"Desactivar Mass Queue",match_theme:"Seguir tema",alt_progress:"Barra de progreso alternativa",display_timestamps:"Mostrar sellos de tiempo",swap_pause_stop:"Cambiar Pausa por Stop",adaptive_controls:"Tama\xF1o adaptativo",hide_active_entity:"Ocultar nombre de entidad activa",collapse_on_idle:"Contraer en reposo",hide_menu_player_toggle:"Ocultar reproductor del men\xFA",always_collapsed:"Siempre contra\xEDdo",expand_on_search:"Expandir al buscar",script_var:"Variable script (yamp_entity)",use_ma_template:"Usar plantilla MA",use_vol_template:"Usar plantilla Volumen",follow_active_entity:"Volumen sigue a entidad activa",use_url_path:"Usar URL o ruta",adaptive_text_elements:"Elementos para tama\xF1o de texto adaptativo",disable_auto_select:"Desactivar selecci\xF3n autom\xE1tica",always_show_lyrics:"Mostrar siempre las letras",lyrics_mode:"Modo de letras",lyrics_pre_roll:"Anticipo de letra (segundos)",card_type:"Tipo de tarjeta",no_artwork_option:"Sin imagen de portada"},fields:{artwork_fit:"Ajuste",artwork_position:"Posici\xF3n",artwork_hostname:"Host",match_field:"Campo",match_value:"Valor",size_percent:"Tama\xF1o (%)",object_fit:"Object Fit",idle_timeout:"Reposo (ms)",show_chip_row:"Mostrar chips",search_limit:"L\xEDmite de b\xFAsqueda",result_sorting:"Orden",vol_step:"Paso de volumen",card_height:"Altura (px)",control_layout:"Dise\xF1o",save_service_data:"Guardar",image_url:"URL imagen",fallback_image_url:"URL de respaldo",move_to_main:"Mover a chips principales",move_to_menu:"Mover al men\xFA",delete_action:"Borrar acci\xF3n",revert_service_data:"Deshacer cambios",test_action:"Probar acci\xF3n",volume_mode:"Modo volumen",idle_screen:"Pantalla reposo",name:"Nombre",hidden_controls:"Controles ocultos",ma_template:"Plantilla MA (Jinja)",hidden_chips:"Chips ocultos",vol_template:"Plantilla Volumen (Jinja)",icon:"Icono",action_type:"Tipo de acci\xF3n",menu_item:"Elemento de men\xFA",nav_path:"Ruta",service:"Servicio",service_data:"Datos",idle_image_entity:"Entidad imagen reposo",match_entity:"Entidad",ma_entity:"Entidad de Music Assistant",vol_entity:"Entidad de volumen",selected_entity_helper:"Helper de entidad seleccionada",sync_entity_type:"Tipo de entidad a sincronizar",placement:"Colocaci\xF3n",card_trigger:"Activador de la tarjeta",search_view:"Vista de resultados de b\xFAsqueda",search_card_columns:"Columnas de tarjetas",details_alignment:"Alineaci\xF3n de detalles"},action_types:{menu:"Abrir un elemento del men\xFA",service:"Llamar a un servicio",navigate:"Navegar",prev_entity:"Chip de entidad anterior",next_entity:"Chip de entidad siguiente",sync_selected_entity:"Sincronizar entidad seleccionada",select_entity:"Seleccionar entidad desde helper",toggle_lyrics:"Alternar superposici\xF3n de letras"},action_helpers:{sync_selected_entity:"Sincronizar entidad seleccionada \u2192",select_entity:"Seleccionar entidad \u2190",select_helper:"(seleccionar helper)"},sync_entity_options:{yamp_entity:"yamp_entity (Entidad de Music Assistant si est\xE1 configurada)",yamp_main_entity:"yamp_main_entity (Entidad principal del reproductor)",yamp_playback_entity:"yamp_playback_entity (Entidad de reproducci\xF3n activa actual)"},placements:{chip:"Chip de acci\xF3n",menu:"En el men\xFA",hidden:"Oculto (Toque en el arte)",not_triggerable:"No activable"},triggers:{none:"Ninguno",tap:"Toque",hold:"Mantener",double_tap:"Doble toque",swipe_left:"Deslizar a la izquierda",swipe_right:"Deslizar a la derecha"},search_view_options:{list:"Lista",card:"Tarjeta",card_minimal:"Tarjeta reducida"},card_type_options:{default:"Por defecto",search:"Buscar",group_players:"Agrupar"},artwork_fit:{default:"Por defecto",cover:"Portada (por defecto)",contain:"Contener",fill:"Rellenar","scale-down":"Reducir","scaled-contain":"Contenido escalado","scaled-contain-alternate":"Contenido escalado alternativo",none:"Ninguno"}},card:{sections:{details:"Detalles de reproducci\xF3n",menu:"Men\xFA y B\xFAsqueda",action_chips:"Chips de acci\xF3n"},media_controls:{shuffle:"Aleatorio",previous:"Anterior",play_pause:"Reproducir/Pausa",stop:"Detener",next:"Siguiente",repeat:"Repetir"},menu:{more_info:"M\xE1s info",search:"Buscar",source:"Fuente",show_lyrics:"Mostrar letra",hide_lyrics:"Ocultar letra",transfer_queue:"Transferir cola",group_players:"Agrupar",select_entity:"Seleccionar",transfer_to:"Transferir a",no_players:"Sin reproductores MA."},grouping:{title:"Agrupar",sync_volume:"Sincronizar volumen",group_all:"Agrupar todos",ungroup_all:"Desagrupar todos",unavailable:"No disponible",no_players:"No agrupable.",master:"Maestro",joined:"Unido",available:"Disponible",current:"Actual",unjoin_from:"Desvincular de {master}",join_with:"Unirse a {master}"}},search:{favorites:"Favoritos",recently_played:"Reciente",next_up:"A continuaci\xF3n",recommendations:"Recomendaciones",radio_mode:"Modo Radio",play_similar:"Reproducir canciones similares",close:"Cerrar",no_results:"Sin resultados.",play_next:"Reprod. siguiente",replace_play:"Reemplazar y reproducir",replace:"Reemplazar cola",add_queue:"A\xF1adir al final",move_up:"Subir",move_down:"Bajar",move_next:"Pasar a siguiente",remove:"Quitar de cola",added:"\xA1A\xF1adido!",added_to_playlist:"\xA1A\xF1adido a la lista de reproducci\xF3n!",select_playlist:"Seleccionar lista de reproducci\xF3n para '{track}'",add_to_playlist:"A\xF1adir a la lista de reproducci\xF3n",select_track_for_playlist:"Seleccionar la canci\xF3n a a\xF1adir para '{track}' de {artist}",labels:{replace:"Remplazar",next:"Siguiente",replace_next:"Rempl. Sig.",add:"A\xF1adir",add_to_playlist:"A\xF1adir a la lista de reproducci\xF3n"},results:"resultados",result:"resultado",filters:{all:"Todo",artist:"Artista",album:"\xC1lbum",track:"Canci\xF3n",playlist:"Lista",radio:"Radio",music:"M\xFAsica",station:"Emisora",podcast:"P\xF3dcast",audiobook:"Audiolibro"},search_artist:"Buscar este artista",play_collection:"Reproducir esta colecci\xF3n",play_collection_error:"No se puede reproducir esta colecci\xF3n directamente",browse_album:"Explorar pistas de {album}",play_item:"Reproducir {item}"},lyrics:{finding:"Buscando letra...",none_found:"No se encontr\xF3 letra",not_available:"Letra no disponible"},lyrics_modes:{default:"Predeterminado (Resaltar y desplazarse)",scroll:"Solo desplazarse",text:"Solo texto"}},ko={common:{not_found:"Entit\xE9 non trouv\xE9e.",search:"Rechercher",power:"Alimentation",favorite:"Favori",loading:"Chargement...",no_results:"Aucun r\xE9sultat.",close:"Fermer",vol_up:"Monter le volume",vol_down:"Baisser le volume",media_player:"Lecteur Multim\xE9dia",edit_entity:"Modifier les param\xE8tres de l'entit\xE9",edit_action:"Modifier les param\xE8tres de l'action",mute:"Muet",unmute:"R\xE9tablir le son",seek:"Rechercher",volume:"Volume",play_now:"Lire maintenant",more_options:"Plus d'options",unavailable:"Indisponible",back:"Retour",cancel:"Annuler",reset_default:"R\xE9initialiser"},editor:{tabs:{entities:"Entit\xE9s",behavior:"Comportement",look_and_feel:"Apparence",artwork:"Illustrations",actions:"Actions"},placeholders:{search:"Rechercher de la musique..."},sections:{artwork:{general:{title:"Param\xE8tres G\xE9n\xE9raux",description:"Contr\xF4les globaux pour l'affichage des illustrations."},idle:{title:"Illustration au Repos",description:"Afficher une image statique lorsque rien n'est en lecture."},overrides:{title:"Remplacements d'Illustrations",description:"Les remplacements sont \xE9valu\xE9s de haut en bas. Glissez pour r\xE9ordonner."}},entities:{title:"Entit\xE9s*",description:"Ajoutez les lecteurs multim\xE9dias que vous souhaitez contr\xF4ler. Glissez pour r\xE9ordonner."},behavior:{idle_chips:{title:"Veille & Jetons",description:"Choisissez quand la carte passe en mode veille et comment les jetons se comportent."},interactions_search:{title:"Interactions & Recherche",description:"Affinez la fa\xE7on dont les entit\xE9s sont \xE9pingl\xE9es et le nombre de r\xE9sultats."},lyrics:{title:"Paroles",description:"Configurez la fa\xE7on dont les paroles sont affich\xE9es et quand elles apparaissent."}},look_and_feel:{theme_layout:{title:"Th\xE8me & Mise en page",description:"Adaptez au style de votre tableau de bord et contr\xF4lez l'empreinte globale."},controls_typography:{title:"Commandes & Typographie",description:"Ajustez la taille des boutons, les \xE9tiquettes et le texte adaptatif."},collapsed_idle:{title:"\xC9tats R\xE9duits & Veille",description:"Contr\xF4lez quand la carte se r\xE9duit et quelles vues s'affichent en veille."}},actions:{title:"Actions",description:"Cr\xE9ez les jetons d'action. Glissez pour r\xE9ordonner, cliquez sur le crayon pour configurer."}},subtitles:{idle_timeout:"Temps en millisecondes avant la mise en veille. 0 pour d\xE9sactiver.",show_chip_row:'"Auto" masque la barre de jetons si une seule entit\xE9 est configur\xE9e. "Dans le Menu" d\xE9place les jetons. "Dans le menu au repos" affiche les jetons en ligne lorsque actif mais les d\xE9place dans le menu au repos.',dim_chips:"Assombrir les jetons en mode veille pour un look plus \xE9pur\xE9.",hold_to_pin:"Appui long pour \xE9pingler au lieu d'un appui court.",always_show_group:"Les contr\xF4les de groupement rapide (+/-/\xE9toile) seront visibles par d\xE9faut au chargement de la page. Vous pouvez toujours les basculer manuellement via un double appui.",disable_autofocus:"Emp\xEAcher la recherche de prendre le focus automatiquement.",search_within_filter:"Rechercher dans le filtre actif actuel (Favoris, etc.).",close_search_on_play:"Fermer automatiquement la recherche \xE0 la lecture.",pin_search_headers:"Garder la recherche et les filtres fixes en haut.",hide_search_headers_on_idle:"Masquer la recherche et les filtres en mode veille.",disable_mass:"D\xE9sactiver l'int\xE9gration Mass Queue.",swap_pause_stop:"Remplacer le bouton pause par stop en mode moderne.",adaptive_controls:"Laisser les boutons s'adapter \xE0 l'espace disponible.",hide_menu_player:"Masquer l'\xE9tiquette de l'entit\xE9 en bas quand les jetons sont dans le menu.",adaptive_text:"Choisir quels textes doivent s'adapter \xE0 l'espace.",collapse_expand:"Toujours r\xE9duit cr\xE9e un mini lecteur. Agrandir \xE0 la Recherche agrandit temporairement.",idle_screen:"Choisir l'\xE9cran \xE0 afficher automatiquement en veille.",hide_controls:"S\xE9lectionner les commandes \xE0 masquer pour cette entit\xE9.",hide_search_chips:"Masquer des jetons de filtrage sp\xE9cifiques.",follow_active_entity:"L'entit\xE9 de volume suivra automatiquement l'entit\xE9 active.",search_limit_full:"Nombre maximum de r\xE9sultats (1-1000, d\xE9faut: 20).",default_search_filter_full:"Choisissez quel filtre est actif par d\xE9faut \xE0 l'ouverture de la recherche.",default_search_favorites:"D\xE9marrer la recherche avec les favoris actifs",result_sorting_full:"Choisir l'ordre des r\xE9sultats. Par d\xE9faut conserve l'ordre source.",card_height_full:"Laisser vide pour une hauteur automatique.",control_layout_full:"Choisir entre l'ancienne mise en page ou la moderne.",artwork_extend:"\xC9tendre l'illustration sous les lignes de jetons.",artwork_extend_label:"\xC9tendre l'illustration",no_artwork_overrides:"Aucun remplacement d'illustration configur\xE9.",entity_current_hint:"Utilisez 'entity_id: current' pour cibler le lecteur actuel.",service_data_note:"Les changements ne sont enregistr\xE9s qu'en cliquant sur 'Enregistrer'.",jinja_template_hint:"Entrez un mod\xE8le Jinja qui renvoie un entity_id.",jinja_template_vol_hint:"Mod\xE8le pour l'entit\xE9 de volume.",not_available_alt_collapsed:"Non disponible en mode 'Toujours r\xE9duit'.",not_available_collapsed:"Non disponible si 'Toujours r\xE9duit' est activ\xE9.",only_available_collapsed:"Uniquement disponible si 'Toujours r\xE9duit' est activ\xE9.",only_available_modern:"Uniquement disponible avec la mise en page Moderne.",image_url_helper:"Entrez une URL directe vers une image ou un chemin de fichier local",selected_entity_helper:"Helper de texte d'entr\xE9e qui sera mis \xE0 jour avec l'ID de l'entit\xE9 du lecteur multim\xE9dia actuellement s\xE9lectionn\xE9.",select_entity_helper:"Helper de texte d'entr\xE9e \xE0 partir duquel lire l'ID de l'entit\xE9. La carte s\xE9lectionnera automatiquement le jeton correspondant.",sync_entity_type:"Choisissez quel ID d'entit\xE9 synchroniser avec le helper (par d\xE9faut l'entit\xE9 Music Assistant si configur\xE9e).",disable_auto_select:"Emp\xEAche le jeton de cette entit\xE9 d'\xEAtre automatiquement s\xE9lectionn\xE9 au d\xE9but de la lecture.",search_view:"Choisissez entre une liste standard ou une grille de cartes pour les r\xE9sultats de recherche.",search_card_columns:"Sp\xE9cifiez le nombre de colonnes \xE0 utiliser dans la vue carte. L'illustration s'adaptera automatiquement.",card_type:"Choisissez le mode de la carte. 'Par d\xE9faut' est le lecteur multim\xE9dia standard. 'Recherche d\xE9di\xE9e' fait de la carte une interface de recherche permanente.",always_show_lyrics:"Ouvrir automatiquement la vue des paroles lors du rafra\xEEchissement de la page.",lyrics_pre_roll:"Ajuste le timing de mise en \xE9vidence des paroles. Les valeurs positives l'acc\xE9l\xE8rent, les n\xE9gatives le ralentissent (par d\xE9faut : 0)."},titles:{edit_entity:"Modifier l'entit\xE9",edit_action:"Modifier l'action",service_data:"Donn\xE9es du service",add_artwork_override:"Ajouter un remplacement"},labels:{dim_chips:"Assombrir les jetons en veille",hold_to_pin:"Maintenir pour \xE9pingler",always_show_group:"Groupe rapide par d\xE9faut",disable_autofocus:"D\xE9sactiver l'autofocus",keep_filters:"Garder les filtres",dismiss_on_play:"Fermer en lecture",default_search_filter:"Filtre de recherche par d\xE9faut",default_search_favorites:"Filtre des favoris par d\xE9faut",pin_headers:"\xC9pingler les en-t\xEAtes",hide_search_headers_on_idle:"Masquer les en-t\xEAtes en veille",disable_mass:"D\xE9sactiver Mass Queue",match_theme:"Suivre le th\xE8me",alt_progress:"Barre de progression alternative",display_timestamps:"Afficher les horodatages",swap_pause_stop:"Remplacer Pause par Stop",adaptive_controls:"Taille adaptative",hide_active_entity:"Masquer l'\xE9tiquette active",collapse_on_idle:"R\xE9duire en veille",hide_menu_player_toggle:"Masquer le lecteur menu",always_collapsed:"Toujours r\xE9duit",expand_on_search:"Agrandir en recherche",script_var:"Variable script (yamp_entity)",use_ma_template:"Utiliser mod\xE8le MA",use_vol_template:"Utiliser mod\xE8le Volume",follow_active_entity:"Le volume suit l'entit\xE9 active",use_url_path:"Utiliser URL ou chemin",adaptive_text_elements:"\xC9l\xE9ments de texte adaptatif",disable_auto_select:"D\xE9sactiver la s\xE9lection automatique",always_show_lyrics:"Toujours afficher les paroles",lyrics_mode:"Mode des paroles",lyrics_pre_roll:"Pr\xE9-roll des paroles (secondes)"},fields:{artwork_fit:"Ajustement",artwork_position:"Position",artwork_hostname:"H\xF4te",match_field:"Champ de correspondance",match_value:"Valeur de correspondance",size_percent:"Taille (%)",object_fit:"Object Fit",idle_timeout:"Veille (ms)",show_chip_row:"Afficher les jetons",search_limit:"Limite de r\xE9sultats",result_sorting:"Tri des r\xE9sultats",vol_step:"Pas du volume",card_height:"Hauteur (px)",control_layout:"Mise en page",save_service_data:"Enregistrer",image_url:"URL image",fallback_image_url:"URL de secours",move_to_main:"Mettre dans les jetons principaux",move_to_menu:"Mettre dans le menu",delete_action:"Supprimer l'action",revert_service_data:"Annuler les changements",test_action:"Tester l'action",volume_mode:"Mode volume",idle_screen:"\xC9cran de veille",name:"Nom",hidden_controls:"Commandes masqu\xE9es",ma_template:"Mod\xE8le MA (Jinja)",hidden_chips:"Jetons masqu\xE9s",vol_template:"Mod\xE8le Volume (Jinja)",icon:"Ic\xF4ne",action_type:"Type d'action",menu_item:"\xC9l\xE9ment du menu",nav_path:"Chemin navigation",service:"Service",service_data:"Donn\xE9es",idle_image_entity:"Entit\xE9 image veille",match_entity:"Entit\xE9 de correspondance",ma_entity:"Entit\xE9 Music Assistant",vol_entity:"Entit\xE9 de volume",selected_entity_helper:"Helper d'entit\xE9 s\xE9lectionn\xE9e",sync_entity_type:"Type d'entit\xE9 \xE0 synchroniser",placement:"Placement",card_trigger:"D\xE9clencheur de carte",search_view:"Vue des r\xE9sultats de recherche",search_card_columns:"Nombre de colonnes",card_type:"Type de carte",no_artwork_option:"Pas d'image de couverture",details_alignment:"Alignement des d\xE9tails"},action_types:{menu:"Ouvrir un \xE9l\xE9ment de menu",service:"Appeler un service",navigate:"Naviguer",prev_entity:"Puce de l'entit\xE9 pr\xE9c\xE9dente",next_entity:"Puce de l'entit\xE9 suivante",sync_selected_entity:"Synchroniser l'entit\xE9 s\xE9lectionn\xE9e",select_entity:"S\xE9lectionner l'entit\xE9 depuis le helper",toggle_lyrics:"Activer/D\xE9sactiver la superposition des paroles"},action_helpers:{sync_selected_entity:"Synchroniser l'entit\xE9 s\xE9lectionn\xE9e \u2192",select_entity:"S\xE9lectionner l'entit\xE9 \u2190",select_helper:"(s\xE9lectionner helper)"},sync_entity_options:{yamp_entity:"yamp_entity (Entit\xE9 Music Assistant si configur\xE9e)",yamp_main_entity:"yamp_main_entity (Entit\xE9 principale du lecteur)",yamp_playback_entity:"yamp_playback_entity (Entit\xE9 de lecture active actuelle)"},placements:{chip:"Puce d'action",menu:"Dans le menu",hidden:"Masqu\xE9 (Appui sur l'image)",not_triggerable:"Non d\xE9clenchable"},triggers:{none:"Aucun",tap:"Appui",hold:"Maintenir",double_tap:"Double appui",swipe_left:"Glisser vers la gauche",swipe_right:"Glisser vers la droite"},search_view_options:{list:"Liste",card:"Carte",card_minimal:"Carte minimale"},card_type_options:{default:"Par d\xE9faut",search:"Rechercher",group_players:"Grouper les lecteurs"},artwork_fit:{default:"Par d\xE9faut",cover:"Couverture (par d\xE9faut)",contain:"Contenir",fill:"Remplir","scale-down":"R\xE9duire","scaled-contain":"Contenir mis \xE0 l'\xE9chelle","scaled-contain-alternate":"Contenir mis \xE0 l'\xE9chelle alternatif",none:"Aucun"}},card:{sections:{details:"D\xE9tails lecture",menu:"Menu & Recherche",action_chips:"Jetons d'action"},media_controls:{shuffle:"Al\xE9atoire",previous:"Pr\xE9c\xE9dent",play_pause:"Lecture/Pause",stop:"Arr\xEAt",next:"Suivant",repeat:"R\xE9p\xE9ter"},menu:{more_info:"Plus d'infos",search:"Rechercher",source:"Source",show_lyrics:"Afficher les paroles",hide_lyrics:"Masquer les paroles",transfer_queue:"Transf\xE9rer la file",group_players:"Grouper les lecteurs",select_entity:"Choisir pour plus d'infos",transfer_to:"Transf\xE9rer vers",no_players:"Aucun lecteur MA disponible."},grouping:{title:"Grouper les lecteurs",sync_volume:"Synchroniser volume",group_all:"Grouper tout",ungroup_all:"D\xE9grouper tout",unavailable:"Lecteur indisponible",no_players:"Aucun lecteur groupable.",master:"Ma\xEEtre",joined:"Li\xE9",available:"Disponible",current:"Actuel",unjoin_from:"Se d\xE9solidariser de {master}",join_with:"Se joindre \xE0 {master}"}},search:{favorites:"Favoris",recently_played:"R\xE9cemment lus",next_up:"\xC0 suivre",recommendations:"Recommandations",radio_mode:"Mode Radio",play_similar:"Lire des chansons similaires",close:"Fermer la recherche",no_results:"Aucun r\xE9sultat.",play_next:"Lire apr\xE8s",replace_play:"Remplacer et lire",replace:"Remplacer file",add_queue:"Ajouter \xE0 la fin",move_up:"Monter",move_down:"Descendre",move_next:"Passer au suivant",remove:"Retirer de la file",added:"Ajout\xE9 \xE0 la file !",added_to_playlist:"Ajout\xE9 \xE0 la playlist !",select_playlist:"S\xE9lectionner une playlist pour '{track}'",add_to_playlist:"Ajouter \xE0 la playlist",select_track_for_playlist:"S\xE9lectionner le titre \xE0 ajouter pour '{track}' par {artist}",labels:{replace:"Remplacer",next:"Suivant",replace_next:"Rempl. Suivant",add:"Ajouter",add_to_playlist:"Ajouter \xE0 la playlist"},results:"r\xE9sultats",result:"r\xE9sultat",filters:{all:"Tout",artist:"Artiste",album:"Album",track:"Titre",playlist:"Playlist",radio:"Radio",music:"Musique",station:"Station",podcast:"Podcast",audiobook:"Livre audio"},search_artist:"Chercher cet artiste",play_collection:"Lire cette collection",play_collection_error:"Impossible de lire cette collection directement",browse_album:"Parcourir les titres de {album}",play_item:"Lire {item}"},lyrics:{finding:"Recherche des paroles...",none_found:"Aucune parole trouv\xE9e",not_available:"Paroles non disponibles"},lyrics_modes:{default:"Par d\xE9faut (Surligner et faire d\xE9filer)",scroll:"D\xE9filement uniquement",text:"Texte uniquement"}},Eo={common:{not_found:"Entit\xE0 non trovata.",search:"Cerca",power:"Accensione",favorite:"Preferito",loading:"Caricamento...",no_results:"Nessun risultato.",close:"Chiudi",vol_up:"Volume su",vol_down:"Volume gi\xF9",media_player:"Lettore multimediale",edit_entity:"Modifica impostazioni entit\xE0",edit_action:"Modifica impostazioni azione",mute:"Muto",unmute:"Riattiva audio",seek:"Cerca",volume:"Volume",play_now:"Riproduci ora",more_options:"Altre opzioni",unavailable:"Non disponibile",back:"Indietro",cancel:"Annulla",reset_default:"Ripristina predefiniti"},editor:{tabs:{entities:"Entit\xE0",behavior:"Comportamento",look_and_feel:"Aspetto",artwork:"Copertina",actions:"Azioni"},placeholders:{search:"Cerca musica..."},sections:{artwork:{general:{title:"Impostazioni generali",description:"Controlli globali per la copertina."},idle:{title:"Copertina in riposo",description:"Mostra un'immagine statica quando non c'\xE8 riproduzione."},overrides:{title:"Override copertina",description:"Gli override sono valutati dall'alto in basso."}},entities:{title:"Entit\xE0*",description:"Aggiungi i lettori da controllare."},behavior:{idle_chips:{title:"Riposo e chip",description:"Scegli quando andare in riposo."},interactions_search:{title:"Interazioni e ricerca",description:"Ajusta il fissaggio delle entit\xE0."},lyrics:{title:"Testi",description:"Configura come vengono visualizzati i testi e quando appaiono."}},look_and_feel:{theme_layout:{title:"Tema e layout",description:"Adatta allo stile del dashboard."},controls_typography:{title:"Controlli e tipografia",description:"Ajusta bottoni e etichette."},collapsed_idle:{title:"Stati contratto e riposo",description:"Controlla il contratto della scheda."}},actions:{title:"Azioni",description:"Crea chip azione."}},subtitles:{idle_timeout:"Tempo prima del riposo (ms). 0 per disabilitare.",show_chip_row:`"Auto" nasconde la riga se c'\xE8 una sola entit\xE0. "Nel menu" sposta i chip nel menu. "Nel menu in inattivit\xE0" mostra i chip in linea quando attivo ma li sposta nel menu quando inattivo.`,dim_chips:"Appanna i chip in riposo per un aspetto pi\xF9 pulito.",hold_to_pin:"Tieni premuto per fissare invece di un tocco breve.",always_show_group:"I controlli di raggruppamento rapido (+/-/stella) saranno visibili per impostazione predefinita al caricamento della pagina. Puoi comunque attivarli manualmente tramite doppio tocco.",disable_autofocus:"Evita che la ricerca prenda il focus automaticamente.",search_within_filter:"Cerca nel filtro attivo (Preferiti, ecc.).",close_search_on_play:"Chiudi ricerca alla riproduzione.",pin_search_headers:"Fissa le intestazioni di ricerca durante lo scorrimento.",hide_search_headers_on_idle:"Nascondi la ricerca e i filtri quando inattivo.",disable_mass:"Disabilita integrazione Mass Queue.",swap_pause_stop:"Sostituisci pausa con stop nel design moderno.",adaptive_controls:"Permetti ai pulsanti di adattarsi allo spazio.",hide_menu_player:"Nascondi nome entit\xE0 quando \xE8 nel menu.",adaptive_text:"Scegli quali testi si adattano allo spazio.",collapse_expand:"Sempre contratto attiva il modo mini. Espandi alla ricerca espande temporaneamente.",idle_screen:"Scegli schermata da mostrare in riposo.",hide_controls:"Seleziona controlli da nascondere.",hide_search_chips:"Nascondi chip di filtro ricerca.",follow_active_entity:"L'entit\xE0 volume seguir\xE0 quella attiva.",search_limit_full:"Massimo risultati (1-1000, default: 20).",default_search_filter_full:"Scegli quale filtro \xE8 attivo per impostazione predefinita all'apertura della ricerca.",default_search_favorites:"Inizia ricerca con preferiti attivi",result_sorting_full:"Scegli ordine risultati.",card_height_full:"Lascia vuoto per altezza automatica.",control_layout_full:"Scegli tra design vecchio o moderno.",artwork_extend:"Estendi copertina sotto i chip.",artwork_extend_label:"Estendi copertina",no_artwork_overrides:"Nessun override copertina configurato.",entity_current_hint:"Usa 'entity_id: current' per il lettore attuale.",service_data_note:"Le modifiche si salvano premendo 'Salva'.",jinja_template_hint:"Modello Jinja per entity_id.",jinja_template_vol_hint:"Modello per entit\xE0 volume.",not_available_alt_collapsed:"Non disponibile in modo contratto.",not_available_collapsed:"Non disponibile se contratto.",only_available_collapsed:"Solo disponibile se contratto.",only_available_modern:"Solo disponibile con layout Moderno.",image_url_helper:"Inserisci un URL diretto a un'immagine o un percorso file locale",selected_entity_helper:"Helper di testo di input che verr\xE0 aggiornato con l'ID dell'entit\xE0 del lettore multimediale attualmente selezionato.",select_entity_helper:"Helper di testo di input da cui leggere l'ID dell'entit\xE0. La scheda selezioner\xE0 automaticamente il chip corrispondente.",sync_entity_type:"Scegli quale ID entit\xE0 sincronizzare con l'helper (predefinito l'entit\xE0 Music Assistant se configurata).",disable_auto_select:"Evita che il chip di questa entit\xE0 venga selezionato automaticamente all'inizio della riproduzione.",search_view:"Scegli tra una lista standard o una griglia di schede per i risultati della ricerca.",search_card_columns:"Specifica quante colonne utilizzare nella vista a schede. La copertina si adatter\xE0 automaticamente.",card_type:"Scegli la modalit\xE0 della scheda. 'Predefinito' \xE8 il lettore multimediale standard. 'Ricerca dedicata' rende la scheda un'interfaccia di ricerca permanente.",always_show_lyrics:"Apri automaticamente la visualizzazione dei testi quando la pagina viene aggiornata.",lyrics_pre_roll:"Sposta il tempismo dell'evidenziazione dei testi. I valori positivi lo accelerano, quelli negativi lo ritardano (predefinito: 0)."},titles:{edit_entity:"Modifica entit\xE0",edit_action:"Modifica azione",service_data:"Dati servizio",add_artwork_override:"Aggiungi override"},labels:{dim_chips:"Appanna chip in riposo",hold_to_pin:"Tieni premuto per fissare",always_show_group:"Gruppo rapido predefinito",disable_autofocus:"Disabilita autofocus",keep_filters:"Mantieni filtri",dismiss_on_play:"Chiudi alla riproduzione",default_search_filter:"Filtro di ricerca predefinito",default_search_favorites:"Filtro preferiti predefinito",pin_headers:"Fissa intestazioni",hide_search_headers_on_idle:"Nascondi intestazioni in inattivit\xE0",disable_mass:"Disabilita Mass Queue",match_theme:"Segui tema",alt_progress:"Barra progresso alternativa",display_timestamps:"Mostra timestamp",swap_pause_stop:"Sostituisci Pausa con Stop",adaptive_controls:"Dimensione adattativa",hide_active_entity:"Nascondi nome entit\xE0 attiva",collapse_on_idle:"Contrai in riposo",hide_menu_player_toggle:"Nascondi lettore menu",always_collapsed:"Sempre contratto",expand_on_search:"Espandi alla ricerca",script_var:"Variabile script (yamp_entity)",use_ma_template:"Usa modello MA",use_vol_template:"Usa modello Volume",follow_active_entity:"Volume segue entit\xE0 attiva",use_url_path:"Usa URL o percorso",adaptive_text_elements:"Elementi per dimensione testo adattiva",disable_auto_select:"Disabilita selezione automatica",always_show_lyrics:"Mostra sempre i testi",lyrics_mode:"Modalit\xE0 testi",lyrics_pre_roll:"Pre-roll testi (secondi)",card_type:"Tipo di scheda"},fields:{artwork_fit:"Adattamento",artwork_position:"Posizione",artwork_hostname:"Host",match_field:"Campo",match_value:"Valore",size_percent:"Dimensione (%)",object_fit:"Object Fit",idle_timeout:"Riposo (ms)",show_chip_row:"Mostra chip",search_limit:"Limite ricerca",result_sorting:"Ordine",vol_step:"Passo volume",card_height:"Altezza (px)",control_layout:"Design",save_service_data:"Salva",image_url:"URL immagine",fallback_image_url:"URL fallback",move_to_main:"Sposta in chip principali",move_to_menu:"Sposta nel menu",delete_action:"Elimina azione",revert_service_data:"Annulla modifiche",test_action:"Prova azione",volume_mode:"Modo volume",idle_screen:"Schermo riposo",name:"Nome",hidden_controls:"Controlli nascosti",ma_template:"Modello MA (Jinja)",hidden_chips:"Chip nascosti",vol_template:"Modello Volume (Jinja)",icon:"Icona",action_type:"Tipo azione",menu_item:"Elemento menu",nav_path:"Percorso",service:"Servizio",service_data:"Dati",idle_image_entity:"Entit\xE0 immagine riposo",match_entity:"Entit\xE0",ma_entity:"Entit\xE0 Music Assistant",vol_entity:"Entit\xE0 di volume",selected_entity_helper:"Helper entit\xE0 selezionata",sync_entity_type:"Tipo di entit\xE0 da sincronizzare",placement:"Posizionamento",card_trigger:"Trigger della scheda",search_view:"Vista risultati ricerca",search_card_columns:"Colonne schede",details_alignment:"Allineamento dei dettagli"},action_types:{menu:"Apri un elemento del menu",service:"Chiama un servizio",navigate:"Naviga",prev_entity:"Chip entit\xE0 precedente",next_entity:"Chip entit\xE0 successiva",sync_selected_entity:"Sincronizza entit\xE0 selezionata",select_entity:"Seleziona entit\xE0 da helper",toggle_lyrics:"Attiva/disattiva sovrapposizione testi"},action_helpers:{sync_selected_entity:"Sincronizza entit\xE0 selezionata \u2192",select_entity:"Seleziona entit\xE0 \u2190",select_helper:"(seleziona helper)"},sync_entity_options:{yamp_entity:"yamp_entity (Entit\xE0 Music Assistant se configurata)",yamp_main_entity:"yamp_main_entity (Entit\xE0 principale del lettore)",yamp_playback_entity:"yamp_playback_entity (Entit\xE0 di riproduzione attiva attuale)"},placements:{chip:"Chip d'azione",menu:"Nel menu",hidden:"Nascosto (Tocco sull'immagine)",not_triggerable:"Non attivabile"},triggers:{none:"Nessuno",tap:"Tocco",hold:"Mantieni",double_tap:"Doppio tocco",swipe_left:"Scorri a sinistra",swipe_right:"Scorri a destra"},search_view_options:{list:"Lista",card:"Scheda",card_minimal:"Scheda minima"},card_type_options:{default:"Predefinito",search:"Cerca",group_players:"Raggruppa i lettori"},artwork_fit:{default:"Predefinito",cover:"Copertina (predefinito)",contain:"Contieni",fill:"Riempi","scale-down":"Ridimensiona","scaled-contain":"Contieni scalato","scaled-contain-alternate":"Contieni scalato alternativo",none:"Nessuno"}},card:{sections:{details:"Dettagli riproduzione",menu:"Menu e Ricerca",action_chips:"Chip azione"},media_controls:{shuffle:"Casuale",previous:"Precedente",play_pause:"Riproduci/Pausa",stop:"Ferma",next:"Successivo",repeat:"Ripeti"},menu:{more_info:"Pi\xF9 info",search:"Cerca",source:"Sorgente",show_lyrics:"Mostra testi",hide_lyrics:"Nascondi testi",transfer_queue:"Trasferisci coda",group_players:"Raggruppa",select_entity:"Seleziona",transfer_to:"Trasferisci a",no_players:"Senza lettori MA."},grouping:{title:"Raggruppa",sync_volume:"Sincronizza volume",group_all:"Raggruppa tutti",ungroup_all:"Separa tutti",unavailable:"Non disponibile",no_players:"Non raggruppabile.",master:"Master",joined:"Unito",available:"Disponibile",current:"Attuale",unjoin_from:"Scollegati da {master}",join_with:"Unisciti a {master}"}},search:{favorites:"Preferiti",recently_played:"Recenti",next_up:"A seguire",recommendations:"Raccomandazioni",radio_mode:"Modo Radio",play_similar:"Riproduci brani simili",close:"Chiudi",no_results:"Nessun risultato.",play_next:"Riprod. successivo",replace_play:"Sostituisci e riproduci",replace:"Sostituisci coda",add_queue:"Aggiungi alla fine",move_up:"Sposta su",move_down:"Sposta gi\xF9",move_next:"Passa al successivo",remove:"Rimuovi da coda",added:"Aggiunto!",added_to_playlist:"Aggiunto alla playlist!",select_playlist:"Seleziona playlist per '{track}'",add_to_playlist:"Aggiungi alla playlist",select_track_for_playlist:"Seleziona il brano da aggiungere per '{track}' di {artist}",labels:{replace:"Sostituisci",next:"Successivo",replace_next:"Sost. succ.",add:"Aggiungi",add_to_playlist:"Aggiungi alla playlist"},results:"risultati",result:"risultato",filters:{all:"Tutto",artist:"Artista",album:"Album",track:"Brano",playlist:"Playlist",radio:"Radio",music:"Musica",station:"Stazione",podcast:"Podcast",audiobook:"Audiolibro"},search_artist:"Cerca questo artista",play_collection:"Riproduci questa collezione",play_collection_error:"Impossibile riprodurre direttamente questa collezione",browse_album:"Sfoglia i brani di {album}",play_item:"Riproduci {item}"},lyrics:{finding:"Ricerca testi...",none_found:"Nessun testo trovato",not_available:"Testi non disponibili"},lyrics_modes:{default:"Predefinito (Evidenzia e scorri)",scroll:"Solo scorrimento",text:"Solo testo"}},Ao={common:{not_found:"Entiteit niet gevonden.",search:"Zoeken",power:"Aan/Uit",favorite:"Favoriet",loading:"Laden...",no_results:"Geen resultaten.",close:"Sluiten",vol_up:"Volume Omhoog",vol_down:"Volume Omlaag",media_player:"Mediaspeler",edit_entity:"Entiteitsinstellingen Bewerken",edit_action:"Actie-instellingen Bewerken",mute:"Dempen",unmute:"Dempen opheffen",seek:"Zoeken",volume:"Volume",play_now:"Nu Spelen",more_options:"Meer Opties",unavailable:"Niet beschikbaar",back:"Terug",cancel:"Annuleren",reset_default:"Herstellen naar standaard"},editor:{tabs:{entities:"Entiteiten",behavior:"Gedrag",look_and_feel:"Uiterlijk",artwork:"Artwork",actions:"Acties"},placeholders:{search:"Zoek muziek..."},sections:{artwork:{general:{title:"Algemene Instellingen",description:"Globale instellingen voor hoe artwork wordt weergegeven en opgehaald."},idle:{title:"Artwork bij Inactiviteit",description:"Toon een statische afbeelding of entiteits-snapshot wanneer er niets wordt afgespeeld."},overrides:{title:"Artwork Overschrijvingen",description:"Overschrijvingen worden van boven naar beneden ge\xEBvalueerd. Sleep om te sorteren."}},entities:{title:"Entiteiten*",description:"Voeg de mediaspelers toe die je wilt bedienen. Sleep entiteiten om de volgorde te wijzigen."},behavior:{idle_chips:{title:"Inactiviteit & Chips",description:"Kies wanneer de kaart inactief wordt en hoe entiteitschips zich gedragen."},interactions_search:{title:"Interacties & Zoeken",description:"Verfijn hoe entiteiten worden vastgezet en hoeveel resultaten er tegelijk worden getoond."},lyrics:{title:"Songteksten",description:"Configureer hoe songteksten worden weergegeven en wanneer ze verschijnen."}},look_and_feel:{theme_layout:{title:"Thema & Layout",description:"Stem af op de styling van het dashboard en beheer de totale voetafdruk."},controls_typography:{title:"Bediening & Typografie",description:"Pas knopgrootte, entiteitslabels en adaptieve tekst aan."},collapsed_idle:{title:"Ingeklapte & Inactieve Staten",description:"Beheer wanneer de kaart inklapt en welke weergaven getoond worden bij inactiviteit."}},actions:{title:"Acties",description:"Bouw de actiechips die in de kaart of het menu verschijnen. Sleep om te sorteren, klik op het potlood om te configureren."}},subtitles:{idle_timeout:"Tijd in milliseconden voordat de kaart naar de inactieve modus gaat. Stel in op 0 om inactiviteitsgedrag uit te schakelen.",show_chip_row:'"Auto" verbergt de chiprij wanneer er slechts \xE9\xE9n entiteit is geconfigureerd. "In Menu" verplaatst de chips naar het menu-overlay. "In menu bij inactiviteit" toont chips inline wanneer actief maar verplaatst ze naar het menu wanneer inactief.',dim_chips:"Wanneer de kaart inactief wordt met een afbeelding, dim dan de entiteits- en actiechips voor een strakker uiterlijk.",hold_to_pin:"Houd entiteitschips lang ingedrukt in plaats van kort om ze vast te zetten, om automatisch schakelen tijdens afspelen te voorkomen.",always_show_group:"Snelgroeperingsknoppen (+/-/ster) zijn standaard zichtbaar bij het laden van de pagina. Je kunt ze nog steeds handmatig in- of uitschakelen via dubbeltikken.",disable_autofocus:"Voorkom dat het zoekveld de focus steelt, zodat onscreen toetsenborden verborgen blijven.",search_within_filter:"Schakel dit in om te zoeken binnen het huidige actieve filter (Favorieten, Recent Afgespeeld, etc) in plaats van dit te wissen.",close_search_on_play:"Sluit het zoekscherm automatisch wanneer een nummer wordt afgespeeld.",pin_search_headers:"Houd de zoekinvoer en filters bovenaan vast tijdens het scrollen door resultaten.",hide_search_headers_on_idle:"Verberg zoekinvoer en filters wanneer inactief.",disable_mass:"Schakel de optionele Mass Queue integratie uit, zelfs als deze is ge\xEFnstalleerd.",swap_pause_stop:"Vervang de pauzeknop door stop bij gebruik van de moderne lay-out.",adaptive_controls:"Laat de afspeelknoppen groeien of krimpen om in de beschikbare ruimte te passen.",hide_menu_player:"Wanneer chips in het menu staan, verberg dan het entiteitslabel onderaan de kaart.",adaptive_text:"Kies welke tekstgroepen moeten schalen met de beschikbare ruimte (laat leeg om adaptieve tekst uit te schakelen).",collapse_expand:"Altijd Ingeklapt cre\xEBert de mini-spelermodus. Uitklappen bij Zoeken klapt tijdelijk uit tijdens het zoeken.",idle_screen:"Kies welk scherm automatisch wordt weergegeven wanneer de kaart inactief wordt.",hide_controls:"Selecteer welke knoppen je wilt verbergen voor deze entiteit (standaard worden ze allemaal getoond)",hide_search_chips:"Verberg specifieke zoekfilterchips voor deze entiteit",follow_active_entity:"Indien ingeschakeld, zal de volume-entiteit automatisch de actieve afspeel-entiteit volgen. Let op: dit overschrijft de geselecteerde volume-entiteit.",search_limit_full:"Maximaal aantal zoekresultaten om weer te geven (1-1000, standaard: 20)",default_search_filter_full:"Kies welk filter standaard actief is wanneer het zoekscherm wordt geopend.",default_search_favorites:"Start zoekopdracht met favorieten actief",result_sorting_full:"Kies hoe zoekresultaten worden gesorteerd. Standaard behoudt de bronvolgorde.",card_height_full:"Laat leeg voor automatische hoogte",control_layout_full:"Kies tussen de oude gelijkmatig verdeelde knoppen of de moderne Home Assistant lay-out.",artwork_extend:"Laat de artwork-achtergrond doorlopen onder de chip- en actierijen.",artwork_extend_label:"Artwork uitbreiden",no_artwork_overrides:"Geen artwork overschrijvingen geconfigureerd. Gebruik de plusknop hieronder om er een toe te voegen.",entity_current_hint:"Gebruik 'entity_id: current' om de momenteel geselecteerde mediaspeler op de kaart te targeten. Let op: de 'Test Actie' knop wordt uitgeschakeld bij gebruik van deze functie.",service_data_note:"Wijzigingen in de servicegegevens hieronder worden pas in de configuratie opgeslagen nadat op de knop 'Servicegegevens Opslaan' is geklikt!",jinja_template_hint:"Voer een Jinja-sjabloon in dat resulteert in een enkele entity_id. Voorbeeld voor het wisselen van MA op basis van een bronselectie:",jinja_template_vol_hint:"Voer een Jinja-sjabloon in dat resulteert in een entity_id (bijv. media_player.kantoor). Voorbeeld voor het wisselen van volume-entiteit op basis van een boolean:",not_available_alt_collapsed:"Niet beschikbaar met Alternatieve Voortgangsbalk of Altijd Ingeklapte modus",not_available_collapsed:"Niet beschikbaar wanneer Altijd Ingeklapt is ingeschakeld",only_available_collapsed:"Alleen beschikbaar wanneer Altijd Ingeklapt is ingeschakeld",only_available_modern:"Alleen beschikbaar met de Moderne lay-out",image_url_helper:"Voer een directe URL naar een afbeelding of een lokaal bestandspad in",selected_entity_helper:"Invoerteksthelper die wordt bijgewerkt met de momenteel geselecteerde media player-entiteits-ID.",select_entity_helper:"Invoerteksthelper waaruit het entiteits-ID wordt gelezen. De kaart selecteert automatisch de bijbehorende chip.",sync_entity_type:"Kies welk entiteits-ID moet worden gesynchroniseerd met de helper (standaard Music Assistant-entiteit indien geconfigureerd).",disable_auto_select:"Voorkomt dat de chip van deze entiteit automatisch wordt geselecteerd wanneer deze begint af te spelen.",search_view:"Kies tussen een standaardlijst of een raster van kaarten voor zoekresultaten.",search_card_columns:"Geef aan hoeveel kolommen er gebruikt moeten worden in de kaartweergave. De afbeelding wordt automatisch aangepast.",card_type:"Kies de kaartmodus. 'Standaard' is de standaard mediaspeler. 'Speciale zoekopdracht' maakt van de kaart een permanente zoekinterface.",always_show_lyrics:"Open automatisch de songtekstweergave wanneer de pagina wordt vernieuwd.",lyrics_pre_roll:"Verschuif de timing van de songtekstmarkering. Positieve waarden versnellen het, negatieve waarden vertragen het (standaard: 0)."},titles:{edit_entity:"Entiteit Bewerken",edit_action:"Actie Bewerken",service_data:"Servicegegevens",add_artwork_override:"Artwork Overschrijving Toevoegen"},labels:{dim_chips:"Chips dimmen bij inactiviteit",hold_to_pin:"Ingedrukt houden om vast te zetten",always_show_group:"Snelgroepering standaard aan",disable_autofocus:"Zoek-autofocus uitschakelen",keep_filters:"Filters behouden bij zoeken",dismiss_on_play:"Zoeken sluiten bij afspelen",default_search_filter:"Standaard zoekfilter",default_search_favorites:"Standaard naar favorietenfilter",pin_headers:"Zoekkoppen vastzetten",hide_search_headers_on_idle:"Zoekkoppen verbergen bij inactiviteit",disable_mass:"Mass Queue uitschakelen",match_theme:"Thema matchen",alt_progress:"Alternatieve Voortgangsbalk",display_timestamps:"Tijdstempels Weergeven",swap_pause_stop:"Pauze vervangen door Stop",adaptive_controls:"Adaptieve Knoppen Grootte",hide_active_entity:"Label van Actieve Entiteit verbergen",collapse_on_idle:"Inklappen bij inactiviteit",hide_menu_player_toggle:"Menu-speler Verbergen",always_collapsed:"Altijd Ingeklapt",expand_on_search:"Uitklappen bij Zoeken",script_var:"Script Variabele (yamp_entity)",use_ma_template:"Sjabloon gebruiken voor Music Assistant Entiteit",use_vol_template:"Sjabloon gebruiken voor Volume Entiteit",follow_active_entity:"Volume Entiteit volgt Actieve Entiteit",use_url_path:"URL of Pad gebruiken",adaptive_text_elements:"Elementen voor adaptieve tekstgrootte",disable_auto_select:"Automatische selectie uitschakelen",always_show_lyrics:"Toon altijd songteksten",lyrics_mode:"Songtekstmodus",lyrics_pre_roll:"Songtekst Pre-Roll (seconden)"},fields:{artwork_fit:"Artwork Passend Maken",artwork_position:"Artwork Positie",artwork_hostname:"Artwork Hostnaam",match_field:"Match Veld",match_value:"Match Waarde",size_percent:"Grootte (%)",object_fit:"Object Fit",idle_timeout:"Time-out voor Inactiviteit (ms)",show_chip_row:"Chiprij Tonen",search_limit:"Limiet Zoekresultaten",result_sorting:"Sortering Resultaten",vol_step:"Volume Stap (0.05 = 5%)",card_height:"Kaarthoogte (px)",control_layout:"Knoppen Lay-out",save_service_data:"Servicegegevens Opslaan",image_url:"Afbeelding URL",fallback_image_url:"Fallback Afbeelding URL",move_to_main:"Verplaats actie naar hoofdchips",move_to_menu:"Verplaats actie naar menu",delete_action:"Actie Verwijderen",revert_service_data:"Terugzetten naar Opgeslagen Gegevens",test_action:"Actie Testen",volume_mode:"Volume Modus",idle_screen:"Inactief Scherm",name:"Naam",hidden_controls:"Verborgen Knoppen",ma_template:"Music Assistant Entiteit Sjabloon (Jinja)",hidden_chips:"Verborgen Zoekfilterchips",vol_template:"Volume Entiteit Sjabloon (Jinja)",icon:"Icoon",action_type:"Actietype",menu_item:"Menu-item",nav_path:"Navigatiepad",service:"Service",service_data:"Servicegegevens",idle_image_entity:"Entiteit voor inactieve afbeelding",match_entity:"Match Entiteit",ma_entity:"Music Assistant-entiteit",vol_entity:"Volume-entiteit",selected_entity_helper:"Geselecteerde entiteitshelper",sync_entity_type:"Synchronisatie entiteitstype",placement:"Plaatsing",card_trigger:"Kaart trigger",search_view:"Zoekresultaten weergave",search_card_columns:"Aantal kolommen",card_type:"Kaarttype",no_artwork_option:"Geen artwork",details_alignment:"Details uitlijning"},action_types:{menu:"Open een kaartmenu-item",service:"Roep een service aan",navigate:"Navigeren",prev_entity:"Vorige entiteit chip",next_entity:"Volgende entiteit chip",sync_selected_entity:"Synchroniseer geselecteerde entiteit",select_entity:"Selecteer entiteit uit helper"},action_helpers:{sync_selected_entity:"Geselecteerde entiteit synchroniseren",select_entity:"Entiteit selecteren uit helper",toggle_lyrics:"Wisselen tussen songtekst-overlay",select_helper:"(selecteer helper)"},sync_entity_options:{yamp_entity:"yamp_entity (Music Assistant-entiteit indien geconfigureerd)",yamp_main_entity:"yamp_main_entity (Hoofd media player-entiteit)",yamp_playback_entity:"yamp_playback_entity (Huidige actieve afspeelentiteit)"},placements:{chip:"Actiechip",menu:"In menu",hidden:"Verborgen (Artwork-tik)",not_triggerable:"Niet triggerbaar"},triggers:{none:"Geen",tap:"Tik",hold:"Vasthouden",double_tap:"Dubbeltik",swipe_left:"Veeg naar links",swipe_right:"Veeg naar rechts"},search_view_options:{list:"Lijst",card:"Kaart",card_minimal:"Minimale kaart"},card_type_options:{default:"Standaard",search:"Zoeken",group_players:"Spelers groeperen"},artwork_fit:{default:"Standaard",cover:"Cover (standaard)",contain:"Bevatten",fill:"Vullen","scale-down":"Verkleinen","scaled-contain":"Geschaalde contain","scaled-contain-alternate":"Geschaalde contain alternatief",none:"Geen"}},card:{sections:{details:"Details van 'Nu Spelen'",menu:"Menu & Zoekschermen",action_chips:"Actie Chips"},media_controls:{shuffle:"Shuffle",previous:"Vorige",play_pause:"Afspelen/Pauzeren",stop:"Stop",next:"Volgende",repeat:"Herhalen"},menu:{more_info:"Meer Info",search:"Zoeken",source:"Bron",show_lyrics:"Songtekst weergeven",hide_lyrics:"Songtekst verbergen",transfer_queue:"Wachtrij Overdragen",group_players:"Spelers Groeperen",select_entity:"Selecteer Entiteit voor Meer Info",transfer_to:"Wachtrij Overdragen Naar",no_players:"Geen andere Music Assistant spelers beschikbaar."},grouping:{title:"Spelers Groeperen",sync_volume:"Volume Synchroniseren",group_all:"Alles Groeperen",ungroup_all:"Alles Loskoppelen",unavailable:"Speler is niet beschikbaar",no_players:"Geen andere spelers beschikbaar die kunnen groeperen.",master:"Master",joined:"Gekoppeld",available:"Beschikbaar",current:"Huidig",unjoin_from:"Loskoppelen van {master}",join_with:"Koppelen met {master}"}},search:{favorites:"Favorieten",recently_played:"Recent Afgespeeld",next_up:"Volgende",recommendations:"Aanbevelingen",radio_mode:"Radiomodus",play_similar:"Vergelijkbare nummers afspelen",close:"Zoeken Sluiten",no_results:"Geen resultaten.",play_next:"Volgende afspelen",replace_play:"Huidige wachtrij vervangen en nu afspelen",replace:"Wachtrij vervangen",add_queue:"Toevoegen aan einde van de wachtrij",move_up:"Omhoog verplaatsen",move_down:"Omlaag verplaatsen",move_next:"Als volgende afspelen",remove:"Verwijderen uit wachtrij",added:"Toegevoegd aan wachtrij!",added_to_playlist:"Toegevoegd aan afspeellijst!",select_playlist:"Selecteer afspeellijst voor '{track}'",add_to_playlist:"Toevoegen aan afspeellijst",select_track_for_playlist:"Selecteer het nummer om toe te voegen voor '{track}' van {artist}",labels:{replace:"Vervangen",next:"Volgende",replace_next:"Vervang Volgende",add:"Toevoegen",add_to_playlist:"Toevoegen aan afspeellijst"},results:"resultaten",result:"resultaat",filters:{all:"Alles",artist:"Artiest",album:"Album",track:"Nummer",playlist:"Afspeellijst",radio:"Radio",music:"Muziek",station:"Zender",podcast:"Podcast",audiobook:"Luisterboek"},search_artist:"Zoek naar deze artiest",play_collection:"Speel deze collectie af",play_collection_error:"Kan deze collectie niet direct afspelen",browse_album:"Tracks van {album} doorzoeken",play_item:"{item} afspelen"},lyrics:{finding:"Songteksten zoeken...",none_found:"Geen songteksten gevonden",not_available:"Songtekst niet beschikbaar"},lyrics_modes:{default:"Standaard (Markeren & scrollen)",scroll:"Alleen scrollen",text:"Alleen tekst"}},So={common:{not_found:"Entidade n\xE3o encontrada.",search:"Procurar",power:"Ligar/Desligar",favorite:"Favorito",loading:"A carregar...",no_results:"Sem resultados.",close:"Fechar",vol_up:"Aumentar volume",vol_down:"Diminuir volume",media_player:"Leitor multim\xE9dia",edit_entity:"Editar defini\xE7\xF5es da entidade",edit_action:"Editar defini\xE7\xF5es da a\xE7\xE3o",mute:"Silenciar",unmute:"Ativar som",seek:"Procurar",volume:"Volume",play_now:"Reproduzir agora",more_options:"Mais op\xE7\xF5es",unavailable:"Indispon\xEDvel",back:"Voltar",cancel:"Cancelar",reset_default:"Repor predefini\xE7\xF5es"},editor:{tabs:{entities:"Entidades",behavior:"Comportamento",look_and_feel:"Aspeto",artwork:"Capa",actions:"A\xE7\xF5es"},placeholders:{search:"Procurar m\xFAsica..."},sections:{artwork:{general:{title:"Defini\xE7\xF5es gerais",description:"Controlos globais para a capa."},idle:{title:"Capa em repouso",description:"Mostrar imagem est\xE1tica quando nada toca."},overrides:{title:"Substitui\xE7\xF5es de capa",description:"As substitui\xE7\xF5es s\xE3o avaliadas de cima para baixo."}},entities:{title:"Entidades*",description:"Adicione os leitores a controlar."},behavior:{idle_chips:{title:"Repouso e chips",description:"Escolha quando ir para repouso."},interactions_search:{title:"Intera\xE7\xF5es e procura",description:"Ajuste a fixa\xE7\xE3o de entidades."},lyrics:{title:"Letras",description:"Configure como as letras s\xE3o exibidas e quando aparecem."}},look_and_feel:{theme_layout:{title:"Tema e design",description:"Combine com o estilo do dashboard."},controls_typography:{title:"Controlos e tipografia",description:"Ajuste bot\xF5es e etiquetas."},collapsed_idle:{title:"Estados contra\xEDdo e repouso",description:"Controle o contra\xEDdo do cart\xE3o."}},actions:{title:"A\xE7\xF5es",description:"Crie chips de a\xE7\xE3o."}},subtitles:{idle_timeout:"Tempo antes de repouso (ms). 0 para desativar.",show_chip_row:'"Auto" oculta a linha se houver apenas uma entidade. "No menu" move os chips. "No menu em repouso" mostra os chips em linha quando ativo mas move-os para o menu quando em repouso.',dim_chips:"Escurecer chips em repouso para um aspeto mais limpo.",hold_to_pin:"Manter premido para fixar em vez de toque curto.",always_show_group:"Os controles de agrupamento r\xE1pido (+/-/estrela) estar\xE3o vis\xEDveis por padr\xE3o ao carregar a p\xE1gina. Voc\xEA ainda pode altern\xE1-los manualmente atrav\xE9s de um toque duplo.",disable_autofocus:"Evitar que a procura tome o foco automaticamente.",search_within_filter:"Procurar no filtro ativo (Favoritos, etc.).",close_search_on_play:"Fechar procura ao reproduzir.",pin_search_headers:"Fixar cabe\xE7alhos de procura ao fazer scroll.",hide_search_headers_on_idle:"Ocultar pesquisa e filtros quando inativo.",disable_mass:"Desativar integra\xE7\xE3o Mass Queue.",swap_pause_stop:"Substituir pausa por stop no design moderno.",adaptive_controls:"Permitir que os bot\xF5es se adaptem ao espa\xE7o.",hide_menu_player:"Ocultar nome da entidade quando no menu.",adaptive_text:"Escolher que textos se adaptam ao espa\xE7o.",collapse_expand:"Sempre contra\xEDdo ativa modo mini. Expandir ao procurar expande temporariamente.",idle_screen:"Escolher ecr\xE3 a mostrar em repouso.",hide_controls:"Selecionar controlos a ocultar.",hide_search_chips:"Ocultar chips de filtro de procura.",follow_active_entity:"A entidade de volume seguir\xE1 a ativa.",search_limit_full:"M\xE1ximo de resultados (1-1000, default: 20).",default_search_filter_full:"Escolha qual filtro est\xE1 ativo por padr\xE3o quando a tela de pesquisa \xE9 aberta.",default_search_favorites:"Iniciar pesquisa com favoritos ativos",result_sorting_full:"Escolher ordem dos resultados.",card_height_full:"Deixar vazio para altura autom\xE1tica.",control_layout_full:"Escolher entre design antigo ou moderno.",artwork_extend:"Estender capa sob os chips.",artwork_extend_label:"Estender capa",no_artwork_overrides:"Sem substitui\xE7\xF5es de capa configuradas.",entity_current_hint:"Use 'entity_id: current' para o leitor atual.",service_data_note:"As altera\xE7\xF5es s\xE3o guardadas ao premir 'Guardar'.",jinja_template_hint:"Modelo Jinja para entity_id.",jinja_template_vol_hint:"Modelo para entidade volume.",not_available_alt_collapsed:"N\xE3o dispon\xEDvel em modo contra\xEDdo.",not_available_collapsed:"N\xE3o dispon\xEDvel se contra\xEDdo.",only_available_collapsed:"Apenas dispon\xEDvel se contra\xEDdo.",only_available_modern:"Apenas dispon\xEDvel com layout Moderno.",image_url_helper:"Insira um URL direto para uma imagem ou um caminho de arquivo local",selected_entity_helper:"Helper de texto de entrada que ser\xE1 atualizado com o ID da entidade do reprodutor de m\xEDdia selecionado no momento.",select_entity_helper:"Helper de texto de entrada do qual ler o ID da entidade. O cart\xE3o selecionar\xE1 automaticamente o chip correspondente.",sync_entity_type:"Escolha qual ID de entidade sincronizar com o helper (padr\xE3o entidade Music Assistant se configurada).",disable_auto_select:"Impede que o chip desta entidade seja selecionado automaticamente quando a reprodu\xE7\xE3o \xE9 iniciada.",search_view:"Escolha entre uma lista padr\xE3o ou uma grade de cart\xF5es para os resultados da pesquisa.",search_card_columns:"Especifique quantas colunas usar na visualiza\xE7\xE3o de cart\xF5es. A capa ser\xE1 redimensionada automaticamente.",card_type:"Escolha o modo do cart\xE3o. 'Padr\xE3o' \xE9 o reprodutor de m\xEDdia padr\xE3o. 'Busca dedicada' torna o cart\xE3o uma interface de busca permanente.",always_show_lyrics:"Abrir automaticamente a visualiza\xE7\xE3o de letras quando a p\xE1gina for atualizada.",lyrics_pre_roll:"Ajuste o tempo de destaque da letra. Valores positivos aceleram, valores negativos atrasam (padr\xE3o: 0)."},titles:{edit_entity:"Editar entidade",edit_action:"Editar a\xE7\xE3o",service_data:"Dados do servi\xE7o",add_artwork_override:"Adicionar substitui\xE7\xE3o"},labels:{dim_chips:"Escurecer chips em repouso",hold_to_pin:"Manter para fixar",always_show_group:"Grupo r\xE1pido por padr\xE3o",disable_autofocus:"Desativar autofoco",keep_filters:"Manter filtros",dismiss_on_play:"Fechar ao reproduzir",default_search_filter:"Filtro de pesquisa padr\xE3o",default_search_favorites:"Filtro de favoritos padr\xE3o",pin_headers:"Fixar cabe\xE7alhos",hide_search_headers_on_idle:"Ocultar cabe\xE7alhos em inatividade",disable_mass:"Desativar Mass Queue",match_theme:"Seguir tema",alt_progress:"Barra de progresso alternativa",display_timestamps:"Mostrar carimbos de tempo",swap_pause_stop:"Substituir Pausa por Stop",adaptive_controls:"Tamanho adaptativo",hide_active_entity:"Ocultar nome da entidade ativa",collapse_on_idle:"Contrair em repouso",hide_menu_player_toggle:"Ocultar leitor do menu",always_collapsed:"Sempre contra\xEDdo",expand_on_search:"Expandir ao procurar",script_var:"Vari\xE1vel script (yamp_entity)",use_ma_template:"Usar modelo MA",use_vol_template:"Usar modelo Volume",follow_active_entity:"Volume segue a entidade ativa",use_url_path:"Usar URL ou caminho",adaptive_text_elements:"Elementos de texto adaptativo",disable_auto_select:"Desativar sele\xE7\xE3o autom\xE1tica",always_show_lyrics:"Mostrar sempre as letras",lyrics_mode:"Modo de letras",lyrics_pre_roll:"Antecipa\xE7\xE3o de letra (segundos)",card_type:"Tipo de cart\xE3o"},fields:{artwork_fit:"Ajuste",artwork_position:"Posi\xE7\xE3o",artwork_hostname:"Host",match_field:"Campo",match_value:"Valor",size_percent:"Tamanho (%)",object_fit:"Object Fit",idle_timeout:"Repouso (ms)",show_chip_row:"Mostrar chips",search_limit:"Limite de procura",result_sorting:"Ordem",vol_step:"Passo de volume",card_height:"Altura (px)",control_layout:"Design",save_service_data:"Guardar",image_url:"URL imagem",fallback_image_url:"URL de reserva",move_to_main:"Mover para chips principais",move_to_menu:"Mover para o menu",delete_action:"Eliminar a\xE7\xE3o",revert_service_data:"Anular altera\xE7\xF5es",test_action:"Testar a\xE7\xE3o",volume_mode:"Modo volume",idle_screen:"Ecr\xE3 de repouso",name:"Nome",hidden_controls:"Controlos ocultos",ma_template:"Modelo MA (Jinja)",hidden_chips:"Chips ocultos",vol_template:"Modelo Volume (Jinja)",icon:"\xCDcone",action_type:"Tipo de a\xE7\xE3o",menu_item:"Item de menu",nav_path:"Caminho",service:"Servi\xE7o",service_data:"Dados",idle_image_entity:"Entidade imagem repouso",match_entity:"Entidade",ma_entity:"Entidade Music Assistant",vol_entity:"Entidade de volume",selected_entity_helper:"Helper de entidade selecionada",sync_entity_type:"Tipo de entidade a sincronizar",placement:"Posicionamento",card_trigger:"Gatilho do cart\xE3o",search_view:"Vista de resultados de pesquisa",search_card_columns:"Colunas de cart\xF5es",details_alignment:"Alinhamento de detalhes"},action_types:{menu:"Abrir um item do menu",service:"Chamar um servi\xE7o",navigate:"Navegar",prev_entity:"Chip da entidade anterior",next_entity:"Chip da pr\xF3xima entidade",sync_selected_entity:"Sincronizar entidade selecionada",select_entity:"Selecionar entidade do helper",toggle_lyrics:"Alternar sobreposi\xE7\xE3o de letras"},action_helpers:{sync_selected_entity:"Sincronizar entidade selecionada \u2192",select_entity:"Selecionar entidade \u2190",select_helper:"(selecionar helper)"},sync_entity_options:{yamp_entity:"yamp_entity (Entidade Music Assistant se configurada)",yamp_main_entity:"yamp_main_entity (Entidade principal do reprodutor)",yamp_playback_entity:"yamp_playback_entity (Entidade de reprodu\xE7\xE3o ativa atual)"},placements:{chip:"Chip de a\xE7\xE3o",menu:"No menu",hidden:"Oculto (Toque no Artwork)",not_triggerable:"N\xE3o acion\xE1vel"},triggers:{none:"Nenhum",tap:"Toque",hold:"Manter premido",double_tap:"Toque duplo",swipe_left:"Deslizar para a esquerda",swipe_right:"Deslizar para a direita"},search_view_options:{list:"Lista",card:"Cart\xE3o",card_minimal:"Cart\xE3o minimalista"},card_type_options:{default:"Padr\xE3o",search:"Procurar",group_players:"Agrupar"},artwork_fit:{default:"Padr\xE3o",cover:"Capa (padr\xE3o)",contain:"Conter",fill:"Preencher","scale-down":"Reduzir","scaled-contain":"Conter dimensionado","scaled-contain-alternate":"Conter dimensionado alternativo",none:"Nenhum"}},card:{sections:{details:"Detalhes de reprodu\xE7\xE3o",menu:"Menu e Procura",action_chips:"Chips de a\xE7\xE3o"},media_controls:{shuffle:"Aleat\xF3rio",previous:"Anterior",play_pause:"Reproduzir/Pausa",stop:"Parar",next:"Seguinte",repeat:"Repetir"},menu:{more_info:"Mais info",search:"Procurar",source:"Fonte",show_lyrics:"Mostrar letras",hide_lyrics:"Ocultar letras",transfer_queue:"Transferir fila",group_players:"Agrupar",select_entity:"Selecionar",transfer_to:"Transferir para",no_players:"Sem leitores MA."},grouping:{title:"Agrupar",sync_volume:"Sincronizar volume",group_all:"Agrupar todos",ungroup_all:"Separar todos",unavailable:"Indispon\xEDvel",no_players:"N\xE3o agrup\xE1vel.",master:"Mestre",joined:"Unido",available:"Dispon\xEDvel",current:"Atual",unjoin_from:"Desvincular de {master}",join_with:"Juntar-se a {master}"}},search:{favorites:"Favoritos",recently_played:"Recentes",next_up:"A seguir",recommendations:"Recomenda\xE7\xF5es",radio_mode:"Modo R\xE1dio",play_similar:"Tocar m\xFAsicas semelhantes",close:"Fechar",no_results:"Sem resultados.",play_next:"Reproduzir seguinte",replace_play:"Substituir e reproduzir",replace:"Substituir fila",add_queue:"Adicionar ao fim",move_up:"Subir",move_down:"Descer",move_next:"Passar para seguinte",remove:"Remover da fila",added:"Adicionado!",added_to_playlist:"Adicionado \xE0 playlist!",select_playlist:"Selecionar playlist para '{track}'",add_to_playlist:"Adicionar \xE0 playlist",select_track_for_playlist:"Selecionar a faixa a adicionar para '{track}' de {artist}",labels:{replace:"Substituir",next:"Seguinte",replace_next:"Subst. seg.",add:"Adicionar",add_to_playlist:"Adicionar \xE0 playlist"},results:"resultados",result:"resultado",filters:{all:"Tudo",artist:"Artista",album:"\xC1lbum",track:"Faixa",playlist:"Lista",radio:"R\xE1dio",music:"M\xFAsica",station:"Esta\xE7\xE3o",podcast:"Podcast",audiobook:"Audiolivro"},search_artist:"Procurar este artista",play_collection:"Reproduzir esta cole\xE7\xE3o",play_collection_error:"N\xE3o \xE9 poss\xEDvel reproduzir esta cole\xE7\xE3o diretamente",browse_album:"Explorar faixas de {album}",play_item:"Reproduzir {item}"},lyrics:{finding:"Procurando letra...",none_found:"Nenhuma letra encontrada",not_available:"Letra n\xE3o dispon\xEDvel"},lyrics_modes:{default:"Padr\xE3o (Destacar e rolar)",scroll:"Apenas rolar",text:"Apenas texto"}},$o={common:{not_found:"Entita sa nena\u0161la.",search:"H\u013Eada\u0165",power:"Nap\xE1janie",favorite:"Ob\u013E\xFAben\xE9",loading:"Na\u010D\xEDtava sa...",no_results:"\u017Diadne v\xFDsledky.",close:"Zatvori\u0165",vol_up:"Zv\xFD\u0161i\u0165 hlasitos\u0165",vol_down:"Zn\xED\u017Ei\u0165 hlasitos\u0165",media_player:"Prehr\xE1va\u010D m\xE9di\xED",edit_entity:"Upravi\u0165 nastavenia entity",edit_action:"Upravi\u0165 nastavenia akcie",mute:"Stlmi\u0165",unmute:"Zru\u0161i\u0165 stlmenie",seek:"Posun\xFA\u0165",volume:"Hlasitos\u0165",play_now:"Prehra\u0165 teraz",more_options:"Viac mo\u017Enost\xED",unavailable:"Nedostupn\xE9",back:"Sp\xE4\u0165",cancel:"Zru\u0161i\u0165",reset_default:"Obnovi\u0165 predvolen\xE9"},editor:{tabs:{entities:"Entity",behavior:"Spr\xE1vanie",look_and_feel:"Vzh\u013Ead a dojem",artwork:"Grafika",actions:"Akcie"},placeholders:{search:"H\u013Eada\u0165 hudbu..."},sections:{artwork:{general:{title:"V\u0161eobecn\xE9 nastavenia",description:"Glob\xE1lne ovl\xE1danie toho, ako sa grafika zobrazuje a z\xEDskava."},idle:{title:"Grafika pri ne\u010Dinnosti",description:"Zobrazi\u0165 statick\xFD obr\xE1zok alebo sn\xEDmku entity, ke\u010F sa ni\u010D neprehr\xE1va."},overrides:{title:"Prep\xEDsania grafiky",description:"Prep\xEDsania sa vyhodnocuj\xFA zhora nadol. Poradie zmen\xEDte potiahnut\xEDm."}},entities:{title:"Entity*",description:"Pridajte prehr\xE1va\u010De m\xE9di\xED, ktor\xE9 chcete ovl\xE1da\u0165. Potiahnut\xEDm ent\xEDt zmen\xEDte poradie v riadku \u010Dipov."},behavior:{idle_chips:{title:"Ne\u010Dinnos\u0165 a \u010Dipy",description:"Vyberte, kedy karta prejde do ne\u010Dinnosti a ako sa spr\xE1vaj\xFA \u010Dipy ent\xEDt."},interactions_search:{title:"Interakcie a h\u013Eadanie",description:"Doladenie prip\xEDnania ent\xEDt a po\u010Dtu zobrazen\xFDch v\xFDsledkov."},lyrics:{title:"Texty piesn\xED",description:"Nastavte, ako sa maj\xFA texty piesn\xED zobrazova\u0165 a kedy sa maj\xFA objavi\u0165."}},look_and_feel:{theme_layout:{title:"T\xE9ma a rozlo\u017Eenie",description:"Prisp\xF4sobte \u0161t\xFDl panelu a ovl\xE1dajte celkov\xFD vzh\u013Ead."},controls_typography:{title:"Ovl\xE1danie a typografia",description:"Nastavenie ve\u013Ekosti tla\u010Didiel, \u0161t\xEDtkov ent\xEDt a adapt\xEDvneho textu."},collapsed_idle:{title:"Zbalen\xE9 stavy a ne\u010Dinnos\u0165",description:"Ovl\xE1dajte, kedy sa karta zbal\xED a ktor\xE9 zobrazenia sa uk\xE1\u017Eu po\u010Das ne\u010Dinnosti."}},actions:{title:"Akcie",description:"Vytvorte ak\u010Dn\xE9 \u010Dipy, ktor\xE9 sa zobrazia na karte alebo v jej menu. Potiahnut\xEDm zmen\xEDte poradie, kliknut\xEDm na ceruzku akciu nakonfigurujete."}},subtitles:{idle_timeout:"\u010Cas v milisekund\xE1ch, k\xFDm karta prejde do re\u017Eimu ne\u010Dinnosti. Nastavte na 0 pre vypnutie.",show_chip_row:'"Auto" skryje riadok \u010Dipov, ak je nakonfigurovan\xE1 len jedna entita. "V menu" presunie \u010Dipy do ponuky menu. "V menu pri ne\u010Dinnosti" zobraz\xED \u010Dipy v riadku ke\u010F je akt\xEDvne, ale presunie ich do menu pri ne\u010Dinnosti.',dim_chips:"Ke\u010F karta prejde do re\u017Eimu ne\u010Dinnosti s obr\xE1zkom, stlmte \u010Dipy ent\xEDt a akci\xED pre \u010Distej\u0161\xED vzh\u013Ead.",hold_to_pin:"Dlh\xFDm stla\u010Den\xEDm \u010Dipov ent\xEDt ich pripnete, \u010D\xEDm zabr\xE1nite automatick\xE9mu prep\xEDnaniu po\u010Das prehr\xE1vania.",always_show_group:"Ovl\xE1dacie prvky r\xFDchleho zoskupovania (+/-/hviezdi\u010Dka) bud\xFA predvolene vidite\u013En\xE9 pri na\u010D\xEDtan\xED str\xE1nky. St\xE1le ich m\xF4\u017Eete manu\xE1lne prep\xEDna\u0165 dvojit\xFDm klepnut\xEDm.",disable_autofocus:"Zabr\xE1ni vyh\u013Ead\xE1vaciemu po\u013Eu prebra\u0165 zameranie, aby zostali kl\xE1vesnice na obrazovke skryt\xE9.",search_within_filter:"Povoli\u0165 vyh\u013Ead\xE1vanie v r\xE1mci aktu\xE1lneho akt\xEDvneho filtra (Ob\u013E\xFAben\xE9, Ned\xE1vno prehr\xE1van\xE9 at\u010F.) namiesto jeho vymazania.",close_search_on_play:"Automaticky zatvori\u0165 obrazovku vyh\u013Ead\xE1vania po spusten\xED skladby.",pin_search_headers:"Ponecha\u0165 pole vyh\u013Ead\xE1vania a filtre pevne navrchu po\u010Das pos\xFAvania v\xFDsledkov.",hide_search_headers_on_idle:"Skry\u0165 vyh\u013Ead\xE1vanie a filtre, ke\u010F je prehr\xE1va\u010D ne\u010Dinn\xFD.",disable_mass:"Deaktivova\u0165 volite\u013En\xFA integr\xE1ciu Mass Queue, aj ke\u010F je nain\u0161talovan\xE1.",swap_pause_stop:"Nahradi\u0165 tla\u010Didlo pauzy tla\u010Didlom zastavenia pri pou\u017Eit\xED modern\xE9ho rozlo\u017Eenia.",adaptive_controls:"Umo\u017Eni\u0165 tla\u010Didl\xE1m prehr\xE1vania meni\u0165 ve\u013Ekos\u0165 pod\u013Ea dostupn\xE9ho priestoru.",hide_menu_player:"Ke\u010F s\xFA \u010Dipy v menu, skry\u0165 n\xE1zov entity v spodnej \u010Dasti karty.",adaptive_text:"Vyberte skupiny textu, ktor\xE9 sa maj\xFA \u0161k\xE1lova\u0165 pod\u013Ea priestoru (nechajte pr\xE1zdne pre vypnutie).",collapse_expand:'"V\u017Edy zbalen\xE9" vytvor\xED re\u017Eim mini prehr\xE1va\u010Da. "Rozbali\u0165 pri h\u013Eadan\xED" kartu do\u010Dasne rozbal\xED pri vyh\u013Ead\xE1van\xED.',idle_screen:"Vyberte obrazovku, ktor\xE1 sa m\xE1 automaticky zobrazi\u0165 v re\u017Eime ne\u010Dinnosti.",hide_controls:"Vyberte ovl\xE1dacie prvky, ktor\xE9 chcete pre t\xFAto entitu skry\u0165 (\u0161tandardne s\xFA zobrazen\xE9 v\u0161etky).",hide_search_chips:"Skry\u0165 konkr\xE9tne \u010Dipy filtra vyh\u013Ead\xE1vania pre t\xFAto entitu.",follow_active_entity:"Ak je povolen\xE9, entita hlasitosti bude automaticky sledova\u0165 akt\xEDvny prehr\xE1va\u010D. Pozn\xE1mka: Toto prep\xED\u0161e vybran\xFA entitu hlasitosti.",search_limit_full:"Maxim\xE1lny po\u010Det v\xFDsledkov vyh\u013Ead\xE1vania (1-1000, predvolen\xE9: 20).",default_search_filter_full:"Vyberte, ktor\xFD filter bude predvolene akt\xEDvny pri otvoren\xED vyh\u013Ead\xE1vania.",default_search_favorites:"Spusti\u0165 vyh\u013Ead\xE1vanie s akt\xEDvnymi ob\u013E\xFAben\xFDmi",result_sorting_full:"Vyberte sp\xF4sob zoradenia v\xFDsledkov. Predvolen\xE9 ponech\xE1va poradie zo zdroja.",card_height_full:"Nechajte pr\xE1zdne pre automatick\xFA v\xFD\u0161ku.",control_layout_full:"Vyberte si medzi star\u0161\xEDm (rovnako ve\u013Ek\xE9 prvky) alebo modern\xFDm rozlo\u017Een\xEDm Home Assistant.",artwork_extend:"Umo\u017Eni\u0165 pozadiu grafiky pokra\u010Dova\u0165 pod riadkami \u010Dipov a akci\xED.",artwork_extend_label:"Roz\u0161\xEDri\u0165 grafiku",no_artwork_overrides:"Nie s\xFA nastaven\xE9 \u017Eiadne prep\xEDsania grafiky. Pridajte ich pomocou tla\u010Didla plus.",entity_current_hint:"Pou\u017Eite 'entity_id: current' na zacielenie aktu\xE1lne vybranej entity na karte. Pozn\xE1mka: Tla\u010Didlo 'Testova\u0165 akciu' bude v tomto pr\xEDpade neakt\xEDvne.",service_data_note:"Zmeny v servisn\xFDch \xFAdajoch sa neulo\u017Eia, k\xFDm nekliknete na tla\u010Didlo 'Ulo\u017Ei\u0165 servisn\xE9 \xFAdaje'!",jinja_template_hint:"Zadajte Jinja \u0161abl\xF3nu, ktor\xE1 vr\xE1ti jedno entity_id. Pr\xEDklad prep\xEDnania MA na z\xE1klade v\xFDberu zdroja:",jinja_template_vol_hint:"Zadajte Jinja \u0161abl\xF3nu, ktor\xE1 vr\xE1ti entity_id (napr. media_player.obyvacka). Pr\xEDklad prep\xEDnania hlasitosti pod\u013Ea stavu:",not_available_alt_collapsed:"Nedostupn\xE9 s alternat\xEDvnym indik\xE1torom priebehu alebo v re\u017Eime V\u017Edy zbalen\xE9.",not_available_collapsed:"Nedostupn\xE9, ke\u010F je zapnut\xE9 V\u017Edy zbalen\xE9.",only_available_collapsed:"Dostupn\xE9 len pri zapnutom re\u017Eime V\u017Edy zbalen\xE9.",only_available_modern:"Dostupn\xE9 len s modern\xFDm rozlo\u017Een\xEDm.",image_url_helper:"Zadajte priamu URL na obr\xE1zok alebo lok\xE1lnu cestu k s\xFAboru",selected_entity_helper:"Pomocn\xEDk pre vstupn\xFD text, ktor\xFD bude aktualizovan\xFD o ID aktu\xE1lne vybranej entity prehr\xE1va\u010Da m\xE9di\xED.",select_entity_helper:"Pomocn\xEDk pre vstupn\xFD text, z ktor\xE9ho sa \u010D\xEDta ID entity. Karta automaticky vyberie zodpovedaj\xFAci \u010Dip.",sync_entity_type:"Vyberte, ktor\xE9 ID entity sa m\xE1 synchronizova\u0165 s pomocn\xEDkom (predvolene entita Music Assistant, ak je nakonfigurovan\xE1).",disable_auto_select:"Zabr\xE1ni automatick\xE9mu v\xFDberu \u010Dipu tejto entity pri spusten\xED prehr\xE1vania.",search_view:"Vyberte si medzi \u0161tandardn\xFDm zoznamom alebo mrie\u017Ekou kariet pre v\xFDsledky vyh\u013Ead\xE1vania.",search_card_columns:"Zadajte, ko\u013Eko st\u013Apcov sa m\xE1 pou\u017Ei\u0165 v zobrazen\xED karty. Grafika sa automaticky prisp\xF4sob\xED.",card_type:"Vyberte re\u017Eim karty. 'Predvolen\xE9' je \u0161tandardn\xFD prehr\xE1va\u010D m\xE9di\xED. 'Vyhraden\xE9 vyh\u013Ead\xE1vanie' urob\xED z karty trval\xE9 rozhranie na vyh\u013Ead\xE1vanie.",always_show_lyrics:"Automaticky otvori\u0165 zobrazenie textov piesn\xED pri obnoven\xED str\xE1nky.",lyrics_pre_roll:"Posunutie na\u010Dasovania zv\xFDraznenia textu piesne. Kladn\xE9 hodnoty ho zr\xFDch\u013Euj\xFA, z\xE1porn\xE9 spoma\u013Euj\xFA (predvolen\xE9: 0)."},titles:{edit_entity:"Upravi\u0165 entitu",edit_action:"Upravi\u0165 akciu",service_data:"Servisn\xE9 \xFAdaje",add_artwork_override:"Prida\u0165 prep\xEDsanie grafiky"},labels:{dim_chips:"Stlmi\u0165 \u010Dipy pri ne\u010Dinnosti",hold_to_pin:"Podr\u017Ea\u0165 pre pripnutie",always_show_group:"R\xFDchle zoskupovanie ako predvolen\xE9",disable_autofocus:"Vypn\xFA\u0165 automatick\xE9 zameranie h\u013Eadania",keep_filters:"Zachova\u0165 filtre pri h\u013Eadan\xED",dismiss_on_play:"Zavrie\u0165 h\u013Eadanie po spusten\xED",default_search_filter:"Predvolen\xFD filter vyh\u013Ead\xE1vania",default_search_favorites:"Predvolen\xFD filter ob\u013E\xFAben\xFDch",pin_headers:"Pripn\xFA\u0165 hlavi\u010Dky h\u013Eadania",hide_search_headers_on_idle:"Skry\u0165 hlavi\u010Dky pri ne\u010Dinnosti",disable_mass:"Deaktivova\u0165 Mass Queue",match_theme:"Pod\u013Ea t\xE9my",alt_progress:"Alternat\xEDvny indik\xE1tor priebehu",display_timestamps:"Zobrazi\u0165 \u010Dasov\xE9 \xFAdaje",swap_pause_stop:"Vymeni\u0165 pauzu za stop",adaptive_controls:"Adapt\xEDvna ve\u013Ekos\u0165 ovl\xE1dania",hide_active_entity:"Skry\u0165 \u0161t\xEDtok akt\xEDvnej entity",collapse_on_idle:"Zbali\u0165 pri ne\u010Dinnosti",hide_menu_player_toggle:"Skry\u0165 prehr\xE1va\u010D v menu",always_collapsed:"V\u017Edy zbalen\xE9",expand_on_search:"Rozbali\u0165 pri h\u013Eadan\xED",script_var:"Premenn\xE1 skriptu (yamp_entity)",use_ma_template:"Pou\u017Ei\u0165 \u0161abl\xF3nu pre Music Assistant",use_vol_template:"Pou\u017Ei\u0165 \u0161abl\xF3nu pre entitu hlasitosti",follow_active_entity:"Hlasitos\u0165 sleduje akt\xEDvnu entitu",use_url_path:"Pou\u017Ei\u0165 URL alebo cestu",adaptive_text_elements:"Prvky s adapt\xEDvnou ve\u013Ekos\u0165ou textu",disable_auto_select:"Zak\xE1za\u0165 automatick\xFD v\xFDber",always_show_lyrics:"V\u017Edy zobrazi\u0165 texty piesn\xED",lyrics_mode:"Re\u017Eim textov piesn\xED",lyrics_pre_roll:"Pre-roll textu piesne (sekundy)",card_type:"Typ karty"},fields:{artwork_fit:"Prisp\xF4sobenie grafiky",artwork_position:"Poz\xEDcia grafiky",artwork_hostname:"Hostname pre grafiku",match_field:"Pole pre zhodu",match_value:"Hodnota pre zhodu",size_percent:"Ve\u013Ekos\u0165 (%)",object_fit:"Prisp\xF4sobenie objektu (Fit)",idle_timeout:"\u010Cas ne\u010Dinnosti (ms)",show_chip_row:"Zobrazi\u0165 riadok \u010Dipov",search_limit:"Limit v\xFDsledkov h\u013Eadania",result_sorting:"Zoradenie v\xFDsledkov",vol_step:"Krok hlasitosti (0.05 = 5%)",card_height:"V\xFD\u0161ka karty (px)",control_layout:"Rozlo\u017Eenie ovl\xE1dania",save_service_data:"Ulo\u017Ei\u0165 servisn\xE9 \xFAdaje",image_url:"URL obr\xE1zka",fallback_image_url:"Z\xE1lo\u017En\xE1 URL obr\xE1zka",move_to_main:"Presun\xFA\u0165 do hlavn\xFDch \u010Dipov",move_to_menu:"Presun\xFA\u0165 do menu",delete_action:"Vymaza\u0165 akciu",revert_service_data:"Vr\xE1ti\u0165 ulo\u017Een\xE9 servisn\xE9 \xFAdaje",test_action:"Testova\u0165 akciu",volume_mode:"Re\u017Eim hlasitosti",idle_screen:"Obrazovka pri ne\u010Dinnosti",name:"N\xE1zov",hidden_controls:"Skryt\xE9 ovl\xE1dacie prvky",ma_template:"Jinja \u0161abl\xF3na pre Music Assistant",hidden_chips:"Skryt\xE9 \u010Dipy filtrov h\u013Eadania",vol_template:"Jinja \u0161abl\xF3na pre hlasitos\u0165",icon:"Ikona",action_type:"Typ akcie",menu_item:"Polo\u017Eka menu",nav_path:"Cesta navig\xE1cie",service:"Slu\u017Eba",service_data:"Servisn\xE9 \xFAdaje",idle_image_entity:"Entita obr\xE1zka pri ne\u010Dinnosti",match_entity:"Entita pre zhodu",ma_entity:"Entita Music Assistant",vol_entity:"Entita hlasitosti",selected_entity_helper:"Pomocn\xEDk vybratej entity",sync_entity_type:"Typ entity na synchroniz\xE1ciu",placement:"Umiestnenie",card_trigger:"Sp\xFA\u0161\u0165a\u010D karty",search_view:"Zobrazenie v\xFDsledkov vyh\u013Ead\xE1vania",search_card_columns:"St\u013Apce karty",details_alignment:"Zarovnanie detailov"},action_types:{menu:"Otvori\u0165 polo\u017Eku menu karty",service:"Zavola\u0165 slu\u017Ebu",navigate:"Navigova\u0165",prev_entity:"Predo\u0161l\xFD \u010Dip entity",next_entity:"\u010Eal\u0161\xED \u010Dip entity",sync_selected_entity:"Synchronizova\u0165 vybran\xFA entitu",select_entity:"Vybra\u0165 entitu z pomocn\xEDka",toggle_lyrics:"Prepn\xFA\u0165 prekrytie textov piesn\xED"},action_helpers:{sync_selected_entity:"Synchronizova\u0165 vybran\xFA entitu \u2192",select_entity:"Vybra\u0165 entitu \u2190",select_helper:"(vybra\u0165 pomocn\xEDka)"},sync_entity_options:{yamp_entity:"yamp_entity (Entita Music Assistant, ak je nakonfigurovan\xE1)",yamp_main_entity:"yamp_main_entity (Hlavn\xE1 entita prehr\xE1va\u010Da m\xE9di\xED)",yamp_playback_entity:"yamp_playback_entity (Aktu\xE1lna akt\xEDvna entita prehr\xE1vania)"},placements:{chip:"Ak\u010Dn\xFD \u010Dip",menu:"V menu",hidden:"Skryt\xE9 (\u0164uknutie na grafiku)",not_triggerable:"Nespustite\u013En\xE9"},triggers:{none:"\u017Diadny",tap:"\u0164uknutie",hold:"Podr\u017Eanie",double_tap:"Dvojit\xE9 \u0165uknutie",swipe_left:"Potiahnutie do\u013Eava",swipe_right:"Potiahnutie doprava"},search_view_options:{list:"Zoznam",card:"Karta",card_minimal:"Minim\xE1lna karta"},card_type_options:{default:"Predvolen\xE9",search:"H\u013Eada\u0165",group_players:"Zoskupi\u0165 prehr\xE1va\u010De"},artwork_fit:{default:"Predvolen\xE9",cover:"Obal (predvolen\xE9)",contain:"Prisp\xF4sobi\u0165",fill:"Vyplni\u0165","scale-down":"Zmen\u0161i\u0165","scaled-contain":"\u0160k\xE1lovan\xE9 prisp\xF4sobenie","scaled-contain-alternate":"\u0160k\xE1lovan\xE9 prisp\xF4sobenie alternat\xEDvne",none:"\u017Diadne"}},card:{sections:{details:"Detaily prehr\xE1vania",menu:"Menu a vyh\u013Ead\xE1vanie",action_chips:"Ak\u010Dn\xE9 \u010Dipy"},media_controls:{shuffle:"N\xE1hodne",previous:"Predch\xE1dzaj\xFAce",play_pause:"Prehra\u0165/Pozastavi\u0165",stop:"Zastavi\u0165",next:"Nasleduj\xFAce",repeat:"Opakova\u0165"},menu:{more_info:"Viac inform\xE1ci\xED",search:"H\u013Eada\u0165",source:"Zdroj",show_lyrics:"Zobrazi\u0165 text piesne",hide_lyrics:"Skry\u0165 text piesne",transfer_queue:"Presun\xFA\u0165 frontu",group_players:"Zoskupi\u0165 prehr\xE1va\u010De",select_entity:"Vyberte entitu pre viac info",transfer_to:"Presun\xFA\u0165 frontu do",no_players:"\u017Diadne in\xE9 prehr\xE1va\u010De Music Assistant nie s\xFA k dispoz\xEDcii."},grouping:{title:"Zoskupi\u0165 prehr\xE1va\u010De",sync_volume:"Synchronizova\u0165 hlasitos\u0165",group_all:"Zoskupi\u0165 v\u0161etko",ungroup_all:"Zru\u0161i\u0165 zoskupenie v\u0161etk\xE9ho",unavailable:"Prehr\xE1va\u010D je nedostupn\xFD",no_players:"\u017Diadne in\xE9 prehr\xE1va\u010De schopn\xE9 zoskupenia nie s\xFA k dispoz\xEDcii.",master:"Hlavn\xFD (Master)",joined:"Pripojen\xFD",available:"Dostupn\xFD",current:"Aktu\xE1lny",unjoin_from:"Odpoji\u0165 od {master}",join_with:"Pripoji\u0165 k {master}"}},search:{favorites:"Ob\u013E\xFAben\xE9",recently_played:"Ned\xE1vno prehr\xE1van\xE9",next_up:"Nasleduj\xFAce",recommendations:"Odpor\xFA\u010Dania",radio_mode:"Re\u017Eim r\xE1dio",play_similar:"Prehra\u0165 podobn\xE9 skladby",close:"Zatvori\u0165 vyh\u013Ead\xE1vanie",no_results:"\u017Diadne v\xFDsledky.",play_next:"Prehra\u0165 ako nasleduj\xFAce",replace_play:"Nahradi\u0165 frontu a prehra\u0165 teraz",replace:"Nahradi\u0165 frontu",add_queue:"Prida\u0165 na koniec fronty",move_up:"Posun\xFA\u0165 nahor",move_down:"Posun\xFA\u0165 nadol",move_next:"Presun\xFA\u0165 na nasleduj\xFAce",remove:"Odstr\xE1ni\u0165 z fronty",added:"Pridan\xE9 do fronty!",added_to_playlist:"Pridan\xE9 do playlistu!",select_playlist:"Vybra\u0165 playlist pre '{track}'",add_to_playlist:"Prida\u0165 do playlistu",select_track_for_playlist:"Vybra\u0165 skladbu na pridanie pre '{track}' od {artist}",labels:{replace:"Nahradi\u0165",next:"Nasleduj\xFAce",replace_next:"Nahradi\u0165 nasleduj\xFAce",add:"Prida\u0165",add_to_playlist:"Prida\u0165 do playlistu"},results:"v\xFDsledkov",result:"v\xFDsledok",filters:{all:"V\u0161etko",artist:"Interpret",album:"Album",track:"Skladba",playlist:"Playlist",radio:"R\xE1dio",music:"Hudba",station:"Stanica",podcast:"Podcast",audiobook:"Audiokniha"},search_artist:"H\u013Eada\u0165 tohto interpreta",play_collection:"Prehra\u0165 t\xFAto kolekciu",play_collection_error:"T\xFAto kolekciu nie je mo\u017En\xE9 prehra\u0165 priamo",browse_album:"Preh\u013Ead\xE1va\u0165 skladby z {album}",play_item:"Prehra\u0165 {item}"},lyrics:{finding:"H\u013Eadanie textu piesne...",none_found:"\u017Diadny text piesne sa nena\u0161iel",not_available:"Text piesne nie je k dispoz\xEDcii"},lyrics_modes:{default:"Predvolen\xE9 (Zv\xFDrazni\u0165 a pos\xFAva\u0165)",scroll:"Len pos\xFAva\u0165",text:"Len text"}},Io={common:{not_found:"Entiteta ni najdena.",search:"I\u0161\u010Di",power:"Napajanje",favorite:"Priljubljeno",loading:"Nalaganje...",no_results:"Ni rezultatov.",close:"Zapri",vol_up:"Pove\u010Daj glasnost",vol_down:"Zmanj\u0161aj glasnost",media_player:"Predvajalnik predstavnosti",edit_entity:"Uredi nastavitve entitete",edit_action:"Uredi nastavitve dejanja",mute:"Uti\u0161aj",unmute:"Vklopi zvok",seek:"Previj",volume:"Glasnost",play_now:"Predvajaj zdaj",more_options:"Ve\u010D mo\u017Enosti",unavailable:"Ni na voljo",back:"Nazaj",cancel:"Prekli\u010Di",reset_default:"Ponastavi na privzeto"},editor:{tabs:{entities:"Entitete",behavior:"Vedenje",look_and_feel:"Videz in ob\u010Dutek",artwork:"Grafika",actions:"Dejanja"},placeholders:{search:"I\u0161\u010Di glasbo..."},sections:{artwork:{general:{title:"Splo\u0161ne nastavitve",description:"Globalni nadzor nad prikazom in pridobivanjem grafike."},idle:{title:"Grafika v mirovanju",description:"Prika\u017Ei stati\u010Dno sliko ali posnetek entitete, ko se ni\u010D ne predvaja."},overrides:{title:"Prepis grafike",description:"Prepisi se ocenjujejo od zgoraj navzdol. Povlecite za spremembo vrstnega reda."}},entities:{title:"Entitete*",description:"Dodajte predvajalnike, ki jih \u017Eelite upravljati. Povlecite entitete za spremembo vrstnega reda."},behavior:{idle_chips:{title:"Mirovanje in \u010Dipi",description:"Izberite, kdaj kartica preide v mirovanje in kako se obna\u0161ajo \u010Dipi entitet."},interactions_search:{title:"Interakcije in iskanje",description:"Nastavite pripenjanje entitet in \u0161tevilo prikazanih rezultatov."},lyrics:{title:"Besedila",description:"Konfigurirajte, kako so besedila prikazana in kdaj se pojavijo."}},look_and_feel:{theme_layout:{title:"Tema in postavitev",description:"Ujemanje s slogom nadzorne plo\u0161\u010De in nadzor velikosti."},controls_typography:{title:"Kontrolniki in tipografija",description:"Prilagodite velikost gumbov, oznake entitet in prilagodljivo besedilo."},collapsed_idle:{title:"Strnjeno in mirovanje",description:"Nadzorujte, kdaj se kartica skr\u010Di in kaj se prika\u017Ee v mirovanju."}},actions:{title:"Dejanja",description:"Ustvarite \u010Dipe dejanj, ki se prika\u017Eejo na kartici ali v meniju."}},subtitles:{idle_timeout:"\u010Cas v milisekundah, preden kartica preide v mirovanje. Nastavite na 0 za izklop.",show_chip_row:'"Samodejno" skrije \u010Dipe, \u010De je nastavljena ena entiteta. "V meniju" jih premakne v meni. "V meniju med nedejavnostjo" prika\u017Ee \u010Dipe v vrstici, ko je aktivna, a jih premakne v meni med nedejavnostjo.',dim_chips:"Ko kartica preide v mirovanje s sliko, se \u010Dipi zatemnijo.",hold_to_pin:"Dolgi pritisk za pripenjanje entitet namesto kratkega.",always_show_group:"Kontrolni elementi za hitro zdru\u017Eevanje (+/-/zvezda) bodo privzeto vidni ob nalaganju strani. \u0160e vedno jih lahko ro\u010Dno preklopite z dvojnim tapom.",disable_autofocus:"Prepre\u010Di samodejni fokus iskalnega polja.",search_within_filter:"I\u0161\u010Di znotraj trenutnega filtra.",close_search_on_play:"Samodejno zapri iskanje ob predvajanju.",pin_search_headers:"Pripni iskalno polje in filtre na vrh.",hide_search_headers_on_idle:"Skrij iskalno polje in filtre med mirovanjem.",disable_mass:"Onemogo\u010Di integracijo Mass Queue.",swap_pause_stop:"Zamenjaj gumb pavze z gumbom zaustavitve med uporabo moderne postavitve.",adaptive_controls:"Prilagodi velikost gumbov glede na prostor.",hide_menu_player:"Skrij oznako entitete v meniju.",adaptive_text:"Izberi skupine besedila za prilagajanje velikosti.",collapse_expand:"Vedno skr\u010Deno ustvari mini predvajalnik.",idle_screen:"Izberi zaslon, prikazan v mirovanju.",hide_controls:"Izberi kontrolnike za skrivanje.",hide_search_chips:"Skrij dolo\u010Dene iskalne filtre.",follow_active_entity:"Entiteta glasnosti sledi aktivni entiteti. Opomba: To prepi\u0161e izbrano entiteto za glasnost.",search_limit_full:"Najve\u010Dje \u0161tevilo rezultatov (1\u20131000, privzeto: 20).",default_search_filter_full:"Izberite, kateri filter je privzeto aktiven ob odprtju iskanja.",default_search_favorites:"Za\u010Dni iskanje z aktivnimi priljubljenimi",result_sorting_full:"Izberi razvr\u0161\u010Danje rezultatov.",card_height_full:"Pustite prazno za samodejno vi\u0161ino.",control_layout_full:"Izberi med staro in moderno postavitvijo.",artwork_extend:"Raz\u0161iri ozadje grafike pod \u010Dipe.",artwork_extend_label:"Raz\u0161iri grafiko",no_artwork_overrides:"Ni nastavljenih prepisov grafike.",entity_current_hint:"Uporabi entity_id: current za trenutno izbrano entiteto.",service_data_note:"Spremembe se shranijo \u0161ele ob kliku na ikono shrani.",jinja_template_hint:"Vnesite Jinja predlogo, ki vrne en entity_id.",jinja_template_vol_hint:"Vnesite Jinja predlogo za entiteto glasnosti.",not_available_alt_collapsed:"Ni na voljo z alternativno vrstico napredka.",not_available_collapsed:"Ni na voljo v vedno skr\u010Denem na\u010Dinu.",only_available_collapsed:"Na voljo le v vedno skr\u010Denem na\u010Dinu.",only_available_modern:"Na voljo le v moderni postavitvi.",image_url_helper:"Vnesite neposredni URL do slike ali lokalno pot do datoteke",selected_entity_helper:"Pomo\u010Dnik za vnos besedila, ki bo posodobljen z ID-jem trenutno izbranega predvajalnika medijev.",select_entity_helper:"Pomo\u010Dnik za vnos besedila, iz katerega se bere ID entitete. Kartica bo samodejno izbrala ustrezni \u010Dip.",sync_entity_type:"Izberite, kateri ID entitete \u017Eelite sinhronizirati s pomo\u010Dnikom (privzeto entiteto Music Assistant, \u010De je nastavljena).",disable_auto_select:"Prepre\u010Di samodejno izbiro \u010Dipa te entitete ob za\u010Detku predvajanja.",search_view:"Izberite med standardnim seznamom ali mre\u017Eo kartic za rezultate iskanja.",search_card_columns:"Dolo\u010Dite \u0161tevilo stolpcev v pogledu kartic. Grafika se bo samodejno prilagodila.",card_type:"Izberite na\u010Din kartice. 'Privzeto' je standardni medijski predvajalnik. 'Namensko iskanje' spremeni kartico v trajen iskalni vmesnik.",always_show_lyrics:"Samodejno odprite pogled besedila, ko se stran osve\u017Ei.",lyrics_pre_roll:"Zamaknite \u010Dasovno uskladitev ozna\u010Devanja besedila. Pozitivne vrednosti ga pospe\u0161ijo, negativne pa upo\u010Dasnijo (privzeto: 0)."},titles:{edit_entity:"Uredi entiteto",edit_action:"Uredi dejanje",service_data:"Podatki storitve",add_artwork_override:"Dodaj prepis grafike"},labels:{dim_chips:"Zatemni \u010Dipe v mirovanju",hold_to_pin:"Dr\u017Ei za pripenjanje",always_show_group:"Hitro zdru\u017Eevanje kot privzeto",disable_autofocus:"Onemogo\u010Di samodejni fokus",keep_filters:"Ohrani filtre",dismiss_on_play:"Zapri iskanje ob predvajanju",default_search_filter:"Privzeti iskalni filter",default_search_favorites:"Privzeti filter priljubljenih",pin_headers:"Pripni glave iskanja",hide_search_headers_on_idle:"Skrij glave iskanja med mirovanjem",disable_mass:"Onemogo\u010Di Mass Queue",match_theme:"Ujemaj temo",alt_progress:"Alternativna vrstica napredka",display_timestamps:"Prika\u017Ei \u010Dasovne oznake",swap_pause_stop:"Zamenjaj pavzo z zaustavitvijo",adaptive_controls:"Prilagodljiva velikost gumbov",hide_active_entity:"Skrij oznako aktivne entitete",collapse_on_idle:"Skr\u010Di v mirovanju",hide_menu_player_toggle:"Skrij predvajalnik v meniju",always_collapsed:"Vedno skr\u010Deno",expand_on_search:"Raz\u0161iri ob iskanju",script_var:"Skriptna spremenljivka",use_ma_template:"Uporabi predlogo za entiteto Music Assistant",use_vol_template:"Uporabi predlogo za glasnost",follow_active_entity:"Glasnost sledi aktivni entiteti",use_url_path:"Uporabi URL ali pot",adaptive_text_elements:"Elementi za prilagajanje velikosti besedila",disable_auto_select:"Onemogo\u010Di samodejno izbiro",always_show_lyrics:"Vedno prika\u017Ei besedilo",lyrics_mode:"Na\u010Din besedila",lyrics_pre_roll:"Pre-roll besedila (sekunde)",card_type:"Vrsta kartice"},fields:{artwork_fit:"Prileganje grafike",artwork_position:"Polo\u017Eaj grafike",artwork_hostname:"Ime gostitelja grafike",match_field:"Polje ujemanja",match_value:"Vrednost ujemanja",size_percent:"Velikost (%)",object_fit:"Prileganje objekta",idle_timeout:"\u010Cas mirovanja (ms)",show_chip_row:"Prika\u017Ei vrstico \u010Dipov",search_limit:"Omejitev rezultatov iskanja",result_sorting:"Razvr\u0161\u010Danje rezultatov",vol_step:"Korak glasnosti (0.05 = 5 %)",card_height:"Vi\u0161ina kartice (px)",control_layout:"Postavitev kontrolnikov",save_service_data:"Shrani podatke storitve",image_url:"URL slike",fallback_image_url:"Rezervni URL slike",move_to_main:"Premakni dejanje na glavno vrstico",move_to_menu:"Premakni dejanje v meni",delete_action:"Izbri\u0161i dejanje",revert_service_data:"Povrni shranjene podatke",test_action:"Preizkusi dejanje",volume_mode:"Na\u010Din glasnosti",idle_screen:"Zaslon v mirovanju",name:"Ime",hidden_controls:"Skriti kontrolniki",ma_template:"Predloga Music Assistant (Jinja)",hidden_chips:"Skriti iskalni \u010Dipi",vol_template:"Predloga entitete glasnosti (Jinja)",icon:"Ikona",action_type:"Vrsta dejanja",menu_item:"Element menija",nav_path:"Navigacijska pot",service:"Storitev",service_data:"Podatki storitve",idle_image_entity:"Entiteta slike v mirovanju",match_entity:"Ujemajo\u010Da entiteta",ma_entity:"Entiteta Music Assistant",vol_entity:"Entiteta glasnosti",selected_entity_helper:"Pomo\u010Dnik izbrane entitete",sync_entity_type:"Vrsta entitete za sinhronizacijo",placement:"Namestitev",card_trigger:"Spro\u017Eilec kartice",search_view:"Pogled rezultatov iskanja",search_card_columns:"Stolpci kartic",details_alignment:"Poravnava podrobnosti"},action_types:{menu:"Odpri element menija kartice",service:"Pokli\u010Di storitev",navigate:"Navigiraj",prev_entity:"Prej\u0161nji \u010Dip entitete",next_entity:"Naslednji \u010Dip entitete",sync_selected_entity:"Sinhroniziraj izbrano entiteto",select_entity:"Izberi entiteto iz pomo\u010Dnika",toggle_lyrics:"Preklopi prekrivanje besedila"},action_helpers:{sync_selected_entity:"Sinhroniziraj izbrano entiteto \u2192",select_entity:"Izberi entiteto \u2190",select_helper:"(izberite pomo\u010Dnika)"},sync_entity_options:{yamp_entity:"yamp_entity (entiteta Music Assistant, \u010De je nastavljena)",yamp_main_entity:"yamp_main_entity (glavna entiteta predvajalnika medijev)",yamp_playback_entity:"yamp_playback_entity (trenutno aktivna entitea predvajanja)"},placements:{chip:"\u010Cip dejanja",menu:"V meniju",hidden:"Skrito (dotik grafike)",not_triggerable:"Ni mogo\u010De spro\u017Eiti"},triggers:{none:"Brez",tap:"Dotik",hold:"Pridr\u017Eanje",double_tap:"Dvojni dotik",swipe_left:"Podrsaj levo",swipe_right:"Podrsaj desno"},search_view_options:{list:"Seznam",card:"Kartica",card_minimal:"Minimalna kartica"},card_type_options:{default:"Privzeto",search:"Iskanje",group_players:"Zoskupi predvajalnike"},artwork_fit:{default:"Privzeto",cover:"Ovitek (privzeto)",contain:"Prilagodi",fill:"Zapolni","scale-down":"Pomanj\u0161aj","scaled-contain":"Pomanj\u0161ano prilagodi","scaled-contain-alternate":"Pomanj\u0161ano prilagodi alternativno",none:"Brez"}},card:{sections:{details:"Podrobnosti predvajanja",menu:"Meni in iskanje",action_chips:"\u010Cipi dejanj"},media_controls:{shuffle:"Naklju\u010Dno",previous:"Prej\u0161nje",play_pause:"Predvajaj/Pavza",stop:"Ustavi",next:"Naslednje",repeat:"Ponovi"},menu:{more_info:"Ve\u010D informacij",search:"I\u0161\u010Di",source:"Vir",show_lyrics:"Poka\u017Ei besedilo",hide_lyrics:"Skrij besedilo",transfer_queue:"Prenesi \u010Dakalno vrsto",group_players:"Zdru\u017Ei predvajalnike",select_entity:"Izberi entiteto za ve\u010D informacij",transfer_to:"Prenesi \u010Dakalno vrsto na",no_players:"Ni drugih razpolo\u017Eljivih predvajalnikov Music Assistant."},grouping:{title:"Zdru\u017Ei predvajalnike",sync_volume:"Sinhroniziraj glasnost",group_all:"Zdru\u017Ei vse",ungroup_all:"Razdru\u017Ei vse",unavailable:"Predvajalnik ni na voljo",no_players:"Ni drugih predvajalnikov za zdru\u017Eevanje.",master:"Glavni",joined:"Pridru\u017Een",available:"Na voljo",current:"Trenutni",unjoin_from:"Odslopi od {master}",join_with:"Pridru\u017Ei se {master}"}},search:{favorites:"Priljubljeni",recently_played:"Nedavno predvajano",next_up:"Naslednje",recommendations:"Priporo\u010Dila",radio_mode:"Radijski na\u010Din",play_similar:"Predvajaj podobne pesmi",close:"Zapri iskanje",no_results:"Ni rezultatov.",play_next:"Predvajaj naslednje",replace_play:"Zamenjaj \u010Dakalno vrsto in predvajaj",replace:"Zamenjaj \u010Dakalno vrsto",add_queue:"Dodaj na konec \u010Dakalne vrste",move_up:"Premakni gor",move_down:"Premakni dol",move_next:"Premakni na naslednje",remove:"Odstrani iz \u010Dakalne vrste",added:"Dodano v \u010Dakalno vrsto!",added_to_playlist:"Dodano na seznam predvajanja!",select_playlist:"Izberite seznam predvajanja za '{track}'",add_to_playlist:"Dodaj na seznam predvajanja",select_track_for_playlist:"Izberite skladbo za dodajanje za '{track}' od {artist}",labels:{replace:"Zamenjaj",next:"Naslednje",replace_next:"Zamenjaj naslednje",add:"Dodaj",add_to_playlist:"Dodaj na seznam predvajanja"},results:"rezultati",result:"rezultat",filters:{all:"Vse",artist:"Izvajalec",album:"Album",track:"Skladba",playlist:"Seznam predvajanja",radio:"Radio",music:"Glasba",station:"Postaja",podcast:"Podcast",audiobook:"Zvo\u010Dna knjiga"},search_artist:"I\u0161\u010Di tega izvajalca",play_collection:"Predvajaj to zbirko",play_collection_error:"Te zbirke ni mogo\u010De predvajati neposredno",browse_album:"Prebrskaj skladbe iz {album}",play_item:"Predvajaj {item}"},lyrics:{finding:"Iskanje besedila...",none_found:"Besedila ni bilo mogo\u010De najti",not_available:"Besedilo ni na voljo"},lyrics_modes:{default:"Privzeto (Ozna\u010Di in pomakni)",scroll:"Samo pomikanje",text:"Samo besedilo"}};const ia={en:bo,de:xo,es:wo,fr:ko,it:Eo,nl:Ao,pt:So,sk:$o,sl:Io};function d(i,e="",t=""){const a=(localStorage.getItem("selectedLanguage")||document.querySelector("home-assistant")?.hass?.language||"en").replace(/['"]+/g,"").replace("-","_"),r=ia[a]?a:a.split("_")[0];let s;const n=i.split("."),o=(l,c)=>{try{return c.reduce((h,u)=>h&&h[u]!==void 0?h[u]:void 0,l)}catch{return}};if(s=o(ia[r],n),s===void 0&&r!=="en"&&(s=o(ia.en,n)),s===void 0&&(s=i),typeof s!="string"&&(s=i),typeof e=="object"&&e!==null)for(const[l,c]of Object.entries(e))s=s.replaceAll(l,c);else e!==""&&t!==""&&(s=s.replaceAll(e,t));return s}function Ee(i,e){const t=i?.[e];return typeof t=="string"&&t.trim()!==""?t:null}async function Co(i,e,t){if(!e||typeof e!="string")return t;if(!e.includes("{{")&&!e.includes("{%"))return e;try{const a=(await i.callApi("POST","template",{template:e})||"").toString().trim();return a&&/^([a-z_]+)\.[A-Za-z0-9_]+$/.test(a)?a:t}catch{return t}}async function To(i,e,t={}){if(!e||typeof e!="string")return e;if(!e.includes("{{")&&!e.includes("{%")){if(/%7B%7B|%7B%25/i.test(e))try{e=decodeURIComponent(e)}catch{}if(!e.includes("{{")&&!e.includes("{%"))return e}let a=e;t&&Object.keys(t).length>0&&(a=`${Object.entries(t).map(([r,s])=>`{% set ${r} = ${JSON.stringify(s)} %}`).join(" ")} ${e}`);try{return(await i.callApi("POST","template",{template:a})||"").toString().trim()}catch(r){return console.warn("yamp: Error resolving template:",e,r),e}}function Mo(i,e,t={}){if(!e||typeof e!="string")return e;let a=e;if(/%7B%7B|%7B%25/i.test(a))try{a=decodeURIComponent(a)}catch{}if(!a.includes("{{")&&!a.includes("{%"))return a;let r=a,s=!0;return r=r.replace(/\{\{\s*(.*?)\s*\}\}/g,(n,o)=>{let l=o.trim(),c=!1;l.endsWith("| urlencode")?(c=!0,l=l.replace(/\|\s*urlencode$/,"").trim()):l.endsWith("|urlencode")&&(c=!0,l=l.replace(/\|urlencode$/,"").trim());let h=l.match(/^state_attr\(\s*(['"]?)([\w.]+)\1\s*,\s*(['"]?)([\w_]+)\3\s*\)$/);if(h){let p=h[2],m=t[p]!==void 0&&!h[1]?t[p]:p,f=h[4];const y=i?.states?.[m];if(y&&y.attributes&&y.attributes[f]!==void 0){let g=String(y.attributes[f]);return c?encodeURIComponent(g):g}return""}let u=l.match(/^states\(\s*(['"]?)([\w.]+)\1\s*\)$/);if(u){let p=u[2],m=t[p]!==void 0&&!u[1]?t[p]:p;const f=i?.states?.[m];if(f&&f.state!==void 0){let y=String(f.state);return c?encodeURIComponent(y):y}return""}if(/^[\w_]+$/.test(l)&&t[l]!==void 0){let p=String(t[l]);return c?encodeURIComponent(p):p}return s=!1,n}),!s||r.includes("{%")?null:r}function Po(i,e){if(!i?.states||!e)return[];const t=[],a=i.states[e];if(!a)return[];const r=a.attributes?.device_id,s=a.attributes?.friendly_name||e;for(const[n,o]of Object.entries(i.states))if(n.startsWith("button.")&&o.attributes){const l=o.attributes.device_id,c=o.attributes.friendly_name||n;r&&l===r?t.push({entity_id:n,friendly_name:c,device_class:o.attributes.device_class,reason:"same_device"}):(c.toLowerCase().includes(s.toLowerCase())||s.toLowerCase().includes(c.toLowerCase()))&&t.push({entity_id:n,friendly_name:c,device_class:o.attributes.device_class,reason:"name_similarity"})}return t}function Fo(i,e){if(!i?.states||!e)return null;const t=i.states[e];return t&&t.attributes&&(t.attributes.media_content_id||t.attributes.media_content_type||t.attributes.media_album_name||t.attributes.media_artist||t.attributes.media_title)?t:null}function _t(i){return!i||!i.attributes?!1:i.attributes.app_id==="music_assistant"||i.attributes.mass_player_type!==void 0}function jo(i){if(!i)return"";const e=i.media_type||i.media_class||i.media_content_type,t=i.name||i.title||i.media_title||"Unknown Title",a=i.artists?.[0],r=i.artist||a?.name||(typeof a=="string"?a:void 0)||i.media_artist||"Unknown Artist";if(e==="track"){const s=i.album||i.media_album_name;return s?d("search.browse_album","{album}",s):`${t} - ${r}`}return e==="album"?d("search.browse_album","{album}",t):t}function kr(i,e="",t=[],a=null){if(!i||!i.attributes)return null;const r=i.attributes,s=i.entity_id;r.app_id;let n=null,o=null;if(t&&Array.isArray(t)&&t.length){const l=(u,p)=>{if(u)return u[p]},c=[["media_title","media_title"],["media_artist","media_artist"],["media_album_name","media_album_name"],["media_content_id","media_content_id"],["media_channel","media_channel"],["app_name","app_name"],["media_content_type","media_content_type"],["entity_id","entity_id"],["entity_state","entity_state"]];let h=t.find(u=>c.some(([p,m])=>{const f=l(u,m);return f===void 0?!1:(p==="entity_id"?s:p==="entity_state"?i?.state:r[p])===f}));h||Ee(r,"entity_picture_local")||Ee(r,"entity_picture")||Ee(r,"album_art")||(h=t.find(u=>u?.missing_art_url),h?.missing_art_url&&(h={...h,image_url:h.missing_art_url})),h?.image_url&&(n=h.image_url,o=h?.size_percentage)}return n||(n=Ee(r,"entity_picture_local")||Ee(r,"entity_picture")||Ee(r,"album_art")||null),!n&&a&&(a==="smart"?r.media_title==="TV"||r.media_channel||r.app_id==="tv"||r.app_id==="androidtv"?n="data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTg0IiBoZWlnaHQ9IjE4NCIgdmlld0JveD0iMCAwIDE4NCAxODQiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHg9IjQwIiB5PSI0MCIgd2lkdGg9IjEwNCIgaGVpZ2h0PSI3OCIgcng9IjgiIGZpbGw9ImN1cnJlbnRDb2xvciIvPgo8cmVjdCB4PSI2OCIgeT0iMTIwIiB3aWR0aD0iNDgiIGhlaWdodD0iOCIgcng9IjQiIGZpbGw9ImN1cnJlbnRDb2xvciIvPgo8cmVjdCB4PSI4MCIgeT0iMTMwIiB3aWR0aD0iMjQiIGhlaWdodD0iOCIgcng9IjQiIGZpbGw9ImN1cnJlbnRDb2xvciIvPgo8L3N2Zz4K":n="data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTg0IiBoZWlnaHQ9IjE4NCIgdmlld0JveD0iMCAwIDE4NCAxODQiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHg9IjM2IiB5PSI4NiIgd2lkdGg9IjIyIiBoZWlnaHQ9IjYyIiByeD0iOCIgZmlsbD0iY3VycmVudENvbG9yIi8+CjxyZWN0IHg9IjY4IiB5PSI1OCIgd2lkdGg9IjIyIiBoZWlnaHQ9IjkwIiByeD0iOCIgZmlsbD0iY3VycmVudENvbG9yIi8+CjxyZWN0IHg9IjEwMCIgeT0iNzAiIHdpZHRoPSIyMiIgaGVpZ2h0PSI3OCIgcng9IjgiIGZpbGw9ImN1cnJlbnRDb2xvciIvPgo8cmVjdCB4PSIxMzIiIHk9IjQyIiB3aWR0aD0iMjIiIGhlaWdodD0iMTA2IiByeD0iOCIgZmlsbD0iY3VycmVudENvbG9yIi8+Cjwvc3ZnPgo=":typeof a=="string"&&(n=a)),n&&e&&!n.startsWith("http")&&(n=e+n),{url:n,sizePercentage:o}}function Do({idx:i,selected:e,playing:t,name:a,art:r,icon:s,pinned:n,holdToPin:o,maActive:l,onChipClick:c,onIconClick:h,onPinClick:u,onPointerDown:p,onPointerMove:m,onPointerUp:f,objectFit:y,quickGroupingState:g,onQuickGroupClick:x,onDoubleClick:k}){const S=y?`object-fit: ${y};`:"";return _`
    <button class="chip"
            ?selected=${e}
            ?playing=${t}
            ?ma-active=${l}
            @dblclick=${k}
            @click=${()=>c(i)}
            @pointerdown=${p}
            @pointermove=${m}
            @pointerup=${f}
            @pointerleave=${f}
            style="display:flex;align-items:center;justify-content:space-between;position:relative;">
      <span class="chip-icon">
        ${r?_`<img class="chip-mini-art" src="${r}" style="${S}" onerror="this.style.display='none'" />`:_`<ha-icon .icon=${s} style="font-size:28px;"></ha-icon>`}
      </span>
      <span class="chip-label" style="flex:1;text-align:left;min-width:0;overflow:hidden;text-overflow:ellipsis;">
        ${a}
      </span>
      ${t?_`
            <span class="chip-playing-indicator">
              <span class="bar"></span>
              <span class="bar"></span>
              <span class="bar"></span>
            </span>
          `:v}
      ${n?_`
            <span class="chip-pin-inside" @click=${E=>{E.stopPropagation(),u(i,E)}} title="Unpin">
              <ha-icon .icon=${"mdi:pin"}></ha-icon>
            </span>
          `:_`<span class="chip-pin-spacer"></span>`}
      ${Er({idx:i,quickGroupingState:g,onQuickGroupClick:x})}
    </button>
  `}function Oo({idx:i,selected:e,playing:t,groupName:a,art:r,icon:s,pinned:n,holdToPin:o,maActive:l,onChipClick:c,onIconClick:h,onPinClick:u,onPointerDown:p,onPointerMove:m,onPointerUp:f,objectFit:y,quickGroupingState:g,onQuickGroupClick:x,onDoubleClick:k}){const S=y?`object-fit: ${y};`:"";return _`
    <button class="chip group"
            ?selected=${e}
            ?ma-active=${l}
            @dblclick=${k}
            @click=${()=>c(i)}
            @pointerdown=${p}
            @pointermove=${m}
            @pointerup=${f}
            @pointerleave=${f}
            style="display:flex;align-items:center;justify-content:space-between;position:relative;">
      <span class="chip-icon"
            style="cursor:pointer;"
            @click=${E=>{E.stopPropagation(),h&&h(i,E)}}>
        ${r?_`<img class="chip-mini-art"
                      src="${r}"
                      style="cursor:pointer;${S}"
                      onerror="this.style.display='none'"
                      @click=${E=>{E.stopPropagation(),h&&h(i,E)}}/>`:_`<ha-icon .icon=${s}
                          style="font-size:28px;cursor:pointer;"
                          @click=${E=>{E.stopPropagation(),h&&h(i,E)}}></ha-icon>`}
      </span>
      <span class="chip-label" style="flex:1;text-align:left;min-width:0;overflow:hidden;text-overflow:ellipsis;">
        ${a}
      </span>
      ${t?_`
            <span class="chip-playing-indicator">
              <span class="bar"></span>
              <span class="bar"></span>
              <span class="bar"></span>
            </span>
          `:v}
      ${n?_`
            <span class="chip-pin-inside" @click=${E=>{E.stopPropagation(),u(i,E)}} title="Unpin">
              <ha-icon .icon=${"mdi:pin"}></ha-icon>
            </span>
          `:_`<span class="chip-pin-spacer"></span>`}
      ${Er({idx:i,quickGroupingState:g,onQuickGroupClick:x})}
    </button>
  `}function Er({idx:i,quickGroupingState:e,onQuickGroupClick:t}){if(!e||!e.isGroupable)return v;const{isPrimary:a,isBusy:r,grouped:s,tooltip:n}=e;return _`
    <span class="chip-quick-group" 
          @click=${o=>{o.stopPropagation(),t&&!r&&!a&&t(i,o)}} 
          title=${n||(a?"Primary":r?"Unavailable":s?"Unjoin":"Join")} 
          style="${a?"cursor:default;opacity:0.7;":r?"opacity:0.5;cursor:not-allowed;":""}">
      <ha-icon .icon=${a?"mdi:star-circle-outline":s?"mdi:minus":"mdi:plus"}></ha-icon>
    </span>
  `}function Ro({onPin:i,onHoldEnd:e,holdTime:t=600,moveThreshold:a=8}){let r=null,s=null,n=null,o=!1;return{pointerDown:(l,c)=>{s=l.clientX,n=l.clientY,o=!1,r=setTimeout(()=>{o||(i(c,l),e&&e(c))},t)},pointerMove:(l,c)=>{if(r&&s!==null&&n!==null){const h=Math.abs(l.clientX-s),u=Math.abs(l.clientY-n);(h>a||u>a)&&(o=!0,clearTimeout(r),r=null)}},pointerUp:(l,c)=>{r&&(clearTimeout(r),r=null),s=null,n=null,o=!1}}}function Ar({groupedSortedEntityIds:i,entityIds:e,selectedEntityId:t,pinnedIndex:a,holdToPin:r,getChipName:s,getActualGroupMaster:n,getIsChipPlaying:o,getChipArt:l,getIsMaActive:c,isIdle:h,hass:u,artworkHostname:p="",mediaArtworkOverrides:m=[],fallbackArtwork:f=null,onChipClick:y,onIconClick:g,onPointerClick:x,onPinClick:k,onPointerDown:S,onPointerMove:E,onPointerUp:U,quickGroupingMode:B,getQuickGroupingState:P,onQuickGroupClick:D,onDoubleClick:q}){return!i||!i.length?v:_`
    ${i.map(L=>{if(L.length>1){const M=n(L),N=e.indexOf(M),H=u?.states?.[M],te=typeof o=="function"?o(M,t===M):H?.state==="playing",ie=typeof l=="function"?l(M):kr(H,p,m,f),Z=ie?.url,ne=ie?.objectFit,oe=H?.attributes?.icon||"mdi:cast",Ce=typeof c=="function"?c(M):!1;return Oo({idx:N,selected:t===M,playing:te,groupName:s(M)+(L.length>1?` [${L.length}]`:""),art:Z,icon:oe,pinned:a===N,holdToPin:r,maActive:Ce,onChipClick:y,onIconClick:g,onPinClick:k,onPointerDown:me=>S(me,N),onPointerMove:me=>E(me,N),onPointerUp:me=>U(me,N),objectFit:ne,quickGroupingState:B&&typeof P=="function"?P(M):null,onQuickGroupClick:D,onDoubleClick:q})}else{const M=L[0],N=e.indexOf(M),H=u?.states?.[M],te=typeof o=="function"?o(M,t===M):H?.state==="playing",ie=typeof l=="function"?l(M):kr(H,p,m,f),Z=ie?.url,ne=ie?.objectFit,oe=t===M?!h&&Z:te&&Z,Ce=H?.attributes?.icon||"mdi:cast",me=typeof c=="function"?c(M):!1;return Do({idx:N,selected:t===M,playing:te,name:s(M),art:oe,icon:Ce,pinned:a===N,holdToPin:r,maActive:me,onChipClick:y,onPinClick:k,onPointerDown:ae=>S(ae,N),onPointerMove:ae=>E(ae,N),onPointerUp:ae=>U(ae,N),objectFit:ne,quickGroupingState:B&&typeof P=="function"?P(M):null,onQuickGroupClick:D,onDoubleClick:q})}})}
  `}function zo({actions:i,onActionChipClick:e}){return i?.length?_`
    <div class="action-chip-row">
      ${i.map((t,a)=>_`
          <button class="action-chip" @click=${()=>e(a)}>
            ${t.icon?_`<ha-icon .icon=${t.icon} style="font-size: 22px; margin-right: ${t.name?"8px":"0"};"></ha-icon>`:v}
            ${t.name||""}
          </button>
        `)}
    </div>
  `:v}function Lo({stateObj:i,showStop:e,shuffleActive:t,repeatActive:a,onControlClick:r,supportsFeature:s,showFavorite:n,favoriteActive:o,hiddenControls:l={},adaptiveControls:c=!1,controlLayout:h="classic",swapPauseForStop:u=!1}){if(!i)return v;const p=1,m=16,f=32,y=32768,g=262144,x=128,k=256,S=16384,E=h==="modern"?"modern":"classic";let U=!l.previous&&s(i,m),B=!l.play_pause&&(s(i,p)||s(i,S));const P=!l.stop&&e;let D=P,q=!l.next&&s(i,f),L=!l.shuffle&&s(i,y),M=!l.repeat&&s(i,g),N=!l.favorite&&n,H=!l.power&&(s(i,k)||s(i,x));const te=E==="modern"&&u&&P,ie=i.state==="playing",Z=te&&ie;E==="modern"&&(D=!1,N=!1,H=!1);const ne=aa(i,s,n,l,e,E),oe=c?"controls-row adaptive":"controls-row",Ce=E==="modern"?`${oe} modern`:oe;let me=c?`--yamp-control-count:${Math.max(ne,1)};`:v;if(c){const ae=ne<=3?{icon:56,minWidth:78,maxWidth:150,minHeight:78,padding:14,gap:14}:ne===4?{icon:48,minWidth:68,maxWidth:130,minHeight:68,padding:12,gap:12}:ne===5?{icon:42,minWidth:58,maxWidth:110,minHeight:58,padding:10,gap:10}:ne===6?{icon:36,minWidth:50,maxWidth:96,minHeight:52,padding:8,gap:8}:{icon:32,minWidth:44,maxWidth:88,minHeight:48,padding:6,gap:6};me+=[`--yamp-control-gap:${ae.gap}px`,`--yamp-control-min-width:${ae.minWidth}px`,`--yamp-control-max-width:${ae.maxWidth}px`,`--yamp-control-min-height:${ae.minHeight}px`,`--yamp-control-padding:${ae.padding}px`,`--yamp-control-icon-size:${ae.icon}px`].join(";")}return E==="modern"?_`
      <div class=${Ce} style=${me}>
        <div class="controls-left">
          ${L?_`
            <button class="modern-button small${t?" active":""}" @click=${()=>r("shuffle")} title="${d("card.media_controls.shuffle")}">
              <ha-icon .icon=${"mdi:shuffle"}></ha-icon>
            </button>
          `:v}
          ${U?_`
            <button class="modern-button medium" @click=${()=>r("prev")} title="${d("card.media_controls.previous")}">
              <ha-icon .icon=${"mdi:skip-previous"}></ha-icon>
            </button>
          `:v}
        </div>

        <div class="controls-center">
          ${B?_`
            <button
              class="modern-button primary${ie?" active":""}"
              @click=${()=>r(Z?"stop":"play_pause")}
              title="${Z?d("card.media_controls.stop"):d("card.media_controls.play_pause")||"Play/Pause"}"
            >
              <ha-icon .icon=${Z?"mdi:stop":ie?"mdi:pause":"mdi:play"}></ha-icon>
            </button>
          `:v}
        </div>

        <div class="controls-right">
          ${q?_`
            <button class="modern-button medium" @click=${()=>r("next")} title="${d("card.media_controls.next")}">
              <ha-icon .icon=${"mdi:skip-next"}></ha-icon>
            </button>
          `:v}
          ${M?_`
            <button class="modern-button small${a?" active":""}" @click=${()=>r("repeat")} title="${d("card.media_controls.repeat")}">
              <ha-icon .icon=${i.attributes.repeat==="one"?"mdi:repeat-once":"mdi:repeat"}></ha-icon>
            </button>
          `:v}
        </div>
      </div>
    `:_`
    <div class=${Ce} style=${me}>
      ${U?_`
        <button class="button" @click=${()=>r("prev")} title="Previous">
          <ha-icon .icon=${"mdi:skip-previous"}></ha-icon>
        </button>
      `:v}
      ${B?_`
        <button class="button" @click=${()=>r("play_pause")} title="Play/Pause">
          <ha-icon .icon=${i.state==="playing"?"mdi:pause":"mdi:play"}></ha-icon>
        </button>
      `:v}
      ${D?_`
        <button class="button" @click=${()=>r("stop")} title="Stop">
          <ha-icon .icon=${"mdi:stop"}></ha-icon>
        </button>
      `:v}
      ${q?_`
        <button class="button" @click=${()=>r("next")} title="Next">
          <ha-icon .icon=${"mdi:skip-next"}></ha-icon>
        </button>
      `:v}
      ${L?_`
        <button class="button${t?" active":""}" @click=${()=>r("shuffle")} title="Shuffle">
          <ha-icon .icon=${"mdi:shuffle"}></ha-icon>
        </button>
      `:v}
      ${M?_`
        <button class="button${a?" active":""}" @click=${()=>r("repeat")} title="Repeat">
          <ha-icon .icon=${i.attributes.repeat==="one"?"mdi:repeat-once":"mdi:repeat"}></ha-icon>
        </button>
      `:v}
      ${N?_`
        <button class="button${o?" active":""}" @click=${()=>r("favorite")} title="Favorite">
          <ha-icon .icon=${o?"mdi:heart":"mdi:heart-outline"}></ha-icon>
        </button>
      `:v}
      ${H?_`
        <button
          class="button${i.state!=="off"?" active":""}"
          @click=${()=>r("power")}
          title="Power"
        >
          <ha-icon .icon=${"mdi:power"}></ha-icon>
        </button>
      `:v}
    </div>
  `}function aa(i,e,t=!1,a={},r=!1,s="classic"){const n=s==="modern"?"modern":"classic";let o=0;return!a.previous&&e(i,16)&&o++,a.play_pause||o++,n!=="modern"&&!a.stop&&r&&o++,!a.next&&e(i,32)&&o++,!a.shuffle&&e(i,32768)&&o++,!a.repeat&&e(i,262144)&&o++,n!=="modern"&&!a.favorite&&t&&o++,n!=="modern"&&!a.power&&(e(i,256)||e(i,128))&&o++,o}function qo({isRemoteVolumeEntity:i,showSlider:e,vol:t,isMuted:a,supportsMute:r,onVolumeDragStart:s,onVolumeDragEnd:n,onVolumeChange:o,onVolumeStep:l,onMuteToggle:c,moreInfoMenu:h,leadingControlTemplate:u=v,reserveLeadingControlSpace:p=!1,showRightPlaceholder:m=!1,rightSlotTemplate:f=v,hideVolume:y=!1}){const g=u!==v&&u!==void 0&&u!==null,x=(k,S)=>(r?S:k===0)||k===0?"mdi:volume-off":k<.2?"mdi:volume-low":k<.5?"mdi:volume-medium":"mdi:volume-high";return _`
    <div class="volume-row ${e&&!i?"has-slider":""}">
      <div class="volume-left">
        ${g?u:p?_`<div class="volume-leading-placeholder"></div>`:v}
        ${!y&&!i?_`
          <button 
            class="volume-icon-btn" 
            @click=${c} 
            title=${d((r?a:t===0)?"common.unmute":"common.mute")}
          >
            <ha-icon icon=${x(t,a)}></ha-icon>
          </button>
        `:v}
      </div>

      <div class="volume-center">
        ${y?v:_`
          ${i?_`
              <div class="vol-stepper-container">
                <div class="vol-stepper">
                  <button class="button" @click=${()=>l(-1)} title="${d("common.vol_down")}">–</button>
                  <span class="vol-label">vol</span>
                  <button class="button" @click=${()=>l(1)} title="${d("common.vol_up")}">+</button>
                </div>
              </div>
            `:e?_`
                <div class="volume-slider-container">
                  <input
                    class="vol-slider"
                    type="range"
                    min="0"
                    max="1"
                    step="0.01"
                    .value=${t}
                    @mousedown=${s}
                    @touchstart=${s}
                    @change=${o}
                    @mouseup=${n}
                    @touchend=${n}
                    title="${d("common.volume")}"
                  />
                </div>
              `:_`
              <div class="vol-stepper-container">
                <div class="vol-stepper">
                  <button class="button" @click=${()=>l(-1)} title="${d("common.vol_down")}">–</button>
                  <span class="vol-value">${Math.round(t*100)}%</span>
                  <button class="button" @click=${()=>l(1)} title="${d("common.vol_up")}">+</button>
                </div>
              </div>
            `}
        `}
      </div>

      <div class="volume-right">
        ${m?_`
          <div class="volume-placeholder">
            ${f||v}
          </div>
        `:v}
        ${h}
      </div>
    </div>
  `}function Sr(i){if(i==null||isNaN(i))return"0:00";const e=Math.floor(i/60),t=Math.floor(i%60);return`${e}:${t<10?"0":""}${t}`}function ui({progress:i,seekEnabled:e,onSeek:t,collapsed:a,accent:r,height:s=6,style:n="",displayTimestamps:o=!1,currentTime:l=0,duration:c=0}){const h=r||"var(--custom-accent, #ff9800)";return a?_`
      <div
        class="collapsed-progress-bar"
        style="width: ${i*100}%; background: ${h}; height: 4px; ${n}"
      ></div>
    `:_`
    <div class="progress-bar-container" style="${n}">
      <div
        class="progress-bar"
        style="height:${s}px; background:rgba(255,255,255,0.22);"
        @click=${e?t:null}
        title=${e?d("common.seek"):""}
      >
        <div
          class="progress-inner"
          style="width: ${i*100}%; background: ${h}; height:${s}px;"
        ></div>
      </div>
      ${o?_`
        <div class="timestamps-container">
           <span>${Sr(l)}</span>
           <span>-${Sr(Math.max(0,c-l))}</span>
        </div>
      `:v}
    </div>
  `}const z=Object.freeze({MEDIA_BACKGROUND:0,MEDIA_OVERLAY:0,LYRICS_OVERLAY:1,FLOATING_ELEMENT:1,STICKY_CHIPS:1,ACCENT_FOREGROUND:1,FLOATING_CONTROLS:1,OVERLAY_BASE:2,MODAL_BACKDROP:2,MODAL_TOAST:2,SEARCH_SLIDE_OUT:1,SEARCH_SUCCESS:1}),$r=ye`linear-gradient(to bottom, transparent, rgba(0,0,0,0.5) 10px, black 50px, black calc(100% - 50px), rgba(0,0,0,0.5) calc(100% - 10px), transparent)`,he=ye`
  scrollbar-width: none;
  -ms-overflow-style: none;
`,hi=ye`blur(5px)`,Ir=ye`blur(10px)`,Cr=ye`blur(20px)`,pi=ye`linear-gradient(to bottom, black 0%, black calc(100% - 12px), transparent 100%)`,Tr=ye`
  display: -webkit-box;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 2;
  overflow: hidden;
`;ye`
  display: -webkit-box;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 3;
  overflow: hidden;
`;const Mr=ye`
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
`,Pr=ye`
  background: var(--card-bg, #fff);
  color: var(--primary-text, #222);
  border: 1px solid var(--yamp-overlay-divider, #bbb);
`,No=ye`
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
    --yamp-section-bg: rgba(255,255,255,0.02);
    --yamp-section-border: rgba(255,255,255,0.1);
    --yamp-section-radius: 12px;
    --yamp-section-divider: rgba(255,255,255,0.06);
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
    /* Always override custom-accent to use theme accent when match_theme is true, regardless of light/dark mode */
    --custom-accent: var(--accent-color, var(--primary-color, var(--state-media_player-active-color, var(--state-active-color, #ff9800))));
    
    /* Dynamically assign base components to theme variants */
    --card-bg: var(--ha-card-background, var(--card-background-color, #222));
    --primary-text: var(--primary-text-color, #fff);
    --secondary-text: var(--secondary-text-color, #aaa);
    --chip-bg: var(--chip-background, #333);
    --yamp-section-bg: var(--ha-card-background, var(--card-background-color, rgba(255,255,255,0.02)));
    --yamp-section-border: var(--divider-color, rgba(255,255,255,0.1));
    --yamp-section-description-color: var(--secondary-text-color, #888);

    /* Search sheet theme-aware variables - used when match_theme is true to follow HA theme colors dynamically */
    --search-overlay-bg: var(--ha-card-background, var(--card-background-color, rgba(0, 0, 0, 0.8)));
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
    --yamp-overlay-bg: color-mix(in srgb, var(--ha-card-background, var(--card-background-color, #000)), transparent 18%);
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
    --yamp-chip-selected-text: var(--text-primary-color, #fff);
    --search-text-secondary: var(--secondary-text-color, #aaa);

    /* Mode-aware chip defaults - used when appearance is automatic */
    --yamp-chip-bg: color-mix(in srgb, var(--primary-text-color, #fff) 8%, var(--ha-card-background, var(--card-background-color, rgba(0, 0, 0, 0.8))));
    --yamp-chip-text: var(--search-text);
    --yamp-chip-selected-bg: var(--custom-accent);
    --yamp-chip-border: var(--divider-color, rgba(0, 0, 0, 0.1));
    --search-error-bg: color-mix(in srgb, var(--error-color, #f44336) 80%, transparent);
    --search-card-bg: color-mix(in srgb, var(--primary-text-color, #fff) 4%, var(--ha-card-background, var(--card-background-color, rgba(0, 0, 0, 0.8))));
    --search-thumb-placeholder-bg: color-mix(in srgb, var(--primary-text-color, #fff) 10%, transparent);
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
    overflow: visible;
    font-size: inherit;
    position: relative;
    clip-path: none;
    transform: translateZ(0);
  }

  .yamp-card-inner {
    position: relative;
    z-index: ${z.FLOATING_ELEMENT};
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
    z-index: ${z.MEDIA_BACKGROUND};
    background-size: var(--yamp-artwork-bg-size, cover);
    background-position: top center;
    background-repeat: no-repeat;
    pointer-events: none;
    transform: translateZ(0);
  }

  .full-bleed-artwork-fade {
    position: absolute;
    inset: -50px;
    z-index: ${z.MEDIA_OVERLAY};
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
    z-index: ${z.FLOATING_CONTROLS};
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
    color: var(--yamp-icon-color, #fff);
    transition: color var(--transition-normal, 0.2s);
  }

  .dim-idle .more-info-btn ha-icon {
    color: #9ea2a8;
  }

  .more-info-icon {
    font-size: 1.7em;
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
    min-height: 0;
  }

  /* Media background */
  .media-bg-full {
    position: absolute;
    inset: 0;
    width: 100%;
    height: 100%;
    z-index: ${z.MEDIA_BACKGROUND};
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
    z-index: ${z.MEDIA_OVERLAY};
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
    z-index: ${z.FLOATING_CONTROLS};
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

  .source-option:hover,
  .source-option:focus {
    background: var(--custom-accent);
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
    padding: 8px 12px 18px 12px;
    margin-bottom: -6px;
    position: relative;
    z-index: ${z.STICKY_CHIPS};
    overflow-x: auto;
    overflow-y: hidden;
    white-space: nowrap;
    ${he}
    scrollbar-color: var(--accent-color, #1976d2) #222;
    -webkit-overflow-scrolling: touch;
    touch-action: pan-x;
    max-width: 100vw;
    background: transparent;
    -webkit-mask-image: ${pi};
    mask-image: ${pi};
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
    z-index: ${z.STICKY_CHIPS};
    overflow-x: auto;
    white-space: nowrap;
    ${he}
    font-size: calc(1em * var(--yamp-text-scale-action-chips, 1));
    background: transparent;
    -webkit-mask-image: ${pi};
    mask-image: ${pi};
  }



  /* Action chips */
  .action-chip {
    background: var(--yamp-chip-bg, transparent);
    opacity: 1;
    border-radius: var(--button-border-radius);
    color: var(--yamp-chip-text, var(--primary-text));
    box-shadow: var(--chip-box-shadow, var(--ha-assistant-chip-box-shadow, var(--ha-card-box-shadow, none)));
    text-shadow: none;
    border: 1px solid var(--yamp-chip-border, transparent);
    outline: none;
    padding: 4px 12px;
    font-weight: 500;
    font-size: 0.95em;
    cursor: pointer;
    margin: 4px 0;
    transition: background var(--transition-normal) ease, transform 0.1s ease, box-shadow var(--transition-normal) ease;
    flex: 0 0 auto;
    white-space: nowrap;
    display: inline-flex;
    align-items: center;
    gap: 6px;
  }

  .action-chip:hover {
    background: var(--custom-accent);
    color: #fff;
    box-shadow: var(--chip-box-shadow, var(--ha-assistant-chip-box-shadow, var(--ha-card-box-shadow, none)));
    text-shadow: none;
  }

  .action-chip:active {
    background: var(--custom-accent);
    color: #fff;
    transform: scale(0.96);
    box-shadow: var(--chip-box-shadow, var(--ha-assistant-chip-box-shadow, var(--ha-card-box-shadow, none)));
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
    background: var(--yamp-chip-bg);
    color: var(--yamp-chip-text);
    box-shadow: var(--chip-box-shadow, var(--ha-assistant-chip-box-shadow, var(--ha-card-box-shadow, none)));
    cursor: pointer;
    font-size: 0.9em;
    font-weight: 500;
    opacity: 1;
    border: 1px solid var(--yamp-chip-border, transparent);
    outline: none;
    transition: background var(--transition-normal), opacity var(--transition-normal), box-shadow var(--transition-normal);
    flex: 0 0 auto;
    white-space: nowrap;
    position: relative;
  }

  .chip:hover {
    background: var(--yamp-chip-selected-bg);
    color: var(--yamp-chip-selected-text);
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
    z-index: ${z.FLOATING_ELEMENT};
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
    transition: opacity 0.2s, text-decoration 0.2s;
  }

  .track-options-btn ha-icon {
    --mdc-icon-size: 1.1rem;
    margin-top: -2px;
  }

  .track-options-close ha-icon {
    --mdc-icon-size: 1.3rem;
  }

  .track-options-btn:hover {
    opacity: 0.7;
    text-decoration: underline;
  }

  .track-options-title {
    cursor: pointer;
    transition: text-decoration 0.2s;
  }

  .track-options-title:hover {
    text-decoration: underline;
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
    height: 4px;
    background: var(--yamp-overlay-divider, rgba(255, 255, 255, 0.2));
    border-radius: 2px;
    overflow: hidden;
    position: relative;
    cursor: pointer;
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

  /* Light mode overrides */
  :host([data-appearance="light"]:not([data-match-theme="true"])) {
    ${Mr}
  }

  :host([data-appearance="light"]:not([data-match-theme="true"])) .source-dropdown {
    ${Pr}
  }

  @media (prefers-color-scheme: light) {
    :host([data-appearance="automatic"]:not([data-match-theme="true"])) {
      ${Mr}
    }

    :host([data-appearance="automatic"]:not([data-match-theme="true"])) .source-dropdown {
      ${Pr}
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
    z-index: ${z.FLOATING_ELEMENT};
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
    z-index: ${z.MEDIA_BACKGROUND};
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
    z-index: ${z.MEDIA_OVERLAY};
    background: linear-gradient(
      to bottom,
      rgba(0,0,0,0.0) 0%,
      rgba(0,0,0,0.40) 55%,
      rgba(0,0,0,0.92) 100%
    );
  }

  .card-lower-content {
    position: relative;
    z-index: ${z.FLOATING_ELEMENT};
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
  .yamp-card-inner[data-artwork-fit="scaled-contain-alternate"] .volume-slider-icon {
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
  .yamp-card-inner[data-artwork-fit="scaled-contain-alternate"] .controls-row .button:hover,
  .yamp-card-inner[data-artwork-fit="scaled-contain-alternate"] .modern-button:hover {
    background: var(--yamp-chip-selected-bg);
    color: var(--yamp-chip-selected-text) !important;
    border-radius: var(--button-border-radius, 8px);
  }

  /* Modern button hover specifically needs 999px radius to stay circular */
  .yamp-card-inner[data-artwork-fit="scaled-contain-alternate"] .modern-button:hover {
    border-radius: 999px;
  }

  .yamp-card-inner[data-artwork-fit="scaled-contain-alternate"] .controls-row .button:hover ha-icon,
  .yamp-card-inner[data-artwork-fit="scaled-contain-alternate"] .modern-button:hover ha-icon {
    color: var(--yamp-chip-selected-text) !important;
  }

  .yamp-card-inner[data-artwork-fit="scaled-contain-alternate"] .inset-artwork {
    border-radius: var(--ha-card-border-radius, 12px);
    border: var(--ha-card-border-width, 1px) solid var(--ha-card-border-color, var(--divider-color, #e0e0e0));
  }

  .yamp-card-inner[data-artwork-fit="scaled-contain-alternate"] .vol-slider {
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
    z-index: ${z.FLOATING_ELEMENT};
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
    z-index: ${z.ACCENT_FOREGROUND};
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
    z-index: ${z.OVERLAY_BASE};
    background: var(--yamp-overlay-bg);
    backdrop-filter: ${hi};
    -webkit-backdrop-filter: ${hi};
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
    ${he}
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
    ${he}
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
    z-index: ${z.FLOATING_CONTROLS};
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
    ${he}
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
    z-index: ${z.STICKY_CHIPS};
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
    ${he}
  }

  /* Hide scrollbar for group list scroll container */
  .group-list-scroll {
    ${he}
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

  .entity-options-item:hover {
    color: var(--custom-accent, #ff9800);
    background: none;
  }

  .entity-options-item.close-item {
    font-weight: 500;
    margin: 1px 0;
    padding: 4px 0 5px 0;
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
  .grouping-header .entity-options-item.close-item {
    border-bottom: 1px solid rgba(255, 255, 255, 0.28);
    margin-bottom: 6px;
    padding-bottom: 6px;
  }

  /* Source index */
  .source-index-letter:focus {
    background: rgba(255,255,255,0.11);
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
    ${he}
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
    z-index: ${z.ACCENT_FOREGROUND};
    padding: 0 8px 0 0;
    overflow-y: auto;
    max-height: calc(100% - 75px);
    min-width: 38px;
    ${he}
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
    transition: color var(--transition-fast), background var(--transition-fast), transform 0.16s cubic-bezier(.35,1.8,.4,1.04);
    transform: scale(1);
    z-index: ${z.MEDIA_OVERLAY};
    min-height: 22px;
    min-width: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .floating-source-index .source-index-letter[data-scale="max"] {
    transform: scale(1.38);
    z-index: ${z.OVERLAY_BASE};
  }

  .floating-source-index .source-index-letter[data-scale="large"] {
    transform: scale(1.19);
    z-index: ${z.FLOATING_ELEMENT};
  }

  .floating-source-index .source-index-letter[data-scale="med"] {
    transform: scale(1.10);
    z-index: ${z.MEDIA_OVERLAY};
  }

  .floating-source-index .source-index-letter::after {
    display: none;
  }

  .floating-source-index .source-index-letter:hover,
  .floating-source-index .source-index-letter:focus {
    color: var(--yamp-overlay-text);
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

  .group-toggle-transparent:hover {
    background: none;
  }

  /* Force theme-aware text in grouping sheet */
  .entity-options-sheet,
  .entity-options-sheet * {
    color: var(--yamp-overlay-text);
  }

  /* Specific override to ensure selected chips keep their white text regardless of the global sheet rule above */
  .entity-options-sheet .chip[selected],
  .entity-options-sheet .chip[selected] * {
    color: var(--yamp-chip-selected-text) !important;
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
    border-bottom: 1px solid var(--search-border);
    font-size: 1.10em;
    color: var(--primary-text);
    background: none;
  }
  .search-row-slide-out {
    position: absolute;
    inset: 0;
    left: 100%;
    background: var(--search-overlay-bg) ;
    backdrop-filter: ${Ir};
    -webkit-backdrop-filter: ${Ir};
    z-index: ${z.SEARCH_SLIDE_OUT};
    display: flex;
    align-items: center;
    padding: 0 8px;
    transition: left 0.3s cubic-bezier(0.4, 0, 0.2, 1);
    border-radius: 15px 0 0 15px;
    overflow-x: auto;
    ${he}
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
    backdrop-filter: ${Cr};
    -webkit-backdrop-filter: ${Cr};
    display: flex;
    flex-direction: column;
    gap: 4px;
    align-items: center;
    justify-content: center;
    text-align: center;
    color: var(--yamp-overlay-text);
    font-weight: 600;
    font-size: 0.95em;
    z-index: ${z.SEARCH_SUCCESS};
    border-radius: inherit;
    box-shadow: inset 0 0 10px rgba(255,255,255,0.05);
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
    100% { transform: rotate(360deg); }
  }

  @keyframes success-fade-in {
    from { opacity: 0; }
    to { opacity: 1; }
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
    color: var(--yamp-overlay-text);
    padding: 4px;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .slide-out-close:hover {
    color: var(--custom-accent);
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
    color: var(--yamp-overlay-text);
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
    color: var(--yamp-overlay-text-secondary);
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
    color: var(--yamp-overlay-text);
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
    color: var(--yamp-success-color);
  }

  .queue-btn-down:hover,
  .queue-btn-down:focus {
    background: transparent;
    color: var(--yamp-success-color);
  }

  .queue-btn-next:hover,
  .queue-btn-next:focus {
    background: transparent;
    color: var(--custom-accent);
  }

  .queue-btn-remove:hover,
  .queue-btn-remove:focus {
    background: transparent;
    color: var(--yamp-error-color);
  }

  /* Visual feedback for moved queue items */
  .entity-options-search-result.just-moved {
    background: var(--yamp-success-bg-light) ;
    border-left: 3px solid var(--yamp-success-color) ;
    animation: queueMoveHighlight 1s ease-out;
  }

  @keyframes queueMoveHighlight {
    0% { background: var(--yamp-success-bg-medium); transform: scale(1.02); }
    100% { background: var(--yamp-success-bg-light); transform: scale(1); }
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
    transition: border var(--transition-fast), background var(--transition-fast);
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

  .search-input-clear:hover {
    color: var(--custom-accent);
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
    opacity: 0.90;
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

  .entity-options-sheet .search-filter-chips .chip:hover {
    background: var(--custom-accent) !important;
    color: var(--yamp-chip-selected-text) !important;
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

  .search-sub-filters .button:hover {
    color: var(--custom-accent) !important;
    opacity: 1 !important;
  }

  .search-sub-filters .button.active {
    color: var(--custom-accent) !important;
    opacity: 1 !important;
  }

  .search-sub-filters .button.active ha-icon {
    color: var(--custom-accent) !important;
  }

  .search-sub-filters .radio-mode-button:hover {
    color: var(--custom-accent);
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
    ${he}
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
    ${he}
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
    ${he}
  }



  .entity-options-resolved-entities  .entity-options-search-input {
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

  .entity-options-resolved-entities .entity-options-item:hover,
  .entity-options-resolved-entities .entity-options-item:focus {
    color: var(--custom-accent) ;
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
    transition: color var(--transition-fast);
  }

  .clickable-search-result:hover {
    text-decoration: underline;
    color: var(--yamp-overlay-text);
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
    transition: background-color 0.2s, color 0.2s;
    flex-shrink: 0;
  }

  .entity-options-search-breadcrumb-play:hover {
    background-color: var(--custom-accent);
    color: var(--yamp-overlay-text);
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
    z-index: ${z.MODAL_BACKDROP};
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
    z-index: ${z.MODAL_TOAST};
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
    ${he}
  }




  .search-sheet-result {
    position: relative;
    overflow: hidden;
    display: flex;
    align-items: center;
    gap: 15px;
    padding: 15px;
    border-bottom: 1px solid var(--search-border);
    cursor: pointer;
    transition: background-color 0.2s;
  }

  .search-sheet-result.search-result-card,
  .entity-options-search-result.search-result-card {
    flex-direction: column;
    padding: 8px;
    border-bottom: none;
    border-radius: 12px;
    background: var(--search-card-bg);
    box-shadow: var(--chip-box-shadow, var(--ha-assistant-chip-box-shadow, var(--ha-card-box-shadow, none)));
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

  .search-sheet-result:hover {
    background: var(--search-hover-bg);
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
    background: var(--search-thumb-placeholder-bg);
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
    background: var(--search-overlay-bg);
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
    background: var(--search-thumb-placeholder-bg);
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .entity-options-search-thumb-placeholder ha-icon {
    color: var(--search-thumb-placeholder-icon);
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
    color: var(--yamp-chip-text);
    font-size: 0.9em;
    font-weight: 500;
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
    color: var(--search-text-secondary);
    line-height: 1.16;
  }

  .entity-options-search-subtitle {
    font-size: 0.9em;
    color: var(--secondary-text);
  }

  .search-result-card .search-sheet-info {
    text-align: center;
    width: 100%;
  }

  .search-result-card .search-sheet-title {
    text-align: center;
    width: 100%;
    /* 2-line clamping with word-level breaks */
    ${Tr}
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
    ${Tr}
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

  .search-sheet-play:hover,
  .search-sheet-queue:hover {
    background: var(--search-play-hover);
  }

  .search-sheet-queue {
    background: var(--search-queue-bg);
    border: 1px solid var(--search-queue-border);
  }

  .search-sheet-queue:hover {
    background: var(--search-queue-hover);
    border-color: var(--search-queue-hover-border);
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
    --search-text-secondary: #bbb;
    --search-error: #ff6b6b ;
    --search-error-bg: rgba(244, 67, 54, 0.8);
    --search-success: #4caf50 ;
    --search-success-text: #fff;
    --search-success-bg: rgba(76, 175, 80, 0.95) ;
    --search-border: rgba(255, 255, 255, 0.1) ;
    --search-hover-bg: rgba(255, 255, 255, 0.1) ;
    --search-play-hover: #e68900 ;
    --search-queue-bg: #4a4a4a ;
    --search-queue-border: #666 ;
    --search-queue-hover: #5a5a5a ;
    --search-queue-hover-border: #777 ;
    --search-card-bg: rgba(255, 255, 255, 0.05);
    --search-thumb-placeholder-bg: rgba(255, 255, 255, 0.1);
    --search-thumb-placeholder-icon: rgba(255, 255, 255, 0.6);
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



  .search-sheet[data-match-theme="false"] .search-sheet-play {
    background: var(--custom-accent) ;
    color: #fff ;
  }


  .search-sheet-buttons .search-sheet-queue {
    color: var(--yamp-overlay-text);
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
    z-index: ${z.FLOATING_ELEMENT};
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
`,Uo=ye`
  :host {
    display: block;
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: -1px;
    z-index: ${z.LYRICS_OVERLAY};
    overflow: hidden;
    pointer-events: auto;
    backdrop-filter: ${hi};
    -webkit-backdrop-filter: ${hi};
    color: var(--yamp-lyrics-color, var(--yamp-overlay-text, #fff));
  }

  :host([data-artwork-fit="scaled-contain-alternate"]) {
    background: var(--yamp-lyrics-bg, var(--yamp-overlay-bg, rgba(0, 0, 0, 0.82)));
  }

  :host(:not([data-artwork-fit="scaled-contain-alternate"])) {
    background: var(--yamp-lyrics-bg, rgba(0, 0, 0, 0.3));
    color: #fff;
    mask-image: var(--yamp-lyrics-mask, ${$r});
    -webkit-mask-image: var(--yamp-lyrics-mask, ${$r});
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
    ${he}
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
    color:  var(--yamp-lyrics-active-color, inherit);
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

  .lyrics-loading, .lyrics-error, .lyrics-empty {
    height: 100%;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    text-align: center;
    padding: 24px;
    color: var(--yamp-lyrics-status-color, var(--yamp-overlay-text-secondary, rgba(255, 255, 255, 0.8)));
    background: transparent;
    border-radius: inherit;
  }

  .lyrics-loading ha-circular-progress {
    margin-bottom: 12px;
    --md-sys-color-primary: var(--yamp-overlay-text, white);
  }

  .lyrics-error ha-icon, .lyrics-empty ha-icon {
    --mdc-icon-size: 40px;
    margin-bottom: 12px;
    opacity: 0.6;
  }
`;function Fr(i){if(!i||typeof i!="string")return[];const e=i.split(/\r?\n/),t=[],a=/\[(\d+):([0-5]\d)(?:[.:](\d{2,3}))?\]/g;return e.forEach(r=>{if(r=r.trim(),!r||r.match(/\[[a-zA-Z]+:[^\]]+\]/)&&!r.match(a))return;let s,n=r.replace(a,"").trim();const o=[];for(a.lastIndex=0;(s=a.exec(r))!==null;){const l=parseInt(s[1],10),c=parseInt(s[2],10),h=s[3]?parseInt(s[3],10):0,u=s[3]?s[3].length===3?1e3:100:1e3,p=l*60+c+h/u;o.push(p)}o.length>0?o.forEach(l=>{t.push({time:l,text:n})}):t.push({time:null,text:n})}),t.sort((r,s)=>r.time===null&&s.time===null?0:r.time===null?1:s.time===null?-1:r.time-s.time),t}class Bo extends Ge{static get properties(){return{hass:{type:Object},lyrics:{type:Array},position:{type:Number},loading:{type:Boolean},error:{type:Boolean},activeThemeColor:{type:String},mode:{type:String},preRoll:{type:Number}}}static get styles(){return Uo}constructor(){super(),this.lyrics=[],this.position=0,this.loading=!1,this.error=!1,this.activeThemeColor="#ffffff",this.mode="default",this.preRoll=0,this._activeIndex=-1,this._isScrolling=!1,this._scrollTimeout=null}disconnectedCallback(){super.disconnectedCallback(),this._scrollTimeout&&(clearTimeout(this._scrollTimeout),this._scrollTimeout=null)}firstUpdated(){this._activeIndex!==-1&&this._scrollToActive("auto")}updated(e){super.updated(e),e.has("lyrics")&&(this._activeIndex=-1,requestAnimationFrame(()=>this._scrollToActive("auto"))),(e.has("position")||e.has("lyrics"))&&this._updateActiveLyric()}_updateActiveLyric(){if(!this.lyrics||this.lyrics.length===0||this.mode==="text"||!this.lyrics.some(a=>a.time!==null))return;let e=-1;const t=this.position+this.preRoll;for(let a=0;a<this.lyrics.length;a++)if(this.lyrics[a].time!==null&&this.lyrics[a].time<=t)e=a;else if(this.lyrics[a].time!==null&&this.lyrics[a].time>t)break;e!==this._activeIndex&&(this._activeIndex=e,this.requestUpdate(),e!==-1&&this.updateComplete.then(()=>this._scrollToActive()))}_scrollToActive(e="smooth"){if(this._isScrolling&&e==="smooth")return;const t=this.renderRoot.querySelector(".lyrics-scroll-container"),a=t?.querySelector(".lyric-line.active");if(t&&a){const r=t.clientHeight/2,s=a.offsetTop,n=a.clientHeight,o=s+n/2-r;t.scrollTo({top:o,behavior:e})}}_handleScroll(){this._isScrolling=!0,this._scrollTimeout&&clearTimeout(this._scrollTimeout),this._scrollTimeout=setTimeout(()=>{this._isScrolling=!1,this._scrollToActive()},3e3)}render(){if(this.error)return _`
        <div class="lyrics-error">
          <ha-icon icon="mdi:text-box-remove-outline"></ha-icon>
          <div>${d("lyrics.not_available")}</div>
        </div>
      `;if(this.loading)return _`
        <div class="lyrics-loading">
          <ha-circular-progress active></ha-circular-progress>
          <div>${d("lyrics.finding")}</div>
        </div>
      `;if(!this.lyrics||this.lyrics.length===0)return _`
        <div class="lyrics-empty">
          <ha-icon icon="mdi:text-box-search-outline"></ha-icon>
          <div>${d("lyrics.none_found")}</div>
        </div>
      `;const e=!this.lyrics.some(t=>t.time!==null);return _`
      <div class="lyrics-scroll-container" @scroll=${this._handleScroll} style="--yamp-primary-color: ${this.activeThemeColor}">
        <div class="scroll-spacer"></div>
        ${this.lyrics.map((t,a)=>{const r=a===this._activeIndex,s=this.mode==="text",n=this.mode==="scroll";return this.mode,_`
            <div
              class="${wr({"lyric-line":!0,active:r&&!e,unsynced:e||s,"scroll-mode":n&&!e})}"
            >
              ${t.text}
            </div>
          `})}
        <div class="scroll-spacer"></div>
      </div>
    `}}customElements.define("yamp-lyrics-view",Bo);const Ho=[{mode:"replace",icon:"mdi:playlist-remove",label:d("search.replace")},{mode:"next",icon:"mdi:playlist-play",label:d("search.play_next")},{mode:"replace_next",icon:"mdi:playlist-music",label:d("search.replace_play")},{mode:"add",icon:"mdi:playlist-plus",label:d("search.add_queue")},{mode:"add_to_playlist",icon:"mdi:plus",label:d("search.add_to_playlist")}],zt=["artist","album","track","playlist","radio","podcast","audiobook"];function jr(i){return i&&(i.media_class==="track"||i.media_content_type==="track")}function Dr(i){return i&&(i.media_class==="radio"||i.media_content_type==="radio")}const Ve=(i,{cap:e,floor:t}={})=>{const a=Number(i);if(!Number.isFinite(a)||a<=0)return;let r=a;return typeof t=="number"&&(r=Math.max(t,r)),typeof e=="number"&&(r=Math.min(e,r)),r},Or=3e4;let Lt=null,ra=0;async function _i(i){const e=Date.now();if(Lt&&e-ra<Or)return Lt;try{return Lt=(await i.callApi("GET","config/config_entries/entry")).find(t=>t.domain==="music_assistant"&&t.state==="loaded")?.entry_id||null,ra=e,Lt}catch(t){return console.error("yamp: Failed to resolve Music Assistant config entry",t),Lt=null,ra=e,null}}let qt=null,sa=0;async function mi(i){const e=Date.now();if(qt&&e-sa<Or)return qt;try{return qt=(await i.callApi("GET","config/config_entries/entry")).find(t=>t.domain==="mass_queue"&&t.state==="loaded")?.entry_id||null,sa=e,qt}catch(t){return console.error("yamp: Failed to resolve mass_queue config entry",t),qt=null,sa=e,null}}function mt(i){return i?{title:i.name,media_content_id:i.uri,media_content_type:i.media_type,media_class:i.media_type,item_id:i.item_id,thumbnail:i.image,...i.artists&&{artist:i.artists.map(e=>e.name).join(", ")},...i.album&&{album:i.album.name,album_uri:i.album.uri},is_browsable:i.media_type==="artist"||i.media_type==="album"||i.media_type==="playlist"||i.media_type==="track",is_editable:i.is_editable===!0}:null}function Rr({item:i,onPlay:e,onOptionsToggle:t,upcomingFilterActive:a=!1,isMusicAssistant:r=!1,massQueueAvailable:s=!1,searchView:n="list",isInline:o=!1,onMoveUp:l,onMoveDown:c,onMoveNext:h,onRemove:u,minimal:p=!1,hideActions:m=!1}){if(m)return v;const f=!!(a&&i.queue_item_id&&r&&s),y=o?"entity-options-search-buttons":n==="card"?"card-overlay-buttons":"search-sheet-buttons",g=o?"entity-options-search-play":n==="card"?"search-sheet-play icon-only":"search-sheet-play",x=o?"entity-options-search-queue":n==="card"?"search-sheet-queue icon-only":"search-sheet-queue";return _`
    <div class="${y}">
      ${f&&o?_`
        <div class="queue-controls">
          <button class="queue-btn queue-btn-up" @click=${()=>l(i)} title="${d("search.move_up")}">
            <ha-icon icon="mdi:chevron-up"></ha-icon>
          </button>
          <button class="queue-btn queue-btn-down" @click=${()=>c(i)} title="${d("search.move_down")}">
            <ha-icon icon="mdi:chevron-down"></ha-icon>
          </button>
          <button class="queue-btn queue-btn-next" @click=${()=>h(i)} title="${d("search.move_next")}">
            <ha-icon icon="mdi:playlist-play"></ha-icon>
          </button>
          <button class="queue-btn queue-btn-remove" @click=${()=>u(i)} title="${d("search.remove")}">
            <ha-icon icon="mdi:close"></ha-icon>
          </button>
        </div>
      `:v}
      <button class="${g}" 
              @click=${()=>e(i)} 
              title="${d("search.play_item","{item}",i.title)}">
        <ha-icon icon="mdi:play"></ha-icon>
      </button>
      ${!f&&!Dr(i)&&!p?_`
        <button class="${x}" 
                @click=${k=>{k.preventDefault(),k.stopPropagation(),t(i)}} 
                title="${d("common.more_options")}">
          <ha-icon icon="mdi:dots-vertical"></ha-icon>
        </button>
      `:v}
    </div>
  `}function Go({item:i,activeSearchRowMenuId:e,onPlayOption:t,onOptionsToggle:a,searchView:r="list",isQueueItem:s=!1,massQueueAvailable:n=!1,onMoveUp:o,onMoveDown:l,onMoveNext:c,onRemove:h,hideActions:u=!1}){if(u)return v;const p=e!=null&&i.media_content_id!=null&&e===i.media_content_id;return _`
    <div class="search-row-slide-out ${p?"active":""}">
      ${s&&r==="card"?_`
        <button class="slide-out-button" @click=${()=>{o(i),a(null)}} title="${d("search.move_up")}">
          ${d("search.move_up")}
        </button>
        <button class="slide-out-button" @click=${()=>{l(i),a(null)}} title="${d("search.move_down")}">
          ${d("search.move_down")}
        </button>
        <button class="slide-out-button" @click=${()=>{c(i),a(null)}} title="${d("search.move_next")}">
          ${d("search.move_next")}
        </button>
        <button class="slide-out-button" @click=${()=>{h(i),a(null)}} title="${d("search.remove")}">
          ${d("search.remove")}
        </button>
      `:_`
        <button class="slide-out-button" @click=${()=>t(i,"replace")} title="${d("search.labels.replace")}">
          ${r==="card"?v:_`<ha-icon icon="mdi:playlist-remove"></ha-icon>`}${d("search.labels.replace")}
        </button>
        <button class="slide-out-button" @click=${()=>t(i,"next")} title="${d("search.labels.next")}">
          ${r==="card"?v:_`<ha-icon icon="mdi:playlist-play"></ha-icon>`}${d("search.labels.next")}
        </button>
        <button class="slide-out-button" @click=${()=>t(i,"replace_next")} title="${d("search.labels.replace_next")}">
          ${r==="card"?v:_`<ha-icon icon="mdi:playlist-music"></ha-icon>`}${d("search.labels.replace_next")}
        </button>
        <button class="slide-out-button" @click=${()=>t(i,"add")} title="${d("search.labels.add")}">
          ${r==="card"?v:_`<ha-icon icon="mdi:playlist-plus"></ha-icon>`}${d("search.labels.add")}
        </button>
        ${jr(i)&&n?_`
          <button class="slide-out-button" @click=${()=>t(i,"add_to_playlist")} title="${d("search.labels.add_to_playlist")}">
            ${r==="card"?v:_`<ha-icon icon="mdi:plus"></ha-icon>`}${d("search.labels.add_to_playlist")}
          </button>
        `:v}
      `}
      <div class="slide-out-close" @click=${m=>{m.stopPropagation(),a(null)}}>
        <ha-icon icon="mdi:close"></ha-icon>
      </div>

    </div>
  `}function Vo({item:i,onClose:e,onPlayOption:t,massQueueAvailable:a=!1}){return i?_`
    <div class="entity-options-overlay entity-options-overlay-opening" @click=${e}>
      <div class="entity-options-container entity-options-sheet-opening" @click=${r=>r.stopPropagation()}>
        <div class="entity-options-sheet">
          <div class="entity-options-title">${i.title}</div>
          
          ${Ho.filter(r=>r.mode==="add_to_playlist"?jr(i)&&a:!0).map(r=>_`
            <button class="entity-options-item menu-action-item" @click=${()=>t(i,r.mode)}>
              <ha-icon class="menu-action-icon" .icon=${r.icon}></ha-icon>
              <span class="menu-action-label">${r.label}</span>
            </button>
          `)}
          
          <div class="entity-options-divider"></div>
          
          <button class="entity-options-item close-item" @click=${e}>
            Cancel
          </button>
        </div>
      </div>
    </div>
  `:v}async function zr(i,e,t,a=null,r={},s=20){const n=await _i(i);if(n)try{if(r.favorites){const u=a&&a!=="all"?[a]:zt,p=[];return await Promise.all(u.map(async m=>{try{const f={type:"call_service",domain:"music_assistant",service:"get_library",service_data:{config_entry_id:n,media_type:m,favorite:!0,search:t},return_response:!0},y=Ve(s);y!==void 0&&(f.service_data.limit=y),r.orderBy&&r.orderBy!=="default"&&(f.service_data.order_by=r.orderBy),((await i.connection.sendMessagePromise(f))?.response?.items||[]).forEach(g=>{const x=mt(g);x&&p.push(x)})}catch(f){console.error("yamp: Error searching favorites for type",m,f)}})),{results:p,usedMusicAssistant:!0}}if((!t||t.trim()==="")&&a&&a!=="all"&&!r.favorites){if(!zt.includes(a))return console.warn(`yamp: Unsupported media type for browsing: ${a}. Skipping get_library call.`),{results:[],usedMusicAssistant:!0};try{const u={type:"call_service",domain:"music_assistant",service:"get_library",service_data:{config_entry_id:n,media_type:a},return_response:!0},p=Ve(s);p!==void 0&&(u.service_data.limit=p),r.orderBy&&r.orderBy!=="default"&&(u.service_data.order_by=r.orderBy);const m=(await i.connection.sendMessagePromise(u))?.response?.items||[],f=[];return m.forEach(y=>{const g=mt(y);g&&f.push(g)}),{results:f,usedMusicAssistant:!0}}catch(u){return console.error("yamp: Error browsing library for type",a,u),{results:[],usedMusicAssistant:!0}}}const o={name:t,config_entry_id:n},l=Ve(s,{cap:a==="all"?8:void 0});l!==void 0&&(o.limit=l),a&&a!=="all"&&(o.media_type=a),r.artist&&(o.artist=r.artist),r.album&&(o.album=r.album);const c={type:"call_service",domain:"music_assistant",service:"search",service_data:o,return_response:!0},h=(await i.connection.sendMessagePromise(c))?.response;if(h){const u=[];return Object.entries(h).forEach(([p,m])=>{Array.isArray(m)&&m.forEach(f=>{const y=mt(f);y&&u.push(y)})}),{results:u,usedMusicAssistant:!0}}}catch(o){console.error("yamp: Error in searchMedia:",o)}return{results:await Wo(i,e,t,a,r),usedMusicAssistant:!1}}async function Qo(i,e,t=null,a=20,r={}){const s=await _i(i);if(!s)return{results:[],usedMusicAssistant:!1};const n=typeof r.onChunk=="function"?r.onChunk:null,o=async(l,c={})=>{const h={type:"call_service",domain:"music_assistant",service:"get_library",service_data:{config_entry_id:s,media_type:l,order_by:"last_played_desc"},return_response:!0},u=Ve(a,c);return u!==void 0&&(h.service_data.limit=u),((await i.connection.sendMessagePromise(h))?.response?.items||[]).map(mt).filter(Boolean)};try{if(t==="all"){const c=[];return await Promise.all(zt.map(async h=>{const u=await o(h,{cap:5});u.length&&(c.push(...u),n&&n(u,h))})),{results:c,usedMusicAssistant:!0}}const l=await o(t||"track");return l.length&&n&&n(l,t||"track"),{results:l,usedMusicAssistant:!0}}catch(l){return console.error("yamp: Error getting recently played from Music Assistant:",l),{results:[],usedMusicAssistant:!1}}}async function Lr(i,e,t=null,a=20,r={}){const s=await _i(i);if(!s)return{results:[],usedMusicAssistant:!1};const n=typeof r.onChunk=="function"?r.onChunk:null,o=async l=>{const c={type:"call_service",domain:"music_assistant",service:"get_library",service_data:{config_entry_id:s,media_type:l,favorite:!0},return_response:!0},h=Ve(a,{cap:l==="all"?8:void 0});h!==void 0&&(c.service_data.limit=h),r.orderBy&&r.orderBy!=="default"&&(c.service_data.order_by=r.orderBy);try{return((await i.connection.sendMessagePromise(c))?.response?.items||[]).map(mt).filter(Boolean)}catch(u){return console.error("yamp: Error loading favorites for type",l,u),[]}};try{if(t&&t!=="all"){const c=await o(t);return c.length&&n&&n(c,t),{results:c,usedMusicAssistant:!0}}const l=[];return await Promise.all(zt.map(async c=>{const h=await o(c);h.length&&(l.push(...h),n&&n(h,c))})),{results:l,usedMusicAssistant:!0}}catch(l){return console.error("yamp: Error loading favorites",l),{results:[],usedMusicAssistant:!1}}}async function Wo(i,e,t,a,r={}){const s={entity_id:e,search_query:t};a&&a!=="all"&&(s.media_content_type=a);const n={type:"call_service",domain:"media_player",service:"search_media",service_data:s,return_response:!0},o=await i.connection.sendMessagePromise(n);return o?.response?.[e]?.result||o?.result||[]}function Yo(i,e,t){return i.callService("media_player","play_media",{entity_id:e,media_content_type:t.media_content_type,media_content_id:t.media_content_id})}async function Zo(i,e,t=null,a=null,r=null,s=100){if(!e)return!1;try{const n=await _i(i);if(!n)return!1;let o=t;if(!o){const l=Object.values(i.states).find(c=>_t(c)&&c.entity_id.startsWith("media_player."));if(l)o=l.entity_id;else return!1}if(a||r){try{const l={name:a||r,config_entry_id:n,media_type:"track"},c=Ve(s);c!==void 0&&(l.limit=c),r&&(l.artist=r);const h={type:"call_service",domain:"music_assistant",service:"search",service_data:l,return_response:!0},u=(await i.connection.sendMessagePromise(h))?.response;let p=[];if(Array.isArray(u)?p=u:u&&typeof u=="object"&&Object.values(u).forEach(m=>{Array.isArray(m)&&p.push(...m)}),p.length){const m=(e.split("/").pop()||"").trim(),f=p.find(x=>x?.uri===e),y=!f&&/^\d+$/.test(m)?p.find(x=>typeof x?.uri=="string"&&x.uri.endsWith(`/${m}`)):null,g=f||y||null;if(g&&typeof g.favorite=="boolean")return!!g.favorite}}catch{}if(a)try{const l={type:"call_service",domain:"music_assistant",service:"get_library",service_data:{config_entry_id:n,media_type:"track",favorite:!0,search:a.trim()},return_response:!0},c=Ve(s);if(c!==void 0&&(l.service_data.limit=c),((await i.connection.sendMessagePromise(l))?.response?.items||[]).some(h=>h.uri===e))return!0}catch{}}try{const l={type:"call_service",domain:"music_assistant",service:"get_library",service_data:{config_entry_id:n,media_type:"track",favorite:!0},return_response:!0},c=Ve(s,{floor:100});return c!==void 0&&(l.service_data.limit=c),((await i.connection.sendMessagePromise(l))?.response?.items||[]).some(h=>h.uri===e)}catch{}return!1}catch{return!1}}/*! js-yaml 4.1.1 https://github.com/nodeca/js-yaml @license MIT */function qr(i){return typeof i>"u"||i===null}function Ko(i){return typeof i=="object"&&i!==null}function Xo(i){return Array.isArray(i)?i:qr(i)?[]:[i]}function Jo(i,e){var t,a,r,s;if(e)for(s=Object.keys(e),t=0,a=s.length;t<a;t+=1)r=s[t],i[r]=e[r];return i}function el(i,e){var t="",a;for(a=0;a<e;a+=1)t+=i;return t}function tl(i){return i===0&&Number.NEGATIVE_INFINITY===1/i}var il=qr,al=Ko,rl=Xo,sl=el,nl=tl,ol=Jo,ee={isNothing:il,isObject:al,toArray:rl,repeat:sl,isNegativeZero:nl,extend:ol};function Nr(i,e){var t="",a=i.reason||"(unknown reason)";return i.mark?(i.mark.name&&(t+='in "'+i.mark.name+'" '),t+="("+(i.mark.line+1)+":"+(i.mark.column+1)+")",!e&&i.mark.snippet&&(t+=`

`+i.mark.snippet),a+" "+t):a}function Nt(i,e){Error.call(this),this.name="YAMLException",this.reason=i,this.mark=e,this.message=Nr(this,!1),Error.captureStackTrace?Error.captureStackTrace(this,this.constructor):this.stack=new Error().stack||""}Nt.prototype=Object.create(Error.prototype),Nt.prototype.constructor=Nt,Nt.prototype.toString=function(e){return this.name+": "+Nr(this,e)};var pe=Nt;function na(i,e,t,a,r){var s="",n="",o=Math.floor(r/2)-1;return a-e>o&&(s=" ... ",e=a-o+s.length),t-a>o&&(n=" ...",t=a+o-n.length),{str:s+i.slice(e,t).replace(/\t/g,"\u2192")+n,pos:a-e+s.length}}function oa(i,e){return ee.repeat(" ",e-i.length)+i}function ll(i,e){if(e=Object.create(e||null),!i.buffer)return null;e.maxLength||(e.maxLength=79),typeof e.indent!="number"&&(e.indent=1),typeof e.linesBefore!="number"&&(e.linesBefore=3),typeof e.linesAfter!="number"&&(e.linesAfter=2);for(var t=/\r?\n|\r|\0/g,a=[0],r=[],s,n=-1;s=t.exec(i.buffer);)r.push(s.index),a.push(s.index+s[0].length),i.position<=s.index&&n<0&&(n=a.length-2);n<0&&(n=a.length-1);var o="",l,c,h=Math.min(i.line+e.linesAfter,r.length).toString().length,u=e.maxLength-(e.indent+h+3);for(l=1;l<=e.linesBefore&&!(n-l<0);l++)c=na(i.buffer,a[n-l],r[n-l],i.position-(a[n]-a[n-l]),u),o=ee.repeat(" ",e.indent)+oa((i.line-l+1).toString(),h)+" | "+c.str+`
`+o;for(c=na(i.buffer,a[n],r[n],i.position,u),o+=ee.repeat(" ",e.indent)+oa((i.line+1).toString(),h)+" | "+c.str+`
`,o+=ee.repeat("-",e.indent+h+3+c.pos)+`^
`,l=1;l<=e.linesAfter&&!(n+l>=r.length);l++)c=na(i.buffer,a[n+l],r[n+l],i.position-(a[n]-a[n+l]),u),o+=ee.repeat(" ",e.indent)+oa((i.line+l+1).toString(),h)+" | "+c.str+`
`;return o.replace(/\n$/,"")}var cl=ll,dl=["kind","multi","resolve","construct","instanceOf","predicate","represent","representName","defaultStyle","styleAliases"],ul=["scalar","sequence","mapping"];function hl(i){var e={};return i!==null&&Object.keys(i).forEach(function(t){i[t].forEach(function(a){e[String(a)]=t})}),e}function pl(i,e){if(e=e||{},Object.keys(e).forEach(function(t){if(dl.indexOf(t)===-1)throw new pe('Unknown option "'+t+'" is met in definition of "'+i+'" YAML type.')}),this.options=e,this.tag=i,this.kind=e.kind||null,this.resolve=e.resolve||function(){return!0},this.construct=e.construct||function(t){return t},this.instanceOf=e.instanceOf||null,this.predicate=e.predicate||null,this.represent=e.represent||null,this.representName=e.representName||null,this.defaultStyle=e.defaultStyle||null,this.multi=e.multi||!1,this.styleAliases=hl(e.styleAliases||null),ul.indexOf(this.kind)===-1)throw new pe('Unknown kind "'+this.kind+'" is specified for "'+i+'" YAML type.')}var re=pl;function Ur(i,e){var t=[];return i[e].forEach(function(a){var r=t.length;t.forEach(function(s,n){s.tag===a.tag&&s.kind===a.kind&&s.multi===a.multi&&(r=n)}),t[r]=a}),t}function _l(){var i={scalar:{},sequence:{},mapping:{},fallback:{},multi:{scalar:[],sequence:[],mapping:[],fallback:[]}},e,t;function a(r){r.multi?(i.multi[r.kind].push(r),i.multi.fallback.push(r)):i[r.kind][r.tag]=i.fallback[r.tag]=r}for(e=0,t=arguments.length;e<t;e+=1)arguments[e].forEach(a);return i}function la(i){return this.extend(i)}la.prototype.extend=function(e){var t=[],a=[];if(e instanceof re)a.push(e);else if(Array.isArray(e))a=a.concat(e);else if(e&&(Array.isArray(e.implicit)||Array.isArray(e.explicit)))e.implicit&&(t=t.concat(e.implicit)),e.explicit&&(a=a.concat(e.explicit));else throw new pe("Schema.extend argument should be a Type, [ Type ], or a schema definition ({ implicit: [...], explicit: [...] })");t.forEach(function(s){if(!(s instanceof re))throw new pe("Specified list of YAML types (or a single Type object) contains a non-Type object.");if(s.loadKind&&s.loadKind!=="scalar")throw new pe("There is a non-scalar type in the implicit list of a schema. Implicit resolving of such types is not supported.");if(s.multi)throw new pe("There is a multi type in the implicit list of a schema. Multi tags can only be listed as explicit.")}),a.forEach(function(s){if(!(s instanceof re))throw new pe("Specified list of YAML types (or a single Type object) contains a non-Type object.")});var r=Object.create(la.prototype);return r.implicit=(this.implicit||[]).concat(t),r.explicit=(this.explicit||[]).concat(a),r.compiledImplicit=Ur(r,"implicit"),r.compiledExplicit=Ur(r,"explicit"),r.compiledTypeMap=_l(r.compiledImplicit,r.compiledExplicit),r};var Br=la,Hr=new re("tag:yaml.org,2002:str",{kind:"scalar",construct:function(i){return i!==null?i:""}}),Gr=new re("tag:yaml.org,2002:seq",{kind:"sequence",construct:function(i){return i!==null?i:[]}}),Vr=new re("tag:yaml.org,2002:map",{kind:"mapping",construct:function(i){return i!==null?i:{}}}),Qr=new Br({explicit:[Hr,Gr,Vr]});function ml(i){if(i===null)return!0;var e=i.length;return e===1&&i==="~"||e===4&&(i==="null"||i==="Null"||i==="NULL")}function fl(){return null}function yl(i){return i===null}var Wr=new re("tag:yaml.org,2002:null",{kind:"scalar",resolve:ml,construct:fl,predicate:yl,represent:{canonical:function(){return"~"},lowercase:function(){return"null"},uppercase:function(){return"NULL"},camelcase:function(){return"Null"},empty:function(){return""}},defaultStyle:"lowercase"});function vl(i){if(i===null)return!1;var e=i.length;return e===4&&(i==="true"||i==="True"||i==="TRUE")||e===5&&(i==="false"||i==="False"||i==="FALSE")}function gl(i){return i==="true"||i==="True"||i==="TRUE"}function bl(i){return Object.prototype.toString.call(i)==="[object Boolean]"}var Yr=new re("tag:yaml.org,2002:bool",{kind:"scalar",resolve:vl,construct:gl,predicate:bl,represent:{lowercase:function(i){return i?"true":"false"},uppercase:function(i){return i?"TRUE":"FALSE"},camelcase:function(i){return i?"True":"False"}},defaultStyle:"lowercase"});function xl(i){return 48<=i&&i<=57||65<=i&&i<=70||97<=i&&i<=102}function wl(i){return 48<=i&&i<=55}function kl(i){return 48<=i&&i<=57}function El(i){if(i===null)return!1;var e=i.length,t=0,a=!1,r;if(!e)return!1;if(r=i[t],(r==="-"||r==="+")&&(r=i[++t]),r==="0"){if(t+1===e)return!0;if(r=i[++t],r==="b"){for(t++;t<e;t++)if(r=i[t],r!=="_"){if(r!=="0"&&r!=="1")return!1;a=!0}return a&&r!=="_"}if(r==="x"){for(t++;t<e;t++)if(r=i[t],r!=="_"){if(!xl(i.charCodeAt(t)))return!1;a=!0}return a&&r!=="_"}if(r==="o"){for(t++;t<e;t++)if(r=i[t],r!=="_"){if(!wl(i.charCodeAt(t)))return!1;a=!0}return a&&r!=="_"}}if(r==="_")return!1;for(;t<e;t++)if(r=i[t],r!=="_"){if(!kl(i.charCodeAt(t)))return!1;a=!0}return!(!a||r==="_")}function Al(i){var e=i,t=1,a;if(e.indexOf("_")!==-1&&(e=e.replace(/_/g,"")),a=e[0],(a==="-"||a==="+")&&(a==="-"&&(t=-1),e=e.slice(1),a=e[0]),e==="0")return 0;if(a==="0"){if(e[1]==="b")return t*parseInt(e.slice(2),2);if(e[1]==="x")return t*parseInt(e.slice(2),16);if(e[1]==="o")return t*parseInt(e.slice(2),8)}return t*parseInt(e,10)}function Sl(i){return Object.prototype.toString.call(i)==="[object Number]"&&i%1===0&&!ee.isNegativeZero(i)}var Zr=new re("tag:yaml.org,2002:int",{kind:"scalar",resolve:El,construct:Al,predicate:Sl,represent:{binary:function(i){return i>=0?"0b"+i.toString(2):"-0b"+i.toString(2).slice(1)},octal:function(i){return i>=0?"0o"+i.toString(8):"-0o"+i.toString(8).slice(1)},decimal:function(i){return i.toString(10)},hexadecimal:function(i){return i>=0?"0x"+i.toString(16).toUpperCase():"-0x"+i.toString(16).toUpperCase().slice(1)}},defaultStyle:"decimal",styleAliases:{binary:[2,"bin"],octal:[8,"oct"],decimal:[10,"dec"],hexadecimal:[16,"hex"]}}),$l=new RegExp("^(?:[-+]?(?:[0-9][0-9_]*)(?:\\.[0-9_]*)?(?:[eE][-+]?[0-9]+)?|\\.[0-9_]+(?:[eE][-+]?[0-9]+)?|[-+]?\\.(?:inf|Inf|INF)|\\.(?:nan|NaN|NAN))$");function Il(i){return!(i===null||!$l.test(i)||i[i.length-1]==="_")}function Cl(i){var e,t;return e=i.replace(/_/g,"").toLowerCase(),t=e[0]==="-"?-1:1,"+-".indexOf(e[0])>=0&&(e=e.slice(1)),e===".inf"?t===1?Number.POSITIVE_INFINITY:Number.NEGATIVE_INFINITY:e===".nan"?NaN:t*parseFloat(e,10)}var Tl=/^[-+]?[0-9]+e/;function Ml(i,e){var t;if(isNaN(i))switch(e){case"lowercase":return".nan";case"uppercase":return".NAN";case"camelcase":return".NaN"}else if(Number.POSITIVE_INFINITY===i)switch(e){case"lowercase":return".inf";case"uppercase":return".INF";case"camelcase":return".Inf"}else if(Number.NEGATIVE_INFINITY===i)switch(e){case"lowercase":return"-.inf";case"uppercase":return"-.INF";case"camelcase":return"-.Inf"}else if(ee.isNegativeZero(i))return"-0.0";return t=i.toString(10),Tl.test(t)?t.replace("e",".e"):t}function Pl(i){return Object.prototype.toString.call(i)==="[object Number]"&&(i%1!==0||ee.isNegativeZero(i))}var Kr=new re("tag:yaml.org,2002:float",{kind:"scalar",resolve:Il,construct:Cl,predicate:Pl,represent:Ml,defaultStyle:"lowercase"}),Xr=Qr.extend({implicit:[Wr,Yr,Zr,Kr]}),Jr=Xr,es=new RegExp("^([0-9][0-9][0-9][0-9])-([0-9][0-9])-([0-9][0-9])$"),ts=new RegExp("^([0-9][0-9][0-9][0-9])-([0-9][0-9]?)-([0-9][0-9]?)(?:[Tt]|[ \\t]+)([0-9][0-9]?):([0-9][0-9]):([0-9][0-9])(?:\\.([0-9]*))?(?:[ \\t]*(Z|([-+])([0-9][0-9]?)(?::([0-9][0-9]))?))?$");function Fl(i){return i===null?!1:es.exec(i)!==null||ts.exec(i)!==null}function jl(i){var e,t,a,r,s,n,o,l=0,c=null,h,u,p;if(e=es.exec(i),e===null&&(e=ts.exec(i)),e===null)throw new Error("Date resolve error");if(t=+e[1],a=+e[2]-1,r=+e[3],!e[4])return new Date(Date.UTC(t,a,r));if(s=+e[4],n=+e[5],o=+e[6],e[7]){for(l=e[7].slice(0,3);l.length<3;)l+="0";l=+l}return e[9]&&(h=+e[10],u=+(e[11]||0),c=(h*60+u)*6e4,e[9]==="-"&&(c=-c)),p=new Date(Date.UTC(t,a,r,s,n,o,l)),c&&p.setTime(p.getTime()-c),p}function Dl(i){return i.toISOString()}var is=new re("tag:yaml.org,2002:timestamp",{kind:"scalar",resolve:Fl,construct:jl,instanceOf:Date,represent:Dl});function Ol(i){return i==="<<"||i===null}var as=new re("tag:yaml.org,2002:merge",{kind:"scalar",resolve:Ol}),ca=`ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=
\r`;function Rl(i){if(i===null)return!1;var e,t,a=0,r=i.length,s=ca;for(t=0;t<r;t++)if(e=s.indexOf(i.charAt(t)),!(e>64)){if(e<0)return!1;a+=6}return a%8===0}function zl(i){var e,t,a=i.replace(/[\r\n=]/g,""),r=a.length,s=ca,n=0,o=[];for(e=0;e<r;e++)e%4===0&&e&&(o.push(n>>16&255),o.push(n>>8&255),o.push(n&255)),n=n<<6|s.indexOf(a.charAt(e));return t=r%4*6,t===0?(o.push(n>>16&255),o.push(n>>8&255),o.push(n&255)):t===18?(o.push(n>>10&255),o.push(n>>2&255)):t===12&&o.push(n>>4&255),new Uint8Array(o)}function Ll(i){var e="",t=0,a,r,s=i.length,n=ca;for(a=0;a<s;a++)a%3===0&&a&&(e+=n[t>>18&63],e+=n[t>>12&63],e+=n[t>>6&63],e+=n[t&63]),t=(t<<8)+i[a];return r=s%3,r===0?(e+=n[t>>18&63],e+=n[t>>12&63],e+=n[t>>6&63],e+=n[t&63]):r===2?(e+=n[t>>10&63],e+=n[t>>4&63],e+=n[t<<2&63],e+=n[64]):r===1&&(e+=n[t>>2&63],e+=n[t<<4&63],e+=n[64],e+=n[64]),e}function ql(i){return Object.prototype.toString.call(i)==="[object Uint8Array]"}var rs=new re("tag:yaml.org,2002:binary",{kind:"scalar",resolve:Rl,construct:zl,predicate:ql,represent:Ll}),Nl=Object.prototype.hasOwnProperty,Ul=Object.prototype.toString;function Bl(i){if(i===null)return!0;var e=[],t,a,r,s,n,o=i;for(t=0,a=o.length;t<a;t+=1){if(r=o[t],n=!1,Ul.call(r)!=="[object Object]")return!1;for(s in r)if(Nl.call(r,s))if(!n)n=!0;else return!1;if(!n)return!1;if(e.indexOf(s)===-1)e.push(s);else return!1}return!0}function Hl(i){return i!==null?i:[]}var ss=new re("tag:yaml.org,2002:omap",{kind:"sequence",resolve:Bl,construct:Hl}),Gl=Object.prototype.toString;function Vl(i){if(i===null)return!0;var e,t,a,r,s,n=i;for(s=new Array(n.length),e=0,t=n.length;e<t;e+=1){if(a=n[e],Gl.call(a)!=="[object Object]"||(r=Object.keys(a),r.length!==1))return!1;s[e]=[r[0],a[r[0]]]}return!0}function Ql(i){if(i===null)return[];var e,t,a,r,s,n=i;for(s=new Array(n.length),e=0,t=n.length;e<t;e+=1)a=n[e],r=Object.keys(a),s[e]=[r[0],a[r[0]]];return s}var ns=new re("tag:yaml.org,2002:pairs",{kind:"sequence",resolve:Vl,construct:Ql}),Wl=Object.prototype.hasOwnProperty;function Yl(i){if(i===null)return!0;var e,t=i;for(e in t)if(Wl.call(t,e)&&t[e]!==null)return!1;return!0}function Zl(i){return i!==null?i:{}}var os=new re("tag:yaml.org,2002:set",{kind:"mapping",resolve:Yl,construct:Zl}),da=Jr.extend({implicit:[is,as],explicit:[rs,ss,ns,os]}),Qe=Object.prototype.hasOwnProperty,fi=1,ls=2,cs=3,yi=4,ua=1,Kl=2,ds=3,Xl=/[\x00-\x08\x0B\x0C\x0E-\x1F\x7F-\x84\x86-\x9F\uFFFE\uFFFF]|[\uD800-\uDBFF](?![\uDC00-\uDFFF])|(?:[^\uD800-\uDBFF]|^)[\uDC00-\uDFFF]/,Jl=/[\x85\u2028\u2029]/,ec=/[,\[\]\{\}]/,us=/^(?:!|!!|![a-z\-]+!)$/i,hs=/^(?:!|[^,\[\]\{\}])(?:%[0-9a-f]{2}|[0-9a-z\-#;\/\?:@&=\+\$,_\.!~\*'\(\)\[\]])*$/i;function ps(i){return Object.prototype.toString.call(i)}function Te(i){return i===10||i===13}function lt(i){return i===9||i===32}function ve(i){return i===9||i===32||i===10||i===13}function ft(i){return i===44||i===91||i===93||i===123||i===125}function tc(i){var e;return 48<=i&&i<=57?i-48:(e=i|32,97<=e&&e<=102?e-97+10:-1)}function ic(i){return i===120?2:i===117?4:i===85?8:0}function ac(i){return 48<=i&&i<=57?i-48:-1}function _s(i){return i===48?"\0":i===97?"\x07":i===98?"\b":i===116||i===9?"	":i===110?`
`:i===118?"\v":i===102?"\f":i===114?"\r":i===101?"\x1B":i===32?" ":i===34?'"':i===47?"/":i===92?"\\":i===78?"\x85":i===95?"\xA0":i===76?"\u2028":i===80?"\u2029":""}function rc(i){return i<=65535?String.fromCharCode(i):String.fromCharCode((i-65536>>10)+55296,(i-65536&1023)+56320)}function ms(i,e,t){e==="__proto__"?Object.defineProperty(i,e,{configurable:!0,enumerable:!0,writable:!0,value:t}):i[e]=t}for(var fs=new Array(256),ys=new Array(256),yt=0;yt<256;yt++)fs[yt]=_s(yt)?1:0,ys[yt]=_s(yt);function sc(i,e){this.input=i,this.filename=e.filename||null,this.schema=e.schema||da,this.onWarning=e.onWarning||null,this.legacy=e.legacy||!1,this.json=e.json||!1,this.listener=e.listener||null,this.implicitTypes=this.schema.compiledImplicit,this.typeMap=this.schema.compiledTypeMap,this.length=i.length,this.position=0,this.line=0,this.lineStart=0,this.lineIndent=0,this.firstTabInLine=-1,this.documents=[]}function vs(i,e){var t={name:i.filename,buffer:i.input.slice(0,-1),position:i.position,line:i.line,column:i.position-i.lineStart};return t.snippet=cl(t),new pe(e,t)}function A(i,e){throw vs(i,e)}function vi(i,e){i.onWarning&&i.onWarning.call(null,vs(i,e))}var gs={YAML:function(e,t,a){var r,s,n;e.version!==null&&A(e,"duplication of %YAML directive"),a.length!==1&&A(e,"YAML directive accepts exactly one argument"),r=/^([0-9]+)\.([0-9]+)$/.exec(a[0]),r===null&&A(e,"ill-formed argument of the YAML directive"),s=parseInt(r[1],10),n=parseInt(r[2],10),s!==1&&A(e,"unacceptable YAML version of the document"),e.version=a[0],e.checkLineBreaks=n<2,n!==1&&n!==2&&vi(e,"unsupported YAML version of the document")},TAG:function(e,t,a){var r,s;a.length!==2&&A(e,"TAG directive accepts exactly two arguments"),r=a[0],s=a[1],us.test(r)||A(e,"ill-formed tag handle (first argument) of the TAG directive"),Qe.call(e.tagMap,r)&&A(e,'there is a previously declared suffix for "'+r+'" tag handle'),hs.test(s)||A(e,"ill-formed tag prefix (second argument) of the TAG directive");try{s=decodeURIComponent(s)}catch{A(e,"tag prefix is malformed: "+s)}e.tagMap[r]=s}};function We(i,e,t,a){var r,s,n,o;if(e<t){if(o=i.input.slice(e,t),a)for(r=0,s=o.length;r<s;r+=1)n=o.charCodeAt(r),n===9||32<=n&&n<=1114111||A(i,"expected valid JSON character");else Xl.test(o)&&A(i,"the stream contains non-printable characters");i.result+=o}}function bs(i,e,t,a){var r,s,n,o;for(ee.isObject(t)||A(i,"cannot merge mappings; the provided source object is unacceptable"),r=Object.keys(t),n=0,o=r.length;n<o;n+=1)s=r[n],Qe.call(e,s)||(ms(e,s,t[s]),a[s]=!0)}function vt(i,e,t,a,r,s,n,o,l){var c,h;if(Array.isArray(r))for(r=Array.prototype.slice.call(r),c=0,h=r.length;c<h;c+=1)Array.isArray(r[c])&&A(i,"nested arrays are not supported inside keys"),typeof r=="object"&&ps(r[c])==="[object Object]"&&(r[c]="[object Object]");if(typeof r=="object"&&ps(r)==="[object Object]"&&(r="[object Object]"),r=String(r),e===null&&(e={}),a==="tag:yaml.org,2002:merge")if(Array.isArray(s))for(c=0,h=s.length;c<h;c+=1)bs(i,e,s[c],t);else bs(i,e,s,t);else!i.json&&!Qe.call(t,r)&&Qe.call(e,r)&&(i.line=n||i.line,i.lineStart=o||i.lineStart,i.position=l||i.position,A(i,"duplicated mapping key")),ms(e,r,s),delete t[r];return e}function ha(i){var e;e=i.input.charCodeAt(i.position),e===10?i.position++:e===13?(i.position++,i.input.charCodeAt(i.position)===10&&i.position++):A(i,"a line break is expected"),i.line+=1,i.lineStart=i.position,i.firstTabInLine=-1}function K(i,e,t){for(var a=0,r=i.input.charCodeAt(i.position);r!==0;){for(;lt(r);)r===9&&i.firstTabInLine===-1&&(i.firstTabInLine=i.position),r=i.input.charCodeAt(++i.position);if(e&&r===35)do r=i.input.charCodeAt(++i.position);while(r!==10&&r!==13&&r!==0);if(Te(r))for(ha(i),r=i.input.charCodeAt(i.position),a++,i.lineIndent=0;r===32;)i.lineIndent++,r=i.input.charCodeAt(++i.position);else break}return t!==-1&&a!==0&&i.lineIndent<t&&vi(i,"deficient indentation"),a}function gi(i){var e=i.position,t;return t=i.input.charCodeAt(e),!!((t===45||t===46)&&t===i.input.charCodeAt(e+1)&&t===i.input.charCodeAt(e+2)&&(e+=3,t=i.input.charCodeAt(e),t===0||ve(t)))}function pa(i,e){e===1?i.result+=" ":e>1&&(i.result+=ee.repeat(`
`,e-1))}function nc(i,e,t){var a,r,s,n,o,l,c,h,u=i.kind,p=i.result,m;if(m=i.input.charCodeAt(i.position),ve(m)||ft(m)||m===35||m===38||m===42||m===33||m===124||m===62||m===39||m===34||m===37||m===64||m===96||(m===63||m===45)&&(r=i.input.charCodeAt(i.position+1),ve(r)||t&&ft(r)))return!1;for(i.kind="scalar",i.result="",s=n=i.position,o=!1;m!==0;){if(m===58){if(r=i.input.charCodeAt(i.position+1),ve(r)||t&&ft(r))break}else if(m===35){if(a=i.input.charCodeAt(i.position-1),ve(a))break}else{if(i.position===i.lineStart&&gi(i)||t&&ft(m))break;if(Te(m))if(l=i.line,c=i.lineStart,h=i.lineIndent,K(i,!1,-1),i.lineIndent>=e){o=!0,m=i.input.charCodeAt(i.position);continue}else{i.position=n,i.line=l,i.lineStart=c,i.lineIndent=h;break}}o&&(We(i,s,n,!1),pa(i,i.line-l),s=n=i.position,o=!1),lt(m)||(n=i.position+1),m=i.input.charCodeAt(++i.position)}return We(i,s,n,!1),i.result?!0:(i.kind=u,i.result=p,!1)}function oc(i,e){var t,a,r;if(t=i.input.charCodeAt(i.position),t!==39)return!1;for(i.kind="scalar",i.result="",i.position++,a=r=i.position;(t=i.input.charCodeAt(i.position))!==0;)if(t===39)if(We(i,a,i.position,!0),t=i.input.charCodeAt(++i.position),t===39)a=i.position,i.position++,r=i.position;else return!0;else Te(t)?(We(i,a,r,!0),pa(i,K(i,!1,e)),a=r=i.position):i.position===i.lineStart&&gi(i)?A(i,"unexpected end of the document within a single quoted scalar"):(i.position++,r=i.position);A(i,"unexpected end of the stream within a single quoted scalar")}function lc(i,e){var t,a,r,s,n,o;if(o=i.input.charCodeAt(i.position),o!==34)return!1;for(i.kind="scalar",i.result="",i.position++,t=a=i.position;(o=i.input.charCodeAt(i.position))!==0;){if(o===34)return We(i,t,i.position,!0),i.position++,!0;if(o===92){if(We(i,t,i.position,!0),o=i.input.charCodeAt(++i.position),Te(o))K(i,!1,e);else if(o<256&&fs[o])i.result+=ys[o],i.position++;else if((n=ic(o))>0){for(r=n,s=0;r>0;r--)o=i.input.charCodeAt(++i.position),(n=tc(o))>=0?s=(s<<4)+n:A(i,"expected hexadecimal character");i.result+=rc(s),i.position++}else A(i,"unknown escape sequence");t=a=i.position}else Te(o)?(We(i,t,a,!0),pa(i,K(i,!1,e)),t=a=i.position):i.position===i.lineStart&&gi(i)?A(i,"unexpected end of the document within a double quoted scalar"):(i.position++,a=i.position)}A(i,"unexpected end of the stream within a double quoted scalar")}function cc(i,e){var t=!0,a,r,s,n=i.tag,o,l=i.anchor,c,h,u,p,m,f=Object.create(null),y,g,x,k;if(k=i.input.charCodeAt(i.position),k===91)h=93,m=!1,o=[];else if(k===123)h=125,m=!0,o={};else return!1;for(i.anchor!==null&&(i.anchorMap[i.anchor]=o),k=i.input.charCodeAt(++i.position);k!==0;){if(K(i,!0,e),k=i.input.charCodeAt(i.position),k===h)return i.position++,i.tag=n,i.anchor=l,i.kind=m?"mapping":"sequence",i.result=o,!0;t?k===44&&A(i,"expected the node content, but found ','"):A(i,"missed comma between flow collection entries"),g=y=x=null,u=p=!1,k===63&&(c=i.input.charCodeAt(i.position+1),ve(c)&&(u=p=!0,i.position++,K(i,!0,e))),a=i.line,r=i.lineStart,s=i.position,gt(i,e,fi,!1,!0),g=i.tag,y=i.result,K(i,!0,e),k=i.input.charCodeAt(i.position),(p||i.line===a)&&k===58&&(u=!0,k=i.input.charCodeAt(++i.position),K(i,!0,e),gt(i,e,fi,!1,!0),x=i.result),m?vt(i,o,f,g,y,x,a,r,s):u?o.push(vt(i,null,f,g,y,x,a,r,s)):o.push(y),K(i,!0,e),k=i.input.charCodeAt(i.position),k===44?(t=!0,k=i.input.charCodeAt(++i.position)):t=!1}A(i,"unexpected end of the stream within a flow collection")}function dc(i,e){var t,a,r=ua,s=!1,n=!1,o=e,l=0,c=!1,h,u;if(u=i.input.charCodeAt(i.position),u===124)a=!1;else if(u===62)a=!0;else return!1;for(i.kind="scalar",i.result="";u!==0;)if(u=i.input.charCodeAt(++i.position),u===43||u===45)ua===r?r=u===43?ds:Kl:A(i,"repeat of a chomping mode identifier");else if((h=ac(u))>=0)h===0?A(i,"bad explicit indentation width of a block scalar; it cannot be less than one"):n?A(i,"repeat of an indentation width identifier"):(o=e+h-1,n=!0);else break;if(lt(u)){do u=i.input.charCodeAt(++i.position);while(lt(u));if(u===35)do u=i.input.charCodeAt(++i.position);while(!Te(u)&&u!==0)}for(;u!==0;){for(ha(i),i.lineIndent=0,u=i.input.charCodeAt(i.position);(!n||i.lineIndent<o)&&u===32;)i.lineIndent++,u=i.input.charCodeAt(++i.position);if(!n&&i.lineIndent>o&&(o=i.lineIndent),Te(u)){l++;continue}if(i.lineIndent<o){r===ds?i.result+=ee.repeat(`
`,s?1+l:l):r===ua&&s&&(i.result+=`
`);break}for(a?lt(u)?(c=!0,i.result+=ee.repeat(`
`,s?1+l:l)):c?(c=!1,i.result+=ee.repeat(`
`,l+1)):l===0?s&&(i.result+=" "):i.result+=ee.repeat(`
`,l):i.result+=ee.repeat(`
`,s?1+l:l),s=!0,n=!0,l=0,t=i.position;!Te(u)&&u!==0;)u=i.input.charCodeAt(++i.position);We(i,t,i.position,!1)}return!0}function xs(i,e){var t,a=i.tag,r=i.anchor,s=[],n,o=!1,l;if(i.firstTabInLine!==-1)return!1;for(i.anchor!==null&&(i.anchorMap[i.anchor]=s),l=i.input.charCodeAt(i.position);l!==0&&(i.firstTabInLine!==-1&&(i.position=i.firstTabInLine,A(i,"tab characters must not be used in indentation")),!(l!==45||(n=i.input.charCodeAt(i.position+1),!ve(n))));){if(o=!0,i.position++,K(i,!0,-1)&&i.lineIndent<=e){s.push(null),l=i.input.charCodeAt(i.position);continue}if(t=i.line,gt(i,e,cs,!1,!0),s.push(i.result),K(i,!0,-1),l=i.input.charCodeAt(i.position),(i.line===t||i.lineIndent>e)&&l!==0)A(i,"bad indentation of a sequence entry");else if(i.lineIndent<e)break}return o?(i.tag=a,i.anchor=r,i.kind="sequence",i.result=s,!0):!1}function uc(i,e,t){var a,r,s,n,o,l,c=i.tag,h=i.anchor,u={},p=Object.create(null),m=null,f=null,y=null,g=!1,x=!1,k;if(i.firstTabInLine!==-1)return!1;for(i.anchor!==null&&(i.anchorMap[i.anchor]=u),k=i.input.charCodeAt(i.position);k!==0;){if(!g&&i.firstTabInLine!==-1&&(i.position=i.firstTabInLine,A(i,"tab characters must not be used in indentation")),a=i.input.charCodeAt(i.position+1),s=i.line,(k===63||k===58)&&ve(a))k===63?(g&&(vt(i,u,p,m,f,null,n,o,l),m=f=y=null),x=!0,g=!0,r=!0):g?(g=!1,r=!0):A(i,"incomplete explicit mapping pair; a key node is missed; or followed by a non-tabulated empty line"),i.position+=1,k=a;else{if(n=i.line,o=i.lineStart,l=i.position,!gt(i,t,ls,!1,!0))break;if(i.line===s){for(k=i.input.charCodeAt(i.position);lt(k);)k=i.input.charCodeAt(++i.position);if(k===58)k=i.input.charCodeAt(++i.position),ve(k)||A(i,"a whitespace character is expected after the key-value separator within a block mapping"),g&&(vt(i,u,p,m,f,null,n,o,l),m=f=y=null),x=!0,g=!1,r=!1,m=i.tag,f=i.result;else if(x)A(i,"can not read an implicit mapping pair; a colon is missed");else return i.tag=c,i.anchor=h,!0}else if(x)A(i,"can not read a block mapping entry; a multiline key may not be an implicit key");else return i.tag=c,i.anchor=h,!0}if((i.line===s||i.lineIndent>e)&&(g&&(n=i.line,o=i.lineStart,l=i.position),gt(i,e,yi,!0,r)&&(g?f=i.result:y=i.result),g||(vt(i,u,p,m,f,y,n,o,l),m=f=y=null),K(i,!0,-1),k=i.input.charCodeAt(i.position)),(i.line===s||i.lineIndent>e)&&k!==0)A(i,"bad indentation of a mapping entry");else if(i.lineIndent<e)break}return g&&vt(i,u,p,m,f,null,n,o,l),x&&(i.tag=c,i.anchor=h,i.kind="mapping",i.result=u),x}function hc(i){var e,t=!1,a=!1,r,s,n;if(n=i.input.charCodeAt(i.position),n!==33)return!1;if(i.tag!==null&&A(i,"duplication of a tag property"),n=i.input.charCodeAt(++i.position),n===60?(t=!0,n=i.input.charCodeAt(++i.position)):n===33?(a=!0,r="!!",n=i.input.charCodeAt(++i.position)):r="!",e=i.position,t){do n=i.input.charCodeAt(++i.position);while(n!==0&&n!==62);i.position<i.length?(s=i.input.slice(e,i.position),n=i.input.charCodeAt(++i.position)):A(i,"unexpected end of the stream within a verbatim tag")}else{for(;n!==0&&!ve(n);)n===33&&(a?A(i,"tag suffix cannot contain exclamation marks"):(r=i.input.slice(e-1,i.position+1),us.test(r)||A(i,"named tag handle cannot contain such characters"),a=!0,e=i.position+1)),n=i.input.charCodeAt(++i.position);s=i.input.slice(e,i.position),ec.test(s)&&A(i,"tag suffix cannot contain flow indicator characters")}s&&!hs.test(s)&&A(i,"tag name cannot contain such characters: "+s);try{s=decodeURIComponent(s)}catch{A(i,"tag name is malformed: "+s)}return t?i.tag=s:Qe.call(i.tagMap,r)?i.tag=i.tagMap[r]+s:r==="!"?i.tag="!"+s:r==="!!"?i.tag="tag:yaml.org,2002:"+s:A(i,'undeclared tag handle "'+r+'"'),!0}function pc(i){var e,t;if(t=i.input.charCodeAt(i.position),t!==38)return!1;for(i.anchor!==null&&A(i,"duplication of an anchor property"),t=i.input.charCodeAt(++i.position),e=i.position;t!==0&&!ve(t)&&!ft(t);)t=i.input.charCodeAt(++i.position);return i.position===e&&A(i,"name of an anchor node must contain at least one character"),i.anchor=i.input.slice(e,i.position),!0}function _c(i){var e,t,a;if(a=i.input.charCodeAt(i.position),a!==42)return!1;for(a=i.input.charCodeAt(++i.position),e=i.position;a!==0&&!ve(a)&&!ft(a);)a=i.input.charCodeAt(++i.position);return i.position===e&&A(i,"name of an alias node must contain at least one character"),t=i.input.slice(e,i.position),Qe.call(i.anchorMap,t)||A(i,'unidentified alias "'+t+'"'),i.result=i.anchorMap[t],K(i,!0,-1),!0}function gt(i,e,t,a,r){var s,n,o,l=1,c=!1,h=!1,u,p,m,f,y,g;if(i.listener!==null&&i.listener("open",i),i.tag=null,i.anchor=null,i.kind=null,i.result=null,s=n=o=yi===t||cs===t,a&&K(i,!0,-1)&&(c=!0,i.lineIndent>e?l=1:i.lineIndent===e?l=0:i.lineIndent<e&&(l=-1)),l===1)for(;hc(i)||pc(i);)K(i,!0,-1)?(c=!0,o=s,i.lineIndent>e?l=1:i.lineIndent===e?l=0:i.lineIndent<e&&(l=-1)):o=!1;if(o&&(o=c||r),(l===1||yi===t)&&(fi===t||ls===t?y=e:y=e+1,g=i.position-i.lineStart,l===1?o&&(xs(i,g)||uc(i,g,y))||cc(i,y)?h=!0:(n&&dc(i,y)||oc(i,y)||lc(i,y)?h=!0:_c(i)?(h=!0,(i.tag!==null||i.anchor!==null)&&A(i,"alias node should not have any properties")):nc(i,y,fi===t)&&(h=!0,i.tag===null&&(i.tag="?")),i.anchor!==null&&(i.anchorMap[i.anchor]=i.result)):l===0&&(h=o&&xs(i,g))),i.tag===null)i.anchor!==null&&(i.anchorMap[i.anchor]=i.result);else if(i.tag==="?"){for(i.result!==null&&i.kind!=="scalar"&&A(i,'unacceptable node kind for !<?> tag; it should be "scalar", not "'+i.kind+'"'),u=0,p=i.implicitTypes.length;u<p;u+=1)if(f=i.implicitTypes[u],f.resolve(i.result)){i.result=f.construct(i.result),i.tag=f.tag,i.anchor!==null&&(i.anchorMap[i.anchor]=i.result);break}}else if(i.tag!=="!"){if(Qe.call(i.typeMap[i.kind||"fallback"],i.tag))f=i.typeMap[i.kind||"fallback"][i.tag];else for(f=null,m=i.typeMap.multi[i.kind||"fallback"],u=0,p=m.length;u<p;u+=1)if(i.tag.slice(0,m[u].tag.length)===m[u].tag){f=m[u];break}f||A(i,"unknown tag !<"+i.tag+">"),i.result!==null&&f.kind!==i.kind&&A(i,"unacceptable node kind for !<"+i.tag+'> tag; it should be "'+f.kind+'", not "'+i.kind+'"'),f.resolve(i.result,i.tag)?(i.result=f.construct(i.result,i.tag),i.anchor!==null&&(i.anchorMap[i.anchor]=i.result)):A(i,"cannot resolve a node with !<"+i.tag+"> explicit tag")}return i.listener!==null&&i.listener("close",i),i.tag!==null||i.anchor!==null||h}function mc(i){var e=i.position,t,a,r,s=!1,n;for(i.version=null,i.checkLineBreaks=i.legacy,i.tagMap=Object.create(null),i.anchorMap=Object.create(null);(n=i.input.charCodeAt(i.position))!==0&&(K(i,!0,-1),n=i.input.charCodeAt(i.position),!(i.lineIndent>0||n!==37));){for(s=!0,n=i.input.charCodeAt(++i.position),t=i.position;n!==0&&!ve(n);)n=i.input.charCodeAt(++i.position);for(a=i.input.slice(t,i.position),r=[],a.length<1&&A(i,"directive name must not be less than one character in length");n!==0;){for(;lt(n);)n=i.input.charCodeAt(++i.position);if(n===35){do n=i.input.charCodeAt(++i.position);while(n!==0&&!Te(n));break}if(Te(n))break;for(t=i.position;n!==0&&!ve(n);)n=i.input.charCodeAt(++i.position);r.push(i.input.slice(t,i.position))}n!==0&&ha(i),Qe.call(gs,a)?gs[a](i,a,r):vi(i,'unknown document directive "'+a+'"')}if(K(i,!0,-1),i.lineIndent===0&&i.input.charCodeAt(i.position)===45&&i.input.charCodeAt(i.position+1)===45&&i.input.charCodeAt(i.position+2)===45?(i.position+=3,K(i,!0,-1)):s&&A(i,"directives end mark is expected"),gt(i,i.lineIndent-1,yi,!1,!0),K(i,!0,-1),i.checkLineBreaks&&Jl.test(i.input.slice(e,i.position))&&vi(i,"non-ASCII line breaks are interpreted as content"),i.documents.push(i.result),i.position===i.lineStart&&gi(i)){i.input.charCodeAt(i.position)===46&&(i.position+=3,K(i,!0,-1));return}if(i.position<i.length-1)A(i,"end of the stream or a document separator is expected");else return}function ws(i,e){i=String(i),e=e||{},i.length!==0&&(i.charCodeAt(i.length-1)!==10&&i.charCodeAt(i.length-1)!==13&&(i+=`
`),i.charCodeAt(0)===65279&&(i=i.slice(1)));var t=new sc(i,e),a=i.indexOf("\0");for(a!==-1&&(t.position=a,A(t,"null byte is not allowed in input")),t.input+="\0";t.input.charCodeAt(t.position)===32;)t.lineIndent+=1,t.position+=1;for(;t.position<t.length-1;)mc(t);return t.documents}function fc(i,e,t){e!==null&&typeof e=="object"&&typeof t>"u"&&(t=e,e=null);var a=ws(i,t);if(typeof e!="function")return a;for(var r=0,s=a.length;r<s;r+=1)e(a[r])}function yc(i,e){var t=ws(i,e);if(t.length!==0){if(t.length===1)return t[0];throw new pe("expected a single document in the stream, but found more")}}var vc=fc,gc=yc,ks={loadAll:vc,load:gc},Es=Object.prototype.toString,As=Object.prototype.hasOwnProperty,_a=65279,bc=9,Ut=10,xc=13,wc=32,kc=33,Ec=34,ma=35,Ac=37,Sc=38,$c=39,Ic=42,Ss=44,Cc=45,bi=58,Tc=61,Mc=62,Pc=63,Fc=64,$s=91,Is=93,jc=96,Cs=123,Dc=124,Ts=125,ce={};ce[0]="\\0",ce[7]="\\a",ce[8]="\\b",ce[9]="\\t",ce[10]="\\n",ce[11]="\\v",ce[12]="\\f",ce[13]="\\r",ce[27]="\\e",ce[34]='\\"',ce[92]="\\\\",ce[133]="\\N",ce[160]="\\_",ce[8232]="\\L",ce[8233]="\\P";var Oc=["y","Y","yes","Yes","YES","on","On","ON","n","N","no","No","NO","off","Off","OFF"],Rc=/^[-+]?[0-9_]+(?::[0-9_]+)+(?:\.[0-9_]*)?$/;function zc(i,e){var t,a,r,s,n,o,l;if(e===null)return{};for(t={},a=Object.keys(e),r=0,s=a.length;r<s;r+=1)n=a[r],o=String(e[n]),n.slice(0,2)==="!!"&&(n="tag:yaml.org,2002:"+n.slice(2)),l=i.compiledTypeMap.fallback[n],l&&As.call(l.styleAliases,o)&&(o=l.styleAliases[o]),t[n]=o;return t}function Lc(i){var e,t,a;if(e=i.toString(16).toUpperCase(),i<=255)t="x",a=2;else if(i<=65535)t="u",a=4;else if(i<=4294967295)t="U",a=8;else throw new pe("code point within a string may not be greater than 0xFFFFFFFF");return"\\"+t+ee.repeat("0",a-e.length)+e}var qc=1,Bt=2;function Nc(i){this.schema=i.schema||da,this.indent=Math.max(1,i.indent||2),this.noArrayIndent=i.noArrayIndent||!1,this.skipInvalid=i.skipInvalid||!1,this.flowLevel=ee.isNothing(i.flowLevel)?-1:i.flowLevel,this.styleMap=zc(this.schema,i.styles||null),this.sortKeys=i.sortKeys||!1,this.lineWidth=i.lineWidth||80,this.noRefs=i.noRefs||!1,this.noCompatMode=i.noCompatMode||!1,this.condenseFlow=i.condenseFlow||!1,this.quotingType=i.quotingType==='"'?Bt:qc,this.forceQuotes=i.forceQuotes||!1,this.replacer=typeof i.replacer=="function"?i.replacer:null,this.implicitTypes=this.schema.compiledImplicit,this.explicitTypes=this.schema.compiledExplicit,this.tag=null,this.result="",this.duplicates=[],this.usedDuplicates=null}function Ms(i,e){for(var t=ee.repeat(" ",e),a=0,r=-1,s="",n,o=i.length;a<o;)r=i.indexOf(`
`,a),r===-1?(n=i.slice(a),a=o):(n=i.slice(a,r+1),a=r+1),n.length&&n!==`
`&&(s+=t),s+=n;return s}function fa(i,e){return`
`+ee.repeat(" ",i.indent*e)}function Uc(i,e){var t,a,r;for(t=0,a=i.implicitTypes.length;t<a;t+=1)if(r=i.implicitTypes[t],r.resolve(e))return!0;return!1}function xi(i){return i===wc||i===bc}function Ht(i){return 32<=i&&i<=126||161<=i&&i<=55295&&i!==8232&&i!==8233||57344<=i&&i<=65533&&i!==_a||65536<=i&&i<=1114111}function Ps(i){return Ht(i)&&i!==_a&&i!==xc&&i!==Ut}function Fs(i,e,t){var a=Ps(i),r=a&&!xi(i);return(t?a:a&&i!==Ss&&i!==$s&&i!==Is&&i!==Cs&&i!==Ts)&&i!==ma&&!(e===bi&&!r)||Ps(e)&&!xi(e)&&i===ma||e===bi&&r}function Bc(i){return Ht(i)&&i!==_a&&!xi(i)&&i!==Cc&&i!==Pc&&i!==bi&&i!==Ss&&i!==$s&&i!==Is&&i!==Cs&&i!==Ts&&i!==ma&&i!==Sc&&i!==Ic&&i!==kc&&i!==Dc&&i!==Tc&&i!==Mc&&i!==$c&&i!==Ec&&i!==Ac&&i!==Fc&&i!==jc}function Hc(i){return!xi(i)&&i!==bi}function Gt(i,e){var t=i.charCodeAt(e),a;return t>=55296&&t<=56319&&e+1<i.length&&(a=i.charCodeAt(e+1),a>=56320&&a<=57343)?(t-55296)*1024+a-56320+65536:t}function js(i){var e=/^\n* /;return e.test(i)}var Ds=1,ya=2,Os=3,Rs=4,bt=5;function Gc(i,e,t,a,r,s,n,o){var l,c=0,h=null,u=!1,p=!1,m=a!==-1,f=-1,y=Bc(Gt(i,0))&&Hc(Gt(i,i.length-1));if(e||n)for(l=0;l<i.length;c>=65536?l+=2:l++){if(c=Gt(i,l),!Ht(c))return bt;y=y&&Fs(c,h,o),h=c}else{for(l=0;l<i.length;c>=65536?l+=2:l++){if(c=Gt(i,l),c===Ut)u=!0,m&&(p=p||l-f-1>a&&i[f+1]!==" ",f=l);else if(!Ht(c))return bt;y=y&&Fs(c,h,o),h=c}p=p||m&&l-f-1>a&&i[f+1]!==" "}return!u&&!p?y&&!n&&!r(i)?Ds:s===Bt?bt:ya:t>9&&js(i)?bt:n?s===Bt?bt:ya:p?Rs:Os}function Vc(i,e,t,a,r){i.dump=(function(){if(e.length===0)return i.quotingType===Bt?'""':"''";if(!i.noCompatMode&&(Oc.indexOf(e)!==-1||Rc.test(e)))return i.quotingType===Bt?'"'+e+'"':"'"+e+"'";var s=i.indent*Math.max(1,t),n=i.lineWidth===-1?-1:Math.max(Math.min(i.lineWidth,40),i.lineWidth-s),o=a||i.flowLevel>-1&&t>=i.flowLevel;function l(c){return Uc(i,c)}switch(Gc(e,o,i.indent,n,l,i.quotingType,i.forceQuotes&&!a,r)){case Ds:return e;case ya:return"'"+e.replace(/'/g,"''")+"'";case Os:return"|"+zs(e,i.indent)+Ls(Ms(e,s));case Rs:return">"+zs(e,i.indent)+Ls(Ms(Qc(e,n),s));case bt:return'"'+Wc(e)+'"';default:throw new pe("impossible error: invalid scalar style")}})()}function zs(i,e){var t=js(i)?String(e):"",a=i[i.length-1]===`
`,r=a&&(i[i.length-2]===`
`||i===`
`),s=r?"+":a?"":"-";return t+s+`
`}function Ls(i){return i[i.length-1]===`
`?i.slice(0,-1):i}function Qc(i,e){for(var t=/(\n+)([^\n]*)/g,a=(function(){var c=i.indexOf(`
`);return c=c!==-1?c:i.length,t.lastIndex=c,qs(i.slice(0,c),e)})(),r=i[0]===`
`||i[0]===" ",s,n;n=t.exec(i);){var o=n[1],l=n[2];s=l[0]===" ",a+=o+(!r&&!s&&l!==""?`
`:"")+qs(l,e),r=s}return a}function qs(i,e){if(i===""||i[0]===" ")return i;for(var t=/ [^ ]/g,a,r=0,s,n=0,o=0,l="";a=t.exec(i);)o=a.index,o-r>e&&(s=n>r?n:o,l+=`
`+i.slice(r,s),r=s+1),n=o;return l+=`
`,i.length-r>e&&n>r?l+=i.slice(r,n)+`
`+i.slice(n+1):l+=i.slice(r),l.slice(1)}function Wc(i){for(var e="",t=0,a,r=0;r<i.length;t>=65536?r+=2:r++)t=Gt(i,r),a=ce[t],!a&&Ht(t)?(e+=i[r],t>=65536&&(e+=i[r+1])):e+=a||Lc(t);return e}function Yc(i,e,t){var a="",r=i.tag,s,n,o;for(s=0,n=t.length;s<n;s+=1)o=t[s],i.replacer&&(o=i.replacer.call(t,String(s),o)),(je(i,e,o,!1,!1)||typeof o>"u"&&je(i,e,null,!1,!1))&&(a!==""&&(a+=","+(i.condenseFlow?"":" ")),a+=i.dump);i.tag=r,i.dump="["+a+"]"}function Ns(i,e,t,a){var r="",s=i.tag,n,o,l;for(n=0,o=t.length;n<o;n+=1)l=t[n],i.replacer&&(l=i.replacer.call(t,String(n),l)),(je(i,e+1,l,!0,!0,!1,!0)||typeof l>"u"&&je(i,e+1,null,!0,!0,!1,!0))&&((!a||r!=="")&&(r+=fa(i,e)),i.dump&&Ut===i.dump.charCodeAt(0)?r+="-":r+="- ",r+=i.dump);i.tag=s,i.dump=r||"[]"}function Zc(i,e,t){var a="",r=i.tag,s=Object.keys(t),n,o,l,c,h;for(n=0,o=s.length;n<o;n+=1)h="",a!==""&&(h+=", "),i.condenseFlow&&(h+='"'),l=s[n],c=t[l],i.replacer&&(c=i.replacer.call(t,l,c)),je(i,e,l,!1,!1)&&(i.dump.length>1024&&(h+="? "),h+=i.dump+(i.condenseFlow?'"':"")+":"+(i.condenseFlow?"":" "),je(i,e,c,!1,!1)&&(h+=i.dump,a+=h));i.tag=r,i.dump="{"+a+"}"}function Kc(i,e,t,a){var r="",s=i.tag,n=Object.keys(t),o,l,c,h,u,p;if(i.sortKeys===!0)n.sort();else if(typeof i.sortKeys=="function")n.sort(i.sortKeys);else if(i.sortKeys)throw new pe("sortKeys must be a boolean or a function");for(o=0,l=n.length;o<l;o+=1)p="",(!a||r!=="")&&(p+=fa(i,e)),c=n[o],h=t[c],i.replacer&&(h=i.replacer.call(t,c,h)),je(i,e+1,c,!0,!0,!0)&&(u=i.tag!==null&&i.tag!=="?"||i.dump&&i.dump.length>1024,u&&(i.dump&&Ut===i.dump.charCodeAt(0)?p+="?":p+="? "),p+=i.dump,u&&(p+=fa(i,e)),je(i,e+1,h,!0,u)&&(i.dump&&Ut===i.dump.charCodeAt(0)?p+=":":p+=": ",p+=i.dump,r+=p));i.tag=s,i.dump=r||"{}"}function Us(i,e,t){var a,r,s,n,o,l;for(r=t?i.explicitTypes:i.implicitTypes,s=0,n=r.length;s<n;s+=1)if(o=r[s],(o.instanceOf||o.predicate)&&(!o.instanceOf||typeof e=="object"&&e instanceof o.instanceOf)&&(!o.predicate||o.predicate(e))){if(t?o.multi&&o.representName?i.tag=o.representName(e):i.tag=o.tag:i.tag="?",o.represent){if(l=i.styleMap[o.tag]||o.defaultStyle,Es.call(o.represent)==="[object Function]")a=o.represent(e,l);else if(As.call(o.represent,l))a=o.represent[l](e,l);else throw new pe("!<"+o.tag+'> tag resolver accepts not "'+l+'" style');i.dump=a}return!0}return!1}function je(i,e,t,a,r,s,n){i.tag=null,i.dump=t,Us(i,t,!1)||Us(i,t,!0);var o=Es.call(i.dump),l=a,c;a&&(a=i.flowLevel<0||i.flowLevel>e);var h=o==="[object Object]"||o==="[object Array]",u,p;if(h&&(u=i.duplicates.indexOf(t),p=u!==-1),(i.tag!==null&&i.tag!=="?"||p||i.indent!==2&&e>0)&&(r=!1),p&&i.usedDuplicates[u])i.dump="*ref_"+u;else{if(h&&p&&!i.usedDuplicates[u]&&(i.usedDuplicates[u]=!0),o==="[object Object]")a&&Object.keys(i.dump).length!==0?(Kc(i,e,i.dump,r),p&&(i.dump="&ref_"+u+i.dump)):(Zc(i,e,i.dump),p&&(i.dump="&ref_"+u+" "+i.dump));else if(o==="[object Array]")a&&i.dump.length!==0?(i.noArrayIndent&&!n&&e>0?Ns(i,e-1,i.dump,r):Ns(i,e,i.dump,r),p&&(i.dump="&ref_"+u+i.dump)):(Yc(i,e,i.dump),p&&(i.dump="&ref_"+u+" "+i.dump));else if(o==="[object String]")i.tag!=="?"&&Vc(i,i.dump,e,s,l);else{if(o==="[object Undefined]")return!1;if(i.skipInvalid)return!1;throw new pe("unacceptable kind of an object to dump "+o)}i.tag!==null&&i.tag!=="?"&&(c=encodeURI(i.tag[0]==="!"?i.tag.slice(1):i.tag).replace(/!/g,"%21"),i.tag[0]==="!"?c="!"+c:c.slice(0,18)==="tag:yaml.org,2002:"?c="!!"+c.slice(18):c="!<"+c+">",i.dump=c+" "+i.dump)}return!0}function Xc(i,e){var t=[],a=[],r,s;for(va(i,t,a),r=0,s=a.length;r<s;r+=1)e.duplicates.push(t[a[r]]);e.usedDuplicates=new Array(s)}function va(i,e,t){var a,r,s;if(i!==null&&typeof i=="object")if(r=e.indexOf(i),r!==-1)t.indexOf(r)===-1&&t.push(r);else if(e.push(i),Array.isArray(i))for(r=0,s=i.length;r<s;r+=1)va(i[r],e,t);else for(a=Object.keys(i),r=0,s=a.length;r<s;r+=1)va(i[a[r]],e,t)}function Jc(i,e){e=e||{};var t=new Nc(e);t.noRefs||Xc(i,t);var a=i;return t.replacer&&(a=t.replacer.call({"":a},"",a)),je(t,0,a,!0,!0)?t.dump+`
`:""}var ed=Jc,td={dump:ed};function ga(i,e){return function(){throw new Error("Function yaml."+i+" is removed in js-yaml 4. Use yaml."+e+" instead, which is now safe by default.")}}var id=re,ad=Br,rd=Qr,sd=Xr,nd=Jr,od=da,ld=ks.load,cd=ks.loadAll,dd=td.dump,ud=pe,hd={binary:rs,float:Kr,map:Vr,null:Wr,pairs:ns,set:os,timestamp:is,bool:Yr,int:Zr,merge:as,omap:ss,seq:Gr,str:Hr},pd=ga("safeLoad","load"),_d=ga("safeLoadAll","loadAll"),md=ga("safeDump","dump"),xt={Type:id,Schema:ad,FAILSAFE_SCHEMA:rd,JSON_SCHEMA:sd,CORE_SCHEMA:nd,DEFAULT_SCHEMA:od,load:ld,loadAll:cd,dump:dd,YAMLException:ud,types:hd,safeLoad:pd,safeLoadAll:_d,safeDump:md};const ba=8,fd=128,yd=256,vd=4096,Bs=524288;/**!
 * Sortable 1.15.7
 * @author	RubaXa   <trash@rubaxa.org>
 * @author	owenm    <owen23355@gmail.com>
 * @license MIT
 */function gd(i,e,t){return(e=kd(e))in i?Object.defineProperty(i,e,{value:t,enumerable:!0,configurable:!0,writable:!0}):i[e]=t,i}function De(){return De=Object.assign?Object.assign.bind():function(i){for(var e=1;e<arguments.length;e++){var t=arguments[e];for(var a in t)({}).hasOwnProperty.call(t,a)&&(i[a]=t[a])}return i},De.apply(null,arguments)}function Hs(i,e){var t=Object.keys(i);if(Object.getOwnPropertySymbols){var a=Object.getOwnPropertySymbols(i);e&&(a=a.filter(function(r){return Object.getOwnPropertyDescriptor(i,r).enumerable})),t.push.apply(t,a)}return t}function Me(i){for(var e=1;e<arguments.length;e++){var t=arguments[e]!=null?arguments[e]:{};e%2?Hs(Object(t),!0).forEach(function(a){gd(i,a,t[a])}):Object.getOwnPropertyDescriptors?Object.defineProperties(i,Object.getOwnPropertyDescriptors(t)):Hs(Object(t)).forEach(function(a){Object.defineProperty(i,a,Object.getOwnPropertyDescriptor(t,a))})}return i}function bd(i,e){if(i==null)return{};var t,a,r=xd(i,e);if(Object.getOwnPropertySymbols){var s=Object.getOwnPropertySymbols(i);for(a=0;a<s.length;a++)t=s[a],e.indexOf(t)===-1&&{}.propertyIsEnumerable.call(i,t)&&(r[t]=i[t])}return r}function xd(i,e){if(i==null)return{};var t={};for(var a in i)if({}.hasOwnProperty.call(i,a)){if(e.indexOf(a)!==-1)continue;t[a]=i[a]}return t}function wd(i,e){if(typeof i!="object"||!i)return i;var t=i[Symbol.toPrimitive];if(t!==void 0){var a=t.call(i,e);if(typeof a!="object")return a;throw new TypeError("@@toPrimitive must return a primitive value.")}return(e==="string"?String:Number)(i)}function kd(i){var e=wd(i,"string");return typeof e=="symbol"?e:e+""}function xa(i){"@babel/helpers - typeof";return xa=typeof Symbol=="function"&&typeof Symbol.iterator=="symbol"?function(e){return typeof e}:function(e){return e&&typeof Symbol=="function"&&e.constructor===Symbol&&e!==Symbol.prototype?"symbol":typeof e},xa(i)}var Ed="1.15.7";function Oe(i){if(typeof window<"u"&&window.navigator)return!!navigator.userAgent.match(i)}var Re=Oe(/(?:Trident.*rv[ :]?11\.|msie|iemobile|Windows Phone)/i),Vt=Oe(/Edge/i),Gs=Oe(/firefox/i),Qt=Oe(/safari/i)&&!Oe(/chrome/i)&&!Oe(/android/i),wa=Oe(/iP(ad|od|hone)/i),Vs=Oe(/chrome/i)&&Oe(/android/i),Qs={capture:!1,passive:!1};function j(i,e,t){i.addEventListener(e,t,!Re&&Qs)}function F(i,e,t){i.removeEventListener(e,t,!Re&&Qs)}function wi(i,e){if(e){if(e[0]===">"&&(e=e.substring(1)),i)try{if(i.matches)return i.matches(e);if(i.msMatchesSelector)return i.msMatchesSelector(e);if(i.webkitMatchesSelector)return i.webkitMatchesSelector(e)}catch{return!1}return!1}}function Ws(i){return i.host&&i!==document&&i.host.nodeType&&i.host!==i?i.host:i.parentNode}function $e(i,e,t,a){if(i){t=t||document;do{if(e!=null&&(e[0]===">"?i.parentNode===t&&wi(i,e):wi(i,e))||a&&i===t)return i;if(i===t)break}while(i=Ws(i))}return null}var Ys=/\s+/g;function we(i,e,t){if(i&&e)if(i.classList)i.classList[t?"add":"remove"](e);else{var a=(" "+i.className+" ").replace(Ys," ").replace(" "+e+" "," ");i.className=(a+(t?" "+e:"")).replace(Ys," ")}}function $(i,e,t){var a=i&&i.style;if(a){if(t===void 0)return document.defaultView&&document.defaultView.getComputedStyle?t=document.defaultView.getComputedStyle(i,""):i.currentStyle&&(t=i.currentStyle),e===void 0?t:t[e];!(e in a)&&e.indexOf("webkit")===-1&&(e="-webkit-"+e),a[e]=t+(typeof t=="string"?"":"px")}}function wt(i,e){var t="";if(typeof i=="string")t=i;else do{var a=$(i,"transform");a&&a!=="none"&&(t=a+" "+t)}while(!e&&(i=i.parentNode));var r=window.DOMMatrix||window.WebKitCSSMatrix||window.CSSMatrix||window.MSCSSMatrix;return r&&new r(t)}function Zs(i,e,t){if(i){var a=i.getElementsByTagName(e),r=0,s=a.length;if(t)for(;r<s;r++)t(a[r],r);return a}return[]}function Pe(){var i=document.scrollingElement;return i||document.documentElement}function X(i,e,t,a,r){if(!(!i.getBoundingClientRect&&i!==window)){var s,n,o,l,c,h,u;if(i!==window&&i.parentNode&&i!==Pe()?(s=i.getBoundingClientRect(),n=s.top,o=s.left,l=s.bottom,c=s.right,h=s.height,u=s.width):(n=0,o=0,l=window.innerHeight,c=window.innerWidth,h=window.innerHeight,u=window.innerWidth),(e||t)&&i!==window&&(r=r||i.parentNode,!Re))do if(r&&r.getBoundingClientRect&&($(r,"transform")!=="none"||t&&$(r,"position")!=="static")){var p=r.getBoundingClientRect();n-=p.top+parseInt($(r,"border-top-width")),o-=p.left+parseInt($(r,"border-left-width")),l=n+s.height,c=o+s.width;break}while(r=r.parentNode);if(a&&i!==window){var m=wt(r||i),f=m&&m.a,y=m&&m.d;m&&(n/=y,o/=f,u/=f,h/=y,l=n+h,c=o+u)}return{top:n,left:o,bottom:l,right:c,width:u,height:h}}}function Ks(i,e,t){for(var a=Ye(i,!0),r=X(i)[e];a;){var s=X(a)[t],n=void 0;if(n=r>=s,!n)return a;if(a===Pe())break;a=Ye(a,!1)}return!1}function kt(i,e,t,a){for(var r=0,s=0,n=i.children;s<n.length;){if(n[s].style.display!=="none"&&n[s]!==I.ghost&&(a||n[s]!==I.dragged)&&$e(n[s],t.draggable,i,!1)){if(r===e)return n[s];r++}s++}return null}function ka(i,e){for(var t=i.lastElementChild;t&&(t===I.ghost||$(t,"display")==="none"||e&&!wi(t,e));)t=t.previousElementSibling;return t||null}function Ae(i,e){var t=0;if(!i||!i.parentNode)return-1;for(;i=i.previousElementSibling;)i.nodeName.toUpperCase()!=="TEMPLATE"&&i!==I.clone&&(!e||wi(i,e))&&t++;return t}function Xs(i){var e=0,t=0,a=Pe();if(i)do{var r=wt(i),s=r.a,n=r.d;e+=i.scrollLeft*s,t+=i.scrollTop*n}while(i!==a&&(i=i.parentNode));return[e,t]}function Ad(i,e){for(var t in i)if(i.hasOwnProperty(t)){for(var a in e)if(e.hasOwnProperty(a)&&e[a]===i[t][a])return Number(t)}return-1}function Ye(i,e){if(!i||!i.getBoundingClientRect)return Pe();var t=i,a=!1;do if(t.clientWidth<t.scrollWidth||t.clientHeight<t.scrollHeight){var r=$(t);if(t.clientWidth<t.scrollWidth&&(r.overflowX=="auto"||r.overflowX=="scroll")||t.clientHeight<t.scrollHeight&&(r.overflowY=="auto"||r.overflowY=="scroll")){if(!t.getBoundingClientRect||t===document.body)return Pe();if(a||e)return t;a=!0}}while(t=t.parentNode);return Pe()}function Sd(i,e){if(i&&e)for(var t in e)e.hasOwnProperty(t)&&(i[t]=e[t]);return i}function Ea(i,e){return Math.round(i.top)===Math.round(e.top)&&Math.round(i.left)===Math.round(e.left)&&Math.round(i.height)===Math.round(e.height)&&Math.round(i.width)===Math.round(e.width)}var Wt;function Js(i,e){return function(){if(!Wt){var t=arguments,a=this;t.length===1?i.call(a,t[0]):i.apply(a,t),Wt=setTimeout(function(){Wt=void 0},e)}}}function $d(){clearTimeout(Wt),Wt=void 0}function en(i,e,t){i.scrollLeft+=e,i.scrollTop+=t}function tn(i){var e=window.Polymer,t=window.jQuery||window.Zepto;return e&&e.dom?e.dom(i).cloneNode(!0):t?t(i).clone(!0)[0]:i.cloneNode(!0)}function an(i,e,t){var a={};return Array.from(i.children).forEach(function(r){var s,n,o,l;if(!(!$e(r,e.draggable,i,!1)||r.animated||r===t)){var c=X(r);a.left=Math.min((s=a.left)!==null&&s!==void 0?s:1/0,c.left),a.top=Math.min((n=a.top)!==null&&n!==void 0?n:1/0,c.top),a.right=Math.max((o=a.right)!==null&&o!==void 0?o:-1/0,c.right),a.bottom=Math.max((l=a.bottom)!==null&&l!==void 0?l:-1/0,c.bottom)}}),a.width=a.right-a.left,a.height=a.bottom-a.top,a.x=a.left,a.y=a.top,a}var ge="Sortable"+new Date().getTime();function Id(){var i=[],e;return{captureAnimationState:function(){if(i=[],!!this.options.animation){var a=[].slice.call(this.el.children);a.forEach(function(r){if(!($(r,"display")==="none"||r===I.ghost)){i.push({target:r,rect:X(r)});var s=Me({},i[i.length-1].rect);if(r.thisAnimationDuration){var n=wt(r,!0);n&&(s.top-=n.f,s.left-=n.e)}r.fromRect=s}})}},addAnimationState:function(a){i.push(a)},removeAnimationState:function(a){i.splice(Ad(i,{target:a}),1)},animateAll:function(a){var r=this;if(!this.options.animation){clearTimeout(e),typeof a=="function"&&a();return}var s=!1,n=0;i.forEach(function(o){var l=0,c=o.target,h=c.fromRect,u=X(c),p=c.prevFromRect,m=c.prevToRect,f=o.rect,y=wt(c,!0);y&&(u.top-=y.f,u.left-=y.e),c.toRect=u,c.thisAnimationDuration&&Ea(p,u)&&!Ea(h,u)&&(f.top-u.top)/(f.left-u.left)===(h.top-u.top)/(h.left-u.left)&&(l=Td(f,p,m,r.options)),Ea(u,h)||(c.prevFromRect=h,c.prevToRect=u,l||(l=r.options.animation),r.animate(c,f,u,l)),l&&(s=!0,n=Math.max(n,l),clearTimeout(c.animationResetTimer),c.animationResetTimer=setTimeout(function(){c.animationTime=0,c.prevFromRect=null,c.fromRect=null,c.prevToRect=null,c.thisAnimationDuration=null},l),c.thisAnimationDuration=l)}),clearTimeout(e),s?e=setTimeout(function(){typeof a=="function"&&a()},n):typeof a=="function"&&a(),i=[]},animate:function(a,r,s,n){if(n){$(a,"transition",""),$(a,"transform","");var o=wt(this.el),l=o&&o.a,c=o&&o.d,h=(r.left-s.left)/(l||1),u=(r.top-s.top)/(c||1);a.animatingX=!!h,a.animatingY=!!u,$(a,"transform","translate3d("+h+"px,"+u+"px,0)"),this.forRepaintDummy=Cd(a),$(a,"transition","transform "+n+"ms"+(this.options.easing?" "+this.options.easing:"")),$(a,"transform","translate3d(0,0,0)"),typeof a.animated=="number"&&clearTimeout(a.animated),a.animated=setTimeout(function(){$(a,"transition",""),$(a,"transform",""),a.animated=!1,a.animatingX=!1,a.animatingY=!1},n)}}}}function Cd(i){return i.offsetWidth}function Td(i,e,t,a){return Math.sqrt(Math.pow(e.top-i.top,2)+Math.pow(e.left-i.left,2))/Math.sqrt(Math.pow(e.top-t.top,2)+Math.pow(e.left-t.left,2))*a.animation}var Et=[],Aa={initializeByDefault:!0},Yt={mount:function(e){for(var t in Aa)Aa.hasOwnProperty(t)&&!(t in e)&&(e[t]=Aa[t]);Et.forEach(function(a){if(a.pluginName===e.pluginName)throw"Sortable: Cannot mount plugin ".concat(e.pluginName," more than once")}),Et.push(e)},pluginEvent:function(e,t,a){var r=this;this.eventCanceled=!1,a.cancel=function(){r.eventCanceled=!0};var s=e+"Global";Et.forEach(function(n){t[n.pluginName]&&(t[n.pluginName][s]&&t[n.pluginName][s](Me({sortable:t},a)),t.options[n.pluginName]&&t[n.pluginName][e]&&t[n.pluginName][e](Me({sortable:t},a)))})},initializePlugins:function(e,t,a,r){Et.forEach(function(o){var l=o.pluginName;if(!(!e.options[l]&&!o.initializeByDefault)){var c=new o(e,t,e.options);c.sortable=e,c.options=e.options,e[l]=c,De(a,c.defaults)}});for(var s in e.options)if(e.options.hasOwnProperty(s)){var n=this.modifyOption(e,s,e.options[s]);typeof n<"u"&&(e.options[s]=n)}},getEventProperties:function(e,t){var a={};return Et.forEach(function(r){typeof r.eventProperties=="function"&&De(a,r.eventProperties.call(t[r.pluginName],e))}),a},modifyOption:function(e,t,a){var r;return Et.forEach(function(s){e[s.pluginName]&&s.optionListeners&&typeof s.optionListeners[t]=="function"&&(r=s.optionListeners[t].call(e[s.pluginName],a))}),r}};function Md(i){var e=i.sortable,t=i.rootEl,a=i.name,r=i.targetEl,s=i.cloneEl,n=i.toEl,o=i.fromEl,l=i.oldIndex,c=i.newIndex,h=i.oldDraggableIndex,u=i.newDraggableIndex,p=i.originalEvent,m=i.putSortable,f=i.extraEventProperties;if(e=e||t&&t[ge],!!e){var y,g=e.options,x="on"+a.charAt(0).toUpperCase()+a.substr(1);window.CustomEvent&&!Re&&!Vt?y=new CustomEvent(a,{bubbles:!0,cancelable:!0}):(y=document.createEvent("Event"),y.initEvent(a,!0,!0)),y.to=n||t,y.from=o||t,y.item=r||t,y.clone=s,y.oldIndex=l,y.newIndex=c,y.oldDraggableIndex=h,y.newDraggableIndex=u,y.originalEvent=p,y.pullMode=m?m.lastPutMode:void 0;var k=Me(Me({},f),Yt.getEventProperties(a,e));for(var S in k)y[S]=k[S];t&&t.dispatchEvent(y),g[x]&&g[x].call(e,y)}}var Pd=["evt"],be=function(e,t){var a=arguments.length>2&&arguments[2]!==void 0?arguments[2]:{},r=a.evt,s=bd(a,Pd);Yt.pluginEvent.bind(I)(e,t,Me({dragEl:w,parentEl:Y,ghostEl:T,rootEl:V,nextEl:ct,lastDownEl:ki,cloneEl:W,cloneHidden:Ze,dragStarted:Kt,putSortable:se,activeSortable:I.active,originalEvent:r,oldIndex:At,oldDraggableIndex:Zt,newIndex:ke,newDraggableIndex:Ke,hideGhostForTarget:dn,unhideGhostForTarget:un,cloneNowHidden:function(){Ze=!0},cloneNowShown:function(){Ze=!1},dispatchSortableEvent:function(o){_e({sortable:t,name:o,originalEvent:r})}},s))};function _e(i){Md(Me({putSortable:se,cloneEl:W,targetEl:w,rootEl:V,oldIndex:At,oldDraggableIndex:Zt,newIndex:ke,newDraggableIndex:Ke},i))}var w,Y,T,V,ct,ki,W,Ze,At,ke,Zt,Ke,Ei,se,St=!1,Ai=!1,Si=[],dt,Ie,Sa,$a,rn,sn,Kt,$t,Xt,Jt=!1,$i=!1,Ii,de,Ia=[],Ca=!1,Ci=[],Ti=typeof document<"u",Mi=wa,nn=Vt||Re?"cssFloat":"float",Fd=Ti&&!Vs&&!wa&&"draggable"in document.createElement("div"),on=(function(){if(Ti){if(Re)return!1;var i=document.createElement("x");return i.style.cssText="pointer-events:auto",i.style.pointerEvents==="auto"}})(),ln=function(e,t){var a=$(e),r=parseInt(a.width)-parseInt(a.paddingLeft)-parseInt(a.paddingRight)-parseInt(a.borderLeftWidth)-parseInt(a.borderRightWidth),s=kt(e,0,t),n=kt(e,1,t),o=s&&$(s),l=n&&$(n),c=o&&parseInt(o.marginLeft)+parseInt(o.marginRight)+X(s).width,h=l&&parseInt(l.marginLeft)+parseInt(l.marginRight)+X(n).width;if(a.display==="flex")return a.flexDirection==="column"||a.flexDirection==="column-reverse"?"vertical":"horizontal";if(a.display==="grid")return a.gridTemplateColumns.split(" ").length<=1?"vertical":"horizontal";if(s&&o.float&&o.float!=="none"){var u=o.float==="left"?"left":"right";return n&&(l.clear==="both"||l.clear===u)?"vertical":"horizontal"}return s&&(o.display==="block"||o.display==="flex"||o.display==="table"||o.display==="grid"||c>=r&&a[nn]==="none"||n&&a[nn]==="none"&&c+h>r)?"vertical":"horizontal"},jd=function(e,t,a){var r=a?e.left:e.top,s=a?e.right:e.bottom,n=a?e.width:e.height,o=a?t.left:t.top,l=a?t.right:t.bottom,c=a?t.width:t.height;return r===o||s===l||r+n/2===o+c/2},Dd=function(e,t){var a;return Si.some(function(r){var s=r[ge].options.emptyInsertThreshold;if(!(!s||ka(r))){var n=X(r),o=e>=n.left-s&&e<=n.right+s,l=t>=n.top-s&&t<=n.bottom+s;if(o&&l)return a=r}}),a},cn=function(e){function t(s,n){return function(o,l,c,h){var u=o.options.group.name&&l.options.group.name&&o.options.group.name===l.options.group.name;if(s==null&&(n||u))return!0;if(s==null||s===!1)return!1;if(n&&s==="clone")return s;if(typeof s=="function")return t(s(o,l,c,h),n)(o,l,c,h);var p=(n?o:l).options.group.name;return s===!0||typeof s=="string"&&s===p||s.join&&s.indexOf(p)>-1}}var a={},r=e.group;(!r||xa(r)!="object")&&(r={name:r}),a.name=r.name,a.checkPull=t(r.pull,!0),a.checkPut=t(r.put),a.revertClone=r.revertClone,e.group=a},dn=function(){!on&&T&&$(T,"display","none")},un=function(){!on&&T&&$(T,"display","")};Ti&&!Vs&&document.addEventListener("click",function(i){if(Ai)return i.preventDefault(),i.stopPropagation&&i.stopPropagation(),i.stopImmediatePropagation&&i.stopImmediatePropagation(),Ai=!1,!1},!0);var ut=function(e){if(w){e=e.touches?e.touches[0]:e;var t=Dd(e.clientX,e.clientY);if(t){var a={};for(var r in e)e.hasOwnProperty(r)&&(a[r]=e[r]);a.target=a.rootEl=t,a.preventDefault=void 0,a.stopPropagation=void 0,t[ge]._onDragOver(a)}}},Od=function(e){w&&w.parentNode[ge]._isOutsideThisEl(e.target)};function I(i,e){if(!(i&&i.nodeType&&i.nodeType===1))throw"Sortable: `el` must be an HTMLElement, not ".concat({}.toString.call(i));this.el=i,this.options=e=De({},e),i[ge]=this;var t={group:null,sort:!0,disabled:!1,store:null,handle:null,draggable:/^[uo]l$/i.test(i.nodeName)?">li":">*",swapThreshold:1,invertSwap:!1,invertedSwapThreshold:null,removeCloneOnHide:!0,direction:function(){return ln(i,this.options)},ghostClass:"sortable-ghost",chosenClass:"sortable-chosen",dragClass:"sortable-drag",ignore:"a, img",filter:null,preventOnFilter:!0,animation:0,easing:null,setData:function(n,o){n.setData("Text",o.textContent)},dropBubble:!1,dragoverBubble:!1,dataIdAttr:"data-id",delay:0,delayOnTouchOnly:!1,touchStartThreshold:(Number.parseInt?Number:window).parseInt(window.devicePixelRatio,10)||1,forceFallback:!1,fallbackClass:"sortable-fallback",fallbackOnBody:!1,fallbackTolerance:0,fallbackOffset:{x:0,y:0},supportPointer:I.supportPointer!==!1&&"PointerEvent"in window&&(!Qt||wa),emptyInsertThreshold:5};Yt.initializePlugins(this,i,t);for(var a in t)!(a in e)&&(e[a]=t[a]);cn(e);for(var r in this)r.charAt(0)==="_"&&typeof this[r]=="function"&&(this[r]=this[r].bind(this));this.nativeDraggable=e.forceFallback?!1:Fd,this.nativeDraggable&&(this.options.touchStartThreshold=1),e.supportPointer?j(i,"pointerdown",this._onTapStart):(j(i,"mousedown",this._onTapStart),j(i,"touchstart",this._onTapStart)),this.nativeDraggable&&(j(i,"dragover",this),j(i,"dragenter",this)),Si.push(this.el),e.store&&e.store.get&&this.sort(e.store.get(this)||[]),De(this,Id())}I.prototype={constructor:I,_isOutsideThisEl:function(e){!this.el.contains(e)&&e!==this.el&&($t=null)},_getDirection:function(e,t){return typeof this.options.direction=="function"?this.options.direction.call(this,e,t,w):this.options.direction},_onTapStart:function(e){if(e.cancelable){var t=this,a=this.el,r=this.options,s=r.preventOnFilter,n=e.type,o=e.touches&&e.touches[0]||e.pointerType&&e.pointerType==="touch"&&e,l=(o||e).target,c=e.target.shadowRoot&&(e.path&&e.path[0]||e.composedPath&&e.composedPath()[0])||l,h=r.filter;if(Hd(a),!w&&!(/mousedown|pointerdown/.test(n)&&e.button!==0||r.disabled)&&!c.isContentEditable&&!(!this.nativeDraggable&&Qt&&l&&l.tagName.toUpperCase()==="SELECT")&&(l=$e(l,r.draggable,a,!1),!(l&&l.animated)&&ki!==l)){if(At=Ae(l),Zt=Ae(l,r.draggable),typeof h=="function"){if(h.call(this,e,l,this)){_e({sortable:t,rootEl:c,name:"filter",targetEl:l,toEl:a,fromEl:a}),be("filter",t,{evt:e}),s&&e.preventDefault();return}}else if(h&&(h=h.split(",").some(function(u){if(u=$e(c,u.trim(),a,!1),u)return _e({sortable:t,rootEl:u,name:"filter",targetEl:l,fromEl:a,toEl:a}),be("filter",t,{evt:e}),!0}),h)){s&&e.preventDefault();return}r.handle&&!$e(c,r.handle,a,!1)||this._prepareDragStart(e,o,l)}}},_prepareDragStart:function(e,t,a){var r=this,s=r.el,n=r.options,o=s.ownerDocument,l;if(a&&!w&&a.parentNode===s){var c=X(a);if(V=s,w=a,Y=w.parentNode,ct=w.nextSibling,ki=a,Ei=n.group,I.dragged=w,dt={target:w,clientX:(t||e).clientX,clientY:(t||e).clientY},rn=dt.clientX-c.left,sn=dt.clientY-c.top,this._lastX=(t||e).clientX,this._lastY=(t||e).clientY,w.style["will-change"]="all",l=function(){if(be("delayEnded",r,{evt:e}),I.eventCanceled){r._onDrop();return}r._disableDelayedDragEvents(),!Gs&&r.nativeDraggable&&(w.draggable=!0),r._triggerDragStart(e,t),_e({sortable:r,name:"choose",originalEvent:e}),we(w,n.chosenClass,!0)},n.ignore.split(",").forEach(function(h){Zs(w,h.trim(),Ta)}),j(o,"dragover",ut),j(o,"mousemove",ut),j(o,"touchmove",ut),n.supportPointer?(j(o,"pointerup",r._onDrop),!this.nativeDraggable&&j(o,"pointercancel",r._onDrop)):(j(o,"mouseup",r._onDrop),j(o,"touchend",r._onDrop),j(o,"touchcancel",r._onDrop)),Gs&&this.nativeDraggable&&(this.options.touchStartThreshold=4,w.draggable=!0),be("delayStart",this,{evt:e}),n.delay&&(!n.delayOnTouchOnly||t)&&(!this.nativeDraggable||!(Vt||Re))){if(I.eventCanceled){this._onDrop();return}n.supportPointer?(j(o,"pointerup",r._disableDelayedDrag),j(o,"pointercancel",r._disableDelayedDrag)):(j(o,"mouseup",r._disableDelayedDrag),j(o,"touchend",r._disableDelayedDrag),j(o,"touchcancel",r._disableDelayedDrag)),j(o,"mousemove",r._delayedDragTouchMoveHandler),j(o,"touchmove",r._delayedDragTouchMoveHandler),n.supportPointer&&j(o,"pointermove",r._delayedDragTouchMoveHandler),r._dragStartTimer=setTimeout(l,n.delay)}else l()}},_delayedDragTouchMoveHandler:function(e){var t=e.touches?e.touches[0]:e;Math.max(Math.abs(t.clientX-this._lastX),Math.abs(t.clientY-this._lastY))>=Math.floor(this.options.touchStartThreshold/(this.nativeDraggable&&window.devicePixelRatio||1))&&this._disableDelayedDrag()},_disableDelayedDrag:function(){w&&Ta(w),clearTimeout(this._dragStartTimer),this._disableDelayedDragEvents()},_disableDelayedDragEvents:function(){var e=this.el.ownerDocument;F(e,"mouseup",this._disableDelayedDrag),F(e,"touchend",this._disableDelayedDrag),F(e,"touchcancel",this._disableDelayedDrag),F(e,"pointerup",this._disableDelayedDrag),F(e,"pointercancel",this._disableDelayedDrag),F(e,"mousemove",this._delayedDragTouchMoveHandler),F(e,"touchmove",this._delayedDragTouchMoveHandler),F(e,"pointermove",this._delayedDragTouchMoveHandler)},_triggerDragStart:function(e,t){t=t||e.pointerType=="touch"&&e,!this.nativeDraggable||t?this.options.supportPointer?j(document,"pointermove",this._onTouchMove):t?j(document,"touchmove",this._onTouchMove):j(document,"mousemove",this._onTouchMove):(j(w,"dragend",this),j(V,"dragstart",this._onDragStart));try{document.selection?Fi(function(){document.selection.empty()}):window.getSelection().removeAllRanges()}catch{}},_dragStarted:function(e,t){if(St=!1,V&&w){be("dragStarted",this,{evt:t}),this.nativeDraggable&&j(document,"dragover",Od);var a=this.options;!e&&we(w,a.dragClass,!1),we(w,a.ghostClass,!0),I.active=this,e&&this._appendGhost(),_e({sortable:this,name:"start",originalEvent:t})}else this._nulling()},_emulateDragOver:function(){if(Ie){this._lastX=Ie.clientX,this._lastY=Ie.clientY,dn();for(var e=document.elementFromPoint(Ie.clientX,Ie.clientY),t=e;e&&e.shadowRoot&&(e=e.shadowRoot.elementFromPoint(Ie.clientX,Ie.clientY),e!==t);)t=e;if(w.parentNode[ge]._isOutsideThisEl(e),t)do{if(t[ge]){var a=void 0;if(a=t[ge]._onDragOver({clientX:Ie.clientX,clientY:Ie.clientY,target:e,rootEl:t}),a&&!this.options.dragoverBubble)break}e=t}while(t=Ws(t));un()}},_onTouchMove:function(e){if(dt){var t=this.options,a=t.fallbackTolerance,r=t.fallbackOffset,s=e.touches?e.touches[0]:e,n=T&&wt(T,!0),o=T&&n&&n.a,l=T&&n&&n.d,c=Mi&&de&&Xs(de),h=(s.clientX-dt.clientX+r.x)/(o||1)+(c?c[0]-Ia[0]:0)/(o||1),u=(s.clientY-dt.clientY+r.y)/(l||1)+(c?c[1]-Ia[1]:0)/(l||1);if(!I.active&&!St){if(a&&Math.max(Math.abs(s.clientX-this._lastX),Math.abs(s.clientY-this._lastY))<a)return;this._onDragStart(e,!0)}if(T){n?(n.e+=h-(Sa||0),n.f+=u-($a||0)):n={a:1,b:0,c:0,d:1,e:h,f:u};var p="matrix(".concat(n.a,",").concat(n.b,",").concat(n.c,",").concat(n.d,",").concat(n.e,",").concat(n.f,")");$(T,"webkitTransform",p),$(T,"mozTransform",p),$(T,"msTransform",p),$(T,"transform",p),Sa=h,$a=u,Ie=s}e.cancelable&&e.preventDefault()}},_appendGhost:function(){if(!T){var e=this.options.fallbackOnBody?document.body:V,t=X(w,!0,Mi,!0,e),a=this.options;if(Mi){for(de=e;$(de,"position")==="static"&&$(de,"transform")==="none"&&de!==document;)de=de.parentNode;de!==document.body&&de!==document.documentElement?(de===document&&(de=Pe()),t.top+=de.scrollTop,t.left+=de.scrollLeft):de=Pe(),Ia=Xs(de)}T=w.cloneNode(!0),we(T,a.ghostClass,!1),we(T,a.fallbackClass,!0),we(T,a.dragClass,!0),$(T,"transition",""),$(T,"transform",""),$(T,"box-sizing","border-box"),$(T,"margin",0),$(T,"top",t.top),$(T,"left",t.left),$(T,"width",t.width),$(T,"height",t.height),$(T,"opacity","0.8"),$(T,"position",Mi?"absolute":"fixed"),$(T,"zIndex","100000"),$(T,"pointerEvents","none"),I.ghost=T,e.appendChild(T),$(T,"transform-origin",rn/parseInt(T.style.width)*100+"% "+sn/parseInt(T.style.height)*100+"%")}},_onDragStart:function(e,t){var a=this,r=e.dataTransfer,s=a.options;if(be("dragStart",this,{evt:e}),I.eventCanceled){this._onDrop();return}be("setupClone",this),I.eventCanceled||(W=tn(w),W.removeAttribute("id"),W.draggable=!1,W.style["will-change"]="",this._hideClone(),we(W,this.options.chosenClass,!1),I.clone=W),a.cloneId=Fi(function(){be("clone",a),!I.eventCanceled&&(a.options.removeCloneOnHide||V.insertBefore(W,w),a._hideClone(),_e({sortable:a,name:"clone"}))}),!t&&we(w,s.dragClass,!0),t?(Ai=!0,a._loopId=setInterval(a._emulateDragOver,50)):(F(document,"mouseup",a._onDrop),F(document,"touchend",a._onDrop),F(document,"touchcancel",a._onDrop),r&&(r.effectAllowed="move",s.setData&&s.setData.call(a,r,w)),j(document,"drop",a),$(w,"transform","translateZ(0)")),St=!0,a._dragStartId=Fi(a._dragStarted.bind(a,t,e)),j(document,"selectstart",a),Kt=!0,window.getSelection().removeAllRanges(),Qt&&$(document.body,"user-select","none")},_onDragOver:function(e){var t=this.el,a=e.target,r,s,n,o=this.options,l=o.group,c=I.active,h=Ei===l,u=o.sort,p=se||c,m,f=this,y=!1;if(Ca)return;function g(oe,Ce){be(oe,f,Me({evt:e,isOwner:h,axis:m?"vertical":"horizontal",revert:n,dragRect:r,targetRect:s,canSort:u,fromSortable:p,target:a,completed:k,onMove:function(ae,Le){return Pi(V,t,w,r,ae,X(ae),e,Le)},changed:S},Ce))}function x(){g("dragOverAnimationCapture"),f.captureAnimationState(),f!==p&&p.captureAnimationState()}function k(oe){return g("dragOverCompleted",{insertion:oe}),oe&&(h?c._hideClone():c._showClone(f),f!==p&&(we(w,se?se.options.ghostClass:c.options.ghostClass,!1),we(w,o.ghostClass,!0)),se!==f&&f!==I.active?se=f:f===I.active&&se&&(se=null),p===f&&(f._ignoreWhileAnimating=a),f.animateAll(function(){g("dragOverAnimationComplete"),f._ignoreWhileAnimating=null}),f!==p&&(p.animateAll(),p._ignoreWhileAnimating=null)),(a===w&&!w.animated||a===t&&!a.animated)&&($t=null),!o.dragoverBubble&&!e.rootEl&&a!==document&&(w.parentNode[ge]._isOutsideThisEl(e.target),!oe&&ut(e)),!o.dragoverBubble&&e.stopPropagation&&e.stopPropagation(),y=!0}function S(){ke=Ae(w),Ke=Ae(w,o.draggable),_e({sortable:f,name:"change",toEl:t,newIndex:ke,newDraggableIndex:Ke,originalEvent:e})}if(e.preventDefault!==void 0&&e.cancelable&&e.preventDefault(),a=$e(a,o.draggable,t,!0),g("dragOver"),I.eventCanceled)return y;if(w.contains(e.target)||a.animated&&a.animatingX&&a.animatingY||f._ignoreWhileAnimating===a)return k(!1);if(Ai=!1,c&&!o.disabled&&(h?u||(n=Y!==V):se===this||(this.lastPutMode=Ei.checkPull(this,c,w,e))&&l.checkPut(this,c,w,e))){if(m=this._getDirection(e,a)==="vertical",r=X(w),g("dragOverValid"),I.eventCanceled)return y;if(n)return Y=V,x(),this._hideClone(),g("revert"),I.eventCanceled||(ct?V.insertBefore(w,ct):V.appendChild(w)),k(!0);var E=ka(t,o.draggable);if(!E||qd(e,m,this)&&!E.animated){if(E===w)return k(!1);if(E&&t===e.target&&(a=E),a&&(s=X(a)),Pi(V,t,w,r,a,s,e,!!a)!==!1)return x(),E&&E.nextSibling?t.insertBefore(w,E.nextSibling):t.appendChild(w),Y=t,S(),k(!0)}else if(E&&Ld(e,m,this)){var U=kt(t,0,o,!0);if(U===w)return k(!1);if(a=U,s=X(a),Pi(V,t,w,r,a,s,e,!1)!==!1)return x(),t.insertBefore(w,U),Y=t,S(),k(!0)}else if(a.parentNode===t){s=X(a);var B=0,P,D=w.parentNode!==t,q=!jd(w.animated&&w.toRect||r,a.animated&&a.toRect||s,m),L=m?"top":"left",M=Ks(a,"top","top")||Ks(w,"top","top"),N=M?M.scrollTop:void 0;$t!==a&&(P=s[L],Jt=!1,$i=!q&&o.invertSwap||D),B=Nd(e,a,s,m,q?1:o.swapThreshold,o.invertedSwapThreshold==null?o.swapThreshold:o.invertedSwapThreshold,$i,$t===a);var H;if(B!==0){var te=Ae(w);do te-=B,H=Y.children[te];while(H&&($(H,"display")==="none"||H===T))}if(B===0||H===a)return k(!1);$t=a,Xt=B;var ie=a.nextElementSibling,Z=!1;Z=B===1;var ne=Pi(V,t,w,r,a,s,e,Z);if(ne!==!1)return(ne===1||ne===-1)&&(Z=ne===1),Ca=!0,setTimeout(zd,30),x(),Z&&!ie?t.appendChild(w):a.parentNode.insertBefore(w,Z?ie:a),M&&en(M,0,N-M.scrollTop),Y=w.parentNode,P!==void 0&&!$i&&(Ii=Math.abs(P-X(a)[L])),S(),k(!0)}if(t.contains(w))return k(!1)}return!1},_ignoreWhileAnimating:null,_offMoveEvents:function(){F(document,"mousemove",this._onTouchMove),F(document,"touchmove",this._onTouchMove),F(document,"pointermove",this._onTouchMove),F(document,"dragover",ut),F(document,"mousemove",ut),F(document,"touchmove",ut)},_offUpEvents:function(){var e=this.el.ownerDocument;F(e,"mouseup",this._onDrop),F(e,"touchend",this._onDrop),F(e,"pointerup",this._onDrop),F(e,"pointercancel",this._onDrop),F(e,"touchcancel",this._onDrop),F(document,"selectstart",this)},_onDrop:function(e){var t=this.el,a=this.options;if(ke=Ae(w),Ke=Ae(w,a.draggable),be("drop",this,{evt:e}),Y=w&&w.parentNode,ke=Ae(w),Ke=Ae(w,a.draggable),I.eventCanceled){this._nulling();return}St=!1,$i=!1,Jt=!1,clearInterval(this._loopId),clearTimeout(this._dragStartTimer),Ma(this.cloneId),Ma(this._dragStartId),this.nativeDraggable&&(F(document,"drop",this),F(t,"dragstart",this._onDragStart)),this._offMoveEvents(),this._offUpEvents(),Qt&&$(document.body,"user-select",""),$(w,"transform",""),e&&(Kt&&(e.cancelable&&e.preventDefault(),!a.dropBubble&&e.stopPropagation()),T&&T.parentNode&&T.parentNode.removeChild(T),(V===Y||se&&se.lastPutMode!=="clone")&&W&&W.parentNode&&W.parentNode.removeChild(W),w&&(this.nativeDraggable&&F(w,"dragend",this),Ta(w),w.style["will-change"]="",Kt&&!St&&we(w,se?se.options.ghostClass:this.options.ghostClass,!1),we(w,this.options.chosenClass,!1),_e({sortable:this,name:"unchoose",toEl:Y,newIndex:null,newDraggableIndex:null,originalEvent:e}),V!==Y?(ke>=0&&(_e({rootEl:Y,name:"add",toEl:Y,fromEl:V,originalEvent:e}),_e({sortable:this,name:"remove",toEl:Y,originalEvent:e}),_e({rootEl:Y,name:"sort",toEl:Y,fromEl:V,originalEvent:e}),_e({sortable:this,name:"sort",toEl:Y,originalEvent:e})),se&&se.save()):ke!==At&&ke>=0&&(_e({sortable:this,name:"update",toEl:Y,originalEvent:e}),_e({sortable:this,name:"sort",toEl:Y,originalEvent:e})),I.active&&((ke==null||ke===-1)&&(ke=At,Ke=Zt),_e({sortable:this,name:"end",toEl:Y,originalEvent:e}),this.save()))),this._nulling()},_nulling:function(){be("nulling",this),V=w=Y=T=ct=W=ki=Ze=dt=Ie=Kt=ke=Ke=At=Zt=$t=Xt=se=Ei=I.dragged=I.ghost=I.clone=I.active=null;var e=this.el;Ci.forEach(function(t){e.contains(t)&&(t.checked=!0)}),Ci.length=Sa=$a=0},handleEvent:function(e){switch(e.type){case"drop":case"dragend":this._onDrop(e);break;case"dragenter":case"dragover":w&&(this._onDragOver(e),Rd(e));break;case"selectstart":e.preventDefault();break}},toArray:function(){for(var e=[],t,a=this.el.children,r=0,s=a.length,n=this.options;r<s;r++)t=a[r],$e(t,n.draggable,this.el,!1)&&e.push(t.getAttribute(n.dataIdAttr)||Bd(t));return e},sort:function(e,t){var a={},r=this.el;this.toArray().forEach(function(s,n){var o=r.children[n];$e(o,this.options.draggable,r,!1)&&(a[s]=o)},this),t&&this.captureAnimationState(),e.forEach(function(s){a[s]&&(r.removeChild(a[s]),r.appendChild(a[s]))}),t&&this.animateAll()},save:function(){var e=this.options.store;e&&e.set&&e.set(this)},closest:function(e,t){return $e(e,t||this.options.draggable,this.el,!1)},option:function(e,t){var a=this.options;if(t===void 0)return a[e];var r=Yt.modifyOption(this,e,t);typeof r<"u"?a[e]=r:a[e]=t,e==="group"&&cn(a)},destroy:function(){be("destroy",this);var e=this.el;e[ge]=null,F(e,"mousedown",this._onTapStart),F(e,"touchstart",this._onTapStart),F(e,"pointerdown",this._onTapStart),this.nativeDraggable&&(F(e,"dragover",this),F(e,"dragenter",this)),Array.prototype.forEach.call(e.querySelectorAll("[draggable]"),function(t){t.removeAttribute("draggable")}),this._onDrop(),this._disableDelayedDragEvents(),Si.splice(Si.indexOf(this.el),1),this.el=e=null},_hideClone:function(){if(!Ze){if(be("hideClone",this),I.eventCanceled)return;$(W,"display","none"),this.options.removeCloneOnHide&&W.parentNode&&W.parentNode.removeChild(W),Ze=!0}},_showClone:function(e){if(e.lastPutMode!=="clone"){this._hideClone();return}if(Ze){if(be("showClone",this),I.eventCanceled)return;w.parentNode==V&&!this.options.group.revertClone?V.insertBefore(W,w):ct?V.insertBefore(W,ct):V.appendChild(W),this.options.group.revertClone&&this.animate(w,W),$(W,"display",""),Ze=!1}}};function Rd(i){i.dataTransfer&&(i.dataTransfer.dropEffect="move"),i.cancelable&&i.preventDefault()}function Pi(i,e,t,a,r,s,n,o){var l,c=i[ge],h=c.options.onMove,u;return window.CustomEvent&&!Re&&!Vt?l=new CustomEvent("move",{bubbles:!0,cancelable:!0}):(l=document.createEvent("Event"),l.initEvent("move",!0,!0)),l.to=e,l.from=i,l.dragged=t,l.draggedRect=a,l.related=r||e,l.relatedRect=s||X(e),l.willInsertAfter=o,l.originalEvent=n,i.dispatchEvent(l),h&&(u=h.call(c,l,n)),u}function Ta(i){i.draggable=!1}function zd(){Ca=!1}function Ld(i,e,t){var a=X(kt(t.el,0,t.options,!0)),r=an(t.el,t.options,T),s=10;return e?i.clientX<r.left-s||i.clientY<a.top&&i.clientX<a.right:i.clientY<r.top-s||i.clientY<a.bottom&&i.clientX<a.left}function qd(i,e,t){var a=X(ka(t.el,t.options.draggable)),r=an(t.el,t.options,T),s=10;return e?i.clientX>r.right+s||i.clientY>a.bottom&&i.clientX>a.left:i.clientY>r.bottom+s||i.clientX>a.right&&i.clientY>a.top}function Nd(i,e,t,a,r,s,n,o){var l=a?i.clientY:i.clientX,c=a?t.height:t.width,h=a?t.top:t.left,u=a?t.bottom:t.right,p=!1;if(!n){if(o&&Ii<c*r){if(!Jt&&(Xt===1?l>h+c*s/2:l<u-c*s/2)&&(Jt=!0),Jt)p=!0;else if(Xt===1?l<h+Ii:l>u-Ii)return-Xt}else if(l>h+c*(1-r)/2&&l<u-c*(1-r)/2)return Ud(e)}return p=p||n,p&&(l<h+c*s/2||l>u-c*s/2)?l>h+c/2?1:-1:0}function Ud(i){return Ae(w)<Ae(i)?1:-1}function Bd(i){for(var e=i.tagName+i.className+i.src+i.href+i.textContent,t=e.length,a=0;t--;)a+=e.charCodeAt(t);return a.toString(36)}function Hd(i){Ci.length=0;for(var e=i.getElementsByTagName("input"),t=e.length;t--;){var a=e[t];a.checked&&Ci.push(a)}}function Fi(i){return setTimeout(i,0)}function Ma(i){return clearTimeout(i)}Ti&&j(document,"touchmove",function(i){(I.active||St)&&i.cancelable&&i.preventDefault()}),I.utils={on:j,off:F,css:$,find:Zs,is:function(e,t){return!!$e(e,t,e,!1)},extend:Sd,throttle:Js,closest:$e,toggleClass:we,clone:tn,index:Ae,nextTick:Fi,cancelNextTick:Ma,detectDirection:ln,getChild:kt,expando:ge},I.get=function(i){return i[ge]},I.mount=function(){for(var i=arguments.length,e=new Array(i),t=0;t<i;t++)e[t]=arguments[t];e[0].constructor===Array&&(e=e[0]),e.forEach(function(a){if(!a.prototype||!a.prototype.constructor)throw"Sortable: Mounted plugin must be a constructor function, not ".concat({}.toString.call(a));a.utils&&(I.utils=Me(Me({},I.utils),a.utils)),Yt.mount(a)})},I.create=function(i,e){return new I(i,e)},I.version=Ed;var J=[],ei,Pa,Fa=!1,ja,Da,ji,ti;function Gd(){function i(){this.defaults={scroll:!0,forceAutoScrollFallback:!1,scrollSensitivity:30,scrollSpeed:10,bubbleScroll:!0};for(var e in this)e.charAt(0)==="_"&&typeof this[e]=="function"&&(this[e]=this[e].bind(this))}return i.prototype={dragStarted:function(t){var a=t.originalEvent;this.sortable.nativeDraggable?j(document,"dragover",this._handleAutoScroll):this.options.supportPointer?j(document,"pointermove",this._handleFallbackAutoScroll):a.touches?j(document,"touchmove",this._handleFallbackAutoScroll):j(document,"mousemove",this._handleFallbackAutoScroll)},dragOverCompleted:function(t){var a=t.originalEvent;!this.options.dragOverBubble&&!a.rootEl&&this._handleAutoScroll(a)},drop:function(){this.sortable.nativeDraggable?F(document,"dragover",this._handleAutoScroll):(F(document,"pointermove",this._handleFallbackAutoScroll),F(document,"touchmove",this._handleFallbackAutoScroll),F(document,"mousemove",this._handleFallbackAutoScroll)),hn(),Di(),$d()},nulling:function(){ji=Pa=ei=Fa=ti=ja=Da=null,J.length=0},_handleFallbackAutoScroll:function(t){this._handleAutoScroll(t,!0)},_handleAutoScroll:function(t,a){var r=this,s=(t.touches?t.touches[0]:t).clientX,n=(t.touches?t.touches[0]:t).clientY,o=document.elementFromPoint(s,n);if(ji=t,a||this.options.forceAutoScrollFallback||Vt||Re||Qt){Oa(t,this.options,o,a);var l=Ye(o,!0);Fa&&(!ti||s!==ja||n!==Da)&&(ti&&hn(),ti=setInterval(function(){var c=Ye(document.elementFromPoint(s,n),!0);c!==l&&(l=c,Di()),Oa(t,r.options,c,a)},10),ja=s,Da=n)}else{if(!this.options.bubbleScroll||Ye(o,!0)===Pe()){Di();return}Oa(t,this.options,Ye(o,!1),!1)}}},De(i,{pluginName:"scroll",initializeByDefault:!0})}function Di(){J.forEach(function(i){clearInterval(i.pid)}),J=[]}function hn(){clearInterval(ti)}var Oa=Js(function(i,e,t,a){if(e.scroll){var r=(i.touches?i.touches[0]:i).clientX,s=(i.touches?i.touches[0]:i).clientY,n=e.scrollSensitivity,o=e.scrollSpeed,l=Pe(),c=!1,h;Pa!==t&&(Pa=t,Di(),ei=e.scroll,h=e.scrollFn,ei===!0&&(ei=Ye(t,!0)));var u=0,p=ei;do{var m=p,f=X(m),y=f.top,g=f.bottom,x=f.left,k=f.right,S=f.width,E=f.height,U=void 0,B=void 0,P=m.scrollWidth,D=m.scrollHeight,q=$(m),L=m.scrollLeft,M=m.scrollTop;m===l?(U=S<P&&(q.overflowX==="auto"||q.overflowX==="scroll"||q.overflowX==="visible"),B=E<D&&(q.overflowY==="auto"||q.overflowY==="scroll"||q.overflowY==="visible")):(U=S<P&&(q.overflowX==="auto"||q.overflowX==="scroll"),B=E<D&&(q.overflowY==="auto"||q.overflowY==="scroll"));var N=U&&(Math.abs(k-r)<=n&&L+S<P)-(Math.abs(x-r)<=n&&!!L),H=B&&(Math.abs(g-s)<=n&&M+E<D)-(Math.abs(y-s)<=n&&!!M);if(!J[u])for(var te=0;te<=u;te++)J[te]||(J[te]={});(J[u].vx!=N||J[u].vy!=H||J[u].el!==m)&&(J[u].el=m,J[u].vx=N,J[u].vy=H,clearInterval(J[u].pid),(N!=0||H!=0)&&(c=!0,J[u].pid=setInterval(function(){a&&this.layer===0&&I.active._onTouchMove(ji);var ie=J[this.layer].vy?J[this.layer].vy*o:0,Z=J[this.layer].vx?J[this.layer].vx*o:0;typeof h=="function"&&h.call(I.dragged.parentNode[ge],Z,ie,i,ji,J[this.layer].el)!=="continue"||en(J[this.layer].el,Z,ie)}.bind({layer:u}),24))),u++}while(e.bubbleScroll&&p!==l&&(p=Ye(p,!1)));Fa=c}},30),pn=function(e){var t=e.originalEvent,a=e.putSortable,r=e.dragEl,s=e.activeSortable,n=e.dispatchSortableEvent,o=e.hideGhostForTarget,l=e.unhideGhostForTarget;if(t){var c=a||s;o();var h=t.changedTouches&&t.changedTouches.length?t.changedTouches[0]:t,u=document.elementFromPoint(h.clientX,h.clientY);l(),c&&!c.el.contains(u)&&(n("spill"),this.onSpill({dragEl:r,putSortable:a}))}};function Ra(){}Ra.prototype={startIndex:null,dragStart:function(e){var t=e.oldDraggableIndex;this.startIndex=t},onSpill:function(e){var t=e.dragEl,a=e.putSortable;this.sortable.captureAnimationState(),a&&a.captureAnimationState();var r=kt(this.sortable.el,this.startIndex,this.options);r?this.sortable.el.insertBefore(t,r):this.sortable.el.appendChild(t),this.sortable.animateAll(),a&&a.animateAll()},drop:pn},De(Ra,{pluginName:"revertOnSpill"});function za(){}za.prototype={onSpill:function(e){var t=e.dragEl,a=e.putSortable,r=a||this.sortable;r.captureAnimationState(),t.parentNode&&t.parentNode.removeChild(t),r.animateAll()},drop:pn},De(za,{pluginName:"removeOnSpill"}),I.mount(new Gd),I.mount(za,Ra);class Vd extends Ge{static get properties(){return{disabled:{type:Boolean},handleSelector:{type:String},draggableSelector:{type:String}}}static get styles(){return ye`
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
    `}constructor(){super(),this.disabled=!1,this.handleSelector=".handle",this.draggableSelector=".sortable-item",this._sortable=null}createRenderRoot(){return this}render(){return _`
      <slot></slot>
    `}connectedCallback(){super.connectedCallback(),this.disabled||this._createSortable()}disconnectedCallback(){super.disconnectedCallback(),this._destroySortable()}updated(e){e.has("disabled")&&(this.disabled?this._destroySortable():this._createSortable())}_createSortable(){if(this._sortable)return;const e=this.children[0];if(!e)return;const t={scroll:!0,forceAutoScrollFallback:!0,scrollSpeed:20,animation:150,draggable:this.draggableSelector,handle:this.handleSelector,fallbackTolerance:3,fallbackOnBody:!0,fallbackClass:"sortable-fallback",fallback:!1,onChoose:this._handleChoose.bind(this),onStart:this._handleStart.bind(this),onEnd:this._handleEnd.bind(this),onUpdate:this._handleUpdate.bind(this)};this._sortable=new I(e,t)}_handleUpdate(e){this.dispatchEvent(new CustomEvent("item-moved",{detail:{oldIndex:e.oldIndex,newIndex:e.newIndex},bubbles:!0,composed:!0}))}_handleEnd(e){this._cleanupGhostElements(),e.item.placeholder&&(e.item.placeholder.replaceWith(e.item),delete e.item.placeholder)}_handleStart(e){this._cleanupGhostElements()}_handleChoose(e){e.item.placeholder=document.createComment("sort-placeholder"),e.item.after(e.item.placeholder)}_cleanupGhostElements(){document.querySelectorAll(".sortable-fallback, .sortable-ghost").forEach(e=>{e.parentNode&&e.parentNode.removeChild(e)})}_destroySortable(){this._sortable&&(this._sortable.destroy(),this._sortable=null,this._cleanupGhostElements())}}customElements.define("yamp-sortable",Vd);const _n=Object.freeze([{value:"details",label:d("card.sections.details")},{value:"menu",label:d("card.sections.menu")},{value:"action_chips",label:d("card.sections.action_chips")}]),La=_n.map(i=>i.value);class Qd extends Ge{static get properties(){return{hass:{},_config:{},_activeTab:{type:String},_entityEditorIndex:{type:Number},_actionEditorIndex:{type:Number},_actionMode:{type:String},_useTemplate:{type:Boolean},_useVolTemplate:{type:Boolean},_serviceItems:{type:Array}}}constructor(){super(),this._activeTab="entities",this._entityEditorIndex=null,this._actionEditorIndex=null,this._yamlDraft="",this._parsedYaml=null,this._yamlError=!1,this._serviceItems=[],this._useTemplate=null,this._useVolTemplate=null,this._artworkOverrides=[]}firstUpdated(){this._serviceItems=this._getServiceItems()}updated(e){if(e.has("hass")){const t=e.get("hass");this.hass?.services!==t?.services&&(this._serviceItems=this._getServiceItems())}}_supportsFeature(e,t){return!e||typeof e.attributes.supported_features!="number"?!1:(e.attributes.supported_features&t)!==0}_isGroupCapable(e){return e?this._supportsFeature(e,Bs)?!0:Array.isArray(e.attributes?.group_members):!1}_normalizeArtworkOverrides(e){if(!Array.isArray(e))return[];const t=["media_title","media_artist","media_album_name","media_content_id","media_channel","app_name","media_content_type","entity_id"];return e.map(a=>{if(!a||typeof a!="object")return{match_type:"media_title",match_value:"",image_url:"",size_percentage:void 0,object_fit:void 0};const r=a.size_percentage;if(a.missing_art_url!==void 0)return{match_type:"missing_art",match_value:"",image_url:a.missing_art_url??"",size_percentage:r,object_fit:a.object_fit};let s="media_title",n="";for(const o of t){if(a[o]!==void 0){s=o,n=a[o]??"";break}const l=`${o}_equals`;if(a[l]!==void 0){s=o,n=a[l]??"";break}}return{match_type:s,match_value:n??"",image_url:a.image_url??"",size_percentage:r,object_fit:a.object_fit}})}_serializeArtworkOverride(e){if(!e)return null;const t=(e.image_url??"").trim();if(!t)return null;const a=e.object_fit==="default"?void 0:e.object_fit;if(e.match_type==="missing_art")return{missing_art_url:t,...e.size_percentage!==void 0?{size_percentage:Number(e.size_percentage)}:{},...a!==void 0?{object_fit:a}:{}};const r=(e.match_value??"").trim();return r?{image_url:t,[e.match_type]:r,...e.size_percentage!==void 0?{size_percentage:Number(e.size_percentage)}:{},...a!==void 0?{object_fit:a}:{}}:null}_writeArtworkOverrides(e){this._artworkOverrides=e;const t=e.map(a=>this._serializeArtworkOverride(a)).filter(a=>a);this._updateConfig("media_artwork_overrides",t.length?t:void 0)}_getServiceItems(){return this.hass?.services?Object.entries(this.hass.services).flatMap(([e,t])=>Object.keys(t).map(a=>({label:`${e}.${a}`,value:`${e}.${a}`}))):[]}_getEntityItems(e=[],t=[]){return()=>this.hass?.states?Object.keys(this.hass.states).filter(a=>{const r=a.split(".")[0];return!(e.length&&!e.includes(r)||t.includes(a))}).map(a=>{const r=this.hass.states[a];return{id:a,primary:r?.attributes?.friendly_name||a,secondary:a}}):[]}_entityValueRenderer(e){return e?this.hass?.states?.[e]?.attributes?.friendly_name||e:""}_entityRowRenderer(e){return _`
      <ha-list-item twoline graphic="icon">
        <ha-state-icon
          slot="graphic"
          .hass=${this.hass}
          .stateObj=${this.hass?.states?.[e.id]}
        ></ha-state-icon>
        <span>${e.primary}</span>
        <span slot="secondary">${e.secondary}</span>
      </ha-list-item>
    `}_getAdaptiveTextTargetsValue(){return Array.isArray(this._config?.adaptive_text_targets)?this._config.adaptive_text_targets.filter(e=>La.includes(e)):this._config?.adaptive_text===!0?[...La]:[]}_onAdaptiveTextTargetsChanged(e){const t=Array.isArray(e)?e.filter(a=>La.includes(a)):[];this._updateConfig("adaptive_text_targets",t)}_looksLikeTemplate(e){if(typeof e!="string")return!1;const t=e.trim();return t.includes("{{")||t.includes("{%")}_isEntityId(e){return typeof e=="string"&&/^[a-z_]+\.[a-zA-Z0-9_]+$/.test(e.trim())}setConfig(e){const t=(e.entities??[]).map(a=>typeof a=="string"?{entity_id:a}:a);this._config={...e,entities:t},this._artworkOverrides=this._normalizeArtworkOverrides(e.media_artwork_overrides)}_updateConfig(e,t){const a={...this._config,[e]:t};this._config=a,this.dispatchEvent(new CustomEvent("config-changed",{detail:{config:a},bubbles:!0,composed:!0}))}_addArtworkOverride(){const e=[...this._artworkOverrides??[]];e.push({match_type:"media_title",match_value:"",image_url:"",size_percentage:void 0,object_fit:void 0}),this._writeArtworkOverrides(e)}_removeArtworkOverride(e){const t=[...this._artworkOverrides??[]];e<0||e>=t.length||(t.splice(e,1),this._writeArtworkOverrides(t))}_onArtworkMatchTypeChange(e,t){if(!t)return;const a=[...this._artworkOverrides??[]];if(!a[e])return;const r={...a[e],match_type:t};t==="missing_art"&&(r.match_value=""),a[e]=r,this._writeArtworkOverrides(a)}_onArtworkMatchValueChange(e,t){const a=[...this._artworkOverrides??[]];a[e]&&(a[e]={...a[e],match_value:t},this._writeArtworkOverrides(a))}_onArtworkImageUrlChange(e,t){const a=[...this._artworkOverrides??[]];a[e]&&(a[e]={...a[e],image_url:t},this._writeArtworkOverrides(a))}_onArtworkSizePercentageChange(e,t){const a=[...this._artworkOverrides??[]];if(a[e]){if(t==="")a[e]={...a[e],size_percentage:void 0};else{const r=Number(t);if(Number.isFinite(r))a[e]={...a[e],size_percentage:r};else return}this._writeArtworkOverrides(a)}}_onArtworkObjectFitChange(e,t){const a=[...this._artworkOverrides??[]];if(!a[e])return;const r=t==="default"?void 0:t;a[e]={...a[e],object_fit:r},this._writeArtworkOverrides(a)}_onArtworkMoved(e){const{oldIndex:t,newIndex:a}=e.detail??{},r=[...this._artworkOverrides??[]];if(t===void 0||a===void 0||t<0||a<0||t>=r.length||a>=r.length)return;const[s]=r.splice(t,1);r.splice(a,0,s),this._writeArtworkOverrides(r)}_updateEntityProperty(e,t){const a=[...this._config.entities??[]],r=this._entityEditorIndex;a[r]&&(a[r]={...a[r],[e]:t},this._updateConfig("entities",a))}_updateActionProperty(e,t){const a=[...this._config.actions??[]],r=this._actionEditorIndex;if(a[r]){e==="card_trigger"&&t&&t!=="none"&&a.forEach((n,o)=>{o!==r&&n.card_trigger===t&&(a[o]={...n,card_trigger:"none"})});const s={...a[r],[e]:t};e==="in_menu"&&delete s.placement,a[r]=s,this._updateConfig("actions",a)}}_deriveActionMode(e){if(!e)return"service";if(e.action==="prev_entity")return"prev_entity";if(e.action==="next_entity")return"next_entity";if(e.action==="select_entity")return"select_entity";if(e.action==="sync_selected_entity"||e.sync_entity_helper)return"sync_selected_entity";if(typeof e.menu_item=="string"&&e.menu_item.trim()!=="")return"menu";const t=typeof e.navigation_path=="string"?e.navigation_path.trim():"";return e.action==="navigate"||t?"navigate":e.action==="toggle_lyrics"?"toggle_lyrics":"service"}static get styles(){return ye`
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
      `}render(){if(!this._config)return _``;const e=this._entityEditorIndex!==null,t=this._actionEditorIndex!==null;return _`
        <div class="tabs">
          ${["entities","behavior","look_and_feel","artwork","actions"].map(a=>{const r=d(`editor.tabs.${a}`);return _`
              <button
                class="tab" ${this._activeTab===a?"selected":""}
                @click=${()=>{this._activeTab=a,this._entityEditorIndex=null,this._actionEditorIndex=null,this._useTemplate=null,this._useVolTemplate=null}}
                ?selected=${this._activeTab===a}
              >${r}</button>
            `})}
        </div>
        <div class="tab-content">
          ${e?this._renderEntityEditor(this._config.entities?.[this._entityEditorIndex]):t?this._renderActionEditor(this._config.actions?.[this._actionEditorIndex]):this._renderActiveTab()}
        </div>
      `}_renderArtworkTab(){const e=[...this._artworkOverrides??[]],t=[{value:"media_title",label:"Media Title"},{value:"media_artist",label:"Media Artist"},{value:"media_album_name",label:"Album Name"},{value:"media_content_id",label:"Content ID"},{value:"media_channel",label:"Channel"},{value:"app_name",label:"App Name"},{value:"media_content_type",label:"Content Type"},{value:"entity_id",label:"Entity ID"},{value:"missing_art",label:"Missing Artwork"}];return _`
        <div class="config-section">
          <div class="section-header">
            <div class="section-title">${d("editor.sections.artwork.general.title")}</div>
            <div class="section-description">${d("editor.sections.artwork.general.description")}</div>
          </div>

          <div class="form-row form-row-multi-column">
            <div class="grow-children">
              <ha-selector
                .hass=${this.hass}
                label="${d("editor.fields.artwork_fit")}"
                .selector=${{select:{mode:"dropdown",options:[{value:"cover",label:d("editor.artwork_fit.cover")},{value:"contain",label:d("editor.artwork_fit.contain")},{value:"fill",label:d("editor.artwork_fit.fill")},{value:"scale-down",label:d("editor.artwork_fit.scale-down")},{value:"scaled-contain",label:d("editor.artwork_fit.scaled-contain")},{value:"scaled-contain-alternate",label:d("editor.artwork_fit.scaled-contain-alternate")},{value:"none",label:d("editor.artwork_fit.none")},{value:"no_artwork",label:d("editor.fields.no_artwork_option")}]}}}
                .value=${this._config.artwork_object_fit??"cover"}
                @value-changed=${a=>{const r=a.detail.value;this._updateConfig("artwork_object_fit",r==="cover"?void 0:r)}}
              ></ha-selector>
            </div>
            <div class="grow-children">
              <ha-selector
                .hass=${this.hass}
                label="${d("editor.fields.artwork_position")}"
                .selector=${{select:{mode:"dropdown",options:[{value:"top center",label:"Top (default)"},{value:"center center",label:"Center"},{value:"bottom center",label:"Bottom"}]}}}
                .value=${this._config.artwork_position??"top center"}
                @value-changed=${a=>{const r=a.detail.value;this._updateConfig("artwork_position",r==="top center"?void 0:r)}}
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
                <label for="extend-artwork-toggle" style="font-weight: 500;">${d("editor.subtitles.artwork_extend_label")}</label>
                <div style="font-size: 0.85em; opacity: 0.7;">${d("editor.subtitles.artwork_extend")}</div>
              </div>
            </div>
          </div>
          <div class="form-row">
            <ha-textfield
              class="full-width"
              label="${d("editor.fields.artwork_hostname")}"
              .value=${this._config.artwork_hostname??""}
              @input=${a=>this._updateConfig("artwork_hostname",a.target.value)}
              helper="e.g. http://192.168.1.50:8123"
              .helperPersistent=${!0}
            ></ha-textfield>
          </div>
        </div>

        <div class="config-section">
          <div class="section-header">
            <div class="section-title">${d("editor.sections.artwork.idle.title")}</div>
            <div class="section-description">${d("editor.sections.artwork.idle.description")}</div>
          </div>
          <div class="form-row form-row-multi-column">
            <div style="display: flex; align-items: center; gap: 8px; flex: 1;">
              <ha-switch
                id="idle-image-url-toggle"
                .checked=${this._useIdleImageUrl??this._looksLikeUrlOrPath(this._config.idle_image)}
                @change=${a=>{this._useIdleImageUrl=a.target.checked,a.target.checked?this._updateConfig("idle_image",""):this._updateConfig("idle_image","")}}
              ></ha-switch>
              <label for="idle-image-url-toggle">${d("editor.labels.use_url_path")}</label>
            </div>
            <div style="flex: 2;">
              ${this._useIdleImageUrl?_`
                <ha-textfield
                  class="full-width"
                  placeholder="e.g., https://example.com/image.jpg or /local/custom/image.jpg"
                  .value=${this._config.idle_image??""}
                  @input=${a=>this._updateConfig("idle_image",a.target.value)}
                  helper="${d("editor.subtitles.image_url_helper")}"
                  .helperPersistent=${!0}
                ></ha-textfield>
              `:_`
                <ha-generic-picker
                  class="full-width"
                  .hass=${this.hass}
                  .value=${this._config.idle_image??""}
                  .label=${d("editor.fields.idle_image_entity")}
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
            <div class="section-title">${d("editor.sections.artwork.overrides.title")}</div>
            <div class="section-description">${d("editor.sections.artwork.overrides.description")}</div>
          </div>
          <yamp-sortable @item-moved=${a=>this._onArtworkMoved(a)}>
            <div class="sortable-container">
              ${e.length?e.map((a,r)=>_`
                    <div class="action-row-inner sortable-item artwork-row">
                      <div class="handle action-handle">
                        <ha-icon icon="mdi:drag"></ha-icon>
                      </div>
                      <div class="artwork-fields">
                        <ha-selector
                          .hass=${this.hass}
                          label="${d("editor.fields.match_field")}"
                          .selector=${{select:{mode:"dropdown",options:t}}}
                          .value=${a.match_type??"media_title"}
                          @value-changed=${s=>this._onArtworkMatchTypeChange(r,s.detail.value)}
                        ></ha-selector>
                        ${a.match_type==="missing_art"?_`
                                <div class="config-subtitle small">
                                  Applies when the selected media provides no artwork.
                                </div>
                              `:a.match_type==="entity_id"?_`
                                  <ha-generic-picker
                                    class="full-width"
                                    .hass=${this.hass}
                                    .value=${a.match_value??""}
                                    .label=${d("editor.fields.match_entity")}
                                    .valueRenderer=${s=>this._entityValueRenderer(s)}
                                    .rowRenderer=${s=>this._entityRowRenderer(s)}
                                    .getItems=${this._getEntityItems(["media_player"])}
                                    @value-changed=${s=>this._onArtworkMatchValueChange(r,s.detail.value)}
                                    allow-custom-value
                                  ></ha-generic-picker>
                                `:_`
                                  <ha-textfield
                                    class="full-width"
                                    label="${d("editor.fields.match_value")}"
                                    .value=${a.match_value??""}
                                    @input=${s=>this._onArtworkMatchValueChange(r,s.target.value)}
                                  ></ha-textfield>
                                `}
                        <ha-textfield
                          class="full-width"
                          label=${a.match_type==="missing_art"?d("editor.fields.fallback_image_url"):d("editor.fields.image_url")}
                          .value=${a.image_url??""}
                          @input=${s=>this._onArtworkImageUrlChange(r,s.target.value)}
                        ></ha-textfield>
                        <div class="form-row-multi-column" style="gap:12px; flex-wrap:wrap; align-items:flex-start;">
                          <div class="grow-children" style="flex:1;">
                            <ha-textfield
                              class="full-width"
                              label="${d("editor.fields.size_percent")}"
                              type="number"
                              min="1"
                              max="100"
                              .value=${a.size_percentage??""}
                              @input=${s=>this._onArtworkSizePercentageChange(r,s.target.value)}
                            ></ha-textfield>
                          </div>
                          <div class="grow-children" style="flex:1.5;">
                            <ha-selector
                              .hass=${this.hass}
                              label="${d("editor.fields.object_fit")}"
                              .selector=${{select:{mode:"dropdown",options:[{value:"default",label:d("editor.artwork_fit.default")},{value:"cover",label:d("editor.artwork_fit.cover")},{value:"contain",label:d("editor.artwork_fit.contain")},{value:"fill",label:d("editor.artwork_fit.fill")},{value:"scale-down",label:d("editor.artwork_fit.scale-down")},{value:"scaled-contain",label:d("editor.artwork_fit.scaled-contain")},{value:"scaled-contain-alternate",label:d("editor.artwork_fit.scaled-contain-alternate")},{value:"none",label:d("editor.artwork_fit.none")},{value:"no_artwork",label:d("editor.fields.no_artwork_option")}]}}}
                              .value=${a.object_fit||"default"}
                              @value-changed=${s=>this._onArtworkObjectFitChange(r,s.detail.value)}
                            ></ha-selector>
                          </div>
                        </div>
                      </div>
                      <div class="action-row-actions">
                        <ha-icon
                          class="icon-button"
                          icon="mdi:trash-can"
                          title="Delete Override"
                          @click=${()=>this._removeArtworkOverride(r)}
                        ></ha-icon>
                      </div>
                    </div>
                  `):_`<div class="config-subtitle" style="padding:12px 0;text-align:center;">${d("editor.subtitles.no_artwork_overrides")}</div>`}
            </div>
          </yamp-sortable>
          <div class="add-action-button-wrapper">
            <ha-icon
              class="icon-button"
              icon="mdi:plus"
              title="${d("editor.titles.add_artwork_override")}"
              @click=${this._addArtworkOverride}
            ></ha-icon>
          </div>
        </div>
        </div>

      `}_renderActiveTab(){switch(this._activeTab){case"entities":return this._renderEntitiesTab();case"behavior":return this._renderBehaviorTab();case"look_and_feel":return this._renderVisualTab();case"artwork":return this._renderArtworkTab();case"actions":return this._renderActionsTab();default:return this._renderEntitiesTab()}}_renderEntitiesTab(){if(!this._config)return _``;let e=[...this._config.entities??[]];return(e.length===0||e[e.length-1].entity_id)&&e.push({entity_id:""}),_`
        <div class="entity-group">
          <div class="entity-group-header section-header">
            <div class="entity-group-title section-title">${d("editor.sections.entities.title")}</div>
            <div class="section-description">${d("editor.sections.entities.description")}</div>
          </div>
          <div class="form-row">
            <yamp-sortable @item-moved=${t=>this._onEntityMoved(t)}>
              <div class="sortable-container">
                ${e.map((t,a)=>_`
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
                        .label=${d("common.media_player")}
                        .valueRenderer=${r=>this._entityValueRenderer(r)}
                        .rowRenderer=${r=>this._entityRowRenderer(r)}
                        .getItems=${this._getEntityItems(["media_player"],a===e.length-1&&!t.entity_id?this._config.entities?.map(r=>r.entity_id)??[]:[])}
                        @value-changed=${r=>this._onEntityChanged(a,r.detail.value)}
                        allow-custom-value
                      ></ha-generic-picker>
                    </div>
                    <div class="entity-row-actions">
                      <ha-icon
                        class="icon-button ${t.entity_id?"":"icon-button-disabled"}"
                        icon="mdi:pencil"
                        title="${d("common.edit_entity")}"
                        @click=${()=>this._onEditEntity(a)}
                      ></ha-icon>
                    </div>
                  </div>
                `)}
              </div>
            </yamp-sortable>
          </div>
        </div>
      `}_renderBehaviorTab(){const e=Number(this._config.search_results_limit)>100;return _`
        <div class="config-section">
          <div class="form-row">
            <ha-selector
              .hass=${this.hass}
              .selector=${{select:{mode:"dropdown",options:[{value:"default",label:d("editor.card_type_options.default")},{value:"search",label:d("editor.card_type_options.search")},{value:"group_players",label:d("editor.card_type_options.group_players")}]}}}
              .value=${this._config.card_type??"default"}
              label="${d("editor.fields.card_type")}"
              @value-changed=${t=>this._updateConfig("card_type",t.detail.value)}
            ></ha-selector>
            <div class="config-subtitle">${d("editor.subtitles.card_type")}</div>
          </div>
        </div>

        <div class="config-section">
          <div class="section-header">
            <div class="section-title">${d("editor.sections.behavior.idle_chips.title")}</div>
            <div class="section-description">${d("editor.sections.behavior.idle_chips.description")}</div>
          </div>
          <div class="form-row form-row-multi-column">
            <div class="grow-children">
              <ha-selector
                .hass=${this.hass}
                .selector=${{number:{min:0,step:1e3,unit_of_measurement:"ms",mode:"box"}}}
                .value=${this._config.idle_timeout_ms??6e4}
                label="${d("editor.fields.idle_timeout")}"
                @value-changed=${t=>this._updateConfig("idle_timeout_ms",t.detail.value)}
              ></ha-selector>
              <div class="config-subtitle">${d("editor.subtitles.idle_timeout")}</div>
            </div>
            <ha-icon
              class="icon-button"
              icon="mdi:restore"
              title="${d("common.reset_default")}"
              @click=${()=>this._updateConfig("idle_timeout_ms",6e4)}
            ></ha-icon>
          </div>
          <div class="form-row">
            <ha-selector
              .hass=${this.hass}
              .selector=${{select:{mode:"dropdown",options:[{value:"auto",label:"Auto"},{value:"always",label:"Always"},{value:"in_menu",label:"In Menu"},{value:"in_menu_on_idle",label:"In Menu on Idle"}]}}}
              .value=${this._config.show_chip_row??"auto"}
              label="${d("editor.fields.show_chip_row")}"
              @value-changed=${t=>this._updateConfig("show_chip_row",t.detail.value)}
            ></ha-selector>
            <div class="config-subtitle">${d("editor.subtitles.show_chip_row")}</div>
          </div>
          <div class="form-row form-row-multi-column">
            <div>
              <ha-switch
                id="dim-chips-on-idle-toggle"
                .checked=${this._config.dim_chips_on_idle??!0}
                @change=${t=>this._updateConfig("dim_chips_on_idle",t.target.checked)}
              ></ha-switch>
              <span>${d("editor.labels.dim_chips")}</span>
            </div>
            <div class="config-subtitle">${d("editor.subtitles.dim_chips")}</div>
          </div>
        </div>

        <div class="config-section">
          <div class="section-header">
            <div class="section-title">${d("editor.sections.behavior.interactions_search.title")}</div>
            <div class="section-description">${d("editor.sections.behavior.interactions_search.description")}</div>
          </div>
          <div class="form-row form-row-multi-column">
            <div>
              <ha-switch
                id="always-show-quick-group-toggle"
                .checked=${this._config.always_show_quick_group??!1}
                @change=${t=>this._updateConfig("always_show_quick_group",t.target.checked)}
              ></ha-switch>
              <label for="always-show-quick-group-toggle">${d("editor.labels.always_show_group")}</label>
            </div>
            <div class="config-subtitle">${d("editor.subtitles.always_show_group")}</div>
          </div>
          <div class="form-row form-row-multi-column">
            <div>
              <ha-switch
                id="hold-to-pin-toggle"
                .checked=${this._config.hold_to_pin??!1}
                @change=${t=>this._updateConfig("hold_to_pin",t.target.checked)}
              ></ha-switch>
              <label for="hold-to-pin-toggle">${d("editor.labels.hold_to_pin")}</label>
            </div>
            <div class="config-subtitle">${d("editor.subtitles.hold_to_pin")}</div>
          </div>
          <div class="form-row form-row-multi-column">
            <div>
              <ha-switch
                .checked=${this._config.disable_autofocus??!1}
                @change=${t=>this._updateConfig("disable_autofocus",t.target.checked)}
              ></ha-switch>
              <span>${d("editor.labels.disable_autofocus")}</span>
            </div>
            <div class="config-subtitle">${d("editor.subtitles.disable_autofocus")}</div>
          </div>
          <div class="form-row form-row-multi-column">
            <div>
              <ha-switch
                id="default-search-favorites-toggle"
                .checked=${this._config.default_search_favorites??!1}
                @change=${t=>this._updateConfig("default_search_favorites",t.target.checked)}
              ></ha-switch>
              <span>${d("editor.labels.default_search_favorites")}</span>
            </div>
            <div class="config-subtitle">${d("editor.subtitles.default_search_favorites")}</div>
          </div>

          <div class="form-row form-row-multi-column">
            <div>
              <ha-switch
                .checked=${this._config.keep_filters_on_search??!1}
                @change=${t=>this._updateConfig("keep_filters_on_search",t.target.checked)}
              ></ha-switch>
              <span>${d("editor.labels.keep_filters")}</span>
            </div>
            <div class="config-subtitle">${d("editor.subtitles.search_within_filter")}</div>
          </div>

          <div class="form-row form-row-multi-column">
            <div>
              <ha-switch
                id="dismiss-search-on-play-toggle"
                .checked=${this._config.dismiss_search_on_play??!0}
                @change=${t=>this._updateConfig("dismiss_search_on_play",t.target.checked)}
              ></ha-switch>
              <span>${d("editor.labels.dismiss_on_play")}</span>
            </div>
            <div class="config-subtitle">${d("editor.subtitles.close_search_on_play")}</div>
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
              <span>${d("editor.labels.pin_headers")}</span>
            </div>
            <div class="config-subtitle">${d("editor.subtitles.pin_search_headers")}</div>
          </div>

          <div class="form-row form-row-multi-column">
            <div>
              <ha-switch
                id="hide-search-headers-on-idle-toggle"
                .checked=${this._config.hide_search_headers_on_idle??!1}
                @change=${t=>this._updateConfig("hide_search_headers_on_idle",t.target.checked)}
              ></ha-switch>
              <span>${d("editor.labels.hide_search_headers_on_idle")}</span>
            </div>
            <div class="config-subtitle">${d("editor.subtitles.hide_search_headers_on_idle")}</div>
          </div>

          <div class="form-row form-row-multi-column">
            <div>
              <ha-switch
                id="disable-mass-queue-toggle"
                .checked=${this._config.disable_mass_queue??!1}
                @change=${t=>this._updateConfig("disable_mass_queue",t.target.checked)}
              ></ha-switch>
              <span>${d("editor.labels.disable_mass")}</span>
            </div>
            <div class="config-subtitle">${d("editor.subtitles.disable_mass")}</div>
          </div>
            <div class="form-row form-row-multi-column">
              <div class="grow-children number-input-with-note">
                <ha-selector-number
                  .selector=${{number:{min:0,max:1e3,step:1,mode:"box"}}}
                  .value=${this._config.search_results_limit??20}
                  label="${d("editor.fields.search_limit")}"
                  helper="${d("editor.subtitles.search_limit_full")}"
                  @value-changed=${t=>this._updateConfig("search_results_limit",t.detail.value)}
                ></ha-selector-number>
                ${e?_`
                  <div class="config-subtitle warning">
                    Warning: requesting higher results can cause performance issues.
                  </div>
                `:v}
            </div>
            <ha-icon
              class="icon-button"
              id="search-limit-reset"
              icon="mdi:restore"
              title="${d("common.reset_default")}"
              @click=${()=>this._updateConfig("search_results_limit",20)}
            ></ha-icon>
          </div>

          <div class="form-row">
            <ha-selector
              .hass=${this.hass}
              .selector=${{select:{mode:"dropdown",options:[{value:"all",label:d("search.filters.all")},{value:"artist",label:d("search.filters.artist")},{value:"album",label:d("search.filters.album")},{value:"track",label:d("search.filters.track")},{value:"playlist",label:d("search.filters.playlist")},{value:"radio",label:d("search.filters.radio")},{value:"podcast",label:d("search.filters.podcast")},{value:"audiobook",label:d("search.filters.audiobook")}]}}}
              .value=${this._config.default_search_filter??"all"}
              label="${d("editor.labels.default_search_filter")}"
              helper="${d("editor.subtitles.default_search_filter_full")}"
              @value-changed=${t=>this._updateConfig("default_search_filter",t.detail.value)}
            ></ha-selector>
          </div>

          <div class="form-row">
            <ha-selector
              .hass=${this.hass}
              .selector=${{select:{mode:"dropdown",options:[{value:"default",label:"Default"},{value:"name",label:"Name (A\u2192Z)"},{value:"name_desc",label:"Name (Z\u2192A)"},{value:"sort_name",label:"Sort Name (A\u2192Z)"},{value:"sort_name_desc",label:"Sort Name (Z\u2192A)"},{value:"timestamp_added",label:"Date Added (Oldest)"},{value:"timestamp_added_desc",label:"Date Added (Newest)"},{value:"last_played",label:"Last Played (Oldest)"},{value:"last_played_desc",label:"Last Played (Recent)"},{value:"play_count",label:"Play Count (Low\u2192High)"},{value:"play_count_desc",label:"Play Count (High\u2192Low)"},{value:"year",label:"Year (Oldest)"},{value:"year_desc",label:"Year (Newest)"},{value:"position",label:"Position (Asc)"},{value:"position_desc",label:"Position (Desc)"},{value:"artist_name",label:"Artist (A\u2192Z)"},{value:"artist_name_desc",label:"Artist (Z\u2192A)"},{value:"random",label:"Random"},{value:"random_play_count",label:"Random + Least Played"}]}}}
              .value=${this._config.search_results_sort??"default"}
              label="${d("editor.fields.result_sorting")}"
              helper="${d("editor.subtitles.result_sorting_full")}"
              @value-changed=${t=>this._updateConfig("search_results_sort",t.detail.value)}
            ></ha-selector>
          </div>
        </div>

        <div class="config-section">
          <div class="section-header">
            <div class="section-title">${d("editor.sections.behavior.lyrics.title")}</div>
            <div class="section-description">${d("editor.sections.behavior.lyrics.description")}</div>
          </div>
          <div class="form-row form-row-multi-column">
            <div>
              <ha-switch
                id="always-show-lyrics-toggle"
                .checked=${this._config.always_show_lyrics??!1}
                @change=${t=>this._updateConfig("always_show_lyrics",t.target.checked)}
              ></ha-switch>
              <label for="always-show-lyrics-toggle">${d("editor.labels.always_show_lyrics")}</label>
            </div>
            <div class="config-subtitle">${d("editor.subtitles.always_show_lyrics")}</div>
          </div>
          <div class="form-row">
            <ha-selector
              .hass=${this.hass}
              .selector=${{select:{mode:"dropdown",options:[{value:"default",label:d("lyrics_modes.default")},{value:"scroll",label:d("lyrics_modes.scroll")},{value:"text",label:d("lyrics_modes.text")}]}}}
              .value=${this._config.lyrics_mode??"default"}
              label="${d("editor.labels.lyrics_mode")}"
              @value-changed=${t=>this._updateConfig("lyrics_mode",t.detail.value)}
            ></ha-selector>
            <ha-selector
              .hass=${this.hass}
              .selector=${{select:{mode:"dropdown",options:[{value:"mass_lrclib",label:d("lyrics_sources.mass_lrclib")},{value:"mass",label:d("lyrics_sources.mass")},{value:"lrclib",label:d("lyrics_sources.lrclib")},{value:"lrclib_mass",label:d("lyrics_sources.lrclib_mass")}]}}}
              .value=${this._config.lyrics_source??"mass_lrclib"}
              label="${d("editor.labels.lyrics_source")}"
              @value-changed=${t=>this._updateConfig("lyrics_source",t.detail.value)}
            ></ha-selector>
            <div class="config-subtitle">${d("editor.subtitles.lyrics_source")}</div>
          </div>
          <div class="form-row form-row-multi-column">
            <div class="grow-children">
              <ha-selector
                .hass=${this.hass}
                .selector=${{number:{min:-5,max:5,step:.1,unit_of_measurement:"s",mode:"box"}}}
                .value=${this._config.lyrics_pre_roll??0}
                label="${d("editor.labels.lyrics_pre_roll")}"
                helper="${d("editor.subtitles.lyrics_pre_roll")}"
                @value-changed=${t=>this._updateConfig("lyrics_pre_roll",t.detail.value)}
              ></ha-selector>
            </div>
            <ha-icon
              class="icon-button"
              icon="mdi:restore"
              title="${d("common.reset_default")}"
              @click=${()=>this._updateConfig("lyrics_pre_roll",0)}
            ></ha-icon>
          </div>
        </div>
      `}_renderVisualTab(){const e=this._config.volume_mode==="stepper"?_`
          <div class="form-row form-row-multi-column">
            <div class="grow-children">
              <ha-selector
                .hass=${this.hass}
                .selector=${{number:{min:.01,max:1,step:.01,unit_of_measurement:"",mode:"box"}}}
                .value=${this._config.volume_step??.05}
                label="${d("editor.fields.vol_step")}"
                @value-changed=${t=>this._updateConfig("volume_step",t.detail.value)}
              ></ha-selector>
            </div>
            <ha-icon
              class="icon-button"
              icon="mdi:restore"
              title="${d("common.reset_default")}"
              @click=${()=>this._updateConfig("volume_step",.05)}
            ></ha-icon>
          </div>
        `:v;return _`
        <div class="config-section">
          <div class="section-header">
            <div class="section-title">${d("editor.sections.look_and_feel.theme_layout.title")}</div>
            <div class="section-description">${d("editor.sections.look_and_feel.theme_layout.description")}</div>
          </div>
          <div class="form-row form-row-multi-column">
            <div>
              <ha-switch
                id="match-theme-toggle"
                .checked=${this._config.match_theme??!1}
                @change=${t=>this._updateConfig("match_theme",t.target.checked)}
              ></ha-switch>
              <span>${d("editor.labels.match_theme")}</span>
            </div>
            <div>
              <ha-switch
                id="alternate-progress-bar-toggle"
                .checked=${this._config.alternate_progress_bar??!1}
                @change=${t=>this._updateConfig("alternate_progress_bar",t.target.checked)}
              ></ha-switch>
              <span>${d("editor.labels.alt_progress")}</span>
            </div>
          </div>
          <div class="form-row">
            <ha-selector
              .hass=${this.hass}
              .selector=${{select:{mode:"dropdown",options:[{value:"automatic",label:d("editor.appearance_options.automatic")},{value:"light",label:d("editor.appearance_options.light")},{value:"dark",label:d("editor.appearance_options.dark")}]}}}
              .value=${this._config.appearance??"automatic"}
              label="${d("editor.fields.appearance")}"
              @value-changed=${t=>this._updateConfig("appearance",t.detail.value)}
            ></ha-selector>
          </div>
          <div class="form-row form-row-multi-column">
            <div title=${this._config.alternate_progress_bar||this._config.always_collapsed?d("editor.subtitles.not_available_alt_collapsed"):""}>
              <ha-switch
                id="display-timestamps-toggle"
                .checked=${this._config.display_timestamps??!1}
                @change=${t=>this._updateConfig("display_timestamps",t.target.checked)}
                .disabled=${this._config.alternate_progress_bar||this._config.always_collapsed}
              ></ha-switch>
              <span>${d("editor.labels.display_timestamps")}</span>
            </div>
          </div>
          <div class="form-row form-row-multi-column">
            <div class="grow-children">
              <ha-textfield
                class="full-width"
                type="number"
                min="0"
                label="${d("editor.fields.card_height")}"
                .value=${this._config.card_height??""}
                helper="${d("editor.subtitles.card_height_full")}"
                .helperPersistent=${!0}
                @input=${t=>{const a=t.target.value;if(a===""){this._updateConfig("card_height",void 0);return}const r=Number(a);this._updateConfig("card_height",Number.isFinite(r)&&r>0?r:void 0)}}
              ></ha-textfield>
            </div>
            <ha-icon
                class="icon-button"
                icon="mdi:restore"
                title="${d("common.reset_default")}"
                @click=${()=>this._updateConfig("card_height",void 0)}
              ></ha-icon>
            </div>
            <div class="form-row">
              <ha-selector
                .hass=${this.hass}
                .selector=${{select:{mode:"dropdown",options:[{value:"list",label:d("editor.search_view_options.list")},{value:"card",label:d("editor.search_view_options.card")},{value:"card_minimal",label:d("editor.search_view_options.card_minimal")}]}}}
                .value=${this._config.search_view??"list"}
                label="${d("editor.fields.search_view")}"
                helper="${d("editor.subtitles.search_view")}"
                @value-changed=${t=>this._updateConfig("search_view",t.detail.value)}
              ></ha-selector>
            </div>
            ${this._config.search_view==="card"||this._config.search_view==="card_minimal"?_`
              <div class="form-row">
                <ha-selector
                  .hass=${this.hass}
                  .selector=${{number:{min:1,max:12,step:1,mode:"box"}}}
                  .value=${this._config.search_card_columns??4}
                  label="${d("editor.fields.search_card_columns")}"
                  helper="${d("editor.subtitles.search_card_columns")}"
                  @value-changed=${t=>this._updateConfig("search_card_columns",t.detail.value)}
                ></ha-selector>
              </div>
            `:v}
          </div>

        <div class="config-section">
          <div class="section-header">
            <div class="section-title">${d("editor.sections.look_and_feel.controls_typography.title")}</div>
            <div class="section-description">${d("editor.sections.look_and_feel.controls_typography.description")}</div>
          </div>
          <div class="form-row">
            <ha-selector
              .hass=${this.hass}
              .selector=${{select:{mode:"dropdown",options:[{value:"classic",label:"Classic"},{value:"modern",label:"Modern"}]}}}
              .value=${this._config.control_layout??"classic"}
              label="${d("editor.fields.control_layout")}"
              helper="${d("editor.subtitles.control_layout_full")}"
              @value-changed=${t=>this._updateConfig("control_layout",t.detail.value)}
            ></ha-selector>
          </div>
          <div class="form-row"
            style="${(this._config.control_layout??"classic")==="modern"?"":"opacity: 0.5;"}"
            title="${(this._config.control_layout??"classic")==="modern"?"":d("editor.subtitles.only_available_modern")}"}>
            <div>
              <ha-switch
                .checked=${this._config.swap_pause_for_stop??!1}
                @change=${t=>this._updateConfig("swap_pause_for_stop",t.target.checked)}
                .disabled=${(this._config.control_layout??"classic")!=="modern"}
              ></ha-switch>
              <span>${d("editor.labels.swap_pause_stop")}</span>
            </div>
            <div class="config-subtitle">${d("editor.subtitles.swap_pause_stop")}</div>
          </div>
          <div class="form-row">
            <div>
              <ha-switch
                id="adaptive-controls-toggle"
                .checked=${this._config.adaptive_controls??!1}
                @change=${t=>this._updateConfig("adaptive_controls",t.target.checked)}
              ></ha-switch>
              <span>${d("editor.labels.adaptive_controls")}</span>
            </div>
            <div class="config-subtitle">${d("editor.subtitles.adaptive_controls")}</div>
          </div>
          <div class="form-row">
            <div>
              <ha-switch
                id="hide-active-entity-label-toggle"
                .checked=${this._config.hide_active_entity_label??!1}
                @change=${t=>this._updateConfig("hide_active_entity_label",t.target.checked)}
              ></ha-switch>
              <span>${d("editor.labels.hide_active_entity")}</span>
            </div>
            <div class="config-subtitle">${d("editor.subtitles.hide_menu_player")}</div>
          </div>
        <div class="form-row">
          <div class="full-width">
            <span class="form-label">${d("editor.labels.adaptive_text_elements")}</span>
            <div class="config-subtitle">${d("editor.subtitles.adaptive_text")}</div>
            <ha-selector
              .hass=${this.hass}
              .selector=${{select:{multiple:!0,options:_n}}}
              .value=${this._getAdaptiveTextTargetsValue()}
              @value-changed=${t=>this._onAdaptiveTextTargetsChanged(t.detail.value)}
            ></ha-selector>
          </div>
        </div>
          <div class="form-row">
            <ha-selector
              .hass=${this.hass}
              .selector=${{select:{mode:"dropdown",options:[{value:"left",label:"Left"},{value:"center",label:"Center"},{value:"right",label:"Right"},{value:"none",label:"None"}]}}}
              .value=${this._config.details_alignment??"left"}
              label="${d("editor.fields.details_alignment")}"
              @value-changed=${t=>this._updateConfig("details_alignment",t.detail.value)}
            ></ha-selector>
          </div>
          <div class="form-row">
            <ha-selector
              .hass=${this.hass}
              .selector=${{select:{mode:"dropdown",options:[{value:"slider",label:"Slider"},{value:"stepper",label:"Stepper"},{value:"hidden",label:"Hidden"}]}}}
              .value=${this._config.volume_mode??"slider"}
              label="${d("editor.fields.volume_mode")}"
              @value-changed=${t=>this._updateConfig("volume_mode",t.detail.value)}
            ></ha-selector>
          </div>
          ${e}
        </div>

        <div class="config-section">
          <div class="section-header">
            <div class="section-title">${d("editor.sections.look_and_feel.collapsed_idle.title")}</div>
            <div class="section-description">${d("editor.sections.look_and_feel.collapsed_idle.description")}</div>
          </div>
          <div class="form-row form-row-multi-column">
            <div>
              <ha-switch
                id="collapse-on-idle-toggle"
                .checked=${this._config.collapse_on_idle??!1}
                @change=${t=>this._updateConfig("collapse_on_idle",t.target.checked)}
              ></ha-switch>
              <span>${d("editor.labels.collapse_on_idle")}</span>
            </div>
            <div style="${this._config.always_collapsed?"opacity: 0.5;":""}"
              title="${this._config.always_collapsed?d("editor.subtitles.not_available_collapsed"):""}">
              <ha-switch
                id="hide-menu-player-toggle"
                .checked=${this._config.hide_menu_player??!1}
                @change=${t=>this._updateConfig("hide_menu_player",t.target.checked)}
                .disabled=${!!this._config.always_collapsed||this._config.always_collapsed===!0&&this._config.pin_search_headers===!0&&this._config.expand_on_search===!0}
              ></ha-switch>
              <span>${d("editor.labels.hide_menu_player_toggle")}</span>
            </div>
          </div>
          <div class="form-row form-row-multi-column">
            <div>
              <ha-switch
                id="always-collapsed-toggle"
                .checked=${this._config.always_collapsed??!1}
                @change=${t=>this._updateConfig("always_collapsed",t.target.checked)}
              ></ha-switch>
              <span>${d("editor.labels.always_collapsed")}</span>
            </div>
            <div style="${this._config.always_collapsed?"":"opacity: 0.5;"}"
              title="${this._config.always_collapsed?"":d("editor.subtitles.only_available_collapsed")}">
              <ha-switch
                id="expand-on-search-toggle"
                .checked=${this._config.expand_on_search??!1}
                @change=${t=>this._updateConfig("expand_on_search",t.target.checked)}
                .disabled=${!this._config.always_collapsed}
              ></ha-switch>
              <span>${d("editor.labels.expand_on_search")}</span>
            </div>
          </div>
          <div class="form-row">
            <div class="config-subtitle">${d("editor.subtitles.collapse_expand")}</div>
          </div>
          <div class="form-row">
            <ha-selector
              .hass=${this.hass}
              .selector=${{select:{mode:"dropdown",options:[{value:"default",label:"Default"},{value:"search",label:"Search"},{value:"search-recently-played",label:"Recently Played"},{value:"search-next-up",label:"Next Up"}]}}}
              .value=${this._config.idle_screen??"default"}
              label="${d("editor.fields.idle_screen")}"
              @value-changed=${t=>this._updateConfig("idle_screen",t.detail.value)}
            ></ha-selector>
            <div class="config-subtitle">${d("editor.subtitles.idle_screen")}</div>
          </div>
        </div>

      `}_renderActionsTab(){let e=[...this._config.actions??[]];return _`
        <div class="action-group config-section">
          <div class="action-group-header section-header">
            <div class="action-group-title section-title">${d("editor.sections.actions.title")}</div>
            <div class="section-description">${d("editor.sections.actions.description")}</div>
          </div>
          <div class="form-row">
            <yamp-sortable @item-moved=${t=>this._onActionMoved(t)}>
              <div class="sortable-container">
                ${e.map((t,a)=>_`
                  <div class="action-row-inner sortable-item">
                    <div class="handle action-handle">
                      <ha-icon icon="mdi:drag"></ha-icon>
                    </div>
                    ${t?.icon?_`
                      <ha-icon class="action-icon" icon="${t?.icon}" title="Action Icon"></ha-icon>
                    `:_`<span class="action-icon-placeholder"></span>`}
                    <div class="grow-children">
                      <ha-textfield
                        placeholder="(Icon Only)"
                        .value=${t?.name??""}
                        .helper=${this._getActionHelperText(t)}
                        .helperPersistent=${!0}
                        @input=${r=>this._onActionChanged(a,r.target.value)}
                      ></ha-textfield>
                    </div>
                    <div class="action-row-actions">
                      <ha-icon
                        class="icon-button icon-button-compact"
                        icon="mdi:pencil"
                        title="${d("common.edit_action")}"
                        @click=${()=>this._onEditAction(a)}
                      ></ha-icon>
                      ${t?.action!=="sync_selected_entity"&&t?.action!=="select_entity"?_`
                      <ha-icon
                        class="icon-button icon-button-compact icon-button-toggle ${t?.in_menu==="hidden"?"icon-button-disabled":t?.in_menu===!0?"active":""}"
                        icon="${t?.in_menu===!0?"mdi:menu":t?.in_menu==="hidden"?t?.card_trigger&&t.card_trigger!=="none"?"mdi:image-outline":"mdi:eye-off-outline":"mdi:view-grid-outline"}"
                        title="${t?.in_menu==="hidden"?t?.card_trigger&&t.card_trigger!=="none"?d("editor.placements.hidden"):`${d("editor.placements.hidden")} (${d("editor.placements.not_triggerable")})`:t?.in_menu?d("editor.fields.move_to_main"):d("editor.fields.move_to_menu")}"
                        role="button"
                        aria-label="${t?.in_menu===!0?d("editor.fields.move_to_main"):d("editor.fields.move_to_menu")}"
                        @click=${()=>{t?.in_menu!=="hidden"&&this._toggleActionInMenu(a)}}
                      ></ha-icon>
                      `:_`
                      <ha-icon
                        class="icon-button icon-button-compact icon-button-disabled"
                        icon="mdi:eye-off-outline"
                        title="${d(`editor.action_types.${t?.action}`)}"
                      ></ha-icon>
                      `}
                      <ha-icon
                        class="icon-button icon-button-compact"
                        icon="mdi:trash-can"
                        title="${d("editor.fields.delete_action")}"
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
      `}_renderEntityEditor(e){const t=this.hass?.states?.[e?.entity_id],a=this._isGroupCapable(t);return _`
        <div class="entity-editor-header">
          <ha-icon
            class="icon-button"
            icon="mdi:chevron-left"
            title="${d("common.back")}"
            @click=${this._onBackFromEntityEditor}>
          </ha-icon>
          <div class="entity-editor-title">${d("editor.titles.edit_entity")}</div>
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
            label="${d("editor.fields.name")}"
            .value=${e?.name??""}
            @input=${r=>this._updateEntityProperty("name",r.target.value)}
          ></ha-textfield>
        </div>

        <div class="form-row">
          <ha-selector
            .hass=${this.hass}
            .selector=${{select:{mode:"dropdown",multiple:!0,options:[{value:"previous",label:"Previous Track"},{value:"play_pause",label:"Play/Pause"},{value:"stop",label:"Stop"},{value:"next",label:"Next Track"},{value:"shuffle",label:"Shuffle"},{value:"repeat",label:"Repeat"},{value:"favorite",label:"Favorite"},{value:"power",label:"Power"}]}}}
            .value=${Array.isArray(e?.hidden_controls)?e.hidden_controls:[]}
            .required=${!1}
            .invalid=${!1}
            label="${d("editor.fields.hidden_controls")}"
            helper="${d("editor.subtitles.hide_controls")}"
            @value-changed=${r=>this._updateEntityProperty("hidden_controls",r.detail.value)}
          ></ha-selector>
        </div>

 

        <div class="form-row form-row-multi-column">
          <div>
            <ha-switch
              id="ma-template-toggle"
              .checked=${this._useTemplate??this._looksLikeTemplate(e?.music_assistant_entity)}
              @change=${r=>{this._useTemplate=r.target.checked}}
            ></ha-switch>
            <label for="ma-template-toggle">${d("editor.labels.use_ma_template")}</label>
          </div>
        </div>

        ${this._useTemplate??this._looksLikeTemplate(e?.music_assistant_entity)?_`
      <div class="form-row">
        <div class=${this._yamlError&&(e?.music_assistant_entity??"").trim()!==""?"code-editor-wrapper error":"code-editor-wrapper"}>
          <ha-code-editor
            id="ma-template-editor"
            label="${d("editor.fields.ma_template")}"
            .hass=${this.hass}
            mode="jinja2"
            autocomplete-entities
            .value=${e?.music_assistant_entity??""}
            @value-changed=${r=>this._updateEntityProperty("music_assistant_entity",r.detail.value)}
          ></ha-code-editor>
          <div class="help-text">
            <ha-icon icon="mdi:information-outline"></ha-icon>
            ${d("editor.subtitles.jinja_template_hint")}
            <pre style="margin:6px 0; white-space:pre-wrap;">{% if is_state('input_select.kitchen_stream_source','Music Stream 1') %}
  media_player.picore_house
{% else %}
  media_player.ma_wiim_mini
{% endif %}</pre>
           </pre>
          </div>
        </div>
      </div>
    `:_`
      <div class="form-row">
        <ha-generic-picker
          .hass=${this.hass}
          .value=${this._isEntityId(e?.music_assistant_entity)?e.music_assistant_entity:""}
          .label=${d("editor.fields.ma_entity")}
          .valueRenderer=${r=>this._entityValueRenderer(r)}
          .rowRenderer=${r=>this._entityRowRenderer(r)}
          .getItems=${this._getEntityItems(["media_player"])}
          @value-changed=${r=>this._updateEntityProperty("music_assistant_entity",r.detail.value)}
          allow-custom-value
        ></ha-generic-picker>
      </div>
      ${(()=>{const r=e?.entity_id,s=r?this.hass?.states?.[r]:void 0,n=s?_t(s):!1,o=e?.music_assistant_entity,l=this._looksLikeTemplate?.(o),c=typeof o=="string"&&!l?o:void 0,h=c?this.hass?.states?.[c]:void 0,u=h?_t(h):!1;return n||u?_`
          <div class="form-row">
            <ha-selector
              .hass=${this.hass}
              .selector=${{select:{mode:"dropdown",multiple:!0,options:[{value:"artist",label:"Artist"},{value:"album",label:"Album"},{value:"track",label:"Track"},{value:"playlist",label:"Playlist"},{value:"radio",label:"Radio"},{value:"podcast",label:"Podcast"},{value:"episode",label:"Episode"}]}}}
              .value=${Array.isArray(e?.hidden_filter_chips)?e.hidden_filter_chips:[]}
              .required=${!1}
              .invalid=${!1}
              label="${d("editor.fields.hidden_chips")}"
              helper="${d("editor.subtitles.hide_search_chips")}"
              @value-changed=${p=>this._updateEntityProperty("hidden_filter_chips",p.detail.value)}
            ></ha-selector>
          </div>
        `:v})()}
    `}

        <div class="form-row">
          <ha-switch
            id="disable-auto-select-toggle"
            .checked=${e?.disable_auto_select??!1}
            @change=${r=>this._updateEntityProperty("disable_auto_select",r.target.checked)}
          ></ha-switch>
          <label for="disable-auto-select-toggle">${d("editor.labels.disable_auto_select")}</label>
          <div class="config-subtitle">${d("editor.subtitles.disable_auto_select")}</div>
        </div>

        ${a?_`
          <div class="form-row">
            <ha-switch
              id="group-volume-toggle"
              .checked=${e?.group_volume??!0}
              @change=${r=>this._updateEntityProperty("group_volume",r.target.checked)}
            ></ha-switch>
            <label for="group-volume-toggle">Group Volume</label>
          </div>
        `:v}

        <div class="form-row form-row-multi-column">
          <div>
            <ha-switch
              id="follow-active-toggle"
              .checked=${e?.follow_active_volume??!1}
              @change=${r=>this._updateEntityProperty("follow_active_volume",r.target.checked)}
            ></ha-switch>
            <label for="follow-active-toggle">${d("editor.labels.follow_active_entity")}</label>
          </div>
          ${e?.follow_active_volume??!1?v:_`
            <div>
              <ha-switch
                id="vol-template-toggle"
                .checked=${this._useVolTemplate??this._looksLikeTemplate(e?.volume_entity)}
                @change=${r=>{this._useVolTemplate=r.target.checked}}
              ></ha-switch>
              <label for="vol-template-toggle">${d("editor.labels.use_vol_template")}</label>
            </div>
          `}
        </div>

        ${e?.follow_active_volume??!1?v:_`
          ${this._useVolTemplate??this._looksLikeTemplate(e?.volume_entity)?_`
                <div class="form-row">
                  <div class=${this._yamlError&&(e?.volume_entity??"").trim()!==""?"code-editor-wrapper error":"code-editor-wrapper"}>
                    <ha-code-editor
                      id="vol-template-editor"
                      label="${d("editor.fields.vol_template")}"
                      .hass=${this.hass}
                      mode="jinja2"
                      autocomplete-entities
                      .value=${e?.volume_entity??""}
                      @value-changed=${r=>this._updateEntityProperty("volume_entity",r.detail.value)}
                    ></ha-code-editor>
                    <div class="help-text">
                      <ha-icon icon="mdi:information-outline"></ha-icon>
                      ${d("editor.subtitles.jinja_template_vol_hint")}
                      <pre style="margin:6px 0; white-space:pre-wrap;">{% if is_state('input_boolean.tv_volume','on') %}
  remote.soundbar
{% else %}
  media_player.office_homepod
{% endif %}</pre>
                    </div>
                  </div>
                </div>
              `:_`
                <div class="form-row">
                  <ha-generic-picker
                    .hass=${this.hass}
                    .value=${this._isEntityId(e?.volume_entity)?e.volume_entity:e?.entity_id??""}
                    .label=${d("editor.fields.vol_entity")}
                    .valueRenderer=${r=>this._entityValueRenderer(r)}
                    .rowRenderer=${r=>this._entityRowRenderer(r)}
                    .getItems=${this._getEntityItems(["media_player","remote"])}
                    @value-changed=${r=>{const s=r.detail.value;this._updateEntityProperty("volume_entity",s),(!s||s===e.entity_id)&&this._updateEntityProperty("sync_power",!1)}}
                    allow-custom-value
                  ></ha-generic-picker>
                </div>
              `}
        `}

        ${e?.volume_entity&&e.volume_entity!==e.entity_id&&!(e?.follow_active_volume??!1)?_`
              <div class="form-row form-row-multi-column">
                <div>
                  <ha-switch
                    id="sync-power-toggle"
                    .checked=${e?.sync_power??!1}
                    @change=${r=>this._updateEntityProperty("sync_power",r.target.checked)}
                  ></ha-switch>
                  <label for="sync-power-toggle">Sync Power</label>
                </div>
              </div>
            `:v}

        ${e?.follow_active_volume?_`
            <div class="help-text">
              <ha-icon icon="mdi:information-outline"></ha-icon>
              ${d("editor.subtitles.follow_active_entity")}
              <br><br>
            </div>
        `:v}
        </div>
      `}_renderActionEditor(e){const t=this._actionMode??this._deriveActionMode(e);return _`
        <div class="action-editor-header">
          <ha-icon
            class="icon-button"
            icon="mdi:chevron-left"
            @click=${this._onBackFromActionEditor}>
          </ha-icon>
          <div class="action-editor-title">${d("editor.titles.edit_action")}</div>
        </div>

        <div class="form-row">
          <ha-textfield
            class="full-width"
            label="${d("editor.fields.name")}"
            placeholder="(Icon Only)"
            .value=${e?.name??""}
            @input=${a=>this._updateActionProperty("name",a.target.value)}
          ></ha-textfield>
        </div>

        <div class="form-row">
          <ha-icon-picker
            label="${d("editor.fields.icon")}"
            .hass=${this.hass}
            .value=${e?.icon??""}
            @value-changed=${a=>this._updateActionProperty("icon",a.detail.value)}
          ></ha-icon-picker>
        </div>
 
        <div class="form-row form-row-multi-column">
          <div class="grow-children">
            <ha-selector
              .hass=${this.hass}
              label="${d("editor.fields.placement")}"
              .disabled=${t==="sync_selected_entity"||t==="select_entity"}
              .selector=${{select:{mode:"dropdown",options:[{value:"chip",label:d("editor.placements.chip")},{value:"menu",label:d("editor.placements.menu")},{value:"hidden",label:d("editor.placements.hidden")}]}}}
              .value=${e?.in_menu==="hidden"?"hidden":e?.in_menu?"menu":"chip"}
              @value-changed=${a=>{const r=a.detail.value;let s=!1;r==="menu"?s=!0:r==="hidden"&&(s="hidden"),this._updateActionProperty("in_menu",s),r!=="hidden"&&this._updateActionProperty("card_trigger","none")}}
            ></ha-selector>
          </div>
          <div class="grow-children">
            <ha-selector
              .hass=${this.hass}
              label="${d("editor.fields.card_trigger")}"
              .disabled=${t==="sync_selected_entity"||t==="select_entity"||e?.in_menu!=="hidden"}
              .selector=${{select:{mode:"dropdown",options:[{value:"none",label:d("editor.triggers.none")},{value:"tap",label:d("editor.triggers.tap")},{value:"hold",label:d("editor.triggers.hold")},{value:"double_tap",label:d("editor.triggers.double_tap")},{value:"swipe_left",label:d("editor.triggers.swipe_left")},{value:"swipe_right",label:d("editor.triggers.swipe_right")}]}}}
              .value=${e?.card_trigger||"none"}
              @value-changed=${a=>this._updateActionProperty("card_trigger",a.detail.value)}
            ></ha-selector>
          </div>
        </div>
        ${e?.in_menu==="hidden"&&(!e?.card_trigger||e?.card_trigger==="none")&&t!=="sync_selected_entity"&&t!=="select_entity"?_`
          <div class="help-text">
            <ha-icon icon="mdi:alert-circle-outline"></ha-icon>
            ${d("editor.placements.hidden")} (${d("editor.placements.not_triggerable")})
          </div>
        `:v}

        <div class="form-row">
          <ha-selector
            .hass=${this.hass}
            label="${d("editor.fields.action_type")}"
            .selector=${{select:{mode:"dropdown",options:[{value:"menu",label:d("editor.action_types.menu")},{value:"service",label:d("editor.action_types.service")},{value:"navigate",label:d("editor.action_types.navigate")},{value:"sync_selected_entity",label:d("editor.action_types.sync_selected_entity")},{value:"select_entity",label:d("editor.action_types.select_entity")},{value:"prev_entity",label:d("editor.action_types.prev_entity")||"Previous Entity Chip"},{value:"next_entity",label:d("editor.action_types.next_entity")||"Next Entity Chip"},{value:"toggle_lyrics",label:d("editor.action_types.toggle_lyrics")||"Toggle Lyrics Overlay"}]}}}
            .value=${this._actionMode??this._deriveActionMode(e)}
            @value-changed=${a=>{const r=a.detail.value;this._actionMode=r,r==="service"?(this._updateActionProperty("menu_item",void 0),this._updateActionProperty("navigation_path",void 0),this._updateActionProperty("navigation_new_tab",void 0),this._updateActionProperty("action",void 0),this._config.actions?.[this._actionEditorIndex]?.service||this._updateActionProperty("service","")):r==="menu"?(this._updateActionProperty("service",void 0),this._updateActionProperty("service_data",void 0),this._updateActionProperty("script_variable",void 0),this._updateActionProperty("navigation_path",void 0),this._updateActionProperty("navigation_new_tab",void 0),this._updateActionProperty("action",void 0)):r==="navigate"?(this._updateActionProperty("menu_item",void 0),this._updateActionProperty("service",void 0),this._updateActionProperty("service_data",void 0),this._updateActionProperty("script_variable",void 0),this._updateActionProperty("action","navigate"),e?.navigation_path||this._updateActionProperty("navigation_path","")):r==="sync_selected_entity"?(this._updateActionProperty("menu_item",void 0),this._updateActionProperty("service",void 0),this._updateActionProperty("service_data",void 0),this._updateActionProperty("script_variable",void 0),this._updateActionProperty("navigation_path",void 0),this._updateActionProperty("navigation_new_tab",void 0),this._updateActionProperty("action","sync_selected_entity"),this._updateActionProperty("in_menu","hidden"),this._updateActionProperty("card_trigger","none"),e?.sync_entity_type||this._updateActionProperty("sync_entity_type","yamp_entity")):r==="select_entity"?(this._updateActionProperty("menu_item",void 0),this._updateActionProperty("service",void 0),this._updateActionProperty("service_data",void 0),this._updateActionProperty("script_variable",void 0),this._updateActionProperty("navigation_path",void 0),this._updateActionProperty("navigation_new_tab",void 0),this._updateActionProperty("action","select_entity"),this._updateActionProperty("in_menu","hidden"),this._updateActionProperty("card_trigger","none"),e?.sync_entity_type||this._updateActionProperty("sync_entity_type","yamp_entity")):r==="prev_entity"||r==="next_entity"?(this._updateActionProperty("menu_item",void 0),this._updateActionProperty("service",void 0),this._updateActionProperty("service_data",void 0),this._updateActionProperty("script_variable",void 0),this._updateActionProperty("navigation_path",void 0),this._updateActionProperty("navigation_new_tab",void 0),this._updateActionProperty("action",r)):r==="toggle_lyrics"&&(this._updateActionProperty("menu_item",void 0),this._updateActionProperty("service",void 0),this._updateActionProperty("service_data",void 0),this._updateActionProperty("script_variable",void 0),this._updateActionProperty("navigation_path",void 0),this._updateActionProperty("navigation_new_tab",void 0),this._updateActionProperty("action","toggle_lyrics"))}}
          ></ha-selector>
        </div>

        
        ${t==="menu"?_`
          <div class="form-row">
            <ha-selector
              .hass=${this.hass}
              label="${d("editor.fields.menu_item")}"
              .selector=${{select:{mode:"dropdown",options:[{value:"",label:""},{value:"search",label:"Search"},{value:"search-recently-played",label:"Recently Played"},{value:"search-next-up",label:"Next Up"},{value:"source",label:"Source"},{value:"more-info",label:"More Info"},{value:"group-players",label:"Group Players"},{value:"transfer-queue",label:"Transfer Queue"}]}}}
              .value=${e?.menu_item??""}
              @value-changed=${a=>this._updateActionProperty("menu_item",a.detail.value||void 0)}
            ></ha-selector>
          </div>
        `:v} 
        ${t==="navigate"?_`
          <div class="form-row">
            <ha-textfield
              class="full-width"
              label="${d("editor.fields.nav_path")}"
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
        `:v}
        ${t==="sync_selected_entity"||t==="select_entity"?_`
          <div class="form-row">
            <ha-selector
              .hass=${this.hass}
              .selector=${{entity:{domain:"input_text"}}}
              .value=${e?.sync_entity_helper??""}
              label="${d("editor.fields.selected_entity_helper")}"
              @value-changed=${a=>this._updateActionProperty("sync_entity_helper",a.detail.value)}
            ></ha-selector>
            <div class="config-subtitle">${d(t==="select_entity"?"editor.subtitles.select_entity_helper":"editor.subtitles.selected_entity_helper")}</div>
          </div>
          <div class="form-row">
            <ha-selector
              .hass=${this.hass}
              label="${d("editor.fields.sync_entity_type")}"
              .selector=${{select:{mode:"dropdown",options:[{value:"yamp_entity",label:d("editor.sync_entity_options.yamp_entity")},{value:"yamp_main_entity",label:d("editor.sync_entity_options.yamp_main_entity")},{value:"yamp_playback_entity",label:d("editor.sync_entity_options.yamp_playback_entity")}]}}}
              .value=${e?.sync_entity_type??"yamp_entity"}
              @value-changed=${a=>this._updateActionProperty("sync_entity_type",a.detail.value)}
            ></ha-selector>
            <div class="config-subtitle">${d("editor.subtitles.sync_entity_type")}</div>
          </div>
        `:v}
        ${t==="service"?_`
          <div class="form-row">
            <ha-selector
              .hass=${this.hass}
              .selector=${{select:{mode:"dropdown",filterable:!0,options:this._serviceItems||[]}}}
              .value=${e.service??""}
              label="${d("editor.fields.service")}"
              .required=${!0}
              @value-changed=${a=>this._updateActionProperty("service",a.detail.value)}
            ></ha-selector>
          </div>

          ${typeof e.service=="string"&&e.service.startsWith("script.")?_`
            <div class="form-row form-row-multi-column">
              <div>
                <ha-switch
                  id="script-variable-toggle"
                  .checked=${e?.script_variable??!1}
                  @change=${a=>this._updateActionProperty("script_variable",a.target.checked)}
                ></ha-switch>
                <span>${d("editor.labels.script_var")}</span>
              </div>
            </div>
          `:v}

          ${typeof e.service=="string"?_`
            <div class="help-text">
              <ha-icon
                icon="mdi:information-outline"
              ></ha-icon>

              ${d("editor.subtitles.entity_current_hint")}

            </div>
            <div class="help-text">
              <ha-icon
                icon="mdi:information-outline"
              ></ha-icon>
            ${d("editor.subtitles.service_data_note")}
            </div>
            <div class="form-row">
              <div class="service-data-editor-header">
                <div class="service-data-editor-title">${d("editor.titles.service_data")}</div>
                <div class="service-data-editor-actions">
                  <ha-icon
                    class="icon-button ${this._yamlModified?"":"icon-button-disabled"}"
                    icon="mdi:content-save"
                    title="${d("editor.fields.save_service_data")}"
                    @click=${this._saveYamlEditor}
                  ></ha-icon>
                  <ha-icon
                    class="icon-button ${this._yamlModified?"":"icon-button-disabled"}"
                    icon="mdi:backup-restore"
                    title="${d("editor.fields.revert_service_data")}"
                    @click=${this._revertYamlEditor}
                  ></ha-icon>
                  <ha-icon
                    class="icon-button ${this._yamlError||this._yamlDraftUsesCurrentEntity()||!e?.service?"icon-button-disabled":""}"
                    icon="mdi:play-circle-outline"
                    title="${d("editor.fields.test_action")}"
                    @click=${this._testServiceCall}
                  ></ha-icon>
              
                </div>
            </div>
            <div class=${this._yamlError&&this._yamlDraft.trim()!==""?"code-editor-wrapper error":"code-editor-wrapper"}>
              <ha-code-editor
                id="service-data-editor"
                label="${d("editor.fields.service_data")}"
                autocomplete-entities
                autocomplete-icons
                .hass=${this.hass}
                mode="yaml"
                .value=${e?.service_data?xt.dump(e.service_data):""}
                @value-changed=${a=>{this._yamlDraft=a.detail.value,this._yamlModified=!0;try{const r=xt.load(this._yamlDraft);r&&typeof r=="object"?this._yamlError=null:this._yamlError="Invalid YAML"}catch(r){this._yamlError=r.message}}}
              ></ha-code-editor>
              ${this._yamlError&&this._yamlDraft.trim()!==""?_`<div class="yaml-error-message">${this._yamlError}</div>`:v}
            </div>
          `:v}
        `:v}
      </div>`}_onEntityChanged(e,t){const a=[...this._config.entities??[]];t?a[e]={...a[e],entity_id:t}:a.splice(e,1);const r=a.filter(s=>s.entity_id&&s.entity_id.trim()!=="");this._updateConfig("entities",r)}_onActionChanged(e,t){const a=[...this._config.actions??[]];a[e]={...a[e],name:t},this._updateConfig("actions",a)}_getActionHelperText(e){const t=e?.in_menu,a=t==="hidden"?"hidden":t===!0?"menu":"chip",r=e?.card_trigger;let s="";a==="menu"?s=" \u2022 In Menu":a==="hidden"&&e?.action!=="sync_selected_entity"&&e?.action!=="select_entity"&&(!r||r==="none"?s=` \u2022 ${d("editor.placements.hidden")} (${d("editor.placements.not_triggerable")})`:s=` \u2022 ${d("editor.placements.hidden")}`);let n="";if(r&&r!=="none"&&(n=` \u2022 Trigger: ${d(`editor.triggers.${r}`)}`),e?.action==="select_entity")return`${d("editor.action_helpers.select_entity")} ${e.sync_entity_helper||d("editor.action_helpers.select_helper")}${s}${n}`;if(e?.action==="sync_selected_entity")return`${d("editor.action_helpers.sync_selected_entity")} ${e.sync_entity_helper||d("editor.action_helpers.select_helper")}${s}${n}`;if(e?.action==="prev_entity")return`${d("editor.action_types.prev_entity")||"Previous Entity Chip"}${s}${n}`;if(e?.action==="next_entity")return`${d("editor.action_types.next_entity")||"Next Entity Chip"}${s}${n}`;if(e?.menu_item)return`Open Menu Item: ${e.menu_item}${s}${n}`;if(e?.service)return`Call Service: ${e.service}${s}${n}`;if(e?.navigation_path||e?.action==="navigate"){const o=e?.navigation_new_tab?" (New Tab)":"";return`Navigate to ${e.navigation_path||"(missing path)"}${o}${s}${n}`}return s||n?`Not Configured${s}${n}`:"Not Configured"}_onEditEntity(e){this._entityEditorIndex=e;const t=this._config.entities?.[e],a=t?.music_assistant_entity;this._useTemplate=!!this._looksLikeTemplate(a);const r=t?.volume_entity;this._useVolTemplate=!!this._looksLikeTemplate(r)}_onEditAction(e){this._actionEditorIndex=e;const t=this._config.actions?.[e];this._actionMode=this._deriveActionMode(t),this._actionMode==="service"&&typeof t?.service!="string"&&this._updateActionProperty("service","")}_onBackFromEntityEditor(){this._entityEditorIndex=null,this._useTemplate=null,this._useVolTemplate=null}_onBackFromActionEditor(){this._actionEditorIndex=null,this._actionMode=null}_onEntityMoved(e){const{oldIndex:t,newIndex:a}=e.detail,r=[...this._config.entities];if(t>=r.length||a>=r.length)return;const[s]=r.splice(t,1);r.splice(a,0,s),this._updateConfig("entities",r)}_onActionMoved(e){const{oldIndex:t,newIndex:a}=e.detail,r=[...this._config.actions];if(t>=r.length||a>=r.length)return;const[s]=r.splice(t,1);r.splice(a,0,s),this._updateConfig("actions",r)}_removeAction(e){const t=[...this._config.actions??[]];e<0||e>=t.length||(t.splice(e,1),this._updateConfig("actions",t))}_toggleActionInMenu(e){const t=[...this._config.actions??[]];if(!t[e])return;const a=!!t[e].in_menu,r={...t[e],in_menu:!a};delete r.placement,t[e]=r,this._updateConfig("actions",t)}_saveYamlEditor(){try{const e=xt.load(this._yamlDraft);if(!e||typeof e!="object"){this._yamlError="YAML is not a valid object.";return}this._updateActionProperty("service_data",e),this._yamlDraft=xt.dump(e),this._yamlError=null,this._parsedYaml=e}catch(e){this._yamlError=e.message}}_revertYamlEditor(){const e=this.shadowRoot.querySelector("#service-data-editor"),t=this._config.actions?.[this._actionEditorIndex];if(!e||!t)return;const a=t.service_data?xt.dump(t.service_data):"";e.value=a,this._yamlDraft=a,this._yamlError=null,this._yamlModified=!1}_yamlDraftUsesCurrentEntity(){return this._yamlDraft?/^\s*entity_id\s*:\s*current\s*$/m.test(this._yamlDraft):!1}async _testServiceCall(){if(this._yamlError||!this._yamlDraft?.trim())return;let e;try{if(e=xt.load(this._yamlDraft),typeof e!="object"||e===null){console.error("yamp: Service data must be a valid object.");return}}catch(s){this._yamlError=s.message;return}const t=this._config.actions?.[this._actionEditorIndex]?.service;if(!t||!this.hass)return;const[a,r]=t.split(".");if(!(!a||!r))try{await this.hass.callService(a,r,e)}catch(s){console.error("yamp: Failed to call service:",s)}}_onToggleChanged(e){const t={...this._config,always_collapsed:e.target.checked};this._config=t,this.dispatchEvent(new CustomEvent("config-changed",{detail:{config:t}}))}_looksLikeUrlOrPath(e){return e?e.startsWith("http://")||e.startsWith("https://")||e.startsWith("/")||e.includes(".jpg")||e.includes(".jpeg")||e.includes(".png")||e.includes(".gif")||e.includes(".webp"):!1}}customElements.define("yet-another-media-player-editor",Qd);var Wd=Object.defineProperty,Yd=(i,e,t)=>e in i?Wd(i,e,{enumerable:!0,configurable:!0,writable:!0,value:t}):i[e]=t,ze=(i,e,t)=>Yd(i,typeof e!="symbol"?e+"":e,t);const Zd=500,mn=3e3,Kd=30,fn=Object.freeze(["details","menu","action_chips"]),Xd=Object.freeze([...fn]),Jd=Object.freeze({details:"--yamp-text-scale-details",menu:"--yamp-text-scale-menu",action_chips:"--yamp-text-scale-action-chips"}),yn=Object.freeze(["media_title","media_artist","media_album_name","media_content_id","media_channel","app_name","media_content_type","entity_id","entity_state"]),vn=500,It=15,gn=300,eu=500,tu=300,bn=50;window.customCards=window.customCards||[],window.customCards.push({type:"yet-another-media-player",name:"Yet Another Media Player",description:"YAMP is a multi-entity media card with custom actions",preview:!0});class qa extends Ge{constructor(){super(),ze(this,"_lastChipDoubleTapTime",0),ze(this,"_hoveredSourceLetterIndex",null),ze(this,"_lastGroupingMasterId",null),ze(this,"_groupedSortedCache",null),ze(this,"_cardTriggers",{tap:null,hold:null,double_tap:null,swipe_left:null,swipe_right:null}),ze(this,"_lastHassVersion",null),ze(this,"_debouncedVolumeTimer",null),this._selectedIndex=0,this._lastSyncedEntityId=null,this._lastPlaying=null,this._manualSelect=!1,this._lastActiveEntityId=null,this._playTimestamps={},this._lastMediaTitle=null,this._showSourceMenu=!1,this._shouldDropdownOpenUp=!1,this._collapsedArtDominantColor="#444",this._lastArtworkUrl=null,this._addToPlaylistTarget=null,this._progressTimer=null,this._progressValue=null,this._lastProgressEntityId=null,this._pinnedIndex=null,this._sourceDropdownOutsideHandler=null,this._isIdle=!1,this._idleTimeout=null,this._showEntityOptions=!1,this._showMediaTitleOptions=!1,this._dismissMenuAfterPlaylistAdd=!1,this._showGrouping=!1,this._showSourceList=!1,this._showTransferQueue=!1,this._transferQueuePendingTarget=null,this._transferQueueStatus=null,this._hasTransferQueueForCurrent=!1,this._transferQueueAutoCloseTimer=null,this._alternateProgressBar=!1,this._groupBaseVolume=null,this._searchQuery="",this._searchLoading=!1,this._searchResults=[],this._searchDisplaySortOverride=null,this._searchError="",this._searchTotalRows=15,this._searchResultsByType={},this._currentSearchQuery="",this._latestSearchToken=0,this._latestManualShiftTime=0,this._searchTimeoutHandle=null,this._swapPauseForStop=!1,this._controlLayout="classic",this._searchHierarchy=[],this._searchBreadcrumb="",this._playbackLingerByIdx={},this._lastResolvedEntityIdByChip={},this._showSearchInSheet=!1,this._showResolvedEntities=!1,this._showQueueSuccessMessage=!1,this._searchActiveOptionsItem=null,this._activeSearchRowMenuId=null,this._loadingSearchRowMenuId=null,this._errorSearchRowMenuId=null,this._successSearchRowMenuId=null,this._successSearchRowType=null,this._favoritesFilterActive=!1,this._recentlyPlayedFilterActive=!1,this._upcomingFilterActive=!1,this._recommendationsFilterActive=!1,this._radioModeActive=!1,this._massQueueAvailable=!1,this._hasMassQueueIntegration=null,this._checkingMassQueueIntegration=!1,this._lyricsCache=new Map,this._quickMenuInvoke=!1,this._collapsedBaselineHeight=220,this._lastRenderedCollapsed=!1,this._lastRenderedHideControls=!1,this._artworkObjectFit="cover",this._idleScreen="default",this._idleScreenApplied=!1,this._hasSeenPlayback=!1,this._adaptiveText=!1,this._textResizeObserver=null,this._currentTextScale=null,this._adaptiveTextTargets=new Set,this._idleImageTemplate=null,this._idleImageTemplateResult="",this._resolvingIdleImageTemplate=!1,this._idleImageTemplateNeedsResolve=!1,this._artworkOverrideTemplateCache={},this._artworkOverrideIndexMap=null,this._hideActiveEntityLabel=!1,this._currentDetailsScale=null,this._lastTitleLength=0,this._massLyrics=[],this._lastLyricsTrackId=null,this._lastLyricsArtist=null,this._lastLyricsTitle=null,this._lastLyricsEntityId=null,this._lyricsActive=!1,this._fetchingLyrics=!1,this._fetchingCacheKey=null,this._lyricsError=!1,this._suspendAdaptiveScaling=!1,this._pendingAdaptiveScaleUpdate=!1,this._adaptiveScrollTimer=null,this._lyricsFetchTimeout=null,this._handleGlobalScroll=this._handleGlobalScroll.bind(this),this._handleViewportResize=this._handleViewportResize.bind(this),this._isNarrowViewport=!1,setTimeout(()=>{if(this._cardType==="search"){this._showEntityOptions=!0,this._isIdle=!1,this._showSearchSheetInOptions(),this.requestUpdate();return}if(this._cardType==="group_players"){this._showEntityOptions=!0,this._isIdle=!1,this._showGrouping=!0,this.requestUpdate();return}if(this.hass&&this.entityIds&&this.entityIds.length>0){const e=this.hass.states[this.entityIds[this._selectedIndex]],t=this._playbackLingerByIdx?.[this._selectedIndex]&&this._playbackLingerByIdx[this._selectedIndex].until>Date.now(),a=this._isEntityPlaying(e);e&&!a&&!t&&this._idleTimeoutMs>0&&(this._isIdle=!0,this.requestUpdate())}},0),this._prevCollapsed=null,this._searchAttempted=!1,this._searchMediaClassFilter="all",this._lastSearchChipClasses="",this._swipeStartX=null,this._searchSwipeAttached=!1,this._manualSelectPlayingSet=null,this._idleTimeoutMs=6e4,this._volumeStep=.05,this._searchInputAutoFocused=!1,this._disableSearchAutofocus=!1,this._optimisticPlayback=null,this._lastPlaybackEntityId=null,this._entitySwitchDebounceTimer=null,this._lastMainState=null,this._lastMaState=null,this._maResolveCache={},this._maResolveTtlMs=7e3,this._manualSelectTimeout=null,this._templateSubscriptions={},this._maTemplateValues={},this._volTemplateValues={},this._volResolveCache={},this._volResolveTtlMs=7e3,this._lastPlayingEntityId=null,this._controlFocusEntityId=null,this._lastActiveEntityIdByChip={},this._playerStateCache={}}_handleChipPointerDown(e,t){this._chipGestureStartX=e.clientX,this._chipGestureStartY=e.clientY,this._holdToPin&&this._holdHandler&&this._holdHandler.pointerDown(e,t)}_applyIdleScreen(){if(!this._idleScreenApplied){switch(this._idleScreen||"default"){case"search":this._showEntityOptions=!0,this._showGrouping=!1,this._showSourceList=!1,this._showTransferQueue=!1,this._showResolvedEntities=!1,this._showSearchSheetInOptions("default");break;case"search-recently-played":this._showEntityOptions=!0,this._showGrouping=!1,this._showSourceList=!1,this._showTransferQueue=!1,this._showResolvedEntities=!1,this._showSearchSheetInOptions("recently-played");break;case"search-next-up":this._showEntityOptions=!0,this._showGrouping=!1,this._showSourceList=!1,this._showTransferQueue=!1,this._showResolvedEntities=!1,this._showSearchSheetInOptions("next-up");break;default:return}this._idleScreenApplied=!0}}_getSearchDismissBehavior(){const e=this.config.dismiss_search_on_play!==!1,t=this._cardType==="search";return{shouldDismiss:!t&&e,shouldReset:t&&e}}_resetIdleScreen(){if(!this._idleScreenApplied)return;const{shouldDismiss:e,shouldReset:t}=this._getSearchDismissBehavior();switch(this._idleScreen){case"search":case"search-recently-played":case"search-next-up":if(e)this._hideSearchSheetInOptions(),this._showEntityOptions=!1;else if(t)this._showSearchSheetInOptions();else{this._idleScreenApplied=!1;return}break}this._idleScreenApplied=!1,this.requestUpdate()}_handleChipPointerMove(e,t){this._holdToPin&&this._holdHandler&&this._holdHandler.pointerMove(e,t)}_handleChipPointerUp(e,t){if(this._holdToPin&&this._holdHandler&&this._holdHandler.pointerUp(e,t),e.pointerType!=="touch"&&e.pointerType!=="pen"||e.type!=="pointerup")return;const a=e.clientX-this._chipGestureStartX,r=e.clientY-this._chipGestureStartY,s=Math.abs(a),n=Math.abs(r);if(s>It||n>It)return;const o=Date.now(),l=o-(this._lastChipTapTime||0);this._lastChipTapTime=o,l<gn&&this._lastChipTapIdx===t&&(this._lastChipTapTime=0,this._lastChipDoubleTapTime=o,this._quickGroupingMode=!this._quickGroupingMode,this.requestUpdate()),this._lastChipTapIdx=t}_supportsFeature(e,t){return!e||typeof e.attributes.supported_features!="number"?!1:(e.attributes.supported_features&t)!==0}_isGroupCapable(e){return!e||e.attributes?.mass_player_type==="group"?!1:this._supportsFeature(e,Bs)?!0:Array.isArray(e.attributes?.group_members)}_isCurrentlyGrouped(e){return this._isGroupCapable(e)?Array.isArray(e?.attributes?.group_members)&&e.attributes.group_members.length>1:!1}_findAssociatedButtonEntities(e){return Po(this.hass,e)}_cleanTrackMetadata(e){return!e||typeof e!="string"?"":e.split(" - ")[0].replace(/\(feat\..*?\)/gi,"").replace(/\(with.*?\)/gi,"").replace(/\[.*?\]/g,"").replace(/\(.*?\)/g,"").replace(/- \d{4} Remaster.*/gi,"").replace(/- Remastered.*/gi,"").replace(/- Single.*/gi,"").trim()}_getFavoriteButtonEntity(){if(!this.entityObjs[this._selectedIndex])return null;const e=this._getActivePlaybackEntityId(this._selectedIndex);if(!e)return null;const t=this.hass?.states?.[e];return!t||!_t(t)?null:this._findAssociatedButtonEntities(e).find(a=>a.friendly_name.toLowerCase().includes("favorite")||a.friendly_name.toLowerCase().includes("like")||a.device_class==="favorite"||a.entity_id.toLowerCase().includes("favorite"))?.entity_id||null}_getMusicAssistantState(){const e=this._getActivePlaybackEntityId(this._selectedIndex);return e?Fo(this.hass,e):null}_isCurrentTrackFavorited(){if(!this.entityObjs[this._selectedIndex])return!1;const e=this._getMusicAssistantState();if(!e)return!1;const t=e.attributes?.media_content_id;if(!t)return!1;if(typeof e.attributes?.is_favorite=="boolean")return e.attributes.is_favorite;if(this._favoriteStatusCache&&this._favoriteStatusCache[t]!==void 0){const a=this._favoriteStatusCache[t];if(typeof a=="object"&&a.isFavorited!==void 0)return a.isFavorited;if(typeof a=="boolean")return a}return(!this._checkingFavorites||this._checkingFavorites!==t)&&(this._checkingFavorites=t,this._checkFavoriteStatusAsync(t)),!1}async _checkFavoriteStatusAsync(e){if(!(!e||!this.hass))try{const t=this._getMusicAssistantState(),a=t?.entity_id,r=t.attributes?.media_title,s=t.attributes?.media_artist,n=await Zo(this.hass,e,a,r,s,200);this._favoriteStatusCache||(this._favoriteStatusCache={}),this._favoriteStatusCache[e]={isFavorited:n},this._checkingFavorites=null,this.requestUpdate()}catch{this._checkingFavorites=null}}connectedCallback(){super.connectedCallback(),window.addEventListener("scroll",this._handleGlobalScroll,{passive:!0}),window.addEventListener("resize",this._handleViewportResize,{passive:!0}),this._updateViewportFlags(),this._updateAdaptiveTextObserverState()}_scrollToSourceLetter(e){const t=this.renderRoot.querySelector(".entity-options-sheet");if(!t)return;const a=Array.from(t.querySelectorAll(".entity-options-item")).find(r=>(r.textContent||"").trim().toUpperCase().startsWith(e));a&&a.scrollIntoView({behavior:"smooth",block:"center"})}_shouldShowStopButton(e){if(!this._supportsFeature(e,vd))return!1;const t=this.renderRoot?.querySelector(".controls-row");if(!t)return!0;const a=t.offsetWidth>480,r=!!this._getFavoriteButtonEntity()&&!this._getHiddenControlsForCurrentEntity().favorite,s=aa(e,(n,o)=>this._supportsFeature(n,o),r,this._getHiddenControlsForCurrentEntity(),!0,this._controlLayout);return a||s<=5}_isAutoSelectDisabled(e){const t=this.config.entities[e];return typeof t=="string"?!1:!!t.disable_auto_select}get sortedEntityIds(){return this.entityIds.map((e,t)=>{const a=this._isAutoSelectDisabled(t)?0:this._playTimestamps[e]||0;return{id:e,idx:t,ts:a}}).sort((e,t)=>e.ts===t.ts?e.idx-t.idx:t.ts-e.ts).map(e=>e.id)}get groupedSortedEntityIds(){const e=this.entityIds;if(!e||!Array.isArray(e))return[];if(this._groupedSortedCache&&this.hass===this._lastHassVersion)return this._groupedSortedCache;const t=new Set(e),a={};for(let s=0;s<e.length;s++){const n=e[s];let o=this._getGroupKey(n);(this._quickGroupingMode||!t.has(o))&&(o=n),a[o]||(a[o]={ids:[],ts:0,minIdx:s}),a[o].ids.push(n);const l=this._isAutoSelectDisabled(s)?0:this._playTimestamps[n]||0;a[o].ts=Math.max(a[o].ts,l)}const r=Object.values(a).sort((s,n)=>n.ts===s.ts?s.minIdx-n.minIdx:n.ts-s.ts).map(s=>s.ids.sort());return this._groupedSortedCache=r,this._lastHassVersion=this.hass,r}get _cardType(){return this.config?.card_type||"default"}get _isSpecializedCard(){return this._cardType!=="default"}_subscribeToTemplate(e,t,a){if(!this.hass||!this.hass.connection)return;const r=`${e}_${t}`,s=t==="ma"?this._maTemplateValues[e]:this._volTemplateValues[e];if(this._templateSubscriptions[r]&&s?.template===a)return;this._unsubscribeFromTemplate(e,t);const n=t==="ma"?this._maTemplateValues:this._volTemplateValues;n[e]={template:a,resolved:null};try{this.hass.connection.subscribeMessage(o=>{const l=(o.result||"").toString().trim(),c=l&&/^([a-z0-9_]+)\.[a-zA-Z0-9_]+$/.test(l);let h=!1;n[e]&&(n[e].resolved=c?l:null);const u=t==="ma"?this._maResolveCache:this._volResolveCache,p=u[e]?.id;c&&p!==l&&(u[e]={id:l,ts:Date.now()},h=!0),h&&this.requestUpdate()},{type:"render_template",template:a}).then(o=>{this._templateSubscriptions[r]=o})}catch(o){console.warn("yamp: failed to subscribe to template:",o)}}_unsubscribeFromTemplate(e,t){const a=`${e}_${t}`;if(this._templateSubscriptions[a]){try{this._templateSubscriptions[a]()}catch{}delete this._templateSubscriptions[a]}}async _ensureResolvedMaForIndex(e){const t=this.entityObjs?.[e];if(!t)return;const a=t.music_assistant_entity;if(!a||typeof a!="string"){delete this._maResolveCache[e],this._unsubscribeFromTemplate(e,"ma"),this._maTemplateValues[e]&&delete this._maTemplateValues[e];return}const r=a.includes("{{")||a.includes("{%"),s=Date.now();if(!r){this._unsubscribeFromTemplate(e,"ma"),this._maTemplateValues[e]&&delete this._maTemplateValues[e],this._maResolveCache[e]={id:a,ts:s};return}this._subscribeToTemplate(e,"ma",a)}async _ensureResolvedVolForIndex(e){const t=this.entityObjs?.[e];if(!t)return;if(t.follow_active_volume){delete this._volResolveCache[e],this._unsubscribeFromTemplate(e,"vol"),this._volTemplateValues[e]&&delete this._volTemplateValues[e];return}const a=t.volume_entity;if(!a||typeof a!="string"){delete this._volResolveCache[e],this._unsubscribeFromTemplate(e,"vol"),this._volTemplateValues[e]&&delete this._volTemplateValues[e];return}const r=a.includes("{{")||a.includes("{%"),s=Date.now();if(!r){this._unsubscribeFromTemplate(e,"vol"),this._volTemplateValues[e]&&delete this._volTemplateValues[e],this._volResolveCache[e]={id:a,ts:s};return}this._subscribeToTemplate(e,"vol",a)}_getResolvedPlaybackEntityIdSync(e){return this._getEntityForPurpose(e,"playback_control")}_getResolvedVolumeEntityIdSync(e){const t=this.entityObjs[e];if(!t)return null;if(t.follow_active_volume)return this._getActivePlaybackEntityId();const a=this._volResolveCache?.[e]?.id;if(a&&typeof a=="string")return a;const r=t.volume_entity;return r&&typeof r=="string"&&!(r.includes("{{")||r.includes("{%"))?r:t.entity_id}_getActualResolvedMaEntityForState(e){const t=this.entityObjs[e];if(!t)return null;const a=this._maResolveCache?.[e]?.id;if(a&&typeof a=="string")return a;const r=t.music_assistant_entity;return r&&typeof r=="string"&&!r.includes("{{")&&!r.includes("{%")?r:t.entity_id}_isEntityPlaying(e){if(!e)return!1;const t=e.state?.toLowerCase();return t==="playing"||t==="buffering"}_isCurrentEntityPlaying(){const e=this.currentEntityId,t=this._getActualResolvedMaEntityForState(this._selectedIndex),a=e?this.hass?.states?.[e]:null,r=t?this.hass?.states?.[t]:null;return this._isEntityPlaying(a)||this._isEntityPlaying(r)}async _resolveTemplateAtActionTime(e,t){return Co(this.hass,e,t)}_attachSearchSwipe(){if(this._searchSwipeAttached)return;const e=this.renderRoot.querySelector(".entity-options-search-results");if(!e||this._searchHierarchy.length>0)return;this._searchSwipeAttached=!0;const t=40,a=s=>{s.touches.length===1&&(this._swipeStartX=s.touches[0].clientX)},r=s=>{if(this._swipeStartX===null)return;const n=s.changedTouches&&s.changedTouches[0].clientX||null;if(n===null){this._swipeStartX=null;return}const o=n-this._swipeStartX;if(Math.abs(o)>t){const l=new Set;Object.values(this._searchResultsByType).forEach(g=>{g.forEach(x=>{x.media_class&&l.add(x.media_class)})});const c=this.entityObjs?.[this._selectedIndex]||null,h=new Set(c?.hidden_filter_chips||[]),u=["all",...Array.from(l).filter(g=>!h.has(g))],p=u.indexOf(this._searchMediaClassFilter||"all"),m=o<0?1:-1;let f=(p+m+u.length)%u.length;const y=u[f];this._doSearch(y==="all"?null:y)}this._swipeStartX=null};e.addEventListener("touchstart",a,{passive:!0}),e.addEventListener("touchend",r,{passive:!0}),e._searchSwipeHandlers={touchstart:a,touchend:r}}_getMockItemFromCurrentTrack(){const e=this.currentActivePlaybackStateObj||this.currentPlaybackStateObj||this.currentStateObj;return!e||!e.attributes||!e.attributes.media_title?null:{title:e.attributes.media_title,media_title:e.attributes.media_title,media_content_id:e.attributes.media_content_id||e.attributes.media_title,media_artist:e.attributes.media_artist||"",media_content_type:"track",media_type:"track"}}_isCurrentlyPlayingRadio(){const e=this.currentActivePlaybackStateObj||this.currentPlaybackStateObj||this.currentStateObj;if(!e?.attributes)return!1;const t=(e.attributes.media_content_type||"").toLowerCase(),a=(e.attributes.media_content_id||"").toLowerCase();return t==="radio"||a.startsWith("library://radio/")}_handlePlaySimilar(){const e=this._getMockItemFromCurrentTrack();e&&(this._showMediaTitleOptions=!1,this._radioModeActive=!0,this._playMediaFromSearch(e))}async _handleAddCurrentToPlaylist(){const e=this._getMockItemFromCurrentTrack();if(e){if(this._showMediaTitleOptions=!1,this._showEntityOptions=!0,this._showSearchInSheet=!0,this._dismissMenuAfterPlaylistAdd=!0,this._isCurrentlyPlayingRadio()){const t=e.title;this._addToPlaylistTarget=null,this._searchHierarchy.push({type:"select_track_for_playlist",name:d("search.select_track_for_playlist",{"{track}":e.title,"{artist}":e.media_artist}),query:this._searchQuery,filter:this._searchMediaClassFilter}),this._searchBreadcrumb=d("search.select_track_for_playlist",{"{track}":e.title,"{artist}":e.media_artist}),this._searchQuery=t,this._currentSearchQuery=t,this._searchMediaClassFilter="track",this._resetSearchContext(),this._removeSearchSwipeHandlers(),await this._doSearch("track",{clearFilters:!0,artist:e.media_artist});return}this._performSearchOptionAction(e,"add_to_playlist")}}_searchArtistFromNowPlaying(){const e=(this.currentActivePlaybackStateObj||this.currentPlaybackStateObj||this.currentStateObj)?.attributes?.media_artist||"";e&&(this._showEntityOptions=!0,this._showSearchInSheet=!0,this._searchInputAutoFocused=!1,this._searchQuery=e,this._searchError="",this._searchAttempted=!1,this._searchLoading=!1,this._searchResultsByType={},this._currentSearchQuery=e,this._searchHierarchy=[],this._searchBreadcrumb="",this._favoritesFilterActive=!1,this._recentlyPlayedFilterActive=!1,this._upcomingFilterActive=!1,this._recommendationsFilterActive=!1,this._initialFavoritesLoaded=!1,this.requestUpdate(),this._doSearch().catch(t=>{console.error("yamp: artist quick-search failed:",t)}))}_showSearchSheetInOptions(e="default"){if(this._showSearchInSheet=!0,this._searchInputAutoFocused=!1,this._searchError="",this._searchResults=[],this._searchQuery="",this._searchAttempted=!1,this._searchResultsByType={},this._currentSearchQuery="",this._searchHierarchy=[],this._searchBreadcrumb="",this._usingMusicAssistant=!1,this._favoritesFilterActive=this.config.default_search_favorites===!0,this._recentlyPlayedFilterActive=!1,this._upcomingFilterActive=!1,this._recommendationsFilterActive=!1,this._initialFavoritesLoaded=!1,this.requestUpdate(),setTimeout(()=>{let t;switch(e){case"recently-played":t=this._toggleRecentlyPlayedFilter(!0);break;case"next-up":t=this._toggleUpcomingFilter(!0);break;case"recommendations":t=this._toggleRecommendationsFilter(!0);break;default:{const a=this.config.default_search_filter==="all"?null:this.config.default_search_filter;t=this._doSearch(a)}break}t?.catch&&t.catch(a=>{console.error("yamp: search initialization failed:",a)})},100),!this._disableSearchAutofocus){const t=this._alwaysCollapsed&&this._expandOnSearch?300:200;setTimeout(()=>{const a=this.renderRoot.querySelector("#search-input-box");a?a.focus():setTimeout(()=>{const r=this.renderRoot.querySelector("#search-input-box");r&&r.focus()},200)},t)}}_openQuickSearchOverlay(e="default"){this._quickMenuInvoke=!0,this._showEntityOptions=!0,this._showSearchSheetInOptions(e),setTimeout(()=>{this._notifyResize()},0)}_handleNavigate(e,t=!1){if(typeof e!="string"||!e.trim())return;const a=e.trim(),r=new CustomEvent("hass-navigate",{detail:{path:a},bubbles:!0,composed:!0});if(this.dispatchEvent(r),r.defaultPrevented)return;let s=!1;if(a.startsWith("#"))window.location.hash=a,s=!0;else if(/^https?:\/\//i.test(a)){if(t){window.open(a,"_blank","noopener,noreferrer");return}window.location.assign(a),s=!0}else this.hass?.navigate?(this.hass.navigate(a),s=!0):(window.history.pushState(null,"",a),s=!0);s&&window.dispatchEvent(new CustomEvent("location-changed",{detail:{replace:!1}}))}_hideSearchSheetInOptions(){this._cardType!=="search"&&(this._showSearchInSheet=!1,this._searchError="",this._searchResults=[],this._searchQuery="",this._searchDisplaySortOverride=null,this._searchInputAutoFocused=!1,this._searchLoading=!1,this._searchAttempted=!1,this._searchResultsByType={},this._currentSearchQuery="",this._searchHierarchy=[],this._searchBreadcrumb="",this._addToPlaylistTarget=null,this._dismissMenuAfterPlaylistAdd=!1,this._recommendationsFilterActive=!1,this._quickMenuInvoke&&(this._showEntityOptions=!1,this._quickMenuInvoke=!1),this.requestUpdate(),setTimeout(()=>{this._notifyResize()},0))}_closeMenuIfOpen(){this._queueActionsMenuOpenId&&this._closeQueueActionsMenu()}_sortSearchResults(e,t=null){if(this._upcomingFilterActive||this._recentlyPlayedFilterActive||this._recommendationsFilterActive)return Array.isArray(e)?[...e]:[];const a=t??this._getConfiguredSearchResultsSortMode(),r=Array.isArray(e)?[...e]:[];if(a==="random"){for(let s=r.length-1;s>0;s--){const n=Math.floor(Math.random()*(s+1));[r[s],r[n]]=[r[n],r[s]]}return r}return r}_getConfiguredSearchResultsSortMode(){const e=this.config?.search_results_sort,t=typeof e=="string"?e:"default";return this._mapLegacySortOption(t)}_mapLegacySortOption(e){return e?{title_asc:"name",title_desc:"name_desc",artist_asc:"artist_name",artist_desc:"artist_name_desc"}[e]||e:"default"}_isSortableSearchMode(e){return!(!e||e==="default"||e==="random"||e==="random_play_count")}_getOppositeSearchSortMode(e){return!e||e==="default"||e==="random"||e==="random_play_count"?null:e.endsWith("_desc")?e.replace(/_desc$/,""):`${e}_desc`}_shouldShowSearchSortToggle(){return this._upcomingFilterActive||this._recentlyPlayedFilterActive||this._recommendationsFilterActive?!1:this._isSortableSearchMode(this._getConfiguredSearchResultsSortMode())}_toggleSearchResultsSortDirection(){if(!this._shouldShowSearchSortToggle()){this._searchDisplaySortOverride=null;return}const e=this._getConfiguredSearchResultsSortMode(),t=this._getOppositeSearchSortMode(e);if(!t){this._searchDisplaySortOverride=null;return}this._searchDisplaySortOverride===t?this._searchDisplaySortOverride=null:this._searchDisplaySortOverride=t,this._searchResultsByType={},this._doSearch(this._searchMediaClassFilter==="all"?null:this._searchMediaClassFilter,{orderBy:this._getActiveSearchDisplaySortMode()}),this.requestUpdate()}_getActiveSearchDisplaySortMode(){if(this._upcomingFilterActive||this._recentlyPlayedFilterActive||this._recommendationsFilterActive)return"default";if(!this._shouldShowSearchSortToggle())return this._getConfiguredSearchResultsSortMode();const e=this._searchDisplaySortOverride;return e&&this._isSortableSearchMode(e)?e:this._getConfiguredSearchResultsSortMode()}_getSearchSortToggleIcon(){const e=this._getActiveSearchDisplaySortMode();return this._isSortableSearchMode(e)?e.endsWith("_desc")?"mdi:sort-descending":"mdi:sort-ascending":"mdi:sort-variant"}_getSearchSortToggleTitle(){const e=this._getActiveSearchDisplaySortMode();if(!this._isSortableSearchMode(e))return"Toggle search result order";const t=e.endsWith("_desc");return`Sort by ${(t?e.replace(/_desc$/,""):e).replace(/_/g," ")} ${t?"descending":"ascending"}`}_getDisplaySearchResults(){return Array.isArray(this._searchResults)?this._searchResults:[]}_getSearchResultsLimit(){const e=Number(this.config?.search_results_limit);return Number.isFinite(e)?e===0?0:Math.min(Math.max(e,1),1e3):20}_getSearchResultsCount(){return Array.isArray(this._searchResults)?this._searchResults.length:0}_shouldShowSearchResultsCount(){return this._isNarrowViewport||!this._usingMusicAssistant||this._searchLoading?!1:this._getSearchResultsCount()>0?!0:this._searchAttempted||this._initialFavoritesLoaded||this._favoritesFilterActive||this._recentlyPlayedFilterActive||this._upcomingFilterActive||this._recommendationsFilterActive}_getSearchResultsCountLabel(){const e=this._getSearchResultsCount();return`${e} ${d(e===1?"search.result":"search.results")}`}async _doSearch(e=null,t={}){this._searchAttempted=!0,this._closeMenuIfOpen(),this._searchMediaClassFilter=e&&e!=="favorites"?e:"all";const a=!!(t.favorites||(this._favoritesFilterActive||this._initialFavoritesLoaded||this._lastSearchUsedServerFavorites)&&!t.clearFilters);a&&(this._favoritesFilterActive=!0);const r=!!(t.isRecentlyPlayed||this._recentlyPlayedFilterActive&&!t.clearFilters),s=!!(t.isUpcoming||this._upcomingFilterActive&&!t.clearFilters),n=!!(t.isRecommendations||this._recommendationsFilterActive&&!t.clearFilters);this._currentSearchQuery!==this._searchQuery&&(this._searchResultsByType={},this._currentSearchQuery=this._searchQuery);const o=this._getActiveSearchDisplaySortMode(),l=`${e||"all"}${a?"_favorites":""}${r?"_recently_played":""}${s?"_upcoming":""}${n?"_recommendations":""}_sort_${o}`,c=!!t.force;if(this._searchResultsByType[l]&&!c){this._searchTimeoutHandle&&(clearTimeout(this._searchTimeoutHandle),this._searchTimeoutHandle=null),this._latestSearchToken=0,this._searchResults=this._sortSearchResults(this._searchResultsByType[l]),this._searchLoading=!1,this._searchError="",this.requestUpdate();return}t.silent||(this._searchLoading=!0,this._searchError="",this._searchResults=[],this.requestUpdate());const h=t.token||Date.now();this._latestSearchToken=h;const u=p=>this._handleProgressiveSearchResults(p,l,h);this._searchTimeoutHandle&&clearTimeout(this._searchTimeoutHandle),this._searchTimeoutHandle=window.setTimeout(()=>{this._latestSearchToken===h&&this._searchLoading&&(this._searchLoading=!1,this._searchError="Search timed out. Try again.",this.requestUpdate())},this.config?.search_timeout_ms?Number(this.config.search_timeout_ms):15e3);try{const p=this._getSearchEntityId(this._selectedIndex),m=await this._resolveTemplateAtActionTime(p,this.currentEntityId);let f;if(this._addToPlaylistTarget&&e==="playlist"&&this._massQueueAvailable){this._initialFavoritesLoaded=!1;try{const S=await mi(this.hass);if(S){const E={limit:Zd};this._searchQuery&&this._searchQuery.trim().length>0&&(E.search=this._searchQuery.trim());const U=this._getActiveSearchDisplaySortMode();U&&U!=="default"&&(E.order_by=U);const B={type:"call_service",domain:"mass_queue",service:"send_command",service_data:{config_entry_id:S,command:"music/playlists/library_items",data:E},return_response:!0},P=await this.hass.connection.sendMessagePromise(B);let D=[];if(Array.isArray(P?.response)?D=P.response:Array.isArray(P?.response?.response)?D=P.response.response:Array.isArray(P?.response?.items)?D=P.response.items:Array.isArray(P?.response?.results)&&(D=P.response.results),Array.isArray(D)){const q=this._getSearchResultsLimit()||30;f={results:D.filter(L=>L.is_editable===!0).map(L=>mt(L)).filter(Boolean).slice(0,q),usedMusicAssistant:!0}}}}catch(S){console.warn("yamp: error fetching direct native playlists for add-to-target logic",S)}f||(f={results:[],usedMusicAssistant:!0}),this._lastSearchUsedServerFavorites=!1}else if(r)this._initialFavoritesLoaded=!1,f=await Qo(this.hass,m,e,this._getSearchResultsLimit(),{onChunk:u}),this._lastSearchUsedServerFavorites=!1;else if(s)this._initialFavoritesLoaded=!1,f=await this._getUpcomingQueue(this.hass,m,this._getSearchResultsLimit()),this._lastSearchUsedServerFavorites=!1;else if(n)this._initialFavoritesLoaded=!1,f=await this._getRecommendations(this.hass,m,e,this._getSearchResultsLimit()),this._lastSearchUsedServerFavorites=!1;else if(a){this._initialFavoritesLoaded=!1;const S=this._getActiveSearchDisplaySortMode();f=await zr(this.hass,m,this._searchQuery,e,{...t,favorites:!0,orderBy:S!=="default"?S:void 0},this._getSearchResultsLimit()),this._lastSearchUsedServerFavorites=!0}else if((!this._searchQuery||this._searchQuery.trim()==="")&&!a&&!r&&(e==="all"||!e)){const S=this._getActiveSearchDisplaySortMode();f=await Lr(this.hass,m,e==="favorites"?null:e,this._getSearchResultsLimit(),{onChunk:u,orderBy:S!=="default"?S:void 0}),(!this._searchQuery||this._searchQuery.trim()==="")&&(this._initialFavoritesLoaded=!0),this._lastSearchUsedServerFavorites=!0}else{this._initialFavoritesLoaded=!1;const S=this._getActiveSearchDisplaySortMode();f=await zr(this.hass,m,this._searchQuery,e,{...t,orderBy:S!=="default"?S:void 0},this._getSearchResultsLimit()),this._lastSearchUsedServerFavorites=!1}let y=f.results||[];this._usingMusicAssistant=f.usedMusicAssistant||!1;const g=this._currentSearchQuery!==this._searchQuery;g&&(this._favoritesFilterActive=!1,this._recentlyPlayedFilterActive=!1,this._upcomingFilterActive=!1,this._recommendationsFilterActive=!1,this._initialFavoritesLoaded=!1);let x=Array.isArray(y)?y:[];if(this._latestSearchToken!==h)return;if((r||s||n)&&this._searchQuery&&this._searchQuery.trim()!==""){const S=this._searchQuery.trim().toLowerCase();x=x.filter(E=>{const U=(E.title||"").toLowerCase(),B=(E.artist||"").toLowerCase(),P=(E.album||"").toLowerCase();return U.includes(S)||B.includes(S)||P.includes(S)})}if(!g&&this._favoritesFilterActive&&!this._lastSearchUsedServerFavorites&&(x=await this._applyLocalFavoritesFilter(x),this._latestSearchToken!==h))return;this._searchResultsByType[l]=x,this._searchResults=this._sortSearchResults(x);const k=Array.isArray(this._searchResults)?this._searchResults.length:0;this._searchTotalRows=Math.max(15,k)}catch(p){this._searchError=p&&p.message||"Unknown error",this._searchResults=[],this._searchTotalRows=0}this._latestSearchToken===h&&this._searchTimeoutHandle&&(clearTimeout(this._searchTimeoutHandle),this._searchTimeoutHandle=null),this._latestSearchToken===h&&(this._latestSearchToken=0),this._searchLoading=!1,this.requestUpdate()}async _playCurrentCollection(){if(this._searchHierarchy.length===0)return;const e=this._searchHierarchy[this._searchHierarchy.length-1];if(!e||!e.uri){this._searchError=d("search.play_collection_error"),this.requestUpdate();return}const t={media_content_id:e.uri,media_content_type:e.type};await this._playMediaFromSearch(t)}_handleSearchSubmit(){const e=this._keepFiltersOnSearch;e||(this._favoritesFilterActive=!1,this._recentlyPlayedFilterActive=!1,this._upcomingFilterActive=!1,this._recommendationsFilterActive=!1);const t=!e;this._doSearch(this._searchMediaClassFilter==="all"?null:this._searchMediaClassFilter,{clearFilters:t})}_handleProgressiveSearchResults(e,t,a){if(!Array.isArray(e)||!e.length||this._latestSearchToken!==a)return;const r=(this._searchResultsByType[t]||[]).concat(e);this._searchResultsByType[t]=r,this._searchResults=this._sortSearchResults(r);const s=Array.isArray(r)?r.length:0;this._searchTotalRows=Math.max(15,s),this.requestUpdate()}_getVisibleSearchFilterClasses(){const e=this.entityObjs?.[this._selectedIndex]||null,t=new Set(e?.hidden_filter_chips||[]);return zt.filter(a=>!t.has(a))}async _playMediaFromSearch(e){const t=this._getSearchEntityId(this._selectedIndex),a=await this._resolveTemplateAtActionTime(t,this.currentEntityId);if(this._searchError="",!await this._performSearchPlayback(e,a)){this._searchError="Unable to start playback. Please try again.",this.requestUpdate();return}const{shouldDismiss:r,shouldReset:s}=this._getSearchDismissBehavior();r?(this._showSearchInSheet&&(this._closeEntityOptions(),this._showSearchInSheet=!1),this._hideSearchSheetInOptions()):s?this._showSearchSheetInOptions():this.requestUpdate()}async _performSearchPlayback(e,t){if(e.queue_item_id&&this._upcomingFilterActive&&this._isMusicAssistantEntity()&&this._massQueueAvailable)try{const n=this._getMusicAssistantState()?.entity_id;if(n)return await this.hass.callService("mass_queue","play_queue_item",{entity:n,queue_item_id:e.queue_item_id}),this._advanceQueueInUI(e.queue_item_id,!0),!0}catch(n){return console.error("yamp: Error playing queue item:",n),await this.hass.callService("media_player","media_next_track",{entity_id:t}),!0}if(!t)return!1;const a=this._collectPlaybackMonitorIds(t),r=this._snapshotPlaybackState(a);if(!await this._invokePlayMedia(t,e))return!1;if(await this._waitForPlaybackChange(r,a))return!0;const s=this._snapshotPlaybackState(a);return await this._invokePlayMedia(t,e)?await this._waitForPlaybackChange(s,a):!1}_collectPlaybackMonitorIds(e){const t=new Set;e&&t.add(e);const a=this._getPlaybackEntityId(this._selectedIndex);a&&t.add(a);const r=this.currentEntityId;r&&t.add(r);const s=this._getActualResolvedMaEntityForState(this._selectedIndex);return s&&t.add(s),Array.from(t).filter(Boolean)}_snapshotPlaybackState(e){const t={};return Array.isArray(e)&&e.forEach(a=>{const r=a?this.hass?.states?.[a]:null;t[a]={state:r?.state??null,mediaId:r?.attributes?.media_content_id??null,mediaTitle:r?.attributes?.media_title??null}}),t}async _waitForPlaybackChange(e,t,a=2500){if(!Array.isArray(t)||t.length===0)return!0;const r=Date.now();for(;Date.now()-r<a;){await this._delay(150);for(const s of t){if(!s)continue;const n=this.hass?.states?.[s];if(!n)continue;if(this._isEntityPlaying(n))return!0;const o=e[s]||{},l=n.attributes?.media_content_id??null,c=n.attributes?.media_title??null;if(l&&l!==o.mediaId||c&&c!==o.mediaTitle||!o.mediaId&&l||!o.mediaTitle&&c)return!0}}return!1}async _performSearchOptionAction(e,t){if(t==="add_to_playlist"){this._addToPlaylistTarget=e,this._searchHierarchy.push({type:"select_playlist",name:d("search.add_to_playlist"),query:this._searchQuery,filter:this._searchMediaClassFilter}),this._searchBreadcrumb=d("search.select_playlist").replace("{track}",e.title),this._searchQuery="",this._currentSearchQuery="",this._searchMediaClassFilter="playlist",this._resetSearchContext(),this._removeSearchSwipeHandlers(),await this._doSearch("playlist",{clearFilters:!0});return}const a=this._getSearchEntityId(this._selectedIndex),r=await this._resolveTemplateAtActionTime(a,this.currentEntityId);try{const s={entity_id:r,media_id:e.media_content_id,media_type:e.media_content_type,enqueue:t};if(this._radioModeActive&&(s.radio_mode=!0),await this.hass.callService("music_assistant","play_media",s),this._invalidateUpcomingCache(),t==="replace"){const{shouldDismiss:n,shouldReset:o}=this._getSearchDismissBehavior();n?this._closeEntityOptions():o&&this._showSearchSheetInOptions(),this._activeSearchRowMenuId=null}else{this._successSearchRowMenuId=e.media_content_id,this.requestUpdate();const n=this._dismissMenuAfterPlaylistAdd&&t==="add_to_playlist";setTimeout(()=>{this._successSearchRowMenuId=null,this._activeSearchRowMenuId=null,n&&(this._closeEntityOptions(),this._dismissMenuAfterPlaylistAdd=!1),this.requestUpdate()},2e3)}}catch(s){console.error("Failed to perform search option action:",s),this._searchError="Action failed: "+s.message,this.requestUpdate()}}async _invokePlayMedia(e,t){try{return this._radioModeActive?await this.hass.callService("music_assistant","play_media",{entity_id:e,media_id:t.media_content_id,media_type:t.media_content_type,radio_mode:!0}):await Yo(this.hass,e,t),!0}catch(a){return console.error("yamp: Error starting playback from search:",a),!1}}_delay(e){return new Promise(t=>{(typeof window<"u"?window:globalThis).setTimeout(t,e)})}async _queueMediaFromSearch(e){const t=this._getSearchEntityId(this._selectedIndex),a=await this._resolveTemplateAtActionTime(t,this.currentEntityId);this._radioModeActive?this.hass.callService("music_assistant","play_media",{entity_id:a,media_id:e.media_content_id,media_type:e.media_content_type,enqueue:"add",radio_mode:!0}):this.hass.callService("media_player","play_media",{entity_id:a,media_content_type:e.media_content_type,media_content_id:e.media_content_id,enqueue:"next"}),this._invalidateUpcomingCache(),this._showSearchSuccessToast()}async _searchArtistAlbums(e,t=null){this._searchHierarchy.push({type:"artist",name:e,query:this._searchQuery,uri:t,filter:this._searchMediaClassFilter}),this._searchBreadcrumb=`Albums by ${e}`,this._searchQuery=e,this._searchResultsByType={},this._currentSearchQuery=e,this._searchMediaClassFilter="album",this._favoritesFilterActive=!1,this._recentlyPlayedFilterActive=!1,this._upcomingFilterActive=!1,this._initialFavoritesLoaded=!1,this._removeSearchSwipeHandlers(),await this._doSearch("album",{clearFilters:!0})}_goBackInSearch(){if(this._dismissMenuAfterPlaylistAdd){this._closeEntityOptions(),this._dismissMenuAfterPlaylistAdd=!1;return}if(this._searchHierarchy.length===0)return;this._searchResults=[],this._searchLoading=!0,this.requestUpdate();const e=this._searchHierarchy.pop();if((e.type==="select_playlist"||e.type==="select_track_for_playlist")&&(this._addToPlaylistTarget=null),this._searchQuery=e.query,this._currentSearchQuery=e.query,this._searchResultsByType={},this._searchMediaClassFilter=e.filter||"all",this._searchHierarchy.length===0)this._searchBreadcrumb="",this._doSearch(this._searchMediaClassFilter==="all"?null:this._searchMediaClassFilter);else{const t=this._searchHierarchy[this._searchHierarchy.length-1];if(t.type==="artist")this._searchBreadcrumb=`Albums by ${t.name}`,this._searchMediaClassFilter="album",this._doSearch("album",{artist:t.name});else if(t.type==="album"){if(this._searchBreadcrumb=`Tracks from ${t.name}`,this._searchMediaClassFilter="track",t.uri&&this._isMusicAssistantEntity()){this._searchQuery=t.name,this._searchAlbumTracks(t.name,null,t.uri);return}const a=this._searchHierarchy.find(s=>s.type==="artist"),r={album:t.name};a&&(r.artist=a.name),this._doSearch("track",r)}else if(t.type==="playlist"){if(this._searchBreadcrumb=`Tracks in ${t.name}`,this._searchMediaClassFilter="track",t.uri&&this._isMusicAssistantEntity()){this._searchQuery=t.name,this._currentSearchQuery=t.name,this._searchResults=[],this._searchLoading=!0,this.requestUpdate(),this._fetchMassQueueTracks(t.uri,"get_playlist_tracks").then(a=>{this._searchResultsByType.track=a,this._searchResults=[...a],this._searchLoading=!1,this.requestUpdate(),this._scrollToTop()});return}this._doSearch("track")}}}_isClickableSearchResult(e){return e?this._addToPlaylistTarget||this._searchHierarchy[this._searchHierarchy.length-1]?.type==="select_track_for_playlist"?!0:!!e.is_browsable:!1}_handleSearchResultTouch(e,t){if(!("ontouchstart"in window))return;const a=t.touches[0],r=a.clientX,s=a.clientY;let n=!1;const o=10,l=h=>{const u=h.touches[0],p=Math.abs(u.clientX-r),m=Math.abs(u.clientY-s);(p>o||m>o)&&(n=!0)},c=h=>{document.removeEventListener("touchmove",l,{passive:!0}),document.removeEventListener("touchend",c,{passive:!0}),n||this._handleSearchResultClick(e)};document.addEventListener("touchmove",l,{passive:!0}),document.addEventListener("touchend",c,{passive:!0})}_getSearchResultClickTitle(e){if(!this._isClickableSearchResult(e))return"";if(this._addToPlaylistTarget&&e.media_class==="playlist")return d("search.add_to_playlist");if(this._searchHierarchy[this._searchHierarchy.length-1]?.type==="select_track_for_playlist"&&(e.media_class==="track"||e.media_content_type==="track")){const t=this._getMockItemFromCurrentTrack();return d("search.select_track_for_playlist",{"{track}":t?.title||"","{artist}":t?.media_artist||""})}return jo(e)}_invalidateUpcomingCache(){if(!this._upcomingFilterActive){const e=`${this._searchMediaClassFilter||"all"}_upcoming_sort_default`;this._searchResultsByType&&delete this._searchResultsByType[e],this.requestUpdate()}}_toggleRadioMode(){this._radioModeActive=!this._radioModeActive,this.requestUpdate()}async _toggleFavoritesFilter(){const e=this._favoritesFilterActive||this._initialFavoritesLoaded;if(this._favoritesFilterActive=!e,this._favoritesFilterActive&&(this._recentlyPlayedFilterActive=!1,this._upcomingFilterActive=!1,this._recommendationsFilterActive=!1),this._favoritesFilterActive){const t=this._searchMediaClassFilter;try{await this._doSearch(t,{favorites:!0})}catch(a){console.error("yamp: Error searching favorites:",a)}}else{const t=this._searchMediaClassFilter;this._lastSearchUsedServerFavorites=!1,this._initialFavoritesLoaded=!1,await this._doSearch(t,{clearFilters:!0})}}async _toggleRecentlyPlayedFilter(e=null){const t=typeof e=="boolean"?e:!this._recentlyPlayedFilterActive;if(this._recentlyPlayedFilterActive,this._recentlyPlayedFilterActive=t,this._recentlyPlayedFilterActive&&(this._favoritesFilterActive=!1,this._upcomingFilterActive=!1,this._recommendationsFilterActive=!1,this._initialFavoritesLoaded=!1),this._recentlyPlayedFilterActive){this._searchQuery="";try{await this._doSearch("all",{isRecentlyPlayed:!0,clearFilters:!0})}catch(a){console.error("yamp: Error in _doSearch for recently played:",a)}}else if(this._searchQuery&&this._searchQuery.trim()!==""){const a=this._searchMediaClassFilter;await this._doSearch(a)}else{const a=`${this._searchMediaClassFilter||"all"}`;this._searchResultsByType[a]?(this._searchResults=this._sortSearchResults(this._searchResultsByType[a]),this.requestUpdate()):await this._doSearch("favorites")}}async _toggleUpcomingFilter(e=null){const t=typeof e=="boolean"?e:!this._upcomingFilterActive;if(this._upcomingFilterActive,this._upcomingFilterActive=t,this._upcomingFilterActive&&(this._favoritesFilterActive=!1,this._recentlyPlayedFilterActive=!1,this._recommendationsFilterActive=!1,this._initialFavoritesLoaded=!1),this._upcomingFilterActive){this._searchQuery="";const a=`${this._searchMediaClassFilter||"all"}_upcoming_sort_default`;delete this._searchResultsByType[a],await this._subscribeToQueueUpdates();try{await this._doSearch("all",{isUpcoming:!0,clearFilters:!0})}catch(r){console.error("yamp: Error in _doSearch for upcoming queue:",r)}}else if(this._unsubscribeFromQueueUpdates(),this._searchQuery&&this._searchQuery.trim()!==""){const a=this._searchMediaClassFilter;await this._doSearch(a)}else{const a=`${this._searchMediaClassFilter||"all"}`;this._searchResultsByType[a]?(this._searchResults=this._sortSearchResults(this._searchResultsByType[a]),this.requestUpdate()):await this._doSearch("favorites")}}async _toggleRecommendationsFilter(e=null){const t=typeof e=="boolean"?e:!this._recommendationsFilterActive;if(this._recommendationsFilterActive,this._recommendationsFilterActive=t,this._recommendationsFilterActive){this._favoritesFilterActive=!1,this._recentlyPlayedFilterActive=!1,this._upcomingFilterActive=!1,this._initialFavoritesLoaded=!1,this._searchQuery="";try{const a=await this._isMassQueueIntegrationAvailable(this.hass);if(this._hasMassQueueIntegration=a,this._massQueueAvailable=a,!a){this._recommendationsFilterActive=!1,this._searchError="Recommendations require the Music Assistant queue integration.",this.requestUpdate();return}await this._doSearch("all",{isRecommendations:!0,clearFilters:!0})}catch(a){console.error("yamp: Error in _doSearch for recommendations:",a),this._searchError="Unable to load recommendations.",this._recommendationsFilterActive=!1,this.requestUpdate()}}else if(this._searchQuery&&this._searchQuery.trim()!==""){const a=this._searchMediaClassFilter;await this._doSearch(a)}else{const a=`${this._searchMediaClassFilter||"all"}`;this._searchResultsByType[a]?(this._searchResults=this._sortSearchResults(this._searchResultsByType[a]),this.requestUpdate()):await this._doSearch("favorites")}}async _getUpcomingQueue(e,t,a=20){try{const r=await this._isMassQueueIntegrationAvailable(e);if(this._massQueueAvailable=r,this._hasMassQueueIntegration=r,r)try{const s=await this._getUpcomingQueueWithMassQueue(e,t,a);return!s.results||s.results.length===0?(this._massQueueAvailable=!1,await this._getUpcomingQueueOriginal(e,t,a)):s}catch{return this._massQueueAvailable=!1,await this._getUpcomingQueueOriginal(e,t,a)}return await this._getUpcomingQueueOriginal(e,t,a)}catch(r){return console.error("yamp: Error getting upcoming queue:",r),this._massQueueAvailable=!1,{results:[],usedMusicAssistant:!1}}}async _getRecommendations(e,t,a=null,r=20){try{const s=await this._isMassQueueIntegrationAvailable(e);if(this._hasMassQueueIntegration=s,this._massQueueAvailable=s,!s)throw new Error("mass_queue integration unavailable");const n=Math.max(r||0,this._getSearchResultsLimit()),o={type:"call_service",domain:"mass_queue",service:"get_recommendations",service_data:{entity:t},return_response:!0},l=(await e.connection.sendMessagePromise(o))?.response;let c=[];Array.isArray(l)?c=l:l&&typeof l=="object"&&(Array.isArray(l[t])?c=l[t]:Object.values(l).forEach(g=>{Array.isArray(g)?c.push(...g):g&&typeof g=="object"&&c.push(g)}),c.length===0&&Array.isArray(l.items)&&(c=l.items));const h=g=>{if(!g||typeof g!="string")return"track";const x=g.toLowerCase();switch(x){case"song":case"music":return"track";case"podcast_episode":case"episode":return"podcast";case"station":return"radio";case"directory":case"folder":return"playlist";default:return x}},u=g=>g?g.toString().replace(/[_-]+/g," ").replace(/\s+/g," ").trim().replace(/\b\w/g,x=>x.toUpperCase()):"",p=a&&a!=="all"?h(a):null,m=[];let f=0;const y=n>0?n:1/0;for(const g of c){if(f>=y)break;const x=g?.name||g?.sort_name||"",k=typeof g?.image=="string"&&g.image.trim()!==""?g.image:null,S=Array.isArray(g?.items)&&g.items.length>0?g.items:[g];for(const E of S){if(f>=y)break;const U=E?.uri||E?.item_id;if(!U)continue;const B=typeof E?.image=="string"&&E.image.trim()!==""?E.image:null,P=E?.media_type||g?.media_type||"music",D=h(P);if(p&&D!==p)continue;const q=u(P)||u(D),L=u(E?.provider||g?.provider),M=q?[q]:[];x?M.push(x):L&&M.push(L),m.push({media_content_id:U,media_content_type:P||D,media_class:D,title:E?.name||E?.sort_name||x||"Recommendation",artist:M.join(" \u2022 "),thumbnail:B||k||null,provider:E?.provider||g?.provider||null}),f+=1}}return{results:m,usedMusicAssistant:!0,source:"mass_queue"}}catch(s){throw console.error("yamp: Error getting recommendations from mass_queue:",s),s}}async _isMassQueueIntegrationAvailable(e){if(this.config.disable_mass_queue===!0)return!1;try{const t=await e.callWS({type:"get_services"});let a=!1;return Array.isArray(t)?a=t.some(r=>r.domain==="mass_queue"):t&&typeof t=="object"&&(a=t.hasOwnProperty("mass_queue")||Object.keys(t).some(r=>r==="mass_queue")),!!a}catch{return!1}}async _getUpcomingQueueWithMassQueue(e,t,a=20){try{const r=e.states[t]?.attributes?.media_content_id,s={type:"call_service",domain:"mass_queue",service:"get_queue_items",service_data:{entity:t,limit_before:0},return_response:!0},n=this._getSearchResultsLimit(),o=Number.isFinite(a)?a:n,l=Math.max(o||0,n||0);l>0&&(s.service_data.limit_after=l);const c=(await e.connection.sendMessagePromise(s))?.response?.[t];if(!Array.isArray(c))throw new Error("Invalid response from mass_queue");let h=c.findIndex(m=>m.active===!0||m.state==="playing");h===-1&&r&&(h=c.findIndex(m=>m.media_content_id===r)),h===-1&&c.length>0&&(h=0);const u=h>=0?c.slice(h+1):c,p=(o>0?u.slice(0,o):u).map((m,f)=>({media_content_id:m.media_content_id||`queue_${f}`,media_content_type:"track",media_class:"track",title:m.media_title||"Unknown Track",artist:m.media_artist||"Unknown Artist",album:m.media_album_name||"Unknown Album",thumbnail:m.media_image||null,duration:null,position:f+1,queue_item_id:m.queue_item_id||null}));return{results:p,usedMusicAssistant:!0,total:p.length,source:"mass_queue"}}catch(r){throw console.error("yamp: mass_queue service call failed:",r),r}}async _moveQueueItemUp(e){try{const t=this._getMusicAssistantState()?.entity_id;if(!t)throw new Error("No Music Assistant entity found");this._moveQueueItemInUI(e,"up"),await this.hass.callService("mass_queue","move_queue_item_up",{entity:t,queue_item_id:e}),this._invalidateUpcomingCache()}catch{this._refreshQueue()}}async _moveQueueItemDown(e){try{const t=this._getMusicAssistantState()?.entity_id;if(!t)throw new Error("No Music Assistant entity found");this._moveQueueItemInUI(e,"down"),await this.hass.callService("mass_queue","move_queue_item_down",{entity:t,queue_item_id:e}),this._invalidateUpcomingCache()}catch{this._refreshQueue()}}async _moveQueueItemNext(e){try{const t=this._getMusicAssistantState()?.entity_id;if(!t)throw new Error("No Music Assistant entity found");this._moveQueueItemInUI(e,"next"),await this.hass.callService("mass_queue","move_queue_item_next",{entity:t,queue_item_id:e}),this._invalidateUpcomingCache()}catch{this._refreshQueue()}}async _removeQueueItem(e){try{const t=this._getMusicAssistantState()?.entity_id;if(!t)throw new Error("No Music Assistant entity found");this._removeQueueItemFromUI(e),await this.hass.callService("mass_queue","remove_queue_item",{entity:t,queue_item_id:e}),this._invalidateUpcomingCache()}catch{this._refreshQueue()}}_showQueueError(e){console.error("yamp: Queue operation failed:",e)}_moveQueueItemInUI(e,t){const a=`${this._searchMediaClassFilter||"all"}_upcoming_sort_default`,r=this._searchResultsByType[a];if(!Array.isArray(r))return;const s=r.findIndex(l=>l.queue_item_id===e);if(s===-1)return;let n;switch(t){case"up":n=Math.max(0,s-1);break;case"down":n=Math.min(r.length-1,s+1);break;case"next":n=0;break;default:return}if(n===s)return;const o=r.splice(s,1)[0];r.splice(n,0,o),this._searchResults=[...r],r.forEach((l,c)=>{l.position=c+1}),o._justMoved=!0,setTimeout(()=>{delete o._justMoved,this.requestUpdate()},1e3),this._latestSearchToken=Date.now(),this.requestUpdate()}_advanceQueueInUI(e=null,t=!1){if(!this._upcomingFilterActive)return;t&&(this._latestManualShiftTime=Date.now());const a=`${this._searchMediaClassFilter||"all"}_upcoming_sort_default`;let r=this._searchResultsByType[a];if(!(!Array.isArray(r)||r.length===0)){if(e){const s=r.findIndex(n=>n.queue_item_id===e);s>=0&&(r=r.slice(s+1))}else r=r.slice(1);this._searchResultsByType[a]=r,this._searchResults=r,this._latestSearchToken=Date.now(),this.requestUpdate()}}_removeQueueItemFromUI(e){const t=`${this._searchMediaClassFilter||"all"}_upcoming_sort_default`,a=this._searchResultsByType[t];if(!Array.isArray(a))return;const r=a.filter(s=>s.queue_item_id!==e);this._searchResultsByType[t]=r,this._searchResults=r,this.requestUpdate()}_isMusicAssistantEntity(){const e=this._getMusicAssistantState();return e?_t(e)||e.attributes?.mass_player_id||e.attributes?.active_queue||this._upcomingFilterActive&&this._searchResultsByType[`${this._searchMediaClassFilter||"all"}_upcoming_sort_default`]?.some(t=>t.queue_item_id):!1}_looksLikeMusicAssistantState(e){return e?_t(e)||!!e.attributes?.mass_player_id||!!e.attributes?.active_queue:!1}_getTransferQueueTargets(){if(!this.hass?.services?.music_assistant?.transfer_queue)return[];const e=this._selectedIndex;if(e==null||e<0)return[];const t=this._getActualResolvedMaEntityForState(e);if(!t)return[];const a=new Set([t]),r=[];for(let s=0;s<this.entityObjs.length;s++){const n=this.entityObjs[s];if(!n)continue;const o=this._getActualResolvedMaEntityForState(s);if(!o||a.has(o))continue;const l=this.hass?.states?.[o],c=this.hass?.states?.[n.entity_id];if(!this._looksLikeMusicAssistantState(l)&&!this._looksLikeMusicAssistantState(c))continue;a.add(o);const h=l||c,u=n?.name||c?.attributes?.friendly_name||l?.attributes?.friendly_name||n.entity_id;r.push({index:s,entityId:n.entity_id,maEntityId:o,name:u,subtitle:o!==n.entity_id?o:n.entity_id,state:h?.state,icon:h?.attributes?.icon||"mdi:music"})}return r}_hasQueueInState(e){if(!e)return!1;const t=e.attributes||{},a=["queue_items","queue","media_queue","mass_queue_items"];for(const o of a){const l=t[o];if(Array.isArray(l)&&l.length>0)return!0}const r=["queue_length","queue_size","queue_total_items","queue_pending","queue_remaining","items_in_queue"];for(const o of r){const l=t[o];if(typeof l=="number"&&l>0)return!0}if(t.next_item||t.current_queue_item||t.queue_item_id||t.media_content_id)return!0;const s=`${this._searchMediaClassFilter||"all"}_upcoming_sort_default`,n=this._searchResultsByType?.[s];return!!(Array.isArray(n)&&n.length>0)}async _updateTransferQueueAvailability({refresh:e=!1}={}){const t=this._getMusicAssistantState(),a=this._looksLikeMusicAssistantState(t);if(!t||!a)return this._hasTransferQueueForCurrent&&(this._hasTransferQueueForCurrent=!1,this.requestUpdate()),!1;let r=this._hasQueueInState(t);if(!r&&e&&this.hass){const s=this._getActualResolvedMaEntityForState(this._selectedIndex);if(s)try{const n=await this._getUpcomingQueue(this.hass,s,2);(Array.isArray(n?.results)&&n.results.length>0||this._isEntityPlaying(t)||t.state==="paused"||t.attributes?.media_content_id)&&(r=!0)}catch{}}return this._hasTransferQueueForCurrent!==r&&(this._hasTransferQueueForCurrent=r,this.requestUpdate()),r}_canShowTransferQueueOption(){return this._hasTransferQueueForCurrent?this._getTransferQueueTargets().length>0:!1}_openTransferQueue(){this._showEntityOptions=!0,this._showTransferQueue=!0,this._showGrouping=!1,this._showSourceList=!1,this._showSearchInSheet=!1,this._showResolvedEntities=!1,this._transferQueuePendingTarget=null,this._transferQueueStatus=null,this._transferQueueAutoCloseTimer&&(clearTimeout(this._transferQueueAutoCloseTimer),this._transferQueueAutoCloseTimer=null),this.requestUpdate()}_closeTransferQueue(){this._showTransferQueue=!1,this._transferQueuePendingTarget=null,this._transferQueueStatus=null,this._transferQueueAutoCloseTimer&&(clearTimeout(this._transferQueueAutoCloseTimer),this._transferQueueAutoCloseTimer=null),this.requestUpdate()}async _transferQueueTo(e){if(!e)return;const t=this._getActualResolvedMaEntityForState(this._selectedIndex);if(t){this._transferQueuePendingTarget=e.maEntityId,this._transferQueueStatus=null,this.requestUpdate();try{const a=this._buildTransferQueuePayload(t,e.maEntityId);await this.hass.callService("music_assistant","transfer_queue",a),this._transferQueueStatus={type:"success",message:`Queue sent to ${e.name}.`};const r=typeof e.index=="number"?e.index:this.entityIds.indexOf(e.entityId);if(r!=null&&r>=0){const s=this._pinnedIndex;if(s===null||s===r){this._selectedIndex=r,this._manualSelect=!0,this._manualSelectPlayingSet=null,s===r&&(this._pinnedIndex=r);const n=e.maEntityId||this.entityObjs[r]?.entity_id;n&&(this._playbackLingerByIdx||(this._playbackLingerByIdx={}),this._playbackLingerByIdx[r]={entityId:n,until:Date.now()+5e3},this._lastPlayingEntityIdByChip||(this._lastPlayingEntityIdByChip={}),this._lastPlayingEntityIdByChip[r]=n),this._ensureResolvedMaForIndex(r),this._ensureResolvedVolForIndex(r)}}await this._updateTransferQueueAvailability({refresh:!0}),this._transferQueueAutoCloseTimer&&clearTimeout(this._transferQueueAutoCloseTimer),this._transferQueueAutoCloseTimer=setTimeout(()=>{this._transferQueueAutoCloseTimer=null,this._showEntityOptions&&this._showTransferQueue&&this._dismissWithAnimation()},2e3)}catch(a){console.error("yamp: Error transferring queue:",a),this._transferQueueStatus={type:"error",message:a?.message||"Failed to transfer queue."},this._transferQueueAutoCloseTimer&&(clearTimeout(this._transferQueueAutoCloseTimer),this._transferQueueAutoCloseTimer=null)}finally{this._transferQueuePendingTarget=null,this.requestUpdate()}}}_buildTransferQueuePayload(e,t){const a=this.hass?.services?.music_assistant?.transfer_queue?.fields||{},r={},s=(l,c)=>{for(const h of l)if(a[h]!==void 0)return r[h]=c,!0;return!1},n=s(["source_player","source_player_id","player_id","source"],e),o=s(["target_player","target_player_id","target","entity_id"],t);if(!n){const l=o?"source_player":"entity_id";r[l]=e}return o||(r.entity_id===e?(r.entity_id=t,r.source_player=e):(r.source_player,r.entity_id=t)),r}_refreshQueue({delayMs:e=50}={}){this._upcomingFilterActive&&(this._queueRefreshTimer&&clearTimeout(this._queueRefreshTimer),this._queueRefreshTimer=setTimeout(()=>{this._queueRefreshTimer=null;const t=Date.now();this._latestSearchToken=t,this._doSearch("all",{isUpcoming:!0,clearFilters:!0,silent:!0,force:!0,token:t}).catch(a=>{console.error("yamp: Error refreshing queue:",a)})},e))}async _subscribeToQueueUpdates(){if(!this._queueEventSubscription)try{this._queueEventSubscription=await this.hass.connection.subscribeEvents(e=>{e.data.type},"mass_queue")}catch(e){console.error("yamp: Failed to subscribe to queue updates:",e)}}_unsubscribeFromQueueUpdates(){this._queueEventSubscription&&(this._queueEventSubscription(),this._queueEventSubscription=null)}async _getUpcomingQueueOriginal(e,t,a=20){try{const r={type:"call_service",domain:"music_assistant",service:"get_queue",service_data:{entity_id:t},return_response:!0},s=(await e.connection.sendMessagePromise(r))?.response?.[t];if(!s)return{results:[],usedMusicAssistant:!0};const n=[];if(!s)return{results:[],usedMusicAssistant:!0};if(s.next_item){const o=s.next_item;n.push({media_content_id:o.media_item?.uri||"queue_next",media_content_type:o.media_item?.media_type||"track",media_class:"track",title:o.name||o.media_item?.name||"Unknown Track",artist:o.media_item?.artists?.[0]?.name||"Unknown Artist",album:o.media_item?.album?.name||"Unknown Album",thumbnail:o.media_item?.image||null,duration:o.duration||null,position:1,queue_item_id:o.queue_item_id||null})}return{results:n,usedMusicAssistant:!0,total:n.length,source:"music_assistant"}}catch(r){throw console.error("yamp: Error in original queue method:",r),r}}async _applyLocalFavoritesFilter(e=[]){if(!this._favoritesFilterActive)return e;const t=this._getSearchEntityId(this._selectedIndex),a=await this._resolveTemplateAtActionTime(t,this.currentEntityId);try{const r=(await Lr(this.hass,a,this._searchMediaClassFilter,this._getSearchResultsLimit())).results||[],s=new Set(r.map(n=>n.media_content_id));return e.filter(n=>s.has(n.media_content_id))}catch{return e}}async _handleSearchResultClick(e,t){if(!(!this._isClickableSearchResult(e)||"ontouchstart"in window&&t&&t.sourceCapabilities&&t.sourceCapabilities.firesTouchEvents)){if(this._searchHierarchy[this._searchHierarchy.length-1]?.type==="select_track_for_playlist"&&(e.media_class==="track"||e.media_content_type==="track")){this._performSearchOptionAction(e,"add_to_playlist");return}if(this._addToPlaylistTarget&&e.media_class==="playlist"){this._loadingSearchRowMenuId=e.media_content_id,this.requestUpdate();try{const a=await mi(this.hass);if(a){const r=e.item_id||e.media_content_id?.split("/").pop();await this.hass.callService("mass_queue","send_command",{command:"music/playlists/add_playlist_tracks",data:{db_playlist_id:r,uris:[this._addToPlaylistTarget.media_content_id]},config_entry_id:a}),this._showSearchSuccessToast(e.media_content_id,"playlist")}}catch(a){console.error("Failed to add to playlist:",a),this._errorSearchRowMenuId=e.media_content_id,this.requestUpdate(),setTimeout(()=>{this._errorSearchRowMenuId=null,this.requestUpdate()},3e3)}finally{this._loadingSearchRowMenuId=null,this.requestUpdate()}this._addToPlaylistTarget=null,setTimeout(()=>{this._dismissMenuAfterPlaylistAdd?(this._closeEntityOptions(),this._dismissMenuAfterPlaylistAdd=!1):this._goBackInSearch()},mn);return}if(e.media_class==="artist")await this._searchArtistAlbums(e.title,e.media_content_id);else if(e.media_class==="album"){let a=null;this._searchHierarchy.length>0&&this._searchHierarchy[this._searchHierarchy.length-1].type==="artist"?a=this._searchHierarchy[this._searchHierarchy.length-1].name:e.artist&&(a=e.artist),await this._searchAlbumTracks(e.title,a,e.media_content_id)}else e.media_class==="track"?e.album&&await this._searchAlbumTracks(e.album,e.artist,e.album_uri):e.media_class==="playlist"&&await this._searchPlaylistTracks(e.title,e.media_content_id)}}async _searchAlbumTracks(e,t,a=null){this._searchHierarchy.push({type:"album",name:e,query:this._searchQuery,uri:a,filter:this._searchMediaClassFilter}),this._searchBreadcrumb=`Tracks from ${e}`,this._searchResultsByType={},this._currentSearchQuery=e,this._searchMediaClassFilter="track",this._searchResults=[],this._searchLoading=!0,this.requestUpdate();const r=await this._fetchMassQueueTracks(a,"get_album_tracks");if(r&&r.length>0){this._setSearchResultsFromMassQueue(r,e);return}if(a&&this._isMusicAssistantEntity())try{const o=this._getSearchEntityId(this._selectedIndex),l=await this._resolveTemplateAtActionTime(o,this.currentEntityId),c={type:"call_service",domain:"media_player",service:"browse_media",service_data:{entity_id:l,media_content_id:a},return_response:!0},h=await this.hass.connection.sendMessagePromise(c),u=(h?.response?.[l]?.result||h?.result||{}).children||[];if(u.length>0){this._searchQuery=e,this._searchResults=this._sortSearchResults(u),this._searchTotalRows=Math.max(15,u.length),this._searchLoading=!1,this.requestUpdate();return}}catch(o){console.error("yamp: Failed to browse album tracks:",o)}let s=e;t&&(s=`${t} ${e}`),this._searchQuery=s,this._favoritesFilterActive=!1,this._recentlyPlayedFilterActive=!1,this._initialFavoritesLoaded=!1;const n={album:e,clearFilters:!0};t&&(n.artist=t),this._removeSearchSwipeHandlers(),await this._doSearch("track",n)}async _searchPlaylistTracks(e,t){this._searchHierarchy.push({type:"playlist",name:e,query:this._searchQuery,uri:t,filter:this._searchMediaClassFilter}),this._searchBreadcrumb=`Tracks from ${e}`,this._searchResultsByType={},this._currentSearchQuery=e,this._searchMediaClassFilter="track",this._searchResults=[],this._searchLoading=!0,this.requestUpdate();const a=await this._fetchMassQueueTracks(t,"get_playlist_tracks");if(a&&a.length>0){this._setSearchResultsFromMassQueue(a,e);return}this._searchQuery=e,this._searchResults=[],this._searchLoading=!1,this.requestUpdate()}async _fetchMassQueueTracks(e,t){try{if(!await this._isMassQueueIntegrationAvailable(this.hass))return null;const a=await mi(this.hass);let r=[];if(a&&e)try{const s={type:"call_service",domain:"mass_queue",service:t,service_data:{config_entry_id:a,uri:e},return_response:!0},n=await this.hass.connection.sendMessagePromise(s);n?.response?.tracks&&(r=n.response.tracks)}catch(s){console.warn(`yamp: mass_queue.${t} failed with config_entry_id, trying fallback with entity_id`,s);const n=this._getMusicAssistantState()?.entity_id;if(n)try{const o={type:"call_service",domain:"mass_queue",service:t,service_data:{entity:n,uri:e},return_response:!0},l=await this.hass.connection.sendMessagePromise(o);l?.response?.tracks&&(r=l.response.tracks)}catch(o){throw console.warn(`yamp: mass_queue.${t} fallback with entity_id also failed.`,o),s}else throw s}return r}catch(a){return console.error(`yamp: Error fetching ${t} via mass_queue:`,a),null}}_setSearchResultsFromMassQueue(e,t){this._searchResults=e.map(a=>({media_content_id:a.media_content_id,media_content_type:"track",media_class:"track",title:a.media_title,artist:a.media_artist,album:a.media_album_name,thumbnail:a.media_image,duration:a.duration,is_browsable:!1,favorite:a.favorite})),this._searchQuery=t,this._searchTotalRows=Math.max(15,e.length),this._searchLoading=!1,this.requestUpdate()}_notifyResize(){this.dispatchEvent(new Event("iron-resize",{bubbles:!0,composed:!0}))}_setupAdaptiveTextObserver(){!this._adaptiveText||this._textResizeObserver||typeof ResizeObserver>"u"||!this.isConnected||(this._textResizeObserver=new ResizeObserver(()=>this._updateAdaptiveTextScale()),this._textResizeObserver.observe(this),this._updateAdaptiveTextScale())}_teardownAdaptiveTextObserver(){this._textResizeObserver&&(this._textResizeObserver.disconnect(),this._textResizeObserver=null),this._currentTextScale=null,this._setAdaptiveTextVars(1,new Set)}_setAdaptiveTextVars(e,t,a){if(!this.style)return;const r=t||this._adaptiveTextTargets,s=Number.isFinite(e)?e:1,n=s.toFixed(2);this.style.setProperty("--yamp-text-scale",n);for(const[p,m]of Object.entries(Jd)){const f=!!r?.has(p);this.style.setProperty(m,f?n:"1")}const o=!!r?.has("details"),l=Number.isFinite(a)?a:s,c=o?l.toFixed(2):"1",h=o?this._calculateDetailsLineHeight(l):1.2;this.style.setProperty("--yamp-details-scale",c),this.style.setProperty("--yamp-details-line-height",h.toFixed(2));const u=o?l>=2?3:l>=1.3?2:1:3;this.style.setProperty("--yamp-details-max-lines",u.toString())}_updateAdaptiveTextObserverState(){this._adaptiveText&&this.isConnected?this._setupAdaptiveTextObserver():this._teardownAdaptiveTextObserver()}_handleGlobalScroll(){this._adaptiveText&&(this._suspendAdaptiveScaling=!0,this._pendingAdaptiveScaleUpdate=!0,clearTimeout(this._adaptiveScrollTimer),this._adaptiveScrollTimer=setTimeout(()=>{this._suspendAdaptiveScaling=!1,this._pendingAdaptiveScaleUpdate&&(this._pendingAdaptiveScaleUpdate=!1,this._updateAdaptiveTextScale(!0))},400))}_handleViewportResize(){this._updateViewportFlags()}_updateViewportFlags(){if(typeof window>"u")return;const e=typeof document<"u"?document.documentElement?.clientWidth:0,t=window.innerWidth||e||0,a=t>0?t<=520:this._isNarrowViewport;a!==this._isNarrowViewport&&(this._isNarrowViewport=a,this.requestUpdate())}_updateAdaptiveTextScale(e=!1){if(!this._adaptiveText)return;if(this._suspendAdaptiveScaling&&!e){this._pendingAdaptiveScaleUpdate=!0;return}const t=this.getBoundingClientRect(),a=t?.width||0;if(!a)return;const r=this._getAdaptiveBaselineHeight(this._lastRenderedCollapsed||!1)||t?.height||a,s=a/360,n=r/360,o=s*.8+n*.2,l=Math.max(.85,Math.min(1.4,o)),c=this._calculateDetailsScale(a,r,l,this._lastTitleLength||0),h=this._currentTextScale===null||Math.abs(this._currentTextScale-l)>.01,u=this._currentDetailsScale===null||Math.abs(this._currentDetailsScale-c)>.02;(h||u)&&(this._currentTextScale=l,this._currentDetailsScale=c,this._setAdaptiveTextVars(l,void 0,c))}_calculateDetailsScale(e,t,a=1){if(!this._adaptiveTextTargets?.has("details"))return 1;const r=Math.min(Math.max(1,e/360),3.2),s=Math.max(1,Math.min(t/330,2.4)),n=Math.max(r*.7+s*.3,s),o=Math.min(3.25,1+(s-1)*1.35),l=Math.max(a,n*1.18),c=Math.max(1,Math.min(l,o)),h=this._lastTitleLength||0,u=h>0?Math.max(.62,Math.min(1,30/Math.min(h,72))):1;return 1+(c-1)*u}_calculateDetailsLineHeight(e){const t=Math.max(1,Math.min(e,2.6)),a=Math.max(0,t-1);return Math.min(1.55,1.2+a*.35)}_getAdaptiveBaselineHeight(e=!1){const t=this.config?.card_height;if(typeof t=="number"&&Number.isFinite(t)&&t>0)return t;if(typeof t=="string"){const a=t.trim();if(a){const r=Number(a);if(Number.isFinite(r)&&r>0)return r}}return e||this._alwaysCollapsed?this._collapsedBaselineHeight||220:350}async _resolveIdleImageTemplate(){if(!(!this._idleImageTemplate||this._resolvingIdleImageTemplate||!this.hass)){this._resolvingIdleImageTemplate=!0;try{const e=await this.hass.callApi("POST","template",{template:this._idleImageTemplate});this._idleImageTemplateResult=(e??"").toString().trim()}catch{this._idleImageTemplateResult=""}finally{this._resolvingIdleImageTemplate=!1,this._idleImageTemplateNeedsResolve=!1,this.requestUpdate()}}}_ensureArtworkOverrideIndexMap(){this._artworkOverrideIndexMap||(this._artworkOverrideIndexMap=new WeakMap,(Array.isArray(this.config?.media_artwork_overrides)?this.config.media_artwork_overrides:[]).forEach((e,t)=>{e&&typeof e=="object"&&this._artworkOverrideIndexMap.set(e,t)}))}_getArtworkOverrideCacheKey(e,t="image",a=null){this._ensureArtworkOverrideIndexMap();const r=a?.attributes?.media_title||"",s=a?.attributes?.media_artist||"",n=`${r}:${s}`,o=e&&this._artworkOverrideIndexMap?.get(e);return`${typeof o=="number"?o:"generic"}:${t}:${n}`}_getResolvedArtworkOverrideSource(e,t,a="image",r=null){if(!t||typeof t!="string")return null;const s=this._normalizeImageSourceValue(t);if(!s)return null;if(!(t.includes("{{")||t.includes("{%")))return s;this._artworkOverrideTemplateCache||(this._artworkOverrideTemplateCache={});const n=this._getArtworkOverrideCacheKey(e,a,r);this._artworkOverrideTemplateCache[n]||(this._artworkOverrideTemplateCache[n]={value:null,resolving:!1});const o=this._artworkOverrideTemplateCache[n];return o.value||!o.resolving&&this.hass&&(o.resolving=!0,this.hass.callApi("POST","template",{template:t}).then(l=>{o.value=this._normalizeImageSourceValue((l??"").toString())}).catch(()=>{o.value=""}).finally(()=>{o.resolving=!1,this.requestUpdate()})),o.value}_getCollapsedArtworkStyle(){if(this._alwaysCollapsed){const e=!!this._getFavoriteButtonEntity()&&!this._getHiddenControlsForCurrentEntity().favorite;if(aa(this.currentActivePlaybackStateObj,(t,a)=>this._supportsFeature(t,a),e,this._getHiddenControlsForCurrentEntity(),!0,this._controlLayout)>6&&window.innerWidth<=768)return"width: 60px; height: 60px; object-fit: var(--yamp-artwork-fit, cover); border-radius: 8px;"}return""}_getArtworkUrl(e){if(!e||!e.attributes)return null;const t=e.attributes,a=e.entity_id;t.app_id;const r=this.config?.artwork_hostname||"";let s=null,n=null,o=null;if(this._artworkObjectFit==="no_artwork")return{url:null,sizePercentage:null,objectFit:"no_artwork"};const l=Array.isArray(this.config?.media_artwork_overrides)?this.config.media_artwork_overrides:null;if(l&&l.length){const c=()=>l.find(f=>yn.some(y=>{const g=f[y];if(g===void 0)return!1;const x=y==="entity_id"?a:y==="entity_state"?e?.state:t[y];return g==="*"?!0:f.__cachedRegexes?.[y]?f.__cachedRegexes[y].test(String(x||"")):x===g})),h=Ee(t,"entity_picture_local")||Ee(t,"entity_picture")||Ee(t,"album_art");let u=c(),p=null,m="image";if(u?.image_url?p=u.image_url:u?.missing_art_url&&!h&&(p=u.missing_art_url,m="missing"),!u&&!h){const f=l.find(y=>y?.missing_art_url);f?.missing_art_url&&(u=f,p=f.missing_art_url,m="missing")}if(u&&p){const f=this._getResolvedArtworkOverrideSource(u,p,m,e);f&&(s=f,n=u?.size_percentage,o=u?.object_fit??null)}}if(s||(s=Ee(t,"entity_picture_local")||Ee(t,"entity_picture")||Ee(t,"album_art")||null),!s){const c=this.config?.fallback_artwork;c&&(c==="smart"?t.media_title==="TV"||t.media_channel||t.app_id==="tv"||t.app_id==="androidtv"?s="data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTg0IiBoZWlnaHQ9IjE4NCIgdmlld0JveD0iMCAwIDE4NCAxODQiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHg9IjQwIiB5PSI0MCIgd2lkdGg9IjEwNCIgaGVpZ2h0PSI3OCIgcng9IjgiIGZpbGw9ImN1cnJlbnRDb2xvciIvcj4KPHJlY3QgeD0iNjgiIHk9IjEyMCIgd2lkdGg9IjQ4IiBoZWlnaHQ9IjgiIHJ4PSI0IiBmaWxsPSJjdXJyZW50Q29sb3IiLz4KPHJlY3QgeD0iODAiIHk9IjEzMCIgd2lkdGg9IjI0IiBoZWlnaHQ9IjgiIHJ4PSI0IiBmaWxsPSJjdXJyZW50Q29sb3IiLz4KPC9zdmc+Cg==":s="data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTg0IiBoZWlnaHQ9IjE4NCIgdmlld0JveD0iMCAwIDE4NCAxODQiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHg9IjM2IiB5PSI4NiIgd2lkdGg9IjIyIiBoZWlnaHQ9IjYyIiByeD0iOCIgZmlsbD0iY3VycmVudENvbG9yIi8+CjxyZWN0IHg9IjY4IiB5PSI1OCIgd2lkdGg9IjIyIiBoZWlnaHQ9IjkwIiByeD0iOCIgZmlsbD0iY3VycmVudENvbG9yIi8+CjxyZWN0IHg9IjEwMCIgeT0iNzAiIHdpZHRoPSIyMiIgaGVpZ2h0PSI3OCIgcng9IjgiIGZpbGw9ImN1cnJlbnRDb2xvciIvPgo8cmVjdCB4PSIxMzIiIHk9IjQyIiB3aWR0aD0iMjIiIGhlaWdodD0iMTA2IiByeD0iOCIgZmlsbD0iY3VycmVudENvbG9yIi8+Cjwvc3ZnPgo=":typeof c=="string"&&(s=c),s&&(o=this._artworkObjectFit))}if(s&&r&&!s.startsWith("http")&&!s.startsWith("data:")){const c=r.endsWith("/")?r.slice(0,-1):r,h=s.startsWith("/")?s:`/${s}`;s=c+h}return s&&!this._isValidArtworkUrl(s)&&(s=null),o||(o=this._artworkObjectFit),{url:s,sizePercentage:n,objectFit:o}}_getBackgroundSizeForFit(e){switch(e){case"contain":return"contain";case"fill":return"100% 100%";case"scale-down":return"contain";case"none":return"auto";case"scaled-contain":case"scaled-contain-alternate":return"80%";default:return"cover"}}_isValidArtworkUrl(e){if(!e||typeof e!="string")return!1;if(e.startsWith("data:")||e.startsWith("/")||e.startsWith("./")||e.startsWith("../"))return!0;if(e.includes("undefined")||e.includes("null")||e.trim()==="")return!1;try{return new URL(e),!0}catch{return!1}}async _extractDominantColor(e){return new Promise(t=>{const a=new window.Image;a.crossOrigin="Anonymous",a.src=e,a.onload=function(){const r=document.createElement("canvas");r.width=1,r.height=1;const s=r.getContext("2d");s.drawImage(a,0,0,1,1);const[n,o,l]=s.getImageData(0,0,1,1).data;t(`rgb(${n},${o},${l})`)},a.onerror=function(){t("#888")}})}_normalizeAdaptiveTextTargets(e){return Array.isArray(e?.adaptive_text_targets)?e.adaptive_text_targets.map(t=>typeof t=="string"?t.trim().toLowerCase():"").filter(t=>fn.includes(t)):e?.adaptive_text===!0?[...Xd]:[]}_normalizeImageSourceValue(e){if(!e||typeof e!="string")return"";let t=e.trim();if(!t)return"";(t.startsWith("'")&&t.endsWith("'")||t.startsWith('"')&&t.endsWith('"'))&&t.length>=2&&(t=t.slice(1,-1).trim());const a=t.match(/^url\((.*)\)$/i);if(a&&a[1]!==void 0){let r=a[1].trim();return(r.startsWith("'")&&r.endsWith("'")||r.startsWith('"')&&r.endsWith('"'))&&(r=r.slice(1,-1).trim()),r}return t}setConfig(e){if(!e.entities||!Array.isArray(e.entities)||e.entities.length===0)throw new Error("You must define at least one media_player entity.");const t=this.config;this.config={...e};const a=typeof e.control_layout=="string"?e.control_layout.toLowerCase():"classic";this._controlLayout=a==="modern"?"modern":"classic",this._swapPauseForStop=e.swap_pause_for_stop===!0,this._holdToPin=!!e.hold_to_pin,this._disableSearchAutofocus=e.disable_autofocus===!0,this._holdToPin&&(this._holdHandler=Ro({onPin:o=>this._pinChip(o),onHoldEnd:()=>{},holdTime:650,moveThreshold:8}));const r=this._selectedIndex||0;this._selectedIndex=r<this.entityIds.length?r:0,this._lastPlaying=null,this._lastActiveEntityId=null;let s=new Set(["cover","contain","fill","scale-down","none","scaled-contain","scaled-contain-alternate","no_artwork"]).has(e.artwork_object_fit)?e.artwork_object_fit:"cover";s==="scaled-contain-alternate"&&e.always_collapsed===!0&&(s="scaled-contain"),this._artworkObjectFit=s,this._extendArtwork=e.extend_artwork===!0,this._idleScreen=e.idle_screen||"default",this._idleScreenApplied=!1,this._hasSeenPlayback=!1,this._appearance=e.appearance||"automatic",this._isIdle&&this._applyIdleScreen(),this._updateHostAttributes(),this._collapseOnIdle=!!e.collapse_on_idle,this._alwaysCollapsed=!!e.always_collapsed,this._expandOnSearch=!!e.expand_on_search,this._alternateProgressBar=!!e.alternate_progress_bar,this._displayTimestamps=!!e.display_timestamps,this._keepFiltersOnSearch=!!e.keep_filters_on_search,this._adaptiveControls=e.adaptive_controls===!0;const n=this._normalizeAdaptiveTextTargets(e);if(this._adaptiveTextTargets=new Set(n),this._adaptiveText=this._adaptiveTextTargets.size>0,this._currentDetailsScale=null,this._updateAdaptiveTextObserverState(),e.always_show_quick_group!==t?.always_show_quick_group&&(this._quickGroupingMode=!!e.always_show_quick_group),this._adaptiveText){const o=this._currentTextScale??1,l=this._currentDetailsScale??1;this._setAdaptiveTextVars(o,void 0,l),this._updateAdaptiveTextScale()}else this._setAdaptiveTextVars(1,new Set,1);this._hideActiveEntityLabel=e.hide_active_entity_label===!0,this._artworkOverrideTemplateCache={},this._artworkOverrideIndexMap=null,Array.isArray(e.media_artwork_overrides)&&(this.config.media_artwork_overrides=e.media_artwork_overrides.map(o=>({...o})),this.config.media_artwork_overrides.forEach(o=>{!o||typeof o!="object"||(o.__cachedRegexes={},yn.forEach(l=>{const c=o[l];if(typeof c=="string"&&c.includes("*")&&c!=="*")try{const h=c.replace(/[.*+?^${}()|[\]\\]/g,"\\$&").replace(/\\\*/g,".*");o.__cachedRegexes[l]=new RegExp(`^${h}$`,"i")}catch{console.warn("yamp: Failed to compile artwork override regex for",l,c)}}))})),typeof e.idle_image=="string"&&(e.idle_image.includes("{{")||e.idle_image.includes("{%"))?(this._idleImageTemplate=e.idle_image,this._idleImageTemplateResult="",this._idleImageTemplateNeedsResolve=!0):(this._idleImageTemplate=null,this._idleImageTemplateResult="",this._idleImageTemplateNeedsResolve=!1),this._idleTimeoutMs=typeof e.idle_timeout_ms=="number"?e.idle_timeout_ms:6e4,this._idleTimeoutMs===0&&(this._idleTimeout&&(clearTimeout(this._idleTimeout),this._idleTimeout=null),this._isIdle&&(this._isIdle=!1,this._resetIdleScreen(),this.requestUpdate())),this._volumeStep=typeof e.volume_step=="number"?e.volume_step:.05,e.always_show_lyrics===!0&&(this._lyricsActive=!0)}get entityObjs(){return this.config.entities.map((e,t)=>{const a=typeof e=="string"?e:e.entity_id,r=typeof e=="string"?"":e.name||"",s=typeof e=="string"?void 0:e.volume_entity,n=typeof e=="string"?void 0:e.music_assistant_entity,o=typeof e=="string"?!1:!!e.sync_power,l=typeof e=="string"?!1:!!e.follow_active_volume,c=typeof e=="string"?void 0:e.hidden_controls;let h;if(typeof e=="object"&&typeof e.group_volume<"u")h=e.group_volume;else{const u=this.hass?.states?.[a];if(u&&Array.isArray(u.attributes.group_members)&&u.attributes.group_members.length>0){const p=u.attributes.group_members.filter(f=>f!==a),m=this.config.entities.map(f=>typeof f=="string"?f:f.entity_id);h=p.filter(f=>m.includes(f)).length>0}}return{entity_id:a,name:r,volume_entity:s,music_assistant_entity:n,sync_power:o,follow_active_volume:l,hidden_controls:c,hidden_filter_chips:typeof e=="string"?void 0:e.hidden_filter_chips,disable_auto_select:this._isAutoSelectDisabled(t),...typeof h<"u"?{group_volume:h}:{}}})}_getEntityForPurpose(e,t){const a=this.entityObjs[e];if(!a)return null;switch(t){case"volume_control":return a.follow_active_volume?this._getActivePlaybackEntityForIndex(e)||a.entity_id:this._resolveEntity(a.volume_entity,a.entity_id,e)||a.entity_id;case"volume_display":return a.follow_active_volume?this._getActivePlaybackEntityForIndex(e)||a.entity_id:this._resolveEntity(a.volume_entity,a.entity_id,e)||a.entity_id;case"grouping_control":const r=this.hass.states[a.entity_id];return this._isGroupCapable(r)?a.entity_id:this._resolveEntity(a.music_assistant_entity,a.entity_id,e)||a.entity_id;case"playback_control":return this._getActivePlaybackEntityForIndex(e)||a.entity_id;case"sorting":return this._getActivePlaybackEntityForIndex(e)||a.entity_id;default:return a.entity_id}}_resolveEntity(e,t,a){return e?typeof e=="string"&&(e.includes("{{")||e.includes("{%"))?this._maResolveCache?.[a]?.id||t:e:null}_getActivePlaybackEntityForIndex(e){const t=this.entityObjs[e];if(!t)return null;const a=t.entity_id,r=this._resolveEntity(t.music_assistant_entity,t.entity_id,e),s=a?this.hass?.states?.[a]:null,n=r?this.hass?.states?.[r]:null;return r===a?a:this._getActivePlaybackEntityForIndexInternal(e,a,r,s,n)}_getActivePlaybackEntityForIndexInternal(e,t,a,r,s){const n=this._lastResolvedEntityIdByChip[e],o=m=>(this._lastResolvedEntityIdByChip[e]=m,m),l=this._playbackLingerByIdx?.[e],c=Date.now();if(l&&l.until>c)return this._isEntityPlaying(r)&&this._lastPlayingEntityIdByChip?.[e]===t?o(t):o(l.entityId);l&&l.until<=c&&delete this._playbackLingerByIdx[e];const h=this._isEntityPlaying(s),u=this._isEntityPlaying(r);if(h&&u)return o(n===t?t:a);if(h)return o(a);if(u)return o(t);const p=this._lastPlayingEntityIdByChip?.[e];if(p===a)return o(a);if(p===t)return o(t);if(a&&a!==t){const m=a===n;return t===n&&r&&r.state!=="off"&&r.state!=="unavailable"?o(t):(m&&s&&s.state!=="off"&&s.state,o(a))}else return o(t)}_getVolumeEntity(e){return this._getEntityForPurpose(e,"volume_control")}_getVolumeEntityForGrouping(e){return this._getEntityForPurpose(e,"grouping_control")}_getSearchEntityId(e){const t=this.entityObjs[e];return!t||!t.music_assistant_entity?t?.entity_id:(typeof t.music_assistant_entity=="string"&&(t.music_assistant_entity.includes("{{")||t.music_assistant_entity.includes("{%")),t.music_assistant_entity)}_getPlaybackEntityId(e){return this._getEntityForPurpose(e,"playback_control")}_getActivePlaybackEntityId(e=this._selectedIndex){const t=this.entityObjs?.[e];if(!t)return null;const a=t.entity_id,r=this._getActualResolvedMaEntityForState(e),s=a?this.hass?.states?.[a]:null,n=r?this.hass?.states?.[r]:null;return this._getActivePlaybackEntityIdInternal(e,a,r,s,n)}_getActivePlaybackEntityIdInternal(e,t,a,r,s){if(a===t)return t;const n=Date.now(),o=this._playTimestamps?.[a]||0,l=this._playTimestamps?.[t]||0,c=this._playerStateCache[a]==="playing"&&s?.state!=="playing",h=this._playerStateCache[t]==="playing"&&r?.state!=="playing",u=c||n-o<5e3,p=h||n-l<5e3;if(this._isEntityPlaying(s))return this._lastActiveEntityIdByChip[e]=a,a;if(u&&s?.state!=="playing")return a;if(this._isEntityPlaying(r))return this._lastActiveEntityIdByChip[e]=t,t;if(p&&r?.state!=="playing")return t;const m=this._lastActiveEntityIdByChip?.[e];return m&&(m===a||m===t)?m:a&&a!==t?a:t}_getHiddenControlsForCurrentEntity(){const e=this.entityObjs[this._selectedIndex];if(!e?.hidden_controls)return{};const t={};return Array.isArray(e.hidden_controls)?e.hidden_controls.forEach(a=>{t[a]=!0}):typeof e.hidden_controls=="object"&&Object.assign(t,e.hidden_controls),t}_getActivePlaybackEntityIdForIndex(e){return this._getActivePlaybackEntityId(e)}_getGroupingEntityId(e){const t=this.entityObjs[e];return t?t.music_assistant_entity?typeof t.music_assistant_entity=="string"&&(t.music_assistant_entity.includes("{{")||t.music_assistant_entity.includes("{%"))?this._maResolveCache?.[e]?.id||t.entity_id:t.music_assistant_entity:t.entity_id:null}_getGroupingEntityIdByEntityId(e){const t=this.entityIds.indexOf(e);return t<0?e:this._getGroupingEntityId(t)}_findEntityObjByAnyId(e){return this.entityObjs.find(t=>t.entity_id===e||t.music_assistant_entity===e)||null}_resolveMusicAssistantEntity(e){const t=this.entityObjs[e];if(!t||!t.music_assistant_entity)return t?.entity_id;try{return typeof t.music_assistant_entity=="string"&&(t.music_assistant_entity.includes("{{")||t.music_assistant_entity.includes("{%")),t.music_assistant_entity}catch{return t.entity_id}}_getGroupKey(e){const t=this._getGroupingEntityIdByEntityId(e),a=this.hass?.states?.[t];if(!a||!this._isGroupCapable(a))return e;const r=Array.isArray(a.attributes.group_members)?a.attributes.group_members:[];if(r.length<=1)return e;const s=r[0],n=this.hass?.states?.[s];return this._isGroupCapable(n)?this.entityIds.find(o=>this._getGroupingEntityIdByEntityId(o)===s)||s:e}get entityIds(){return this.entityObjs.map(e=>e.entity_id)}getChipName(e){const t=this.entityObjs.find(a=>a.entity_id===e);return t&&t.name?t.name:this.hass.states[e]?.attributes.friendly_name||e}_getActualGroupMaster(e){if(!e||!e.length)return null;if(!this.hass||e.length===1)return e[0];if(this._lastGroupingMasterId&&e.includes(this._lastGroupingMasterId))return this._lastGroupingMasterId;const t=e.map(a=>{const r=this._getGroupingEntityIdByEntityId(a),s=r?this.hass.states[r]:null;return s?{id:a,groupingId:r,state:s}:null}).filter(Boolean);if(!t.length)return e[0];for(const a of t){const r=a.state?.attributes?.group_members;if(Array.isArray(r)&&r.length>0){const s=r[0],n=t.find(o=>o.groupingId===s);if(n)return n.id}}return e[0]}_getGroupingMasterId(){if(!this.entityIds||!this.entityIds.length)return null;const e=this.groupedSortedEntityIds||[],t=this.currentEntityId||this.entityIds[0];let a=t;if(this._lastGroupingMasterId&&this.entityIds.includes(this._lastGroupingMasterId)){const s=e.find(n=>n.includes(this._lastGroupingMasterId));s&&s.length>1&&s.includes(t)&&(a=this._lastGroupingMasterId)}const r=a?e.find(s=>s.includes(a)):null;if(r&&r.length>1){const s=this._getActualGroupMaster(r);if(s&&this.entityIds.includes(s))return s}return a}_getGroupingMasterIndex(){const e=this._getGroupingMasterId();return e?this.entityIds.indexOf(e):-1}_getGroupingMasterObj(){const e=this._getGroupingMasterIndex();return e>=0?this.entityObjs[e]:null}_resolveGroupingEntityId(e,t){if(!e?.music_assistant_entity)return t;if(typeof e.music_assistant_entity=="string"&&(e.music_assistant_entity.includes("{{")||e.music_assistant_entity.includes("{%"))){const a=this.entityIds.indexOf(t);return this._maResolveCache?.[a]?.id||t}return e.music_assistant_entity}get currentEntityId(){return this.entityIds[this._selectedIndex]}get currentStateObj(){return!this.hass||!this.currentEntityId?null:this.hass.states[this.currentEntityId]}get currentPlaybackEntityId(){return this._getPlaybackEntityId(this._selectedIndex)}get currentPlaybackStateObj(){const e=this._getResolvedPlaybackEntityIdSync(this._selectedIndex);return!this.hass||!e?this.currentStateObj:this.hass.states[e]}get currentActivePlaybackEntityId(){const e=`${this._selectedIndex}-${this.hass?.states?.[this.currentEntityId]?.state}-${this.hass?.states?.[this._getSearchEntityId(this._selectedIndex)]?.state}`;return(this._cachedActivePlaybackEntityId===void 0||this._cachedActivePlaybackEntityKey!==e)&&(this._cachedActivePlaybackEntityId=this._getActivePlaybackEntityId(this._selectedIndex),this._cachedActivePlaybackEntityKey=e),this._cachedActivePlaybackEntityId}get currentActivePlaybackStateObj(){const e=this.currentActivePlaybackEntityId;return e?this.hass?.states?.[e]:null}get currentVolumeStateObj(){const e=this._getVolumeEntity(this._selectedIndex);return e?this.hass.states[e]:null}get isAnyMenuOpen(){return this._showEntityOptions||this._showGrouping||this._showSourceList||this._showTransferQueue||this._showResolvedEntities||this._showSearchInSheet||this._showSourceMenu||!!this._searchActiveOptionsItem||!!this._activeSearchRowMenuId||!!this._queueActionsMenuOpenId}get _isSelectionFlow(){return!!this._addToPlaylistTarget||!!this._searchHierarchy.some(e=>e.type==="select_track_for_playlist")}_renderMainMenu(e,t,a){return _`
      <div class="entity-options-header">
        <button class="entity-options-item close-item" @click=${()=>this._closeEntityOptions()}>
          ${d("common.close")}
        </button>
        <div class="entity-options-divider"></div>
      </div>
      <div class="entity-options-menu ${a?"chips-in-menu":""} entity-options-scroll" style="display:flex; flex-direction:column;">
        <button class="entity-options-item" @click=${()=>{const r=this._getResolvedEntitiesForCurrentChip();r.length===1?(this._openMoreInfoForEntity(r[0]),this._showEntityOptions=!1):this._showResolvedEntities=!0,this.requestUpdate()}}>${d("card.menu.more_info")}</button>
        <button class="entity-options-item" @click=${()=>{this._showSearchSheetInOptions()}}>${d("common.search")}</button>

        ${Array.isArray(e)&&e.length>0?_`
          <button class="entity-options-item" @click=${()=>this._openSourceList()}>${d("card.menu.source")}</button>
        `:v}
        
        ${this._canShowTransferQueueOption()?_`
          <button class="entity-options-item" @click=${()=>this._openTransferQueue()}>${d("card.menu.transfer_queue")}</button>
        `:v}
        
        ${this._renderGroupingMenuOption()}
        
        ${this.config.always_collapsed?v:_`
          <button class="entity-options-item" @click=${()=>{this._lyricsActive=!this._lyricsActive,this._lyricsActive||(this._lastLyricsTrackId=null,this._lastLyricsEntityId=null,this._lastLyricsArtist=null,this._lastLyricsTitle=null),this._showEntityOptions=!1,this.requestUpdate()}}>${d(this._lyricsActive?"card.menu.hide_lyrics":"card.menu.show_lyrics")}</button>
        `}
        
        
        ${t.length?_`
          ${t.map(({action:r,idx:s})=>{const n=this._getActionLabel(r);return _`
              <button
                class="entity-options-item menu-action-item"
                @click=${()=>this._onMenuActionClick(s)}
              >
                ${r.icon?_`
                  <ha-icon
                    class="menu-action-icon"
                    .icon=${r.icon}
                  ></ha-icon>
                `:v}
                ${n?_`<span class="menu-action-label">${n}</span>`:v}
              </button>
            `})}
        `:v}
      </div>
    `}_getChipRowProps(){return{groupedSortedEntityIds:this.groupedSortedEntityIds,entityIds:this.entityIds,selectedEntityId:this.currentEntityId,pinnedIndex:this._pinnedIndex,holdToPin:this._holdToPin,getChipName:e=>this.getChipName(e),getActualGroupMaster:e=>this._getActualGroupMaster(e),artworkHostname:this.config?.artwork_hostname||"",mediaArtworkOverrides:this.config?.media_artwork_overrides||[],fallbackArtwork:this.config?.fallback_artwork||null,getIsChipPlaying:(e,t)=>{const a=this._findEntityObjByAnyId(e)?.entity_id||e,r=this.entityIds.indexOf(a);if(r<0)return!1;const s=this._getEntityForPurpose(r,"playback_control"),n=this.hass?.states?.[s];return this._isEntityPlaying(n)},getChipArt:e=>{const t=this._findEntityObjByAnyId(e)?.entity_id||e,a=this.entityIds.indexOf(t);if(a<0)return null;const r=this._getEntityForPurpose(a,"playback_control"),s=this.hass?.states?.[r],n=this.hass?.states?.[t],o=this._getArtworkUrl(s),l=this._getArtworkUrl(n);return o||l},getIsMaActive:e=>{const t=this._findEntityObjByAnyId(e)?.entity_id||e,a=this.entityIds.indexOf(t);if(a<0)return!1;const r=this.entityObjs[a];if(!r?.music_assistant_entity)return!1;const s=this._getEntityForPurpose(a,"playback_control"),n=this.hass?.states?.[s];return s===this._resolveEntity(r.music_assistant_entity,r.entity_id,a)&&this._isEntityPlaying(n)},isIdle:this._isIdle,hass:this.hass,onChipClick:e=>this._onChipClick(e),onIconClick:(e,t)=>{const a=this.entityIds[e],r=this.groupedSortedEntityIds.find(s=>s.includes(a));r&&r.length>1&&(this._selectedIndex=e,this._showEntityOptions=!0,this._showGrouping=!0,this.requestUpdate())},onPinClick:(e,t)=>{t.stopPropagation(),this._onPinClick(t)},onPointerDown:(e,t)=>this._handleChipPointerDown(e,t),onPointerMove:(e,t)=>this._handleChipPointerMove(e,t),onPointerUp:(e,t)=>this._handleChipPointerUp(e,t),quickGroupingMode:this._quickGroupingMode,getQuickGroupingState:e=>{const t=this.currentEntityId,a=this.entityIds.indexOf(t),r=a>=0?this._getGroupingEntityId(a):t,s=r?this.hass.states[r]:null,n=this._getGroupKey(this.currentEntityId);return this._getGroupPlayerState(e,t,null,s,n)},onQuickGroupClick:(e,t)=>{const a=this.entityIds[e];a&&this._toggleGroup(a)},onDoubleClick:e=>{e.stopPropagation(),!(Date.now()-this._lastChipDoubleTapTime<eu)&&(this._quickGroupingMode=!this._quickGroupingMode,this.requestUpdate())}}}_renderInlineChipRow(e,t){return e?_`
      <div class="chip-row" style="${t?"visibility: hidden; pointer-events: none;":""}">
        ${Ar(this._getChipRowProps())}
      </div>
    `:v}_renderInlineActionRow(e){return!e||!e.length?v:_`
      <div style="${this._showEntityOptions?"visibility: hidden; pointer-events: none;":""}">
        ${zo({actions:e.map(({action:t})=>t),onActionChipClick:t=>{const a=e[t];a&&this._onActionChipClick(a.idx)}})}
      </div>
    `}_renderGroupingMenuOption(){if(this.entityIds.length<=1)return v;const e=this.entityIds.reduce((n,o,l)=>{const c=this._getGroupingEntityId(l),h=this.hass.states[c];return n+(this._isGroupCapable(h)?1:0)},0),t=this._getGroupingEntityId(this._selectedIndex),a=this.hass.states[t],r=this.currentEntityId,s=this._getGroupKey(r)!==r;return e>1&&this._isGroupCapable(a)&&!s?_`
        <button class="entity-options-item" @click=${()=>this._openGrouping()}>${d("card.menu.group_players")}</button>
      `:v}_getGroupPlayerState(e,t,a,r,s){const n=this.entityIds.indexOf(e);if(n<0)return{isGroupable:!1,isBusy:!1,busyLabel:"",grouped:!1};const o=this._getGroupingEntityId(n),l=this.hass.states[o];if(!l||!this._isGroupCapable(l))return{isGroupable:!1,isBusy:!1,busyLabel:"",grouped:!1};const c=this._getGroupKey(e);let h=!1,u="";(c!==e&&c!==s||c===e&&c!==s&&l.attributes?.group_members?.length>1)&&(h=!0,u=d("common.unavailable"));const p=(Array.isArray(r?.attributes?.group_members)?r.attributes.group_members:[]).includes(o),m=e===s,f=this.getChipName(t);let y="";return m?y=d("card.grouping.master"):p?(y=d("card.grouping.unjoin_from","{master}",f),y==="card.grouping.unjoin_from"&&(y=`Unjoin from ${f}`)):(y=d("card.grouping.join_with","{master}",f),y==="card.grouping.join_with"&&(y=`Join with ${f}`)),{isGroupable:!0,isBusy:h,busyLabel:u,grouped:p,isPrimary:m,entityToCheck:o,tooltip:y}}_renderGroupingSheet(){const e=this._getGroupingMasterId(),t=e?this.entityIds.indexOf(e):-1,a=t>=0?this._getGroupingEntityId(t):e,r=a?this.hass.states[a]:null,s=Array.isArray(r?.attributes?.group_members)&&r.attributes.group_members.length>1,n=[];this.entityIds.indexOf(this.currentEntityId);const o=this._getGroupKey(this.currentEntityId);this.entityIds.forEach(y=>{const g=this._getGroupPlayerState(y,this.currentEntityId,null,r,o);g.isGroupable&&n.push({id:y,groupId:g.entityToCheck,isBusy:g.isBusy,busyLabel:g.busyLabel})});const l=this.currentEntityId,c=this.entityIds.indexOf(l),h=c>=0?this._getGroupingEntityId(c):null,u=h?this.hass.states[h]:null,p=u?this._isGroupCapable(u):!1,m=this._getGroupKey(l)!==l;if(!s&&(!p||m))return _`
        <div class="entity-options-header">
          ${this._cardType!=="group_players"?_`
            <button class="entity-options-item close-item" @click=${()=>{this._quickMenuInvoke?this._dismissWithAnimation():this._closeGrouping()}}>
              ${d("common.back")}
            </button>
          `:v}
          <div class="entity-options-divider"></div>
        </div>
        <div class="entity-options-title" style="margin-bottom:8px;">${d("card.grouping.title")}</div>
        <div class="entity-options-item" style="padding:12px; opacity:0.75; text-align:center;">
          ${d(m?"card.grouping.unavailable":"card.grouping.no_players")}
        </div>
      `;const f=[...n].sort((y,g)=>{if(s){if(y.id===e)return-1;if(g.id===e)return 1}else{if(y.id===l)return-1;if(g.id===l)return 1}return y.isBusy===g.isBusy?0:y.isBusy?1:-1});return _`
      <div class="grouping-header group-list-header">
        ${this._cardType!=="group_players"?_`
          <button class="entity-options-item close-item" @click=${()=>{this._quickMenuInvoke?this._dismissWithAnimation():this._closeGrouping()}}>
            ${d("common.back")}
          </button>
        `:v}
      </div>
      <div class="entity-options-title" style="margin-bottom:8px; margin-top:8px;">${d("card.grouping.title")}</div>
      <div style="display:flex; align-items:center; gap:8px; margin-bottom:12px;">
        ${s?_`
          <button class="entity-options-item"
            @click=${()=>this._syncGroupVolume()}
            style="flex:0 0 auto; min-width:140px; text-align:center;">
            ${d("card.grouping.sync_volume")}
          </button>
        `:v}
        <button class="entity-options-item"
          @click=${()=>s?this._ungroupAll():this._groupAll()}
          style="flex:0 0 auto; min-width:140px; text-align:center; margin-left:auto;">
          ${d(s?"card.grouping.ungroup_all":"card.grouping.group_all")}
        </button>
      </div>
      <div class="group-list-scroll">
        ${f.length===0?_`
          <div class="entity-options-item" style="padding:12px; opacity:0.75; text-align:center;">
            ${d("card.grouping.no_players")}
          </div>
        `:f.map(y=>{const g=y.id,x=y.groupId,k=(Array.isArray(r?.attributes?.group_members)?r.attributes.group_members:[]).includes(x),S=this.getChipName(g),E=y.isBusy,U=y.busyLabel,B=this.entityIds.indexOf(g),P=this._getVolumeEntityForGrouping(B)||x,D=this.hass.states[P],q=P?.startsWith&&P.startsWith("remote."),L=Number(D?.attributes?.volume_level||0),M=g===e,N=!M;let H=d(s?M?"card.grouping.master":k?"card.grouping.joined":"card.grouping.available":g===l?"card.grouping.current":"card.grouping.available");return E&&(H=U||"Unavailable"),_`
            <div class="entity-options-item group-player-row" style="
              display:flex;
              align-items:center;
              gap:6px;
              padding:4px 8px;
              margin-bottom:1px;
              ${E?"opacity: 0.5;":""}
            ">
              <div style="flex:1; min-width:120px;">
                <div style="text-align:left;">${S}</div>
                <div style="font-size:0.8em; opacity:0.7; text-align:left;">${H}</div>
              </div>
              <div style="flex:1.8;display:flex;align-items:center;gap:4px;margin:0 6px; min-width:160px;">
                ${q?_`
                    <div class="vol-stepper" style="display:flex;align-items:center;gap:4px;">
                      <button @click=${()=>this._onGroupVolumeStep(P,-1)} title="Vol Down" style="background:none;border:none;padding:0;width:28px;height:28px;display:flex;align-items:center;justify-content:center;color:inherit;">
                        <ha-icon icon="mdi:minus"></ha-icon>
                      </button>
                      <button @click=${()=>this._onGroupVolumeStep(P,1)} title="Vol Up" style="background:none;border:none;padding:0;width:28px;height:28px;display:flex;align-items:center;justify-content:center;color:inherit;">
                        <ha-icon icon="mdi:plus"></ha-icon>
                      </button>
                    </div>
                  `:_`
                    <input
                      class="vol-slider"
                      type="range"
                      min="0"
                      max="1"
                      step="0.01"
                      .value=${L}
                      @change=${te=>this._onGroupVolumeChange(g,P,te)}
                      title="Volume"
                      style="width:100%;max-width:260px;"
                    />
                  `}
                <span style="min-width:36px;display:inline-block;text-align:right;">${typeof L=="number"?Math.round(L*100)+"%":"--"}</span>
              </div>
              ${N?_`
                    <button class="group-toggle-btn"
                            @click=${()=>!E&&this._toggleGroup(g)}
                            title=${E?"Player is unavailable":k?"Unjoin":"Join"}
                            style="margin-left:4px; ${E?"cursor: not-allowed; opacity: 0.5;":""}">
                      <ha-icon icon=${k?"mdi:minus-circle-outline":"mdi:plus-circle-outline"}></ha-icon>
                    </button>
                  `:_`<span style="margin-left:4px;margin-right:10px;width:32px;display:inline-block;"></span>`}
            </div>
          `})}
      </div>
    `}_renderTransferQueueSheet(){const e=this._getTransferQueueTargets();return _`
      <div class="entity-options-header">
        <button class="entity-options-item close-item" @click=${()=>{this._quickMenuInvoke?this._dismissWithAnimation():this._closeTransferQueue()}}>
          ${d("common.back")}
        </button>
        <div class="entity-options-divider"></div>
        <div class="entity-options-title" style="margin-bottom:12px;">${d("card.menu.transfer_to")}</div>
      </div>
      <div class="entity-options-scroll">
        ${e.length?_`
          <div style="display:flex;flex-direction:column;gap:8px;">
            ${e.map(t=>_`
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
                ${t.state?_`<div style="margin-left:auto;font-size:0.82em;opacity:0.7;text-transform:capitalize;">${t.state}</div>`:v}
              </button>
            `)}
          </div>
        `:_`
          <div style="padding: 12px; opacity: 0.75;">${d("card.menu.no_players")}</div>
        `}
        ${this._transferQueueStatus?_`
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
    `}_renderResolvedEntitiesSheet(){return _`
      <div class="entity-options-header">
        <button class="entity-options-item close-item" @click=${()=>{this._showResolvedEntities=!1,this.requestUpdate()}}>
          ${d("common.back")}
        </button>
        <div class="entity-options-divider"></div>
        <div class="entity-options-resolved-entities" style="margin-top:12px;">
          <div class="entity-options-title">${d("card.menu.select_entity")}</div>
          <div class="entity-options-resolved-entities-list">
            ${this._getResolvedEntitiesForCurrentChip().map(e=>{const t=this.hass?.states?.[e],a=t?.attributes?.friendly_name||e,r=t?.attributes?.icon||"mdi:help-circle",s=this._selectedIndex,n=this.entityObjs[s];let o="Main Entity",l=!1;if(n){const c=this._getActualResolvedMaEntityForState(s),h=this._getVolumeEntity(s);l=(this._getActivePlaybackEntityForIndex(s)||n.entity_id)===e,e===c&&c!==n.entity_id?o="Music Assistant Entity":e===h&&h!==n.entity_id&&h!==c&&(o="Volume Entity")}return _`
                <button class="entity-options-item" @click=${()=>{this._openMoreInfoForEntity(e),this._showEntityOptions=!1,this._showResolvedEntities=!1,this.requestUpdate()}}>
                  <ha-icon .icon=${r} style="margin-right: 8px;"></ha-icon>
                  <div style="display: flex; flex-direction: column; align-items: flex-start;">
                    <div>${l?`${a} (Active)`:a}</div>
                    <div style="font-size: 0.85em; opacity: 0.7;">${o}</div>
                  </div>
                </button>
              `})}
          </div>
        </div>
      </div>
    `}async _fetchLyrics(){if(!this._lyricsActive||this._isIdle||this.isAnyMenuOpen){this._fetchingLyrics=!1,this.requestUpdate();return}this._lyricsError=!1;const e=this.config.lyrics_source||"mass_lrclib",t=this.currentActivePlaybackStateObj||this.currentPlaybackStateObj||this.currentStateObj;if(!t){this._massLyrics=[],this.requestUpdate();return}const a=t.attributes.media_artist,r=t.attributes.media_title,s=t.attributes.media_album_name,n=t.attributes.media_duration,o=t.attributes.media_content_id,l=o?`${o}:${a}:${r}`:`${a}:${r}`;if(this._fetchingLyrics&&this._fetchingCacheKey===l)return;if(this._lyricsCache.has(l)){const u=this._lyricsCache.get(l);this._lyricsCache.delete(l),this._lyricsCache.set(l,u),this._massLyrics=u,this._fetchingLyrics=!1,this.requestUpdate();return}const c=Symbol();this._currentFetchToken=c,this._fetchingLyrics=!0,this._fetchingCacheKey=l,this._massLyrics=[],this.requestUpdate();let h=[];try{if(e==="mass")h=await this._getMassLyrics(t,c);else if(e==="lrclib")h=await this._getLrclibLyrics(a,r,s,n,c);else{const u=this._getMassLyrics(t,c),p=this._getLrclibLyrics(a,r,s,n,c),m=e==="mass_lrclib",f=async(x,k)=>{const S=await x;if(this._currentFetchToken!==c)return null;if(S&&S.length>0){const E=k==="mass"&&m||k==="lrclib"&&!m;(!this._massLyrics||this._massLyrics.length===0||E)&&(this._massLyrics=S||[],this._fetchingLyrics=!1,this.requestUpdate())}return S},[y,g]=await Promise.all([f(u,"mass"),f(p,"lrclib")]);if(this._currentFetchToken!==c)return;m?h=y&&y.length>0?y:g:h=g&&g.length>0?g:y}if(this._currentFetchToken===c){if(this._massLyrics=h||[],h&&h.length>0){if(this._lyricsCache.size>=Kd){const u=this._lyricsCache.keys().next().value;this._lyricsCache.delete(u)}this._lyricsCache.set(l,h)}else h===null&&(this._lyricsError=!0);this._fetchingLyrics=!1,this._fetchingCacheKey=null,this.requestUpdate()}}catch(u){this._currentFetchToken===c&&(console.error("YAMP: Failed to fetch lyrics:",u),this._lyricsError=!0,this._fetchingLyrics=!1,this._fetchingCacheKey=null,this.requestUpdate())}}async _getMassLyrics(e,t){if(this._hasMassQueueIntegration===!1)return[];if(!this._massQueueAvailable){if(this._massQueueAvailable=await this._isMassQueueIntegrationAvailable(this.hass),this._hasMassQueueIntegration=this._massQueueAvailable,!this._massQueueAvailable)return[];if(this._currentFetchToken!==t)return[]}try{const a=await mi(this.hass);if(!a)return[];const r=e.attributes.media_content_id;if(!r||!r.includes("://"))return[];const s={type:"call_service",domain:"mass_queue",service:"send_command",service_data:{command:"music/item_by_uri",data:{uri:r},config_entry_id:a},return_response:!0},n=await this.hass.connection.sendMessagePromise(s);if(this._currentFetchToken!==t)return[];const o=n?.response?.response||n?.response||n?.result;if(!o)return[];const l={type:"call_service",domain:"mass_queue",service:"send_command",service_data:{command:"metadata/get_track_lyrics",data:{track:o},config_entry_id:a},return_response:!0},c=await this.hass.connection.sendMessagePromise(l);if(this._currentFetchToken!==t)return[];const h=c?.response?.response||c?.response||c?.result;if(h){let u="";return Array.isArray(h)?u=h[1]||h[0]||"":typeof h=="string"?u=h:typeof h=="object"&&(u=h.lyrics||h.text||""),u?Fr(u):[]}}catch(a){console.warn("YAMP: MA Lyrics fetch failed:",a)}return[]}async _getLrclibLyrics(e,t,a,r,s){if(!e||!t)return[];const n=this._cleanTrackMetadata(e),o=this._cleanTrackMetadata(t),l=a?this._cleanTrackMetadata(a):"";try{let c=`https://lrclib.net/api/get?artist_name=${encodeURIComponent(n)}&track_name=${encodeURIComponent(o)}`;l&&(c+=`&album_name=${encodeURIComponent(l)}`),r&&(c+=`&duration=${Math.round(r)}`);let h=await fetch(c);if(this._currentFetchToken!==s)return[];if(!h.ok&&h.status!==404)throw new Error(`LRCLIB error: ${h.status}`);let u=null;if(h.ok)u=await h.json();else{const p=`https://lrclib.net/api/search?artist_name=${encodeURIComponent(n)}&track_name=${encodeURIComponent(o)}`,m=await fetch(p);if(this._currentFetchToken!==s)return[];if(m.ok){const f=await m.json();f&&f.length>0&&(u=f[0])}}if(u){if(u.instrumental)return[{time:null,text:d("lyrics.instrumental")||"Instrumental Track"}];const p=u.syncedLyrics||u.plainLyrics||"";return p?Fr(p):[]}}catch(c){console.warn("YAMP: LRCLIB Lyrics fetch failed:",c)}return[]}updated(e){if(this._updateHostAttributes(),this._idleImageTemplate&&e.has("hass")&&(this._idleImageTemplateNeedsResolve=!0),(e.has("_selectedIndex")||e.has("hass"))&&this._updateTransferQueueAvailability({refresh:!1}),this.hass&&this._hasMassQueueIntegration===null&&!this._checkingMassQueueIntegration&&(this._checkingMassQueueIntegration=!0,this._isMassQueueIntegrationAvailable(this.hass).then(r=>{this._hasMassQueueIntegration=r,r&&(this._massQueueAvailable=this._massQueueAvailable||r)}).catch(()=>{this._hasMassQueueIntegration=!1}).finally(()=>{this._checkingMassQueueIntegration=!1,this.requestUpdate()})),this.hass&&this.entityIds){if(this._upcomingFilterActive){const o=this.currentActivePlaybackEntityId;if(o){const l=this.hass.states[o]?.attributes?.media_title;if(l&&l!==this._lastMediaTitle&&(this._lastMediaTitle=l,this._upcomingFilterActive)){const c=Date.now();this._latestManualShiftTime&&c-this._latestManualShiftTime<4e3||this._advanceQueueInUI(null,!1),this._refreshQueue({delayMs:2e4})}}}const r=Date.now();for(let o=0;o<this.entityIds.length;o++){const l=this.entityIds[o],c=this.entityObjs[o];if(!c)continue;const h=c.entity_id,u=this._getActualResolvedMaEntityForState(o),p=this.hass.states[h]?.state,m=this._playerStateCache[h];if(p==="playing"?(this._playTimestamps[h]=r,this._lastActiveEntityIdByChip[o]=h):m==="playing"&&p!=="playing"&&(this._playTimestamps[h]=r),this._playerStateCache[h]=p,u&&u!==h){const y=this.hass.states[u]?.state,g=this._playerStateCache[u];y==="playing"?(this._playTimestamps[u]=r,this._lastActiveEntityIdByChip[o]=u):g==="playing"&&y!=="playing"&&(this._playTimestamps[u]=r),this._playerStateCache[u]=y}const f=this._getEntityForPurpose(o,"sorting");f&&this.hass.states[f]?.state==="playing"&&(this._playTimestamps[l]=r)}if(this._manualSelect&&this._pinnedIndex===null&&this._manualSelectPlayingSet){for(const o of[...this._manualSelectPlayingSet]){const l=this.hass.states[o];this._isEntityPlaying(l)||this._manualSelectPlayingSet.delete(o)}for(const o of this.entityIds){const l=this.hass.states[o];if(this._isEntityPlaying(l)&&!this._manualSelectPlayingSet.has(o)){this._manualSelect=!1,this._manualSelectPlayingSet=null;break}}}if(this._updateIdleState(),!this._manualSelect&&!this.isAnyMenuOpen){const o=this.sortedEntityIds;if(o.length>0){let l=o[0];const c=l?(this.groupedSortedEntityIds||[]).find(f=>f.includes(l)):null;if(c&&c.length>1){const f=this._getActualGroupMaster(c);f&&(l=f)}const h=this.entityIds.indexOf(l),u=h>=0?this._getEntityForPurpose(h,"sorting"):null,p=u?this.hass.states[u]:null,m=this._isCurrentEntityPlaying();this._isEntityPlaying(p)&&this.entityIds[this._selectedIndex]!==l&&(!this._idleTimeout||!this._hasSeenPlayback)&&!m&&!this.entityObjs[h]?.disable_auto_select&&(this._selectedIndex=h)}}const s=this.entityIds[this._selectedIndex],n=s?(this.groupedSortedEntityIds||[]).find(o=>o.includes(s)):null;if(n&&n.length>1){const o=this._getActualGroupMaster(n);if(o&&o!==s){const l=this.entityIds.indexOf(o);l>=0&&!this.entityObjs[l]?.disable_auto_select&&(this._selectedIndex=l,this._lastGroupingMasterId=o)}}this._ensureResolvedMaForIndex(this._selectedIndex),this._ensureResolvedVolForIndex(this._selectedIndex),this._updateSelectedEntityHelper(),this._handleSelectEntityFromHelper()}if(this._lyricsActive){const r=this.currentActivePlaybackStateObj||this.currentPlaybackStateObj||this.currentStateObj,s=r?.attributes?.media_content_id||null,n=r?.attributes?.media_artist||null,o=r?.attributes?.media_title||null,l=this.currentActivePlaybackEntityId||this.currentEntityId||null,c=!!(s||n||o),h=s!==this._lastLyricsTrackId||n!==this._lastLyricsArtist||o!==this._lastLyricsTitle||l!==this._lastLyricsEntityId;c&&h&&!this._isIdle&&!this.isAnyMenuOpen?(this._lastLyricsTrackId=s,this._lastLyricsArtist=n,this._lastLyricsTitle=o,this._lastLyricsEntityId=l,this._fetchingLyrics=!0,this._lyricsError=!1,this._lyricsFetchTimeout&&clearTimeout(this._lyricsFetchTimeout),this._lyricsFetchTimeout=setTimeout(()=>{this._fetchLyrics(),this._lyricsFetchTimeout=null},500)):!c&&h&&(this._lastLyricsTrackId=null,this._lastLyricsArtist=null,this._lastLyricsTitle=null,this._lastLyricsEntityId=l,this._lyricsFetchTimeout&&clearTimeout(this._lyricsFetchTimeout),this._massLyrics=[],this._fetchingLyrics=!1,this._lyricsError=!1,this.requestUpdate())}super.updated?.(e),this._progressTimer&&(clearInterval(this._progressTimer),this._progressTimer=null);const t=this.currentActivePlaybackStateObj||this.currentPlaybackStateObj||this.currentStateObj;if(this._isEntityPlaying(t)&&t.attributes.media_duration&&(this._progressTimer=setInterval(()=>{this.requestUpdate()},500)),this._alwaysCollapsed&&this._expandOnSearch&&this._showSearchInSheet){this._prevCollapsed!==!1&&(this._prevCollapsed=!1,this._notifyResize());return}const a=this._alwaysCollapsed?!0:this._collapseOnIdle?this._isIdle:!1;if(this._prevCollapsed!==a&&(this._prevCollapsed=a,this._notifyResize()),this._addGrabScroll(".chip-row"),this._addGrabScroll(".action-chip-row"),this._addGrabScroll(".search-filter-chips"),this._addVerticalGrabScroll(".floating-source-index"),this._lastRenderedCollapsed&&!this._lastRenderedHideControls){const r=this.renderRoot?.querySelector(".card-lower-content");if(r){const s=r.offsetHeight;if(s&&s>0){const n=Number(this.config?.card_height);Number.isFinite(n)&&n>0?(!this._collapsedBaselineHeight||s<this._collapsedBaselineHeight-1)&&(this._collapsedBaselineHeight=s):this._collapsedBaselineHeight=s}}}this._showSearchInSheet&&(this._alwaysCollapsed&&this._expandOnSearch,setTimeout(()=>{const r=()=>{const o=this.renderRoot.querySelector("#search-input-box");return o?(o.focus(),this._searchInputAutoFocused=!0,!0):!1};!this._disableSearchAutofocus&&!this._searchInputAutoFocused&&(r()||setTimeout(()=>{this._showSearchInSheet&&!this._disableSearchAutofocus&&!this._searchInputAutoFocused&&r()},200));const s=this._getVisibleSearchFilterClasses().join(",");if((!this._searchLoading||s)&&this._lastSearchChipClasses!==s){const o=this.renderRoot.querySelector(".search-filter-chips");o&&(o.scrollLeft=0);const l=this.renderRoot.querySelector(".entity-options-overlay");l&&(l.scrollTop=0);const c=this.renderRoot.querySelector(".entity-options-sheet");c&&(c.scrollTop=0),this._lastSearchChipClasses=s}const n=this.renderRoot.querySelector("#search-filter-chip-row");n&&(n.scrollWidth>n.clientWidth+2?n.style.justifyContent="flex-start":n.style.justifyContent="center")},200)),this._showSourceList&&setTimeout(()=>{const r=this.renderRoot.querySelector(".entity-options-overlay");r&&(r.scrollTop=0)},0)}_toggleSourceMenu(){this._showSourceMenu=!this._showSourceMenu,this._showSourceMenu?(this._manualSelect=!0,setTimeout(()=>{this._shouldDropdownOpenUp=!0,this.requestUpdate(),this._addSourceDropdownOutsideHandler()},0)):(this._manualSelect=!1,this._removeSourceDropdownOutsideHandler())}_addSourceDropdownOutsideHandler(){this._sourceDropdownOutsideHandler||(this._sourceDropdownOutsideHandler=e=>{const t=this.renderRoot.querySelector(".source-dropdown"),a=this.renderRoot.querySelector(".source-menu-btn"),r=e.composedPath?e.composedPath():[];t&&r.includes(t)||a&&r.includes(a)||(this._showSourceMenu=!1,this._manualSelect=!1,this._removeSourceDropdownOutsideHandler(),this.requestUpdate())},window.addEventListener("mousedown",this._sourceDropdownOutsideHandler,!0),window.addEventListener("touchstart",this._sourceDropdownOutsideHandler,!0))}_removeSourceDropdownOutsideHandler(){this._sourceDropdownOutsideHandler&&(window.removeEventListener("mousedown",this._sourceDropdownOutsideHandler,!0),window.removeEventListener("touchstart",this._sourceDropdownOutsideHandler,!0),this._sourceDropdownOutsideHandler=null)}_selectSource(e){const t=this.currentEntityId;!t||!e||(this.hass.callService("media_player","select_source",{entity_id:t,source:e}),this._closeEntityOptions())}_onPinClick(e){e.stopPropagation(),this._manualSelect=!1,this._pinnedIndex=null,this._manualSelectPlayingSet=null}_onChipClick(e){if(this._holdToPin&&this._justPinned){this._justPinned=!1;return}if(this._selectedIndex=e,this._lastActiveEntityId=null,clearTimeout(this._manualSelectTimeout),this._holdToPin)if(this._pinnedIndex!==null)this._manualSelect=!0;else{this._manualSelect=!0,this._manualSelectPlayingSet=new Set;for(const t of this.entityIds){const a=this.hass?.states?.[t];this._isEntityPlaying(a)&&this._manualSelectPlayingSet.add(t)}}else this._manualSelect=!0,this._pinnedIndex=e;this.requestUpdate()}_pinChip(e){this._justPinned=!0,clearTimeout(this._manualSelectTimeout),this._manualSelectPlayingSet=null,this._pinnedIndex=e,this._manualSelect=!0,this.requestUpdate()}async _onActionChipClick(e){const t=this.config.actions[e];t&&await this._handleAction(t)}async _handleAction(e){if(!e)return;if(e.menu_item){switch(this._quickMenuInvoke=!0,e.menu_item){case"more-info":this._openMoreInfo(),this._showEntityOptions=!1,this.requestUpdate();break;case"group-players":this._showEntityOptions=!0,this._showGrouping=!0,this.requestUpdate();break;case"search":this._openQuickSearchOverlay();break;case"search-recently-played":this._showEntityOptions=!0,this._showSearchSheetInOptions("recently-played"),setTimeout(()=>{this._notifyResize()},0);break;case"search-next-up":this._showEntityOptions=!0,this._showSearchSheetInOptions("next-up"),setTimeout(()=>{this._notifyResize()},0);break;case"source":this._showEntityOptions=!0,this._showSourceList=!0,this._showGrouping=!1,this.requestUpdate();break;case"transfer-queue":this._showEntityOptions=!0,this._openTransferQueue();break}return}if(typeof e.navigation_path=="string"&&e.navigation_path.trim()!==""||e.action==="navigate"){let s=(typeof e.navigation_path=="string"?e.navigation_path:e.path||"").trim();const n=e.navigation_new_tab===!0,o={current:this.currentActivePlaybackEntityId||this.currentEntityId||""};let l=null;n&&(l=Mo(this.hass,s,o)),l!=null?this._handleNavigate(l,n):(s=await To(this.hass,s,o),this._handleNavigate(s,n));return}if(e.action==="toggle_lyrics"){this._lyricsActive=!this._lyricsActive,this.requestUpdate();return}if(e.action==="prev_entity"||e.action==="next_entity"){const s=this.sortedEntityIds;if(s&&s.length>0){const n=this.entityIds[this._selectedIndex],o=s.indexOf(n);if(o!==-1){let l=o;if(e.action==="prev_entity"?l=Math.max(0,o-1):l=Math.min(s.length-1,o+1),l!==o){const c=s[l],h=this.entityIds.indexOf(c);h!==-1&&h!==this._selectedIndex&&this._onChipClick(h)}}}return}if(!e.service)return;const[t,a]=e.service.split(".");let r={...e.service_data||{}};if(t==="script"&&e.script_variable===!0){const s=this.currentEntityId,n=this._getSearchEntityId(this._selectedIndex),o=await this._resolveTemplateAtActionTime(n,s),l=this.currentActivePlaybackEntityId||this._getPlaybackEntityId(this._selectedIndex),c=await this._resolveTemplateAtActionTime(l,s);(r.entity_id==="current"||r.entity_id==="$current"||r.entity_id==="this")&&delete r.entity_id,r.yamp_entity=o||s,r.yamp_main_entity=s,r.yamp_playback_entity=c}else if(!(t==="script"&&e.script_variable===!0)&&(r.entity_id==="current"||r.entity_id==="$current"||r.entity_id==="this"||!r.entity_id))if(t==="music_assistant"){const s=this._getSearchEntityId(this._selectedIndex);r.entity_id=await this._resolveTemplateAtActionTime(s,this.currentEntityId)}else if(t==="media_player"){const s=this.currentActivePlaybackEntityId||this._getPlaybackEntityId(this._selectedIndex);r.entity_id=await this._resolveTemplateAtActionTime(s,this.currentEntityId)}else r.entity_id=this.currentEntityId;this.hass.callService(t,a,r)}_onTapAreaPointerDown(e){this.isAnyMenuOpen||e.composedPath().some(t=>t.tagName==="BUTTON"||t.tagName==="HA-ICON"||t.tagName==="INPUT"||t.classList&&t.classList.contains("clickable-artist")||t.classList&&t.classList.contains("details"))||(this._gestureActive=!0,this._gestureStartTime=Date.now(),this._gestureStartX=e.clientX,this._gestureStartY=e.clientY,this._gestureHoldTriggered=!1,this._gestureTapArea=e.currentTarget,this._cardTriggers?.hold&&(this._gestureHoldTimer=setTimeout(()=>{this._gestureActive&&(this._gestureHoldTriggered=!0,this._showGestureFeedback("hold",this._gestureStartX,this._gestureStartY),this._handleAction(this._cardTriggers.hold))},vn)))}_onTapAreaPointerMove(e){if(this.isAnyMenuOpen||!this._gestureActive)return;const t=Math.abs(e.clientX-this._gestureStartX),a=Math.abs(e.clientY-this._gestureStartY);(t>It||a>It)&&clearTimeout(this._gestureHoldTimer)}_onTapAreaPointerUp(e){if(this.isAnyMenuOpen||!this._gestureActive||(this._gestureActive=!1,clearTimeout(this._gestureHoldTimer),this._gestureHoldTriggered)||Date.now()-this._gestureStartTime>vn)return;const t=e.clientX-this._gestureStartX,a=e.clientY-this._gestureStartY,r=Math.abs(t),s=Math.abs(a);if(r>=bn&&s<bn){clearTimeout(this._tapTimer);const h=e.clientX,u=e.clientY;if(t<0&&this._cardTriggers?.swipe_left){this._showGestureFeedback("swipe_left",h,u),this._handleAction(this._cardTriggers.swipe_left);return}else if(t>0&&this._cardTriggers?.swipe_right){this._showGestureFeedback("swipe_right",h,u),this._handleAction(this._cardTriggers.swipe_right);return}}if(r>It||s>It)return;const n=Date.now(),o=n-(this._lastTapTime||0);this._lastTapTime=n;const l=e.clientX,c=e.clientY;o<gn?(clearTimeout(this._tapTimer),this._cardTriggers?.double_tap&&(this._showGestureFeedback("double_tap",l,c),this._handleAction(this._cardTriggers.double_tap))):this._tapTimer=setTimeout(()=>{this._cardTriggers?.tap&&(this._showGestureFeedback("tap",l,c),this._handleAction(this._cardTriggers.tap))},tu)}_showGestureFeedback(e,t,a){const r=this._gestureTapArea||this.shadowRoot?.querySelector(".card-artwork-spacer")||this.shadowRoot?.querySelector(".collapsed-artwork-container");if(!r)return;const s=r.getBoundingClientRect(),n=t-s.left,o=a-s.top,l=document.createElement("div");l.className=`gesture-ripple ${e}`,l.style.left=`${n}px`,l.style.top=`${o}px`;let c=r.querySelector(".gesture-feedback-container");c||(c=document.createElement("div"),c.className="gesture-feedback-container",r.appendChild(c)),l.addEventListener("animationend",()=>l.remove()),c.appendChild(l)}_onMenuActionClick(e){const t=this.config.actions?.[e];t&&(t.menu_item||(this._quickMenuInvoke=!0),this._onActionChipClick(e),t.menu_item||this._dismissWithAnimation())}_getActionLabel(e){if(!e)return"";if(typeof e.name=="string"&&e.name.trim()!=="")return e.name.trim();const t=!!e.icon;return e.menu_item?t?"":{search:"Search","search-recently-played":"Recently Played","search-next-up":"Next Up",source:"Source","more-info":"More Info","group-players":"Group Players","transfer-queue":"Transfer Queue"}[e.menu_item]??e.menu_item:typeof e.navigation_path=="string"&&e.navigation_path.trim()!==""||e.action==="navigate"?t?"":"Navigate":e.service?t?"":e.service:t?"":"Action"}async _onControlClick(e){const t=this._getEntityForPurpose(this._selectedIndex,"playback_control");if(!t)return;const a=this.hass?.states?.[t]||this.currentStateObj;switch(e){case"play_pause":this._isEntityPlaying(a)?(this.hass.callService("media_player","media_pause",{entity_id:t}),this._lastPlayingEntityIdByChip||(this._lastPlayingEntityIdByChip={}),this._lastPlayingEntityIdByChip[this._selectedIndex]=t,this._pauseTimestamps||(this._pauseTimestamps={}),this._pauseTimestamps[this._selectedIndex]=Date.now(),this._controlFocusEntityId=t,this._optimisticPlayback={entity_id:t,state:"paused",ts:Date.now()},this.requestUpdate(),setTimeout(()=>{this._optimisticPlayback=null,this.requestUpdate()},1200)):(this.hass.callService("media_player","media_play",{entity_id:t}),this._lastPlayingEntityIdByChip&&delete this._lastPlayingEntityIdByChip[this._selectedIndex],this._pauseTimestamps&&delete this._pauseTimestamps[this._selectedIndex],this._controlFocusEntityId=t,this._optimisticPlayback={entity_id:t,state:"playing",ts:Date.now()},this.requestUpdate(),setTimeout(()=>{this._optimisticPlayback=null,this.requestUpdate()},1200));break;case"next":this._advanceQueueInUI(null,!0),this.hass.callService("media_player","media_next_track",{entity_id:t});break;case"prev":this.hass.callService("media_player","media_previous_track",{entity_id:t});break;case"stop":if(this.hass.callService("media_player","media_stop",{entity_id:t}),a){const r=t;this._optimisticPlayback={entity_id:r,state:"idle",ts:Date.now()},this.requestUpdate(),setTimeout(()=>{this._optimisticPlayback=null,this.requestUpdate()},1200)}break;case"shuffle":{const r=!!a.attributes.shuffle;this.hass.callService("media_player","shuffle_set",{entity_id:t,shuffle:!r});break}case"repeat":{let r=a.attributes.repeat||"off",s;r==="off"?s="all":r==="all"?s="one":s="off",this.hass.callService("media_player","repeat_set",{entity_id:t,repeat:s});break}case"power":{const r=this.currentEntityId,s=(this.hass?.states?.[r]||a)?.state==="off"?"turn_on":"turn_off";this.hass.callService("media_player",s,{entity_id:r});const n=this.entityObjs[this._selectedIndex];if(n&&n.sync_power){const o=this._getVolumeEntity(this._selectedIndex);o&&o!==n.entity_id&&this.hass.callService("media_player",s,{entity_id:o})}break}case"favorite":{const r=this._getFavoriteButtonEntity(),s=this.hass?.states?.[t]?.attributes?.media_content_id,n=this._isCurrentTrackFavorited(),o=await this._isMassQueueIntegrationAvailable(this.hass);if(n&&o){const l=this._getMusicAssistantState()?.entity_id;if(l)try{const c={type:"call_service",domain:"mass_queue",service:"unfavorite_current_item",service_data:{entity:l}};await this.hass.connection.sendMessagePromise(c),s&&(this._favoriteStatusCache||(this._favoriteStatusCache={}),this._favoriteStatusCache[s]={isFavorited:!1}),this._searchResultsByType&&Object.keys(this._searchResultsByType).forEach(h=>{(h.includes("_favorites")||h==="favorites")&&delete this._searchResultsByType[h]}),this._checkingFavorites=null,this.requestUpdate()}catch(c){console.error("yamp: Failed to unfavorite current item:",c)}}else r&&(this.hass.callService("button","press",{entity_id:r}),s&&(this._favoriteStatusCache||(this._favoriteStatusCache={}),this._favoriteStatusCache[s]={isFavorited:!0},this._checkingFavorites=null,this._searchResultsByType&&Object.keys(this._searchResultsByType).forEach(l=>{(l.includes("_favorites")||l==="favorites")&&delete this._searchResultsByType[l]}),this.requestUpdate()));break}}}async _onVolumeChange(e){const t=this._selectedIndex,a=this._getGroupingEntityId(t),r=await this._resolveTemplateAtActionTime(a,this.currentEntityId),s=this.hass.states[r],n=Number(e.target.value),o=this.entityObjs[t];if(!(typeof o.group_volume!="boolean"||o.group_volume)||this._quickGroupingMode){this.hass.callService("media_player","volume_set",{entity_id:this._getVolumeEntity(t),volume_level:n});return}if(this._isCurrentlyGrouped(s)){const l=this.entityObjs[t].entity_id,c=[...new Set([l,...s.attributes.group_members])],h=typeof this._groupBaseVolume=="number"?this._groupBaseVolume:Number(this.currentVolumeStateObj?.attributes.volume_level||0),u=n-h;for(const p of c){for(const g of this.entityObjs){let x;if(g.music_assistant_entity)if(typeof g.music_assistant_entity=="string"&&(g.music_assistant_entity.includes("{{")||g.music_assistant_entity.includes("{%")))try{x=await this._resolveTemplateAtActionTime(g.music_assistant_entity,g.entity_id)}catch{x=g.entity_id}else x=g.music_assistant_entity;else x=g.entity_id;if(x===p)break}const m=p,f=this.hass.states[m];if(!f)continue;let y=Number(f.attributes.volume_level||0)+u;y=Math.max(0,Math.min(1,y)),y=Math.round(y*1e4)/1e4,this.hass.callService("media_player","volume_set",{entity_id:m,volume_level:y})}this._groupBaseVolume=n}else{const l=this._getVolumeEntity(t);this.hass.callService("media_player","volume_set",{entity_id:l,volume_level:n})}}async _onVolumeStep(e){const t=this._selectedIndex,a=this._getVolumeEntity(t);if(!a)return;const r=a.startsWith&&a.startsWith("remote."),s=this.currentVolumeStateObj;if(!s)return;if(r){this.hass.callService("remote","send_command",{entity_id:a,command:e>0?"volume_up":"volume_down"});return}const n=this._getGroupingEntityId(t),o=await this._resolveTemplateAtActionTime(n,this.currentEntityId),l=this.hass.states[o];if(this._isCurrentlyGrouped(l)){const c=this.entityObjs[t].entity_id,h=[...new Set([c,...l.attributes.group_members])],u=this._volumeStep*e;for(const p of h){for(const g of this.entityObjs){let x;if(g.music_assistant_entity)if(typeof g.music_assistant_entity=="string"&&(g.music_assistant_entity.includes("{{")||g.music_assistant_entity.includes("{%")))try{x=await this._resolveTemplateAtActionTime(g.music_assistant_entity,g.entity_id)}catch{x=g.entity_id}else x=g.music_assistant_entity;else x=g.entity_id;if(x===p)break}const m=p,f=this.hass.states[m];if(!f)continue;let y=Number(f.attributes.volume_level||0)+u;y=Math.max(0,Math.min(1,y)),y=Math.round(y*1e4)/1e4,this.hass.callService("media_player","volume_set",{entity_id:m,volume_level:y})}}else{let c=Number(s.attributes.volume_level||0);c+=this._volumeStep*e,c=Math.max(0,Math.min(1,c)),c=Math.round(c*1e4)/1e4,this.hass.callService("media_player","volume_set",{entity_id:a,volume_level:c})}}async _onMuteToggle(){const e=this._selectedIndex,t=this._getVolumeEntity(e);if(!t)return;const a=t.startsWith&&t.startsWith("remote."),r=this.currentVolumeStateObj;if(!r)return;const s=r.attributes.is_volume_muted??!1,n=r.attributes.volume_level??0;if(a){s?this.hass.callService("media_player","volume_set",{entity_id:t,volume_level:.5}):this.hass.callService("media_player","volume_set",{entity_id:t,volume_level:0});return}if(!this._supportsFeature(r,ba)){if(n>0)this._previousVolume=n,this.hass.callService("media_player","volume_set",{entity_id:t,volume_level:0});else{const h=this._previousVolume??.5;this.hass.callService("media_player","volume_set",{entity_id:t,volume_level:h}),this._previousVolume=null}return}let o,l,c;try{o=this._getGroupingEntityId(e),l=await this._resolveTemplateAtActionTime(o,this.currentEntityId),c=this.hass.states[l]}catch(h){console.error("yamp: Error in grouping detection:",h)}if(this._isCurrentlyGrouped(c)){const h=this.entityObjs[e].entity_id,u=[...new Set([h,...c.attributes.group_members])];for(const p of u){const m=p,f=this.hass.states[m];f&&this._supportsFeature(f,ba)?this.hass.callService("media_player","volume_mute",{entity_id:m,is_volume_muted:!s}):(f?.attributes?.volume_level??0)>0?this.hass.callService("media_player","volume_set",{entity_id:m,volume_level:0}):this.hass.callService("media_player","volume_set",{entity_id:m,volume_level:.5})}}else this.hass.callService("media_player","volume_mute",{entity_id:t,is_volume_muted:!s})}_onVolumeDragStart(e){if(!this.hass)return;const t=this.currentVolumeStateObj;this._groupBaseVolume=t?Number(t.attributes.volume_level||0):0}_onVolumeDragEnd(e){this._groupBaseVolume=null}_onGroupVolumeChange(e,t,a){const r=Number(a.target.value);this.hass.callService("media_player","volume_set",{entity_id:t,volume_level:r}),this.requestUpdate()}_onGroupVolumeStep(e,t){this.hass.callService("remote","send_command",{entity_id:e,command:t>0?"volume_up":"volume_down"}),this.requestUpdate()}_onSourceChange(e){const t=this.currentEntityId,a=e.target.value;!t||!a||this.hass.callService("media_player","select_source",{entity_id:t,source:a})}_openMoreInfo(){this.dispatchEvent(new CustomEvent("hass-more-info",{detail:{entityId:this.currentEntityId},bubbles:!0,composed:!0}))}async _onProgressBarClick(e){try{e.stopPropagation();const t=this.currentEntityId,a=this._getActualResolvedMaEntityForState(this._selectedIndex),r=t?this.hass?.states?.[t]:null,s=a?this.hass?.states?.[a]:null;let n;if(this._controlFocusEntityId&&(this._controlFocusEntityId===a||this._controlFocusEntityId===t))n=this._controlFocusEntityId;else if(this._isEntityPlaying(s))n=a;else if(this._isEntityPlaying(r))n=t;else{const p=this._lastPlayingEntityIdByChip?.[this._selectedIndex];if(p&&(p===a||p===t))n=p;else{const m=this._getPlaybackEntityId(this._selectedIndex);n=await this._resolveTemplateAtActionTime(m,this.currentEntityId)}}const o=this.hass?.states?.[n]||this.currentStateObj;if(!n||!o||!o.attributes){console.warn("YAMP: Cannot seek - invalid target or state",n,o);return}const l=o.attributes.media_duration;if(!l)return;const c=e.target.getBoundingClientRect(),h=(e.clientX-c.left)/c.width,u=Math.floor(h*l);this._seekAnchor={position:u,timestamp:Date.now(),trackId:o.attributes.media_content_id||o.attributes.media_title},this._seekConvergenceLock=Date.now()+2e3,this._seekOffset=null,this.requestUpdate(),this.hass.callService("media_player","media_seek",{entity_id:n,seek_position:u})}catch(t){console.error("YAMP: Error in _onProgressBarClick",t)}}_resetSearchContext(){this._searchResultsByType={},this._favoritesFilterActive=!1,this._recentlyPlayedFilterActive=!1,this._upcomingFilterActive=!1,this._recommendationsFilterActive=!1,this._initialFavoritesLoaded=!1,this._loadingSearchRowMenuId=null,this._errorSearchRowMenuId=null}_showSearchSuccessToast(e=null,t=null){this._showQueueSuccessMessage=!0,e&&(this._successSearchRowMenuId=e),t&&(this._successSearchRowType=t),this.requestUpdate(),this._successToastHandle&&clearTimeout(this._successToastHandle),this._successToastHandle=setTimeout(()=>{this._showQueueSuccessMessage=!1,this._successSearchRowMenuId=null,this._successSearchRowType=null,this._successToastHandle=null,this.requestUpdate()},mn)}render(){if(!this.hass||!this.config)return v;const e=this.config.card_height,t=typeof e=="string"?e:Number(e),a=typeof t=="number"&&Number.isFinite(t)&&t>0||typeof t=="string"&&t.trim()!=="",r=this._collapsedBaselineHeight||220,s=this.entityObjs.length===1,n=s&&this.config.always_collapsed===!0&&this.config.expand_on_search!==!0,o=this.config.pin_search_headers===!0&&!n,l=!(this.config.hide_search_headers_on_idle===!0&&this._isIdle);if(this.shadowRoot&&this.shadowRoot.host){this.shadowRoot.host.setAttribute("data-match-theme",String(this.config.match_theme===!0)),this.shadowRoot.host.setAttribute("data-always-collapsed",String(this.config.always_collapsed===!0)),this.shadowRoot.host.setAttribute("data-card-type",this.config.card_type||"default");const b=this.config.always_collapsed===!0&&this.config.pin_search_headers===!0&&this.config.expand_on_search===!0;this.shadowRoot.host.setAttribute("data-hide-menu-player",String(this.config.hide_menu_player===!0||b)),this.shadowRoot.host.setAttribute("data-extend-artwork",String(this.config.extend_artwork===!0)),this.shadowRoot.host.setAttribute("data-control-layout",this._controlLayout),this.shadowRoot.host.setAttribute("data-details-alignment",this.config.details_alignment||"left"),this.shadowRoot.host.setAttribute("data-pin-search-headers",String(o)),a?this.shadowRoot.host.setAttribute("data-has-custom-height","true"):this.shadowRoot.host.removeAttribute("data-has-custom-height")}const c=this.config.show_chip_row||"auto",h=this.entityObjs.length>1,u=(c==="in_menu"||c==="in_menu_on_idle"&&this._isIdle)&&h,p=c!=="in_menu"&&(h||c==="always"),m=c==="in_menu_on_idle"&&this._isIdle&&h,f=c==="in_menu_on_idle"&&h&&!this._showSearchInSheet,y=(this.config.actions??[]).map((b,O)=>({action:b,idx:O})).filter(({action:b})=>b?.action!=="sync_selected_entity"&&b?.action!=="select_entity"),g=b=>b?.placement?b.placement:b?.in_menu==="hidden"?"hidden":b?.in_menu===!0?"menu":"chip",x=y.filter(({action:b})=>g(b)==="chip"),k=y.filter(({action:b})=>g(b)==="menu"),S=y.find(({action:b})=>b?.card_trigger==="tap"),E=y.find(({action:b})=>b?.card_trigger==="hold"),U=y.find(({action:b})=>b?.card_trigger==="double_tap"),B=y.find(({action:b})=>b?.card_trigger==="swipe_left"),P=y.find(({action:b})=>b?.card_trigger==="swipe_right");this._cardTriggers={tap:S?.action,hold:E?.action,double_tap:U?.action,swipe_left:B?.action,swipe_right:P?.action};const D=this.currentActivePlaybackStateObj||this.currentPlaybackStateObj||this.currentStateObj,q=this.getChipName(this.currentEntityId);if(!D)return _`<div class="details">${d("common.not_found")}</div>`;const L=this._getHiddenControlsForCurrentEntity(),M=!!this._getFavoriteButtonEntity()&&!L.favorite,N=this._isCurrentTrackFavorited(),H=!L.power&&(this._supportsFeature(D,yd)||this._supportsFeature(D,fd)),te=this._controlLayout==="modern"&&H,ie=this._controlLayout==="modern"&&M;let Z=v;te?Z=_`
          <button
            class="volume-icon-btn favorite-volume-btn${D?.state!=="off"?" active":""}"
            @click=${()=>this._onControlClick("power")}
            title="${d("common.power")}"
          >
            <ha-icon .icon=${"mdi:power"}></ha-icon>
          </button>
        `:this._controlLayout==="modern"&&(Z=_`
          <button
            class="volume-icon-btn favorite-volume-btn"
            @click=${()=>this._openQuickSearchOverlay()}
            title="${d("common.search")}"
          >
            <ha-icon .icon=${"mdi:magnify"}></ha-icon>
          </button>
        `);const ne=ie?_`
        <button
          class="volume-icon-btn favorite-volume-btn${N?" active":""}"
          @click=${()=>this._onControlClick("favorite")}
          title="${d("common.favorite")}"
        >
          <ha-icon
            style=${N?"color: var(--custom-accent);":v}
            .icon=${N?"mdi:heart":"mdi:heart-outline"}
          ></ha-icon>
        </button>
      `:v,oe=D.attributes.source_list||[],Ce=new Set(oe.map(b=>b&&b[0]?b[0].toUpperCase():"")),me="ABCDEFGHIJKLMNOPQRSTUVWXYZ".split("");this._idleImageTemplate&&this._idleImageTemplateNeedsResolve&&!this._resolvingIdleImageTemplate&&this._isIdle&&this._resolveIdleImageTemplate();const ae=this._idleImageTemplate?this._idleImageTemplateResult:this.config.idle_image,Le=this._normalizeImageSourceValue(ae);let qe=null;if(Le&&this._isIdle)if(this.hass.states[Le]){const b=this.hass.states[Le];qe=b.attributes.entity_picture_local||b.attributes.entity_picture||(b.state&&b.startsWith("http")?b.state:null)}else(Le.startsWith("http")||Le.startsWith("/"))&&(qe=Le);const Na=!!qe,Xe=this._isIdle,xn=this._isIdle,wn=this._artworkObjectFit==="scaled-contain"||this._artworkObjectFit==="scaled-contain-alternate",Ua=this.config.extend_artwork===!0||m||wn,Ba=this.currentStateObj;this.currentPlaybackStateObj,this._optimisticPlayback?.entity_id,this._getResolvedPlaybackEntityIdSync(this._selectedIndex);const Ct=this._getActualResolvedMaEntityForState(this._selectedIndex),kn=Ct?this.hass?.states?.[Ct]:null,En=this._lastMainState,Ha=this._lastMaState;this._lastMainState=Ba?.state,this._lastMaState=kn?.state;const fe=this._selectedIndex;if(Ha==="playing"&&this._lastMaState!=="playing"){const b=Math.max(Number(this._idleTimeoutMs||this.config?.idle_timeout_ms||6e4),500);this._playbackLingerByIdx[fe]={entityId:Ct,until:Date.now()+b}}if(Ha==="playing"&&this._lastMaState==="paused"&&this._lastPlayingEntityIdByChip?.[fe]===Ct||En==="playing"&&this._lastMainState==="paused"&&this._lastPlayingEntityIdByChip?.[fe]===Ba?.entity_id){const b=this._lastPlayingEntityIdByChip[fe],O=Math.max(Number(this._idleTimeoutMs||this.config?.idle_timeout_ms||6e4),500);this._playbackLingerByIdx[fe]={entityId:b,until:Date.now()+O}}this._lastMaState==="playing"&&this._playbackLingerByIdx?.[fe]&&delete this._playbackLingerByIdx[fe];const An=this.config.entities[fe]?.music_assistant_entity,Sn=this._getEntityForPurpose(fe,"ma_resolve"),Tt=this._lastPlayingEntityIdByChip?.[fe],$n=this._maResolveCache?.[fe]?.id,In=!!(Tt&&(Tt===$n||Tt===Sn||Tt===An||Tt===Ct));this._lastMainState==="playing"&&this._playbackLingerByIdx?.[fe]&&!In&&delete this._playbackLingerByIdx[fe];const Ga=this._getEntityForPurpose(this._selectedIndex,"playback_control"),Je=this.hass?.states?.[Ga],Mt=Je,Cn=Ga;Mt?.state,this._optimisticPlayback&&this._optimisticPlayback.entity_id===Cn&&this._optimisticPlayback.state;const Tn=!!Mt?.attributes?.shuffle,Mn=Mt?.attributes?.repeat&&Mt?.attributes?.repeat!=="off",et=this._idleTimeoutMs===0?this._isEntityPlaying(Je):!this._isIdle&&this._isEntityPlaying(Je),Oi=this.currentStateObj,Ri=this._getArtworkUrl(Oi),zi=this._getArtworkUrl(Je);(this._idleTimeoutMs===0?et&&(Ri?.url||zi?.url):!this._isIdle&&et&&(Ri?.url||zi?.url))&&(Ri?.url||zi?.url);const Se=this._idleTimeoutMs===0?!0:et,xe=Mt||Oi,tt=Se&&xe?.attributes?.media_title||"",Va=Se&&(xe?.attributes?.media_artist||xe?.attributes?.media_series_title||xe?.attributes?.app_name)||"";this._lastTitleLength=tt?tt.length:0,this._adaptiveText&&this._updateAdaptiveTextScale(!0);let it=xe?.attributes?.media_position||0;const Pt=xe?.attributes?.media_duration||0;let ri=it;if(et&&xe){const b=xe.attributes?.media_position_updated_at?Date.parse(xe.attributes.media_position_updated_at):xe.last_changed?Date.parse(xe.last_changed):Date.now(),O=(Date.now()-b)/1e3;ri+=O}const Pn=xe?.attributes?.media_content_id||xe?.attributes?.media_title,Qa=Date.now();if(this._seekAnchor&&this._seekAnchor.trackId===Pn){let b=this._seekAnchor.position;et&&(b+=(Qa-this._seekAnchor.timestamp)/1e3);const O=this._seekConvergenceLock&&Qa<this._seekConvergenceLock,G=Math.abs(ri-b);!O&&G<2?(this._seekAnchor=null,this._seekConvergenceLock=null,it=ri):it=b}else this._seekAnchor=null,this._seekConvergenceLock=null,it=ri;const Wa=Pt?Math.min(1,it/Pt):0,Li=this._getVolumeEntity(fe),Fn=Li&&Li.startsWith&&Li.startsWith("remote."),jn=Number(this.currentVolumeStateObj?.attributes.volume_level||0),Dn=this.config.volume_mode!=="stepper";let Q;this._alwaysCollapsed&&this._expandOnSearch&&this._showSearchInSheet?Q=!1:Q=this._alwaysCollapsed?!0:this._collapseOnIdle?this._isIdle:!1;const Fe=Q&&this._alwaysCollapsed&&a?Math.max(0,t-r):0,On=Q&&p?48:0,Rn=Q&&x.length>0?40:0,zn=On+Rn,qi=48,Ne=Math.max(0,Fe-zn),si=Fe>0?Math.min(240,102+Ne*.75):102,Ya=Ne>0?Math.min(Ne*.45,96):0,Ln=Ne>0?Math.round(qi+Ya):qi,qn=Q?Ln:qi,Ni=Ne>0?Math.max(0,Ne-Ya):0;let Ui=!1;const Za=350,Nn=(Q?a?t:this._collapsedBaselineHeight||220:Za)>=Za,Ka=this.config.hide_menu_player===!0?!1:!Q||Nn,Un=Ni>=48,Bi=Fe>0?Math.max(100,Math.round(si+24+Math.min(40,Fe*.12))):null,Bn=Un?0:Bi??0;let Xa=this.offsetWidth||(this.shadowRoot?.host?.offsetWidth??0);const Hi=Xa>380?Math.min(1.6,1+(Xa-380)/520):1,Gi=Fe>0?Math.min(1.45,1+Ne/180):1,Ja=Gi>1||Hi>1?Math.min(1.6,Math.max(Gi,Hi)):1,er=Math.min(1.5,Math.max(Gi*.92,Hi*.92));this.shadowRoot&&this.shadowRoot.host&&(Fe>0&&(Bi!=null&&this.shadowRoot.host.style.setProperty("--yamp-collapsed-details-offset",`${Bi}px`),this.shadowRoot.host.style.setProperty("--yamp-collapsed-controls-offset",`${Bn}px`),this.shadowRoot.host.style.setProperty("--yamp-collapsed-title-scale",Ja.toFixed(3)),this.shadowRoot.host.style.setProperty("--yamp-collapsed-artist-scale",er.toFixed(3))),this.shadowRoot.host.style.setProperty("--yamp-collapsed-title-scale",Ja.toFixed(3)),this.shadowRoot.host.style.setProperty("--yamp-collapsed-artist-scale",er.toFixed(3)),Fe>0&&a||(this.shadowRoot.host.style.removeProperty("--yamp-collapsed-controls-offset"),this.shadowRoot.host.style.removeProperty("--yamp-collapsed-details-offset")),Ka?this.shadowRoot.host.removeAttribute("data-hide-persistent-controls"):this.shadowRoot.host.setAttribute("data-hide-persistent-controls","true"));let le=null,Vi=null,tr=this._artworkObjectFit;if(!this._isIdle){const b=this._getArtworkUrl(Je),O=this._getArtworkUrl(Oi),G=b?.url?b:O;le=G?.url||null,Vi=G?.sizePercentage,G?.objectFit&&(tr=G.objectFit)}Ui=Q&&!le&&!qe&&Ne>=40,Q&&le&&le!==this._lastArtworkUrl&&(this._extractDominantColor(le).then(b=>{this._collapsedArtDominantColor=b,this.requestUpdate()}),this._lastArtworkUrl=le);const ir=Xe?Q?this._collapsedBaselineHeight||220:325:null;this._lastRenderedCollapsed=Q,this._lastRenderedHideControls=Xe;const Ue=tr||this._artworkObjectFit,Ft=Ue==="scaled-contain-alternate",ni=(Ue==="scaled-contain"||Ft)&&!Q&&!this._alwaysCollapsed,Hn=(Ue==="scaled-contain"||Ft)&&(c==="in_menu"||s&&c!=="always");let Qi=this._getBackgroundSizeForFit(Ue);Vi&&(Qi=`${Vi}%`);const ar=qe||Ft?qe?`url('${qe}')`:"none":le?`url('${le}')`:"none",rr=ar!=="none",Gn=le&&(Q||ni&&Ue==="scaled-contain")?"blur(18px) brightness(0.7) saturate(1.15)":"none",sr=[`background-image: ${ar}`,`background-size: ${ni?"cover":Qi}`,`background-position: ${this.config.artwork_position||"top center"}`,"background-repeat: no-repeat",`filter: ${Gn}`].join("; ");return this.shadowRoot&&this.shadowRoot.host&&(this.shadowRoot.host.style.setProperty("--yamp-artwork-fit",Ue),this.shadowRoot.host.style.setProperty("--yamp-artwork-bg-size",Qi)),_`
        <ha-card class="yamp-card" style=${a&&(!Q||this._alwaysCollapsed)?`height:${t}px;`:v}>
          <div
            data-match-theme="${String(this.config.match_theme===!0)}"
            data-artwork-fit="${Ue}"
            class=${wr({"yamp-card-inner":!0,"dim-idle":xn,"no-chip-dim":this.config.dim_chips_on_idle===!1})}
          >
            ${Ua&&rr?_`
              <div class="full-bleed-artwork-bg" style="${sr}"></div>
              ${Na||Ft?v:_`<div class="full-bleed-artwork-fade"></div>`}
            `:v}
            ${m?_`${this._renderInlineActionRow(x)}${this._renderInlineChipRow(p,m)}`:_`${this._renderInlineChipRow(p,m)}${this._renderInlineActionRow(x)}`}
            <div class="card-lower-content-container" style="${ir?`min-height:${ir}px;`:""}">
              <div class="card-lower-content-bg"
                style="${(()=>{const b=[];return Ua&&rr?b.push("background-image: none","filter: none"):b.push(sr),b.push(`min-height: ${Q?Xe?`${this._collapsedBaselineHeight||220}px`:"0px":"350px"}`),b.push("transition: min-height 0.4s cubic-bezier(0.6,0,0.4,1), background 0.4s"),b.join("; ")})()}"
              ></div>
              ${Na||Ft?v:_`<div class="card-lower-fade"></div>`}
              <div class="card-lower-content${Q?" collapsed transitioning":" transitioning"}${Q&&le?" has-artwork":""}" style="${Xe?Q?`min-height: ${this._collapsedBaselineHeight||220}px;`:"min-height: 350px;":""}">
                ${Q&&le&&this._isValidArtworkUrl(le)?_`
                  <div
                    class="collapsed-artwork-container"
                    @pointerdown=${b=>this._onTapAreaPointerDown(b)}
                    @pointermove=${b=>this._onTapAreaPointerMove(b)}
                    @pointerup=${b=>this._onTapAreaPointerUp(b)}
                    @pointercancel=${()=>{this._gestureActive=!1,clearTimeout(this._gestureHoldTimer)}}
                    style="${[`background: linear-gradient(120deg, ${this._collapsedArtDominantColor}bb 60%, transparent 100%)`,Fe>0?`width:${Math.round(si+8)}px`:"",this._cardTriggers.tap||this._cardTriggers.hold||this._cardTriggers.double_tap||this._cardTriggers.swipe_left||this._cardTriggers.swipe_right?"cursor:pointer; pointer-events:auto;":""].filter(Boolean).join("; ")}"
                  >
                    <img
                      class="collapsed-artwork"
                      src="${le}" 
                      style="${[this._getCollapsedArtworkStyle(),Fe>0?`width:${Math.round(si)}px; height:${Math.round(si)}px;`:""].filter(Boolean).join(" ")}" 
                      onload="this.style.display='block'"
                      onerror="this.style.display='none'" />
                  </div>
                `:v}
                ${Ui||!Q?_`
                  <div class="card-artwork-spacer${Ui?" show-placeholder":""}"
                    @pointerdown=${b=>this._onTapAreaPointerDown(b)}
                    @pointermove=${b=>this._onTapAreaPointerMove(b)}
                    @pointerup=${b=>this._onTapAreaPointerUp(b)}
                    @pointercancel=${()=>{this._gestureActive=!1,clearTimeout(this._gestureHoldTimer)}}
                    style="${this._cardTriggers.tap||this._cardTriggers.hold||this._cardTriggers.double_tap||this._cardTriggers.swipe_left||this._cardTriggers.swipe_right?"cursor:pointer; pointer-events:auto;":""}"
                  >
                    ${ni&&le?_`
                      <div style="position: absolute; ${Hn?"top: 20px; right: 0; bottom: 0; left: 0;":"inset: 0;"} display: flex; align-items: center; justify-content: center; pointer-events: none;">
                        <img 
                          class="inset-artwork"
                          src="${le}" 
                          style="max-width: 100%; max-height: 100%; object-fit: contain; pointer-events: none;" 
                        />
                      </div>
                    `:v}
                    ${!ni&&!le&&!qe?_`
                      <div class="media-artwork-placeholder">
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

                    ${this._lyricsActive&&!this._isIdle?_`
                      <yamp-lyrics-view
                        data-artwork-fit="${Ue}"
                        .hass=${this.hass}
                        .lyrics=${this._massLyrics}
                        .position=${it}
                        .loading=${this._fetchingLyrics}
                        .error=${this._lyricsError}
                        .activeThemeColor=${this.config.match_theme===!0?"var(--state-media_player-active-color, var(--primary-color, #ffffff))":"var(--custom-accent, #ffffff)"}
                        .mode=${this._isCurrentlyPlayingRadio()?"text":this.config.lyrics_mode||"default"}
                        .preRoll=${this.config.lyrics_pre_roll??0}
                      ></yamp-lyrics-view>
                    `:v}
                  </div>
                `:v}
                ${this.config.details_alignment!=="none"?_`
                  <div class="details" style="${(()=>{const b=[];return this._showEntityOptions&&(b.push("visibility:hidden"),b.push("opacity:0")),b.push(`min-height:${qn}px`),Se||b.push("opacity:0"),b.join(";")})()}">
                    ${this._showMediaTitleOptions?_`
                      <div class="title track-options-row" style="display: flex; gap: 16px; align-items: center; cursor: pointer;">
                        ${this._massQueueAvailable?_`
                          <div class="track-options-btn" @click=${b=>{b.stopPropagation(),this._handleAddCurrentToPlaylist()}} title="${d("search.labels.add_to_playlist")}">
                            <ha-icon icon="mdi:playlist-plus"></ha-icon>
                            <span>${d("search.add_to_playlist")}</span>
                          </div>
                        `:v}
                        <div class="track-options-btn" @click=${b=>{b.stopPropagation(),this._handlePlaySimilar()}} title="${d("search.play_similar")}">
                          <ha-icon icon="mdi:radio"></ha-icon>
                          <span>${d("search.play_similar")}</span>
                        </div>
                        <div class="track-options-btn track-options-close" @click=${b=>{b.stopPropagation(),this._showMediaTitleOptions=!1}} title="${d("common.close")}">
                          <ha-icon icon="mdi:close"></ha-icon>
                        </div>
                      </div>
                    `:_`
                      <div class="title track-options-title" @click=${b=>{Se&&tt&&(b.stopPropagation(),this._showMediaTitleOptions=!0)}} style="${Se&&tt?"cursor: pointer;":""}" title="${Se&&tt?"Show track options":""}">
                        ${Se&&tt?tt:_`&nbsp;`}
                      </div>
                    `}
                    <div
                        class="artist ${Se&&D.attributes.media_artist?"clickable-artist":""}"
                        @click=${()=>{Se&&D.attributes.media_artist&&this._searchArtistFromNowPlaying()}}
                        title=${Se&&D.attributes.media_artist?d("search.search_artist"):""}
                      >${Se&&Va?Va:_`&nbsp;`}</div>
                  </div>
                `:v}
                ${!Q&&!this._alternateProgressBar?ui(et&&Pt?{progress:Wa,seekEnabled:!0,onSeek:b=>this._onProgressBarClick(b),collapsed:!1,style:this._showEntityOptions?"visibility:hidden; opacity:0":"",displayTimestamps:this._displayTimestamps,currentTime:it,duration:Pt}:{progress:0,seekEnabled:!1,collapsed:!1,style:"visibility:hidden; opacity:0",displayTimestamps:this._displayTimestamps,currentTime:0,duration:0}):v}
                ${Q||this._alternateProgressBar?ui(et&&Pt?{progress:Wa,collapsed:!0,style:this._showEntityOptions?"visibility:hidden; opacity:0":""}:{progress:0,collapsed:!0,style:"visibility:hidden; opacity:0"}):v}
                ${!Xe&&Ni>0?_`
                  <div class="collapsed-flex-spacer" style="flex: 1 0 ${Math.round(Ni)}px;"></div>
                `:v}
                <div style="${Xe||this._showEntityOptions?"visibility:hidden; opacity:0; pointer-events:none;":""}">
                    ${Lo({stateObj:Je,showStop:this._shouldShowStopButton(Je),shuffleActive:Tn,repeatActive:Mn,onControlClick:b=>this._onControlClick(b),supportsFeature:(b,O)=>this._supportsFeature(b,O),showFavorite:M,favoriteActive:N,hiddenControls:L,adaptiveControls:this._adaptiveControls,controlLayout:this._controlLayout,swapPauseForStop:this._controlLayout==="modern"&&this._swapPauseForStop})}

                    ${qo({isRemoteVolumeEntity:Fn,showSlider:Dn,vol:jn,isMuted:this.currentVolumeStateObj?.attributes?.is_volume_muted??!1,supportsMute:this.currentVolumeStateObj?this._supportsFeature(this.currentVolumeStateObj,ba):!1,onVolumeDragStart:b=>this._onVolumeDragStart(b),onVolumeDragEnd:b=>this._onVolumeDragEnd(b),onVolumeChange:b=>this._onVolumeChange(b),onVolumeStep:b=>this._onVolumeStep(b),onMuteToggle:()=>this._onMuteToggle(),leadingControlTemplate:Z,reserveLeadingControlSpace:this._controlLayout==="modern",showRightPlaceholder:this._controlLayout==="modern",rightSlotTemplate:ne,hideVolume:this.config.volume_mode==="hidden",moreInfoMenu:_`
                        <div class="more-info-menu">
                          <button class="more-info-btn" @click=${async()=>await this._openEntityOptions()}>
                            <span class="more-info-icon">&#9776;</span>
                          </button>
                        </div>
                      `})}
                  </div>
            ${Xe&&!this._showEntityOptions?_`
              <div class="more-info-menu" style="position: absolute; right: 18px; bottom: 18px; z-index: ${z.FLOATING_ELEMENT};">
                <button class="more-info-btn" @click=${async()=>await this._openEntityOptions()}>
                  <span class="more-info-icon">&#9776;</span>
                </button>
              </div>
            `:v}
            ${u&&!this._showEntityOptions&&!this._hideActiveEntityLabel?_`
              <div class="in-menu-active-label">${q}</div>
            `:v}
          </div>
        </div>

      ${this._showEntityOptions?_`
      <div class="entity-options-overlay entity-options-overlay-opening" @click=${b=>this._closeEntityOptions(b)}>
        <div class="entity-options-container entity-options-container-opening">
          <div class="entity-options-sheet${u||f?" chips-mode":""} entity-options-sheet-opening" 
               @click=${b=>b.stopPropagation()}
               data-pin-search-headers="${o}">
            ${u||f?_`
                <div class="entity-options-chips-wrapper" style="${f&&!u?"visibility:hidden;pointer-events:none;":""}" @click=${b=>b.stopPropagation()}>
                <div class="chip-row entity-options-chips-strip">
                  ${Ar(this._getChipRowProps())}
                </div>
              </div>
            `:v}
              ${!this._showGrouping&&!this._showSourceList&&!this._showSearchInSheet&&!this._showResolvedEntities&&!this._showTransferQueue?this._renderMainMenu(oe,k,u):this._showGrouping?this._renderGroupingSheet():this._showTransferQueue?this._renderTransferQueueSheet():this._showResolvedEntities?this._renderResolvedEntitiesSheet():this._showSearchInSheet?_`
              <div class="entity-options-search" style = "margin-top:12px;" >
                ${this._searchHierarchy.length>0?_`
                    <button class="entity-options-item close-item" @click=${()=>this._goBackInSearch()}>
                      Back
                    </button>
                    <div class="entity-options-divider"></div>
                  `:v}
                  ${this._searchBreadcrumb?_`
                    <div class="entity-options-search-breadcrumb">
                      <div class="entity-options-search-breadcrumb-text">${this._searchBreadcrumb}</div>
                      ${this._isSelectionFlow?v:_`
                        <button class="entity-options-search-breadcrumb-play" @click=${()=>this._playCurrentCollection()} title="${d("search.play_collection")}">
                          <ha-icon icon="mdi:play"></ha-icon>
                        </button>
                      `}
                    </div>
                  `:l?_`<div class="entity-options-search-skeleton"></div>`:v}
                  ${l?_`
                  <div class="entity-options-search-row">
                    <div class="search-input-wrapper">
                      <input
                        type="text"
                        id="search-input-box"
                        ?autofocus=${!this._disableSearchAutofocus}
                        class="entity-options-search-input"
                        .value=${this._searchQuery}
                        @input=${b=>{this._searchQuery=b.target.value,this.requestUpdate()}}
                        @keydown=${b=>{b.key==="Enter"?(b.preventDefault(),this._handleSearchSubmit()):b.key==="Escape"&&(b.preventDefault(),this._hideSearchSheetInOptions())}}
                        placeholder="${d("editor.placeholders.search")}"
                      />
                      ${this._searchQuery?_`
                        <button
                          class="search-input-clear"
                          @click=${()=>{this._showSearchSheetInOptions()}}
                          title="Clear">
                          <ha-icon icon="mdi:close"></ha-icon>
                        </button>
                      `:v}
                    </div>
                    <button
                      class="entity-options-item"
                      style="min-width:80px;"
                      @click=${()=>this._handleSearchSubmit()}
                      ?disabled=${this._searchLoading}>
                      ${d("common.search")}
                    </button>
                    ${this._cardType!=="search"?_`
                    <button
                      class="entity-options-item"
                      style="min-width:80px;"
                      @click=${()=>{this._quickMenuInvoke?this._dismissWithAnimation():this._hideSearchSheetInOptions()}}>
                ${d("common.cancel")}
                    </button>
                    `:v}
                  </div>
                  `:v}
                  <!--FILTER CHIPS-->
               ${l?(()=>{const b=this._getVisibleSearchFilterClasses(),O=this._searchMediaClassFilter||"all";return this._searchHierarchy.length>0||b.length<2&&!this._usingMusicAssistant?v:_`
                      <div class="chip-row search-filter-chips" id="search-filter-chip-row" style="margin-bottom:12px; justify-content: center; align-items: center;">
                          <button
                            class="chip"
                            ?selected=${O==="all"}
                            @click=${()=>this._doSearch()}
                          >${d("search.filters.all")}</button>
                          ${b.map(G=>_`
                            <button
                              class="chip"
                              ?selected=${O===G}
                              @click=${()=>this._doSearch(G)}
                            >
                              ${d(`search.filters.${G}`)}
                            </button>
                          `)}
                      </div>
                    `})():v}
                  ${this._searchLoading?_`<div class="entity-options-search-loading">${d("common.loading")}</div>`:v}
                  ${this._searchError?_`<div class="entity-options-search-error">${this._searchError}</div>`:v}
                  
                  ${l&&this._usingMusicAssistant&&!this._searchLoading?_`
                    <div class="search-sub-filters" style="display: flex; align-items: center; margin-bottom: 2px; margin-top: 4px; padding-left: 3px; width: 100%; gap: 8px;">
                      <div style="display: flex; align-items: center; flex-wrap: wrap; flex: 1; min-width: 0;">
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
                          title="${d("search.favorites")}"
                        >
                                                  <ha-icon .icon=${this._initialFavoritesLoaded||this._favoritesFilterActive?"mdi:cards-heart":"mdi:cards-heart-outline"}></ha-icon>
                          ${this._initialFavoritesLoaded||this._favoritesFilterActive?_`
                            <span style="margin-left:6px;font-size:0.82em;font-weight:600;white-space:nowrap;">
                              ${d("search.favorites")}
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
                          title="${d("search.recently_played")}"
                        >
                          <ha-icon .icon=${this._recentlyPlayedFilterActive?"mdi:clock":"mdi:clock-outline"}></ha-icon>
                          ${this._recentlyPlayedFilterActive?_`
                            <span style="margin-left:6px;font-size:0.82em;font-weight:600;white-space:nowrap;">
                              ${d("search.recently_played")}
                            </span>
                          `:v}
                      </button>
                      ${this._isMusicAssistantEntity()?_`
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
                            title="${d("search.next_up")}"
                          >
                            <ha-icon .icon=${this._upcomingFilterActive?"mdi:playlist-music":"mdi:playlist-music-outline"}></ha-icon>
                            ${this._upcomingFilterActive?_`
                              <span style="margin-left:6px;font-size:0.82em;font-weight:600;white-space:nowrap;">
                                ${d("search.next_up")}
                              </span>
                            `:v}
                        </button>
                        ${this._hasMassQueueIntegration?_`
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
                              title="${d("search.recommendations")}"
                            >
                              <ha-icon .icon=${this._recommendationsFilterActive?"mdi:creation":"mdi:creation-outline"}></ha-icon>
                              ${this._recommendationsFilterActive?_`
                                <span style="margin-left:6px;font-size:0.81em;font-weight:600;white-space:nowrap;">
                                  ${d("search.recommendations")}
                                </span>
                              `:v}
                          </button>
                        `:v}
                      `:v}
                      <button
                          class="radio-mode-button${this._radioModeActive?" active":""}"
                          @click=${()=>this._toggleRadioMode()}
                          title="Radio Mode"
                        >
                          <ha-icon .icon=${this._radioModeActive?"mdi:radio":"mdi:radio-off"}></ha-icon>
                      </button>
                      ${this._shouldShowSearchSortToggle()?_`
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
                      ${this._shouldShowSearchResultsCount()?_`
                        <span class="search-results-count">
                          ${this._getSearchResultsCountLabel()}
                        </span>
                      `:v}
                    </div>
                  `:v}

            <div class="entity-options-search-results ${this.config.search_view==="card"||this.config.search_view==="card_minimal"?"search-results-card-view":"list-view"}" 
                 style="${this.config.search_view==="card"||this.config.search_view==="card_minimal"?`--search-card-columns: ${this.config.search_card_columns||4};`:""}">
              ${(()=>{this._searchMediaClassFilter;const b=this._getDisplaySearchResults(),O=this.config.search_view==="card"||this.config.search_view==="card_minimal",G=this.config.search_view==="card_minimal",at=Math.max(15,this._searchTotalRows||b.length),Be=[...b,...Array.from({length:Math.max(0,at-b.length)},()=>null)];return this._searchAttempted&&b.length===0&&!this._searchLoading?_`<div class="entity-options-search-empty">${d("common.no_results")}</div>`:Be.map(C=>C?_`
                            <!-- EXISTING non‑placeholder row markup -->
                            <div class="entity-options-search-result ${O?"search-result-card":""} ${G?"minimal":""} ${C._justMoved?"just-moved":""} ${C.media_content_id!=null&&this._activeSearchRowMenuId===C.media_content_id?"menu-active":""}">
                               <div class="search-sheet-thumb-container"
                                    data-clickable="${O}"
                                    @click=${O?ue=>this._isSelectionFlow?this._handleSearchResultClick(C,ue):this._playMediaFromSearch(C):null}>
                                ${C.thumbnail&&this._isValidArtworkUrl(C.thumbnail)&&!String(C.thumbnail).includes("imageproxy")?_`
                                   <img
                                     class="entity-options-search-thumb"
                                     src=${C.thumbnail}
                                     alt=${C.title}
                                     onerror="this.style.display='none'"
                                   />
                                `:_`
                                   <div class="entity-options-search-thumb-placeholder">
                                     <ha-icon icon="mdi:music"></ha-icon>
                                   </div>
                                 `}
                                 ${(()=>{const ue=this._isSelectionFlow;return O?Rr({item:C,onPlay:R=>this._playMediaFromSearch(R),onOptionsToggle:R=>{this._activeSearchRowMenuId=R?.media_content_id||null,this.requestUpdate()},upcomingFilterActive:!!this._upcomingFilterActive,isMusicAssistant:this._isMusicAssistantEntity(),massQueueAvailable:this._massQueueAvailable,searchView:"card",minimal:G,hideActions:ue}):v})()}
                               </div>
                                ${G?v:_`
                                <div class="search-sheet-info">
                                 <span class="${this._isClickableSearchResult(C)?"clickable-search-result":""} ${O?"search-sheet-title":""}"
                                       @touchstart=${ue=>this._handleSearchResultTouch(C,ue)}
                                       @click=${()=>this._handleSearchResultClick(C)}
                                       title=${this._getSearchResultClickTitle(C)}>
                                   ${C.title}
                                 </span>
                                  <span class="search-sheet-subtitle ${this._isClickableSearchResult(C)?"clickable-search-result":""}"
                                        @touchstart=${ue=>this._handleSearchResultTouch(C,ue)}
                                        @click=${()=>this._handleSearchResultClick(C)}>
                                   ${(()=>{const ue=C.media_class==="track",R=this._searchMediaClassFilter==="track"||this._searchMediaClassFilter==="album",Wi=!!this._recentlyPlayedFilterActive,Vn=!!this._upcomingFilterActive,Qn=!!this._recommendationsFilterActive;return ue&&C.artist&&C.album?`${C.artist} - ${C.album}`:(R||Wi||Vn||Qn)&&C.artist?C.artist:C.media_class?C.media_class.charAt(0).toUpperCase()+C.media_class.slice(1):""})()}
                                 </span>
                                 ${(()=>{const ue=this._isSelectionFlow;return O&&!Dr(C)&&!ue?_`
                                   <div class="card-menu-button" @click=${R=>{R.preventDefault(),R.stopPropagation(),this._activeSearchRowMenuId=C.media_content_id,this.requestUpdate()}}>
                                     <ha-icon icon="mdi:dots-vertical"></ha-icon>
                                   </div>
                                 `:v})()}
                               </div>
                                `}
                              ${(()=>{const ue=this._isSelectionFlow;return O?v:Rr({item:C,onPlay:R=>this._playMediaFromSearch(R),onOptionsToggle:R=>{this._activeSearchRowMenuId=R?.media_content_id||null,this.requestUpdate()},upcomingFilterActive:!!this._upcomingFilterActive,isMusicAssistant:this._isMusicAssistantEntity(),massQueueAvailable:this._massQueueAvailable,searchView:"list",isInline:!0,onMoveUp:R=>this._moveQueueItemUp(R.queue_item_id),onMoveDown:R=>this._moveQueueItemDown(R.queue_item_id),onMoveNext:R=>this._moveQueueItemNext(R.queue_item_id),onRemove:R=>this._removeQueueItem(R.queue_item_id),hideActions:ue})})()}

                                 ${(()=>{const ue=this._isSelectionFlow;return Go({item:C,activeSearchRowMenuId:this._activeSearchRowMenuId,loadingSearchRowMenuId:this._loadingSearchRowMenuId,onPlayOption:(R,Wi)=>this._performSearchOptionAction(R,Wi),onOptionsToggle:R=>{this._activeSearchRowMenuId=R?.media_content_id||null,this.requestUpdate()},searchView:this.config.search_view,isQueueItem:this._isMusicAssistantEntity()&&C.queue_item_id&&!!this._upcomingFilterActive&&this._massQueueAvailable,massQueueAvailable:this._massQueueAvailable,onMoveUp:R=>this._moveQueueItemUp(R.queue_item_id),onMoveDown:R=>this._moveQueueItemDown(R.queue_item_id),onMoveNext:R=>this._moveQueueItemNext(R.queue_item_id),onRemove:R=>this._removeQueueItem(R.queue_item_id),hideActions:ue})})()}

                        ${this._loadingSearchRowMenuId===C.media_content_id?_`
                          <div class="search-row-loading-overlay">
                            <ha-icon icon="mdi:loading" class="spin"></ha-icon>
                            <span>${d("common.loading")}</span>
                          </div>
                        `:v}

                        ${this._errorSearchRowMenuId===C.media_content_id?_`
                          <div class="search-row-error-overlay">
                            <ha-icon icon="mdi:alert-circle" class="error-icon"></ha-icon>
                            <span>${d("common.error")||"Error"}</span>
                          </div>
                        `:v}

                        ${this._successSearchRowMenuId===C.media_content_id?_`
                          <div class="search-row-success-overlay">
                            <span>✅</span>
                            <span>${this._successSearchRowType==="playlist"?d("search.added_to_playlist"):d("search.added")}</span>
                          </div>
                        `:v}
                            </div>
                          `:_`
                            <!-- placeholder row keeps height -->
                            <div class="entity-options-search-result placeholder"></div>
                          `)})()}
            </div>
                  </div>
                </div>
              `:this._showGrouping?this._renderGroupingSheet():_`
                <div class="entity-options-header">
                  <button class="entity-options-item close-item" @click=${()=>{this._quickMenuInvoke?this._dismissWithAnimation():this._closeSourceList()}}>
                    ${d("common.back")}
                  </button>
                  <div class="entity-options-divider"></div>
                </div>
                <div class="entity-options-scroll source-list-centering-wrapper">
                  <div class="source-list-sheet">
                    <div class="source-list-scroll">
                      ${oe.map(b=>_`
                        <div class="entity-options-item" data-source-name="${b}" @click=${()=>this._selectSource(b)}>${b}</div>
                      `)}
                    </div>
                  </div>
                </div>
                <div class="floating-source-index">
                  ${me.map((b,O)=>{const G=Ce.has(b),at=this._hoveredSourceLetterIndex;let Be="";if(G&&at!==null&&at!==void 0){const C=Math.abs(at-O);C===0?Be="max":C===1?Be="large":C===2&&(Be="med")}return _`
                      <button
                        class="source-index-letter"
                        ?disabled=${!G}
                        data-scale=${Be}
                        @mouseenter=${G?()=>{this._hoveredSourceLetterIndex=O,this.requestUpdate()}:v}
                        @mouseleave=${()=>{this._hoveredSourceLetterIndex=null,this.requestUpdate()}}
                        @click=${G?()=>this._scrollToSourceLetter(b):v}
                      >
                        ${b}
                      </button>
                    `})}
                </div>
`}
              </div>
            </div>
            <!-- Persistent Media Controls Section - Outside Scrollable Area -->
            ${Ka?_`
              <div class="persistent-media-controls" @click=${b=>b.stopPropagation()}>
                <div class="persistent-controls-artwork">
                  ${(()=>{const b=this.currentPlaybackStateObj,O=this.currentStateObj,G=this._getArtworkUrl(b)||this._getArtworkUrl(O);return G?.url&&this._isValidArtworkUrl(G.url)?_`
                      <img src="${G.url}" alt="Album Art" class="persistent-artwork" onerror="this.style.display='none'">
                    `:_`
                      <div class="persistent-artwork-placeholder">
                        <ha-icon icon="mdi:music"></ha-icon>
                      </div>
                    `})()}
                </div>
                <div class="persistent-controls-buttons">
                  <button class="persistent-control-btn" @click=${()=>this._onControlClick("prev")} title="${d("card.media_controls.previous")}">
                    <ha-icon icon="mdi:skip-previous"></ha-icon>
                  </button>
                  <button class="persistent-control-btn" @click=${()=>this._onControlClick("play_pause")} title="${d("card.media_controls.play_pause")}">
                    <ha-icon icon=${this._isEntityPlaying(this.currentPlaybackStateObj)?"mdi:pause":"mdi:play"}></ha-icon>
                  </button>
                  <button class="persistent-control-btn" @click=${()=>this._onControlClick("next")} title="${d("card.media_controls.next")}">
                    <ha-icon icon="mdi:skip-next"></ha-icon>
                  </button>
                </div>
                ${(()=>{const b=this._selectedIndex,O=this._getVolumeEntity(b);if(!O)return v;const G=O.startsWith&&O.startsWith("remote."),at=this.currentVolumeStateObj,Be=Number(at?.attributes?.volume_level??0),C=G?null:`${Math.round((Be||0)*100)}%`;return this.config.volume_mode==="hidden"?v:_`
                    <div class="persistent-volume-stepper">
                      <button class="stepper-btn" @click=${()=>this._onVolumeStep(-1)} title="${d("common.vol_down")}">–</button>
                      ${C?_`<span class="stepper-value">${C}</span>`:v}
                      <button class="stepper-btn" @click=${()=>this._onVolumeStep(1)} title="${d("common.vol_up")}">+</button>
                    </div>
                  `})()}
              </div>
            `:v}
          </div>
        `:v}
          ${this._searchActiveOptionsItem?Vo({item:this._searchActiveOptionsItem,onClose:()=>{this._searchActiveOptionsItem=null,this.requestUpdate()},onPlayOption:(b,O)=>this._performSearchOptionAction(b,O),massQueueAvailable:this._massQueueAvailable}):v}
          </div>
    </ha-card>
  `}_updateHostAttributes(){if(!this.shadowRoot||!this.shadowRoot.host)return;const e=this.shadowRoot.host,t=this.config||{},a=this._appearance||"automatic";e.setAttribute("data-match-theme",String(t.match_theme===!0)),e.setAttribute("data-appearance",a),e.setAttribute("data-always-collapsed",String(t.always_collapsed===!0));const r=t.always_collapsed===!0&&t.pin_search_headers===!0&&t.expand_on_search===!0;e.setAttribute("data-hide-menu-player",String(t.hide_menu_player===!0||r)),e.setAttribute("data-extend-artwork",String(this._extendArtwork))}_updateIdleState(){const e=this.entityIds.some((r,s)=>{if(this._isAutoSelectDisabled(s))return!1;const n=this._getEntityForPurpose(s,"sorting");return this._isEntityPlaying(this.hass.states[n])}),t=this._isCurrentEntityPlaying();let a=!1;if(this._isIdle||!this._hasSeenPlayback?a=e:a=t,a)this._idleTimeout&&clearTimeout(this._idleTimeout),this._idleTimeout=null,this._hasSeenPlayback=!0,this._isIdle&&(this._isIdle=!1,this._resetIdleScreen(),this.requestUpdate());else{if(!this._hasSeenPlayback){this._idleTimeoutMs>0?this._isIdle||(this._isIdle=!0,this._idleScreenApplied=!1,this._applyIdleScreen(),this.requestUpdate()):this._isIdle&&(this._isIdle=!1,this._resetIdleScreen(),this.requestUpdate());return}!this._isIdle&&!this._idleTimeout&&this._idleTimeoutMs>0&&(this._idleTimeout=setTimeout(()=>{if(this._cardType==="search"){if(this._idleTimeout=null,this._searchHierarchy.length>0){this._searchHierarchy=[],this._searchBreadcrumb="",this._searchResultsByType={};const r=this.config?.default_search_filter==="all"?null:this.config?.default_search_filter;this._doSearch(r).catch(()=>{}),this.requestUpdate()}return}this._isIdle=!0,this._idleTimeout=null,this._idleScreenApplied=!1,this._pinnedIndex===null&&(this._manualSelect=!1,this._manualSelectPlayingSet=null),this._applyIdleScreen(),this.requestUpdate()},this._idleTimeoutMs)),this._idleTimeoutMs===0&&this._isIdle&&(this._isIdle=!1,this._resetIdleScreen(),this.requestUpdate())}}getGridOptions(){let e;return this._alwaysCollapsed&&this._expandOnSearch&&this._showSearchInSheet?e=!1:e=this._alwaysCollapsed?!0:this._collapseOnIdle?this._isIdle:!1,{min_rows:e?2:4,columns:12}}static get _schema(){return[{name:"entities",selector:{entity:{multiple:!0,domain:"media_player"}},required:!0},{name:"show_chip_row",selector:{select:{options:[{value:"auto",label:"Auto"},{value:"always",label:"Always"},{value:"in_menu",label:"In Menu"},{value:"in_menu_on_idle",label:"In Menu on Idle"}]}},required:!1},{name:"idle_screen",selector:{select:{options:[{value:"default",label:"Default"},{value:"search",label:"Search"},{value:"source",label:"Source"},{value:"more-info",label:"More Info"},{value:"group-players",label:"Group Players"},{value:"transfer-queue",label:"Transfer Queue"}]}},required:!1},{name:"hold_to_pin",selector:{boolean:{}},required:!1},{name:"disable_autofocus",selector:{boolean:{}},required:!1},{name:"idle_image",selector:{entity:{domain:"",multiple:!1}},required:!1},{name:"match_theme",selector:{boolean:{}},required:!1},{name:"collapse_on_idle",selector:{boolean:{}},required:!1},{name:"always_collapsed",selector:{boolean:{}},required:!1},{name:"expand_on_search",selector:{boolean:{}},required:!1},{name:"alternate_progress_bar",selector:{boolean:{}},required:!1},{name:"idle_timeout_ms",selector:{number:{min:0,step:1e3,unit_of_measurement:"ms",mode:"box"}},required:!1},{name:"volume_step",selector:{number:{min:.01,max:1,step:.01,unit_of_measurement:"",mode:"box"}},required:!1},{name:"volume_mode",selector:{select:{options:[{value:"slider",label:"Slider"},{value:"stepper",label:"Stepper"}]}},required:!1},{name:"actions",selector:{object:{}},required:!1},{name:"dim_chips_on_idle",selector:{boolean:{}},required:!1},{name:"pin_search_headers",selector:{boolean:{}},required:!1}]}firstUpdated(){super.firstUpdated?.();const e=this.renderRoot.querySelector(".floating-source-index");e&&e.addEventListener("wheel",function(t){const{scrollTop:a,scrollHeight:r,clientHeight:s}=e,n=t.deltaY;(n<0&&a===0||n>0&&a+s>=r)&&(t.preventDefault(),t.stopPropagation())},{passive:!1})}_addGrabScroll(e){const t=this.renderRoot.querySelector(e);if(!t||t._grabScrollAttached)return;let a=!1,r,s;const n=u=>{a=!0,t._dragged=!1,t.classList.add("grab-scroll-active"),r=u.pageX-t.offsetLeft,s=t.scrollLeft,u.preventDefault()},o=()=>{a=!1,t.classList.remove("grab-scroll-active")},l=()=>{a=!1,t.classList.remove("grab-scroll-active")},c=u=>{if(!a)return;const p=u.pageX-t.offsetLeft-r;Math.abs(p)>5&&(t._dragged=!0),u.preventDefault(),t.scrollLeft=s-p},h=u=>{t._dragged&&(u.stopPropagation(),u.preventDefault(),t._dragged=!1)};t.addEventListener("mousedown",n),t.addEventListener("mouseleave",o),t.addEventListener("mouseup",l),t.addEventListener("mousemove",c),t.addEventListener("click",h,!0),t._grabScrollHandlers={mousedown:n,mouseleave:o,mouseup:l,mousemove:c,click:h},t._grabScrollAttached=!0}_addVerticalGrabScroll(e){const t=this.renderRoot.querySelector(e);if(!t||t._grabScrollAttached)return;let a=!1,r,s;const n=u=>{a=!0,t._dragged=!1,t.classList.add("grab-scroll-active"),r=u.pageY-t.getBoundingClientRect().top,s=t.scrollTop,u.preventDefault()},o=()=>{a=!1,t.classList.remove("grab-scroll-active")},l=()=>{a=!1,t.classList.remove("grab-scroll-active")},c=u=>{if(!a)return;const p=u.pageY-t.getBoundingClientRect().top-r;Math.abs(p)>5&&(t._dragged=!0),u.preventDefault(),t.scrollTop=s-p},h=u=>{t._dragged&&(u.stopPropagation(),u.preventDefault(),t._dragged=!1)};t.addEventListener("mousedown",n),t.addEventListener("mouseleave",o),t.addEventListener("mouseup",l),t.addEventListener("mousemove",c),t.addEventListener("click",h,!0),t._grabScrollHandlers={mousedown:n,mouseleave:o,mouseup:l,mousemove:c,click:h},t._grabScrollAttached=!0}_removeGrabScrollHandlers(){this.renderRoot.querySelectorAll("[data-grab-scroll]").forEach(e=>{if(e._grabScrollHandlers){const t=e._grabScrollHandlers;e.removeEventListener("mousedown",t.mousedown),e.removeEventListener("mouseleave",t.mouseleave),e.removeEventListener("mouseup",t.mouseup),e.removeEventListener("mousemove",t.mousemove),e.removeEventListener("click",t.click,!0),delete e._grabScrollHandlers,e._grabScrollAttached=!1}})}_removeSearchSwipeHandlers(){const e=this.renderRoot.querySelector(".entity-options-search-results");if(e&&e._searchSwipeHandlers){const t=e._searchSwipeHandlers;e.removeEventListener("touchstart",t.touchstart),e.removeEventListener("touchend",t.touchend),delete e._searchSwipeHandlers,this._searchSwipeAttached=!1}}disconnectedCallback(){this._idleTimeout&&(clearTimeout(this._idleTimeout),this._idleTimeout=null),this._unsubscribeFromQueueUpdates(),this._lyricsFetchTimeout&&(clearTimeout(this._lyricsFetchTimeout),this._lyricsFetchTimeout=null),super.disconnectedCallback?.(),this._progressTimer&&(clearInterval(this._progressTimer),this._progressTimer=null),this._debouncedVolumeTimer&&(clearTimeout(this._debouncedVolumeTimer),this._debouncedVolumeTimer=null),this._manualSelectTimeout&&(clearTimeout(this._manualSelectTimeout),this._manualSelectTimeout=null),this._searchTimeoutHandle&&(clearTimeout(this._searchTimeoutHandle),this._searchTimeoutHandle=null),this._latestSearchToken=0,this._removeSourceDropdownOutsideHandler(),this._removeGrabScrollHandlers(),this._removeSearchSwipeHandlers(),window.removeEventListener("scroll",this._handleGlobalScroll),window.removeEventListener("resize",this._handleViewportResize),typeof this._teardownAdaptiveTextObserver=="function"&&this._teardownAdaptiveTextObserver(),Object.values(this._templateSubscriptions).forEach(e=>{try{typeof e=="function"&&e()}catch(t){console.warn("yamp: Error during template unsubscription:",t)}}),this._templateSubscriptions={},this._adaptiveScrollTimer&&(clearTimeout(this._adaptiveScrollTimer),this._adaptiveScrollTimer=null),this._lastPlayingEntityId=null,this._controlFocusEntityId=null,this._teardownAdaptiveTextObserver()}_applyClosingAnimations(){const e=this.renderRoot.querySelector(".entity-options-overlay"),t=this.renderRoot.querySelector(".entity-options-container"),a=this.renderRoot.querySelector(".entity-options-sheet");e&&(e.classList.remove("entity-options-overlay-opening"),e.classList.add("entity-options-overlay-closing")),t&&(t.classList.remove("entity-options-container-opening"),t.classList.add("entity-options-container-closing")),a&&(a.classList.remove("entity-options-sheet-opening"),a.classList.add("entity-options-sheet-closing"))}_dismissWithAnimation(){if(this._cardType==="search"){this._showGrouping=!1,this._showSourceList=!1,this._showResolvedEntities=!1,this._showTransferQueue=!1,this._transferQueuePendingTarget=null,this._transferQueueStatus=null,this._showEntityOptions=!0,this._showSearchInSheet=!0,this._quickMenuInvoke=!1,this.requestUpdate();return}this._applyClosingAnimations(),this._transferQueueAutoCloseTimer&&(clearTimeout(this._transferQueueAutoCloseTimer),this._transferQueueAutoCloseTimer=null),setTimeout(()=>{this._showEntityOptions=!1,this._showGrouping=!1,this._showSourceList=!1,this._showSearchInSheet=!1,this._showResolvedEntities=!1,this._showTransferQueue=!1,this._transferQueuePendingTarget=null,this._transferQueueStatus=null,this._quickMenuInvoke=!1,this.requestUpdate()},200)}_closeEntityOptions(){if(this._cardType==="search"){this._showGrouping=!1,this._showSourceList=!1,this._showTransferQueue=!1,this._transferQueuePendingTarget=null,this._transferQueueStatus=null,this._showResolvedEntities=!1,this.requestUpdate();return}this._applyClosingAnimations(),this._transferQueueAutoCloseTimer&&(clearTimeout(this._transferQueueAutoCloseTimer),this._transferQueueAutoCloseTimer=null),setTimeout(()=>{if(this._showTransferQueue=!1,this._transferQueuePendingTarget=null,this._transferQueueStatus=null,this._showGrouping){this._showGrouping=!1,this._showEntityOptions=!1;const e=this.groupedSortedEntityIds,t=this.currentEntityId,a=e.find(r=>r.includes(t));if(a&&a.length>1){const r=this._getActualGroupMaster(a),s=this.entityIds.indexOf(r);s>=0&&(this._selectedIndex=s)}this.requestUpdate()}else this._showEntityOptions=!1,this._showGrouping=!1,this._showSourceList=!1,this._showSearchInSheet=!1,this._showResolvedEntities=!1,this._searchInputAutoFocused=!1,this._searchHierarchy=[],this._searchBreadcrumb="",this._addToPlaylistTarget=null,this.requestUpdate();this._quickMenuInvoke=!1},200)}async _openEntityOptions(){for(let e=0;e<this.entityObjs.length;e++)await this._ensureResolvedMaForIndex(e);await this._updateTransferQueueAvailability({refresh:!0}),this._showEntityOptions=!0,this.requestUpdate(),this.updateComplete.then(()=>{const e=this.renderRoot?.querySelector(".entity-options-chips-strip");e&&(e.scrollLeft=0)})}_openGrouping(){this._showEntityOptions=!0,this._showGrouping=!0;const e=this.currentEntityId;let t=e;if(e){const a=(this.groupedSortedEntityIds||[]).find(r=>r.includes(e));if(a&&a.length){const r=this._getActualGroupMaster(a);r&&(t=r)}}!t&&this.entityIds&&this.entityIds.length&&(t=this.entityIds[0]),this._lastGroupingMasterId=t,this.requestUpdate()}_openSourceList(){this._showEntityOptions=!0,this._showSourceList=!0,this._showGrouping=!1,this.requestUpdate()}_closeSourceList(){this._showSourceList=!1,this.requestUpdate()}_closeGrouping(){this._showGrouping=!1}async _toggleGroup(e){const t=this._getGroupingMasterId(),a=t?this.entityIds.indexOf(t):-1,r=a>=0?this.entityObjs[a]:null;if(!r)return;const s=await this._resolveGroupingEntityId(r,t);if(!s)return;const n=this.entityObjs.find(c=>c.entity_id===e);if(!n)return;const o=await this._resolveGroupingEntityId(n,e);if(!o)return;const l=s?this.hass.states[s]:null;Array.isArray(l?.attributes?.group_members)&&l.attributes.group_members.includes(o)?await this.hass.callService("media_player","unjoin",{entity_id:o}):await this.hass.callService("media_player","join",{entity_id:s,group_members:[o]}),this._lastGroupingMasterId=t||e}static getConfigElement(){return document.createElement("yet-another-media-player-editor")}static getStubConfig(e,t){return{entities:(t||[]).filter(a=>a.startsWith("media_player.")).slice(0,2),disable_mass_queue:!1}}async _groupAll(){const e=this._getGroupingMasterId(),t=e?this.entityIds.indexOf(e):-1,a=t>=0?this.entityObjs[t]:null;if(!a)return;const r=await this._resolveGroupingEntityId(a,e);if(!r)return;const s=this.hass.states[r];if(!this._isGroupCapable(s))return;const n=Array.isArray(s.attributes?.group_members)?s.attributes.group_members:[],o=[];for(const l of this.entityIds){if(l===e)continue;const c=this.entityObjs.find(p=>p.entity_id===l);if(!c)continue;const h=await this._resolveGroupingEntityId(c,l);if(!h)continue;const u=this.hass.states[h];this._isGroupCapable(u)&&!n.includes(h)&&o.push(h)}o.length>0&&await this.hass.callService("media_player","join",{entity_id:r,group_members:o}),this._lastGroupingMasterId=e||this.currentEntityId}async _ungroupAll(){const e=this._getGroupingMasterId(),t=e?this.entityIds.indexOf(e):-1,a=t>=0?this.entityObjs[t]:null;if(!a)return;const r=await this._resolveGroupingEntityId(a,e);if(!r)return;const s=this.hass.states[r];if(!this._isGroupCapable(s))return;const n=(Array.isArray(s.attributes?.group_members)?s.attributes.group_members:[]).filter(o=>{const l=this.hass.states[o];return this._isGroupCapable(l)});for(const o of n)await this.hass.callService("media_player","unjoin",{entity_id:o});this._lastGroupingMasterId=e||this.currentEntityId}_syncGroupVolume(){const e=this._getGroupingMasterId();if(!e)return;const t=this.entityIds.indexOf(e);if(t===-1)return;const a=this._getGroupingEntityId(t),r=a?this.hass.states[a]:null;if(!r||!this._isGroupCapable(r))return;const s=this._getVolumeEntityForGrouping(t)||a,n=this.hass.states[s],o=Number(n?.attributes?.volume_level);if(isNaN(o))return;const l=Array.isArray(r.attributes.group_members)?r.attributes.group_members:[],c=new Map;this.entityObjs.forEach((h,u)=>{c.set(this._getGroupingEntityId(u),u)});for(const h of l){if(h===a)continue;const u=c.get(h);if(u!==void 0){const p=this._getVolumeEntityForGrouping(u)||h;this.hass.callService("media_player","volume_set",{entity_id:p,volume_level:o})}else this.hass.callService("media_player","volume_set",{entity_id:h,volume_level:o})}}_getResolvedEntitiesForCurrentChip(){const e=new Set,t=this._selectedIndex,a=this.entityObjs[t];if(!a)return[];e.add(a.entity_id);const r=this._getActualResolvedMaEntityForState(t);r&&r!==a.entity_id&&e.add(r);const s=this._getVolumeEntity(t);return s&&s!==a.entity_id&&s!==r&&e.add(s),Array.from(e)}_openMoreInfoForEntity(e){this.dispatchEvent(new CustomEvent("hass-more-info",{detail:{entityId:e},bubbles:!0,composed:!0}))}_handleSelectEntityFromHelper(){if(!this.hass||!this.config?.actions)return;this._lastSelectEntityValues||(this._lastSelectEntityValues=new Map);const e=this.config.actions.filter(t=>t.action==="select_entity"&&t.sync_entity_helper);if(e.length!==0)for(const t of e){const a=t.sync_entity_helper,r=t.sync_entity_type||"yamp_entity",s=this.hass.states[a]?.state;if(!s||s==="unknown"||s==="unavailable")continue;const n=`${a}-${r}`;if(this._lastSelectEntityValues.get(n)===s)continue;this._lastSelectEntityValues.set(n,s);let o=-1;for(let l=0;l<this.entityIds.length;l++){let c;if(r==="yamp_main_entity"?c=this.entityIds[l]:r==="yamp_playback_entity"?c=this._getActivePlaybackEntityId(l):c=this._getActualResolvedMaEntityForState(l)||this.entityIds[l],c===s){o=l;break}}o>=0&&o!==this._selectedIndex&&this._onChipClick(o)}}_updateSelectedEntityHelper(){if(!this.hass||!this.config?.actions)return;const e=this._selectedIndex;if(e==null||!this.entityObjs[e])return;this._lastSyncedActionValues||(this._lastSyncedActionValues=new Map);const t=this.config.actions.filter(a=>a.action==="sync_selected_entity"&&a.sync_entity_helper);if(t.length!==0)for(const a of t){const r=a.sync_entity_helper,s=a.sync_entity_type||"yamp_entity";let n;if(s==="yamp_main_entity"?n=this.entityIds[e]:s==="yamp_playback_entity"?n=this._getActivePlaybackEntityId(e):n=this._getActualResolvedMaEntityForState(e)||this.entityIds[e],!n)continue;const o=`${r}-${s}`;this._lastSyncedActionValues.get(o)!==n&&(this.hass.states[r]?.state!==n&&this.hass.callService("input_text","set_value",{entity_id:r,value:n}),this._lastSyncedActionValues.set(o,n))}}}ze(qa,"properties",{_quickGroupingMode:{state:!0},hass:{},config:{},_selectedIndex:{state:!0},_lastPlaying:{state:!0},_shouldDropdownOpenUp:{state:!0},_pinnedIndex:{state:!0},_showSourceList:{state:!0},_holdToPin:{state:!0},_showQueueSuccessMessage:{state:!0},_searchActiveOptionsItem:{state:!0},_activeSearchRowMenuId:{state:!0},_loadingSearchRowMenuId:{state:!0},_errorSearchRowMenuId:{state:!0},_successSearchRowMenuId:{state:!0},_successSearchRowType:{state:!0},_radioModeActive:{state:!0},_showEntityOptions:{state:!0},_showGrouping:{state:!0},_showTransferQueue:{state:!0},_showResolvedEntities:{state:!0},_showSearchInSheet:{state:!0},_addToPlaylistTarget:{state:!0},_showMediaTitleOptions:{state:!0},_dismissMenuAfterPlaylistAdd:{state:!1},_lyricsActive:{state:!0},_massLyrics:{state:!0},_fetchingLyrics:{state:!0},_lyricsError:{state:!0},_lastLyricsTrackId:{state:!0},_lastLyricsEntityId:{state:!0}}),ze(qa,"styles",No),customElements.define("yet-another-media-player",qa);
