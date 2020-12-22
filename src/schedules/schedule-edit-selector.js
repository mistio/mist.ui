import '../../node_modules/@polymer/polymer/polymer-legacy.js';
import '../../node_modules/@polymer/paper-styles/typography.js';
import '../../node_modules/@vaadin/vaadin-dialog/vaadin-dialog.js';
import '../../node_modules/@polymer/paper-input/paper-textarea.js';
import '../../node_modules/@polymer/paper-checkbox/paper-checkbox.js';
import '../../node_modules/@polymer/paper-radio-group/paper-radio-group.js';
import '../../node_modules/@polymer/paper-toggle-button/paper-toggle-button.js';
import { CSRFToken } from '../helpers/utils.js';
import { Polymer } from '../../node_modules/@polymer/polymer/lib/legacy/polymer-fn.js';
import { html } from '../../node_modules/@polymer/polymer/lib/utils/html-tag.js';

Polymer({
  _template: html`
    <style include="shared-styles dialogs">
      .submit-btn {
          background-color: var(--mist-blue);
          color: #fff;
      }

      paper-dialog {
          width: 500px !important;
      }

      paper-button {
          margin: 0 0.29em !important;
      }

      .progress {
          overflow: hidden;
          margin: 0 -24px;
      }
      paper-progress {
          width: 100%;
      }
      paper-progress#progresserror ::slotted(#primaryProgress) {
          background-color: var(--red-color);
      }
      .errormsg-container {
          color: rgba(255,255,255,0.54);
      }
      .errormsg-container iron-icon {
          color: var(--red-color);
          margin: 8px;
      }
      paper-radio-button[checked],
      .background {
          background-color: #eee;
      }
      .background {
          padding: 16px;
          max-height: 310px;
      }
      .overflow-scroll {
          overflow: scroll;
      }import { CSRFToken } from '../helpers/utils.js';
      paper-checkbox {
          display: block;
          font-weight: 500;
          font-size: 16px;
          --paper-checkbox-checked-ink-color: var(--mist-blue) !important;
          --paper-checkbox-checked-color: var(--mist-blue) !important;
      }
    </style>

    <vaadin-dialog id="editScheduleModal" theme="mist-dialog" with-backdrop="">
      <template>
        <h2>Edit Schedule Selectors</h2>
        <div class="paper-dialog-scrollable">
          <div>
            <paper-radio-group selected="{{isUuidsOrTags}}">
              <paper-radio-button name="uuids"
                >Specific Machines</paper-radio-button
              >
              <paper-radio-button name="tags"
                >Machines with tags</paper-radio-button
              >
            </paper-radio-group>
          </div>
          <div
            id="checkboxes"
            hidden$="{{!isUuids}}"
            class="background overflow-scroll"
          >
            <template
              is="dom-repeat"
              items="[[_computeMachinesArray(model.machines.*)]]"
              as="machine"
            >
              <paper-checkbox
                name="machinesCheckboxes"
                checked$="[[_computeIfChecked(machinesIds, machine.id)]]"
                data-value$="[[machine.id]]"
                on-change="_updatePayload"
                >[[machine.name]]</paper-checkbox
              >
            </template>
          </div>
          <div hidden$="{{!isTags}}" class="background">
            <paper-textarea value="{{tagsString}}"></paper-textarea>
          </div>
          <div class="background">
            <paper-input
              value="{{machinesAgeDisplayNumber}}"
              label="If older than"
              pattern="[0-9]*"
              errormessage="Please enter numbers only!"
              autovalidate=""
            ></paper-input>
            <paper-radio-group selected="{{machinesAgeUnit}}">
              <paper-radio-button name="minutes">minutes</paper-radio-button>
              <paper-radio-button name="hours">hours</paper-radio-button>
              <paper-radio-button name="days">days</paper-radio-button>
            </paper-radio-group>
          </div>
          <div class="background">
            <paper-input
              value="{{costDisplay}}"
              label="If it costs more than"
              pattern="[0-9]*"
              errormessage="Please enter numbers only!"
              autovalidate=""
            >
              <div suffix="" slot="suffix">[[currency.sign]]/month</div>
            </paper-input>
          </div>
          <div class="progress">
            <paper-progress
              id="progress"
              indeterminate=""
              active="{{loading}}"
              hidden$="[[!loading]]"
            ></paper-progress>
            <paper-progress
              id="progresserror"
              value="100"
              hidden$="[[!formError]]"
            ></paper-progress>
            <p class="errormsg-container" hidden$="[[!formError]]">
              <iron-icon icon="icons:error-outline"></iron-icon
              ><span id="errormsg"></span>
            </p>
          </div>
          <div class="clearfix btn-group">
            <paper-button on-tap="_closeEditScheduleModal">Cancel</paper-button>
            <paper-button
              class="blue"
              disabled$="[[!formReady]]"
              on-tap="_submitForm"
              >Save</paper-button
            >
          </div>
        </div>
      </template>
    </vaadin-dialog>

    <iron-ajax
      id="editSchedule"
      url="/api/v1/schedules/[[schedule.id]]"
      method="PATCH"
      loading="{{loading}}"
      on-response="_handleResponse"
      on-error="_handleError"
    ></iron-ajax>
  `,

  is: 'schedule-edit-selector',

  properties: {
    schedule: {
      type: Object,
    },
    model: {
      type: Object,
    },
    // modelmachines: Array,
    newSchedule: {
      type: Object,
      notify: true,
    },
    formReady: {
      type: Boolean,
      value: false,
    },
    isUuidsOrTags: {
      type: String,
    },
    isUuids: {
      type: Boolean,
    },
    isTags: {
      type: Boolean,
    },
    loading: {
      type: Boolean,
      value: false,
    },
    formError: {
      type: Boolean,
      value: false,
    },
    selectors: {
      type: Array,
    },
    machinesIds: {
      type: Array,
      computed: '_computeMachinesIds(schedule.selectors)',
    },
    payload: {
      type: Object,
      value() {
        return {};
      },
    },
    tagsString: {
      type: Array,
    },
    machinesAge: {
      type: Number,
      value: false,
    },
    machinesCost: {
      type: Number,
    },
    costDisplay: {
      type: String,
    },
    machinesAgeDisplayNumber: {
      type: Number,
    },
    machinesAgeUnit: {
      type: String,
    },
    currency: {
      type: Object,
    },
  },

  observers: [
    '_computeNewSchedule(schedule.*)',
    '_isUuidsOrTagsChanged(isUuidsOrTags)',
    '_updateTagsString(selectors)',
    '_updateAgeParts(machinesAge)',
    '_updateCostDisplay(machinesCost)',
    '_updatePayload(newSchedule.*,isUuidsOrTags,costDisplay,machinesAgeDisplayNumber,machinesAgeUnit)',
  ],

  listeners: {
    'iron-overlay-closed': '_modalClosed',
  },

  _computeNewSchedule(schedule) {
    if (this.schedule) {
      const newSchedule = {
        selectors: this.schedule.selectors,
      };
      this.set('newSchedule', newSchedule);
      this.set('selectors', this.schedule.selectors);
      this._computeIsUuidsOrTags(schedule, this.machinesIds);
    }
  },

  _computeMachinesIds(selectors) {
    console.log('schedule cond', selectors);
    let ids = [];
    if (!selectors || !selectors.length || !this._findSelector('machines')) {
      return ids;
    }

    const cond = selectors.find(c => {
      return c.type === 'machines';
    });
    ids = cond.ids || [];

    return ids;
  },

  _findSelector(field) {
    if (this.schedule.selectors && this.schedule.selectors.length) {
      const field_ = this.schedule.selectors.find(con => {
        return ['age', 'machines', 'tags'].indexOf(field) === -1
          ? con.field === field
          : con.type === field;
      });
      if (field_) return true;
      return false;
    }
    return false;
  },

  _computeIsUuidsOrTags(_schedule, _machinesIds) {
    if (this.schedule && this.machinesIds && this.machinesIds.length) {
      this.set('isUuidsOrTags', 'uuids');
    } else if (this.schedule && this.schedule.tags) {
      this.set('isUuidsOrTags', 'tags');
    }
    console.log('schedule isUuidsOrTags', this.isUuidsOrTags);
  },

  _updateAgeParts(age) {
    let machineAge = age && parseInt(age, 10) ? parseInt(age, 10) : '';
    let duration;

    if (age) {
      duration = 'minutes';
    }
    if (age >= 60 && age % 60 === 0) {
      duration = 'hours';
      machineAge = age / 60;
    }
    if (age >= 60 * 24 && age % (60 * 24) === 0) {
      machineAge = age / (60 * 24);
      duration = 'days';
    }
    this.set('machinesAgeDisplayNumber', machineAge);
    this.set('machinesAgeUnit', duration);
  },

  _updateCostDisplay(cost) {
    this.set(
      'costDisplay',
      !cost || Number.isNaN(parseFloat(cost)) ? '' : cost
    );
  },

  _computeMachinesArray(_machines) {
    return Object.values(this.model.machines);
  },

  _isUuidsOrTagsChanged(isUuidsOrTags) {
    if (isUuidsOrTags === 'uuids') {
      this.set('isUuids', true);
      this.set('isTags', false);
    } else if (isUuidsOrTags === 'tags') {
      this.set('isUuids', false);
      this.set('isTags', true);
    }
    console.log('isUuidsOrTags');
  },

  _openEditScheduleModal(_e) {
    this.$.editScheduleModal.opened = true;
  },

  _closeEditScheduleModal(_e) {
    this.$.editScheduleModal.opened = false;
  },

  _modalClosed(e) {
    if (e.target === this.$.editScheduleModal) this._formReset();
  },

  _submitForm(_e) {
    // console.log("payload", this.payload);
    this.$.editSchedule.body = this.payload;
    this.$.editSchedule.headers['Content-Type'] = 'application/json';
    this.$.editSchedule.headers['Csrf-Token'] = CSRFToken.value;
    this.$.editSchedule.generateRequest();
  },
  /* eslint-disable no-param-reassign */
  _formReset() {
    const checkboxes = this.shadowRoot.querySelectorAll('paper-checkbox');
    Array.prototype.forEach.call(checkboxes, c => {
      c.checked = this._computeIfChecked(this.machinesIds, c.dataValue);
    });
    this._computeNewSchedule();
  },
  /* eslint-enable no-param-reassign */
  _handleResponse(_e) {
    this._closeEditScheduleModal();
  },

  _handleError(e) {
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

  _updatePayload(newSchedule) {
    console.log('newSchedule', newSchedule);
    const pl = {};
    let valid = false;
    pl.selectors = [];

    console.log('newSchedule uuids', this.isUuids, 'tags', this.isTags);

    if (this.isUuids) {
      const ids = this._constructCheckboxValue();
      pl.selectors.push({ type: 'machines', ids });
      valid = ids.length;
    } else if (this.isTags) {
      const tags = this._constructTagsValue(this.textToArray(this.tagsString));
      pl.selectors.push({ type: 'tags', include: tags });
      valid = this.textToArray(this.tagsString)
        ? this.textToArray(this.tagsString).length
        : false;
    }

    if (parseInt(this.machinesAgeDisplayNumber, 10) && this.machinesAgeUnit) {
      let minutes = parseInt(this.machinesAgeDisplayNumber, 10);
      if (this.machinesAgeUnit === 'hours') {
        minutes = this.machinesAgeDisplayNumber * 60;
      } else if (this.machinesAgeUnit === 'days') {
        minutes = this.machinesAgeDisplayNumber * 60 * 24;
      }
      pl.selectors.push({ type: 'age', minutes });
    }
    if (
      this.costDisplay &&
      this.costDisplay.length &&
      !Number.isNaN(parseFloat(this.costDisplay))
    ) {
      pl.selectors.push({
        type: 'field',
        field: 'cost__monthly',
        value: parseFloat(this.costDisplay),
        operator: 'gt',
      });
    }
    this.set('payload', pl);
    this.set('formReady', valid);
  },

  _computeIfChecked(_machinesIds, machineId) {
    if (this.schedule && this.machinesIds)
      return this.machinesIds.indexOf(machineId) > -1;
    return false;
  },

  textToArray(str) {
    if (str) {
      let arr = [];
      arr = str.split(',');
      for (let i = 0; i < arr.length; i++) {
        arr[i] = arr[i].trim();
      }
      return arr;
    }
    return [];
  },

  _constructCheckboxValue() {
    const dialog = document.querySelector('vaadin-dialog-overlay');
    const content = dialog && dialog.shadowRoot.querySelector('#content');
    const checked =
      content && content.shadowRoot.querySelectorAll('paper-checkbox[checked]');
    const arr = [];
    console.log('checked', checked);
    if (checked) {
      for (let i = 0; i < checked.length; i++) {
        arr.push(checked[i].dataset.value);
      }
    }
    return arr;
  },

  _constructTagsValue(tagStringsArray) {
    const arr = {};
    if (tagStringsArray) {
      tagStringsArray.forEach(string => {
        const chunks = string.split('=');
        if (chunks.length > 0 && chunks[0].trim().length > 0) {
          const key = chunks[0].trim();
          arr[key] = '';
          if (chunks.length > 1) arr[key] = chunks[1].trim();
        }
      });
    }
    return arr;
  },

  _updateTagsString(_selectors) {
    if (this.selectors && this.schedule && this.selectors.length) {
      const tags = this.selectors.find(c => {
        return c.type === 'tags';
      })
        ? this.selectors.find(c => {
            return c.type === 'tags';
          }).include
        : {};
      const arrTags = Object.keys(tags);
      for (let i = 0; i < arrTags.length; i++) {
        const t = arrTags[i];
        if (tags[t] !== null && tags[t].trim() !== '') {
          arrTags[i] = `${arrTags[i]}=${tags[t]}`;
        }
      }
      this.set('tagsString', arrTags.toString());
    }
  },
});
