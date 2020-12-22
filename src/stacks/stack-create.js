import '../../node_modules/@polymer/paper-material/paper-material.js';
import '../../node_modules/@polymer/paper-button/paper-button.js';
import '../../node_modules/@polymer/paper-toggle-button/paper-toggle-button.js';
import '../../node_modules/@polymer/paper-styles/typography.js';
import '../../node_modules/@polymer/paper-radio-group/paper-radio-group.js';
import '../../node_modules/@polymer/paper-radio-button/paper-radio-button.js';
import '../../node_modules/@polymer/paper-progress/paper-progress.js';
import '../app-form/app-form.js';
import { YAML } from 'yaml/browser/dist/index.js';
import { Polymer } from '../../node_modules/@polymer/polymer/lib/legacy/polymer-fn.js';
import { html } from '../../node_modules/@polymer/polymer/lib/utils/html-tag.js';
import { dom } from '../../node_modules/@polymer/polymer/lib/legacy/polymer.dom.js';
import { stackFormsBehavior } from '../helpers/stack-forms-behavior.js';
import { MACHINE_CREATE_FIELDS } from '../helpers/machine-create-fields.js';

Polymer({
  _template: html`
    <style include="shared-styles forms single-page">
      paper-material {
          display: block;
          padding: 24px;
      }

      #content {
          max-width: 900px;
      }

      paper-progress {
          position: absolute;
          bottom: 87px;
          width: 100%;
          left: 0;
          right: 0;
      }

      :host>::slotted(paper-input-container) {
          padding-top: 16px;
          padding-bottom: 16px;
      }

      paper-item.lead {
          font-size: 2em;
      }

      paper-toggle-button[disabled]::slotted() {
          color: rgba(0, 0, 0, 0.32);
      }

      paper-toggle-button::slotted(paper-input-container input) {
          color: color: rgba(0, 0, 0, 0.54);
      }

      .spacer {
          display: block;
          height: 24px;
          width: 100%;
      }

      .bottom-actions {
          padding-left: 20px;
      }

      *:not(paper-button)[disabled] {
          display: none;
      }

      paper-radio-group {
          padding: 16px 8px;
      }

      @media (max-width: 800px) {
          .desc {
              display: none;
          }
      }

      .desc {
          width: 250px;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
      }

      .single-head {
          @apply --stack-page-head-mixin
      }
    </style>
    <div id="content">
      <paper-material class="single-head layout horizontal">
        <span class="icon">
          <iron-icon icon="[[section.icon]]"></iron-icon>
        </span>
        <div class="title flex">
          <h2>Create Stack</h2>
          <div class="subtitle">
            from [[template.name]]
            <a href$="/templates/[[template.id]]">
              <iron-icon icon="icons:link"></iron-icon>
            </a>
            <span class="desc" hidden$="[[!template.description]]"
              >([[template.description]])</span
            >
          </div>
        </div>
      </paper-material>
      <paper-material hidden$="[[template.id]]">
        <p>Template is missing</p>
      </paper-material>
      <paper-material hidden$="[[!template.id]]">
        <app-form
          id="create_stack"
          fields="{{fields}}"
          templateid="{{template.id}}"
          workflow="install"
          url="/api/v1/stacks"
          on-request="_handleRequest"
          on-response="_handleResponse"
          on-error="_handleError"
          btncontent="create stack"
          format-payload=""
        ></app-form>
      </paper-material>
    </div>
  `,

  is: 'stack-create',

  behaviors: [stackFormsBehavior],

  properties: {
    model: {
      type: Object,
    },
    section: {
      type: Object,
    },
    stack: {
      type: Object,
    },
    form: {
      type: Object,
      value: {},
    },
    params: {
      type: Object,
    },
    template: {
      type: Object,
      computed: '_fromTemplate(params, model.templates.*)',
    },
    fields: {
      type: Array,
      value: [],
      notify: true,
    },
    keys: {
      type: Array,
    },
    clouds: {
      type: Array,
    },
    images: {
      type: Array,
    },
    uri: {
      type: String,
    },
    yamlInputs: {
      type: String,
      notify: true,
    },
  },

  observers: [
    '_computeFields(template, template.inputs, template.inputs.*, model.templatesArray.*, model.cloudsArray.*, model.keys.*, params)',
  ],

  listeners: {
    change: '_updateFields',
    'iron-select': '_updateFields',
    'update-keys': 'updateKeys',
    'format-payload': '_updateFields',
  },

  ready() {},
  /* eslint-disable no-param-reassign */
  _fromTemplate(params, _templates) {
    if (params.template && this.model.templates) {
      let yamlInputs = '';
      let xid;
      this.model.templates[params.template].inputs.forEach(inp => {
        yamlInputs += `${inp.name}: `;
        let val = !undefined ? inp.value : inp.defaultValue || inp.default;
        inp.value = val;
        if (inp.value === 'custom') val = JSON.stringify(inp.customValue);
        yamlInputs += `${val}\n`;
      }, this);
      this.set('yamlInputs', yamlInputs);
      // pass values into form's stackinputs default value
      let ind;
      this.fields.find((f, index) => {
        ind = index;
        return f.name === 'stackinputs';
      });
      this.set(`fields.${ind}.defaultValue`, this.yamlInputs);
      // console.log('template is redefined');

      let yamlOrForm = 'form';
      const template = this.model.templates[params.template];
      // console.log('Computing Fields started');

      if (this.fields) {
        const yf = this.fields.find(f => {
          return f.name === 'yaml_or_form';
        });
        if (yf && yf.value) yamlOrForm = yf.value;
        else yamlOrForm = 'form';
      }

      const ret = [
        {
          name: 'name',
          label: 'Stack Name',
          type: 'text',
          value: '',
          isLead: true,
          defaultValue: '',
          placeholder: '',
          errorMessage: 'Please enter a name for the stack',
          show: true,
          required: true,
        },
        {
          name: 'description',
          label: 'Stack Description',
          type: 'textarea',
          value: '',
          defaultValue: '',
          placeholder: '',
          helptext: 'Choose a useful description for your stack',
          errorMessage: "Please enter stacks's description",
          show: true,
          required: false,
        },
        {
          name: 'yaml_or_form',
          label: 'YAML or form',
          type: 'radio',
          value: yamlOrForm,
          defaultValue: 'form',
          helptext: 'Choose the way you want to insert inputs',
          errorMessage: 'Choose an input format',
          show: true,
          required: true,
          options: [
            {
              title: 'Form',
              val: 'form',
            },
            {
              title: 'YAML',
              val: 'yaml',
            },
          ],
        },
        {
          name: 'stackinputs',
          label: 'Stack Inputs YAML',
          type: 'textarea',
          value: this.yamlInputs,
          defaultValue: this.yamlInputs,
          placeholder: '',
          helptext: 'Enter the stack inputs in yaml format',
          errorMessage: "Please enter stacks's inputs",
          show: true,
          required: true,
          showIf: {
            fieldName: 'yaml_or_form',
            fieldValues: ['yaml'],
          },
        },
      ];

      if (template && template.inputs) {
        template.inputs.forEach(inp => {
          inp.showIf = {
            fieldName: 'yaml_or_form',
            fieldValues: ['form'],
          };
          inp.label = inp.name.replace(/_/g, ' ');
          inp.defaultValue = inp.default;
          inp.value = inp.value || inp.default;

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
            inp.options = []; // this.model.keysArray;
          }

          // make cloud dropdown
          if (inp.name.startsWith('mist_cloud')) {
            inp.label = 'cloud';
            inp.type = 'mist_dropdown';
            inp.helptext = 'Select cloud';
            inp.options = []; // this.model.cloudsArray;

            inp.options.forEach(o => {
              o.disabled = !o.enabled;
            });
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

          // make image & location dependent on cloud
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

          // make size dependent on cloud
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
            inp.label = inp.name.split('mist_machine_')[1] || '';
            inp.required = true;
            if (inp.name.endsWith('list')) {
              inp.multi = true;
            } else {
              inp.multi = false;
            }
            inp.quantity = 1;
            inp.valid = false;
            inp.show = true;
            inp.type = 'mist_machine';
            inp.cloud = '';
            inp.machine = '';
            inp.image = '';
            inp.size = '';
            inp.location = '';
            inp.key = '';
            inp.networks = [];
            inp.value = {};
            inp.helptext = inp.description;
            if (this.model) {
              inp.clouds = this.model.clouds;
              inp.keys = this.model.keys;
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
            inp.show = false;
            inp.required = false;
          }

          ret.push(inp);
        }, this);
      }

      ret.push({
        name: 'deploy',
        label: 'Deploy Now',
        type: 'toggle',
        value: true,
        defaultValue: true,
        placeholder: true,
        helptext: 'Enable this option to deploy your stack now',
        errorMessage: '',
        show: true,
        required: false,
      });
      this.set('fields', ret);

      return this.model.templates[params.template];
    }
    console.log('Template is missing');
    return {
      name: 'Template is missing',
    };
  },

  _computeFields(
    _template,
    _templateInps,
    _templateInputs,
    _modelTemplates,
    _clouds,
    _keys,
    _params
  ) {
    this.fields.forEach((inp, index) => {
      if (inp.name.startsWith('mist_key')) {
        this.set(`fields.${index}.options`, this.model.keysArray);
      }

      if (inp.name.startsWith('mist_cloud')) {
        this.set(`fields.${index}.options`, this.model.cloudsArray);
        this.fields[index].options.forEach(o => {
          o.disabled = !o.enabled;
        });
      }

      if (inp.name.startsWith('mist_tags')) {
        this.set(`fields.${index}.value`, []);
      }

      if (inp.name.startsWith('mist_')) {
        this.set(
          `fields.${index}.label`,
          this.get(`fields.${index}.label`).replace('mist ', '')
        );
      }

      if (inp.options && inp.options.length === 1) {
        if (inp.type === 'dropdown')
          this.set(`fields.${index}.value`, inp.options[0].val);
        else this.set(`fields.${index}.value`, inp.options[0].id);
      }

      if (inp.name.startsWith('mist_machine')) {
        inp.keys = this.model.keys;
      }
    }, this);
  },

  _updateFields(event) {
    // if a cloud changed
    function copy(o) {
      // deep copy an array of objects
      let v;
      const output = Array.isArray(o) ? [] : {};
      Object.keys(o || {}).forEach(key => {
        v = o[key];
        output[key] = typeof v === 'object' ? copy(v) : v;
      });
      return output;
    }
    if (
      this.fields &&
      event &&
      event.path
        .map(i => {
          return i.id;
        })
        .join(',')
        .indexOf('mist_cloud') > -1
    ) {
      const fieldName = event.path.find(f => {
        return f.id && f.id.indexOf('mist_cloud') > -1;
      });
      const fieldIndex =
        fieldName &&
        this.fieldIndexByName(
          fieldName.id.replace('app-form-create_stack-', '')
        );
      const field = fieldIndex > -1 && this.fields[fieldIndex];

      if (
        field &&
        field.name.startsWith('mist_cloud') &&
        this.model.clouds[field.value]
      ) {
        // reset fields if cloud changed
        const fields = copy(this.fields);
        this.set('fields', []);
        this.set('fields', fields);
      }
    }
    const e = dom(event);
    const changeInYaml =
      e &&
      e.path &&
      e.path.indexOf(
        document.querySelector(
          'paper-textarea#app-form-create_stack-stackinputs'
        )
      ) > -1;
    if (changeInYaml) {
      const yaml = document.querySelector(
        'paper-textarea#app-form-create_stack-stackinputs'
      ).value;
      const yamlArray = yaml.split('\n');
      const inputs = [];
      yamlArray.forEach(line => {
        const name = line.split(':')[0].trim();
        let value = line.split(':')[1];
        if (value) value = value.trim();
        inputs[name] = value;
      });

      this.fields.forEach((f, index) => {
        if (inputs[f.name]) this.set(`fields.${index}.value`, inputs[f.name]);
      }, this);
    } else {
      const cloud = this.fields.find(f => {
        return f.name.startsWith('mist_cloud');
      });
      let yamlInputs = '';
      this.fields.forEach((inp, index) => {
        let fieldCloud; // cloud field Object
        let xid; // resource batch index type string ex _1
        let cloudId; // mist cloud id

        if (
          [
            'name',
            'description',
            'yaml_or_form',
            'stackinputs',
            'deploy',
          ].indexOf(inp.name) === -1
        ) {
          yamlInputs += `${inp.name}: `;
          const preformatedValue = inp.preformatPayloadValue
            ? inp.preformatPayloadValue.apply(inp.value)
            : inp.value;
          let val = preformatedValue
            ? JSON.stringify(preformatedValue)
            : inp.defaultValue;
          if (inp.value === 'custom') {
            val = JSON.stringify(inp.customValue);
          }
          yamlInputs += `${val}\n`;
        }

        // mist-machine contains its own cloud value
        if (inp.name.startsWith('mist_machine')) {
          if (this.model) {
            inp.clouds = this.model.clouds;
            inp.keys = this.model.keys;
          }
        }
        if (cloud && cloud.value) {
          if (inp.name.startsWith('mist_cloud')) {
            [xid] = inp.name.split('mist_cloud');
            cloudId = inp.value;
            if (cloudId && this.fieldIndexByName(`mist_size${xid}`) > -1) {
              if (
                ['onapp', 'vsphere', 'libvirt', 'gce'].indexOf(
                  this.model.clouds[cloudId].provider
                ) > -1
              ) {
                this.set(
                  `fields.${this.fieldIndexByName(`mist_size${xid}`)}.custom`,
                  true
                );
                this.set(
                  `fields.${this.fieldIndexByName(
                    `mist_size${xid}`
                  )}.customValue`,
                  {}
                );
              } else {
                this.set(
                  `fields.${this.fieldIndexByName(`mist_size${xid}`)}.custom`,
                  false
                );
                this.set(
                  `fields.${this.fieldIndexByName(
                    `mist_size${xid}`
                  )}.customValue`,
                  false
                );
              }
            }
            if (!inp.show) {
              inp.excludeFromPayload = true;
            } else {
              inp.excludeFromPayload = false;
            }
          }
          if (inp.name.startsWith('mist_location')) {
            [xid] = inp.name.split('mist_location');
            fieldCloud =
              this.fields.find(f => {
                return f.name.startsWith(`mist_cloud${xid}`);
              }) || cloud;
            cloudId = fieldCloud.value;
            if (cloudId)
              inp.options = Object.values(this.model.clouds[cloudId].locations);
          }
          if (inp.name.startsWith('mist_image')) {
            [xid] = inp.name.split('mist_image');
            fieldCloud =
              this.fields.find(f => {
                return f.name.startsWith(`mist_cloud${xid}`);
              }) || cloud;
            cloudId = fieldCloud.value;
            if (this.model && cloudId)
              inp.options = this.model.clouds[cloudId].imagesArray;
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
            else inp.options = [];
          }
          if (inp.name.startsWith('mist_size')) {
            [xid] = inp.name.split('mist_size');
            fieldCloud =
              this.fields.find(f => {
                return f.name.startsWith(`mist_cloud${xid}`);
              }) || cloud;
            cloudId = fieldCloud.value;
            if (cloudId) {
              inp.options = this.model.clouds[cloudId].sizesArray
                ? this.model.clouds[cloudId].sizesArray
                : [];
              if (
                ['onapp', 'vsphere', 'libvirt'].indexOf(
                  this.model.clouds[cloudId].provider
                ) > -1
              ) {
                const { provider } = this.model.clouds[cloudId];
                const { fields } = MACHINE_CREATE_FIELDS.find(p => {
                  return p.provider === provider;
                });
                inp.custom = true;
                inp.value = 'custom';
                inp.customSizeFields = fields.find(f => {
                  return f.type === 'mist_size';
                }).customSizeFields;
              } else inp.custom = false;
            }
          }

          if (inp.options && inp.options.length === 1) {
            const f = this.get(`fields.${index}`); // maybe wrong
            if (inp.type === 'dropdown') {
              this.set(`fields.${index}.value`, f.options[0].val);
            } else {
              this.set(`fields.${index}.value`, f.options[0].id);
            }
          }
        }
      }, this);

      this.set('yamlInputs', yamlInputs);

      // pass values into form's stackinputs value
      let ind;
      this.fields.find((f, index) => {
        ind = index;
        return f.name === 'stackinputs';
      });

      this.set(`fields.${ind}.value`, this.yamlInputs);
    }
  },
  /* eslint-enable no-param-reassign */
  fieldIndexByName(name) {
    const index = this.fields.findIndex(f => {
      return f.name === name;
    });
    return index;
  },
  /* eslint-disable no-param-reassign */
  updateKeys(e) {
    // console.log('_updateKeys', e);
    this.async(
      () => {
        // console.log(this.template);
        if (this.fields)
          this.fields.forEach((f, index) => {
            // make key dropdown && select newly created key
            if (f.name.startsWith('mist_key')) {
              f.options = this.model.keysArray;
              this.set(`fields.${index}.value`, e.detail.key);
            }
          }, this);
      },
      1000,
      this
    );
  },
  /* eslint-enable no-param-reassign */
  _handleRequest(_e) {},

  _handleResponse(e) {
    // console.log('create stack ', e);
    const response = YAML.parse(e.detail.xhr.response);
    const sid = response.id;
    this.dispatchEvent(
      new CustomEvent('go-to', {
        bubbles: true,
        composed: true,
        detail: {
          url: `/stacks/${sid}`,
        },
      })
    );

    this.debounce(
      'resetForm',
      () => {
        this._resetForm();
      },
      500
    );
  },

  _handleError(_e) {},

  _resetForm(_e) {
    // Reset form
    Object.keys(this.form).forEach(attr => {
      this.set(`form.${attr}`, '');
    });
    // Reset Form Fields
    this.fields.forEach((el, index) => {
      if (el.showIf) {
        this.set(`fields.${index}.show`, false);
      }
      // Reset Form Fields Validation
      this._resetField(el, index);
    }, this);
  },

  _computeProviderLogo(provider) {
    return `assets/providers/provider-${provider}.png`;
  },

  _resetField(_el, _index) {
    // this.set('fields.' + index + '.value', el.defaultValue);
    // var input = this.shadowRoot.querySelector('#' + el.name);
    // if (input) {
    //     input.invalid = false;
    // }
  },
});
