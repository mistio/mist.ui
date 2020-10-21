import '../../node_modules/@polymer/polymer/polymer-legacy.js';
import '../../node_modules/@polymer/paper-styles/typography.js';
import '../app-form/app-form.js';
import { Polymer } from '../../node_modules/@polymer/polymer/lib/legacy/polymer-fn.js';
import { html } from '../../node_modules/@polymer/polymer/lib/utils/html-tag.js';

Polymer({
  _template: html`
        <style>
            :host {
                display: block;
                margin-bottom: 16px;
            }
        </style>
        <app-form fields="{{fields}}" url="/api/v1/clouds/[[cloud.id]]/machines" method="PUT" on-request="_addMachineRequest" on-response="_addMachineResponse" btncontent="Add Host" show-cancel="" single-column=""></app-form>
`,

  is: 'other-cloud-add-machine',

  properties: {
      cloud: {
          type: Object
      },
      keys: {
          type: Array
      },
      providers: {
          type: Array
      },
      fields: {
          type: Array,
          value (cloud) {
              return [];
          },
          computed: '_computeFields(cloud.provider)'
      }
  },

  observers: [
      '_keysChanged(keys.*, fields)'
  ],

  listeners: {
      'update-keys': 'updateKeys'
  },

  _computeFields(selectedProvider) {
      if (!this.providers) return [];

      const provider = this.providers.find(function (p) {
          return p.val == selectedProvider
      });
      if (!provider) return [];
      const options = provider.options.find(function(o) {
          return o.name == 'hosts' || o.name == 'machines'
      });
      if (!options) return [];
      return options.options;
  },

  _fieldIndexByName (name, fields) {
      let index;
      if (this.fields) {
          const passField = this.fields.find(function (f, ind) {
              index = ind;
              return f.name == name;
          });
      }
      return index;
  },

  _keysChanged (keys, fields) {
      // Set list of keys in providerFields when model keys change
      const index = this.fields.findIndex(function (field) {
          return field.type == "ssh_key";
      }, this);

      this.set(`fields.${  index  }.options`, this.keys);
      this.set(`fields.${  index  }.value`, '');

      // Check for nested subforms and update ssh_key fields
      this.fields.forEach(function (field) {
          if (field.type == 'list') {
              field.options.forEach(function (subfield) {
                  if (subfield.type == "ssh_key") {
                      subfield.options = this.keys;
                  }
              }, this);
          }
      }, this);
  },

  fieldsOfType (data, type) {
      const typeIndexes = [];
      const fieldsOfType = data.filter(function (f, ind) {
          if (f.type == type)
              typeIndexes.push(ind);
          return f.type == type;
      });
      return typeIndexes;
  },

  updateKeys (e) {
      const keyFieldsIndexes = this.fieldsOfType(this.fields, 'ssh_key');
      console.log('updateKeys', keyFieldsIndexes);
      this.async(function () {
          for (let i = 0; i < keyFieldsIndexes.length; i++) {
              this.set(`fields.${  keyFieldsIndexes[i]  }.options`, this.keys);
              this.set(`fields.${  keyFieldsIndexes[i]  }.value`, e.detail.key);
          }
          if (this.fieldsOfType(this.fields, 'list')) {
              this.updateKeysInLists(e, this.fieldsOfType(this.fields, 'list'));
          }
      }.bind(this), 1000);
  },

  updateKeysInLists (e, lists) {
      for (let j = 0; j < lists.length; j++) {
          var keyFieldsIndexes = this.fieldsOfType(this.fields[lists[i]].options, 'ssh_key');
          console.log('updateKeys', this.fields[lists[i]].options);

          this.async(function () {
              for (let i = 0; i < keyFieldsIndexes.length; i++) {
                  this.set(`fields.${  lists[i]  }.options.${  keyFieldsIndexes[i] 
                      }.options`, this.keys);
                  this.set(`fields.${  lists[i]  }.options.${  keyFieldsIndexes[i] 
                      }.value`, e.detail.key);
              }
          }.bind(this), 500);
      }
  },

  _addMachineResponse () {
      console.warn('_addMachineResponse');
  },

  _addMachineRequest () {
      console.warn('_addMachineRequest');
  }
});