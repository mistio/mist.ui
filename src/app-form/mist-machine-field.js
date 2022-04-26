import '@polymer/polymer/polymer-legacy.js';
import '@polymer/paper-material/paper-material.js';
import '@polymer/paper-button/paper-button.js';
import '@polymer/paper-checkbox/paper-checkbox.js';
import '@polymer/paper-styles/typography.js';
import '@polymer/paper-dropdown-menu/paper-dropdown-menu.js';
import '@polymer/paper-item/paper-item.js';
import '@polymer/paper-toggle-button/paper-toggle-button.js';
import '@polymer/paper-radio-button/paper-radio-button.js';
import '@polymer/paper-radio-group/paper-radio-group.js';
import '@polymer/iron-icons/iron-icons.js';
import '@polymer/paper-listbox/paper-listbox.js';
import './mist-size-field.js';
import { Polymer } from '@polymer/polymer/lib/legacy/polymer-fn.js';
import { html } from '@polymer/polymer/lib/utils/html-tag.js';
import { MACHINE_CREATE_FIELDS } from '../helpers/machine-create-fields.js';

const DEBUG_FORM = false;
Polymer({
  _template: html`
    <style include="shared-styles forms">
      :host {
        padding: 24px;
        border: 1px solid #eee;
        max-width: 100%;
        background-color: #f2f2f266;
        position: relative;
        display: block;
      }

      :host > * {
        width: 100%;
      }

      paper-item.button-true {
        background-color: #2196f3 !important;
        font-weight: 500 !important;
        color: #fff !important;
        text-transform: uppercase;
      }

      paper-item.iron-selected {
        font-weight: normal;
      }

      paper-listbox {
        background: transparent;
        display: inline-block;
        vertical-align: top;
        max-height: 600px;
        width: 100%;
      }

      paper-listbox.networks {
        display: block;
      }

      paper-input.search {
        padding-left: 16px;
        padding-right: 16px;
      }

      paper-checkbox {
        --paper-checkbox-checked-color: var(--mist-blue) !important;
        --paper-checkbox-checked-ink-color: var(--mist-blue) !important;
        padding: 8px;
        display: block;
      }

      .fullwidth {
        width: 100%;
      }

      .title {
        text-transform: capitalize;
        font-weight: bold;
      }

      *[secondary] {
        opacity: 0.54;
      }

      .selected {
        margin-top: 24px;
      }

      @media (max-width: 991px) {
        paper-listbox {
          padding: 38px 16px 16px 16px;
        }
      }

      paper-radio-group {
        margin-top: 16px;
        margin-left: -8px;
      }
    </style>
    <div class="title">[[field.label]] machine</div>
    <paper-radio-group attr-for-selected="name" selected="{{radioValue}}">
      <paper-radio-button name="new">Create new</paper-radio-button>
      <paper-radio-button name="existing">Use existing</paper-radio-button>
    </paper-radio-group>
    <paper-dropdown-menu
      label="[[field.label]] cloud"
      horizontal-align="left"
      disabled="[[field.disabled]]"
      required="[[field.required]]"
      no-animations=""
    >
      <paper-listbox
        slot="dropdown-content"
        attr-for-selected="value"
        selected="{{field.cloud}}"
        class="dropdown-content"
      >
        <template is="dom-if" if="[[_noOptions(clouds)]]" restamp="">
          <paper-item disabled="">No clouds found</paper-item>
        </template>
        <template
          id="cloudsDomRepeat"
          is="dom-repeat"
          items="[[clouds]]"
          as="option"
        >
          <paper-item value="[[option.id]]" disabled$="[[option.disabled]]">
            <span class="flex">[[_showOption(option)]]</span>
          </paper-item>
        </template>
      </paper-listbox>
    </paper-dropdown-menu>
    <!-- if useExistingMachine -->
    <div hidden$="[[!useExistingMachine]]">
      <span class="selected" hidden$="[[!multi]]">
        <span hidden$="[[!field.machinesList.length]]">Selected:</span>
        <strong>[[_computeMachinesNames(field.machinesList,machines)]]</strong>
      </span>
    </div>
    <div hidden$="[[!field.cloud.length]]">
      <paper-dropdown-menu
        label="[[field.label]] machine"
        horizontal-align="left"
        disabled="[[field.disabled]]"
        required="[[field.required]]"
        hidden$="[[!useExistingMachine]]"
        style="width:100%"
        no-animations=""
      >
        <div slot="dropdown-content" class="dropdown-content">
          <paper-input
            class="search"
            label="Search machines"
            value="{{machineSearchKeywords}}"
            hidden$="[[_noOptions(machines)]]"
          ></paper-input>
          <paper-listbox
            attr-for-selected="value"
            selected="{{field.machine}}"
            selected-items="{{field.machinesList}}"
            multi="[[multi]]"
          >
            <template is="dom-if" if="[[_noOptions(machines)]]" restamp="">
              <paper-item disabled="">No machines found</paper-item>
            </template>
            <template
              id="machinesDomRepeat"
              is="dom-repeat"
              items="[[_filter(machines, machineSearchKeywords)]]"
              as="option"
            >
              <paper-item
                value="[[option.external_id]]"
                disabled$="[[option.disabled]]"
              >
                <span class="flex">[[_showOption(option)]]</span>
              </paper-item>
            </template>
          </paper-listbox>
        </div>
      </paper-dropdown-menu>
    </div>
    <!-- if !useExistingMachine -->
    <div hidden$="[[useExistingMachine]]">
      <div hidden$="[[!field.cloud.length]]">
        <paper-dropdown-menu
          label="[[field.label]] image"
          horizontal-align="left"
          disabled="[[field.disabled]]"
          class="fullwidth"
          no-animations=""
        >
          <div slot="dropdown-content" class="dropdown-content">
            <paper-input
              class="search"
              label="Search images"
              value="{{imageSearchKeywords}}"
              hidden$="[[_noOptions(images)]]"
            ></paper-input>
            <paper-listbox
              attr-for-selected="value"
              selected="{{field.image}}"
              style="max-height: 300px; overflow: scroll"
            >
              <template is="dom-if" if="[[_noOptions(images)]]" restamp="">
                <paper-item disabled="">No images found</paper-item>
              </template>
              <template
                is="dom-repeat"
                items="[[_filter(images, imageSearchKeywords)]]"
                as="option"
              >
                <paper-item
                  value="[[option.id]]"
                  disabled$="[[option.disabled]]"
                >
                  <span class="flex">[[_showOption(option)]]</span>
                </paper-item>
              </template>
            </paper-listbox>
          </div>
        </paper-dropdown-menu>
        <mist-size-field
          id$="app-form-[[id]]-[[field.name]]-size"
          field="{{fieldSize}}"
          hidden$="[[hideSize]]"
        ></mist-size-field>
        <paper-dropdown-menu
          label="[[field.label]] key"
          horizontal-align="left"
          disabled="[[field.disabled]]"
          required="[[field.required]]"
          no-animations=""
        >
          <div slot="dropdown-content" class="dropdown-content">
            <paper-input
              class="search"
              label="Search keys"
              value="{{keySearchKeywords}}"
              hidden$="[[_noOptions(keys)]]"
            ></paper-input>
            <paper-listbox attr-for-selected="value" selected="{{field.key}}">
              <template is="dom-if" if="[[_noOptions(keys)]]" restamp="">
                <paper-item disabled="">No keys found</paper-item>
              </template>
              <template
                id="keysDomRepeat"
                is="dom-repeat"
                items="[[_filter(keys, keySearchKeywords)]]"
                as="option"
              >
                <paper-item
                  value="[[option.id]]"
                  disabled$="[[option.disabled]]"
                >
                  <span class="flex">[[_showOption(option)]]</span>
                </paper-item>
              </template>
            </paper-listbox>
          </div>
        </paper-dropdown-menu>
        <paper-dropdown-menu
          label="[[field.label]] location"
          horizontal-align="left"
          disabled="[[field.disabled]]"
          required="[[field.required]]"
          hidden$="[[locationNotRequired]]"
          no-animations=""
        >
          <paper-listbox
            slot="dropdown-content"
            attr-for-selected="value"
            selected="{{field.location}}"
            class="dropdown-content"
          >
            <template is="dom-if" if="[[_noOptions(locations)]]" restamp="">
              <paper-item disabled="">No locations found</paper-item>
            </template>
            <template
              id="locationsDomRepeat"
              is="dom-repeat"
              items="[[locations]]"
              as="option"
            >
              <paper-item value="[[option.id]]" disabled$="[[option.disabled]]">
                <span class="flex">[[_showOption(option)]]</span>
              </paper-item>
            </template>
          </paper-listbox>
        </paper-dropdown-menu>
        <paper-listbox hidden$="[[hideNetworks]]" class="networks">
          <div>[[field.label]] network</div>
          <template is="dom-if" if="[[_noOptions(networks)]]" restamp="">
            <p secondary="">No networks found</p>
          </template>
          <template
            id="networksDomRepeat"
            is="dom-repeat"
            items="[[networks]]"
            as="option"
          >
            <paper-checkbox
              name="network"
              on-change="_updateCheckboxesField"
              id$="[[option.id]]"
            >
              <template is="dom-if" if="[[option.img]]">
                <img
                  class="item-img"
                  src="[[option.img]]"
                  width="24px"
                  alt="[[option.name]]"
                />
              </template>
              <span
                class$="item-desc noimg-[[!option.img]]"
                data-prefix$="[[option.prefix]]"
                data-suffix$="[[option.suffix]]"
                >[[_showOption(option)]]</span
              >
            </paper-checkbox>
          </template>
        </paper-listbox>
        <paper-toggle-button
          hidden$="[[hideFloatingIp]]"
          checked="{{associateFloatingIp}}"
        >
          Associate Floating Ip
        </paper-toggle-button>
        <div hidden$="[[!multi]]">
          <paper-input
            value="{{field.quantity}}"
            label="[[field.label]]s quantity"
            type="number"
          ></paper-input>
        </div>
      </div>
    </div>
  `,

  is: 'mist-machine-field',

  properties: {
    field: {
      type: Object,
      notify: true,
    },
    clouds: {
      type: Array,
      value() {
        return [];
      },
    },
    cloud: {
      type: Object,
      value() {
        return {};
      },
    },
    machines: {
      type: Array,
      value() {
        return [];
      },
    },
    images: {
      type: Array,
      value() {
        return [];
      },
    },
    sizes: {
      type: Array,
      value() {
        return [];
      },
    },
    locations: {
      type: Array,
      value() {
        return [];
      },
    },
    keys: {
      type: Array,
      value() {
        return [];
      },
    },
    networks: {
      type: Array,
      value() {
        return [];
      },
    },
    hideFloatingIp: {
      type: Boolean,
      value: true,
    },
    multi: {
      type: Boolean,
      value: false,
    },
    radioValue: {
      type: String,
      value: 'new',
    },
    useExistingMachine: {
      type: Boolean,
      value: true,
      computed: 'computeUseExistingMachine(radioValue)',
    },
    hideSize: {
      type: Boolean,
      value: false,
    },
    sizeNotRequired: {
      type: Boolean,
      value: false,
    },
    locationNotRequired: {
      type: Boolean,
      value: false,
    },
    hideNetworks: {
      type: Boolean,
      value: false,
    },
    imageSearchKeywords: {
      type: String,
      value: '',
    },
    machineSearchKeywords: {
      type: String,
      value: '',
    },
    keySearchKeywords: {
      type: String,
      value: '',
    },
    associateFloatingIp: {
      type: Boolean,
      value: false,
    },
    fieldSize: {
      type: Object,
      value() {
        return {
          name: 'fieldSize',
          label: 'size',
          type: 'mist_size',
          options: [],
          custom: false,
          value: '',
          customValue: {},
          customSizeFields: [],
        };
      },
    },
  },

  listeners: {},

  observers: [
    '_fieldChanged(field)',
    '_fieldCloudsChanged(field, field.clouds, field.clouds.*)',
    '_fieldKeysChanged(field, field.keys, field.keys.*)',
    '_selectedCloudChanged(field.cloud)',
    '_fieldSizeChanged(fieldSize.*)',
    '_updateFieldValue(associateFloatingIp,useExistingMachine, field.cloud, field.machine, field.machinesList, field.image, field.size, field.location, field.networks, field.key, field.quantity)',
  ],

  ready() {
    this.initializeValues();
  },

  initializeValues(_cr) {},

  computeUseExistingMachine(_radioValue) {
    return this.radioValue === 'existing';
  },

  _fieldChanged(_field) {
    this.set('fieldSize.name', `${this.field.name}Size`);
    this.set('fieldSize.label', `${this.field.label} size`);
    this.set('multi', this.field.multi || false);
  },

  _fieldCloudsChanged(_clouds) {
    this.set('clouds', this._objectToArray(this.field.clouds));
    this.$.cloudsDomRepeat.render();
  },

  _fieldSizeChanged(_fieldSizeValue) {
    this.set(
      'field.size',
      this.fieldSize.value === 'custom'
        ? this.fieldSize.customValue
        : this.fieldSize.value
    );
  },

  _fieldKeysChanged(_keys) {
    console.log('field Keys Changed');
    this.set('keys', this._objectToArray(this.field.keys));
    this.async(() => {
      this.$.keysDomRepeat.render();
    }, 200);
  },

  _selectedCloudChanged(_cloud) {
    this._fieldKeysChanged(this.field.keys);
    if (this.field.cloud) {
      // clear field.value
      this._clearField();

      const selectedCloud = this.field.clouds[this.field.cloud];
      this.set('cloud', selectedCloud);
      this.set('machines', this._objectToArray(selectedCloud.machines));
      this.set('images', this._objectToArray(selectedCloud.images));
      this.set('sizes', this._objectToArray(selectedCloud.sizes));
      this.set('locations', this._objectToArray(selectedCloud.locations));
      if (!this.cloud.locationsArray || !this.cloud.locationsArray.length) {
        this.set('locationNotRequired', true);
      }
      this.set('networks', this._objectToArray(selectedCloud.networks));
      if (!this.cloud.networks || !Object.keys(this.cloud.networks).length) {
        this.set('hideNetworks', true);
      }
      this.$.machinesDomRepeat.render();
      this.$.locationsDomRepeat.render();
      this.$.networksDomRepeat.render();

      this.set(
        'hideFloatingIp',
        this.cloud.provider !== 'openstack' && this.networks.length
      );
      // update field consumed by mist-size-field
      this.set(
        'fieldSize.options',
        selectedCloud.sizesArray ? selectedCloud.sizesArray : []
      );
      if (
        ['onapp', 'vsphere', 'libvirt'].indexOf(selectedCloud.provider) > -1
      ) {
        const { provider } = selectedCloud;
        const { fields } = MACHINE_CREATE_FIELDS.find(
          p => p.provider === provider
        );
        this.set('fieldSize.custom', true);
        this.set('fieldSize.value', 'custom');
        this.set(
          'fieldSize.customSizeFields',
          fields.find(f => f.type === 'mist_size').customSizeFields
        );
      } else {
        this.set('fieldSize.custom', false);
      }
      // do not require size if custom are not allowed and there are no size options
      if (
        !this.fieldSize.custom &&
        (!this.fieldSize.options || !this.fieldSize.options.length)
      ) {
        this.set('sizeNotRequired', true);
        this.set('hideSize', true);
      }
    }
  },

  _clearField() {
    const fieldValues = [
      'key',
      'image',
      'size',
      'location',
      'networks',
      'quantity',
    ];
    for (let i = 0; i < fieldValues.length; i++) {
      if (this.field[fieldValues[i]]) {
        // this.set('field.'+[fieldValues[i]], null);
        const typeOfVal = typeof this.field[fieldValues[i]];
        if (typeOfVal === 'string') {
          this.set(`field.${[fieldValues[i]]}`, '');
        } else if (typeOfVal === 'array') {
          this.set(`field.${[fieldValues[i]]}`, []);
        } else if (typeOfVal === 'object') {
          this.set(`field.${[fieldValues[i]]}`, null);
        } else if (typeOfVal === 'number') {
          this.set(`field.${[fieldValues[i]]}`, 1);
        }
      }
      this.set('field.value', {});
    }
    this.set('machines', []);
    this.set('images', []);
    this.set('sizes', []);
    this.set('locations', []);
    this.set('networks', []);

    this.set('sizeNotRequired', false);
    this.set('hideNetworks', false);
    this.set('hideSize', false);
  },

  _updateFieldValue(
    _associateFloatingIp,
    _useExistingMachine,
    _cloud,
    _machine,
    _machineList,
    _image,
    _size,
    _location,
    _networks,
    _key,
    _quantity
  ) {
    // console.log(useExistingMachine, cloud, machine, image, size, location, networks, key);
    if (this.useExistingMachine) {
      if (this.multi) {
        this.set(
          'field.value',
          this.field.machinesList.map(f => ({
            cloud_id: this.field.cloud,
            external_id: f.value,
          }))
        );
      } else {
        this.set('field.value', {
          cloud_id: this.field.cloud,
          external_id: this.field.machine,
        });
      }
    } else if (this.multi) {
      this.set('field.value', [
        {
          cloud_id: this.field.cloud,
          key_id: this.field.key,
          image_id: this.field.image,
          size_id: this.field.size,
          location_id: this.field.location,
          networks: this.field.networks,
          quantity:
            parseInt(this.field.quantity, 10) &&
            parseInt(this.field.quantity, 10) > 0
              ? parseInt(this.field.quantity, 10)
              : 1,
        },
      ]);
      if (this.cloud.provider === 'openstack') {
        this.set('field.value.associate_floating_ip', this.associateFloatingIp);
      }
    } else {
      this.set('field.value', {
        cloud_id: this.field.cloud,
        key_id: this.field.key,
        image_id: this.field.image,
        size_id: this.field.size,
        location_id: this.field.location,
        networks: this.field.networks,
      });
      if (this.cloud.provider === 'openstack') {
        this.set('field.value.associate_floating_ip', this.associateFloatingIp);
      }
    }
    this.set('field.valid', this.validateValue());
    this.dispatchEvent(new CustomEvent('field-value-changed'));
  },

  validateValue() {
    if (this.useExistingMachine) {
      if (this.multi) {
        if (!this.field.value.length) {
          if (DEBUG_FORM) {
            console.log('useExistingMachine multi machine');
          }
          return false;
        }
      } else {
        if (!this.field.value.cloud_id) {
          if (DEBUG_FORM) {
            console.log('useExistingMachine cloud');
          }
          return false;
        }
        if (!this.field.value.external_id) {
          if (DEBUG_FORM) {
            console.log('useExistingMachine machine');
          }
          return false;
        }
      }
    } else if (!this.useExistingMachine) {
      if (this.multi) {
        if (!this.field.value[0].cloud_id) {
          if (DEBUG_FORM) {
            console.log('cloud multi');
          }
          return false;
        }
        if (!this.field.value[0].image_id) {
          if (DEBUG_FORM) {
            console.log('image multi');
          }
          return false;
        }
        if (!this.field.value[0].key_id) {
          if (DEBUG_FORM) {
            console.log('key multi');
          }
          return false;
        }
        if (!this.sizeNotRequired && !this.field.value[0].size_id) {
          if (DEBUG_FORM) {
            console.log('size multi');
          }
          return false;
        }
        if (!this.locationNotRequired && !this.field.value[0].location_id) {
          if (DEBUG_FORM) {
            console.log('location multi');
          }
          return false;
        }
        if (this.field.value[0].quantity < 1) {
          if (DEBUG_FORM) {
            console.log('quantity multi');
          }
          return false;
        }
      } else {
        if (!this.field.value.cloud_id) {
          if (DEBUG_FORM) {
            console.log('cloud');
          }
          return false;
        }
        if (!this.field.value.image_id) {
          if (DEBUG_FORM) {
            console.log('machine');
          }
          return false;
        }
        if (!this.field.value.key_id) {
          if (DEBUG_FORM) {
            console.log('key');
          }
          return false;
        }
        if (!this.sizeNotRequired && !this.field.value.size_id) {
          if (DEBUG_FORM) {
            console.log('size');
          }
          return false;
        }
        if (!this.locationNotRequired && !this.field.value.location_id) {
          if (DEBUG_FORM) {
            console.log('location');
          }
          return false;
        }
      }
    }
    return true;
  },

  _noOptions(options) {
    return !options || options.length === 0;
  },

  _showOption(option) {
    if (option.name) {
      return option.name;
    }
    if (option.title) {
      return option.title;
    }
    if (option.id) {
      return option.id;
    }
    return '';
  },

  _filter(options, search) {
    return options.filter(
      op => op.name.toLowerCase().indexOf(search.toLowerCase()) > -1
    );
  },

  _objectToArray(obj) {
    const arr = [];
    if (obj) {
      Object.keys(obj).forEach(p => {
        arr.push(obj[p]);
      });
    }
    return arr;
  },

  _updateCheckboxesField(e) {
    const fieldNetworks = this.get('field.networks') || [];
    if (e.target.checked && fieldNetworks.indexOf(e.model.option.id) === -1) {
      fieldNetworks.push(e.model.option.id);
    } else if (
      !e.target.checked &&
      fieldNetworks.indexOf(e.model.option.id) > -1
    ) {
      fieldNetworks.splice(fieldNetworks.indexOf(e.model.option.id), 1);
    }
    this.set('field.networks', fieldNetworks);
  },

  _computeMachinesNames(machinesList, machines) {
    return !machinesList
      ? 'select'
      : machinesList.map(m => this._getName(m.value, machines));
  },

  _getName(m, _machines) {
    const machine =
      this.machines && this.machines.find(item => item.external_id === m);
    return machine ? machine.name : 'not found';
  },
});
