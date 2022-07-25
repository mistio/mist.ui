/* eslint-disable lit-a11y/anchor-is-valid */
import { PolymerElement, html } from '@polymer/polymer/polymer-element.js';
import { mixinBehaviors } from '@polymer/polymer/lib/legacy/class.js';
import moment from 'moment/src/moment.js';
import { mistLoadingBehavior } from '../helpers/mist-loading-behavior.js';
import { mistLogsBehavior } from '../helpers/mist-logs-behavior.js';
import nodepoolDataProvider from './nodepools-data-provider.js';
import { ratedCost, _generateMap, CSRFToken } from '../helpers/utils.js';
import '@polymer/paper-button/paper-button.js';
import '@polymer/paper-spinner/paper-spinner.js';
import '@polymer/paper-styles/typography.js';
import '@polymer/iron-icons/iron-icons.js';
import '@polymer/iron-icon/iron-icon.js';
import '@mistio/mist-list/mist-list.js';
import '../machines/machine-actions.js';
import '../element-for-in/element-for-in.js';
import '../tags/tags-list.js';
import './cluster-actions.js';
import './nodepool-actions.js';

/* eslint-disable class-methods-use-this */
export default class ClusterPage extends mixinBehaviors(
  [mistLoadingBehavior, mistLogsBehavior],
  PolymerElement
) {
  static get template() {
    return html`
      <style include="shared-styles single-page tags-and-labels">
        :host {
          --paper-toggle-button-checked-button-color: #69b46c;
          --paper-toggle-button-checked-bar-color: #69b46c;
          --paper-toggle-button-unchecked-button-color: #d96557;
          --paper-toggle-button-unchecked-bar-color: #d96557;
        }

        paper-toggle-button {
          display: inline-flex;
          cursor: pointer;
        }

        .cell paper-toggle-button {
          vertical-align: middle;
        }

        .small {
          transform: scale(0.7);
          width: 100%;
          left: -15%;
          position: relative;
        }

        paper-material {
          display: block;
          padding: 20px;
        }

        .flex-horizontal-with-ratios {
          @apply --layout-horizontal;
        }

        .flexchild {
          @apply --layout-flex;
        }

        h4.id {
          display: inline-block;
          text-transform: uppercase;
          font-size: 0.9rem;
          font-weight: 700;
          margin-right: 16px;
        }

        span.id {
          padding-right: 36px;
          word-break: break-all;
        }

        .tag {
          padding: 0.5em;
          display: inline;
        }

        paper-material.no-pad {
          padding: 0;
        }

        .resource-info {
          padding-right: 36px;
          display: inline-block;
          padding-bottom: 24px;
        }

        .table {
          display: table;
        }

        .row {
          display: table-row;
        }

        .cell {
          display: table-cell;
        }

        .cell h4 {
          text-transform: uppercase;
          font-weight: bold;
          font-size: 0.8em;
          display: inline-block;
          width: 90px;
          opacity: 0.54;
          margin: 0;
          line-height: 95%;
        }

        .columns {
          display: flex;
          flex: 1 100%;
          margin-bottom: 16px;
          flex-direction: row;
        }

        .columns paper-material > .break {
          word-break: break-all;
        }

        .left {
          line-height: 1.6em;
        }

        .left,
        .right {
          display: flex;
          align-items: flex-start;
          flex-direction: column;
          flex: 1 50%;
          font-size: 0.9em;
        }

        .left h3,
        .right h3 {
          margin-bottom: 0;
        }

        .is-loading {
          top: 15px;
          left: 200px;
          position: fixed;
          right: 0;
          bottom: 0;
          display: block;
          height: 100vh;
          background-color: #eee;
        }

        .is-loading paper-spinner {
          width: 80px;
          height: 80px;
          margin: 10% auto;
          display: block;
        }

        a {
          color: black;
          text-decoration: none;
        }
        .single-head {
          @apply --cluster-page-head-mixin;
        }


        cluster-actions {
          width: 50%;
        }

        paper-material.info-card {
          padding: 0;
        }

        .cluster-page-head {
          line-height: initial !important;
          margin-bottom: 0;
          margin-top: 0;
          width: 100%;
          cursor: pointer;
          @apply --cluster-page-head-mixin;
        }

        paper-button.arrow {
          text-transform: none;
          margin: 0;
          width: 100%;
          justify-content: left;
          background-color: transparent !important;
          color: inherit !important;
          padding: 12px !important;
        }
        mist-list {
          min-height: 185px
        }
        #cpcost {
          padding-top: 10px;
        }
        #toggle-pods-cell {
          padding-top: 5px;
        }
      </style>
      <div id="content">
        <paper-material class="single-head layout horizontal">
          <span class="icon"
            ><iron-icon icon="[[section.icon]]"></iron-icon
          ></span>
          <div class="title flex">
            <h2>[[cluster.name]]</h2>
            <div class="subtitle">on [[cloud.name]]</div>
            <div class="subtitle">
              <span>[[clusterState]]</span>
            </div>
          </div>
          <cluster-actions
            id="actions_cluster"
            items="[[itemArray]]"
            model="[[model]]"
            in-single-page=""
          ></cluster-actions>
        </paper-material>
        <paper-material hidden$="[[!isMissing]]">
          <div class="missing">Cluster not found.</div>
        </paper-material>
        <div class="columns">
          <paper-material class="left info">
            <div class="resource-info">
              <div class="table">
                <div class="row">
                  <div class="cell">
                    <h4>ID:</h4>
                  </div>
                  <div class="cell">
                    <span>[[cluster.id]] </span>
                  </div>
                </div>
                <div class="row">
                  <div class="cell">
                    <h4>Cloud:</h4>
                  </div>
                  <div class="cell">
                    <a href="/clouds/[[cloud.id]]">
                      <iron-icon
                        class="cloud icon"
                        src$="[[_computeCloudIcon(cloud.provider)]]"
                      ></iron-icon>
                      <span>[[cloud.name]]</span>
                    </a>
                  </div>
                </div>
                <div class="row">
                  <div class="cell">
                    <h4>Location:</h4>
                  </div>
                  <div class="cell">
                  <span>[[_getLocationName(cloud, cluster)]] </span>
                  </div>
                </div>
                <div class="row">
                  <div class="cell">
                    <h4>Total Nodes:</h4>
                  </div>
                  <div class="cell">
                    <span>[[cluster.total_nodes]] </span>
                  </div>
                </div>
                <div class="row">
                  <div class="cell">
                    <h4>Total CPUs:</h4>
                  </div>
                  <div class="cell">
                    <span>[[cluster.total_cpus]] </span>
                  </div>
                </div>
                <div class="row">
                  <div class="cell">
                    <h4>Total Mem:</h4>
                  </div>
                  <div class="cell">
                    <span>[[cluster.total_memory]] </span>
                  </div>
                </div>
              </div>
            </div>
          </paper-material>
          <paper-material class="right info">
            <div class="resource-info">
              <div class="table">
                <div class="row">
                  <div class="cell">
                    <h4>Total Cost</h4>
                  </div>
                  <div class="cell">
                    <span>[[currency.sign]][[_ratedCost(cluster.total_cost.monthly,
                          currency.rate)]]</span>
                  </div>
                </div>
                <div class="row">
                  <div class="cell">
                    <h4 id="cpcost">Control Plane Cost</h4>
                  </div>
                  <div class="cell">
                    <span>[[currency.sign]][[_ratedCost(cluster.cost.monthly, 
                          currency.rate)]]</span>
                  </div>
                </div>
                <div class="row" hidden$="[[!cluster.owned_by.length]]">
                  <div class="cell">
                    <h4>Owner:</h4>
                  </div>
                  <div class="cell">
                    <span
                      ><a href$="/members/[[cluster.owned_by]]" href=""
                        >[[cluster.owned_by]]</a
                      ></span
                    >
                  </div>
                </div>
                <div class="row" hidden$="[[!cluster.created_by.length]]">
                  <div class="cell">
                    <h4>Created by:</h4>
                  </div>
                  <div class="cell">
                    <span
                      ><a href$="/members/[[cluster.created_by]]"
                        >[[cluster.created_by]]</a
                      ></span
                    >
                  </div>
                </div>
                <div class="row">
                  <div class="cell">
                    <h4>Features:</h4>
                    <br />
                  </div>
                  <div class="cell" id="toggle-pods-cell">
                    <paper-toggle-button
                      id="include-pods-toggle"
                      class="small"
                      checked$="[[cluster.include_pods]]"
                      on-tap="_changeIncludePods"
                    >
                      <span hidden$="[[!cluster.include_pods]]"
                        >Pods visible</span
                      >
                      <span hidden$="[[cluster.include_pods]]"
                        >Pods hidden</span
                      >
                    </paper-toggle-button>
                  </div>
                </div>
              </div>
              <h4 class="id tags" hidden$="[[_isEmpty(cluster.tags)]]">Tags:</h4>
              <template is="dom-if" if="[[!_isEmpty(cluster.tags)]]">
                <template is="dom-repeat" items="[[cluster.tags]]">
                  <span class="id tag"
                    >[[item.key]]
                    <span hidden="[[!item.value]]">[[item.value]]</span></span
                    >
                </template>
              </template>
            </div>
          </paper-material>
        </div>
        <br />
        <paper-material class="no-pad">
          <nodepool-actions
            items="[[selectedResources]]"
            actions="{{resourceActions}}"
            cluster-id="[[cluster.id]]"
            provider="[[cluster.provider]]"
          >
            <mist-list
              id="clusterResources"
              item-map="[[resources]]"
              frozen="[[_getFrozenResourcesColumn()]]"
              visible="[[_getVisibleResourcesColumns()]]"
              renderers="[[_getRenderers()]]"
              actions="[[resourceActions]]"
              tree-view
              data-provider="[[dataProvider]]"
              selected-items="{{selectedResources}}"
              selectable=""
              auto-hide=""
              column-menu=""
              toolbar=""
              resizable=""
              name="nodepools"
              primary-field-name="id"
              item-has-children="[[resourceHasChildren]]"
            ></mist-list>
          </nodepool-actions>
        </paper-material>
        </br>
        <paper-material class="no-pad">
          <div class="horizontal layout hide-button">
            <h2 class="cluster-page-head">
              <paper-button class="arrow" on-tap="arrowButtonClick">
                <iron-icon icon="icons:expand-more"
                style="margin-right: 8px; transform: rotate(0deg);">
                </iron-icon>
                More Info
              </paper-button>
            </h2>
          </div>
          <div class="info-table">
            <div class="info-body info-group">
              <element-for-in content="[[cluster.extra]]"></element-for-in>
            </div>
          </div>
        </paper-material>
        <br />
        <paper-material class="no-pad">
          <template is="dom-if" if="[[cluster]]" restamp="">
            <mist-list
              id="clusterLogs"
              frozen="[[_getFrozenLogColumn()]]"
              visible="[[_getVisibleColumns()]]"
              renderers="[[_getRenderers()]]"
              auto-hide=""
              timeseries=""
              expands=""
              column-menu=""
              searchable=""
              streaming=""
              infinite=""
              toolbar=""
              rest=""
              apiurl="/api/v1/logs"
              name="cluster logs"
              primary-field-name="time"
              base-filter="[[cluster.id]]"
            ></mist-list>
          </template>
        </paper-material>
      </div>
      <iron-ajax
        id="includePodsAjaxRequest"
        handle-as="xml"
        method="PATCH"
        on-response="_handleIncludePodsAjaxResponse"
        on-error="_handleIncludePodsAjaxError"
        loading="{{containerLoading}}"
      ></iron-ajax>

    `;
  }

  static get properties() {
    return {
      section: {
        type: Object,
      },
      cluster: {
        type: Object,
      },
      actions: {
        type: Array,
        notify: true,
      },
      itemArray: {
        type: Array,
      },
      resources: {
        type: Object,
        computed:
          '_computeClusterResources(cluster, model.clusters.*, model.machines.*)',
      },
      resourceActions: {
        type: Array,
      },
      selectedResources: {
        type: Array,
      },
      cloud: {
        type: Object,
        value() {
          return {};
        },
      },
      clusterState: {
        type: String,
        computed: '_computeClusterState(cluster.state, model.clusters.*)',
      },
      dataProvider: {
        type: Object,
        value() {
          return nodepoolDataProvider.bind(this);
        },
      },
      currency: {
        type: Object,
        value() {
          return { sign: '$', rate: 1 };
        },
      },
    };
  }

  static get observers() {
    return [
      '_changed(cluster)',
      '_setClusterCloud(model.clouds.*, machine.cloud, cluster)',
    ];
  }

  ready() {
    super.ready();
    this.addEventListener('active-item-changed', this._goToMachine);
    this.addEventListener('action-finished', this._clearListSelections);
  }

  _changed(cluster) {
    if (cluster) {
      this.set('itemArray', [this.cluster]);
      this._clearListSelections();
    }
  }

  _computeClusterMachines() {
    let ret = {};
    if (this.cluster && this.model.machines) {
      const clusterMachines = Object.entries(this.model.machines).filter(
        ([_machineId, machine]) => machine.cluster === this.cluster.id
      );
      ret = Object.fromEntries(clusterMachines);
    }
    return ret;
  }

  _computeClusterResources() {
    const nodepools = _generateMap(
      (this.cluster && this.cluster.nodepools) || [],
      'name'
    );
    let nodes = [];
    if (this.cluster && this.model.machines) {
      const clusterMachines = Object.entries(this.model.machines).filter(
        ([_machineId, machine]) =>
          machine && machine.cluster === this.cluster.id
      );
      nodes = Object.fromEntries(clusterMachines);
    }
    return { ...nodepools, ...nodes };
  }

  _getFrozenResourcesColumn() {
    return ['name'];
  }

  _getVisibleResourcesColumns() {
    return [
      'state',
      'location',
      'node_count',
      'min_nodes',
      'max_nodes',
      'cost',
    ];
  }

  _getVisibleColumns() {
    return ['type', 'action', 'user_id'];
  }

  _getFrozenLogColumn() {
    return ['time'];
  }

  _getRenderers() {
    const _this = this;
    return {
      time: {
        body: (item, row) => {
          let ret = `<span title="${moment(item * 1000).format()}">${moment(
            item * 1000
          ).fromNow()}</span>`;
          if (row.error)
            ret += '<iron-icon icon="error" style="float: right"></iron-icon>';
          return ret;
        },
      },
      state: {
        body: item => item.toLowerCase(),
      },
      user_id: {
        title: () => 'user',
        body: item => {
          if (
            _this.model &&
            _this.model.members &&
            item in _this.model.members &&
            _this.model.members[item] &&
            _this.model.members[item].name &&
            _this.model.members[item].name !== undefined
          ) {
            const displayUser =
              _this.model.members[item].name ||
              _this.model.members[item].email ||
              _this.model.members[item].username;
            return `<a href="/members/${item}">${displayUser}</a>`;
          }
          return item || '';
        },
      },
      cost: {
        body: (item, row) => {
          if (row.id) {
            const itemCost = (item && item.monthly.toFixed(2)) || '';
            return `${this.currency.sign}${itemCost}`;
          }

          const nodepoolName = row.name;
          if (
            nodepoolName &&
            _this.cloud &&
            _this.model &&
            _this.model.clouds
          ) {
            let cost = 0;
            Object.values(_this.model.clouds[_this.cloud.id].machines).forEach(
              machine => {
                if (
                  machine.extra &&
                  machine.extra.nodepool &&
                  machine.extra.nodepool === nodepoolName
                )
                  cost += machine.cost.monthly;
              }
            );
            const itemCost = cost
              ? `${this.currency.sign}${cost.toFixed(2)}`
              : '';
            return itemCost;
          }

          return '';
        },
      },
      location: {
        body: (item, row) => {
          if (!item && row.locations && row.locations.length > 0)
            return row.locations.join(', ');
          if (
            item &&
            _this.model &&
            _this.model.clouds &&
            _this.model.clouds[row.cloud].locations
          )
            return _this.model.clouds[row.cloud].locations[item].name;
          return '';
        },
      },
      max_nodes: {
        body: (item, _row) => item || '',
      },
      min_nodes: {
        body: (item, _row) => item || '',
      },
      node_count: {
        body: (_item, row) => {
          // if this is a node return empty string
          if (row.id)
            return '';
          if (
            _this.cloud &&
            _this.cloud.machines
          ) {
            let count = 0;
            Object.values(_this.cloud.machines).forEach(machine => {
              if (machine && machine.extra && machine.extra.nodepool === row.name)
                count += 1;
            });
            return count;
          }
          return '';
        },
      },
    };
  }

  _goToMachine(e) {
    if (e.detail.id) window.location.assign(`/machines/${e.detail.id}`);
  }

  _clearListSelections() {
    this.set('selectedResources', []);
  }

  _isEmpty(tags) {
    return (
      !tags ||
      (Array.isArray(tags) ? tags.length === 0 : Object.keys(tags).length === 0)
    );
  }

  _setClusterCloud() {
    if (this.model && this.model.clouds && this.cluster)
      this.set('cloud', this.model.clouds[this.cluster.cloud]);
    return {};
  }

  _computeClusterState() {
    return (this.cluster && this.cluster.state) || '';
  }

  _getLocationName() {
    if (
      !this.cluster ||
      !this.cloud ||
      !this.cloud.locations ||
      !this.cluster.location ||
      !this.cloud.locations[this.cluster.location]
    )
      return '';
    return this.cloud.locations[this.cluster.location].name;
  }

  _computeCloudIcon(cloud) {
    if (!cloud) {
      return '';
    }
    return `./assets/providers/provider-${cloud.replace(/_/g, '')}.png`;
  }

  _ratedCost(cost, rate) {
    return ratedCost(cost, rate);
  }

  arrowButtonClick(e) {
    e.stopPropagation();
    const arrowIcon = e.currentTarget.children[0];
    const dataDiv =
      e.currentTarget.parentElement.parentElement.nextElementSibling;
    if (arrowIcon.style.transform.indexOf('270') > -1) {
      arrowIcon.style.transform = 'rotate(0deg)';
      dataDiv.removeAttribute('hidden');
    } else {
      arrowIcon.style.transform = 'rotate(270deg)';
      dataDiv.setAttribute('hidden', '');
    }
  }

  resourceHasChildren(item) {
    if (item && !item.id)
      // nodepools don't have id
      return true;
    if (item && item.machine_type === 'node') return true;
    return false;
  }

  _changeIncludePods() {
    const includePods = !this.cluster.include_pods;
    this.$.includePodsAjaxRequest.url = `/api/v1/clouds/${this.cloud.id}/clusters/${this.cluster.id}`;
    this.$.includePodsAjaxRequest.headers['Content-Type'] = 'application/json';
    this.$.includePodsAjaxRequest.headers['Csrf-Token'] = CSRFToken.value;
    this.$.includePodsAjaxRequest.body = {
      include_pods: includePods,
    };
    this.$.includePodsAjaxRequest.generateRequest();
  }

  _handleIncludePodsAjaxResponse() {
    const message = this.shadowRoot.querySelector('#include-pods-toggle')
      .checked
      ? `Will include pods for ${this.cluster.name}!`
      : `Will hide pods for ${this.cluster.name}!`;
    this.set(
      'cluster.include_pods',
      this.shadowRoot.querySelector('#include-pods-toggle').checked
    );
    this.dispatchEvent(
      new CustomEvent('toast', {
        bubbles: true,
        composed: true,
        detail: { msg: message, duration: 5000 },
      })
    );
  }

  _handleIncludePodsAjaxError(e) {
    this.shadowRoot.querySelector(
      '#include-pods-toggle'
    ).checked = this.cluster.include_pods;
    this.dispatchEvent(
      new CustomEvent('toast', {
        bubbles: true,
        composed: true,
        detail: { msg: e.detail.request.xhr.response, duration: 10000 },
      })
    );
  }
}

customElements.define('cluster-page', ClusterPage);
