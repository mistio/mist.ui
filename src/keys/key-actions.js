import '../../node_modules/@polymer/polymer/polymer-legacy.js';
import '../../node_modules/@polymer/paper-dialog/paper-dialog.js';
import '../../node_modules/@polymer/paper-input/paper-input.js';
import '../../node_modules/@polymer/paper-input/paper-input-error.js';
import '../../node_modules/@polymer/paper-input/paper-textarea.js';
import '../../node_modules/@polymer/iron-ajax/iron-ajax.js';
import '../../node_modules/@mistio/mist-list/mist-list-actions.js';
import { MistListActionsBehavior } from '../../node_modules/@mistio/mist-list/mist-list-actions-behavior.js';
import '../helpers/transfer-ownership.js';
import '../tags/tags-form.js';
import './key-edit.js';
import { CSRFToken } from '../helpers/utils.js';
import { Polymer } from '../../node_modules/@polymer/polymer/lib/legacy/polymer-fn.js';
import { html } from '../../node_modules/@polymer/polymer/lib/utils/html-tag.js';

const KEY_ACTIONS = {
  'rename': {
    'name': 'rename',
    'icon': 'editor:mode-edit',
    'confirm': false,
    'multi': false,
    'single': true
  },
  'tag': {
    'name': 'tag',
    'icon': 'label',
    'confirm': true,
    'multi': true
  },
  'make_default': {
    'name': 'make default',
    'icon': 'communication:vpn-key',
    'confirm': false,
    'multi': false
  },
  'transfer-ownership': {
    'name': 'transfer ownership',
    'icon': 'icons:redo',
    'confirm': false,
    'multi': true
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
    <tags-form id="tagsdialog" model="[[model]]" items="[[items]]" type="[[type]]"></tags-form>
    <transfer-ownership id="ownershipdialog" user="[[user]]" members="[[_otherMembers(members,items.length)]]" items="[[items]]" type="[[type]]"></transfer-ownership>
    <slot>
        <mist-list-actions id="actions" actions="[[actions]]"></mist-list-actions>
    </slot>
    <key-edit key="[[items.0]]"></key-edit>
    <iron-ajax id="request" handle-as="json" loading="{{loadingData}}" on-response="handleResponse" on-error="handleError"></iron-ajax>
`,

  is: 'key-actions',
  behaviors: [MistListActionsBehavior],

  properties: {
    model: {
      type: Object,
    },
    user: {
      type: String
    },
    members: {
      type: Array
    },
    org: {
      type: Object
    },
    items: {
      type: Array,
      value () { return []; }
    },
    actions: {
      type: Array,
      value () { return []; },
      notify: true
    },
    type: {
      type: String,
      value: 'key'
    },
    inSingleView: {
      type: Boolean,
      reflectToAttribute: true
    }
  },

  listeners: {
    'update': '_updateVisibleActions',
    'confirmation': 'confirmAction',
    'transfer-ownership': 'transferOwnership',
    'rename': '_editKey',
    'select-action': 'selectAction'
  },

  attached() {
    this.$.request.headers["Content-Type"] = 'application/json';
    this.$.request.headers["Csrf-Token"] = CSRFToken.value;
    this.$.request.method = "POST";
  },

  _updateVisibleActions() {
    if (this.$.actions)
      this.$.actions._updateVisibleActions();
  },

  _otherMembers (members) {
    if (this.items && members) {
      const owners = this.items.map(i => i.owned_by)
                        .filter((value,index,self)=>self.indexOf(value) === index);
      // filter out pending users and the single owner of the item-set if that is the case
      return members.filter(m => owners.length === 1 ? m.id !== owners[0] && !m.pending : !m.pending
      );
    }
    return false;
  },

  computeItemActions(key) {
    const arr = [];
    if (key && !key.isDefault && this.org.is_owner) {
      arr.push('make_default');
    }
    if (key) {
      if (this.inSingleView)
        arr.push('rename');
      arr.push('tag');
      if (this.org.ownership_enabled && (key.owned_by === this.user || this.org.is_owner)) {
        arr.push('transfer-ownership');
      }
      arr.push('delete');
    }
    return arr;
  },

  computeActionListDetails (actions) {
    const ret = [];
    for (let i=0; i<actions.length; i++) {
        ret.push(KEY_ACTIONS[actions[i]]);
    }
    return ret;
  },

  confirmAction(e){
    if (e.detail.confirmed)
      this.performAction(this.action, this.items);
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
      else if (action.name === 'make default') {
        this._makeDefault();
      }
      else if (action.name === "tag") {
        this.$.tagsdialog._openDialog();
      }
      else if (action.name === 'transfer ownership') {
        this.$.ownershipdialog._openDialog();
      }
      else {
        this.performAction(this.action, this.items);
      }
    }
  },

  transferOwnership (e) {
    const payload = {
      user_id: e.detail.user_id, // new owner
      resources: {}
    };
    payload.resources[this.type] = this.items.map(i => i.id);
    console.log('transferOwnership', e.detail, payload);
    this.$.request.url = '/api/v1/ownership';
    this.$.request.headers["Content-Type"] = 'application/json';
    this.$.request.headers["Csrf-Token"] = CSRFToken.value;
    this.$.request.method = "POST";
    this.$.request.body = payload;
    this.$.request.generateRequest();
  },

  _delete() {
    // set up iron ajax
    this.$.request.headers["Content-Type"] = 'application/json';
    this.$.request.headers["Csrf-Token"] = CSRFToken.value;
    this.$.request.method = "DELETE";

    for (let i = 0; i < this.items.length; i++) {
      this.$.request.url = `/api/v1/keys/${ this.items[i].id}`
      this.$.request.generateRequest();
      this.dispatchEvent(new CustomEvent('toast', { bubbles: true, composed: true, detail:  {msg: `Deleting ${  this.items[i].name}` , duration: 1000} }));
    }
  },

  _makeDefault(){
    // set up iron ajax
    this.$.request.headers["Content-Type"] = 'application/json';
    this.$.request.headers["Csrf-Token"] = CSRFToken.value;
    this.$.request.method = "POST";

    for (let i = 0; i < this.items.length; i++) {
      this.$.request.url = `/api/v1/keys/${ this.items[i].id}`
      this.$.request.generateRequest();
      this.dispatchEvent(new CustomEvent('toast', { bubbles: true, composed: true, detail:  {msg: `Making key ${  this.items[i].name  } the default.`, duration: 1000} }));
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

  performAction(action) {
    if (action.name === 'delete') {
      this._delete();
    }
    else if (action.name === 'rename') {
      this.dispatchEvent(new CustomEvent('rename'));
    }
  },

  _editKey(e) {
      e.stopImmediatePropagation();
      const el = this.shadowRoot.querySelector('key-edit');
      el._openEditKeyModal();
  },

  handleResponse(e) {
    this.dispatchEvent(new CustomEvent('action-finished', { bubbles: true, composed: true, detail: {success: true} }));

    if (this.$.request && this.$.request.body && this.$.request.body.action){
      this.dispatchEvent(new CustomEvent('toast', { bubbles: true, composed: true, detail:  {msg: `Action: ${this.$.request.body.action
        } successful`, duration: 3000} }));
    } else if (this.$.request && !this.$.request.body) {
      this.dispatchEvent(new CustomEvent('go-to', { bubbles: true, composed: true, detail: { url: '/keys'} }));
    }
    if (e.detail.xhr.responseURL.endsWith("api/v1/ownership") && e.detail.xhr.status === 200 ) {
      this.$.ownershipdialog._closeDialog();
      this.dispatchEvent(new CustomEvent('action-finished'));
      this.dispatchEvent(new CustomEvent('toast', { bubbles: true, composed: true, detail: {
        msg: 'Successful ownership transfer',
        duration: 3000
      } }));

    }
  },

  handleError(e) {
    // console.log(e.detail.request.xhr.statusText);
    this.dispatchEvent(new CustomEvent('toast', { bubbles: true, composed: true, detail: {msg: `Error: ${  e.detail.request.xhr.status } ${ e.detail.request.xhr.statusText}`, duration: 5000} }));

    if (e.detail.request.xhr.responseURL.endsWith("api/v1/ownership")) {
      this.$.ownershipdialog._closeDialog();
    }
  },

  _makeList(items, property){
    return items && items.length && items.map(item => item[property]);
  }
});
