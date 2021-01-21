import '@polymer/paper-icon-button/paper-icon-button.js';
import '@polymer/iron-icons/iron-icons.js';
import '@polymer/iron-icon/iron-icon.js';
import '@polymer/paper-dropdown-menu/paper-dropdown-menu.js';
import '@polymer/paper-listbox/paper-listbox.js';
import 'monaco-element';
import { Polymer } from '@polymer/polymer/lib/legacy/polymer-fn.js';
import { html } from '@polymer/polymer/lib/utils/html-tag.js';
  // TODO add styles for fullscreen etc depending on theme
Polymer({
  _template: html`
    <style include="shared-styles forms">
      [hidden] {
        display: none !important;
      }

      :host {
        display: block;
        width: 100%;
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
        border: 1px solid;
        background-color: var(--code-viewer-toolbar-background-color);
        color: var(--code-viewer-icons-color, var(--paper-grey-700));
      }
      .language {
        flex: 1;
        margin-left: 40px;
      }
      #fullscreenBtn,
      #exitFullscreenBtn {
        padding: 4px;
      }
    </style>
    <div class="code-viewer">
      <div class="toolbar" hidden$="[[_computeHideToolbar(editorLoading)]]">
      <paper-dropdown-menu selected="1" on-value-changed="_languageChanged">
        <paper-listbox
          slot="dropdown-content"
          class="dropdown-content"
        >
          <template is="dom-repeat" items="[[languages]]" as="lang">
            <paper-item>[[lang.name]]</paper-item>
          </template>
        </paper-listbox>
      </paper-dropdown-menu>
      <span class="language">[[language]]</span>
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
        value="[[value]]"
        loading="{{editorLoading}}"
        on-value-changed="_handleValueChanged"
        readOnly="[[readOnly]]"
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
    languages: {
      type: Array,
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
    // Added debounce because pressing buttons too quickly caused an endless event feedback loop
    this.debounce(
      'valueChanged',
      () => {
        this.dispatchEvent(new CustomEvent('editor-value-changed', { detail: e.detail }));
      },
      300
    );

  },
  _languageChanged(e) {
    console.log("e ", e)
    const value = e.detail.value;
    if (!value) { return; }
    const newLanguage = this.languages.find(lang => lang.name === value);
    this.language = newLanguage.type;
console.log("the language changed in code-viewer")
    this.dispatchEvent(    new CustomEvent('editor-language-changed', {
      bubbles: true,
      composed: true,
      detail: {
        language: newLanguage
      },
    }));
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
