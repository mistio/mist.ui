import '../node_modules/@polymer/app-route/app-route.js';
import '../node_modules/@mistio/mist-list/mist-list.js';
import dayjs from '../node_modules/dayjs/esm/index.js';
import { mistListsBehavior } from './helpers/mist-lists-behavior.js';
import { getResourceFromIncidentBehavior } from './helpers/get-resource-from-incident-behavior.js';
import { Polymer } from '../node_modules/@polymer/polymer/lib/legacy/polymer-fn.js';
import { html } from '../node_modules/@polymer/polymer/lib/utils/html-tag.js';

Polymer({
  _template: html`
    <template>
      <style include="shared-styles">
        .error {
          color: #d96557;
        }

        h2[slot='header'] {
          margin: 8px;
        }
      </style>
      <app-route route="{{route}}"></app-route>
      <template is="dom-if" if="[[_isListActive(route.path)]]" restamp>
        <mist-list
          id="incidentsList"
          expands
          resizable
          column-menu
          multi-sort
          apiurl="/api/v1/incidents"
          items="[[model.incidentsArray]]"
          name="Incidents"
          selected-items="{{selectedItems}}"
          filtered-items-length="{{filteredItemsLength}}"
          combined-filter="{{combinedFilter}}"
          frozen="[[_getFrozenLogColumn()]]"
          visible="[[_getVisibleColumns()]]"
          renderers="[[_getRenderers()]]"
          user-filter="[[model.sections.incidents.q]]"
        >
          <h2 slot="header">
            [[filteredItemsLength]] [[combinedFilter]] Incidents
          </h2>
          <p slot="no-items-found">Hooray! No Incidents found.</p>
        </mist-list>
      </template>
    </template>
  `,
  is: 'page-incidents',
  behaviors: [mistListsBehavior, getResourceFromIncidentBehavior],
  properties: {
    model: {
      type: Object,
    },
  },
  listeners: {
    click: 'resizeList',
  },
  observers: ['incidentsChanged(model.incidents.*)'],
  incidentsChanged(incidents) {
    if (
      incidents.path === 'model.incidents' &&
      this.shadowRoot.querySelector('mist-list')
    ) {
      this.shadowRoot.querySelector('mist-list').fire('resize');
    }
  },
  _isListActive(path) {
    return !path;
  },
  _getFrozenLogColumn() {
    return ['started_at'];
  },

  _getVisibleColumns() {
    return ['resource_id', 'cloud_id', 'incident_id', 'error'];
  },
  // TODO compute columns for all resources' incidents
  _getRenderers() {
    const _this = this;
    return {
      started_at: {
        title: item => {
          return item ? item.replace(/_/g, ' ') : 'started at';
        },
        body: (item, row) => {
          let active = '';
          if (!row.finished_at) {
            active = '<strong class="error"> - Active now </strong>';
          }
          return `<span title="${dayjs(item * 1000).format()}">${dayjs(
            item * 1000
          ).fromNow()}</span>${active}`;
        },
        cmp: (item1, item2, _row1, _row2) => {
          if (item1 > item2) {
            return 1;
          }
          if (item1 < item2) {
            return -1;
          }
          return 0;
        },
      },
      resource_id: {
        title: _item => {
          return 'resource';
        },
        body: (_item, row) => {
          const resource = _this._getResource(row, _this.model);
          console.log('RESOURCE ===', resource);
          // Resource may be missing. If not display link
          if (resource) {
            if (resource.id)
              return `<a href="/${resource.type}s/${resource.id}" class="regular" style="color: #2196F3;">${resource.name}</a>`;
            if (resource.type === 'organization') return 'Organization';
            if (!resource.id && resource.type !== 'organization')
              return resource.name;
          }
          return row[`${resource.type}_id`];
        },
      },
      cloud_id: {
        title: item => {
          return item ? item.replace(/_/g, ' ') : 'cloud';
        },
        body: (item, _row) => {
          return _this.model.clouds && _this.model.clouds[item]
            ? _this.model.clouds[item].title
            : item || '';
        },
      },
      error: {
        body: (item, _row) => {
          const classname = item ? 'error' : '';
          return `<span class="${classname}">${item}</span>`;
        },
      },
    };
  },
  resizeList(e) {
    if (e.path.indexOf(this.shadowRoot.querySelector('mist-list')))
      this.shadowRoot.querySelector('mist-list').fire('resize');
  },
});
