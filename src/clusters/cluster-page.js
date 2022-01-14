import { PolymerElement, html } from '@polymer/polymer/polymer-element.js';
import { mixinBehaviors } from '@polymer/polymer/lib/legacy/class.js';
import moment from 'moment/src/moment.js';
import { mistLoadingBehavior } from '../helpers/mist-loading-behavior.js';
import { mistLogsBehavior } from '../helpers/mist-logs-behavior.js';
import '@polymer/paper-button/paper-button.js';
import '@polymer/paper-spinner/paper-spinner.js';
import '@polymer/paper-styles/typography.js';
import '@mistio/mist-list/mist-list.js';
import '../element-for-in/element-for-in.js';
import '../tags/tags-list.js';
import './cluster-actions.js';

/* eslint-disable class-methods-use-this */
export default class ClusterPage extends mixinBehaviors(
  [mistLoadingBehavior, mistLogsBehavior],
  PolymerElement
) {
  static get template() {
    return html`
      <style include="shared-styles single-page tags-and-labels">
        paper-material {
          display: block;
          padding: 20px;
        }

        paper-material > h2 {
          line-height: initial !important;
          margin-bottom: 0;
          cursor: pointer;
        }

        paper-menu-button paper-button {
          display: block;
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
        }

        .cell paper-toggle-button {
          vertical-align: middle;
        }

        paper-material.info {
          display: flex;
          flex-direction: row;
          flex-wrap: wrap;
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

        .cluster-page-head {
          @apply --cluster-page-head-mixin;
        }

        cluster-actions {
          width: 50%;
        }
      </style>
      <div id="content">
        <paper-material class="single-head layout horizontal">
          <span class="icon"
            ><iron-icon icon="[[section.icon]]"></iron-icon
          ></span>
          <div class="title flex">
            <h2>[[cluster.name]]</h2>
            <div class="subtitle">on [[cluster.cloud.title]]</div>
            <div class="subtitle">
              <span>[[cluster.state]]</span>
            </div>
          </div>
          <cluster-actions
            id="actions_cluster"
            items="[[itemArray]]"
            model="[[model]]"
            in-single-page=""
          ></cluster-actions>
        </paper-material>
        <paper-material>
          <div class="missing" hidden$="[[!isMissing]]">Cluster not found.</div>
        </paper-material>
        <paper-material class="info">
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
                  <span>[[cluster.cloud.title]] </span>
                </div>
              </div>
              <div class="row">
                <div class="cell">
                  <h4>Provider:</h4>
                </div>
                <div class="cell">
                  <span>[[cluster.provider]] </span>
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
          <span class="id"
            ><a href="/members/[[cluster.owned_by]]"
              >[[_displayUser(cluster.owned_by,model.members)]]</a
            ></span
          >
          <h4 class="id" hidden$="[[!cluster.created_by.length]]">
            Created by:
          </h4>
          <span class="id"
            ><a href="/members/[[cluster.created_by]]"
              >[[_displayUser(cluster.created_by,model.members)]]</a
            ></span
          >
          <h4 class="id tags" hidden$="[[_isEmpty(cluster.tags)]]">Tags:</h4>
          <template is="dom-if" if="[[!_isEmpty(cluster.tags)]]">
            <template is="dom-repeat" items="[[cluster.tags]]">
              <span class="id tag"
                >[[item.key]]
                <span hidden="[[!item.value]]">[[item.value]]</span></span
              >
            </template>
          </template>
        </paper-material>
        <br />
        <paper-material class="no-pad">
          <h2 class="cluster-page-head">More Info</h2>
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
    };
  }

  static get observers() {
    return ['_changed(cluster)'];
  }

  _changed(cluster) {
    if (cluster) this.set('itemArray', [this.cluster]);
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
    };
  }

  _displayUser(id, _members) {
    return this.model && id && this.model.members && this.model.members[id]
      ? this.model.members[id].name ||
          this.model.members[id].email ||
          this.model.members[id].username
      : '';
  }

  _isEmpty(tags) {
    return (
      !tags ||
      (Array.isArray(tags) ? tags.length === 0 : Object.keys(tags).length === 0)
    );
  }
}

customElements.define('cluster-page', ClusterPage);
