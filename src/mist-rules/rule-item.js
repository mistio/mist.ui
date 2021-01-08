import '@polymer/polymer/polymer-legacy.js';
import '@polymer/paper-styles/typography.js';
import '@polymer/paper-button/paper-button.js';
import '@polymer/paper-spinner/paper-spinner.js';
import { CSRFToken } from '../helpers/utils.js';
import { Polymer } from '@polymer/polymer/lib/legacy/polymer-fn.js';
import { html } from '@polymer/polymer/lib/utils/html-tag.js';

Polymer({
  _template: html`
    <style include="shared-styles forms tags-and-labels">
      paper-button[disabled] {
        background-color: rgba(0, 0, 0, 0.13) !important;
        color: rgba(0, 0, 0, 0.32) !important;
      }

      :host {
        text-transform: lowercase;
        background-color: #f5f5f5;
      }

      span.keyword {
        font-weight: 600;
      }

      .rule {
        padding: 16px 0;
        font-family: monospace;
      }

      .strong {
        font-weight: 500;
      }

      div.layout.rule-item {
        padding-right: 136px;
        padding-left: 8px;
        align-items: center;
        border-bottom: 1px solid #ccc;
      }

      .rule-item iron-icon[icon='close'] {
        cursor: pointer;
      }

      iron-icon#alert {
        cursor: inherit;
        color: inherit !important;
        padding: 14px 0px;
        margin-right: 8px;
        margin-left: -3px;
      }

      paper-icon-button::slotted(iron-icon) {
        opacity: 0.32;
      }

      .operator {
        width: 50px;
      }

      .aggregation,
      .action {
        width: 100px;
      }

      paper-spinner {
        width: 40px;
      }

      paper-input#threshold,
      paper-input#offset {
        width: 40px;
        display: inline-block;
      }

      paper-input#aggregation {
        width: 120px;
        display: inline-block;
      }

      .incident-true {
        color: var(--red-color);
      }

      .rule-actions {
        align-self: flex-end;
        justify-content: flex-end;
        font-size: 0.9em;
        margin-top: 16px;
      }

      .rule-id {
        color: rgba(0, 0, 0, 0.32);
        font-size: 0.8em;
        display: inline-block;
        margin-right: 16px;
        padding: 16px;
      }

      code {
        max-width: 160px;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
        font-size: 0.8em;
        vertical-align: middle;
        background-color: #ddd;
        color: #666;
        padding: 2px 4px;
        display: inline-block;
        border-radius: 2px;
      }

      .command {
        max-width: 160px;
      }

      .emails {
        max-width: 260px;
      }

      .teams {
        max-width: 260px;
      }

      .members {
        max-width: 360px;
      }

      .and {
        padding: 0 8px;
      }

      span.actions {
        position: absolute;
        right: 24px;
      }

      span.actions > paper-icon-button {
        padding: 8px;
        transform: scale(0.8);
        opacity: 0.54;
      }
      .tag.white {
        background-color: #fff;
        border: 1px solid #ddd;
        color: #222;
      }
    </style>

    <div class="rule-item layout flex-1 horizontal">
      <div id="[[rule.id]]" class$="flex incident-[[openIncident]]">
        <span class="rule-id">[[rule.title]]</span>
        <iron-icon
          id="alert"
          icon="icons:warning"
          hidden$="[[!openIncident]]"
        ></iron-icon>
        <span class="rule">
          <span hidden$="[[isNoData]]">
            <template is="dom-repeat" items="[[rule.queries]]" as="query">
              <span class="and" hidden$="[[!index]]"> AND </span>
              <span class="keyword if">if</span>
              <span class="strong">
                <span class="keyword log" hidden$="[[!isLogData]]"> log </span>
                [[_computeTargetName(query.target, availableMetrics)]]
                <span class="keyword log" hidden$="[[!isLogData]]">
                  count
                </span>
                [[_computeOperator(query.operator)]] [[query.threshold]]
                <span hidden$="[[isLogData]]"
                  >[[_computeUnit(query.target, availableMetrics)]]</span
                >
              </span>
              <span class="keyword" hidden$="[[isLogData]]">for</span>
              <span hidden$="[[isLogData]]"
                >[[_computeAggregation(query.aggregation)]] value</span
              >
              <span hidden$="[[!_hasWindow(query.aggregation)]]">
                <span class="keyword">within</span> [[rule.window.start]]
                [[rule.window.period]]
              </span>
            </template>
          </span>
          <span hidden$="[[!isNoData]]">
            <span class="keyword if">if</span>
            <span class="strong"> no monitoring data </span>
            <span class="keyword"> for </span> [[rule.window.start]]
            [[rule.window.period]]
            <span class="keyword"> check every </span> [[rule.frequency.every]]
            [[rule.frequency.period]]
          </span>
          <span class="keyword then">&nbsp;then&nbsp;</span>
          <template is="dom-repeat" items="[[rule.actions]]" as="action">
            <span class="and" hidden$="[[!index]]">&nbsp;AND&nbsp;</span>
            <span class="strong">[[_phrase(action.type)]]</span>
            <span
              class="monospace command"
              hidden$="[[!_showCommandTextarea(action.type)]]"
            >
              <code>[[action.command]]</code>&nbsp;
            </span>
            <span>[[action.action]]</span>
            <span hidden$="[[!action.teams.length]]">
              team<span hidden$="[[!_isPlural(action.teams.length)]]">s</span
              >&nbsp;
              <template is="dom-repeat" items="[[action.teams]]" as="team">
                <code>[[_computeTeam(team, teams.length)]]</code>&nbsp;
              </template>
            </span>
            <span hidden$="[[!action.users.length]]">
              user<span hidden$="[[!_isPlural(action.users.length)]]">s</span
              >&nbsp;
              <template is="dom-repeat" items="[[action.users]]" as="user">
                <code>[[_computeUser(user, users.*)]]</code>&nbsp;
              </template>
            </span>
            <span hidden$="[[!action.emails.length]]">
              email<span hidden$="[[!_isPlural(action.emails.length)]]">s</span
              >&nbsp;
              <template is="dom-repeat" items="[[action.emails]]" as="email">
                <code>[[email]]</code>&nbsp;
              </template>
            </span>
          </template>
        </span>
      </div>
      <paper-spinner active$="[[sendingData]]"></paper-spinner>
      <span class="actions">
        <!-- <template is="dom-repeat" items="[[tagSelectors]]" as="tag">
                    <span class="tag">[[tag]]</span>
                </template>
                <template is="dom-if" if="[[ruleAppliesOnAllMachines]]">
                    <span class="tag white">on all machines</span>
                </template> -->
        <paper-icon-button
          icon="icons:create"
          toggles=""
          active="{{editing}}"
          hidden$="[[!canEdit]]"
          >edit</paper-icon-button
        >
        <paper-icon-button
          icon="delete"
          data-attr="[[rule.id]]"
          on-tap="deleteRule"
          hidden$="[[!canEdit]]"
          class="delete-btn"
          disabled$="[[isNoData]]"
        ></paper-icon-button>
      </span>
    </div>
    <iron-ajax
      id="deleteRuleRequest"
      contenttype="application/json"
      handle-as="json"
      method="DELETE"
      on-request="_handleDeleteRequest"
      on-response="_handleDeleteResponse"
      on-error="_handleDeleteError"
      loading="{{sendingData}}"
    ></iron-ajax>
  `,

  is: 'rule-item',

  properties: {
    openIncident: {
      type: Boolean,
      value: false,
    },
    resource: {
      type: Object,
      value: false,
    },
    rule: {
      type: Object,
    },
    isNoData: {
      type: Boolean,
      computed: '_computeIsNoData(rule)',
      value: false,
    },
    isLogData: {
      type: Boolean,
      computed: '_computeIsLogData(rule)',
    },
    availableMetrics: {
      type: Array,
    },
    sendingData: {
      type: Boolean,
      value: false,
    },
    formError: {
      type: Boolean,
      value: false,
    },
    teams: {
      type: Array,
    },
    users: {
      type: Array,
    },
    canEdit: {
      type: Boolean,
      computed: '_computeCanEdit(rule,resource)',
    },
    editing: {
      type: Boolean,
      notify: true,
    },
    tagSelectors: {
      type: Array,
      computed: '_computeTagSelectors(rule.selectors.length)',
    },
    ruleAppliesOnAllMachines: {
      type: Boolean,
      value: false,
    },
  },

  ready() {},

  _computeIsNoData(rule) {
    return rule.title === 'NoData';
  },

  _computeIsLogData(rule) {
    return rule.data_type === 'logs';
  },

  _computeCanEdit(_rule, resource) {
    if (resource) {
      const ruleExist = !!this.rule;
      const ruleIsNoData = this.rule.title === 'NoData';
      const ruleAppliesOnAllResources =
        !this.rule.selectors || !this.rule.selectors.length;
      const ruleAppliesOnTags =
        this.rule.selectors &&
        this.rule.selectors.filter(c => {
          return c.type === 'tags';
        }).length > 0;
      // console.log('_computeCanEdit', rule.id, ruleExist, ruleSelectors, !ruleAppliesOnAllResources, !ruleAppliesOnTags);
      this.set('ruleAppliesOnAllMachines', ruleAppliesOnAllResources);
      return (
        !ruleIsNoData &&
        ruleExist &&
        !ruleAppliesOnAllResources &&
        !ruleAppliesOnTags
      );
    }
    return true;
  },

  _computeUnit(metric, _availableMetrics) {
    let ref;
    if (this.availableMetrics) ref = this.availableMetrics[metric];
    return ref && ref.unit ? ref.unit : '';
  },

  _computeTargetName(metric, _availableMetrics) {
    let ref;
    if (this.availableMetrics)
      ref = this.availableMetrics.find(i => {
        return i.id === metric;
      });
    return ref && ref.name ? ref.name : metric;
  },

  _computeOperator(op) {
    if (op === 'gt') return '>';
    if (op === 'lt') return '<';
    if (op === 'eq') return '=';
    if (op === 'ne') return '≠';
    return null;
  },

  _computeAggregation(aggr) {
    if (aggr === 'all') return 'every';
    return aggr || 'any';
  },

  _computeTeam(team) {
    return this.teams.find(i => {
      return i.id === team;
    }).name;
  },

  _computeUser(user) {
    const u = this.users.find(i => {
      return i.id === user;
    });
    return u && u.name;
  },

  _computeTagSelectors() {
    const ret = [];
    if (this.rule && this.rule.selectors) {
      for (let i = 0; i < this.rule.selectors.length; i++) {
        if (this.rule.selectors[i].type === 'tags') {
          const keys = Object.keys(this.rule.selectors[i].include);
          for (let j = 0; j < keys.length; j++) {
            const key = keys[j];
            const value = this.rule.selectors[i].include[key];
            if (value) ret.push(`${key}: ${value}`);
            else ret.push(key);
          }
        }
      }
    }
    return ret;
  },

  _hasWindow(aggregation) {
    if (!aggregation || aggregation === 'any') return false;
    return true;
  },

  _phrase(action) {
    let verb;
    if (action === 'notification') verb = 'alert';
    else if (action === 'machine_action') verb = '';
    else if (action === 'command') verb = 'run command';
    else if (action === 'no_data') verb = 'alert';
    else if (action === 'webhook') verb = 'webhook';
    return verb;
  },

  deleteRule(_e) {
    const ruleid = this.rule.id;
    this.$.deleteRuleRequest.url = `/api/v1/rules/${ruleid}`;
    this.$.deleteRuleRequest.headers['Csrf-Token'] = CSRFToken.value;
    this.$.deleteRuleRequest.generateRequest();
  },

  _showCommandTextarea(action) {
    return action === 'command';
  },

  _joinEmails(emails) {
    if (emails) return Array.isArray(emails) ? emails.join(', ') : emails;
    return emails;
  },

  _isPlural(i) {
    return i > 1;
  },
});
