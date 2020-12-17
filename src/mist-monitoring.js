import '../node_modules/@polymer/polymer/polymer-legacy.js';
import '../node_modules/@polymer/paper-styles/typography.js';
import '../node_modules/@polymer/paper-material/paper-material.js';
import '../node_modules/@polymer/paper-button/paper-button.js';
import '../node_modules/@polymer/paper-icon-button/paper-icon-button.js';
import '../node_modules/@polymer/paper-spinner/paper-spinner.js';
import '../node_modules/@mistio/polyana-dashboard/polyana-dashboard.js';
import '../node_modules/@polymer/paper-listbox/paper-listbox.js';
import './helpers/dialog-element.js';
import './add-graph.js';
import { CSRFToken } from './helpers/utils.js';
import { Polymer } from '../node_modules/@polymer/polymer/lib/legacy/polymer-fn.js';
import { html } from '../node_modules/@polymer/polymer/lib/utils/html-tag.js';
import { YAML } from '../node_modules/yaml/browser/dist/index.js';

Polymer({
  _template: html`
    <style include="shared-styles">
      :host {
        background-color: #fafafa;
        display: block;
      }
      .monitoringArea {
        padding: 16px;
      }
      h2 {
        margin: 0px;
        line-height: 24px;
      }

      h2 > paper-button {
        text-transform: none;
        margin: 0;
        width: 100%;
        justify-content: left;
      }

      #monitorindialog ::slotted(paper-dialog h2) {
        padding: 0 24px !important;
      }

      .console {
        background-color: #444;
        color: #fff;
        padding: 8px;
        margin-top: 24px;
        margin-bottom: 24px;
      }

      #errormsgArea p {
        margin-top: 0;
      }

      .errormsg-container {
        color: var(--red-color);
      }

      .errormsg-container iron-icon {
        color: inherit;
      }

      polyana-dashboard {
        overflow: visible;
      }

      paper-button.blue,
      paper-button.red {
        margin: 24px 0 0 0;
      }

      paper-button.red {
        background-color: #d96557 !important;
      }

      .head {
        margin-top: 0;
      }

      .tip {
        opacity: 0.54;
        font-size: 0.9em;
      }

      div#errormsgArea {
        display: block;
        clear: both;
      }

      .monitoring-menu {
        align-self: center;
        margin-right: 8px;
      }

      paper-icon-button ::slotted(iron-icon) {
        color: inherit;
      }

      paper-menu-button#monitoring-menu-wrapper ::slotted(.dropdown-menu) {
        margin-top: 0 !important;
      }

      #monitoring-actions {
        padding: 8px;
      }

      #disable {
        margin-top: 0;
        width: 200px;
      }

      .error {
        color: var(--red-color);
      }

      .logs {
        position: relative;
        background-color: #f1f1f1;
        padding: 4px 16px;
        border-radius: 3px;
        margin-bottom: 24px;
      }

      paper-spinner {
        margin-top: 16px;
      }

      .incident {
        text-align: center;
        background-color: var(--red-color);
        color: #fff;
        padding: 4px;
        margin: 2px 0;
      }

      polyana-dashboard::slotted(paper-button[dialog-confirm]) {
        background-color: var(--mist-blue);
        color: #fff;
      }

      polyana-dashboard::slotted(paper-dialog h2) {
        padding: 16px;
        background-color: #424242;
        color: #fff;
        margin: 0;
      }

      polyana-dashboard::slotted(h3) {
        text-transform: uppercase;
        opacity: 0.54;
        font-size: 13px;
      }

      .monitoring-head {
        @apply --mist-monitoring-head-mixin;
      }

      .close-logs {
        position: absolute;
        right: 8px;
        top: 8px;
      }

      paper-button.action {
        display: block;
        flex-wrap: nowrap;
        white-space: nowrap;
        width: 100%;
        min-width: auto;
        padding: 0.8em 1.57em 0.7em 0.57em;
        fill: inherit;
        color: #000;
      }

      paper-button.action iron-icon {
        fill: inherit;
        margin-right: 8px;
      }

      paper-menu-button {
        padding: 0;
      }
    </style>
    <template is="dom-if" if="[[!singleResource]]" restamp="">
      <template is="dom-if" if="[[showHomeDashboard]]" restamp="">
        <polyana-dashboard
          id="dashboard"
          uri="/api/v1/dashboard"
          datasources="[[datasources]]"
          replace-targets="[[replaceTargets]]"
        ></polyana-dashboard>
      </template>
    </template>
    <template is="dom-if" if="[[singleResource]]" restamp="">
      <div class="horizontal layout monitoring-head">
        <h2 class="flex flex-1">
          <paper-button toggles="" active="{{showMonitoring}}"
            ><iron-icon
              icon="icons:expand-more"
              style$="margin-right: 8px; [[_computeToggleButtonStyle(showMonitoring)]]"
            ></iron-icon
            >Monitoring</paper-button
          >
        </h2>
        <div class="monitoring-menu" hidden$="[[!isActivated]]">
          <paper-menu-button
            id="monitoring-menu-wrapper"
            horizontal-align="right"
            vertical-align="top"
          >
            <paper-icon-button
              icon="icons:more-vert"
              class="dropdown-trigger"
              slot="dropdown-trigger"
            ></paper-icon-button>
            <div
              id="monitoring-actions"
              class="dropdown-content"
              slot="dropdown-content"
            >
              <paper-button on-tap="_exportPdf" class="action"
                ><iron-icon icon="image:picture-as-pdf"></iron-icon> Export pdf
              </paper-button>
              <paper-button
                id="disable"
                on-tap="_showDisableDialog"
                class="action"
                ><iron-icon icon="icons:visibility-off"></iron-icon>Disable
                Monitoring
              </paper-button>
            </div>
          </paper-menu-button>
        </div>
      </div>
      <iron-collapse opened="[[showMonitoring]]">
        <div class="monitoringArea collapse-content">
          <!-- the machine is running -->
          <div hidden$="[[!isRunning]]">
            <!-- the machine is considered monitored -->
            <div hidden$="[[!isMonitored]]">
              <!-- monitoring is not activated -->
              <div hidden$="[[isActivated]]">
                <div
                  hidden$="[[resourceMonitoringInfo.installation_status.activated_at]]"
                >
                  <h4 class="head">
                    <strong>Monitoring is not yet activated</strong>
                  </h4>
                </div>
                <!-- machine has keys: automatic installation -->
                <p hidden$="[[isManual]]">
                  When you enable monitoring on a machine, [[portalName]]
                  automatically installs the telegraf monitoring agent which
                  starts transmitting data.
                </p>
              </div>
            </div>
            <div hidden$="[[isManual]]">
              <div class="logs" hidden$="[[!showLogs]]">
                <p hidden$="[[!jobId]]">
                  LOGS
                  <iron-icon
                    class="close-logs"
                    icon="close"
                    on-tap="resetPolling"
                  ></iron-icon>
                  <br />
                  <template is="dom-repeat" items="{{logItems}}" as="logItem">
                    <div>
                      [[removeUnderscore(logItem.action)]]
                      <span class="error" hidden$="[[!logItem.error]]"
                        >[[logItem.error]]</span
                      >
                    </div>
                  </template>
                  <paper-spinner active="[[!isActivated]]"></paper-spinner>
                </p>
                <div hidden$="[[jobId]]">
                  <p hidden$="[[failed]]">
                    Agent installation status: [[monitoringState(resource,
                    monitoring)]]
                    <br />
                    [[resourceMonitoringInfo.installation_status.error_msg]]
                  </p>
                  <!-- installation failed-->
                  <p class="error" hidden$="[[!failed]]">
                    Installation of the monitoring agent failed.
                    [[resourceMonitoringInfo.installation_status.error_msg]]
                  </p>
                </div>
                <div hidden$="[[!waitingData]]">
                  <p>Waiting for data</p>
                </div>
              </div>
            </div>
            <div class="isMonitored" hidden$="[[!isMonitored]]">
              <!-- monitoring is not activated -->
              <div class="isActivated" hidden$="[[isActivated]]">
                <!-- machine has NO keys: manual installation -->
                <p hidden$="[[!isManual]]">
                  [[portalName]] can not install the monitoring agent
                  automatically, because there are no associated keys with this
                  machine.
                </p>
                <!-- always show script -->
                <div>
                  You can install the agent manually by running the following
                  command with ssh.
                  <div class="console">
                    <code id="monitoringscript"> [[script]] </code>
                  </div>
                  <h4 class="tip">
                    <strong>Tip:</strong> Alternatively you can disable
                    monitoring, associate a key, and enable monitoring again, so
                    [[portalName]] will automativally connect and install the
                    monitoring agent.
                  </h4>
                </div>
              </div>
              <!-- if we have incidents -->
              <template is="dom-if" if="[[incidents.length]]" restamp="">
                <template
                  is="dom-repeat"
                  items="{{openIncidents}}"
                  as="incident"
                >
                  <div
                    class="incident"
                    hidden$="[[_isIncidentFinished(incident.finished_at)]]"
                  >
                    [[_computeIncidentCondition(incident)]]
                  </div>
                </template>
              </template>
              <!-- monitoring is activated. we expect to have data -->
              <template is="dom-if" if="[[isActivated]]" restamp="">
                <polyana-dashboard
                  id="dashboard"
                  uri="[[_computeDashboardUri(resource)]]"
                  datasources="[[datasources]]"
                ></polyana-dashboard>
                <add-graph
                  machine="[[resource]]"
                  machine-keys="[[machineKeys]]"
                ></add-graph>
              </template>
            </div>
            <div id="errormsgArea">
              <p class="errormsg-container" hidden$="[[!monitoringError]]">
                <iron-icon icon="icons:error-outline"></iron-icon>
                <span id="errormsg"></span>
              </p>
            </div>
            <!-- we can request monitoring button -->
            <div class="enableMonitoring" hidden$="[[isMonitored]]">
              <paper-button
                class="blue"
                on-tap="toggleMonitoring"
                disabled="{{showLogs}}"
                >Enable Monitoring</paper-button
              >
            </div>
            <!-- the machine is considered monitored -->
            <div class="monitored" hidden$="[[!isMonitored]]">
              <!-- instalation succeeded but is not yet activated ie. we have no data yet-->
              <paper-button
                class="red"
                on-tap="toggleMonitoring"
                hidden$="[[isActivated]]"
                >Disable Monitoring</paper-button
              >
            </div>
          </div>
          <!-- the machine cannot be monitored, it is not running -->
          <div hidden$="[[isRunning]]">
            The machine is [[state]]. It must be running to enable monitoring.
            <br />
            <paper-button class="blue" on-tap="toggleMonitoring" disabled=""
              >enable Monitoring</paper-button
            >
          </div>
        </div>
      </iron-collapse>
    </template>
    <dialog-element id="monitorindialog"></dialog-element>
    <iron-ajax
      id="monitoringRequest"
      url="/api/v1/machines/[[resource.id]]/monitoring"
      method="POST"
      on-response="_monitoringResponse"
      on-error="_monitoringError"
      on-request="_monitoringRequest"
      handle-as="xml"
    ></iron-ajax>
    <iron-ajax
      id="getStats"
      url="/api/v1/machines/[[resource.id]]/stats"
      handle-as="xml"
      method="GET"
      contenttype="application/json"
      loading="{{loadingStats}}"
      on-response="_handleStatsResponse"
      on-error="_handleStatsError"
    >
    </iron-ajax>
    <iron-ajax
      id="disassociateMetric"
      handle-as="xml"
      method="DELETE"
      contenttype="application/json"
      loading="{{loadingMetrics}}"
      on-response="_handleAssociateResponse"
      on-error="_handleAssociateError"
    >
    </iron-ajax>
    <iron-ajax
      id="getJobLog"
      method="GET"
      url="/api/v1/jobs/[[jobId]]"
      handle-as="json"
      on-response="handleGetJobLog"
      on-error="handleGetJobLogError"
    ></iron-ajax>
  `,

  is: 'mist-monitoring',

  properties: {
    resource: {
      type: Object, // currently machines only, later other resources too
      value() {
        return {
          id: false,
        };
      },
    },
    singleResource: {
      computed: '_computeSingleResource(resource, resource.*)',
    },
    state: {
      type: String,
    },
    monitoring: {
      type: Object,
    },
    section: {
      type: Object,
    },
    isRunning: {
      type: Boolean,
      computed: '_computeIsRunning(resource, resource.*, state)',
    },
    resourceMonitoringInfo: {
      type: Object,
      computed:
        '_computeResourceMonitoringInfo(resource, monitoring.monitored_machines.*)',
    },
    isMonitored: {
      type: Boolean,
      value: false,
    },
    waitingData: {
      type: Boolean,
      computed:
        '_computeWaitingData(resource, monitoring.monitored_machines.*)',
      value: false,
    },
    installationError: {
      type: Boolean,
      value: false,
    },
    isActivated: {
      type: Boolean,
      value: false,
    },
    script: {
      type: String,
      computed: '_computeScript(resource, monitoring.monitored_machines.*)',
    },
    monitoringError: {
      type: Boolean,
      value: false,
    },
    showScript: {
      type: Boolean,
      value: false,
    },
    hasKeys: {
      type: Boolean,
      computed:
        '_computeHasKeys(resource.keys.*, monitoring.monitored_machines.*)',
      value: true,
    },
    isManual: {
      type: Boolean,
      computed:
        '_computeIsManual(isMonitored, resource, monitoring.monitored_machines.*)',
      value: true,
    },
    failed: {
      type: Boolean,
      value: true,
    },
    hidden: {
      type: Boolean,
      value: false,
    },
    machineKeys: {
      type: Array,
      value: [],
    },
    jobId: {
      type: String,
    },
    logItems: {
      type: Array,
    },
    intervalID: {
      type: String,
    },
    intervalMonitoringID: {
      type: String,
      value: '',
    },
    showLogs: {
      type: Boolean,
      computed: 'computeShowLogs(jobId, isMonitored, isActivated)',
      value: false,
    },
    showHomeDashboard: {
      type: Boolean,
      computed: '_computeShowHomeDashboard(monitoring, hidden, homeDashboard)',
    },
    homeDashboard: {
      type: Boolean,
      value: false,
    },
    datasources: {
      type: Array,
      value: [
        {
          id: 1,
          orgId: 1,
          name: 'mist.monitor',
          type: 'mist.monitor',
          uri: '/api/v1/stats',
        },
      ],
    },
    replaceTargets: {
      type: Object,
    },
    incidents: {
      type: Array,
    },
    openIncidents: {
      type: Array,
      computed:
        '_computeOpenIncidents(incidents, incidents.length, incidents.*)',
    },
    portalName: {
      type: String,
      value: 'Mist.io',
    },
    loadingStats: {
      type: Boolean,
      value: true,
    },
    loadingMetrics: {
      type: Boolean,
      value: true,
    },
    showMonitoring: {
      type: Boolean,
      value: true,
    },
  },

  observers: [
    '_reset(resource.id)',
    '_jobIdChanged(jobId)',
    'stopPolling(logItems)',
    'getStats(isMonitored, isManual, waitingData, isActivated)',
    'clearJobID(resource.id)',
    '_computeIsMonitored(resource, resource.id, monitoring.monitored_machines.*)',
    '_computeIsActivated(resource, monitoring.*, hidden)',
  ],

  listeners: {
    'update-dashboard': '_forwardEvent',
    confirmation: '_monitoringDisableConfirmation',
    'delete-panel': '_disassociateMetric',
  },

  _forwardEvent(e) {
    e.stopPropagation();
    this.shadowRoot.querySelector('polyana-dashboard')._updateDashboard(e);
  },

  _computeDashboardUri(resource) {
    if (resource) return `/api/v1/machines/${resource.id}/dashboard`;
    return '';
  },

  _computeIsMonitored(_resource, _id, _monitoring) {
    // console.log('compute Is Monitored', resource, id, monitoring);
    if (
      !this.resource ||
      !this.monitoring ||
      !this.monitoring.monitored_machines ||
      !this.monitoring.monitored_machines[this.resource.id]
    ) {
      this.set('isMonitored', false);
    } else {
      this.set('isMonitored', true);
    }
  },

  _computeSingleResource() {
    return !!(this.resource && this.resource.id);
  },

  _computeIsRunning(_resource, _resourceChangePath, _state) {
    return !!(
      this.resource &&
      this.resource.state &&
      (this.resource.state === 'running' || this.resource.state === 'unknown')
    );
  },

  _computeWaitingData(resource, _monitoring) {
    if (
      !this.resource ||
      !this.monitoring ||
      !this.monitoring.monitored_machines ||
      !this.monitoring.monitored_machines[resource.id] ||
      !this.monitoring.monitored_machines[resource.id].installation_status
    ) {
      return false;
    }
    if (
      this.monitoring.monitored_machines[resource.id].installation_status
        .state === 'succeeded' &&
      (!this.monitoring.monitored_machines[resource.id].installation_status
        .activated_at > 0 ||
        !this.monitoring.monitored_machines[resource.id].installation_status
          .finished_at > 0)
    ) {
      return true;
    }
    return false;
  },

  monitoringState(resource, _monitoring) {
    if (
      !this.monitoring ||
      !this.monitoring.monitored_machines ||
      !this.monitoring.monitored_machines[resource.id]
    ) {
      return '';
    }
    if (
      this.monitoring.monitored_machines[resource.id].installation_status
        .state === 'failed'
    ) {
      this.set('failed', true);
    }
    return this.monitoring.monitored_machines[resource.id].installation_status
      .state;
  },

  toggleMonitoring(_e, action) {
    const payload = {};
    console.log('toggleMonitoring', action);
    if (action !== 'disable') {
      payload.action = this.isMonitored ? 'disable' : 'enable';
    } else {
      payload.action = action;
    }

    payload.public_ips = this.resource.public_ips
      ? this.resource.public_ips
      : [];
    payload.name = this.resource.name ? this.resource.name : this.resource.id;
    payload.dns_name = this.resource.extra.dns_name
      ? this.resource.extra.dns_name
      : 'n/a';
    payload.no_ssh =
      !this.resource.key_associations ||
      this.resource.key_associations.length === 0
        ? 'true'
        : '';
    console.log('toggleMonitoring', payload);
    this.$.monitoringRequest.headers['Csrf-Token'] = CSRFToken.value;
    this.$.monitoringRequest.params = payload;
    this.$.monitoringRequest.generateRequest();
    this.set('failed', false);
  },

  _monitoringDisableConfirmation(e) {
    console.log('mist-monitoring', e);
    if (
      e.detail.reason === 'monitoring.disable' &&
      e.detail.response === 'confirm'
    ) {
      this.toggleMonitoring(e, 'disable');
    }
  },

  _monitoringRequest(_e) {
    this.set('failed', false);
  },

  _monitoringResponse(e) {
    // in case of enabling we get the script response
    let script = YAML.parse(e.detail.xhr.response);
    if (this.resource.os_type)
      script = script[`${this.resource.os_type}_command`];
    else script = script.command;

    if (script != null) this.set('showScript', true);
    else this.set('showScript', false);

    // in case of enabling we get the script response
    const response = YAML.parse(e.detail.xhr.response);
    if (response.job_id) {
      this.set('jobId', response.job_id);
    }
  },

  handleGetJobLog(e) {
    // console.log('handleGetJobLog', e);
    this.set('logItems', e.detail.response.logs);
  },

  handleGetJobLogError(_e) {},

  _jobIdChanged(jobid) {
    if (!jobid) {
      this.resetPolling();
    } else {
      this.startPolling(jobid);
    }
  },

  startPolling(_jobid) {
    this.intervalID = setInterval(() => {
      this.$.getJobLog.generateRequest();
    }, 1000);
    console.log('startpolling');
  },

  stopPolling(_logItems) {
    if (this.logItems && this.logItems.length > 0) {
      if (
        this.logItems[this.logItems.length - 1].action.endsWith(
          'deploy_collectd_finished'
        ) ||
        this.logItems[this.logItems.length - 1].action.endsWith(
          'deployment_finished'
        )
      ) {
        this.resetPolling();
      }
    }
  },

  computeShowLogs(_jobId, _isMonitored, _isActivated) {
    // console.log("computeShowLogs", this.resource.id)
    return (this.isMonitored && !this.isActivated) || this.jobId;
  },

  removeUnderscore(action) {
    return action.replace(/_/g, ' ');
  },

  resetPolling(error) {
    if (!error) {
      this.set('logItems', []);
    }
    this.set('jobId', false);
    window.clearInterval(this.intervalID);
    this.set('intervalID', false);
  },

  _monitoringError(e) {
    console.log('_monitoringError', e.detail.request.xhr.responseText);
    this.shadowRoot.querySelector('#errormsg').textContent =
      e.detail.request.xhr.responseText;
    this.set('monitoringError', true);
  },

  _reset(_resource) {
    this.set('monitoringError', false);
    this.set('showScript', false);
    this.set('failed', false);
  },

  _computeScript(resource, _monitoring) {
    if (
      !this.monitoring ||
      !this.monitoring.monitored_machines ||
      !resource ||
      !this.monitoring.monitored_machines[resource.id]
    ) {
      return '';
    }
    if (this.monitoring.monitored_machines[resource.id].commands) {
      return (
        this.monitoring.monitored_machines[resource.id].commands[
          this.resource.os_type
        ] || this.monitoring.monitored_machines[resource.id].commands.unix
      );
    }
    return '';
  },

  _computeIncidentCondition(item) {
    let condition = (item.logs.length && item.logs[0].condition) || '';
    // transform log condition
    if (condition.length && item.logs[0].rule_data_type === 'logs') {
      condition = condition
        .replace('COUNT(', 'Log ')
        .replace('){}', ' appeared ')
        .replace('within', 'times within');
    }
    return condition;
  },

  _computeIsActivated(resource, _monitoring, _hidden) {
    // console.log('_computeIsActivated', resource, monitoring, hidden)
    this.set('failed', false);
    if (
      this.hidden ||
      !this.isMonitored ||
      !this.monitoring ||
      !this.monitoring.monitored_machines ||
      !this.monitoring.monitored_machines[resource.id] ||
      (!this.monitoring.monitored_machines[resource.id].installation_status
        .activated_at &&
        !this.waitingData)
    ) {
      this.set('isActivated', false);
    } else {
      this.set('isActivated', true);
    }
  },

  _computeResourceMonitoringInfo(resource, _monitoring) {
    if (
      !resource ||
      !this.isMonitored ||
      !this.monitoring ||
      !this.monitoring.monitored_machines ||
      !this.monitoring.monitored_machines[resource.id]
    ) {
      return false;
    }
    return this.monitoring.monitored_machines[resource.id];
  },

  _computeHasKeys(_keys) {
    if (this.resource && this.resource.keys) {
      return this.resource.keys.length > 0;
    }
    return false;
  },

  _computeIsManual(_isMonitored, _resource, _monitoring) {
    if (
      !this.isMonitored ||
      !this.monitoring ||
      !this.monitoring.monitored_machines ||
      (this.resource &&
        (!this.monitoring.monitored_machines[this.resource.id] ||
          !this.monitoring.monitored_machines[this.resource.id]
            .installation_status.manual))
    ) {
      return false;
    }
    return true;
  },

  _showDisableDialog() {
    let msg;
    if (this.resource.key_associations && this.resource.key_associations.length)
      msg = 'The monitoring agent will be uninstalled automatically';
    else msg = 'You may need to manually uninstall the monitoring agent.';
    this._showDialog({
      title: 'Disable Machine Monitoring',
      body: msg,
      danger: true,
      reason: 'monitoring.disable',
      action: 'disable monitoring',
    });
  },

  _showDialog(info) {
    const dialog = this.$.monitorindialog;
    Object.keys(info || {}).forEach(i => {
      dialog[i] = info[i];
    });
    dialog._openDialog();
  },

  _disassociateMetric(e) {
    const { targets } = e.detail.panel.panel;

    targets.forEach(target => {
      if (target.target.startsWith('mist.python')) {
        this.$.disassociateMetric.url = `/api/v1/machines/${this.resource.id}/plugins/${target.target}`;
        this.$.disassociateMetric.headers['Csrf-Token'] = CSRFToken.value;
        this.$.disassociateMetric.params = {
          plugin_type: 'python',
        };
        this.$.disassociateMetric.generateRequest();
      }

      const payload = {
        metric_id: target.target,
      };
      this.$.disassociateMetric.url = `/api/v1/machines/${this.resource.id}/metrics`;
      this.$.disassociateMetric.headers['Csrf-Token'] = CSRFToken.value;
      this.$.disassociateMetric.params = payload;
      this.$.disassociateMetric.generateRequest();
    }, this);
  },

  _handleAssociateResponse(_target) {
    this.shadowRoot.querySelector('polyana-dashboard')._updateDashboard();
  },

  clearJobID(_resource) {
    // clear job when navigating away
    this.set('jobId', false);
  },

  getStats(_isMonitored, _isManual, _waitingData, _isActivated) {
    if (
      this.isMonitored &&
      !this.isActivated &&
      this.monitoring.monitored_machines[this.resource.id]
        .installation_status !== 'succeeded'
    ) {
      if (!this.intervalMonitoringID) this.monitoringPolling();
    } else {
      this.stopGetStats();
    }
  },

  monitoringPolling() {
    const that = this;
    console.log(
      '_getStats',
      that.shadowRoot.querySelector('#getStats'),
      window
    );
    this.intervalMonitoringID = window.setInterval(() => {
      that.shadowRoot.querySelector('#getStats').generateRequest();
      console.log('monitoringPolling');
    }, 5000);
  },

  _handleStatsResponse(_e) {
    this.stopGetStats();
  },

  _handleStatsError(_e) {
    this.stopGetStats();
  },

  stopGetStats() {
    window.clearInterval(this.get('intervalMonitoringID'));
    this.set('intervalMonitoringID', false);
  },

  _computeShowHomeDashboard(monitoring, hidden) {
    if (
      hidden ||
      !monitoring.machines ||
      !monitoring.machines.length ||
      !this.homeDashboard
    )
      return false;
    return true;
  },

  _isIncidentFinished(finishedAt) {
    return finishedAt > 0;
  },

  _computeOpenIncidents() {
    return this.incidents.filter(item => {
      return item.finished_at === 0;
    });
  },

  _computeToggleButtonStyle(expanded) {
    return (!expanded && 'transform: rotate(270deg);') || '';
  },
  //  Need better js to pdf dependency jsPDF won't work with rollup
  //   _exportPdf () {
  //       const generatePdf = () => {
  //           const pdf = new jsPDF(); let offset = 10;
  //           const timerangeButton = this.shadowRoot.querySelector('polyana-dashboard').shadowRoot.querySelector('timerange-picker').shadowRoot.querySelector('#currentTimeRangeButton');
  //           const timerangeHtml = timerangeButton.outerHTML;
  //           const resource = this.resource ? `<strong>${  this.resource.name  }</strong> &nbsp;&nbsp;` : '';
  //           pdf.fromHTML(resource + timerangeHtml, 10, offset);
  //           offset += 10;

  //           const incidents = this.shadowRoot.querySelectorAll('.incident');
  //           for (let i=0; i < incidents.length; i++) {
  //               pdf.fromHTML(incidents[i].outerHTML, 10, offset);
  //               offset += 10;
  //           }
  //           offset += 10;
  //           const panels = this.shadowRoot.querySelector('polyana-dashboard').shadowRoot.querySelectorAll('dashboard-panel');
  //           for (let i=0; i<panels.length; i++) {
  //               if (i && i%2 === 0) {
  //                   pdf.addPage();
  //                   offset = 10
  //               }
  //               const canvas = panels[i].shadowRoot.querySelector('canvas');
  //               pdf.fromHTML(panels[i].shadowRoot.querySelector('div.title').outerHTML, 10, offset+(i%2)*120);
  //               pdf.addImage(canvas.toDataURL('image/png'), 'PNG', 10, offset + 10 + (i%2)*120);
  //           }
  //           pdf.save(`${this.resource.name  }-${  timerangeButton.textContent.replace(' ', '')  }.pdf`);
  //       }
  //       generatePdf();
  //     }
});
