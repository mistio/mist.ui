import '../../node_modules/@polymer/paper-button/paper-button.js';
import '../../node_modules/@polymer/paper-toggle-button/paper-toggle-button.js';
import '../../node_modules/@polymer/paper-input/paper-textarea.js';
import '../../node_modules/@polymer/iron-ajax/iron-ajax.js';
import { CSRFToken } from '../helpers/utils.js';
import { Polymer } from '../../node_modules/@polymer/polymer/lib/legacy/polymer-fn.js';
import { html } from '../../node_modules/@polymer/polymer/lib/utils/html-tag.js';

Polymer({
  _template: html`
    <style include="shared-styles dialogs">
      :host {
        width: 100%;
        position: relative;
      }

      paper-button.blue {
        margin-right: 0;
      }

      paper-toggle-button {
        display: block;
        float: left;
      }

      .progress {
        margin: 8px 0 0 0;
        width: 100%;
        display: block;
      }

      paper-progress {
        width: 100%;
      }

      paper-progress#progresserror ::slotted(#primaryProgress) {
        background-color: var(--red-color);
      }

      .errormsg-container {
        color: var(--red-color);
        padding-top: 8px;
      }

      .errormsg-container iron-icon {
        color: inherit;
      }

      .btn-group {
        margin-top: 12px;
      }

      .last {
        margin-bottom: 24px !important;
      }
    </style>

    <h2>Add Team</h2>
    <div class="paper-dialog-scrollable">
      <p>
        <paper-input
          id="name"
          label="Name"
          error-message="Please enter team's name"
          value="{{newTeam.name}}"
          on-keydown="_submitOnEnter"
          autofocus=""
        ></paper-input>
      </p>
      <p>
        <paper-textarea
          id="description"
          label="Description (optional)"
          rows="3"
          max-rows="5"
          error-message="Please enter team's description"
          value="{{newTeam.description}}"
        ></paper-textarea>
      </p>
      <p class="last" hidden="[[!rbac]]">
        <paper-toggle-button
          id="visible"
          label="Visible"
          checked="{{newTeam.visible}}"
        ></paper-toggle-button>
        Visible to members not in the team.
      </p>
      <div class="progress">
        <paper-progress
          id="progress"
          indeterminate=""
          hidden$="[[!sendingData]]"
        ></paper-progress>
        <paper-progress
          id="progresserror"
          value="100"
          hidden$="[[!formError]]"
        ></paper-progress>
        <div class="errormsg-container" hidden$="[[!formError]]">
          <iron-icon icon="icons:error-outline"></iron-icon
          ><span id="errormsg"></span>
        </div>
      </div>
      <div class="clearfix btn-group">
        <paper-button class="blue-link" on-tap="_closeDialog"
          >Cancel</paper-button
        >
        <paper-button
          class="blue"
          disabled$="[[!formReady]]"
          on-tap="_submitForm"
          >Add</paper-button
        >
      </div>
    </div>
    <iron-ajax
      id="teamAddAjaxRequest"
      url="/api/v1/org/[[organization.id]]/teams"
      method="POST"
      on-response="_handleTeamAddAjaxResponse"
      on-error="_handleTeamAddAjaxError"
      handle-as="xml"
    ></iron-ajax>
  `,

  is: 'team-add-element',

  properties: {
    newTeam: {
      type: Object,
      value: {
        name: '',
        description: '',
        visible: true,
      },
    },
    organization: {
      type: Object,
    },
    sendingData: {
      type: Boolean,
      value: false,
    },
    formReady: {
      type: Boolean,
      computed: '_computeFormReady(newTeam.name, sendingData)',
    },
    formError: {
      type: Boolean,
      value: false,
    },
    referral: {
      type: String,
      value: null,
    },
    rbac: {
      type: Boolean,
      value: false,
    },
  },

  _clearError() {
    if (this.formError) {
      this.set('formError', false);
    }
  },

  _computeFormReady(name, sendingData) {
    let formReady = false;
    if (this.formError) {
      this.set('formError', false);
    }
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

  _closeDialog() {
    this._clearError();
    document.querySelector('vaadin-dialog-overlay').opened = false;
    this._formReset();
  },

  _submitForm() {
    this.set('sendingData', true);
    this.set('formError', false);
    this.shadowRoot.querySelector('#teamAddAjaxRequest').headers[
      'Content-Type'
    ] = 'application/json';
    this.shadowRoot.querySelector('#teamAddAjaxRequest').headers['Csrf-Token'] =
      CSRFToken.value;
    this.shadowRoot.querySelector('#teamAddAjaxRequest').body = {
      name: this.newTeam.name,
      description: this.newTeam.description,
      visible: this.newTeam.visible,
    };
    this.shadowRoot.querySelector('#teamAddAjaxRequest').generateRequest();
  },

  _submitOnEnter(e) {
    // check if 'enter' was pressed
    if (e.keyCode === 13) {
      this._submitForm();
    }
  },

  _handleTeamAddAjaxResponse(e) {
    this.set('sendingData', false);
    document.querySelector('vaadin-dialog-overlay').opened = false;

    if (this.referral && this.referral === 'onb') {
      this.dispatchEvent(
        new CustomEvent('new-team-added', {
          bubbles: true,
          composed: true,
          detail: JSON.parse(e.detail.xhr.response).name,
        })
      );
    }
    this.dispatchEvent(
      new CustomEvent('toast', {
        bubbles: true,
        composed: true,
        detail: {
          msg: `New team ${
            JSON.parse(e.detail.xhr.response).name
          } added succesfully.`,
          duration: 3000,
        },
      })
    );
    this._formReset();
    this.set('referral', null);
  },

  _handleTeamAddAjaxError(e) {
    this.set('sendingData', false);
    this.set('formError', true);
    console.log(e);
    this.$.errormsg.textContent = e.detail.request.xhr.responseText;
  },

  _formReset() {
    this.set('newTeam.name', '');
    this.set('newTeam.description', '');
    this.set('newTeam.visible', true);
  },
});
