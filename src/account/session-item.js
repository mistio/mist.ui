import '@polymer/paper-item/paper-item.js';
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
      element-for-in {
        font-size: 0.9em;
        opacity: 0.54;
      }
      element-for-in::slotted(.flexchild) {
        padding: 8px 16px;
      }
      element-for-in ::slotted(.info-item > div) {
        word-break: break-all;
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
      }
      paper-spinner {
        vertical-align: middle;
      }
    </style>

    <paper-item
      class$="info-item flex-horizontal-with-ratios plan-record [[zebraClasses]]"
    >
      <div class="flexchild plan-date">
        <span class="name">[[createdAt]]</span>
        <h6 class="absolute-date">[[absoluteDateText]]</h6>
      </div>
      <div class="flexchild plan-title text-left">[[lastAccessed]]</div>
      <div
        class="flexchild plan-action text-right"
        hidden$="[[!session.active]]"
      >
        Current Session
      </div>
      <div
        class="flexchild plan-action text-right"
        hidden$="[[session.active]]"
      >
        <paper-button class="red" on-tap="terminateSession"
          >Terminate</paper-button
        >
        <paper-spinner active="{{loading}}"></paper-spinner>
      </div>
      <paper-icon-button
        icon="icons:expand-more"
        on-tap="toggleInfo"
      ></paper-icon-button>
    </paper-item>
    <div id="moreinfo">
      <element-for-in content="[[session]]"></element-for-in>
    </div>

    <iron-ajax
      id="terminateSessionAjax"
      method="DELETE"
      url="/api/v1/sessions"
      on-response="terminatedSessionResponse"
      on-error="terminateSessionError"
      handle-as="json"
    ></iron-ajax>
  `,

  is: 'session-item',

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
      computed: '_computeDateFromNow(session.created_at)',
    },
    lastAccessed: {
      type: String,
      computed: '_computeDateFromNow(session.last_accessed_at)',
    },
    absoluteDateText: {
      type: String,
      computed: '_computeAbsoluteDateText(session.created_at)',
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
    return moment.utc(time).fromNow();
  },

  _computeAbsoluteDateText(time) {
    return moment.utc(time).format('MMMM D YYYY');
  },

  toggleInfo() {
    if (this.$.moreinfo.hasAttribute('opened')) {
      this.$.moreinfo.removeAttribute('opened');
    } else {
      this.$.moreinfo.setAttribute('opened', true);
    }
  },

  terminateSession() {
    const payload = {
      id: this.session.id,
    };
    this.$.terminateSessionAjax.headers['Content-Type'] = 'application/json';
    this.$.terminateSessionAjax.headers['Csrf-Token'] = this.csrfToken;
    this.$.terminateSessionAjax.body = payload;
    this.$.terminateSessionAjax.generateRequest();
  },

  terminatedSessionResponse() {
    this.dispatchEvent(
      new CustomEvent('session-terminated', { bubbles: true, composed: true })
    );
  },

  terminateSessionError(e) {
    this.dispatchEvent(
      new CustomEvent('terminating-session-error', {
        bubbles: true,
        composed: true,
        detail: { event: e },
      })
    );
  },
});
