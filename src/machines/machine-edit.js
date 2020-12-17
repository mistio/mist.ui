import '../../node_modules/@polymer/polymer/polymer-legacy.js';
import '../../node_modules/@polymer/paper-styles/typography.js';
import '../../node_modules/@polymer/paper-button/paper-button.js';
import '../../node_modules/@polymer/paper-dialog/paper-dialog.js';
import '../../node_modules/@polymer/neon-animation/animations/scale-up-animation.js';
import '../../node_modules/@polymer/neon-animation/animations/fade-out-animation.js';
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
    </style>
    <paper-dialog
      id="editMachineModal"
      entry-animation="scale-up-animation"
      exit-animation="fade-out-animation"
      with-backdrop=""
    >
      <h2>Rename Machine</h2>
      <paper-dialog-scrollable>
        <p>
          <template is="dom-repeat" items="[[items]]">
            <paper-input
              id="item[[item.id]]"
              label="[[item.name]]"
              required=""
              pattern="[A-Za-z0-9_-]*"
              error-message="Alphanumericals, dashes and underscores allowed."
              value="[[item.name]]"
              auto-validate=""
            ></paper-input>
          </template>
        </p>
        <div class="clearfix btn-group">
          <paper-button class="link" dialog-dismiss="">Cancel</paper-button>
          <paper-button
            class="submit-btn btn-block"
            raised=""
            on-tap="_submitForm"
            dialog-confirm=""
            >Submit</paper-button
          >
        </div>
      </paper-dialog-scrollable>
    </paper-dialog>
  `,

  is: 'machine-edit',

  properties: {
    items: {
      type: Array,
    },
    machine: {
      type: Object,
      value: {
        id: null,
      },
      notify: true,
    },
    sendingData: {
      type: Boolean,
      value: false,
    },
    formReady: {
      type: Boolean,
      computed: '_computeFormReady(machine.id, sendingData)',
    },
  },

  listeners: {
    'iron-overlay-closed': '_modalClosed',
  },

  _computeFormReady(id, sendingData) {
    let formReady = false;

    if (id) {
      formReady = true;
    }

    if (sendingData) {
      formReady = false;
    }

    return formReady;
  },

  _openDialog(_e) {
    this.$.editMachineModal.open();
  },

  _closeDialog(_e) {
    this.$.editMachineModal.close();
  },

  _modalClosed() {
    this._formReset();
  },

  _submitForm(e) {
    e.stopImmediatePropagation();
    const item = this.items[0];
    const action = {
      name: 'rename',
      icon: 'editor:mode-edit',
      confirm: true,
      multi: false,
    };
    const itemName = this.shadowRoot.querySelector(`#item${item.id}`).value;
    this.dispatchEvent(
      new CustomEvent('rename-machine', {
        bubbles: true,
        composed: true,
        detail: { action, name: itemName },
      })
    );

    this._closeDialog();
  },

  _formReset() {
    this.set('machine.id', '');
  },

  // from https://github.com/PolymerElements/paper-dialog/issues/7
  _computeLabel(itemname) {
    const l = itemname.slice(0);
    return l;
  },
});
