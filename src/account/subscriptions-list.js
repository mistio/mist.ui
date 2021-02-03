import '@polymer/paper-card/paper-card.js';
import './subscription-item.js';
import { Polymer } from '@polymer/polymer/lib/legacy/polymer-fn.js';
import { html } from '@polymer/polymer/lib/utils/html-tag.js';

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
          <h2 class="title">Subscription History</h2>
        </div>
      </div>
      <div class="card-content">
        <div class="info-list">
          <div class="info-head flex-horizontal-with-ratios">
            <div class="flexchild">Date</div>
            <div class="flexchild text-center">Plan</div>
            <div class="flexchild text-right">Action</div>
          </div>
          <div class="info-body">
            <template
              is="dom-repeat"
              items="{{org.subscription_history}}"
              as="subscription"
            >
              <div class="row">
                <subscription-item
                  subscription="[[subscription]]"
                  index="[[index]]"
                  count="[[subscriptions.length]]"
                ></subscription-item>
              </div>
            </template>
          </div>
        </div>
      </div>
    </paper-card>
  `,

  is: 'subscriptions-list',

  properties: {
    org: {
      type: Object,
    },
  },
});
