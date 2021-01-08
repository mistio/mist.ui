import '@polymer/polymer/polymer-legacy.js';
import '@polymer/paper-item/paper-item.js';
import '@polymer/iron-collapse/iron-collapse.js';
import '@polymer/iron-icons/iron-icons.js';
import '@polymer/paper-spinner/paper-spinner.js';
import '@polymer/iron-ajax/iron-ajax.js';
import { CSRFToken } from './helpers/utils.js';
import { Polymer } from '@polymer/polymer/lib/legacy/polymer-fn.js';
import { html } from '@polymer/polymer/lib/utils/html-tag.js';

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
      iron-collapse {
        margin-left: 16px;
      }
    </style>

    <template is="dom-if" if="[[metric.options.length]]">
      <paper-item on-tap="toggle"
        >[[metric.name]] <iron-icon icon="icons:expand-more"></iron-icon
      ></paper-item>
      <iron-collapse id="collapse">
        <template is="dom-repeat" items="[[metric.options]]">
          <metric-menu machine="[[machine]]" metric="[[item]]"></metric-menu>
        </template>
      </iron-collapse>
    </template>

    <template is="dom-if" if="[[!metric.options.length]]">
      <paper-item on-tap="addGraph">[[metric.name]] </paper-item>
    </template>

    <iron-ajax
      id="associateMetric"
      handle-as="xml"
      method="PUT"
      contenttype="application/json"
      loading="{{loadingMetrics}}"
      on-response="_handleAssociateResponse"
      on-error="_handleAssociateError"
    >
    </iron-ajax>
  `,

  is: 'metric-menu',

  properties: {
    metric: {
      type: Object,
    },
    machine: {
      type: String,
    },
  },

  toggle(_e) {
    this.shadowRoot.querySelector('iron-collapse').toggle();
  },
  /* eslint-disable no-param-reassign */
  addGraph(_e) {
    console.log('addGraph', this.machine);
    document.querySelectorAll('vaadin-dialog-overlay').forEach(el => {
      el.opened = false;
    });
    const metric = this.metric.name;
    const payload = {
      metric_id: metric,
    };
    this.$.associateMetric.url = `/api/v1/machines/${this.machine}/metrics`;
    this.$.associateMetric.headers['Csrf-Token'] = CSRFToken.value;
    this.$.associateMetric.params = payload;
    this.$.associateMetric.generateRequest();
  },
  /* eslint-enable no-param-reassign */
  _handleAssociateResponse(e) {
    console.log('event in add-graph');
    e.stopPropagation();
    document.querySelector('mist-app').fire('update-dashboard');
  },
});
