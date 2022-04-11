import '@polymer/paper-material/paper-material.js';
import '@polymer/paper-button/paper-button.js';
import '@polymer/paper-progress/paper-progress.js';
import '@polymer/paper-styles/typography.js';
import '@polymer/paper-listbox/paper-listbox.js';
import '../app-form/app-form.js';
import { Polymer } from '@polymer/polymer/lib/legacy/polymer-fn.js';
import { html } from '@polymer/polymer/lib/utils/html-tag.js';

const NETWORK_CREATE_FIELDS = [];

// OPENSTACK
NETWORK_CREATE_FIELDS.push({
  provider: 'openstack',
  fields: [
    {
      name: 'name',
      label: 'Name *',
      type: 'text',
      value: '',
      defaultValue: '',
      placeholder: '',
      errorMessage: "Please enter network's name",
      show: true,
      required: true,
      excludeFromPayload: true,
      inPayloadGroup: 'network',
    },
    {
      name: 'admin_state_up',
      label: 'Admin State *',
      type: 'dropdown',
      value: true,
      defaultValue: true,
      placeholder: '',
      show: true,
      required: true,
      excludeFromPayload: true,
      options: [
        {
          title: 'Up',
          val: true,
        },
        {
          title: 'Down',
          val: false,
        },
      ],
      inPayloadGroup: 'network',
    },
    {
      name: 'createSubnet',
      label: 'Create Subnet',
      type: 'toggle',
      value: false,
      defaultValue: false,
      placeholder: '',
      show: true,
      required: false,
      excludeFromPayload: true,
    },
    {
      name: 'subnet_name',
      label: 'Subnet Name',
      type: 'text',
      value: '',
      defaultValue: '',
      placeholder: '',
      show: false,
      required: false,
      showIf: {
        fieldName: 'createSubnet',
        fieldValues: [true],
      },
      inPayloadGroup: 'subnet',
    },
    {
      name: 'cidr',
      label: 'Subnet Address (CIDR)',
      type: 'ip_textarea',
      value: '',
      defaultValue: '',
      placeholder: '',
      show: false,
      required: false,
      showIf: {
        fieldName: 'createSubnet',
        fieldValues: [true],
      },
      inPayloadGroup: 'subnet',
    },
    {
      name: 'ip_version',
      label: 'IP Version',
      type: 'dropdown',
      value: 4,
      defaultValue: 4,
      placeholder: '',
      show: false,
      required: false,
      options: [
        {
          title: 'IPv4',
          val: 4,
        },
        {
          title: 'IPv6',
          val: 6,
        },
      ],
      showIf: {
        fieldName: 'createSubnet',
        fieldValues: [true],
      },
      inPayloadGroup: 'subnet',
    },
    {
      name: 'gateway_ip',
      label: 'Gateway IP',
      type: 'text',
      value: '',
      defaultValue: '',
      placeholder: '',
      show: true,
      required: false,
      disabled: false,
      showIf: {
        fieldName: 'disableGateway',
        fieldValues: [false],
      },
      inPayloadGroup: 'subnet',
    },
    {
      name: 'disableGateway',
      label: 'Disable Gateway',
      type: 'toggle',
      value: false,
      defaultValue: false,
      placeholder: '',
      show: false,
      required: false,
      showIf: {
        fieldName: 'createSubnet',
        fieldValues: [true],
      },
      excludeFromPayload: true,
    },
    {
      name: 'enable_dhcp',
      label: 'Enable DHCP',
      type: 'toggle',
      value: false,
      defaultValue: false,
      placeholder: '',
      show: false,
      required: false,
      showIf: {
        fieldName: 'createSubnet',
        fieldValues: [true],
      },
      inPayloadGroup: 'subnet',
    },
    {
      name: 'allocation_pools',
      label: 'Allocation Pools',
      type: 'textarea',
      value: '',
      defaultValue: '',
      placeholder: '',
      show: false,
      required: false,
      helptext: 'In the form: start CIDR - end CIDR, a range per line.',
      showIf: {
        fieldName: 'createSubnet',
        fieldValues: [true],
      },
      inPayloadGroup: 'subnet',
    },
  ],
});

// GCE
NETWORK_CREATE_FIELDS.push({
  provider: 'gce',
  fields: [
    {
      name: 'name',
      label: 'Name *',
      type: 'text',
      value: '',
      defaultValue: '',
      placeholder: '',
      errorMessage: "Please enter network's name",
      show: true,
      required: true,
      excludeFromPayload: true,
      inPayloadGroup: 'network',
    },
    {
      name: 'mode',
      label: 'Subnet Type',
      type: 'dropdown',
      value: 'auto',
      defaultValue: 'auto',
      show: true,
      required: true,
      helptext:
        'Subnets let you create your own private cloud topology within Google Cloud. Click Automatic to create a subnet in each region, or click Custom to manually define the subnets',
      options: [
        {
          title: 'Automatic',
          val: 'auto',
        },
        {
          title: 'Custom',
          val: 'custom',
        },
      ],
      inPayloadGroup: 'network',
    },
    {
      name: 'name',
      label: 'Subnet Name',
      type: 'text',
      value: '',
      defaultValue: '',
      placeholder: '',
      show: false,
      required: false,
      showIf: {
        fieldName: 'mode',
        fieldValues: ['custom'],
      },
      inPayloadGroup: 'subnet',
    },
    {
      name: 'cidr',
      label: 'Subnet CIDR',
      type: 'ip_textarea',
      value: '',
      defaultValue: '',
      placeholder: '',
      show: false,
      required: false,
      showIf: {
        fieldName: 'mode',
        fieldValues: ['custom'],
      },
      inPayloadGroup: 'subnet',
    },
    {
      name: 'region',
      label: 'Region *',
      type: 'mist_dropdown',
      value: '',
      defaultValue: '',
      show: true,
      required: true,
      options: [],
      showIf: {
        fieldName: 'mode',
        fieldValues: ['custom'],
      },
      inPayloadGroup: 'subnet',
    },
  ],
});

// EC2
NETWORK_CREATE_FIELDS.push({
  provider: 'ec2',
  fields: [
    {
      name: 'name',
      label: 'Name *',
      type: 'text',
      value: '',
      defaultValue: '',
      placeholder: '',
      errorMessage: "Please enter network's name",
      show: true,
      required: true,
      inPayloadGroup: 'network',
    },
    {
      name: 'cidr',
      label: 'Network CIDR',
      type: 'ip_textarea',
      value: '',
      defaultValue: '',
      placeholder: '',
      show: true,
      required: true,
      inPayloadGroup: 'network',
    },
    {
      name: 'createSubnet',
      label: 'Create Subnet',
      type: 'toggle',
      value: false,
      defaultValue: false,
      placeholder: '',
      show: true,
      required: false,
      excludeFromPayload: true,
    },
    {
      name: 'name',
      label: 'Subnet Name',
      type: 'text',
      value: '',
      defaultValue: '',
      placeholder: '',
      show: false,
      required: false,
      showIf: {
        fieldName: 'createSubnet',
        fieldValues: [true],
      },
      inPayloadGroup: 'subnet',
    },
    {
      name: 'cidr',
      label: 'Subnet CIDR',
      type: 'ip_textarea',
      value: '',
      defaultValue: '',
      placeholder: '',
      show: false,
      required: false,
      showIf: {
        fieldName: 'createSubnet',
        fieldValues: [true],
      },
      inPayloadGroup: 'subnet',
    },
    {
      name: 'availability_zone',
      label: 'Availability Zone *',
      type: 'mist_dropdown',
      value: '',
      defaultValue: '',
      show: false,
      required: false,
      options: [],
      showIf: {
        fieldName: 'createSubnet',
        fieldValues: [true],
      },
      inPayloadGroup: 'subnet',
    },
  ],
});

// LXD
NETWORK_CREATE_FIELDS.push({
  provider: 'lxd',
  fields: [
    {
      name: 'name',
      label: 'Name *',
      type: 'text',
      value: '',
      defaultValue: '',
      placeholder: '',
      errorMessage: "Please enter network's name",
      show: true,
      required: true,
      inPayloadGroup: 'network',
    },
    {
      name: 'cidr',
      label: 'Network CIDR',
      type: 'ip_textarea',
      value: '',
      defaultValue: '',
      placeholder: '',
      show: true,
      required: true,
      inPayloadGroup: 'network',
    },
  ],
});

// ALIYUN
NETWORK_CREATE_FIELDS.push({
  provider: 'aliyun_ecs',
  fields: [
    {
      name: 'name',
      label: 'Name *',
      type: 'text',
      value: '',
      defaultValue: '',
      placeholder: '',
      errorMessage: "Please enter network's name",
      show: true,
      required: true,
      inPayloadGroup: 'network',
    },
    {
      name: 'cidr',
      label: 'Network CIDR',
      type: 'ip_textarea',
      value: '',
      defaultValue: '',
      placeholder: '172.16.0.0/12',
      show: true,
      required: true,
      inPayloadGroup: 'network',
    },
    {
      name: 'createSubnet',
      label: 'Create Subnet',
      type: 'toggle',
      value: false,
      defaultValue: false,
      placeholder: '',
      show: true,
      required: false,
      excludeFromPayload: true,
    },
    {
      name: 'name',
      label: 'Subnet Name',
      type: 'text',
      value: '',
      defaultValue: '',
      placeholder: '',
      show: false,
      required: false,
      showIf: {
        fieldName: 'createSubnet',
        fieldValues: [true],
      },
      inPayloadGroup: 'subnet',
    },
    {
      name: 'cidr',
      label: 'Subnet CIDR',
      type: 'ip_textarea',
      value: '',
      defaultValue: '',
      placeholder: '172.16.0.0/29',
      show: false,
      required: false,
      showIf: {
        fieldName: 'createSubnet',
        fieldValues: [true],
      },
      inPayloadGroup: 'subnet',
    },
    {
      name: 'availability_zone',
      label: 'Availability Zone *',
      type: 'mist_dropdown',
      value: '',
      defaultValue: '',
      show: false,
      required: false,
      options: [],
      showIf: {
        fieldName: 'createSubnet',
        fieldValues: [true],
      },
      inPayloadGroup: 'subnet',
    },
  ],
});

// VULTR
NETWORK_CREATE_FIELDS.push({
  provider: 'vultr',
  fields: [
    {
      name: 'name',
      label: 'Name *',
      type: 'text',
      value: '',
      defaultValue: '',
      placeholder: '',
      errorMessage: "Please enter network's name",
      show: true,
      required: true,
      inPayloadGroup: 'network',
    },
    {
      name: 'cidr',
      label: 'Network CIDR',
      type: 'ip_textarea',
      value: '',
      defaultValue: '',
      placeholder: '172.16.0.0/12',
      show: true,
      required: true,
      inPayloadGroup: 'network',
    },
    {
      name: 'location',
      label: 'Location *',
      type: 'mist_dropdown',
      value: '',
      defaultValue: '',
      show: true,
      required: true,
      options: [],
      inPayloadGroup: 'network',
    },
  ],
});
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

      .dropdown-with-logos paper-item img {
        margin-right: 16px;
      }

      .single-head {
        @apply --network-page-head-mixin;
      }
    </style>
    <div id="content">
      <paper-material class="single-head layout horizontal">
        <span class="icon">
          <iron-icon icon="[[section.icon]]"></iron-icon>
        </span>
        <div class="title flex">
          <h2>Create Network</h2>
          <div class="subtitle"></div>
        </div>
      </paper-material>
      <paper-material hidden$="[[hasCloudsWithNetworks]]">
        <p>
          To add a network you need to have an enabled Openstack, GCE, EC2 or
          Alibaba cloud in your account. <br />
          Add a cloud using the
          <a href="/clouds/+add" class="blue-link regular">add cloud form</a>
          or enable your Openstack or GCE clouds available in
          <a href="/dashboard" class="blue-link regular">dashboard</a>.
        </p>
      </paper-material>
      <paper-material hidden$="[[!hasCloudsWithNetworks]]">
        <div class="grid-row">
          <paper-dropdown-menu
            class="dropdown-block l6 xs12 dropdown-with-logos"
            label="Select Cloud"
            horizontal-align="left"
            no-animations=""
          >
            <paper-listbox
              slot="dropdown-content"
              attr-for-selected="value"
              selected="{{selectedCloud::iron-select}}"
              class="dropdown-content"
            >
              <template is="dom-repeat" items="[[clouds]]" as="cloud">
                <paper-item
                  value="[[cloud.id]]"
                  disabled$="[[!_isOnline(cloud.id, cloud.state, model.clouds)]]"
                >
                  <img
                    src="[[_computeProviderLogo(cloud.provider)]]"
                    alt="[[cloud.provider]]"
                    width="24px"
                  />[[cloud.name]]</paper-item
                >
              </template>
            </paper-listbox>
          </paper-dropdown-menu>
        </div>
      </paper-material>
      <template is="dom-if" if="[[selectedCloud]]" restamp="">
        <paper-material>
          <app-form
            id="network_add"
            fields="{{fields}}"
            form="[[form]]"
            url="/api/v1/clouds/[[selectedCloud]]/networks"
            on-response="_handleCreateNetworkResponse"
            on-error="_handleError"
            format-payload=""
          ></app-form>
        </paper-material>
      </template>
    </div>
  `,

  is: 'network-create',

  properties: {
    section: {
      type: Object,
    },
    model: {
      type: Object,
    },
    clouds: {
      type: Array,
    },
    form: {
      type: Object,
      value() {
        return {};
      },
    },
    fields: {
      type: Array,
      value() {
        return [];
      },
    },
    networksFields: {
      type: Array,
      value() {
        return NETWORK_CREATE_FIELDS;
      },
    },
    hasCloudsWithNetworks: {
      type: Boolean,
      value: false,
    },
    selectedCloud: {
      type: String,
      value: false,
    },
  },

  observers: ['_cloudsChanged(model.clouds.*)', '_cloudChanged(selectedCloud)'],

  listeners: {
    'format-payload': 'updatePayload',
  },

  _cloudsChanged(_clouds) {
    const networkClouds =
      this.model &&
      this.model.cloudsArray.filter(
        cloud =>
          ['openstack', 'gce', 'ec2', 'lxd', 'aliyun_ecs', 'vultr'].indexOf(
            cloud.provider
          ) > -1
      );
    this.set('clouds', networkClouds);
    this.set(
      'hasCloudsWithNetworks',
      !!(networkClouds && networkClouds.length > 0)
    );
  },

  _computeProviderLogo(className) {
    const identifier = className.replace('_', '');
    return `assets/providers/provider-${identifier}.png`;
  },

  _isOnline(cloud, _state, _clouds) {
    return (
      this.model.clouds[cloud] && this.model.clouds[cloud].state === 'online'
    );
  },

  _cloudChanged(selectedCloud) {
    // clear to reset
    this.set('machineFields', []);
    let networkFields = [];
    let cloudProvider = '';
    if (this.selectedCloud) {
      cloudProvider = this.model.clouds[selectedCloud].provider;
      networkFields = this.networksFields.find(
        c => c.provider === cloudProvider
      );
    }
    // add cloud fields
    if (networkFields.fields) this.set('fields', networkFields.fields);

    // add locations fields
    let fieldName;
    if (this.fieldIndexByName('region') > -1) fieldName = 'region';
    else if (this.fieldIndexByName('availability_zone') > -1)
      fieldName = 'availability_zone';
    else if (this.fieldIndexByName('location') > -1) fieldName = 'location';

    if (
      cloudProvider === 'ec2' ||
      cloudProvider === 'aliyun_ecs' ||
      cloudProvider === 'vultr'
    )
      this.set(
        `fields.${this.fieldIndexByName(fieldName)}.options`,
        this.model.clouds[selectedCloud].locationsArray.filter(
          loc => loc.location_type !== 'region'
        )
      );
    if (cloudProvider === 'gce') {
      let regions = [];
      if (this.model.clouds[selectedCloud].locationsArray)
        regions = this.model.clouds[selectedCloud].locationsArray
          .filter(loc => loc.location_type === 'region')
          .map(region => ({ name: region.name, id: region.name }));
      this.set(`fields.${this.fieldIndexByName(fieldName)}.options`, regions);
    }
  },

  updatePayload() {
    if (this.fields.length) {
      const payload = {};
      const { provider } = this.model.clouds[this.selectedCloud].provider;
      payload.network = {};
      // create network
      for (let i = 0; i < this.fields.length; i++) {
        if (this.fields[i].inPayloadGroup === 'network')
          payload.network[this.fields[i].name] = this.fields[i].value;
      }
      // create subnet
      if (
        (this.fieldIndexByName('createSubnet') > -1 &&
          this.fields[this.fieldIndexByName('createSubnet')].value === true) ||
        (provider === 'gce' &&
          this.fields[this.fieldIndexByName('mode')].value === 'custom')
      ) {
        payload.subnet = {};
        for (let i = 0; i < this.fields.length; i++) {
          if (this.fields[i].inPayloadGroup === 'subnet')
            payload.subnet[this.fields[i].name] =
              this.fields[i].name !== 'availability_zone'
                ? this.fields[i].value
                : this.model.clouds[this.selectedCloud].locations[
                    this.fields[this.fieldIndexByName('availability_zone')]
                      .value
                  ].name;
        }
        // parse and format allocation pools if they exist
        if (
          this.fieldIndexByName('allocation_pools') > -1 &&
          this.fields[this.fieldIndexByName('allocation_pools')].value
        ) {
          const allocationPools = [];
          const lines = this.fields[
            this.fieldIndexByName('allocation_pools')
          ].value.split('\n');
          lines.forEach(l => {
            if (l && l.indexOf('-') > 0)
              allocationPools.push({
                start: l.replace(',', '').split('-')[0].trim(),
                end: l.replace(',', '').split('-')[1].trim(),
              });
            else allocationPools.push(l);
          });
          if (allocationPools.length) {
            payload.subnet.allocation_pools = allocationPools;
          }
        }

        if (
          this.fieldIndexByName('disableGateway') > -1 &&
          this.fields[this.fieldIndexByName('disableGateway')].value === true
        ) {
          delete payload.subnet.gateway_ip;
        }
      }

      this.set('form', payload);
    }
  },

  fieldIndexByName(name) {
    const field = this.fields.findIndex(f => f.name === name);
    return field;
  },

  _handleCreateNetworkResponse(_e) {
    this.dispatchEvent(
      new CustomEvent('go-to', {
        bubbles: true,
        composed: true,
        detail: {
          url: '/networks',
        },
      })
    );
  },

  _handleError(e) {
    console.log(e);
    this.set('formError', true);
  },

  _goBack() {
    window.history.back();
  },
});
