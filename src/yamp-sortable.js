// import { LitElement, html, css } from "https://unpkg.com/lit-element@3.3.3/lit-element.js?module";
// import Sortable from "https://cdn.jsdelivr.net/npm/sortablejs@1.15.0/+esm";
import { LitElement, html } from "lit";
import Sortable from "sortablejs";

class YampSortable extends LitElement {
  static get properties() {
    return {
      disabled: { type: Boolean },
      handleSelector: { type: String },
      draggableSelector: { type: String },
      delay: { type: Number },
      delayOnTouchOnly: { type: Boolean },
      filter: { type: String },
      preventOnFilter: { type: Boolean },
    };
  }

  constructor() {
    super();
    this.disabled = false;
    this.handleSelector = ".handle";
    this.draggableSelector = ".sortable-item";
    this.delay = 0;
    this.delayOnTouchOnly = false;
    this.filter = "";
    this.preventOnFilter = true;
    this._sortable = null;
    this._captureClickFn = null;
    this._captureClickTimeout = null;
    this._restoreDraggableFn = null;
  }

  createRenderRoot() {
    return this;
  }

  render() {
    return html` <slot></slot> `;
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
      handle: this.handleSelector || undefined,
      delay: this.delay,
      delayOnTouchOnly: this.delayOnTouchOnly,
      filter: this.filter || undefined,
      preventOnFilter: this.preventOnFilter,
      // Mobile-specific options to fix ghost issues
      fallbackTolerance: 3,
      fallbackOnBody: true,
      fallbackClass: "sortable-fallback",
      // Force fallback (touch/mouse simulation) to disable native HTML5 drag-and-drop and its bubble issues
      forceFallback: true,

      onChoose: this._handleChoose.bind(this),
      onStart: this._handleStart.bind(this),
      onEnd: this._handleEnd.bind(this),
      onUpdate: this._handleUpdate.bind(this),
    };

    this._sortable = new Sortable(container, options);

    // Stop drag-start events from bubbling to prevent Home Assistant dashboard from dragging the card
    this._stopBubble = (e) => {
      // If the target is interactive, let it bubble so clicks work
      if (e.target.closest && e.target.closest(".queue-controls, button, ha-icon, ha-svg-icon")) {
        return;
      }
      e.stopPropagation();
      this._disableDraggableAncestor();
    };
    container.addEventListener("mousedown", this._stopBubble);
    container.addEventListener("touchstart", this._stopBubble, { passive: true });
    container.addEventListener("pointerdown", this._stopBubble);
    container.addEventListener("dragstart", this._stopBubble);
    container.addEventListener("dragend", this._stopBubble);
    container.addEventListener("drop", this._stopBubble);
  }

  _handleUpdate(evt) {
    this.dispatchEvent(
      new CustomEvent("item-moved", {
        detail: {
          oldIndex: evt.oldIndex,
          newIndex: evt.newIndex,
        },
        bubbles: true,
        composed: true,
      })
    );
  }

  _handleEnd(evt) {
    // Clean up any remaining ghost elements
    this._cleanupGhostElements();

    // Put back in original location if needed
    if (evt.item.placeholder) {
      evt.item.placeholder.replaceWith(evt.item);
      delete evt.item.placeholder;
    }

    // Capture the next click event on the window to prevent accidental clicks after drag
    const dragEndTime = Date.now();
    if (this._captureClickFn) {
      window.removeEventListener("click", this._captureClickFn, true);
    }
    if (this._captureClickTimeout) {
      clearTimeout(this._captureClickTimeout);
    }

    this._captureClickFn = (e) => {
      const elapsed = Date.now() - dragEndTime;
      if (elapsed < 200) {
        e.stopPropagation();
        e.preventDefault();
      }
      window.removeEventListener("click", this._captureClickFn, true);
      this._captureClickFn = null;
      if (this._captureClickTimeout) {
        clearTimeout(this._captureClickTimeout);
        this._captureClickTimeout = null;
      }
    };
    window.addEventListener("click", this._captureClickFn, true);
    // Remove the listener after a safety timeout in case no click is fired
    this._captureClickTimeout = setTimeout(() => {
      if (this._captureClickFn) {
        window.removeEventListener("click", this._captureClickFn, true);
        this._captureClickFn = null;
      }
      this._captureClickTimeout = null;
    }, 2000);

    this.dispatchEvent(
      new CustomEvent("drag-end", {
        bubbles: true,
        composed: true,
      })
    );
  }

  _handleStart(evt) {
    // Ensure proper cleanup on start
    this._cleanupGhostElements();

    this.dispatchEvent(
      new CustomEvent("drag-start", {
        bubbles: true,
        composed: true,
      })
    );
  }

  _handleChoose(evt) {
    // Create placeholder to maintain layout
    evt.item.placeholder = document.createComment("sort-placeholder");
    evt.item.after(evt.item.placeholder);
  }

  _cleanupGhostElements() {
    // Remove any lingering ghost elements
    const ghostElements = document.querySelectorAll(".sortable-fallback, .sortable-ghost");
    ghostElements.forEach((el) => {
      if (el.parentNode) {
        el.parentNode.removeChild(el);
      }
    });
  }

  _destroySortable() {
    if (this._captureClickTimeout) {
      clearTimeout(this._captureClickTimeout);
      this._captureClickTimeout = null;
    }
    if (this._captureClickFn) {
      window.removeEventListener("click", this._captureClickFn, true);
      this._captureClickFn = null;
    }
    if (this._restoreDraggableFn) {
      this._restoreDraggableFn();
    }

    if (!this._sortable) return;
    this._sortable.destroy();
    this._sortable = null;

    const container = this.children[0];
    if (container && this._stopBubble) {
      container.removeEventListener("mousedown", this._stopBubble);
      container.removeEventListener("touchstart", this._stopBubble);
      container.removeEventListener("pointerdown", this._stopBubble);
      container.removeEventListener("dragstart", this._stopBubble);
      container.removeEventListener("dragend", this._stopBubble);
      container.removeEventListener("drop", this._stopBubble);
    }

    // Clean up any remaining ghost elements
    this._cleanupGhostElements();
  }

  _disableDraggableAncestor() {
    if (this._draggableAncestor) return;

    let parent = this;
    while (parent) {
      if (parent.getAttribute && parent.getAttribute("draggable") === "true") {
        this._draggableAncestor = parent;
        parent.setAttribute("draggable", "false");
        break;
      }
      parent = parent.parentElement || (parent.getRootNode && parent.getRootNode().host);
    }

    if (this._draggableAncestor) {
      this._restoreDraggableFn = () => {
        if (this._draggableAncestor) {
          this._draggableAncestor.setAttribute("draggable", "true");
          this._draggableAncestor = null;
        }
        window.removeEventListener("mouseup", this._restoreDraggableFn);
        window.removeEventListener("touchend", this._restoreDraggableFn);
        window.removeEventListener("pointerup", this._restoreDraggableFn);
        this._restoreDraggableFn = null;
      };
      window.addEventListener("mouseup", this._restoreDraggableFn);
      window.addEventListener("touchend", this._restoreDraggableFn);
      window.addEventListener("pointerup", this._restoreDraggableFn);
    }
  }
}

customElements.define("yamp-sortable", YampSortable);
