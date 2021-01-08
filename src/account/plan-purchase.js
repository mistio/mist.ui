import '@polymer/polymer/polymer-legacy.js';
import '@polymer/paper-styles/typography.js';
import '@polymer/iron-icons/iron-icons.js';
import '@polymer/iron-a11y-keys/iron-a11y-keys.js';
import '@polymer/paper-material/paper-material.js';
import '@polymer/paper-dialog/paper-dialog.js';
import '@polymer/paper-progress/paper-progress.js';
import '../helpers/card-form.js';
import { Polymer } from '@polymer/polymer/lib/legacy/polymer-fn.js';
import { html } from '@polymer/polymer/lib/utils/html-tag.js';
import { CSRFToken } from '../helpers/utils.js';

Polymer({
  _template: html`
    <style include="shared-styles forms">
      :host {
        box-sizing: border-box;
      }
      #form {
        max-width: 400px;
        font-size: inherit;
      }
      .head {
        text-align: center;
      }
      .form-row {
        padding: 4px 0;
        font-size: inherit;
      }
      .align {
        align-items: center;
        justify-content: space-between;
        @apply --layout-horizontal;
      }
      input {
        padding: 4px;
        font-size: inherit;
      }
      .buttons {
        padding: 8px 24px 16px 24px;
      }
      .progress {
        position: relative;
        width: 100%;
        left: 0;
        right: 0;
        margin-left: -24px;
      }
      paper-progress#progresserror ::slotted(#primaryProgress) {
        background-color: var(--red-color);
      }
      .errormsg-container {
        color: var(--red-color);
        font-size: 14px;
        padding-left: 20px;
      }
      .errormsg-container iron-icon {
        color: inherit;
        margin-right: 8px;
      }
      paper-progress {
        width: 100%;
        left: 0;
        right: 0;
      }
      .head hr.headhr {
        width: 40px;
        height: 1px;
        margin: 0 auto;
        padding: 0;
      }
      .head .title {
        font-weight: 500;
        text-transform: uppercase;
        font-size: 14px;
      }
      .head .desc {
        font-weight: 400;
        font-size: 14px;
        color: #454545;
      }
      .stripe {
        background-color: #444;
        color: #ccc;
        margin-top: 0;
        padding: 4px 16px;
        font-size: 0.8em;
        margin-bottom: 0;
      }
      label span {
        margin-right: 8px;
        margin-left: 8px;
      }
      span iron-icon {
        opacity: 0.54;
      }
      .logo {
        position: absolute;
        top: -64px;
        left: calc(50% - 64px);
      }
      .purchase-logo {
        background-size: contain;
        background-repeat: no-repeat;
        background-position: center center;
        background-color: transparent;
        background-image: var(--logo-purchase);
        height: var(--logo-purchase-height);
        margin-top: var(--logo-purchase-margin-top);
      }
      .secondary {
        font-size: 0.9em;
      }
      .current_cc {
        font-family: monospace;
        font-size: 12px;
      }
    </style>
    <iron-a11y-keys
      id="a11y"
      target="[[target]]"
      keys="enter"
      on-keys-pressed="_onEnter"
    ></iron-a11y-keys>
    <paper-dialog id="form" with-backdrop="" modal="">
      <div class="purchase-logo"></div>
      <div class="head">
        <p class="title" hidden$="[[addCard]]">
          <span hidden$="[[hasPlan]]">Credit Card required</span>
          <span hidden$="[[!hasPlan]]">[[plan.title]] plan</span>
        </p>
        <p class="title" hidden$="[[!addCard]]">
          <span hidden$="[[!org.card]]">Update Card</span
          ><span hidden$="[[org.card]]">Add Card</span>
        </p>
        <hr class="headhr" />
        <p class="desc" hidden$="[[addCard]]">
          <span hidden$="[[!hasPlan]]"
            >Subscription of $[[plan.price]]/mo. <br />
            Up to [[displayInt(plan.vcpu_limit)]] vCPUs</span
          >
        </p>
        <p class="desc" hidden$="[[!addCard]]">
          <span hidden$="[[org.card]]"
            >Add a credit card to your account.<br /></span
          ><span hidden$="[[!org.card]]" class="current_cc"
            >Current card: **** **** **** [[org.card]]</span
          >
        </p>
      </div>
      <paper-dialog-scrollable>
        <div class="form-inputs" hidden$="[[hideCardFields]]">
          <card-form
            id="inPlanPurchase"
            card-valid="{{cardValid}}"
            token="[[token]]"
          ></card-form>
        </div>
        <div class="text-center secondary" hidden$="[[plan]]">
          <span hidden$="[[org.card]]">A 14 Day Free Trial applies.</span>
        </div>
      </paper-dialog-scrollable>
      <div class="progress">
        <paper-progress
          id="progress"
          indeterminate=""
          hidden$="[[!loading]]"
        ></paper-progress>
        <paper-progress
          id="progresserror"
          value="100"
          hidden$="[[!formError]]"
        ></paper-progress>
        <hr class="appform" />
        <p class="errormsg-container" hidden$="[[!formError]]">
          <iron-icon icon="icons:error-outline"></iron-icon
          ><span id="errormsg"></span>
        </p>
      </div>
      <div class="buttons">
        <paper-button on-tap="_goBack" hidden$="[[!persist]]"
          >Back</paper-button
        >
        <paper-button dialog-dismis="" on-tap="_reset" hidden$="[[persist]]"
          >Cancel</paper-button
        >
        <paper-button
          autofocus=""
          on-tap="_submit"
          class="blue"
          disabled="[[!formReady]]"
        >
          <span hidden$="[[addCard]]">[[buttonText]]</span>
          <span hidden$="[[!addCard]]">Add Card </span>
        </paper-button>
      </div>
      <div class="stripe">* We use Stripe for safe payments</div>
    </paper-dialog>

    <iron-ajax
      id="purchasePlanRequest"
      url="/api/v1/billing"
      method="POST"
      loading="{{loading}}"
      on-response="purchaseResponse"
      on-error="purchaseError"
    ></iron-ajax>
  `,

  is: 'plan-purchase',

  properties: {
    user: {
      type: Object,
    },
    org: {
      type: Object,
    },
    plan: {
      type: Object,
    },
    hasPlan: {
      type: Boolean,
      computed: '_hasPlan(plan)',
      value: false,
    },
    payload: {
      type: Object,
      value() {
        return {
          number: '',
          exp_month: '',
          exp_year: '',
          cvc: '',
          address_zip: '',
        };
      },
    },
    addCard: {
      type: Boolean,
      value: false,
      reflectToAttribute: true,
    },
    loading: {
      type: Boolean,
      value: false,
    },
    formError: {
      type: Boolean,
      value: false,
    },
    formReady: {
      type: Boolean,
      computed: '_computeFormReady(hasCard, cardValid, hideCardFields)',
      value: false,
    },
    hasCard: {
      type: Boolean,
      value: false,
    },
    persist: {
      type: Boolean,
      value: false,
    },
    hideCardFields: {
      type: Boolean,
      computed: '_computeHideCardFields(plan.price, hasCard, addCard)',
      value: false,
    },
    buttonText: {
      type: String,
      computed: '_computeButtonText(plan,org)',
      value: 'Enable',
    },
    cardValid: {
      type: Boolean,
    },
    target: {
      type: Object,
    },
  },

  observers: ['updateHasCard(org.card)'],

  listeners: {
    input: 'validateForm',
    'iron-overlay-closed': '_reset',
    'card-response': '_gotCardResponse',
  },

  attached() {
    this.set('target', this.$.form);
  },

  updateHasCard(card) {
    if (card) {
      this.set('hasCard', true);
    }
  },

  open(_e) {
    this.shadowRoot.querySelector('#form').open();
  },

  close(_e) {
    this.shadowRoot.querySelector('#form').close();
  },

  _hasPlan() {
    return !!(this.plan && this.plan.title);
  },

  _computeHideCardFields(price, hasCard, addCard) {
    return (price === 0 || hasCard) && !addCard;
  },

  _computeFormReady(_hasCard, cardValid, hideCardFields) {
    return cardValid || hideCardFields;
  },

  _submit(_e) {
    if (this.cardValid) {
      this.shadowRoot.querySelector('card-form#inPlanPurchase').verify();
    }
    if ((this.org && this.org.card) || (this.plan && this.plan.price === 0)) {
      const payload = this.plan ? { plan: this.plan.title } : '';
      this.$.purchasePlanRequest.headers['Content-Type'] = 'application/json';
      this.$.purchasePlanRequest.headers['Csrf-Token'] = CSRFToken.value;
      this.$.purchasePlanRequest.body = payload;
      this.$.purchasePlanRequest.generateRequest();
    }
  },

  _onEnter(_e) {
    if (this.formReady) this._submit();
  },

  validateForm(_error) {
    this.set('formError', false);
  },

  _gotCardResponse(e) {
    console.log('_gotCardResponse', e.detail);
    if (this.cardValid) {
      const card = this.shadowRoot.querySelector('card-form#inPlanPurchase');
      if (e.detail.token) {
        const payload = { token: e.detail.token };
        if (this.plan) payload.plan = this.plan.title;
        console.log('_gotCardResponse', this.$.purchasePlanRequest.url);
        this.$.purchasePlanRequest.headers['Content-Type'] = 'application/json';
        this.$.purchasePlanRequest.headers['Csrf-Token'] = CSRFToken.value;
        this.$.purchasePlanRequest.body = payload;
        this.$.purchasePlanRequest.generateRequest();
      } else if (card.errors) {
        this.set('formError', true);
        this.$.errormsg.textContent = card.errors;
      } else {
        this.set('loading', true);
      }
    } else this.$.form.refit();
  },

  purchaseResponse(_e) {
    this._reset();
    if (this.addCard) {
      this.dispatchEvent(
        new CustomEvent('toast', {
          bubbles: true,
          composed: true,
          detail: { msg: 'Card added.', duration: 3000 },
        })
      );
    } else {
      this.dispatchEvent(
        new CustomEvent('toast', {
          bubbles: true,
          composed: true,
          detail: { msg: 'Plan changed.', duration: 3000 },
        })
      );
    }
  },

  _reset() {
    this.set('formError', false);
    this.shadowRoot.querySelector('card-form#inPlanPurchase').reset();
    this.shadowRoot.querySelector('#form').close();
    this.dispatchEvent(new CustomEvent('cc-dismiss'));
  },

  purchaseError(e) {
    console.log('purchaseError', e);
    this.set('formError', true);
    this.$.errormsg.textContent = e.detail.error;
  },

  displayInt(int) {
    if (int && int.toString()) {
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
    }
    return int;
  },

  _computeButtonText(_plan, _org) {
    // if (this.org.current_plan.vcpu_limit > plan.vcpu_limit){
    //     return 'Downgrade';
    // }
    // else if (this.org.current_plan.vcpu_limit < plan.vcpu_limit){
    //     return 'Upgrade';
    // }
    // else {
    //     return "Purchase";
    // }
    if (this.plan && this.plan.title) return 'Purchase';
    return 'Enable';
  },

  _goBack(e) {
    e.stopImmediatePropagation();
    if (window.history) {
      window.history.back();
    } else {
      this.dispatchEvent(
        new CustomEvent('go-to', { bubbles: true, composed: true, detail: '/' })
      );
    }
    this._reset();
  },
});
