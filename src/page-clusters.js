import { PolymerElement, html } from '@polymer/polymer/polymer-element.js';
import { ratedCost } from './helpers/utils.js';
import '@polymer/app-route/app-route.js';
import '@mistio/mist-list/mist-list.js';
import './clusters/cluster-actions.js';
import './clusters/cluster-page.js';

/* eslint-disable class-methods-use-this */
export default class PageClusters extends PolymerElement {
  static get is() {
    return 'page-clusters';
  }

  static get template() {
    return html`
      <app-route
        route="{{route}}"
        pattern="/:cluster"
        data="{{data}}"
      ></app-route>
      <template is="dom-if" if="[[_isListActive(route.path)]]" restamp>
        <cluster-actions
          actions="{{actions}}"
          items="{{selectedItems}}"
          model="[[model]]"
        >
          <mist-list
            selectable
            resizable
            column-menu
            multi-sort
            apiurl="api/v1/clusters"
            id="clustersList"
            primary-field-name="id"
            frozen="[[_getFrozenColumn()]]"
            visible="[[_getVisibleColumns()]]"
            selected-items="{{selectedItems}}"
            renderers="[[_getRenderers()]]"
            actions="[[actions]]"
            route="{{route}}"
            item-map="[[model.clusters]]"
            user-filter="[[model.sections.clusters.q]]"
          >
          </mist-list>
        </cluster-actions>
      </template>
      <cluster-page
        model="[[model]]"
        cluster="[[_getCluster(data.cluster)]]"
        resource-id="[[data.key]]"
        section="[[model.sections.clusters]]"
        hidden$="[[!_isDetailsPageActive(route.path)]]"
      ></cluster-page>
    `;
  }

  static get properties() {
    return {
      model: {
        type: Object,
      },
      actions: {
        type: Array,
      },
      selectedItems: {
        type: Array,
      },
      renderers: {
        type: Object,
      },
      currency: {
        type: Object,
      },
    };
  }

  _getRenderers() {
    const _this = this;
    return {
      icon: {
        body: (_item, row) =>
          `./assets/providers/provider-${_this.model.clouds[row.cloud].provider
            .replace('_', '')
            .replace(' ', '')}.png`,
      },
      name: {
        body: (item, _row) => `<strong class="name">${item}</strong>`,
        cmp: (row1, row2) =>
          row1.name.localeCompare(row2.name, 'en', {
            sensitivity: 'base',
          }),
      },
      cloud: {
        body: (item, _row) => {
          if (_this.model && _this.model.clouds)
            return _this.model.clouds[item].name || '';
          return '';
        },
      },
      total_cost: {
        title: () => 'total cost',
        body: (item, _row) =>
          `${_this.currency.sign}${_this._ratedCost(
            item.monthly.toFixed(2),
            _this.currency.rate
          )}` || 0,
      },
    };
  }

  _ratedCost(cost, rate) {
    return ratedCost(cost, rate);
  }

  _getFrozenColumn() {
    return ['name'];
  }

  _getVisibleColumns() {
    return ['cloud', 'id', 'total_cost', 'tags'];
  }

  _isListActive(path) {
    return !path;
  }

  _isDetailsPageActive(path) {
    return path && path !== '/+add';
  }

  _getCluster(id) {
    if (this.model.clusters) {
      return this.model.clusters[id];
    }
    return '';
  }
}

customElements.define('page-clusters', PageClusters);
