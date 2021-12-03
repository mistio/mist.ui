import '@polymer/app-route/app-route.js';
import '@mistio/mist-list/mist-list.js';
import '@polymer/paper-fab/paper-fab.js';
import './tunnels/tunnel-add.js';
import './tunnels/tunnel-actions.js';
import './tunnels/tunnel-page.js';
import { html } from '@polymer/polymer/lib/utils/html-tag.js';
import { PolymerElement } from '@polymer/polymer/polymer-element.js';
import { mixinBehaviors } from '@polymer/polymer/lib/legacy/class.js';
import { ownerFilterBehavior } from './helpers/owner-filter-behavior.js';
import { mistListsBehavior } from './helpers/mist-lists-behavior.js';

/* eslint-disable class-methods-use-this */
export default class PageTunnels extends mixinBehaviors(
  [mistListsBehavior, ownerFilterBehavior, window.rbac],
  PolymerElement
) {
  static get template() {
    return html`
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
            <div class="absolute-bottom-right" hidden$="[[!checkPerm('tunnel', 'add', null, model.org, model.user)]]">
                <paper-fab id="tunnelAdd" icon="add" on-tap="_addResource"></paper-fab>
            </div>
        </template>
        <tunnel-add model="[[model]]" section="[[model.sections.tunnels]]" hidden$=[[!_isAddPageActive(route.path)]]></tunnel-add>
        <tunnel-page model="[[model]]" tunnel$="[[_getTunnel(data.tunnel, model.tunnels, model.tunnels.*)]]" resource-id="[[data.tunnel]]" section="[[model.sections.tunnels]]" hidden$=[[!_isDetailsPageActive(route.path)]]></tunnel-page>
            </key-page>
    `;
  }

  static get is() {
    return 'page-tunnels';
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
        computed: '_getRenderers(model.tunnels)',
      },
    };
  }

  ready() {
    super.ready();
    this.addEventListener('select-action', this.selectAction);
  }

  _isAddPageActive(_path) {
    return this.route.path === '/+add';
  }

  _isDetailsPageActive(path) {
    if (
      path &&
      path !== '/+add' &&
      this.shadowRoot &&
      this.shadowRoot.querySelector('tunnel-page')
    )
      this.shadowRoot.querySelector('tunnel-page').updateState();
    return path && path !== '/+add';
  }

  _isListActive(_path) {
    return !this.route.path;
  }

  _getTunnel(id) {
    if (this.model.tunnels) return this.model.tunnels[id];
    return '';
  }

  _addResource(_e) {
    this.dispatchEvent(
      new CustomEvent('go-to', {
        bubbles: true,
        composed: true,
        detail: {
          url: this.model.sections.tunnels.add,
        },
      })
    );
  }

  _getFrozenLogColumn() {
    return ['name'];
  }

  _getVisibleColumns() {
    const ret = ['cidrs', 'created_by', 'id', 'tags'];
    if (this.model.org && this.model.org.ownership_enabled === true)
      ret.push('owned_by');
    return ret;
  }

  _getRenderers(_tunnels) {
    const _this = this;
    return {
      name: {
        body: (item, _row) => `<strong class="name">${item}</strong>`,
        cmp: (row1, row2) =>
          row1.name.localeCompare(row2.name, 'en', {
            sensitivity: 'base',
          }),
      },
      cidrs: {
        body: (item, _row) => {
          if (item) return item.join(', ');
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

  selectAction(e) {
    e.stopImmediatePropagation();
    if (this.shadowRoot.querySelector('#tunnelsList')) {
      this.shadowRoot
        .querySelector('#tunnelsList')
        .shadowRoot.querySelector('#actions')
        .selectAction(e);
    }
  }
}

customElements.define('page-tunnels', PageTunnels);
