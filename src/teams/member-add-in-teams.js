import '@polymer/polymer/polymer-legacy.js';
import '@polymer/paper-button/paper-button.js';
import '@polymer/paper-progress/paper-progress.js';
import '@polymer/paper-styles/typography.js';
import '@polymer/paper-checkbox/paper-checkbox.js';
import '../app-form/app-form.js';
import { CSRFToken } from '../helpers/utils.js';
import { Polymer } from '@polymer/polymer/lib/legacy/polymer-fn.js';
import { html } from '@polymer/polymer/lib/utils/html-tag.js';

Polymer({
  _template: html`
    <style include="shared-styles forms single-page">
      #content {
        max-width: 900px;
      }
      paper-material {
        display: block;
        padding: 24px;
      }
      paper-progress {
        width: 100%;
        left: 0;
        right: 0;
      }
      :host > ::slotted(paper-input-container) {
        padding-top: 16px;
        padding-bottom: 16px;
      }
      h3,
      .item {
        display: block;
        width: 100%;
      }
      .item {
        margin: 8px 0;
      }
      .pull-right {
        float: right;
      }
      .progress {
        margin: 32px 0 8px 0;
        width: 100%;
      }
      paper-progress#progresserror ::slotted(#primaryProgress) {
        background-color: var(--red-color);
      }
      .errormsg-container {
        color: var(--red-color);
      }
      .errormsg-container iron-icon {
        color: inherit;
      }
    </style>
    <div id="content">
      <paper-material
        class="single-head layout horizontal"
        style$="background-color: [[section.color]]"
      >
        <span class="icon"
          ><iron-icon icon="[[section.icon]]"></iron-icon
        ></span>
        <div class="title flex">
          <h2>Add [[member.name]] in teams</h2>
          <div class="subtitle" hidden$="[[member.pending]]">
            You can add the user in multiple teams in one go.
          </div>
          <div class="subtitle" hidden$="[[!member.pending]]">
            As soon as the user confirms, will be added in all teams you select.
          </div>
        </div>
      </paper-material>
      <paper-material>
        <h3 class="smallcaps xs-12">Choose Teams</h3>
        <div id="teamslist">
          <template is="dom-repeat" items="[[model.teamsArray]]" as="team">
            <paper-checkbox
              id$="[[team.id]]"
              class="item"
              checked$="[[_memberIsInTeam(team.id,member)]]"
              disabled$="[[_memberIsInTeam(team.id,member)]]"
              >[[team.name]]</paper-checkbox
            >
          </template>
        </div>
        <div class="progress">
          <paper-progress
            id="progress"
            indeterminate=""
            hidden$="[[!sendingData]]"
          ></paper-progress>
          <paper-progress
            id="progresserror"
            value="100"
            hidden$="[[!formError]]"
          ></paper-progress>
          <hr class="appform" />
          <p class="errormsg-container" hidden$="[[!formError]]">
            <iron-icon icon="icons:error-outline"></iron-icon
            ><span id="errormsg"></span>
          </p>
        </div>
        <paper-button
          id="appformsubmit"
          class="submit-btn pull-left blue"
          disabled$="[[!formReady]]"
          on-tap="_addMemberRequest"
          >Add in teams</paper-button
        >
        <paper-button class="pull-right blue-link" on-tap="goToMember"
          >Cancel</paper-button
        >
        <!-- <app-form fields="[[fields]]" url="/api/v1/org/[[model.org.id]]/teams/[[team.id]]/members" method="POST" on-request="_addMembersRequest" on-response="_addMembersResponse" ></app-form> -->
      </paper-material>
    </div>
    <iron-ajax
      id="formAjax"
      url="/api/v1/org/[[model.org.id]]/teams/[[teamId]]/members"
      contenttype="application/json"
      handle-as="document"
      method="POST"
      on-response="_handleResponse"
      on-error="_handleError"
    ></iron-ajax>
  `,

  is: 'member-add-in-teams',

  properties: {
    section: {
      type: Object,
    },
    model: {
      type: Object,
    },
    params: {
      type: Object,
    },
    member: {
      type: Object,
      computed: '_computeMember(params, model.members.*)',
    },
    selectedTeams: {
      type: Array,
      value: [],
    },
    formReady: {
      type: Boolean,
      value: false,
    },
    sendingData: {
      type: Boolean,
      value: false,
    },
    formError: {
      type: Boolean,
      value: false,
    },
    teamId: {
      type: String,
      value: null,
    },
  },

  listeners: {
    change: 'updateSelectedTeams',
  },

  ready() {},

  _computeMember(params, membersArray) {
    if (params && membersArray) {
      let member;
      if (this.model && this.model.membersArray) {
        member = this.model.membersArray.find(m => {
          return m.id === params.id;
        });
      }
      if (member) {
        return member;
      }

      return {
        name: 'member not found',
      };
    }
    return { name: 'member not found' };
  },

  updateSelectedTeams(e) {
    if (this.formError) {
      this.set('formError', false);
    }
    const clickedTeam = e.target.attributes.id.value;
    const index = this.selectedTeams.indexOf(clickedTeam);
    if (index > -1) {
      this.selectedTeams.splice(index, 1);
    } else {
      this.selectedTeams.push(clickedTeam);
    }
    if (this.selectedTeams.length > 0) {
      this.set('formReady', true);
    } else {
      this.set('formReady', false);
    }
  },

  _addMemberRequest() {
    this.set('sendingData', true);

    this.$.formAjax.body = {
      emails: this.member.email,
    };
    this.$.formAjax.headers['Content-Type'] = 'application/json';
    this.$.formAjax.headers['Csrf-Token'] = CSRFToken.value;

    this.async(
      () => {
        this.selectedTeams.forEach(t => {
          this.set('teamId', t);
          this.$.formAjax.generateRequest();
        }, this);
      },
      100,
      this
    );
  },

  _handleResponse(_e) {
    this.dispatchEvent(
      new CustomEvent('go-to', {
        bubbles: true,
        composed: true,
        detail: { url: `/members/${this.member.id}` },
      })
    );

    this.set('sendingData', false);
  },

  _handleError(_e) {
    this.set('formError', true);
    console.log('member add in teams error');
  },

  _memberIsInTeam(team, _member) {
    if (this.member) {
      const index = this.model.teams[team].members.indexOf(this.member.id);
      // console.log(index, team);
      if (index > -1) {
        return true;
      }

      return false;
    }
    return false;
  },

  goToMember() {
    this.dispatchEvent(
      new CustomEvent('go-to', {
        bubbles: true,
        composed: true,
        detail: { url: `/members/${this.member.id}` },
      })
    );
  },
});
