import '@polymer/polymer/polymer-legacy.js';
import '@polymer/paper-button/paper-button.js';
import '@polymer/paper-progress/paper-progress.js';
import '@polymer/paper-styles/typography.js';
import '../app-form/app-form.js';
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
        position: absolute;
        bottom: 85px;
        width: 100%;
        left: 0;
        right: 0;
      }

      :host > ::slotted(paper-input-container) {
        padding-top: 16px;
        padding-bottom: 16px;
      }
      .single-head {
        @apply --team-page-head-mixin;
      }
    </style>
    <div id="content">
      <paper-material class="single-head layout horizontal">
        <span class="icon"
          ><iron-icon icon="[[section.icon]]"></iron-icon
        ></span>
        <div class="title flex">
          <h2>Add Members in [[team.name]]</h2>
          <div class="subtitle">
            You can send multiple invitations in one go.
          </div>
        </div>
      </paper-material>
      <paper-material>
        <app-form
          fields="[[fields]]"
          url="/api/v1/org/[[model.org.id]]/teams/[[team.id]]/members"
          method="POST"
          on-request="_addMembersRequest"
          on-response="_addMembersResponse"
        ></app-form>
      </paper-material>
    </div>
  `,

  is: 'members-add',

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
    team: {
      type: Object,
      computed: '_computeTeam(params, model.teamsArray.*)',
    },
    fields: {
      type: Array,
      value: [
        {
          name: 'emails',
          label: 'Emails *',
          type: 'textarea',
          value: '',
          helptext:
            "Fill in the members' emails you want to invite, one per line",
          defaultValue: '',
          placeholder: '',
          errorMessage: 'Please enter the users emails',
          show: true,
          required: true,
        },
      ],
    },
  },

  listeners: {},

  ready() {},

  _computeTeam(params, _teamsArray) {
    if (params) {
      const team = this.model.teamsArray.find(t => {
        return t.id === params.team;
      });
      if (team) {
        return team;
      }
      return {
        name: 'team not found',
      };
    }
    return null;
  },

  _addMembersRequest() {
    this.set('sendingData', true);
  },

  _addMembersResponse(_e) {
    this.dispatchEvent(
      new CustomEvent('go-to', {
        bubbles: true,
        composed: true,
        detail: { url: `/teams/${this.team.id}` },
      })
    );

    this.set('sendingData', false);
  },
});
