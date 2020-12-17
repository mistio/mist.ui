import '../node_modules/@polymer/app-route/app-route.js';
import '../node_modules/@mistio/mist-list/mist-list.js';
import '../node_modules/@polymer/paper-fab/paper-fab.js';
import './networks/network-create.js';
import './networks/network-page.js';
import './networks/network-actions.js';
import { rbacBehavior } from './rbac-behavior.js';
// import './helpers/mist-lists-behavior.js';
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
        hidden$="[[!check_perm('add','network', null, model.org, model.user)]]"
      >
        <paper-fab id="networkAdd" icon="add" on-tap="_addResource"></paper-fab>
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
  `,
  is: 'page-networks',
  behaviors: [ownerFilterBehavior, rbacBehavior],

  properties: {
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
  },

  listeners: {},

  _isAddPageActive(path) {
    return path === '/+add';
  },

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
  },

  _isListActive(path) {
    return !path;
  },

  _getNetwork(id) {
    if (this.model.networks) return this.model.networks[id];
    return '';
  },

  _addResource(_e) {
    this.dispatchEvent(
      new CustomEvent('go-to', {
        bubbles: true,
        composed: true,
        detail: { url: this.model.sections.networks.add },
      })
    );
  },

  _getFrozenColumn() {
    return ['name'];
  },

  _getVisibleColumns() {
    const ret = ['provider', 'machines', 'created_by', 'subnets', 'tags'];
    if (this.model.org && this.model.org.ownership_enabled === true)
      ret.splice(ret.indexOf('created_by'), 0, 'owned_by');
    return ret;
  },

  _getRenderers(_networks, _clouds) {
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
      provider: {
        title: 'cloud',
        body: (item, row) => {
          return _this.model &&
            _this.model.clouds &&
            _this.model.clouds[row.cloud]
            ? _this.model.clouds[row.cloud].title
            : item;
        },
      },
      machines: {
        title: 'machines',
        body: (_item, row) => {
          const machines = Object.values(_this.model.machines).filter(m => {
            return m.network === row.id;
          });
          if (machines) return machines.length;
          return '';
        },
      },
      owned_by: {
        title: 'owner',
        body: (item, _row) => {
          return _this.model.members[item]
            ? _this.model.members[item].name ||
                _this.model.members[item].email ||
                _this.model.members[item].username
            : '';
        },
      },
      created_by: {
        title: 'created by',
        body: (item, _row) => {
          return _this.model.members[item]
            ? _this.model.members[item].name ||
                _this.model.members[item].email ||
                _this.model.members[item].username
            : '';
        },
      },
      subnets: {
        body: (item, _row) => {
          return item && Object.keys(item) ? Object.keys(item).length : '';
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
