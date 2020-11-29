import '../../node_modules/@polymer/polymer/polymer-legacy.js';
import '../../node_modules/@polymer/paper-dialog/paper-dialog.js';
import '../../node_modules/@polymer/paper-input/paper-input.js';
import '../../node_modules/@polymer/paper-input/paper-input-error.js';
import '../../node_modules/@polymer/paper-input/paper-textarea.js';
import '../../node_modules/@polymer/iron-ajax/iron-ajax.js';
import { MistListActionsBehavior } from '../../node_modules/@mistio/mist-list/mist-list-actions-behavior.js';
import '../../node_modules/@mistio/mist-list/mist-list-actions.js';
import { CSRFToken } from '../helpers/utils.js'
import { Polymer } from '../../node_modules/@polymer/polymer/lib/legacy/polymer-fn.js';
import { html } from '../../node_modules/@polymer/polymer/lib/utils/html-tag.js';

const OTHER_CLOUD_MACHINE_ACTIONS = {
  'remove': {
    'name': 'remove',
    'icon': 'remove',
    'confirm': true,
    'multi': true
  }
};

Polymer({
  _template: html`
    <style include="shared-styles">
      :host {
        display: inline;
        color: rgba(255,255,255,0.87);
      }
    </style>
    <dialog-element id="other-confirm"></dialog-element>
    <iron-ajax id="request" handle-as="json" loading="{{loadingData}}" on-response="handleResponse" on-error="handleError"></iron-ajax>
    <slot>
        <mist-list-actions actions="[[actions]]"></mist-list-actions>
    </slot>
`,

  is: 'other-cloud-machine-actions',
  behaviors: [MistListActionsBehavior],

  properties: {
    items: {
      type: Array,
      value () { return [] },
    },
    actions: {
      type: Array,
      value () { return [] },
      notify: true
    },
    type: {
      type: String,
      value: 'host'
    }
  },

  listeners: {
    'confirmation': 'confirmAction',
    'select-action': 'selectAction',
  },

  attached() {
    this.$.request.headers["Content-Type"] = 'application/json';
    this.$.request.headers["Csrf-Token"] = CSRFToken.value;
    this.$.request.method = "POST";
  },

  computeItemActions(machine) {
    // single record actions
    const arr = [];
    if (machine) {
      arr.push('remove');
    }
    return arr;
  },

  computeActionListDetails (actions) {
    const ret = [];
    for (let i=0; i<actions.length; i++) {
        ret.push(OTHER_CLOUD_MACHINE_ACTIONS[actions[i]]);
    }
    return ret;
  },

  _remove() {
    // set up iron ajax
    this.$.request.headers["Content-Type"] = 'application/json';
    this.$.request.headers["Csrf-Token"] = CSRFToken.value;
    this.$.request.method = "POST";
    const payload = {'action': 'remove'};
    this.$.request.body = payload;

    for (let i = 0; i < this.items.length; i++) {
      this.$.request.url = `/api/v1/machines/${this.items[i].id}`
      this.$.request.generateRequest();
      this.dispatchEvent(new CustomEvent('toast', { bubbles: true, composed: true, detail:  {msg: `Removing ${  this.items[i].name}` , duration: 1000} }));
    }
  },

  _showDialog(info) {
      const dialog = this.shadowRoot.querySelector('dialog-element#other-confirm');
      if (info) {
        Object.keys(info || {}).forEach((i) => {
          dialog[i] = info[i];
          });
      }
      dialog._openDialog();
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
        const property = ['machine'].indexOf(this.type) === -1 ? "name" : "domain";
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
      } else {
        this.performAction(this.action, this.items);
      }
    }
  },

  performAction(action) {
    // console.log('perform action ',action)
    if (action && action.name === 'remove') {
      this._remove();
    }
  },

  handleResponse() {
    if (this.$.request && this.$.request.body && this.$.request.body.action)
      this.dispatchEvent(new CustomEvent('toast', { bubbles: true, composed: true, detail:  {msg: `Action: ${this.$.request.body.action} successful`, duration: 3000} }));
  },

  handleError(e) {
    // console.log(e.detail.request.xhr.statusText);
    this.dispatchEvent(new CustomEvent('toast', { bubbles: true, composed: true, detail: {msg: `Error: ${  e.detail.request.xhr.status } ${ e.detail.request.xhr.statusText}`, duration: 5000} }));

  },

  _makeList(items, property){
    return items && items.length && items.map(item => item[property]);
  }
});
