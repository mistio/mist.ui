import '../../node_modules/@polymer/polymer/polymer-legacy.js';
import '../../node_modules/@polymer/paper-dialog/paper-dialog.js';
import '../../node_modules/@polymer/paper-input/paper-input.js';
import '../../node_modules/@polymer/paper-input/paper-input-error.js';
import '../../node_modules/@polymer/paper-input/paper-textarea.js';
import '../../node_modules/@polymer/iron-ajax/iron-ajax.js';
import '../../node_modules/@mistio/mist-list/mist-list-actions.js';
import '../../node_modules/@mistio/mist-list/mist-list-actions-behavior.js';
import '../helpers/transfer-ownership.js';
import '../tags/tags-form.js';
import './schedule-edit.js';
import './schedule-edit-mrc.js';
import './schedule-edit-selector.js';
import './schedule-edit-task.js';
import moment from 'moment/src/moment';
import { CSRFToken, intersection } from '../helpers/utils.js';
import { Polymer } from '../../node_modules/@polymer/polymer/lib/legacy/polymer-fn.js';
import { html } from '../../node_modules/@polymer/polymer/lib/utils/html-tag.js';

const SCHEDULE_ACTIONS = {
  run: {
    name: 'run',
    icon: 'av:play-arrow',
    confirm: false,
    multi: false,
    single: true,
  },
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
      mist-list-actions {
        width: 100%;
      }
    </style>

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
    <dialog-element id="confirm"></dialog-element>
    <schedule-edit
      id="editScheduleDialog"
      schedule="[[items.0]]"
      model="[[model]]"
    ></schedule-edit>
    <schedule-edit-mrc
      id="editMaxRunCount"
      schedule="[[items.0]]"
    ></schedule-edit-mrc>
    <schedule-edit-task
      id="editScheduleTask"
      schedule="[[items.0]]"
      scripts="[[model.scriptsArray]]"
    ></schedule-edit-task>
    <schedule-edit-selector
      id="editScheduleSelector"
      schedule="[[items.0]]"
      model="[[model]]"
      machines-age="[[machineAge]]"
      machines-cost="[[machinesCost]]"
      currency="[[currency]]"
    ></schedule-edit-selector>

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

  is: 'schedule-actions',

  properties: {
    user: {
      type: String,
    },
    members: {
      type: Array,
    },
    org: {
      type: Object,
    },
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
      value: 'schedule',
    },
    inSingleView: {
      type: Boolean,
      reflectToAttribute: true,
    },
    machinesCost: {
      type: Number,
    },
    currency: {
      type: Object,
    },
  },

  observers: ['_mapPolicyToActions(items.*,user,org)'],

  listeners: {
    // 'confirmation': 'confirmAction',
    'transfer-ownership': 'transferOwnership',
    confirmation: '_actionConfirmed',
    'select-action': 'selectAction',
  },

  attached() {
    this.$.request.headers['Content-Type'] = 'application/json';
    this.$.request.headers['Csrf-Token'] = CSRFToken.value;
    this.$.request.method = 'POST';
  },

  itemActions(schedule) {
    // single schedule actions
    const arr = [];
    if (schedule) {
      if (this.inSingleView) {
        arr.push('run');
        if (!this._hasExpired(schedule.expires)) arr.push('edit');
      }
      arr.push('tag');
      if (
        this.org.ownership_enabled &&
        (schedule.owned_by === this.user || this.org.is_owner)
      ) {
        arr.push('transfer-ownership');
      }
      arr.push('delete');
    }
    return arr;
  },

  _hasExpired(expirydate) {
    if (
      expirydate !== undefined &&
      expirydate !== '' &&
      expirydate.length > 0
    ) {
      return moment().diff(moment.utc(expirydate).local()) > 0;
    }

    return false;
  },

  actionDetails(actions) {
    const ret = [];
    for (let i = 0; i < actions.length; i++) {
      ret.push(SCHEDULE_ACTIONS[actions[i]]);
    }
    return ret;
  },

  _otherMembers(members, _items) {
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

  _delete(items) {
    // set up iron ajax
    this.$.request.headers['Content-Type'] = 'application/json';
    this.$.request.headers['Csrf-Token'] = CSRFToken.value;
    this.$.request.method = 'DELETE';

    for (let i = 0; i < items.length; i++) {
      this.$.request.url = `/api/v1/schedules/${items[i].id}`;
      this.$.request.generateRequest();
      this.dispatchEvent(
        new CustomEvent('toast', {
          bubbles: true,
          composed: true,
          detail: { msg: `Deleting ${items[i].name}`, duration: 1000 },
        })
      );
    }
  },

  _showDialog(info) {
    const dialog = this.shadowRoot.querySelector('dialog-element');
    Object.keys(info || {}).forEach(i => {
      dialog[i] = info[i];
    });
    dialog._openDialog();
  },

  confirmAction(e) {
    if (e.detail.confirmed) {
      this.performAction(this.action, this.items);
    }
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
      } else if (action.name === 'edit') {
        this._editSchedule();
      } else if (action.name === 'run') {
        this._runOnceDialog();
      } else if (action.name === 'transfer ownership') {
        this.$.ownershipdialog._openDialog();
      } else {
        this.performAction(this.action, this.items);
      }
    }
  },

  performAction(action, items) {
    if (action.name === 'delete') {
      this._delete(items);
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

  handleResponse(e) {
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
    } else if (
      this.$.request &&
      this.$.request.body &&
      !this.$.request.body.action
    ) {
      this.dispatchEvent(
        new CustomEvent('toast', {
          bubbles: true,
          composed: true,
          detail: {
            msg: 'Successfully sent request to run once now.',
            duration: 3000,
          },
        })
      );
    } else if (this.$.request && this.$.request.method === 'DELETE') {
      this.dispatchEvent(
        new CustomEvent('go-to', {
          bubbles: true,
          composed: true,
          detail: { url: '/schedules' },
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

  _mapPolicyToActions(_items) {
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

  _editSchedule(_e) {
    this.$.editScheduleDialog._openEditScheduleModal();
  },

  _runOnceDialog(_e) {
    this._showDialog({
      title: 'Run once now?',
      body: 'The schedule will execute once and then continue as planned.',
      danger: false,
      reason: 'schedule.run',
      action: 'run',
    });
  },

  _makeList(items, property) {
    if (items && items.length)
      return items.map(item => {
        return item[property];
      });
    return [];
  },

  _actionConfirmed(e) {
    console.log('_actionConfirmed', this.items, e);
    const { reason } = e.detail;
    const { response } = e.detail;
    if (response === 'confirm' && reason === 'schedule.delete') {
      this._delete(this.items);
      window.location = '/schedules';
    }
    if (
      response === 'confirm' &&
      reason === 'schedule.run' &&
      this.items.length === 1
    ) {
      this.$.request.url = `/api/v1/schedules/${this.items[0].id}`;
      this.$.request.method = 'PATCH';
      this.$.request.body = { run_immediately: true };
      this.$.request.headers['Content-Type'] = 'application/json';
      this.$.request.headers['Csrf-Token'] = CSRFToken.value;
      this.$.request.generateRequest();
    }
  },
});
