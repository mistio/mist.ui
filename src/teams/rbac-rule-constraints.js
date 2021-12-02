/* eslint no-param-reassign: ["error", { "props": true, "ignorePropertyModificationsForRegex": ["^field"] }] */
import '@polymer/paper-dropdown-menu/paper-dropdown-menu.js';
import '@polymer/paper-listbox/paper-listbox.js';
import '@polymer/paper-item/paper-item.js';
import '@polymer/paper-input/paper-input.js';
import '@polymer/paper-input/paper-textarea.js';
import { getNestedValueFromPath } from '@mistio/mist-form/src/utilities.js';
import '../helpers/mist-form-dialog.js';
import { Polymer } from '@polymer/polymer/lib/legacy/polymer-fn.js';
import { html } from '@polymer/polymer/lib/utils/html-tag.js';
import { MACHINE_CREATE_FIELDS } from '../helpers/machine-create-fields.js';

Polymer({
  _template: html`
    <style include="shared-styles tags-and-labels">
      :host {
        display: flex;
        align-items: center;
      }

      paper-dropdown-menu {
        width: 150px;
        --paper-input-container-underline: {
          /*display: none;*/
          opacity: 0.32;
        }
        --paper-dropdown-menu-input: {
          text-transform: uppercase;
        }
      }

      paper-dropdown-menu.short {
        /*width: 80px;*/
        margin-right: 16px;
      }

      paper-input {
        vertical-align: middle;
      }

      .flex {
        display: inline-flex;
      }

      .tag {
        vertical-align: middle;
      }

      paper-input {
        --paper-input-container-underline {
          opacity: 0.32;
        }
      }

      .tag iron-icon {
        color: #fff;
        width: 13px;
        height: 13px;
        cursor: pointer;
      }

      iron-icon.edit {
        color: inherit;
        padding: 8px;
        opacity: 0.32;
      }
      :host iron-icon {
        cursor: pointer;
      }
      mist-form-dialog::part(mist-form-checkbox) {
        --paper-checkbox-checked-color: var(--mist-blue) !important;
        --paper-checkbox-checked-ink-color: var(--mist-blue) !important;
      }
    </style>
    <span hidden$="[[!showConstraints]]">
      <span hidden$="[[!error]]" class="error">[[error]]</span>
      <iron-icon
        icon="icons:settings"
        on-tap="editConstraints"
        class="edit"
        title="Edit constraints"
      ></iron-icon>
    </span>
    <template is="dom-if" if="[[showConstraints]]">
      <mist-form-dialog
        id="editConstraints"
        formid="editConstraints-[[index]]"
        mist-form-fields="[[mistFormFields]]"
        initial-values="[[rule.constraints]]"
        exportparts="mist-form-text-field, mist-form-dropdown, mist-form-radio-group, mist-form-checkbox-group, mist-form-text-field, mist-form-text-area, mist-form-checkbox, mist-form-duration-field, mist-form-multi-row, mist-form-multi-row-row, mist-form-custom-field, mist-form-button"
      >
      </mist-form-dialog>
    </template>
  `,

  is: 'rbac-rule-constraints',

  properties: {
    model: {
      type: Object,
    },
    rule: {
      type: Object,
    },
    index: {
      type: Number,
    },
    showConstraints: {
      type: Boolean,
      value: false,
      computed: '_computeShowConstraints(rule.*)',
    },
    mistFormFields: {
      type: Object,
      value() {
        return {
          src: './assets/forms/constraints.json',
          formData: {
            dynamicData: {
              cloudsWithALL: {
                func: new Promise(resolve => {
                  resolve(() => ['ALL', ...this._getClouds()]);
                }),
              },
              clouds: {
                func: new Promise(resolve => {
                  resolve(() => this._getClouds());
                }),
              },
            },
            conditionals: {
              hideSize: {
                // Hide the user friendly name field if the size is custom
                func: cloudId => !cloudId,
              },
              getField: {
                func: (cloudId, fieldPath) => {
                  if (!cloudId) {
                    return undefined;
                  }
                  const cloudSize = this._getCloud(cloudId);
                  if (!cloudSize || !cloudSize.size) {
                    return undefined;
                  }
                  const sizeFieldPath = `${fieldPath
                    .split('.')
                    .slice(0, -1)
                    .join('.')}.size`;
                  const value = getNestedValueFromPath(
                    sizeFieldPath,
                    this.rule.constraints
                  );
                  if (cloudSize.size.value === 'custom') {
                    cloudSize.size.customValue = value;
                    cloudSize.size.customSizeFields.forEach(field => {
                      if (
                        typeof value === 'object' &&
                        value[field.name] !== undefined
                      ) {
                        field.value = value[field.name];
                      }
                    });
                  } else {
                    cloudSize.size.value = value;
                  }
                  return cloudSize.size;
                },
              },
              hideUserFriendlyName: {
                // Hide the user friendly name field if the size is custom
                func: cloudId => !this._cloudHasCustomSize(cloudId),
              },
              getDefaultActions: {
                func: defaultActions => defaultActions || [],
              },
            },
          },
        };
      },
    },
  },

  listeners: {
    keyup: 'hotkeys',
    confirmation: '_updateRuleConstraints',
    'fields-changed': '_fieldsChanged',
  },
  _computeShowConstraints(_prule) {
    // empty strings for ALL
    return (
      ['machine', ''].indexOf(this.rule.rtype) > -1 &&
      ['create', 'edit', 'resize', ''].indexOf(this.rule.action) > -1
    );
  },

  hotkeys(e) {
    // if 'enter'
    if (e.keyCode === 13) {
      this.$.inputField.blur();
    }
  },

  hasConstraints(constraints) {
    return !!(constraints && Object.keys(constraints).length);
  },

  editConstraints(_e) {
    this.error = '';
    this._mapValuesToFields();
    this._showDialog({
      title: 'Edit constraints',
      reason: 'edit.constraints',
      hideText: true,
      fields: this.fields,
      action: 'save',
    });
  },

  _showDialog(info) {
    const dialog = this.shadowRoot.querySelector(
      'mist-form-dialog#editConstraints'
    );
    if (info) {
      Object.keys(info || {}).forEach(i => {
        dialog[i] = info[i];
      });
    }
    dialog._openDialog();
  },

  _updateRuleConstraints(e) {
    // update rule.constraints
    const { reason, response, value } = e.detail;

    if (response === 'confirm' && reason === 'edit.constraints') {
      this.dispatchEvent(
        new CustomEvent('update-constraints', {
          bubbles: true,
          composed: true,
          detail: {
            index: this.index,
            constraints: value,
          },
        })
      );
    }
  },
  _fieldsChanged(e) {
    // change notify values if expiration date changes
    const { value } = e.detail;
    try {
      JSON.parse(value);
    } catch (error) {
      this.formValid = false;
      return false;
    }
    this.formValid = true;
    return false;
  },
  _mapValuesToFields() {
    // fill in fields with constraints corresponding values
    const constraints = JSON.stringify(this.rule.constraints, undefined, 2);
    this.set('fields.0.value', constraints || '{}');
  },
  _cloudHasCustomSize(cloudId) {
    if (!cloudId) {
      return undefined;
    }
    const cloud = this._getCloud(cloudId);
    return cloud.size && cloud.size.custom;
  },
  _getClouds() {
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
          size.customSizeFields.map(field => {
            if (field.name.includes('disk')) {
              field.min = 0;
            }
            return field;
          });
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
  _getCloud(cloudId) {
    const cloudSizes = this._getCloudSizes() || [];
    return JSON.parse(
      JSON.stringify(
        cloudSizes.find(cloudSize => cloudSize.id === cloudId) || {}
      )
    );
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
          size.customSizeFields.map(field => {
            if (field.name.includes('disk')) {
              field.min = 0;
            }
            return field;
          });
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
});
