import '@polymer/app-route/app-route.js';
import '@mistio/mist-list/mist-list.js';
import '@polymer/paper-fab/paper-fab.js';
import './networks/network-create.js';
import './networks/network-page.js';
import './networks/network-actions.js';
// import './helpers/mist-lists-behavior.js';
import { html } from '@polymer/polymer/lib/utils/html-tag.js';
import { PolymerElement } from '@polymer/polymer/polymer-element.js';
import { mixinBehaviors } from '@polymer/polymer/lib/legacy/class.js';
import { ownerFilterBehavior } from './helpers/owner-filter-behavior.js';

/* eslint-disable class-methods-use-this */
export default class PageNetworks extends mixinBehaviors(
  [ownerFilterBehavior, window.rbac],
  PolymerElement
) {
  static get template() {
    return html`
      <style include="shared-styles">
        [hidden] {
          display: none !important;
        }
      </style>
      <app-route
        route="{{route}}"
        pattern="/:network"
        data="{{data}}"
      ></app-route>
      <template is="dom-if" if="[[_isListActive(route.path)]]" restamp>
        <network-actions
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
            id="networksList"
            apiurl="/api/v1/networks"
            item-map="[[model.networks]]"
            name="Networks"
            selected-items="{{selectedItems}}"
            filtered-items-length="{{filteredItemsLength}}"
            combined-filter="{{combinedFilter}}"
            frozen="[[_getFrozenColumn()]]"
            visible="[[_getVisibleColumns()]]"
            renderers="[[_getRenderers()]]"
            route="{{route}}"
            user-filter="[[model.sections.networks.q]]"
            primary-field-name="id"
            filter-method="[[_ownerFilter()]]"
            actions="[[actions]]"
          >
            <p slot="no-items-found">No networks found.</p>
          </mist-list>
        </network-actions>
        <div
          class="absolute-bottom-right"
          hidden$="[[!checkPerm('network', 'add', null, model.org, model.user)]]"
        >
          <paper-fab
            id="networkAdd"
            icon="add"
            on-tap="_addResource"
          ></paper-fab>
        </div>
      </template>
      <network-create
        model="[[model]]"
        section="[[model.sections.networks]]"
        hidden$="[[!_isAddPageActive(route.path)]]"
      ></network-create>
      <network-page
        model="[[model]]"
        network="[[_getNetwork(data.network, model.networks, model.networks.*)]]"
        resource-id="[[data.network]]"
        section="[[model.sections.networks]]"
        hidden$="[[!_isDetailsPageActive(route.path)]]"
      ></network-page>
    `;
  }

  static get is() {
    return 'page-networks';
  }

  static get properties() {
    return {
      model: {
        type: Object,
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
        computed: '_getRenderers(model.networks)',
      },
    };
  }

  _isAddPageActive(_path) {
    return this.route.path === '/+add';
  }

  _isDetailsPageActive(path) {
    if (
      path &&
      path !== '/+add' &&
      this.shadowRoot &&
      this.shadowRoot.querySelector('network-page')
    ) {
      this.shadowRoot.querySelector('network-page').updateState();
    }
    return path && path !== '/+add';
  }

  _isListActive(_path) {
    return !this.route.path;
  }

  _getNetwork(id) {
    if (this.model.networks) return this.model.networks[id];
    return '';
  }

  _addResource(_e) {
    this.dispatchEvent(
      new CustomEvent('go-to', {
        bubbles: true,
        composed: true,
        detail: { url: this.model.sections.networks.add },
      })
    );
  }

  _getFrozenColumn() {
    return ['name'];
  }

  _getVisibleColumns() {
    const ret = ['cloud', 'machines', 'created_by', 'subnets', 'tags'];
    if (this.model.org && this.model.org.ownership_enabled === true)
      ret.splice(ret.indexOf('created_by'), 0, 'owned_by');
    return ret;
  }

  _getRenderers(_networks, _clouds) {
    const _this = this;
    return {
      name: {
        body: (item, _row) => `<strong class="name">${item}</strong>`,
        cmp: (row1, row2) =>
          row1.name.localeCompare(row2.name, 'en', {
            sensitivity: 'base',
          }),
      },
      icon: {
        body: (_item, row) => {
          if (!_this.model.clouds[row.cloud]) return '';
          return `./assets/providers/provider-${_this.model.clouds[
            row.cloud
          ].provider
            .replace('_', '')
            .replace(' ', '')}.png`;
        },
      },
      cloud: {
        title: 'cloud',
        body: (item, row) =>
          _this.model && _this.model.clouds && _this.model.clouds[row.cloud]
            ? _this.model.clouds[row.cloud].name
            : item,
        cmp: (row1, row2) => {
          const item1 = this.renderers.cloud.body(row1.cloud, row1);
          const item2 = this.renderers.cloud.body(row2.cloud, row2);
          return item1.localeCompare(item2, 'en', { sensitivity: 'base' });
        },
      },
      machines: {
        title: 'machines',
        body: (_item, row) => {
          const machines = Object.values(_this.model.machines).filter(
            m => m.network === row.id
          );
          if (machines) return machines.length;
          return '';
        },
        cmp: (row1, row2) => {
          const item1 = Object.values(this.model.machines).filter(
            m => m.network === row1.id
          );
          const item2 = Object.values(this.model.machines).filter(
            m => m.network === row2.id
          );
          if (item1 == null) {
            return -1;
          }
          if (item2 == null) {
            return 1;
          }
          if (item1.length > item2.length) return 1;
          if (item2.length > item1.length) return -1;
          return 0;
        },
      },
      owned_by: {
        title: 'owner',
        body: (item, _row) =>
          _this.model.members[item]
            ? _this.model.members[item].name ||
              _this.model.members[item].email ||
              _this.model.members[item].username
            : '',
        cmp: (row1, row2) => {
          const item1 = this.renderers.owned_by.body(row1.owned_by);
          const item2 = this.renderers.owned_by.body(row2.owned_by);
          return item1.localeCompare(item2, 'en', { sensitivity: 'base' });
        },
      },
      created_by: {
        title: 'created by',
        body: (item, _row) =>
          _this.model.members[item]
            ? _this.model.members[item].name ||
              _this.model.members[item].email ||
              _this.model.members[item].username
            : '',
        cmp: (row1, row2) => {
          const item1 = this.renderers.created_by.body(row1.created_by);
          const item2 = this.renderers.created_by.body(row2.created_by);
          return item1.localeCompare(item2, 'en', { sensitivity: 'base' });
        },
      },
      subnets: {
        body: (item, _row) =>
          item && Object.keys(item) ? Object.keys(item).length : '',
        cmp: (row1, row2) => {
          const item1 =
            row1.subnets && Object.keys(row1.subnets)
              ? Object.keys(row1.subnets).length
              : 0;
          const item2 =
            row2.subnets && Object.keys(row2.subnets)
              ? Object.keys(row2.subnets).length
              : 0;
          if (item1 < item2) return -1;
          if (item2 < item1) return 1;
          return 0;
        },
      },
      state: {
        body: (_item, row) => {
          const { provider } = _this.model.clouds[row.cloud];
          if (provider === 'ec2')
            return row.extra && row.extra.state !== undefined
              ? row.extra.state
              : '';
          if (provider === 'openstack')
            return row.admin_state_up !== undefined
              ? `admin state up:${row.admin_state_up}`
              : '';
          return '';
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

customElements.define('page-networks', PageNetworks);
