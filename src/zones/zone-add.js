import '../../node_modules/@polymer/polymer/polymer-legacy.js';
import '../../node_modules/@polymer/paper-button/paper-button.js';
import '../../node_modules/@polymer/paper-styles/typography.js';
import '../../node_modules/@polymer/paper-spinner/paper-spinner.js';
import '../../node_modules/@polymer/paper-listbox/paper-listbox.js';
import '../helpers/dialog-element.js';
import '../app-form/app-form.js';
import { Polymer } from '../../node_modules/@polymer/polymer/lib/legacy/polymer-fn.js';
import { html } from '../../node_modules/@polymer/polymer/lib/utils/html-tag.js';

Polymer({
  _template: html`
    <style include="shared-styles forms single-page">
      :host [hidden] {
        display: none !important;
      }

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

      .single-head {
        @apply --zone-page-head-mixin;
      }
    </style>
    <div id="content">
      <paper-material class="single-head layout horizontal">
        <span class="icon">
          <iron-icon icon="[[section.icon]]"></iron-icon>
        </span>
        <div class="title flex">
          <h2>Add Zone</h2>
          <div class="subtitle"></div>
        </div>
      </paper-material>
      <paper-material hidden$="[[hasdnsClouds]]">
        <p>
          To add a zone you need to have an enabled cloud in your account, and
          have DNS support enabled on that cloud. <br />
          Add and enable a cloud using the
          <a href="/clouds/+add" class="blue-link regular">Add Cloud form</a>
          and enable the DNS support on that cloud.
        </p>
      </paper-material>
      <paper-material hidden$="[[!hasdnsClouds]]">
        <div class="grid-row">
          <paper-dropdown-menu
            class="dropdown-block l6 xs12"
            label="Select Cloud"
            horizontal-align="left"
          >
            <paper-listbox
              slot="dropdown-content"
              attr-for-selected="value"
              selected="{{selectedCloud}}"
              class="dropdown-content"
            >
              <template
                is="dom-repeat"
                items="[[dnsCloudsArray]]"
                as="dnsCloud"
              >
                <paper-item value="[[dnsCloud]]">[[dnsCloud.title]]</paper-item>
              </template>
            </paper-listbox>
          </paper-dropdown-menu>
        </div>
        <div class$="selected-[[!selectedCloud]]">
          <div hidden$="[[selectedCloud]]">
            <p>
              Depending on the cloud provider there maybe different needed
              parameters. Choose a DNS supported Cloud type to continue.
            </p>
          </div>
          <div hidden$="[[!selectedCloud]]">
            <app-form
              fields="[[fields]]"
              form="[[zone]]"
              url="/api/v1/clouds/[[cloud.id]]/dns/zones"
              on-response="_handleAddZoneResponse"
              on-error="_handleError"
            ></app-form>
          </div>
        </div>
      </paper-material>
    </div>
  `,

  is: 'zone-add',

  properties: {
    section: {
      type: Object,
    },
    model: {
      type: Object,
    },
    cloud: {
      type: String,
      value: '',
    },
    selectedCloud: {
      type: Object,
      value: false,
    },
    dnsCloudsArray: {
      type: Array,
      value() {
        return [];
      },
    },
    zone: {
      type: Object,
      value() {
        return {
          domain: '',
          type: '',
          ttl: 0,
        };
      },
    },
    fields: {
      type: Array,
      value() {
        return [];
      },
    },
    cloudSpecificFields: {
      type: Object,
      value: {
        Route53: [
          {
            name: 'domain',
            label: 'Domain *',
            type: 'text',
            value: '',
            defaultValue: '',
            placeholder: '',
            pattern: '([a-zA-Z0-9-]{2,64}[.]{1})+[a-zA-Z]{2,64}[.]{0,1}',
            errorMessage: "Please enter zone's domain",
            helptext:
              'Please provide the domain for the DNS zone you want to create (e.g. example.com ).',
            show: true,
            required: true,
          },
          {
            name: 'type',
            label: 'Type',
            type: 'dropdown',
            value: 'master',
            defaultValue: 'master',
            placeholder: '',
            helptext:
              'Select whether this zone will be used as a master DNS Zone or a Slave DNS zone.',
            show: true,
            required: false,
            options: [
              {
                title: 'master',
                val: 'master',
              },
              {
                title: 'slave',
                val: 'slave',
              },
            ],
          },
          {
            name: 'ttl',
            label: 'TTL',
            type: 'text',
            value: 0,
            defaultValue: 0,
            placeholder: '',
            pattern: '[0-9]*',
            helptext:
              'Please provide the Time-To-Live value for this DNS Zone in seconds. This is often the DNS zone information will be refreshed in the DNS servers.',
            show: true,
            required: false,
          },
        ],
        Google: [
          {
            name: 'domain',
            label: 'Domain *',
            type: 'text',
            value: '',
            defaultValue: '',
            placeholder: '',
            pattern: '([a-zA-Z0-9-]{2,64}[.]{1})+[a-zA-Z]{2,64}[.]{0,1}',
            errorMessage: "Please enter zone's domain",
            helptext:
              'Please provide the domain for the DNS zone you want to create (e.g. example.com ).',
            show: true,
            required: true,
          },
          {
            name: 'type',
            label: 'Type',
            type: 'dropdown',
            value: 'master',
            defaultValue: 'master',
            placeholder: '',
            helptext:
              'Select whether this zone will be used as a master DNS Zone or a Slave DNS zone.',
            show: true,
            required: false,
            options: [
              {
                title: 'master',
                val: 'master',
              },
              {
                title: 'slave',
                val: 'slave',
              },
            ],
          },
          {
            name: 'ttl',
            label: 'TTL',
            type: 'text',
            value: 0,
            defaultValue: 0,
            placeholder: '',
            pattern: '[0-9]*',
            helptext:
              'Please provide the Time-To-Live value for this DNS Zone in seconds. This is often the DNS zone information will be refreshed in the DNS servers.',
            show: true,
            required: false,
          },
        ],
        DigitalOcean: [
          {
            name: 'domain',
            label: 'Domain *',
            type: 'text',
            value: '',
            defaultValue: '',
            placeholder: '',
            pattern: '([a-zA-Z0-9-]{2,64}[.]{1})+[a-zA-Z]{2,64}[.]{0,1}',
            errorMessage: "Please enter zone's domain",
            helptext:
              'Please provide the domain for the DNS zone you want to create (e.g. example.com ).',
            show: true,
            required: true,
          },
          {
            name: 'type',
            label: 'Type',
            type: 'dropdown',
            value: 'master',
            defaultValue: 'master',
            placeholder: '',
            helptext:
              'Select whether this zone will be used as a master DNS Zone or a Slave DNS zone.',
            show: true,
            required: false,
            options: [
              {
                title: 'master',
                val: 'master',
              },
              {
                title: 'slave',
                val: 'slave',
              },
            ],
          },
        ],
        Linode: [
          {
            name: 'domain',
            label: 'Domain *',
            type: 'text',
            value: '',
            defaultValue: '',
            placeholder: '',
            pattern: '([a-zA-Z0-9-]{2,64}[.]{1})+[a-zA-Z]{2,64}[.]{0,1}',
            errorMessage: "Please enter zone's domain",
            helptext:
              'Please provide the domain for the DNS zone you want to create (e.g. example.com ).',
            show: true,
            required: true,
          },
          {
            name: 'type',
            label: 'Type',
            type: 'dropdown',
            value: 'master',
            defaultValue: 'master',
            placeholder: '',
            helptext:
              'Select whether this zone will be used as a master DNS Zone or a Slave DNS zone.',
            show: true,
            required: false,
            options: [
              {
                title: 'master',
                val: 'master',
              },
              {
                title: 'slave',
                val: 'slave',
              },
            ],
          },
          {
            name: 'SOA_email',
            label: 'SOA email',
            type: 'text',
            value: '',
            defaultValue: '',
            placeholder: '',
            helptext:
              'Linode requires a Start of Authority (SOA) email when creating a master DNS zone.',
            required: true,
            showIf: {
              fieldName: 'type',
              fieldValues: ['master'],
            },
          },
          {
            name: 'master_ips',
            label: 'DNS Master Node IP',
            type: 'text',
            value: '',
            defaultValue: '',
            placeholder: '',
            helptext:
              'Linode requires the DNS master node IP address when creating a slave DNS zone.',
            required: true,
            showIf: {
              fieldName: 'type',
              fieldValues: ['slave'],
            },
          },
        ],
        RackSpace: [
          {
            name: 'domain',
            label: 'Domain *',
            type: 'text',
            value: '',
            defaultValue: '',
            placeholder: '',
            pattern: '([a-zA-Z0-9-]{2,64}[.]{1})+[a-zA-Z]{2,64}[.]{0,1}',
            errorMessage: "Please enter zone's domain",
            helptext:
              'Please provide the domain for the DNS zone you want to create (e.g. example.com ).',
            show: true,
            required: true,
          },
          {
            name: 'type',
            label: 'Type',
            type: 'dropdown',
            value: 'master',
            defaultValue: 'master',
            placeholder: '',
            helptext:
              'Select whether this zone will be used as a master DNS Zone or a Slave DNS zone.',
            show: true,
            required: false,
            options: [
              {
                title: 'master',
                val: 'master',
              },
              {
                title: 'slave',
                val: 'slave',
              },
            ],
          },
          {
            name: 'email',
            label: 'email',
            type: 'text',
            value: '',
            defaultValue: '',
            placeholder: '',
            helptext: 'Rackspace requires an email when creating a DNS zone.',
            show: true,
            required: true,
          },
        ],
        SoftLayer: [
          {
            name: 'domain',
            label: 'Domain *',
            type: 'text',
            value: '',
            defaultValue: '',
            placeholder: '',
            pattern: '([a-zA-Z0-9-]{2,64}[.]{1})+[a-zA-Z]{2,64}[.]{0,1}',
            errorMessage: "Please enter zone's domain",
            helptext:
              'Please provide the domain for the DNS zone you want to create (e.g. example.com ).',
            show: true,
            required: true,
          },
          {
            name: 'type',
            label: 'Type',
            type: 'dropdown',
            value: 'master',
            defaultValue: 'master',
            placeholder: '',
            helptext:
              'Select whether this zone will be used as a master DNS Zone or a Slave DNS zone.',
            show: true,
            required: false,
            options: [
              {
                title: 'master',
                val: 'master',
              },
              {
                title: 'slave',
                val: 'slave',
              },
            ],
          },
          {
            name: 'ttl',
            label: 'TTL',
            type: 'text',
            value: 0,
            defaultValue: 0,
            placeholder: '',
            pattern: '[0-9]*',
            helptext:
              'Please provide the Time-To-Live value for this DNS Zone in seconds. This is often the DNS zone information will be refreshed in the DNS servers.',
            show: true,
            required: false,
          },
        ],
        Vultr: [
          {
            name: 'domain',
            label: 'Domain *',
            type: 'text',
            value: '',
            defaultValue: '',
            placeholder: '',
            pattern: '([a-zA-Z0-9-]{2,64}[.]{1})+[a-zA-Z]{2,64}[.]{0,1}',
            errorMessage: "Please enter zone's domain",
            helptext:
              'Please provide the domain for the DNS zone you want to create (e.g. example.com ).',
            show: true,
            required: true,
          },
          {
            name: 'type',
            label: 'Type',
            type: 'dropdown',
            value: 'master',
            defaultValue: 'master',
            placeholder: '',
            helptext:
              'Select whether this zone will be used as a master DNS Zone or a Slave DNS zone.',
            show: true,
            required: false,
            options: [
              {
                title: 'master',
                val: 'master',
              },
              {
                title: 'slave',
                val: 'slave',
              },
            ],
          },
          {
            name: 'ttl',
            label: 'TTL',
            type: 'text',
            value: 0,
            defaultValue: 0,
            placeholder: '',
            pattern: '[0-9]*',
            helptext:
              'Please provide the Time-To-Live value for this DNS Zone in seconds. This is often the DNS zone information will be refreshed in the DNS servers.',
            show: true,
            required: false,
          },
          {
            name: 'ip',
            label: 'IP',
            type: 'text',
            value: '',
            defaultValue: '',
            placeholder: '',
            helptext:
              'Vultr requires the assignment of this domain to a specific cloud server IP address.',
            show: true,
            required: true,
          },
        ],
      },
      notify: true,
    },
    hasdnsClouds: {
      type: Boolean,
      value: true,
    },
  },

  observers: [
    '_cloudsChanged(model.clouds.*)',
    '_cloudSelected(selectedCloud)',
  ],

  listeners: {
    change: 'updateFields',
    'iron-select': 'updateUrl',
  },

  _cloudsChanged() {
    const dnsClouds = this.model.cloudsArray.filter(cloud => {
      return (
        [
          'ec2',
          'gce',
          'digitalocean',
          'linode',
          'rackspace',
          'softlayer',
          'vultr',
        ].indexOf(cloud.provider) > -1 &&
        cloud.enabled &&
        cloud.dns_enabled
      );
    });
    if (dnsClouds.length > 0) {
      this.set('hasdnsClouds', true);
      const dnsCloudsArray = [];
      dnsClouds.forEach(dnsCloud => {
        dnsCloudsArray.push(dnsCloud);
      });
      this.set('dnsCloudsArray', dnsCloudsArray);
    } else {
      this.set('hasdnsClouds', false);
    }
  },

  _cloudSelected(selectedCloud) {
    if (selectedCloud) {
      if (selectedCloud.provider === 'gce') {
        this.set('fields', this.cloudSpecificFields.Google);
        [this.cloud] = this.model.cloudsArray.filter(clouda => {
          return clouda.id === selectedCloud.id;
        });
      } else if (selectedCloud.provider === 'ec2') {
        this.set('fields', this.cloudSpecificFields.Route53);
        [this.cloud] = this.model.cloudsArray.filter(clouda => {
          return clouda.id === selectedCloud.id;
        });
      } else if (selectedCloud.provider === 'digitalocean') {
        this.set('fields', this.cloudSpecificFields.DigitalOcean);
        [this.cloud] = this.model.cloudsArray.filter(clouda => {
          return clouda.id === selectedCloud.id;
        });
      } else if (selectedCloud.provider === 'linode') {
        this.set('fields', this.cloudSpecificFields.Linode);
        [this.cloud] = this.model.cloudsArray.filter(clouda => {
          return clouda.id === selectedCloud.id;
        });
      } else if (selectedCloud.provider === 'rackspace') {
        this.set('fields', this.cloudSpecificFields.RackSpace);
        [this.cloud] = this.model.cloudsArray.filter(clouda => {
          return clouda.id === selectedCloud.id;
        });
      } else if (selectedCloud.provider === 'softlayer') {
        this.set('fields', this.cloudSpecificFields.SoftLayer);
        [this.cloud] = this.model.cloudsArray.filter(clouda => {
          return clouda.id === selectedCloud.id;
        });
      } else if (selectedCloud.provider === 'vultr') {
        this.set('fields', this.cloudSpecificFields.Vultr);
        [this.cloud] = this.model.cloudsArray.filter(clouda => {
          return clouda.id === selectedCloud.id;
        });
      }
    }
    // this.updatePayload();
  },

  updateFields() {
    this.set('formError', false);
    this.updatePayload();
  },

  updateUrl(e) {
    // update url when cloud is selected
    if (e.target.id === 'cloud') {
      const cloud = this.fields.findIndex(field => {
        return field.name === 'cloud';
      }, this);
      this.set('cloud', this.fields[cloud].value);
    }
    this.updatePayload();
  },

  updatePayload() {
    if (this.fields.length) {
      // update payload
      const payload = {};

      const domain = this.fields.findIndex(field => {
        return field.name === 'domain';
      }, this);
      payload.domain = this.fields[domain].value;
      if (
        this.selectedCloud.provider === 'ec2' ||
        this.selectedCloud.provider === 'gce' ||
        this.selectedCloud.provider === 'digitalocean' ||
        this.selectedCloud.provider === 'rackspace' ||
        this.selectedCloud.provider === 'softlayer' ||
        this.selectedCloud.provider === 'vultr'
      ) {
        const type = this.fields.findIndex(field => {
          return field.name === 'type';
        }, this);
        payload.type = this.fields[type].value;
      }
      if (
        this.selectedCloud.provider === 'ec2' ||
        this.selectedCloud.provider === 'gce' ||
        this.selectedCloud.provider === 'linode' ||
        this.selectedCloud.provider === 'rackspace' ||
        this.selectedCloud.provider === 'softlayer' ||
        this.selectedCloud.provider === 'vultr'
      ) {
        const type = this.fields.findIndex(field => {
          return field.name === 'type';
        }, this);
        payload.type = this.fields[type].value;
      }
      if (
        this.selectedCloud.provider === 'ec2' ||
        this.selectedCloud.provider === 'gce' ||
        this.selectedCloud.provider === 'softlayer' ||
        this.selectedCloud.provider === 'vultr'
      ) {
        const ttl = this.fields.findIndex(field => {
          return field.name === 'ttl';
        }, this);
        payload.ttl = this.fields[ttl].value;
      }
      if (this.selectedCloud.provider === 'linode') {
        if (payload.type === 'master') {
          const soa = this.fields.findIndex(field => {
            return field.name === 'SOA_email';
          }, this);
          delete payload.master_ips;
          payload.SOA_Email = this.fields[soa].value;
        } else {
          const masterIPs = this.fields.findIndex(field => {
            return field.name === 'master_ips';
          }, this);
          delete payload.SOA_Email;
          payload.masterIPs = this.fields[masterIPs].value;
        }
      }
      if (this.selectedCloud.provider === 'vultr') {
        const ip = this.fields.findIndex(field => {
          return field.name === 'ip';
        }, this);
        if (this.fields[ip].value !== '') {
          payload.ip = this.fields[ip].value;
        }
      }
      if (this.selectedCloud.provider === 'rackspace') {
        const email = this.fields.findIndex(field => {
          return field.name === 'email';
        }, this);
        if (this.fields[email].value !== '') {
          payload.email = this.fields[email].value;
        }
      }

      this.set('zone', payload);
      // console.warn(`Update Payload:${  payload}`)
    }
  },

  _handleAddZoneResponse(e) {
    const response = JSON.parse(e.detail.xhr.response);
    this.dispatchEvent(
      new CustomEvent('toast', {
        bubbles: true,
        composed: true,
        detail: {
          msg: 'Zone was created successfully.',
          duration: 3000,
        },
      })
    );

    this.dispatchEvent(
      new CustomEvent('go-to', {
        bubbles: true,
        composed: true,
        detail: {
          url: `/zones/${response.id}`,
        },
      })
    );
  },

  _handleError(e) {
    // console.log(e);
    this.$.errormsg.textContent = e.detail.request.xhr.responseText;
    this.set('formError', true);
  },

  _goBack() {
    window.history.back();
  },
});
