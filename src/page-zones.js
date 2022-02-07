import '@polymer/app-route/app-route.js';
import '@mistio/mist-list/mist-list.js';
import '@polymer/paper-fab/paper-fab.js';
import './zones/zone-add.js';
import './zones/zone-actions.js';
import './zones/zone-page.js';
import { html } from '@polymer/polymer/lib/utils/html-tag.js';
import { PolymerElement } from '@polymer/polymer/polymer-element.js';
import { mixinBehaviors } from '@polymer/polymer/lib/legacy/class.js';
import { ownerFilterBehavior } from './helpers/owner-filter-behavior.js';
import { mistListsBehavior } from './helpers/mist-lists-behavior.js';

/* eslint-disable class-methods-use-this */
export default class PageZones extends mixinBehaviors(
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
          hidden$="[[!checkPerm('zone', 'add', null, model.org, model.user)]]"
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
    `;
  }

  static get is() {
    return 'page-zones';
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
      this.shadowRoot.querySelector('zone-page')
    )
      this.shadowRoot.querySelector('zone-page').updateState();
    return path && path !== '/+add';
  }

  _isListActive(_path) {
    return !this.route.path;
  }

  _getZone(id) {
    if (this.model.zones) return this.model.zones[id];
    return '';
  }

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
  }

  _getFrozenColumn() {
    return ['domain'];
  }

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
  }

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
        body: (item, _row) => `<strong class="name">${item}</strong>`,
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
        cmp: (row1, row2) => {
          const providers = [];
          for (const row of [row1, row2]) {
            providers.push(this.model.clouds[row.cloud]);
          }
          const item1 = providerMap[providers[0]] || providers[0];
          const item2 = providerMap[providers[1]] || providers[1];

          return item1.localeCompare(item2, 'en', { sensivity: 'base' });
        },
      },
      records: {
        body: (item, _row) => {
          const ids = item ? Object.keys(item) : [];
          return ids.length;
        },
        cmp: (row1, row2) => {
          const item1 = row1.records ? Object.keys(row1.recodrds).length : 0;
          const item2 = row2.records ? Object.keys(row2.recodrds).length : 0;
          if (item1 < item2) return -1;
          if (item2 < item1) return 1;
          return 0;
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
        cmp: (row1, row2) => {
          const item1 = this.model.members[row1.owned_by]
            ? this.model.members[row1.owned_by].name ||
              this.model.members[row1.owned_by].email ||
              this.model.members[row1.owned_by].username
            : '';
          const item2 = this.model.members[row2.owned_by]
            ? this.model.members[row2.owned_by].name ||
              this.model.members[row2.owned_by].email ||
              this.model.members[row2.owned_by].username
            : '';
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
        cmp: (row1, row2) => {
          const item1 = this.model.members[row1.created_by]
            ? this.model.members[row1.owned_by].name ||
              this.model.members[row1.owned_by].email ||
              this.model.members[row1.owned_by].username
            : '';
          const item2 = this.model.members[row2.created_by]
            ? this.model.members[row2.owned_by].name ||
              this.model.members[row2.owned_by].email ||
              this.model.members[row2.owned_by].username
            : '';
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
}

customElements.define('page-zones', PageZones);
