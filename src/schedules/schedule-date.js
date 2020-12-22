import '../../node_modules/@polymer/polymer/polymer-legacy.js';
import '../../node_modules/@polymer/paper-button/paper-button.js';
import '../../node_modules/@polymer/paper-styles/typography.js';
import '../../node_modules/@polymer/paper-spinner/paper-spinner.js';
import moment from '../../node_modules/moment/src/moment.js';
import { Polymer } from '../../node_modules/@polymer/polymer/lib/legacy/polymer-fn.js';
import { html } from '../../node_modules/@polymer/polymer/lib/utils/html-tag.js';

Polymer({
  _template: html`
    <style include="shared-styles single-page tags-and-labels forms">
      :host {
        display: inline-block;
        position: relative;
        --paper-input-container-underline: {
          display: none;
          height: 0;
        }
        --paper-input-container-underline-focus: {
          display: none;
          height: 0;
        }
        --paper-input-container-underline-disabled: {
          display: none;
          height: 0;
        }
        --paper-input-container-color: transparent;
        --paper-input-container-focus-color: transparent;
        --paper-input-container-invalid-color: transparent;
      }
      .dateinput {
        position: absolute;
        display: flex;
        align-items: center;
        top: -5px;
        left: 0;
        width: 400px;
      }
      .smaller {
        font-size: 0.9em;
      }
      paper-input {
        display: inline-block;
        background-color: #fff;
        width: 190px;
        font-size: 11px;
      }
      paper-button.blue-link[disabled] {
        color: rgba(0, 0, 0, 0.32) !important;
        display: inline-block;
        vertical-align: bottom;
      }
      paper-button.blue-link {
        background-color: transparent !important;
        font-weight: 400 !important;
        color: var(--mist-blue) !important;
        margin: 0;
        padding: 0;
      }
    </style>
    <span hidden$="[[!date]]">[[_computeAbsoluteDateText(date)]]</span>
    <span hidden$="[[date.length]]">[[nullText]]</span>
    <paper-button
      id="edit"
      on-tap="_edit"
      data-field="start_after"
      class="simple-button blue-link smaller"
      noink=""
      disabled$="[[disabledEdit]]"
      hidden$="[[editing]]"
      >change</paper-button
    >
    <div class="dateinput" hidden$="[[!editing]]">
      <paper-input
        id="dateInput"
        type="datetime-local"
        value="{{value}}"
        no-label-float=""
      ></paper-input>
      <paper-button
        class="simple-button blue-link smaller"
        on-tap="_saveDate"
        noink=""
        >save</paper-button
      >
      <paper-button
        class="simple-button blue-link smaller"
        on-tap="_stopEdit"
        noink=""
        >cancel</paper-button
      >
    </div>
  `,

  is: 'schedule-date',

  properties: {
    url: {
      type: String,
    },
    field: {
      type: String,
    },
    nullText: {
      type: String,
    },
    date: {
      type: String,
    },
    value: {
      type: String,
    },
    editing: {
      type: Boolean,
      value: false,
    },
    disabledEdit: {
      type: Boolean,
      value: false,
    },
  },

  _computeAbsoluteDateText(time) {
    // console.log('time: ',moment(time).format("MMMM D YYYY HH:mm:ss"));
    // console.log('time utc: ',moment.utc(time).format("MMMM D YYYY HH:mm:ss"));
    // console.log('time local: ',moment(time).local().format("MMMM D YYYY HH:mm:ss"));
    // console.log('time utc local: ',moment.utc(time).local().format("MMMM D YYYY HH:mm:ss"));
    return moment(time).isValid()
      ? moment.utc(time).local().format('MMMM D YYYY HH:mm:ss')
      : '';
  },

  _saveDate() {
    if (this.value) {
      this.dispatchEvent(
        new CustomEvent('save-date', {
          bubbles: true,
          composed: true,
          detail: { name: this.field, date: this.value },
        })
      );

      this.set('editing', false);
    }
  },

  _edit() {
    this.set('editing', true);
  },

  _stopEdit() {
    this.set('editing', false);
  },
});
