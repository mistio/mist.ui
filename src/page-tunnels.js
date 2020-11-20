import '../node_modules/@polymer/app-route/app-route.js';
import '../node_modules/@mistio/mist-list/mist-list.js';
import '../node_modules/@polymer/paper-fab/paper-fab.js';
import './tunnels/tunnel-add.js';
import './tunnels/tunnel-actions.js';
import './tunnels/tunnel-page.js';
import { rbacBehavior } from './rbac-behavior.js';
import { mistListsBehavior } from './helpers/mist-lists-behavior.js';
import { ownerFilterBehavior } from './helpers/owner-filter-behavior.js';
import { Polymer } from '../node_modules/@polymer/polymer/lib/legacy/polymer-fn.js';
import { html } from '../node_modules/@polymer/polymer/lib/utils/html-tag.js';

Polymer({
    _template: html`
        <style include="shared-styles">
            [hidden] {
                display: none !important;
            }
        </style>
        <app-route route="{{route}}" pattern="/:tunnel" data="{{data}}"></app-route>
        <template is="dom-if" if="[[_isListActive(route.path)]]" restamp>
            <tunnel-actions id="actions" items="[[selectedItems]]" actions="{{actions}}" user="[[model.user.id]]" members="[[model.membersArray]]" org="[[model.org]]">
                <mist-list selectable resizable column-menu multi-sort
                    id="tunnelsList"
                    apiurl="/api/v1/tunnels"
                    item-map="[[model.tunnels]]"
                    name="Tunnels"
                    selected-items="{{selectedItems}}"
                    filtered-items-length="{{filteredItemsLength}}"
                    frozen=[[_getFrozenLogColumn()]]
                    visible=[[_getVisibleColumns()]]
                    renderers=[[_getRenderers(model.tunnels)]]
                    route={{route}}
                    user-filter=[[model.sections.tunnels.q]]
                    primary-field-name="id"
                    filter-method="[[_ownerFilter()]]"
                    actions="[[actions]]">
                    <p slot="no-items-found">No tunnels found.</p>
                </mist-list>
            </tunnel-actions>
            <div class="absolute-bottom-right" hidden$="[[!check_perm('add','tunnel', null, model.org, model.user)]]">
                <paper-fab id="tunnelAdd" icon="add" on-tap="_addResource"></paper-fab>
            </div>
        </template>
        <tunnel-add model="[[model]]" section="[[model.sections.tunnels]]" hidden$=[[!_isAddPageActive(route.path)]]></tunnel-add>
        <tunnel-page model="[[model]]" tunnel$="[[_getTunnel(data.tunnel, model.tunnels, model.tunnels.*)]]" resource-id="[[data.tunnel]]" section="[[model.sections.tunnels]]" hidden$=[[!_isDetailsPageActive(route.path)]]></tunnel-page>
            </key-page>
    `,
    is: 'page-tunnels',
    behaviors: [
        mistListsBehavior,
        ownerFilterBehavior,
        rbacBehavior
    ],

    properties: {
        model: {
            type: Object
        },
        ownership: {
            type: Boolean
        },
        actions: {
            type: Array,
            notify: true
        },
        selectedItems: {
            type: Array,
            notify: true
        }
    },

    listeners: {
        'select-action': 'selectAction',
    },
    _isAddPageActive(path) {
        return path === '/+add';
    },
    _isDetailsPageActive(path) {
        if (path && path !==  '/+add' && this.shadowRoot && this.shadowRoot.querySelector('tunnel-page'))
            this.shadowRoot.querySelector('tunnel-page').updateState();
        return path && path !==  '/+add';
    },
    _isListActive(path) {
        return !path;
    },
    _getTunnel(id) {
        if (this.model.tunnels)
            return this.model.tunnels[id];
        return "";
    },
    _addResource(_e) {
        this.dispatchEvent(new CustomEvent('go-to', { bubbles: true, composed: true, detail: {
            url: this.model.sections.tunnels.add
        } }));
    },
    _getFrozenLogColumn() {
        return ['name'];
    },

    _getVisibleColumns() {
        const ret = ['cidrs', 'created_by', 'id', 'tags'];
        if (this.model.org && this.model.org.ownership_enabled === true)
            ret.push('owned_by');
        return ret;
    },
    _getRenderers(_tunnels) {
        const _this = this;
        return {
            'name': {
                'body': (item, _row) => {
                    return `<strong class="name">${  item  }</strong>`;
                },
                'cmp': (row1, row2) => {
                    return row1.name.localeCompare(row2.name, 'en', {sensitivity: 'base'});
                }
            },
            'cidrs': {
                'body': (item, _row) => {
                    if (item)
                        return item.join(', ');
                    return '';
                }
            },
            'owned_by': {
                'title': (_item, _row) => {
                    return 'owner';
                },
                'body': (item, _row) => {
                    return _this.model.members[item] ? _this.model.members[item].name || _this.model.members[item].email || _this.model.members[item].username : '';
                }
            },
            'created_by': {
                'title': (_item, _row) => {
                    return 'created by';
                },
                'body': (item, _row) => {
                    return _this.model.members[item] ? _this.model.members[item].name || _this.model.members[item].email || _this.model.members[item].username : '';
                }
            },
            'tags': {
                'body': (item, _row) => {
                    const tags = item;
                    let display = "";
                    Object.keys(tags || {}).forEach((key) => {
                        display += `<span class='tag'>${  key}`;
                        if (tags[key] !==  undefined && tags[key] !==  "")
                            display += `=${  tags[key]}`;
                        display += "</span>";
                    });
                    return display;
                }
            }
        }
    },

    selectAction(e) {
        e.stopImmediatePropagation();
        if (this.shadowRoot.querySelector('#tunnelsList')) {
            this.shadowRoot.querySelector('#tunnelsList').shadowRoot.querySelector('#actions').selectAction(e);
        }
    }
});
