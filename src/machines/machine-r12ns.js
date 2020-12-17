import '../../node_modules/@polymer/iron-icons/iron-icons.js';
import '../../node_modules/@polymer/paper-material/paper-material.js';
import '../../node_modules/@polymer/paper-button/paper-button.js';
import '../../node_modules/@polymer/paper-icon-button/paper-icon-button.js';
import '../../node_modules/@polymer/paper-item/paper-item.js';
import '../../node_modules/@polymer/paper-item/paper-item-body.js';
import '../../node_modules/@polymer/paper-badge/paper-badge.js';
import '../../node_modules/@polymer/iron-ajax/iron-ajax.js';
import { CSRFToken } from '../helpers/utils.js';
import { Polymer } from '../../node_modules/@polymer/polymer/lib/legacy/polymer-fn.js';
import { html } from '../../node_modules/@polymer/polymer/lib/utils/html-tag.js';

Polymer({
  _template: html`
    <style include="shared-styles tags-and-labels info-table-style single-page">
      div.r12n {
        margin: 8px;
        padding: 8px;
        border-top: 1px solid #ddd;
        display: flex;
      }

      div.r12n:first-of-type {
        border-top: none;
      }

      div.info-card {
        margin: 0;
      }

      div.card-content {
        padding: 8px;
      }

      paper-material {
        padding: 24px;
        box-sizing: border-box;
        width: 100%;
      }

      .r12n-icon {
        align-self: center;
        flex: none;
        padding: 8px 15px 8px 0;
      }

      .description {
        padding: 8px;
        display: flex;
        align-self: center;
      }

      .recommended .customize {
        margin-left: 10px;
      }

      .actions {
        display: flex;
        margin-top: -4px;
        flex-direction: column;
      }

      paper-button.apply {
        background-color: #2196f3;
        color: white;

        --paper-button-raised-keyboard-focus: {
          background-color: var(--paper-pink-a200) !important;
          color: white !important;
        }
      }

      paper-button.dismiss {
        background-color: #eee;
        color: #777;
      }

      paper-button {
        align-self: flex-start;
        padding: 8px;
        margin: 8px;
      }

      .machine-page-head {
        @apply --machine-page-head-mixin;
      }
    </style>
    <div class="info-card machine-page-head">
      <h2>Recommendations</h2>
    </div>
    <div class="card-content">
      <template is="dom-repeat" items="[[r12ns]]">
        <div class="r12n">
          <iron-icon
            class="r12n-icon"
            slot="item-icon"
            icon="[[_computeR12nIcon(item)]]"
          ></iron-icon>
          <div class="description">
            <span inner-h-t-m-l="[[item.html_body]]"></span>
            <div class="actions">
              <paper-button
                on-tap="_resizeTap"
                class="apply"
                hidden$="[[!canResize]]"
                raised=""
                >Resize</paper-button
              >
              <paper-button on-tap="_dismiss" class="dismiss"
                >Dismiss</paper-button
              >
            </div>
          </div>
        </div>
      </template>
    </div>
    <!--/template-->
    <iron-ajax
      id="requestDismiss"
      method="DELETE"
      handle-as="json"
      on-response="handleDismissResponse"
    >
    </iron-ajax>
  `,

  is: 'machine-r12ns',

  properties: {
    r12ns: {
      type: Array,
    },
    canResize: {
      type: Boolean,
    },
  },

  _computeR12nIcon(item) {
    if (
      item._cls === 'Notification.InAppNotification.InAppRecommendation' &&
      item.model_id === 'autoscale_v1'
    ) {
      if (item.model_output.direction === 'up') {
        return 'icons:arrow-upward';
      }
      if (item.model_output.direction === 'down') {
        return 'icons:arrow-downward';
      }
    }
    return null;
  },

  _resizeTap(_e) {
    const action = {
      name: 'resize',
      icon: 'device:signal-cellular-2-bar',
      confirm: true,
      multi: false,
    };
    this.dispatchEvent(
      new CustomEvent('select-action', {
        bubbles: true,
        composed: true,
        detail: { action },
      })
    );
    // TODO: dismiss notification on success?
    // TODO: resize to what?
  },

  _dismiss(e) {
    this.$.requestDismiss.url = `/api/v1/notifications/${e.model.item._id}`;
    this.$.requestDismiss.headers['Csrf-Token'] = CSRFToken.value;
    this.$.requestDismiss.generateRequest();
    e.stopPropagation();
  },

  handleDismissResponse(_event) {
    console.log('Machine R12ns: Received dismiss response');
  },
});
