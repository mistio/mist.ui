import '@polymer/polymer/polymer-legacy.js';
import '@polymer/paper-styles/typography.js';
import '@polymer/paper-input/paper-input.js';
import '@polymer/iron-icons/iron-icons.js';
import '@polymer/gold-cc-input/gold-cc-input.js';
import '@polymer/gold-cc-cvc-input/gold-cc-cvc-input.js';
import { stripePublicAPIKey } from './utils.js';
import { Polymer } from '@polymer/polymer/lib/legacy/polymer-fn.js';
import { html } from '@polymer/polymer/lib/utils/html-tag.js';

Polymer({
  _template: html`
    <style include="shared-styles forms">
      :host {
        text-align: left;
      }
      #form {
        width: 360px;
        font-size: inherit;
      }
      .logo {
        position: absolute;
        top: -64px;
        left: calc(50% - 64px);
      }
      .head {
        padding-top: 32px;
        text-align: center;
      }
      .form-inputs {
        padding: 8px;
        width: 100%;
        margin-bottom: 16px;
        box-sizing: border-box;
        background-color: #fafafa;
        border: 1px solid #eee;
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
      label {
        font-size: 16px;
        color: #0099cc !important;
        text-transform: uppercase;
        transform: scale(0.75) translate(-24px, 0);
        display: block;
      }
      gold-cc-input {
        width: 230px;
        display: inline-block;
        vertical-align: top;
        margin-right: 16px;
      }
      gold-cc-cvc-input {
        padding-bottom: 8px;
        width: 80px;
        display: inline-block;
        vertical-align: top;
      }
      .expiration {
        position: relative;
      }
      #expirationMonth,
      #expirationYear,
      span {
        display: inline-block;
      }
      #expirationMonth,
      #expirationYear {
        width: 70px;
        text-align: center;
      }
      #zipCode {
        display: inline-block;
        width: 50%;
      }
      #zipCode::slotted(label) {
        top: -9px;
      }
      @media (max-width: 480px) {
        gold-cc-input,
        gold-cc-cvc-input,
        #zipCode {
          width: 100%;
        }
        .align,
        #zipCode {
          display: block;
        }
        #expirationMonth,
        #expirationYear,
        span {
          display: inline-block;
        }
        #expirationMonth,
        #expirationYear {
          width: 70px;
          text-align: center;
        }
        label {
          transform: scale(0.75) translate(-44px, 0);
        }
      }
    </style>
    <div class="form-inputs">
      <gold-cc-input
        id="cc"
        required=""
        auto-validate=""
        autofocus=""
        card-type="{{cardType}}"
        data-stripe="number"
        value="{{payload.number::input}}"
      >
      </gold-cc-input>
      <gold-cc-cvc-input
        id="cvc"
        required=""
        auto-validate=""
        card-type="[[cardType]]"
        label="CVC"
        value="{{payload.cvc::input}}"
      ></gold-cc-cvc-input>
      <div class="align">
        <div class="expiration">
          <label>Expiration Date</label>
          <paper-input
            id="expirationMonth"
            type="text"
            allowed-pattern="[0-9]"
            data-stripe="exp_month"
            value="{{payload.exp_month::input}}"
            placeholder="MM"
            no-label-float=""
          ></paper-input>
          <span>/</span>
          <paper-input
            id="expirationYear"
            type="text"
            allowed-pattern="[0-9]"
            data-stripe="exp_year"
            value="{{payload.exp_year::input}}"
            placeholder="YY"
            no-label-float=""
          ></paper-input>
        </div>
        <paper-input
          id="zipCode"
          label="Zip Code"
          type="text"
          allowed-pattern="[a-zA-Z0-9]"
          data-stripe="address_zip"
          value="{{payload.address_zip::input}}"
          required=""
          auto-validate=""
          always-float-label=""
        ></paper-input>
      </div>
    </div>
  `,

  is: 'card-form',

  properties: {
    user: {
      type: Object,
    },
    org: {
      type: Object,
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
    hasCard: {
      type: Boolean,
      value: false,
    },
    cardValid: {
      type: Boolean,
      value: false,
      notify: true,
    },
    token: {
      type: String,
      reflectToAttribute: true,
    },
    errors: {
      type: String,
      reflectToAttribute: true,
    },
  },

  keyBindings: {
    '/': '_selectYear',
  },

  observers: [
    '_dateChanged(payload.exp_month, payload.exp_year)',
    '_assessValidity(payload.*)',
  ],

  ready() {},
  attached() {
    const script = document.createElement('script');
    script.type = 'text/javascript';
    script.src = 'https://js.stripe.com/v2/';
    document.getElementsByTagName('head')[0].appendChild(script);
  },
  reset() {
    this.set('errors', '');
    this.set('token', null);
    this.set('cardValid', false);
    this.set('payload', {
      number: '',
      exp_month: '',
      exp_year: '',
      cvc: '',
      address_zip: '',
    });
    this.$.cc.invalid = false;
    this.$.cvc.invalid = false;
    this.$.expirationYear.invalid = false;
    this.$.expirationMonth.invalid = false;
    this.$.zipCode.invalid = false;
  },
  /* eslint-disable no-undef */
  verify() {
    // extra stripe validation
    const that = this;
    function stripeResponseHandler(status, response) {
      if (response.error) {
        console.error('stripeResponseHandler failed', response.error.message);
        that._setError(response.error.message);
      } else {
        that._setToken(status, response);
      }
    }
    if (this.cardValid) {
      const isValid =
        Stripe.card.validateCardNumber(this.payload.number) &&
        Stripe.card.validateExpiry(
          this.payload.exp_month,
          this.payload.exp_year
        ) &&
        Stripe.card.validateCVC(this.payload.cvc) &&
        this.payload.address_zip !== '' &&
        this.payload.address_zip.length >= 4;

      if (isValid) {
        Stripe.setPublishableKey(stripePublicAPIKey.value);
        Stripe.card.createToken(this.payload, stripeResponseHandler);
      } else {
        const errorsArray = [];
        if (!Stripe.card.validateCardNumber(this.payload.number))
          errorsArray.push('card number');

        if (
          !Stripe.card.validateExpiry(
            this.payload.exp_month,
            this.payload.exp_year
          )
        )
          errorsArray.push('expiration');

        if (!Stripe.card.validateCVC(this.payload.cvc)) errorsArray.push('cvc');

        if (
          this.payload.address_zip === '' ||
          this.payload.address_zip.length < 4
        ) {
          errorsArray.push(
            this.payload.address_zip !== ''
              ? 'zip code. Zip code must be longer than 3 digits'
              : 'zip code'
          );
        }
        this._setError(
          `There seems to be an error in ${errorsArray.join(', ')}.`
        );
      }
      this.dispatchEvent(new CustomEvent('card-response'));
    }
  },
  /* eslint-enable no-undef */
  _setToken(status, response) {
    this.set('token', response.id);
    this.set('errors', '');
    this.dispatchEvent(
      new CustomEvent('card-response', {
        bubbles: true,
        composed: true,
        detail: { token: this.token },
      })
    );
  },

  _setError(str) {
    this.set('errors', str);
    this.set('token', null);
  },

  _dateChanged(month, year) {
    if (year.length)
      this.$.expirationYear.invalid = !this._validateDate(month, year);
    if (month.length)
      this.$.expirationMonth.invalid = !this._validateDate(month, year);

    if (month && month.length === 2 && !year.length) {
      this._selectYear();
    }
  },

  _validateDate(month, year) {
    if (!month.length || !year.length) return false;
    if (month > 12 || month < 1) return false;
    const then = new Date(`20${year}`, month);
    const now = new Date();
    return then > now;
  },

  _selectYear() {
    this.$.expirationYear.focus();
  },

  _assessValidity(_payload) {
    this._setError('');
    if (
      this._emptyProperty(this.payload) ||
      this.$.cc.invalid ||
      this.$.cvc.invalid ||
      this.$.expirationYear.invalid ||
      this.$.expirationMonth.invalid ||
      this.$.zipCode.invalid
    )
      this.set('cardValid', false);
    else {
      this.set('cardValid', true);
    }
  },

  _emptyProperty(obj) {
    if (obj) {
      for (const p of Object.keys(obj)) {
        if (!obj[p] || !obj[p].trim().length) return true;
      }
    }
    return false;
  },
});
