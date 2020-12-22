import '../../node_modules/@polymer/iron-ajax/iron-ajax.js';
import '../../node_modules/@polymer/paper-styles/typography.js';
import '../../node_modules/@polymer/paper-button/paper-button.js';
import '../../node_modules/@polymer/paper-input/paper-textarea.js';
import '../../node_modules/@polymer/paper-dropdown-menu/paper-dropdown-menu.js';
import '../../node_modules/@polymer/neon-animation/animations/scale-up-animation.js';
import '../../node_modules/@polymer/neon-animation/animations/fade-out-animation.js';
import '../../node_modules/@polymer/paper-listbox/paper-listbox.js';
import '../../node_modules/@vaadin/vaadin-dialog/vaadin-dialog.js';
import { CSRFToken } from '../helpers/utils.js';
import { Polymer } from '../../node_modules/@polymer/polymer/lib/legacy/polymer-fn.js';
import { html } from '../../node_modules/@polymer/polymer/lib/utils/html-tag.js';

Polymer({
  _template: html`
    <style include="shared-styles dialogs">
      :host {
        width: 100%;
      }

      :host .btn-group {
        margin: 0 0 24px 0;
      }

      .grey {
        opacity: 0.54;
      }

      :host paper-dropdown-menu ::slotted(.dropdown-content) {
        top: 55px !important;
      }
    </style>
    <vaadin-dialog id="scriptDialogModal" theme="mist-dialog" with-backdrop="">
      <template>
        <h2>Run a script</h2>
        <div class="paper-dialog-scrollable">
          <p>
            <span class="grey"> Choose from your existing scripts. </span>
            <paper-dropdown-menu label="Select script" horizontal-align="left">
              <paper-listbox
                slot="dropdown-content"
                id="scripts"
                attr-for-selected="value"
                selected="{{selectedScriptId}}"
                class="dropdown-content"
              >
                <template is="dom-repeat" items="[[scripts]]" as="script">
                  <paper-item value="[[script.id]]">[[script.name]]</paper-item>
                </template>
              </paper-listbox>
            </paper-dropdown-menu>
          </p>
          <p>
            <paper-textarea
              label="Params"
              rows="3"
              value="{{params}}"
            ></paper-textarea>
          </p>
        </div>
        <div class="clearfix btn-group">
          <paper-button on-tap="_dismissDialog"> Cancel </paper-button>
          <paper-button
            class="blue"
            on-tap="runScript"
            dialog-confirm=""
            disabled$="[[!selectedScriptId]]"
          >
            Run Script
          </paper-button>
        </div>
      </template>
    </vaadin-dialog>
    <iron-ajax
      id="runScriptRequest"
      url="/api/v1/scripts/[[selectedScriptId]]"
      method="POST"
      on-response="_runScriptResponse"
      on-error="_runScriptError"
      on-request="_runScriptRequest"
      handle-as="xml"
    ></iron-ajax>
  `,

  is: 'run-script-on-machine',

  properties: {
    items: {
      type: Array,
      notify: true,
    },
    selected: {
      type: String,
    },
    selectedScriptId: {
      type: Number,
      value: -1,
    },
    scripts: {
      type: Array,
    },
    params: {
      type: String,
      observer: '_paramsChanged',
    },
  },

  listeners: {},
  ready() {},
  computedSelectedScriptId(_selected) {},

  _openDialog(_e) {
    this.set('selected', false);
    this.set('selectedScriptId', false);
    this.set('params', '');
    this.$.scriptDialogModal.opened = true;
  },

  _dismissDialog(_e) {
    this.$.scriptDialogModal.opened = false;
  },

  runScript(_e) {
    const request = this.$.runScriptRequest;
    const scriptparams = this.params || '';
    const items = this.items.slice(0);
    console.log('runScript', request.id, items, scriptparams);
    const run = el => {
      const item = items.shift();
      let itemId;
      if (item.length) {
        const chunks = item.split(':');
        [, , itemId] = chunks;
      } else {
        itemId = item.id;
      }
      request.body = {
        machine_uuid: itemId,
        params: scriptparams,
      };
      request.headers['Content-Type'] = 'application/json';
      request.headers['Csrf-Token'] = CSRFToken.value;
      request.generateRequest();

      if (items.length) {
        run(el);
      }
    };
    run(this);
  },

  _runScriptRequest() {
    const logMessage = 'Sending request to run script on machine.';
    this.dispatchEvent(
      new CustomEvent('performing-action', {
        bubbles: true,
        composed: true,
        detail: { log: logMessage },
      })
    );
  },

  _runScriptResponse(e) {
    console.log(e, e.detail);
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
          msg: 'Run script request sent successfully. Review in machine logs.',
          duration: 5000,
        },
      })
    );
    this._dismissDialog();
  },

  _runScriptError(e) {
    console.log(e, e.detail);
    this.dispatchEvent(
      new CustomEvent('action-finished', {
        bubbles: true,
        composed: true,
        detail: { success: false },
      })
    );

    this.dispatchEvent(
      new CustomEvent('toast', {
        bubbles: true,
        composed: true,
        detail: { msg: e.detail.xhr.response, duration: 5000 },
      })
    );
  },
});
