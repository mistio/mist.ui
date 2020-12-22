import '@polymer/paper-item/paper-item.js';
import '@polymer/paper-spinner/paper-spinner.js';
import '../element-for-in/element-for-in.js';
import { Polymer } from '@polymer/polymer/lib/legacy/polymer-fn.js';
import { html } from '@polymer/polymer/lib/utils/html-tag.js';
import moment from 'moment/src/moment';

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
      .plan-action paper-spinner {
        position: absolute;
        margin-top: 2px;
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
      #moreinfo {
        height: 0;
        transition: height 200ms ease-in;
      }
      #moreinfo[opened] {
        height: auto;
      }
      paper-item {
        align-items: baseline;
      }
      paper-button.red {
        padding: 4px !important;
        margin: 0 0.29em 0 0 !important;
      }
      element-for-in ::slotted(.info-item > div) {
        word-break: break-all;
      }
    </style>

    <paper-item
      class$="info-item flex-horizontal-with-ratios plan-record [[zebraClasses]]"
    >
      <div class="flexchild plan-title">
        <div class="name">[[token.name]]</div>
      </div>
      <div class="flexchild plan-date text-left">
        [[token.last_accessed_at]]
      </div>
      <div class="flexchild plan-action text-left">
        <paper-button disabled="[[loading]]" class="red" on-tap="revokeToken"
          >Revoke</paper-button
        >
        <paper-spinner active="[[loading]]"></paper-spinner>
      </div>
      <paper-icon-button
        icon="icons:expand-more"
        on-tap="toggleInfo"
      ></paper-icon-button>
    </paper-item>
    <div id="moreinfo">
      <element-for-in content="[[token]]"></element-for-in>
    </div>

    <iron-ajax
      id="revokeTokenAjax"
      method="DELETE"
      url="/api/v1/tokens"
      loading="{{loading}}"
      on-response="revokeTokenResponse"
      on-error="revokeTokenError"
    ></iron-ajax>
  `,

  is: 'token-item',

  properties: {
    session: {
      type: Object,
    },
    index: {
      type: Number,
    },
    count: {
      type: Number,
    },
    createdAt: {
      type: String,
      computed: '_computeDateFromNow(token.started_at)',
    },
    lastAccessed: {
      type: String,
      computed: '_computeDateFromNow(token.logs.0.time)',
    },
    zebraClasses: {
      type: String,
      computed: '_computeZebraClasses(index, count)',
    },
    csrfToken: {
      type: String,
    },
  },

  ready() {},

  _computeZebraClasses(index, count) {
    const classes = [];
    classes.push(
      (index + 1) % 2 === 0 ? 'even' : 'odd',
      index + 1 === count ? 'last' : null
    );
    return classes.join(' ');
  },

  _computeDateFromNow(time) {
    return moment(time * 1000).fromNow();
  },

  toggleInfo() {
    if (this.$.moreinfo.hasAttribute('opened')) {
      this.$.moreinfo.removeAttribute('opened');
    } else {
      this.$.moreinfo.setAttribute('opened', true);
    }
  },

  revokeToken() {
    const payload = {
      id: this.token.id,
    };
    this.$.revokeTokenAjax.headers['Content-Type'] = 'application/json';
    this.$.revokeTokenAjax.headers['Csrf-Token'] = this.csrfToken;
    this.$.revokeTokenAjax.body = payload;
    this.$.revokeTokenAjax.generateRequest();
  },

  revokeTokenResponse() {
    this.dispatchEvent(
      new CustomEvent('token-revoked', { bubbles: true, composed: true })
    );
  },

  revokeTokenError(e) {
    this.dispatchEvent(
      new CustomEvent('token-revoking-error', {
        bubbles: true,
        composed: true,
        detail: { event: e },
      })
    );
  },
});
