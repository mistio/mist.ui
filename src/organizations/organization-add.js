import '@vaadin/vaadin-dialog/vaadin-dialog.js';
import '@polymer/paper-icon-button/paper-icon-button.js';
import '@polymer/paper-input/paper-input.js';
import '@polymer/paper-button/paper-button.js';
import '@polymer/iron-ajax/iron-ajax.js';
import '@polymer/paper-toggle-button/paper-toggle-button.js';
import { CSRFToken } from '../helpers/utils.js';
import { Polymer } from '@polymer/polymer/lib/legacy/polymer-fn.js';
import { html } from '@polymer/polymer/lib/utils/html-tag.js';

Polymer({
  _template: html`
    <style include="shared-styles dialogs">
      :host {
      }
      #errormsg {
        padding: 0 24px 24px 24px;
        color: var(--red-color);
      }
      .pad-bot {
        padding-bottom: 24px;
      }
      paper-checkbox {
        --paper-checkbox-checked-ink-color: var(--mist-blue) !important;
        --paper-checkbox-checked-color: var(--mist-blue) !important;
      }
    </style>

    <vaadin-dialog
      id="organizationAddModal"
      theme="mist-dialog"
      with-backdrop=""
    >
      <template>
        <h2>Add Organization</h2>
        <div class="paper-dialog-scrollable">
          <div hidden$="[[success]]">
            <p>
              <paper-input
                id="name"
                label="Name"
                error-message="Please enter organization's name"
                value="{{newOrganization.name}}"
                on-keydown="_submitOnEnter"
                autofocus="[[!success]]"
              ></paper-input
              ><br />
            </p>
            <div hidden$="[[!currentOrg.super_org]]">
              <paper-checkbox
                id="superorg"
                label="super org"
                checked="{{newOrganization.super_org::change}}"
              >
                Sub-organization. <br />
                <span class="subtitle">
                  It will inherit [[currentOrg.name]]'s teams.
                </span>
              </paper-checkbox>
            </div>
            <p></p>
            <div id="errormsg" hidden$="[[!fail]]">[[errorMessage]]</div>
            <div class="clearfix btn-group">
              <paper-button class="blue-link" on-tap="_closeDialog">
                Cancel
              </paper-button>
              <paper-button
                class="submit-btn btn-block blue"
                disabled$="[[!formReady]]"
                raised=""
                on-tap="_submitForm"
                >Add</paper-button
              >
            </div>
          </div>
          <div hidden$="[[!success]]" style="margin-bottom: 16px">
            <p class="pad-bot">
              Organization created successfully. You can switch to the new
              organization context.
            </p>
            <p>
              <paper-button
                id="switchOrgBtn"
                class="submit-btn btn-block blue"
                on-tap="_switchOrg"
                dialog-confirm=""
                autofocus="[[success]]"
                >Switch</paper-button
              >
            </p>
          </div>
        </div>
      </template>
    </vaadin-dialog>
    <iron-ajax
      id="organizationAddAjaxRequest"
      url="/api/v1/org"
      method="POST"
      on-response="_handleOrganizationAddAjaxResponse"
      handle-as="json"
      on-error="_handleOrganizationAddAjaxError"
    ></iron-ajax>
  `,

  is: 'organization-add',

  properties: {
    newOrganization: {
      type: Object,
      value: {
        name: '',
        super_org: false,
      },
    },
    currentOrg: {
      type: Object,
    },
    sendingData: {
      type: Boolean,
      value: false,
    },
    formReady: {
      type: Boolean,
      computed: '_computeFormReady(newOrganization.name, sendingData)',
    },
    success: {
      type: Boolean,
      value: false,
    },
    newOrgId: {
      type: String,
    },
    fail: {
      type: Boolean,
      value: false,
    },
    isSuperOrg: {
      type: Boolean,
    },
    errorMessage: {
      type: String,
      value: '',
    },
  },

  _computeFormReady(name, sendingData) {
    let formReady = false;

    if (name) {
      formReady = true;
    }

    if (sendingData) {
      formReady = false;
    }

    return formReady;
  },

  _computeType(type, value) {
    return type === value;
  },

  _computeDanger(danger) {
    return danger;
  },

  openDialog(_e) {
    this.shadowRoot.querySelector('vaadin-dialog').opened = true;
    this._formReset();
  },

  _closeDialog(_e) {
    document.querySelector('vaadin-dialog-overlay').opened = false;
    this._formReset();
  },

  _submitForm() {
    this.$.organizationAddAjaxRequest.headers['Content-Type'] =
      'application/json';
    this.$.organizationAddAjaxRequest.headers['Csrf-Token'] = CSRFToken.value;
    this.$.organizationAddAjaxRequest.body = {
      name: this.newOrganization.name,
      super_org: this.newOrganization.super_org,
    };
    this.$.organizationAddAjaxRequest.generateRequest();

    this.set('sendingData', true);
  },

  _submitOnEnter(e) {
    // check if 'enter' was pressed
    if (e.keyCode === 13) {
      this._submitForm();
    }
  },

  _handleOrganizationAddAjaxResponse(e) {
    this.set('sendingData', false);
    this._formReset();
    this.set('newOrgId', e.detail.xhr.response.id);
    this.set('success', true);
  },

  _switchOrg() {
    window.location.href = this.newOrgId
      ? `/switch_context/${this.newOrgId}`
      : '/switch_context';
  },

  _handleOrganizationAddAjaxError(e) {
    this.set('fail', true);
    this.set('sendingData', false);
    // TODO: should be e.detail.request.xhr.responseText which is more descriptive
    // but only if handle-as="xml" which does not return newOrg id
    let msg = e.detail.error.message;
    if (msg.indexOf('409') > -1) msg = 'Name must be unique';
    this.set('errorMessage', msg);
  },

  _formReset() {
    this.set('newOrganization.name', '');
    this.set('newOrganization.super_org', false);
    this.set('success', false);
    this.set('newOrgId', '');
    this.set('fail', false);
  },
});
