import { PolymerElement, html } from '@polymer/polymer/polymer-element.js';
import { mixinBehaviors } from '@polymer/polymer/lib/legacy/class.js';
import { MistListActionsBehavior } from '@mistio/mist-list/mist-list-actions-behavior.js';
import '@mistio/mist-list/mist-list-actions.js';
import './edit-nodepool.js';

const NODEPOOL_ACTIONS = {
  edit: {
    name: 'edit',
    icon: 'editor:mode-edit',
    confirm: false,
    multi: false,
  },
};

export default class NodepoolActions extends mixinBehaviors(
  [MistListActionsBehavior],
  PolymerElement
) {
  static get properties() {
    return {
      items: {
        type: Array,
        value() {
          return [];
        },
      },
      actions: {
        type: Array,
        value() {
          return [];
        },
        notify: true,
      },
      clusterId: {
        type: String,
      },
      provider: {
        type: String,
      },
    };
  }

  static get template() {
    return html`
      <style include="shared-styles">
        mist-list-actions {
          width: 100%;
        }
      </style>
      <edit-nodepool
        id="editNodepoolDialog"
        nodepool="[[_getNodepool(items.*)]]"
        cluster-id="[[clusterId]]"
        provider="[[provider]]"
      ></edit-nodepool>
      <slot>
        <mist-list-actions id="acts" actions="[[actions]]"></mist-list-actions>
      </slot>
    `;
  }

  ready() {
    super.ready();
    this.addEventListener('select-action', this.selectAction);
    this.addEventListener('update', this._updateVisibleActions);
  }

  _updateVisibleActions() {
    if (this.$.acts) this.$.acts._updateVisibleActions();
  }

  /* eslint-disable class-methods-use-this */
  computeItemActions(nodepool) {
    if (nodepool.id) return '';
    return ['edit'];
  }

  computeActionListDetails(actions) {
    return actions.map(action => NODEPOOL_ACTIONS[action]);
  }
  /* eslint-enable class-methods-use-this */

  selectAction(e) {
    if (this.items.length === 1) {
      const action = e.detail.action;
      if (action.name === 'edit') {
        this.$.editNodepoolDialog._openDialog();
      }
    }
  }

  _getNodepool() {
    let nodepools = [];
    if (this.items.length === 1)
      nodepools = this.items.filter(item => !item.id);
    if (nodepools.length === 1) {
      return nodepools[0];
    }
    return [];
  }
}

customElements.define('nodepool-actions', NodepoolActions);
