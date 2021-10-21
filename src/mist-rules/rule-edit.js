import '@polymer/polymer/polymer-legacy.js';
import '@polymer/paper-styles/typography.js';
import '@polymer/paper-button/paper-button.js';
import '@polymer/paper-checkbox/paper-checkbox.js';
import '@polymer/paper-spinner/paper-spinner.js';
import '@polymer/paper-input/paper-input.js';
import '@polymer/paper-dropdown-menu/paper-dropdown-menu.js';
import '@polymer/paper-input/paper-textarea.js';
import '@polymer/paper-listbox/paper-listbox.js';
import '@polymer/paper-tooltip/paper-tooltip.js';
import './mist-dropdown-multi.js';
import './rule-metrics.js';
import { Polymer } from '@polymer/polymer/lib/legacy/polymer-fn.js';
import { html } from '@polymer/polymer/lib/utils/html-tag.js';
import { CSRFToken } from '../helpers/utils.js';
import { validateRuleBehavior } from './validate-rule-behavior.js';

Polymer({
  _template: html`
    <style>
      :host {
        display: block;
        position: relative;
        background-color: #fff;
        border-bottom: 1px solid #ccc;
      }

      .rule-edit {
        position: relative;
      }

      paper-button {
        padding: 0.8em 1.57em 0.7em 1.57em;
        font-weight: 500;
      }

      paper-button[disabled] {
        background-color: rgba(0, 0, 0, 0.13) !important;
        color: rgba(0, 0, 0, 0.32) !important;
      }

      .operator {
        width: 50px;
      }

      .aggregation,
      .action {
        width: 100px;
        margin-right: 10px;
      }
      paper-input.inline,
      paper-textarea,
      mist-dropdown-multi {
        top: 2px;
        position: relative;
      }

      paper-input.threshold,
      paper-input.offset {
        width: 40px;
        display: inline-block;
        top: 2px;
        position: relative;
      }

      paper-input.target,
      paper-input.type {
        width: 200px;
        display: inline-block;
        top: 2px;
        position: relative;
      }

      paper-input#resources-rule-type-tags {
        margin-bottom: -2px;
      }

      .rule.incident-true {
        color: var(--red-color);
      }

      .rule {
        padding: 8px 0;
      }

      .rule-id {
        position: absolute;
        color: rgba(0, 0, 0, 0.32);
        font-size: 0.8em;
        top: 16px;
        left: 0;
      }

      .rule-actions {
        justify-content: flex-end;
        font-size: 0.9em;
        margin-top: 16px;
        text-align: right;
      }

      paper-button iron-icon {
        opacity: 0.32;
        padding: 4px;
      }

      paper-input#emails {
        max-width: 240px;
        display: inline-block;
        top: 2px;
        position: relative;
      }

      #newrule {
        padding-left: 8px;
        padding-right: 8px;
      }

      #norule {
        padding-right: 8px;
      }

      span {
        vertical-align: bottom;
      }

      span.if,
      span.then,
      span.on {
        margin-left: -8px;
      }

      paper-dropdown-menu::slotted(#dropdown) {
        width: inherit !important;
      }

      .add {
        cursor: pointer;
      }

      .and {
        padding: 0 8px;
      }

      paper-dropdown-menu {
        top: 2px;
      }

      span.keyword {
        font-weight: 600;
        font-family: monospace;
        margin-right: 8px;
        top: -8px;
        position: relative;
      }

      paper-dropdown-menu.target {
        min-width: 250px;
      }
      paper-dropdown-menu.type,
      paper-dropdown-menu.ruleAction {
        width: 150px;
      }
      paper-dropdown-menu.target::slotted(input) {
        min-width: 250px;
        width: min-content;
      }

      .errormsg-container {
        color: var(--red-color);
      }

      paper-textarea#command {
        --paper-input-container-input: {
          text-align: left;
          font-family: monospace;
        }
        min-width: 200px;
        display: inline-block;
        top: 3px;
      }

      paper-textarea#alert-description,
      paper-textarea#http-params,
      paper-textarea#http-body,
      paper-textarea#json-body,
      paper-textarea#http-headers {
        width: 40%;
        display: inline-block;
      }

      paper-input#webhook-url {
        width: 30%;
      }
      paper-spinner {
        width: 32px;
        height: 32px;
      }
      paper-spinner[hidden] {
        display: none;
      }
      .monitored-icon {
        opacity: 0.54;
        padding: 8px 8px 8px 0;
        transform: scale(0.9);
      }
      paper-dropdown-menu,
      paper-input {
        vertical-align: bottom;
        --paper-dropdown-menu-input: {
          font-family: monospace;
          text-transform: lowercase;
        }
        --paper-dropdown-menu-label: {
          font-family: monospace;
          text-transform: lowercase;
        }
        --paper-input-container-input: {
          font-family: monospace;
          text-align: center;
          text-transform: lowercase;
        }
        --paper-input-container-label: {
          font-family: monospace;
          text-transform: lowercase;
        }
      }
      .inline:not([hidden]) {
        display: inline-block;
        max-width: 200px !important;
        vertical-align: bottom;
      }
      iron-icon.help {
        color: #000;
        opacity: 0.32;
        padding: 4px;
        width: 20px;
        height: 20px;
      }
      paper-listbox[id^='metricsListbox-'] {
        min-width: 300px;
        min-height: 200px;
      }
      paper-listbox:focus {
        outline: none;
      }
      .loader {
        user-select: none;
        text-align: center;
      }
      .loader::selection {
        border: 0 none;
      }
      .error {
        color: var(--red-color);
      }
      .secondary {
        color: var(--secondary-text-color);
        padding-left: 8px;
      }
    </style>
    <custom-style>
      <style is="custom-style">
        paper-tooltip {
          --paper-tooltip: {
            font-size: 0.9em;
            line-height: 1.65em;
          }
        }
        paper-tooltip code {
          background-color: #484848;
          padding: 2px 4px;
          border-radius: 3px;
          font-size: 0.9em;
        }
      </style>
    </custom-style>
    <div class="rule-edit">
      <span class="rule-id">[[_computeId(rule.title)]]</span>
      <div id="newrule" class="rule">
        <div hidden$="[[hideApplyOn]]">
          <span class="keyword on">apply on</span>
          <!-- choose resourceType -->
          <div class="inline">
            <paper-dropdown-menu
              id="resources"
              class="dropdown-block apply-on"
              disabled="[[editingExistingRule]]"
              no-animations=""
            >
              <paper-listbox
                slot="dropdown-content"
                attr-for-selected="value"
                selected="{{resourceType}}"
                class="dropdown-content"
              >
                <paper-item
                  value="organization"
                  disabled="[[_disableOrg(resourceType,editingExistingRule)]]"
                  >organization</paper-item
                >
                <hr />
                <template is="dom-repeat" items="[[resourceTypes]]" as="rtype">
                  <template is="dom-if" if="[[rtype]]">
                    <paper-item
                      value="[[rtype]]"
                      disabled="[[_disableResource(ruleType,editingExistingRule)]]"
                      >[[rtype]]</paper-item
                    >
                  </template>
                  <template is="dom-if" if="[[!rtype]]">
                    <hr />
                  </template>
                </template>
              </paper-listbox>
            </paper-dropdown-menu>
          </div>
          <!-- choose ruleType -->
          <div
            class="inline"
            hidden$="[[_disableRuleTypeChanges(resourceType)]]"
          >
            <paper-dropdown-menu
              id$="resources-rule-type-[[index]]"
              class="dropdown-block resource-type"
              no-animations=""
            >
              <paper-listbox
                slot="dropdown-content"
                attr-for-selected="value"
                selected="{{ruleType}}"
                class="dropdown-content"
              >
                <paper-item value="every">all</paper-item>
                <paper-item value="specific">select</paper-item>
                <paper-item value="tagged">tagged </paper-item>
              </paper-listbox>
            </paper-dropdown-menu>
          </div>
          <div class="inline" hidden$="[[!showDropDownResources]]">
            <paper-dropdown-menu
              id="resources-rule-type-id"
              class="dropdown-block resource-id"
              no-animations=""
            >
              <paper-listbox
                slot="dropdown-content"
                attr-for-selected="value"
                auto-focus
                selected="{{resourceId}}"
                class="dropdown-content"
              >
                <template is="dom-if" if="[[!resources.length]]">
                  <paper-item disabled>no [[resourceType]]s found</paper-item>
                </template>
                <template
                  id="resourcesRepeat"
                  is="dom-repeat"
                  items="[[resources]]"
                  initial-count="10"
                >
                  <paper-item value="[[item.id]]">
                    <iron-icon
                      class="monitored-icon"
                      icon="image:remove-red-eye"
                      hidden$="[[!item.monitoring.hasmonitoring]]"
                      title="Monitored machine"
                    ></iron-icon>
                    [[_displayItemName(item, resourceType)]]
                    <template
                      is="dom-if"
                      if="[[_displayItemSecondary(item, resourceType)]]"
                    >
                      <span class="secondary"
                        >[[_displayItemSecondary(item, resourceType)]]</span
                      >
                    </template>
                  </paper-item>
                </template>
              </paper-listbox>
            </paper-dropdown-menu>
          </div>
          <div class="inline" hidden$="[[!_showTags(ruleType,resourceType)]]">
            <paper-input
              id="resources-rule-type-tags"
              class="tags"
              auto-focus
              value="{{tags}}"
              placeholder="enter tags"
              tabindex="0"
              on-blur="_getMetrics"
            ></paper-input>
          </div>
        </div>
        <div hidden$="[[!isNoData]]">
          <span class="keyword if">if</span>
          <span class="keyword"> no monitoring data </span>
          <span hidden$="[[!rule.window]]">
            <span class="keyword">for</span>
            <paper-input
              id$="offset-[[index]]"
              class="offset"
              value="{{rule.window.start}}"
              type="number"
              min="1"
              auto-validate
              on-value-changed="_validateRule"
            ></paper-input>
            <paper-dropdown-menu
              class="dropdown-block windowPeriod"
              on-value-changed="_validateRule"
              no-animations=""
            >
              <paper-listbox
                slot="dropdown-content"
                id=""
                attr-for-selected="value"
                selected="{{rule.window.period}}"
                class="dropdown-content"
              >
                <paper-item value="minutes">minutes</paper-item>
                <paper-item value="hours">hours</paper-item>
              </paper-listbox>
            </paper-dropdown-menu>
          </span>
          <div>
            <span class="keyword on">check every</span>
            <paper-input
              id$="offset-[[index]]"
              class="offset"
              value="{{rule.frequency.every}}"
              type="number"
              min="1"
              auto-validate
              on-value-changed="_validateRule"
            ></paper-input>
            <paper-dropdown-menu
              class="dropdown-block windowPeriod"
              on-value-changed="_validateRule"
              no-animations=""
            >
              <paper-listbox
                slot="dropdown-content"
                attr-for-selected="value"
                selected="{{rule.frequency.period}}"
                class="dropdown-content"
              >
                <paper-item value="minutes">minutes</paper-item>
                <paper-item value="hours">hours</paper-item>
              </paper-listbox>
            </paper-dropdown-menu>
          </div>
        </div>
        <div hidden$="[[!showCheckEvery]]">
          <span class="keyword on">check every</span>
          <paper-input
            id$="offset-[[index]]"
            class="offset"
            value="{{rule.frequency.every}}"
            type="number"
            min="1"
            auto-validate
            on-value-changed="_validateRule"
          ></paper-input>
          <paper-dropdown-menu
            class="dropdown-block windowPeriod"
            on-value-changed="_validateRule"
            no-animations=""
          >
            <paper-listbox
              slot="dropdown-content"
              attr-for-selected="value"
              selected="{{rule.frequency.period}}"
              class="dropdown-content"
            >
              <paper-item value="minutes">minutes</paper-item>
              <paper-item value="hours">hours</paper-item>
            </paper-listbox>
          </paper-dropdown-menu>
        </div>
        <span hidden$="[[isNoData]]">
          <span class="keyword if">if</span>
          <template is="dom-repeat" items="{{rule.queries}}" as="query">
            <!--  rule.data_type: metrics OR logs -->
            <paper-dropdown-menu
              id$="data-type-[[index]]"
              class="dropdown-block target-type"
              auto-focus
              on-value-changed="_focusOnTarget"
              disabled="[[rule.id]]"
              no-animations=""
            >
              <paper-listbox
                slot="dropdown-content"
                attr-for-selected="value"
                selected="{{rule.data_type}}"
                class="dropdown-content"
              >
                <paper-item
                  value="metrics"
                  disabled$="[[!_canUseMetrics(resourceType,ruleType,resourceId,resource,model.monitoring.*)]]"
                  >metric</paper-item
                >
                <paper-item value="logs">log</paper-item>
              </paper-listbox>
            </paper-dropdown-menu>

            <span hidden$="[[!rule.data_type]]">
              <!-- log filter -->
              <span hidden$="[[!isDataTypeLogs(rule.data_type)]]">
                <paper-input
                  id$="target-logs-[[index]]"
                  class="target"
                  value="{{query.target}}"
                  auto-validate
                  auto-focus
                  type="text"
                  on-value-changed="_validateTarget"
                  placeholder="enter log query"
                  tabindex="0"
                ></paper-input>
                <a
                  target="new"
                  href="https://www.elastic.co/guide/en/elasticsearch/reference/current/query-dsl-query-string-query.html#query-string-syntax"
                  ><iron-icon
                    id="logs"
                    icon="icons:help"
                    class="help"
                  ></iron-icon
                ></a>
                <paper-tooltip for="logs" position="top" animation-delay="100">
                  You can filter logs by using a <code>key:value</code> pair,
                  <br />
                  or any other suitable Elasticsearch query string. <br />
                  e.g. <code>type:observation AND action:destroy_machine</code>
                </paper-tooltip>
              </span>

              <!--  metric option -->
              <span hidden$="[[isDataTypeLogs(rule.data_type)]]">
                <paper-dropdown-menu
                  id$="target-metrics-[[index]]"
                  class="dropdown-block target"
                  auto-focus
                  value="[[query.target]]"
                  on-value-changed="_focusOnOperator"
                  on-selected-item-changed="_validateRule"
                  no-animations=""
                >
                  <paper-listbox
                    id$="metricsListbox-[[index]]"
                    slot="dropdown-content"
                    attr-for-selected="value"
                    selected="[[query.target]]"
                    class="dropdown-content"
                  >
                    <template
                      is="dom-if"
                      if="[[availableMetrics.length]]"
                      restamp
                    >
                      <template
                        is="dom-repeat"
                        items="[[availableMetrics]]"
                        initial-count="1"
                      >
                        <rule-metrics
                          metric="[[item]]"
                          query-index="[[_getQueryIndex(query)]]"
                        ></rule-metrics>
                      </template>
                    </template>
                    <template
                      is="dom-if"
                      if="[[!availableMetrics.length]]"
                      restamp
                    >
                      <paper-item hidden$="[[loadingMetrics]]" disabled
                        >No metrics available</paper-item
                      >
                    </template>
                  </paper-listbox>
                </paper-dropdown-menu>
                <paper-spinner
                  active="[[loadingMetrics]]"
                  hidden$="[[!loadingMetrics]]"
                ></paper-spinner>
              </span>

              <span hidden$="[[!query.target]]">
                <!--  aggregation: aggr value / count for logs -->
                <span hidden$="[[!isDataTypeLogs(rule.data_type)]]">
                  <span class="keyword">count</span>
                </span>

                <!--  operator value -->
                <paper-dropdown-menu
                  id$="operator-[[index]]"
                  class="dropdown-block operator"
                  auto-focus
                  hidden$="[[!query.target]]"
                  on-value-changed="_focusOnThreshold"
                  on-selected-item-changed="_validateRule"
                  no-animations=""
                >
                  <paper-listbox
                    slot="dropdown-content"
                    attr-for-selected="value"
                    selected="{{query.operator}}"
                    class="dropdown-content"
                  >
                    <paper-item value="gt"> &gt; </paper-item>
                    <paper-item value="lt"> &lt; </paper-item>
                    <paper-item value="eq"> &equals; </paper-item>
                    <paper-item value="ne"> &ne; </paper-item>
                  </paper-listbox>
                </paper-dropdown-menu>
                <paper-input
                  id$="threshold-[[index]]"
                  class="threshold"
                  value="{{query.threshold}}"
                  auto-focus
                  type="number"
                  on-value-changed="_focusOnAggregation"
                  tabindex="0"
                ></paper-input>
                <template
                  is="dom-if"
                  if="[[!isDataTypeLogs(rule.data_type)]]"
                  restamp
                >
                  [[_computeUnits(newMetric, availableMetrics)]]
                </template>

                <!--  aggregation: aggr value / count for metrics -->
                <span hidden$="[[isDataTypeLogs(rule.data_type)]]">
                  <span class="keyword">for</span>
                  <paper-dropdown-menu
                    id$="aggregation-[[index]]"
                    class="dropdown-block aggregation"
                    on-selected-item-changed="_validateRule"
                    on-value-changed="_validateCondition"
                    no-animations=""
                  >
                    <paper-listbox
                      slot="dropdown-content"
                      id$="aggregation-[[index]]"
                      attr-for-selected="value"
                      selected="{{rule.aggregation}}"
                      class="dropdown-content"
                    >
                      <template
                        is="dom-if"
                        if="[[!isDataTypeLogs(rule.data_type)]]"
                        restamp
                      >
                        <paper-item value=""> any </paper-item>
                        <paper-item value="all"> every </paper-item>
                        <paper-item value="avg"> average </paper-item>
                      </template>
                      <template
                        is="dom-if"
                        if="[[isDataTypeLogs(rule.data_type)]]"
                        restamp
                      >
                        <paper-item value="count"> count </paper-item>
                      </template>
                    </paper-listbox>
                  </paper-dropdown-menu>
                  <span class="keyword">value</span>
                </span>
              </span>

              <!--  window -->
              <span hidden$="[[!query.threshold]]">
                <span class="keyword">within</span>
                <paper-input
                  id$="offset-[[index]]"
                  class="offset"
                  value="{{rule.window.start}}"
                  type="number"
                  min="1"
                  auto-validate
                  on-value-changed="_validateRule"
                ></paper-input>
                <paper-dropdown-menu
                  class="dropdown-block windowPeriod"
                  on-value-changed="_validateRule"
                  no-animations=""
                >
                  <paper-listbox
                    slot="dropdown-content"
                    attr-for-selected="value"
                    selected="{{rule.window.period}}"
                    class="dropdown-content"
                  >
                    <paper-item value="minutes">minutes</paper-item>
                    <paper-item value="hours">hours</paper-item>
                  </paper-listbox>
                </paper-dropdown-menu>
              </span>
            </span>
          </template>
        </span>
        <div hidden$="[[!conditionValid]]">
          <span class="keyword then">then</span>
          <span id="actionsDropdown">
            <template is="dom-repeat" items="[[rule.actions]]" as="ruleAction">
              <span class="and" hidden$="[[!index]]"> AND </span>
              <paper-dropdown-menu
                class="dropdown-block action"
                on-value-changed="_validateRule"
                disabled$="[[isNoData]]"
                no-animations=""
              >
                <paper-listbox
                  slot="dropdown-content"
                  attr-for-selected="value"
                  selected="{{ruleAction.type}}"
                  on-selected-changed="_setActionDefaults"
                  class="dropdown-content"
                >
                  <template
                    id="actionsRepeat"
                    is="dom-repeat"
                    items="[[actions]]"
                    as="action"
                  >
                    <paper-item
                      value="[[action]]"
                      hidden$="[[_hideAction(action,isNoData)]]"
                      >[[_actionName(action)]]</paper-item
                    >
                  </template>
                </paper-listbox>
              </paper-dropdown-menu>
              <template
                is="dom-if"
                if="[[_isWebhookSelected(ruleAction.type)]]"
              >
                <paper-input
                  id="webhook-url"
                  class="inline webhook-url"
                  placeholder="URL to be invoked"
                  on-value-changed="_validateRule"
                  value="{{ruleAction.url}}"
                  pattern="^https://*"
                ></paper-input>
                <paper-dropdown-menu
                  no-animations=""
                  label="method"
                  class="inline"
                >
                  <paper-listbox
                    slot="dropdown-content"
                    attr-for-selected="value"
                    selected="{{ruleAction.method}}"
                    class="dropdown-content"
                  >
                    <paper-item value="post">POST</paper-item>
                    <paper-item value="delete">DELETE</paper-item>
                    <paper-item value="put">PUT</paper-item>
                    <paper-item value="patch">PATCH</paper-item>
                  </paper-listbox>
                </paper-dropdown-menu>
                <paper-textarea
                  id="http-params"
                  class="inline http-params"
                  placeholder="Query string params (optional)"
                  value="{{ruleAction.params}}"
                  on-value-changed="_validateRule"
                ></paper-textarea>
                <paper-textarea
                  id="http-body"
                  class="inline http-body"
                  placeholder="Request body (optional)"
                  value="{{ruleAction.data}}"
                  on-value-changed="_validateRule"
                ></paper-textarea>
                <paper-textarea
                  id="json-body"
                  class="inline json-body"
                  placeholder="JSON body (optional)"
                  value="{{ruleAction.json}}"
                  on-value-changed="_validateRule"
                ></paper-textarea>
                <paper-textarea
                  id="http-headers"
                  class="inline http-headers"
                  placeholder="HTTP headers (optional)"
                  value="{{ruleAction.headers}}"
                  on-value-changed="_validateRule"
                ></paper-textarea>
              </template>
              <template
                is="dom-if"
                if="[[_isCommandSelected(ruleAction.type)]]"
              >
                <paper-textarea
                  id="command"
                  placeholder="command input"
                  value="{{ruleAction.command}}"
                  on-value-changed="_validateRule"
                ></paper-textarea>
              </template>
              <template is="dom-if" if="[[_isAlertSelected(ruleAction.type)]]">
                <paper-dropdown-menu
                  no-animations=""
                  label="level"
                  class="alert-level"
                >
                  <paper-listbox
                    slot="dropdown-content"
                    attr-for-selected="value"
                    selected="{{ruleAction.level}}"
                    class="dropdown-content"
                  >
                    <paper-item value="info">info</paper-item>
                    <paper-item value="warning">warning</paper-item>
                    <paper-item value="critical">critical</paper-item>
                  </paper-listbox>
                </paper-dropdown-menu>
                <mist-dropdown-multi
                  id="teams"
                  label="teams"
                  selections="[[teams]]"
                  value="{{ruleAction.teams}}"
                  on-value-changed="_validateRule"
                ></mist-dropdown-multi>
                <mist-dropdown-multi
                  id="members"
                  label="members"
                  selections="[[users]]"
                  value="{{ruleAction.users}}"
                  on-value-changed="_validateRule"
                ></mist-dropdown-multi>
                <paper-input
                  id="emails"
                  label="other email"
                  value="{{ruleAction.emails}}"
                  type="email"
                  auto-validate
                  on-invalid-changed="_validateRule"
                  invalid="{{ruleAction.emailsInvalid}}"
                ></paper-input>
                <paper-textarea
                  id="alert-description"
                  placeholder="description"
                  value="{{ruleAction.description}}"
                  cols
                  on-value-changed="_validateRule"
                ></paper-textarea>
              </template>
              <iron-icon
                id="[[index]]"
                icon="remove"
                on-tap="_removeAction"
                hidden$="[[!index]]"
              ></iron-icon>
            </template>
          </span>
          <!--iron-icon icon="add" on-tap="_addAction"></iron-icon-->
        </div>
      </div>
      <div slot="rule-actions" class="rule-actions layout horizontal">
        <p class="errormsg-container" hidden$="[[!formError]]">
          <iron-icon icon="icons:error-outline"></iron-icon>
          <span id="errormsg">[[formMessage]]</span>
        </p>
        <paper-spinner active$="{{sendingData}}"></paper-spinner>
        <paper-button class="link" on-tap="_close">cancel</paper-button>
        <paper-button
          on-tap="saveRule"
          class="blue"
          disabled$="[[!isValidRule]]"
          >save rule</paper-button
        >
      </div>
    </div>
    <iron-ajax
      id="updateRuleRequest"
      url="/api/v1/rules/[[rule.id]]"
      contentType="application/json"
      method="POST"
      on-request="_handleUpdateRequest"
      on-response="_close"
      on-error="_handleFormError"
      loading="{{sendingData}}"
      handle-as="json"
    ></iron-ajax>
    <iron-ajax
      id="addRuleRequest"
      url="/api/v1/rules"
      contentType="application/json"
      method="POST"
      on-request="_handleAddRequest"
      on-response="_close"
      on-error="_handleFormError"
      loading="{{sendingData}}"
      handle-as="text"
    ></iron-ajax>
    <iron-ajax
      id="metrics"
      url="[[metricsUri]]"
      handle-as="json"
      method="GET"
      contentType="application/json"
      loading="{{loadingMetrics}}"
      on-response="_handleMetricResponse"
      on-error="_handleMetricError"
    >
    </iron-ajax>
  `,

  is: 'rule-edit',
  behaviors: [validateRuleBehavior],

  properties: {
    model: {
      type: Object,
    },
    rule: {
      type: Object,
    },
    hidden: {
      type: Boolean,
    },
    ruleTypes: {
      type: Array,
      value() {
        return ['arbitrary', 'every', 'specific', 'tagged'];
      },
    },
    ruleType: {
      type: String,
    },
    isNoData: {
      type: Boolean,
      computed: '_computeIsNoData(rule)',
      value: false,
    },
    tags: {
      type: String,
    },
    resourceId: {
      type: String,
    },
    resources: {
      type: Array,
    },
    machines: {
      type: Object,
    },
    monitoredMachines: {
      type: Array,
    },
    currentRule: {
      type: Object,
    },
    resource: {
      type: Object,
    },
    resourceTypes: {
      type: Array,
      value() {
        return [
          'cloud',
          '',
          'machine',
          'volume',
          'network',
          'zone',
          '',
          'key',
          'script',
          'schedule',
          // 'team',
          // 'member'
        ];
      },
    },
    resourceType: {
      type: String,
      value: '',
    },
    hideApplyOn: {
      type: Boolean,
      computed: '_computeHideApplyOn(resource, isNoData)',
    },
    updateExistingRule: {
      type: Boolean,
    },
    availableMetrics: {
      type: Array,
    },
    active: {
      type: Boolean,
      notify: true,
    },
    formError: {
      type: Boolean,
      value: false,
    },
    formMessage: {
      type: String,
    },
    teams: {
      type: Array,
    },
    users: {
      type: Array,
    },
    resourcesActions: {
      type: Array,
      value() {
        return {
          machine: ['alert', 'webhook', 'reboot', 'destroy', 'run', 'no_data'],
        };
      },
    },
    actions: {
      type: Array,
      value() {
        return ['alert', 'webhook', 'reboot', 'destroy', 'run', 'no_data'];
      },
    },
    isValidRule: {
      type: Boolean,
      value: false,
    },
    conditionValid: {
      type: Boolean,
      value: false,
    },
    targetValid: {
      type: Boolean,
      value: false,
    },
    editingExistingRule: {
      type: Boolean,
      computed: '_computeEditingExistingRule(rule, rule.*)',
    },
    showCheckEvery: {
      type: Boolean,
      computed:
        '_computeShowCheckEvery(ruleType,resourceType,resourceId,tags,resource)',
      value: false,
    },
    showDropDownResources: {
      type: Boolean,
      computed: '_computeShowDropDownResources(ruleType,resourceType)',
      value: false,
    },
    features: {
      type: Object,
    },
    metricsUri: {
      type: String,
      computed:
        '_computeMetricsUri(resource.id, resourceId, rule.resource_type, tags, ruleType)',
    },
    loadingMetrics: {
      type: Boolean,
      value: false,
    },
  },

  observers: [
    '_configUpdates(features)',
    '_focusOnMetricName(active)',
    '_focusOnIdOrTags(ruleType)',
    '_currentRuleUpdated(currentRule.*)',
    '_initialiseEdit(currentRule, resource, rule.id)',
    '_computeResourcesAndActions(model, resourceType, ruleType)',
    '_validateCondition(rule.*)',
    '_resourceTypeChanged(resourceType)',
    '_metricsUriChanged(metricsUri)',
    '_ruleDataTypeChanged(rule.data_type)',
  ],
  listeners: {
    'choose-metric': '_selectMetric',
  },

  ready() {
    if (!this.rule) {
      this._resetRule();
    }
  },
  _getQueryIndex(query) {
    return this.rule.queries.indexOf(query);
  },
  _metricsUriChanged(_metricsUri) {
    // Get metrics unless we're not editing, or the rule is on tags (if on tags, get metrics will be triggered on-blur)
    if (
      !this.hidden &&
      this.rule &&
      this.rule.data_type === 'metrics' &&
      !this._isTagged(this.ruleType)
    )
      this._getMetrics();
  },
  _computeMetricsUri(_resourceID, resourceId, _resourceType, _tags, _ruleType) {
    // Update uri, unless we are in a single page where we are provided with a resource and resourceType.
    if (this.resource) {
      return `/api/v1/metrics?resource_type=${this.resourceType}&resource_id=${this.resource.id}`;
    }
    if (this.rule && !this.isNoData) {
      let typeString = '';
      let idString = '';
      let tagsString = '';
      if (this.rule.resource_type && !this._isOrg(this.resourceType)) {
        typeString = `resource_type=${this.rule.resource_type}`;
      }
      if (this.resourceId && this._isSpecific(this.ruleType)) {
        idString = `${typeString ? '&' : ''}resource_id=${this.resourceId}`;
      }
      if (this.tags && this._isTagged(this.ruleType)) {
        tagsString = `${
          typeString || resourceId ? '&' : ''
        }tags=${this._computeTagsString(
          this._computeTagsFromString(this.tags)
        )}`;
      }
      console.log(
        '_computeMetricsUri =====',
        `/api/v1/metrics?${typeString}${idString}${tagsString}`
      );

      return `/api/v1/metrics?${typeString}${idString}${tagsString}`;
    }
    return '';
  },
  _computeTagsString(tags) {
    // Compute tags string in the form "tagkey1:tagvalue1,tagkey2,..""
    let tagsString = '';
    Object.keys(tags || {}).forEach(p => {
      tagsString += p;
      if (tags[p]) tagsString += `:${tags[p]}`;
      tagsString += ',';
    });
    console.log(tagsString);
    return tagsString.length
      ? tagsString.substring(0, tagsString.length - 1)
      : '';
  },
  _handleMetricResponse(data) {
    if (data.detail.response) {
      // console.log('_handleMetricResponse response data', data.detail.response);
      const meteringMetrics = {};
      const monitoringMetrics = {};
      // By doing the below two metrics with similar name eg.
      // mem.active and mem_active (influx & victoria)
      // will result in a single metric in the output, the one that gets
      // read last. This bug should be fixed if multiple monitoring gets
      // popular.
      const transformMetricName = x => {
        const x1 = x.replace('{', '.{');
        const prefix = x1.match(/[^.{]*/i)[0];
        return x1.replace(prefix, prefix.replace(/_/g, '.'));
      };
      Object.keys(data.detail.response).forEach(metricName => {
        if (
          data.detail.response[metricName].method === 'telegraf-victoriametrics'
        ) {
          if (metricName.indexOf('metering') > -1)
            meteringMetrics[transformMetricName(metricName)] =
              data.detail.response[metricName];
          else
            monitoringMetrics[transformMetricName(metricName)] =
              data.detail.response[metricName];
        } else {
          monitoringMetrics[metricName] = data.detail.response[metricName];
        }
      });
      const outputMetering = this._getMetricsLayering(meteringMetrics);
      const outputMonitoring = this._getMetricsLayering(monitoringMetrics);
      let metricsArray = this._computeMetricsArray(outputMonitoring);
      metricsArray.unshift({ name: 'monitoring', header: true });
      if (Object.keys(outputMetering).length > 0)
        metricsArray.push({
          name: 'metering',
          header: true,
        });
      metricsArray = [
        ...metricsArray,
        ...this._computeMetricsArray(outputMetering),
      ];
      this.set('availableMetrics', metricsArray);
      // Store metrics in resource if available, ie we are in a single page, so as to improve performance
      if (!this.model.metrics) {
        this.model.metrics = {};
      }
      this.model.metrics[this.metricsUri] = this.availableMetrics;
      // handle empty response
      if (!outputMonitoring || !outputMetering) {
        this.dispatchEvent(
          new CustomEvent('toast', {
            bubbles: true,
            composed: true,
            detail: {
              msg: 'No metrics available for this resource(s)',
              duration: 3000,
            },
          })
        );
      }
    }
  },
  _computeMetricsArray(output) {
    const arr = [];
    if (output) {
      if (output && typeof output === 'object') {
        let obj = {};
        Object.keys(output || {}).forEach(p => {
          if (typeof output[p] === 'object') {
            obj = { name: p, options: this._computeMetricsArray(output[p]) };
          } else {
            obj = { name: output[p], options: [] };
          }
          arr.push(obj);
        });
      }
    }
    arr.forEach(elem => {
      let totalIndex = 0;
      for (let i = 0; i < elem.options.length; i++) {
        if (elem.options[i].name.includes('total')) {
          totalIndex = i;
          break;
        }
      }
      if (totalIndex > 0)
        elem.options.splice(0, 0, elem.options.splice(totalIndex, 1)[0]);
    });
    return arr.sort((a, b) => a.name.localeCompare(b.name));
  },

  _getMetricsLayering(metrics) {
    // Return an Object that has nested properties given a transformed metric name
    // example input {"cpu.total.free.{cpu=1}": metric}
    // example output {"cpu": "total": "free": "cpu_total_free{cpu=1}": metric.id}
    const output = {};
    Object.keys(metrics).forEach(metric => {
      let res = output;
      const chunks = metric.split('.');
      try {
        for (let i = 0; i < chunks.length; i++) {
          if (!res[chunks[i]]) {
            res[chunks[i]] = {};
          }
          if (i === chunks.length - 1) {
            res[chunks[i]] = metrics[metric].id;
          }
          res = res[chunks[i]];
        }
      } catch (e) {
        console.warn(`Metric ${metric} encountered a problem during listing.`);
        output[chunks[0]][metric] = metrics[metric].id;
      }
    });
    return output;
  },

  _handleMetricError(error) {
    console.error('_handleMetricError', error);
    this.dispatchEvent(
      new CustomEvent('toast', {
        bubbles: true,
        composed: true,
        detail: { msg: 'Error fetching available metrics.', duration: 3000 },
      })
    );
  },
  _ruleDataTypeChanged(dataType) {
    console.log('get metrics', dataType);
    if (this.rule && this.rule.data_type === 'metrics') this._getMetrics();
  },
  _getMetrics() {
    // Generate request only if these available metrics have not been requested before.
    if (
      this.model &&
      this.model.metrics &&
      this.model.metrics[this.metricsUri]
    ) {
      this._clearAvailableMetrics();
      this.set('availableMetrics', this.model.metrics[this.metricsUri]);
    } else if (this.rule.data_type === 'metrics') {
      this._clearAvailableMetrics();
      this.debounce(
        'debounceGetMetrics',
        () => {
          this.$.metrics.generateRequest();
        },
        250
      );
    }
  },
  _clearAvailableMetrics() {
    this.set('availableMetrics', []);
    for (let i = 0; i < this.rule.queries.length; i++) {
      if (!this.editingExistingRule)
        if (
          this.shadowRoot.querySelector(
            `paper-dropdown-menu#target-metrics-${i}`
          )
        ) {
          this.set(`rule.queries.${i}.target`, '');
          this.shadowRoot
            .querySelector(`paper-dropdown-menu#target-metrics-${i}`)
            .shadowRoot.querySelector('paper-input')
            .shadowRoot.querySelector('paper-input-container')
            .querySelector('iron-input')
            .querySelector('input').value = '';
          this.shadowRoot.querySelector(
            `paper-dropdown-menu#target-metrics-${i}`
          ).selected = -1;
        }
    }
  },
  _selectMetric(e) {
    // Choose metric, need to implement selection for paper-dropdown-menu with custom-components nested in listbox
    console.log('_selectMetric', e);
    if (e.detail && e.detail.metric) {
      const selectedMetric = e.detail.metric;
      const { queryIndex } = e.detail;
      this.set(`rule.queries.${queryIndex}.target`, selectedMetric);
      const dropdown = this.shadowRoot.querySelector(
        `paper-dropdown-menu#target-metrics-${queryIndex}`
      );
      dropdown.shadowRoot
        .querySelector('paper-input')
        .shadowRoot.querySelector('paper-input-container')
        .querySelector('iron-input')
        .querySelector('input').value = selectedMetric;
      this.shadowRoot.querySelector(
        `paper-dropdown-menu#target-metrics-${queryIndex}`
      ).selected = selectedMetric;
      dropdown.style.width = `${selectedMetric.length * 11}px`;
      this._focusOnOperator(e, queryIndex);
    }
  },

  _configUpdates(_features) {
    if (this.features.orchestration) {
      this.splice('resourceTypes', 9, 0, 'template');
      this.splice('resourceTypes', 10, 0, 'stack');
    }
    if (this.features.tunnels) {
      this.splice(
        'resourceTypes',
        this.resourceTypes.indexOf('schedule'),
        0,
        'tunnel'
      );
    }
  },

  _displayItemName(item, type) {
    return (
      item.title ||
      item.name ||
      this._displayItemNameByType(item, type) ||
      item.external_id ||
      item.id
    );
  },
  _displayItemSecondary(item, type) {
    switch (type) {
      case 'zone': {
        return `${this._getCloudName(item.cloud)}`;
      }
      default:
        return false;
    }
  },
  _getCloudName(id) {
    return this.model && this.model.clouds && id
      ? this.model.clouds[id].title
      : '';
  },
  _displayItemNameByType(item, type) {
    switch (type) {
      case 'zone': {
        return `${item.domain}`;
      }
      case 'record': {
        console.log('_displayItemNameByType', type, item);
        break;
      }
      case 'subnet': {
        console.log('_displayItemNameByType', type, item);
        break;
      }
      default:
        return '';
    }
    return false;
  },

  _computeShowCheckEvery(ruleType, resourceType, resourceId, tags, _resource) {
    return (
      this.showCheckEvery ||
      this.resource ||
      (!this.isNoData &&
        this._targetIsValid(ruleType, resourceType, resourceId, tags))
    );
  },

  _targetIsValid(_ruleType, _resourceType, _resourceId, _tags) {
    return (
      (this.ruleType || this.resourceType) &&
      // is Arbitrary
      (this._isArbitrary(this.ruleType) ||
        this._isOrg(this.resourceType) ||
        // is every
        (this.ruleType === 'every' && this.resourceType) ||
        // is tagged
        (this.ruleType === 'tagged' && this.tags) ||
        // is specific
        (this.ruleType === 'specific' && this.resourceId))
    );
  },

  _computeShowDropDownResources(ruleType, _resourceType) {
    return (
      this._isSpecific(ruleType) &&
      this.resourceType &&
      !this._isOrg(this.resourceType)
    );
  },

  _showTags(ruleType, _resourceType) {
    return this._isTagged(ruleType) && this.resourceType;
  },

  _computeEditingExistingRule(_rule) {
    return this.rule && this.rule.id;
  },

  _computeIsNoData(rule) {
    return rule.title === 'NoData';
  },

  _computeHideApplyOn(resource, isNoData) {
    return !!(resource || isNoData);
  },

  _resourceTypeChanged(_resourceType) {
    // only machines provide metrics for the time being.
    // TODO: update when other resource metrics are available
    if (this.resourceType && this.resourceType !== 'machine') {
      this.set('rule.data_type', 'logs');
    }
  },

  _canUseMetrics(
    _resourceType,
    _ruleType,
    _resourceId,
    _resource,
    _modelMonitoring
  ) {
    // Must be a machine
    if (this.resourceType !== 'machine') {
      return false;
    }
    // Must either be a machine group, or a single monitored machine
    if (this.ruleType !== 'specific') {
      return true;
    }
    return (
      (this.resourceId &&
        this._resourceIsMonitored(this.resourceId, this.model.monitoring)) ||
      (this.resource &&
        this._resourceIsMonitored(this.resource.id, this.model.monitoring))
    );
  },

  _resourceIsMonitored(resourceId, _modelMonitoring) {
    // Compute based on model.monitoring.monitored_machines
    return (
      this.model &&
      this.model.monitoring &&
      this.model.monitoring.monitored_machines &&
      this.model.monitoring.monitored_machines[resourceId]
    );
  },

  _disableRuleTypeChanges(resourceType) {
    if (!resourceType) return true;
    return this._isOrg(resourceType);
  },

  _disableOrg(_type) {
    if (!this.editingExistingRule) return false;
    return !this._isOrg(this.resourceType);
  },

  _disableResource(_type) {
    if (!this.editingExistingRule) return false;
    return this._isOrg(this.resourceType);
  },

  _isOrg(resourceType) {
    return resourceType === 'organization';
  },

  _isArbitrary(type) {
    return type === 'arbitrary';
  },

  _isSpecific(type) {
    return type === 'specific';
  },

  _isTagged(type) {
    return type === 'tagged';
  },

  _initialiseEdit(rule, resource) {
    // console.log("======", rule, this.ruleType);
    if (!resource) {
      if (!rule) return;
      if (!rule.resource_type || rule.arbitrary) {
        this.set('ruleType', 'arbitrary');
      }
      if (rule.resource_type) {
        if (!rule.selectors || !rule.selectors.length) {
          this.set('ruleType', 'every');
        } else if (rule.selectors.length) {
          const selector = rule.selectors[0];
          if (selector.type === 'tags') {
            this.set('ruleType', 'tagged');
            this.set(
              'tags',
              this._removeBrackets(JSON.stringify(selector.include))
            );
          } else if (selector.ids && selector.ids.length === 1) {
            this.set('ruleType', 'specific');
            this.set('resourceId', selector.ids[0]);
          }
        }
      }
      this.set('resourceType', rule.resource_type || 'organization');
    }
  },

  _computeResourcesAndActions(_model, resourceType) {
    let resources = [];
    const key = `${resourceType}s`;
    if (resourceType) {
      this.set('rule.resource_type', resourceType);
      if (!this.ruleType) {
        this._focusOnType();
      } else {
        this._focusOnIdOrTags(this.ruleType);
      }
    }
    if (resourceType && this.model) {
      if (this.model[key]) {
        resources = Object.values(this.model[key]);
        // order machines, show monitored first
        if (this.resourceType === 'machine')
          resources.sort((a, b) => {
            if (
              (a.monitoring && !b.monitoring) ||
              (a.monitoring.hasmonitoring && !b.monitoring.hasmonitoring)
            )
              return -1;
            if (
              (!a.monitoring && b.monitoring) ||
              (!a.monitoring.hasmonitoring && b.monitoring.hasmonitoring)
            )
              return 1;
            return 0;
          });
        // console.log('resources', this.resourceType, resources);
      } else {
        // Subnets and records can NOT be found under model.subnets model.records
        // We must track them in each model.network and model.zone and join
        const parentKey = key === 'subnets' ? 'networks' : 'zones';
        let parentResources = [];
        if (this.model[parentKey]) {
          parentResources = Object.values(this.model[parentKey]);
          for (let i = 0; i < parentResources.length; i++) {
            if (parentResources[i][key]) {
              resources = resources.concat(
                Object.values(parentResources[i][key])
              );
            }
          }
          // console.log('resources', resources);
        }
      }
    }
    this.set('resources', resources || []);
    this.$.resourcesRepeat.render();

    this.set(
      'actions',
      this.resourcesActions[resourceType] || ['alert', 'webhook']
    );
    if (this.$.actionsRepeat) this.$.actionsRepeat.render();
  },

  _removeBrackets(string) {
    return (
      string &&
      string
        .replace(/{/g, '')
        .replace(/}/g, '')
        .replace(/"/g, '')
        .replace(/:/g, '=')
        .replace(/=null/g, '')
    );
  },

  _currentRuleUpdated(_event) {
    this.set('rule', {
      id: this.currentRule.id,
      title: this.currentRule.title,
      data_type: this.currentRule.data_type || null,
      resource_type: this.currentRule.resource_type || null,
      selectors: this.currentRule.selectors || null,
      actions: this._transformActions(this.currentRule.actions),
      queries: this.currentRule.queries.slice(),
      aggregation:
        this.currentRule.queries[0].aggregation === 'any'
          ? ''
          : this.currentRule.queries[0].aggregation,
      window: {
        period: this.currentRule.window.period || 'minutes',
        start: this.currentRule.window.start || 1,
        // stop: this.currentRule.stop
      },
      frequency: {
        period: this.currentRule.frequency.period || 'minutes',
        every: this.currentRule.frequency.every || 1,
      },
      trigger_after: {
        period: this.currentRule.trigger_after.period || 'minutes',
        offset: this.currentRule.trigger_after.offset || 0,
      },
    });
  },

  _transformActions(actions) {
    const result = [];
    for (let i = 0; i < actions.length; i++) {
      if (actions[i].type === 'notification') {
        result.push({
          type: 'alert',
          level: actions[i].level,
          users: actions[i].users.slice(),
          teams: actions[i].teams.slice(),
          emails: actions[i].emails.slice(),
          description: actions[i].description,
        });
      } else if (actions[i].type === 'machine_action') {
        result.push({
          type: actions[i].action,
        });
      } else if (actions[i].type === 'command') {
        result.push({
          type: 'run',
          command: actions[i].command,
        });
      } else if (actions[i].type === 'no_data') {
        result.push({
          type: 'no_data',
          users: actions[i].users.slice(),
          teams: actions[i].teams.slice(),
          emails: actions[i].emails.slice(),
        });
      } else if (actions[i].type === 'webhook') {
        result.push({
          type: 'webhook',
          method: actions[i].method,
          url: actions[i].url,
          params: actions[i].params,
          data: actions[i].data,
          json: actions[i].json,
          headers: actions[i].headers,
        });
      }
    }
    return result;
  },

  _computeId(title) {
    return title ? `edit ${title}` : 'new rule';
  },

  _computeUnits(metric, _metrics) {
    let ref;
    if (this.availableMetrics && this.availableMetrics[metric])
      ref = this.availableMetrics[metric].unit;
    return ref || '';
  },

  _resetRule(_event) {
    this.set('rule', {});
    this.set('rule', {
      actions: [
        {
          emailsInvalid: false,
        },
      ],
      queries: [{}],
      aggregation: '',
      window: {
        period: 'minutes',
        start: 1,
      },
      frequency: {
        every: 1,
        period: 'minutes',
      },
    });
    this.set('ruleType', false);
    this.set('formError', false);
  },

  _close(event) {
    // TODO: reset threshold input values
    // console.log('close length', this.rule.queries.length);
    // if (this.rule.queries.length) {
    //     var queriesLength = this.rule.queries.length;
    //     for (let i = 0; i < queriesLength; i++) {
    //         console.log('close i', this.querySelector('paper-input#threshold-'+i));
    //         this.querySelector('paper-input#threshold-'+i).value = "";
    //     }
    // }
    this._resetRule(event);
    this.set('active', false);
  },

  _isCommandSelected(selectedAction) {
    return selectedAction === 'run';
  },

  _isAlertSelected(selectedAction) {
    return selectedAction === 'alert';
  },

  _isWebhookSelected(selectedAction) {
    return selectedAction === 'webhook';
  },

  _validateConditionDebounce() {
    this.debounce(
      '_validateCondition',
      () => {
        this._validateCondition();
      },
      200
    );
  },

  _validateTarget(e) {
    // console.log('_validateTarget', e, e.model, this.rule.queries && this.rule.queries[0].target, this.rule.queries);
    let allTargetsDefined = true;
    if (this.rule.queries) {
      for (let i = 0; i < this.rule.queries.length; i++) {
        const { target } = this.rule.queries[i];
        if (target === undefined) {
          allTargetsDefined = false;
          break;
        }
      }
      this.set('targetValid', this.rule.queries.length && allTargetsDefined);
    }
    // Currently only count is supported for logs
    if (e.model.index !== undefined) {
      this.set('rule.aggregation', 'count');
    }
  },

  _validateCondition(_e) {
    // console.log('validateCondition', this.rule.queries && this.rule.queries[0].threshold, this.rule.queries);
    let allThresholdsDefined = true;
    if (this.rule.queries) {
      for (let i = 0; i < this.rule.queries.length; i++) {
        if (this.rule.queries[i].threshold === undefined) {
          allThresholdsDefined = false;
          break;
        }
      }
      this.set(
        'conditionValid',
        this.rule.queries.length && allThresholdsDefined
      );
      // console.log('conditionValid', this.conditionValid, this.rule.queries.length, allThresholdsDefined, this.rule.queries[0].threshold);
    }
    this._validateRule();
  },

  _focusOnType(_e) {
    if (this.rule && this.resourceType)
      if (
        this.active &&
        !this.rule.id &&
        this.shadowRoot.querySelector('paper-dropdown-menu.type')
      ) {
        this.shadowRoot.querySelector('paper-dropdown-menu.type').open();
        if (
          this.shadowRoot.querySelector('paper-dropdown-menu.type').$.menuButton
        )
          this.shadowRoot
            .querySelector('paper-dropdown-menu.type')
            .$.menuButton.focus();
      }
  },

  _focusOnMetricName(active) {
    if (this.rule && this.resource && this.rule.data_type !== 'logs')
      if (
        active &&
        !this.rule.id &&
        this.shadowRoot.querySelector('paper-dropdown-menu.target')
      ) {
        this.shadowRoot.querySelector('paper-dropdown-menu.target').open();
        if (
          this.shadowRoot.querySelector('paper-dropdown-menu.target').$
            .menuButton
        )
          this.shadowRoot
            .querySelector('paper-dropdown-menu.target')
            .$.menuButton.focus();
      }
  },

  _focusOnIdOrTags(ruleType) {
    if (!this.hidden) {
      let selector;
      if (ruleType === 'specific') {
        selector = '#resources-rule-type-id';
      }
      if (ruleType === 'tagged') {
        selector = '#resources-rule-type-tags';
      }
      if (this.shadowRoot.querySelector(selector)) {
        this.shadowRoot.querySelector(selector).focus();
        if (this.shadowRoot.querySelector(selector).open) {
          this.shadowRoot.querySelector(selector).open();
        }
        if (this.shadowRoot.querySelector(selector).$.menuButton)
          this.shadowRoot.querySelector(selector).$.menuButton.focus();
      }
    }
  },

  _focusOnTarget(e) {
    if (!this.hidden && e.detail.value) {
      const selector = `#${e.currentTarget.id.replace(
        'data-type-',
        `target-${e.detail.value}s-`
      )}`;
      // TODO: paper-input#target-logs-0 does not focus
      if (this.shadowRoot.querySelector(selector)) {
        console.log(
          '_focusOnTarget',
          selector,
          this.shadowRoot.querySelector(selector)
        );
        this.shadowRoot.querySelector(selector).focus();
        if (this.shadowRoot.querySelector(selector).open) {
          this.shadowRoot.querySelector(selector).open();
        }
        if (this.shadowRoot.querySelector(selector).$.menuButton)
          this.shadowRoot.querySelector(selector).$.menuButton.focus();
      }
    }
  },

  _focusOnAggregation(e) {
    if (!this.hidden) {
      const selector = `#${e.currentTarget.id
        .replace('target', 'aggregation')
        .replace('threshold', 'aggregation')}`;
      console.log(
        '_focusOnAggregation',
        selector,
        this.shadowRoot.querySelector(selector)
      );
      if (this.shadowRoot.querySelector(selector)) {
        this.shadowRoot.querySelector(selector).focus();
        if (this.shadowRoot.querySelector(selector).open) {
          this.shadowRoot.querySelector(selector).open();
        }
        if (this.shadowRoot.querySelector(selector).$.menuButton)
          this.shadowRoot.querySelector(selector).$.menuButton.focus();
      }
    }
    // this._validateCondition();
  },

  _focusOnOperator(e) {
    if (
      !this.hidden &&
      e.detail.value &&
      e.currentTarget.id &&
      e.currentTarget.id.split('target-metrics-').length > 0
    ) {
      const selector = `#${e.currentTarget.id.replace(
        'target-metrics-',
        'operator-'
      )}`;
      if (this.shadowRoot.querySelector(selector)) {
        console.log(
          '_focusOnOperator',
          selector,
          this.shadowRoot.querySelector(selector)
        );
        this.shadowRoot.querySelector(selector).focus();
        if (this.shadowRoot.querySelector(selector).open) {
          this.shadowRoot.querySelector(selector).open();
        }
        if (this.shadowRoot.querySelector(selector).$.menuButton)
          this.shadowRoot.querySelector(selector).$.menuButton.focus();
      }
    }
  },

  _focusOnThreshold(e) {
    if (!this.hidden && e.detail.value) {
      const selector = `#${e.currentTarget.id.replace(
        'operator-',
        'threshold-'
      )}`;
      console.log(
        '_focusOnOperator',
        selector,
        this.shadowRoot.querySelector(selector)
      );
      if (selector && this.shadowRoot.querySelector(selector)) {
        this.shadowRoot.querySelector(selector).focus();
      }
    }
  },

  saveRule() {
    // Prepare payload
    const payload = {
      queries: [],
      actions: [],
    };
    if (this.resource) {
      let type = this.rule.resource_type || this.resourceType || '';
      if (!type) {
        const that = this;
        const resources = [
          'clouds',
          'machines',
          'volumes',
          'networks',
          'zones',
          'keys',
          'images',
          'scripts',
          'templates',
          'schedules',
          'teams',
          'members',
        ];
        type = resources.find(
          res =>
            that.model &&
            that.model[res] &&
            Object.values(that.model[res])
              .map(x => x.id)
              .indexOf(that.resource.id) > -1
        );
      }
      payload.selectors = [
        {
          type: 'resources',
          ids: [this.resource.id],
        },
      ];
    } else if (this.ruleType === 'specific') {
      payload.selectors = [
        {
          type: 'resources',
          ids: [this.resourceId],
        },
      ];
    } else if (this.ruleType === 'tagged') {
      payload.selectors = [
        {
          type: 'tags',
          include: this._computeTagsFromString(this.tags),
        },
      ];
    } else if (this.ruleType === 'every') {
      payload.selectors = [];
    }
    if (this.resourceType !== 'organization' && !this.rule.id) {
      payload.resource_type = this.resourceType;
    }
    payload.data_type = this.rule.data_type;
    payload.window = {
      period: this.rule.window.period || 'minutes',
      start: parseInt(this.rule.window.start, 10) || 1,
    };
    payload.frequency = {
      period: this.rule.frequency.period || 'minutes',
      every: parseInt(this.rule.frequency.every, 10) || 1,
    };
    for (let i = 0; i < this.rule.queries.length; i++) {
      payload.queries[i] = {
        target: this.rule.queries[i].target,
        operator: this.rule.queries[i].operator,
        threshold: parseInt(this.rule.queries[i].threshold, 10),
        aggregation: this.rule.aggregation ? this.rule.aggregation : 'any',
      };
    }
    for (let i = 0; i < this.rule.actions.length; i++) {
      if (this.rule.actions[i].type === 'alert') {
        let emails;
        if (
          this.rule.actions[i].emails &&
          this.rule.actions[i].emails.length &&
          !this.rule.actions[i].emailsInvalid
        ) {
          if (this.rule.actions[i].emails instanceof Array) {
            emails = this.rule.actions[i].emails;
          } else if (typeof this.rule.actions[i].emails === 'string') {
            emails = this.rule.actions[i].emails.split(',');
          }
        }
        // console.log('emails',emails);
        payload.actions[i] = {
          type: 'notification',
          level: this.rule.actions[i].level,
          description: this.rule.actions[i].description,
        };
        if (this.rule.actions[i].users && this.rule.actions[i].users.length) {
          payload.actions[i].users = this.rule.actions[i].users;
        }
        if (this.rule.actions[i].teams && this.rule.actions[i].teams.length) {
          payload.actions[i].teams = this.rule.actions[i].teams;
        }
        if (emails && emails.length) {
          payload.actions[i].emails = emails;
        }
      } else if (this.rule.actions[i].type === 'run') {
        payload.actions[i] = {
          type: 'command',
          command: this.rule.actions[i].command,
        };
      } else if (
        this.rule.actions[i].type === 'reboot' ||
        this.rule.actions[i].type === 'destroy'
      ) {
        payload.actions[i] = {
          type: 'machine_action',
          action: this.rule.actions[i].type,
        };
      } else if (this.rule.actions[i].type === 'no_data') {
        delete payload.actions;
        delete payload.queries;
      } else if (this.rule.actions[i].type === 'webhook') {
        payload.actions[i] = {
          type: 'webhook',
          method: this.rule.actions[i].method,
          url: this.rule.actions[i].url,
          params: this.rule.actions[i].params,
          data: this.rule.actions[i].data,
          json: this.rule.actions[i].json,
          headers: this.rule.actions[i].headers,
        };
      }
    }
    if (!this.rule.id) {
      // Add new rule
      this.$.addRuleRequest.body = payload;
      this.$.addRuleRequest.headers['Content-Type'] = 'application/json';
      this.$.addRuleRequest.headers['Csrf-Token'] = CSRFToken.value;
      this.$.addRuleRequest.generateRequest();
    } else {
      // Update existing rule
      // backend does not accept data_type on rule updates
      delete payload.data_type;
      this.$.updateRuleRequest.body = payload;
      this.$.updateRuleRequest.headers['Content-Type'] = 'application/json';
      this.$.updateRuleRequest.headers['Csrf-Token'] = CSRFToken.value;
      this.$.updateRuleRequest.generateRequest();
    }
  },

  _computeTagsFromString(str) {
    const tags = {};
    if (str && str.length) {
      const chuncks = str.split(',');
      if (chuncks.length) {
        for (let i = 0; i < chuncks.length; i++) {
          const parts = chuncks[i].split('=');
          const key = parts[0].trim();
          const value = parts[1] ? parts[1].trim() : null;
          tags[key] = value;
        }
      }
    }
    return tags;
  },

  _handleFormError(e) {
    // console.log(e.detail.request.xhr.responseText);
    this.set('formMessage', e.detail.request.xhr.responseText);
    this.set('formError', true);
  },

  _hideAction(action, _isNoData) {
    return action === 'no_data' && !this.isNoData;
  },

  _actionName(action) {
    return action === 'no_data' ? 'no data alert' : action;
  },

  isDataTypeLogs(dt) {
    if (!dt) return false;
    return dt === 'logs';
  },

  isCountAggregation(t) {
    if (!t) return false;
    return t === 'count';
  },

  _setActionDefaults(e) {
    if (e.detail.value === 'alert') {
      e.model.__data.ruleAction.level = 'warning';
    } else if (e.detail.value === 'webhook') {
      e.model.__data.ruleAction.method = 'post';
    }
  },
});
