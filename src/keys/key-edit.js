import '../../../../@polymer/polymer/polymer-legacy.js';
import '../../../../@polymer/paper-styles/typography.js';
import '../../../../@polymer/paper-button/paper-button.js';
import '../../../../vaadin-dialog/vaadin-dialog.js';
import '../../../../mist-list/mist-list-actions-behavior.js';
import { Polymer } from '../../../../@polymer/polymer/lib/legacy/polymer-fn.js';
import { html } from '../../../../@polymer/polymer/lib/utils/html-tag.js';
Polymer({
  _template: html`
        <style include="shared-styles dialogs">
            :host {
            }

            paper-card {
                display: block;
            }

            paper-dialog {
                width: 300px;
            }
            .submit-btn {
                background-color: var(--mist-blue);
                color: #fff;
            }
            .note {
                font-size: 0.9em;
            }
        </style>

        <vaadin-dialog id="editKeyModal">
            <template>
                <h2>Rename Key</h2>        
                <div class="paper-dialog-scrollable">
                    <p class="note">Alpha-numeric characters only.</p>
                    <p>
                        <paper-input id="name" label="Name" required="" allowed-pattern="[A-Za-z0-9]" error-message="Please enter key's name" value="{{newKey.name}}"></paper-input>
                    </p>
                    <div class="clearfix btn-group">
                        <paper-button on-tap="_dismissDialog">Cancel</paper-button>
                        <paper-button class="submit-btn btn-block" disabled\$="[[!formReady]]" raised="" on-tap="_submitForm" dialog-confirm="">Submit</paper-button>
                    </div>
                </div>
            </template>
        </vaadin-dialog>

        <iron-ajax id="keyEditAjaxRequest" url="/api/v1/keys/[[key.id]]" method="PUT" on-response="_handleKeyEditAjaxResponse" on-error="_handleKeyEditAjaxError"></iron-ajax>
`,

  is: 'key-edit',
  behaviors: [MistListActionsBehavior],

  properties: {
      key: {
          type: Object
      },
      newKey: {
          type: Object,
          computed: '_computeNewKey(key)',
          notify: true
      },
      sendingData: {
          type: Boolean,
          value: false
      },
      formReady: {
          type: Boolean,
          computed: '_computeFormReady(key.name, newKey.name, sendingData)'
      }
  },

  listeners: {
      // 'iron-overlay-closed': '_modalClosed'
  },

  _computeNewKey: function(key) {
      if (key) {
          return {
              name: key.name
          };
      }
  },

  _computeFormReady: function(name, newName, sendingData) {
      var formReady = false;

      if (newName && name != newName) {
          formReady = true;
      }

      if (sendingData) {
          formReady = false;
      }

      return formReady;
  },

  _openEditKeyModal: function(e) {
      this.$.editKeyModal.opened = true;
  },

  _closeEditKeyModal: function(e) {
      this.$.editKeyModal.opened = false;
  },

  _modalClosed: function() {
      this._formReset();
  },

  _submitForm: function(e) {
      // this.dispatchEvent(new CustomEvent('updateSelectedKey', { bubbles: true, composed: true, detail: {
      //     key: this.key
      // } }));
      this.$.keyEditAjaxRequest.headers["Content-Type"] = 'application/json';
      this.$.keyEditAjaxRequest.headers["Csrf-Token"] = CSRF_TOKEN;
      this.$.keyEditAjaxRequest.body = {
          new_name: this.newKey.name
      };
      this.$.keyEditAjaxRequest.generateRequest();

      this.set('sendingData', true);
  },

  _formReset: function() {
      //   this.set('key.name', '');
  },

  _handleKeyEditAjaxResponse: function(e) {
      this.set('sendingData', false);
      this._closeEditKeyModal();
  }
});
