import '@polymer/polymer/polymer-legacy.js';
import '@polymer/paper-dialog/paper-dialog.js';
import '@polymer/paper-input/paper-input.js';
import '@polymer/paper-input/paper-input-error.js';
import '@polymer/paper-input/paper-textarea.js';
import '@polymer/iron-ajax/iron-ajax.js';
import '@mistio/mist-list/mist-list-actions.js';
import '@mistio/mist-list/mist-list-actions-behavior.js';
import '../helpers/transfer-ownership.js';
import '../tags/tags-form.js';
import { CSRFToken, intersection } from '../helpers/utils.js';
import { Polymer } from '@polymer/polymer/lib/legacy/polymer-fn.js';
import { html } from '@polymer/polymer/lib/utils/html-tag.js';
// in future also enable disable actions
const TUNNEL_ACTIONS = {
  edit: {
    name: 'edit',
    icon: 'editor:mode-edit',
    confirm: false,
    multi: false,
  },
  tag: {
    name: 'tag',
    icon: 'label',
    confirm: true,
    multi: true,
  },
  'transfer-ownership': {
    name: 'transfer ownership',
    icon: 'icons:redo',
    confirm: false,
    multi: true,
  },
  delete: {
    name: 'delete',
    icon: 'delete',
    confirm: true,
    multi: true,
  },
};
Polymer({
  _template: html`
    <style include="shared-styles">
      :host {
        display: inline;
      }
      mist-list-actions {
        width: 100%;
      }
    </style>

    <dialog-element id="confirm"></dialog-element>
    <transfer-ownership
      id="ownershipdialog"
      user="[[user]]"
      members="[[_otherMembers(members,items.length)]]"
      items="[[items]]"
      type="[[type]]"
    ></transfer-ownership>
    <tags-form
      id="tagsdialog"
      model="[[model]]"
      items="[[items]]"
      type="[[type]]"
    ></tags-form>
    <slot>
      <mist-list-actions actions="[[actions]]"></mist-list-actions>
    </slot>
    <iron-ajax
      id="request"
      handle-as="json"
      loading="{{loadingData}}"
      on-response="handleResponse"
      on-error="handleError"
    ></iron-ajax>
  `,

  is: 'tunnel-actions',

  properties: {
    user: String,
    members: Array,
    org: Object,
    items: {
      type: Array,
      value: [],
    },
    actions: {
      type: Array,
      value: [],
      notify: true,
    },
    type: {
      type: String,
      value: 'tunnel',
    },
    inSingleView: {
      type: Boolean,
      reflectToAttribute: true,
    },
  },

  observers: ['_mapPolicyToActions(items.*,org,user)'],

  listeners: {
    'select-action': 'selectAction',
    confirmation: 'confirmAction',
    'transfer-ownership': 'transferOwnership',
  },

  attached() {
    this.$.request.headers['Content-Type'] = 'application/json';
    this.$.request.headers['Csrf-Token'] = CSRFToken.value;
    this.$.request.method = 'POST';
  },

  itemActions(tunnel) {
    const arr = [];
    if (tunnel) {
      if (this.inSingleView) arr.push('edit');
      arr.push('tag');
      if (
        this.org &&
        this.org.ownership_enabled &&
        (tunnel.owned_by === this.user || this.org.is_owner)
      ) {
        arr.push('transfer-ownership');
      }
      arr.push('delete');
    }
    return arr;
  },

  actionDetails(actions) {
    const ret = [];
    for (let i = 0; i < actions.length; i++) {
      ret.push(TUNNEL_ACTIONS[actions[i]]);
    }
    return ret;
  },

  _otherMembers(members) {
    if (this.items && this.members) {
      const owners = this.items
        .map(i => {
          return i.owned_by;
        })
        .filter((value, index, self) => {
          return self.indexOf(value) === index;
        });
      // filter out pending users and the single owner of the item-set if that is the case
      return members.filter(m => {
        return owners.length === 1
          ? m.id !== owners[0] && !m.pending
          : !m.pending;
      });
    }
    return [];
  },

  _delete() {
    // set up iron ajax
    this.$.request.headers['Content-Type'] = 'application/json';
    this.$.request.headers['Csrf-Token'] = CSRFToken.value;
    this.$.request.method = 'DELETE';

    for (let i = 0; i < this.items.length; i++) {
      this.$.request.url = `/api/v1/tunnels/${this.items[i].id}`;
      this.$.request.generateRequest();
      this.dispatchEvent(
        new CustomEvent('toast', {
          bubbles: true,
          composed: true,
          detail: { msg: `Deleting ${this.items[i].name}`, duration: 1000 },
        })
      );
    }
  },

  _showDialog(info) {
    const dialog = this.shadowRoot.querySelector('dialog-element');
    Object.keys(info).forEach(i => {
      dialog[i] = info[i];
    });
    dialog._openDialog();
  },

  confirmAction(e) {
    if (e.detail.confirmed) this.performAction(this.action, this.items);
  },

  selectAction(e) {
    if (this.items.length) {
      const { action } = e.detail;
      this.set('action', action);
      // console.log('perform action mist-action', this.items);
      if (action.confirm && action.name !== 'tag') {
        const property = ['zone'].indexOf(this.type) === -1 ? 'name' : 'domain';
        const plural = this.items.length === 1 ? '' : 's';
        const count = this.items.length > 1 ? `${this.items.length} ` : '';
        // this.tense(this.action.name) + " " + this.type + "s can not be undone.
        this._showDialog({
          title: `${this.action.name} ${count}${this.type}${plural}?`,
          body: `You are about to ${this.action.name} ${this.items.length} ${this.type}${plural}:`,
          list: this._makeList(this.items, property),
          action: action.name,
          danger: true,
          reason: `${this.type}.${this.action.name}`,
        });
      } else if (action.name === 'tag') {
        this.$.tagsdialog._openDialog();
      } else if (action.name === 'transfer ownership') {
        this.$.ownershipdialog._openDialog();
      } else {
        this.performAction(this.action, this.items);
      }
    }
  },

  transferOwnership(e) {
    const payload = {
      user_id: e.detail.user_id, // new owner
      resources: {},
    };
    payload.resources[this.type] = this.items.map(i => {
      return i.id;
    });
    console.log('transferOwnership', e.detail, payload);
    this.$.request.url = '/api/v1/ownership';
    this.$.request.headers['Content-Type'] = 'application/json';
    this.$.request.headers['Csrf-Token'] = CSRFToken.value;
    this.$.request.method = 'POST';
    this.$.request.body = payload;
    this.$.request.generateRequest();
  },

  performAction(action) {
    if (action.name === 'delete') {
      this._delete();
    } else if (action.name === 'edit') {
      this.dispatchEvent(
        new CustomEvent('edit', { bubbles: true, composed: true })
      );
    }
  },

  handleResponse(e) {
    if (this.$.request && this.$.request.body && this.$.request.body.action)
      this.dispatchEvent(
        new CustomEvent('toast', {
          bubbles: true,
          composed: true,
          detail: {
            msg: `Action: ${this.$.request.body.action} successful`,
            duration: 3000,
          },
        })
      );
    if (
      e.detail.xhr.responseURL.endsWith('api/v1/ownership') &&
      e.detail.xhr.status === 200
    ) {
      this.$.ownershipdialog._closeDialog();
      this.dispatchEvent(
        new CustomEvent('action-finished', { bubbles: true, composed: true })
      );
      this.dispatchEvent(
        new CustomEvent('toast', {
          bubbles: true,
          composed: true,
          detail: {
            msg: 'Successful ownership transfer',
            duration: 3000,
          },
        })
      );
    }
  },

  _mapPolicyToActions() {
    // recompute the actions array property as the intersection
    // of the available actions of the selected items
    this.set('actions', []);
    let actions = new Set();
    let isection = new Set();
    let multiActions = [];
    if (this.items.length > 0) {
      actions = new Set(this.itemActions(this.items[0]) || []);

      for (let i = 1; i < this.items.length; i++) {
        isection = intersection(actions, this.itemActions(this.items[i]));
        actions = new Set(isection);
      }
      if (this.items.length > 1) {
        multiActions = this.actionDetails(Array.from(actions)).filter(a => {
          return a.multi;
        });
      } else {
        multiActions = this.actionDetails(Array.from(actions));
      }
    }
    this.set('actions', multiActions);
  },

  handleError(e) {
    // console.log(e.detail.request.xhr.statusText);
    this.dispatchEvent(
      new CustomEvent('toast', {
        bubbles: true,
        composed: true,
        detail: {
          msg: `Error: ${e.detail.request.xhr.status} ${e.detail.request.xhr.statusText}`,
          duration: 5000,
        },
      })
    );

    if (e.detail.request.xhr.responseURL.endsWith('api/v1/ownership')) {
      this.$.ownershipdialog._closeDialog();
    }
  },

  _makeList(items, property) {
    if (items && items.length)
      return items.map(item => {
        return item[property];
      });
    return [];
  },
});
