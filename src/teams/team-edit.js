import '@polymer/polymer/polymer-legacy.js';
import '@polymer/paper-styles/typography.js';
import '@vaadin/vaadin-dialog/vaadin-dialog.js';
import '@polymer/paper-toggle-button/paper-toggle-button.js';
import '@polymer/neon-animation/animations/scale-up-animation.js';
import '@polymer/neon-animation/animations/fade-out-animation.js';
import { CSRFToken } from '../helpers/utils.js';
import { Polymer } from '@polymer/polymer/lib/legacy/polymer-fn.js';
import { html } from '@polymer/polymer/lib/utils/html-tag.js';

Polymer({
  _template: html`
    <style include="shared-styles dialogs forms">
      :host {
      }

      paper-card {
        display: block;
      }

      paper-dialog {
        width: 300px;
      }

      .submit-btn {
        background-color: var(--mist-blue);
        color: #fff;
      }

      paper-toggle-button {
        display: block;
        float: left;
      }
    </style>
    <vaadin-dialog id="editTeamModal" theme="mist-dialog" with-backdrop=""
      >&gt;
      <template>
        <h2>Edit Team</h2>
        <div class="paper-dialog-scrollable">
          <p>
            <paper-input
              id="name"
              label="Name"
              required=""
              error-message="Please enter team's name"
              value="{{newTeam.name}}"
            ></paper-input>
            <paper-textarea
              id="description"
              label="Description (optional)"
              rows="3"
              max-rows="5"
              error-message="Please enter team's description"
              value="{{newTeam.description}}"
            ></paper-textarea>
          </p>
          <p>
            <paper-toggle-button
              id="visible"
              label="Visible"
              checked="{{newTeam.visible}}"
            ></paper-toggle-button>
            Visible to members not in the team.
          </p>
          <div class="clearfix btn-group">
            <paper-button
              class="blue-link"
              dialog-dismiss=""
              on-tap="_closeEditTeamModal"
              >Cancel</paper-button
            >
            <paper-button
              class="submit-btn btn-block"
              disabled$="[[!formReady]]"
              raised=""
              on-tap="_submitForm"
              >Submit</paper-button
            >
          </div>
        </div>
      </template>
    </vaadin-dialog>
    <iron-ajax
      id="teamEditAjaxRequest"
      url="/api/v1/org/[[org]]/teams/[[team.id]]"
      method="PUT"
      on-response="_handleTeamEditAjaxResponse"
      on-error="_handleTeamEditAjaxError"
    ></iron-ajax>
  `,

  is: 'team-edit',

  properties: {
    org: {
      type: String,
    },
    team: {
      type: Object,
    },
    newTeam: {
      type: Object,
      notify: true,
    },
    sendingData: {
      type: Boolean,
      value: false,
    },
    formReady: {
      type: Boolean,
      value: false,
    },
  },

  observers: [
    '_computeNewTeam(team)',
    '_computeFormReady(newTeam.name, newTeam.description, newTeam.visible, sendingData)',
  ],

  listeners: {
    'iron-overlay-closed': '_modalClosed',
  },

  _computeNewTeam(team) {
    if (team) {
      const newTeam = {
        name: this.team.name,
        description: this.team.description || '',
        visible: this.team.visible,
      };
      this.set('newTeam', newTeam);
    }
  },

  _computeFormReady(name, desc, visible, sendingData) {
    let formReady = true;
    if (
      !name ||
      !name.length ||
      (name === this.team.name &&
        desc === this.team.description &&
        visible === this.team.visible) ||
      sendingData
    ) {
      formReady = false;
    }
    this.set('formReady', formReady);
  },

  _openEditTeamModal() {
    this.$.editTeamModal.opened = true;
  },

  _closeEditTeamModal() {
    this.$.editTeamModal.opened = false;
  },

  _modalClosed() {
    this._formReset();
  },

  _submitForm() {
    this.$.teamEditAjaxRequest.headers['Content-Type'] = 'application/json';
    this.$.teamEditAjaxRequest.headers['Csrf-Token'] = CSRFToken.value;
    this.$.teamEditAjaxRequest.body = {
      new_name: this.newTeam.name,
      new_description: this.newTeam.description,
      new_visible: this.newTeam.visible,
    };
    this.$.teamEditAjaxRequest.generateRequest();

    this.set('sendingData', true);
  },

  _formReset() {
    const newTeam = {};
    Object.keys(this.team || {}).forEach(p => {
      if (typeof this.team[p] === 'string') {
        const initial = this.team[p];
        const str = initial.slice(0);
        newTeam[p] = str;
      }
      if (typeof this.team[p] === 'boolean') {
        newTeam[p] = !!this.team[p];
      }
    });
    this.set('newTeam', newTeam);
  },

  _handleTeamEditAjaxResponse() {
    this.set('sendingData', false);
    this._closeEditTeamModal();
  },
});
