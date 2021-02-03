import '@polymer/polymer/polymer-legacy.js';
import '@polymer/paper-styles/typography.js';
import '../app-form/app-form.js';
import { Polymer } from '@polymer/polymer/lib/legacy/polymer-fn.js';
import { html } from '@polymer/polymer/lib/utils/html-tag.js';

Polymer({
  _template: html`
    <style>
      :host {
        display: block;
        margin-bottom: 16px;
      }
    </style>
    <app-form
      fields="{{fields}}"
      url="/api/v1/clouds/[[cloud.id]]/machines"
      method="PUT"
      on-request="_addMachineRequest"
      on-response="_addMachineResponse"
      btncontent="Add Host"
      show-cancel=""
      single-column=""
    ></app-form>
  `,

  is: 'other-cloud-add-machine',

  properties: {
    cloud: {
      type: Object,
    },
    keys: {
      type: Array,
    },
    providers: {
      type: Array,
    },
    fields: {
      type: Array,
      value(_cloud) {
        return [];
      },
      computed: '_computeFields(cloud.provider)',
    },
  },

  observers: ['_keysChanged(keys.*, fields)'],

  listeners: {
    'update-keys': 'updateKeys',
  },

  _computeFields(selectedProvider) {
    if (!this.providers) return [];

    const provider = this.providers.find(p => {
      return p.val === selectedProvider;
    });
    if (!provider) return [];
    const options = provider.options.find(o => {
      return o.name === 'hosts' || o.name === 'machines';
    });
    if (!options) return [];
    return options.options;
  },

  _fieldIndexByName(name, _fields) {
    let index;
    if (this.fields) {
      this.fields.find((f, ind) => {
        index = ind;
        return f.name === name;
      });
    }
    return index;
  },
  /* eslint-disable no-param-reassign */
  _keysChanged(_keys, _fields) {
    // Set list of keys in providerFields when model keys change
    const index = this.fields.findIndex(field => {
      return field.type === 'ssh_key';
    }, this);

    this.set(`fields.${index}.options`, this.keys);
    this.set(`fields.${index}.value`, '');

    // Check for nested subforms and update ssh_key fields
    this.fields.forEach(field => {
      if (field.type === 'list') {
        field.options.forEach(subfield => {
          if (subfield.type === 'ssh_key') {
            subfield.options = this.keys;
          }
        }, this);
      }
    }, this);
  },
  /* eslint-enable no-param-reassign */

  fieldsOfType(data, type) {
    const typeIndexes = [];
    data.forEach((f, ind) => {
      if (f.type === type) typeIndexes.push(ind);
    });
    return typeIndexes;
  },

  updateKeys(e) {
    const keyFieldsIndexes = this.fieldsOfType(this.fields, 'ssh_key');
    console.log('updateKeys', keyFieldsIndexes);
    this.async(() => {
      for (let i = 0; i < keyFieldsIndexes.length; i++) {
        this.set(`fields.${keyFieldsIndexes[i]}.options`, this.keys);
        this.set(`fields.${keyFieldsIndexes[i]}.value`, e.detail.key);
      }
      if (this.fieldsOfType(this.fields, 'list')) {
        this.updateKeysInLists(e, this.fieldsOfType(this.fields, 'list'));
      }
    }, 1000);
  },

  updateKeysInLists(e, lists) {
    for (let j = 0; j < lists.length; j++) {
      const keyFieldsIndexes = this.fieldsOfType(
        this.fields[lists[j]].options,
        'ssh_key'
      );
      console.log('updateKeys', this.fields[lists[j]].options);

      this.async(() => {
        for (let i = 0; i < keyFieldsIndexes.length; i++) {
          this.set(
            `fields.${lists[i]}.options.${keyFieldsIndexes[i]}.options`,
            this.keys
          );
          this.set(
            `fields.${lists[i]}.options.${keyFieldsIndexes[i]}.value`,
            e.detail.key
          );
        }
      }, 500);
    }
  },

  _addMachineResponse() {
    console.warn('_addMachineResponse');
  },

  _addMachineRequest() {
    console.warn('_addMachineRequest');
  },
});
