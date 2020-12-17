import '../../node_modules/@polymer/polymer/polymer-legacy.js';
import '../../node_modules/@polymer/paper-button/paper-button.js';
import '../../node_modules/@polymer/paper-progress/paper-progress.js';
import '../../node_modules/@polymer/paper-styles/typography.js';
import '../app-form/app-form.js';
import { YAML } from '../../node_modules/yaml/browser/dist/index.js';
import { Polymer } from '../../node_modules/@polymer/polymer/lib/legacy/polymer-fn.js';
import { html } from '../../node_modules/@polymer/polymer/lib/utils/html-tag.js';

Polymer({
  _template: html`
    <style include="shared-styles forms single-page">
      #content {
        max-width: 900px;
      }

      paper-material {
        display: block;
        padding: 24px;
      }

      paper-progress {
        position: absolute;
        bottom: 85px;
        width: 100%;
        left: 0;
        right: 0;
      }

      :host > ::slotted(paper-input-container) {
        padding-top: 16px;
        padding-bottom: 16px;
      }

      :host ::slotted(paper-radio-group) {
        margin-bottom: 16px !important;
      }

      :host ::slotted(paper-radio-group:before) {
        content: 'Protocol';
        position: relative;
        display: block;
        color: rgba(0, 0, 0, 0.54) !important;
        text-transform: uppercase;
        font-size: 13px;
        font-weight: 400;
        line-height: 24px;
      }

      .single-head {
        @apply --tunnel-page-head-mixin;
      }
    </style>

    <div id="content">
      <paper-material class="single-head layout horizontal">
        <span class="icon">
          <iron-icon icon="[[section.icon]]"></iron-icon>
        </span>
        <div class="title flex">
          <h2>Add Tunnel</h2>
          <div class="subtitle">
            You can add tunnels to your networks by providing a list of networks
            in CIDR notation.
          </div>
        </div>
      </paper-material>
      <paper-material>
        <app-form
          fields="[[fields]]"
          form="[[tunnel]]"
          url="/api/v1/tunnels"
          method="POST"
          on-request="_addTunnelAjaxRequest"
          handleas="xml"
          on-response="_addTunnelAjaxResponse"
        ></app-form>
      </paper-material>
    </div>
  `,

  is: 'tunnel-add',

  properties: {
    sections: {
      type: Object,
    },
    section: {
      type: Object,
    },
    model: {
      type: Object,
    },
    tunnel: {
      type: Object,
      value() {
        return {
          name: '',
          description: '',
          cidrs: '',
          excluded_cidrs: '',
          active: '',
        };
      },
    },
    typedName: {
      type: String,
      value: '',
    },
    fields: {
      type: Array,
      value: [
        {
          name: 'name',
          label: 'Tunnel Name *',
          type: 'text',
          value: '',
          isLead: true,
          defaultValue: '',
          placeholder: '',
          errorMessage: "Please enter tunnel's name",
          show: true,
          required: true,
        },
        {
          name: 'description',
          label: 'Tunnel Description',
          type: 'textarea',
          value: '',
          defaultValue: '',
          placeholder: '',
          errorMessage: "Please enter tunnel's description",
          helptext: 'Optional.',
          show: true,
          required: false,
        },
        {
          name: 'cidrs',
          label: 'CIDRs *',
          type: 'ip_textarea',
          value: '',
          defaultValue: '',
          errorMessage: "Please enter tunnel's cidrs",
          helptext:
            'These are the IPv4 address ranges that Mist.io will be able to access through the tunnel. Example: 172.17.3.0/24. A CIDR with /0 will redirect ALL your traffic through the tunnel.',
          show: true,
          required: true,
        },
        {
          name: 'excluded_cidrs',
          label: 'Excluded CIDRs',
          type: 'ip_textarea',
          value: '',
          defaultValue: '',
          errorMessage: "Please enter tunnel's cidrs",
          helptext:
            'Mist.io will choose 2 random IPv4 address for the end points of the VPN tunnel. Optionally define CIDRs to exclude from the random selection, in order to avoid conflicts.',
          show: true,
          required: false,
        },
        {
          name: 'protocol',
          label: 'Protocol',
          type: 'radio',
          value: 'udp',
          defaultValue: 'udp',
          errorMessage: "Please choose the VPN tunnel's underlying protocol",
          helptext:
            "Please choose the VPN tunnel's underlying protocol. This option may seem useful in case of security restrictions, such as protocol-specific, blocking firewall rules",
          show: true,
          required: false,
          options: [
            {
              title: 'TCP',
              val: 'tcp',
            },
            {
              title: 'UDP',
              val: 'udp',
            },
          ],
        },
        {
          name: 'Αctive',
          label: 'Enabled',
          type: 'toggle',
          value: 'true',
          defaultValue: '',
          placeholder: '',
          show: false,
          required: false,
          disabled: true,
        },
      ],
    },
  },

  _addTunnelAjaxRequest() {},

  _addTunnelAjaxResponse(e) {
    const response = YAML.parse(e.detail.xhr.response);
    if (response.id) {
      this.dispatchEvent(
        new CustomEvent('go-to', {
          bubbles: true,
          composed: true,
          detail: {
            url: `/tunnels/${response.id}`,
          },
        })
      );
    } else {
      this.dispatchEvent(
        new CustomEvent('go-to', {
          bubbles: true,
          composed: true,
          detail: {
            url: '/tunnels',
          },
        })
      );
    }
  },
});
