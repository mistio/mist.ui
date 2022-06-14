/* eslint-disable lit/attribute-value-entities */
import '@polymer/paper-button/paper-button.js';
import '@polymer/paper-input/paper-input.js';
import '@polymer/paper-dropdown-menu/paper-dropdown-menu.js';
import '@polymer/paper-input/paper-textarea.js';
import '@polymer/iron-ajax/iron-ajax.js';
import '@polymer/paper-progress/paper-progress.js';
import '@polymer/paper-listbox/paper-listbox.js';
import '../teams/team-add.js';
import { Polymer } from '@polymer/polymer/lib/legacy/polymer-fn.js';
import { html } from '@polymer/polymer/lib/utils/html-tag.js';
import { CSRFToken } from '../helpers/utils.js';

Polymer({
  _template: html`
    <style include="shared-styles">
      :host {
        margin: 0 auto;
        width: 100%;
        display: block;
      }
      #org-form {
        text-align: center;
        padding-bottom: 200px;
      }
      #onboarding-area {
        margin: 0 auto;
        width: 100%;
        max-width: 600px;
        box-sizing: border-box;
        display: flex;
        flex-direction: column;
        width: 100%;
        max-width: 600px;
        height: auto;
        -webkit-touch-callout: none; /* iOS Safari */
        -webkit-user-select: none; /* Chrome/Safari/Opera */
        -khtml-user-select: none; /* Konqueror */
        -moz-user-select: none; /* Firefox */
        -ms-user-select: none; /* Internet Explorer/Edge */
        user-select: none;
        transition: all 320ms cubic-bezier(0.55, 0, 0.1, 1);
        transition-delay: 50ms;
      }
      #onboarding-area[higher] {
        transform: translate(0, -150px);
      }
      .onb-graphics {
        margin: 0 auto;
        height: auto;
        vertical-align: middle;
        top: 0;
        width: 200px;
        max-width: 100%;
      }
      .onboarding-form {
        text-align: center;
        z-index: 1;
        position: relative;
      }
      #org-form paper-input,
      .onboarding-form paper-input {
        text-align: left;
      }
      .onboarding-form-inputs {
        width: 50%;
        min-width: 300px;
        margin: 0 auto;
      }
      .sub {
        font-size: 0.9em;
        line-height: 1.2em;
        opacity: 0.54;
      }
      .blue-link {
        padding: 0;
        text-transform: none;
        font-weight: 400;
        color: #2196f3 !important;
      }
      .spacer {
        display: block;
        height: 16px;
      }
      .onb-forms {
        position: relative;
      }
      .onboarding-form {
        position: absolute;
        width: 100%;
        transition: var(--material-curve-320);
        transform: translate(0, 0);
      }
      .onboarding-form[closed] {
        transform: translate(0, 200vh);
        display: none;
      }
      hr.shorten {
        width: 35%;
        margin: 0 auto;
        opacity: 0.32;
        margin-bottom: 2em;
      }
      .grid-row {
        text-align: left;
      }
      .field-helptext {
        font-size: 14px;
        align-self: center;
        color: rgba(0, 0, 0, 0.54);
      }
      .invite-form-inputs {
        margin-bottom: 2em;
      }
      paper-dropdown-menu {
        width: 100%;
      }
      #progress {
        margin-bottom: 16px;
      }
      #errormsg {
        color: var(--red-color) !important;
        margin-top: 16px;
      }
      #progress paper-progress {
        width: 70%;
        margin: 0 auto;
      }
      #progress paper-progress[error] > ::slotted(#primaryProgress) {
        background-color: var(--red-color) !important;
      }
    </style>

    <div id="onboarding-area">
      <img
        class="onb-graphics top"
        src="./assets/onboarding/clouds.svg"
        alt="Rule the clouds!"
      />
      <div id="org-form" hidden$="[[hasOrg]]">
        <h1>Welcome!</h1>
        <p>
          One small step to complete your sign up:<br />
          Choose an organization name.
        </p>
        <div class="onboarding-form-inputs">
          <paper-input
            id="orginput"
            value$="[[proposedOrgName]]"
            placeholder$="[[proposedOrgName]]"
            tabindex="0"
            on-keyup="_orgInputKeyUp"
          ></paper-input>
          <div class="spacer"></div>
          <paper-button class="wide blue" on-tap="saveOrg">
            Save organization
          </paper-button>
        </div>
        <div class="spacer"></div>
        <h4 class="sub">
          you can always add more organizations later, <br />
          using your profile menu at the top right of your screen
        </h4>
      </div>
      <div class="onb-forms" hidden$="[[!hasOrg]]">
        <div id="cloud-or-invite-form" class="onboarding-form">
          <h1>You are ready to go!</h1>
          <!-- If user isn't allowed to see clouds -->
          <template
            is="dom-if"
            if="[[!checkPerm('cloud', 'add', null, model.org, model.user)]]"
          >
            <h2>
              Check out all the
              <a
                href="https://www.youtube.com/watch?v=7oYyC-FIaAM&t=285s"
                target="_blank"
                >cool things</a
              >
              you can do with Mist!
            </h2>
          </template>
          <p
            hidden$="[[!checkPerm('cloud', 'add', null, model.org, model.user)]]"
          >
            No clouds to manage in <strong>[[model.org.name]]</strong>. Yet.
          </p>
          <div class="onboarding-form-inputs">
            <paper-button
              class="wide blue"
              on-tap="goToAddCloud"
              id="addFirstCloudBtn"
              hidden$="[[!checkPerm('cloud', 'add', null, model.org, model.user)]]"
            >
              Add your clouds
            </paper-button>
          </div>
          <p
            hidden$="[[!checkPerm('cloud', 'add', null, model.org, model.user)]]"
          >
            or
            <paper-button on-tap="showInviteForm" class="blue-link" noink=""
              >invite people
            </paper-button>
            to join you and add clouds.
          </p>
        </div>
        <div id="invite-form" class="onboarding-form" closed="">
          <h1>Invite people in [[model.org.name]]</h1>
          <p>
            To change or add an organization use options on your profile menu
          </p>
          <hr class="shorten" />
          <div class="invite-form-inputs">
            <div class="grid-row">
              <div class="xs12 m6 l6">
                <paper-dropdown-menu
                  no-animations=""
                  id="selectteam"
                  label="Team"
                >
                  <paper-listbox
                    slot="dropdown-content"
                    class="dropdown-content"
                    attr-for-selected="value"
                  >
                    <template is="dom-repeat" items="[[model.teamsArray]]">
                      <paper-item id="teamoption" value="[[item.id]]"
                        >[[item.name]]</paper-item
                      >
                    </template>
                  </paper-listbox>
                </paper-dropdown-menu>
              </div>
              <div class="field-helptext xs12 m6 l6">
                Heads up! <br />Owner's Team members have FULL access to all the
                resources of the organization. To create another team with a
                different policy use the
                <paper-button on-tap="_addTeam" class="blue-link" noink=""
                  >add team form</paper-button
                >
              </div>
              <div class="xs12 m6 l6">
                <paper-textarea
                  id="membersemails"
                  label="Members Emails"
                  rows="5"
                  error-message="Error in emails"
                ></paper-textarea>
              </div>
              <div class="field-helptext xs12 m6 l6">
                One email per line.<br />
                Invited members will receive an invation email to confirm their
                membership. They will have permissions according to their
                teams's policy. Make sure you have allowed some basic access
                such as view clouds.
              </div>
            </div>
          </div>
          <div id="progress">
            <paper-progress
              indeterminate=""
              hidden$="[[!showProgress]]"
            ></paper-progress>
            <paper-progress error="" hidden$="[[!hasError]]"></paper-progress>
            <div id="errormsg" hidden$="[[!hasError]]"></div>
          </div>
          <paper-button on-tap="invitePeople" class="blue wide" noink=""
            >Invite People</paper-button
          >
          <div class="spacer"></div>
          <paper-button noink="" on-tap="hideInviteForm" class="blue-link"
            >Cancel</paper-button
          >
        </div>
      </div>
    </div>

    <team-add referral="onb" organization="[[model.org]]"></team-add>
    <iron-ajax
      id="saveOrgRequest"
      method="PUT"
      url="/api/v1/org/[[model.org.id]]"
      onresponse="saveOrgResponse"
    ></iron-ajax>
    <iron-ajax
      id="invitePeopleRequest"
      method="POST"
      on-response="invitePeopleResponse"
      on-error="invitePeopleError"
      url$="/api/v1/org/[[model.org.id]]/teams/[[selectedTeamId]]/members"
    ></iron-ajax>
  `,

  is: 'onb-element',
  enableCustomStyleProperties: true,

  behaviors: [window.rbac],

  properties: {
    model: {
      type: Object,
      notify: true,
    },
    onboarding: {
      type: Object,
    },
    selectedTeamId: {
      type: String,
      value: '',
    },
    hasOrg: {
      type: Boolean,
      computed: '_computeHasOrg(model.org.name.*)',
      notify: true,
    },
    hasError: {
      type: Boolean,
      value: false,
    },
    showProgress: {
      type: Boolean,
      value: false,
    },
    proposedOrgName: {
      type: String,
      computed: '_computeProposedOrgName(model.user)',
    },
  },

  listeners: {
    'new-team-added': 'updateToNewTeam',
    'iron-select': 'updateSelectTeamId',
    input: 'resetError',
  },

  attached() {},

  _computeHasOrg(name) {
    if (name.value === '') {
      return false;
    }
    return true;
  },

  _computeProposedOrgName() {
    if (this.model.org && this.model.org.name) return this.model.org.name;
    if (this.model.user && this.model.user.first_name)
      return `${this.model.user.first_name}.org`;
    if (this.model.user && this.model.user.email)
      return `${this.model.user.email.split('@')[0]}.org`;
    if (this.model.user && this.model.user.username)
      return `${this.model.user.username}.org`;
    return '';
  },

  _orgInputKeyUp(event) {
    console.warn('keyup', event);
    if (event.keyCode === 13) this.saveOrg();
  },

  saveOrg() {
    const newName = this.shadowRoot.querySelector('#orginput').value;
    this.dispatchEvent(
      new CustomEvent('user-action', {
        bubbles: true,
        composed: true,
        detail: `Save org ${newName}`,
      })
    );

    this.$.saveOrgRequest.headers['Content-Type'] = 'application/json';
    this.$.saveOrgRequest.headers['Csrf-Token'] = CSRFToken.value;
    this.$.saveOrgRequest.body = { new_name: newName };
    this.$.saveOrgRequest.generateRequest();
  },

  saveOrgResponse(_event) {
    this.$.addFirstCloudBtn.focus();
  },

  goToAddCloud() {
    this.dispatchEvent(
      new CustomEvent('user-action', {
        bubbles: true,
        composed: true,
        detail: 'add cloud click',
      })
    );

    this.dispatchEvent(
      new CustomEvent('go-to', {
        bubbles: true,
        composed: true,
        detail: { url: '/clouds/+add' },
      })
    );
  },

  showInviteForm() {
    this.dispatchEvent(
      new CustomEvent('user-action', {
        bubbles: true,
        composed: true,
        detail: 'invite people click',
      })
    );

    const addform = this.shadowRoot.querySelector('#cloud-or-invite-form');
    const inviteform = this.shadowRoot.querySelector('#invite-form');
    const container = this.shadowRoot.querySelector('#onboarding-area');
    addform.setAttribute('closed', true);
    inviteform.removeAttribute('closed');
    container.setAttribute('higher', true);
  },

  hideInviteForm() {
    this.dispatchEvent(
      new CustomEvent('user-action', {
        bubbles: true,
        composed: true,
        detail: 'cancel click',
      })
    );

    const addform = this.shadowRoot.querySelector('#cloud-or-invite-form');
    const inviteform = this.shadowRoot.querySelector('#invite-form');
    const container = this.shadowRoot.querySelector('#onboarding-area');
    addform.removeAttribute('closed');
    inviteform.setAttribute('closed', true);
    container.removeAttribute('higher');
  },

  invitePeople() {
    this.showProgress = true;
    const emails = this.shadowRoot.querySelector('#membersemails').value;
    if (emails) {
      this.$.invitePeopleRequest.headers['Content-Type'] = 'application/json';
      this.$.invitePeopleRequest.headers['Csrf-Token'] = CSRFToken.value;
      this.$.invitePeopleRequest.body = { emails };
      this.$.invitePeopleRequest.generateRequest();
    } else {
      this.invitePeopleError();
    }
  },

  invitePeopleResponse() {
    this.dispatchEvent(
      new CustomEvent('go-to', {
        bubbles: true,
        composed: true,
        detail: { url: `/teams/${this.selectedTeamId}` },
      })
    );

    this.set('showProgress', false);
    this.async(() => {
      this.hideInviteForm();
    }, 100);
  },

  invitePeopleError(e) {
    this.set('showProgress', false);
    this.set('hasError', true);
    if (e) {
      this.$.errormsg.textContent = e.detail.error.message;
    } else {
      this.$.errormsg.textContent = 'You have not provided any emails';
    }
  },

  updateSelectTeamId(e) {
    if (this.hasError) {
      this.set('hasError', false);
    }
    if (e.detail.item.id === 'teamoption') {
      const teamId = e.detail.item.value;
      this.set('selectedTeamId', teamId);
    }
  },

  resetError() {
    if (this.hasError) {
      this.set('hasError', false);
    }
  },

  _addTeam(_e) {
    this.dispatchEvent(
      new CustomEvent('user-action', {
        bubbles: true,
        composed: true,
        detail: 'add team click',
      })
    );

    const dialog = this.shadowRoot.querySelector('team-add');
    dialog.openDialog();
  },

  updateToNewTeam(_newTeam) {
    // would be nice to update dropdown to new team
  },
});
