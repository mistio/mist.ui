import '@polymer/polymer/polymer-legacy.js';
import '@polymer/paper-dialog/paper-dialog.js';
import '@polymer/paper-input/paper-input.js';
import '@polymer/paper-input/paper-input-error.js';
import '@polymer/paper-input/paper-textarea.js';
import '@polymer/iron-ajax/iron-ajax.js';
import '@mistio/mist-list/mist-list-actions.js';
import { MistListActionsBehavior } from '@mistio/mist-list/mist-list-actions-behavior.js';
import '../tags/tags-form.js';
import '../helpers/dialog-element.js';
import { CSRFToken } from '../helpers/utils.js';
import { Polymer } from '@polymer/polymer/lib/legacy/polymer-fn.js';
import { html } from '@polymer/polymer/lib/utils/html-tag.js';

const RECORD_ACTIONS = {
  /* 'tag': {
    'name': 'tag',
    'icon': 'label',
    'confirm': true,
    'multi': true
  }, */
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

    <tags-form
      id="tagsdialog"
      model="[[model]]"
      items="[[items]]"
      type="[[type]]"
    ></tags-form>
    <dialog-element id="confirm"></dialog-element>
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

  is: 'record-actions',
  behaviors: [MistListActionsBehavior],

  properties: {
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
    type: {
      type: String,
      value: 'record',
    },
  },

  listeners: {
    'select-action': 'selectAction',
    confirmation: 'confirmAction',
  },

  attached() {
    this.$.request.headers['Content-Type'] = 'application/json';
    this.$.request.headers['Csrf-Token'] = CSRFToken.value;
    this.$.request.method = 'POST';
  },

  computeItemActions(record) {
    // single record actions
    const arr = [];
    if (record) {
      // arr.push('tag');
      arr.push('delete');
    }
    return arr;
  },

  computeActionListDetails(actions) {
    const ret = [];
    for (let i = 0; i < actions.length; i++) {
      ret.push(RECORD_ACTIONS[actions[i]]);
    }
    return ret;
  },

  _delete() {
    // set up iron ajax
    this.$.request.headers['Content-Type'] = 'application/json';
    this.$.request.headers['Csrf-Token'] = CSRFToken.value;
    this.$.request.method = 'DELETE';
    for (let i = 0; i < this.items.length; i++) {
      this.$.request.url = `/api/v1/clouds/${this.cloud}/zones/${this.items[i].zone}/records/${this.items[i].id}`;
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
      } else if (action.name === 'tag') {
        this.$.tagsdialog._openDialog();
      } else {
        this.performAction(this.action, this.items);
      }
    }
  },

  performAction(action) {
    if (action.name === 'delete') {
      this._delete();
    }
  },

  handleResponse() {
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
  },

  _makeList(items, property) {
    if (items && items.length)
      return items.map(item => {
        return item[property];
      });
    return [];
  },
});
