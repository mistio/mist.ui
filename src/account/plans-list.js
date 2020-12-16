import '../../node_modules/@polymer/polymer/polymer-legacy.js';
import '../../node_modules/@polymer/paper-styles/typography.js';
import '../../node_modules/@polymer/paper-material/paper-material.js';
import '../../node_modules/@polymer/paper-dialog/paper-dialog.js';
import '../../node_modules/@polymer/paper-icon-button/paper-icon-button.js';
import './balance-chart.js';
import './plan-item.js';
import './plan-purchase.js';
import moment from 'moment/src/moment.js';
import { Polymer } from '../../node_modules/@polymer/polymer/lib/legacy/polymer-fn.js';
import { html } from '../../node_modules/@polymer/polymer/lib/utils/html-tag.js';

Polymer({
  _template: html`
    <style include="shared-styles">
      :host {
      }

      :host paper-material {
        display: block;
        padding: 0;
      }

      .plans {
        padding-left: 8px;
        padding-right: 8px;
        /*@apply --layout-horizontal;
            @apply --layout-wrap;*/
        display: flex;
        flex-direction: row;
        flex-wrap: wrap;
      }

      .grid-row {
        padding: 24px;
      }

      .head {
        margin-bottom: 16px;
      }

      h2.title {
        font-weight: 500;
      }

      h2.title,
      h2.title ~ p {
        margin-top: 0;
        margin-bottom: 0;
      }

      h2.balance-title {
        margin-top: 16px;
        margin-bottom: 24px;
        line-height: 1.5em;
      }

      .add-card {
        cursor: pointer;
      }

      .rates {
        font-size: 0.9em;
      }

      .balance {
        font-size: 2em;
      }

      .balance sub,
      .balance sup {
        font-size: 0.6em;
        font-weight: 300;
      }

      .balance sub {
        vertical-align: baseline;
      }

      .navigator {
        display: flex;
      }

      .navigator paper-button {
        font-size: 0.9em;
        background-color: #eee !important;
        margin: 8px !important;
      }

      .navigator paper-button.active {
        color: var(--accent-color) !important;
      }

      p.secondary,
      .secondary {
        font-size: 0.9em;
        line-height: 1em;
        opacity: 0.54;
        font-weight: normal;
      }

      #paygRatesDialog {
        width: 350px;
      }
      #paygRatesDialog .btn-group {
        display: flex;
        flex-direction: row;
        justify-content: flex-end;
      }
      .info-icon {
        width: 32px;
        height: 32px;
        vertical-align: middle;
        opacity: 0.54;
      }

      balance-chart {
        margin-top: 20px;
      }

      @media (min-width: 767px) and (max-width: 800px) {
        ul {
          margin-left: 0;
          padding-left: 0;
          list-style: none;
        }
      }
    </style>
    <paper-material>
      <div class="grid-row">
        <div class="xs12 head">
          <h2 class="title">Your current billing status</h2>
        </div>
        <div class="plans xs12 s6 m6 l6">
          <plan-item
            plan="[[org.current_plan]]"
            current=""
            class="plan"
            email="[[email]]"
            has-card="[[hasCard]]"
            trial-days-left="[[org.trial_days_left]]"
          ></plan-item>
        </div>
        <div class="xs12 s6 m6 l6" hidden$="[[org.card]]">
          <p>
            For questions and other information contact us at
            <a href$="mailto:[[email.sales]]">[[email.sales]]</a>
          </p>
        </div>
        <template is="dom-if" if="[[org.card]]" restamp="">
          <div class="xs12 s6 m6 l6" hidden$="[[!org.card]]">
            <h2 class="title balance-title">
              Your Balance
              <span class="secondary" hidden$="[[!org.trial_days_left]]"
                ><br />You are in free trial until
                [[computeStartChargingDay(org.trial_days_left)]].</span
              >
            </h2>
            <div class="balance">
              <balance-chart plan="[[org.current_plan]]"></balance-chart>
            </div>
          </div>
        </template>
      </div>
      <div class="grid-row">
        <div class="xs12 head">
          <h2 class="title">Prepaid Plans</h2>
        </div>
        <div class="plans xs12">
          <template is="dom-if" if="[[org]]" restamp="">
            <template is="dom-repeat" items="[[plans]]" as="plan" restamp="">
              <plan-item
                plan="[[plan]]"
                class="plan"
                email="[[email]]"
                has-card="[[hasCard]]"
                trial-days-left="[[org.trial_days_left]]"
              ></plan-item>
            </template>
          </template>
        </div>
        <div class="text-center xs12">
          <p class="secondary">
            * Pay As You Go rates apply if limits are
            exceeded.<paper-icon-button
              icon="icons:help"
              class="info-icon"
              on-tap="openRates"
            ></paper-icon-button>
          </p>
        </div>
      </div>
    </paper-material>
    <paper-material>
      <div class="grid-row">
        <div class="xs12 head">
          <h2 class="title">Custom plan</h2>
          <p>
            Don't see a plan that meets your requirements?
            <a href$="mailto:[[email.sales]]">Contact sales.</a>
          </p>
        </div>
      </div>
    </paper-material>
    <paper-dialog id="paygRatesDialog" with-backdrop="">
      <h2>Pay As You Go Rates</h2>
      <paper-dialog-scrollable>
        <ul>
          <li>
            <strong><sup>$</sup>2/mo</strong> per <span id="vcpus">vCPUs</span>
          </li>
          <li>
            <strong><sup>$</sup>5/mo</strong> per 1M
            <span id="datapoints">datapoints/day</span>
          </li>
          <li>
            <strong><sup>$</sup>5/mo</strong> per 100k
            <span id="rulechecks">rule checks/day</span>
          </li>
          <li>
            <strong><sup>$</sup>5/mo</strong> per 1M
            <span id="apirequests">API requests/day</span>
          </li>
        </ul>
        <paper-tooltip for="vcpus" animation-delay="0" position="top"
          >Total sum of physical and virtual processor cores under
          management.</paper-tooltip
        >
        <paper-tooltip for="datapoints" animation-delay="0" position="top"
          >Incoming metric samples and log entries.</paper-tooltip
        >
        <paper-tooltip for="rulechecks" animation-delay="0" position="top"
          >Evaluations of conditions that trigger alerts or automated
          actions.</paper-tooltip
        >
        <paper-tooltip for="apirequests" animation-delay="0" position="top"
          >Invokations of the Mist.io API by any member of your
          organization.</paper-tooltip
        >
        <paper-tooltip for="retention" animation-delay="0" position="top"
          >Historic data within the retention window will be
          accesible.</paper-tooltip
        >
        <p>High watermark, pro-rated daily.</p>
      </paper-dialog-scrollable>
      <div class="btn-group">
        <paper-button class="blue-link" dialog-dismiss=""> Close</paper-button>
      </div>
    </paper-dialog>

    <plan-purchase id="purchasePlan" org="[[org]]"></plan-purchase>
    <plan-purchase id="addCard" org="[[org]]" add-card=""></plan-purchase>
  `,

  is: 'plans-list',

  properties: {
    email: {
      type: Object,
    },
    org: {
      type: Object,
      value() {
        return {};
      },
    },
    plans: {
      type: Array,
      computed: '_computePlans(org.*)',
    },
    hasCard: {
      type: Boolean,
      value: false,
      computed: '_computeHasCard(org.*)',
    },
  },

  listeners: {
    'plan-selected': 'purchasePlan',
    'add-card': 'addCard',
    'update-payment-method': 'addCard',
  },

  _computePlans(_org) {
    if (!this.org.available_plans) return [];
    return this.org.available_plans.filter(p => {
      if (!p.visible) return false;
      if (
        this.org.current_plan &&
        p.title === this.org.current_plan.title &&
        !this.org.current_plan.expiration
      )
        return false;
      return true;
    });
  },

  purchasePlan(e) {
    if (e.detail && e.detail.plan && e.detail.plan.title) {
      this.shadowRoot.querySelector('plan-purchase#purchasePlan').plan =
        e.detail.plan;
    } else {
      this.$.purchasePlan.plan = false;
    }
    this.shadowRoot.querySelector('plan-purchase#purchasePlan').open();
  },

  addCard(e) {
    console.log(
      '_updatePaymentMethod',
      e,
      this.shadowRoot.querySelector('plan-purchase#addCard')
    );
    this.shadowRoot.querySelector('plan-purchase#addCard').open();
  },

  openRates() {
    this.shadowRoot.querySelector('#paygRatesDialog').open();
  },

  computeStartChargingDay(days) {
    return moment().add(days, 'days').format('dddd MMMM Do');
  },

  _computeHasCard(_org) {
    if (this.org && this.org.card && this.org.card.length) return true;
    return false;
  },
});
