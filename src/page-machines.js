import '../node_modules/@polymer/app-route/app-route.js';
import '../node_modules/@polymer/paper-spinner/paper-spinner.js';
import '../node_modules/@mistio/mist-list/mist-list.js';
import '../node_modules/@polymer/paper-fab/paper-fab.js';
import './machines/machine-create.js';
import './machines/machine-page.js';
import './machines/machine-actions.js';
import { ratedCost } from './helpers/utils.js';
import moment from '../node_modules/moment/src/moment.js';
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

      .logs {
        max-width: 1450px;
        margin: 8px auto;
        padding: 0 8px;
        line-height: 28px;
        font-family: monospace;
        border: 1px solid #ddd;
        border-radius: 8px;
        padding: 0 8px;
        background-color: rgba(255, 255, 255, 0.34);
        display: flex;
        align-items: center;
      }

      paper-spinner {
        margin: 4px 8px;
      }

      .logs > * {
        font-size: 14px;
      }

      .logs p {
        flex: 1;
      }

      .error iron-icon {
        opacity: 0.32;
        cursor: pointer;
      }

      .error {
        color: var(--red-color);
      }

      h2[slot='header'] {
        margin: 8px;
      }

      iron-icon.close {
        float: right;
        padding: 5px;
      }

      mist-list#machinesList {
        max-width: 95%;
      }
    </style>
    <app-route
      route="{{route}}"
      pattern="/:machine"
      data="{{data}}"
    ></app-route>
    <div class="logs" hidden$="[[!showLogs]]">
      <paper-spinner
        active$="[[!logItem.error]]"
        hidden$="[[logItem.error]]"
      ></paper-spinner>
      <p>
        Creating machine: {{removeUnderscore(logItem.action)}}
        <span class="error" hidden$="[[!logItem.error]]"
          >[[logItem.error]]</span
        >
      </p>
      <iron-icon icon="close" on-tap="clearLog"></iron-icon>
    </div>
    <div class="logs" hidden$="[[!performingAction]]">
      <paper-spinner active></paper-spinner>
      <p id="actionLogs"></p>
      <iron-icon
        class="close"
        icon="close"
        on-tap="hidePerformingLogs"
      ></iron-icon>
    </div>
    <template is="dom-if" if="[[_isListActive(route.path)]]" restamp>
      <machine-actions
        actions="{{actions}}"
        items="[[selectedItems]]"
        model="[[model]]"
      >
        <mist-list
          id="machinesList"
          selectable
          resizable
          column-menu
          multi-sort
          sorters="[[sorters]]"
          item-map="[[model.machines]]"
          name="Machines"
          selected-items="{{selectedItems}}"
          filtered-items-length="{{filteredItemsLength}}"
          frozen="[[_getFrozenLogColumn()]]"
          visible="[[_getVisibleColumns()]]"
          renderers="[[_getRenderers()]]"
          route="{{route}}"
          user-filter="[[model.sections.machines.q]]"
          primary-field-name="id"
          actions="[[actions]]"
          filter-method="[[_ownerFilter()]]"
          apiurl="/api/v1/machines"
          csrfToken="[[CSRFToken.value]]"
        >
          <p slot="no-items-found">No machines found.</p>
        </mist-list>
      </machine-actions>
      <div
        class="absolute-bottom-right"
        hidden$="[[!check_perm('create','machine', null, model.org, model.user)]]"
      >
        <paper-fab
          id="machinesAdd"
          icon="add"
          on-tap="_addResource"
        ></paper-fab>
      </div>
    </template>
    <machine-create
      model="[[model]]"
      hidden$="[[!_isAddPageActive(route.path)]]"
      monitoring="[[monitoring]]"
      docs="[[docs]]"
    ></machine-create>
    <template is="dom-if" if="[[_isDetailsPageActive(route.path)]]" restamp>
      <machine-page
        path="[[route.path]]"
        model="[[model]]"
        machine="[[currentMachine]]"
        section="[[model.sections.machines]]"
        monitoring="[[monitoring]]"
        user="[[model.user.id]]"
        hidden$="[[!_isDetailsPageActive(route.path)]]"
        portal-name="[[portalName]]"
        resource-id="[[data.machine]]"
        currency="[[currency]]"
      ></machine-page>
    </template>
    <iron-ajax
      id="getJobLog"
      method="GET"
      url="/api/v1/jobs/[[jobId]]"
      handle-as="json"
      on-response="handleGetJobLog"
      on-error="handleGetJobLogError"
    ></iron-ajax>
  `,
  is: 'page-machines',
  behaviors: [ownerFilterBehavior, rbacBehavior],

  properties: {
    model: {
      type: Object,
    },
    data: {
      type: Object,
    },
    ownership: {
      type: Boolean,
    },
    itemOfRecommendation: {
      type: Object,
    },
    selectedItems: {
      type: Array,
    },
    jobId: {
      type: String,
    },
    logItem: {
      type: Object,
      value: false,
    },
    intervalID: {
      type: String,
    },
    performingAction: {
      type: Boolean,
      value: false,
    },
    monitoring: {
      type: Boolean,
      value: false,
    },
    actions: {
      type: Array,
    },
    sorters: {
      type: Array,
      value() {
        return [['state', 'asc']];
      },
    },
    currentMachine: {
      type: Object,
      computed: '_getMachine(data.machine, model.machines, model.machines.*)',
    },
    portalName: {
      type: String,
      value: 'Mist.io',
    },
    currency: {
      type: Object,
    },
    showLogs: {
      type: Boolean,
      value: false,
    },
  },

  listeners: {
    'open-recommendation-dialog': 'openRecommendationsDialog',
    'performing-action': 'updateActionLogs',
    'action-finished': 'stopActionLogs',
    recommendation: 'openRecommendationsDialog',
    'set-job-id': 'setJobId',
  },

  observers: ['_jobIdChanged(jobId)', '_logItemChanged(logItem.*)'],

  _getMachine(id, _machines) {
    if (id && this.model && this.model.machines && this.model.machines[id])
      return this.model.machines[id];
    return '';
  },

  setJobId(e) {
    // console.log('setJobId',e.detail)
    if (e.detail.jobId) {
      this.set('jobId', e.detail.jobId);
    } else if (e.detail.job_id) {
      this.set('jobId', e.detail.job_id);
    }
  },

  _isAddPageActive(path) {
    return path === '/+create';
  },

  _isDetailsPageActive(path) {
    // console.log('load _isDetailsPageActive', path);
    if (path && path !== '/+create') {
      if (this.shadowRoot && this.shadowRoot.querySelector('machine-page')) {
        this.shadowRoot.querySelector('machine-page').updateState();
      }
      return true;
    }
    return false;
  },

  _isListActive(path) {
    return !path;
  },

  _shell(_event) {
    const action = {
      name: 'shell',
      icon: 'vaadin:terminal',
      confirm: false,
      multi: true,
    };
    if (this.caller === 'machine_page') {
      this.$.actions_machine._performAction(action, [
        this.itemOfRecommendation,
      ]);
    } else {
      this.$.actions.performMachineAction(action, [this.itemOfRecommendation]);
    }
  },

  _jobIdChanged(jobid) {
    // console.log('_jobIdChanged', jobid);
    if (jobid === false) {
      this.stopPolling();
    } else if (jobid && jobid.length) {
      this.startPolling(jobid);
    }
  },

  _showLogs(val) {
    this.set('showLogs', val);
  },

  startPolling(jobid) {
    if (jobid) {
      this._showLogs(true);
      this.intervalID = setInterval(() => {
        this.$.getJobLog.generateRequest();
      }, 1000);
    }
    // console.log('startPolling');
  },

  stopPolling() {
    // console.log('stopPolling');
    this.set('jobId', false);
    if (this.intervalID !== false) {
      window.clearInterval(this.intervalID);
      this.set('intervalID', false);
    }
  },

  _logItemChanged(_logItem) {
    // If a log's action mentions `finished`, then stop polling.
    // console.log('_logItemChanged');
    if (
      this.logItem &&
      this.logItem.action &&
      this.logItem.action.endsWith('finished')
    ) {
      this.stopPolling();
      // Hide logs if no errors occure.
      if (!this.logItem.error) {
        this._showLogs(false);
      }
    }
  },

  handleGetJobLog(e) {
    // console.log('handleGetJobLog');
    // Save last log in logItem
    this.set(
      'logItem',
      e.detail.response.logs[e.detail.response.logs.length - 1]
    );
  },

  handleGetJobLogError(e) {
    // console.log('handleGetJobLogError', e.detail);
    // Save last log in logItem - if it exists - and stop polling
    this.set('logItem', {
      error: `${e.detail.error.message} (request: /api/v1/jobs/${this.jobId})`,
    });
    this.stopPolling();
  },

  removeUnderscore(action) {
    if (action) return action.replace(/_/g, ' ');
    return '';
  },

  clearLog(_e) {
    this.stopPolling();
    this._showLogs(false);
    this.set('logItem', {});
  },

  updateActionLogs(e) {
    this.set('performingAction', true);
    this.$.actionLogs.textContent = e.detail.log;
  },
  stopActionLogs(e) {
    const { success } = e.detail;
    this.$.actionLogs.textContent = '';
    this.set('performingAction', false);
    if (success) this.clearListSelection();
  },

  hidePerformingLogs(_e) {
    this.set('performingAction', false);
  },

  clearListSelection() {
    this.set('selectedItems', []);
  },

  _addResource(_e) {
    this.dispatchEvent(
      new CustomEvent('go-to', {
        bubbles: true,
        composed: true,
        detail: {
          url: this.model.sections.machines.add,
        },
      })
    );
  },

  _getFrozenLogColumn() {
    return ['name'];
  },

  _getVisibleColumns() {
    const ret = [
      'state',
      'cloud',
      'cost',
      'created',
      'expiration',
      'created_by',
      'tags',
      'image_id',
      'size',
      'location',
      'parent',
      'hostname',
      'public_ips',
    ];
    if (this.model.org && this.model.org.ownership_enabled === true)
      ret.splice(ret.indexOf('created_by'), 0, 'owned_by');
    return ret;
  },

  _getRenderers() {
    const _this = this;
    return {
      indicator: {
        body: (_item, row) => {
          const green = '#69b46c';
          const pending = '#eee';
          const red = '#d96557';
          let color = 'transparent';
          // 'background:  repeating-linear-gradient(-45deg,#ddd,#ddd 2px,#eee 2px,#eee 4px);'
          if (row.monitoring && row.monitoring.hasmonitoring) {
            color = green;
            if (_this._machineHasIncidents(row, _this.model.incidentsArray))
              color = red;
            if (
              row.monitoring.installation_status === 'installing' ||
              !row.monitoring.installation_status === 'installing' ||
              !row.monitoring.installation_status.activated_at
            )
              color = pending;
            return `border-left: 8px solid ${color}; padding-left: 8px;`;
          }
          return 'border-left: 8px solid transparent; padding-left: 8px;';
        },
      },
      icon: {
        body: (_item, row) => {
          if (!_this.model.clouds[row.cloud]) return '';
          if (
            _this.model.clouds[row.cloud].provider === 'libvirt' &&
            row.parent
          ) {
            return './assets/providers/kvm.png';
          }
          return `./assets/providers/provider-${_this.model.clouds[
            row.cloud
          ].provider
            .replace('_', '')
            .replace(' ', '')}.png`;
        },
      },
      name: {
        body: (item, _row) => {
          return `<strong class="name">${item}</strong>`;
        },
        cmp: (row1, row2) => {
          return row1.name.localeCompare(row2.name, 'en', {
            sensitivity: 'base',
          });
        },
      },
      state: {
        body: (item, row) => {
          let ret = '';
          let prefix = '';
          if (_this.itemRecommendation(row)) {
            prefix =
              '<iron-icon icon="icons:report-problem" class="recommendation-icon"></iron-icon>';
          }
          if (item === 'running')
            ret += `<div class='state ${_this.itemProbeClasses(
              row
            )}'><span class='green'>${item}</span></div>`;
          else if (item === 'error')
            ret += `<div class='state ${_this.itemProbeClasses(
              row
            )}'><span class='error'>${item}</span></div>`;
          else if (item === 'stopped')
            ret += `<div class='state ${_this.itemProbeClasses(
              row
            )}'><span class='orange'>${item}</span></div>`;
          else ret += `<div class='state'>${item}</div>`;

          return prefix + ret;
        },
        cmp: (row1, row2) => {
          if (row1.monitoring && !row2.monitoring) {
            return -1;
          }
          if (!row1.monitoring && row2.monitoring) {
            return 1;
          }
          return row1.state.localeCompare(row2.state);
        },
      },
      cloud: {
        body: (item, _row) => {
          if (_this.model && _this.model.clouds)
            return _this.model.clouds[item]
              ? _this.model.clouds[item].title
              : '';
          return '';
        },
        cmp: (row1, row2) => {
          const item1 = row1.cloud;
          const item2 = row2.cloud;
          if (
            _this.model &&
            _this.model.clouds &&
            _this.model.clouds[item1] &&
            _this.model.clouds[item2]
          ) {
            if (
              _this.model.clouds[item1].title < _this.model.clouds[item2].title
            )
              return -1;
            if (
              _this.model.clouds[item1].title > _this.model.clouds[item2].title
            )
              return 1;
          }
          return 0;
        },
      },
      parent: {
        body: (item, _row) => {
          if (
            item &&
            _this.model &&
            _this.model.machines &&
            _this.model.machines[item]
          ) {
            return `<a href="/machines/${item}">${_this.model.machines[item].name}</a>`;
          }
          return item;
        },
      },
      cost: {
        body: (item, _row) => {
          return item && item.monthly && _this.currency
            ? _this.currency.sign +
                _this._ratedCost(parseFloat(item.monthly), _this.currency.rate)
            : '';
        },
        cmp: (row1, row2) => {
          const item1 = row1.cost;
          const item2 = row2.cost;
          if (item1.monthly < item2.monthly) return -1;
          if (item1.monthly > item2.monthly) return 1;
          return 0;
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
      created: {
        body: (item, _row) => {
          return moment(item).isValid() ? moment.utc(item).fromNow() : '';
        },
      },
      size: {
        body: (item, row) => {
          return _this.computeSize(row, item);
        },
        cmp: (row1, row2) => {
          const item1 = row1.size;
          const item2 = row2.size;
          const s1 = _this.computeSize(row1, item1);
          const s2 = _this.computeSize(row2, item2);

          if (!s1.length && !s2.length) return 0;
          if (!s1.length) return 1;
          if (!s2.length) return -1;

          if (s1.toLowerCase() < s2.toLowerCase()) return -1;
          if (s1.toLowerCase() > s2.toLowerCase()) return 1;
          return 0;
        },
      },
      image_id: {
        title: (_item, _row) => {
          return 'image';
        },
        body: (item, row) => {
          return _this._computeImage(row, item);
        },
        cmp: (row1, row2) => {
          const item1 = row1.image_id;
          const item2 = row2.image_id;
          const im1 = _this._computeImage(row1, item1);
          const im2 = _this._computeImage(row2, item2);

          if (!im1.length && !im2.length) return 0;
          if (!im1.length) return 1;
          if (!im2.length) return -1;

          if (im1.toLowerCase() < im2.toLowerCase()) return -1;
          if (im1.toLowerCase() > im2.toLowerCase()) return 1;
          return 0;
        },
      },
      expiration: {
        title: (_item, _row) => {
          return 'expiration';
        },
        body: (item, _row) => {
          return item && item.date ? moment.utc(item.date).fromNow() : '';
        },
        cmp: (row1, row2) => {
          const item1 = row1.expiration;
          const item2 = row2.expiration;
          const exp1 = item1 && item1.date ? moment(item1.date) : moment('');
          const exp2 = item2 && item2.date ? moment(item2.date) : moment('');

          if (!exp1.isValid() && !exp2.isValid()) return 0;
          if (!exp1.isValid()) return 1;
          if (!exp2.isValid()) return -1;

          if (exp1.isBefore(exp2)) return -1;
          if (exp1.isAfter(exp2)) return 1;
          return 0;
        },
      },
      location: {
        body: (item, row) => {
          let location = '';
          if (
            _this.model &&
            _this.model.clouds &&
            _this.model.clouds[row.cloud] &&
            _this.model.clouds[row.cloud].locations
          )
            location = _this.model.clouds[row.cloud].locations[item];
          return location ? location.name : item || '';
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
      machine_id: {
        title: 'id (external)',
        body: i => {
          return i;
        },
      },
      public_ips: {
        title: "public ip's",
        body: ips => {
          return ips && ips.join(', ');
        },
      },
      private_ips: {
        title: "private ip's",
        body: ips => {
          return ips.join(', ');
        },
      },
      hostname: {
        body: hostname => {
          return hostname || '';
        },
      },
    };
  },

  _ratedCost(cost, rate) {
    return ratedCost(cost, rate);
  },

  _computeImage(row, item) {
    // FIXME This needs to be standarized in the backend to remove the cruft below
    let imageID = item || row.image;

    if (!imageID && row.extra && row.extra.image) {
      if (row.extra.image.distribution && row.extra.image.name) {
        return `${row.extra.image.distribution} ${row.extra.image.name}`;
      }
      imageID = row.extra.image;
    }
    if (!imageID && row.extra) {
      imageID =
        row.extra.imageID ||
        row.imageId ||
        (row.extra.image && (row.extra.image.slug || row.extra.image.name));
    }

    if (
      imageID &&
      row.cloud &&
      this.model.clouds[row.cloud] &&
      this.model.clouds[row.cloud].images &&
      this.model.clouds[row.cloud].images[imageID]
    ) {
      return this.model.clouds[row.cloud].images[imageID].name;
    }

    return imageID || '';
  },

  computeSize(row, item) {
    // FIXME This needs to be standarized in the backend to remove the cruft below
    let sizeID = item;

    // Try to figure out size_id
    if (row.size && typeof row.size !== 'object') {
      sizeID = row.size || '';
    }

    if (!sizeID && row.extra) {
      if (row.extra.size && typeof row.extra.size === 'string') {
        sizeID = row.extra.size;
      } else {
        sizeID =
          row.extra.instance_type ||
          row.extra.instance_size ||
          row.extra.service_type ||
          row.extra.PLANID;
      }
    }

    // Given size_id, try to figure out actual size name
    if (
      sizeID &&
      this.model.clouds &&
      this.model.clouds[row.cloud.id] &&
      this.model.clouds[row.cloud.id].sizes &&
      this.model.clouds[row.cloud.id].sizes[sizeID]
    ) {
      const size = this.model.clouds[row.cloud.id].sizes[sizeID];
      return size.name || size.id;
    }

    // If that fails look for size info in the extra metadata
    if (row.extra) {
      let sizeName = '';
      if (row.extra.size && row.extra.size.vcpus) {
        sizeName = `${row.extra.size.vcpus}vCPU`;
        if (row.extra.size.memory)
          sizeName += `, ${row.extra.size.memory}MB RAM`;
        return sizeName;
      }
      if (row.extra.maxCpu) {
        sizeName = `${row.extra.maxCpu}vCPU`;
        if (row.extra.maxMemory) sizeName += `, ${row.extra.maxMemory}MB RAM`;
        return sizeName;
      }
    }

    return sizeID || '';
  },

  _getMachineWeight(machine, _model) {
    let weight = 0;
    const machineHasIncidents = this._machineHasIncidents(
      machine,
      this.model.incidentsArray
    );
    const machineHasMonitor = this._machineHasMonitoring(machine);
    const machineHasrecommendations = this._machineHasrecommendations(machine);
    const machineHasProbe = this._machineHasProbe(machine);
    const machineState = this._machineState(machine);
    weight =
      machineHasIncidents +
      machineHasMonitor +
      machineHasrecommendations +
      machineHasProbe +
      machineState;
    return !Number.isNaN(weight) ? weight : 0;
  },

  _machineHasIncidents(machine, incidents) {
    const machineIncidents = incidents
      ? incidents.filter(inc => {
          return (
            inc.machine_id === machine.machine_id &&
            inc.cloud_id === machine.cloud &&
            !inc.finished_at
          );
        })
      : [];
    return machineIncidents ? machineIncidents.length * 1000 : 0;
  },

  _machineHasMonitoring(machine) {
    return machine.monitoring && machine.monitoring.hasmonitoring ? 100 : 0;
  },

  _machineHasrecommendations(machine, _probes) {
    return machine.probe && machine.probe.ssh && machine.probe.ssh.dirty_cow
      ? 10
      : 0;
  },

  _machineHasProbe(machine) {
    return machine.probe && machine.probe.ssh && machine.probe.ssh.loadloadavg
      ? machine.probe.ssh.loadloadavg[0] +
          machine.probe.ssh.loadloadavg[1] +
          machine.probe.ssh.loadloadavg[2]
      : 1;
  },

  _machineState(machine) {
    if (machine.state === 'running') return 5;
    if (machine.state === 'error') return 3;
    if (machine.state === 'stopped') return 2;
    if (machine.state === 'terminated') return 1;
    if (machine.state === 'unknown') return 0;
    return 0;
  },

  itemRecommendation(item) {
    if (this.probes === {} || !item || !item.id) {
      return false;
    }
    if (!this.model.probes[item.id] || !this.model.probes[item.id].dirty_cow)
      return false;
    return true;
  },

  itemProbeClasses(item) {
    if (this.probes === {}) {
      return '';
    }
    if (!this.model.probes[item.id] || !this.model.probes[item.id].loadavg) {
      return '';
    }
    const probe = this.model.probes[item.id].loadavg;
    const cores = parseInt(this.model.probes[item.id].cores, 10);
    let classes = '';

    classes += this.loadToColor(parseFloat(probe[0] / cores), 'short');
    classes += this.loadToColor(parseFloat(probe[1] / cores), 'mid');
    classes += this.loadToColor(parseFloat(probe[2] / cores), 'long');

    // has probe data
    if (classes !== '') classes += 'hasprobe ';

    return classes;
  },

  loadToColor(load, prefix) {
    if (load > 1.2) return `${prefix}high `;
    if (load > 0.8) return `${prefix}medium `;
    if (load > 0.6) return `${prefix}eco `;
    if (load > 0.2) return `${prefix}low `;
    return `${prefix}low `;
  },
});
