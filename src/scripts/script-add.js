import '@polymer/paper-material/paper-material.js';
import '@polymer/paper-button/paper-button.js';
import '@polymer/paper-progress/paper-progress.js';
import '@polymer/paper-styles/typography.js';
import '../app-form/app-form.js';
import { Polymer } from '@polymer/polymer/lib/legacy/polymer-fn.js';
import { html } from '@polymer/polymer/lib/utils/html-tag.js';

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
        @apply --script-page-head-mixin;
      }
    </style>

    <div id="content">
      <paper-material class="single-head layout horizontal">
        <span class="icon">
          <iron-icon icon="[[section.icon]]"></iron-icon>
        </span>
        <div class="title flex">
          <h2>Add Script</h2>
          <div class="subtitle">You can add scripts inline or from a url.</div>
        </div>
      </paper-material>
      <paper-material>
        <app-form
          fields="[[fields]]"
          form="{{script}}"
          url="/api/v1/scripts"
          on-response="_addScriptAjaxResponse"
        ></app-form>
      </paper-material>
    </div>
  `,

  is: 'script-add',

  properties: {
    section: {
      type: Object,
    },
    model: {
      type: Object,
    },
    script: {
      type: Object,
      value() {
        return {
          name: '',
          script: '',
          exec_type: '',
          entrypoint: '',
          location_type: '',
          description: '',
        };
      },
    },
    typedName: {
      type: String,
      value: '',
      notify: true,
    },
    fields: {
      type: Array,
      value() {
        return [
          {
            name: 'name',
            label: 'Script Name *',
            type: 'text',
            value: '',
            isLead: true,
            defaultValue: '',
            placeholder: '',
            errorMessage: "Please enter script's name",
            show: true,
            required: true,
          },
          {
            name: 'description',
            label: 'Script Description',
            type: 'textarea',
            value: '',
            defaultValue: '',
            placeholder: '',
            errorMessage: "Please enter script's description",
            show: true,
            required: false,
            helptext: 'Optional.',
          },
          {
            name: 'exec_type',
            label: 'Type *',
            type: 'dropdown',
            value: '',
            defaultValue: '',
            errorMessage: "Please enter script's description",
            show: true,
            required: true,
            options: [
              {
                title: 'Executable',
                val: 'executable',
              },
              {
                title: 'Ansible Playbook',
                val: 'ansible',
              },
            ],
            helptext:
              'Choose the type of your script. Consult the docs, on adding your scripts',
            helpHref: 'http://docs.mist.io/category/57-managing-your-scripts',
          },
          {
            name: 'location_type',
            label: 'Source *',
            type: 'dropdown',
            value: '',
            defaultValue: '',
            errorMessage: "Please enter script's source",
            show: true,
            required: true,
            options: [
              {
                title: 'Github',
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
            helptext: 'Specify the type of your script source.',
          },
          {
            name: 'script_url',
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
            helptext: 'Specify the url where the script is located.',
          },
          {
            name: 'script_github',
            label: 'Github Repo *',
            type: 'text',
            value: '',
            defaultValue: '',
            placeholder: 'https://github.com/owner/repo',
            show: false,
            required: true,
            showIf: {
              fieldName: 'location_type',
              fieldValues: ['github'],
            },
            errorMessage: 'Please enter a github repo',
            helptext: 'Specify the github repo where the script is located.',
          },
          {
            name: 'script_inline',
            label: 'Script *',
            type: 'codeEditor',
            language: 'shell',
            languages: [
              { name: 'bash', type: 'shell' },
              { name: 'yaml', type: 'yaml' },
              { name: 'sh', type: 'shell' },
              { name: 'zsh', type: 'shell' },
              { name: 'python', type: 'python' },
              { name: 'node', type: 'javascript' },
              { name: 'perl', type: 'perl' },
              { name: 'fish', type: 'shell' },
              { name: 'powershell', type: 'powershell' },
            ],
            showLanguageDropdown: true,
            showToolbar: true,
            value: '#!/bin/sh\necho "Hello world"',
            class: 'script',
            defaultValue: '',
            show: false,
            required: true,
            errorMessage: 'Please enter inline script',
            placeholder: '',
            showIf: {
              fieldName: 'location_type',
              fieldValues: ['inline'],
            },
            helptext:
              "Copy paste your script. Make sure the script's format is aligned to the examples",
          },
          {
            name: 'entrypoint',
            label: 'Entry point',
            type: 'text',
            value: '',
            defaultValue: '',
            placeholder: 'main.yaml',
            show: false,
            required: false,
            showIf: {
              fieldName: 'location_type',
              fieldValues: ['github', 'url'],
            },
            errorMessage: 'Please enter entry point',
            helptext:
              "Specify the .yml entrypoint file, otherwise 'main.yml' will be used as default.",
          },
        ];
      },
      notify: true,
    },
    origin: {
      type: String,
    },
    docs: {
      type: String,
      value: '',
    },
  },

  observers: ['_execTypeChanged(script.exec_type)'],
  listeners: {
    'editor-language-changed': '_editorLanguageChanged',
  },
  ready() {
    if (
      document
        .querySelector('mist-app')
        .shadowRoot.querySelector('app-location')
    ) {
      this.set(
        'origin',
        document
          .querySelector('mist-app')
          .shadowRoot.querySelector('app-location').queryParams.origin
      );
    }
    if (!this.docs)
      for (let i = 0; i < this.fields.length; i++) this.fields[i].helpHref = '';
  },

  _fieldIndexByName(name) {
    return this.fields.findIndex(f => f.name === name);
  },
  _editorLanguageChanged(e) {
    const { language } = e.detail;
    if (language.name === 'yaml') return;
    const index = this._fieldIndexByName('script_inline');
    const strArray = this.fields[index].value.split('\n');
    if (strArray[0]) strArray[0] = `#!/usr/bin/env ${language.name}`;
    this.set(`fields.${index}.value`, strArray.join('\n'));
  },
  _execTypeChanged(type) {
    let placeholder = '';
    let language = '';
    if (type === 'executable') {
      placeholder = "#!/usr/bin/env bash\necho 'hello world'";
      language = 'bash';
    } else if (type === 'ansible') {
      language = 'yaml';
      placeholder =
        "- name: Hello world playbook\n  hosts: localhost\n  tasks:\n    - name: Dummy task\n      debug:\n        msg: 'Hello World'\n";
    }
    const index = this._fieldIndexByName('script_inline');
    this.set(`fields.${index}.value`, placeholder);
    this.set(`fields.${index}.language`, language);
  },

  _addScriptAjaxResponse(e) {
    const response = JSON.parse(e.detail.xhr.response);
    if (!this.origin) {
      this.dispatchEvent(
        new CustomEvent('go-to', {
          bubbles: true,
          composed: true,
          detail: {
            url: `/scripts/${response.id}`,
          },
        })
      );
    } else {
      const goToPath = this.origin;
      this.dispatchEvent(
        new CustomEvent('update-scripts', {
          bubbles: true,
          composed: true,
          detail: {
            script: response.id,
          },
        })
      );
      this.dispatchEvent(
        new CustomEvent('go-to', {
          bubbles: true,
          composed: true,
          detail: {
            url: goToPath,
          },
        })
      );
    }
  },
});
