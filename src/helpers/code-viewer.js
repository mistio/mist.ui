import '@polymer/paper-icon-button/paper-icon-button.js';
import '@polymer/iron-icons/iron-icons.js';
import '@polymer/iron-icon/iron-icon.js';
import '@polymer/paper-dropdown-menu/paper-dropdown-menu.js';
import '@polymer/paper-listbox/paper-listbox.js';
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
        width: 100%;
        height: 100%;
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
        margin-top: 0!important;
        margin-left: 0!important;
      }
      #wrapper {
        height: 100%;
      }
      #toolbar {
        display: flex;
        justify-content: flex-end;
        align-items: center;
        height: 46px;
        padding-bottom: 5px;
        border: 1px solid var(--code-viewer-toolbar-color, transparent);
        background-color: var(--code-viewer-toolbar-background-color, transparent);
        color: var(--code-viewer-icons-color, var(--paper-grey-500));
        font-family: monospace;
      }
      #language, #languageDropdown {
        margin-top: -4px;
        margin-left: 30px;
        margin-right: auto;
      }
      #fullscreenBtn,
      #exitFullscreenBtn {
        padding: 4px;
      }
      #toolbar + monaco-element {
        height: calc(100% - 55px);
      }
    </style>
    <div id="wrapper">
      <div id="toolbar" hidden$="[[_computeHideToolbar(editorLoading)]]">
      <paper-dropdown-menu id="languageDropdown" hidden$="[[!showLanguageDropdown]]" on-value-changed="_languageChanged">
        <paper-listbox attr-for-selected="value" selected="bash"
          slot="dropdown-content"
          class="dropdown-content"
        >
          <template is="dom-repeat" items="[[languages]]" as="lang">
            <paper-item value="[[lang.name]]">[[lang.name]]</paper-item>
          </template>
        </paper-listbox>
      </paper-dropdown-menu>
      <span id="language" hidden$="[[!showLanguage]]">[[language]]</span>
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
      value: 'vs-dark',
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
    showLanguageDropdown: {
      type: Boolean,
      value: false,
      reflectToAttribute: true
    },
    showLanguage: {
      type: Boolean,
      value: false,
      reflectToAttribute: true
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
    const {value} = e.detail;
    if (!value) { return; }
    const newLanguage = this.languages.find(lang => lang.name === value);
    this.language = newLanguage.type;
    this.dispatchEvent(new CustomEvent('editor-language-changed', {
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
