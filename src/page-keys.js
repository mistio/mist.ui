import '../node_modules/@polymer/app-route/app-route.js';
import '../node_modules/@mistio/mist-list/mist-list.js';
import '../node_modules/@polymer/paper-fab/paper-fab.js';
import './keys/key-actions.js';
import './keys/key-add.js';
import './keys/key-page.js';
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

      paper-dialog {
        position: fixed !important;
      }
    </style>
    <app-route route="{{route}}" pattern="/:key" data="{{data}}"></app-route>
    <template is="dom-if" if="[[_isListActive(route.path)]]" restamp>
      <key-actions
        actions="{{actions}}"
        items="[[selectedItems]]"
        model="[[model]]"
        user="[[model.user.id]]"
        members="[[model.membersArray]]"
        org="[[model.org]]"
      >
        <mist-list
          selectable
          resizable
          column-menu
          multi-sort
          apiurl="/api/v1/keys"
          id="keysList"
          name="Keys"
          primary-field-name="id"
          frozen="[[_getFrozenColumn()]]"
          visible="[[_getVisibleColumns()]]"
          selected-items="{{selectedItems}}"
          renderers="[[_getRenderers()]]"
          route="{{route}}"
          item-map="[[model.keys]]"
          user-filter="[[model.sections.keys.q]]"
          actions="[[actions]]"
          filter-method="[[_ownerFilter()]]"
        >
          <p slot="no-items-found">No keys found.</p>
        </mist-list>
      </key-actions>

      <div
        class="absolute-bottom-right"
        hidden$="[[!check_perm('add','key', null, model.org, model.user)]]"
      >
        <paper-fab id="keyAdd" icon="add" on-tap="_addResource"></paper-fab>
      </div>
    </template>
    <key-add
      model="[[model]]"
      section="[[model.sections.keys]]"
      hidden$="[[!_isAddPageActive(route.path)]]"
      docs="[[config.features.docs]]"
    ></key-add>
    <key-page
      model="[[model]]"
      key="[[_getKeyPair(data.key, model.keys)]]"
      resource-id="[[data.key]]"
      section="[[model.sections.keys]]"
      hidden$="[[!_isDetailsPageActive(route.path)]]"
    ></key-page>
  `,
  is: 'page-keys',
  behaviors: [mistListsBehavior, ownerFilterBehavior, rbacBehavior],
  properties: {
    model: {
      type: Object,
    },
    config: {
      type: Object,
    },
    actions: {
      type: Array,
    },
    selectedItems: {
      type: Array,
    },
  },

  _isAddPageActive(path) {
    return path === '/+add';
  },

  _isDetailsPageActive(path) {
    if (path && path !== '/+add' && this.querySelector('key-page')) {
      this.querySelector('key-page').updateState();
    }
    return path && path !== '/+add';
  },

  _isListActive(path) {
    return !path;
  },

  _getKeyPair(id) {
    if (this.model.keys) return this.model.keys[id];
    return '';
  },

  _addResource(_e) {
    this.dispatchEvent(
      new CustomEvent('go-to', {
        bubbles: true,
        composed: true,
        detail: {
          url: this.model.sections.keys.add,
        },
      })
    );
  },

  _getFrozenColumn() {
    return ['name'];
  },

  _getVisibleColumns() {
    return ['machines', 'isDefault', 'created_by', 'id', 'tags'];
  },

  _getRenderers(_keys) {
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
      machines: {
        body: (item, _row) => {
          return item.length;
        },
      },
      isDefault: {
        title: (_item, _row) => {
          return 'Default';
        },
        body: (item, _row) => {
          return item
            ? '<span class="default"><iron-icon icon="communication:vpn-key"></iron-icon> Default key</span>'
            : '';
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
    };
  },
});
