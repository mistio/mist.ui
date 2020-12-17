import '../../node_modules/@polymer/polymer/polymer-legacy.js';
import '../../node_modules/@polymer/iron-icons/iron-icons.js';
import '../../node_modules/@polymer/paper-dialog/paper-dialog.js';
import '../../node_modules/@polymer/paper-input/paper-input.js';
import '../../node_modules/@polymer/paper-input/paper-input-error.js';
import '../../node_modules/@polymer/paper-input/paper-textarea.js';
import '../../node_modules/@polymer/iron-ajax/iron-ajax.js';
import '../../node_modules/@mistio/mist-list/mist-list-actions.js';
import '../../node_modules/@mistio/mist-list/mist-list-actions-behavior.js';
import '../helpers/transfer-ownership.js';
import '../tags/tags-form.js';
import './attach-volume.js';
import './detach-volume.js';
import { CSRFToken, intersection } from '../helpers/utils.js';
import { VOLUME_CREATE_FIELDS } from '../helpers/volume-create-fields.js';
import { Polymer } from '../../node_modules/@polymer/polymer/lib/legacy/polymer-fn.js';
import { html } from '../../node_modules/@polymer/polymer/lib/utils/html-tag.js';

const VOLUME_ACTIONS = {
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
  attach: {
    name: 'attach',
    icon: 'icons:attachment',
    confirm: false,
    multi: false,
    single: true,
  },
  detach: {
    name: 'detach',
    icon: 'icons:eject',
    confirm: false,
    multi: false,
    single: true,
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
        width: 50%;
      }
      mist-list-actions {
        width: 100%;
      }
    </style>

    <dialog-element id="confirm"></dialog-element>
    <tags-form
      id="tagsdialog"
      model="[[model]]"
      items="[[items]]"
      type="[[type]]"
    ></tags-form>
    <transfer-ownership
      id="ownershipdialog"
      user="[[user]]"
      members="[[_otherMembers(members,items.length)]]"
      items="[[items]]"
      type="[[type]]"
    ></transfer-ownership>
    <attach-volume
      id="attachVolume"
      items="[[items]]"
      provider="[[provider]]"
      machines="[[machinesToAttachTo]]"
    ></attach-volume>
    <detach-volume
      id="detachVolume"
      items="[[items]]"
      machines="[[machines]]"
    ></detach-volume>
    <iron-ajax
      id="request"
      handle-as="json"
      loading="{{loadingData}}"
      on-response="handleResponse"
      on-error="handleError"
    ></iron-ajax>
    <slot>
      <mist-list-actions actions="[[actions]]"></mist-list-actions>
    </slot>
  `,

  is: 'volume-actions',

  properties: {
    items: {
      type: Array,
      value() {
        return [];
      },
    },
    machines: {
      type: Array,
      value() {
        return [];
      },
    },
    machinesToAttachTo: {
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
    provider: String,
    type: {
      type: String,
      value: 'volume',
    },
    inSingleView: {
      type: Boolean,
      reflectToAttribute: true,
    },
    members: {
      type: Array,
    },
    user: {
      type: String,
    },
    org: {
      type: Object,
    },
  },

  observers: ['_mapPolicyToActions(items.*,org,user, machines.*)'],

  listeners: {
    'select-action': 'selectAction',
    confirmation: 'confirmAction',
    'transfer-ownership': 'transferOwnership',
  },

  ready() {},

  attached() {
    this.$.request.headers['Content-Type'] = 'application/json';
    this.$.request.headers['Csrf-Token'] = CSRFToken.value;
    this.$.request.method = 'POST';
  },

  itemActions(volume) {
    const arr = [];
    if (volume) {
      if (volume.actions.tag) {
        arr.push('tag');
      }
      if (
        this.inSingleView &&
        VOLUME_CREATE_FIELDS.map(i => i.provider).indexOf(this.provider) > -1
      ) {
        if (volume.actions.attach) {
          arr.push('attach');
        }
        if (volume.actions.detach) {
          arr.push('detach');
        }
      }
      if (volume.actions.delete) {
        arr.push('delete');
      }
      if (
        this.org.ownership_enabled &&
        (volume.owned_by === this.user || this.org.is_owner)
      ) {
        arr.push('transfer-ownership');
      }
    }
    return arr;
  },

  actionDetails(actions) {
    const ret = [];
    for (let i = 0; i < actions.length; i++) {
      ret.push(VOLUME_ACTIONS[actions[i]]);
    }
    return ret;
  },

  _otherMembers(members) {
    if (this.items && members) {
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
      this.$.request.url = `/api/v1/clouds/${this.items[i].cloud}/volumes/${this.items[i].external_id}`;
      this.$.request.generateRequest();
      this.dispatchEvent(
        new CustomEvent('toast', {
          bubbles: true,
          composed: true,
          detail: {
            msg: `Deleting ${this.items[i].name}`,
            duration: 1000,
          },
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
      } else if (action.name === 'transfer ownership') {
        this.$.ownershipdialog._openDialog();
      } else if (action.name === 'tag') {
        this.$.tagsdialog._openDialog();
      } else if (action.name === 'attach') {
        this.$.attachVolume._openDialog();
      } else if (action.name === 'detach') {
        this.$.detachVolume._openDialog();
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
    }
  },

  handleResponse(e) {
    // console.log('on-response', e, this.$.request, this.$.request.body)
    if (this.$.request && this.$.request.body && this.$.request.body.action) {
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
    }
    if (
      e.target &&
      e.target.__data__ &&
      e.target.__data__.method === 'DELETE'
    ) {
      this.dispatchEvent(
        new CustomEvent('go-to', {
          bubbles: true,
          composed: true,
          detail: { url: '/volumes' },
        })
      );
    }
    if (
      e.detail.xhr.responseURL.endsWith('api/v1/ownership') &&
      e.detail.xhr.status === 200
    ) {
      this.$.ownershipdialog._closeDialog();
      this.dispatchEvent(new CustomEvent('action-finished'));
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

  _mapPolicyToActions(items, org, user) {
    // recompute the actions array property as the intersection
    // of the available actions of the selected items
    if (items && org && user) {
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
        console.log('_mapPolicyToActions', multiActions);
      }
      this.set('actions', multiActions);
    }
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
