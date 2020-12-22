import '../../node_modules/@polymer/paper-item/paper-item.js';
import '../../node_modules/@polymer/paper-toggle-button/paper-toggle-button.js';
import '../../node_modules/@polymer/paper-button/paper-button.js';
import '../../node_modules/@polymer/paper-dropdown-menu/paper-dropdown-menu.js';

import '../../node_modules/@polymer/paper-listbox/paper-listbox.js';
import './rbac-rule-identifier.js';
import './rbac-rule-constraints.js';
import { Polymer } from '../../node_modules/@polymer/polymer/lib/legacy/polymer-fn.js';
import { html } from '../../node_modules/@polymer/polymer/lib/utils/html-tag.js';

Polymer({
  _template: html`
    <style include="shared-styles tags-and-labels">
      :host {
        width: 100%;
      }
      :host span {
        padding-right: 8px;
        vertical-align: middle;
      }

      .uppercase {
        text-transform: uppercase;
      }

      #rules {
        table-layout: fixed;
        width: 100%;
      }

      #rules,
      .rules {
        display: table;
        width: 100%;
        border-collapse: collapse;
        padding: 16px;
      }

      :host {
        display: table-row;
        border-bottom: 1px solid #eee;
        border-right: 1px solid #eee;
      }

      :host > span {
        display: table-cell;
        border-left: 1px solid #eee;
        padding: 2px 8px;
        vertical-align: middle;
      }

      :host .tag {
        display: inline-block;
        vertical-align: middle;
      }

      .operator-text {
        padding-right: 8px;
      }

      .index {
        text-align: center;
        cursor: move;
      }

      :host > span.add {
        border: 0 none;
        margin: 0 auto;
        width: 200px;
        text-align: center;
        display: block;
        cursor: pointer;
      }

      .add .index {
        padding: 16px 24px;
      }

      .bottom-actions {
        display: flex;
      }

      paper-toggle-button.operator {
        display: flex;
        --paper-toggle-button-checked-bar-color: var(--green-color);
        --paper-toggle-button-checked-button-color: var(--green-color);
        --paper-toggle-button-checked-ink-color: var(--green-color);
        --paper-toggle-button-unchecked-bar-color: var(--red-color);
        --paper-toggle-button-unchecked-button-color: var(--red-color);
        --paper-toggle-button-unchecked-ink-color: var(--red-color);
      }

      paper-toggle-button.operator::slotted(.toggle-container) {
        display: inline-block;
        /*vertical-align: text-bottom;*/
      }

      paper-toggle-button.operator::slotted(.toggle-label) {
        display: inline;
        /*vertical-align: text-bottom;*/
        vertical-align: middle;
      }

      .delete {
        opacity: 0.54;
        cursor: pointer;
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

      paper-tooltip ::slotted(#tooltip) {
        font-size: 12px;
      }

      .pull-right {
        float: right;
      }

      paper-dropdown-menu {
        max-width: 150px;
        vertical-align: middle;

        --paper-dropdown-menu-input: {
          text-transform: uppercase;
        }

        --paper-input-container-underline: {
          /*display: none;*/
          opacity: 0.32;
        }
      }

      paper-dropdown-menu.short {
        /*width: 80px;*/
        margin-right: 16px;
      }

      paper-input {
        vertical-align: baseline;
        /*vertical-align: middle;*/
      }

      paper-input ::slotted(paper-input-container) {
        padding: 0;
      }

      paper-listbox > paper-item {
        z-index: 200 !important;
      }

      :host span.narrow-hide {
        padding-top: 4px;
      }

      @media (max-width: 1380px) {
        :host > span {
          /*vertical-align: middle;*/
          display: table-cell;
        }

        :host span.narrow-hide {
          display: none;
        }
      }
    </style>
    <span class="index"> [[index]]. </span>
    <span class="operator">
      <paper-toggle-button
        id$="index-[[index]]"
        class="operator layout horizontal"
        checked$="{{_computeToggle(rule.operator)}}"
        on-tap="_changeOperator"
        >{{rule.operator}}</paper-toggle-button
      >
    </span>
    <span class="resource">
      <span class="narrow-hide"> on </span>
      <span class="uppercase">
        <paper-dropdown-menu no-animations="" no-label-float="">
          <paper-listbox
            slot="dropdown-content"
            class="dropdown-content"
            attr-for-selected="value"
            selected="{{_computeSelectedType(rule.rtype)}}"
            on-iron-activate="selectType"
          >
            <template is="dom-repeat" items="[[resources]]" as="item">
              <paper-item value="[[item]]" class="rtype">[[item]]</paper-item>
            </template>
          </paper-listbox>
        </paper-dropdown-menu>
      </span>
    </span>
    <span class="action">
      <span class="uppercase">
        <paper-dropdown-menu no-animations="" no-label-float="">
          <paper-listbox
            slot="dropdown-content"
            class="dropdown-content"
            attr-for-selected="value"
            selected="{{_computeSelectedAction(rule.action)]]"
            on-iron-activate="selectAction"
          >
            <template is="dom-repeat" items="{{actions}}">
              <paper-item value="[[item]]" class="raction"
                >[[pretify(item)]]</paper-item
              >
            </template>
          </paper-listbox>
        </paper-dropdown-menu>
      </span>
    </span>
    <span class="identifier">
      <rbac-rule-identifier
        model="[[model]]"
        rule="[[rule]]"
        index="[[index]]"
      ></rbac-rule-identifier>
    </span>
    <span class="constraints">
      <rbac-rule-constraints
        model="[[model]]"
        rule="[[rule]]"
        index="[[index]]"
      ></rbac-rule-constraints>
    </span>
    <span class="delete">
      <iron-icon icon="close" on-tap="_deleteRule"></iron-icon>
    </span>
  `,

  is: 'rbac-rule-item',

  properties: {
    model: {
      type: Object,
    },
    rule: {
      type: Object,
      notify: true,
    },
    index: {
      type: Number,
    },
    commonPermissions: {
      type: Array,
    },
    resources: {
      type: Array,
      computed: '_getResources(model)',
    },
    actions: {
      type: Array,
      // computed: '_computeActions(index, rule.rtype, model.permissions)'
    },
  },

  observers: ['_computeActions(index, rule.rtype, model.permissions)'],

  listeners: {},

  _computeToggle(operator) {
    return operator === 'ALLOW';
  },

  _getResources() {
    const ret = [];
    ret.push('ALL');
    Object.keys(this.model.permissions || {}).forEach(perm => {
      ret.push(perm.toUpperCase());
    });
    return ret;
  },

  _changeOperator(_e) {
    const newOp = this.rule.operator === 'DENY' ? 'ALLOW' : 'DENY';
    // this.set('rule.operator', newOp)
    this.dispatchEvent(
      new CustomEvent('update-operator', {
        bubbles: true,
        composed: true,
        detail: { index: this.index, operator: newOp },
      })
    );
  },

  _computeSelectedType(type) {
    // console.log('_computeSelectedType', type.toLowerCase() || 'all')
    return (type && type.toUpperCase()) || 'ALL';
  },

  _computeActions(_index, rtype, _modelpermissions) {
    const type = rtype && rtype.toLowerCase();
    let perm = [];

    if (type !== '' && type !== 'all' && type !== 'ALL') {
      perm = ['ALL'].concat(this.model.permissions[type]);
    } else {
      perm = ['ALL'].concat(this.commonPermissions);
    }
    this.set('actions', perm);
    this._checkIfActionValid(perm);
  },

  _checkIfActionValid(perm) {
    if (
      this.rule &&
      this.rule.action &&
      this.rule.action.length &&
      perm.indexOf(this.rule.action) === -1
    ) {
      this.set('rule.action', '');
    }
  },

  _computeSelectedAction(raction) {
    // console.log('Selected Action', raction)
    return (raction && raction.replace(/ /g, '_').toLowerCase()) || 'ALL';
  },

  pretify(item) {
    if (item) return item.replace(/_/g, ' ').toUpperCase();
    return item;
  },

  _deleteRule() {
    this.dispatchEvent(
      new CustomEvent('delete-rule', {
        bubbles: true,
        composed: true,
        detail: { index: this.index, rule: this.rule },
      })
    );
  },

  selectType(e) {
    const t = e.detail.item.value.toLowerCase();
    if (this.rule.rtype !== t && this.rule.rid !== '') {
      this.set('rule.rid', '');
    }
    this.dispatchEvent(
      new CustomEvent('update-rtype', {
        bubbles: true,
        composed: true,
        detail: { index: this.index, type: t !== 'all' ? t : '' },
      })
    );
  },

  selectAction(e) {
    const a = e.detail.item.value.toLowerCase();
    this.dispatchEvent(
      new CustomEvent('update-raction', {
        bubbles: true,
        composed: true,
        detail: { index: this.index, action: a !== 'all' ? a : '' },
      })
    );
  },
});
