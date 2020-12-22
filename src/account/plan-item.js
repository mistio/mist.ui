import '../../node_modules/@polymer/polymer/polymer-legacy.js';
import '../../node_modules/@polymer/paper-button/paper-button.js';
import '../../node_modules/@polymer/paper-styles/typography.js';

import '../../node_modules/@polymer/paper-spinner/paper-spinner-lite.js';
import '../../node_modules/@polymer/paper-tooltip/paper-tooltip.js';
import '../helpers/dialog-element.js';
import moment from 'moment/src/moment.js';
import { CSRFToken, formatMoney } from '../helpers/utils.js';
import { Polymer } from '../../node_modules/@polymer/polymer/lib/legacy/polymer-fn.js';
import { html } from '../../node_modules/@polymer/polymer/lib/utils/html-tag.js';

Polymer({
  _template: html`
    <style include="shared-styles">
      :host {
        box-sizing: border-box;
        @apply --shadow-elevation-2dp;
        display: flex;
        flex-direction: column;
        flex-basis: calc(33% - 14px);
        margin: 8px;
        flex: 1;
        padding: 8px;
        min-height: 300px;
      }

      :host([current]) {
        color: #ffffff;
        background-color: #039be5;
        width: 100%;
        flex-basis: auto;
      }

      :host([current]) paper-button {
        color: #039be5 !important;
        background-color: #ffffff !important;
      }

      :host([current]) paper-button#updatePaymentMethodButton,
      :host([current]) paper-button#cancelButton {
        color: #fff !important;
        background-color: transparent !important;
        font-weight: 500;
        font-size: 14px;
      }

      :host([current]) .plan h2 {
        font-weight: bold;
        margin-top: 0;
      }

      :host([current]) p {
        margin: 16px 0;
      }

      div[hidden] {
        display: none;
      }

      hr {
        border: none;
        border-bottom: 1px solid rgba(0, 0, 0, 0.13);
        height: 0px;
      }

      h2 {
        text-transform: uppercase;
      }

      #select {
        color: #ffffff;
        background-color: #039be5;
      }

      .plan {
        text-align: center;
      }

      #cancelButton,
      #updatePaymentMethodButton {
        font-size: 0.8em;
        margin-top: 32px !important;
      }

      paper-spinner-lite.white {
        --paper-spinner-color: #fff;
      }

      .title {
        color: #fff;
        text-transform: uppercase;
        padding: 8px 0;
        font-size: 18px;
      }

      .current {
        background-color: #2196f3;
      }

      .bg-0 {
        background-color: #999;
      }

      .bg-1 {
        background-color: #777;
      }

      .bg-2 {
        background-color: #555;
      }

      .bg-3 {
        background-color: #222;
      }

      .plan {
        margin-bottom: 50px;
        overflow: auto;
        min-width: 100%;
        align-self: center;
      }

      .plan,
      .plan > * {
        box-sizing: border-box;
        margin: 0;
      }

      .plan paper-button {
        margin: 0 8px !important;
        font-size: 14px;
        height: 2rem;
        width: auto;
      }

      .old-plan-body {
        padding-left: 16px;
        padding-right: 16px;
      }

      .plan-body-item {
        padding: 30px 10px 30px 10px;
      }

      :host([current]) .plan-body-item:first-child {
        padding: 0 10px 30px 10px;
      }

      @media only screen and (max-width: 600px) {
        .plan-body-item {
          min-height: 50px;
        }
      }

      .plan-body-item + .plan-body-item,
      .plan-body-item:last-child {
        border-top: 1px solid #d4d4d4;
      }

      :host([current]) .plan-body-item + .plan-body-item,
      :host([current]) .plan-body-item:last-child {
        border: 0 none;
      }

      .plan-body-item.highlight {
        background-color: #f2f2f2;
      }

      .plan-body-item * {
        width: 100%;
      }

      .plan-body-item:not(:first-child) {
        padding: 0 10px;
      }

      .valign {
        display: block;
      }

      .price {
        font-weight: 700;
        line-height: 1;
        padding: 0;
        font-size: 1.56rem;
        margin: 8px;
      }

      .price sub,
      .price sup {
        font-size: 0.6em;
        font-weight: 300;
      }

      .price sub {
        vertical-align: baseline;
      }

      .old {
        padding-bottom: 30px;
      }

      .payg-info {
        margin: 24px 24px 16px 24px;
        display: block;
      }

      span#vcpus,
      span#datapoints,
      span#rulechecks,
      span#apirequests,
      span#retention {
        border-bottom: 1px dashed #fff;
      }

      paper-tooltip::slotted(#tooltip) {
        font-size: 14px;
      }

      .days-left {
        font-size: 2em;
      }
      .payg-info {
        margin: 0 auto;
        width: 300px;
      }
      .payg-info ul {
        text-align: left;
        list-style: none;
        font-size: 0.9em;
      }

      .subtext {
        font-size: 0.8em;
      }

      ul.rates {
        padding-left: 48px;
      }
      p.margin-top,
      .margin-top {
        margin-top: 48px;
      }
      .loadingCancel {
        position: relative;
        width: 100%;
        display: block;
        height: 60px;
      }
      .loadingCancel paper-spinner-lite {
        position: absolute;
        bottom: 0;
        right: calc(50% - 14px);
      }
      p.margin-24 {
        margin: 24px;
      }
    </style>
    <template is="dom-if" if="[[!plan]]" restamp="">
      <div class="plan">
        <h2>Pay As You Go</h2>
        <div class="old-plan-body">
          <div>
            <div class="payg-info" hidden$="[[plan.title]]">
              <ul class="rates">
                <li>
                  <strong><sup>$</sup>2/mo</strong> per
                  <span id="vcpus">vCPU</span>
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
              <paper-tooltip
                for="apirequests"
                animation-delay="0"
                position="top"
                >Invokations of the Mist.io API by any member of your
                organization.</paper-tooltip
              >
              <paper-tooltip for="retention" animation-delay="0" position="top"
                >Historic data within the retention window will be
                accesible.</paper-tooltip
              >
              <p class="subtext">High watermark, pro-rated daily.</p>

              <div hidden$="[[plan.title]]">
                <br />
                <template is="dom-if" if="[[!hasCard]]" restamp="">
                  <paper-button class="blue" raised="" on-tap="_purchasePlan"
                    >Enable</paper-button
                  >
                  <p class="margin-24">
                    14 days of <strong>free trial</strong>.
                  </p>
                </template>
                <template is="dom-if" if="[[trialDaysLeft]]">
                  <p>
                    <span class="days-left">[[trialDaysLeft]]</span> days <br />
                    of free trial left.
                  </p>
                  <!-- <p><br/>
                                        <paper-button id="updatePaymentMethodButton" on-tap="_updatePaymentMethod" hidden$="{{loadingCancel}}">Update payment method</paper-button>
                                    </p> -->
                  <p>
                    <br />
                    <paper-button
                      id="updatePaymentMethodButton"
                      on-tap="_updatePaymentMethod"
                      hidden$="{{loadingCancel}}"
                      >Update payment method</paper-button
                    >
                  </p>
                </template>
              </div>
            </div>
          </div>
        </div>
      </div>
    </template>
    <template is="dom-if" if="[[plan]]" restamp="">
      <template is="dom-if" if="[[!plan.vcpu_limit]]" restamp="">
        <div class="plan old">
          <h2>[[plan.title]]</h2>
          <hr />
          <div class="old-plan-body">
            <!-- regular plans -->
            <div>
              <br />
              <h2 class="price"><sup>$</sup>[[plan.price]]<sub>/mo.</sub></h2>
            </div>
            <div hidden$="[[enterprise]]">
              <p>
                <!-- any plan but payg has title -->
                <span hidden$="[[!plan.title]]">[[descriptionText]]</span>
              </p>
            </div>
            <!-- plan is canceled -->
            <template is="dom-if" if="[[plan.expiration]]">
              <p>
                <strong
                  >Your plan will expire on
                  [[_computeReadableDate(plan.expiration)]].</strong
                >
                <br />
                <br />
              </p>
            </template>
            <template
              is="dom-if"
              if="[[showPurchase(plan, current)]]"
              restamp=""
            >
              <paper-button
                id="select"
                class="btn-block submit-btn blue"
                on-tap="_purchasePlan"
                >Purchase</paper-button
              >
            </template>
            <!-- is current plan, not cancelled-->
            <div hidden$="[[!showCancel(plan, current)]]">
              <paper-button
                id="cancelButton"
                on-tap="_cancelPlan"
                hidden$="{{loadingCancel}}"
                >Cancel Plan</paper-button
              >
              <div class="loadingCancel" hidden$="{{!loadingCancel}}">
                <p>Canceling Plan</p>
                <paper-spinner-lite
                  class="white"
                  active="{{loadingCancel}}"
                ></paper-spinner-lite>
              </div>
              <paper-button
                id="updatePaymentMethodButton"
                on-tap="_updatePaymentMethod"
                hidden$="{{loadingCancel}}"
                >Update payment method</paper-button
              >
            </div>
          </div>
        </div>
      </template>
      <template is="dom-if" if="[[plan.vcpu_limit]]" restamp="">
        <div class="plan">
          <h2 class$="[[bgclass]]">[[plan.title]]</h2>
          <div class="plan-body">
            <div class="plan-body-item">
              <div class="valign">
                <h2 class="price">
                  <sup>$</sup>[[_formatMoney(plan.price)]]<sub>/mo.</sub>
                </h2>
                <template
                  is="dom-if"
                  if="[[showPurchase(plan, current)]]"
                  restamp=""
                >
                  <paper-button class="blue" raised="" on-tap="_selectPlan"
                    >Purchase</paper-button
                  >
                </template>
              </div>
            </div>
            <div class="plan-body-item">
              <p class="valign">[[displayInt(plan.vcpu_limit)]] vCPUs</p>
              <p class="valign">
                [[displayInt(plan.datapoint_limit)]] datapoints/day
              </p>
              <p class="valign">
                [[displayInt(plan.checks_limit)]] rule checks/day
              </p>
              <p class="valign" hidden$="[[!plan.retention]]">
                [[plan.retention]] retention
              </p>
            </div>
            <template is="dom-if" if="[[plan.expiration]]">
              <div class="plan-body-item">
                <p class="margin-top">
                  <strong
                    >Your plan will expire on
                    [[_computeReadableDate(plan.expiration)]].</strong
                  >
                </p>
              </div>
            </template>
            <div class="margin-top" hidden$="[[!showCancel(plan, current)]]">
              <paper-button
                id="cancelButton"
                on-tap="_cancelPlan"
                hidden$="{{loadingCancel}}"
                >Cancel Plan</paper-button
              >
              <div hidden$="{{!loadingCancel}}">
                <div class="loadingCancel" hidden$="{{!loadingCancel}}">
                  <p>Canceling Plan</p>
                  <paper-spinner-lite
                    class="white"
                    active="{{loadingCancel}}"
                  ></paper-spinner-lite>
                </div>
              </div>
              <paper-button
                id="updatePaymentMethodButton"
                on-tap="_updatePaymentMethod"
                hidden$="{{loadingCancel}}"
                >Update payment method</paper-button
              >
            </div>
          </div>
        </div>
      </template>
    </template>
    <dialog-element id="plancancel"></dialog-element>
    <iron-ajax
      id="cancelPlanAjaxRequest"
      url="/api/v1/billing"
      method="DELETE"
      loading="{{loadingCancel}}"
      on-response="_handleCancelAjaxResponse"
      on-error="_handleCancelAjaxError"
      handle-as="xml"
    ></iron-ajax>
  `,

  is: 'plan-item',

  properties: {
    email: {
      type: Object,
    },
    plan: {
      type: Object,
      value: false,
    },
    hasCard: {
      type: Boolean,
      value: false,
    },
    trialDaysLeft: {
      type: Number,
      value: 0,
    },
    current: {
      type: Boolean,
      value: false,
      reflectToAttribute: true,
    },
    priceText: {
      type: String,
      computed: '_computePriceText(plan.price)',
    },
    descriptionText: {
      type: String,
      computed: '_computeDescriptionText(plan)',
    },
    discountedPriceText: {
      type: String,
      computed: '_computeDiscountedPriceText(plan)',
    },
    enterprise: {
      type: Boolean,
      computed: '_computeIsEnterprise(plan)',
      value: false,
    },
    loadingCancel: {
      type: Boolean,
      value: false,
    },
    bgclass: {
      type: String,
      computed: '_computeBgClass(plan, current)',
    },
  },

  listeners: {
    confirmation: '_cancelPlanConfirmed',
  },

  _computeBgClass(plan) {
    if (this.current === true) return 'title';
    if (plan.title === 'Small') return 'title bg-1';
    if (plan.title === 'Medium') return 'title bg-2';
    if (plan.title === 'Large') return 'title bg-3';
    return '';
  },

  _computePriceText(price) {
    return price != null ? `$${price}/mo` : '';
  },

  _computeDescriptionText(_plan) {
    if (!this.plan) return '';
    let monitoringFor = '';
    if (this.plan && this.plan.monitor_limit) {
      monitoringFor = `, up to ${this.plan.monitor_limit} monitored`;
    }
    return !this.plan.description || this.plan.description === ''
      ? `up to ${this.plan.machine_limit}  machines${monitoringFor}`
      : this.plan.description;
  },

  _computeDiscountedPriceText(plan) {
    if (plan && plan.promo) {
      const newPrice = Math.round(plan.price * (1 - plan.promo.discount / 100));
      return `$${newPrice}/mo`;
    }
    return '';
  },

  _computeReadableDate(date) {
    return date ? moment.utc(date * 1000).format('MMMM Do YYYY') : date;
  },

  _selectPlan(_e) {
    this.dispatchEvent(
      new CustomEvent('plan-selected', {
        bubbles: true,
        composed: true,
        detail: { plan: this.plan },
      })
    );
  },

  _triggerInfo() {
    console.log('info popup');
  },

  _computeIsEnterprise(_title) {
    return this.plan && this.plan.title === 'Enterprise';
  },

  _addCard(_e) {
    this.dispatchEvent(
      new CustomEvent('add-card', { bubbles: true, composed: true })
    );
  },

  _purchasePlan(_e) {
    console.log('purchasePlan', this.plan);
    if (this.plan && !this.plan.price) {
      this.dispatchEvent(
        new CustomEvent('plan-selected', {
          bubbles: true,
          composed: true,
          detail: { plan: this.plan },
        })
      );
    } else {
      this.dispatchEvent(
        new CustomEvent('plan-selected', { bubbles: true, composed: true })
      );
    }
  },

  _cancelPlan() {
    this._showDialog({
      title: 'Cancel current plan',
      body: 'Your plan will expire at the end of your monthly subscription.',
      danger: true,
      reason: 'plan.cancel',
      action: 'Cancel Your plan',
      undo: 'not yet',
    });
  },

  _updatePaymentMethod(_e) {
    this.dispatchEvent(
      new CustomEvent('update-payment-method', {
        bubbles: true,
        composed: true,
      })
    );
  },

  _showDialog(info) {
    const dialog = this.$.plancancel;
    if (info) {
      Object.keys(info).forEach(i => {
        dialog[i] = info[i];
      });
    }
    dialog._openDialog();
  },

  _cancelPlanConfirmed(e) {
    console.log('_cancelPlanConfirmed', e);
    const { reason } = e.detail;
    const { response } = e.detail;

    if (response === 'confirm' && reason === 'plan.cancel') {
      this.$.cancelPlanAjaxRequest.headers['Content-Type'] = 'application/json';
      this.$.cancelPlanAjaxRequest.headers['Csrf-Token'] = CSRFToken.value;
      this.$.cancelPlanAjaxRequest.generateRequest();
    }
  },

  _handleCancelAjaxResponse(_e) {
    this.dispatchEvent(
      new CustomEvent('toast', {
        bubbles: true,
        composed: true,
        detail: { msg: 'You cancelled your plan. ', duration: 3000 },
      })
    );
  },

  _handleCancelAjaxError(e) {
    this.dispatchEvent(
      new CustomEvent('error-on-cancel-plan', {
        bubbles: true,
        composed: true,
        detail: { error: e.detail.request.xhr.responseText },
      })
    );
  },

  showCancel(_plan, _current) {
    return this.current && this.plan.title && !this.plan.expiration;
  },

  showPurchase(_plan, _current) {
    return !this.current || !this.plan || this.plan.expiration;
  },

  displayInt(int) {
    return int
      .toString()
      .split('')
      .reverse()
      .join('')
      .replace('000000000', 'B')
      .replace('000000', 'M')
      .replace('000', 'k')
      .split('')
      .reverse()
      .join('');
  },

  _formatMoney(int) {
    if (int) return formatMoney(int, 0, '.', ',');
    return int;
  },
});
