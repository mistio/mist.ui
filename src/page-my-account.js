import '@polymer/app-route/app-route.js';
import '@polymer/paper-tabs/paper-tabs.js';
import '@polymer/iron-pages/iron-pages.js';
import '@polymer/paper-tooltip/paper-tooltip.js';
import './account/details-page.js';
import './account/password-page.js';
import './account/plans-list.js';
import './account/subscriptions-list.js';
import './account/sessions-list.js';
import './account/tokens-list.js';
import './account/whitelisted-ips.js';
import './account/notifications-settings.js';
import './account/metering-graphs.js';
import { html } from '@polymer/polymer/lib/utils/html-tag.js';
import { PolymerElement } from '@polymer/polymer/polymer-element.js';

/* eslint-disable class-methods-use-this */
export default class PageMyAccount extends PolymerElement {
  static get template() {
    return html`
      <style include="single-page shared-styles">
        #container {
          max-width: 600px;
        }

        paper-tabs {
          background-color: #d3d3d3;
          color: #000;
          --paper-tabs-selection-bar-color: #2196f3;
        }

        iron-pages > * ::slotted(paper-material) {
          padding: 0;
          display: block;
        }

        #content {
          max-width: 900px;
        }

        paper-tab {
          min-width: min-content;
        }
      </style>
      <app-route route="{{route}}" pattern="/:page" data="{{data}}"></app-route>
      <div id="content">
        <paper-tabs
          attr-for-selected="name"
          selected="{{data.page}}"
          scrollable
        >
          <paper-tab id="profile" name="profile" data-route="0"
            >Profile</paper-tab
          >
          <paper-tab id="password" name="password" data-route="1"
            >Password</paper-tab
          >
          <paper-tab
            id="billing"
            name="billing"
            data-route="2"
            hidden$="[[!_showBilling(org, config)]]"
            >Billing</paper-tab
          >
          <paper-tab id="sessions" name="sessions" data-route="3"
            >Active Sessions</paper-tab
          >
          <paper-tab id="tokens" name="tokens" data-route="4"
            >API Tokens</paper-tab
          >
          <paper-tab id="ips" name="ips" data-route="5"
            >Whitelisted IPs</paper-tab
          >
          <paper-tab
            id="subscriptions"
            name="subscriptions"
            data-route="6"
            hidden$="[[!org.is_owner]]"
            >Subscription History</paper-tab
          >
          <paper-tab id="notifications" name="notifications" data-route="7"
            >Notifications</paper-tab
          >
          <paper-tab id="metering" name="metering" data-route="8"
            >Metering</paper-tab
          >
        </paper-tabs>
        <iron-pages attr-for-selected="name" selected="{{data.page}}">
          <details-page
            config="[[config]]"
            name="profile"
            org="[[org]]"
            user="[[user]]"
            data-route="0"
          ></details-page>
          <password-page
            name="password"
            user="[[user]]"
            data-route="1"
          ></password-page>
          <plans-list
            name="billing"
            org="[[org]]"
            data-route="2"
            hidden$="[[!org.is_owner]]"
            email="[[config.email]]"
          ></plans-list>
          <sessions-list
            name="sessions"
            org="[[org]]"
            user="[[user]]"
            data-route="3"
          ></sessions-list>
          <tokens-list
            name="tokens"
            org="[[org]]"
            user="[[user]]"
            data-route="4"
          ></tokens-list>
          <whitelisted-ips
            name="ips"
            user="[[user]]"
            data-route="5"
          ></whitelisted-ips>
          <subscriptions-list
            name="subscriptions"
            org="[[org]]"
            data-route="6"
            hidden$="[[!org.is_owner]]"
          ></subscriptions-list>
          <notifications-settings
            name="notifications"
            machines="[[machines]]"
            data-route="7"
          ></notifications-settings>
          <metering-graphs
            name="metering"
            org="[[org]]"
            user="[[user]]"
            data-route="8"
            hidden$="[[!org.is_owner]]"
            email="[[config.email]]"
          ></metering-graphs>
        </iron-pages>
      </div>
    `;
  }

  static get is() {
    return 'page-my-account';
  }

  static get properties() {
    return {
      config: {
        type: Object,
      },
      user: {
        type: Object,
      },
      org: {
        type: Object,
      },
      machines: {
        type: Object,
      },
      tokens: {
        type: Array,
      },
      sessions: {
        type: Array,
      },
      location: {
        type: Object,
      },
      data: {
        type: Object,
        value() {
          return { page: 'profile' };
        },
      },
    };
  }

  _showBilling() {
    return this.org.is_owner && this.config.features.billing;
  }
}

customElements.define('page-my-account', PageMyAccount);
