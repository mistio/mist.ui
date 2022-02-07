import '@polymer/app-route/app-route.js';
import './mist-rules/mist-rules.js';
import { html } from '@polymer/polymer/lib/utils/html-tag.js';
import { PolymerElement } from '@polymer/polymer/polymer-element.js';

/* eslint-disable class-methods-use-this */
export default class PageRules extends PolymerElement {
  static get template() {
    return html`
      <style include="shared-styles">
        [hidden] {
          display: none !important;
        }
        paper-material {
          padding: 0;
        }
      </style>

      <app-route route="{{route}}" pattern="/:key" data="{{data}}"></app-route>
      <paper-material elevation="1">
        <mist-rules
          id="allRules"
          features="[[features]]"
          builtin-metrics="[[model.monitoring.builtin_metrics]]"
          custom-metrics="[[model.monitoring.custom_metrics]]"
          machines="[[model.machines]]"
          incidents="[[model.incidentsArray]]"
          rules="[[model.monitoring.rules]]"
          model="[[model]]"
          teams="[[model.teamsArray]]"
          users="[[model.membersArray]]"
        ></mist-rules>
      </paper-material>
    `;
  }

  static get is() {
    return 'page-rules';
  }

  static get properties() {
    return {
      model: {
        type: Object,
      },
      features: {
        type: Object,
      },
      ownership: {
        type: Boolean,
      },
    };
  }
}

customElements.define('page-rules', PageRules);
