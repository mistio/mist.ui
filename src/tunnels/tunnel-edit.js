import '../../node_modules/@polymer/polymer/polymer-legacy.js';
import '../../node_modules/@polymer/paper-styles/typography.js';
import '../../node_modules/@polymer/paper-input/paper-input.js';
import '../../node_modules/@polymer/paper-input/paper-textarea.js';
import '../../node_modules/@polymer/paper-icon-button/paper-icon-button.js';
import { CSRFToken } from '../helpers/utils.js';
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

      .submit-btn {
        background-color: var(--mist-blue);
        color: #fff;
      }
      #errormsg {
        padding: 0 24px;
        color: var(--red-color);
      }
    </style>

    <paper-dialog id="editTunnelModal" with-backdrop="">
      <h2>Edit Tunnel</h2>
      <paper-icon-button
        class="close"
        icon="clear"
        dialog-dismiss=""
      ></paper-icon-button>
      <paper-dialog-scrollable>
        <p>
          <paper-input
            id="name"
            label="Name"
            error-message="Please enter tunnel's name"
            value="{{newTunnel.name}}"
          ></paper-input>
          <paper-textarea
            id="description"
            label="Description (optional)"
            rows="1"
            max-rows="5"
            error-message="Please enter tunnel's description"
            value="{{newTunnel.description}}"
          ></paper-textarea>
          <paper-textarea
            id="cidrs"
            label="CIDRs"
            rows="3"
            max-rows="5"
            error-message="Please enter tunnel's description"
            value="{{newTunnel.cidrs}}"
          ></paper-textarea>
        </p>
        <div id="errormsg" hidden$="[[!fail]]"></div>
        <p></p>
        <div class="clearfix btn-group">
          <paper-button
            class="submit-btn btn-block"
            disabled$="[[!formReady]]"
            raised=""
            on-tap="_submitForm"
            >Submit</paper-button
          >
        </div>
      </paper-dialog-scrollable>
    </paper-dialog>

    <iron-ajax
      id="tunnelEditAjaxRequest"
      url="/api/v1/tunnels/[[tunnel.id]]"
      method="PUT"
      handle-as="json"
      on-response="_handleTunnelEditAjaxResponse"
      on-error="_handleTunnelEditAjaxError"
    ></iron-ajax>
  `,

  is: 'tunnel-edit',

  properties: {
    tunnel: {
      type: Object,
    },
    newTunnel: {
      type: Object,
      computed: '_computeNewTunnel(tunnel)',
      notify: true,
    },
    sendingData: {
      type: Boolean,
      value: false,
    },
    formReady: {
      type: Boolean,
      computed:
        '_computeFormReady(newTunnel.name, newTunnel.cidrs, sendingData)',
    },
    fail: {
      type: Boolean,
      value: false,
    },
  },

  listeners: {
    'iron-overlay-closed': '_modalClosed',
    input: '_editing',
  },

  _computeNewTunnel(tunnel) {
    if (tunnel) {
      const cidrs = this.tunnel.cidrs.join('\n');
      return {
        name: tunnel.name,
        description: tunnel.description,
        cidrs,
      };
    }
    return {};
  },

  _computeFormReady(name, cidrs, sendingData) {
    let formReady = false;

    if (name && cidrs) {
      formReady = true;
    }

    if (sendingData) {
      formReady = false;
    }

    return formReady;
  },

  _openEditTunnelModal() {
    this.$.editTunnelModal.open();
    this._formReset();
  },

  _closeEditTunnelModal() {
    this.$.editTunnelModal.close();
    this._formReset();
  },

  _modalClosed() {
    this._formReset();
  },

  _submitForm() {
    // var val = this.$.cidrs
    // if (typeof(this.$.cidrs.value) == 'array'){
    //     var cidrs = this.$.cidrs.value;
    // }
    // else {
    //     var cidrs = this.$.cidrs.value.split('\n');
    // }
    this.$.tunnelEditAjaxRequest.headers['Content-Type'] = 'application/json';
    this.$.tunnelEditAjaxRequest.headers['Csrf-Token'] = CSRFToken.value;
    this.$.tunnelEditAjaxRequest.body = {
      name: this.newTunnel.name,
      description: this.newTunnel.description,
      cidrs: this.newTunnel.cidrs,
    };

    // console.log('CIDRS',cidrs);

    this.$.tunnelEditAjaxRequest.generateRequest();

    this.set('sendingData', true);
  },

  _editing() {
    this.set('fail', false);
    this.set('sendingData', false);
  },

  _formReset() {
    this.set('tunnel', {
      name: this.tunnel.name,
      id: this.tunnel.id,
      description: this.tunnel.description,
      cidrs: this.tunnel.cidrs,
    });
    this.set('sendingData', false);
    this.set('fail', false);
  },

  _handleTunnelEditAjaxResponse() {
    this.set('sendingData', false);
    this._closeEditTunnelModal();
  },

  _handleTunnelEditAjaxError(e) {
    let msg404;
    if (e.detail.error.message.indexOf('404') > -1) {
      msg404 = 'Tunnel seems deleted';
    }
    this.$.errormsg.textContent = `${e.detail.error.message} ${msg404}`;
    this.set('sendingData', true);
    this.set('fail', true);
  },
});
