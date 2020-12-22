import '../../node_modules/@polymer/paper-card/paper-card.js';
import './session-item.js';
import { Polymer } from '../../node_modules/@polymer/polymer/lib/legacy/polymer-fn.js';
import { html } from '../../node_modules/@polymer/polymer/lib/utils/html-tag.js';

Polymer({
  _template: html`
    <style include="shared-styles lists">
      :host {
      }

      paper-card {
        display: block;
      }

      .flex-horizontal-with-ratios {
        @apply --layout-horizontal;
      }

      .flexchild {
        @apply --layout-flex;
      }

      .info-head {
        padding: 8px 16px;
        background: #eee;
        border-bottom: 2px solid #ddd;
      }

      .grid-row {
        padding: 24px 24px 0 24px;
      }

      h2.title {
        font-weight: 500;
      }
    </style>
    <paper-card>
      <div class="grid-row">
        <div class="xs12 head">
          <h2 class="title">Active Sessions</h2>
        </div>
      </div>
      <div class="card-content">
        <div class="info-list">
          <div class="info-head flex-horizontal-with-ratios">
            <div class="flexchild">Created At</div>
            <div class="flexchild text-left">Last Accessed</div>
            <div class="flexchild text-right">&nbsp;</div>
          </div>
          <div class="info-body">
            <template is="dom-repeat" items="[[sessions]]" as="session">
              <div class="row">
                <session-item
                  session="[[session]]"
                  index="[[index]]"
                  count="[[sessions.length]]"
                  csrf-token="[[user.csrf_token]]"
                ></session-item>
              </div>
            </template>
          </div>
        </div>
      </div>
      <div id="error" class="error" hidden$="[[!hasError]]"></div>
    </paper-card>
    <iron-ajax
      id="getSessionsAjax"
      method="GET"
      url="/api/v1/sessions"
      auto=""
      on-response="getSessionsResponse"
      on-error="getSessionsError"
      handle-as="json"
    ></iron-ajax>
  `,

  is: 'sessions-list',

  properties: {
    user: {
      type: Object,
    },
    org: {
      type: Object,
    },
    sessions: {
      type: Array,
    },
    hasError: {
      type: Boolean,
      value: false,
    },
  },

  listeners: {
    'session-terminated': 'getSessionsAgain',
    'terminating-session-error': 'showError',
  },

  getSessionsResponse(e) {
    this.set('sessions', []);
    this.set('sessions', e.detail.response);
    this.set('hasError', true);
  },

  getSessionsError(e) {
    this.set('hasError', true);
    this.$.error.textContent = e.detail.error;
  },

  getSessionsAgain() {
    const that = this;
    this.async(() => {
      that.$.getSessionsAjax.generateRequest();
    }, 100);
  },

  showError(e) {
    this.set('hasError', true);
    console.log('showError', e);
    let error = e.detail.request.xhr.responseText;
    if (!error) error = e.detail.error;
    this.$.error.textContent = 'error';
  },
});
