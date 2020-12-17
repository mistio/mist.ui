import '@polymer/paper-item/paper-item.js';
import '@polymer/iron-collapse/iron-collapse.js';
import '@polymer/iron-icons/iron-icons.js';
import { Polymer } from '../../node_modules/@polymer/polymer/lib/legacy/polymer-fn.js';
import { html } from '../../node_modules/@polymer/polymer/lib/utils/html-tag.js';

Polymer({
  _template: html`
    <style include="shared-styles">
      :host {
        position: relative;
        outline: none;
        cursor: pointer;
        display: block;
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
        >[[metric.name]]<iron-icon icon="icons:expand-more"></iron-icon
      ></paper-item>
      <iron-collapse id="collapse">
        <template is="dom-repeat" items="[[metric.options]]" initial-count="3">
          <rule-metrics
            metric="[[item]]"
            index="[[index]]"
            query-index="[[queryIndex]]"
            value="[[item.name]]"
          ></rule-metrics>
        </template>
      </iron-collapse>
    </template>

    <template is="dom-if" if="[[!metric.options.length]]">
      <paper-item value="[[metric.name]]" on-tap="chooseMetric"
        >[[metric.name]]</paper-item
      >
    </template>
  `,
  is: 'rule-metrics',
  properties: {
    metric: {
      type: Object,
    },
    index: {
      type: Number,
    },
    queryIndex: {
      type: Number,
    },
    value: {
      type: String,
      reflectToAttribute: true,
    },
  },
  toggle(e) {
    e.preventDefault();
    e.stopPropagation();
    this.shadowRoot.querySelector('iron-collapse').toggle();
  },
  chooseMetric(e) {
    console.log('choose metric', e);
    e.preventDefault();
    this.dispatchEvent(
      new CustomEvent('choose-metric', {
        bubbles: true,
        composed: true,
        detail: {
          metric: this.metric.name,
          queryIndex: this.queryIndex,
          index: this.index,
        },
      })
    );
  },
});
