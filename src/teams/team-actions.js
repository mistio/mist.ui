import '../../node_modules/@polymer/polymer/polymer-legacy.js';
import '../../node_modules/@polymer/paper-dialog/paper-dialog.js';
import '../../node_modules/@polymer/paper-input/paper-input.js';
import '../../node_modules/@polymer/paper-input/paper-input-error.js';
import '../../node_modules/@polymer/paper-input/paper-textarea.js';
import '../../node_modules/@polymer/iron-ajax/iron-ajax.js';
import '../../node_modules/@mistio/mist-list/mist-list-actions.js';
import { MistListActionsBehavior } from '../../node_modules/@mistio/mist-list/mist-list-actions-behavior.js';
import './team-actions.js';
import './team-edit.js';
import './team-policy.js';
import { CSRFToken, intersection } from '../helpers/utils.js';
import { Polymer } from '../../node_modules/@polymer/polymer/lib/legacy/polymer-fn.js';
import { html } from '../../node_modules/@polymer/polymer/lib/utils/html-tag.js';
const TEAM_ACTIONS = {
    'edit': {
        'name': 'edit',
        'icon': 'editor:mode-edit',
        'confirm': false,
        'multi': false
    },
    'invite': {
        'name': 'invite',
        'icon': 'social:person-add',
        'confirm': false,
        'multi': false
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
                fill: #fff;
            }
    </style>
        <tags-form id="tagsdialog" model="[[model]]" items="[[items]]" type="[[type]]"></tags-form>
        <dialog-element id="confirm"></dialog-element>
        <iron-ajax id="request" handle-as="json" loading="{{loadingData}}" on-response="handleResponse" on-error="handleError"></iron-ajax>
        <team-edit team="[[_computeTeam(items.length,items.splices)]]" org="[[org]]"></team-edit>
        <slot>
            <mist-list-actions actions="[[actions]]"></mist-list-actions>
        </slot>
`,

  is: 'team-actions',

  behaviors: [
      MistListActionsBehavior
  ],

  properties: {
      items: {
          type: Array
      },
      actions: {
          type: Array,
          value: function(){
              return [];
          },
          notify: true
      },
      type: {
          type: String,
          value: 'team'
      },
      org: {
          type: String
      }
  },

  observers: [
      '_updateActions(items.*)'
  ],

  listeners: {
      'confirmation': 'confirmAction',
      'select-action': 'selectAction'
  },

  ready: function() {},

  attached: function() {
      this.$.request.headers["Content-Type"] = 'application/json';
      this.$.request.headers["Csrf-Token"] = CSRFToken.value;
      this.$.request.method = "POST";
  },

  computeItemActions: function(team) {
      // org policy for actions
      var arr = [];
      if (team) {
          arr.push('invite');
          if (team.name != 'Owners') {
              arr.push('edit');
              arr.push('delete');
          }
      }
      return arr;
  },

  computeActionListDetails: function(actions) {
      var ret = [];
      for (var i = 0; i < actions.length; i++) {
          ret.push(TEAM_ACTIONS[actions[i]]);
      }
      return ret;
  },

  _delete: function() {
      //set up iron ajax
      this.$.request.headers["Content-Type"] = 'application/json';
      this.$.request.headers["Csrf-Token"] = CSRFToken.value;
      this.$.request.method = "DELETE";

      for (var i = 0; i < this.items.length; i++) {
          this.$.request.url = "/api/v1/org/" + this.org + "/teams/" + this.items[i].id
          this.$.request.generateRequest();
          this.dispatchEvent(new CustomEvent('toast', { bubbles: true, composed: true, detail:  { msg: 'Deleting ' + this.items[i].name, duration: 1000 } }));
      }
  },

  _showDialog: function(info) {
      var dialog = this.shadowRoot.querySelector('dialog-element');
      for (var i in info) {
          dialog[i] = info[i];
      }
      dialog._openDialog();
  },

  confirmAction: function(e) {
      if (e.detail.confirmed)
          this.performAction(this.action, this.items);
  },

  selectAction: function(e) {
      if (this.items.length) {
          var action = e.detail.action;
          this.set('action', action);
          // console.log('perform action mist-action', this.items);
          if (action.confirm && action.name != 'tag') {
              var property = ['zone'].indexOf(this.type) == -1 ? "name" : "domain",
                  plural = this.items.length == 1 ? '' : 's',
                  count = this.items.length > 1 ? this.items.length + ' ' : '';
              //this.tense(this.action.name) + " " + this.type + "s can not be undone. 
              this._showDialog({
                  title: this.action.name + ' ' + count + this.type + plural + '?',
                  body: "You are about to " + this.action.name + " " + this.items.length + " " + this.type + plural + ".",
                  list: this._makeList(this.items, property),
                  action: action.name,
                  danger: true,
                  reason: this.type + "." + this.action.name
              });
          } else if (action.name == "tag") {
              this.$.tagsdialog._openDialog();
          } else {
              this.performAction(this.action, this.items);
          }
      }
  },

  performAction: function(action, items) {
      if (action.name == 'delete') {
          this._delete();
      } else if (action.name == 'edit') {
          this._edit();
      } else if (action.name == 'invite') {
          this._invite();
      }
  },

  handleResponse: function(e) {
      if (this.$.request && this.$.request.body && this.$.request.body.action)
          this.dispatchEvent(new CustomEvent('toast', { bubbles: true, composed: true, detail:  { msg: 'Action: ' + this.$.request.body.action + ' successfull', duration: 3000 } }));
  },

  _mapPolicyToActions: function(items) {
      // recompute the actions array property as the intersection
      // of the available actions of the selected items
      this.set('actions', []);
      var actions = new Set(),
          isection = new Set();

      if (this.items.length > 0) {
          console.log(this.items[0], this.items.length);
          actions = new Set(this.itemActions(this.items[0]) || []);

          for (var i = 1; i < this.items.length; i++) {
              isection = intersection(actions, this.itemActions(this.items[i]));
              actions = new Set(isection);
          }

          var multiActions;

          if (this.items.length > 1) {
              multiActions = this.actionDetails(Array.from(actions)).filter(function(a) {
                  return a.multi;
              });
          } else {
              multiActions = this.actionDetails(Array.from(actions));
          }
      }
      this.set('actions', multiActions);
  },

  handleError: function(e) {
      console.log(e.detail.request.xhr.statusText);
      this.dispatchEvent(new CustomEvent('toast', { bubbles: true, composed: true, detail: { msg: 'Error: ' + e.detail.request.xhr.status + " " + e.detail.request.xhr.statusText, duration: 5000 } }));
  },

  _makeList: function(items, property) {
      if (items && items.length)
          return items.map(function(item) {
              return item[property];
          });
  },

  _invite: function(e) {
      var that = this;
      this.dispatchEvent(new CustomEvent('go-to', { bubbles: true, composed: true, detail: { url: '/teams/' + that.items[0].id  +'/+add'} }));
  },

  _edit: function(e) {
      var el = this.shadowRoot.querySelector('team-edit');
      el._openEditTeamModal();
  },

  _computeTeam: function(items) {
      return this.items && this.items[0];
  }
});
