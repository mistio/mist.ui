import '../../node_modules/@polymer/polymer/polymer-legacy.js';
import '../../node_modules/@polymer/iron-ajax/iron-ajax.js';
import '../../node_modules/@polymer/paper-styles/typography.js';
import '../../node_modules/@polymer/paper-button/paper-button.js';
import '../../node_modules/@polymer/paper-input/paper-textarea.js';
import '../../node_modules/@polymer/paper-progress/paper-progress.js';
import '../../node_modules/@polymer/paper-dropdown-menu/paper-dropdown-menu.js';
import '../../node_modules/@polymer/paper-listbox/paper-listbox.js';
import { CSRFToken } from '../helpers/utils.js';
import { Polymer } from '../../node_modules/@polymer/polymer/lib/legacy/polymer-fn.js';
import { html } from '../../node_modules/@polymer/polymer/lib/utils/html-tag.js';

Polymer({
  _template: html`
    <style include="shared-styles dialogs">
      :host {
        width: 100%;
      }

      paper-dialog {
        min-width: 360px;
      }

      :host .btn-group {
        margin: 0 0 24px 0;
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

      paper-progress.progresserror ::slotted(#primaryProgress) {
        background-color: var(--red-color);
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

      p.red {
        padding: 4px;
        margin-top: 0;
      }

      :host paper-dropdown-menu ::slotted(.dropdown-content) {
        top: 55px !important;
      }
    </style>
    <paper-dialog
      id="attachDialogModal"
      entry-animation="scale-up-animation"
      exit-animation="fade-out-animation"
      with-backdrop=""
    >
      <h2>Attach volume to machine</h2>
      <paper-dialog-scrollable>
        <p>
          <template is="dom-if" if="[[!machines.length]]">
            <span class="grey"
              >No [[provider]]-machines in same region found</span
            >
            <br />
            <a href="/machines/+create">Create a machine</a>
            <br />
            <br />
          </template>
          <template is="dom-if" if="[[machines.length]]">
            <span class="grey"> Choose from your existing machines. </span>
            <paper-dropdown-menu label="Select machine" horizontal-align="left">
              <paper-listbox
                slot="dropdown-content"
                id="machines"
                attr-for-selected="value"
                selected="{{selectedMachineId}}"
                class="dropdown-content"
              >
                <template is="dom-repeat" items="[[machines]]" as="machine">
                  <paper-item value="[[machine.id]]"
                    >[[machine.name]]</paper-item
                  >
                </template>
              </paper-listbox>
            </paper-dropdown-menu>
            <paper-input
              id="device"
              value="{{device}}"
              hidden$="[[hideDeviceInput]]"
            ></paper-input>
            <paper-input
              label="Path *"
              id="path"
              value="{{path}}"
              hidden$="[[hidePathInput]]"
            ></paper-input>
          </template>
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
          on-tap="attachVolume"
          disabled$="[[!selectedMachineId]]"
        >
          Attach to machine
        </paper-button>
      </div>
    </paper-dialog>
    <iron-ajax
      id="attachVolumeRequest"
      method="PUT"
      on-response="_attachVolumeResponse"
      on-error="_attachVolumeError"
      on-request="_attachVolumeRequest"
      handle-as="xml"
      loading="{{loading}}"
    ></iron-ajax>
  `,

  is: 'attach-volume',

  properties: {
    items: {
      type: Array,
      notify: true,
    },
    provider: String,
    hideDeviceInput: {
      type: Boolean,
      value: false,
      computed: '_computeHideDeviceInput(provider, items.*)',
    },
    hidePathInput: {
      type: Boolean,
      value: false,
      computed: '_computeHidePathInput(provider, items.*)',
    },
    selectedMachineId: {
      type: String,
      value: false,
    },
    device: {
      type: String,
      value: '/dev/xvda',
    },
    path: {
      type: String,
      value: '/ops/my/data',
    },
    machines: {
      type: Array,
      value() {
        return [];
      },
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

  ready() {},

  computedSelectedMachineId() {
    this.set('selectedMachineId', this.$.machines.selected || '');
  },

  _computeHideDeviceInput() {
    return this && this.provider !== 'ec2';
  },

  _computeHidePathInput() {
    return this && this.provider !== 'lxd';
  },

  _openDialog() {
    this.clearError();
    this.set('selectedMachineId', false);
    this.set('device', '/dev/xvda');
    this.$.attachDialogModal.open();
  },

  _closeDialog() {
    this.$.attachDialogModal.close();
    this.clearError();
  },

  attachVolume() {
    const request = this.$.attachVolumeRequest;
    if (this.items) {
      const items = this.items.slice(0);
      const { selectedMachineId } = this;
      const { device } = this;
      const { path } = this;
      const { hideDeviceInput } = this;
      const { hidePathInput } = this;
      const run = el => {
        const item = items.shift();
        let itemId;
        let cloudId;
        if (item.length) {
          [, itemId, cloudId] = item.split(':');
        } else {
          itemId = item.external_id;
          cloudId = item.cloud;
        }
        request.url = `/api/v1/clouds/${cloudId}/volumes/${itemId}`;
        request.body = { action: 'attach', machine: selectedMachineId };
        if (!hideDeviceInput) {
          request.body.device = device;
        }
        if (!hidePathInput) {
          request.body.path = path;
        }
        request.headers['Content-Type'] = 'application/json';
        request.headers['Csrf-Token'] = CSRFToken.value;
        request.generateRequest();

        if (items.length) {
          run(el);
        }
      };
      run(this);
    }
  },

  _attachVolumeRequest() {
    this.clearError();
    const logMessage = 'Sending request to attach volume on machine.';
    this.dispatchEvent(
      new CustomEvent('performing-action', {
        bubbles: true,
        composed: true,
        detail: { log: logMessage },
      })
    );
  },

  _attachVolumeResponse(e) {
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
          msg: 'Attach request sent successfully. Review in machine logs.',
          duration: 5000,
        },
      })
    );
  },

  _attachVolumeError(e) {
    console.log(e, e.detail);
    const message = e.detail.request.xhr.response || e.detail.error.message;
    this.$.errormsg.textContent = message;
    this.set('formError', true);
    this.dispatchEvent(
      new CustomEvent('action-finished', {
        bubbles: true,
        composed: true,
        detail: { success: false },
      })
    );
  },

  clearError() {
    this.set('formError', false);
    this.$.errormsg.textContent = '';
    this.$.attachDialogModal.refit();
  },
});
