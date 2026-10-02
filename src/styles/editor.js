import { css } from "lit";

export const editorStyles = css`
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
          min-width: 0;
          max-width: 100%;
          box-sizing: border-box;
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
          min-width: 0;
          box-sizing: border-box;
        }
        /* wraps the action icon, name textbox and edit button */
        .action-row-inner {
          display: flex;
          align-items: flex-start;
          gap: 8px;
          padding: 6px 0px 6px 6px;
          margin: 0px -14px 0px 0px;
          min-width: 0;
          box-sizing: border-box;
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
          max-width: 100%;
          box-sizing: border-box;
        }
        .grow-children > * {
          flex: 1;
          min-width: 0;
          max-width: 100%;
          box-sizing: border-box;
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
          min-width: 0;
          max-width: 100%;
          box-sizing: border-box;
        }
        ha-code-editor {
          display: block;
          width: 100%;
          min-width: 0;
          max-width: 100%;
          box-sizing: border-box;
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
        .artwork-row {
          margin: 0;
          min-width: 0;
          max-width: 100%;
          box-sizing: border-box;
        }
        .artwork-row + .artwork-row {
          border-top: 1px solid var(--yamp-section-divider, rgba(255, 255, 255, 0.06));
        }
        .artwork-row .artwork-fields {
          display: flex;
          flex-direction: column;
          gap: 8px;
          flex: 1;
          min-width: 0;
          max-width: 100%;
          box-sizing: border-box;
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
      `;
