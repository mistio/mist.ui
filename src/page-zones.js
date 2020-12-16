import '../node_modules/@polymer/app-route/app-route.js';
import '../node_modules/@mistio/mist-list/mist-list.js';
import '../node_modules/@polymer/paper-fab/paper-fab.js';
import './zones/zone-add.js';
import './zones/zone-actions.js';
import './zones/zone-page.js';
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
    <!-- <app-location route="{{route}}"></app-location> -->
    <app-route route="{{route}}" pattern="/:zone" data="{{data}}"></app-route>
    <template is="dom-if" if="[[_isListActive(route.path)]]" restamp>
      <zone-actions
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
          id="zonesList"
          apiurl="/api/v1/zones"
          item-map="[[model.zones]]"
          name="Zones"
          selected-items="{{selectedItems}}"
          filtered-items-length="{{filteredItemsLength}}"
          combined-filter="{{combinedFilter}}"
          frozen="[[_getFrozenColumn()]]"
          visible="[[_getVisibleColumns()]]"
          renderers="[[_getRenderers()]]"
          route="{{route}}"
          user-filter="[[model.sections.zones.q]]"
          primary-field-name="id"
          filter-method="[[_ownerFilter()]]"
          actions="[[actions]]"
        >
          <p slot="no-items-found">No zones found.</p>
        </mist-list>
      </zone-actions>

      <div
        class="absolute-bottom-right"
        hidden$="[[!check_perm('add','zone', null, model.org, model.user)]]"
      >
        <paper-fab id="zoneAdd" icon="add" on-tap="_addResource"></paper-fab>
      </div>
    </template>
    <zone-add
      model="[[model]]"
      section="[[model.sections.zones]]"
      hidden$="[[!_isAddPageActive(route.path)]]"
    ></zone-add>
    <zone-page
      model="[[model]]"
      zone="[[_getZone(data.zone, model.zones, model.zones.*)]]"
      resource-id="[[data.zone]]"
      section="[[model.sections.zones]]"
      hidden$="[[!_isDetailsPageActive(route.path)]]"
    ></zone-page>
  `,
  is: 'page-zones',
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

  listeners: {},

  _isAddPageActive(path) {
    return path === '/+add';
  },
  _isDetailsPageActive(path) {
    if (
      path &&
      path !== '/+add' &&
      this.shadowRoot &&
      this.shadowRoot.querySelector('zone-page')
    )
      this.shadowRoot.querySelector('zone-page').updateState();
    return path && path !== '/+add';
  },
  _isListActive(path) {
    return !path;
  },
  _getZone(id) {
    if (this.model.zones) return this.model.zones[id];
    return '';
  },
  _addResource(_e) {
    this.dispatchEvent(
      new CustomEvent('go-to', {
        bubbles: true,
        composed: true,
        detail: {
          url: this.model.sections.zones.add,
        },
      })
    );
  },
  _getFrozenColumn() {
    return ['domain'];
  },

  _getVisibleColumns() {
    const ret = [
      'provider',
      'type',
      'created_by',
      'id',
      'ttl',
      'records',
      'tags',
    ];
    if (this.model.org && this.model.org.ownership_enabled === true)
      ret.splice(ret.indexOf('created_by'), 0, 'owned_by');
    return ret;
  },

  _getRenderers(_zones) {
    const _this = this;
    const providerMap = {
      gce: 'Google',
      ec2: 'Route53',
      digitalocean: 'DigitalOcean',
      linode: 'Linode',
      vultr: 'Vultr',
      softlayer: 'SoftLayer',
    };
    return {
      domain: {
        body: (item, _row) => {
          return `<strong class="name">${item}</strong>`;
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
        body: (_item, row) => {
          if (_this.model.clouds && _this.model.clouds[row.cloud]) {
            const { provider } = _this.model.clouds[row.cloud];
            return providerMap[provider] || provider;
          }
          return '';
        },
      },
      records: {
        body: (item, _row) => {
          const ids = item ? Object.keys(item) : [];
          return ids.length;
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
