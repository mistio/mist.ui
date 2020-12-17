import '../../node_modules/@polymer/polymer/polymer-legacy.js';
import '../../node_modules/@polymer/paper-styles/typography.js';
import '../../node_modules/@vaadin/vaadin-dialog/vaadin-dialog.js';
import '../../node_modules/@polymer/paper-progress/paper-progress.js';
import { CSRFToken } from '../helpers/utils.js';
import { Polymer } from '../../node_modules/@polymer/polymer/lib/legacy/polymer-fn.js';
import { html } from '../../node_modules/@polymer/polymer/lib/utils/html-tag.js';

Polymer({
  _template: html`
    <style include="shared-styles dialogs">
      paper-card {
        display: block;
      }

      .submit-btn {
        background-color: var(--mist-blue);
        color: #fff;
      }

      .progress {
        margin: 0 -24px;
        padding-top: 24px;
      }
      .progress p {
        padding: 8px 24px;
      }
      paper-progress {
        width: 100% !important;
      }
      .errormsg-container {
        color: var(--red-color) !important;
        word-break: break-word;
      }
      .errormsg-container iron-icon {
        color: inherit;
      }
      hr.appform {
        margin: 0;
        opacity: 0.3;
      }
    </style>

    <vaadin-dialog id="editScriptModal" theme="mist-dialog" with-backdrop="">
      <template>
        <h2>Edit Script</h2>
        <div class="paper-dialog-scrollable">
          <p>
            <paper-input
              id="name"
              label="Name"
              error-message="Please enter script's name"
              value="{{newScript.name}}"
            ></paper-input>
            <paper-textarea
              id="description"
              label="Description (optional)"
              rows="5"
              max-rows="5"
              error-message="Please enter script's description"
              value="{{newScript.description}}"
            ></paper-textarea>
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
            <hr class="appform" />
            <p class="errormsg-container" hidden$="[[!formError]]">
              <iron-icon icon="icons:error-outline"></iron-icon
              ><span id="errormsg"></span>
            </p>
          </div>
        </div>
        <div class="btn-group">
          <paper-button on-tap="_closeEditScriptModal">Cancel</paper-button>
          <paper-button
            class="submit-btn btn-block"
            disabled$="[[!formReady]]"
            raised=""
            on-tap="_submitForm"
            >Submit</paper-button
          >
        </div>
      </template>
    </vaadin-dialog>

    <iron-ajax
      id="scriptEditAjaxRequest"
      url="/api/v1/scripts/[[script.id]]"
      method="PUT"
      on-response="_handleScriptEditAjaxResponse"
      on-error="_handleScriptEditAjaxError"
      loading="{{sendingData}}"
      handle-as="xml"
    ></iron-ajax>
  `,

  is: 'script-edit',

  properties: {
    script: {
      type: Object,
    },
    newScript: {
      type: Object,
      computed: '_computeNewScript(script)',
      notify: true,
    },
    sendingData: {
      type: Boolean,
      value: false,
    },
    formReady: {
      type: Boolean,
      computed: '_computeFormReady(newScript.name, sendingData)',
    },
    formError: {
      type: Boolean,
      value: false,
    },
  },

  listeners: {
    'iron-overlay-closed': '_modalClosed',
    input: 'hideErrors',
  },

  _computeNewScript(script) {
    if (script) {
      return {
        name: script.name,
        description: script.description,
      };
    }
    return {};
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

  _openEditScriptModal(_e) {
    this.$.editScriptModal.opened = true;
  },

  _closeEditScriptModal(_e) {
    this.$.editScriptModal.opened = false;
  },

  _modalClosed() {
    this._formReset();
  },

  _submitForm(_e) {
    this.$.scriptEditAjaxRequest.headers['Content-Type'] = 'application/json';
    this.$.scriptEditAjaxRequest.headers['Csrf-Token'] = CSRFToken.value;
    this.$.scriptEditAjaxRequest.body = {
      new_name: this.newScript.name,
      new_description: this.newScript.description,
    };
    this.$.scriptEditAjaxRequest.generateRequest();
  },

  _formReset() {
    //   this.set('script.id', '');
  },

  _handleScriptEditAjaxResponse(_e) {
    this._closeEditScriptModal();
  },

  _handleScriptEditAjaxError(e, _d) {
    this.set('formError', true);
    // console.log('FAIL', e)
    // this.$.errormsg.textContent = e.detail.request.xhr.response.body.innerText;
    this.$.errormsg.textContent = e.detail.request.xhr.responseText;
  },

  hideErrors(_e) {
    this.set('formError', false);
  },
});
