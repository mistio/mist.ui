import '../../node_modules/@polymer/polymer/polymer-legacy.js';
import '../../node_modules/@polymer/paper-dialog/paper-dialog.js';
import '../../node_modules/@polymer/paper-input/paper-input.js';
import '../../node_modules/@polymer/paper-input/paper-input-error.js';
import '../../node_modules/@polymer/paper-input/paper-textarea.js';
import '../../node_modules/@polymer/iron-ajax/iron-ajax.js';
import '../../node_modules/@mistio/mist-list/mist-list-actions.js';
import '../../node_modules/@mistio/mist-list/mist-list-actions-behavior.js';
import '../tags/tags-form.js';
import { CSRFToken, intersection } from '../helpers/utils.js'
import { Polymer } from '../../node_modules/@polymer/polymer/lib/legacy/polymer-fn.js';
import { html } from '../../node_modules/@polymer/polymer/lib/utils/html-tag.js';

const IMAGE_ACTIONS = {
  /* 'tag': {
    'name': 'tag',
    'icon': 'label',
    'confirm': true,
    'multi': true
  }, */
  'create_machine': {
    'name': 'create machine',
    'icon': 'hardware:computer',
    'confirm': false,
    'multi': false
  },
  'star': {
    'name': 'star',
    'icon': 'star',
    'confirm': false,
    'multi': true
  },
  'unstar': {
    'name': 'unstar',
    'icon': 'star-border',
    'confirm': false,
    'multi': true
  }
}
Polymer({
  _template: html`
    <style include="shared-styles">
      :host {
        min-width: 50%;
      }
      mist-list-actions {
        width: 100%;
      }
    </style>
    <dialog-element id="confirm"></dialog-element>
    <slot>
        <mist-list-actions actions="[[actions]]"></mist-list-actions>
    </slot>
    <iron-ajax id="request" handle-as="xml" loading="{{loadingData}}" on-response="handleResponse" on-error="handleError"></iron-ajax>
`,

  is: 'image-actions',

  properties: {
    items: {
      type: Array,
      value: []
    },
    actions: {
      type: Array,
      notify: true
    },
    type: {
      type: String,
      value: 'image'
    }
  },

  observers:[
    '_mapPolicyToActions(items.*)'
  ],

  listeners: {
    'confirmation': 'confirmAction',
    'select-action': 'selectAction',
    'create_machine': '_createMachine'
  },

  attached() {
    this.$.request.headers["Content-Type"] = 'application/json';
    this.$.request.method = "POST";
  },

  _createMachine (e) {
    // console.log('_createMachine', e.detail);
    this.dispatchEvent(new CustomEvent("go-to", { bubbles: true, composed: true, detail:  {
        url: '/machines/+create',
        params: {
            cloud: e.detail.cloud,
            image: e.detail.image
        }
    } }))
  },

  itemActions(image) {
    const arr = [];
    if (image && image.starred) {
      arr.push('unstar');
    }
    if (image && !image.starred) {
      arr.push('star');
    }
    if (image) {
      arr.push('create_machine');
      // arr.push('tag');
    }
    return arr;
  },

  actionDetails (actions) {
    const ret = [];
    for (let i=0; i<actions.length; i++) {
        ret.push(IMAGE_ACTIONS[actions[i]]);
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
      if (action.name === 'unstar') {
        this._star('Unstar');
      }
      else if (action.name === 'star') {
        this._star('Star');
      }
      else if (action.name === "tag") {
        this.$.tagsdialog._openDialog();
      }
      else if (action.name === "create machine") {
        // single image only
        this.dispatchEvent(new CustomEvent('create_machine', { bubbles: true, composed: true, detail: {cloud: this.items[0].cloud.id, image: this.items[0].id} }));

      }
    }
  },

  _star(action){
    for (let i = 0; i < this.items.length; i++) {
      const item = this.items[i];
      this.$.request.url = `/api/v1/clouds/${item.cloud.id}/images/${item.id}`;
      this.$.request.headers["Csrf-Token"] = CSRFToken.value;
      this.$.request.generateRequest();
    }
    this.dispatchEvent(new CustomEvent('toast', { bubbles: true, composed: true, detail:  {msg: `${action} request sent.`, duration: 1000} }));
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

  handleResponse() {
    this.dispatchEvent(new CustomEvent('toast', { bubbles: true, composed: true, detail:  {msg: `Successfully ${this.action.name}ed image.`, duration: 3000} }));
    this.dispatchEvent(new CustomEvent('action-finished'));



  },

  _mapPolicyToActions () {
    // recompute the actions array property as the intersection
    // of the available actions of the selected items
    this.set('actions', []);
    let actions = new Set();
    let isection = new Set();
    let multiActions = [];
    if (this.items.length > 0) {
      actions= new Set(this.itemActions(this.items[0]) || []);

      for (let i=1; i<this.items.length; i++) {
          isection = intersection(actions, this.itemActions(this.items[i]));
          actions= new Set(isection);
      }

      if (this.items.length > 1) {
          multiActions = this.actionDetails(Array.from(actions)).filter(a => a.multi);
      }
      else {
          multiActions = this.actionDetails(Array.from(actions));
      }
    }
    this.set('actions', multiActions);
  },

  handleError(e) {
    // console.log(e.detail.request.xhr.statusText);
    this.dispatchEvent(new CustomEvent('toast', { bubbles: true, composed: true, detail: {msg: `Error: ${  e.detail.request.xhr.status } ${ e.detail.request.xhr.statusText}`, duration: 5000} }));

  },

  _makeList(items, property){
    return items && items.length && items.map(item => item[property]);
  }

});
