import '../../node_modules/@polymer/polymer/polymer-legacy.js';
import '../../node_modules/@polymer/paper-styles/typography.js';
import '../../node_modules/@polymer/paper-button/paper-button.js';
import '../../node_modules/@vaadin/vaadin-dialog/vaadin-dialog.js';
import { MistListActionsBehavior } from '../../node_modules/@mistio/mist-list/mist-list-actions-behavior.js';
import { CSRFToken } from '../helpers/utils.js';
import { Polymer } from '../../node_modules/@polymer/polymer/lib/legacy/polymer-fn.js';
import { html } from '../../node_modules/@polymer/polymer/lib/utils/html-tag.js';

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
  
          <vaadin-dialog id="editSecretModal">
              <template>
                  <h2>Rename Secret</h2>        
                  <div class="paper-dialog-scrollable">
                      <p class="note">Alpha-numeric characters only.</p>
                      <p>
                          <paper-input id="name" label="Name" required="" allowed-pattern="[A-Za-z0-9]" error-message="Please enter secrets's name" value="{{newSecret.name}}"></paper-input>
                      </p>
                      <div class="clearfix btn-group">
                          <paper-button on-tap="_dismissDialog">Cancel</paper-button>
                          <paper-button class="submit-btn btn-block" disabled\$="[[!formReady]]" raised="" on-tap="_submitForm" dialog-confirm="">Submit</paper-button>
                      </div>
                  </div>
              </template>
          </vaadin-dialog>
  
          <iron-ajax id="secretEditRequest" url="/api/v1/secrets/[[secret.id]]" method="PUT" on-response="_handleSecretEditResponse" on-error="_handleSecretEditAjaxError"></iron-ajax>
  `,
  
    is: 'secret-edit',

    properties: {
        secret: {
            type: Object
        },
        newSecret: {
            type: Object,
            computed: '_computeNewSecret(secret)',
            notify: true
        },
        sendingData: {
            type: Boolean,
            value: false
        },
        formReady: {
            type: Boolean,
            computed: '_computeFormReady(secret.name, newSecret.name, sendingData)'
        }
    },

    _computeNewSecret(secret) {
        if (secret) {
            return JSON.parse(JSON.stringify(secret));
        }
        return {};
    },

    _computeFormReady(name, newName, sendingData) {
        let formReady = false;
  
        if (newName && name !== newName) {
            formReady = true;
        }
  
        if (sendingData) {
            formReady = false;
        }
  
        return formReady;
    },

    _openEditSecretModal(_e) {
        this.$.editSecretModal.opened = true;
    },
  
    _closeEditSecretModal(_e) {
        this.$.editSecretModal.opened = false;
    },
  
    _modalClosed() {
        this._formReset();
    },
  
    _submitForm(_e) {
        this.$.secretEditRequest.headers["Content-Type"] = 'application/json';
        this.$.secretEditRequest.headers["Csrf-Token"] = CSRFToken.value;
        this.$.secretEditRequest.body = {
            secret: this.newSecret
        };
        this.$.keyEditAjaxRequest.generateRequest();
  
        this.set('sendingData', true);
    },
  
    _formReset() {
        //   this.set('key.name', '');
    },
  
    _handleKeyEditAjaxResponse(_e) {
        this.set('sendingData', false);
        this._closeEditSecretModal();
    }
})