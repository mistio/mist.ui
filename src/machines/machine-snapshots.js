import '../../node_modules/@polymer/iron-ajax/iron-ajax.js';
import '../../node_modules/@polymer/paper-styles/typography.js';
import '../../node_modules/@polymer/paper-button/paper-button.js';
import '../../node_modules/@polymer/paper-input/paper-textarea.js';
import '../../node_modules/@polymer/paper-radio-button/paper-radio-button.js';
import '../../node_modules/@polymer/paper-progress/paper-progress.js';
import '../../node_modules/@polymer/paper-checkbox/paper-checkbox.js';
import '../../node_modules/@polymer/neon-animation/animations/scale-up-animation.js';
import '../../node_modules/@polymer/neon-animation/animations/fade-out-animation.js';
import '../../node_modules/@polymer/paper-listbox/paper-listbox.js';
import '../../node_modules/@polymer/paper-item/paper-item-body.js';
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
        min-width: 370px;
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

      .title {
        text-transform: capitalize;
      }

      :host paper-dropdown-menu ::slotted(.dropdown-content) {
        top: 55px !important;
      }
    </style>
    <paper-dialog
      id="createSnapshotModal"
      entry-animation="scale-up-animation"
      exit-animation="fade-out-animation"
      with-backdrop=""
    >
      <h2 class="title">[[action]]</h2>
      <paper-dialog-scrollable hidden$="[[!isCreate]]">
        <p>
          Fill in a name for the snapshot.
          <paper-input
            label="Snapshot name"
            value="{{snapshotName}}"
          ></paper-input>
          <paper-textarea
            label="Snapshot description (optional)"
            value="{{snapshotDescription}}"
          ></paper-textarea
          ><br />
          <paper-checkbox checked="{{snapshotDumpMemory}}"
            >Dump memory</paper-checkbox
          ><br /><br />
          <paper-checkbox checked="{{snapshotQuiesce}}"
            >Enable guest file system quiescing</paper-checkbox
          >
        </p>
      </paper-dialog-scrollable>
      <paper-dialog-scrollable hidden$="[[isCreate]]">
        <paper-dropdown-menu
          label="Select a snapshot"
          class="dropdown-block"
          horizontal-align="left"
        >
          <paper-listbox
            slot="dropdown-content"
            attr-for-selected="value"
            selected="{{snapshotName}}"
            class="dropdown-content"
          >
            <template is="dom-repeat" items="[[snapshots]]">
              <paper-item value="[[item.name]]">
                <paper-item-body two-line="">
                  <div>[[item.name]]</div>
                  <div secondary="">[[item.description]]</div>
                </paper-item-body>
              </paper-item>
            </template>
          </paper-listbox>
        </paper-dropdown-menu>
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
          class$="[[_getClass(action)]]"
          on-tap="createSnapshot"
          disabled$="[[!snapshotName]]"
        >
          [[action]]
        </paper-button>
      </div>
    </paper-dialog>
    <iron-ajax
      id="snapshotRequest"
      method="POST"
      on-response="_snapshotResponse"
      on-error="_snapshotError"
      on-request="_snapshotRequest"
      handle-as="xml"
      loading="{{loading}}"
    ></iron-ajax>
  `,

  is: 'machine-snapshots',

  properties: {
    machine: {
      type: Object,
    },
    snapshots: {
      type: Array,
      value() {
        return [];
      },
    },
    snapshotName: {
      type: String,
      value: '',
    },
    action: {
      type: String,
      value: '',
    },
    snapshotDescription: {
      type: String,
      value: '',
    },
    snapshotDumpMemory: {
      type: Boolean,
      value: false,
    },
    snapshotQuiesce: {
      type: Boolean,
      value: false,
    },
    loading: {
      type: Boolean,
      value: false,
    },
    formError: {
      type: Boolean,
      value: false,
    },
    isCreate: {
      type: Boolean,
      value: false,
      computed: '_computeIsCreate(action)',
    },
    isRemove: {
      type: Boolean,
      value: false,
      computed: '_computeIsRemove(action)',
    },
    isRevertTo: {
      type: Boolean,
      value: false,
      computed: '_computeIsRevertTo(action)',
    },
  },

  observers: ['_preselectSnapshot(snapshots, isCreate)'],

  _openDialog(_e) {
    this.clearError();
    this._preselectSnapshot();
    this.$.createSnapshotModal.open();
  },

  _closeDialog(_e) {
    this.$.createSnapshotModal.close();
    this.clearError();
    this.set('action', '');
  },

  _computeIsCreate(_action) {
    return this.action === 'create snapshot';
  },

  _computeIsRemove(_action) {
    return this.action === 'remove snapshot';
  },

  _computeIsRevertTo(_action) {
    return this.action === 'revert to snapshot';
  },

  _preselectSnapshot() {
    if (!this.isCreate && this.snapshots && this.snapshots.length) {
      this.set('snapshotName', this.snapshots[this.snapshots.length - 1].name);
    } else {
      this.set('snapshotName', '');
    }
  },

  createSnapshot(_e) {
    const request = this.$.snapshotRequest;
    request.url = `/api/v1/machines/${this.machine.id}`;
    request.headers['Content-Type'] = 'application/json';
    request.headers['Csrf-Token'] = CSRFToken.value;
    if (this.isCreate) {
      request.body = {
        action: 'create_snapshot',
        snapshot_description: this.snapshotDescription,
        snapshot_name: this.snapshotName,
        snapshot_dump_memory: this.snapshotDumpMemory,
        snapshot_quiesce: this.snapshotQuiesce,
      };
    } else if (this.isRemove) {
      request.body = {
        action: 'remove_snapshot',
        snapshot_name: this.snapshotName,
      };
    } else if (this.isRevertTo) {
      request.body = {
        action: 'revert_to_snapshot',
        snapshot_name: this.snapshotName,
      };
    }
    request.generateRequest();
  },

  _snapshotRequest() {
    this.clearError();
    const logMessage = `Sending request to ${this.action}.`;
    this.dispatchEvent(
      new CustomEvent('performing-action', {
        bubbles: true,
        composed: true,
        detail: { log: logMessage },
      })
    );
  },

  _snapshotResponse(e) {
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
        detail: { msg: 'Snapshot request sent successfully.', duration: 5000 },
      })
    );
  },

  _snapshotError(e) {
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
    this.$.createSnapshotModal.refit();
  },

  _getClass(action) {
    return action === 'remove snapshot' ? 'red' : 'blue';
  },
});
