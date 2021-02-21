import '@polymer/paper-dialog/paper-dialog.js';
import '@mistio/mist-list/mist-list-actions.js';
import './secret-edit.js'
import { MistListActionsBehavior } from '@mistio/mist-list/mist-list-actions-behavior.js';
import { CSRFToken } from '../helpers/utils.js';
import { Polymer } from '../../node_modules/@polymer/polymer/lib/legacy/polymer-fn.js';
import { html } from '../../node_modules/@polymer/polymer/lib/utils/html-tag.js';

const SECRET_ACTIONS = {
    'delete': {
        'name': 'delete',
        'icon': 'delete',
        'confirm': true,
        'multi': true
    }
}

Polymer({
    _template: html`
        <style include="shared-styles">
            mist-list-actions {
            width: 100%;
            }
        </style>
        <dialog-element id="confirm"></dialog-element>
        <slot>
            <mist-list-actions id="actions" actions="[[actions]]"></mist-list-actions>
        </slot>
        <iron-ajax id="request" handle-as="json" loading="{{loadingData}}" on-response="handleResponse" on-error="handleError"></iron-ajax>
    `,
    is: 'secret-actions',

    behaviors: [MistListActionsBehavior],

    properties: {
        model: {
            type: Object,
        },
        org: {
            type: Object
        },
        actions: {
            type: Array,
            value: [],
            notify: true
        },
        inSingleView: {
            type: Boolean,
            reflectToAttribute: true
          },
        items: {
            type: Array,
            value: []
        },
        type:{
            type: String,
            value: 'secret'
        }
    },

    listeners: {
        update: '_updateVisibleActions',
        confirmation: 'confirmAction',
        'select-action': 'selectAction'
    },

    _updateVisibleActions() {
        if (this.$.actions)
          this.$.actions._updateVisibleActions();
      },

    computeItemActions(secret) {
        const arr = [];
        if (secret) {
          arr.push('delete');
        }
        return arr;
      },
    
    computeActionListDetails(actions) {
        const ret = [];
        for (let i=0; i<actions.length; i++) {
            ret.push(SECRET_ACTIONS[actions[i]]);
        }
        return ret;
      },

    selectAction(e){
        if (this.items.length) {
            const {action} = e.detail;
            this.set('action', action);
            // console.log('perform action mist-action', this.items);
            if (action.confirm && action.name !== 'tag') {
                const property = ['zone'].indexOf(this.type) === -1 ? "name" : "domain";
                const plural = this.items.length === 1 ? '' : 's';
                const count = this.items.length > 1 ? `${this.items.length} ` : '';
                // this.tense(this.action.name) + " " + this.type + "s can not be undone.
                this._showDialog({
                    title: `${this.action.name  } ${  count  }${this.type  }${plural}?`,
                    body: `You are about to ${  this.action.name  } ${  this.items.length  } ${  this.type  }${plural}:`,
                    list: this._makeList(this.items, property),
                    action: action.name,
                    danger: true,
                    reason: `${this.type  }.${  this.action.name}`
                });
            }
            else {
                this.performAction(this.action, this.items);
            }
        }
    },

    _showDialog(info) {
        const dialog = this.shadowRoot.querySelector('dialog-element');
        if (info) {
          Object.keys(info || {}).forEach((i) => {
            dialog[i] = info[i];
            });
        }
        dialog._openDialog();
    },

    confirmAction(e) {
        if (e.detail.confirmed) this.performAction(this.action, this.items);
    },

    performAction(action) {
        if (action.name === 'delete') {
          this._delete();
        }
    },

    _delete() {
        // set up iron ajax
        this.$.request.headers["Content-Type"] = 'application/json';
        this.$.request.headers["Csrf-Token"] = CSRFToken.value;
        this.$.request.method = "DELETE";
    
        for (let i = 0; i < this.items.length; i++) {
          this.$.request.url = `/api/v2/secrets/${ this.items[i].id}`
          this.$.request.generateRequest();
          this.dispatchEvent(new CustomEvent('toast', { bubbles: true, composed: true, detail:  {msg: `Deleting ${  this.items[i].name}` , duration: 1000} }));
        }
    },

    _makeList(items, property) {
       return items && items.length && items.map(item => item[property]);
    },

});
