import '../../node_modules/@polymer/paper-material/paper-material.js';
import '../../node_modules/@polymer/paper-button/paper-button.js';
import '../../node_modules/@polymer/paper-spinner/paper-spinner.js';
import '../../node_modules/@polymer/paper-dialog/paper-dialog.js';
import '../element-for-in/element-for-in.js';
import '../tags/tags-list.js';
import '../helpers/dialog-element.js';
import { mistLoadingBehavior } from '../helpers/mist-loading-behavior.js';
import '../mist-rules/mist-rules.js';
import { mistLogsBehavior } from '../helpers/mist-logs-behavior.js';
import { mistRulesBehavior } from '../helpers/mist-rules-behavior.js';
import './cloud-edit.js';
import './cloud-actions.js';
import './other-cloud-machines.js';
import './other-cloud-add-machine.js';
import { CSRFToken } from '../helpers/utils.js';
import { Polymer } from '../../node_modules/@polymer/polymer/lib/legacy/polymer-fn.js';
import { html } from '../../node_modules/@polymer/polymer/lib/utils/html-tag.js';

Polymer({
  _template: html`
    <style include="tags-and-labels single-page shared-styles">
      :host {
        padding-bottom: 80px;
        --paper-toggle-button-checked-button-color: #69b46c;
        --paper-toggle-button-checked-bar-color: #69b46c;
        --paper-toggle-button-unchecked-button-color: #d96557;
        --paper-toggle-button-unchecked-bar-color: #d96557;
      }

      :host #enable-disable-cloud {
        --paper-toggle-button-label-color: #fff !important;
      }

      paper-material {
        display: block;
        padding: 20px;
      }

      paper-material.separator {
        padding-bottom: 40px;
        border-top: 4px solid #ddd;
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

      h2 span {
        font-size: 0.6em;
        opacity: 0.54;
      }

      .icon iron-icon {
        background-color: rgba(255, 255, 255, 0.9) !important;
      }

      .paper-header [paper-drawer-toggle] {
        margin-left: 10px;
      }

      .paper-header {
        @apply --layout-horizontal;
      }

      .paper-header {
        height: 60px;
        font-size: 24px;
        line-height: 60px;
        padding: 0 10px;
        color: white;
        transition: height 0.2s;
        transition: font-size 0.2s;
      }

      .paper-header.tall {
        height: 320px;
        font-size: 16px;
      }

      .paper-header h2 {
        margin-left: 20px;
        @apply --layout-flex;
        text-transform: capitalize;
      }

      .paper-header .toggleViewButton {
        --paper-icon-button-ink-color: transparent;
      }

      .paper-header .cartButton {
        margin-right: 10px;
      }

      paper-icon-button {
        transition: all 200ms;
      }

      [size='xs'] > * {
        display: none;
      }

      [size='xs'] mist-sidebar {
        min-width: 100%;
        height: auto;
      }

      paper-icon-bottom.bottom {
        padding-right: 8px;
      }

      paper-material.no-pad {
        padding: 0;
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

      .button {
        padding-bottom: 1em;
      }

      paper-button.red {
        background-color: #d96557 !important;
      }

      paper-material > p {
        padding: 0;
      }

      paper-toggle-button {
        display: inline-flex;
        cursor: pointer;
      }

      .capitalize {
        text-transform: capitalize;
      }

      h3.dns-title {
        margin: 0;
        font-size: 20px;
        letter-spacing: -0.012em;
      }

      @media screen and (max-width: 366px) {
        cloud-edit ::slotted(paper-button#reset) {
          float: none;
        }
      }

      @media screen and (max-width: 600px) {
        .item-actions {
          padding-top: 12px;
        }
        .single-head {
          flex-wrap: wrap;
        }
        .single-head .title {
          min-width: 30%;
        }
      }

      .single-head {
        @apply --cloud-page-head-mixin;
      }

      .view.blue-link {
        /*font-size: .8em;*/
        padding: 0;
        margin: 0;
        text-transform: none !important;
        text-align: left !important;
        justify-content: flex-start;
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

      .resource-info {
        padding-right: 36px;
        vertical-align: top;
        display: flex;
        flex: 1;
      }

      .tag {
        padding: 2px 0.5em;
        display: inline;
      }
      cloud-actions {
        width: 50%;
      }
      .small {
        transform: scale(0.7);
        width: 100%;
        left: -15%;
        position: relative;
      }
      .border-left {
        border-left: 1px solid #ddd;
        padding-left: 16px;
      }
    </style>
    <div id="content">
      <paper-material class="single-head layout horizontal">
        <span class="icon">
          <iron-icon src="[[_computeItemImage(cloud)]]"></iron-icon>
        </span>
        <div class="title flex">
          <h2>
            [[cloudTitle]]
            <span class="capitalize" hidden$="[[!cloud.enabled]]"
              >[[cloud.state]]</span
            >
          </h2>
          <div class="subtitle">
            <paper-toggle-button
              id="enable-disable-cloud"
              checked$="[[cloud.enabled]]"
              on-tap="_changeState"
              disabled$="{{loading}}"
            >
              <span hidden$="[[!cloud.enabled]]">ENABLED</span>
              <span hidden$="[[cloud.enabled]]">DISABLED</span>
            </paper-toggle-button>
          </div>
        </div>
        <cloud-actions
          id="actions_machine"
          items="[[itemArray]]"
          model="[[model]]"
          actions="{{actions}}"
          providers="[[providers]]"
          portal-name="[[portalName]]"
        ></cloud-actions>
      </paper-material>

      <paper-material hidden$="[[!isMissing]]">
        <div class="missing">Cloud not found.</div>
      </paper-material>

      <template is="dom-if" if="[[cloud.id]]" restamp="">
        <paper-material class="info">
          <div class="resource-info">
            <div class="table">
              <div class="row">
                <div class="cell">
                  <h4>ID:</h4>
                </div>
                <div class="cell">
                  <span>[[cloud.id]] </span>
                </div>
              </div>
              <div class="row" hidden$="[[!cloud.region]]">
                <div class="cell">
                  <h4>Region:</h4>
                </div>
                <div class="cell">
                  <span>[[cloud.region]]</span>
                </div>
              </div>
              <div class="row">
                <div class="cell">
                  <h4>Machines:</h4>
                </div>
                <div class="cell">
                  <span hidden$="[[_computeShowCount(runningMachinesLength)]]"
                    >[[runningMachinesLength]] running</span
                  >
                  <paper-button
                    class="simple blue-link view"
                    on-tap="viewRunning"
                    hidden$="[[!runningMachinesLength]]"
                    >[[runningMachinesLength]] running</paper-button
                  >
                  <br />
                  <span hidden$="[[_computeShowCount(stoppedMachinesLength)]]"
                    >[[stoppedMachinesLength]] stopped</span
                  >
                  <paper-button
                    class="simple blue-link view"
                    on-tap="viewStopped"
                    hidden$="[[!stoppedMachinesLength]]"
                    >[[stoppedMachinesLength]] stopped</paper-button
                  >
                </div>
              </div>
              <div class="row" hidden$="[[!_canShowImages(cloud.provider)]]">
                <div class="cell">
                  <h4>Images:</h4>
                </div>
                <div class="cell">
                  <span hidden$="[[_computeShowCount(imagesArrayLength)]]"
                    >[[imagesArrayLength]]</span
                  >
                  <paper-button
                    class="simple blue-link view"
                    on-tap="viewImages"
                    hidden$="[[!imagesArrayLength]]"
                    >[[imagesArrayLength]] images</paper-button
                  >
                </div>
              </div>
              <div class="row" hidden$="[[!_canShowLocations(cloud.provider)]]">
                <div class="cell">
                  <h4>Locations:</h4>
                </div>
                <div class="cell">
                  <span>[[locationsArrayLength]]</span>
                </div>
              </div>
              <div class="row">
                <div class="cell">
                  <h4>Networks:</h4>
                </div>
                <div class="cell">
                  <span hidden$="[[_computeShowCount(networksLength)]]"
                    >[[networksLength]]</span
                  >
                  <paper-button
                    class="simple blue-link view"
                    on-tap="viewNetworks"
                    hidden$="[[!networksLength]]"
                    >[[networksLength]] networks</paper-button
                  >
                </div>
              </div>
            </div>
          </div>
          <div class="resource-info">
            <div class="table">
              <div class="row">
                <div class="cell">
                  <h4>State:</h4>
                </div>
                <div class="cell">
                  <span>[[cloud.state]]</span>
                </div>
              </div>
              <div class="row" hidden$="[[!cloud.owned_by.length]]">
                <div class="cell">
                  <h4>Owner:</h4>
                </div>
                <div class="cell">
                  <span
                    ><a href$="/members/[[cloud.owned_by]]"
                      >[[_displayUser(cloud.owned_by,model.members)]]</a
                    ></span
                  >
                </div>
              </div>
              <div class="row" hidden$="[[!cloud.created_by.length]]">
                <div class="cell">
                  <h4>Created by:</h4>
                </div>
                <div class="cell">
                  <span
                    ><a href$="/members/[[cloud.created_by]]"
                      >[[_displayUser(cloud.created_by,model.members)]]</a
                    ></span
                  >
                </div>
              </div>
              <div class="row" hidden$="[[!cloudTags.length]]">
                <div class="cell">
                  <h4>Tags:</h4>
                </div>
                <div class="cell">
                  <template is="dom-repeat" items="[[cloudTags]]">
                    <span class="tag"
                      >[[item.key]]<span hidden="[[!item.value]]"
                        >=[[item.value]]</span
                      ></span
                    >
                  </template>
                </div>
              </div>
              <div class="row">
                <div class="cell">
                  <h4>Features:</h4>
                  <br />
                </div>
                <div class="cell">
                  <paper-toggle-button
                    id="DNS-enable-disable"
                    class="small"
                    checked$="[[cloud.dns_enabled]]"
                    on-tap="_changeDNSenabled"
                    disabled="[[dnsloading]]"
                    hidden$="[[!_isSupportedDNSProvider(cloud.provider)]]"
                  >
                    <span hidden$="[[!cloud.dns_enabled]]">DNS enabled</span>
                    <span hidden$="[[cloud.dns_enabled]]">DNS disabled</span>
                  </paper-toggle-button>
                  <br hidden$="[[!_isSupportedDNSProvider(cloud.provider)]]" />
                  <paper-toggle-button
                    id="OBS-enable-disable"
                    class="small"
                    checked$="[[cloud.observation_logs_enabled]]"
                    on-tap="_changeOBSLOGSenabled"
                    disabled="[[obsloading]]"
                  >
                    <span hidden$="[[!cloud.observation_logs_enabled]]"
                      >Observation logs enabled</span
                    >
                    <span hidden$="[[cloud.observation_logs_enabled]]"
                      >Observation logs disabled</span
                    >
                  </paper-toggle-button>
                  <br />
                  <br />
                </div>
              </div>
            </div>
          </div>
        </paper-material>
        <paper-material class="no-pad">
          <div class="info-table">
            <div class="info-body info-group">
              <element-for-in content="[[cloud.extra]]"></element-for-in>
            </div>
          </div>
        </paper-material>
      </template>
      <template
        is="dom-if"
        if="[[_canShowHostsList(cloud.provider)]]"
        restamp=""
      >
        <paper-material class="separator">
          <other-cloud-machines
            cloud="[[cloud]]"
            model="[[model]]"
          ></other-cloud-machines>
        </paper-material>
      </template>
      <br />
      <paper-material class="no-pad">
        <template is="dom-if" if="[[cloud]]" restamp="">
          <mist-rules
            id="cloudRules"
            incidents="[[model.incidentsArray]]"
            rules="[[_rulesApplyOnResource(model.rules, cloud, cloudTags.length, 'cloud')]]"
            teams="[[model.teamsArray]]"
            users="[[model.membersArray]]"
            resource="[[cloud]]"
            resource-type="cloud"
            model="[[model]]"
            collapsible=""
          ></mist-rules>
        </template>
      </paper-material>
      <br />
      <paper-material class="no-pad">
        <template is="dom-if" if="[[cloud]]" restamp="">
          <mist-list
            id="cloudLogs"
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
            name="cloud logs"
            primary-field-name="time"
            base-filter="[[cloud.id]]"
          ></mist-list>
        </template>
      </paper-material>
    </div>
    <iron-ajax
      id="cloudStateAjaxRequest"
      loading="{{loading}}"
      handle-as="json"
      url="/api/v1/clouds/[[cloud.id]]"
      method="POST"
      on-response="_handleCloudStateAjaxResponse"
      on-error="_handleCloudStateAjaxError"
    ></iron-ajax>

    <iron-ajax
      id="cloudEditDNSAjaxRequest"
      url="/api/v1/clouds/[[cloud.id]]"
      handle-as="xml"
      method="POST"
      on-response="_handleCloudEditDNSAjaxResponse"
      on-error="_handleCloudEditDNSAjaxError"
      loading="{{dnsloading}}"
    ></iron-ajax>

    <iron-ajax
      id="cloudEditOBSLOGSAjaxRequest"
      url="/api/v1/clouds/[[cloud.id]]"
      handle-as="xml"
      method="POST"
      on-response="_handleCloudEditOBSLOGSAjaxResponse"
      on-error="_handleCloudEditOBSLOGSAjaxError"
      loading="{{obsloading}}"
    ></iron-ajax>
    <tags-list model="[[model]]"></tags-list>
    <dialog-element id="confirm"></dialog-element>
  `,

  is: 'cloud-page',

  behaviors: [mistLoadingBehavior, mistLogsBehavior, mistRulesBehavior],

  properties: {
    section: {
      type: Object,
    },
    model: {
      type: Object,
    },
    cloud: {
      type: Object,
    },
    cloudTitle: {
      type: String,
      computed: '_computeCloudTitle(cloud)',
    },
    cloudTags: {
      type: String,
      computed:
        '_computeCloudTags(cloud, cloud.tags, cloud.tags.*, model.clouds.*)',
    },
    isLoading: {
      type: Boolean,
      computed: '_computeIsloading(cloud)',
      value: true,
    },
    imagesArrayLength: {
      type: Number,
      value: 0,
    },
    locationsArrayLength: {
      type: Number,
      value: 0,
    },
    networksLength: {
      type: Number,
      value: 0,
    },
    runningMachinesLength: {
      type: Number,
      value: 0,
    },
    stoppedMachinesLength: {
      type: Number,
      value: 0,
    },
    expectedState: {
      type: String,
    },
    addMachine: {
      type: Boolean,
      value: false,
    },
    itemArray: {
      type: Array,
    },
    actions: {
      type: Array,
    },
  },

  listeners: {
    confirmation: '_deleteCloud',
    'delete-cloud': '_deleteCloudConfirmation',
  },

  observers: [
    '_cloudChanged(cloud, cloud.*)',
    '_cloudArraysChanged(cloud,cloud.*,cloud.imagesArray,cloud.locationsArray,cloud.networks,cloud.machines)',
  ],

  _cloudChanged() {
    // console.log(this.cloud, this.cloud.enabled, [this.cloud])
    this.set('itemArray', this.cloud ? [this.cloud] : []);
    this._cloudArraysChanged();
  },

  _displayUser(id) {
    return this.model && id && this.model.members && this.model.members[id]
      ? this.model.members[id].name ||
          this.model.members[id].email ||
          this.model.members[id].username
      : '';
  },

  _canShowImages(provider) {
    return !this._isBareMetal(provider);
  },

  _canShowLocations(provider) {
    return !this._isBareMetal(provider);
  },

  _canShowHostsList(provider) {
    return provider === 'libvirt' || this._isBareMetal(provider);
  },

  _cloudArraysChanged() {
    if (this.cloud) {
      this.async(() => {
        if (this.cloud) {
          this.set(
            'imagesArrayLength',
            this.cloud.imagesArray ? this.cloud.imagesArray.length : 0
          );
          this.set(
            'locationsArrayLength',
            this.cloud.locationsArray ? this.cloud.locationsArray.length : 0
          );
          this.set(
            'networksLength',
            this.cloud.networks ? Object.keys(this.cloud.networks).length : 0
          );
          this.set(
            'runningMachinesLength',
            this._computeRunningMachines(this.cloud.machines)
          );
          this.set(
            'stoppedMachinesLength',
            this._computeStoppedMachines(this.cloud.machines)
          );
        }
      }, 1000);
    }
  },

  viewRunning() {
    this.goToFilteredList('machines', 'running');
  },

  viewStopped() {
    this.goToFilteredList('machines', 'stopped');
  },

  viewImages() {
    this.goToFilteredList('images');
  },

  viewNetworks() {
    this.goToFilteredList('networks');
  },

  goToFilteredList(page, state) {
    const search = state ? ` ${state}` : '';
    this.dispatchEvent(
      new CustomEvent('go-to', {
        bubbles: true,
        composed: true,
        detail: {
          url: `/${page}`,
          search: this.cloud.title + search,
        },
      })
    );
  },

  _computeShowCount(c) {
    console.log('_computeShowCount', c);
    return c !== 0;
  },

  _computeRunningMachines() {
    const _this = this;
    return this.cloud.machines
      ? Object.keys(this.cloud.machines).filter(
          m => _this.cloud.machines[m].state === 'running'
        ).length
      : 0;
  },

  _computeStoppedMachines() {
    const _this = this;
    return this.cloud.machines
      ? Object.keys(this.cloud.machines).filter(
          m => _this.cloud.machines[m].state === 'stopped'
        ).length
      : 0;
  },

  _computeCloudTitle(cloud) {
    return cloud && cloud.title;
  },

  _computeCloudTags() {
    if (this.cloud) {
      return Object.entries(this.cloud.tags).map(([key, value]) => ({
        key,
        value,
      }));
    }
    return [];
  },

  _computeIsloading() {
    return !this.cloud;
  },

  _computeItemImage(item) {
    if (item && item.provider) {
      const provider = item.provider.replace('_', '');
      return `assets/providers-large/provider-${provider}.png`;
    }
    return '';
  },

  _showDialog(info) {
    const dialog = this.querySelector('dialog-element#confirm');
    if (info) {
      Object.keys(info).forEach(i => {
        dialog[i] = info[i];
      });
    }
    dialog._openDialog();
  },

  _isSupportedDNSProvider(provider) {
    // FIXME: Don't hardcode this. Backend needs to pass this info to ui.
    return (
      [
        'ec2',
        'gce',
        'digitalocean',
        'linode',
        'rackspace',
        'softlayer',
        'vultr',
      ].indexOf(provider) > -1
    );
  },

  _isBareMetal(provider) {
    return provider === 'bare_metal';
  },

  _changeState() {
    this.$['enable-disable-cloud'].disabled = true;
    this.$.cloudStateAjaxRequest.headers['Content-Type'] = 'application/json';
    this.$.cloudStateAjaxRequest.headers['Csrf-Token'] = CSRFToken.value;
    this.$.cloudStateAjaxRequest.body = {
      new_state: this.cloud.enabled ? '0' : '1',
    };
    this.expectedState = this.cloud.enabled ? 'disabled' : 'enabled';
    this.$.cloudStateAjaxRequest.generateRequest();
  },

  _handleCloudStateAjaxResponse() {
    const message = `Cloud ${this.cloud.title} was ${this.expectedState}!`;
    this.dispatchEvent(
      new CustomEvent('toast', {
        bubbles: true,
        composed: true,
        detail: {
          msg: message,
          duration: 5000,
        },
      })
    );
  },

  _handleCloudStateAjaxError(e) {
    this.$['enable-disable-cloud'].checked = this.cloud.enabled;
    this.dispatchEvent(
      new CustomEvent('toast', {
        bubbles: true,
        composed: true,
        detail: {
          msg: e.detail.request.xhr.response,
          duration: 10000,
        },
      })
    );
  },

  _changeOBSLOGSenabled() {
    const observationLogsEnabled = this.cloud.observation_logs_enabled ? 0 : 1;
    this.$.cloudEditOBSLOGSAjaxRequest.headers['Content-Type'] =
      'application/json';
    this.$.cloudEditOBSLOGSAjaxRequest.headers['Csrf-Token'] = CSRFToken.value;
    this.$.cloudEditOBSLOGSAjaxRequest.body = {
      observationLogsEnabled,
    };
    this.$.cloudEditOBSLOGSAjaxRequest.generateRequest();
  },

  _handleCloudEditOBSLOGSAjaxResponse() {
    const message = this.shadowRoot.querySelector('#OBS-enable-disable').checked
      ? `Observation logs for ${this.cloud.title} enabled!`
      : `Observation logs for ${this.cloud.title} disabled!`;
    this.dispatchEvent(
      new CustomEvent('toast', {
        bubbles: true,
        composed: true,
        detail: { msg: message, duration: 5000 },
      })
    );
  },

  _handleCloudEditOBSLOGSAjaxError(e) {
    this.shadowRoot.querySelector(
      '#OBS-enable-disable'
    ).checked = this.cloud.observation_logs_enabled;
    this.dispatchEvent(
      new CustomEvent('toast', {
        bubbles: true,
        composed: true,
        detail: { msg: e.detail.request.xhr.response, duration: 10000 },
      })
    );
  },

  _changeDNSenabled() {
    const dnsEnabled = this.cloud.dns_enabled ? 0 : 1;
    this.$.cloudEditDNSAjaxRequest.headers['Content-Type'] = 'application/json';
    this.$.cloudEditDNSAjaxRequest.headers['Csrf-Token'] = CSRFToken.value;
    this.$.cloudEditDNSAjaxRequest.body = {
      dnsEnabled,
    };
    this.$.cloudEditDNSAjaxRequest.generateRequest();
  },

  _handleCloudEditDNSAjaxResponse() {
    const message = this.shadowRoot.querySelector('#DNS-enable-disable').checked
      ? `DNS support for ${this.cloud.title} enabled!`
      : `DNS support for ${this.cloud.title} disabled!`;
    this.dispatchEvent(
      new CustomEvent('toast', {
        bubbles: true,
        composed: true,
        detail: { msg: message, duration: 5000 },
      })
    );
  },

  _handleCloudEditDNSAjaxError(e) {
    this.shadowRoot.querySelector(
      '#DNS-enable-disable'
    ).checked = this.cloud.dns_enabled;
    this.dispatchEvent(
      new CustomEvent('toast', {
        bubbles: true,
        composed: true,
        detail: { msg: e.detail.request.xhr.response, duration: 10000 },
      })
    );
  },
});
