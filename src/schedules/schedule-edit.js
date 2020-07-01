import '../../../../@polymer/polymer/polymer-legacy.js';
import '../../../../@polymer/paper-styles/typography.js';
import '../../../../vaadin-dialog/vaadin-dialog.js';
import '../../../../@polymer/paper-toggle-button/paper-toggle-button.js';
import '../../../../@polymer/neon-animation/animations/scale-up-animation.js';
import '../../../../@polymer/neon-animation/animations/fade-out-animation.js';
import { Polymer } from '../../../../@polymer/polymer/lib/legacy/polymer-fn.js';
import { html } from '../../../../@polymer/polymer/lib/utils/html-tag.js';

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

            :host paper-toggle-button {
                --paper-toggle-button-checked-bar-color:  var(--green-color);
                --paper-toggle-button-checked-button-color:  var(--green-color);
                --paper-toggle-button-checked-ink-color: var(--green-color);
                --paper-toggle-button-unchecked-bar-color:  var(--red-color);
                --paper-toggle-button-unchecked-button-color:  var(--red-color);
                --paper-toggle-button-unchecked-ink-color: var(--red-color);
            }

        </style>

        <vaadin-dialog id="editScheduleModal" theme="mist-dialog" with-backdrop="">
            <template>
                <h2>Edit Schedule</h2>
                <div class="paper-dialog-scrollable">
                    <p>
                        <paper-input id="name" label="Name" error-message="Please enter schedule's name" value="{{newSchedule.name}}"></paper-input>
                        <paper-textarea id="description" label="Description (optional)" rows="3" max-rows="5" error-message="Please enter schedule's description" value="{{newSchedule.description}}"></paper-textarea>
                        <br>
                    </p>
                    <div class="clearfix btn-group">
                        <paper-button class="blue-link" on-tap="_closeEditScheduleModal">Cancel</paper-button>
                        <paper-button class="blue" disabled\$="[[!formReady]]" on-tap="_submitForm">Save</paper-button>
                    </div>
                </div>
            </template>
        </vaadin-dialog>

        <iron-ajax id="editSchedule" url="/api/v1/schedules/[[schedule.id]]" method="PATCH" on-response="_handleScheduleEditResponse" on-error="_handleScheduleEditError"></iron-ajax>
`,

  is: 'schedule-edit',

  properties: {
      schedule: {
          type: Object
      },
      newSchedule: {
          type: Object,
          notify: true
      },
      formReady: {
          type: Boolean,
          value: false
      },
      sendingData: {
          type: Boolean
      },
      payload: {
          type: Object,
          value: {}
      }
  },

  observers: [
      '_computeNewSchedule(schedule.*)',
      '_newScheduleChanged(newSchedule.*)'
  ],

  listeners: {
  },

  _computeNewSchedule: function(schedule) {
      if (this.schedule){
          var newSchedule = {
              name: this.schedule.name,
              description: this.schedule.description,
              task_enabled: this.schedule.task_enabled
          };
          this.set('newSchedule', newSchedule);
      }
  },

  _openEditScheduleModal: function(e) {
      this.$.editScheduleModal.opened = true;
  },

  _closeEditScheduleModal: function(e) {
      this.$.editScheduleModal.opened = false;
  },

  _modalClosed: function() {
      this._formReset();
  },

  _submitForm: function(e) {
      this.$.editSchedule.body = this.payload;
      this.$.editSchedule.headers["Content-Type"] = 'application/json';
      this.$.editSchedule.headers["Csrf-Token"] = CSRF_TOKEN;
      this.$.editSchedule.generateRequest();
  },

  _formReset: function() {
      this._computeNewSchedule();
  },

  _handleScheduleEditResponse: function(e) {
      this._closeEditScheduleModal();
  },

  _handleScheduleEditError: function(e) {
      var message = e.detail.error;
      if (e.detail.request.statusText)
          message += " "+e.detail.request.statusText;

      this.dispatchEvent(new CustomEvent('toast', { bubbles: true, composed: true, detail: { msg: message, duration: 5000 } }));

  },

  _newScheduleChanged: function(e) {
      var pl = {};
      var plLength = 0;
      for (var p in this.newSchedule) {
          if (this.schedule[p] != this.newSchedule[p]) {
              plLength++;
              pl[p] = this.newSchedule[p];
              console.log('_updatePayload', pl[p], this.newSchedule[p]);
          }
      }
      this.set('payload', pl);
      this._updateformReady(plLength, this.sendingData);
  },

  _updateformReady: function(plLength, sendingData) {
      if (this.sendingData) {
          this.set('formReady', false);
      }
      else {
          this.set('formReady', plLength);
      }
  }
});
