import './secrets/secret-page.js';
import './secrets/secret-add.js'
import '@polymer/paper-fab/paper-fab.js';
import { CSRFToken } from './helpers/utils.js'
import { Polymer } from '../node_modules/@polymer/polymer/lib/legacy/polymer-fn.js';
import { html } from '../node_modules/@polymer/polymer/lib/utils/html-tag.js';

Polymer({
    _template: html`
        <style include="shared-styles">
            :host {
                display: block;
            }
            paper-dialog {
                position: fixed !important;
            }
            .pathButtons {
                border: 2px solid transparent;
                font-size: 18px;
                outline: none;
                font: inherit;
                margin-bottom: 9px;
            }
            .pathButtons:hover {
                color: #0275d8;
                text-decoration: underline;
                cursor: pointer;
            }
            #path-container button+button:before {
                content:"▸";
                padding-right:12px;
                padding-bottom:4px;
                display: inline-block;
                vertical-align:middle;
            }
        </style>
        <app-route route="{{route}}" pattern="/:secret" data="{{data}}"></app-route>

        <div id="path-container">
            <template is="dom-repeat" items=[[pathItems]]>
                <button id=[[item.id]] class="pathButtons" on-tap="_clickedPath">[[item.name]]</button>
            </template>
        </div>
        <template is="dom-if" if="[[_isListActive(route.path)]]" restamp>
            <mist-list selectable resizable column-menu multi-sort
                id="secretsList"
                apiurl="/api/v1/secrets"
                item-map="[[itemMap]]"
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
            <div
            class="absolute-bottom-right"
            >
                <paper-fab id="keyAdd" icon="add" on-tap="_addResource"></paper-fab>
            </div>
        </template>
        <secret-add
        model="[[model]]"
        section="[[model.sections.secrets]]"
        hidden$="[[!_isAddPageActive(route.path)]]"
        path="[[pathItems]]"></secret-add>
        <secret-page secret="[[_getSecret(data.secret, model.secrets)]]" resource-id="[[data.secret]]" model="[[model]]"
            section="[[model.sections.secrets]]" hidden$=[[!_isSecretPageActive(route.path)]]
            parent-folder-id="[[parentFolderId]]"></secret-page>
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
        },
        depth: {
            type: Number,
            value: 0
        },
        depthMap: {
            type: Object,
            value: {}
        },
        clickedItem: {
            type: Object
        },
        itemMap: {
            type: Object,
            value: {}
        },
        pathItems:{
            type: Array,
            value : []
        },
        isListActive: {
            type: Boolean,
            value: true
        },

        issecretPageActive:{
            type: Boolean,
            value: false
        },

        isAddPageActive: {
            type: Boolean,
            value: false
        },
        activeSecret: {
            type: Object,
            value: {}
        },
        parentFolderId: {
            type: String,
            value: "0"
        }
    },

    ready() {
        console.log('sec')
        this._getSecrets();
    },

    _getSecrets(){
      this.$.getSecrets.headers["Content-Type"] = 'application/json';
      this.$.getSecrets.headers["Csrf-Token"] = CSRFToken.value;
      this.$.getSecrets.url = `/api/v2/secrets`;
      this.$.getSecrets.generateRequest();
    },

  _handleGetSecretsRequest(_e){
      console.log("requested secrets");
  },

  _handleGetSecretsResponse(e){
        e.detail.response.data.forEach((item) => {
            this.secrets.push(item);
            this.secretsMap[item.id] = item;
        });
        this.set('model.secrets', this.secretsMap);
        this._createDepthMap();
        const currentItemId = this.route.path.startsWith('/') ? this.route.path.slice(1) : this.route.path;
        if(currentItemId === "" || currentItemId === "+add"){
            this._setItemMap("");
            this.set('pathItems', [{id:"0", name:"/"}]);
        } else {
            this.set('pathItems', this._makePathItems(currentItemId))
            this._setItemMap(this.pathItems[this.pathItems.length-1].name);
        }
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
    const itemId = path.startsWith('/') ? path.slice(1) : path;
    if(itemId === "-1"){
        console.log("Should go back one level")
        this.route.path = "";
        this.pop("pathItems")
        const parent = this.pathItems.slice(-1)[0];
        const parentName = parent.name.split("/").slice(-2)[0]
        this.parentFolderId = parent.id;
        this._setItemMap(parentName);
        return true;
    }
    if(itemId === "")
        return true;
    if(this.secretsMap[itemId] && this.secretsMap[itemId].is_dir){
        const itemName = this.secretsMap[itemId].name.split("/").slice(-2)[0]
        this._setItemMap(itemName)
        this.route.path = "";
        this.push('pathItems', {id: itemId, name: itemName})
        this.parentFolderId = itemId;
        return true;
    }
    return false;
},

_getSecret(id) {
    if(this.secretsMap)
        return this.secretsMap[id];
    return {};
},

_isSecretPageActive(path) {
    const itemId = path.startsWith('/') ? path.slice(1) : path;
    const ret = itemId && itemId !== "-1" && itemId!== '+add'//&& this.secretsMap[itemId] && !this.secretsMap[itemId].is_dir;
    if (ret) {
        //this.parentFolderId = this.pathItems[this.pathItems.length-1].id;
    }
    return ret;
},

_isAddPageActive(path) {
    return path === '/+add';
  },

_addResource(){
    this.dispatchEvent(
        new CustomEvent('go-to', {
          bubbles: true,
          composed: true,
          detail: {
            url: this.model.sections.secrets.add,
          },
        })
      );
},

_clickedPath(e){
    const itemId = e.target.id;
    // if the current folder was clicked do nothing
    if(this.pathItems.slice(-1)[0].id === itemId && this.route.path === "") return;
    // if secret-page is showing go back  to list
    if(this.route.path !== ""){
        this.set('route.path', "");
    }
    this.parentFolderId = itemId;
    const index = this.pathItems.findIndex (element => {return element.id === itemId});
    this.set('pathItems', this.pathItems.slice(0, index+1));
    this._setItemMap(this.pathItems[this.pathItems.length-1].name);
},

_setItemMap(folder){
    if(folder === "/")
        folder = "";
    const newMap = {};
    if(folder !== "")
        newMap['-1'] = {id: "-1", name: ".."}
    const ids  = this.depthMap[folder];
    ids.forEach(id => {
        newMap[id] = this.secretsMap[id];
    });
    this.set("itemMap", newMap)
},

_createDepthMap() {
    this.depthMap={"":[]};
    // folders first
    const folderNameIdMap= {"":"0"};
    this.secrets.forEach(secret => {
        if(secret.is_dir){
            const secretName = secret.name.split("/").slice(-2)[0];
            this.depthMap[secretName] = [];
            folderNameIdMap[secretName] = secret.id;
        }
    });
    this.secrets.forEach((secret)=>{
        let parentFolder = "";
        if(secret.depth !== 0) {
            if(secret.is_dir) parentFolder = secret.name.split("/").slice(-3)[0];
            else parentFolder = secret.name.split("/").slice(-2)[0];
        }
        secret.parentFolderId = folderNameIdMap[parentFolder]
        this.depthMap[parentFolder].push(secret.id)
    });
},

_makePathItems(fileId){
    const ret = [];
    let folder = this.secretsMap[fileId];
    while(folder.parentFolderId !== "0"){
        folder = this.secretsMap[folder.parentFolderId];
        ret.unshift({id: folder.id, name: folder.name});
    }
    ret.unshift({id:"0", name:"/"});
    return ret
},

_getRenderers(){
    return {
        "name": {
            'body': (item, _row) => {
                const path = item.split("/")
                const name = path.slice(-1)[0] === "" ? path.slice(-2)[0] : path.slice(-1)[0];
                return `<strong class="name">${  name  }</strong>`;
            },
            'cmp': (row1, row2) => {
                if (row1.is_dir && !row2.is_dir) return -1;
                if (!row1.is_dir && row2.is_dir) return 1;
                return row1.name.localeCompare(row2.name, 'en', {sensitivity: 'base'});
            }
        },
        'id': {
            'body': (item, _row) => {
                if(item === "-1") return ""
                return item;
            }
        },
        'icon': {
            body: (item, _row) => {
                if(item.id === '-1') return "";
                if(item.is_dir) return "./assets/icons/secret-folder.svg";
                return "./assets/icons/secret-file.svg";
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
