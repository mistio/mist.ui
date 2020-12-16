import '../node_modules/@polymer/app-route/app-route.js';
import '../node_modules/@mistio/mist-list/mist-list.js';
import '../node_modules/@polymer/paper-fab/paper-fab.js';
import './scripts/script-add.js';
import './scripts/script-page.js';
import './scripts/script-actions.js';
import { rbacBehavior } from './rbac-behavior.js';
import { mistListsBehavior } from './helpers/mist-lists-behavior.js';
import { ownerFilterBehavior } from './helpers/owner-filter-behavior.js';
import { Polymer } from '../node_modules/@polymer/polymer/lib/legacy/polymer-fn.js';
import { html } from '../node_modules/@polymer/polymer/lib/utils/html-tag.js';

Polymer({
  _template: html`
    <style include="shared-styles">
      :host {
        display: block;
      }
      [hidden] {
        display: none !important;
      }
    </style>
    <app-route route="{{route}}" pattern="/:script" data="{{data}}"></app-route>
    <template is="dom-if" if="[[_isListActive(route.path)]]" restamp>
      <script-actions
        actions="{{actions}}"
        items="[[selectedItems]]"
        org="[[model.org]]"
      >
        <mist-list
          selectable
          resizable
          column-menu
          multi-sort
          id="scriptsList"
          apiurl="/api/v1/scripts"
          name="scripts"
          primary-field-name="id"
          frozen="[[_getFrozenColumn()]]"
          visible="[[_getVisibleColumns()]]"
          selected-items="{{selectedItems}}"
          sort-order="[[sortOrder]]"
          renderers="[[_getRenderers()]]"
          route="{{route}}"
          item-map="[[model.scripts]]"
          user-filter="[[model.sections.scripts.q]]"
          filter-method="[[_ownerFilter()]]"
          actions="[[actions]]"
          ><p slot="no-items-found">No scripts found.</p>
        </mist-list>
      </script-actions>

      <div
        class="absolute-bottom-right"
        hidden$="[[!check_perm('add','script', null, model.org, model.user)]]"
      >
        <paper-fab id="scriptAdd" icon="add" on-tap="_addResource"></paper-fab>
      </div>
    </template>
    <template is="dom-if" if="[[_isAddPageActive(route.path)]]" restamp>
      <script-add
        model="[[model]]"
        section="[[model.sections.scripts]]"
        hidden$="[[!_isAddPageActive(route.path)]]"
        docs="[[docs]]"
      ></script-add>
    </template>
    <script-page
      id="scriptPage"
      model="[[model]]"
      script="[[_getScript(data.script, model.scripts, model.scripts.*)]]"
      resource-id="[[data.script]]"
      section="[[model.sections.scripts]]"
      hidden$="[[!_isDetailsPageActive(route.path)]]"
    ></script-page>
    <template is="dom-if" if="[[_isRunPageActive(route.path)]]" restamp>
      <script-run
        model="[[model]]"
        script="[[_getScript(data.script, model.scripts)]]"
        section="[[model.sections.scripts]]"
        hidden$="[[!_isRunPageActive(route.path)]]"
      ></script-run>
    </template>
  `,
  is: 'page-scripts',
  behaviors: [mistListsBehavior, ownerFilterBehavior, rbacBehavior],

  properties: {
    model: {
      type: Object,
    },
    ownership: {
      type: Boolean,
    },
    actions: {
      type: Array,
      notify: true,
    },
    selectedItems: {
      type: Array,
      notify: true,
    },
  },
  _isAddPageActive(path) {
    return path === '/+add';
  },
  _isDetailsPageActive(path) {
    return path && path !== '/+add' && !path.endsWith('+run');
  },
  _isRunPageActive(path) {
    return path && path.endsWith('+run');
  },
  _isListActive(path) {
    return !path;
  },
  _getScript(id) {
    if (this.model && this.model.scripts && id) {
      return this.model.scripts[id];
    }
    return '';
  },
  _addResource(_e) {
    this.dispatchEvent(
      new CustomEvent('go-to', {
        bubbles: true,
        composed: true,
        detail: {
          url: this.model.sections.scripts.add,
        },
      })
    );
  },
  _getFrozenColumn() {
    return ['name'];
  },

  _getVisibleColumns() {
    const ret = ['exec_type', 'created_by', 'location', 'tags'];
    if (this.model.org && this.model.org.ownership_enabled === true)
      ret.splice(ret.indexOf('created_by'), 0, 'owned_by');
    return ret;
  },

  _getRenderers() {
    const _this = this;
    return {
      name: {
        body: (item, _row) => {
          return `<strong class="name">${item}</strong>`;
        },
        cmp: (row1, row2) => {
          return row1.name.localeCompare(row2.name, 'en', {
            sensitivity: 'base',
          });
        },
      },
      exec_type: {
        title: (_item, _row) => {
          return 'exec type';
        },
        body: (item, _row) => {
          return item;
        },
      },
      owned_by: {
        title: (_item, _row) => {
          return 'owner';
        },
        body: (item, _row) => {
          return _this.model.members[item]
            ? _this.model.members[item].name ||
                _this.model.members[item].email ||
                _this.model.members[item].username
            : '';
        },
      },
      created_by: {
        title: (_item, _row) => {
          return 'created by';
        },
        body: (item, _row) => {
          return _this.model.members[item]
            ? _this.model.members[item].name ||
                _this.model.members[item].email ||
                _this.model.members[item].username
            : '';
        },
      },
      tags: {
        body: (item, _row) => {
          const tags = item;
          let display = '';
          Object.keys(tags || {}).forEach(key => {
            display += `<span class='tag'>${key}`;
            if (tags[key] !== undefined && tags[key] !== '')
              display += `=${tags[key]}`;
            display += '</span>';
          });
          return display;
        },
      },
      location: {
        title: (_item, _row) => {
          return 'location type';
        },
        body: (item, _row) => {
          return item.type;
        },
      },
    };
  },
});
