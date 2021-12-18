import '@polymer/polymer/polymer-legacy.js';
import '@polymer/paper-item/paper-item.js';
import '@polymer/iron-collapse/iron-collapse.js';
import '@polymer/iron-icons/iron-icons.js';
import '@polymer/paper-spinner/paper-spinner.js';
import '@polymer/paper-progress/paper-progress.js';
import '@polymer/iron-ajax/iron-ajax.js';
import '@mistio/mist-list/code-viewer.js';
import { Polymer } from '@polymer/polymer/lib/legacy/polymer-fn.js';
import { html } from '@polymer/polymer/lib/utils/html-tag.js';
import { CSRFToken } from './helpers/utils.js';

Polymer({
  _template: html`
    <style include="shared-styles">
      :host {
        position: relative;
        outline: none;
        cursor: pointer;
      }
      paper-item {
        cursor: pointer;
      }
      .progress {
        margin: 32px 0 0 0;
        width: 100%;
      }

      paper-progress {
        width: 100%;
        margin: 0;
      }

      hr.divider {
        opacity: 0.5;
        margin: 0;
      }

      .buttons {
        padding: 24px 0;
        display: flex;
        justify-content: flex-end;
      }

      .errormsg-container {
        color: var(--red-color);
      }

      #juicyScript {
        font-family: monospace;
        height: 400px;
      }

      paper-progress#progresserror {
        --paper-progress-active-color: var(--red-color);
      }

      paper-checkbox {
        --paper-checkbox-checked-color: var(--mist-blue) !important;
        --paper-checkbox-checked-ink-color: var(--mist-blue) !important;
      }
      paper-textarea {
        --paper-input-container-shared-input-style_-_font-family: monospace;
      }
    </style>

    <h2>Custom graph</h2>
    <div class="paper-dialog-scrollable">
      <p hidden="[[!sshKeyExists]]">
        Your Python script will be saved in scripts section, even if it fails to
        be deployed. Scripts must have a unique name.
      </p>
      <div id="sshKeyMissing" hidden="[[sshKeyExists]]">
        <span>You need to have an associated SSH key to add custom graphs</span>
        <paper-button id="addKey" on-tap="_openAddKeyPanel"
          >Add Key</paper-button
        >
      </div>
      <div>
        <paper-input
          id="name"
          value="{{metric.name}}"
          label="Name"
          placeholder="e.g my metric"
          disabled$="[[!sshKeyExists]]"
        ></paper-input>
        <paper-input
          id="unit"
          value="{{metric.unit}}"
          label="Unit"
          placeholder="e.g bytes (optional)"
          disabled$="[[!sshKeyExists]]"
        ></paper-input>
      </div>
      <div>
        <h2 class$="sshKey-[[sshKeyExists]] textarea-h2">Python script</h2>
        <template is="dom-if" if="[[sshKeyExists]]" restamp="">
          <code-viewer
            id="juicyScript"
            script-name="custom-metric-script"
            language="python"
            value="{{metric.script}}"
            on-editor-value-changed="_codeEditorValueChanged"
            show-language
            show-download
          ></code-viewer>
        </template>
      </div>
      <div>
        <paper-checkbox id="derivative" disabled$="[[!sshKeyExists]]"
          >Calculate derivative</paper-checkbox
        >
      </div>
    </div>
    <div class="progress">
      <paper-progress
        id="progress"
        indeterminate=""
        hidden$="[[!sendingData]]"
      ></paper-progress>
      <paper-progress
        id="progresserror"
        value="100"
        hidden$="[[!formError]]"
      ></paper-progress>
      <hr class="divider" />
      <p class="errormsg-container" hidden$="[[!formError]]">
        <iron-icon icon="icons:error-outline"></iron-icon
        ><span id="errormsg"></span>
      </p>
    </div>
    <div class="buttons">
      <paper-button on-tap="_closeDialog">Cancel</paper-button>
      <paper-button
        id="submit"
        align="center"
        on-tap="_generateCustomgraphrequest"
        disabled="[[!formReady]]"
        class="blue"
      >
        Add custom graph</paper-button
      >
    </div>
    <iron-ajax
      id="postCustomgraph"
      url="[[uri]]"
      handle-as="xml"
      method="POST"
      contenttype="application/json"
      on-response="_customgraphResponse"
      on-error="_handleError"
    ></iron-ajax>
  `,

  is: 'custom-graph',

  properties: {
    metric: {
      type: Object,
    },
    formReady: {
      type: Boolean,
      value: false,
      computed: 'computeFormReady(metric.*)',
    },
    uri: {
      type: String,
    },
    machine: {
      type: String,
    },
    sshKeyExists: {
      type: Boolean,
    },
    sendingData: {
      type: Boolean,
      value: false,
    },
    formError: {
      type: Boolean,
      value: false,
    },
  },

  observers: ['_computepluginId(metric.name)'],

  computeFormReady(metric) {
    return (
      metric.base.name !== '' &&
      metric.base.name !== null &&
      typeof metric.base.name !== 'undefined' &&
      metric.base.script !== '' &&
      typeof metric.base.script !== 'undefined'
    );
  },

  toggle(_e) {
    this.shadowRoot.querySelector('iron-collapse').toggle();
  },
  /* eslint-disable no-param-reassign */
  _customgraphResponse(data) {
    this.set('sendingData', false);
    this.set('formError', false);
    console.log('CUSTOM GRAPH', data.detail.response);
    document.querySelector('mist-app').fire('update-dashboard');
    document.querySelectorAll('vaadin-dialog-overlay').forEach(el => {
      el.opened = false;
    });
  },
  /* eslint-enable no-param-reassign */
  _computepluginId(name) {
    if (!this.metric.name) return;
    const newPluginId = this.metric.name
      .toLowerCase() // Remove upper case letters
      .replace(/[^\w]/g, '_') // keep only alphanumeric and _ chars
      .replace(/__*/g, '_') // don't allow double underscores
      .replace(/^_/, '') // trim heading underscore
      .replace(/_$/, ''); // trim trailing underscore
    this.set('metric.pluginId', newPluginId);
    this.set('metric.name', name);
    if (this.metric.script) {
      this.debounce(
        '_updateMetricScript',
        () => {
          const lines = this.metric.script.trim().split('\n');
          if (lines[lines.length - 1].startsWith('print')) {
            lines.pop();
          }
          lines[
            lines.length
          ] = `print("${this.metric.name} value=%s" % read())`;
          this.set('metric.script', lines.join('\n'));
        },
        500
      );
    }
  },

  _codeEditorValueChanged(e) {
    this.debounce(
      'codeEditorValueChanged',
      () => {
        this.metric.script = e.detail.value;
      },
      500
    );
  },

  _computeUrl(machineId, pluginId) {
    this.uri = `/api/v1/machines/${machineId}/plugins/${pluginId}`;
  },

  _generateCustomgraphrequest() {
    this.set('formError', false);
    this._computeUrl(this.machine.id, this.metric.pluginId);
    if (this.$.derivative.checked) {
      this.metric.type = 'derive';
    } else {
      this.metric.type = 'gauge';
    }
    const payload = {
      plugin_type: 'python',
      name: this.metric.name,
      unit: this.metric.unit,
      value_type: this.metric.type,
      read_function: this.metric.script,
      host: this.machine.public_ips[0],
    };
    this.$.postCustomgraph.contentType = 'application/json';
    this.$.postCustomgraph.headers['Csrf-Token'] = CSRFToken.value;
    this.$.postCustomgraph.body = payload;
    this.$.postCustomgraph.generateRequest();
    this.set('sendingData', true);
  },

  _handleError(e, _d) {
    this.set('sendingData', false);
    this.set('formError', true);
    console.log('error', e, e.detail);
    const errorMessage =
      e.detail.request.xhr.response || e.detail.error.message || '';
    this.shadowRoot.querySelector('#errormsg').textContent = errorMessage;
  },
  /* eslint-disable no-param-reassign */
  _closeDialog() {
    document.querySelectorAll('vaadin-dialog-overlay').forEach(el => {
      el.opened = false;
    });
  },
  /* eslint-enable no-param-reassign */
});
