import './secrets/secret-page.js';
import { CSRFToken } from './helpers/utils.js'
import { Polymer } from '../node_modules/@polymer/polymer/lib/legacy/polymer-fn.js';
import { html } from '../node_modules/@polymer/polymer/lib/utils/html-tag.js';

Polymer({
    _template: html`
        <style include="shared-styles">
            :host {
                display: block;
            }
        </style>
        <app-route route="{{route}}" pattern="/:secret" data="{{data}}"></app-route>

        <template is="dom-if" if="[[_isListActive(route.path)]]" restamp>
            <mist-list selectable resizable column-menu multi-sort
                id="secretsList"
                apiurl="/api/v1/secrets"
                item-map="[[secretsMap]]"
                name="Secrets"
                visible=[[_getVisibleColumns()]]
                frozen=[[_getFrozenColumn()]]
                route={{route}}
                primary-field-name="id"
                renderers=[[_getRenderers()]]
                filter-method="[[_ownerFilter()]]"
                actions="[[actions]]">
                <p slot="no-items-found">No secrets found.</p>
            </mist-list>
        </template>
        <secret-page secret="[[_getSecret(data.secret)]]" resource-id="[[data.secret]]"
        section="[[model.sections.secrets]]" hidden$=[[!_isDetailsPageActive(route.path)]]></secret-page>
        <iron-ajax id="getSecrets" contenttype="application/json" handle-as="json" method="GET" on-request="_handleGetSecretsRequest" on-response="_handleGetSecretsResponse" on-error="_handleGetSecretsError"></iron-ajax>
    `,
    is: 'page-secrets',
    behaviors: [
    ],

    properties: {
        model: {
            type: Object
        },
        secrets: {
            type: Array,
            value: []
        },
        actions: {
            type: Array,
            value: []
        },
        secretsMap: {
            type: Object,
            value: {}
        }
    },
    ready(){
        console.log("Yo, ready!");
        this._getSecrets();
    },
    _getSecrets(){
      this.$.getSecrets.headers["Content-Type"] = 'application/json';
      this.$.getSecrets.headers["Csrf-Token"] = CSRFToken.value;
      this.$.getSecrets.url = `/api/v1/secrets`;
      this.$.getSecrets.generateRequest();
    },

  _handleGetSecretsRequest(_e){
      console.log("IT IS COMING");
  },

  _handleGetSecretsResponse(e){
      e.detail.response.forEach((item) => {
          this.secrets.push(item);
          this.secretsMap[item.id] = item;
      });
  },
  _handleGetSecretsError(e) {
      console.log("WE GOT ERROR", e);
  },

  _getFrozenColumn() {
      return ['name'];
  },

  _getVisibleColumns() {
      return ['id', 'created_by', 'owned_by']
  },

  _isListActive(path) {
    return !path;
},

_getSecret(id) {
    if(this.secretsMap)
        return this.secretsMap[id];
    return {};
},

_isDetailsPageActive(path) {
    return path && path !== '/+add';
},

  _getRenderers(){
        return {
            "name": {
                'body': (item, _row) => {
                    return `<strong class="name">${  item  }</strong>`;
                },
                'cmp': (row1, row2) => {
                    return row1.name.localeCompare(row2.name, 'en', {sensitivity: 'base'});
                }
            },
            'owned_by': {
                'title': (_item, _row) => {
                    return 'owner';
                },
                'body': (item, _row) => {
                    return this.model.members[item] ? this.model.members[item].name || this.model.members[item].email || this.model.members[item].username : '';
                }
            },
            'created_by': {
                'title': (_item, _row) => {
                    return 'created by';
                },
                'body': (item, _row) => {
                    return this.model.members[item] ? this.model.members[item].name || this.model.members[item].email || this.model.members[item].username : '';
                }
            },
        }
    }
});