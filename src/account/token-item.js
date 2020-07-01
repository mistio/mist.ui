import '../../../../@polymer/paper-item/paper-item.js';
import '../../../../@polymer/paper-spinner/paper-spinner.js';
import '../element-for-in/element-for-in.js';
import { Polymer } from '../../../../@polymer/polymer/lib/legacy/polymer-fn.js';
import { html } from '../../../../@polymer/polymer/lib/utils/html-tag.js';
Polymer({
  _template: html`
        <style include="shared-styles">
            :host {
                width: 100%;
            }

            paper-card {
                display: block;
            }

            .plan-action {
                color: var(--green-color);
            }

            .plan-end .plan-action {
                color: var(--red-color);
            }

            .flex-horizontal-with-ratios {
                @apply --layout-horizontal;
            }

            .flexchild {
                @apply --layout-flex;
            }
            paper-item.plan-end {
                border-bottom-width: 2px;
                border-color: #ccc;
            }
            h6.absolute-date {
                display: inline;
                opacity: 0.32;
            }
            #moreinfo {
                height: 0;
                transition: height 200ms ease-in;
            }
            #moreinfo[opened]{
                height: auto;
            }
            paper-item {
                align-items: baseline;
            }
            paper-button.red {
                padding: 4px !important;
            }
            element-for-in ::slotted(.info-item > div) {
                word-break: break-all;
            }
        </style>

        <paper-item class\$="info-item flex-horizontal-with-ratios plan-record [[zebraClasses]]">
            <div class="flexchild plan-title"><div class="name">[[token.name]]</div></div>
            <div class="flexchild plan-date text-left">[[token.last_accessed_at]] <h6 class="absolute-date">[[absoluteDateText]]</h6></div>
            <div class="flexchild plan-action text-right">
                <paper-button class="red" on-tap="revokeToken">Revoke</paper-button>
                <paper-spinner active="{{loading}}"></paper-spinner>
            </div>
            <paper-icon-button icon="icons:expand-more" on-tap="toggleInfo"></paper-icon-button>
        </paper-item>
        <div id="moreinfo">
            <element-for-in content="[[token]]"></element-for-in>
        </div>

        <iron-ajax id="revokeTokenAjax" method="DELETE" url="/api/v1/tokens" loading="{{loading}}" on-request="revokeTokenReQuest" on-response="revokeTokenResponse" on-error="revokeTokenError"></iron-ajax>
`,

  is: 'token-item',

  properties: {
      session: {
          type: Object
      },
      index: {
          type: Number
      },
      count: {
          type: Number
      },
      createdAt: {
          type: String,
          computed: '_computeDateFromNow(token.started_at)'
      },
      lastAccessed: {
          type: String,
          computed: '_computeDateFromNow(token.logs.0.time)'
      },
      absoluteDateText: {
          type: String,
          computed: '_computeAbsoluteDateText(token.started_at)'
      },
      zebraClasses: {
          type: String,
          computed: '_computeZebraClasses(index, count)'
      }
  },

  ready: function() {

  },

  _computeZebraClasses: function(index, count) {
      var classes = [];
      classes.push(
          (index + 1) % 2 == 0 ? 'even' : 'odd',
          index + 1 == count ? 'last' : null
      );
      return classes.join(' ');
  },

  _computeDateFromNow: function(time) {
      var date = new Date(time * 1000);
      return moment(time *1000).fromNow();

  },

  _computeAbsoluteDateText: function(time) {
      var date = new Date(time * 1000);
      return moment.utc(time).format("MMMM D YYYY");

  },

  toggleInfo: function(e){
      if (this.$.moreinfo.hasAttribute("opened")) {
          this.$.moreinfo.removeAttribute("opened")
      }
      else {
          this.$.moreinfo.setAttribute("opened",true)
      }
  },

  revokeToken: function(e){
      var payload = {
          id: this.token.id
      }
      this.$.revokeTokenAjax.headers["Content-Type"] = 'application/json';
      this.$.revokeTokenAjax.headers["Csrf-Token"] = CSRF_TOKEN;
      this.$.revokeTokenAjax.body = payload;
      this.$.revokeTokenAjax.generateRequest();
  },

  revokeTokenRequest: function(e){
      this.$.spinner.setAttribute('active', true);
  },

  revokeTokenResponse: function(e){
      this.dispatchEvent(new CustomEvent('token-revoked', { bubbles: true, composed: true }));
  },

  revokeTokenError: function(e){
      this.dispatchEvent(new CustomEvent('token-revoking-error', { bubbles: true, composed: true, detail: {'event': e} }));

  }
});
