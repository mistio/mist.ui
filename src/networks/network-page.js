import '../../node_modules/@polymer/polymer/polymer-legacy.js';
import '../../node_modules/@polymer/paper-button/paper-button.js';
import '../../node_modules/@polymer/paper-styles/typography.js';
import '../../node_modules/@polymer/paper-spinner/paper-spinner.js';
import '../mist-rules/mist-rules.js';
import { mistLogsBehavior } from '../helpers/mist-logs-behavior.js';
import '../helpers/dialog-element.js';
import { mistRulesBehavior } from '../helpers/mist-rules-behavior.js';
import { mistLoadingBehavior } from '../helpers/mist-loading-behavior.js';
import './network-actions.js';
import './subnet-item.js';
import { Polymer } from '../../node_modules/@polymer/polymer/lib/legacy/polymer-fn.js';
import { html } from '../../node_modules/@polymer/polymer/lib/utils/html-tag.js';

Polymer({
  _template: html`
    <style include="shared-styles tags-and-labels single-page">
      paper-material {
        display: block;
        padding: 20px;
      }

      .columns {
        @apply --layout-horizontal;
        flex: 1 100%;
        margin-bottom: 16px;
      }

      .columns paper-material > .break {
        word-break: break-all;
      }

      .left,
      .right {
        @apply --layout-vertical;
        align-items: flex-start;
        flex-direction: column;
        flex: 1 100%;
      }

      .left h3,
      .right h3 {
        margin-bottom: 0;
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

      .command-container {
        background-color: #444;
        color: #fff;
        font-family: monospace;
        padding: 10px;
      }

      a {
        color: black;
        text-decoration: none;
      }

      #content {
        -webkit-overflow-scrolling: touch;
      }

      paper-icon-button {
        transition: all 200ms;
      }

      .n-info-head {
        text-transform: uppercase;
        font-weight: bold;
        font-size: 0.8em;
        display: inline-block;
        width: 100px;
        opacity: 0.54;
        margin: 0;
      }

      #rightcolumn .n-info-head {
        width: 100%;
      }

      paper-icon-bottom.bottom {
        padding-right: 8px;
      }

      :host .info-item {
        word-break: break-all;
      }

      .single-head {
        @apply --network-page-head-mixin;
      }

      network-actions {
        width: 50%;
      }

      iron-icon.icon {
        margin-right: 4px;
        opacity: 0.54;
      }
    </style>

    <div id="content">
      <paper-material class="single-head layout horizontal">
        <span class="icon">
          <iron-icon icon="[[section.icon]]"></iron-icon>
        </span>
        <div class="title flex">
          <h2>[[network.name]]</h2>
          <div class="subtitle">[[networkCloud]]</div>
        </div>
        <network-actions
          items="[[itemArray]]"
          actions="{{actions}}"
          user="[[model.user.id]]"
          members="[[model.membersArray]]"
          org="[[model.org]]"
        ></network-actions>
      </paper-material>
      <div class="columns">
        <paper-material id="leftcolumn resource-description" class="left">
          <div class="missing" hidden$="[[!isMissing]]">Network not found.</div>
          <div>
            <h4 class="id n-info-head">Network CIDR:</h4>
            <span class="id">[[network.cidr]]</span>
          </div>
          <div>
            <h4 class="id n-info-head">Network ID:</h4>
            <span class="id">[[network.id]]</span>
          </div>
          <div hidden$="[[!network.owned_by.length]]">
            <h4 class="id n-info-head">Owner:</h4>
            <span class="id"
              ><a href$="/members/[[network.owned_by]]"
                >[[_displayUser(network.owned_by,model.members)]]</a
              ></span
            >
          </div>
          <div hidden$="[[!network.created_by.length]]">
            <h4 class="id n-info-head">Created by:</h4>
            <span class="id"
              ><a href$="/members/[[network.created_by]]"
                >[[_displayUser(network.created_by,model.members)]]</a
              ></span
            >
          </div>
        </paper-material>
        <paper-material id="rightcolumn" class="right">
          <div hidden$="[[!machines.length]]">
            <h3 class="n-info-head">MACHINES:</h3>
            <template is="dom-repeat" items="[[machines]]">
              <a class="regular blue-link" href$="/machines/[[item.id]]">
                <iron-icon icon="hardware:computer" class="icon"></iron-icon>
                [[item.name]]</a
              ><br />
            </template>
          </div>
          <div hidden$="[[!networkTags.length]]">
            <h3 class="n-info-head">TAGS:</h3>
            <template is="dom-repeat" items="[[networkTags]]">
              <span class="tag"
                >[[item.key]]<span hidden$="[[!item.value]]">=</span
                >[[item.value]]</span
              >
            </template>
          </div>
        </paper-material>
      </div>
      <paper-material>
        <h4 class="id">Network Info</h4>
        <div class="info-table">
          <div class="info-body info-group">
            <div class="info-item flex-horizontal-with-ratios">
              <div class="flexchild">Name</div>
              <div class="flexchild">[[network.name]]</div>
            </div>
            <div class="info-item flex-horizontal-with-ratios">
              <div class="flexchild">ID</div>
              <div class="flexchild">[[network.id]]</div>
            </div>
            <div class="info-item flex-horizontal-with-ratios">
              <div class="flexchild">Subnets</div>
              <div class="flexchild">[[subnets.length]]</div>
            </div>
            <div
              hidden$="[[!network.status]]"
              class="info-item flex-horizontal-with-ratios"
            >
              <div class="flexchild">Status</div>
              <div class="flexchild">[[network.status]]</div>
            </div>
          </div>
        </div>
      </paper-material>
      <paper-material hidden$="[[!hasSubnets]]">
        <h4 class="id">Subnets</h4>
        <div class="info-table">
          <div class="info-body">
            <template is="dom-repeat" items="{{subnets}}" as="subnet">
              <subnet-item
                subnet="[[subnet]]"
                itemindex="{{index}}"
              ></subnet-item>
            </template>
          </div>
        </div>
      </paper-material>
      <br />
      <paper-material class="no-pad">
        <mist-rules
          id="networkRules"
          resource-type="network"
          incidents="[[model.incidentsArray]]"
          rules="[[_rulesApplyOnResource(model.rules, network, network.tags.*, 'network')]]"
          teams="[[model.teamsArray]]"
          users="[[model.membersArray]]"
          resource="[[network]]"
          model="[[model]]"
          collapsible=""
        ></mist-rules>
      </paper-material>
      <br />
      <paper-material class="no-pad">
        <template is="dom-if" if="[[network]]" restamp="">
          <mist-list
            id="networkLogs"
            frozen="[[_getFrozenLogColumn()]]"
            visible="[[_getVisibleColumns()]]"
            renderers="[[_getRenderers(model.members)]]"
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
            name="network logs"
            primary-field-name="time"
            base-filter="[[network.id]]"
          ></mist-list>
        </template>
      </paper-material>
    </div>
    <iron-ajax
      id="networkDeleteAjaxRequest"
      url="/api/v1/clouds/[[network.cloud]]/networks/[[network.id]]"
      method="DELETE"
      on-response="_handleNetworDeletekAjaxResponse"
    ></iron-ajax>
    <dialog-element></dialog-element>
  `,

  is: 'network-page',

  behaviors: [mistLoadingBehavior, mistLogsBehavior, mistRulesBehavior],

  properties: {
    model: {
      type: Object,
    },
    section: {
      type: Object,
    },
    network: {
      type: Object,
    },
    machines: {
      type: Array,
      computed: '_computeMachines(network, model.machines)',
    },
    subnets: {
      type: Array,
      value() {
        return [];
      },
      computed: '_computeSubnets(network, network.subnets, network.subnets.*)',
    },
    hasSubnets: {
      type: Boolean,
      computed: '_computeHasSubnets(network)',
    },
    isLoading: {
      type: Boolean,
      computed: '_computeIsloading(network)',
      value: true,
    },
    networkCloud: {
      type: String,
      computed: '_computeNetworkCloud(network, model.clouds)',
    },
    networkTags: {
      type: Array,
      computed:
        '_computeNetworkTags(network, network.tags, network.tags.*, model.networks.*)',
    },
    itemArray: {
      type: Array,
    },
    hidden: {
      type: Boolean,
    },
  },

  listeners: {
    'network-deleted': '_networkDeleted',
  },

  observers: ['_change(network)'],

  _displayUser(id, _members) {
    return this.model &&
      id &&
      this.model.members &&
      this.model.members &&
      this.model.members[id]
      ? this.model.members[id].name ||
          this.model.members[id].email ||
          this.model.members[id].username
      : '';
  },

  _change(item) {
    if (item) this.set('itemArray', [this.network]);
  },

  _computeMachines(network, machines) {
    if (!network || !machines) return [];
    return Object.values(this.model.machines).filter(m => {
      return m.network === network.id;
    });
  },

  _computeHasSubnets(network) {
    return network && network.subnets && network.subnets.length;
  },

  _computeNetworkCloud(network, _clouds) {
    if (network) return this.model.clouds[this.network.cloud].title;
    return '';
  },

  _computeNetworkTags(_network, _networkTags) {
    if (this.network) {
      return Object.entries(this.network.tags).map(([key, value]) => ({
        key,
        value,
      }));
    }
    return [];
  },

  _editNetwork(e) {
    console.log(e);
  },

  _deleteNetwork(_e) {
    this._showDialog({
      title: 'Delete Network?',
      body: `Deleting networks cannot be undone. You are about to delete network: '${this.network.name}'.`,
      danger: true,
      reason: 'network.delete',
    });
  },

  _handleNetworDeletekAjaxResponse(_e) {
    this.dispatchEvent(
      new CustomEvent('go-to', {
        bubbles: true,
        composed: true,
        detail: {
          url: '/networks',
        },
      })
    );
  },

  _showDialog(info) {
    const dialog = this.shadowRoot.querySelector('dialog-element');
    Object.keys(info || {}).forEach(i => {
      dialog[i] = info[i];
    });
    dialog._openDialog();
  },

  _computeIsloading(_network) {
    return !this.network;
  },

  _computeSubnets(_network, _subnets) {
    return Object.values((this.network && this.network.subnets) || []);
  },

  _networkDeleted(e) {
    console.log(e);
    if (!this.hidden && e.detail.responseURL.endsWith(this.network.id))
      this.dispatchEvent(
        new CustomEvent('go-to', {
          bubbles: true,
          composed: true,
          detail: { url: '/networks' },
        })
      );
  },
});
