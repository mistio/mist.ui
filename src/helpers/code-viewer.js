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
        margin-top: 0 !important;
        margin-left: 0 !important;
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
        background-color: var(
          --code-viewer-toolbar-background-color,
          transparent
        );
        color: var(--code-viewer-icons-color, var(--paper-grey-500));
        font-family: monospace;
      }
      #toolbar.vs-dark {
        border-bottom: 10px solid #1e1e1e;
      }
      #toolbar.vs-light {
        border-bottom: 10px solid #fff;
      }
      #language,
      #languageDropdown {
        margin-top: -4px;
        margin-left: 30px;
        margin-right: auto;
      }
      #fullscreenBtn,
      #exitFullscreenBtn {
        padding: 4px;
      }
      #toolbar + monaco-element {
        height: calc(100% - 65px);
      }
      .fullscreenBtn {
        margin-left: 12px;
      }
      .loader {
        height: 100%;
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 18px;
        color: var(--code-viewer-icons-color, var(--paper-grey-500));
      }
    </style>
    <div id="wrapper">
      <div
        id="toolbar"
        hidden$="[[_computeHideToolbar(editorLoading)]]"
        class$="[[theme]]"
      >
        <paper-dropdown-menu
          id="languageDropdown"
          hidden$="[[!showLanguageDropdown]]"
          on-value-changed="_languageChanged"
        >
          <paper-listbox
            attr-for-selected="value"
            selected="bash"
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
          id="copyBtn"
          title="Copy"
          on-tap="_copyScript"
        ></paper-icon-button>
        <paper-icon-button
          hidden$="[[!showDownload]]"
          icon="icons:file-download"
          id="downloadBtn"
          title="Download script"
          on-tap="_downloadScript"
        ></paper-icon-button>
        <span hidden$="[[!enableFullscreen]]" class="fullscreenBtn">
          <paper-icon-button
            icon="icons:fullscreen"
            id="fullscreenBtn"
            title="Enter fullscreen mode"
            hidden$="[[fullscreen]]"
            on-tap="_enterFullscreen"
          ></paper-icon-button>
          <paper-icon-button
            icon="icons:fullscreen-exit"
            id="exitFullscreenBtn"
            title="Exit fullscreen mode"
            hidden$="[[!fullscreen]]"
            on-tap="_exitFullscreen"
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
        read-only="[[readOnly]]"
      >
        <span class="loader" slot="loader">Loading...</span>
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
      reflectToAttribute: true,
    },
    showLanguage: {
      type: Boolean,
      value: false,
      reflectToAttribute: true,
    },
    showDownload: {
      type: Boolean,
      value: false,
      reflectToAttribute: true,
    },
    editorLoading: {
      type: Boolean,
      value: true,
    },
    enableFullscreen: {
      type: Boolean,
      value: true,
    },
    readOnly: {
      type: Boolean,
      value: false,
      reflectToAttribute: true,
    },
  },
  _getFileExtension() {
    const extensions = {
      node: 'js',
      python: 'py',
      xml: 'xml',
      perl: 'pl',
      fish: 'fish',
      zsh: 'zsh',
      bash: 'sh',
      sh: 'sh',
      powershell: 'ps1',
      yaml: 'yml',
      json: 'json',
    };

    return extensions[this.language] || 'sh';
  },
  _encode(script) {
    return encodeURIComponent(script);
  },
  _handleValueChanged(e) {
    // Added debounce because pressing buttons too quickly caused an endless event feedback loop
    this.debounce(
      'valueChanged',
      () => {
        this.dispatchEvent(
          new CustomEvent('editor-value-changed', { detail: e.detail })
        );
      },
      300
    );
  },
  _languageChanged(e) {
    const { value } = e.detail;
    if (!value) {
      return;
    }
    const newLanguage = this.languages.find(lang => lang.name === value);
    this.language = newLanguage.type;
    this.dispatchEvent(
      new CustomEvent('editor-language-changed', {
        bubbles: true,
        composed: true,
        detail: {
          language: newLanguage,
        },
      })
    );
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
  _copyScript() {
    const listener = e => {
      e.preventDefault();
      e.clipboardData.setData('text/plain', this.value);
    };
    document.addEventListener('copy', listener);
    const successful = document.execCommand('copy');
    document.removeEventListener('copy', listener);
    const message = successful
      ? 'Content copied to clipboard'
      : 'There was an error copying to clipboard!';
    this.dispatchEvent(
      new CustomEvent('toast', {
        bubbles: true,
        composed: true,
        detail: { msg: message, duration: 3000 },
      })
    );
  },
  _downloadScript() {
    const extension = this._getFileExtension();
    const filename = `script-${
      this.scriptName || this.language
    }.${extension}.txt`;
    const element = document.createElement('a');
    element.setAttribute(
      'href',
      `data:text/plain;charset=utf-8,${encodeURIComponent(this.value)}`
    );
    element.setAttribute('download', filename);
    element.style.display = 'none';
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  },
});
