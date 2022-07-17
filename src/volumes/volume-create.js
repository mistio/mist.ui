import '@polymer/polymer/polymer-legacy.js';
import '@polymer/paper-material/paper-material.js';
import '@polymer/paper-button/paper-button.js';
import '@polymer/paper-progress/paper-progress.js';
import '@polymer/paper-styles/typography.js';
import '@polymer/paper-listbox/paper-listbox.js';
import '../app-form/app-form.js';
import { Polymer } from '@polymer/polymer/lib/legacy/polymer-fn.js';
import { html } from '@polymer/polymer/lib/utils/html-tag.js';
import { CSRFToken } from '../helpers/utils.js';
import { VOLUME_CREATE_FIELDS } from '../helpers/volume-create-fields.js';

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
        @apply --volume-page-head-mixin;
      }
    </style>
    <div id="content">
      <paper-material class="single-head layout horizontal">
        <span class="icon">
          <iron-icon icon="[[section.icon]]"></iron-icon>
        </span>
        <div class="title flex">
          <h2>Create Volume</h2>
          <div class="subtitle"></div>
        </div>
      </paper-material>
      <paper-material hidden$="[[hasCloudsWithVolumes]]">
        <p>
          Creating volumes is available in OpenStack, GCE, AWS, Azure ARM, LXD,
          Aliyun, Kubevirt, Linode, Vexxhost, Vultr and DigitalOcean clouds
          <br />
          <span hidden$="[[!checkPerm('cloud', 'add')]]">
            Add a cloud using the
            <a href="/clouds/+add" class="blue-link regular">add cloud form</a>.
          </span>
        </p>
      </paper-material>
      <paper-material hidden$="[[!hasCloudsWithVolumes]]">
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
                    src="[[_computeCloudLogo(cloud.provider)]]"
                    width="24px"
                    alt="[[cloud.provider]]"
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
            id="volume_add"
            fields="{{fields}}"
            form="[[form]]"
            url="/api/v1/clouds/[[selectedCloud]]/volumes"
            on-response="_handleCreateVolumeResponse"
            on-error="_handleError"
          ></app-form>
        </paper-material>
      </template>
    </div>
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
      id="getStorageClasses"
      contenttype="application/json"
      handle-as="json"
      method="GET"
      on-request="_handleGetStorageClassesRequest"
      on-response="_handleGetStorageClassesResponse"
      on-error="_handleGetStorageClassesError"
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
  `,

  is: 'volume-create',
  behaviors: [window.rbac],

  properties: {
    section: {
      type: Object,
    },
    model: {
      type: Object,
    },
    clouds: Array,
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
    volumesFields: {
      type: Array,
      value() {
        return VOLUME_CREATE_FIELDS;
      },
    },
    hasCloudsWithVolumes: {
      type: Boolean,
      value: false,
    },
    selectedCloud: {
      type: String,
      value: false,
    },
    resourceGroupsFieldIndex: {
      type: Number,
    },
    storageClassesFieldIndex: {
      type: Number,
    },
    lxdStoragePoolsFieldIndex: {
      type: Number,
    },
  },

  observers: [
    '_cloudsChanged(model.clouds.*)',
    '_cloudChanged(selectedCloud)',
    '_locationChanged(fields.1.value)',
    '_diskCategoryChanged(fields.3.value)',
    '_fieldValuesChanged(fields.*)',
  ],

  _cloudsChanged() {
    const volumeClouds =
      this.model &&
      this.model.cloudsArray.filter(
        cloud =>
          VOLUME_CREATE_FIELDS.map(i => i.provider).indexOf(cloud.provider) > -1
      );
    this.set('clouds', volumeClouds);
    this.set(
      'hasCloudsWithVolumes',
      !!(volumeClouds && volumeClouds.length > 0)
    );
  },

  _computeCloudLogo(className) {
    const identifier = className.replace('_', '');
    return `assets/providers/provider-${identifier}.png`;
  },

  _isOnline(cloud) {
    return (
      this.model.clouds[cloud] && this.model.clouds[cloud].state === 'online'
    );
  },

  _cloudChanged(selectedCloud) {
    // clear to reset
    this.set('fields', []);
    let volumeFields = {};
    if (this.selectedCloud) {
      const { provider } = this.model.clouds[selectedCloud];
      volumeFields = this.volumesFields.find(c => c.provider === provider);
    }
    // add cloud fields
    if (volumeFields.fields)
      this.set(
        'fields',
        JSON.parse(
          JSON.stringify(
            volumeFields.fields.filter(
              f => f.onForm === 'volume_add' || !f.onForm
            )
          )
        )
      );
    this._updateFields(selectedCloud);
  },

  _updateFields() {
    if (
      this.model &&
      this.model.clouds &&
      this.selectedCloud &&
      this.model.clouds[this.selectedCloud]
    ) {
      const cloudId = this.selectedCloud;
      // if is azure arm, change required values
      if (this.model.clouds[cloudId].provider === 'azure_arm') {
        this._updateResourceGroups(cloudId);
      }
      if (
        this.model.clouds[cloudId].provider === 'kubevirt' ||
        this.model.clouds[cloudId].provider === 'openstack' ||
        this.model.clouds[cloudId].provider === 'vexxhost'
      ) {
        this._updateStorageClasses(cloudId);
      }

      if (this.model.clouds[cloudId].provider === 'lxd') {
        this._updateLXDStoragePools(cloudId);
      }
      /* eslint-disable no-param-reassign */
      this.fields.forEach(f => {
        if (f.name.endsWith('location')) {
          let locations = this.model.clouds[cloudId].locationsArray
            ? this.model.clouds[cloudId].locationsArray.filter(
                loc => loc.location_type !== 'region'
              )
            : [];
          if (locations.length === 1 && locations[0].name === '') {
            // If there's a single location preselect it and hide the field
            f.value = locations[0].id;
            f.show = false;
            locations = [];
          }
          if (this.model.clouds[cloudId].provider === 'packet') {
            locations = locations.filter(l => {
              if (l.extra.features.indexOf('storage') > -1) {
                return true;
              }
              return false;
            });
          } else if (this.model.clouds[cloudId].provider === 'aliyun_ecs') {
            locations = locations.filter(l => {
              if (l.extra.available_disk_categories.length) {
                return true;
              }
              return false;
            });
          } else if (
            this.model.clouds[cloudId].provider === 'openstack' ||
            this.model.clouds[cloudId].provider === 'vexxhost'
          ) {
            locations = locations.filter(l => l.capabilities && l.capabilities.indexOf("storage") > -1);
          } else if (this.model.clouds[cloudId].provider === 'vultr') {
            locations = locations.filter(
              l => l.extra.option.includes('block_storage') === true
            );
          }
          f.options = locations;
        }
      }, this);
      /* eslint-enable no-param-reassign */
    }
  },

  _locationChanged(locationId) {
    if (
      !locationId ||
      !this.selectedCloud ||
      !this.model.clouds[this.selectedCloud]
    )
      return;
    const { provider } = this.model.clouds[this.selectedCloud].provider;
    const location = this.model.clouds[this.selectedCloud].locations[
      locationId
    ];
    if (provider === 'aliyun_ecs') {
      const diskCategoryOptions = this.volumesFields
        .find(cloud => cloud.provider === provider)
        .fields[3].options.filter(
          option =>
            location.extra.available_disk_categories.indexOf(option.val) > -1
        );
      this.set('fields.3.options', diskCategoryOptions);
    }
  },

  _diskCategoryChanged(diskCategory) {
    if (
      !diskCategory ||
      !this.selectedCloud ||
      !this.model.clouds[this.selectedCloud]
    )
      return;
    const { provider } = this.model.clouds[this.selectedCloud].provider;
    let minSize = 1;
    if (provider === 'aliyun_ecs') {
      if (diskCategory !== 'cloud') {
        minSize = 20;
      } else {
        minSize = 5;
      }
      this.set('fields.2.min', minSize);
      if (Number(this.fields[2].value) < minSize) {
        this.set('fields.2.value', minSize);
      }
      this.set('fields.2.helptext', `A minimum of ${minSize} GB is required.`);
    }
  },

  _fieldValuesChanged(changeRecord) {
    const fieldName = this.get(changeRecord.path.replace('.value', '')).name;
    if (
      [
        'create_resource_group',
        'ex_resource_group',
        'new_resource_group',
      ].indexOf(fieldName) > -1
    ) {
      this._updateResourceGroupValue(this.selectedCloud);
    }
  },

  _updateResourceGroupValue() {
    const createFieldIndex = this._fieldIndexByName('create_resource_group');
    const existingFieldIndex = this._fieldIndexByName('ex_resource_group');
    const newFieldIndex = this._fieldIndexByName('new_resource_group');
    const resourceGroupFieldIndex = this._fieldIndexByName('resource_group');

    if (this.get(`fields.${createFieldIndex}.value`) === true) {
      this.set(
        `fields.${resourceGroupFieldIndex}.value`,
        this.get(`fields.${newFieldIndex}.value`)
      );
    } else {
      this.set(
        `fields.${resourceGroupFieldIndex}.value`,
        this.get(`fields.${existingFieldIndex}.value`)
      );
    }
  },

  _updateResourceGroups(cloudId) {
    const fieldIndex = this._fieldIndexByName('ex_resource_group');
    if (
      fieldIndex &&
      this.get(`fields.${fieldIndex}.options`) &&
      !this.get(`fields.${fieldIndex}.options`).length
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

  _handleGetResourceGroupsRequest() {
    this.set(`fields.${this.resourceGroupsFieldIndex}.loader`, true);
  },

  _handleGetResourceGroupsResponse(e) {
    this.set(
      `fields.${this.resourceGroupsFieldIndex}.options`,
      e.detail.response || []
    );
    this.shadowRoot.querySelector('app-form').dispatchEvent(
      new CustomEvent('fields-changed', {
        detail: { file: 'volume-create.html' },
      })
    );
    this.set(`fields.${this.resourceGroupsFieldIndex}.loader`, false);
  },

  _handleGetResourceGroupsError(e) {
    console.error('Got resource groups error', e);
  },

  _updateStorageClasses(cloudId) {
    const fieldIndex = this._fieldIndexByName('storage_class_name');
    if (
      fieldIndex &&
      this.get(`fields.${fieldIndex}.options`) &&
      !this.get(`fields.${fieldIndex}.options`).length
    ) {
      this._getStorageClasses(cloudId, fieldIndex);
    }
  },

  _getStorageClasses(cloudId, index) {
    this.set('storageClassesFieldIndex', index);
    this.$.getStorageClasses.headers['Content-Type'] = 'application/json';
    this.$.getStorageClasses.headers['Csrf-Token'] = CSRFToken.value;
    this.$.getStorageClasses.url = `/api/v1/clouds/${cloudId}/storage-classes`;
    this.$.getStorageClasses.generateRequest();
  },

  _handleGetStorageClassesRequest() {
    this.set(`fields.${this.storageClassesFieldIndex}.loader`, true);
  },

  _handleGetStorageClassesResponse(e) {
    const options = [];
    e.detail.response.forEach(item => {
      options.push({ title: item, val: item });
    });
    this.set(`fields.${this.storageClassesFieldIndex}.options`, options || []);
    this.shadowRoot.querySelector('app-form').dispatchEvent(
      new CustomEvent('fields-changed', {
        detail: { file: 'volume-create.html' },
      })
    );
    this.set(`fields.${this.storageClassesFieldIndex}.loader`, false);
  },

  _handleGetStorageClassesError(e) {
    console.error('Got storage classes error ', e);
  },

  _updateLXDStoragePools(cloudId) {
    const fieldIndex = this._fieldIndexByName('pool_id');
    if (
      fieldIndex &&
      this.get(`fields.${fieldIndex}.options`) &&
      !this.get(`fields.${fieldIndex}.options`).length
    ) {
      this._getLXDStoragePools(cloudId, fieldIndex);
    }
  },

  _getLXDStoragePools(cloudId, index) {
    this.set('lxdStoragePoolsFieldIndex', index);
    this.$.getLXDStoragePools.headers['Content-Type'] = 'application/json';
    this.$.getLXDStoragePools.headers['Csrf-Token'] = CSRFToken.value;
    this.$.getLXDStoragePools.url = `/api/v1/clouds/${cloudId}/storage-pools`;
    this.$.getLXDStoragePools.generateRequest();
  },

  _handleGetLXDStoragePoolsRequest() {
    this.set(`fields.${this.lxdStoragePoolsFieldIndex}.loader`, true);
  },

  _handleGetLXDStoragePoolsResponse(e) {
    this.set(
      `fields.${this.lxdStoragePoolsFieldIndex}.options`,
      e.detail.response || []
    );
    this.shadowRoot.querySelector('app-form').dispatchEvent(
      new CustomEvent('fields-changed', {
        detail: { file: 'volume-create.html' },
      })
    );
    this.set(`fields.${this.lxdStoragePoolsFieldIndex}.loader`, false);
  },

  _handleGetLXDStoragePoolsError(e) {
    console.error('Got LXD storage pools error error', e);
  },

  _fieldIndexByName(name) {
    const field = this.fields.findIndex(f => f.name === name);
    return field;
  },

  _handleCreateVolumeResponse() {
    // const response = JSON.parse(e.detail.xhr.response);
    this.dispatchEvent(
      new CustomEvent('go-to', {
        bubbles: true,
        composed: true,
        detail: {
          url: '/volumes',
        },
      })
    );
  },

  _handleError(e) {
    console.log(e);
    this.$.errormsg.textContent = e.detail.request.xhr.responseText;
    this.set('formError', true);
  },

  _goBack() {
    window.history.back();
  },
});
