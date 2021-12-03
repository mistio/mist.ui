import '@polymer/app-route/app-route.js';
import '@mistio/mist-list/mist-list.js';
import '@polymer/paper-fab/paper-fab.js';
import './stacks/stack-create.js';
import './stacks/stack-page.js';
import './stacks/stack-actions.js';
import { html } from '@polymer/polymer/lib/utils/html-tag.js';
import { PolymerElement } from '@polymer/polymer/polymer-element.js';
import { mixinBehaviors } from '@polymer/polymer/lib/legacy/class.js';
import { ownerFilterBehavior } from './helpers/owner-filter-behavior.js';
/* eslint-disable class-methods-use-this */

export default class PageStacks extends mixinBehaviors(
  [ownerFilterBehavior, window.rbac],
  PolymerElement
) {
  static get template() {
    return html`
      <style include="shared-styles">
        [hidden] {
          display: none !important;
        }
        mist-list::slotted(.error) {
          color: var(--red-color);
        }
      </style>
      <app-route
        route="{{route}}"
        pattern="/:stack"
        data="{{data}}"
      ></app-route>
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
    `;
  }

  static get is() {
    return 'page-stacks';
  }

  static get properties() {
    return {
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
      renderers: {
        type: Object,
        computed: '_getRenderers(model.stacks)',
      },
    };
  }

  _isAddPageActive(_path) {
    return this.route.path.split('?')[0] === '/+create';
  }

  _isDetailsPageActive(_path) {
    return this.route.path && this.route.path.split('?')[0] !== '/+create';
  }

  _isListActive(_path) {
    return !this.route.path;
  }

  _getStack(id) {
    if (this.model.stacks) {
      return this.model.stacks[id];
    }
    return '';
  }

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
  }

  _getFrozenColumn() {
    return ['name'];
  }

  _getVisibleColumns() {
    const ret = ['template', 'status', 'created_by', 'tags'];
    if (this.model.org && this.model.org.ownership_enabled === true)
      ret.splice(ret.indexOf('created_by'), 0, 'owned_by');
    return ret;
  }

  _getRenderers(_stacks, _templates) {
    const _this = this;
    return {
      name: {
        body: (item, _row) => `<strong class="name">${item}</strong>`,
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
        title: (_item, _row) => 'owner',
        body: (item, _row) =>
          _this.model.members[item]
            ? _this.model.members[item].name ||
              _this.model.members[item].email ||
              _this.model.members[item].username
            : '',
        // sort alphabetically by the rendered string value
        cmp: (row1, row2) => {
          const item1 = this.renderers.owned_by.body(row1.owned_by);
          const item2 = this.renderers.owned_by.body(row2.owned_by);
          return item1.localeCompare(item2, 'en', { sensitivity: 'base' });
        },
      },
      created_by: {
        title: (_item, _row) => 'created by',
        body: (item, _row) =>
          _this.model.members[item]
            ? _this.model.members[item].name ||
              _this.model.members[item].email ||
              _this.model.members[item].username
            : '',
        // sort alphabetically by the rendered string value
        cmp: (row1, row2) => {
          const item1 = this.renderers.created_by.body(row1.created_by);
          const item2 = this.renderers.created_by.body(row2.created_by);
          return item1.localeCompare(item2, 'en', { sensitivity: 'base' });
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
          Object.keys(tags || {})
            .sort()
            .forEach(key => {
              display += `<span class='tag'>${key}`;
              if (tags[key] != null && tags[key] !== '')
                display += `=${tags[key]}`;
              display += '</span>';
            });
          return display;
        },
        // sort by number of tags, resources with more tags come first
        // if two resources have the same number of tags show them in alphabetic order
        cmp: (row1, row2) => {
          const keys1 = Object.keys(row1.tags).sort();
          const keys2 = Object.keys(row2.tags).sort();
          if (keys1.length > keys2.length) return -1;
          if (keys1.length < keys2.length) return 1;
          const item1 = keys1.length > 0 ? keys1[0] : '';
          const item2 = keys2.length > 0 ? keys2[0] : '';
          return item1.localeCompare(item2, 'en', { sensitivity: 'base' });
        },
      },
    };
  }
}

customElements.define('page-stacks', PageStacks);
