import { PolymerElement, html } from '@polymer/polymer/polymer-element.js';
import { mixinBehaviors } from '@polymer/polymer/lib/legacy/class.js';
import { MistListActionsBehavior } from '@mistio/mist-list/mist-list-actions-behavior.js';
import '@mistio/mist-list/mist-list-actions.js';
import './edit-nodepool.js';
import { CSRFToken } from '../helpers/utils.js';

const NODEPOOL_ACTIONS = {
    edit : {
        name: "edit",
        icon: "",
        confirm: "false",
        multi: "false"
    }
}

export default class NodepoolActions extends mixinBehaviors([MistListActionsBehavior], PolymerElement) {

    static get properties() {
        return {
            items: {
                type: Array,
                value() {
                    return [];
                }
            },
            actions: {
                type: Array,
                value() {
                    return [];
                },
                notify: true
            },
            clusterId: {
                type: String
            }
        }
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
            ></edit-nodepool>
            <slot>
                <mist-list-actions
                    id="acts"
                    actions="[[actions]]"
                ></mist-list-actions>
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

    computeItemActions(_nodepool) {
        return ['edit'];
    }
    
    computeActionListDetails(actions) {
        return actions.map(action => NODEPOOL_ACTIONS[action]);
    }

    selectAction(e) {
        if (this.items.length === 1) {
            const action = e.detail.action;
            if(action.name === 'edit') {
                this.$.editNodepoolDialog._openDialog();
            }
        }
        return;
    }

    _getNodepool() {
        if (this.items.length === 1)
            return this.items[0];
        return;
    }
}

customElements.define('nodepool-actions', NodepoolActions);
