import '../node_modules/@polymer/app-route/app-route.js';
import '../node_modules/@mistio/mist-list/mist-list.js';
import '../node_modules/@polymer/paper-fab/paper-fab.js';
import './schedules/schedule-add.js';
import './schedules/schedule-page.js';
import './schedules/schedule-actions.js';
import moment from '../node_modules/moment/src/moment.js';
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
        <app-route route="{{route}}" pattern="/:schedule" data="{{data}}"></app-route>
        <template is="dom-if" if="[[_isListActive(route.path)]]" restamp>
            <schedule-actions id="actions" items="[[selectedItems]]" actions="{{actions}}" user="[[model.user.id]]" org="[[model.org]]" members="[[model.membersArray]]">
                <mist-list selectable resizable column-menu multi-sort 
                    apiurl="/api/v1/schedules"
                    id="schedulesList"
                    name="Schedules"
                    primary-field-name="id"
                    frozen=[[_getFrozenColumn()]]
                    visible=[[_getVisibleColumns()]]
                    selected-items="{{selectedItems}}"
                    sort-order=[[sortOrder]]
                    renderers=[[_getRenderers()]]
                    route={{route}}
                    item-map="[[model.schedules]]"
                    actions=[[actions]]
                    user-filter=[[model.sections.schedules.q]]
                    filter-method="[[_ownerFilter()]]"
                    filtered-items-length="{{filteredItemsLength}}">
                    <p slot="no-items-found">No schedules found.</p>
                </mist-list>
            </schedule-actions>

            <div class="absolute-bottom-right" hidden$="[[!check_perm('add','schedule', null, model.org, model.user)]]">
                <paper-fab id="scheduleAdd" icon="add" on-tap="_addResource"></paper-fab>
            </div>
        </template>
        <schedule-add model="[[model]]" section="[[model.sections.schedules]]" hidden$=[[!_isAddPageActive(route.path)]] docs=[[docs]] currency=[[currency]]></schedule-add>
        <schedule-page model="[[model]]" schedule="[[_getSchedule(data.schedule, model.schedules, model.schedules.*)]]" resource-id="[[data.schedule]]" section="[[model.sections.schedules]]" hidden$=[[!_isDetailsPageActive(route.path)]] currency=[[currency]]></schedule-page>
    `,
    is: 'page-schedules',

    behaviors: [
        mistListsBehavior,
        ownerFilterBehavior,
        rbacBehavior
    ],

    properties: {
        model: {
            type: Object
        },
        actions: {
            type: Array
        },
        selectedItems: {
            type: Array
        },
        currency: {
            type: Object
        }
    },

    _isAddPageActive(path) {
        return path === '/+add';
    },

    _isDetailsPageActive(path) {
        return path && path!== '/+add';
    },

    _isListActive(path) {
        return !path;
    },

    _getSchedule(id) {
        if (this.model.schedules)
            return this.model.schedules[id];
        return '';
    },

    _addResource(_e) {
        this.dispatchEvent(new CustomEvent('go-to', { bubbles: true, composed: true, detail: {
            url: this.model.sections.schedules.add
        } }));

    },

    _getFrozenColumn() {
        return ['name'];
    },

    _getVisibleColumns() {
        const ret = ['task_type', 'schedule', 'selectors', 'created_by', 'total_run_count', 'tags'];
        if (this.model.org && this.model.org.ownership_enabled === true)
            ret.splice(ret.indexOf('created_by'), 0, 'owned_by');
        return ret;
    },

    _getRenderers(_schedules) {
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
            'task_type': {
                'title': (_item, _row) => {
                    return 'task';
                },
                'body': (item, _row) => {
                    if (item.action)
                        return item && item.action.toUpperCase();
                    if (item.script_id) {
                        const scriptName = _this.model.scripts[item.script_id] ? _this.model.scripts[item.script_id].name : "missing script";
                        return `RUN ${ scriptName}`;
                    }
                    return '';
                }
            },
            'tags': {
                'body': (item, _row) => {
                    const tags = item;
                        let display = "";
                    Object.keys(tags || {}).forEach((key) => {
                        display += `<span class='tag'>${  key}`;
                        if (tags[key]!== undefined && tags[key]!== "")
                            display += `=${  tags[key]}`;
                        display += "</span>";
                    });
                    return display;
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
            'schedule': {
                'body': (item, _row) => {
                    if (item.startsWith("Interval")) {
                        return item.replace("Interval ", "")
                    } if (item.startsWith("OneOff")) {
                        const isValid = moment().isValid(item.replace("OneOff date to run ", ""));
                        let time;
                        if (isValid)
                            time = moment.utc(item.replace("OneOff date to run ", "")).fromNow();
                        return time || item;
                    } if (item.startsWith("Crontab")) {
                        return item.replace("Crontab ", "").replace("(m/h/d/dM/MY)", "");
                    } return item;
                }
            },
            'selectors': {
                'body': (item, _row) => {
                    const selectors = item;
                    let display = '';

                    for (let i = 0; i < selectors.length; i++) {
                        let missingLength = 0;
                        if (i === selectors.length - 1 && i > 0)
                            display += "and ";
                        if (selectors[i].type === "machines" && selectors[i].ids.length > 0 && _this.model.machines) {
                            display += "on ";
                            for (let j = 0; j < selectors[i].ids.length; j++) {
                                if (_this.model.machines[selectors[i].ids[j]]) {
                                    if (j === selectors[i].ids.length - 1 && j > 0 && !missingLength)
                                        display += "and ";
                                    display += _this.model.machines[selectors[i].ids[j]].name;
                                    if (j < selectors[i].ids.length - 2)
                                        display += ",";
                                    display += " ";
                                } else {
                                    missingLength++;
                                }
                            }
                            if (missingLength) {
                                if (missingLength < selectors[i].ids.length)
                                    display += " and "
                                display += `${missingLength  } missing machine`
                                if (missingLength > 1)
                                    display += "s "
                                else
                                    display += " "
                            }
                        } else if (selectors[i].type === "tags") {
                            display += "on tags ";
                            for(const p of Object.keys(selectors[i].include || {})) {
                                display += `<span class='tag'>${  p}`;
                                if (selectors[i].include[p]!== undefined && selectors[i].include[p]!== "")
                                    display += `=${  selectors[i].include[p]}`;
                                display += "</span>";
                            }
                        }
                        if (selectors[i].type === "age")
                            display += `older than ${  selectors[i].minutes  }min `;
                        else if (selectors[i].type === "field" && selectors[i].field === "cost__monthly")
                            display += `cost more than $${  selectors[i].value  }/month `;
                        else if (selectors[i].type === "field")
                            display += `${selectors[i].field  } ${  selectors[i].value  } `;
                    }

                    return display;
                }
            }
        }
    }
});
