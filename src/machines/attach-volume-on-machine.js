import '../../node_modules/@polymer/iron-ajax/iron-ajax.js';
import '../../node_modules/@polymer/paper-styles/typography.js';
import '../../node_modules/@polymer/paper-button/paper-button.js';
import '../../node_modules/@polymer/paper-input/paper-textarea.js';
import '../../node_modules/@polymer/paper-progress/paper-progress.js';
import '../../node_modules/@polymer/paper-dropdown-menu/paper-dropdown-menu.js';
import '../../node_modules/@polymer/neon-animation/animations/scale-up-animation.js';
import '../../node_modules/@polymer/neon-animation/animations/fade-out-animation.js';
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
          <template is="dom-if" if="[[!volumes.length]]">
            <span class="grey">No volumes in same region found.</span>
            <br />
            <a href="/volumes/+add">Create a volume</a>
            <br />
            <br />
          </template>
          <template is="dom-if" if="[[volumes.length]]">
            <span class="grey">
              Choose from your existing volumes in the machine's region.
            </span>
            <paper-dropdown-menu label="Select volume" horizontal-align="left">
              <paper-listbox
                slot="dropdown-content"
                id="volumes"
                attr-for-selected="value"
                selected="{{selectedVolumeId}}"
                class="dropdown-content"
              >
                <template is="dom-repeat" items="[[volumes]]" as="volumeId">
                  <paper-item
                    value="[[volumeId]]"
                    disabled="[[_isAlreadyAttached(volumeId,machine)]]"
                    >[[_computeVolumeName(volumeId)]]</paper-item
                  >
                </template>
              </paper-listbox>
            </paper-dropdown-menu>
            <paper-input
              id="device"
              value="{{device}}"
              hidden$="[[hideDeviceInput]]"
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
          disabled$="[[!selectedVolumeId]]"
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

  is: 'attach-volume-on-machine',

  properties: {
    machine: {
      type: Array,
      notify: true,
    },
    selectedVolumeId: {
      type: String,
      value: false,
    },
    hideDeviceInput: {
      type: Boolean,
      value: false,
      computed: '_computeHideDeviceInput(model.clouds,machine)',
    },
    device: {
      type: String,
      value: '/dev/xvda',
    },
    volumes: {
      type: Array,
      value() {
        return [];
      },
      computed: '_computeVolumes(machine, model.volumes.*)',
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

  computedSelectedMachineId(_selected) {
    this.set('selectedMachineId', this.$.machines.selected || '');
  },

  _computeVolumes(_machine, _volumes) {
    const that = this;
    let volumeIds = [];
    if (
      this.model.clouds &&
      this.machine &&
      this.model.clouds[this.machine.cloud] &&
      this.model.clouds[this.machine.cloud].volumes
    ) {
      volumeIds = Object.keys(
        this.model.clouds[this.machine.cloud].volumes
      ).filter(v => {
        return (
          that._isOfSameLocation(v) &&
          that.model.clouds[that.machine.cloud].volumes[v].attached_to.indexOf(
            that.machine.id
          ) === -1
        );
      });
    }
    return volumeIds;
  },

  _isOfSameLocation(volumeId) {
    if (this.machine) {
      const volumeLocation = this.model.clouds[this.machine.cloud].volumes[
        volumeId
      ].location;
      return !volumeLocation || volumeLocation === this.machine.location;
    }
    return false;
  },

  _isAlreadyAttached(volumeId, _machine) {
    if (this.machine) {
      return (
        this.model.clouds[this.machine.cloud].volumes[volumeId] &&
        this.model.clouds[this.machine.cloud].volumes[volumeId].attached_to
          .map(i => i.id)
          .indexOf(this.machine.id) > -1
      );
    }
    return false;
  },

  _computeVolumeName(volumeId) {
    return this.model.clouds[this.machine.cloud].volumes[volumeId].name;
  },

  _openDialog(_e) {
    this.clearError();
    this.set('selectedMachineId', false);
    this.$.attachDialogModal.open();
  },

  _closeDialog(_e) {
    this.$.attachDialogModal.close();
    this.clearError();
  },

  _computeHideDeviceInput(_clouds, _machine) {
    if (this.machine && this.machine.cloud) {
      return (
        this.model.clouds &&
        this.model.clouds[this.machine.cloud] &&
        this.model.clouds[this.machine.cloud].provider !== 'ec2'
      );
    }
    return false;
  },

  attachVolume(_e) {
    const request = this.$.attachVolumeRequest;
    request.url = `/api/v1/clouds/${this.machine.cloud}/volumes/${this.selectedVolumeId}`;
    request.body = { action: 'attach', machine: this.machine.id };
    if (!this.hideDeviceInput) {
      request.body.device = this.device;
    }
    request.headers['Content-Type'] = 'application/json';
    request.headers['Csrf-Token'] = CSRFToken.value;
    request.generateRequest();
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
