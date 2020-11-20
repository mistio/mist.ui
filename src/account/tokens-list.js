import '../../node_modules/@polymer/paper-card/paper-card.js';
import '../../node_modules/@polymer/paper-dropdown-menu/paper-dropdown-menu.js';
import '../../node_modules/@polymer/paper-spinner/paper-spinner.js';
import '../../node_modules/@vaadin/vaadin-dialog/vaadin-dialog.js';
import '../../node_modules/@polymer/paper-listbox/paper-listbox.js';
import './token-item.js';
import { Polymer } from '../../node_modules/@polymer/polymer/lib/legacy/polymer-fn.js';
import { html } from '../../node_modules/@polymer/polymer/lib/utils/html-tag.js';
import { CSRFToken } from '../helpers/utils.js';

Polymer({
  _template: html`
    <style include="shared-styles dialogs forms lists">
      paper-material {
        display: block;
      }

      .card-content {
        padding: 16px;
      }

      .flex-horizontal-with-ratios {
        @apply --layout-horizontal;
      }

      .flexchild {
        @apply --layout-flex;
        display: flex;
      }
      .info-head {
        padding: 8px 16px;
        background: var(--base-background-color);
        border-bottom: 2px solid #ddd;
      }
      .info-head .flexchild:nth-child(3) {
        margin-right: 40px;
      }
      .grid-row {
        padding: 24px 24px 0 24px;
      }

      h2.title {
        font-weight: 500;
      }
      .info-list {
        margin-bottom: 16px;
      }
      .create-token {
        margin-top: 16px;
      }
      #createTokenDialog {
        padding-bottom: 16px;
      }
      #createTokenDialog > * {
        max-width: 100%;
        box-sizing: border-box;
        margin-top: 0;
      }
      #createTokenDialog > *:first-child {
        margin-top: 24px;
      }
      .buttons {
        margin: 24px 0 0 0;
        display: flex;
        justify-content: flex-end;
      }
      .bottom-actions {
        text-align: right;
        width: 100%;
      }
      .error {
        color: var(--red-color);
      }
    </style>
    <paper-material elevation="1">
      <div class="grid-row">
        <div class="xs12 head">
          <h2 class="title">API Tokens</h2>
        </div>
      </div>
      <div class="card-content">
        <div class="info-list">
          <div class="info-head flex-horizontal-with-ratios">
            <div class="flexchild">Name</div>
            <div class="flexchild text-left">Last Accessed</div>
            <div class="flexchild text-left">Action</div>
          </div>
          <div class="info-body" id="tokens-list">
            <template is="dom-repeat" items="[[tokens]]" as="token">
              <div class="row">
                <token-item
                  token="[[token]]"
                  index="[[index]]"
                  count="[[tokens.length]]"
                  csrf-token="[[user.csrf_token]]"
                ></token-item>
              </div>
            </template>
          </div>
        </div>
        <div id="error" class="error" hidden$="[[!hasError]]"></div>
        <paper-button
          on-tap="createToken"
          id="Create API Token"
          class="blue create-token"
          >Create API Token</paper-button
        >
        <paper-spinner active="{{loading}}"></paper-spinner>
        <vaadin-dialog
          id="createTokenDialog"
          theme="mist-dialog"
          with-backdrop=""
        >
          <template>
            <h2>Create API Token</h2>
            <paper-input
              id="tokenName"
              value="{{newToken.name::input}}"
              label="Token Name"
            ></paper-input>
            <paper-dropdown-menu id="tokenExpires" label="Expires After">
              <paper-listbox
                slot="dropdown-content"
                attr-for-selected="value"
                selected="{{newToken.ttl}}"
                class="dropdown-content"
              >
                <paper-item value="0">Never</paper-item>
                <paper-item value="86400">1 Day</paper-item>
                <paper-item value="604800">1 Week</paper-item>
                <paper-item value="2592000">1 Month</paper-item>
                <paper-item value="31104000">1 Year</paper-item>
              </paper-listbox>
            </paper-dropdown-menu>
            <paper-dropdown-menu label="Context">
              <paper-listbox
                slot="dropdown-content"
                id="tokenContexts"
                class="dropdown-content"
              >
                <template is="dom-repeat" items="[[user.orgs]]" as="org">
                  <paper-item value="[[org.id]]">[[org.name]]</paper-item>
                </template>
              </paper-listbox>
            </paper-dropdown-menu>
            <paper-input
              id="pass"
              value="{{newToken.password::input}}"
              label="Password *"
              type="password"
            ></paper-input>
            <p>* Password is required to create a token</p>
            <div class="bottom-actions">
              <paper-button dismiss-dialog="" on-tap="_dismissCreateTokenDialog"
                >Cancel</paper-button>
              <paper-button
                id="Create"
                autofocus=""
                on-tap="createTokenSubmit"
                class="blue"
                disabled="[[!formReady]]"
                >Create
              </paper-button>
            </div>
          </template>
        </vaadin-dialog>
      </div>
    </paper-material>
    <vaadin-dialog id="copyToken" theme="mist-dialog" with-backdrop="">
      <template>
        <h2>Copy your Token</h2>
        <p>
          Grab your token below. This will be the last time that it will be
          visible to anybody.
        </p>
        <paper-textarea id="tokenValue" value="[[tokenValue]]"></paper-textarea>
        <div class="bottom-actions">
          <paper-button class="blue" dialog-dismiss="" on-tap="copied"
            >OK</paper-button
          >
        </div>
      </template>
    </vaadin-dialog>
    <iron-ajax
      id="getTokensAjax"
      method="GET"
      url="/api/v1/tokens"
      auto=""
      on-response="getTokens"
      on-error="getTokensError"
      handle-as="json"
    ></iron-ajax>
    <iron-ajax
      id="createTokenAjax"
      method="POST"
      url="/api/v1/tokens"
      loading="{{loading}}"
      on-request="createTokenRequest"
      on-response="createTokenResponse"
      on-error="createTokenError"
      handle-as="xml"
    ></iron-ajax>
  `,

  is: 'tokens-list',

  behaviors: [
  ],

  properties: {
    user: {
      type: Object,
    },
    org: {
      type: Object,
    },
    tokens: {
      type: Array,
    },
    newToken: {
      type: Object,
      value() {
        return {
          name: '',
          ttl: '',
          password: '',
          org_id: '',
          email: '',
        };
      },
    },
    hasError: {
      type: Boolean,
      value: false,
    },
    tokenValue: {
      type: String,
    },
  },

  listeners: {
    input: 'hideErrors',
    'token-revoked': 'getTokensAgain',
    'token-revoking-error': 'showError',
  },

  observers: ['_orgUserChanged(org, user)'],

  createToken() {
    this.$.createTokenDialog.opened = true;
  },

  _dismissCreateTokenDialog() {
    this.$.createTokenDialog.opened = false;
  },

  createTokenSubmit() {
    const payload = this.newToken;
    this.$.createTokenAjax.headers['Content-Type'] = 'application/json';
    this.$.createTokenAjax.headers['Csrf-Token'] = CSRFToken.value;
    this.$.createTokenAjax.body = payload;
    this.$.createTokenAjax.generateRequest();
  },

  createTokenResponse(e) {
    this.$.createTokenDialog.opened = false;
    const res = JSON.parse(e.detail.xhr.response);
    this.set('tokenValue', res.token);
    this.getTokensAgain(e);
    this.$.copyToken.opened = true;
  },

  createTokenError(e) {
    this.set('hasError', true);
    this.$.error.textContent = e.detail.request.xhr.responseText;
    this.$.createTokenDialog.opened = false;
    this.reset();
  },

  getTokens(e) {
    this.set('tokens', e.detail.response);
  },

  getTokensError(e) {
    this.set('hasError', true);
    this.$.error.textContent = e.detail.error;
    this.$.createTokenDialog.opened = false;
  },

  getTokensAgain() {
    const that = this;
    this.async(function () {
      that.$.getTokensAjax.generateRequest();
    }, 100);
  },

  reset() {
    this.set('newToken.name', '');
    this.set('newToken.ttl', '');
    this.set('newToken.password', '');
    this.set('tokenValue', '');
  },

  copied() {
    this.$.copyToken.opened = false;
    this.reset();
  },

  showError(e) {
    this.set('hasError', true);
    const { error } = e.detail.event.detail;
    this.$.error.textContent = error;
    this.$.createTokenDialog.opened = false;
    // needed due to https://github.com/vaadin/vaadin-overlay/issues/49
    // document.querySelectorAll('vaadin-dialog-overlay').forEach(function(el){el.opened = false;})
  },

  hideErrors() {
    this.set('hasError', false);
  },

  _orgUserChanged(org, user) {
    if (org) {
      this.set('newToken.org_id', this.org.id);
    }
    if (user) {
      if (this.user.email) {
        this.set('newToken.email', this.user.email);
      } else {
        this.dispatchEvent(
          new CustomEvent('toast', {
            bubbles: true,
            composed: true,
            detail: {
              msg: 'You cannot create a token as an LDAP user',
              duration: 5000,
            },
          })
        );
      }
      // else if (this.user.username)
      //     this.set('newToken.username', this.user.username);
    }
    this.set('newToken.session.id', '');
  },
});
