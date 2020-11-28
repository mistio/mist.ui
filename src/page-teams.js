import '../node_modules/@polymer/app-route/app-route.js';
import '../node_modules/@mistio/mist-list/mist-list.js';
import '../node_modules/@polymer/paper-fab/paper-fab.js';
import './teams/team-page.js';
import './teams/team-actions.js';
import './teams/member-page.js';
import './teams/members-add.js';
import './teams/member-add-in-teams.js';
import './teams/team-add.js';
import { rbacBehavior } from './rbac-behavior.js';
import { mistListsBehavior } from './helpers/mist-lists-behavior.js';
import { Polymer } from '../node_modules/@polymer/polymer/lib/legacy/polymer-fn.js';
import { html } from '../node_modules/@polymer/polymer/lib/utils/html-tag.js';

Polymer({
    _template: html`
        <style include="shared-styles">
            [hidden] {
                display: none !important;
            }
            mist-list {
                font-size: 14px;
            }
            mist-list[selectable] ::slotted(vaadin-grid-table-row) {
                cursor: pointer;
            }
        </style>
        <app-route route="{{route}}" pattern="/:team" data="{{data}}"></app-route>
        <template is="dom-if" if="[[_isListActive(route.path)]]" restamp>
            <team-actions id="actions" items="[[selectedItems]]" org="[[model.org.id]]" actions="{{actions}}">
                <mist-list selectable resizable column-menu multi-sort 
                    apiurl="/api/v1/teams"
                    id="teamsList"
                    name="Teams"
                    primary-field-name="id"
                    frozen=[[_getFrozenColumn()]]
                    visible=[[_getVisibleColumns()]]
                    selected-items="{{selectedItems}}"
                    sort-order=[[sortOrder]]
                    renderers=[[_getRenderers()]]
                    route={{route}}
                    items="[[model.teamsArray]]"
                    actions=[[actions]]
                    user-filter=[[model.sections.teams.q]]
                    filter-method="[[_isMemberOfFilter()]]"
                    filtered-items-length="{{filteredItemsLength}}"></mist-list>
            </team-actions>
        </template>
        <team-page id="teamPage" model="[[model]]" team="[[_getTeam(data.team, model.teams)]]" resource-id="[[data.team]]" section="[[model.sections.teams]]" hidden$=[[!_isDetailsPageActive(route.path)]] rbac=[[rbac]] billing="[[billing]]" cta=[[cta]] email=[[email]] docs=[[docs]]></team-page>
        <members-add model="[[model]]" params="[[data]]" section="[[model.sections.teams]]" hidden$=[[!_isAddMembersPageActive(route.path)]]></members-add>
        <member-add-in-teams model="[[model]]" params="[[data]]" section="[[model.sections.teams]]" hidden$=[[!_isAddMemberPageActive(route.path)]]></member-add-in-teams>
        <team-add id="isTeamsPage" organization="[[model.org]]" rbac=[[rbac]]></team-add>
        <div class="absolute-bottom-right" hidden$=[[!_showAddTeam(route.path,model.user)]]>
            <paper-fab id="isTeams" icon="add" on-tap="_addTeam"></paper-fab>
        </div>
    `,
    is: 'page-teams',
    behaviors: [
        mistListsBehavior,
        rbacBehavior
    ],

    properties: {
        model: {
            type: Object
        },
        ownership: {
            type: Boolean
        },
        route: {
            type: Object
        },
        actions: {
            type: Array,
            notify: true
        },
        selectedItems: {
            type: Array,
            value() { return [] }
        },
        rbac: {
            type: Boolean,
            value: false
        },
        docs: {
            type: Boolean,
            value: false
        }
    },

    listeners: {},
    _isDetailsPageActive(path) {
        if (path && path !== '/+add' && this.$.teamPage)
            this.$.teamPage.updateState();
        return path && !path.endsWith('+add');
    },
    _isAddMembersPageActive(path) {
        return path !== '/+add' && path.endsWith('+add');
    },
    _isAddMemberPageActive(path) {
        return path === '/+add';
    },
    _isListActive(path) {
        return !path;
    },
    _isMemberOfFilter() {
        const _this = this;
        return {
            'apply': (item, query) => {
                let q = query.slice(0) || '';
                    const filterOwner = query.indexOf('owner:') > -1;
                    const ownerRegex = /owner:(\S*)\s?/;

                if (filterOwner && q) {
                    if (ownerRegex.exec(q).length) {
                        const owner = ownerRegex.exec(q)[1];
                        if (owner) {
                            if (owner === "$me") {
                                if (!item.members.length || item.members.indexOf(_this.model.user.id) === -1)
                                    return false;
                            } else {
                                const ownerObj = _this.model.membersArray.find((m) => {
                                    return [m.name, m.email, m.username, m.id].indexOf(owner) > -1;
                                });
                                if (!ownerObj || (!item.members.length || item.members.indexOf(ownerObj.id) === -1))
                                    return false;
                            }
                            q = q.replace('owner:', '').replace(owner, '');
                            return q;
                        }
                    }
                }
                return query;
            }
        }
    },
    _hasNoSelectedItems() {
        return !(this.selectedItems && this.selectedItems.length);
    },
    _getTeam(id) {
        if (this.model.teams && id)
            return this.model.teams[id];
        return "";
    },

    _getFrozenColumn() {
        return ['name'];
    },

    _getVisibleColumns() {
        return ['description', 'members'];
    },

    _getRenderers(_teams, _members) {
        const _this = this;
        return {
            'name': {
                'body': (item, row) => {
                    if (row.parent && _this.model && _this.model.org && _this.model.org.parent_org_name) {
                        const ret = `[${  _this.model.org.parent_org_name  }] <strong>${  item  }</strong>`;
                        return ret;
                    }
                    return `<strong class='name'>${  item  }</strong>`;
                },
                'cmp': (row1, row2) => {
                    return row1.name.localeCompare(row2.name, 'en', {sensitivity: 'base'});
                }
            },
            'members': {
                'body': (item, _row) => {
                    if (_this.model && _this.model.members && item && item.length && item.length > 0) {
                        const names = item.map((i) => {
                            if (_this.model.members[i]){
                                const displayName = _this.model.members[i].name || _this.model.members[i].email || _this.model.members[i].username;
                                return ` ${  displayName}`;
                            }
                            return "";
                        });
                        return names;
                    }
                    return item;
                }
            }
        };
    },

    _addTeam(_e) {
        const dialog = this.shadowRoot.querySelector('team-add#isTeamsPage');
        dialog.openDialog();
    },

    selectAction(e) {
        e.stopImmediatePropagation();
        if (this.shadowRoot.querySelector('#teamsList')) {
            this.shadowRoot.querySelector('#teamsList').shadowRoot.querySelector('#actions').selectAction(e);
        }
    },

    _showAddTeam(path, _user) {
        return this.model && this._isListActive(path) && this.check_perm('add','key', null, this.model.org, this.model.user);
    }

});
