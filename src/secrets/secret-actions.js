import '../../node_modules/@polymer/paper-dialog/paper-dialog.js';
import '../../node_modules/@mistio/mist-list/mist-list-actions.js';
import { MistListActionsBehavior } from '../../node_modules/@mistio/mist-list/mist-list-actions-behavior.js';
import { Polymer } from '../../node_modules/@polymer/polymer/lib/legacy/polymer-fn.js';
import { html } from '../../node_modules/@polymer/polymer/lib/utils/html-tag.js';

const SECRET_ACTIONS = {
    'rename': {
        'name': 'rename',
        'icon': 'editor:mode-edit',
        'confirm': false,
        'multi': false,
        'single': true
    },
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
        org: {
            type: Object
        },
        actions: {
            type: Array,
            value () { return []; },
            notify: true
        },
        inSingleView: {
            type: Boolean,
            reflectToAttribute: true
          }
    },

    listeners: {},

    _updateVisibleActions() {
        if (this.$.actions)
          this.$.actions._updateVisibleActions();
      },

    computeItemActions(secret) {
        const arr = [];
        if (secret) {
          if (this.inSingleView)
            arr.push('rename');
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

    _delete() {
        // set up iron ajax
        this.$.request.headers["Content-Type"] = 'application/json';
        this.$.request.headers["Csrf-Token"] = CSRFToken.value;
        this.$.request.method = "DELETE";
    
        for (let i = 0; i < this.items.length; i++) {
          this.$.request.url = `/api/v1/secrets/${ this.items[i].id}`
          this.$.request.generateRequest();
          this.dispatchEvent(new CustomEvent('toast', { bubbles: true, composed: true, detail:  {msg: `Deleting ${  this.items[i].name}` , duration: 1000} }));
        }
      },

});