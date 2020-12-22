import '../../node_modules/@polymer/polymer/polymer-legacy.js';
import '../../node_modules/@polymer/paper-styles/typography.js';
import '../../node_modules/@vaadin/vaadin-dialog/vaadin-dialog.js';
import '../../node_modules/@polymer/paper-toggle-button/paper-toggle-button.js';
import { CSRFToken } from '../helpers/utils.js';
import { Polymer } from '../../node_modules/@polymer/polymer/lib/legacy/polymer-fn.js';
import { html } from '../../node_modules/@polymer/polymer/lib/utils/html-tag.js';

Polymer({
  _template: html`
    <style include="shared-styles dialogs">
      :host {
      }

      .submit-btn {
        background-color: var(--mist-blue);
        color: #fff;
      }

      paper-button {
        margin: 0 0.29em !important;
      }
    </style>

    <vaadin-dialog
      id="editMrcScheduleModal"
      theme="mist-dialog"
      with-backdrop=""
    >
      <template>
        <h2>Edit Maximum Run Count</h2>
        <div class="paper-dialog-scrollable">
          <p>
            <paper-input
              id="mrc"
              label="Maximum Run Count"
              value="{{newMaxRunCount}}"
            ></paper-input>
          </p>
          <p>Leave blank and save to delete maximum run count constraint.</p>
          <div class="clearfix btn-group">
            <paper-button
              class="blue-link"
              dialog-dismiss=""
              on-tap="_closeEditScheduleModal"
              >Cancel</paper-button
            >
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
      loading="{{sendingData}}"
      on-response="_handleScheduleEditResponse"
      on-error="_handleScheduleEditError"
    ></iron-ajax>
  `,

  is: 'schedule-edit-mrc',

  properties: {
    schedule: {
      type: Object,
    },
    newMaxRunCount: {
      type: Number,
    },
    sendingData: {
      type: Boolean,
      value: false,
    },
  },

  observers: ['_updateformReady(schedule, newMaxRunCount, sendingData)'],

  listeners: {
    'iron-overlay-closed': '_modalClosed',
  },

  _openEditScheduleModal(_e) {
    if (this.schedule) {
      this.set('newMaxRunCount', this.schedule.max_run_count);
      this.$.editMrcScheduleModal.opened = true;
    }
  },

  _closeEditScheduleModal(_e) {
    this.$.editMrcScheduleModal.opened = false;
  },

  _modalClosed() {
    this._formReset();
  },

  _submitForm(_e) {
    this.$.editSchedule.body = { max_run_count: this.newMaxRunCount };
    this.$.editSchedule.headers['Content-Type'] = 'application/json';
    this.$.editSchedule.headers['Csrf-Token'] = CSRFToken.value;
    this.$.editSchedule.generateRequest();
  },

  _formReset() {
    if (this.schedule) {
      this.set('newMaxRunCount', this.schedule.max_run_count);
    }
  },

  _handleScheduleEditResponse(_e) {
    this._closeEditScheduleModal();
    this.dispatchEvent(
      new CustomEvent('toast', {
        bubbles: true,
        composed: true,
        detail: { msg: 'Updating max run count.', duration: 5000 },
      })
    );
  },

  _handleScheduleEditError(e) {
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

  _updateformReady(_schedule, _newMaxRunCount, _sendingData) {
    // console.log(parseInt(this.newMaxRunCount), this.newMaxRunCount,  this.schedule.max_run_count)
    if (this.sendingData) {
      this.set('formReady', false);
    } else if (!this.sendingData && this.schedule) {
      this.set(
        'formReady',
        (parseInt(this.newMaxRunCount, 10) >= 0 ||
          this.newMaxRunCount === '') &&
          this.newMaxRunCount !== this.schedule.max_run_count
      );
    }
  },
});
