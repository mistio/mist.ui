import '@polymer/polymer/polymer-legacy.js';
import '@polymer/paper-icon-button/paper-icon-button.js';
import '@polymer/paper-listbox/paper-listbox.js';
import '@polymer/iron-icons/iron-icons.js';
import '@polymer/iron-icons/social-icons.js';
import '@polymer/paper-item/paper-item.js';
import '@polymer/paper-menu-button/paper-menu-button.js';
import { Polymer } from '@polymer/polymer/lib/legacy/polymer-fn.js';
import { html } from '@polymer/polymer/lib/utils/html-tag.js';
import 'js-md5/src/md5.js';

Polymer({
  _template: html`
    <style include="shared-styles">
      :host {
        outline: none;
      }

      :host::slotted(iron-dropdown) {
        width: 300px !important;
      }

      :host paper-item {
        --paper-menu-focused-item {
          background-color: #fff;
        }
      }

      :host paper-item {
        border-bottom: 0 none;
        padding: 8px 16px;
        min-height: 36px;
      }

      :host paper-item:last-child,
      :host paper-item.noborder {
        border-bottom: 0 none;
      }

      :host paper-icon-button.gravatar {
        border-radius: 50%;
        box-shadow: rgb(0 0 0 / 12%) 0px 1px 3px, rgb(0 0 0 / 24%) 0px 1px 2px;
        overflow: hidden;
        outline: 0;
      }

      :host iron-icon {
        margin-right: 26px;
      }

      .add-org {
        opacity: 0.54;
        margin-top: 0;
        /*flex-flow: row-reverse wrap;*/
        border-top: 1px solid #ddd;
        cursor: pointer;
      }

      .add-org a {
        font-weight: 400;
      }

      :host .add-org iron-icon {
        /*margin-right: 0;*/
      }

      .grid-row {
        padding: 0;
        margin: 0;
        max-width: 270px;
      }

      a.grid-row {
        width: 100%;
      }

      paper-item {
        width: 100%;
      }

      paper-item:not(.context) {
        padding: 8px 16px 8px 24px;
        width: inherit;
      }

      paper-item {
        font-size: 14px;
        font-weight: 500;
        letter-spacing: 0.018em;
        line-height: 24px;
      }

      .context iron-icon {
        background-color: #f2f2f2;
        border-radius: 50%;
        margin-right: 22px;
      }

      iron-icon.user-menu-icon {
        padding: 4px;
        width: 30px;
        height: 30px;
        box-sizing: border-box;
      }

      .context .org-logo {
        line-height: 30px;
        float: right;
      }
      .context .org-name {
        line-height: 30px;
      }

      .current.context {
        border-bottom: 1px solid #ddd;
        color: rgba(0, 0, 0, 0.87);
        padding-top: 30px;
        padding-bottom: 30px;
        overflow: hidden;
      }

      .current iron-icon {
        width: 60px;
        height: 60px;
      }

      .current .org {
        align-self: center;
      }

      .active-org {
        color: green;
      }

      .teams {
        display: block;
        color: rgba(0, 0, 0, 0.54);
        font-weight: 400;
      }

      :host paper-icon-button {
        padding: 0;
      }

      h4 {
        background-color: none !important;
        padding: 0;
        margin: 0;
        font-weight: 500;
        font-size: 1.1em;
      }

      hr {
        margin: 0 !important;
        border: 1px solid #ddd !important;
      }

      paper-listbox {
        padding: 0;
        margin-top: 0;
      }

      .current-org-teams {
        color: rgba(0, 0, 0, 0.54);
        font-size: 0.8em;
      }

      .current-org-teams:after {
        position: relative;
        content: ', ';
      }

      .current-org-teams:last-of-type:after {
        content: ' ';
      }

      :host {
        position: relative;
      }

      .tip {
        border-color: transparent;
        border-bottom-color: #fff;
        border-style: dashed dashed solid;
        border-width: 0 11px 9px;
        position: absolute;
        left: 17px;
        top: 50px;
        z-index: 1;
        height: 0;
        width: 0;
        opacity: 1;
        transition: opacity 0.4s ease-in-out, top 0.3s ease-in-out;
      }

      .tip[closed] {
        opacity: 0;
        top: 80px;
        transition: opacity 0s ease-in-out, top 0s ease-in-out;
      }
    </style>
    <paper-menu-button
      horizontal-align="right"
      vertical-offset="56"
      opened="{{opened}}"
      no-animations=""
    >
      <paper-icon-button
        src="[[gravatar]]"
        class="gravatar dropdown-trigger"
        slot="dropdown-trigger"
      ></paper-icon-button>
      <div class="dropdown-content" slot="dropdown-content">
        <div class="grid-row current context">
          <div class="logo xs4">
            <iron-icon
              class="user-menu-icon"
              icon="social:group"
              hidden="[[_hasLogo(org)]]"
            ></iron-icon>
            <iron-icon
              class="user-menu-icon"
              src$="[[_computeLogo(org)]]"
              hidden="[[!_hasLogo(org)]]"
            ></iron-icon>
          </div>
          <div class="org xs8">
            <h4 style$="[[_computeOrganizationNameStyle(org.name)]]">
              [[_computeOrganizationName(org.name)]]
            </h4>
            <div>[[_computeUserName(user)]]</div>
            <template is="dom-repeat" items="{{teams}}">
              <span class="current-org-teams">[[item.name]]</span>
            </template>
          </div>
        </div>
        <paper-listbox>
          <template
            is="dom-repeat"
            items="{{orgsList}}"
            as="organization"
            restamp=""
          >
            <a
              href="javascript:void(0)"
              on-tap="_goToOrg"
              id="[[organization.id]]"
              class="grid-row"
              tabindex="1"
            >
              <paper-item
                class="context"
                hidden$="[[_isCurrentOrg(organization)]]"
              >
                <div class="org-logo">
                  <iron-icon
                    class="user-menu-icon"
                    icon="social:group"
                    hidden="[[_hasLogo(organization)]]"
                  ></iron-icon>
                  <iron-icon
                    class="user-menu-icon"
                    src$="[[_computeLogo(organization)]]"
                    hidden="[[!_hasLogo(organization)]]"
                  ></iron-icon>
                </div>
                <div class="org-name">
                  [[_computeOrganizationName(organization.name)]]
                </div>
              </paper-item>
            </a>
          </template>
          <!-- <a href="javascript:void(0)" > -->
          <paper-item class="noborder add-org" on-tap="_addOrg" tabindex="1">
            <iron-icon icon="icons:add-circle-outline"></iron-icon>Add
            Organization
          </paper-item>
          <!-- </a> -->
          <hr />
          <a href="[[supportUri]]" target="_blank" class="flex" tabindex="1">
            <paper-item hidden$="[[!supportUri.length]]">
              <iron-icon icon="question-answer"></iron-icon>Support
            </paper-item>
          </a>
          <a href="[[docsUri]]" target="_blank" class="flex">
            <paper-item hidden$="[[!docsUri.length]]">
              <iron-icon icon="description"></iron-icon>Docs
            </paper-item>
          </a>
          <a href="/my-account/profile" class="flex" id="Account" tabindex="1">
            <paper-item>
              <iron-icon icon="account-circle"></iron-icon>Account
            </paper-item>
          </a>
          <hr />
          <paper-item on-tap="_logout">
            <iron-icon icon="power-settings-new"></iron-icon> Logout
          </paper-item>
        </paper-listbox>
      </div>
    </paper-menu-button>
    <div class="tip" closed$="[[!opened]]"></div>
  `,

  is: 'app-user-menu',

  properties: {
    user: {
      type: Object,
    },
    org: {
      type: Object,
      value: {},
    },
    size: {
      type: Number,
      value() {
        return window.devicePixelRatio > 1.5 ? 80 : 40;
      },
    },
    teams: {
      type: Array,
    },
    placeholder: {
      type: String,
      value: 'https://mist.io/ui/assets/user.png',
    },
    gravatar: {
      type: String,
      computed: '_computeGravatar(user.email, size, placeholder)',
    },
    gravatarName: {
      type: String,
      computed:
        '_computeGravatarName(user.first_name, user.last_name, user.email, user.username)',
    },
    orgs: {
      type: Array,
    },
    orgsList: {
      type: Array,
      computed: '_computeOrganizationsList(user, org, user.orgs)',
    },
    opened: {
      type: Boolean,
      notify: true,
    },
    docsUri: {
      type: String,
      value: '',
    },
    supportUri: {
      type: String,
      value: '',
    },
  },

  _hasLogo(org) {
    if (org && org.avatar && org.avatar.length) {
      return true;
    }
    return false;
  },

  _computeLogo(org) {
    if (org && org.avatar && org.avatar.length)
      return `/api/v1/avatars/${org.avatar}`;
    return '';
  },

  _computeGravatar(email, size, placeholder) {
    let url = '';
    if (email) {
      const avatarString = email && md5(email); // eslint-disable-line no-undef
      url = `//www.gravatar.com/avatar/${avatarString}.jpg?s=${size}&d=${placeholder}`;
    } else {
      url = placeholder;
    }
    return url;
  },

  _computeGravatarName(firstName, lastName, email, username) {
    return firstName && lastName
      ? `${firstName} ${lastName}`
      : email || username;
  },

  _computeUserName(user) {
    let ret = '';
    if (user) {
      if (user.first_name) ret += `${user.first_name} `;
      if (user.last_name) ret += user.last_name;
      if (!ret.length) ret += user.email || user.username;
    }
    return ret;
  },

  _computeOrganizationsList(user, org) {
    if (!user || !user.orgs || !org) return [];

    return user.orgs
      .filter(o => {
        return o.name !== org.name;
      }, this)
      .sort((a, b) => {
        if (a.name > b.name) {
          return 1;
        }
        if (a.name < b.name) {
          return -1;
        }
        return 0;
      });
  },

  _computeOrganizationName(name) {
    return name && name.length ? name : '[ untitled org ]';
  },

  _computeOrganizationNameStyle(name) {
    return (!name && 'opacity: .5') || '';
  },

  _isCurrentOrg(organization) {
    return organization && this.org && organization.id === this.org.id;
  },

  _addOrg(_e) {
    this.dispatchEvent(
      new CustomEvent('add-org', {
        bubbles: true,
        composed: true,
        detail: null,
      })
    );
  },

  _goToOrg(e) {
    const orgId = e.currentTarget.getAttribute('id');
    window.location.href = orgId
      ? `/switch_context/${orgId}`
      : '/switch_context';
  },

  _logout(_e) {
    window.location.href = '/logout';
  },
});
