import '@polymer/iron-ajax/iron-ajax.js';
import '@polymer/paper-styles/typography.js';
import '@polymer/paper-button/paper-button.js';
import '@polymer/paper-input/paper-textarea.js';
import '@polymer/paper-radio-button/paper-radio-button.js';
import '@polymer/paper-progress/paper-progress.js';
import '@polymer/paper-checkbox/paper-checkbox.js';
import '@polymer/paper-spinner/paper-spinner.js';
import '@polymer/neon-animation/animations/scale-up-animation.js';
import '@polymer/neon-animation/animations/fade-out-animation.js';
import '@polymer/paper-listbox/paper-listbox.js';
import '@polymer/paper-item/paper-item-body.js';
import { Polymer } from '@polymer/polymer/lib/legacy/polymer-fn.js';
import { html } from '@polymer/polymer/lib/utils/html-tag.js';
import { CSRFToken } from '../helpers/utils.js';

Polymer({
  _template: html`
    <style include="shared-styles dialogs">
      :host {
        width: 100%;
      }

      paper-dialog {
        min-width: 370px;
      }

      paper-spinner {
        margin-left: auto;
        margin-right: auto;
        display: flex;
        width: 50px;
        height: 50px;
      }
      .snapshot-item {
        display: flex;
        align-items: center;
        justify-content: space-between;
      }
      #snapshotsModal {
        padding: 20px;
        width: 600px;
      }
      #snapshots {
        margin-top: -20px;
      }
      :host .btn-group {
        margin: 10px 0;
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

    </style>
    <paper-dialog id="snapshotsModal" with-backdrop="">
      <h2 class="title">Snapshots</h2>
      <div id="snapshots">
        <paper-spinner active="[[isLoading]]" hidden$="[[!isLoading]]"></paper-spinner>
        <div id="snapshot-items">
        <template is="dom-repeat" items="[[snapshots]]" >
          <div class="snapshot-item" hidden$="[[isLoading]]">
            <div>[[item.name]]</div>
            <div secondary="">[[item.description]]</div>
            <div class="clearfix btn-group">
              <paper-button
                id="remove-button"
                class="red"
                data-snapshot-name$="[[item.name]]"
                on-tap="removeSnapshot"
              >
                Remove
              </paper-button>
              <paper-button
                id="revert-button"
                class="blue"
                data-snapshot-name$="[[item.name]]"
                on-tap="revertToSnapshot"
              >
                Revert
              </paper-button>
            </div>
          </div>
        </template>
        <span hidden$="[[haveSnapshots(isLoading, snapshots.length)]]">You don't have any snapshots</span>
        </div>
      </div>
      <hr />
      </paper-button>
      <paper-button
        id="create-snapshot-button"
        class="blue"
        hidden$="[[createSnapshotVisible]]"
        on-tap="_showCreateSnapshot"
      >
      Create a new snapshot
      </paper-button>
      <div id="create-snapshot-form" hidden$="[[!createSnapshotVisible]]">
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
    <div class="clearfix btn-group">
      <paper-button on-tap="_hideCreateSnapshot"> Cancel </paper-button>
      <paper-button
        id="create-button"
        class="blue"
        on-tap="createSnapshot"
        disabled$="[[!snapshotName]]"
      >
        Create
      </paper-button>
    </div>
      </div>
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
        <paper-button dialog-dismiss=""> Close </paper-button>
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
    isLoading: {
      type: Boolean,
      value: true,
    },
    createSnapshotVisible: {
      type: Boolean,
      value: false,
    },
  },

  observers: [],

  _openDialog(_e) {
    console.log('isLoading ', this.isLoading);
    this.clearError();
    // this._preselectSnapshot();
    this.$.snapshotsModal.open();
  },

  _closeDialog(_e) {
    this.$.snapshotsModal.close();
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
  _showCreateSnapshot() {
    this.createSnapshotVisible = true;
  },
  _hideCreateSnapshot() {
    this.createSnapshotVisible = false;
  },
  removeSnapshot(e) {
    this.set('snapshotName', e.target.dataset.snapshotName);
    this.snapshotAction('remove');
  },
  revertToSnapshot(e) {
    this.set('snapshotName', e.target.dataset.snapshotName);
    this.snapshotAction('revert');
  },
  haveSnapshots() {
    return !this.isLoading && this.snapshots.length > 0;
  },
  createSnapshot() {
    this.snapshotAction('create');
  },
  snapshotAction(action) {
    this.action = action;
    const request = this.$.snapshotRequest;
    request.url = `/api/v1/machines/${this.machine.id}`;
    request.headers['Content-Type'] = 'application/json';
    request.headers['Csrf-Token'] = CSRFToken.value;
    if (action === 'create') {
      request.body = {
        action: 'create_snapshot',
        snapshot_description: this.snapshotDescription,
        snapshot_name: this.snapshotName,
        snapshot_dump_memory: this.snapshotDumpMemory,
        snapshot_quiesce: this.snapshotQuiesce,
      };
    } else if (action === 'remove') {
      request.body = {
        action: 'remove_snapshot',
        snapshot_name: this.snapshotName,
      };
    } else if (action === 'revert') {
      request.body = {
        action: 'revert_to_snapshot',
        snapshot_name: this.snapshotName,
      };
    }
    request.generateRequest();
  },

  _snapshotRequest(e) {
    const action = e.detail.options.body.action.replace(/_/g, ' ');
    this.clearError();
    const logMessage = `Sending request to ${action}.`;
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
    this.snapshots = [];
    // this._closeDialog();
    this.dispatchEvent(
      new CustomEvent('reload-snapshots', {
        bubbles: true,
        composed: true,
        detail: { success: true },
      })
    );
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
    // this.$.createSnapshotModal.refit();
  },

  _getClass(action) {
    return action === 'remove snapshot' ? 'red' : 'blue';
  },
});
