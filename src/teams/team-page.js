import '../../node_modules/@polymer/polymer/polymer-legacy.js';
import '../../node_modules/@polymer/paper-button/paper-button.js';
import '../../node_modules/@polymer/paper-styles/typography.js';
import '../../node_modules/@polymer/paper-spinner/paper-spinner.js';
import '../../node_modules/@polymer/paper-icon-button/paper-icon-button.js';
import '../../node_modules/@polymer/paper-item/paper-item-body.js';
import '../mist-rules/mist-rules.js';
import { mistRulesBehavior } from '../helpers/mist-rules-behavior.js';
import { mistLogsBehavior } from '../helpers/mist-logs-behavior.js';
import '../helpers/dialog-element.js';
import { CSRFToken } from '../helpers/utils.js';
import { mistLoadingBehavior } from '../helpers/mist-loading-behavior.js';
import './team-actions.js';
import './team-policy.js';

import { Polymer } from '../../node_modules/@polymer/polymer/lib/legacy/polymer-fn.js';
import { html } from '../../node_modules/@polymer/polymer/lib/utils/html-tag.js';

Polymer({
  _template: html`
    <style include="shared-styles lists single-page">
      #content {
        padding-bottom: 180px;
      }

      paper-material {
        display: block;
        padding: 24px;
      }

      paper-material.no-pad {
        padding: 0;
      }

      paper-menu-button paper-button {
        display: block;
      }

      .flex-horizontal-with-ratios {
        display: flex;
        flex-direction: row;
        align-content: stretch;
      }

      paper-item ::slotted(.flexchild) {
        display: flex;
        flex-flow: row;
        flex: 1;
        align-self: center;
      }

      paper-item.member-item {
        border-bottom: 1px solid #eee;
        height: 42px;
        font-size: 15px;
        display: flex;
      }

      a {
        color: black;
        text-decoration: none;
      }

      .paper-header [paper-drawer-toggle] {
        margin-left: 10px;
      }

      .paper-header {
        /*@apply --layout-horizontal;*/
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
        /*@apply --layout-flex;*/
        display: flex;
        text-transform: capitalize;
      }

      .paper-header .toggleViewButton {
        --paper-icon-button-ink-color: transparent;
      }

      .paper-header .cartButton {
        margin-right: 10px;
      }

      paper-icon-button {
        transition: all 200ms;
      }

      [size='xs'] > * {
        display: none;
      }

      [size='xs'] mist-sidebar {
        min-width: 100%;
        height: auto;
      }

      paper-icon-bottom.bottom {
        padding-right: 8px;
      }

      .subhead {
        box-sizing: border-box;
        position: absolute;
        width: 100%;
        left: 0;
        height: 57px;
        bottom: -57px;
        right: 0;
        z-index: 9;
        color: rgba(0, 0, 0, 0.87);
        font-size: 15px;
        line-height: 24px;
      }

      .content {
        margin-top: 57px;
        padding-bottom: 80px;
      }

      paper-header-panel ::slotted(#dropShadow) {
        top: 56px;
      }

      paper-toolbar ::slotted(#bottomBar .right-actions) {
        transition: var(--paper-toolbar-transition, margin-right 0.18s ease-in);
      }

      paper-toolbar:not(.tall) ::slotted(#bottomBar .right-actions) {
        margin-right: 70px;
      }

      .red {
        color: var(--red-color);
        background-color: transparent;
      }

      .required {
        font-size: 0.9em;
      }

      .resource-head {
        font-weight: 500;
        padding: 8px 16px;
        opacity: 0.87;
        border-bottom: 1px solid #ddd;
        margin-bottom: 0;
      }

      .title .up {
        text-transform: uppercase;
      }

      .width100 {
        width: 100%;
      }

      .pending {
        font-weight: 500;
        font-size: 0.9em;
        background-color: #69b46c;
        color: #fff;
        padding: 2px 6px 4px 6px;
        border-radius: 3px;
        margin-right: 12px;
      }

      .delete-member,
      .resend-invitation {
        opacity: 0.32;
        align-self: center;
      }

      .resend {
        padding: 8px 0;
        font-weight: normal;
      }

      paper-button a {
        color: #fff;
      }

      .single-head {
        @apply --team-page-head-mixin;
      }
      team-actions {
        width: 50%;
        fill: #fff;
      }
    </style>
    <div id="content">
      <paper-material class="single-head layout horizontal">
        <span class="icon">
          <iron-icon icon="[[section.icon]]"></iron-icon>
        </span>
        <div class="title flex">
          <h2>
            <span hidden$="[[!team.parent]]">
              <span>[</span>[[model.org.parent_org_name]]
              <span>]</span>
            </span>
            [[team.name]]
          </h2>
          <div class="subtitle">
            <span class="sub" hidden$="[[!team.description]]"
              >[[team.description]]
            </span>
            <span class="desc" hidden$="[[!hasOnlyYou]]"> Only you</span>
            <span class="desc" hidden$="[[hasOnlyYou]]">
              [[confirmedMembersLength]] members.</span
            >
            <span class="desc" hidden$="[[!hasPending]]">
              [[pendingMembers.length]] pending</span
            >
          </div>
        </div>
        <team-actions
          items="[[itemArray]]"
          actions="{{actions}}"
          org="[[model.org.id]]"
        ></team-actions>
      </paper-material>
      <paper-material>
        <div class="missing" hidden$="[[!isMissing]]">Team not found.</div>
        <div class="flex-horizontal-with-ratios" hidden$="[[isMissing]]">
          <div class="page-block" hidden$="[[!team.description.length]]">
            <h3 class="smallcaps">Team Description</h3>
            <p>[[team.description]]</p>
          </div>
          <div class="page-block">
            <h3 class="smallcaps">Non-member visibility</h3>
            <p hidden$="[[!team.visible]]">Visible</p>
            <p hidden$="[[team.visible]]">Not visible</p>
          </div>
          <div class="page-block">
            <h3 class="smallcaps">Created</h3>
            <p>[[timestamp]]</p>
          </div>
          <div class="page-block" hidden$="[[!team.owned_by.length]]">
            <h3 class="smallcaps">Owner</h3>
            <p>
              <a href$="/members/[[team.owned_by]]"
                >[[_displayUser(team.owned_by,model.members)]]</a
              >
            </p>
          </div>
          <div class="page-block" hidden$="[[!team.created_by.length]]">
            <h3 class="smallcaps">Created by</h3>
            <p>
              <a href$="/members/[[team.created_by]]"
                >[[_displayUser(team.created_by,model.members)]]</a
              >
            </p>
          </div>
        </div>
      </paper-material>
      <div class="flex-horizontal-with-ratios section">
        <div class="width100">
          <template is="dom-if" if="[[hasMembers]]">
            <paper-material class="no-pad members">
              <h3 class="smallcaps resource-head">
                Members in [[team.name]] team
              </h3>
              <template is="dom-repeat" items="[[members]]">
                <paper-item class="member-item">
                  <paper-item-body>
                    <span>
                      <paper-icon-button
                        id="resend"
                        icon="icons:send"
                        on-tap="_resendMemberInvitation"
                        class="resend-invitation"
                        hidden$="[[!item.pending]]"
                        title="Resend invitation."
                      ></paper-icon-button>
                      <span class="pending" hidden$="[[!item.pending]]"
                        >pending</span
                      >
                      <a href="/members/[[item.id]]" class="pad-left">
                        [[item.name]]
                      </a>
                      <span hidden$="[[isEqual(item.name,item.email)]]"
                        >[[item.email]]</span
                      >
                      <span hidden$="[[!item.username]]"
                        >[[item.username]]</span
                      >
                    </span>
                  </paper-item-body>
                  <iron-icon
                    icon="icons:delete"
                    on-tap="_deleteMemberFromTeam"
                    class="delete-member"
                    memberid$="[[item.id]]"
                    membername$="[[item.name]]"
                  ></iron-icon>
                </paper-item>
              </template>
            </paper-material>
          </template>
          <template is="dom-if" if="[[!hasMembers]]">
            <paper-material>
              <div class="text-center">
                <paper-button
                  class="blue pad-left2 pad-right2"
                  on-tap="_addMember"
                  disabled$="[[isMissing]]"
                >
                  Add Members
                </paper-button>
              </div>
            </paper-material>
          </template>
        </div>
      </div>
      <div class="flex-horizontal-with-ratios section" hidden$="[[!rbac]]">
        <div class="width100" hidden$="[[isMissing]]">
          <paper-material class="no-pad policy">
            <!-- TODO: make interactive add edit of rules -->
            <h3 class="smallcaps resource-head">Team Policy</h3>
            <team-policy
              model="[[model]]"
              team="[[team]]"
              hidden$="[[teamIsOwners]]"
            ></team-policy>
            <p class="text-center" hidden$="[[!teamIsOwners]]">
              Members of the owners team have full access to all resources in
              your organization.
              <br />
              For fine grained permissions add more teams and assign RBAC
              policies.
              <a
                href="http://docs.mist.io/article/102-role-based-access-control"
                target="_blank"
                class="blue-link"
                hidden$="[[!docs]]"
                >Documentation</a
              >
              <br />
              <br />
            </p>
          </paper-material>
        </div>
      </div>
      <div class="flex-horizontal-with-ratios section" hidden$="[[rbac]]">
        <div class="width100">
          <paper-material class="no-pad">
            <h3 class="smallcaps resource-head text-center">Team Policy</h3>
            <p class="text-center">[[cta.description]]</p>
            <p class="text-center">
              <paper-button class="blue uppercase">
                <a href$="[[cta.uri]]" target="_blank">[[cta.action]]</a>
              </paper-button>
            </p>
            <p class="text-center">
              or contact
              <a href$="mailto:[[email.sales]]" class="blue-link"
                >[[email.sales]]</a
              >
              for details.
              <br />
              <br />
            </p>
          </paper-material>
        </div>
      </div>
      <br />
      <paper-material class="no-pad">
        <template is="dom-if" if="[[team]]" restamp="">
          <mist-list
            id="teamLogs"
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
            name="team logs"
            primary-field-name="time"
            base-filter="[[team.id]]"
          ></mist-list>
        </template>
      </paper-material>
    </div>
    <div class="absolute-bottom-right">
      <paper-fab icon="social:person-add" on-tap="_addMember"></paper-fab>
    </div>
    <iron-ajax
      id="teamDeleteAjaxRequest"
      url="/api/v1/org/[[model.org.id]]/teams/[[team.id]]"
      method="DELETE"
      on-response="_handleTeamDeleteAjaxResponse"
      on-error="_handleDeleteAjaxError"
    ></iron-ajax>
    <iron-ajax
      id="deleteMember"
      url="/api/v1/org/[[model.org.id]]/teams/[[team.id]]/members/[[memberToDelete]]"
      method="DELETE"
      on-response="_deleteMemberResponse"
      on-error="_handleDeleteAjaxError"
    ></iron-ajax>
    <iron-ajax
      id="_resendInvitation"
      url="/api/v1/org/[[model.org.id]]/teams/[[team.id]]/members"
      contenttype="application/json"
      handle-as="document"
      method="POST"
      on-response="_handleResendResponse"
      on-error="_handleResendError"
    ></iron-ajax>
    <dialog-element></dialog-element>
  `,

  is: 'team-page',

  behaviors: [mistLoadingBehavior, mistLogsBehavior, mistRulesBehavior],

  properties: {
    section: {
      type: Object,
    },
    model: {
      type: Object,
    },
    cta: {
      type: Object,
    },
    hasPending: {
      type: Boolean,
    },
    team: {
      type: Object,
    },
    hasMembers: {
      type: Boolean,
      value: false,
      computed: '_hasMembers(team)',
    },
    hasOnlyYou: {
      type: Boolean,
      value: true,
      computed: '_hasOnlyYou(team)',
    },
    hasOtherMembers: {
      type: Boolean,
      value: true,
      computed: '_hasOtherMembers(team)',
    },
    confirmedMembersLength: {
      type: Number,
    },
    members: {
      type: Array,
      computed: '_computeMembers(team, team.members, model.members.*)',
    },
    pendingMembers: {
      type: Array,
    },
    timestamp: {
      type: String,
      computed: '_getFormattedTimestamp(team)',
    },
    memberToDelete: {
      type: String,
      value: null,
    },
    isLoading: {
      type: Boolean,
      computed: '_computeIsloading(team)',
      value: true,
    },
    teamIsOwners: {
      type: Boolean,
      computed: '_computeIsOwners(team)',
    },
    rbac: {
      type: Boolean,
      value: false,
    },
    billing: {
      type: Boolean,
      value: false,
    },
    itemArray: {
      type: Array,
    },
    email: {
      type: String,
    },
    docs: {
      type: Boolean,
      value: false,
    },
  },

  observers: ['_change(team)'],

  listeners: {
    confirmation: '_deleteResponse',
    edit: '_editTeam',
    invite: '_addMember',
  },

  ready() {
    const wh = window.innerHeight;
    this.vpHeight = `height:${wh}px; overflow: auto;`;
  },

  _displayUser(id) {
    return this.model && id && this.model.members && this.model.members[id]
      ? this.model.members[id].name ||
          this.model.members[id].email ||
          this.model.members[id].username
      : '';
  },

  _change(item) {
    if (item) this.set('itemArray', [this.team]);
  },

  _getFormattedTimestamp(team) {
    if (this.team) {
      console.log('team.created_at', team.created_at);
      const timestamp = parseInt(team.created_at, 10);
      return Date(timestamp).toLocaleString('en-US', {
        timeZoneName: 'short',
      });
      // return moment(timestamp).isValid() ? moment.utc(timestamp).local().format("MMMM D YYYY HH:mm:ss") : "";
    }
    return null;
  },

  _hasOnlyYou(team) {
    if (
      team &&
      team.members &&
      team.members.length === 1 &&
      (team.members[0].email === this.model.user.email ||
        team.members[0].username === this.model.user.username)
    ) {
      return true;
    }
    return false;
  },

  _hasOtherMembers(team) {
    if (team && team.members && !this._hasOnlyYou && team.members.length > 0) {
      return true;
    }
    return false;
  },

  _hasMembers(team) {
    console.log('_hasMembers', team);
    return !!(team && team.members && team.members.length > 0);
  },
  /* eslint-disable no-param-reassign */
  _computeMembers(team, teamMembers, members) {
    const pendingMembers = [];
    const confirmedMembers = [];
    teamMembers = [];
    if (team && team.members && teamMembers && members) {
      // TODO: teamMembers calculate
      team.members.forEach(member => {
        if (members.base[member] && members.base[member].pending) {
          pendingMembers.push(members.base[member]);
        } else {
          confirmedMembers.push(members.base[member]);
        }
        console.log(members.base[member]);
        teamMembers.push(members.base[member]);
      });
    }

    if (pendingMembers && pendingMembers.length > 0) {
      this.set('hasPending', true);
    } else {
      this.set('hasPending', false);
    }

    if (teamMembers && teamMembers.length > 0) {
      this.set('hasMembers', true);
    } else {
      this.set('hasMembers', false);
    }
    if (teamMembers && pendingMembers) {
      this.set(
        'confirmedMembersLength',
        teamMembers.length - pendingMembers.length
      );
      this.set('pendingMembers', pendingMembers);
    }
    return teamMembers;
  },
  /* eslint-enable no-param-reassign */
  _addMember(e) {
    e.stopImmediatePropagation();
    this.dispatchEvent(
      new CustomEvent('go-to', {
        bubbles: true,
        composed: true,
        detail: {
          url: `/teams/${this.team.id}/+add`,
        },
      })
    );
  },

  _deleteTeam() {
    this._showDialog({
      title: 'Delete Team?',
      body: `Deleting teams cannot be undone. You are about to delete team: ${this.team.name}`,
      danger: true,
      reason: 'team.delete',
    });
  },

  _deleteResponse(e) {
    const { reason } = e.detail;
    const { response } = e.detail;

    if (response === 'confirm' && reason === 'team.delete') {
      this.$.teamDeleteAjaxRequest.body = {};
      this.$.teamDeleteAjaxRequest.headers['Content-Type'] = 'application/json';
      this.$.teamDeleteAjaxRequest.headers['Csrf-Token'] = CSRFToken.value;
      this.$.teamDeleteAjaxRequest.generateRequest();
    }
    if (response === 'confirm' && reason === 'member.delete') {
      this.$.deleteMember.body = {};
      this.$.deleteMember.headers['Content-Type'] = 'application/json';
      this.$.deleteMember.headers['Csrf-Token'] = CSRFToken.value;
      this.$.deleteMember.generateRequest();
    }
  },

  _handleTeamDeleteAjaxResponse() {
    this.dispatchEvent(
      new CustomEvent('go-to', {
        bubbles: true,
        composed: true,
        detail: {
          url: '/teams',
        },
      })
    );
  },

  _handleDeleteAjaxError(e) {
    this.dispatchEvent(
      new CustomEvent('toast', {
        bubbles: true,
        composed: true,
        detail: {
          msg: e.detail.error.message,
          duration: 3000,
        },
      })
    );
  },

  _deleteMemberFromTeam(e) {
    const membId = e.target.attributes.memberid.value;
    const membname = e.target.attributes.membername.value;
    this.set('memberToDelete', membId);
    this._showDialog({
      title: 'Delete member from team?',
      body: `Member ${membname} will no longer view or edit ${this.team.name}'s resources. You can always reinvite people in team.`,
      danger: true,
      reason: 'member.delete',
    });
  },

  _deleteMemberResponse() {
    this.set('memberToDelete', null);
    this.dispatchEvent(
      new CustomEvent('toast', {
        bubbles: true,
        composed: true,
        detail: {
          msg: 'Member deleted succesfully',
          duration: 3000,
        },
      })
    );
  },

  _resendMemberInvitation(e) {
    console.log(e, e.model);
    const { email } = e.model.item; // || e.target.parentNode['dataEmail'];
    this.$._resendInvitation.body = {
      emails: email,
    };
    this.$._resendInvitation.headers['Content-Type'] = 'application/json';
    this.$._resendInvitation.headers['Csrf-Token'] = CSRFToken.value;
    this.$._resendInvitation.generateRequest();
  },

  _handleResendResponse(e) {
    console.log(e);
    this.dispatchEvent(
      new CustomEvent('toast', {
        bubbles: true,
        composed: true,
        detail: {
          msg: 'Invitation resent succesfully',
          duration: 3000,
        },
      })
    );
  },

  _handleResendError(e) {
    console.log(e);
    this.dispatchEvent(
      new CustomEvent('toast', {
        bubbles: true,
        composed: true,
        detail: {
          msg: e.detail.error.message,
          duration: 3000,
        },
      })
    );
  },

  _showDialog(info) {
    const dialog = this.shadowRoot.querySelector('dialog-element');
    Object.keys(info || {}).forEach(i => {
      dialog[i] = info[i];
    });
    dialog._openDialog();
  },

  _computeIsloading() {
    return !this.team;
  },

  _computeIsOwners() {
    if (this.team) return this.team.name === 'Owners';
    return false;
  },

  _showMessage(rbac, billing) {
    if (this.team) return !rbac && !billing;
    return false;
  },

  isEqual(a, b) {
    return a === b;
  },
});
