/* eslint-disable lit-a11y/anchor-is-valid */
import '@polymer/polymer/polymer-legacy.js';
import '@polymer/paper-button/paper-button.js';
import '@polymer/paper-styles/typography.js';
import '@polymer/paper-spinner/paper-spinner.js';
import '@polymer/paper-toggle-button/paper-toggle-button.js';
import '@polymer/iron-icons/editor-icons.js';
import '@polymer/iron-icons/av-icons.js';

import { Polymer } from '@polymer/polymer/lib/legacy/polymer-fn.js';
import { html } from '@polymer/polymer/lib/utils/html-tag.js';
import moment from 'moment/src/moment.js';

import '@mistio/mist-list/mist-list.js';
import '../mist-rules/mist-rules.js';
import { mistLogsBehavior } from '../helpers/mist-logs-behavior.js';
import { ownerFilterBehavior } from '../helpers/owner-filter-behavior.js';
import '../helpers/dialog-element.js';
import '../machines/machine-actions.js';
import { mistLoadingBehavior } from '../helpers/mist-loading-behavior.js';
import { mistRulesBehavior } from '../helpers/mist-rules-behavior.js';
import { machinesListBehavior } from '../helpers/machines-list-behavior.js';
import './schedule-date.js';
import './schedule-actions.js';
import { CSRFToken, formatMoney } from '../helpers/utils.js';

Polymer({
  _template: html`
    <style include="shared-styles single-page tags-and-labels forms">
      paper-material {
        display: block;
        padding: 20px;
      }

      paper-menu-button paper-button {
        display: block;
      }

      .flex {
        align-items: center;
      }

      .flex-horizontal-with-ratios {
        display: flex;
        flex-direction: row;
      }

      .flexchild {
        display: flex;
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

      .paper-header [paper-drawer-toggle] {
        margin-left: 10px;
      }

      .paper-header {
        display: flex;
        flex-direction: row;
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

      #content {
        -webkit-overflow-scrolling: touch;
      }

      paper-icon-button {
        transition: all 200ms;
      }

      h4.id {
        display: flex;
      }
      h4 {
        text-transform: uppercase;
        font-size: 0.9rem;
        font-weight: 700;
        margin-right: 16px;
      }

      .selectors {
        line-height: 1.85em;
        padding-bottom: 8px;
      }

      paper-icon-bottom.bottom {
        padding-right: 8px;
      }
      .m-info-head {
        text-transform: uppercase;
        font-weight: bold;
        font-size: 0.8em;
        display: inline-block;
        width: 80px;
        opacity: 0.54;
      }
      .does-not-exist {
        text-align: center;
        min-height: 500px;
      }
      .smaller {
        font-size: 0.9em;
      }
      .smaller .tag {
        display: inline;
        vertical-align: middle;
        padding: 2px 0.5em !important;
      }
      paper-button.blue-link[disabled] {
        color: rgba(0, 0, 0, 0.32) !important;
      }
      paper-button.blue-link {
        background-color: transparent !important;
        font-weight: 400 !important;
        color: var(--mist-blue) !important;
        margin: 0;
        padding: 0;
      }
      :host paper-toggle-button {
        display: inline-block;
        vertical-align: top;
        --paper-toggle-button-checked-bar-color: var(--green-color);
        --paper-toggle-button-checked-button-color: var(--green-color);
        --paper-toggle-button-checked-ink-color: var(--green-color);
        --paper-toggle-button-unchecked-bar-color: var(--red-color);
        --paper-toggle-button-unchecked-button-color: var(--red-color);
        --paper-toggle-button-unchecked-ink-color: var(--red-color);
      }
      #dateTimePickers .bottom-actions {
        display: flex;
        justify-content: flex-end;
        padding: 16px 24px !important;
        background-color: #424242;
        color: rgba(255, 255, 255, 0.54);
        border-top: 1px solid #555;
      }
      paper-dialog > * {
        margin: 0 !important;
        padding: 0 !important;
      }
      .never-expire {
        background-color: #424242;
        padding: 16px;
      }
      .never-expire paper-checkbox {
        color: #fff;
        font-weight: 500;
        font-size: 16px;
        text-transform: uppercase;
      }
      .note {
        color: rgba(0, 0, 0, 0.32);
        font-size: 0.9em;
      }
      .counts {
        padding: 0 8px;
        text-align: center;
      }
      .counts h2 {
        font-size: 26px;
        margin: 0;
        padding: 0;
      }
      .counts .m-info-head {
        width: 120px;
      }
      .missing-machines {
        margin-bottom: 16px;
      }
      .machine {
        line-height: 2em;
      }
      .machine code {
        background-color: #eee;
        padding: 2px 4px;
        border-radius: 4px;
      }
      paper-button#viewId {
        min-width: auto;
      }
      span.id {
        font-family: monospace;
        padding: 2px;
        background-color: #eee;
        border: 1px solid #ccc;
        border-radius: 3px;
        font-size: 0.8em;
      }
      span.id iron-icon {
        width: 14px;
        height: 14px;
        margin-left: 8px;
      }
      .single-head {
        @apply --schedule-page-head-mixin;
      }
      paper-input[type='datetime-local'] {
        display: inline-block;
      }
      schedule-actions {
        width: 50%;
      }
    </style>
    <div id="content">
      <paper-material class="single-head layout horizontal">
        <span class="icon"
          ><iron-icon icon="[[section.icon]]"></iron-icon
        ></span>
        <div class="title flex">
          <h2>[[schedule.name]]</h2>
          <div class="subtitle">
            [[_makeCleanerTask(schedule.task_type)]],
            [[_parseToLocalTime(schedule.schedule)]]
            <span hidden$="[[!isCrontab]]">UTC time</span>
          </div>
        </div>
        <schedule-actions
          id="actions"
          actions="{{actions}}"
          items="[[itemArray]]"
          model="[[model]]"
          user="[[model.user.id]]"
          members="[[model.membersArray]]"
          org="[[model.org]]"
          currency="[[currency]]"
          machines-cost="[[machineCost]]"
          in-single-view=""
        ></schedule-actions>
      </paper-material>
      <paper-material>
        <div class="missing" hidden$="[[!isMissing]]">Schedule not found</div>
        <div class="layout horizontal">
          <div class="flex flex-1">
            <h4 class="id">
              <paper-toggle-button
                id="scheduleEnabled"
                checked="[[schedule.task_enabled]]"
                on-tap="toggleEnable"
                disabled$="[[hasExpired]]"
              ></paper-toggle-button>
              <span hidden$="[[hasExpired]]">
                <span hidden$="[[!schedule.task_enabled]]">Enabled</span>
                <span hidden$="[[schedule.task_enabled]]">Disabled</span>
              </span>
              <span hidden$="[[!hasExpired]]">Scheduler has expired.</span>
            </h4>
            <span hidden$="[[hasExpired]]">
              <span class="note"
                >Currently
                <span hidden$="[[schedule.active]]">not</span> active.</span
              >
            </span>
          </div>
          <div class="counts">
            <h2>[[schedule.total_run_count]]</h2>
            <div class="m-info-head">Run Count</div>
          </div>
          <div class="counts">
            <h2>
              [[schedule.max_run_count]]
              <paper-icon-button
                on-tap="_editMaxRunCount"
                icon="editor:mode-edit"
              ></paper-icon-button>
            </h2>
            <div class="m-info-head">
              <div class="layout horizontal">
                <span>Maximum Runs</span>
              </div>
            </div>
          </div>
        </div>
      </paper-material>
      <paper-material class="resource-description">
        <div>
          <span class="m-info-head">ID: </span>
          <paper-button
            id="viewId"
            on-tap="_viewID"
            class="simple-button blue-link smaller"
            noink=""
            hidden$="[[showId]]"
            >View Id</paper-button
          >
          <span class="id" hidden$="[[!showId]]">
            <span id="scheduleId">[[schedule.id]]</span>
            <!-- <paper-button id="copyId" on-tap="_copyID" class="simple-button blue-link smaller" noink>Copy</paper-button> -->
            <iron-icon icon="clear" on-tap="_hideID"></iron-icon>
          </span>
        </div>
        <div hidden$="[[!schedule.owned_by.length]]">
          <span class="m-info-head">Owner: </span>
          <a href$="/members/[[schedule.owned_by]]"
            >[[_displayUser(schedule.owned_by,model.members)]]</a
          >
          <span class="m-info-head" hidden$="[[!schedule.created_by.length]]">
            - Created by:
          </span>
          <a href$="/members/[[schedule.created_by]]"
            >[[_displayUser(schedule.created_by,model.members)]]</a
          >
        </div>
        <div hidden$="[[!schedule.description.length]]">
          <span class="m-info-head">Descr.: </span>
          [[schedule.description]]
        </div>
        <div>
          <span class="m-info-head">Starts:</span>
          <schedule-date
            field="start_after"
            date="{{schedule.start_after}}"
            null-text="Now"
            value="{{newStartDate}}"
            disabled-edit="[[hasExpired]]"
            url="/api/v1/schedules/[[schedule.id]]"
          ></schedule-date>
        </div>
        <div>
          <span class="m-info-head">Expires:</span>
          <schedule-date
            field="expires"
            date="{{schedule.expires}}"
            null-text="Never"
            value="{{newExpiresDate}}"
            url="/api/v1/schedules/[[schedule.id]]"
          ></schedule-date>
        </div>
        <div hidden$="[[!schedule.last_run_at]]">
          <span class="m-info-head">Last Run:</span>
          [[_computeAbsoluteDateText(schedule.last_run_at)]]
          ([[_computeDateFromNow(schedule.last_run_at)]])
        </div>
        <div>
          <span class="m-info-head">Schedule:</span>
          [[_makeCleanerTask(schedule.task_type)]],
          [[_parseToLocalTime(schedule.schedule)]]
          <span hidden$="[[!isCrontab]]">UTC time</span>
          <a
            href$="[[_computeScriptLink(schedule)]]"
            class="blue-link regular smaller"
            hidden$="[[!isRunScript]]"
          >
            <iron-icon icon="link"></iron-icon>view script</a
          >
          <paper-button
            id="editTask"
            on-tap="_editTask"
            class="simple-button blue-link smaller"
            noink=""
            disabled$="[[hasExpired]]"
            >change</paper-button
          >
        </div>
      </paper-material>
      <paper-material>
        <h4>Machines</h4>
        <div class="selectors">
          <span hidden$="[[!isSpecificMachines]]" class="smaller">
            [[machinesIds.length]] selected machine(s)
          </span>
          <span hidden$="[[!isMachinesWithTags]]" class="smaller">
            Machines with tags
            <template is="dom-repeat" items="[[tagsArray]]">
              <span class="tag">[[item]]</span>
            </template>
            &nbsp; [[filteredItems.length]] machines affected
          </span>
          <span class="smaller" hidden$="[[!machineAge]]"
            >when OLDER THAN [[_computeAgeText(machineAge)]]</span
          >
          <span class="smaller" hidden$="[[!machineCost]]"
            >and if MACHINE COST is more than [[currency.sign]]
            [[machineCost]]/month</span
          >
          <paper-button
            id="editSelector"
            on-tap="_changeSelector"
            class="simple-button blue-link smaller"
            noink=""
            disabled$="[[hasExpired]]"
            >change</paper-button
          >
        </div>
        <div class="missing-machines">
          <template is="dom-repeat" items="[[missingMachines]]">
            <div class="machine">
              1 Missing machine with id <code>[[item]]</code>
            </div>
          </template>
        </div>

        <template is="dom-if" if="[[filteredItems]]" restamp="">
          <mist-list
            id="scheduleMachinesList"
            resizable=""
            column-menu=""
            multi-sort=""
            name="Machines"
            items="[[filteredItems]]"
            selected-items="{{selectedItems}}"
            filtered-items-length="{{filteredItemsLength}}"
            frozen="[[_getFrozenColumn()]]"
            visible="[[_getVisibleColumns()]]"
            renderers="[[_getRenderers()]]"
            route="{{route}}"
            primary-field-name="id"
            filter-method="[[_ownerFilter()]]"
          >
            <p slot="no-items-found">No machines found.</p>
          </mist-list>
          <!-- selected-items="{{selectedItems}}" -->
        </template>
      </paper-material>

      <br />
      <paper-material class="no-pad">
        <mist-rules
          id="scheduleRules"
          resource-type="schedule"
          incidents="[[model.incidentsArray]]"
          rules="[[_rulesApplyOnResource(model.rules, schedule, schedule.tags.*, 'schedule')]]"
          teams="[[model.teamsArray]]"
          users="[[model.membersArray]]"
          resource="[[schedule]]"
          model="[[model]]"
          collapsible=""
        ></mist-rules>
      </paper-material>
      <br />
      <paper-material class="no-pad">
        <template is="dom-if" if="[[schedule]]" restamp="">
          <mist-list
            id="scheduleLogs"
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
            name="schedule logs"
            primary-field-name="time"
            base-filter="[[schedule.id]]"
          ></mist-list>
        </template>
      </paper-material>
    </div>

    <dialog-element id="scheduleModal"></dialog-element>

    <iron-ajax
      id="deleteSchedule"
      url="/api/v1/schedules/[[schedule.id]]"
      method="DELETE"
      on-response="_handleScheduleDeleteResponse"
      on-error="_handleScheduleDeleteError"
    ></iron-ajax>

    <iron-ajax
      id="editToggleSchedule"
      url="/api/v1/schedules/[[schedule.id]]"
      method="PATCH"
      loading="{{toogleLoading}}"
      handle-as="xml"
      on-response="_handleScheduleEditToggleResponse"
      on-error="_handleScheduleEditToggleError"
    ></iron-ajax>

    <iron-ajax
      id="editExpirationSchedule"
      url="/api/v1/schedules/[[schedule.id]]"
      method="PATCH"
      loading="{{expLoading}}"
      handle-as="xml"
      on-response="_handleScheduleEditExpirationResponse"
      on-error="_handleScheduleEditExpirationError"
    ></iron-ajax>
  `,

  is: 'schedule-page',

  behaviors: [
    machinesListBehavior,
    mistLoadingBehavior,
    ownerFilterBehavior,
    mistLogsBehavior,
    mistRulesBehavior,
  ],

  properties: {
    model: {
      type: Object,
    },
    sections: {
      type: Array,
    },
    section: {
      type: Object,
    },
    schedule: {
      type: Object,
    },
    toogleLoading: {
      type: Boolean,
    },
    isLoading: {
      type: Boolean,
      value: true,
    },
    exists: {
      type: Boolean,
      value: false,
    },
    filteredItems: {
      type: Array,
    },
    missingMachines: {
      type: Array,
    },
    sortBy: {
      type: String,
      value: 'name',
    },
    sortOrder: {
      type: Number,
      value: 1,
    },
    selectors: {
      type: Array,
      value() {
        return [];
      },
    },
    machinesIds: {
      type: Array,
      computed: '_computeMachinesIds(selectors)',
    },
    hasExpired: {
      type: Boolean,
      value: false,
      computed: '_computeHasExpired(schedule.*)',
    },
    isSpecificMachines: {
      type: Boolean,
      computed: '_computeIsSpecificMachines(schedule.selectors)',
    },
    isMachinesWithTags: {
      type: Boolean,
      computed: '_computeIsMachinesWithTags(schedule.selectors)',
    },
    isInterval: {
      type: Boolean,
      computed: '_computeIsInterval(schedule.type)',
    },
    isCrontab: {
      type: Boolean,
      computed: '_computeIsCrontab(schedule.type)',
    },
    isOneOff: {
      type: Boolean,
      computed: '_computeIsOneOff(schedule.type)',
    },
    isAction: {
      type: Boolean,
      computed: '_computeIsAction(schedule)',
    },
    isRunScript: {
      type: Boolean,
      computed: '_computeIsRunScript(schedule)',
    },
    expLoading: {
      type: Boolean,
      value: false,
    },
    tagsArray: {
      type: Array,
      computed: '_computeTagsArray(schedule, isMachinesWithTags)',
    },
    neverExpire: {
      type: Boolean,
    },
    expError: {
      type: Boolean,
    },
    machines: {
      type: Array,
    },
    tags: {
      type: Array,
    },
    lastrequestedaction: {
      type: String,
    },
    machineAge: {
      type: Number,
      value: false,
      computed: '_computeMachineAge(schedule.selectors)',
    },
    machineCost: {
      type: Number,
      value: false,
      computed: '_computeMachineCost(schedule.selectors,currency.rate)',
    },
    selectedItems: {
      type: Array,
    },
    machineActions: {
      type: Array,
    },
    actions: {
      type: Array,
    },
    showId: {
      type: Boolean,
      value: false,
    },
    currency: {
      type: Object,
    },
  },

  observers: [
    '_scheduleChanged(schedule)',
    '_computeMachines(schedule.*, model.machines)',
  ],

  listeners: {
    'save-date': '_applyDateTime',
  },

  attached() {
    this.isLoading = false;
  },

  _displayUser(id, _members) {
    return this.model && id && this.model.members && this.model.members[id]
      ? this.model.members[id].name ||
          this.model.members[id].email ||
          this.model.members[id].username
      : '';
  },

  _viewID(_e) {
    this.set('showId', true);
  },

  _hideID(_e) {
    this.set('showId', false);
  },

  _copyId() {
    console.log('copy');
    this.clearSelection();
    const el = this.$.scheduleId;
    this.setSelection(el);
    const successful = document.execCommand('copy');
    const message = successful
      ? 'Copied to clipboard.'
      : 'There was an error copying to clipboard!';
    this.dispatchEvent(
      new CustomEvent('toast', {
        bubbles: true,
        composed: true,
        detail: { msg: message, duration: 3000 },
      })
    );
  },

  _scheduleChanged(schedule) {
    if (this.schedule && this.schedule.id) {
      this.exists = true;
      this.set('selectors', this.schedule.selectors);
      this.set('itemArray', [schedule]);
    } else {
      this.exists = false;
    }
  },

  _computeHasExpired(_schedule) {
    if (
      this.schedule &&
      this.schedule.expires !== undefined &&
      this.schedule.expires !== '' &&
      this.schedule.expires.length > 0
    ) {
      return moment().diff(moment.utc(this.schedule.expires).local()) > 0;
    }
    return false;
  },

  _computeIsInterval(_schedule) {
    if (this.schedule) return this.schedule.schedule_type === 'interval';
    return false;
  },

  _computeIsCrontab(_schedule) {
    if (this.schedule) return this.schedule.schedule_type === 'crontab';
    return false;
  },

  _computeIsOneOff(_schedule) {
    console.log('_computeIsOneOff');
    if (this.schedule) return this.schedule.schedule_type === 'one_off';
    return false;
  },

  _computeIsAction(_schedule) {
    if (this.schedule) return this.schedule.task_type.action;
    return '';
  },

  _computeIsRunScript(_schedule) {
    if (this.schedule) return this.schedule.task_type.script_id;
    return '';
  },

  _computeIsSpecificMachines(_schedule) {
    if (this.schedule)
      return !!(
        this.schedule.selectors &&
        this.schedule.selectors.length > 0 &&
        this._findSelector('machines')
      );
    return false;
  },

  _computeIsMachinesWithTags(_schedule) {
    if (this.schedule)
      return !!(
        this.schedule.selectors &&
        this.schedule.selectors.length > 0 &&
        this._findSelector('tags')
      );
    return false;
  },

  _findSelector(field) {
    if (
      this.schedule &&
      this.schedule.selectors &&
      this.schedule.selectors.length
    ) {
      const field_ = this.schedule.selectors.find(con =>
        ['age', 'machines', 'tags'].indexOf(field) === -1
          ? con.field === field
          : con.type === field
      );
      if (field_) {
        return true;
      }
    }
    return false;
  },

  _computeMachineAge(selectors) {
    if (selectors) {
      const ageEntry = selectors.find(c => c.type === 'age');
      return ageEntry ? ageEntry.minutes || false : false;
    }
    return null;
  },

  _computeMachineCost(selectors, _rate) {
    if (selectors) {
      const costEntry = selectors.find(
        c => c.type === 'field' && c.field === 'cost__monthly'
      );
      return costEntry && costEntry.value !== undefined
        ? costEntry.value
        : false;
    }
    return false;
  },

  _ratedCost(cost, _rate) {
    // TODO:  Does COST come in $ from backend? // cost ? formatMoney((cost/this.currency.rate), 2) : '';
    return formatMoney(cost, 2);
  },

  _computeAgeText(age) {
    let duration = 'minutes';
    let machineAge = parseInt(age, 10);
    if (age >= 60 && age % 60 === 0) {
      machineAge = age / 60;
      duration = 'hours';
      if (machineAge === 1) duration = 'hour';
    }
    if (age >= 60 * 24 && age % (60 * 24) === 0) {
      machineAge = age / (60 * 24);
      duration = 'days';
      if (machineAge === 1) duration = 'day';
    }
    return `${machineAge} ${duration}`;
  },

  _applyDateTime(e) {
    const payload = {};
    const field = e.detail.name;
    if (field) {
      if (!this.neverExpire) {
        payload[field] = moment(e.detail.date)
          .utc()
          .format('YYYY-MM-DD HH:mm:ss')
          .toString();
      } else {
        payload[field] = '';
      }
      // we need to reset start if hasExpired and expires if start has passed
      if (this.hasExpired) {
        if (field === 'start_after') {
          payload.expires = '';
        } else if (
          field === 'expires' &&
          (moment().diff(moment.utc(this.schedule.start_after).local()) > 0 ||
            this.schedule.start_after === '')
        ) {
          payload.start_after = '';
        }
      }
      this.$.editExpirationSchedule.body = payload;
      this.$.editExpirationSchedule.headers['Content-Type'] =
        'application/json';
      this.$.editExpirationSchedule.headers['Csrf-Token'] = CSRFToken.value;
      this.$.editExpirationSchedule.generateRequest();

      this.expError = false;
    }
  },

  _handleScheduleEditExpirationResponse() {
    const message = 'Updating date...';
    this.dispatchEvent(
      new CustomEvent('toast', {
        bubbles: true,
        composed: true,
        detail: { msg: message, duration: 3000 },
      })
    );
    this.$.dateTimePickers.close();
    this.expError = false;
    this.neverExpire = false;
  },

  _handleScheduleEditExpirationError(e) {
    console.log('_handleScheduleEditToggleError', e);
    const message = e.detail.request.xhr.response;
    this.dispatchEvent(
      new CustomEvent('toast', {
        bubbles: true,
        composed: true,
        detail: { msg: message, duration: 5000 },
      })
    );
    this.expError = true;
  },

  _deleteSchedule(_e) {
    this._showDialog({
      title: 'Delete Schedule?',
      body: 'Deleting schedules cannot be undone.',
      danger: true,
      action: 'delete',
      reason: 'schedule.delete',
    });
  },

  _handleScheduleDeleteResponse(_e) {
    this.dispatchEvent(
      new CustomEvent('go-to', {
        bubbles: true,
        composed: true,
        detail: { url: '/schedules' },
      })
    );
  },

  _handleScheduleDeleteError(e) {
    let message = e.detail.error;
    if (e.detail.request.statusText)
      message += ` ${e.detail.request.statusText}`;

    this.dispatchEvent(
      new CustomEvent('toast', {
        bubbles: true,
        composed: true,
        detail: { msg: message, duration: 5000 },
      })
    );
  },

  _showDialog(info) {
    const dialog = this.shadowRoot.querySelector(
      'dialog-element#scheduleModal'
    );
    Object.keys(info || {}).forEach(i => {
      dialog[i] = info[i];
    });
    dialog._openDialog();
  },

  _makeCleanerTask(task) {
    let ret = '';
    if (task) {
      if (task.action) {
        ret = task.action.toUpperCase();
        ret += ' machines';
      } else if (task.script_id) {
        const scriptName =
          this.model && this.model.scripts && this.model.scripts[task.script_id]
            ? this.model.scripts[task.script_id].name
            : 'missing script';
        ret = `RUN ${scriptName}`;
      }
    }
    return ret;
  },

  _parseToLocalTime(string) {
    if (!this.isOneOff) return string;
    let newString = '';
    if (string) {
      newString = `once on ${moment
        .utc(this.schedule.schedule_entry.entry)
        .local()
        .format('YYYY-MM-DD HH:mm')
        .toString()} (${moment
        .utc(this.schedule.schedule_entry.entry)
        .local()
        .fromNow()})`;
    }
    return newString;
  },

  _computeScriptLink(_schedule) {
    if (this.schedule && this.schedule.task_type.script_id) {
      return `/scripts/${this.schedule.task_type.script_id}`;
    }
    return '';
  },

  _computeMachines(_schedule, _machines) {
    let filteredMachines = [];
    const missingMachines = [];
    const _that = this;
    filteredMachines = Object.values(this.model.machines).filter(m =>
      _that.selector(m)
    );

    if (
      this.schedule &&
      this.schedule.selectors &&
      this._findSelector('machines')
    ) {
      for (let i = 0; i < this.machinesIds.length; i++) {
        const machine = this.schedule.selectors.find(c => c.type === 'machines')
          .ids[i];
        if (this.model.machines && !this.model.machines[machine]) {
          missingMachines.push(machine);
        }
      }
    }

    this.set('filteredItems', filteredMachines);
    this.set('missingMachines', missingMachines);
  },

  _computeMachinesIds(_selectors) {
    let ids = [];
    if (!this.selectors.length || !this._findSelector('machines')) {
      return ids;
    }

    ids = this.selectors.find(c => c.type === 'machines').ids;

    return ids;
  },

  selector(m) {
    let fulfillsAge = true;
    let fulfillsCost = true;

    if (!m) return false;

    if (this._findSelector('age')) {
      fulfillsAge =
        m.created && m.created.trim() !== ''
          ? moment().diff(m.created, 'minutes') >
            this.schedule.selectors.find(con => con.type === 'age').minutes
          : false;
    }
    if (this._findSelector('cost__monthly')) {
      fulfillsCost =
        m.cost && m.cost.monthly
          ? m.cost.monthly >
            this.schedule.selectors.find(con => con.field === 'cost__monthly')
              .value
          : false;
    }

    if (this.isSpecificMachines) {
      return this.isSelectedMachine(m.id); // && fulfillsAge && fulfillsCost;
    }
    if (this.isMachinesWithTags) {
      return this.machineHasTag(m) && fulfillsAge && fulfillsCost;
    }
    return false;
  },

  isSelectedMachine(machineId) {
    return !this.schedule.selectors ||
      !this.schedule.selectors.find(c => c.type === 'machines')
      ? false
      : this.schedule.selectors
          .find(c => c.type === 'machines')
          .ids.indexOf(machineId) > -1;
  },

  machineHasTag(m) {
    let exists = false;
    for (let i = 0; i < m.tags.length; i++) {
      const scheduleTags = this.schedule.selectors.find(c => c.type === 'tags')
        .include;

      if (Object.prototype.hasOwnProperty.call(scheduleTags, m.tags[i].key)) {
        if (!scheduleTags[m.tags[i].key] && !m.tags[i].value) {
          exists = true;
          break;
        } else if (scheduleTags[m.tags[i].key] === m.tags[i].value) {
          exists = true;
          break;
        }
      }
    }
    return exists;
  },

  toggleEnable() {
    this.$.editToggleSchedule.body = {
      task_enabled: !this.schedule.task_enabled,
    };
    this.$.editToggleSchedule.headers['Content-Type'] = 'application/json';
    this.$.editToggleSchedule.headers['Csrf-Token'] = CSRFToken.value;
    this.$.editToggleSchedule.generateRequest();
  },

  _handleScheduleEditToggleResponse() {
    const message = !this.schedule.task_enabled
      ? 'Disabling schedule..'
      : 'Enabling schedule..';
    this.dispatchEvent(
      new CustomEvent('toast', {
        bubbles: true,
        composed: true,
        detail: { msg: message, duration: 3000 },
      })
    );
  },

  _handleScheduleEditToggleError(e) {
    console.log('_handleScheduleEditToggleError', e);
    const message = e.detail.request.xhr.response;
    this.dispatchEvent(
      new CustomEvent('toast', {
        bubbles: true,
        composed: true,
        detail: { msg: message, duration: 5000 },
      })
    );
    this.$.scheduleEnabled.setAttribute('checked', this.schedule.task_enabled);
  },

  _computeDateFromNow(time) {
    return moment.utc(time).local().fromNow();
  },

  _computeAbsoluteDateText(time) {
    return moment(time).isValid()
      ? moment.utc(time).local().format('MMMM D YYYY HH:mm:ss')
      : '';
  },

  _changeSelector() {
    this.$.actions.$.editScheduleSelector._openEditScheduleModal();
  },

  _editTask() {
    this.$.actions.$.editScheduleTask._openEditScheduleModal();
  },

  _computeTagsArray(_selectors, _isMachinesWithTags) {
    console.log('_computeTagsArray');
    if (this.isMachinesWithTags && this.schedule.selectors) {
      const tagsSelector = this.schedule.selectors.find(c => c.type === 'tags');
      if (tagsSelector) {
        const tags = tagsSelector.include;

        const tagsArray = Object.keys(tags);
        for (let i = 0; i < tagsArray.length; i++) {
          const t = tagsArray[i];
          if (tags[t] !== null && tags[t].trim() !== '') {
            tagsArray[i] = `${tagsArray[i]}=${tags[t]}`;
          }
        }
        return tagsArray;
      }
    }
    return [];
  },

  _editMaxRunCount(_e) {
    this.shadowRoot
      .querySelector('schedule-actions')
      .$.editMaxRunCount._openEditScheduleModal();
  },

  _hideRunNow(_hasExpired, _maxRunCount, _totalRunCount) {
    // return hasExpired || this.schedule.max_run_count == this.schedule.total_run_count;
    return true;
  },
});
