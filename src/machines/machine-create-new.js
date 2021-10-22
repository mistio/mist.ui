import '@polymer/polymer/polymer-legacy.js';
import '@polymer/paper-material/paper-material.js';
import '@polymer/paper-dropdown-menu/paper-dropdown-menu.js';
import '@polymer/paper-button/paper-button.js';
import '@polymer/paper-toggle-button/paper-toggle-button.js';
import '@polymer/paper-input/paper-textarea.js';
import '@polymer/paper-listbox/paper-listbox.js';
import '@mistio/mist-form/mist-form.js';
import { Polymer } from '@polymer/polymer/lib/legacy/polymer-fn.js';
import { html } from '@polymer/polymer/lib/utils/html-tag.js';
import { CSRFToken } from '../helpers/utils.js';
import { MACHINE_CREATE_FIELDS } from '../helpers/machine-create-fields.js';
import { MACHINE_CREATE_FORM_DATA } from './machine-create-helpers/machine-create-form-data.js';
import '@fooloomanzoo/datetime-picker/datetime-picker.js';

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

      mist-form {
        --mist-subform-background-color: white;
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
        <div class="grid-row"></div>
      </paper-material>
      <paper-material class$="selected-[[!selectedCloud]]">
        <mist-form
          id="[[formId]]"
          hidden$="[[showJSON]]"
          src="[[createMachineFields.src]]"
          dynamic-data-namespace="[[createMachineFields.formData]]"
          url="/api/v1/clouds/[[selectedCloud]]/machines"
          method="POST"
        >
          <div id="mist-form-custom">
            <mist-size-field
              mist-form-type="mistSizeField"
              mist-form-value-change="value-changed"
              mist-form-value-path="detail.value"
            ></mist-size-field>
            <datetime-picker
              mist-form-type="datetimePicker"
              mist-form-value-change="inputPickerClosed"
              mist-form-value-path="detail.value"
              mist-form-validate="validate"
            ></datetime-picker>
            <mist-tags-field
              mist-form-type="datetimePicker"
              mist-form-value-change="value-changed"
              mist-form-value-path="detail.value"
              mist-form-validate="validate"
            ></mist-tags-field>
          </div>
          <iron-ajax
            slot="formRequest"
            id="formAjax"
            url="/api/v1/clouds/[[selectedCloud]]/machines"
            contentType="application/json"
            on-mist-form-request="_mistFormRequest"
          ></iron-ajax>
        </mist-form>
      </paper-material>
      <iron-ajax
        id="getSecurityGroups"
        contenttype="application/json"
        handle-as="json"
        method="GET"
        on-request="_handleGetSecurityGroupsRequest"
        on-response="_handleGetSecurityGroupsResponse"
        on-error="_handleGetSecurityGroupsError"
      ></iron-ajax>
    </div>
  `,

  is: 'machine-create-new',
  behaviors: [window.rbac],

  properties: {
    model: {
      type: Object,
    },
    machineCreateFormData: {
      type: Object,
      value() {
        return MACHINE_CREATE_FORM_DATA;
      },
    },
    createMachineFields: {
      type: Object,
      value() {
        return MACHINE_CREATE_FORM_DATA(this);
      },
    },
    clouds: {
      type: Array,
      value() {
        return [];
      },
      computed: '_computeClouds(model, model.clouds, model.teams.*)',
    },
    volumes: {
      type: Array,
      value() {
        return [];
      },
      computed: '_computeVolumes(model, model.clouds)',
    },
    constraints: {
      type: Object,
    },
  },
  _mistFormRequest(e) {
    const { params } = e.detail;
    console.log('params ', params);
    params.provider = this._getProviderById(params.cloud);
    this.$.formAjax.params = JSON.stringify(e.detail.params);
    // this.$.formAjax.generateRequest();
  },
  _getCloud(cloudId) {
    const cloudSizes = this._getCloudSizes() || [];
    return JSON.parse(
      JSON.stringify(
        cloudSizes.find(cloudSize => cloudSize.id === cloudId) || {}
      )
    );
  },
  _computeClouds(_model, _clouds) {
    // exclude bare metals and not allowed clouds from provider dropdown list
    return this._toArray(this.model.clouds).filter(
      c =>
        ['bare_metal'].indexOf(c.provider) === -1 &&
        this.checkPerm('cloud', 'create_resources', c.id)
    );
  },
  _toArray(x, _z) {
    if (x) {
      return Object.keys(x).map(y => x[y]);
    }
    return [];
  },
  _getCloudSizes() {
    return this.model.cloudsArray
      .flatMap(cloud => {
        const providerFields = MACHINE_CREATE_FIELDS.find(
          field => field.provider === cloud.provider
        );

        if (!providerFields) {
          return [];
        }

        const size = providerFields.fields.find(field => field.name === 'size');

        if (Object.prototype.hasOwnProperty.call(cloud, 'sizesArray')) {
          size.options = [...cloud.sizesArray];
        }
        // Allow minimum value of 'disk' field to be 0
        if (size.customSizeFields) {
          size.customSizeFields.map(field => ({
            ...field,
            min: field.name.includes('disk') ? 0 : field.min,
          }));
        }
        return [
          {
            id: cloud.id,
            provider: cloud.provider,
            title: cloud.title,
            size: { ...size },
          },
        ];
      })
      .filter(cloud => cloud.size.custom || cloud.size.options.length > 0);
  },
  _getCloudById(cloudId) {
    return this.clouds.find(cloud => cloud.id === cloudId);
  },
  _getProviderById(cloudId) {
    return this._getCloudById(cloudId) && this._getCloudById(cloudId).provider;
  },
  _hasClouds(clouds) {
    if (clouds && clouds.length) return true;
    return false;
  },
  async _getAmazonSecurityGroups(cloudId) {
    this.$.getSecurityGroups.headers['Content-Type'] = 'application/json';
    this.$.getSecurityGroups.headers['Csrf-Token'] = CSRFToken.value;
    this.$.getSecurityGroups.url = `/api/v1/clouds/${cloudId}/security-groups`;
    const promise = await this.$.getSecurityGroups.generateRequest().completes;
    const secGroups = promise.response.map(secGroup => ({
      title: secGroup.name,
      id: secGroup.id,
    }));

    return secGroups || [];
  },
});
