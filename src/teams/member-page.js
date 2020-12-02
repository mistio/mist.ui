import '@polymer/paper-material/paper-material.js';
import '@polymer/paper-item/paper-item.js';
import '@polymer/paper-button/paper-button.js';
import '@polymer/paper-menu-button/paper-menu-button.js';
import '@polymer/paper-icon-button/paper-icon-button.js';
import '@polymer/iron-icon/iron-icon.js';
import '@polymer/iron-ajax/iron-ajax.js';
import '@mistio/mist-list/mist-list.js';
import '@polymer/paper-listbox/paper-listbox.js';
import '../helpers/dialog-element.js';
import { Polymer } from '@polymer/polymer/lib/legacy/polymer-fn.js';
import { html } from '@polymer/polymer/lib/utils/html-tag.js';
import { CSRFToken } from '../helpers/utils.js';
import { mistLogsBehavior } from '../helpers/mist-logs-behavior.js';
import { mistRulesBehavior } from '../helpers/mist-rules-behavior.js';

Polymer({
  _template: html`
        <style include="shared-styles lists single-page">
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
            @apply --layout-horizontal;
            align-content: stretch;
        }

        .flexchild {
            @apply --layout-flex;
        }

        a {
            color: black;
            text-decoration: none;
        }

        #container {
            background: #fafafa;
        }

        .paper-header [paper-drawer-toggle] {
            margin-left: 10px;
        }

        .paper-header {
            @apply --layout-horizontal;
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
            @apply --layout-flex;
            text-transform: capitalize;
        }

        .paper-header .toggleViewButton {
            --paper-icon-button-ink-color: transparent;
        }

        .paper-header .cartButton {
            margin-right: 10px;
        }

        #content {
            position: relative;
            overflow: visible;
            -webkit-overflow-scrolling: touch;
        }

        paper-icon-button {
            transition: all 200ms;
        }

        [size=xs]>* {
            display: none;
        }

        [size=xs] mist-sidebar {
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
            padding-bottom: 80px
        }

        .section {
            padding-top: 16px;
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
            background-color: #fff;
            border-bottom: 1px solid #ddd;
            margin-bottom: 0;
        }

        .title .up {
            text-transform: uppercase;
        }

        .width100 {
            width: 100%;
        }

        .team:after {
            position: relative;
            content: ", "
        }

        .team:last-of-type:after {
            position: relative;
            content: ""
        }

        .pending {
            font-weight: 500;
            font-size: 0.9em;
            background-color: #69b46c;
            color: #fff;
            padding: 2px 6px 4px 6px;
            border-radius: 3px;
        }

        paper-material.member-logs {
            padding: 0;
            overflow: visible;
        }

        mist-list {
            width: 100%;
            padding: 0;
            margin: 0;
            max-height: 700px;
            font-size: 75%;
            min-height: 500px;
            --row-height: 48px;
        }

        .single-head {
            @apply --member-page-head-mixin
        }
        </style>
        <div id="content">
            <paper-material class="single-head layout horizontal">
                <span class="icon"><iron-icon icon="account-circle"></iron-icon></span>
                <div class="title flex">
                    <h2>[[member.name]] [[member.username]]</h2>
                    <div class="subtitle">
                        <a class="regular" href\$="email:[[member.email]]" hidden\$="[[!member.email]]">
                            <iron-icon icon="icons:mail"></iron-icon> [[member.email]]</a>
                    </div>
                </div>
                <div class="item-actions">
                    <paper-menu-button horizontal-align="right">
                        <paper-icon-button icon="more-vert" class="dropdown-trigger" slot="dropdown-trigger"></paper-icon-button>
                        <paper-listbox id="machine_actions" class="dropdown-content" slot="dropdown-content">
                            <paper-button on-tap="_deleteMember" class="simple">Delete Member</paper-button>
                        </paper-listbox>
                    </paper-menu-button>
                </div>
            </paper-material>
            <paper-material>
                <div class="flex-horizontal-with-ratios">
                    <div class="page-block">
                        <h3 class="smallcaps">Short Info</h3>
                        <p>[[member.email]] <span class="pending" hidden\$="[[!member.pending]]">Pending</span></p>
                    </div>
                    <div class="page-block">
                        <h3 class="smallcaps">[[member.name]] is in teams:</h3>
                        <p>
                            <span hidden\$="[[memberTeams]]">No teams</span>
                            <template is="dom-repeat" items="[[memberTeams]]">
                                <span class="team"><a class="regular blue-link" href\$="/teams/[[item.id]]">[[item.name]]</a></span>
                            </template>
                        </p>
                    </div>
                </div>
            </paper-material>
            <br>
            <paper-material class="no-pad">
                <mist-rules id="memberRules" resource-type="member" incidents="[[model.incidentsArray]]" rules="[[_rulesApplyOnResource(model.rules, member, member.tags.*, 'member')]]" teams="[[model.teamsArray]]" users="[[model.membersArray]]" resource="[[member]]" model="[[model]]" collapsible=""></mist-rules>
            </paper-material>
            <div class="page section">
                <div class="flex-horizontal-with-ratios section">
                    <div class="width100">
                        <paper-material class="member-logs">
                            <template is="dom-if" if="[[member.id]]" restamp="">
                                <mist-list timeseries="" expands="" column-menu="" resizable="" searchable="" streaming="" infinite="" toolbar="" rest="" id="memberLogs" apiurl="/api/v1/logs" name="user logs" frozen="[[_getFrozenLogColumn()]]" visible="[[_getVisibleColumns()]]" renderers="[[_getRenderers()]]" primary-field-name="time" base-filter="user_id:[[member.id]]"></mist-list>
                            </template>
                        </paper-material>
                    </div>
                </div>
            </div>
        </div>
        <dialog-element></dialog-element>
        <iron-ajax id="deleteMember" url="/api/v1/org/[[model.org.id]]/teams/[[teamId]]/members/[[member.id]]" method="DELETE" on-response="_deleteMemberResponseAjax" on-error="_deleteMemberError"></iron-ajax>
`,

  is: 'member-page',

  behaviors: [
      mistLogsBehavior,
      mistRulesBehavior
  ],

  properties: {
      section: {
          type: Object
      },
      color: {
          type: String,
          computed: '_getHeaderStyle(section)'
      },
      params: {
          type: Object
      },
      model: {
          type: Object
      },
      member: {
          type: Object,
          computed: '_computeMember(params, model.membersArray.*)'
      },
      hasTeams: {
          type: Boolean,
          value: true
      },
      memberTeams: {
          type: Array,
          computed: '_computeTeams(member, model.teamsArray.*)'
      },
      teamId: {
          type: String,
      },
      resourceFilter: {
          type: Object,
          computed: '_computeResourceFilter(member)'
      }
  },

  listeners: {
      'confirmation': '_deleteMemberResponse',
      'updateSelectedMember': '_updateMember'
  },

  _computeMember(params, _members) {
      return this.model.membersArray.find((member) => {
          return params && member.id === params.member;
      }, this);
  },

  _computeTeams(_member, _teams) {
      if (this.member) {
          const memberTeams = this.model.teamsArray.filter((t) => {
              return t.members.indexOf(this.member.id) > -1;
          }, this);
          return memberTeams;
      }
      return [];
  },

  _computeResourceFilter(member) {
      if (!member) {
          return '';
      }
      return `user_id:${  member.id}`;
  },

  _addMemberToTeam(_e) {
      // page.show('/add-member-to-a-team/' + this.member.id);
  },

  _updateMember(e) {
      const {team} = e.detail;
      this.set('member.name', team.name);
      this.set('member.description', team.description);
  },

  _deleteMember(_e) {
      this._showDialog({
          title: `Delete ${  this.member.name  } ?`,
          body: "Deleting a member will also remove the member from all the teams they participate in",
          danger: true,
          reason: "delete_member"
      });
  },

  _deleteMemberResponse(e) {
      const {reason} = e.detail;
          const {response} = e.detail;

      if (response === 'confirm' && reason === "delete_member") {
          this.memberTeams.forEach((t) => {
              this.async(() => {
                  this.set('teamId', t.id);
                  this.deleteMemberRequest(t.id);
              }, 50, this)
          }, this);
      }
  },

  deleteMemberRequest(team) {
      console.log("TEAMS", team)
      this.$.deleteMember.body = {};
      this.$.deleteMember.headers["Content-Type"] = 'application/json';
      this.$.deleteMember.headers["Csrf-Token"] = CSRFToken.value;
      this.$.deleteMember.generateRequest();
  },

  _deleteMemberResponseAjax(_e) {
      // if user was in one single team return there, else in teams
      if (this.memberTeams && this.memberTeams.length === 1) {
          this.dispatchEvent(new CustomEvent('go-to', { bubbles: true, composed: true, detail: { url: `/teams/${  this.memberTeams[0].id}` } }));

      } else {
          this.dispatchEvent(new CustomEvent('go-to', { bubbles: true, composed: true, detail: { url: '/teams' } }));

      }
  },

  _showDialog(info) {
      const dialog = this.shadowRoot.querySelector('dialog-element');
      Object.keys(info || {}).forEach((i) => {
          dialog[i] = info[i];
      });
      dialog._openDialog();
  }
});
