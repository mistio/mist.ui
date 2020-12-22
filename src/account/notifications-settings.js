import '../../node_modules/@polymer/polymer/polymer-legacy.js';
import '../../node_modules/@polymer/paper-styles/typography.js';
import '../../node_modules/@polymer/paper-button/paper-button.js';
import '../../node_modules/@polymer/paper-input/paper-input.js';
import '../../node_modules/@polymer/paper-toggle-button/paper-toggle-button.js';
import '../../node_modules/@polymer/paper-item/paper-item.js';
import '../../node_modules/@polymer/paper-card/paper-card.js';
import '../../node_modules/@polymer/iron-ajax/iron-ajax.js';
import { CSRFToken } from '../helpers/utils.js';
import { Polymer } from '../../node_modules/@polymer/polymer/lib/legacy/polymer-fn.js';
import { html } from '../../node_modules/@polymer/polymer/lib/utils/html-tag.js';

Polymer({
  _template: html`
    <style include="lists shared-styles forms">
      :host paper-material {
        display: block;
        padding: 0;
      }

      .info-head {
        padding: 8px 16px;
        background: #eee;
        border-bottom: 2px solid #ddd;
      }

      .flex-horizontal-with-ratios {
        @apply --layout-horizontal;
      }

      .flexchild {
        @apply --layout-flex;
      }

      label {
        color: rgba(0, 0, 0, 0.54) !important;
        font-size: 12px;
      }

      .grid-row {
        box-sizing: border-box;
        margin-right: 0;
        margin-left: 0;
      }

      .head {
        margin-bottom: 16px;
      }

      h2.title {
        font-weight: 500;
      }

      h2.title,
      h2.title ~ p {
        margin-top: 0;
        margin-bottom: 0;
      }

      paper-radio-button {
        --paper-radio-button-checked-color: var(--paper-light-blue-500);
        --paper-radio-button-checked-ink-color: var(--paper-light-blue-500);
        --paper-radio-button-unchecked-ink-color: var(--paper-light-blue-900);
      }
      hr {
        width: 100%;
      }
      :host paper-progress {
        position: absolute;
        width: 100%;
        left: 0;
        right: 0;
      }

      .margin {
        margin: 32px 0;
      }

      .bottom-actions {
        padding-bottom: 24px;
        padding-left: 1rem;
      }

      .progress {
        margin: 32px 0 8px 0;
        width: 100%;
      }
      paper-progress.progresserror ::slotted(#primaryProgress) {
        background-color: var(--red-color);
      }
      .errormsg-container {
        color: var(--red-color);
        padding-left: 24px;
        padding-right: 24px;
      }
      .errormsg-container iron-icon {
        color: inherit;
      }

      paper-icon-button.white {
        --paper-icon-button-ink-color: var(--paper-orange-500);
      }

      paper-icon-button.delete-avatar-icon {
        top: -12px;
      }

      div.existing-org-logo {
        display: inline-block;
        vertical-align: middle;
        text-align: center;
      }

      div.org-logo-container {
        background-color: #2f2f3e;
        margin: 6px;
        display: inline-block;
      }

      div.org-logo-field-title {
        color: var(--paper-light-blue-600);
        text-transform: uppercase;
        font-weight: 400;
        font-size: 12px;
        margin-left: -17px;
      }

      .overrideLabel {
        display: inline-flex;
        width: 60%;
        vertical-align: top;
      }

      paper-toggle-button {
        margin: auto;
        display: inline-flex;
        cursor: pointer;
        /*--paper-toggle-button-checked-bar-color: #2196F3;
                --paper-toggle-button-checked-button-color: #fff;*/
      }

      paper-button.red {
        --paper-button-checked-bar-color: #d96557;
        --paper-toggle-button-checked-button-color: #fff;
      }

      .head {
        padding: 24px 24px 0 24px;
      }

      .summary {
        padding: 0 24px 0 24px;
      }

      .blank {
        padding: 0 10px 0 10px;
        font-weight: 700;
      }

      .text-right {
        text-align: right;
      }

      paper-card.notifications-settings
        paper-button.notifications-settings:not([disabled]).red {
        background-color: #d96557;
        color: #fff;
      }

      span.status {
        font-weight: 500;
      }
    </style>

    <paper-card>
      <div class="grid-row">
        <div class="xs12 head">
          <h2 class="title">Notifications</h2>
        </div>
        <div class="summary xs12 m12 l12">
          <p>
            Personalize delivery of notifications and recommendations for your
            infrastructure.
          </p>
        </div>
      </div>
      <div class="card-content">
        <div class="info-list">
          <div
            class="info-head flex-horizontal-with-ratios"
            hidden$="[[!hasOverrides]]"
          >
            <div class="flexchild">Notification Type</div>
            <div class="flexchild">Delivery</div>
            <div class="flexchild text-right">&nbsp;</div>
          </div>
          <div class="info-body">
            <template
              is="dom-repeat"
              items="[[notificationOverrides]]"
              as="override"
            >
              <paper-item class="row flex-horizontal-with-ratios">
                <div class="flexchild">
                  <span class="name"
                    >[[_computeOverrideLabel(override, machines)]]</span
                  >
                </div>
                <div class="flexchild">
                  <span class="status"
                    >[[_computeOverrideStateLabel(override, machines)]]</span
                  >
                </div>
                <div class="flexchild text-right">
                  <paper-button
                    class="red"
                    tabindex$="[[index]]"
                    on-tap="_deleteOverrideTapped"
                    >Delete</paper-button
                  >
                </div>
              </paper-item>
            </template>
          </div>
          <div class="blank" hidden$="[[hasOverrides]]">
            <p>There are currently no notification preferences set.</p>
          </div>
        </div>
      </div>
    </paper-card>

    <iron-ajax
      auto=""
      id="getNotificationOverridesRequest"
      method="GET"
      url="/api/v1/notification-overrides"
      last-response="{{notificationOverrides}}"
      on-error="_handleGetOverridesError"
      handle-as="json"
    ></iron-ajax>

    <iron-ajax
      id="deleteNotificationOverrideRequest"
      method="DELETE"
      on-response="_handleDeleteOverrideResponse"
      on-error="_handleDeleteOverrideError"
      handle-as="json"
    ></iron-ajax>
  `,

  is: 'notifications-settings',

  properties: {
    machines: {
      type: Object,
    },
    notificationOverrides: {
      type: Array,
    },
    hasOverrides: {
      type: Boolean,
      computed: '_computeHasOverrides(notificationOverrides.length)',
    },
    overridesError: {
      type: Boolean,
    },
  },

  _computeAllowed(override) {
    return override.value === 'ALLOW';
  },

  _computeOverrideLabel(override, machines) {
    const channel = override.channel.toLowerCase();
    if (channel.includes('inapp')) {
      let machineName = '';
      if (channel.includes('recommendation')) {
        if (override.machine) {
          if (machines && machines[override.machine._ref.$id]) {
            machineName = machines[override.machine._ref.$id].name;
          } else {
            machineName = override.machine._ref.$id;
          }
          return `Recommendations for machine ${machineName}`;
        }
        if (override.cloud) {
          return `Recommendations for cloud ${override.cloud._ref.$id}`;
        }
        if (override.tag) {
          return `Recommendations for tag ${override.tag._ref.$id}`;
        }
        return 'In-App Recommendations';
      }
      if (override.machine) {
        if (machines && machines[override.machine._ref.$id]) {
          machineName = machines[override.machine._ref.$id].name;
        } else {
          machineName = override.machine._ref.$id;
        }
        return `Notifications for machine ${machineName}`;
      }
      if (override.cloud) {
        return `Notifications for cloud ${override.machine._ref.$id}`;
      }
      if (override.machine) {
        return `Notifications for tag ${override.tag._ref.$id}`;
      }
      return 'In-App Notifications';
    }
    if (channel.includes('emailalert')) {
      if (override.rtype) {
        return `Email Alerts for rule ${override.rid}`;
      }
      return 'Email Alerts';
    }
    if (channel.includes('emailreport')) {
      return 'Email Reports';
    }
    return null;
  },

  _computeOverrideStateLabel(override, _machines) {
    const valueString = override.value.toLowerCase();
    return valueString.charAt(0).toUpperCase() + valueString.slice(1);
  },

  _computeHasOverrides(length) {
    return length > 0;
  },

  _overrideChanged(e) {
    const { checked } = e.target;
    const { index } = e.target;
    const newOverride = JSON.parse(
      JSON.stringify(this.notificationOverrides[index])
    );
    newOverride.value = checked ? 'ALLOW' : 'BLOCK';
    this.splice('notificationOverrides', index, 1, newOverride);
  },

  _getOverrides(_e, _user) {
    this.$.getNotificationOverridesRequest.headers['Content-Type'] =
      'application/json';
    this.$.getNotificationOverridesRequest.headers['Csrf-Token'] =
      CSRFToken.value;
    this.$.getNotificationOverridesRequest.generateRequest();
  },

  _handleGetOverridesError() {
    this.set('overridesError', true);
  },

  _deleteOverrideTapped(e) {
    const overrideId = e.model.override._id.$oid;
    this.$.deleteNotificationOverrideRequest.headers['Content-Type'] =
      'application/json';
    this.$.deleteNotificationOverrideRequest.headers['Csrf-Token'] =
      CSRFToken.value;
    this.$.deleteNotificationOverrideRequest.url = `/api/v1/notification-overrides/${overrideId}`;
    this.$.deleteNotificationOverrideRequest.generateRequest();
  },

  _handleDeleteOverrideResponse(_e) {
    this.$.getNotificationOverridesRequest.generateRequest();
    this.dispatchEvent(
      new CustomEvent('toast', {
        bubbles: true,
        composed: true,
        detail: {
          msg: 'Notification override deleted succesfully!',
          duration: 3000,
        },
      })
    );
  },

  _handleDeleteOverrideError(e) {
    this.set('overridesError', true);
    this.$.usererrormsg.textContent = e.detail.request.xhr.responseText;
  },

  _handleSetOverridesResponse(_e) {
    this.dispatchEvent(
      new CustomEvent('toast', {
        bubbles: true,
        composed: true,
        detail: { msg: 'Changes saved succesfully!', duration: 3000 },
      })
    );
  },

  _handleSetOverridesError(e) {
    this.set('overridesError', true);
    this.$.usererrormsg.textContent = e.detail.request.xhr.responseText;
  },
});
