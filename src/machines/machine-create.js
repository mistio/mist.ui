import '@polymer/polymer/polymer-legacy.js';
import '@polymer/paper-material/paper-material.js';
import '@polymer/paper-dropdown-menu/paper-dropdown-menu.js';
import '@polymer/paper-button/paper-button.js';
import '@polymer/paper-toggle-button/paper-toggle-button.js';
import '@polymer/paper-input/paper-textarea.js';
import '@polymer/paper-listbox/paper-listbox.js';
import '../app-form/app-form.js';
import moment from 'moment/src/moment';
import { Polymer } from '@polymer/polymer/lib/legacy/polymer-fn.js';
import { html } from '@polymer/polymer/lib/utils/html-tag.js';
import { CSRFToken } from '../helpers/utils.js';
import { MACHINE_CREATE_FIELDS } from '../helpers/machine-create-fields.js';
import { VOLUME_CREATE_FIELDS } from '../helpers/volume-create-fields.js';

const SCHEDULEACTIONS = {
  reboot: {
    name: 'reboot',
    icon: 'av:replay',
    confirm: true,
    multi: true,
  },
  start: {
    name: 'start',
    icon: 'av:replay',
    confirm: true,
    multi: true,
  },
  stop: {
    name: 'stop',
    icon: 'av:stop',
    confirm: true,
    multi: true,
  },
  suspend: {
    name: 'suspend',
    icon: 'av:stop',
    confirm: true,
    multi: true,
  },
  resume: {
    name: 'resume',
    icon: 'av:replay',
    confirm: true,
    multi: true,
  },
  undefine: {
    name: 'undefine',
    icon: 'image:panorama-fish-eye',
    confirm: true,
    multi: true,
  },
  destroy: {
    name: 'destroy',
    icon: 'delete',
    confirm: true,
    multi: true,
  },
  'run-script': {
    name: 'run script',
    icon: 'image:movie-creation',
    confirm: true,
    multi: false,
  },
};

Polymer({
  _template: html`
    <style include="shared-styles forms single-page">
      :host {
        min-height: 1200px;
      }

      paper-material {
        display: block;
        padding: 24px;
        transition: all 0.2 ease-in;
      }

      #content {
        max-width: 900px;
      }

      paper-card,
      paper-checkbox {
        display: block;
      }

      paper-card {
        margin-bottom: 40px;
      }

      paper-toggle-button,
      paper-checkbox {
        margin-top: 20px;
      }

      .dropdown-with-logos paper-item img {
        margin-right: 16px;
      }

      .dropdown-with-logos paper-item {
        text-transform: capitalize;
        opacity: 0.87;
      }

      paper-dropdown-menu ::slotted(.dropdown-content) {
        max-height: 400px !important;
      }

      :host app-form::slotted(paper-radio-group) {
        margin-top: 24px;
      }

      app-form::slotted(paper-radio-group) {
        margin-top: 36px !important;
        margin-bottom: 0;
      }

      app-form::slotted(.helptext-radio) {
        margin-top: 36px !important;
        margin-bottom: 0;
      }

      paper-dialog#addKvmImage {
        width: 260px;
      }

      paper-dialog#addKvmImage > paper-input {
        margin-top: 0;
        margin-bottom: 20px;
      }

      paper-dialog#addKvmImage .btn-group {
        display: flex;
        justify-content: flex-end;
      }

      .machine-page-head {
        @apply --machine-page-head-mixin;
      }
    </style>
    <app-location route="{{route}}"></app-location>
    <div id="content">
      <paper-material class="single-head layout horizontal machine-page-head">
        <span class="icon">
          <iron-icon icon="hardware:computer"></iron-icon>
        </span>
        <div class="title flex">
          <h2>Create machine</h2>
          <div class="subtitle">Provision compute resources across clouds</div>
        </div>
      </paper-material>
      <paper-material hidden$="[[_hasClouds(clouds)]]">
        <p>
          You don't have any clouds.
          <span hidden$="[[!checkPerm('cloud', 'add')]]">
            <a href="/clouds/+add" class="blue-link regular">Add a cloud</a> to
            get started creating machines.
          </span>
        </p>
      </paper-material>
      <paper-material hidden$="[[!_hasClouds(clouds)]]">
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
                    width="24px"
                    alt="[[cloud.name]]"
                  />[[cloud.name]]</paper-item
                >
              </template>
            </paper-listbox>
          </paper-dropdown-menu>
        </div>
      </paper-material>
      <paper-material
        class$="selected-[[!selectedCloud]]"
        hidden$="[[!selectedCloud]]"
      >
        <div hidden$="[[!selectedCloud]]">
          <h3 class="smallcaps">Machine Setup</h3>
          <app-form
            id="createForm"
            format-payload=""
            fields="{{machineFields}}"
            method="POST"
            url="/api/v1/clouds/[[selectedCloud]]/machines"
            on-response="_machineCreateResponse"
            on-error="_machineCreateError"
            btncontent="Launch"
          ></app-form>
        </div>
      </paper-material>
    </div>
    <paper-dialog id="addKvmImage" with-backdrop="">
      <h2>[[_computeAddImageTitle(selectedCloud)]]</h2>
      <paper-input
        id="kvmImageInput"
        label="[[_computeAddImageLabel(selectedCloud)]]"
        value="{{newImage}}"
      ></paper-input>
      <div class="btn-group">
        <paper-button dialog-dismiss="">Cancel</paper-button>
        <paper-button class="blue" on-tap="saveNewImage">Save</paper-button>
      </div>
    </paper-dialog>
    <iron-ajax
      id="getSecurityGroups"
      contenttype="application/json"
      handle-as="json"
      method="GET"
      on-request="_handleGetSecurityGroupsRequest"
      on-response="_handleGetSecurityGroupsResponse"
      on-error="_handleGetSecurityGroupsError"
    ></iron-ajax>
    <iron-ajax
      id="getResourceGroups"
      contenttype="application/json"
      handle-as="json"
      method="GET"
      on-request="_handleGetResourceGroupsRequest"
      on-response="_handleGetResourceGroupsResponse"
      on-error="_handleGetResourceGroupsError"
    ></iron-ajax>
    <iron-ajax
      id="getStorageAccounts"
      contenttype="application/json"
      handle-as="json"
      method="GET"
      on-request="_handleGetStorageAccountsRequest"
      on-response="_handleGetStorageAccountsResponse"
      on-error="_handleGetResourceGroupsError"
    ></iron-ajax>
    <iron-ajax
      id="getStorageClasses"
      contenttype="application/json"
      handle-as="json"
      method="GET"
      on-request="_handleGetStorageClassesRequest"
      on-response="_handleGetStorageClassesResponse"
      on-error="_handleGetStorageClassesError"
    ></iron-ajax>
    <iron-ajax
      id="getFolders"
      contenttype="application/json"
      handle-as="json"
      method="GET"
      on-request="_handleGetFoldersRequest"
      on-response="_handleGetFoldersResponse"
      on-error="_handleGetResourceGroupsError"
    ></iron-ajax>
    <iron-ajax
      id="getDatastores"
      contenttype="application/json"
      handle-as="json"
      method="GET"
      on-request="_handleGetDatastoresRequest"
      on-response="_handleGetDatastoresResponse"
      on-error="_handleGetResourceGroupsError"
    ></iron-ajax>
    <iron-ajax
      id="getLXDStoragePools"
      contenttype="application/json"
      handle-as="json"
      method="GET"
      on-request="_handleGetLXDStoragePoolsRequest"
      on-response="_handleGetLXDStoragePoolsResponse"
      on-error="_handleGetLXDStoragePoolsError"
    ></iron-ajax>
    <iron-ajax
      id="getVirtualNetworkFunctions"
      contenttype="application/json"
      handle-as="json"
      method="GET"
      on-request="_handleGetVirtualNetworkFunctionsRequest"
      on-response="_handleGetVirtualNetworkFunctionsResponse"
      on-error="_handleGetVirtualNetworkFunctionsError"
    ></iron-ajax>
  `,

  is: 'machine-create',
  behaviors: [window.rbac],

  properties: {
    model: {
      type: Object,
    },
    cloud: {
      type: Object,
    },
    selectedCloud: {
      type: String,
      value: false,
    },
    machineFields: {
      type: Array,
      value() {
        return [];
      },
    },
    machinesFields: {
      type: Array,
      value() {
        return MACHINE_CREATE_FIELDS;
      },
    },
    volumeFields: {
      type: Array,
      value() {
        return VOLUME_CREATE_FIELDS;
      },
    },
    clouds: {
      type: Array,
      value() {
        return [];
      },
      computed: '_computeClouds(model, model.clouds, model.teams.*)',
    },
    newImage: {
      type: String,
    },
    scheduleActions: {
      type: Array,
      computed: '_computeActions(model.machines)',
    },
    monitoring: {
      type: Boolean,
    },
    docs: {
      type: String,
      value: '',
    },
    storageAccountsFieldIndex: {
      type: Number,
    },
    resourceGroupsFieldIndex: {
      type: Number,
    },
    storageClassesField: {
      type: Object,
    },
    foldersField: {
      type: Object,
    },
    lxdStoragePoolsField: {
      type: Object,
    },
    securityGroupsFieldIndex: {
      type: Number,
    },
    virtualNetworkFunctionFieldIndex: {
      type: Number,
    },
    constraints: {
      type: Object,
    },
  },

  observers: [
    '_applyConstraints(machinesFields, constraints)',
    '_teamsChanged(model.teams.*)',
    '_cloudChanged(selectedCloud)',
    '_machineFieldsChanged(machineFields.*)',
    '_prefillOptions(route.*)',
    '_locationChanged(machineFields.1.value)',
    '_cloudsChanged(clouds)',
    '_cloudLocationsUpdated(cloud.locationsArray)',
    '_cloudImagesUpdated(cloud.imagesArray, model.imagesArray.length)',
  ],

  listeners: {
    keyup: 'hotkeys',
    'add-input': 'addInput',
    'format-payload': 'formatPayload',
    'fields-changed': 'fieldsChanged',
    'subfield-enabled': '_subfieldEnabled',
    'dropdown-pressed': '_checkSizeLocationOptions',
  },

  attached() {
    this.checkPermissions();
  },

  _teamsChanged() {
    console.log('_teamsChanged CALL checkPermissions');
    this.checkPermissions();
  },

  _cloudImagesUpdated(images) {
    if (!this.cloud || !this.cloud.images || !images) return;
    const locationIndex = this.machineFields.findIndex(
      field => field.name === 'location'
    );
    const lid = this.get(`machineFields.${locationIndex}.value`);
    const imageIndex = this.machineFields.findIndex(
      field => field.name === 'image'
    );
    if (lid) {
      this.set(
        `machineFields.${imageIndex}.options`,
        this._getLocationImages(lid)
      );
    }
  },

  _cloudLocationsUpdated(locations) {
    if (!this.cloud || !this.cloud.locations || !locations) return;
    const locArray = Object.values(this.cloud.locations).filter(
      loc => loc.location_type !== 'region'
    );

    if (locArray.length === 1) {
      // If there's a single location preselect it
      const lid = locArray[0].id;
      const locationIndex = this.machineFields.findIndex(
        field => field.name === 'location'
      );
      this.set(`machineFields.${locationIndex}.options`, locArray);
      this.set(`machineFields.${locationIndex}.value`, lid);
      const imageIndex = this.machineFields.findIndex(
        field => field.name === 'image'
      );
      const imagesArray = this._getLocationImages(lid);
      if (imagesArray) {
        this.set(`machineFields.${imageIndex}.options`, imagesArray);
      }
    }
  },

  checkPermissions() {
    const perm = this.checkPerm('machine', 'create');
    if (perm === true) {
      // FIXME why is it empty?
    } else if (perm === false) {
      // FIXME why is it empty?
    } else if (typeof perm === 'object') {
      this.set('constraints', perm.constraints);
    }
    // console.log('checkPermissions', perm);
  },

  _applyConstraints(_machinesFields, _constraints) {
    if (!this.constraints || !this.machinesFields) {
      return;
    }
    if (this.constraints.expiration) {
      this._applyExpirationConstraints();
    }

    if (this.constraints.size) {
      this._applySizeConstraints();
    }
  },
  _applySizeConstraints() {
    const customFields = [
      'cpu',
      'ram',
      'disk',
      'disk_primary',
      'size_disk_primary',
      'swap',
      'disk_swap',
      'size_disk_swap',
    ];
    const constraint = this.constraints.size;
    // If the machine fields are ever simplified, these next 4 assignments won't be needed
    if (constraint.disk) {
      constraint.size_disk_primary = constraint.disk;
      constraint.disk_primary = constraint.disk;
    }
    if (constraint.swap) {
      constraint.size_disk_swap = constraint.swap;
      constraint.disk_swap = constraint.swap;
    }
    this.machinesFields.forEach((machineField, index) => {
      const sizeIndex = this._fieldIndexByName('size', machineField.fields);
      const path = `machinesFields.${index}.fields.${sizeIndex}`;
      const { customSizeFields } = machineField.fields[sizeIndex];

      customFields.forEach(field => {
        if (constraint[field] && customSizeFields) {
          const fieldIndex = this._fieldIndexByName(field, customSizeFields);
          const customSizeFieldPath = `${path}.customSizeFields.${fieldIndex}`;

          if (constraint[field].min) {
            this.set(`${customSizeFieldPath}.min`, constraint[field].min);
            this.set(`${customSizeFieldPath}.value`, constraint[field].min);
          }

          if (constraint[field].max) {
            this.set(`${customSizeFieldPath}.max`, constraint[field].max);
          }

          if (constraint[field].show !== undefined) {
            const isHidden = !constraint[field].show;
            this.set(`${customSizeFieldPath}.hidden`, isHidden);
            if (isHidden) {
              this.set(`${customSizeFieldPath}.value`, undefined);
            }
          }
        }
      });
    });
  },

  _applyExpirationConstraints() {
    for (let i = 0; i < this.machinesFields.length; i++) {
      const ind = this._fieldIndexByName(
        'expiration',
        this.machinesFields[i].fields
      );
      const path = `machinesFields.${i}.fields.${ind}.subfields`;

      if (ind > -1) {
        if (this.constraints.expiration)
          this.set(`machinesFields.${i}.fields.${ind}.enabled`, true);
        if (this.constraints.expiration.max) {
          this.set(`${path}.1.max`, this.constraints.expiration.max);

          // force expiration and disallow to close option
          this.set(
            `machinesFields.${i}.fields.${ind}.defaultToggleValue`,
            true
          );
          this.set(`machinesFields.${i}.fields.${ind}.toggleDisabled`, true);
        }
        if (this.constraints.expiration.default) {
          this.set(
            `${path}.1.defaultValue`,
            this.constraints.expiration.default
          );
        }
        if (this.constraints.expiration.notify) {
          if (this.constraints.expiration.notify.default) {
            // notify default
            this.set(
              `${path}.2.defaultValue`,
              this.constraints.expiration.notify.default
            );
            // notify require
            this.set(
              `${path}.2.defaultCheck`,
              this.constraints.expiration.notify.require
            );
            if (this.constraints.expiration.notify.require)
              this.set(
                `${path}.2.disabledCheck`,
                this.constraints.expiration.notify.require
              );
            // notify max
            if (this.constraints.expiration.default) {
              this.set(`${path}.2.max`, this.constraints.expiration.default);
            }
          }
          if (
            this.constraints.expiration.notify.require !== null &&
            this.constraints.expiration.notify.require !== undefined
          ) {
            // notify require (checkbox value)
            this.set(
              `${path}.2.disabled`,
              !this.constraints.expiration.notify.require
            );
          }
        }
        if (this.constraints.expiration.actions) {
          if (this.constraints.expiration.actions.available) {
            // available actions
            const actions = this.constraints.expiration.actions.available.map(
              x => ({ val: x, title: x.toUpperCase() })
            );
            this.set(`${path}.0.options`, actions);
          }
          if (this.constraints.expiration.actions.default) {
            // default action
            this.set(
              `${path}.0.value`,
              this.constraints.expiration.actions.default
            );
            this.set(
              `${path}.0.defaultValue`,
              this.constraints.expiration.actions.default
            );
          }
        }
      }
    }
    // update selected cloud's provider-fields after constraints applied
    if (this.selectedCloud) {
      this._cloudChanged(this.selectedCloud);
    }
  },

  _prefillOptions(_location) {
    let image;
    let cloud;
    if (
      this.shadowRoot.querySelector('app-location') &&
      this.shadowRoot.querySelector('app-location').queryParams
    ) {
      image = this.shadowRoot.querySelector('app-location').queryParams.image;
      cloud = this.shadowRoot.querySelector('app-location').queryParams.cloud;
    }
    if (image && cloud)
      this._setOptions({
        cloud,
        image,
      });
  },

  _computeActions(_machines) {
    const ret = ['start', 'stop', 'reboot', 'destroy', 'run-script']; // 'suspend', 'resume',

    const actions = [];
    for (let i = 0; i < ret.length; i++) {
      const act = SCHEDULEACTIONS[ret[i]];
      const transformRet = {
        title: act.name.toUpperCase(),
        val: act.name,
        icon: act.icon,
      };
      actions.push(transformRet);
    }
    return actions;
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

  _setOptions(params) {
    if (params) {
      Object.keys(params).forEach(p => {
        if (p === 'cloud') this.set('selectedCloud', params[p]);
        else {
          const ind = this._fieldIndexByName(p);
          if (ind) this.set(`machineFields.${ind}.value`, params[p]);
        }
      });
    }
  },

  _computeFieldType(field, value, _show) {
    if (!(field.showIf && !field.show)) {
      return field.type === value;
    }
    return false;
  },

  _cloudChanged(selectedCloud) {
    this.checkPermissions();
    // clear saved new image of lxd or kvm
    this.set('newImage', '');
    if (selectedCloud && this.model) {
      this.set('cloud', this.model.clouds[selectedCloud]);
      this.linkPaths('cloud', `model.clouds.${selectedCloud}`);
      localStorage.setItem('createMachine#cloud', selectedCloud);
    }
    if (!this.docs && this.machinesFields) {
      for (let i = 0; i < this.machinesFields.length; i++) {
        if (this.machinesFields[i].fields) {
          for (let j = 0; j < this.machinesFields[i].fields.length; j++) {
            this.machinesFields[i].fields[j].helpHref = '';
          }
        }
      }
    }
    let allMachinesFields;
    if (this.selectedCloud) {
      const provider =
        this.model.clouds[selectedCloud] &&
        this.model.clouds[selectedCloud].provider;
      allMachinesFields = this.machinesFields.find(
        c => c.provider === provider
      );
    }

    // add cloud fields
    if (allMachinesFields && allMachinesFields.fields) {
      // allow hostname iff at least a cloud has dns access enabled
      const fields = JSON.parse(JSON.stringify(allMachinesFields.fields));
      if (this.model.clouds) {
        const dns = this._enableHostname(this.model.clouds);
        if (!dns) {
          const ind = this._fieldIndexByName('hostname', fields);
          if (ind > -1) {
            fields.splice(ind, 1);
          }
        }
      }
      // clear to reset
      this.set('machineFields', []);
      this.set('machineFields', fields);
    }

    this._updateFields(selectedCloud);
  },

  _enableHostname(clouds) {
    return Object.values(clouds).reduce((a, b) => a || b.dns_enabled, false);
  },

  _locationChanged(locationId) {
    if (!locationId) return;
    const sizeIndex = this._fieldIndexByName('size');
    if (sizeIndex === -1) {
      // cloud has no size field
      return;
    }
    if (
      ['vsphere', 'lxd', 'kubevirt'].indexOf(
        this.model.clouds[this.selectedCloud].provider
      ) > -1
    )
      return;
    const location = this.model.clouds[this.selectedCloud].locations[
      locationId
    ];
    const selectedSize = this.machineFields[sizeIndex].value;
    const allSizes =
      this._toArray(this.model.clouds[this.selectedCloud].sizes).sort(
        (a, b) => {
          if (a.cpus < b.cpus) {
            return -1;
          }
          if (a.cpus > b.cpus) {
            return 1;
          }
          return 0;
        }
      ) || [];
    let sizeOptions = [];
    if (location.extra && location.extra.available_instance_types) {
      // provider === "aliyun_ecs"
      sizeOptions = allSizes.filter(
        option =>
          location.extra.available_instance_types.indexOf(option.external_id) >
          -1
      );
    } else {
      sizeOptions = allSizes.filter(
        option =>
          !option.extra.regions ||
          option.extra.regions.indexOf(location.external_id) > -1
      );
    }
    if (sizeOptions.findIndex(item => item.id === selectedSize) === -1) {
      this.set(
        `machineFields.${sizeIndex}.value`,
        this.machineFields[sizeIndex].defaultValue || ''
      );
    }
    this.set(`machineFields.${sizeIndex}.options`, sizeOptions);
  },

  _resetForm() {
    // Reset Form Fields
    this.set('selectedCloud', false);
    this.machineFields.forEach((el, index) => {
      if (el.showIf) {
        this.set(`machineFields.${index}.show`, false);
      }
      // Reset Form Fields Validation
      this._resetField(el, index);
    });
    this._cloudsChanged(this.clouds);
  },

  _resetField(el, index) {
    this.set(`machineFields.${index}.value`, el.defaultValue);

    const input = this.shadowRoot.querySelector(`#${el.name}`);
    if (input) {
      input.invalid = false;
    }
  },
  /* eslint-disable no-param-reassign */
  _updateFields(_selectedCloud) {
    if (
      this.model &&
      this.model.clouds &&
      this.selectedCloud &&
      this.model.clouds[this.selectedCloud]
    ) {
      const cloudId = this.selectedCloud;

      if (!this.monitoring)
        // hide enable monitoring field if monitoring is disabled
        this.set(
          `machineFields.${this._fieldIndexByName('monitoring')}.show`,
          false
        );

      // if is openstack do not require network/locations
      if (
        this.model.clouds[this.selectedCloud].provider === 'openstack' ||
        this.model.clouds[this.selectedCloud].provider === 'vexxhost'
      ) {
        this._updateFieldsForOpenstack();
        this._updateSecurityGroups(this.selectedCloud);
      }

      // if is equinix metal construct ip_addresses value
      if (this.model.clouds[this.selectedCloud].provider === 'equinixmetal') {
        this._updateFieldsForEquinixMetal();
      }

      // fetch security groups if necessary
      if (this.model.clouds[this.selectedCloud].provider === 'ec2') {
        this._updateSecurityGroups(this.selectedCloud);
      }
      this.machineFields.forEach((f, index) => {
        // clear options
        if (
          ['duration_field', 'dropdown', 'radio', 'list'].indexOf(f.type) ===
            -1 &&
          f.options
        ) {
          f.options = [];
        }

        if (f.name.endsWith('location')) {
          const allLocations = this._toArray(
            this.model.clouds[cloudId].locations
          );
          const locations = allLocations.filter(l => {
            const checkPerm = this.checkPerm(
              'location',
              'create_resources',
              l.id
            );
            return checkPerm !== false && l.location_type !== 'region';
          });
          // disable maxihost locations that support no sizes
          if (this.model.clouds[cloudId].provider === 'maxihost') {
            const sizeLocations = this._toArray(
              this.model.clouds[this.selectedCloud].sizes
            )
              .map(x => x.extra.regions)
              .join();
            locations.forEach(l => {
              if (sizeLocations.indexOf(l.external_id) === -1) {
                l.disabled = true;
              }
            });
          }
          if (
            this.model.clouds[cloudId].provider === 'openstack' ||
            this.model.clouds[cloudId].provider === 'vexxhost'
          ) {
            locations.forEach(l => {
              if (!l.capabilities || l.capabilities.indexOf("compute") === -1) {
                l.disabled = true;
              }
            });
          }
          f.options = locations;
          if (locations.length === 1) {
            // If there's a single location preselect it
            this.set(`machineFields.${index}.value`, locations[0].id);
          }
        }
        if (f.name.endsWith('image')) {
          let images = this._toArray(this.model.clouds[cloudId].images);
          // KVM images depend on location
          if (this.model.clouds[cloudId].provider === 'libvirt') {
            const locInd = this._fieldIndexByName('location');
            if (locInd > -1) {
              images = this._getLocationImages(
                this.get(`machineFields.${locInd}.value`)
              );
            }
          }
          f.options = images.sort((ima, _imb) => {
            if (ima.starred) {
              return -1;
            }
            return 0;
          });
          for (let i = 0; i < f.options.length; i++) {
            if (f.options[i].starred) {
              f.options[i].icon = 'icons:star';
            } else {
              break;
            }
          }
        }

        if (f.type.startsWith('mist_') && f.name.endsWith('size')) {
          // check if there are any constraints for this cloud
          let allowedConstraints = [];
          if (
            this.constraints &&
            this.constraints.size &&
            this.constraints.size.allowed &&
            this.constraints.size.allowed.length > 0
          ) {
            allowedConstraints = this.constraints.size.allowed.filter(
              constr => constr.cloud === this.selectedCloud
            );
          }
          let notAllowedConstraints = [];
          if (
            this.constraints &&
            this.constraints.size &&
            this.constraints.size.not_allowed &&
            this.constraints.size.not_allowed.length > 0
          ) {
            notAllowedConstraints = this.constraints.size.not_allowed.filter(
              constr => constr.cloud === this.selectedCloud
            );
          }
          if (allowedConstraints.length > 0) {
            if (typeof allowedConstraints[0].size !== 'string')
              f.custom = false;
            const allowedSizes = [];
            allowedConstraints.forEach(constr => {
              // If the size is a custom size, add it's user friendly name
              if (typeof constr.size === 'object') {
                allowedSizes.push({
                  ...constr.size,
                  userFriendlyName: constr.userFriendlyName,
                });
              } else {
                allowedSizes.push(constr.size);
              }
            });
            f.allowed = allowedSizes;
          }
          if (notAllowedConstraints.length > 0) {
            const notAllowedSizes = [];
            notAllowedConstraints.forEach(constr => {
              notAllowedSizes.push(constr.size);
            });
            f.not_allowed = notAllowedSizes;
          }
          f.options =
            this._toArray(this.model.clouds[cloudId].sizes).sort((a, b) => {
              if (a.cpus < b.cpus) {
                return -1;
              }
              if (a.cpus > b.cpus) {
                return 1;
              }
              return 0;
            }) || [];
          f.selectedCloud = this.selectedCloud;
        }

        if (f.name.endsWith('key')) {
          f.options = this._toArray(this.model.keys);
        }

        if (f.name.endsWith('zone')) {
          f.options = this._toArray(this.model.zones);
          // If zones share same domain but have differnt external_id then display external_id as suffix
          f.options.forEach(zone => {
            if (zone.domain !== `${zone.external_id}.`) {
              zone.suffix = zone.external_id;
            }
          });
        }

        // TODO: Run a recursive _updateFields() for fieldgroup subfields
        if (f.type === 'fieldgroup') {
          for (let k = 0; k < f.subfields.length; k++) {
            const sf = f.subfields[k];
            if (sf.name && sf.name.endsWith('zone')) {
              sf.options = this._toArray(this.model.zones);
              sf.options.forEach(zone => {
                if (`${zone.external_id}.` !== zone.domain) {
                  zone.suffix = zone.external_id;
                }
              });
              if (sf.options.length)
                this.set(
                  `machineFields.${index}.subfields.${k}.value`,
                  sf.options[0].id
                );
            }
          }
        }

        if (
          f.name.startsWith('script') ||
          f.name.startsWith('schedule_script')
        ) {
          f.options = this._toArray(this.model.scripts);
        }

        if (f.name === 'action') {
          f.options = this.scheduleActions || [];
        }

        // for openstack this should be multi selection
        if (f.name.endsWith('networks')) {
          f.options = this.model.clouds[cloudId].networks
            ? Object.values(this.model.clouds[cloudId].networks)
            : [];
          if (f.options.length < 2)
            this.set(`machineFields.${index}.required`, false);
        }

        // if is equinix metal construct ip_addresses value
        if (f.name.includes('ipv4') || f.name.includes('ipv6')) {
          // console.log("_updateFieldsForEquinixMetal");
          this._updateFieldsForEquinixMetal();
        }

        // for ec2 subnet selection
        if (f.name === 'subnet_id') {
          const subnets = [];
          const networks = this.model.clouds[cloudId].networks
            ? Object.values(this.model.clouds[cloudId].networks)
            : [];
          for (let i = 0; i < networks.length; i++) {
            const network = networks[i];
            if (network.subnets && network.subnets.length)
              for (let j = 0; j < network.subnets.length; j++) {
                const subnet = network.subnets[j];
                subnet.suffix = network.name;
                subnets.push(subnet);
              }
          }
          f.options = subnets;
          if (f.options.length < 2)
            this.set(`machineFields.${index}.required`, false);
        }

        // for volumes options
        if (f.name === 'volumes') {
          const provider = this.model.clouds[cloudId].provider;
          const fieldset = this.volumeFields.find(
            fieldSet => fieldSet.provider === provider
          );
          // remove location field if it exists,
          // the location of the machine will be used instead
          if (fieldset) {
            const options = this._cleanCopy(fieldset.fields);
            if (provider === 'kubevirt') {
              // update kubernetes/kubevirt storage classes
              const storageClassIndex = options.findIndex(
                entry => entry.name === 'storage_class_name'
              );
              if (storageClassIndex > -1) {
                const storageClassField = options[storageClassIndex];
                this._updateStorageClasses(cloudId, storageClassField);
              }
              // remove the static volume creation
              const toRemove = ['dynamic', 'volume_type', 'reclaim_policy'];
              for (const item of toRemove) {
                const ind = options.findIndex(entry => entry.name === item);
                if (ind > -1) {
                  options.splice(ind, 1);
                }
              }
            }

            const locationIndex = options.findIndex(
              entry => entry.name === 'location'
            );

            if (provider === 'lxd') {
              const storagePoolsIdx = options.findIndex(
                entry => entry.name === 'pool_id'
              );

              if (storagePoolsIdx > -1) {
                const storagePoolField = options[storagePoolsIdx];
                this.set('lxdStoragePoolsField', storagePoolField);
                this._updateLXDStoragePools(cloudId);
              }
            }

            if (locationIndex > -1) {
              options.splice(locationIndex, 1);
            }
            // remove resource group fields if they exists,
            // the resource group of the machine will be used instead
            const resourceGroupFields = options.filter(
              entry => entry.name.indexOf('resource_group') > -1
            );
            // console.log('resourceGroupFields',resourceGroupFields);
            if (resourceGroupFields.length > -1) {
              for (let i = 0; i < resourceGroupFields.length; i++) {
                const resourceGroupFieldName = resourceGroupFields[i].name;
                const fieldIndex = options.findIndex(
                  entry => entry.name === resourceGroupFieldName
                );
                options.splice(fieldIndex, 1);
              }
            }
            // Remove new volume name field for now since it's not used by OpenStack
            if (provider === 'openstack' || provider === 'vexxhost') {
              const nameIndex = options.findIndex(
                entry => entry.name === 'name'
              );
              if (nameIndex > -1) {
                options.splice(nameIndex, 1);
              }
            }
            options.forEach(entry => {
              entry.showIf = {
                fieldName: 'new-or-existing-volume',
                fieldValues: ['new'],
              };
            });
            const existingIndex = f.options.findIndex(
              entry => entry.name === 'volume_id'
            );
            // add provider dependent fields if they do yet not exist
            const names = f.options.map(entry => entry.name);
            for (let i = options.length - 1; i >= 0; i--) {
              if (
                names.indexOf(options[i].name) === -1 &&
                (options[i].onForm === 'createForm' || !options[i].onForm)
              ) {
                f.options.splice(existingIndex, 0, options[i]);
              }
            }
          }
        }

        // update options
        if (f.options) {
          this.set(`machineFields.${index}.options`, f.options);
        }

        // console.log(this.get('machineFields.' + index + '.options'));
        // console.log('update fields', f.name, f.value)
      });

      // if cloud is Aliyun ECS update locations
      if (this.model.clouds[this.selectedCloud].provider === 'aliyun_ecs') {
        this._updateFieldsForAliyun();
      }

      // if is docker, change required values
      if (this.model.clouds[this.selectedCloud].provider === 'docker') {
        this._updateFieldsForDocker();
      }

      // if is lxd, change required values
      if (this.model.clouds[this.selectedCloud].provider === 'lxd') {
        this._updateFieldsForLxd();
      }

      // if is azure arm, change required values
      if (this.model.clouds[this.selectedCloud].provider === 'azure_arm') {
        this._updateFieldsForAzureArm();
        this._updateStorageAccounts(this.selectedCloud);
        this._updateResourceGroups(this.selectedCloud);
      }

      // if is kvm, change helptexts
      if (this.model.clouds[this.selectedCloud].provider === 'libvirt') {
        this._updateFieldsForKvm();
      }
      // if it is vsphere add folders
      if (this.model.clouds[this.selectedCloud].provider === 'vsphere') {
        const folderFieldInd = this._fieldIndexByName('folders');
        const folderField = this.get(`machineFields.${folderFieldInd}`);
        const datastoreFieldInd = this._fieldIndexByName('datastore');
        const datastoreField = this.get(`machineFields.${datastoreFieldInd}`);
        this._updateFolders(this.selectedCloud, folderField);
        this._updateDatastores(this.selectedCloud, datastoreField);
      }
      // default values, hide empty non required, fill in single options
      if (this.machineFields) {
        this.machineFields.forEach((f, ind) => {
          this.set(
            `machineFields.${ind}.value`,
            this.get(`machineFields.${ind}.defaultValue`)
          );
          if (
            f.required &&
            f.options &&
            f.options.length === 1 &&
            f.name !== 'image' &&
            this.model.clouds[this.selectedCloud].provider !== 'vsphere'
          ) {
            if (f.type === 'dropdown') {
              this.set(`machineFields.${ind}.value`, f.options[0].val);
            } else {
              this.set(`machineFields.${ind}.value`, f.options[0].id);
            }
          }
          if (!f.required && f.options && f.options.length === 0) {
            this.set(`machineFields.${ind}.show`, false);
          }
          if (this.constraints && this.constraints.field) {
            this.constraints.field.forEach(c => {
              if (
                c.name === f.name &&
                (c.cloud === 'ALL' || c.cloud === this.selectedCloud)
              ) {
                this.set(`machineFields.${ind}.value`, c.value);
                this.set(`machineFields.${ind}.show`, c.show);
              }
            });
          }
        });
      }
    }
  },
  /* eslint-enable no-param-reassign */
  fieldsChanged(e) {
    // change notify values if expiration date changes
    if (
      e.detail &&
      e.detail.fieldname === 'date' &&
      e.detail.parentfield === 'expiration'
    ) {
      const expIndex = this._fieldIndexByName('expiration');
      const parentPath = `machineFields.${expIndex}.subfields`;
      const dateIndex = 1;
      const notifyIndex = 2;
      const date = this.get(`${parentPath}.${dateIndex}.value`);
      this.set(`${parentPath}.${notifyIndex}.max`, date);
    }
  },
  /* eslint-disable no-param-reassign */
  _machineFieldsChanged(changeRecord) {
    // console.log('model, selected cloud or machine fields changed', this.selectedCloud, changeRecord);
    if (
      this.selectedCloud &&
      this.model &&
      this.model.clouds &&
      this.model.clouds[this.selectedCloud]
    ) {
      // if (changeRecord.path.endsWith('options') && this.get(changeRecord.path).length === 1)
      //     this.set(changeRecord.path.replace('.options', '.value'), changeRecord.path+'.0.id')

      // if is docker & ports changed, transform ports to docker_exposed_ports & docker_port_bindings
      if (
        this.model.clouds[this.selectedCloud].provider === 'docker' &&
        changeRecord.path.endsWith('value') &&
        this.get(changeRecord.path.replace('.value', '')).name === 'ports'
      ) {
        // TODO: remove _mapPortsToDockerPorts, when backend is ready to accept docker_port_bindings as string
        // Then also, replace field ports with docker_port_bindings as a textarea and remove docker_exposed_ports and ports altogether in machine-create-fields.js
        this._mapPortsToDockerPorts(changeRecord.value);
      }

      // if is gce/linode and image changed, include image extra in payload
      if (
        (this.model.clouds[this.selectedCloud].provider === 'linode' ||
          this.model.clouds[this.selectedCloud].provider === 'gce' ||
          this.model.clouds[this.selectedCloud].provider === 'vsphere') &&
        changeRecord.path.endsWith('value') &&
        this.get(changeRecord.path.replace('.value', '')).name === 'image'
      ) {
        this._includeImageExtra(changeRecord.value);
      }

      // if is gce/linode and image changed, include location name in payload
      if (
        (this.model.clouds[this.selectedCloud].provider === 'linode' ||
          this.model.clouds[this.selectedCloud].provider === 'gce') &&
        changeRecord.path.endsWith('value') &&
        this.get(changeRecord.path.replace('.value', '')).name === 'location'
      ) {
        this._includeLocationName(changeRecord.value);
      }

      // if it's gce and network changes update subnets
      if (
        this.model.clouds[this.selectedCloud].provider === 'gce' &&
        changeRecord.path.endsWith('value') &&
        this.get(changeRecord.path.replace('.value', '')).name === 'networks'
      ) {
        this._updateGceSubnets(
          this.get(changeRecord.path.replace('.value', '')).value
        );
      }

      // if image and image is Windows, show password field
      if (
        changeRecord.path.endsWith('value') &&
        this.get(changeRecord.path.replace('.value', '')).name === 'image'
      ) {
        this._showPassword(this.get(changeRecord.path));
        this._hideElementsforWin(this.get(changeRecord.path));
      }

      // if its kvm
      if (this.model.clouds[this.selectedCloud].provider === 'libvirt') {
        if (
          changeRecord.path.endsWith('.value') &&
          this.get(changeRecord.path.replace('.value', '')).name === 'name'
        ) {
          this._updateKvmDiskPathName(
            this.get(changeRecord.path.replace('.value', '')).value
          );
        }

        if (
          changeRecord.path.endsWith('.value') &&
          this.get(changeRecord.path.replace('.value', '')).name === 'location'
        ) {
          this._updateImagesAndNetworksBasedOnLocation();
          this._updateKvmDiskPathFolder(
            this.get(changeRecord.path.replace('.value', '')).value
          );
        }
      }

      // if its equinix metal and ips changed
      if (
        this.model.clouds[this.selectedCloud].provider === 'equinixmetal' &&
        changeRecord.path.endsWith('.value') &&
        this.get(changeRecord.path.replace('.value', '')).name.includes('_ipv')
      ) {
        this._updateFieldsForEquinixMetal();
      }

      // if selected image provides size min/max, update them
      if (
        changeRecord.path.endsWith('.value') &&
        this.get(changeRecord.path.replace('.value', '')).name === 'image'
      ) {
        this._updateMinSize(changeRecord.value);
      }

      // if location changed and volumes are allowed
      if (
        changeRecord.path.endsWith('value') &&
        ['location', 'volumes'].indexOf(
          this.get(changeRecord.path.replace('.value', '')).name
        ) > -1 &&
        this._fieldIndexByName('volumes') > -1
      ) {
        // add existing volume options filtered by location
        const volumesInd = this._fieldIndexByName('volumes');
        const volumeField = this.get(`machineFields.${volumesInd}`);
        const existingIndex = volumeField.options.findIndex(
          f => f.name === 'volume_id'
        );
        // reset
        this.set(
          `machineFields.${volumesInd}.options.${existingIndex}.options`,
          []
        );
        this.set(
          `machineFields.${volumesInd}.options.${existingIndex}.value`,
          ''
        );
        this.notifyPath(
          `machineFields.${volumesInd}.options.${existingIndex}.value`
        );
        // add
        if (existingIndex > -1) {
          const volumes = this.model.clouds[this.selectedCloud].volumes
            ? Object.values(
                this.model.clouds[this.selectedCloud].volumes
              ).filter(v => !v.location || v.location === changeRecord.value)
            : [];
          volumeField.options[existingIndex].options = volumes;
          this.set(
            `machineFields.${volumesInd}.options.${existingIndex}.options`,
            volumes
          );
          this.notifyPath(
            `machineFields.${volumesInd}.options.${existingIndex}.options`
          );
        }
      }

      // if add volume toggler changed value
      if (
        changeRecord.path.endsWith('value') &&
        ['addvolume'].indexOf(
          this.get(changeRecord.path.replace('.value', '')).name
        ) > -1
      ) {
        const volumesInd = this._fieldIndexByName('volumes');
        if (!changeRecord.value) {
          this.set(`machineFields.${volumesInd}.items`, []);
          this.set(`machineFields.${volumesInd}.value`, null);
        }
        this.set(
          `machineFields.${volumesInd}.excludeFromPayload`,
          !changeRecord.value
        );
      }

      // if it's ec2 and location is selected filter subnets
      if (
        changeRecord.path.endsWith('value') &&
        this.get(changeRecord.path.replace('.value', '')).name === 'location' &&
        changeRecord.value.length
      ) {
        const subid = this._fieldIndexByName('subnet_id');
        // clear previous selection
        this.set(`machineFields.${subid}.value`, '');
        const subnets = [];
        if (
          this.model.clouds[this.selectedCloud] &&
          this.model.clouds[this.selectedCloud].networks
        ) {
          const networks = Object.values(
            this.model.clouds[this.selectedCloud].networks
          );
          for (let i = 0; i < networks.length; i++) {
            const network = networks[i];
            if (network.subnets)
              Object.values(network.subnets || {}).forEach(subnet => {
                if (
                  subnet.availability_zone ===
                  this.model.clouds[this.selectedCloud].locations[
                    changeRecord.value
                  ].name
                ) {
                  subnet.suffix = network.name;
                  subnets.push(subnet);
                }
              });
          }
        }
        this.set(`machineFields.${subid}.options`, subnets);
      }

      // if it is maxihost and location changed
      if (this.model.clouds[this.selectedCloud].provider === 'maxihost') {
        if (
          this.get(changeRecord.path.replace('.value', '')).name ===
            'location' &&
          changeRecord.value.length
        ) {
          this._updateMaxihostSizes(changeRecord.value);
        }
      }

      // if it is azure arm update storage accounts & resource groups
      if (this.model.clouds[this.selectedCloud].provider === 'azure_arm') {
        // console.log('changeRecord', changeRecord);
        if (changeRecord.path.endsWith('value')) {
          const fieldName = this.get(changeRecord.path.replace('.value', ''))
            .name;

          if (['resource_group', 'location'].indexOf(fieldName) > -1) {
            this._filterStorageAccountsOptions();
            this._filterNetworksOptions();
          }

          if (
            ['resource_group', 'storage_account', 'networks'].indexOf(
              fieldName
            ) > -1
          ) {
            return;
          }

          if (
            [
              'create_resource_group',
              'ex_resource_group',
              'new_resource_group',
            ].indexOf(fieldName) > -1
          ) {
            this._updateResourceGroupValue(this.selectedCloud);
            if (fieldName === 'create_resource_group') {
              this._toggleExistingStorageAccounts(changeRecord.value);
              this._toggleExistingNetworks(changeRecord.value);
            }
          }
          if (
            [
              'create_storage_account',
              'ex_storage_account',
              'new_storage_account',
            ].indexOf(fieldName) > -1
          ) {
            this._updateStorageAccountValue(this.selectedCloud);
          }
          if (
            ['create_network', 'ex_networks', 'new_network'].indexOf(
              fieldName
            ) > -1
          ) {
            this._updateNetworkValue(this.selectedCloud);
          }
          // if it is azure arm and location is changed
          if (fieldName === 'location') {
            // update networks
            const networks = this.model.clouds[this.selectedCloud].networks
              ? Object.values(
                  this.model.clouds[this.selectedCloud].networks
                ).slice()
              : [];
            const locationNetworks = networks.filter(
              n => n.location === changeRecord.value // FIXME something is wrong here (was location --> changeRecord.value)
            );
            const networkInd = this._fieldIndexByName('ex_networks');
            if (networkInd > -1) {
              this.set(`machineFields.${networkInd}.options`, locationNetworks);
            }
          }
          // In azure arm if image is windows type then machine password should show and Key should be hidden
          if (fieldName === 'image') {
            const imgId = this.get(changeRecord.path);
            if (imgId) {
              const imgInd = this._fieldIndexByName('image');
              const img = changeRecord.base[imgInd].options.find(
                el => el.id === imgId
              );
              if (img.os_type === 'windows') this._showPassword(img.name);
            }
          }
          // if it is azure arm and machine name is changed
          if (fieldName === 'name') {
            // autocomplete resource, storage, network fields
            this._updateAzureFields(this.get(changeRecord.path));
          }
        }
      }
      // let either script or script_id to pass in the from payload
      if (
        changeRecord.path.endsWith('value') &&
        this.get(changeRecord.path.replace('.value', '')).name === 'run_script'
      ) {
        this._toggleScriptFields(
          this.get(changeRecord.path.replace('.value', '')).value
        );
      }

      if (
        this.model.clouds[this.selectedCloud].provider === 'onapp' &&
        changeRecord.path.endsWith('value')
      ) {
        // if is onapp controll options based on location
        if (
          this.get(changeRecord.path.replace('.value', '')).name === 'location'
        )
          this._updateFieldOptionsForOnapp(changeRecord.value);
        // if is onapp controll options based on image
        if (this.get(changeRecord.path.replace('.value', '')).name === 'image')
          this._updateFieldMinsForOnapp(changeRecord.value);
      }

      // update scheduler fields
      if (changeRecord.path.endsWith('.value')) {
        const scheduleFields = [
          'action',
          'schedule_script_id',
          'params',
          'schedule_type',
          'schedule_entry',
          'start_after',
          'expires',
          'max_run_count',
        ];
        const scheduleFieldFalse = [
          'action',
          'params',
          'schedule_type',
          'schedule_entry',
          'start_after',
          'expires',
          'max_run_count',
        ];
        // toggling scehduler
        if (
          this.get(changeRecord.path.replace('.value', '')).name ===
          'post_provision_scheduler'
        ) {
          // console.log('schedule changed', changeRecord.value);
          if (changeRecord.value === true) {
            for (let i = 0; i < scheduleFieldFalse.length; i++) {
              const index = this._fieldIndexByName(scheduleFieldFalse[i]);
              if (index > -1) {
                this.set(`machineFields.${index}.excludeFromPayload`, false);
              }
            }
          } else {
            for (let i = 0; i < scheduleFields.length; i++) {
              const index = this._fieldIndexByName(scheduleFields[i]);
              if (index > -1) {
                this.set(`machineFields.${index}.excludeFromPayload`, true);
              }
            }
          }
        }

        // selecting action or script
        if (
          this.get(changeRecord.path.replace('.value', '')).name === 'action'
        ) {
          const actionInd = this._fieldIndexByName('action');
          const scriptInd = this._fieldIndexByName('schedule_script_id');

          if (changeRecord.value === 'run script') {
            if (scriptInd > -1) {
              this.set(`machineFields.${scriptInd}.excludeFromPayload`, false);
            }
            if (actionInd > -1) {
              this.set(`machineFields.${actionInd}.excludeFromPayload`, true);
            }
          }

          if (changeRecord.value !== 'run script') {
            if (scriptInd > -1) {
              this.set(`machineFields.${scriptInd}.excludeFromPayload`, true);
            }
            if (actionInd > -1) {
              this.set(`machineFields.${actionInd}.excludeFromPayload`, false);
            }
          }
        }

        // initial values in schedule entry
        if (
          this.get(changeRecord.path.replace('.value', '')).name ===
          'schedule_type'
        ) {
          const entryInd = this._fieldIndexByName('schedule_entry');
          const expInd = this._fieldIndexByName('expires');
          const entryCronTabInd = this._fieldIndexByName(
            'schedule_entry_crontab'
          );
          const maxcountInd = this._fieldIndexByName('max_run_count');
          let entry;
          if (changeRecord.value === 'interval') {
            entry = this._getInterval();
            if (expInd > -1)
              this.set(`machineFields.${expInd}.disabled`, false);
            if (maxcountInd > -1)
              this.set(`machineFields.${maxcountInd}.disabled`, false);
            if (maxcountInd > -1)
              this.set(`machineFields.${maxcountInd}.value`, '');
          } else if (changeRecord.value === 'crontab') {
            entry =
              this._processCrotab(
                this.get(`machineFields.${entryCronTabInd}.value`)
              ) ||
              this._processCrotab(
                this.get(`machineFields.${entryCronTabInd}.defaultValue`)
              );
            if (expInd > -1)
              this.set(`machineFields.${expInd}.disabled`, false);
            if (maxcountInd > -1)
              this.set(`machineFields.${maxcountInd}.disabled`, false);
            if (maxcountInd > -1)
              this.set(`machineFields.${maxcountInd}.value`, '');
          } else if (changeRecord.value === 'one_off') {
            if (expInd > -1) this.set(`machineFields.${expInd}.disabled`, true);
            if (maxcountInd > -1)
              this.set(`machineFields.${maxcountInd}.value`, 1);
            if (maxcountInd > -1)
              this.set(`machineFields.${maxcountInd}.disabled`, true);
          }
          this.set(`machineFields.${entryInd}.value`, entry);
        }

        // date in schedule entry
        if (
          this.get(changeRecord.path.replace('.value', '')).name ===
          'schedule_entry_one_off'
        ) {
          const entryInd = this._fieldIndexByName('schedule_entry');
          if (entryInd > -1)
            this.set(`machineFields.${entryInd}.value`, changeRecord.value);
        }

        // crontab in schedule entry
        if (
          this.get(changeRecord.path.replace('.value', '')).name ===
          'schedule_entry_crontab'
        ) {
          const entryInd = this._fieldIndexByName('schedule_entry');
          if (entryInd > -1)
            this.set(
              `machineFields.${entryInd}.value`,
              this._processCrotab(changeRecord.value)
            );
        }

        // interval changes in schedule entry
        if (
          this.get(changeRecord.path.replace('.value', '')).name.startsWith(
            'schedule_entry_interval'
          )
        ) {
          const entryInd = this._fieldIndexByName('schedule_entry');
          if (entryInd > -1)
            this.set(`machineFields.${entryInd}.value`, this._getInterval());
        }

        if (
          this.get(changeRecord.path.replace('.value', '')).name === 'expires'
        ) {
          const expiresInd = this._fieldIndexByName('expires');
          const include = changeRecord.value === '';
          if (expiresInd > -1)
            this.set(`machineFields.${expiresInd}.excludeFromPayload`, include);
        }

        if (
          this.get(changeRecord.path.replace('.value', '')).name ===
          'max_run_count'
        ) {
          const maxcountInd = this._fieldIndexByName('max_run_count');
          if (
            typeof this.get(`machineFields.${maxcountInd}.value`) !== 'number'
          ) {
            if (
              Number.isNan(parseInt(changeRecord.value, 10)) &&
              maxcountInd > -1
            ) {
              this.set(`machineFields.${maxcountInd}.excludeFromPayload`, true);
              this.set(`machineFields.${maxcountInd}.value`, '');
            } else {
              this.set(
                `machineFields.${maxcountInd}.excludeFromPayload`,
                false
              );
              this.set(
                `machineFields.${maxcountInd}.value`,
                parseInt(changeRecord.value, 10)
              );
            }
          }
        }
      }
    }
    // if is vsphere change fields
    if (
      this.model &&
      this.model.clouds &&
      this.model.clouds[this.selectedCloud] &&
      this.model.clouds[this.selectedCloud].provider === 'vsphere'
    ) {
      this._updateFieldsForVsphere();
    }
  },
  /* eslint-enable no-param-reassign */
  _mapPortsToDockerPorts(input) {
    const lines = input.split('\n');
    const dockerExposedPorts = {};
    const dockerPortBindings = {};

    for (let i = 0; i < lines.length; i++) {
      const ports = lines[i].split(':');

      let p1 = ports[0];
      let p2 = ports[1];

      // sanitize
      if (p1) p1 = p1.trim();
      if (p2) p2 = p2.trim();

      // update dockerExposedPorts
      // update dockerPortBindings
      if (p1 && p1.length && p2 && p2.length) {
        if (p1.indexOf('/') === -1) {
          dockerExposedPorts[`${p1}/tcp`] = {};
          dockerPortBindings[`${p1}/tcp`] = {
            HostPort: p2,
          };
        } else {
          dockerExposedPorts[p1] = {};
          dockerPortBindings[p1] = [
            {
              HostPort: p2,
            },
          ];
        }
      }
    }

    // save in fields
    const indDep = this._fieldIndexByName('docker_exposed_ports');
    const indDpb = this._fieldIndexByName('docker_port_bindings');

    if (indDep !== undefined && indDep > -1)
      this.set(`machineFields.${indDep}.value`, dockerExposedPorts);
    if (indDpb !== undefined && indDpb > -1)
      this.set(`machineFields.${indDpb}.value`, dockerPortBindings);
  },

  _includeImageExtra(image) {
    if (image) {
      // save in fields
      const indImEx = this._fieldIndexByName('image_extra');
      if (indImEx !== undefined)
        this.set(
          `machineFields.${indImEx}.value`,
          this.model.clouds[this.selectedCloud].images[image].extra
        );
    }
  },

  _includeLocationName(location) {
    if (location) {
      // save in fields
      const indLocName = this._fieldIndexByName('location_name');
      if (indLocName !== undefined && indLocName > -1)
        this.set(
          `machineFields.${indLocName}.value`,
          this.model.clouds[this.selectedCloud].locations[location].name
        );
    }
  },

  _updateFieldsForAliyun() {
    const locationIndex = this._fieldIndexByName('location');
    if (locationIndex > -1) {
      const filteredLocations = this.machineFields[
        locationIndex
      ].options.filter(option => option.extra.available_instance_types.length);
      this.set(`machineFields.${locationIndex}.options`, filteredLocations);
    }
  },

  _updateFieldsForVsphere() {
    const keyInd = this._fieldIndexByName('key');
    if (keyInd > -1 && this.get(`machineFields.${keyInd}.required`)) {
      this.set(`machineFields.${keyInd}.required`, false);
      this.set(`machineFields.${keyInd}.label`, 'Key');
    }
    const imgInd = this._fieldIndexByName('image');
    const img = this.get(`machineFields.${imgInd}`);
    if (img && img.value) {
      let current;
      for (let i = 0; i < img.options.length; i++) {
        current = img.options[i];
        if (current.id === img.value) {
          break;
        }
      }

      // const sizeInd = this._fieldIndexByName('size');
      // const minSize = Math.max(
      //   current.extra.disk_size,
      //   this.machineFields[sizeInd].customSizeFields[2].min
      // );
      // if (current.extra.type === 'ovf') {
      //   this.set(`machineFields.${sizeInd}.customSizeFields.${2}.min`, minSize);
      //   this.set(`machineFields.${sizeInd}.customSizeFields.${2}.max`, 1);
      //   this.set(
      //     `machineFields.${sizeInd}.customSizeFields.${2}.value`,
      //     minSize
      //   );
      // } else {
      //   this.set(`machineFields.${sizeInd}.customSizeFields.${2}.min`, minSize);
      //   this.set(`machineFields.${sizeInd}.customSizeFields.${2}.max`, 512);
      //   this.set(
      //     `machineFields.${sizeInd}.customSizeFields.${2}.value`,
      //     Math.max(
      //       minSize,
      //       this.machineFields[sizeInd].customSizeFields[2].value
      //     )
      //   );
      // }
    }
  },

  _updateFieldsForOpenstack() {
    const locInd = this._fieldIndexByName('location');
    if (locInd > -1) {
      this.set(`machineFields.${locInd}.required`, false);
      this.set(`machineFields.${locInd}.label`, 'Location');
    }
  },

  _updateMinSize(image) {
    console.log('test');
    if (
      !image ||
      !this.model ||
      !this.model.images ||
      !this.model.images[image] ||
      !this.model.images[image].min_disk_size || 
      !this.model.images[image].min_memory_size
    )
      return;

    const minRam = this.model.images[image].min_memory_size;
    const minDisk = this.model.images[image].min_disk_size;

    const sizeInd = this._fieldIndexByName('size');
    if (sizeInd > -1) {
      const { customSizeFields } = this.machineFields[sizeInd];
      let ramInd = this._fieldIndexByName('ram', customSizeFields);
      let diskInd = this._fieldIndexByName('disk_primary', customSizeFields);

      // some providers use size_ prefix
      if (ramInd === -1)
        ramInd = this._fieldIndexByName('size_ram', customSizeFields);
      if (diskInd === -1)
        diskInd = this._fieldIndexByName('size_disk_primary', customSizeFields);

      if (minRam && ramInd > -1)
        this.set(
          `machineFields.${sizeInd}.customSizeFields.${ramInd}.min`,
          minRam
        );
      if (minDisk && diskInd > -1)
        this.set(
          `machineFields.${sizeInd}.customSizeFields.${diskInd}.min`,
          minDisk
        );
    }
    // console.log(this.model.images[image].name, 'ram', this.model.images[image].extra.min_memory, 'disk', this.model.images[image].extra.min_disk_size);
    // console.log('mins', this.get('machineFields.'+ sizeInd +'.customSizeFields.'+ ramInd +'.min'), this.get('machineFields.'+ sizeInd +'.customSizeFields.'+ diskInd +'.min'));
  },

  _updateFieldMinsForOnapp(image) {
    const imageField =
      this.model.clouds[this.selectedCloud].images &&
      this.model.clouds[this.selectedCloud].images[image]
        ? this.model.clouds[this.selectedCloud].images[image]
        : undefined;

    if (!imageField) {
      return;
    }

    const sizeInd = this._fieldIndexByName('mist_size');
    const ramInd = this._fieldIndexByName(
      'size_ram',
      this.get(`machineFields.${sizeInd}.customSizeFields`)
    );
    const diskInd = this._fieldIndexByName(
      'size_disk_primary',
      this.get(`machineFields.${sizeInd}.customSizeFields`)
    );

    if (sizeInd > -1 && ramInd > -1)
      this.set(
        `machineFields.${sizeInd}.customSizeFields.${ramInd}.min`,
        imageField.min_memory_size
      );
    if (sizeInd > -1 && diskInd > -1)
      this.set(
        `machineFields.${sizeInd}.customSizeFields.${diskInd}.min`,
        imageField.min_disk_size
      );
  },

  _updateFieldOptionsForOnapp(loc) {
    const location = this.model.clouds[this.selectedCloud].locations[loc];

    // console.log('location', this.model.clouds[this.selectedCloud]);

    if (!location) {
      return;
    }

    const cpuInd = this._fieldIndexByName('size_cpu');
    const ramInd = this._fieldIndexByName('size_ram');
    const hgiInd = this._fieldIndexByName('hypervisor_group_id');
    const diskInd = this._fieldIndexByName('size_disk_primary');
    const swapInd = this._fieldIndexByName('size_disk_swap');

    // update mins maxs
    if (location.extra) {
      if (cpuInd > -1)
        this.set(`machineFields.${cpuInd}.max`, location.extra.max_cpu);
      if (ramInd > -1)
        this.set(`machineFields.${ramInd}.max`, location.extra.max_memory);
      if (hgiInd > -1)
        this.set(
          `machineFields.${hgiInd}.value`,
          location.extra.hypervisor_group_id
        );

      if (diskInd > -1) this.set(`machineFields.${diskInd}.max`, 16);
      if (swapInd > -1) this.set(`machineFields.${swapInd}.max`, 16);

      const imagesInd = this._fieldIndexByName('image');
      const networksInd = this._fieldIndexByName('networks');

      // update networks
      if (networksInd > -1)
        this.set(
          `machineFields.${networksInd}.options`,
          location.extra.networks
        );

      // filter images
      if (location.extra.federated === true && imagesInd > -1)
        this.set(
          `machineFields.${imagesInd}.options`,
          this._filterImagesByLoc(location.extra.hypervisor_group_id)
        );
      else
        this.set(
          `machineFields.${imagesInd}.options`,
          this._filterImagesWithNoHyp()
        );
    }
  },

  _filterImagesByLoc(location) {
    return this.model.clouds[this.selectedCloud].imagesArray.filter(
      im => im.extra.hypervisor_group_id === location
    );
  },

  _filterImagesWithNoHyp(_location) {
    return this.model.clouds[this.selectedCloud].imagesArray.filter(
      im => !im.extra.hypervisor_group_id
    );
  },

  _updateFieldsForDocker() {
    const sizeInd = this._fieldIndexByName('size');
    const locInd = this._fieldIndexByName('location');
    const keyInd = this._fieldIndexByName('key');
    const monInd = this._fieldIndexByName('monitoring');

    // hide size and location
    // console.log('............', sizeInd, locInd);
    if (sizeInd > -1) this.set(`machineFields.${sizeInd}.show`, false);
    if (locInd > -1) this.set(`machineFields.${locInd}.show`, false);

    this.notifyPath(`machineFields.${sizeInd}.show`);
    this.notifyPath(`machineFields.${locInd}.show`);

    // optional key
    if (keyInd > -1) {
      this.set(
        `machineFields.${keyInd}.helptext`,
        'Optional. Only valid if image includes ssh server'
      );
      this.set(`machineFields.${keyInd}.required`, false);
      this.set(`machineFields.${keyInd}.label`, 'Key');
    }
    // disable monitoring by default
    if (monInd > -1) this.set(`machineFields.${monInd}.value`, false);
  },

  _updateFieldsForLxd() {
    const keyInd = this._fieldIndexByName('key');
    // optional key
    if (keyInd > -1) {
      this.set(
        `machineFields.${keyInd}.helptext`,
        'Optional. Only valid if image includes ssh server'
      );
    }
  },

  _computeAddImageTitle(selectedCloud) {
    let provider = '';
    if (
      selectedCloud &&
      this.model.clouds &&
      this.model.clouds[selectedCloud]
    ) {
      provider = this.model.clouds[this.selectedCloud].provider;
    }
    return provider === 'lxd' ? 'Pull image from URL:' : 'Create image';
  },

  _computeAddImageLabel(selectedCloud) {
    let provider = '';
    if (
      selectedCloud &&
      this.model.clouds &&
      this.model.clouds[selectedCloud]
    ) {
      provider = this.model.clouds[this.selectedCloud].provider;
    }
    return provider === 'lxd' ? 'Image URL:' : "Image's path";
  },

  _updateFieldsForKvm() {
    const keyInd = this._fieldIndexByName('key');
    // change key helptexts
    if (keyInd > -1) {
      this.set(
        `machineFields.${keyInd}.helptext`,
        'Αn ssh key to deploy if using a cloudinit based Linux image'
      );
      if (this.docs)
        this.set(
          `machineFields.${keyInd}.helpHref`,
          'http://docs.mist.io/article/99-managing-kvm-with-mist-io'
        );
    }

    // if location is selected, we can update image options
    this._updateImagesAndNetworksBasedOnLocation();
  },

  _updateImagesAndNetworksBasedOnLocation() {
    const locInd = this._fieldIndexByName('location');
    const imgInd = this._fieldIndexByName('image');
    const networkInd = this._fieldIndexByName('networks');
    const vnfInd = this._fieldIndexByName('vnfs');
    if (locInd === -1 || imgInd === -1 || networkInd === -1) {
      return;
    }
    const location = this.get(`machineFields.${locInd}.value`);
    if (!location) return;

    const locImages = this._getLocationImages(location);
    this.set(`machineFields.${imgInd}.options`, locImages);

    // update networks
    const networks = this.model.clouds[this.selectedCloud].networks
      ? Object.values(this.model.clouds[this.selectedCloud].networks).slice()
      : [];

    const locationNetworks = networks.filter(n => n.location === location);

    if (networkInd > -1) {
      this.set(`machineFields.${networkInd}.options`, locationNetworks);
    }

    if (vnfInd > -1) {
      const allVnfs = this.get(`machineFields.${vnfInd}.vnfs`) || [];
      const locationVNFs = allVnfs.filter(f => f.location === location);
      const categorisedVNFs = this._getCategorizedVirtualNetworkFunctions(
        locationVNFs
      );
      this.set(`machineFields.${vnfInd}.subfields.0.options`, categorisedVNFs);
    }
  },

  _getLocationImages(location) {
    if (
      location &&
      this.model &&
      this.model.clouds &&
      this.selectedCloud &&
      this.model.clouds[this.selectedCloud]
      && this.model.clouds[this.selectedCloud].imagesArray
    )
      return this.model.clouds[this.selectedCloud].imagesArray.filter(
        im =>
          !im.locations || im.locations.indexOf(location) > -1
      );
    return [];
  },

  _updateFieldsForAzureArm() {
    const hostnameInd = this._fieldIndexByName('create_hostname_machine');
    if (hostnameInd > -1) this.set(`machineFields.${hostnameInd}.show`, false);
  },

  _updateKvmDiskPath(location, machinename) {
    const pathInd = this._fieldIndexByName('libvirt_disk_path');
    const locationPath =
      location.length &&
      this.model.clouds[this.selectedCloud] &&
      this.model.clouds[this.selectedCloud].locations &&
      this.model.clouds[this.selectedCloud].locations[location] &&
      this.model.clouds[this.selectedCloud].locations[location].extra
        ? this.model.clouds[this.selectedCloud].locations[location]
          .images_location
        : '';
    // fill in disk path using images_location and machine name
    if (machinename.trim().length && pathInd > -1)
      this.set(
        `machineFields.${pathInd}.value`,
        `${locationPath}/${machinename.trim()}.img`
      );
  },

  _updateKvmDiskPathName(name) {
    const ind = this._fieldIndexByName('location');
    const location = ind > -1 ? this.machineFields[ind].value : '';
    this._updateKvmDiskPath(location || '', name || '');
  },

  _updateKvmDiskPathFolder(location) {
    const ind = this._fieldIndexByName('name');
    const name = ind > -1 ? this.machineFields[ind].value : '';
    this._updateKvmDiskPath(location || '', name || '');
  },

  _updateAzureFields(machinename) {
    const networkInd = this._fieldIndexByName('new_network');
    if (networkInd > -1)
      this.set(`machineFields.${networkInd}.value`, `${machinename}-vnet`);
    const resourceInd = this._fieldIndexByName('new_resource_group');
    if (resourceInd > -1)
      this.set(`machineFields.${resourceInd}.value`, machinename);
    const storageInd = this._fieldIndexByName('new_storage_account');
    // storage account name must be lower case numbers and letters, length 3-24
    if (storageInd > -1)
      this.set(
        `machineFields.${storageInd}.value`,
        `${machinename
          .toLowerCase()
          .replace(/[^a-zA-Z0-9]+/g, '')
          .slice(0, 19)}disks`
      );
  },

  _updateMaxihostSizes(locationId) {
    // var locationInd = this._fieldIndexByName('location');
    const sizeInd = this._fieldIndexByName('size');
    const locationExternalId = this.model.clouds[this.selectedCloud].locations[
      locationId
    ].external_id;

    const allSizes =
      this._toArray(this.model.clouds[this.selectedCloud].sizes) || [];
    const filteredSizes = allSizes.filter(
      s => s.extra.regions.indexOf(locationExternalId) > -1
    );
    this.set(`machineFields.${sizeInd}.options`, filteredSizes);
    // clear previous value if not in filtered sizes
    if (
      this.machineFields[sizeInd].value !== '' &&
      filteredSizes
        .map(x => x.id)
        .indexOf(this.machineFields[sizeInd].value) === -1
    ) {
      this.set(`machineFields.${sizeInd}.value`, '');
    }
    // console.log('maxihost ', locationExternalId, filteredSizes.map(x=>x.extra.regions));
  },

  _updateGceSubnets(networkId) {
    const subnetsInd = this._fieldIndexByName('subnetwork');
    const network =
      networkId && this.model.clouds[this.selectedCloud].networks[networkId];
    if (subnetsInd && network && network.extra.mode === 'custom') {
      const subnetsOptions = this.model.clouds[this.selectedCloud].networks[
        networkId
      ].subnets
        .map(x => x.name)
        .filter((v, i, a) => a.indexOf(v) === i)
        .map(x => ({
          id: x,
          name: x,
        }));
      this.set(`machineFields.${subnetsInd}.options`, subnetsOptions);
      if (subnetsOptions.length && subnetsInd > -1) {
        this.set(`machineFields.${subnetsInd}.show`, true);
        this.set(`machineFields.${subnetsInd}.required`, true);
      }
    } else if (subnetsInd && subnetsInd > -1 && network) {
      this.set(`machineFields.${subnetsInd}.options`, []);
      this.set(`machineFields.${subnetsInd}.show`, false);
      this.set(`machineFields.${subnetsInd}.required`, false);
      this.set(`machineFields.${subnetsInd}.value`, undefined);
    }
  },

  _toggleScriptFields(scripttype) {
    const inlineInd = this._fieldIndexByName('script');
    const selectInd = this._fieldIndexByName('script_id');

    // if one, exclude the other
    if (scripttype === 'inline') {
      if (inlineInd > -1)
        this.set(`machineFields.${inlineInd}.excludeFromPayload`, false);
      if (selectInd > -1)
        this.set(`machineFields.${selectInd}.excludeFromPayload`, true);
    } else if (scripttype === 'select') {
      if (selectInd > -1)
        this.set(`machineFields.${selectInd}.excludeFromPayload`, false);
      if (inlineInd > -1)
        this.set(`machineFields.${inlineInd}.excludeFromPayload`, true);
    }

    // console.log('_toggleScriptFields',this.get('machineFields.'+ inlineInd), this.get('machineFields.'+ selectInd))
  },

  _toggleExistingStorageAccounts(newResourceGroup) {
    const createStorAccInd = this._fieldIndexByName('create_storage_account');
    const existingResGroupInd = this._fieldIndexByName('ex_storage_account');
    // if user chooses create new resource group, so it must be for storage accounts and networks
    if (newResourceGroup) {
      this.set(`machineFields.${createStorAccInd}.value`, newResourceGroup);
    }
    this.set(`machineFields.${createStorAccInd}.hidden`, newResourceGroup);
    this.set(`machineFields.${existingResGroupInd}.show`, !newResourceGroup);
  },

  _toggleExistingNetworks(newResourceGroup) {
    const createNetworkInd = this._fieldIndexByName('create_network');
    const existingNetworkInd = this._fieldIndexByName('ex_networks');
    // if user chooses create new resource group, so it must be for storage accounts and networks
    if (newResourceGroup) {
      this.set(`machineFields.${createNetworkInd}.value`, newResourceGroup);
    }
    this.set(`machineFields.${createNetworkInd}.hidden`, newResourceGroup);
    this.set(`machineFields.${existingNetworkInd}.show`, !newResourceGroup);
  },

  _updateStorageAccountValue(_cloudId) {
    const createFieldIndex = this._fieldIndexByName('create_storage_account');
    const existingFieldIndex = this._fieldIndexByName('ex_storage_account');
    const newFieldIndex = this._fieldIndexByName('new_storage_account');
    const storageAccountFieldIndex = this._fieldIndexByName('storage_account');

    if (this.get(`machineFields.${createFieldIndex}.value`) === true) {
      this.set(
        `machineFields.${storageAccountFieldIndex}.value`,
        this.get(`machineFields.${newFieldIndex}.value`)
      );
    } else {
      this.set(
        `machineFields.${storageAccountFieldIndex}.value`,
        this.get(`machineFields.${existingFieldIndex}.value`)
      );
    }
  },

  _updateStorageAccounts(cloudId) {
    const fieldIndex = this._fieldIndexByName('ex_storage_account');
    if (
      fieldIndex > -1 &&
      this.get(`machineFields.${fieldIndex}.options`) &&
      !this.get(`machineFields.${fieldIndex}.options`).length
    ) {
      this._getStorageAccounts(cloudId, fieldIndex);
    }
  },

  _getStorageAccounts(cloudId, index) {
    this.set('storageAccountsFieldIndex', index);
    this.$.getStorageAccounts.headers['Content-Type'] = 'application/json';
    this.$.getStorageAccounts.headers['Csrf-Token'] = CSRFToken.value;
    this.$.getStorageAccounts.url = `/api/v1/clouds/${cloudId}/storage-accounts`;
    this.$.getStorageAccounts.generateRequest();
  },

  _handleGetStorageAccountsRequest(_e) {
    this.set(`machineFields.${this.storageAccountsFieldIndex}.loader`, true);
  },

  _handleGetStorageAccountsResponse(e) {
    this.set(
      `machineFields.${this.storageAccountsFieldIndex}.alloptions`,
      e.detail.response || []
    );
    this._filterStorageAccountsOptions();
    this.set(`machineFields.${this.storageAccountsFieldIndex}.loader`, false);
  },

  _filterStorageAccountsOptions() {
    const resourceGroupFieldIndex = this._fieldIndexByName('resource_group');
    const locationFieldIndex = this._fieldIndexByName('location');
    const resourceGroup = this.get(
      `machineFields.${resourceGroupFieldIndex}.value`
    );
    const location = this.get(`machineFields.${locationFieldIndex}.value`);
    let options = [];
    if (resourceGroup && location) {
      options = this.get(
        `machineFields.${this.storageAccountsFieldIndex}.alloptions`
      ).filter(
        o => o.resource_group === resourceGroup && o.location === location
      );
    }
    // console.log('_filterStorageAccountsOptions', resourceGroup, location, options.length)
    this.set(
      `machineFields.${this.storageAccountsFieldIndex}.value`,
      this.get(`machineFields.${this.storageAccountsFieldIndex}.defaultValue`)
    );
    this.set(
      `machineFields.${this.storageAccountsFieldIndex}.options`,
      options
    );
    this.shadowRoot.querySelector('app-form').dispatchEvent(
      new CustomEvent('fields-changed', {
        detail: {
          file: 'machine-create.html : _filterStorageAccountsOptions()',
        },
      })
    );
  },

  _filterNetworksOptions() {
    const resourceGroupFieldIndex = this._fieldIndexByName('resource_group');
    const locationFieldIndex = this._fieldIndexByName('location');
    const resourceGroup = this.get(
      `machineFields.${resourceGroupFieldIndex}.value`
    );
    const location = this.get(`machineFields.${locationFieldIndex}.value`);
    const netInd = this._fieldIndexByName('ex_networks');
    let options = [];
    if (
      resourceGroupFieldIndex > -1 &&
      locationFieldIndex > -1 &&
      resourceGroup &&
      location
    ) {
      options = this._toArray(
        this.model.clouds[this.selectedCloud].networks
      ).filter(
        n => n.location === location && n.resource_group === resourceGroup
      );
    }
    // console.log('_filterNetworksOptions', resourceGroup, location, options.length)
    this.set(
      `machineFields.${netInd}.value`,
      this.get(`machineFields.${netInd}.defaultValue`)
    );
    this.set(`machineFields.${netInd}.options`, options);
    this.shadowRoot.querySelector('app-form').dispatchEvent(
      new CustomEvent('fields-changed', {
        detail: { file: 'machine-create.html : _filterNetworksOptions()' },
      })
    );
  },

  _handleGetStorageAccountsError(e) {
    console.error('Got storage accounts error', e);
  },

  _updateResourceGroupValue(_cloudId) {
    const createFieldIndex = this._fieldIndexByName('create_resource_group');
    const existingFieldIndex = this._fieldIndexByName('ex_resource_group');
    const newFieldIndex = this._fieldIndexByName('new_resource_group');
    const resourceGroupFieldIndex = this._fieldIndexByName('resource_group');

    if (this.get(`machineFields.${createFieldIndex}.value`) === true) {
      this.set(
        `machineFields.${resourceGroupFieldIndex}.value`,
        this.get(`machineFields.${newFieldIndex}.value`)
      );
    } else {
      this.set(
        `machineFields.${resourceGroupFieldIndex}.value`,
        this.get(`machineFields.${existingFieldIndex}.value`)
      );
    }
  },

  _updateSecurityGroups(cloudId) {
    const fieldIndex = this._fieldIndexByName('security_group');
    if (
      fieldIndex > -1 &&
      this.get(`machineFields.${fieldIndex}.options`) &&
      !this.get(`machineFields.${fieldIndex}.options`).length
    ) {
      this._getSecurityGroups(cloudId, fieldIndex);
    }
  },

  _getSecurityGroups(cloudId, index) {
    this.set('securityGroupsFieldIndex', index);
    this.$.getSecurityGroups.headers['Content-Type'] = 'application/json';
    this.$.getSecurityGroups.headers['Csrf-Token'] = CSRFToken.value;
    this.$.getSecurityGroups.url = `/api/v1/clouds/${cloudId}/security-groups`;
    this.$.getSecurityGroups.generateRequest();
  },

  _handleGetSecurityGroupsRequest(_e) {
    this.set(`machineFields.${this.securityGroupsFieldIndex}.loader`, true);
  },

  _handleGetSecurityGroupsResponse(e) {
    const secGroups = [];
    if (
      this.cloud.provider === 'openstack' ||
      this.cloud.provider === 'vexxhost'
    ) {
      for (let i = 0; i < e.detail.response.length; i++) {
        secGroups.push({
          name: e.detail.response[i].name,
          description: e.detail.response[i].description,
          id: e.detail.response[i].id,
        });
      }
    } else {
      for (let i = 0; i < e.detail.response.length; i++)
        secGroups.push({
          title: e.detail.response[i].name,
          val: e.detail.response[i].id,
        });
    }
    this.set(
      `machineFields.${this.securityGroupsFieldIndex}.options`,
      secGroups || []
    );
    this.shadowRoot.querySelector('app-form').dispatchEvent(
      new CustomEvent('fields-changed', {
        detail: {
          file: 'machine-create.html : _handleGetSecurityGroupsResponse()',
        },
      })
    );
    this.set(`machineFields.${this.securityGroupsFieldIndex}.loader`, false);
  },

  _handleGetSecurityGroupsError(e) {
    console.error('Got security groups error', e);
  },

  _updateResourceGroups(cloudId) {
    const fieldIndex = this._fieldIndexByName('ex_resource_group');
    if (
      fieldIndex > -1 &&
      this.get(`machineFields.${fieldIndex}.options`) &&
      !this.get(`machineFields.${fieldIndex}.options`).length
    ) {
      this._getResourceGroups(cloudId, fieldIndex);
    }
  },

  _getResourceGroups(cloudId, index) {
    this.set('resourceGroupsFieldIndex', index);
    this.$.getResourceGroups.headers['Content-Type'] = 'application/json';
    this.$.getResourceGroups.headers['Csrf-Token'] = CSRFToken.value;
    this.$.getResourceGroups.url = `/api/v1/clouds/${cloudId}/resource-groups`;
    this.$.getResourceGroups.generateRequest();
  },

  _handleGetResourceGroupsRequest(_e) {
    this.set(`machineFields.${this.resourceGroupsFieldIndex}.loader`, true);
  },

  _handleGetResourceGroupsResponse(e) {
    this.set(
      `machineFields.${this.resourceGroupsFieldIndex}.options`,
      e.detail.response || []
    );
    this.shadowRoot.querySelector('app-form').dispatchEvent(
      new CustomEvent('fields-changed', {
        detail: {
          file: 'machine-create.html : _handleGetResourceGroupsResponse()',
        },
      })
    );
    this.set(`machineFields.${this.resourceGroupsFieldIndex}.loader`, false);
  },

  _handleGetResourceGroupsError(e) {
    console.error('Got resource groups error', e);
  },

  _updateStorageClasses(cloudId, field) {
    if (field && field.options && !field.options.length) {
      this._getStorageClasses(cloudId, field);
    }
  },

  _getStorageClasses(cloudId, field) {
    this.set('storageClassesField', field);
    this.$.getStorageClasses.headers['Content-Type'] = 'application/json';
    this.$.getStorageClasses.headers['Csrf-Token'] = CSRFToken.value;
    this.$.getStorageClasses.url = `/api/v1/clouds/${cloudId}/storage-classes`;
    this.$.getStorageClasses.generateRequest();
  },

  _handleGetStorageClassesRequest(_e) {
    this.storageClassesField.loader = true;
  },

  _handleGetStorageClassesResponse(e) {
    const options = [];
    e.detail.response.forEach(item => {
      options.push({ title: item, val: item });
    });
    this.storageClassesField.options = options;
    this.shadowRoot.querySelector('app-form').dispatchEvent(
      new CustomEvent('fields-changed', {
        detail: {
          file: 'machine-create.html : _handleGetStorageClassesResponse()',
        },
      })
    );
    this.storageClassesField.loader = false;
  },

  _handleGetStorageClassesError(e) {
    console.error('Got storage classes error ', e);
  },

  _updateFolders(cloudId, field) {
    if (field && field.options && !field.options.length) {
      this._getFolders(cloudId, field);
    }
  },

  _getFolders(cloudId, field) {
    this.set('foldersField', field);
    this.$.getFolders.headers['Content-Type'] = 'application/json';
    this.$.getFolders.headers['Csrf-Token'] = CSRFToken.value;
    this.$.getFolders.url = `/api/v1/clouds/${cloudId}/folders`;
    this.$.getFolders.generateRequest();
  },

  _handleGetFoldersRequest(_e) {
    this.foldersField.loader = true;
  },

  _handleGetFoldersResponse(e) {
    const options = [];
    e.detail.response.forEach(item => {
      options.push({ title: item.name, val: item.id });
    });
    this.foldersField.options = options;
    // this.set('machineFields.'+this.machineFields.indexOf(this.foldersField)+'.options', options);
    this.shadowRoot.querySelector('app-form').dispatchEvent(
      new CustomEvent('fields-changed', {
        detail: { file: 'machine-create.html : _handleGetFoldersResponse()' },
      })
    );
    this.foldersField.loader = false;
    if (options && options.length > 0) {
      // this.foldersField.value= this.foldersField.options[0].val;
      this.set(
        `machineFields.${this.machineFields.indexOf(this.foldersField)}.show`,
        true
      );
    }
  },

  _updateDatastores(cloudId, field) {
    if (field && field.options && !field.options.length) {
      this._getDatastores(cloudId, field);
    }
  },

  _getDatastores(cloudId, field) {
    this.set('datastoresField', field);
    this.$.getDatastores.headers['Content-Type'] = 'application/json';
    this.$.getDatastores.headers['Csrf-Token'] = CSRFToken.value;
    this.$.getDatastores.url = `/api/v1/clouds/${cloudId}/datastores`;
    this.$.getDatastores.generateRequest();
  },

  _handleGetDatastoresRequest(_e) {
    this.datastoresField.loader = true;
  },

  _handleGetDatastoresResponse(e) {
    const options = [];
    e.detail.response.forEach(item => {
      const space = Math.floor(item.free_space / (1024 * 1024 * 1024));
      const name = `${item.name}  Free: ${space} GB`;
      options.push({ title: name, val: item.id, space: item.free_space });
    });
    this.datastoresField.options = options;
    this.shadowRoot.querySelector('app-form').dispatchEvent(
      new CustomEvent('fields-changed', {
        detail: { file: 'machine-create.html : _handleGetFoldersResponse()' },
      })
    );
    this.datastoresField.loader = false;
    if (options && options.length > 0) {
      let showDatastores = true;
      if (this.constraints && this.constraints.field) {
        const datastoreConstraint = this.constraints.field.find(
          c =>
            c.name === 'datastore' &&
            (c.cloud === this.selectedCloud || c.cloud === 'ALL')
        );
        if (
          datastoreConstraint !== undefined &&
          datastoreConstraint.show !== undefined
        ) {
          showDatastores = datastoreConstraint.show;
        }
      }
      this.set(
        `machineFields.${this.machineFields.indexOf(
          this.datastoresField
        )}.show`,
        showDatastores
      );
    }
  },

  _updateLXDStoragePools(cloudId) {
    // var fieldIndex = this._fieldIndexByName('pool_id');
    // console.warn("!!!!!!!!!!!", fieldIndex,this.get('machineFields.' + this.lxdStoragePoolsFieldIndex));
    if (
      this.lxdStoragePoolsField.options &&
      !this.lxdStoragePoolsField.options.length
    ) {
      this._getLXDStoragePools(cloudId);
    }
  },

  _getLXDStoragePools(cloudId) {
    // this.set("lxdStoragePoolsFieldIndex",index);
    this.$.getLXDStoragePools.headers['Content-Type'] = 'application/json';
    this.$.getLXDStoragePools.headers['Csrf-Token'] = CSRFToken.value;
    this.$.getLXDStoragePools.url = `/api/v1/clouds/${cloudId}/storage-pools`;
    this.$.getLXDStoragePools.generateRequest();
  },

  _handleGetLXDStoragePoolsRequest(_e) {
    this.lxdStoragePoolsField.loader = true;
  },

  _handleGetLXDStoragePoolsResponse(e) {
    this.lxdStoragePoolsField.options = e.detail.response || [];
    this.shadowRoot.querySelector('app-form').dispatchEvent(
      new CustomEvent('fields-changed', {
        detail: {
          file: 'machine-create.html : _handleGetLXDStoragePoolsResponse()',
        },
      })
    );
    this.lxdStoragePoolsField.loader = false;
  },

  _handleGetLXDStoragePoolsError(e) {
    console.error('Got LXD storage pools error error', e);
  },

  _updateVirtualNetworkFunctions(cloudId) {
    const fieldIndex = this._fieldIndexByName('vnfs');
    if (
      fieldIndex > -1 &&
      this.get(`machineFields.${fieldIndex}.subfields.0.options`) &&
      !this.get(`machineFields.${fieldIndex}.subfields.0.options`).length
    ) {
      this._getVirtualNetworkFunctions(cloudId, fieldIndex);
    }
  },

  _getVirtualNetworkFunctions(cloudId, index) {
    this.set('virtualNetworkFunctionFieldIndex', index);
    this.$.getVirtualNetworkFunctions.headers['Content-Type'] =
      'application/json';
    this.$.getVirtualNetworkFunctions.headers['Csrf-Token'] = CSRFToken.value;
    this.$.getVirtualNetworkFunctions.url = `/api/v1/clouds/${cloudId}/vnfs`;
    this.$.getVirtualNetworkFunctions.generateRequest();
  },

  _handleGetVirtualNetworkFunctionsRequest(_e) {
    this.set(
      `machineFields.${this.virtualNetworkFunctionFieldIndex}.loader`,
      true
    );
  },

  _handleGetVirtualNetworkFunctionsResponse(e) {
    const vnfs = [];
    for (let i = 0; i < e.detail.response.length; i++) {
      if (e.detail.response[i].interface) {
        vnfs.push(e.detail.response[i]);
      }
    }
    this.set(
      `machineFields.${this.virtualNetworkFunctionFieldIndex}.vnfs`,
      vnfs || []
    );

    const locInd = this._fieldIndexByName('location');
    const location = this.get(`machineFields.${locInd}.value`);
    const locationVNFs = location
      ? vnfs.filter(f => f.location === location)
      : vnfs;
    const categorisedVNFs = this._getCategorizedVirtualNetworkFunctions(
      locationVNFs
    );

    this.set(
      `machineFields.${this.virtualNetworkFunctionFieldIndex}.subfields.0.options`,
      categorisedVNFs || []
    );
    this.shadowRoot.querySelector('app-form').dispatchEvent(
      new CustomEvent('fields-changed', {
        detail: {
          file:
            'machine-create.html : _handleGetVirtualNetworkFunctionsResponse()',
        },
      })
    );
    this.set(
      `machineFields.${this.virtualNetworkFunctionFieldIndex}.loader`,
      false
    );
  },

  _getCategorizedVirtualNetworkFunctions(arr) {
    let categories = []; // store names
    const categoriesObjects = {}; // store items
    for (let i = 0; i < arr.length; i++) {
      const catName = `NUMA ${arr[i].numa}`; // Category name
      if (categories.indexOf(catName) <= -1) {
        // store category name and initialise category
        categories.push(catName);
        categoriesObjects[catName] = [];
      }
      const item = {
        name: arr[i].interface,
        id: arr[i].pci_bdf,
        description: arr[i].pci_bdf,
        location: arr[i].location,
        tooltip: `${arr[i].device.vendor} ${arr[i].device.name}`,
      };
      // store item under its category name
      categoriesObjects[catName].push(item);
    }
    // merge category names with items
    let categorisedArray = [];
    categories = categories.reverse();
    for (let i = 0; i < categories.length; i++) {
      const cat = categories[i];
      categorisedArray.push(cat);
      categorisedArray = categorisedArray.concat(categoriesObjects[cat]);
    }
    // return categorisedArray or default array
    return (
      categorisedArray ||
      arr.map(x => ({
        name: x.interface,
        id: x.pci_bdf,
        location: x.location,
        description: `${x.pci_bdf} - ${x.device.vendor} ${x.device.name}`,
      }))
    );
  },

  _handleGetVirtualNetworkFunctionsError(e) {
    console.error('Got security groups error', e);
  },

  _subfieldEnabled(e) {
    if (e.detail.field.name === 'vnfs')
      this._updateVirtualNetworkFunctions(this.cloud.id);
  },

  _updateNetworkValue() {
    const createFieldIndex = this._fieldIndexByName('create_network');
    const existingFieldIndex = this._fieldIndexByName('ex_networks');
    const newFieldIndex = this._fieldIndexByName('new_network');
    const networksFieldIndex = this._fieldIndexByName('networks');
    const networks = [];
    if (this.get(`machineFields.${createFieldIndex}.value`) === true) {
      networks.push({ name: this.get(`machineFields.${newFieldIndex}.value`) });
    } else {
      networks.push({
        id: this.get(`machineFields.${existingFieldIndex}.value`),
      });
    }
    this.set(`machineFields.${networksFieldIndex}.value`, networks);
  },

  _hideElementsforWin(value) {
    const scriptInd = this._fieldIndexByName('post_provision_script');
    const monitoringInd = this._fieldIndexByName('monitoring');

    if (value && value.toLowerCase().indexOf('win') > -1) {
      if (scriptInd > -1) this.set(`machineFields.${scriptInd}.show`, false);
      if (monitoringInd > -1) {
        this.set(`machineFields.${monitoringInd}.show`, false);
        this.set(`machineFields.${monitoringInd}.value`, false);
      }
    } else {
      if (scriptInd > -1) this.set(`machineFields.${scriptInd}.show`, true);
      if (monitoringInd > -1) {
        this.set(`machineFields.${monitoringInd}.show`, true);
        this.set(
          `machineFields.${monitoringInd}.value`,
          this.get(`machineFields.${monitoringInd}.defaultValue`)
        );
      }
    }
  },

  _showPassword(value) {
    const passwordInd = this._fieldIndexByName('machine_password');
    const keyInd = this._fieldIndexByName('key');
    if (value && value.toLowerCase().indexOf('win') > -1 && passwordInd > -1) {
      this.set(`machineFields.${passwordInd}.show`, true);
      this.set(`machineFields.${passwordInd}.required`, true);
      if (keyInd > -1) {
        this.set(`machineFields.${keyInd}.show`, false);
        this.set(`machineFields.${keyInd}.required`, false);
      }
    } else {
      if (passwordInd > -1) {
        this.set(`machineFields.${passwordInd}.show`, false);
        this.set(`machineFields.${passwordInd}.required`, false);
      }
      if (keyInd > -1) {
        this.set(`machineFields.${keyInd}.show`, true);
      }
      // if the provider is Docker or onapp, the key should not be required
      if (
        ['docker', 'lxd', 'onapp', 'libvirt', 'vsphere', 'kubevirt'].indexOf(
          this.model.clouds[this.selectedCloud].provider
        ) < 0
      )
        if (keyInd > -1) {
          this.set(`machineFields.${keyInd}.required`, true);
        }
    }
  },

  _fieldIndexByName(name, context) {
    if (!context) {
      return this.machineFields.findIndex(f => f.name === name);
    }
    return context.findIndex(f => f.name === name);
  },

  _machineCreateResponse(e) {
    // console.log('creation resp', e);
    const response = JSON.parse(e.detail.xhr.response);
    // console.log('logs -- machine create response', response);
    this.dispatchEvent(
      new CustomEvent('set-job-id', {
        bubbles: true,
        composed: true,
        detail: response,
      })
    );

    this.dispatchEvent(
      new CustomEvent('go-to', {
        bubbles: true,
        composed: true,
        detail: {
          url: '/machines',
        },
      })
    );

    this._resetForm();
  },

  _machineCreateError(_e) {
    // console.log('creation failed', e)
  },

  _computeClouds(_model, _clouds) {
    // exclude bare metals and not allowed clouds from provider dropdown list
    return this._toArray(this.model.clouds).filter(
      c =>
        ['other'].indexOf(c.provider) === -1 &&
        this.checkPerm('cloud', 'create_resources', c.id)
    );
  },

  addInput(e) {
    if (
      e.detail.fieldname === 'schedule_script_id' ||
      e.detail.fieldname === 'script_id'
    ) {
      // set attribute origin
      const origin = window.location.pathname;
      const qParams = {
        origin,
      };
      this.dispatchEvent(
        new CustomEvent('go-to', {
          bubbles: true,
          composed: true,
          detail: {
            url: '/machines',
            params: qParams,
          },
        })
      );
    } else if (e.detail.fieldname === 'image') {
      this.shadowRoot.querySelector('paper-dialog#addKvmImage').open();
    }
  },

  saveNewImage(_e) {
    const imaInd = this._fieldIndexByName('image');
    if (imaInd > -1) {
      const opts = this.get(`machineFields.${imaInd}.options`);
      opts.push({
        name: this.newImage,
        id: this.newImage,
      });
      // hard reset fields
      this.set(`machineFields.${imaInd}.options`, []);
      this.set(`machineFields.${imaInd}.options`, opts);
      this.set(`machineFields.${imaInd}.value`, this.newImage);
      // console.log(this.get('machineFields.' + imaInd + '.value'));
    }

    this.shadowRoot.querySelector('paper-dialog#addKvmImage').close();
  },

  hotkeys(e) {
    // ENTER
    if (
      e.keyCode === 13 &&
      e.path.indexOf(
        this.shadowRoot.querySelector('paper-dialog#addKvmImage')
      ) > -1
    ) {
      this.saveNewImage(e);
    }
  },

  updateKeys(e) {
    const keyInd = this._fieldIndexByName('key');
    this.async(() => {
      if (keyInd > -1) {
        this.set(`machineFields.${keyInd}.options`, this.model.keysArray);
        if (e.detail.key)
          this.set(`machineFields.${keyInd}.value`, e.detail.key);
      }
    }, 1000);
  },

  _goBack() {
    window.history.back();
  },

  _getInterval() {
    const intervalInd = this._fieldIndexByName('schedule_entry_interval');
    let interval = {};
    if (intervalInd > -1) {
      interval =
        this.get(`machineFields.${intervalInd}.value`) ||
        this.get(`machineFields.${intervalInd}.defaultValue`);
    }
    return interval;
  },

  _updateFieldsForEquinixMetal(_e) {
    const ipAddresses = this._fieldIndexByName('ip_addresses');
    const ipv4Ind = this._fieldIndexByName('public_ipv4');
    const ipv6Ind = this._fieldIndexByName('public_ipv6');
    const ipv4SubSizeInd = this._fieldIndexByName('public_ipv4_subnet_size');
    const ipv6SubSizeInd = this._fieldIndexByName('public_ipv6_subnet_size');
    const privateIpv4SubSizeInd = this._fieldIndexByName(
      'private_ipv4_subnet_size'
    );
    const ipv4 =
      ipv4Ind > -1 ? this.get(`machineFields.${ipv4Ind}.value`) : false;
    const ipv6 =
      ipv6Ind > -1 ? this.get(`machineFields.${ipv6Ind}.value`) : false;
    const ipv4SubSize =
      ipv4SubSizeInd > -1
        ? this.get(`machineFields.${ipv4SubSizeInd}.value`)
        : '';
    const ipv6SubSize =
      ipv6SubSizeInd > -1
        ? this.get(`machineFields.${ipv6SubSizeInd}.value`)
        : '';
    const privateIpv4SubSize =
      privateIpv4SubSizeInd > -1
        ? this.get(`machineFields.${privateIpv4SubSizeInd}.value`)
        : '';
    const formattedIpAddresses = [];
    if (ipv4) {
      const formattedIpv4 = {
        address_family: 4,
        public: ipv4,
      };
      if (ipv4SubSize.length) {
        formattedIpv4.cidr = ipv4SubSize;
      }
      formattedIpAddresses.push(formattedIpv4);
    }
    if (ipv6) {
      const formattedIpv6 = {
        address_family: 6,
        public: ipv6,
      };
      if (ipv6SubSize.length) {
        formattedIpv6.cidr = ipv6SubSize;
      }
      formattedIpAddresses.push(formattedIpv6);
    }
    const formattedPrivateIpv4 = {
      address_family: 4,
      public: false,
    };
    if (privateIpv4SubSize) {
      formattedPrivateIpv4.cidr = privateIpv4SubSize;
    }
    formattedIpAddresses.push(formattedPrivateIpv4);

    this.set(`machineFields.${ipAddresses}.value`, formattedIpAddresses);
  },

  _processCrotab(entry) {
    let construct = {};
    if (entry) {
      const chunchs = entry.split(' ');
      // fill in missin
      for (let i = 0; i < 5; i++) {
        if (!chunchs[i]) chunchs[i] = '*';
      }
      const diff = moment().utcOffset() / 60;
      for (let i = 0; i < 5; i++) {
        if (!chunchs[i]) chunchs[i] = '*';
      }
      construct = {
        minute: chunchs[0],
        hour: chunchs[1],
        day_of_month: chunchs[2],
        month_of_year: chunchs[3],
        day_of_week: chunchs[4],
      };
      if (construct.hour !== '*' && parseInt(chunchs[1], 10) && diff) {
        construct.hour = ((parseInt(chunchs[1], 10) - diff) % 24).toString();
      }
    }
    return construct;
  },

  updateScripts(e) {
    const scheduleScriptInd = this._fieldIndexByName('schedule_script_id');
    this.async(() => {
      if (scheduleScriptInd > -1) {
        this.set(
          `machineFields.${scheduleScriptInd}.options`,
          this.model.scriptsArray || []
        );
        this.set(`machineFields.${scheduleScriptInd}.value`, e.detail.script);
      }
    }, 1000);
  },

  formatPayload(_e) {
    const hostnameInd = this._fieldIndexByName('hostname');
    let composedHostname = '';
    const hostname = this.get(`machineFields.${hostnameInd}.value`);
    const vnfsInd = this._fieldIndexByName('vnfs');
    const vnfs = this.get(`machineFields.${vnfsInd}.value`);
    if (hostname) {
      if (hostname.record_name && hostname.dns_zone) {
        const domainName = this.model.zones[hostname.dns_zone].domain;
        composedHostname = `${hostname.record_name}.${domainName}`;
      }
      this.set(`machineFields.${hostnameInd}.value`, composedHostname);
    }
    if (vnfs && vnfs.vnfs) {
      this.set(`machineFields.${vnfsInd}.value`, vnfs.vnfs);
    }
  },

  _hasClouds(clouds) {
    if (clouds && clouds.length) return true;
    return false;
  },

  _toArray(x, _z) {
    if (x) {
      return Object.keys(x).map(y => x[y]);
    }
    return [];
  },

  _cleanCopy(value, property) {
    let newValue;
    if (value === null) return null;
    if (typeof value === 'string') {
      newValue = '';
      newValue = value.slice(0);
    } else if (typeof value === 'object') {
      if (Array.isArray(value)) {
        newValue = [];
        for (let i = 0; i < value.length; i++) {
          newValue[i] = this._cleanCopy(value[i], property);
        }
      } else {
        newValue = {};
        Object.keys(value || {}).forEach(q => {
          newValue[q] = this._cleanCopy(value[q], q);
        });
      }
    } else {
      newValue = value;
    }
    return newValue;
  },

  _cloudsChanged(clouds) {
    if (clouds.length >= 1) {
      const localStorageCloud = localStorage.getItem('createMachine#cloud');
      let selectedCloud = '';
      if (localStorageCloud === 'false' || localStorageCloud == null) {
        let maxMachines = 0;
        for (const cloud of clouds) {
          if (
            cloud.machines &&
            Object.keys(cloud.machines).length > maxMachines
          ) {
            maxMachines = Object.keys(cloud.machines).length;
            selectedCloud = cloud.id;
          }
        }
      } else selectedCloud = localStorageCloud;
      this.set('selectedCloud', selectedCloud);
    }
  },

  _checkSizeLocationOptions(event) {
    event.stopPropagation();
    if (this.selectedCloud && this.model.clouds) {
      const sizeInd = this._fieldIndexByName('size');
      const locInd = this._fieldIndexByName('location');
      const sizesLen = Object.keys(
        this.model.clouds[this.selectedCloud].sizes || {}
      ).length;
      const locationsLen = Object.keys(
        this.model.clouds[this.selectedCloud].locations || {}
      ).length;
      if (
        (sizeInd > -1 &&
          this.machineFields[sizeInd].options.length === 0 &&
          !this.machineFields[sizeInd].custom &&
          sizesLen > 0) ||
        (locInd > -1 &&
          this.machineFields[locInd].options.length === 0 &&
          locationsLen > 0)
      ) {
        // save values that user already introduced because
        // _cloudChanged will reset them
        const existingValues = [];
        const maxInd = Math.max(sizeInd, locInd);
        let counter = 0;
        while (counter < maxInd) {
          if (counter !== sizeInd || counter !== locInd)
            existingValues.push(this.machineFields[counter].value);
          counter++;
        }
        this._cloudChanged(this.selectedCloud);
        // reintroduce saved values
        counter = 0;
        while (counter < maxInd) {
          if (counter !== sizeInd || counter !== locInd)
            this.machineFields[counter].value = existingValues[counter];
          counter++;
        }
      }
    }
  },
});
