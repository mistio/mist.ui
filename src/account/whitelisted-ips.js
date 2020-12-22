import '../../node_modules/@polymer/polymer/polymer-legacy.js';
import '../../node_modules/@polymer/paper-styles/typography.js';
import '../../node_modules/@polymer/paper-button/paper-button.js';
import '../../node_modules/@polymer/paper-progress/paper-progress.js';
import '../../node_modules/@polymer/paper-input/paper-input.js';
import './multi-inputs.js';
import { Polymer } from '../../node_modules/@polymer/polymer/lib/legacy/polymer-fn.js';
import { html } from '../../node_modules/@polymer/polymer/lib/utils/html-tag.js';
import { CSRFToken } from '../helpers/utils.js';

Polymer({
  _template: html`
    <style include="shared-styles forms">
      :host paper-material {
        display: block;
        padding: 0;
      }

      label {
        color: rgba(0, 0, 0, 0.54) !important;
        font-size: 12px;
      }

      .grid-row {
        padding: 24px;
      }

      .head {
        margin-bottom: 16px;
      }

      h2.title {
        font-weight: 500;
      }

      h2.title,
      h2.title ~ p {
        margin-top: 0;
        margin-bottom: 0;
      }
      hr {
        width: 100%;
      }
      :host paper-progress {
        position: absolute;
        width: 100%;
        left: 0;
        right: 0;
      }

      .margin {
        margin: 32px 0;
      }

      .bottom-actions {
        padding-bottom: 24px;
        padding-left: 1rem;
      }
      .separator {
        border-top: 4px solid #ddd;
      }
      .progress {
        margin: 32px 0 8px 0;
        width: 100%;
      }
      paper-progress.progresserror ::slotted(#primaryProgress) {
        background-color: var(--red-color);
      }
      .errormsg-container {
        color: var(--red-color);
        padding-left: 24px;
        padding-right: 24px;
      }
      .errormsg-container iron-icon {
        color: inherit;
      }
      iron-icon {
        margin-top: -3px;
        margin-right: 3px;
      }
    </style>
    <paper-material>
      <div class="grid-row">
        <div class="xs12 head">
          <h2 class="title">IP whitelisting</h2>
        </div>
        <div class="ips-section xs12 m12 l12">
          <p>
            Allow account access to whitelisted IPs only. You can use CIDR
            format.
          </p>
          <multi-inputs
            with-description=""
            input-label="cidr"
            inputs-array="{{whiteIps}}"
            event-name="save-ips"
            default-input="[[user.current_ip]]"
            show-add-default="[[showAddCurrent]]"
          ></multi-inputs>
        </div>

        <div class="progress">
          <paper-progress
            id="ipProgress"
            indeterminate=""
            hidden$="[[!loadingIp]]"
          ></paper-progress>
          <paper-progress
            id="ipprogresserror"
            class="progresserror"
            value="100"
            hidden$="[[!ipError]]"
          ></paper-progress>
          <hr class="appform" />
          <p
            id="iprprogressmessage"
            class="errormsg-container"
            hidden$="[[!ipError]]"
          >
            <iron-icon icon="icons:error-outline"></iron-icon
            ><span id="iperrormsg"></span>
          </p>
        </div>

        <div class="bottom-actions clearfix xs12">
          <paper-button
            id="save_ips"
            on-tap="_saveWhitelist"
            raised=""
            disabled$="[[!ipsFormReady]]"
            class="blue"
            >Save IPs</paper-button
          >

          <iron-ajax
            id="ipsRequest"
            url="/api/v1/whitelist"
            method="POST"
            handle-as="xml"
            loading="{{loadingIp}}"
            on-response="_handleIpResponse"
            on-error="_handleIpError"
          ></iron-ajax>
        </div>
      </div>
    </paper-material>

    <dialog-element id="saveIps"></dialog-element>
  `,

  is: 'whitelisted-ips',

  properties: {
    org: {
      type: Object,
    },
    user: {
      type: Object,
    },
    ipsFormReady: {
      type: Boolean,
      value: false,
    },
    loadingIp: {
      type: Boolean,
      value: false,
    },
    ipError: {
      type: Boolean,
      value: false,
    },
    whiteIps: {
      type: Array,
    },
    showAddCurrent: {
      type: Boolean,
      value: false,
    },
  },

  observers: [
    '_userUpdated(user)',
    '_showAddCurrent(whiteIps.length, user.current_ip)',
    '_updateFormReady(user, whiteIps.*)',
    '_whitelistedIpsChanged(user.ips)',
  ],

  listeners: {
    input: '_formInput',
    'add-current': 'addCurrentIP',
    confirmation: '_proceedToSaveWhitelist',
  },

  _saveWhitelist(_e) {
    if (
      this.showAddCurrent &&
      this.whiteIps.length &&
      !this.ipIsWhitelisted('0.0.0.0/0')
    ) {
      const message = {
        title: 'Save IPs',
        body:
          'Heads up! Your current IP is not included in the whitelist. If you ommit your current IP or the 0.0.0.0/0 wildcard, you will be logged out after saving.',
        reason: 'proceed.saveips',
        action: 'Save anyway',
        danger: true,
      };
      this._showDialog(message);
    } else {
      this._proceedToSaveWhitelist();
    }
  },

  _showDialog(info) {
    const dialog = this.$.saveIps;
    if (info) {
      Object.keys(info).forEach(i => {
        dialog[i] = info[i];
      });
    }
    dialog._openDialog();
  },

  _proceedToSaveWhitelist(e) {
    if (
      !e ||
      (e.detail.response === 'confirm' && e.detail.reason === 'proceed.saveips')
    ) {
      const payloadIPs = this.whiteIps.filter(ip => {
        return ip.cidr && ip.cidr.length;
      });
      const payload = {
        ips: payloadIPs,
      };
      this.$.ipsRequest.headers['Content-Type'] = 'application/json';
      this.$.ipsRequest.headers['Csrf-Token'] = CSRFToken.value;
      this.$.ipsRequest.body = payload;
      this.$.ipsRequest.generateRequest();
    }
  },

  addCurrentIP(e) {
    e.stopImmediatePropagation();
    this.push('whiteIps', {
      cidr: this.user.current_ip,
      description: 'Current IP',
    });
  },

  _showAddCurrent(ips, currentIp) {
    if (this.whiteIps && this.whiteIps.length) {
      const isInArray = this.whiteIps.find(p => {
        return p.cidr === `${currentIp}/32` || p.cidr === currentIp;
      });
      this.set('showAddCurrent', !isInArray);
    }
  },

  _userUpdated(user) {
    this.whiteIps = user.ips ? user.ips.slice(0) : [];
    this.firstName = user.first_name;
    this.lastName = user.last_name;
  },

  _updateFormReady(user, whitelist) {
    // console.log('_updateFormReady', whitelist);
    // listen to array length changes
    if (whitelist && this.isAttached) {
      this.set('ipsFormReady', true);
    }
  },

  _formInput() {
    // listen to input changes
    if (this.ipError) this.set('ipError', false);
    this.set('ipsFormReady', true);
  },

  _whitelistedIpsChanged(_userIPs) {
    if (
      this.user &&
      this.user.current_ip &&
      this.user.ips.length &&
      !this.ipIsWhitelisted(this.user.current_ip)
    ) {
      window.location.href = '/logout';
    }
  },

  ipIsWhitelisted(currentIp) {
    // allow access, if wildcard ip 0.0.0.0/0 is included
    return (
      this.user.ips &&
      this.user.ips.find(ip => {
        return ip.cidr === `${currentIp}/32` || ip.cidr === '0.0.0.0/0';
      })
    );
  },

  _handleIpResponse() {
    this.dispatchEvent(
      new CustomEvent('toast', {
        bubbles: true,
        composed: true,
        detail: { msg: 'IPs saved succesfully!', duration: 3000 },
      })
    );

    this.set('ipsFormReady', false);
  },

  _handleIpError(e) {
    this.set('ipError', true);
    this.set('ipsFormReady', false);
    // console.log('_handleIpError', e.detail.request.xhr.responseText);
    this.$.iperrormsg.textContent = e.detail.request.xhr.responseText;
  },
});
