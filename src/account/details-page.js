import '@polymer/polymer/polymer-legacy.js';
import '@polymer/paper-styles/typography.js';
import '@polymer/paper-material/paper-material.js';
import '@polymer/paper-radio-group/paper-radio-group.js';
import '@polymer/paper-button/paper-button.js';
import '@polymer/paper-icon-button/paper-icon-button.js';
import '@polymer/paper-progress/paper-progress.js';
import '@polymer/paper-input/paper-input.js';
import '@polymer/paper-input/paper-textarea.js';
import '@polymer/paper-dropdown-menu/paper-dropdown-menu.js';
import '@vaadin/vaadin-upload/vaadin-upload.js';
import '@polymer/paper-toggle-button/paper-toggle-button.js';
import '@polymer/iron-ajax/iron-ajax.js';
import '@polymer/iron-image/iron-image.js';
import { Polymer } from '@polymer/polymer/lib/legacy/polymer-fn.js';
import { html } from '@polymer/polymer/lib/utils/html-tag.js';
import { CSRFToken } from '../helpers/utils.js';

Polymer({
  _template: html`
    <style include="shared-styles forms">
      :host {
        display: block;
      }

      :host paper-material {
        display: block;
        padding: 0;
      }

      label {
        color: rgba(0, 0, 0, 0.54) !important;
        font-size: 12px;
      }

      .grid-row {
        padding: 24px;
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
      .separator {
        border-top: 4px solid #ddd;
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

      iron-image.avatar-preview {
        width: 80px;
        height: 36px;
        margin: 2px 6px;
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

      paper-toggle-button {
        margin: auto;
        display: inline-flex;
        vertical-align: text-bottom;
        cursor: pointer;
      }

      .margin-bottom {
        margin-bottom: 16px;
      }

      .secondary {
        opacity: 0.54;
        display: inline-flex;
        vertical-align: text-bottom;
      }
    </style>
    <paper-material>
      <div class="grid-row">
        <div class="xs12 head">
          <h2 class="title">User Profile</h2>
        </div>
        <paper-input
          class="xs12 l6"
          id="firstName"
          label="First Name"
          required=""
          error-message="Please enter your first name"
          value="{{firstName}}"
          auto-validate=""
        ></paper-input>

        <paper-input
          class="xs12 l6"
          id="lastName"
          label="Last Name"
          required=""
          error-message="Please enter your last name"
          value="{{lastName}}"
          auto-validate=""
        ></paper-input>

        <paper-input
          class="xs12 l6"
          id="email"
          label="Email *"
          required=""
          error-message="Please enter your email"
          value="[[user.email]]"
          auto-validate=""
          disabled=""
        ></paper-input>
        <p class="xs12 l12">
          * Currently you cannot change your account's email for security
          reasons. Please contact us at
          <a class="blue-link" href$="mailto:[[config.email.support]]"
            >[[config.email.support]]</a
          >, if you wish to do so.
        </p>

        <div class="progress">
          <paper-progress
            id="userProgress"
            indeterminate=""
            hidden$="[[!loadingUser]]"
          ></paper-progress>
          <paper-progress
            id="userprogresserror"
            class="progresserror"
            value="100"
            hidden$="[[!userError]]"
          ></paper-progress>
          <hr class="appform" />
          <p
            id="userprogressmessage"
            class="errormsg-container"
            hidden$="[[!userError]]"
          >
            <iron-icon icon="icons:error-outline"></iron-icon
            ><span id="usererrormsg"></span>
          </p>
        </div>

        <div class="bottom-actions clearfix xs12">
          <paper-button
            class="pull-right"
            disabled$="[[!userFormReady]]"
            raised=""
            on-tap="_submitUserForm"
            page="second"
            >Save User Profile</paper-button
          >
          <iron-ajax
            id="userAjaxRequest"
            url="/api/v1/account"
            method="POST"
            loading="{{loadingUser}}"
            on-response="_handleAjaxResponse"
            on-error="_handleDetailsAjaxError"
            handle-as="xml"
          ></iron-ajax>
        </div>
      </div>
    </paper-material>
    <paper-material class="separator">
      <div class="grid-row" hidden$="[[!org.is_owner]]">
        <div class="xs12 head">
          <h2 class="title">Organization Profile</h2>
          <p>
            Enter your organization details. To switch organization use the user
            menu in the top right corner of your screen.
          </p>
        </div>
        <paper-input
          class="dropdown-block xs12 l6"
          id="orgName"
          label="Organization Name"
          required=""
          error-message="Please enter your company's name"
          value="{{orgName}}"
          auto-validate=""
          disabled$="[[!org.is_owner]]"
        ></paper-input>

        <paper-textarea
          class="xs12 l6"
          id="org-email"
          label="Organization Alert Email *"
          error-message="Please enter your email"
          value="{{orgAlertEmails}}"
          auto-validate=""
          hidden$="[[!config.features.monitoring]]"
        ></paper-textarea>

        <p class="xs12 l12" hidden$="[[!config.features.monitoring]]">
          * In your organization's alert email, you can specify the email you
          want your incidents' alerts to be sent to. This can be overriden when
          you add rules in your monitored machines.
        </p>

        <div class="xs12 head">
          <h2 class="title">Organization Features</h2>
          <div hidden$="[[!org.avatar]]" class="existing-org-logo">
            <div class="org-logo-field-title">Organization logo</div>
            <div>
              <div class="org-logo-container">
                <iron-image
                  src$="[[_computeAvatarURL(org.avatar)]]"
                  fades=""
                  sizing="contain"
                  class="avatar-preview"
                ></iron-image>
              </div>
              <paper-icon-button
                icon="close"
                on-tap="_deleteAvatar"
                class="delete-avatar-icon"
              ></paper-icon-button>
            </div>
          </div>
          <div hidden$="[[org.avatar.length]]">
            <!-- <div class="xs12 org-logo-field-title margin">Custom Logo</div> -->
            <paper-toggle-button checked="{{customLogo}}">
              Enable custom logo.
            </paper-toggle-button>
            <div hidden$="[[!customLogo]]">
              <p class="xs12 l12">
                Upload an image that will override the default logo
              </p>
              <vaadin-upload
                id="orgAvatarUpload"
                max-files="1"
                accept="image/png"
                max-file-size="262144"
                headers="[[_computeUploadHeaders()]]"
                target="/api/v1/avatars"
              >
                <span slot="drop-label">
                  Drop file here - PNG up to 256kb
                </span>
                <div class="org-logo-container">
                  <iron-image
                    src$="[[_computeAvatarURL(orgAvatar)]]"
                    fades=""
                    hidden$="[[!orgAvatar]]"
                    sizing="contain"
                    class="avatar-preview"
                  ></iron-image>
                </div>
              </vaadin-upload>
            </div>
          </div>
        </div>

        <div class="xs12 margin-bottom" hidden$="[[!config.features.r12ns]]">
          <div hidden$="[[!org.is_owner]]">
            <paper-toggle-button checked="{{enableR12ns}}">
              Recommendations <span hidden$="[[enableR12ns]]">OFF</span>
              <span hidden$="[[!enableR12ns]]">ON</span>
            </paper-toggle-button>
            <span class="secondary"
              >Generate cost and performance recommendations for your monitored
              infrastructure.
            </span>
          </div>
        </div>

        <div class="xs12" hidden$="[[!config.features.rbac]]">
          <div hidden$="[[!org.is_owner]]">
            <paper-toggle-button checked$="{{enableOwnership}}">
              Private Resource Ownership
              <span hidden$="[[enableOwnership]]">OFF</span>
              <span hidden$="[[!enableOwnership]]">ON</span>
            </paper-toggle-button>
            <span class="secondary"
              >Let users own the resources they create. Used for filtering and
              access control.
            </span>
          </div>
        </div>

        <div class="progress">
          <paper-progress
            id="orgProgress"
            indeterminate=""
            hidden$="[[!loadingOrg]]"
          ></paper-progress>
          <paper-progress
            id="orgprogresserror"
            class="progresserror"
            value="100"
            hidden$="[[!orgError]]"
          ></paper-progress>
          <hr class="appform" />
          <p
            id="orgprogressmessage"
            class="errormsg-container"
            hidden$="[[!orgError]]"
          >
            <iron-icon icon="icons:error-outline"></iron-icon
            ><span id="orgerrormsg"></span>
          </p>
        </div>

        <div class="bottom-actions clearfix xs12">
          <paper-button
            class="pull-right"
            disabled$="[[!orgFormReady]]"
            raised=""
            on-tap="_submitOrgForm"
            page="second"
            >Save Organization Profile</paper-button
          >
          <iron-ajax
            id="orgAjaxRequest"
            url="/api/v1/org/[[org.id]]"
            method="PUT"
            loading="{{loadingOrg}}"
            on-response="_handleAjaxResponse"
            on-error="_handleOrgAjaxError"
            handle-as="xml"
          ></iron-ajax>

          <iron-ajax
            id="ownershipRequest"
            url="/api/v1/ownership"
            method="PUT"
            loading="{{loadingOrg}}"
            on-response="_handleAjaxResponse"
            on-error="_handleOrgAjaxError"
            handle-as="xml"
          ></iron-ajax>
        </div>
      </div>

      <div class="grid-row" hidden$="[[org.is_owner]]">
        <div class="xs12 head">
          <h2 class="title">Organization</h2>
          <p>
            You are operating as a member of <strong>[[org.name]]</strong>. To
            switch between organizations use the user menu in the top right
            corner of your screen.
          </p>
        </div>
      </div>
    </paper-material>
  `,

  is: 'details-page',

  properties: {
    config: {
      type: Object,
    },
    org: {
      type: Object,
    },
    user: {
      type: Object,
    },
    firstName: {
      type: String,
    },
    lastName: {
      type: String,
    },
    orgName: {
      type: String,
    },
    orgAlertEmails: {
      type: String,
    },
    userFormReady: {
      type: Boolean,
      computed: '_computeUserFormReady(firstName, lastName, loadingUser, user)',
    },
    orgFormReady: {
      type: Boolean,
      computed:
        '_computeOrgFormReady(orgName, orgAlertEmails, orgAvatar, enableR12ns, loadingOrg, org, enableOwnership)',
    },
    loadingUser: {
      type: Boolean,
      value: false,
    },
    userError: {
      type: Boolean,
      value: false,
    },
    loadingOrg: {
      type: Boolean,
      value: false,
    },
    orgError: {
      type: Boolean,
      value: false,
    },
    orgAvatar: {
      type: String,
      value: '',
    },
    customLogo: {
      type: Boolean,
      value: false,
    },
    enableR12ns: {
      type: Boolean,
      value: false,
    },
    enableOwnership: {
      type: Boolean,
      value: false,
    },
  },

  observers: [
    '_userUpdated(user)',
    '_orgUpdated(org)',
    // '_enableOwnershipChanged(enableOwnership)'
  ],

  attached() {
    const that = this;
    this.$.orgAvatarUpload.addEventListener(
      'upload-response',
      (e) => {
        if (e.detail.xhr.status === 200) {
          that.orgAvatar = JSON.parse(e.detail.xhr.response).id;
        }
      },
      { passive: true }
    );
    this.$.orgAvatarUpload.addEventListener(
      'file-remove',
      () => {
        that.orgAvatar = '';
      },
      { passive: true }
    );
  },

  _userUpdated(user) {
    this.firstName = user.first_name;
    this.lastName = user.last_name;
  },

  _orgUpdated() {
    this.orgName = this.org.name;
    this.orgAlertEmails = this.org.alerts_email.join('\n');
    this.customLogo = !!this.org.avatar;
    this.enableR12ns = this.org.enable_r12ns;
    this.enableOwnership = this.org.ownership_enabled;
  },

  _computeUploadHeaders() {
    return { 'Csrf-Token': CSRFToken.value, Accept: 'application/json' };
  },

  _deleteAvatar() {
    const xhr = new XMLHttpRequest();
    xhr.open('DELETE', `/api/v1/avatars/${this.org.avatar}`);
    xhr.setRequestHeader('Csrf-Token', CSRFToken.value);
    xhr.send();
    this.orgAvatar = '';
    this.$.orgAvatarUpload.files = [];
  },

  _computeUserFormReady(firstName, lastName, loading, user) {
    if (loading || !user) return false;

    if (firstName === user.first_name && lastName === user.last_name)
      return false;

    if (firstName && lastName) return true;

    return false;
  },

  _computeOrgFormReady(
    orgName,
    orgAlertEmails,
    orgAvatar,
    enableR12ns,
    loading,
    org,
    enableOwnership
  ) {
    if (
      orgName &&
      orgName.trim() !== '' &&
      org.is_owner &&
      !loading &&
      (orgName !== org.name ||
        enableR12ns !== org.enable_r12ns ||
        enableOwnership !== org.ownership_enabled ||
        (orgAlertEmails && orgAlertEmails !== org.alerts_email.join('\n')) ||
        (orgAvatar && orgAvatar !== org.avatar))
    )
      return true;
    return false;
  },

  _computeShowProgress(sendingData) {
    return sendingData;
  },

  _computeAvatarURL(orgAvatar) {
    if (orgAvatar.length) return `/api/v1/avatars/${orgAvatar}`;
    return '';
  },

  _submitUserForm() {
    const payload = {
      action: 'update_details',
      first_name: this.firstName,
      last_name: this.lastName,
    };

    this.$.userAjaxRequest.headers['Content-Type'] = 'application/json';
    this.$.userAjaxRequest.headers['Csrf-Token'] = CSRFToken.value;
    this.$.userAjaxRequest.body = payload;
    this.$.userAjaxRequest.generateRequest();
    console.log('loadingUser', this.loadingUser);
  },

  _toggleOwnership() {
    this.$.ownershipRequest.headers['Content-Type'] = 'application/json';
    this.$.ownershipRequest.headers['Csrf-Token'] = CSRFToken.value;
    this.$.ownershipRequest.generateRequest();
  },

  _submitOrgForm(e, org) {
    if (
      !(
        this.org.ownership_enabled === undefined &&
        this.enableOwnership === false
      ) &&
      this.enableOwnership !== this.org.ownership_enabled
    )
      this._toggleOwnership();

    if (
      this.orgName !== org.name ||
      this.enableR12ns !== this.org.enable_r12ns ||
      (this.orgAlertEmails &&
        this.orgAlertEmails !== org.alerts_email.join('\n')) ||
      (this.orgAvatar && this.orgAvatar !== org.avatar)
    ) {
      const payload = {
        new_name: this.orgName,
        alerts_email: this.orgAlertEmails,
        enable_r12ns: this.enableR12ns,
      };

      if (this.orgAvatar) payload.avatar = this.orgAvatar;

      this.$.orgAjaxRequest.headers['Content-Type'] = 'application/json';
      this.$.orgAjaxRequest.headers['Csrf-Token'] = CSRFToken.value;
      this.$.orgAjaxRequest.body = payload;
      this.$.orgAjaxRequest.generateRequest();
      console.log('loadingOrg', this.loadingOrg);
    }
  },

  _handleAjaxResponse() {
    this.dispatchEvent(
      new CustomEvent('toast', {
        bubbles: true,
        composed: true,
        detail: { msg: 'Changes saved succesfully!', duration: 3000 },
      })
    );
  },

  _handleAjaxError(e) {
    this.set('userError', true);
    this.$.usererrormsg.textContent = e.detail.request.xhr.responseText;
  },

  _handleOrgAjaxError(e) {
    this.set('orgError', true);
    this.$.orgerrormsg.textContent = e.detail.request.xhr.responseText;
  },
});
