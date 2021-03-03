import '@polymer/app-route/app-route.js';
import '@mistio/mist-list/mist-list.js';
import '@polymer/paper-fab/paper-fab.js';
import './templates/template-add.js';
import './templates/template-page.js';
import './templates/template-actions.js';
import { mistListsBehavior } from './helpers/mist-lists-behavior.js';
import { ownerFilterBehavior } from './helpers/owner-filter-behavior.js';
import { Polymer } from '@polymer/polymer/lib/legacy/polymer-fn.js';
import { html } from '@polymer/polymer/lib/utils/html-tag.js';

Polymer({
  _template: html`
    <style include="shared-styles">
      [hidden] {
        display: none !important;
      }
    </style>
    <app-route
      route="{{route}}"
      pattern="/:template"
      data="{{data}}"
    ></app-route>
    <template is="dom-if" if="[[_isListActive(route.path)]]" restamp>
      <template-actions
        id="actions"
        items="[[selectedItems]]"
        actions="{{actions}}"
        user="[[model.user.id]]"
        org="[[model.org]]"
        members="[[model.membersArray]]"
      >
        <mist-list
          selectable
          resizable
          column-menu
          multi-sort
          apiurl="/api/v1/templates"
          id="templatesList"
          name="Templates"
          primary-field-name="id"
          frozen="[[_getFrozenColumn()]]"
          visible="[[_getVisibleColumns()]]"
          selected-items="{{selectedItems}}"
          sort-order="[[sortOrder]]"
          renderers="[[_getRenderers()]]"
          route="{{route}}"
          item-map="[[model.templates]]"
          actions="[[actions]]"
          user-filter="[[model.sections.templates.q]]"
          filter-method="[[_ownerFilter()]]"
          filtered-items-length="{{filteredItemsLength}}"
        >
          <p slot="no-items-found">No templates found.</p>
        </mist-list>
      </template-actions>
      <div
        class="absolute-bottom-right"
        hidden$="[[!checkPerm('template', 'add', null, model.org, model.user)]]"
      >
        <paper-fab
          id="templateAdd"
          icon="add"
          on-tap="_addResource"
        ></paper-fab>
      </div>
    </template>
    <template-add
      model="[[model]]"
      section="[[model.sections.templates]]"
      hidden$="[[!_isAddPageActive(route.path)]]"
    ></template-add>
    <template-page
      model="[[model]]"
      template-id="[[data.template]]"
      resource-id="[[data.template]]"
      stacks="[[_getTemplateStacks(data.template, model.templates, model.stacks, model.templates.*, model.stacks.*)]]"
      section="[[model.sections.templates]]"
      hidden$="[[!_isDetailsPageActive(route.path)]]"
    ></template-page>
  `,
  is: 'page-templates',
  behaviors: [mistListsBehavior, ownerFilterBehavior, window.rbac],

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
    renderers:{
      type: Object,
      computed: '_getRenderers(model.templates)'
    }
  },

  listeners: {
    'action-finished': 'clearListSelection',
  },
  clearListSelection() {
    this.set('selectedItems', []);
  },
  _isAddPageActive(path) {
    return path === '/+add';
  },
  _isDetailsPageActive(path) {
    return path && path !== '/+add';
  },
  _isListActive(path) {
    return !path;
  },
  _addResource(_e) {
    this.dispatchEvent(
      new CustomEvent('go-to', {
        bubbles: true,
        composed: true,
        detail: {
          url: this.model.sections.templates.add,
        },
      })
    );
  },
  _getTemplateStacks(id) {
    return this.model.stacksArray.filter(stack => {
      return stack.template === id;
    }, this);
  },
  _getFrozenColumn() {
    return ['name'];
  },

  _getVisibleColumns() {
    const ret = ['exec_type', 'location_type', 'created_by', 'tags'];
    if (this.model.org && this.model.org.ownership_enabled === true)
      ret.splice(ret.indexOf('created_by'), 0, 'owned_by');
    return ret;
  },

  _getRenderers(_templates) {
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
        // sort alphabetically by the rendered string value
        cmp: (row1, row2) => {
          const item1 = this.renderers.owned_by.body(row1.owned_by);
          const item2 = this.renderers.owned_by.body(row2.owned_by);
          return item1.localeCompare(item2, 'en', {sensitivity: "base"});
        }
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
        // sort alphabetically by the rendered string value
        cmp: (row1, row2) => {
          const item1 = this.renderers.created_by.body(row1.created_by);
          const item2 = this.renderers.created_by.body(row2.created_by);
          return item1.localeCompare(item2, 'en', {sensitivity: "base"});
        }
      },
      tags: {
        body: (item, _row) => {
          const tags = item;
          let display = '';
          Object.keys(tags || {}).sort().forEach(key => {
            display += `<span class='tag'>${key}`;
            if (tags[key] != null && tags[key] !== '')
              display += `=${tags[key]}`;
            display += '</span>';
          });
          return display;
        },
        // sort by number of tags, resources with more tags come first
        // if two resources have the same number of tags show them in alphabetic order
        cmp: (row1, row2) =>{
          const keys1 = Object.keys(row1.tags).sort();
          const keys2 = Object.keys(row2.tags).sort();
          if( keys1.length > keys2.length)
            return -1;
          if (keys1.length < keys2.length)
            return 1;
          const item1 = keys1.length > 0 ? keys1[0] : "";
          const item2 = keys2.length > 0 ? keys2[0] : "";
          return item1.localeCompare(item2, 'en', { sensitivity: 'base' });
        }
      },
    };
  },
});
