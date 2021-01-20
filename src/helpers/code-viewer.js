import '@polymer/paper-icon-button/paper-icon-button.js';
import '@polymer/iron-icons/iron-icons.js';
import '@polymer/iron-icon/iron-icon.js';
import 'monaco-element';
import { Polymer } from '@polymer/polymer/lib/legacy/polymer-fn.js';
import { html } from '@polymer/polymer/lib/utils/html-tag.js';

Polymer({
  _template: html`
    <style include="shared-styles forms">
      [hidden] {
        display: none !important;
      }

      :host {
        display: block;
      }

      :host([fullscreen]) {
        position: fixed;
        top: 0px;
        bottom: 0;
        left: 0;
        right: 0;
        z-index: 99999;
        background-color: #fff;
        min-height: 100vh !important;
        height: 100vh !important;
        max-width: 100%;
      }
      .toolbar {
        display: flex;
        justify-content: flex-end;
        background-color: var(--code-viewer-background-color);
        color: var(--code-viewer-icons-color, var(--paper-grey-700));
      }
      #fullscreenBtn,
      #exitFullscreenBtn {
        padding: 4px;
      }
    </style>
    <div class="code-viewer">
      <div class="toolbar" hidden$="[[_computeHideToolbar(editorLoading)]]">
        <paper-icon-button
          icon="icons:content-copy"
          on-tap="_copyContents"
          id="copyBtn"
        ></paper-icon-button>
        <span hidden$="[[!enableFullscreen]]">
          <paper-icon-button
            icon="icons:fullscreen"
            hidden$="[[fullscreen]]"
            on-tap="_enterFullscreen"
            id="fullscreenBtn"
          ></paper-icon-button>
          <paper-icon-button
            icon="icons:fullscreen-exit"
            hidden$="[[!fullscreen]]"
            on-tap="_exitFullscreen"
            id="exitFullscreenBtn"
          ></paper-icon-button>
        </span>
      </div>
      <monaco-element
        language="[[language]]"
        theme="[[theme]]"
        name="[[name]]"
        value="{{value}}"
        loading="{{editorLoading}}"
        on-value-changed="_handleValueChanged"
      >
        <span slot="loader">Loading...</span>
      </monaco-element>
    </div>
  `,

  is: 'code-viewer',

  properties: {
    theme: {
      type: String,
    },
    language: {
      type: String,
    },
    value: {
      type: String,
    },
    fullscreen: {
      type: Boolean,
      value: false,
      reflectToAttribute: true,
    },
    showToolbar: {
      type: Boolean,
      value: true,
    },
    editorLoading: {
      type: Boolean,
      value: true,
    },
    enableFullscreen: {
      type: Boolean,
      value: true,
    },
  },
  _handleValueChanged(e) {
    this.dispatchEvent(new CustomEvent('value-changed', { detail: e.detail }));
  },
  _enterFullscreen() {
    this.set('fullscreen', true);
    this.fire('enter-fullscreen');
  },
  _computeHideToolbar() {
    return !this.showToolbar || this.editorLoading;
  },
  _exitFullscreen() {
    this.set('fullscreen', false);
    this.fire('exit-fullscreen');
  },
  _copyContents() {
    const listener = e => {
      e.preventDefault();
      e.clipboardData.setData('text/plain', this.value);
    };
    document.addEventListener('copy', listener);
    document.execCommand('copy');
    document.removeEventListener('copy', listener);
  },
  ready() {},
});
