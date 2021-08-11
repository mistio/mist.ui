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
        <template is="dom-if" if="[[_isListActive(route.path)]]">
            <mist-list selectable resizable column-menu multi-sort
                id="secretsList"
                apiurl="/api/v2/secrets"
                data-provider="[[dataProvider]]"
                name="Secrets"
                visible=[[_getVisibleColumns()]]
                frozen=[[_getFrozenColumn()]]
                route={{route}}
                tree-view
                primary-field-name="id"
                renderers=[[_getRenderers()]]
                filter-method="[[_ownerFilter()]]"
                actions="[[actions]]">
                <p slot="no-items-found">No secrets found.</p>
            </mist-list>
            <div
            class="absolute-bottom-right"
            >
                <paper-fab id="secretAdd" icon="add" on-tap="_addResource"></paper-fab>
            </div>
        </template>
        <secret-add
        model="[[model]]"
        section="[[model.sections.secrets]]"
        hidden$="[[!_isAddPageActive(route.path)]]"
        path="[[pathItems]]"></secret-add>
        <template is="dom-if" if="[[!_isListActive(route.path)]]" restamp>
            <secret-page secret="[[_getSecret(data.secret, model.secrets)]]" resource-id="[[data.secret]]" model="[[model]]"
                section="[[model.sections.secrets]]" hidden$=[[!_isSecretPageActive(route.path)]]
                parent-folder-id="[[parentFolderId]]"></secret-page>
        </template>
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
            type: Object
        },
        itemMap: {
            type: Object,
            value: {}
        },
        actions: {
            type: Array,
            value: () => []
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
            value: () => {}
        },
        parentFolderId: {
            type: String,
            value: "0"
        },
        pathItems: {
            type: Array,
            value: []
        },
    },

    ready() {
        // this._getSecrets();
        this.dataProvider = function(params, callback) {
            // If the data request concerns a tree sub-level, `params` has an additional
            // `parentItem` property that refers to the sub-level's parent item
            const parentName = params.parentItem ? params.parentItem.name : null;
            let xhr = new XMLHttpRequest(), url = '/api/v2/secrets';
            if (!parentName) {
                url += '?search=' + encodeURIComponent('name=r"^[^/]*/{0,1}$"');
            } else {
                url += '?search=' + encodeURIComponent(`name=r"^${parentName}[^/]+/{0,1}$"`);
            }
            xhr.open('GET', url);
            xhr.onreadystatechange = function () {
                let items = [], count = 0;
                if (xhr.readyState === 4 && xhr.status === 200) {
                    var response = JSON.parse(xhr.responseText);
                    items = response.data
                    items.forEach((i) => {
                        i.is_dir = i.name.endsWith('/');
                        this.itemMap[i.id] = i;
                    });
                    count = response.meta.total_returned;
                    callback(items, count);
                    window.dispatchEvent(new Event('resize'));
                    this.async(function () {window.dispatchEvent(new Event('resize'));
                    }, 500);
                }
            }.bind(this);
            xhr.send();

            // // Demo helper API that fetches expenses categories
            // Vaadin.GridDemo._getExpensesCategories(parentUuid, function(categories) {
            //   // Here `categories` is an array consisting of items with the following structure:
            //   // {
            //   //   hasChildren: false
            //   //   name: "Service fees",
            //   //   uuid: "e78b"
            //   //   parentUuid: "e789"
            //   // }
            //   // This demo uses the `hasChildren` flag as an indicator of the item having child items.
            //   // The property is used internally by the `<vaadin-grid-tree-column>`.
      
            //   // Slice out only the requested items
            //   const startIndex = params.page * params.pageSize;
            //   const pageItems = categories.slice(startIndex, startIndex + params.pageSize);
            //   // Inform grid of the requested tree level's full size
            //   const treeLevelSize = categories.length;
            //   callback(pageItems, treeLevelSize);
            // });
          }.bind(this);
    },

  _getFrozenColumn() {
      return ['name'];
  },

  _getVisibleColumns() {
      return ['created_by', 'owned_by',]
  },

  _isListActive(path) {
    if(path === "" || path.endsWith('/'))
        return true;
    return false;
},

_getSecret(id) {
    let grid = this.shadowRoot && this.shadowRoot.querySelector('mist-list') && this.shadowRoot.querySelector('mist-list').$.grid;
    return grid && grid.activeItem || {};
},

_isSecretPageActive(path) {
    const itemId = path.startsWith('/') ? path.slice(1) : path;
    const ret = itemId && itemId !== "-1" && itemId!== '+add'//&& this.itemMap[itemId] && !this.itemMap[itemId].is_dir;
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
    debugger;
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
    // const ids  = this.depthMap[folder];
    // ids.forEach(id => {
    //     newMap[id] = this.itemMap[id];
    // });
    // this.set("itemMap", newMap)
},


_getRenderers(){
    return {
        "name": {
            'body': (item, _row) => {
                const path = item.split("/")
                const name = path.slice(-1)[0] === "" ? path.slice(-2)[0] + '/' : path.slice(-1)[0];
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
                if(item.is_dir) return "folder";
                return "lock";
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
