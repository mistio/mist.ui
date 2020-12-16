import '../../node_modules/@polymer/polymer/polymer-legacy.js';
import '../../node_modules/@polymer/paper-styles/typography.js';
import '../../node_modules/@polymer/paper-radio-group/paper-radio-group.js';
import '../../node_modules/@polymer/paper-radio-button/paper-radio-button.js';
import '../../node_modules/@polymer/paper-progress/paper-progress.js';
import '../../node_modules/@polymer/paper-listbox/paper-listbox.js';
import '../app-form/app-form.js';
import { YAML } from '../../node_modules/yaml/browser/dist/index.js';
import { Polymer } from '../../node_modules/@polymer/polymer/lib/legacy/polymer-fn.js';
import { html } from '../../node_modules/@polymer/polymer/lib/utils/html-tag.js';

const defaultTemplatesJS = [
  {
    name: 'Kubernetes blueprint',
    description:
      'This template contains a cloud agnostic blueprint to deploy Kubernetes cluster through Mist.io',
    exec_type: 'cloudify',
    location_type: 'github',
    template_github: 'https://github.com/mistio/kubernetes-blueprint',
    entrypoint: 'blueprint.yaml',
  },
  {
    name: 'Cloudify Blueprint example',
    description:
      'Simple Cloudify Blueprint example for provisioning resources through Mist.io',
    exec_type: 'cloudify',
    location_type: 'github',
    template_github:
      'https://github.com/mistio/simple-resource-provisioning-blueprint',
    entrypoint: 'blueprint.yaml',
  },
];

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
      .single-head {
        @apply --template-page-head-mixin;
      }
    </style>

    <div id="content">
      <paper-material class="single-head layout horizontal">
        <span class="icon"
          ><iron-icon icon="[[section.icon]]"></iron-icon
        ></span>
        <div class="title flex">
          <h2>Add Template</h2>
          <div class="subtitle">
            Only TOSCA based templates are currently supported.
          </div>
        </div>
      </paper-material>
      <paper-material>
        <div class="grid-row">
          <div class="xs12 m6">
            <strong>Catalogue</strong><br />
            <br />You can optionally select from our template catalogue.
          </div>
          <paper-dropdown-menu
            class="xs12 m6"
            label="Catalogue Templates"
            horizontal-align="left"
          >
            <paper-listbox
              slot="dropdown-content"
              attr-for-selected="value"
              selected="{{selected}}"
              class="dropdown-content"
            >
              <template
                is="dom-repeat"
                items="[[defaultTemplates]]"
                as="defaultTemplate"
              >
                <paper-item value="[[index]]"
                  >[[defaultTemplate.name]]</paper-item
                >
              </template>
            </paper-listbox>
          </paper-dropdown-menu>
        </div>
        <hr />
        <app-form
          fields="{{fields}}"
          method="POST"
          form="[[template]]"
          url="/api/v1/templates"
          on-request="_addTemplateAjaxRequest"
          on-response="_addTemplateAjaxResponse"
          on-error="_addTemplateAjaxError"
        ></app-form>
      </paper-material>
    </div>
  `,

  is: 'template-add',

  properties: {
    sections: {
      type: Object,
    },
    section: {
      type: Object,
    },
    color: {
      type: String,
      computed: '_getHeaderStyle(section)',
    },
    selected: {
      type: Number,
      value: -1,
      notify: true,
    },
    template: {
      type: Object,
      value() {
        return {
          name: '',
          description: '',
          exec_type: '',
          location_type: '',
          template: '',
          entrypoint: '',
        };
      },
    },
    typedName: {
      type: String,
      value: '',
    },
    fields: {
      type: Array,
      value() {
        return [
          {
            name: 'name',
            label: 'Template Name *',
            type: 'text',
            value: '',
            isLead: true,
            defaultValue: '',
            placeholder: '',
            errorMessage: "Please enter template's name",
            show: true,
            required: true,
          },
          {
            name: 'description',
            label: 'Template Description',
            type: 'textarea',
            value: '',
            defaultValue: '',
            placeholder: '',
            errorMessage: "Please enter template's description",
            helptext: "Please enter template's description",
            show: true,
            required: false,
          },
          {
            name: 'exec_type',
            label: 'Type *',
            type: 'dropdown',
            value: 'cloudify',
            defaultValue: 'cloudify',
            errorMessage: "Please enter template's exec_type",
            helptext: "Please enter template's exec_type",
            show: true,
            required: true,
            options: [
              {
                title: 'Cloudify Blueprint',
                val: 'cloudify',
              },
            ],
          },
          {
            name: 'location_type',
            label: 'Source *',
            type: 'radio',
            value: '',
            defaultValue: '',
            errorMessage: "Please enter template's source",
            helptext: "Please enter template's location_type",
            show: true,
            required: true,
            options: [
              {
                title: 'Git',
                val: 'github',
              },
              {
                title: 'URL',
                val: 'url',
              },
              {
                title: 'Inline',
                val: 'inline',
              },
            ],
          },
          {
            name: 'template_url',
            label: 'Url *',
            type: 'text',
            value: 'http://',
            defaultValue: 'http://',
            placeholder: '',
            show: false,
            required: true,
            showIf: {
              fieldName: 'location_type',
              fieldValues: ['url'],
            },
            errorMessage: 'Please enter a url',
            helptext: 'Please enter a url',
          },
          {
            name: 'template_github',
            label: 'Git Repo *',
            type: 'text',
            value: 'https://github.com/owner/repo',
            defaultValue: 'https://github.com/owner/repo',
            placeholder: '',
            show: false,
            required: true,
            showIf: {
              fieldName: 'location_type',
              fieldValues: ['github'],
            },
            errorMessage: 'Please enter a git repo',
            helptext: 'Please enter a git repo',
          },
          {
            name: 'template_inline',
            label: 'Template *',
            type: 'textarea',
            value: '',
            defaultValue: '',
            placeholder: '',
            show: false,
            required: true,
            errorMessage: 'Please enter inline template',
            helptext: 'Please enter inline template',
            showIf: {
              fieldName: 'location_type',
              fieldValues: ['inline'],
            },
          },
          {
            name: 'entrypoint',
            label: 'Entry point *',
            type: 'text',
            value: '',
            defaultValue: '',
            placeholder: '',
            show: false,
            required: true,
            showIf: {
              fieldName: 'location_type',
              fieldValues: ['github', 'url'],
            },
            errorMessage: 'Please enter entry point',
            helptext: 'Please enter entry point',
          },
          {
            name: 'setuid',
            label: 'Let run as owner',
            type: 'toggle',
            value: false,
            defaultValue: false,
            show: true,
            required: false,
            helptext:
              'Enable to allow team members to run this template with owner rights.',
          },
        ];
      },
    },
    defaultTemplates: {
      type: Array,
    },
  },

  observers: [
    'useCatalogueTemplate(selected, fields)',
    'showWarning(fields.*)',
  ],

  listeners: {
    'reset-form': 'clearDropDown',
  },

  ready() {
    this.defaultTemplates = defaultTemplatesJS;
    this._resetForm();
  },

  _getHeaderStyle(section) {
    return `background-color: ${section.color}; color: #fff;`;
  },

  _addTemplateAjaxRequest() {
    this.set('sendingData', true);
  },

  _addTemplateAjaxResponse(e) {
    const response = YAML.parse(e.detail.xhr.response);
    this.dispatchEvent(
      new CustomEvent('go-to', {
        bubbles: true,
        composed: true,
        detail: { url: `/templates/${response.id}` },
      })
    );

    this.debounce(
      'resetForm',
      () => {
        this._resetForm();
      },
      500
    );

    this.set('sendingData', false);
  },

  _resetForm() {
    // Reset template
    this.set('selected', -1);
    this.set('template.name', '');
    this.set('template.source', '');
    this.set('template.url', '');
    this.set('template.inline', '');

    // Reset Form Fields
    this.fields.forEach((el, index) => {
      if (el.showIf) {
        this.set(`fields.${index}.show`, false);
      }

      // Reset Form Fields Validation
      this._resetField(el, index);
    }, this);
    this.typedName = '';
  },

  _resetField(el, index) {
    this.set(`fields.${index}.value`, el.defaultValue);

    const input = this.shadowRoot.querySelector(`#${el.name}`);
    if (input) {
      input.invalid = false;
    }
  },

  useCatalogueTemplate(selected) {
    this.fields.forEach((f, index) => {
      const key = f.name;
      if (selected > -1 && this.defaultTemplates[selected][key])
        this.set(`fields.${index}.value`, this.defaultTemplates[selected][key]);
    }, this);
  },

  clearDropDown() {
    this.set('selected', -1);
  },

  showWarning(fields) {
    // console.log("fields", fields);
    if (fields.path === 'fields.#8.value') {
      if (fields.value) {
        this.set(
          'fields.#8.warning',
          'Allowing the team to run this template as owner'
        );
        this.set('fields.#8.helptext', '');
      } else {
        this.set('fields.#8.warning', '');
        this.set(
          'fields.#8.helptext',
          'Enable to allow team members to run this template with owner priviledges.'
        );
      }
    }
  },
});
