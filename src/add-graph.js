import '../node_modules/@polymer/polymer/polymer-legacy.js';
import '../node_modules/@vaadin/vaadin-dialog/vaadin-dialog.js';
import '../node_modules/@polymer/paper-button/paper-button.js';
import '../node_modules/@polymer/paper-checkbox/paper-checkbox.js';
import '../node_modules/@polymer/paper-item/paper-item.js';
import '../node_modules/@polymer/paper-input/paper-input.js';
import '../node_modules/@polymer/paper-input/paper-textarea.js';
import '../node_modules/@polymer/paper-dialog-scrollable/paper-dialog-scrollable.js';
import '../node_modules/@polymer/paper-listbox/paper-listbox.js';
import '../node_modules/@polymer/iron-behaviors/iron-control-state.js';
import '../node_modules/@polymer/iron-collapse/iron-collapse.js';
import '../node_modules/@polymer/iron-ajax/iron-ajax.js';
import '../node_modules/@polymer/paper-spinner/paper-spinner.js';
import './metric-menu.js';
import './custom-graph.js';
import { Polymer } from '../node_modules/@polymer/polymer/lib/legacy/polymer-fn.js';
import { html } from '../node_modules/@polymer/polymer/lib/utils/html-tag.js';

Polymer({
  _template: html`
    <style include="shared-styles forms">
      :host {
        position: relative;
      }

      #selectTarget {
        position: absolute !important;
        min-width: 300px;
      }

      paper-textarea#juicyScript ::slotted(paper-input-container #inner-editor),
      paper-textarea#juicyScript
        ::slotted(paper-input-container textarea#textarea) {
        font-family: monospace !important;
        font-size: 12px;
      }

      paper-textarea#juicyScript ::slotted(.floated-label-placeholder) {
        display: none;
      }

      hr {
        margin-left: -24px;
        margin-right: 24px;
      }

      div > h2.textarea-h2 {
        padding-bottom: 0;
      }

      .errormsg-container {
        color: var(--red-color);
      }

      .errormsg-container iron-icon {
        color: inherit;
        vertical-align: bottom;
        padding-right: 8px;
      }

      .add-button {
        background-color: transparent;
        float: left;
        display: block;
        text-align: left;
        margin-top: 4px;
        font-weight: 500;
      }

      .add-button iron-icon {
        color: inherit;
        opacity: 0.32;
      }

      .paper-dialog-scrollable {
        padding: 0 !important;
      }

      .paper-dialog-scrollable paper-item {
        padding-left: 10px !important;
        position: relative;
        cursor: pointer;
        border-bottom: 1px solid #ddd;
      }

      .paper-dialog-scrollable .expand-more {
        position: absolute;
        right: 4px;
      }

      .paper-dialog-scrollable paper-listbox:not(.main) {
        padding: 0 0 0 16px;
      }

      .loader {
        margin: 8px;
        display: block;
        text-align: center;
      }

      .loader paper-spinner {
        padding: 8px;
      }

      #customButton {
        width: 100%;
      }

      #customOptions {
        max-width: 500px;
      }
    </style>
    <paper-button on-tap="openDialog" class="add-button">
      <iron-icon icon="icons:add-circle"></iron-icon> Add Graph
    </paper-button>
    <vaadin-dialog id="selectTarget" theme="mist-dialog" with-backdrop="">
      <template>
        <h2>Select target for graph</h2>
        <div class="paper-dialog-scrollable">
          <paper-listbox class="main">
            <paper-button
              id="customButton"
              on-tap="_showCustomGraphDialog"
              class="blue"
              >Custom</paper-button
            >
            <template is="dom-repeat" items="[[responseMetricsArray]]">
              <metric-menu
                machine="[[machine.id]]"
                metric="[[item]]"
              ></metric-menu>
            </template>
          </paper-listbox>
          <div class="loader" hidden$="{{!loadingMetrics}}">
            Loading custom server metrics
            <br />
            <paper-spinner active="{{loadingMetrics}}"></paper-spinner>
          </div>
        </div>
      </template>
    </vaadin-dialog>
    <vaadin-dialog id="customOptions" theme="mist-dialog" with-backdrop="">
      <template>
        <custom-graph
          ssh-key-exists="[[sshKeyExists]]"
          metric="{{metric}}"
          machine="{{machine}}"
          uri="[[uri]]"
        ></custom-graph>
      </template>
    </vaadin-dialog>
    <iron-ajax
      id="metrics"
      url="[[_computeMetricsUri(machine.id)]]"
      handle-as="json"
      method="GET"
      contenttype="application/json"
      loading="{{loadingMetrics}}"
      on-response="_handleMetricResponse"
      on-error="_handleMetricError"
    >
    </iron-ajax>
  `,

  is: 'add-graph',

  properties: {
    panel: {
      type: Object,
    },
    data: {
      type: Object,
    },
    machine: {
      type: Object,
    },
    responseMetrics: {
      type: Object,
      value: null,
    },
    responseMetricsArray: {
      type: Array,
      value: null,
    },
    target: {
      type: String,
    },
    hide: {
      type: Boolean,
      value: true, // init the value to true so it will be hidden on page load
    },
    metricScript: {
      type: String,
    },
    machineKeys: {
      type: Array,
      value() {
        return [];
      },
    },
    sshKeyExists: {
      type: Boolean,
      computed: 'computeSshKeyExists(machineKeys)',
      value: true,
    },
    uri: {
      type: String,
    },
    metric: {
      type: Object,
      value() {
        return {
          name: null,
          unit: null,
          type: 'gauge',
          script:
            '#!/usr/bin/env python\nimport random \n \ndef read(): \n    # return random value \n    return random.random() \n',
          pluginId: null,
        };
      },
    },
  },

  observers: ['_metricScriptChanged(metricScript)'],

  listeners: {
    keyup: '_scriptValue',
    'panel-added': '_associateMetric',
  },

  _scriptValue(e) {
    if (e.target.id === 'juicyScript') {
      this.set('metric.script', e.target.value.trim());
    }
  },

  _computeMetricsUri(machineId) {
    return `/api/v1/metrics?resource_type=machine&resource_id=${machineId};`;
  },

  openDialog() {
    if (!this.responseMetrics) {
      this.shadowRoot.querySelector('#metrics').generateRequest();
    }
    this.shadowRoot.querySelector('#selectTarget').opened = true;
  },

  _handleMetricResponse(data) {
    console.log('_handleMetricResponse', data);
    const output = {};
    Object.keys(data.detail.response).forEach(i => {
      let res = output;
      const splitArray = i.split('.');
      for (let p = 0; p < splitArray.length; p++) {
        if (!res[splitArray[p]]) {
          res[splitArray[p]] = {};
        }
        if (p === splitArray.length - 1) {
          res[splitArray[p]] = data.detail.response[i].id;
        }
        res = res[splitArray[p]];
      }
    });
    this.set('responseMetrics', output);
    this.set('responseMetricsArray', this._makeArray(output));
  },

  _makeArray(output) {
    const arr = [];
    if (output) {
      if (output && typeof output === 'object') {
        let obj = {};
        Object.keys(output).forEach(p => {
          if (typeof output[p] === 'object') {
            obj = { name: p, options: this._makeArray(output[p]) };
          } else {
            obj = { name: output[p], options: [] };
          }
          arr.push(obj);
        });
      }
    }
    return arr;
  },

  _showCustomGraphDialog() {
    this.$.customOptions.opened = true;
  },

  computeSshKeyExists(keys) {
    return keys.length > 0;
  },

  _openAddKeyPanel() {
    document.querySelector('#customOptions').opened = false;
    document.querySelector('#selectTarget').opened = false;
    this.dispatchEvent(
      new CustomEvent('open-and-select', { bubbles: true, composed: true })
    );
  },

  _metricScriptChanged(_m) {
    // make sure long scripts don't push buttons out of the screen
    this.$.customOptions.refit();
  },
});
