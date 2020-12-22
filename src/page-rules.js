import '../node_modules/@polymer/app-route/app-route.js';
import './mist-rules/mist-rules.js';
import { Polymer } from '../node_modules/@polymer/polymer/lib/legacy/polymer-fn.js';
import { html } from '../node_modules/@polymer/polymer/lib/utils/html-tag.js';

Polymer({
  _template: html`
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
  `,
  is: 'page-rules',
  properties: {
    model: {
      type: Object,
    },
    features: {
      type: Object,
    },
    ownership: {
      type: Boolean,
    },
  },
});
