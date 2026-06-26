/**
 * Mixin to handle custom pointer-event logic for dragging and dropping items in the Mass Queue.
 * Extracts the complex pointer math and visual DOM manipulations out of the main component.
 */
import { localize } from "./localize/localize.js";

export const QueueDragMixin = (superClass) =>
  class extends superClass {
    _findScrollParent(el) {
      let node = el.parentElement;
      while (node) {
        const style = window.getComputedStyle(node);
        const overflowY = style?.overflowY;
        if (overflowY === "auto" || overflowY === "scroll") {
          return node;
        }
        // Check shadow DOM hosts
        if (!node.parentElement && node.getRootNode && node.getRootNode().host) {
          node = node.getRootNode().host;
        } else {
          node = node.parentElement;
        }
      }
      return null;
    }

    _applyQueueDragVisuals(dragIdx, dragItemHeight, newTargetIdx) {
      const container = this.renderRoot.querySelector(".queue-sortable-container");
      if (!container) return;
      const isCard = container.classList.contains("is-card-layout");

      const wrappers = container.querySelectorAll(".queue-drag-wrapper");

      for (const w of wrappers) {
        const idx = parseInt(w.dataset.queueIdx, 10);
        if (isNaN(idx)) continue;

        // Ghost: hide the dragged item but maintain its layout space to prevent shifting siblings
        if (idx === dragIdx) {
          w.style.opacity = "0";
          w.style.pointerEvents = "none";
          if (isCard) w.style.order = newTargetIdx !== null ? newTargetIdx : idx;
          continue;
        }

        if (isCard) {
          // In grid mode, we use CSS order for layout shifting
          w.style.transform = "";
          let order = idx;
          if (newTargetIdx !== null) {
            if (dragIdx < newTargetIdx && idx > dragIdx && idx <= newTargetIdx) {
              order = idx - 1;
            } else if (dragIdx > newTargetIdx && idx >= newTargetIdx && idx < dragIdx) {
              order = idx + 1;
            }
          }
          w.style.order = order;
        } else {
          // In list mode, shift rows vertically to open a gap at the drop target
          w.style.order = "";
          if (newTargetIdx === null) {
            w.style.transform = "";
          } else if (dragIdx < newTargetIdx) {
            // Dragging downward: items between (dragIdx, newTargetIdx] shift up
            if (idx > dragIdx && idx <= newTargetIdx) {
              w.style.transform = `translateY(${-dragItemHeight}px)`;
            } else {
              w.style.transform = "";
            }
          } else {
            // Dragging upward: items between [newTargetIdx, dragIdx) shift down
            if (idx >= newTargetIdx && idx < dragIdx) {
              w.style.transform = `translateY(${dragItemHeight}px)`;
            } else {
              w.style.transform = "";
            }
          }
        }
      }
    }

    _clearQueueDragVisuals() {
      const container = this.renderRoot.querySelector(".queue-sortable-container");
      if (!container) return;

      const wrappers = container.querySelectorAll(".queue-drag-wrapper");
      for (const w of wrappers) {
        w.style.transform = "";
        w.style.maxHeight = "";
        w.style.overflow = "";
        w.style.margin = "";
        w.style.padding = "";
        w.style.opacity = "";
        w.style.pointerEvents = "";
        w.style.order = "";
      }
    }

    _onQueueDragStart(e) {
      // Restrict dragging to the drag handle when configured, or disable completely if movement buttons are selected
      const style = this.config?.queue_controls_style || "drag_handle";
      if (style === "drag_handle") {
        if (!e.target.closest || !e.target.closest(".queue-drag-handle")) {
          return;
        }
      } else {
        // Movement buttons (icons) style is selected: disable drag-and-drop
        return;
      }

      const wrapper = e.target.closest(".queue-drag-wrapper");
      if (!wrapper) return;

      const dragIdx = parseInt(wrapper.dataset.queueIdx, 10);
      if (isNaN(dragIdx)) return;

      // Clean up any existing drag in progress
      if (this._activeDragCleanup) {
        this._activeDragCleanup();
      }

      // Stop propagation to prevent HA dashboard from reacting
      e.stopPropagation();

      const startY = e.clientY;
      const startX = e.clientX;
      let holdTimer = null;
      let isDragging = false;
      let floatingClone = null;
      let cloneOffsetY = 0;
      let cloneOffsetX = 0;

      let scrollContainer = null;
      let scrollSpeed = 0;
      let scrollAnimationFrame = null;
      let dropZoneEl = null;
      let dropZoneRect = null;
      let dropZoneContentEl = null;
      let dropZoneIconEl = null;
      let isHoveringDropZone = false;
      let lastClientY = startY;
      let lastClientX = startX;
      let currentDropTargetIdx = null;

      let cachedPositions = null;
      let startScrollTop = 0;

      // Use a long-press delay on touch, threshold-move on mouse
      const isTouchLike = e.pointerType === "touch" || e.pointerType === "pen";
      const holdDelay = isTouchLike ? 300 : null;

      // Apply inline transforms to physically shift rows apart, creating a gap
      let dragItemHeight = 0;

      const updateDropTarget = (clientX, clientY) => {
        if (!cachedPositions) return;

        // Check if hovering over Play Next dropzone
        if (dropZoneEl) {
          if (isHoveringDropZone) {
            if (!dropZoneEl._isActive) {
              dropZoneEl._isActive = true;
              dropZoneEl.style.background = "rgba(76, 175, 80, 0.4)";
              dropZoneEl.style.borderColor = "#4caf50";
              dropZoneEl.style.borderStyle = "solid";
              if (dropZoneContentEl) dropZoneContentEl.style.color = "#4caf50";
              if (dropZoneIconEl) dropZoneIconEl.style.color = "#4caf50";
            }
            if (currentDropTargetIdx !== 0) {
              currentDropTargetIdx = 0;
              this._queueDropTargetIdx = 0;
              this._applyQueueDragVisuals(dragIdx, dragItemHeight, 0);
            }
            return; // Skip finding closest row
          } else if (dropZoneEl._isActive) {
            dropZoneEl._isActive = false;
            dropZoneEl.style.background = "var(--ha-card-background, var(--card-background-color, #1c1c1c))";
            dropZoneEl.style.borderColor = "var(--custom-accent, var(--accent-color, #ff9800))";
            dropZoneEl.style.borderStyle = "dashed";
            if (dropZoneContentEl) dropZoneContentEl.style.color = "";
            if (dropZoneIconEl) dropZoneIconEl.style.color = "";
          }
        }

        const scrollDiff = scrollContainer ? scrollContainer.scrollTop - startScrollTop : 0;
        let closestIdx = null;
        let closestDist = Infinity;

        for (const pos of cachedPositions) {
          if (pos.idx === dragIdx) continue;

          // Adjust original static position by how much we've scrolled since drag started
          const adjustedMidY = pos.midY - scrollDiff;
          const distX = clientX - pos.midX;
          const distY = clientY - adjustedMidY;
          const dist = Math.sqrt(distX * distX + distY * distY);

          if (dist < closestDist) {
            closestDist = dist;
            closestIdx = pos.idx;
          }
        }

        if (closestIdx !== null && closestIdx !== currentDropTargetIdx) {
          currentDropTargetIdx = closestIdx;
          this._queueDropTargetIdx = closestIdx;
          this._applyQueueDragVisuals(dragIdx, dragItemHeight, closestIdx);
        }
      };

      const scrollLoop = () => {
        if (!isDragging || !scrollContainer) return;
        if (scrollSpeed !== 0) {
          scrollContainer.scrollTop += scrollSpeed;
          updateDropTarget(lastClientX, lastClientY);
        }
        scrollAnimationFrame = requestAnimationFrame(scrollLoop);
      };

      const startDrag = () => {
        isDragging = true;
        this._isDragging = true;
        this._queueDragIdx = dragIdx;
        this._queueDropTargetIdx = null;
        currentDropTargetIdx = null;

        // Measure the item height for translateY shifts
        const wrapperRect = wrapper.getBoundingClientRect();
        dragItemHeight = wrapperRect.height;
        const container = this.renderRoot.querySelector(".queue-sortable-container");
        if (container) {
          container.style.setProperty("--queue-drag-item-h", `${wrapperRect.height}px`);
          container.style.touchAction = "none";
          scrollContainer = this._findScrollParent(container);
          if (scrollContainer) {
            scrollAnimationFrame = requestAnimationFrame(scrollLoop);
            startScrollTop = scrollContainer.scrollTop;
          }

          // Cache original static positions to prevent flickering on layout shifts
          const itemElements = container.querySelectorAll(
            ".queue-drag-wrapper > .yamp-search-result"
          );
          cachedPositions = [];
          for (const el of itemElements) {
            const wrapperEl = el.parentElement;
            const idx = parseInt(wrapperEl.dataset.queueIdx, 10);
            if (!isNaN(idx)) {
              const rect = el.getBoundingClientRect();
              cachedPositions.push({
                idx,
                midX: rect.left + rect.width / 2,
                midY: rect.top + rect.height / 2,
              });
            }
          }

          // Create the Play Next dropzone — fixed overlay at the top of the card
          dropZoneEl = document.createElement("div");
          dropZoneEl.className = "queue-play-next-dropzone";
          dropZoneEl.innerHTML = `
            <div class="dropzone-content">
              <ha-icon icon="mdi:playlist-play"></ha-icon>
              <span>${localize("search.play_next")}</span>
            </div>
          `;

          // Use the same proven pattern as the floating clone:
          // all positioning inline, position:fixed, appended to renderRoot
          const hostRect = this.getBoundingClientRect();
          dropZoneEl.style.cssText = `
            position: fixed;
            top: ${hostRect.top}px;
            left: ${hostRect.left}px;
            width: ${hostRect.width}px;
            height: 56px;
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
          `;
          this.renderRoot.appendChild(dropZoneEl);
          dropZoneRect = dropZoneEl.getBoundingClientRect();
          dropZoneContentEl = dropZoneEl.querySelector(".dropzone-content");
          dropZoneIconEl = dropZoneEl.querySelector("ha-icon");
        }

        // Apply ghost class on the dragged item immediately via DOM
        this._applyQueueDragVisuals(dragIdx, dragItemHeight, null);

        // Create a floating clone that follows the pointer
        const itemEl = wrapper.querySelector(".yamp-search-result");
        if (itemEl) {
          const rect = itemEl.getBoundingClientRect();
          cloneOffsetY = startY - rect.top;
          cloneOffsetX = startX - rect.left;

          floatingClone = itemEl.cloneNode(true);
          floatingClone.classList.add("queue-drag-clone");
          floatingClone.style.cssText = `
            position: fixed;
            left: ${rect.left}px;
            top: ${rect.top}px;
            width: ${rect.width}px;
            height: ${rect.height}px;
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
          `;
          this.renderRoot.appendChild(floatingClone);
        }
      };

      if (holdDelay !== null) {
        holdTimer = setTimeout(startDrag, holdDelay);
      }

      const onPointerMove = (moveEvt) => {
        moveEvt.stopPropagation();

        // If still waiting for long-press/motion-start, check if moved/threshold met
        if (!isDragging) {
          const dist = Math.abs(moveEvt.clientY - startY);
          if (isTouchLike) {
            if (dist > 10) {
              if (holdTimer) {
                clearTimeout(holdTimer);
                holdTimer = null;
              }
              cleanup();
            }
          } else {
            // Desktop mouse: start drag only after moving > 5 pixels
            if (dist > 5) {
              startDrag();
            }
          }
          return;
        }

        moveEvt.preventDefault();
        lastClientY = moveEvt.clientY;
        lastClientX = moveEvt.clientX;

        isHoveringDropZone = false;
        if (dropZoneRect) {
          if (lastClientY >= dropZoneRect.top && lastClientY <= dropZoneRect.bottom &&
              lastClientX >= dropZoneRect.left && lastClientX <= dropZoneRect.right) {
            isHoveringDropZone = true;
          }
        }

        // Move the floating clone to follow the pointer
        if (floatingClone) {
          floatingClone.style.top = `${lastClientY - cloneOffsetY}px`;
          floatingClone.style.left = `${lastClientX - cloneOffsetX}px`;
        }

        // Calculate scroll speed based on pointer position relative to scroll container
        if (scrollContainer) {
          if (isHoveringDropZone) {
            scrollSpeed = 0;
          } else {
            const scrollRect = scrollContainer.getBoundingClientRect();
            const topDiff = lastClientY - scrollRect.top;
            const bottomDiff = scrollRect.bottom - lastClientY;
            const threshold = 60;

            if (topDiff < threshold && topDiff > -50) {
              scrollSpeed = -Math.max(2, (threshold - topDiff) * 0.3);
            } else if (bottomDiff < threshold && bottomDiff > -50) {
              scrollSpeed = Math.max(2, (threshold - bottomDiff) * 0.3);
            } else {
              scrollSpeed = 0;
            }
          }
        }

        updateDropTarget(lastClientX, lastClientY);
      };

      const onPointerUp = (upEvt) => {
        upEvt.stopPropagation();
        if (holdTimer) {
          clearTimeout(holdTimer);
          holdTimer = null;
        }

        if (isDragging) {
          // Prevent next click event on window to avoid accidental play/activation
          const dragEndTime = Date.now();
          if (this._dragClickCaptureFn) {
            window.removeEventListener("click", this._dragClickCaptureFn, true);
          }
          if (this._dragClickCaptureTimeout) {
            clearTimeout(this._dragClickCaptureTimeout);
          }

          this._dragClickCaptureFn = (clickEvt) => {
            const elapsed = Date.now() - dragEndTime;
            if (elapsed < 200) {
              clickEvt.stopPropagation();
              clickEvt.preventDefault();
            }
            window.removeEventListener("click", this._dragClickCaptureFn, true);
            this._dragClickCaptureFn = null;
          };
          window.addEventListener("click", this._dragClickCaptureFn, true);
          this._dragClickCaptureTimeout = setTimeout(() => {
            if (this._dragClickCaptureFn) {
              window.removeEventListener("click", this._dragClickCaptureFn, true);
              this._dragClickCaptureFn = null;
            }
          }, 1000);

          this._clearQueueDragVisuals();

          if (currentDropTargetIdx !== null && currentDropTargetIdx !== dragIdx) {
            const newIndex = currentDropTargetIdx;
            this._queueDragIdx = null;
            this._queueDropTargetIdx = null;
            this._isDragging = false;
            this._onQueueItemMoved({ detail: { oldIndex: dragIdx, newIndex } });
          } else {
            this._queueDragIdx = null;
            this._queueDropTargetIdx = null;
            this._isDragging = false;
            this.requestUpdate();
          }
        } else {
          this._queueDragIdx = null;
          this._queueDropTargetIdx = null;
          this._isDragging = false;
        }

        cleanup();
      };

      const onPointerCancel = (cancelEvt) => {
        cancelEvt.stopPropagation();
        if (holdTimer) {
          clearTimeout(holdTimer);
          holdTimer = null;
        }

        this._clearQueueDragVisuals();

        this._queueDragIdx = null;
        this._queueDropTargetIdx = null;
        this._isDragging = false;
        this.requestUpdate();

        cleanup();
      };

      const onTouchMove = (evt) => {
        if (isDragging) {
          evt.preventDefault();
        }
      };

      const cleanup = () => {
        window.removeEventListener("pointermove", onPointerMove);
        window.removeEventListener("pointerup", onPointerUp);
        window.removeEventListener("pointercancel", onPointerCancel);
        window.removeEventListener("touchmove", onTouchMove, { passive: false });

        if (holdTimer) {
          clearTimeout(holdTimer);
          holdTimer = null;
        }

        if (scrollAnimationFrame) {
          cancelAnimationFrame(scrollAnimationFrame);
          scrollAnimationFrame = null;
        }

        // Restore touchAction on container
        const container = this.renderRoot.querySelector(".queue-sortable-container");
        if (container) {
          container.style.touchAction = "";
        }

        // Remove the floating clone
        if (floatingClone && floatingClone.parentNode) {
          floatingClone.remove();
        }
        floatingClone = null;
        
        // Remove the dropzone
        if (dropZoneEl && dropZoneEl.parentNode) {
          dropZoneEl.remove();
        }
        dropZoneEl = null;
        dropZoneRect = null;
        dropZoneContentEl = null;
        dropZoneIconEl = null;

        this._activeDragCleanup = null;
      };

      this._activeDragCleanup = cleanup;

      window.addEventListener("pointermove", onPointerMove);
      window.addEventListener("pointerup", onPointerUp);
      window.addEventListener("pointercancel", onPointerCancel);
      window.addEventListener("touchmove", onTouchMove, { passive: false });
    }
  };
