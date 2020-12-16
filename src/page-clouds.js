import '../node_modules/@polymer/app-route/app-route.js';
import '../node_modules/@mistio/mist-list/mist-list.js';
import '../node_modules/@polymer/paper-fab/paper-fab.js';
import './clouds/cloud-add.js';
import './clouds/cloud-page.js';
import './clouds/cloud-actions.js';
import './helpers/mist-lists-behavior.js';
import PROVIDERS from './helpers/providers.js';
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
    </style>
    <app-route route="{{route}}" pattern="/:cloud" data="{{data}}"></app-route>
    <template is="dom-if" if="[[_isListActive(route.path)]]" restamp>
      <cloud-actions
        id="actions"
        items="[[selectedItems]]"
        actions="{{actions}}"
        providers="[[providers]]"
        portal-name="[[portalName]]"
      >
        <mist-list
          selectable
          resizable
          column-menu
          multi-sort
          id="cloudsList"
          apiurl="/api/v1/clouds"
          item-map="[[model.clouds]]"
          selected-items="{{selectedItems}}"
          renderers="[[_getRenderers()]]"
          frozen="[[_getFrozenLogColumn()]]"
          visible="[[_getVisibleColumns()]]"
          route="{{route}}"
          user-filter="[[model.sections.clouds.q]]"
          primary-field-name="id"
          filter-method="[[_ownerFilter()]]"
          hidden$="[[!_isListActive(route.path)]]"
          actions="[[actions]]"
        >
          <p slot="no-items-found">No clouds found.</p>
        </mist-list>
      </cloud-actions>
      <div
        class="absolute-bottom-right"
        hidden$="[[!check_perm('add','cloud')]]"
      >
        <paper-fab id="cloudAdd" icon="add" on-tap="_addResource"></paper-fab>
      </div>
    </template>
    <cloud-add
      providers="[[providers]]"
      keys="[[model.keysArray]]"
      section="[[model.sections.clouds]]"
      clouds="[[model.cloudsArray]]"
      enable-monitoring="[[enableMonitoring]]"
      hidden$="[[!_isAddPageActive(route.path)]]"
      portal-name="[[portalName]]"
      docs="[[docs]]"
      org="[[model.org]]"
      enable-billing="[[enableBilling]]"
    ></cloud-add>
    <cloud-page
      model="[[model]]"
      providers="[[providers]]"
      cloud="[[cloud]]"
      section="[[model.sections.clouds]]"
      resource-id="[[data.cloud]]"
      hidden$="[[!_isDetailsPageActive(route.path)]]"
      portal-name="[[portalName]]"
    ></cloud-page>
  `,
  is: 'page-clouds',
  behaviors: [ownerFilterBehavior, rbacBehavior],
  properties: {
    model: {
      type: Object,
    },
    data: {
      type: Object,
    },
    selectedItems: {
      type: Array,
    },
    enableMonitoring: {
      type: Boolean,
    },
    providers: {
      type: Object,
      value: PROVIDERS,
    },
    enableBilling: {
      type: Boolean,
    },
    cloud: {
      type: Object,
      computed: '_getCloud(data.cloud, model.clouds)',
    },
    actions: {
      type: Array,
    },
    portalName: {
      type: String,
      value: 'Mist.io',
    },
    docs: {
      type: String,
    },
  },

  _getFrozenLogColumn() {
    return ['title'];
  },

  _getVisibleColumns() {
    const ret = [
      'state',
      'provider',
      'region',
      'machines',
      'volumes',
      'locations',
      'id',
      'tags',
    ];
    if (this.model.org && this.model.org.ownership_enabled === true)
      ret.splice(ret.length - 1, 0, 'owned_by');
    return ret;
  },

  _getRenderers(_keys) {
    const _this = this;
    return {
      title: {
        body: (item, _row) => {
          return `<strong class="name">${item}</strong>`;
        },
      },
      icon: {
        body: (_item, row) => {
          if (!row.provider) return '';
          return `./assets/providers/provider-${row.provider
            .replace('_', '')
            .replace(' ', '')}.png`;
        },
      },
      machines: {
        body: (item, _row) => {
          return (item && Object.keys(item).length) || 0;
        },
      },
      volumes: {
        body: (item, _row) => {
          return (item && Object.keys(item).length) || 0;
        },
      },
      locations: {
        body: (item, _row) => {
          return (item && Object.keys(item).length) || 0;
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

  _isAddPageActive(path) {
    return path === '/+add';
  },

  _isListActive(path) {
    if (path && this.querySelector('cloud-page'))
      this.querySelector('cloud-page').updateState();
    return !path;
  },

  _isDetailsPageActive(path) {
    if (
      path &&
      path !== '/+add' &&
      this.shadowRoot &&
      this.shadowRoot.querySelector('cloud-page')
    ) {
      this.shadowRoot.querySelector('cloud-page').updateState();
    }
    return path && path !== '/+add';
  },

  _getCloud(id) {
    if (this.model.clouds && id) return this.model.clouds[id];
    return '';
  },

  _addResource(_e) {
    this.dispatchEvent(
      new CustomEvent('go-to', {
        bubbles: true,
        composed: true,
        detail: { url: this.model.sections.clouds.add },
      })
    );
  },
});
