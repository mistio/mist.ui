import '../node_modules/@polymer/app-route/app-route.js';
import '../node_modules/@mistio/mist-list/mist-list.js';
import '../node_modules/@polymer/paper-fab/paper-fab.js';
import './stacks/stack-create.js';
import './stacks/stack-page.js';
import './stacks/stack-actions.js';
import { rbacBehavior } from './rbac-behavior.js';
import { ownerFilterBehavior } from './helpers/owner-filter-behavior.js';
import { Polymer } from '../node_modules/@polymer/polymer/lib/legacy/polymer-fn.js';
import { html } from '../node_modules/@polymer/polymer/lib/utils/html-tag.js';

Polymer({
  _template: html`
    <style include="shared-styles">
      [hidden] {
        display: none !important;
      }
      mist-list::slotted(.error) {
        color: var(--red-color);
      }
    </style>
    <app-route route="{{route}}" pattern="/:stack" data="{{data}}"></app-route>
    <template is="dom-if" if="[[_isListActive(route.path)]]" restamp>
      <stack-actions
        id="actions"
        items="[[selectedItems]]"
        actions="{{actions}}"
        user="[[model.user.id]]"
        members="[[model.membersArray]]"
        org="[[model.org]]"
      >
        <mist-list
          selectable
          resizable
          column-menu
          multi-sort
          id="stacksList"
          apiurl="/api/v1/stacks"
          item-map="[[model.stacks]]"
          name="Stacks"
          selected-items="{{selectedItems}}"
          filtered-items-length="{{filteredItemsLength}}"
          combined-filter="{{combinedFilter}}"
          frozen="[[_getFrozenColumn()]]"
          visible="[[_getVisibleColumns()]]"
          renderers="[[_getRenderers()]]"
          route="{{route}}"
          user-filter="[[model.sections.stacks.q]]"
          primary-field-name="id"
          filter-method="[[_ownerFilter()]]"
          actions="[[actions]]"
        >
          <p slot="no-items-found">No stacks found.</p>
        </mist-list>
      </stack-actions>
    </template>
    <stack-create
      model="[[model]]"
      section="[[model.sections.stacks]]"
      params="[[route.__queryParams]]"
      hidden$="[[!_isAddPageActive(route.path)]]"
    ></stack-create>
    <stack-page
      model="[[model]]"
      stack="[[_getStack(data.stack, model.stacks, model.stacks.*)]]"
      resource-id="[[data.stack]]"
      section="[[model.sections.stacks]]"
      hidden$="[[!_isDetailsPageActive(route.path)]]"
    ></stack-page>
  `,
  is: 'page-stacks',
  behaviors: [ownerFilterBehavior, rbacBehavior],

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

  listeners: {},
  _isAddPageActive(path) {
    return path.split('?')[0] === '/+create';
  },
  _isDetailsPageActive(path) {
    return path && path.split('?')[0] !== '/+create';
  },
  _isListActive(path) {
    return !path;
  },
  _getStack(id) {
    if (this.model.stacks) {
      return this.model.stacks[id];
    }
    return '';
  },
  _addResource(_e) {
    this.dispatchEvent(
      new CustomEvent('go-to', {
        bubbles: true,
        composed: true,
        detail: {
          url: this.model.sections.stacks.add,
        },
      })
    );
  },
  _getFrozenColumn() {
    return ['name'];
  },

  _getVisibleColumns() {
    const ret = ['template', 'status', 'created_by', 'tags'];
    if (this.model.org && this.model.org.ownership_enabled === true)
      ret.splice(ret.indexOf('created_by'), 0, 'owned_by');
    return ret;
  },

  _getRenderers(_stacks, _templates) {
    const _this = this;
    return {
      name: {
        body: (item, _row) => {
          return `<strong class="name">${item}</strong>`;
        },
      },
      template: {
        body: (item, _row) => {
          if (_this.model && _this.model.templates)
            return _this.model.templates[item]
              ? _this.model.templates[item].name
              : 'missing template';
          return '';
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
      status: {
        body: (item, _row) => {
          if (item === 'error') {
            return `<span class='error'>${item
              .charAt(0)
              .toUpperCase()}${item.slice(1)}</span>`;
          }
          return item ? item.replace(/_/g, ' ') : '';
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
    };
  },
});
