import '@polymer/app-route/app-route.js';
import '@mistio/mist-list/mist-list.js';
import '@polymer/paper-fab/paper-fab.js';
import './scripts/script-add.js';
import './scripts/script-page.js';
import './scripts/script-actions.js';
import { html } from '@polymer/polymer/lib/utils/html-tag.js';
import { PolymerElement } from '@polymer/polymer/polymer-element.js';
import { mixinBehaviors } from '@polymer/polymer/lib/legacy/class.js';
import { ownerFilterBehavior } from './helpers/owner-filter-behavior.js';
import { mistListsBehavior } from './helpers/mist-lists-behavior.js';

/* eslint-disable class-methods-use-this */
export default class PageScripts extends mixinBehaviors(
  [mistListsBehavior, ownerFilterBehavior, window.rbac],
  PolymerElement
) {
  static get template() {
    return html`
      <style include="shared-styles">
        :host {
          display: block;
        }
        [hidden] {
          display: none !important;
        }
      </style>
      <app-route
        route="{{route}}"
        pattern="/:script"
        data="{{data}}"
      ></app-route>
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
          hidden$="[[!checkPerm('script', 'add', null, model.org, model.user)]]"
        >
          <paper-fab
            id="scriptAdd"
            icon="add"
            on-tap="_addResource"
          ></paper-fab>
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
    `;
  }

  static get is() {
    return 'page-scripts';
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
        computed: '_getRenderers(model.scripts)',
      },
    };
  }

  _isAddPageActive(_path) {
    return this.route.path === '/+add';
  }

  _isDetailsPageActive(_path) {
    return (
      this.route.path &&
      this.route.path !== '/+add' &&
      !this.route.path.endsWith('+run')
    );
  }

  _isRunPageActive(_path) {
    return this.route.path && this.route.path.endsWith('+run');
  }

  _isListActive(_path) {
    return !this.route.path;
  }

  _getScript(id) {
    if (this.model && this.model.scripts && id) {
      return this.model.scripts[id];
    }
    return '';
  }

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
  }

  _getFrozenColumn() {
    return ['name'];
  }

  _getVisibleColumns() {
    const ret = ['exec_type', 'created_by', 'location', 'tags'];
    if (this.model.org && this.model.org.ownership_enabled === true)
      ret.splice(ret.indexOf('created_by'), 0, 'owned_by');
    return ret;
  }

  _getRenderers() {
    const _this = this;
    return {
      name: {
        body: (item, _row) => `<strong class="name">${item}</strong>`,
        cmp: (row1, row2) =>
          row1.name.localeCompare(row2.name, 'en', {
            sensitivity: 'base',
          }),
      },
      exec_type: {
        title: (_item, _row) => 'exec type',
        body: (item, _row) => item,
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
      location: {
        title: (_item, _row) => 'location type',
        body: (item, _row) => item.type,
        // sort alphabetically by the rendered string value
        cmp: (row1, row2) => {
          const item1 = row1.location.type;
          const item2 = row2.location.type;
          return item1.localeCompare(item2, 'en', { sensitivity: 'base' });
        },
      },
    };
  }
}

customElements.define('page-scripts', PageScripts);
