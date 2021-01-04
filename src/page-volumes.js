import '../node_modules/@polymer/polymer/polymer-legacy.js';
import '../node_modules/@polymer/app-route/app-route.js';
import '../node_modules/@mistio/mist-list/mist-list.js';
import '../node_modules/@polymer/paper-fab/paper-fab.js';
import './volumes/volume-create.js';
import './volumes/volume-page.js';
import './volumes/volume-actions.js';
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
    <app-route route="{{route}}" pattern="/:volume" data="{{data}}"></app-route>
    <template is="dom-if" if="[[_isListActive(route.path)]]" restamp>
      <volume-actions
        id="actions"
        slot="actions"
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
          apiurl="/api/v1/volumes"
          id="volumesList"
          name="Volumes"
          selected-items="{{selectedItems}}"
          filtered-items-length="{{filteredItemsLength}}"
          route="{{route}}"
          frozen="[[_getFrozenColumn()]]"
          visible="[[_getVisibleColumns(model.org)]]"
          item-map="[[model.volumes]]"
          renderers="[[_getRenderers()]]"
          primary-field-name="id"
          user-filter="[[model.sections.volumes.q]]"
          filter-method="[[_ownerFilter()]]"
          actions="[[actions]]"
        >
          <p slot="no-items-found">No volumes found.</p>
        </mist-list>
      </volume-actions>
      <div
        class="absolute-bottom-right"
        hidden$="[[!checkPerm('add','volume', null, model.org, model.user)]]"
      >
        <paper-fab id="volumeAdd" icon="add" on-tap="_addResource"></paper-fab>
      </div>
    </template>
    <volume-create
      model="[[model]]"
      section="[[model.sections.volumes]]"
      hidden$="[[!_isAddPageActive(route.path)]]"
    ></volume-create>
    <volume-page
      model="[[model]]"
      volume="[[_getVolume(data.volume, model.volumes, model.volumes.*)]]"
      resource-id="[[data.volume]]"
      section="[[model.sections.volumes]]"
      hidden$="[[!_isDetailsPageActive(route.path)]]"
    ></volume-page>
  `,
  is: 'page-volumes',
  behaviors: [ownerFilterBehavior, window.rbac],

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
    renderers:{
      type: Object,
      computed: '_getRenderers(model.volumes)'
    }
  },

  _isAddPageActive(path) {
    return path === '/+add';
  },

  _isDetailsPageActive(path) {
    return path && path !== '/+add';
  },

  _isListActive(path) {
    return !path;
  },

  _getVolume(id) {
    // console.log('_getVolume',this.model.volumes);
    if (this.model.volumes) {
      return this.model.volumes[id];
    }
    return '';
  },

  _addResource(_e) {
    this.dispatchEvent(
      new CustomEvent('go-to', {
        bubbles: true,
        composed: true,
        detail: {
          url: this.model.sections.volumes.add,
        },
      })
    );
  },

  _getFrozenColumn() {
    return ['name'];
  },

  _getVisibleColumns() {
    const ret = [
      'provider',
      'size',
      'attached_to',
      'owned_by',
      'created_by',
      'tags',
    ];
    if (this.model.org && this.model.org.ownership_enabled !== true)
      ret.splice(ret.indexOf('owned_by'), 1);
    return ret;
  },

  _getRenderers(_volumes, _clouds) {
    const _this = this;
    return {
      name: {
        body: (item, row) => {
          return `<strong class="name">${item || row.external_id}</strong>`;
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
        cmp: (row1, row2) => {
          const item1 = this.renderers.provider.body(row1.cloud, row1);
          const item2 = this.renderers.provider.body(row2.cloud, row2);
          return item1.localeCompare(item2, 'en', {sensitivity: "base"});
        }
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
        cmp: (row1, row2) => {
          const item1 = this.renderers.owned_by.body(row1.owned_by);
          const item2 = this.renderers.owned_by.body(row2.owned_by);
          return item1.localeCompare(item2, 'en', {sensitivity: "base"});
        }
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
        cmp: (row1, row2) => {
          const item1 = this.renderers.created_by.body(row1.created_by);
          const item2 = this.renderers.created_by.body(row2.created_by);
          return item1.localeCompare(item2, 'en', {sensitivity: "base"});
        }
      },
      size: {
        body: (item, _row) => {
          return `<span style="display:block;text-align:right; padding-right:50px;">${item} GΒ</span>`;
        },
        cmp: (row1, row2) => {
          if (row1.size < row2.size)
            return -1;
          if (row1.size > row2.size)
            return 1;
          return 0;
        }
      },
      attached_to: {
        title: 'attached to',
        body: (item, _row) => {
          if (item)
            return item
              .map(
                x =>
                  (_this.model.machines[x] && _this.model.machines[x].name) ||
                  ''
              )
              .sort().join(' ');
          return '';
        },
        cmp: (row1, row2) =>{
          const item1 = row1.attached_to.map(x => this.model.machines[x] && this.model.machines[x].name || '').sort().join();
          const item2 = row2.attached_to.map(x => this.model.machines[x] && this.model.machines[x].name || '').sort().join();
          return item1.localeCompare(item2, 'en', {sensitivity: 'base'});
        }
      },
      volume_type: {
        title: 'volume type',
        body: (_item, row) => {
          return (row && row.extra && row.extra.volume_type) || '';
        },
      },
      state: {
        body: (_item, row) => {
          return (row && row.extra && row.extra.state) || '';
        },
      },
      location: {
        body: (item, row) => {
          return _this.model &&
            _this.model.clouds &&
            _this.model.clouds[row.cloud] &&
            _this.model.clouds[row.cloud].locations &&
            _this.model.clouds[row.cloud].locations[item]
            ? _this.model.clouds[row.cloud].locations[item].name
            : item;
        },
        cmp: (row1, row2) => {
          const item1 = this.renderers.location.body(row1.location, row1);
          const item2 = this.renderers.location.body(row2.location, row2);

          if (item1 == null) {
            return -1;
          }
          if (item2 == null) {
            return 1;
          }
          return item1.localeCompare(item2, 'en', { sensitivity: 'base' });
        },
      },
      tags: {
        body: (item, _row) => {
          const tags = item;
          let display = '';
          Object.keys(tags || {}).sort().forEach(key => {
            display += `<span class='tag'>${key}`;
            if (tags[key] !== undefined && tags[key] !== '')
              display += `=${tags[key]}`;
            display += '</span>';
          });
          return display;
        },
        // sort by number of tags, resources with more tags come first
        // if two resources have the same number of tags show them in alphabetic order
        cmp: (row1, row2) =>{
          const keys1 = Object.keys(row1.tags).sort();
          const keys2 = Object.keys(row2.tags).sort();
          if( keys1.length > keys2.length)
            return -1;
          if (keys1.length < keys2.length)
            return 1;
          const item1 = keys1.length > 0 ? keys1[0] : "";
          const item2 = keys2.length > 0 ? keys2[0] : "";
          return item1.localeCompare(item2, 'en', { sensitivity: 'base' });
        }
      },
    };
  },
});
