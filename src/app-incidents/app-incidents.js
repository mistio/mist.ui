// import '../../node_modules/@polymer/iron-timeago/iron-timeago.js';
import '../../node_modules/@polymer/paper-card/paper-card.js';
import '../../node_modules/@polymer/paper-icon-button/paper-icon-button.js';
import '../../node_modules/@polymer/iron-icons/iron-icons.js';
import '../machines/machine-page.js';
import '../section-tile/section-tile.js';
import { CSRFToken } from '../helpers/utils.js'
import { getResourceFromIncidentBehavior } from '../helpers/get-resource-from-incident-behavior.js';
import { Polymer } from '../../node_modules/@polymer/polymer/lib/legacy/polymer-fn.js';
import { html } from '../../node_modules/@polymer/polymer/lib/utils/html-tag.js';

Polymer({
  _template: html`
        <style include="shared-styles headings"></style>
        <style>
            :host {
                display: flex;
                transition: var(--material-curve-320);
                transform: translate(0, 60px);
                opacity: 0;
                padding: 0;
                margin: 0;
                height: 0;
            }

            :host(.active) {
                transform: translate(0, 0);
                opacity: 1;
                height: auto;
            }

            :host([xsmallscreen]) {
                flex-wrap: wrap;
            }
            paper-material {
                margin-bottom: 32px;
            }

            :host([xsmallscreen]) > paper-material {
                flex-basis: 100%;
            }

            h3 {
                text-transform: uppercase;
                font-size: 13px;
                color: rgba(0, 0, 0, 0.54);
                padding: 0 10px;
                border-bottom: 1px solid #eee;
            }

            :host(.active) paper-material {
                overflow: hidden !important;
            }

            .list {
                border-bottom: 1px solid #eee;
            }

            .list-item {
                padding: 8px;
            }

            .list-item:last-child {
                border-bottom: 0 none;
                padding-top: 16px;
            }

            .list-item.red {
                background: inherit !important;
            }

            .list-item.grey .resource {
                color: var(--grey-color);
            }

            .list-item.red .resource {
                color: var(--red-color);
            }

            .expression > * {
                margin: 0 4px;
                font-size: .9em;
            }

            .expression .rule-condition {
                display: flex;
                flex-direction: row;
                flex-wrap: wrap;
            }
            .rule-condition {
                flex: 1 100%;
            }

            .list-item .expression>iron-icon {
                color: rgba(0, 0, 0, 0.32);
                margin-right: 4px;
            }

            .list-item.red .expression>iron-icon {
                color: var(--red-color);
            }

            .list-item.green .expression>iron-icon {
                color: green;
            }

            .flexchild-col {
                display: flex;
                flex-flow: column;
                flex: 1;
                margin-bottom: 16px;
            }

            .flexchild {
                /*@apply --layout-flex;*/
                display: flex;
                flex-flow: row;
                flex: 1;
                line-height: 1.6em;
                flex-wrap: wrap;
            }

            .flex3child {
                /*@apply --layout-flex-3;*/
                display: flex;
                flex: 3;
                flex-flow: column;
            }

            .block {
                transform: translate(0, 50px);
                opacity: 0;
                transition: all 700ms 320ms;
                transition-timing-function: var(--material-curve-320);
                display: flex;
                flex-direction: column;
                flex: 1 100%;
                height: inherit;
            }

            :host(.active) .block {
                transform: translate(0, 0);
                opacity: 1;
            }

            span.rule-condition {
                font-weight: normal;
                color: rgba(0, 0, 0, 0.54);

            }

            span.time {
                color: rgba(0, 0, 0, 0.54);
                line-height: 1.6em;
                font-size: .9em;
            }

            a.main-section {
                min-width: 150px;
            }

            .delBtn iron-icon {
                margin: 8px;
                opacity: 0.32;
                cursor: pointer;
            }
            .resource-name {
                display: inline-block;
                width: 100%;
            }
            .logo-link {
                background-image: var(--logo-purchase);
                background-repeat: no-repeat;
                background-position: center;
                background-size: contain;
                width: 28px;
                height: 28px;
            }
        </style>

        <template is="dom-if" if="[[openIncidents.length]]" restamp="">
            <div class="flexchild-col">
                <a href="/incidents" class="main-section">
                    <section-tile name="incidents" color="#d96557" icon="icons:error-outline" count="[[openIncidents.length]]" incidents=""></section-tile>
                </a>
            </div>
            <paper-material class="flex3child">
                <h3>Happening Now</h3>
                <div class="block">
                    <template is="dom-repeat" items="[[enhancedIncidents]]">
                        <div class="list layout horizontal wrap">
                            <a class\$="list-item flexchild layout horizontal [[_incidentColor(item,model)]]" href\$="[[_computeResourceUri(item, model)]]" hidden\$="[[!_computeResourceUri(item, model)]]">
                                <div class="flexchild expression">
                                    <iron-icon icon="[[_computeIncidentIcon(item, model)]]" hidden\$="[[!_computeIncidentIcon(item,model)]]"></iron-icon>
                                    <span class="resource flexchild">
                                        <span class="resource-name">[[_computeIncidentTitle(item, model)]]</span><br>
                                        <span class="rule-condition">[[_computeIncidentCondition(item)]]</span>
                                    </span>
                                    <span class="time">
                                        <template is="dom-if" if="[[!item.finished_at]]">
                                            <iron-timeago datetime="[[_computeIncidentDuration(item)]]"></iron-timeago>
                                        </template>
                                    </span>
                                </div>
                            </a>
                            <span class\$="list-item flexchild layout horizontal [[_incidentColor(item,model)]]" hidden\$="[[_computeResourceUri(item, model)]]">
                                <div class="flexchild expression">
                                    <iron-icon icon="[[_computeIncidentIcon(item, model)]]" hidden\$="[[!_computeIncidentIcon(item,model)]]"></iron-icon>
                                    <span class="resource flexchild">
                                        <span class="resource-name">[[_computeIncidentTitle(item, model)]]</span><br>
                                        <span class="rule-condition">[[_computeIncidentCondition(item)]]</span>
                                    </span>
                                    <span class="time">
                                        <template is="dom-if" if="[[!item.finished_at]]">
                                            <iron-timeago datetime="[[_computeIncidentDuration(item)]]"></iron-timeago>
                                        </template>
                                    </span>
                                </div>
                            </span>
                            <div class="delBtn">
                                <iron-icon icon="close" on-tap="deleteIncident"></iron-icon>
                            </div>
                        </div>
                    </template>
                    <a class="list-item layout horizontal wrap red" href="/incidents" hidden\$="{{!resolvedCount}}">
                        <div class="flexchild expression">
                            <iron-icon icon="icons:report-problem"></iron-icon>
                            <span class="flexchild resource">and {{resolvedCount}} more incidents in the last day</span>
                        </div>
                        <span class="time">view all</span>
                        <div>
                            <iron-icon icon="hardware:keyboard-arrow-right"></iron-icon>
                        </div>
                    </a>
                </div>
            </paper-material>
        </template>
        <iron-ajax id="deleteIncidentAjax" contenttype="application/json" method="DELETE"></iron-ajax>
`,

  is: 'app-incidents',
  behaviors: [ getResourceFromIncidentBehavior ],

  properties: {
      model: {
          type: Object
      },
      openIncidents: {
          type: Array,
          computed: '_computeOpenIncidents(model.incidentsArray.*)'
      },
      enhancedIncidents: {
          type: Array
      },
      hasIncidents: {
          type: Boolean,
          computed: 'computeHasIncidents(openIncidents.*)',
          value: false,
          reflectToAttribute: true
      },
      resolvedCount: {
          type: Number,
          computed: '_computeResolvedIncidentCount(model.incidentsArray.*)'
      },
      xsmallscreen: {
          type: Boolean
      }
  },

  observers: [
      '_openIncidentsChanged(openIncidents.*)'
  ],

  attached () {
      const rows = this.parentNode.querySelectorAll('block');
      const index = Array.prototype.indexOf.call(rows, this);
      setTimeout(() => {
          this.classList.add('active');
      }, (index + 1) * 50);
  },

  computeHasIncidents(incidents) {
      console.log('incidents',incidents);
      return !!(this.openIncidents && this.openIncidents.length);
  },

  _computeOpenIncidents (_incidents) {
      const all = Object.values(this.model.incidents);
      return all.filter((incident) => {
          return !incident.finished_at && incident.logs.length && incident.logs[0].condition;
      }, this);
  },

  _openIncidentsChanged(_incidents) {
      this.set('enhancedIncidents', this._getResources(this.openIncidents));
  },

   /* eslint-disable no-param-reassign */
  _getResources(incidents) {
      if (incidents)
          return this.openIncidents.map((inc) => { inc.resource = this._getResource(inc); return inc; });
      return [];
  },
  /* eslint-enable no-param-reassign */

  _computeResolvedIncidentCount (_incidents) {
      const all = Object.values(this.model.incidents);
      const resolved = all.filter((incident) => {
          return incident.finished_at;
      }, this);
      return resolved.length;
  },

  _incidentColor(item, _model) {
      return item && item.resource && item.resource.id ? 'red' : 'grey';
  },

  _computeIncidentIcon(item, _model) {
      if (item.resource.type !== 'organization')
          return this.model.sections[`${item.resource.type  }s`].icon;
      return 'social:domain';
  },

  _computeIncidentTitle (item, _model) {
      if (!item.logs[0].rule_arbitrary) {
          if (item.resource && item.resource.id)
              return `${item.resource.type  } ${  item.resource.name || item.resource.title || item.resource.domain}`;
          if (!item.resource || !item.resource.id)
              return item.logs[0].machine_name || `${item.resource.type } is missing`;
      } 
      return 'Organization';
  },

  _computeResourceUri (item, _model) {
      // give resource url only if resource exists
      return item.resource && item.resource.uri ? item.resource.uri : false;
  },

  _getLogQuery(condition) {
      // return log query
      return condition.replace(/^.+?\(([^)]+)\).+$/,'$1');
  },

  _computeIncidentCondition (item) {
      let condition = item.logs.length && item.logs[0].condition || '';
      // transform log condition
      if (condition.length && item.logs[0].rule_data_type === 'logs') {
          condition = condition.replace('COUNT(','')
                              .replace('){}','. Log appeared ')
                              .replace('within','times within');
      }
      return condition;
  },

  _computeIncidentDuration (item) {
      if (!item.finished_at)
          return new Date(item.started_at * 1000)
      return new Date(item.started_at * 1000)
      // return Date.now()-(item.finished_at-item.started_at)*1000;
  },

  deleteIncident (e) {
      console.log('delete', e.model.item.incident_id);
      this.$.deleteIncidentAjax.headers["Content-Type"] = 'application/json';
      this.$.deleteIncidentAjax.url = `/api/v1/stories/${  e.model.item.incident_id}`;
      this.$.deleteIncidentAjax.headers["Csrf-Token"] = CSRFToken.value;
      this.$.deleteIncidentAjax.generateRequest();
  }
});
