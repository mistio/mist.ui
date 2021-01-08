import '@polymer/polymer/polymer-legacy.js';
import '@polymer/paper-button/paper-button.js';
import '@polymer/paper-styles/typography.js';
import '@polymer/paper-progress/paper-progress.js';
import '@polymer/paper-material/paper-material.js';
import '@polymer/paper-input/paper-input.js';
import '@polymer/iron-ajax/iron-ajax.js';
import '@polymer/iron-icons/iron-icons.js';
import { CSRFToken } from '../helpers/utils.js';
import { Polymer } from '@polymer/polymer/lib/legacy/polymer-fn.js';
import { html } from '@polymer/polymer/lib/utils/html-tag.js';

Polymer({
  _template: html`
    <style include="shared-styles forms">
      paper-material {
        padding: 0;
        display: block;
      }

      .grid-row {
        padding: 24px;
      }

      .grid-row.nopad {
        padding-bottom: 0;
        padding-top: 0;
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

      .flex-horizontal-with-ratios {
        @apply --layout-horizontal;
      }

      .flexchild {
        @apply --layout-flex;
        margin-right: 32px;
        padding-right: 32px;
        font-size: 0.9em;
        background-color: var(--gray-light-color);
        padding: 0 16px;
        color: #666;
      }

      .flex2child {
        @apply --layout-flex-2;
      }

      .flex3child {
        @apply --layout-flex-3;
      }
      .bottom-actions {
        padding-bottom: 24px;
        padding-left: 2rem;
      }
      .progress {
        margin: 32px 0 8px 0;
        width: 100%;
      }
      .progress paper-progress {
        width: 100%;
      }
      paper-progress.progresserror ::slotted(#primaryProgress) {
        background-color: var(--red-color);
      }
      .error {
        color: var(--red-color);
        align-self: flex-end;
        padding: 8px;
        font-size: 0.9em;
      }
      iron-icon {
        color: inherit;
      }
      .errormsg-container {
        color: var(--red-color);
        padding-left: 24px;
        padding-right: 24px;
      }
      .errormsg-container iron-icon {
        color: inherit;
      }
    </style>
    <paper-material>
      <template is="dom-if" if="[[user.has_pass]]">
        <div class="grid-row">
          <div class="xs12 head">
            <h2 class="title">Password Reset</h2>
            <p>
              For security reasons, you have to fill in your current password,
              before you can change your password.
            </p>
            <p>
              <a
                href="javascript:void(0)"
                on-tap="_setPassword"
                class="regular blue-link"
                >Forgot password?</a
              >
            </p>
          </div>
          <div class="xs12 grid-row nopad">
            <paper-input
              id="currentPassword"
              class="xs12 l6"
              label="current password"
              required=""
              type="password"
              error-message="Please enter your old password"
              value="{{currentPassword::input}}"
            ></paper-input>
          </div>
          <div class="xs12 grid-row nopad">
            <paper-input
              id="newPassword"
              class="xs12 l6"
              label="new password"
              required=""
              type="password"
              error-message="Please enter your new password"
              value="{{newPassword::input}}"
            ></paper-input>
          </div>
          <div class="xs12 grid-row nopad">
            <paper-input
              id="confirmNewPassword"
              class="xs12 l6"
              label="confirm new password"
              required=""
              type="password"
              error-message="Please enter your new password again"
              value="{{confirmNewPassword::input}}"
            ></paper-input>
            <span class="error" hidden$="[[!dontMatch]]"
              ><iron-icon icon="icons:warning"></iron-icon> Passwords don't
              match</span
            >
          </div>
        </div>

        <div class="progress">
          <paper-progress
            id="rogress"
            indeterminate=""
            hidden$="[[!loading]]"
          ></paper-progress>
          <paper-progress
            id="progresserror"
            class="progresserror"
            value="100"
            hidden$="[[!formError]]"
          ></paper-progress>
          <hr class="appform" />
          <p
            id="progressmessage"
            class="errormsg-container"
            hidden$="[[!formError]]"
          >
            <iron-icon icon="icons:error-outline"></iron-icon
            ><span id="errormsg"></span>
          </p>
        </div>

        <div class="bottom-actions clearfix xs12">
          <paper-button
            disabled$="[[!formReady]]"
            raised=""
            on-tap="_submitForm"
            >Change Password</paper-button
          >
        </div>
      </template>

      <template is="dom-if" if="[[!user.has_pass]]">
        <div class="text-center">
          <paper-button raised="" on-tap="_setPassword"
            >Set Password</paper-button
          >
          <p>
            For security reasons, since you haven't specified a password before,
            an email will be sent to your email: "[[user.email]]" to guide you
            through the process
          </p>
        </div>
      </template>
    </paper-material>
    <iron-ajax
      id="passwordUpdateAjaxRequest"
      url="/api/v1/account"
      method="POST"
      loading="{{loading}}"
      on-response="_handlePasswordUpdateAjaxResponse"
      on-error="_handlePasswordUpdateAjaxError"
      handle-as="xml"
    ></iron-ajax>
    <iron-ajax
      id="passwordSetAjaxRequest"
      url="/forgot"
      method="POST"
      on-response="_handlePasswordSetAjaxResponse"
      on-error="_handlePasswordSetAjaxError"
      handle-as="xml"
    ></iron-ajax>
  `,

  is: 'password-page',

  properties: {
    loading: {
      type: Boolean,
      value: false,
    },
    user: {
      type: Object,
      notify: true,
    },
    formReady: {
      type: Boolean,
      value: false,
    },
    formError: {
      type: Boolean,
      value: false,
      notify: true,
    },
    dontMatch: {
      type: Boolean,
      value: false,
    },
    currentPassword: {
      type: String,
    },
    newPassword: {
      type: String,
    },
    confirmNewPassword: {
      type: String,
    },
  },

  observers: [
    '_computeFormReady(currentPassword, newPassword, confirmNewPassword, loading) ',
  ],

  listeners: {
    input: 'computeErrors',
  },

  _computeFormReady(currentPassword, newPassword, confirmNewPassword, loading) {
    if (
      currentPassword &&
      newPassword &&
      confirmNewPassword &&
      newPassword === confirmNewPassword
    ) {
      this.set('formError', false);
      this.set('formReady', true);
      this.set('dontMatch', false);
    }

    if (loading) {
      this.set('formReady', false);
      this.set('formError', false);
    }

    if (newPassword !== confirmNewPassword) {
      this.set('formReady', false);
      this.set('dontMatch', true);
    }
  },

  _submitForm(_e) {
    const payload = {
      action: 'update_password',
      current_password: this.currentPassword,
      password: this.newPassword,
    };

    this.$.passwordUpdateAjaxRequest.headers['Content-Type'] =
      'application/json';
    this.$.passwordUpdateAjaxRequest.headers['Csrf-Token'] = CSRFToken.value;
    this.$.passwordUpdateAjaxRequest.body = payload;
    this.$.passwordUpdateAjaxRequest.generateRequest();
  },

  _handlePasswordUpdateAjaxResponse(_e) {
    this.dispatchEvent(
      new CustomEvent('toast', {
        bubbles: true,
        composed: true,
        detail: { msg: 'Password updated successfully!', duration: 3000 },
      })
    );

    this._formReset();
  },

  _handlePasswordUpdateAjaxError(e) {
    this.set('formError', true);
    this.shadowRoot.querySelector('#errormsg').textContent =
      e.detail.request.xhr.responseText;
  },

  _setPassword() {
    this.$.passwordSetAjaxRequest.headers['Content-Type'] = 'application/json';
    this.$.passwordSetAjaxRequest.headers['Csrf-Token'] = CSRFToken.value;
    this.$.passwordSetAjaxRequest.body = {};
    this.$.passwordSetAjaxRequest.generateRequest();
  },

  _handlePasswordSetAjaxResponse(_e) {
    this.dispatchEvent(
      new CustomEvent('toast', {
        bubbles: true,
        composed: true,
        detail: {
          msg: `An email was sent to your email account: "${this.user.email}"`,
          duration: 5000,
        },
      })
    );
  },

  _handlePasswordSetAjaxError(e) {
    this.set('formError', true);
    this.shadowRoot.querySelector('#errormsg').textContent =
      e.detail.request.xhr.responseText;
  },

  _formReset() {
    this.set('this.currentPassword', null);
    this.set('this.newPassword', null);
    this.set('this.confirmNewPassword', null);
  },

  hideErrors() {
    this.set('formError', false);
  },
});
