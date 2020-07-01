import '../../../../@polymer/polymer/polymer-legacy.js';
import '../../../../@polymer/paper-dialog/paper-dialog.js';
import '../../../../@polymer/paper-input/paper-input.js';
import '../../../../@polymer/paper-input/paper-input-error.js';
import '../../../../@polymer/paper-input/paper-textarea.js';
import '../../../../@polymer/iron-ajax/iron-ajax.js';
import '../../../../mist-list/mist-list-actions.js';
import '../../../../mist-list/mist-list-actions-behavior.js';
import '../tags/tags-form.js';
import { Polymer } from '../../../../@polymer/polymer/lib/legacy/polymer-fn.js';
import { html } from '../../../../@polymer/polymer/lib/utils/html-tag.js';
IMAGE_ACTIONS = {
  /*'tag': {
    'name': 'tag',
    'icon': 'label',
    'confirm': true,
    'multi': true
  },*/
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

  attached: function() {
    this.$.request.headers["Content-Type"] = 'application/json';
    this.$.request.method = "POST";
  },

  _createMachine: function (e) {
    // console.log('_createMachine', e.detail);
    this.dispatchEvent(new CustomEvent("go-to", { bubbles: true, composed: true, detail:  {
        url: '/machines/+create',
        params: {
            cloud: e.detail.cloud,
            image: e.detail.image
        }
    } }))
  },

  itemActions: function(image) {
    var arr = [];
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

  actionDetails: function (actions) {
    var ret = [];
    for (var i=0; i<actions.length; i++) {
        ret.push(IMAGE_ACTIONS[actions[i]]);
    }
    return ret;
  },

  confirmAction: function(e){
    if (e.detail.confirmed)
      this.performAction(this.action, this.items);
  },

  selectAction: function(e){
    if (this.items.length) {
      var action = e.detail.action;
      this.set('action', action);
      // console.log('perform action mist-action', this.items);
      if (action.confirm && action.name != 'tag') {
        var property = ['zone'].indexOf(this.type) == -1 ? "name" : "domain",
            plural = this.items.length == 1 ? '' : 's',
            count = this.items.length > 1 ? this.items.length+' ' : '';
        //this.tense(this.action.name) + " " + this.type + "s can not be undone. 
        this._showDialog({
            title: this.action.name + ' ' + count + this.type + plural+'?',
            body: "You are about to " + this.action.name + " " + this.items.length + " " + this.type + plural+".",
            list: this._makeList(this.items, property),
            action: action.name,
            danger: true,
            reason: this.type + "." + this.action.name
        });
      }
      if (action.name == 'unstar') {
        this._star('Unstar');
      }
      else if (action.name == 'star') {
        this._star('Star');
      }
      else if (action.name == "tag") {
        this.$.tagsdialog._openDialog();
      }
      else if (action.name == "create machine") {
        // single image only
        this.dispatchEvent(new CustomEvent('create_machine', { bubbles: true, composed: true, detail: {cloud: this.items[0].cloud.id, image: this.items[0].id} }));

      }
    }
  },

  _star: function(action){
    for (var i = 0; i < this.items.length; i++) {
      var item = this.items[i];
      this.$.request.url = '/api/v1/clouds/'+item.cloud.id+'/images/'+item.id;
      this.$.request.headers["Csrf-Token"] = CSRF_TOKEN;
      this.$.request.generateRequest();
    }
    this.dispatchEvent(new CustomEvent('toast', { bubbles: true, composed: true, detail:  {msg: action+' request sent.', duration: 1000} }));
  },

  _showDialog: function(info) {
      var dialog = this.shadowRoot.querySelector('dialog-element');
      if (info) {
        for (var i in info) {
            dialog[i] = info[i];
        }
      }
      dialog._openDialog();
  },

  handleResponse: function(e) {
    this.dispatchEvent(new CustomEvent('toast', { bubbles: true, composed: true, detail:  {msg: 'Successfully '+this.action.name+'ed image.', duration: 3000} }));
    this.dispatchEvent(new CustomEvent('action-finished'));



  },

  _mapPolicyToActions: function (items) {
    // recompute the actions array property as the intersection
    // of the available actions of the selected items
    this.set('actions', []);
    var actions = new swiftSet.Set(), 
        isection = new swiftSet.Set();

    if (this.items.length > 0) {
      actions.addItems(this.itemActions(this.items[0]) || []);

      for (var i=1; i<this.items.length; i++) {
          isection.clear()
          isection.addItems(actions.intersection(this.itemActions(this.items[i])));
          actions.clear();
          actions.addItems(isection.items());
      }

      var multiActions;

      if (this.items.length > 1) {
          multiActions = this.actionDetails(actions.items()).filter(function(a){
              return a.multi;
          });
      }
      else {
          multiActions = this.actionDetails(actions.items());
      }
    }
    this.set('actions', multiActions);
  },

  handleError: function(e) {
    // console.log(e.detail.request.xhr.statusText);
    this.dispatchEvent(new CustomEvent('toast', { bubbles: true, composed: true, detail: {msg: 'Error: ' + e.detail.request.xhr.status +" "+ e.detail.request.xhr.statusText, duration: 5000} }));

  },

  _makeList: function(items, property){
    if (items && items.length)
      return items.map(function(item){
        return item[property];
      });
  }
});
