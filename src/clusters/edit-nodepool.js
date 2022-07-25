import '@polymer/iron-ajax/iron-ajax.js';
import '@polymer/paper-styles/typography.js';
import '@polymer/paper-button/paper-button.js';
import '@polymer/paper-input/paper-input.js';
import '@polymer/paper-input/paper-textarea.js';
import '@polymer/paper-progress/paper-progress.js';
import '@polymer/paper-dropdown-menu/paper-dropdown-menu.js';
import '@polymer/paper-toggle-button/paper-toggle-button.js';
import '@polymer/neon-animation/animations/scale-up-animation.js';
import '@polymer/neon-animation/animations/fade-out-animation.js';
import '@vaadin/vaadin-dialog/vaadin-dialog.js';
import { PolymerElement, html } from '@polymer/polymer/polymer-element.js';
import { CSRFToken } from '../helpers/utils.js';

export default class EditNodepool extends PolymerElement {
  static get properties() {
    return {
      nodepool: {
        type: Object,
      },
      clusterId: {
        type: String,
      },
      payload: {
        type: Object,
        value() {
          return {};
        },
      },
      formError: {
        type: Boolean,
        value: false,
      },
      errormsg: {
        type: String,
      },
      provider: {
        type: String,
      },
    };
  }

  static get template() {
    return html`
      <style include="shared-styles dialogs">
        :host {
          width: 100%;
        }

        vaadin-dialog {
          min-width: 360px;
        }

        iron-icon {
          color: inherit;
        }

        #content {
          display: flex;
          flex-direction: column;
        }
        #errormsg {
          color: #ff392e;
          text-align: center;
        }

        paper-input {
          text-align: left;
        }
        paper-button {
          background-color: var(--mist-blue);
          color: #fff;
        }
        vaadin-dialog::slotted(app-form paper-button) {
          font-size: 0.9em;
          padding: 1rem;
        }
      </style>
      <vaadin-dialog id="editNodepoolDialog" with-backdrop="">
        <template restamp="">
          <div id="content">
            <h2>Edit Nodepool</h2>
            <br />
            <div>
              <paper-input
                id="desired_nodes"
                label="Number of nodes"
                on-change="_valueChanged"
                value="[[nodepool.node_count]]"
                disabled="[[!_showDesiredNodes(payload.autoscaling)]]"
              >
              </paper-input>
              <template
                is="dom-if"
                if="[[_showAutoscalingToggle(provider)]]"
                restamp=""
              >
                <div class="layout horizontal">
                  <paper-toggle-button
                    id="autoscale"
                    checked="[[payload.autoscaling]]"
                    on-tap="_changeAutoscaling"
                  >
                  </paper-toggle-button>
                  <span> Enable Autoscaling </span>
                </div>
              </template>
            </div>
            <template
              is="dom-if"
              if="[[_showMinMaxNodes(payload.autoscaling)]]"
              restamp=""
            >
              <paper-input
                id="min_nodes"
                label="Minimum number of nodes"
                on-change="_valueChanged"
                value="[[payload.min_nodes]]"
              >
              </paper-input>
              <paper-input
                id="max_nodes"
                label="Maximum number of nodes"
                on-change="_valueChanged"
                value="[[payload.max_nodes]]"
              >
              </paper-input>
            </template>
            <br />
            <paper-button disabled="[[formError]]" on-tap="submit"
              >Submit</paper-button
            >
            <br />
            <template is="dom-if" if="[[formError]]" restamp="">
              <span id="errormsg">[[errormsg]]</span>
            </template>
          </div>
        </template>
      </vaadin-dialog>
      <iron-ajax
        id="editNodepoolsRequest"
        method="POST"
        on-response="_editNodepoolResponse"
        on-error="_editNodepoolError"
        handle-as="xml"
      ></iron-ajax>
    `;
  }

  _openDialog(_e) {
    this._clearSelection();
    this._validateForm();
    this.$.editNodepoolDialog.opened = true;
  }

  _closeDialog(_e) {
    this._clearSelection();
    this.$.editNodepoolDialog.opened = false;
  }

  _clearSelection() {
    if (this.nodepool) {
      this.set('payload.min_nodes',
        this.nodepool.min_nodes || this.nodepool.node_count);
      this.set('payload.max_nodes',
          this.nodepool.max_nodes || this.nodepool.node_count);
      this.set('payload.desired_nodes', this.nodepool.node_count);
      this.set('payload.autoscaling', this.nodepool.autoscaling);
    }
    this.errormsg = '';
    this.set('formError', false);
  }

  _changeAutoscaling(_e) {
    this.set('payload.autoscaling', !this.payload.autoscaling);
    this._validateForm();
  }

  _validateForm() {
    let msg = '';
    if (
      this.provider === 'amazon' &&
      (!(this.payload.min_nodes <= this.payload.desired_nodes) ||
        !(this.payload.max_nodes >= this.payload.desired_nodes))
    ) {
      msg = 'EKS requires Minimum Nodes <= Nodes <= Maximum Nodes';
    } else if (
      this.provider === 'google' &&
      this.payload.autoscaling &&
      (!this.payload.min_nodes || !this.payload.max_nodes)
    ) {
      msg = 'Min Nodes and Max Nodes need to be set with autoscale';
    } else if (
      this.provider === 'google' &&
      this.payload.autoscaling &&
      this.payload.min_nodes > this.payload.max_nodes
    )
      msg = 'Min Nodes should be less than the Max Nodes';

    if (msg) {
      this.errormsg = msg;
      this.set('formError', true);
    } else this.set('formError', false);
  }

  _valueChanged(e) {
    const input = e.target;
    this.payload[input.id] = e.target.value;
    this._validateForm();
  }

  submit() {
    if (this.formError) return;
    if (!this.payload.autoscaling) {
      delete this.payload.min_nodes;
      delete this.payload.max_nodes;
    } else {
      this.payload.min_nodes = parseInt(this.payload.min_nodes, 10);
      this.payload.max_nodes = parseInt(this.payload.max_nodes, 10);
    }
    if (!this.payload.autoscaling && this.nodepool.autoscaling)
      delete this.payload.desired_nodes; // setting autoscaling to false should have no other params
    const request = this.$.editNodepoolsRequest;
    request.headers['Content-Type'] = 'application/json';
    request.headers['Csrf-Token'] = CSRFToken.value;
    request.url = `/api/v2/clusters/${this.clusterId}/nodepools/${this.nodepool.name}`;
    request.body = this.payload;
    request.generateRequest();
  }

  _editNodepoolResponse(e) {
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
          msg: 'Edit Nodepool request sent successfully.',
          duration: 5000,
        },
      })
    );
  }

  _editNodepoolError(e) {
    console.log(e, e.detail);
    const message = e.detail.request.xhr.response || e.detail.error.message;
    this.$.errormsg = message;
    this.dispatchEvent(
      new CustomEvent('action-finished', {
        bubbles: true,
        composed: true,
        detail: { success: false },
      })
    );
  }

  _showAutoscalingToggle() {
    return this.provider === 'google';
  }

  _showMinMaxNodes() {
    // eks needs them every time, gke only with autoscaling enabled
    return this.provider === 'amazon' || this.payload.autoscaling;
  }

  _showDesiredNodes() {
    // eks needs it every time, gke only with autoscaling disabled
    return this.provider === 'amazon' || !this.payload.autoscaling;
  }
}

customElements.define('edit-nodepool', EditNodepool);
