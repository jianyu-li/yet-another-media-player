// import { LitElement, html, css, nothing } from "lit";
// import Sortable from "sortablejs";
import { LitElement, html, css, nothing } from "lit";
import Sortable from "sortablejs";

class YampSortable extends LitElement {
  static get properties() {
    return {
      disabled: { type: Boolean },
      handleSelector: { type: String },
      draggableSelector: { type: String },
    };
  }

  static get styles() {
    return css`
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
    return html`
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
      onUpdate: this._handleUpdate.bind(this),
    };

    this._sortable = new Sortable(container, options);
  }

  _handleUpdate(evt) {
    this.dispatchEvent(new CustomEvent("item-moved", {
      detail: {
        oldIndex: evt.oldIndex,
        newIndex: evt.newIndex,
      },
      bubbles: true,
      composed: true,
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
