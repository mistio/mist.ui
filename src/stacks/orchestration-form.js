import '@polymer/polymer/polymer-legacy.js';
import '../helpers/stack-forms-behavior.js';
import '../app-form/app-form.js';
import { Polymer } from '@polymer/polymer/lib/legacy/polymer-fn.js';
import { html } from '@polymer/polymer/lib/utils/html-tag.js';

Polymer({
  _template: html`
    <style include="shared-styles forms">
      :host {
        max-width: calc(100% - 150px);
        position: relative;
        display: block;
      }
    </style>
    <app-form
      id$="stack_[[workflow]]"
      fields="{{fields}}"
      workflow="[[workflow]]"
      url="[[url]]"
      btncontent="[[btncontent]]"
    ></app-form>
  `,

  is: 'orchestration-form',

  properties: {
    model: {
      type: Object,
    },
    fields: {
      type: Array,
    },
    workflow: {
      type: String,
    },
    url: {
      type: String,
    },
    onRequest: {
      type: String,
    },
    onResponse: {
      type: String,
    },
    onError: {
      type: String,
    },
    btncontent: {
      type: String,
    },
    yamlInputs: {
      type: String,
      notify: true,
    },
  },

  observers: ['_cloudChanged(fields.*)'],

  listeners: {
    change: '_updateFields',
    'iron-select': '_updateFields',
  },
  /* eslint-disable no-param-reassign */
  ready() {
    let yamlInputs = '';
    this.fields.forEach(inp => {
      yamlInputs += `${inp.name}: `;
      const val = !undefined ? inp.value : inp.defaultValue || inp.default;
      inp.value = val;
      yamlInputs += `${val}\n`;
    }, this);
    this.set('yamlInputs', yamlInputs);
  },

  attached() {
    // prepare mist machine
    const inps = this.fields.filter(f => {
      return f.name.startsWith('mist_machine');
    });
    if (inps && inps.length) {
      for (let i = 0; i < inps.length; i++) {
        const inp = inps[i];
        inp.label = inp.name.split('mist_machine_')[1] || '';
        inp.required = true;
        inp.valid = false;
        inp.show = true;
        inp.type = 'mist_machine';
        inp.cloud = '';
        inp.machine = '';
        inp.machinesList = [];
        inp.image = '';
        inp.size = '';
        inp.location = '';
        inp.key = '';
        inp.networks = [];
        inp.value = {};
        inp.helptext = inp.description;
        inp.quantity = 1;
        if (inp.name.endsWith('list')) {
          inp.multi = true;
        } else {
          inp.multi = false;
        }
        if (this.model) {
          inp.clouds = this.model.clouds || {};
          inp.keys = this.model.keys || {};
        }
      }
    }
  },

  _cloudChanged(changeRecord) {
    function copy(o) {
      // deep copy an array of objects
      let v;
      const output = Array.isArray(o) ? [] : {};
      Object.keys(o).forEach(key => {
        v = o[key];
        output[key] = typeof v === 'object' ? copy(v) : v;
      });
      return output;
    }
    if (
      !this.fields ||
      !changeRecord ||
      !changeRecord.path ||
      !changeRecord.path.endsWith('value')
    ) {
      // pass
    } else {
      const field = this.get(changeRecord.path.replace('.value', ''));
      if (
        field &&
        field.name.startsWith('mist_cloud') &&
        this.model.clouds[changeRecord.value]
      ) {
        // reset fields if cloud changed
        const fields = copy(this.fields);
        this.set('fields', []);
        this.set('fields', fields);
        this._updateFields();
      }
    }
  },

  _updateFields(e) {
    const changeInYaml =
      e &&
      e.path &&
      e.path.indexOf(
        this.shadowRoot
          .querySelector('app-form')
          .shadowRoot.querySelector(
            `paper-textarea#app-form-stack_${this.workflow}-stackinputs`
          )
      ) > -1;
    this.fields.forEach(inp => {
      if (inp.name !== 'yaml_or_form' && inp.name !== 'stackinputs') {
        let xid;
        // Temp, before Tosca uses 'required' key
        inp.required = false;

        // Uncomment when TOSCA uses 'required' key
        // if (!inp.required){
        //     inp.required = false;
        // }

        // make key dropdown
        if (inp.name.startsWith('mist_key')) {
          inp.type = 'ssh_key';
          // inp.type = 'dropdown';
          inp.helptext = 'Select key';
          inp.options = this.model.keysArray;
        }

        // make cloud dropdown
        if (inp.name.startsWith('mist_cloud')) {
          inp.label = 'cloud';
          inp.type = 'mist_dropdown';
          inp.helptext = 'Select cloud';
          inp.options = this.model.cloudsArray;
        }

        // make image dropdown & dependent on cloud
        if (inp.name.startsWith('mist_image')) {
          [, xid] = inp.name.split('mist_image');
          inp.show = false;
          inp.type = 'mist_dropdown';
          inp.helptext = 'Select image';
          inp.showIf = {
            fieldName: `mist_cloud${xid}`,
            fieldExists: true,
          };
        }

        // make image location & dependent on cloud
        if (inp.name.startsWith('mist_location')) {
          [, xid] = inp.name.split('mist_location');
          inp.show = false;
          inp.type = 'mist_dropdown';
          inp.helptext = 'Select location';
          inp.showIf = {
            fieldName: `mist_cloud${xid}`,
            fieldExists: true,
          };
        }

        // make network dropdown & dependent on cloud
        if (inp.name.startsWith('mist_networks')) {
          [, xid] = inp.name.split('mist_networks');
          inp.show = false;
          inp.type = 'mist_dropdown';
          inp.helptext = 'Select network';
          inp.showIf = {
            fieldName: `mist_cloud${xid}`,
            fieldExists: true,
          };
        }

        // make image location & dependent on cloud
        if (inp.name.startsWith('mist_size')) {
          [, xid] = inp.name.split('mist_size');
          inp.show = false;
          inp.type = 'mist_size';
          inp.helptext = 'Machine size';
          inp.showIf = {
            fieldName: `mist_cloud${xid}`,
            fieldExists: true,
          };
        }

        // prepare mist tags
        if (inp.name.startsWith('mist_tags')) {
          inp.show = false;
          inp.type = 'mist_tags';
          inp.helptext = inp.description;
          inp.value = [];
        }

        // prepare mist machine
        if (inp.name.startsWith('mist_machine')) {
          inp.label = inp.name.split('mist_machine_')[1] || 'Mist Machine';
          inp.required = true;
          inp.show = true;
          inp.type = 'mist_machine';
          inp.helptext = inp.description;
          if (this.model) {
            inp.clouds = this.model.clouds || {};
            inp.keys = this.model.keys || {};
          }
        }

        // hide mist api credential inputs
        if (
          [
            'mist_token',
            'script_path',
            'mist_uri',
            'mist_username',
            'mist_password',
          ].indexOf(inp.name) > -1
        ) {
          inp.hidden = true;
          inp.required = false;
        }
      }
    }, this);

    if (changeInYaml) {
      const yaml = this.shadowRoot
        .querySelector('app-form')
        .shadowRoot.querySelector('paper-textarea#stackinputs').value;
      console.log('yaml', yaml);
      const yamlArray = yaml.split('\n');
      const inputs = [];
      yamlArray.forEach(line => {
        const name = line.split(':')[0].trim();
        let value = line.split(':')[1];
        if (value) value = value.trim();
        inputs[name] = JSON.parse(value);
      });

      this.fields.forEach((f, index) => {
        if (inputs[f.name]) this.set(`fields.${index}.value`, inputs[f.name]);
      }, this);
    } else {
      const cloud = this.fields.find(f => {
        return f.name.startsWith('mist_cloud');
      });
      let yamlInputs = '';
      this.fields.forEach(inp => {
        let fieldCloud;
        let xid;
        let cloudId;
        if (['yaml_or_form', 'stackinputs'].indexOf(inp.name) === -1) {
          yamlInputs += `${inp.name}: `;
          const preformatedValue = inp.preformatPayloadValue
            ? inp.preformatPayloadValue.apply(inp.value)
            : inp.value;
          const val = preformatedValue
            ? JSON.stringify(preformatedValue)
            : inp.defaultValue;
          yamlInputs += `${val}\n`;
        }
        if (cloud && cloud.value) {
          if (inp.name.startsWith('mist_location')) {
            [xid] = inp.name.split('mist_location');
            fieldCloud =
              this.fields.find(f => {
                return f.name.startsWith(`mist_cloud${xid}`);
              }) || cloud;
            cloudId = fieldCloud.value;
            if (cloudId)
              inp.options = this.model.clouds[cloudId].locationsArray || [];
          }
          if (inp.name.startsWith('mist_image')) {
            [xid] = inp.name.split('mist_image');
            fieldCloud =
              this.fields.find(f => {
                return f.name.startsWith(`mist_cloud${xid}`);
              }) || cloud;
            cloudId = fieldCloud.value;
            if (this.model && cloudId)
              inp.options = this.model.clouds[cloudId].imagesArray || [];
          }
          if (inp.name.startsWith('mist_networks')) {
            [xid] = inp.name.split('mist_networks');
            fieldCloud =
              this.fields.find(f => {
                return f.name.startsWith(`mist_cloud${xid}`);
              }) || cloud;
            cloudId = fieldCloud.value;
            if (this.model && cloudId)
              inp.options =
                Object.values(this.model.clouds[cloudId].networks) || [];
          }
          // mist-machine contains its own cloud value
          if (inp.name.startsWith('mist_machine')) {
            if (this.model) {
              inp.clouds = this.model.clouds || {};
              inp.keys = this.model.keys || {};
            }
          }
          if (inp.name.startsWith('mist_size')) {
            [xid] = inp.name.split('mist_size');
            fieldCloud =
              this.fields.find(f => {
                return f.name.startsWith(`mist_cloud${xid}`);
              }) || cloud;
            cloudId = fieldCloud.value;
            if (cloudId) {
              if (this.model.clouds[cloudId].sizesArray)
                inp.options = this.model.clouds[cloudId].sizesArray || [];
              if (
                ['libvirt', 'onapp', 'vsphere'].indexOf(
                  this.model.clouds[cloudId].provider
                ) === -1
              ) {
                inp.custom = false;
                inp.customValue = null;
                inp.customSizeFields = [];
              }
              if (
                ['libvirt', 'onapp', 'vsphere'].indexOf(
                  this.model.clouds[cloudId].provider
                ) > -1
              ) {
                inp.options = [];
                inp.custom = true;
                inp.value = 'custom';
              }
              if (
                ['libvirt', 'vsphere'].indexOf(
                  this.model.clouds[cloudId].provider
                ) > -1
              ) {
                inp.customSizeFields = [
                  {
                    name: 'ram',
                    label: 'RAM MB',
                    type: 'slider',
                    value: 256,
                    defaultValue: 256,
                    min: 256,
                    max: 6223,
                    step: 256,
                    show: true,
                    required: false,
                    unit: 'MB',
                  },
                  {
                    name: 'cpu',
                    label: 'CPU cores',
                    type: 'slider',
                    value: 1,
                    defaultValue: 1,
                    min: 1,
                    max: 16,
                    step: 1,
                    show: true,
                    required: false,
                    unit: 'cores',
                  },
                ];
              }
              if (['onapp'].indexOf(this.model.clouds[cloudId].provider) > -1) {
                inp.customSizeFields = [
                  {
                    name: 'size_ram',
                    label: 'RAM MB',
                    type: 'slider',
                    value: 256,
                    defaultValue: 256,
                    min: 256,
                    max: 6223,
                    step: 1,
                    show: true,
                    required: false,
                    unit: 'MB',
                    helptext: 'Custom RAM size in MB.',
                    showIf: {
                      fieldName: 'size',
                      fieldValues: ['custom'],
                    },
                  },
                  {
                    name: 'size_cpu',
                    label: 'CPU cores',
                    type: 'slider',
                    value: 1,
                    defaultValue: 1,
                    min: 1,
                    max: 16,
                    step: 1,
                    show: true,
                    required: false,
                    unit: 'cores',
                    helptext: 'Custom CPU cores.',
                    showIf: {
                      fieldName: 'size',
                      fieldValues: ['custom'],
                    },
                  },
                  {
                    name: 'size_disk_primary',
                    label: 'Primary Disk',
                    type: 'slider',
                    value: 5,
                    defaultValue: 5,
                    min: 5,
                    max: 16,
                    step: 1,
                    show: true,
                    required: false,
                    unit: 'GB',
                    helptext: 'Custom disk size in GB.',
                    showIf: {
                      fieldName: 'size',
                      fieldValues: ['custom'],
                    },
                  },
                  {
                    name: 'size_disk_swap',
                    label: 'Swap Disk',
                    type: 'slider',
                    value: 1,
                    defaultValue: 1,
                    min: 1,
                    max: 11,
                    step: 1,
                    show: true,
                    required: false,
                    unit: 'GB',
                    helptext: 'Custom disk size in GB.',
                    showIf: {
                      fieldName: 'size',
                      fieldValues: ['custom'],
                    },
                  },
                ];
              }
            }
          }
        }
      }, this);

      this.set('yamlInputs', yamlInputs);

      // pass values into form's stackinputs value
      this._updateStackInputsValue();
    }
  },
  /* eslint-enable no-param-reassign */
  _computeProviderLogo(provider) {
    return `assets/providers/provider-${provider}.png`;
  },

  _updateStackInputsValue() {
    const stackinputsIndex = this.fields.findIndex(f => {
      return f.name === 'stackinputs';
    });
    if (stackinputsIndex && stackinputsIndex > -1)
      this.set(`fields.${stackinputsIndex}.value`, this.yamlInputs);
  },
});
