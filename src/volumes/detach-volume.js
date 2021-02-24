import '@polymer/polymer/polymer-legacy.js';
import '@polymer/iron-ajax/iron-ajax.js';
import '@polymer/paper-styles/typography.js';
import '@polymer/paper-button/paper-button.js';
import '@polymer/paper-input/paper-textarea.js';
import '@polymer/paper-dropdown-menu/paper-dropdown-menu.js';
import '@polymer/paper-listbox/paper-listbox.js';
import '@polymer/paper-progress/paper-progress.js';
import { CSRFToken } from '../helpers/utils.js';
import { Polymer } from '@polymer/polymer/lib/legacy/polymer-fn.js';
import { html } from '@polymer/polymer/lib/utils/html-tag.js';

Polymer({
  _template: html`
    <style include="shared-styles dialogs">
      :host {
        width: 100%;
      }

      :host .btn-group {
        margin: 0 0 24px 0;
      }

      paper-dialog {
        min-width: 360px;
      }

      .grey {
        opacity: 0.54;
      }

      .progress {
        margin: 24px -24px 24px -24px;
        width: 100%;
      }

      .progress paper-progress {
        width: 100%;
      }

      .error {
        color: var(--red-color);
        align-self: flex-end;
        padding: 8px;
        font-size: 0.9em;
      }

      iron-icon {
        color: inherit;
      }

      .errormsg-container {
        color: var(--red-color);
        padding-left: 24px;
        padding-right: 24px;
        margin-bottom: 0;
      }

      .errormsg-container iron-icon {
        color: inherit;
        padding-right: 8px;
      }
    </style>
    <paper-dialog
      id="detachDialogModal"
      entry-animation="scale-up-animation"
      exit-animation="fade-out-animation"
      with-backdrop=""
    >
      <h2>Detach Volume</h2>
      <paper-dialog-scrollable>
        <p>
          <span class="grey"> Choose the machines to detach from. </span>
          <paper-dropdown-menu no-animations=""  label="Select machine" horizontal-align="left">
            <paper-listbox
              slot="dropdown-content"
              id="machines"
              attr-for-selected="value"
              selected="{{selectedMachineId}}"
              class="dropdown-content"
            >
              <template is="dom-repeat" items="[[machines]]" as="machine">
                <paper-item value="[[machine.id]]">[[machine.name]]</paper-item>
              </template>
            </paper-listbox>
          </paper-dropdown-menu>
        </p>
      </paper-dialog-scrollable>
      <div class="progress">
        <paper-progress
          id="progress"
          indeterminate=""
          hidden$="[[!loading]]"
        ></paper-progress>
        <paper-progress
          id="progresserror"
          class="progresserror"
          value="100"
          hidden$="[[!formError]]"
        ></paper-progress>
        <p
          id="progressmessage"
          class="errormsg-container"
          hidden$="[[!formError]]"
        >
          <iron-icon icon="icons:error-outline"></iron-icon
          ><span id="errormsg"></span>
        </p>
      </div>
      <div class="clearfix btn-group">
        <paper-button dialog-dismiss=""> Cancel </paper-button>
        <paper-button
          class="blue"
          on-tap="detachVolume"
          disabled$="[[!selectedMachineId]]"
        >
          Detach from machine
        </paper-button>
      </div>
    </paper-dialog>
    <iron-ajax
      id="detachVolumeRequest"
      method="PUT"
      on-response="_detachVolumeResponse"
      on-error="_detachVolumeError"
      on-request="_detachVolumeRequest"
      handle-as="xml"
      loading="{{loading}}"
    ></iron-ajax>
  `,

  is: 'detach-volume',

  properties: {
    items: {
      type: Array,
      notify: true,
    },
    selectedMachineId: {
      type: String,
      value: false,
    },
    machines: {
      type: Array,
      value: [],
    },
    loading: {
      type: Boolean,
      value: false,
    },
    formError: {
      type: Boolean,
      value: false,
    },
  },

  listeners: {
    // 'iron-select' : 'computedSelectedMachineId'
  },

  ready() {},

  computedSelectedMachineId() {
    // this.set('selectedMachineId', this.$.machines.selected || '');
  },

  _openDialog() {
    this.set('selectedMachineId', false);
    this.set('formError', false);
    this.$.detachDialogModal.open();
  },

  _closeDialog() {
    this.set('formError', false);
    this.$.detachDialogModal.close();
  },

  detachVolume() {
    const request = this.$.detachVolumeRequest;
    const items = this.items.slice(0);
    const { selectedMachineId } = this;
    const run = el => {
      const item = items.shift();
      let itemId;
      let cloudId;
      if (item.length) {
        [, cloudId, itemId] = item.split(':');
      } else {
        itemId = item.external_id;
        cloudId = item.cloud;
      }
      request.url = `/api/v1/clouds/${cloudId}/volumes/${itemId}`;
      request.body = { action: 'detach', machine: selectedMachineId };
      request.headers['Content-Type'] = 'application/json';
      request.headers['Csrf-Token'] = CSRFToken.value;
      request.generateRequest();

      if (items.length) {
        run(el);
      }
    };
    run(this);
  },

  _detachVolumeRequest() {
    this.clearError();
    const logMessage = 'Sending request to detach volume on machine.';
    this.dispatchEvent(
      new CustomEvent('performing-action', {
        bubbles: true,
        composed: true,
        detail: { log: logMessage },
      })
    );
  },

  _detachVolumeResponse(e) {
    console.log(e, e.detail);
    this._closeDialog();
    this.dispatchEvent(
      new CustomEvent('action-finished', {
        bubbles: true,
        composed: true,
        detail: { success: true },
      })
    );

    this.dispatchEvent(
      new CustomEvent('toast', {
        bubbles: true,
        composed: true,
        detail: {
          msg: 'Detach request sent successfully. Review in machine logs.',
          duration: 5000,
        },
      })
    );
  },

  _detachVolumeError(e) {
    console.log(e, e.detail);
    this.$.errormsg.textContent = e.detail.request.xhr.response;
    this.set('formError', true);
  },

  clearError() {
    this.set('formError', false);
    this.$.errormsg.textContent = '';
    this.$.detachDialogModal.refit();
  },
});
