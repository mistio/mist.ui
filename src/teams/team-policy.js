import '../../node_modules/@polymer/paper-toggle-button/paper-toggle-button.js';
import '../../node_modules/@polymer/paper-button/paper-button.js';
import '../../node_modules/@polymer/paper-progress/paper-progress.js';
import '../../node_modules/@polymer/paper-dropdown-menu/paper-dropdown-menu.js';
import '../../node_modules/@polymer/paper-item/paper-item.js';
import '../../node_modules/@polymer/paper-tooltip/paper-tooltip.js';
import '../../node_modules/@mistio/sortable-list/sortable-list.js';
import './rbac-rule-item.js';
import { CSRFToken, intersection } from '../helpers/utils.js';
import { Polymer } from '../../node_modules/@polymer/polymer/lib/legacy/polymer-fn.js';
import { html } from '../../node_modules/@polymer/polymer/lib/utils/html-tag.js';

Polymer({
  _template: html`
    <style include="shared-styles tags-and-labels">
      .rule span {
        padding-right: 8px;
      }

      #rules {
        width: 100%;
        border-collapse: collapse;
      }

      #rules rbac-rule-item {
        width: 100%;
      }

      #rules rbac-rule-item:nth-of-type(2n + 1) {
        background-color: #f6f6f6;
      }
      #rules rbac-rule-item:nth-of-type(2n) {
        background-color: #fff;
      }

      .rule {
        display: table-row;
        border-bottom: 1px solid #eee;
        border-right: 1px solid #eee;
      }

      .rule.head {
        font-size: 0.9em;
        font-weight: 500;
      }

      .rule.head .index {
        cursor: default;
      }

      .rule > span {
        display: table-cell;
        border-left: 1px solid #eee;
        padding: 8px;
        vertical-align: middle;
      }

      .rule .tag {
        display: inline-block;
        vertical-align: middle;
      }

      .operator-text {
        padding-right: 8px;
      }

      .sub {
        font-size: 0.9em;
        color: rgba(0, 0, 0, 0.54);
        font-weight: 300;
      }

      .default-rule {
        padding: 8px 8px 8px 16px;
        font-size: 16px;
        border-top: 1px solid #eee;
        border-bottom: 1px solid #eee;
      }

      .default-rule > paper-toggle-button {
        display: flex;
      }

      .index {
        text-align: center;
      }

      .rule > span.add {
        border: 0 none;
        margin: 0 auto;
        width: 200px;
        text-align: center;
        display: block;
        cursor: pointer;
      }

      .add .addrule {
        padding: 0;
      }

      .bottom-actions {
        display: flex;
      }

      paper-toggle-button#defaultoperator {
        display: inline-flex;
        --paper-toggle-button-checked-bar-color: var(--green-color);
        --paper-toggle-button-checked-button-color: var(--green-color);
        --paper-toggle-button-checked-ink-color: var(--green-color);
        --paper-toggle-button-unchecked-bar-color: var(--red-color);
        --paper-toggle-button-unchecked-button-color: var(--red-color);
        --paper-toggle-button-unchecked-ink-color: var(--red-color);
      }

      #changeRecord {
        padding: 8px 24px;
        background-color: #ddd;
      }

      #changeRecord > p {
        font-size: 0.8em;
        color: rgba(0, 0, 0, 0.54);
      }

      .progress {
        margin: 0;
        width: 100%;
        display: block;
      }

      paper-progress {
        width: 100%;
      }

      paper-progress#progresserror ::slotted(#primaryProgress) {
        background-color: var(--red-color);
      }

      .errormsg-container {
        color: var(--red-color);
        padding-left: 16px;
        padding-right: 16px;
      }

      .errormsg-container iron-icon {
        color: inherit;
      }

      .head iron-icon {
        opacity: 0.32;
        width: 20px;
        height: 20px;
      }

      .pull-right {
        float: right;
      }

      .notice {
        font-size: 0.9em;
        opacity: 0.54;
        padding-left: 40px;
        flex: 2;
        display: block;
      }

      .notice iron-icon {
        opacity: 0.6;
      }

      .defaultoperator-desc {
        vertical-align: text-bottom;
      }

      #ruleslist {
        position: relative;
        height: auto;
      }

      .loading-data {
        position: absolute;
        background-color: rgba(255, 255, 255, 0.8);
        width: 100%;
        height: 100%;
        left: 0;
        right: 0;
        top: 0;
        bottom: 0;
        z-index: 2;
      }
    </style>
    <custom-style>
      <style is="custom-style">
        paper-tooltip {
          --paper-tooltip: {
            font-size: 1em;
            line-height: 1.65em;
          }
        }
      </style>
    </custom-style>
    <div id="ruleslist">
      <div class="loading-data" hidden="{{!sendingData}}"></div>
      <sortable-list
        id="rules"
        sortable=".rule-item"
        dragging="{{dragging}}"
        on-sort-finish="_onSortFinish"
        on-sort-start="_onSortStart"
      >
        <div id="ruleHead" class="rule head" hidden="[[!rules.length]]">
          <span class="index">ord.</span>
          <span>operator</span>
          <span>resource</span>
          <span>action</span>
          <span
            >condition
            <iron-icon id="condition" icon="icons:help"></iron-icon>
            <paper-tooltip for="condition" position="top">
              A conditional rule will apply to either a specified resource,
              <br />
              or resources that have ALL specified tags. <br />
              Tags must be comma separated.
            </paper-tooltip>
          </span>
          <span></span>
          <span></span>
        </div>
        <template is="dom-repeat" items="{{rules}}" id="rulesrepeat">
          <rbac-rule-item
            class="rule-item"
            rule="[[item]]"
            index="[[index]]"
            model="[[model]]"
            common-permissions="[[commonPermissions]]"
          ></rbac-rule-item>
        </template>
      </sortable-list>
    </div>
    <div class="rules">
      <div class="rule add">
        <span class="addrule">
          <paper-button on-tap="_addRule" class="simple">
            <iron-icon icon="icons:add"></iron-icon> Add a new rule
          </paper-button>
        </span>
      </div>
      <div class="default-rule">
        <paper-toggle-button
          id="defaultoperator"
          class="operator"
          checked$="[[_computeToggle(defaultOperator)]]"
          disabled$="[[_computeDisabled(team.name)]]"
          on-tap="_changeDefaultOperator"
        >
          [[defaultOperator]]
        </paper-toggle-button>
        <span class="defaultoperator-desc"
          >every other action ON any other resource</span
        >
        <span class="notice" hidden$="[[!_computeToggle(defaultOperator)]]">
          <iron-icon icon="icons:warning"></iron-icon> This option will allow
          EVERY action on any resource not specified in the policy above.
        </span>
      </div>
    </div>
    <div id="changeRecord" hidden="">
      <h4>Changes:</h4>
      <p>
        Add rule 4.
        <br />
        Change ALLOW to DENY in rule 5.
        <br />
      </p>
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
      <p class="errormsg-container" hidden$="[[!formError]]">
        <iron-icon icon="icons:error-outline"></iron-icon>
        <span id="errormsg"></span>
      </p>
    </div>
    <div class="clearfix bottom-actions xs12">
      <paper-button
        id="appformsubmit"
        class="submit-btn pull-left blue"
        disabled$="[[!formReady]]"
        raised=""
        on-tap="_submitForm"
        >Save policy</paper-button
      >
      <paper-button
        class="submit-btn pull-right"
        on-tap="_resetForm"
        disabled$="[[!formReady]]"
      >
        <iron-icon icon="icons:refresh"></iron-icon>Reset Policy
      </paper-button>
    </div>
    <iron-ajax
      id="postPolicy"
      url="/api/v1/org/[[model.org.id]]/teams/[[team.id]]/policy"
      loading="{{sendingData}}"
      contenttype="application/json"
      handle-as="xml"
      method="PUT"
      on-request="_handlePostPolicy"
      on-response="_handleResponse"
      on-error="_handleError"
    ></iron-ajax>
  `,

  is: 'team-policy',

  properties: {
    team: {
      type: Object,
    },
    model: {
      type: Object,
    },
    rules: {
      type: Array,
      value() {
        return [];
      },
    },
    defaultOperator: {
      type: String,
      value: '',
    },
    formReady: {
      type: Boolean,
      value: false,
    },
    hasChanges: {
      type: Boolean,
      value: false,
    },
    changes: {
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
    commonPermissions: {
      type: Array,
      computed: '_computeCommonPermissions(model)',
    },
    sortable: {
      type: Object,
    },
    cache: {
      type: String,
    },
    dragging: {
      type: Boolean,
      observer: '_draggingChanged',
    },
  },

  observers: [
    // removed model.teamsArray from dep, due to reseting rules on connection changes
    '_teamChanged(team, team.policy.rules)',
    '_rulesChanged(rules.*, defaultOperator)',
    '_sendingDataChanged(sendingData)',
  ],

  listeners: {
    'delete-rtag': '_deleteRtag',
    'update-rtags': '_updateRtags',
    'update-rid': '_updateRid',
    'delete-rule': '_deleteRule',
    'update-rtype': '_updateRtype',
    'update-raction': '_updateRaction',
    'update-operator': '_updateOperator',
    'update-constraints': '_updateConstraints',
  },
  _computeCommonPermissions() {
    let commonPermissions = this.model.permissions.cloud;
    const that = this;
    Object.keys(this.model.permissions).forEach(t => {
      const s = new Set(commonPermissions);
      commonPermissions = intersection(s, that.model.permissions[t]);
    });
    return Array.from(commonPermissions);
  },

  _draggingChanged(newDragging) {
    if (newDragging === true) {
      this.$.ruleHead.remove();
      this.ruleHasChanges();
    }
  },

  _onSortStart(event) {
    console.log('policy start', event);
  },

  _onSortFinish(event) {
    console.log('policy finish', event);
    const newOrder = [];
    const elements = this.shadowRoot
      .querySelector('sortable-list')
      .querySelectorAll('rbac-rule-item');
    elements.forEach(el => {
      newOrder.push(
        parseInt(
          el.shadowRoot
            .querySelector('.index')
            .textContent.trim()
            .replace('.', ''),
          10
        )
      );
    });
    this._applyReordering(newOrder);
  },

  _applyReordering(newOrder) {
    const orderedRules = [];
    const rules = this.rules.splice(0);
    for (let i = 0; i < newOrder.length; i++) {
      orderedRules.push(rules[newOrder[i]]);
    }
    this.set('rules', orderedRules);
    this._submitForm();
  },

  _teamChanged() {
    // copy default operator to a new string
    if (this.team && this.team.policy) {
      const initialOp = this.team.policy.operator;
      const newString = initialOp.slice(0);
      this.set('defaultOperator', newString);

      // copy the rules array to a new array by
      // clean copy of items
      const newArr = [];
      this.team.policy.rules.forEach((rule, i) => {
        const cleanCopy = {};
        Object.keys(rule || {}).forEach(p => {
          cleanCopy[p] = this._cleanCopy(rule[p], p);
        });
        newArr[i] = cleanCopy;
      }, this);
      const cleanCopyRules = newArr.slice(0);
      this.set('rules', cleanCopyRules);

      this.set('sendingData', true);
      this.$.rulesrepeat.items = [];

      this.async(
        () => {
          this.$.rulesrepeat.items = this.rules;
          this.set('sendingData', false);
        },
        10,
        this
      );
    }
  },

  _cleanCopy(value, property) {
    let newValue;
    if (value == null) return null;
    if (typeof value === 'string') {
      newValue = '';
      newValue = value.slice(0);
    } else if (typeof value === 'object') {
      if (Array.isArray(value)) {
        newValue = [];
        for (let i = 0; i < value.length; i++) {
          newValue[i] = this._cleanCopy(value[i], property);
        }
      } else {
        newValue = {};
        Object.keys(value || {}).forEach(q => {
          newValue[q] = this._cleanCopy(value[q], q);
        });
      }
    } else {
      newValue = value;
    }
    return newValue;
  },

  _rulesChanged() {
    if (this.team) {
      console.log(this.team.policy.rules, this.rules);
      if (
        JSON.stringify(this.team.policy.rules) !== JSON.stringify(this.rules) ||
        this.defaultOperator !== this.team.policy.operator
      ) {
        this.set('formReady', true);
      } else {
        this.set('formReady', false);
      }
    }
  },

  _computeToggle(operator) {
    return operator === 'ALLOW';
  },

  _computeDisabled(name) {
    return name === 'Owners';
  },

  _deleteRtag(e) {
    const ind = e.detail.index;
    const { tag } = e.detail;
    // clean copy rules
    const rtags = {};
    let copy;
    Object.keys(this.rules[ind].rtags || {})(p => {
      if (this.rules[ind].rtags[p] && this.rules[ind].rtags[p] != null)
        copy = this.rules[ind].rtags[p].slice(0);
      else {
        copy = null;
      }
      rtags[p] = copy;
    });
    delete rtags[tag];
    this.set(`rules.${ind}.rtags`, rtags);
    this.ruleHasChanges();
  },

  _updateRtags(e) {
    const ind = e.detail.index;
    const { rtags } = e.detail;
    this.set(`rules.${ind}.rid`, '');
    this.set(`rules.${ind}.rtags`, rtags);
    this.ruleHasChanges();
  },

  _updateRid(e) {
    const ind = e.detail.index;
    const { rid } = e.detail;
    this.set(`rules.${ind}.rid`, rid);
    if (rid) this.set(`rules.${ind}.rtags`, {});
    this.ruleHasChanges();
  },

  _addRule() {
    const emptyRuleObj = {
      action: '',
      operator: 'DENY',
      rid: '',
      rtags: {},
      rtype: '',
      constraints: null,
    };
    this.push('rules', emptyRuleObj);
    this.ruleHasChanges();
  },

  _deleteRule(e) {
    const { index } = e.detail;
    this.splice('rules', index, 1);
    this.ruleHasChanges();
  },

  _changeDefaultOperator() {
    const newOp = this.defaultOperator === 'DENY' ? 'ALLOW' : 'DENY';
    this.set('defaultOperator', newOp);
    this.ruleHasChanges();
  },

  _resetForm() {
    const newArr = [];
    this.team.policy.rules.forEach((rule, i) => {
      const cleanCopy = {};
      Object.keys(rule || {}).forEach(p => {
        cleanCopy[p] = this._cleanCopy(rule[p]);
      });
      newArr[i] = cleanCopy;
    }, this);
    const cleanCopyRules = newArr.slice(0);
    this.set('rules', cleanCopyRules);

    for (let i = 0; i < newArr.length; i++) {
      this.set(`rules.${i}.operator`, newArr[i].operator);
    }

    const initialOp = this.team.policy.operator;
    const newString = initialOp.slice(0);
    this.set('defaultOperator', newString);

    this.set('sendingData', true);
    this.$.rulesrepeat.items = [];

    this.async(
      () => {
        this.$.rulesrepeat.items = this.rules;
        this.set('sendingData', false);
      },
      10,
      this
    );

    this._rulesChanged();
  },

  _submitForm() {
    const policy = {};
    policy.rules = this.rules;

    console.log('_submitForm', this.rules);

    policy.operator = this.defaultOperator;
    this.$.postPolicy.headers['Content-Type'] = 'application/json';
    this.$.postPolicy.headers['Csrf-Token'] = CSRFToken.value;
    this.$.postPolicy.body = {
      policy,
    };
    this.$.postPolicy.generateRequest();
  },

  _handleResponse() {
    this.dispatchEvent(
      new CustomEvent('toast', {
        bubbles: true,
        composed: true,
        detail: {
          msg: 'Team policy updated successfully.',
          duration: 3000,
        },
      })
    );

    this.set('formReady', false);
  },

  _handleError(e) {
    this.set('formError', true);
    this.$.errormsg.textContent = e.detail.request.xhr.responseText;
  },

  _computeSelectedType(index, type) {
    // index of type in resources list
    const typeIndex = this.resources.indexOf(type.toUpperCase());
    return typeIndex > -1 ? typeIndex : 0;
  },

  ruleHasChanges() {
    if (this.formError) {
      this.set('formError', false);
    }
  },

  _updateRtype(e) {
    this.set(`rules.${e.detail.index}.rtype`, e.detail.type);
  },

  _updateRaction(e) {
    this.set(`rules.${e.detail.index}.action`, e.detail.action);
  },

  _updateOperator(e) {
    this.set(`rules.${e.detail.index}.operator`, e.detail.operator);
  },

  _updateConstraints(e) {
    this.set(`rules.${e.detail.index}.constraints`, e.detail.constraints);
    this.ruleHasChanges();
    this._rulesChanged();
  },

  _sendingDataChanged(sendingData) {
    // keep element height fixed while repeater updates
    if (sendingData) {
      const height = this.$.ruleslist.offsetHeight;
      this.$.ruleslist.style.height = `${height}px`;
    } else {
      this.$.ruleslist.style.height = 'auto';
    }
  },
});
