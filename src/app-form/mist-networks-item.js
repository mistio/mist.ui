import '@polymer/polymer/polymer-legacy.js';
import '@polymer/paper-material/paper-material.js';
import '@polymer/paper-checkbox/paper-checkbox.js';
import '@polymer/paper-styles/typography.js';
import '@polymer/paper-item/paper-item.js';
import '@polymer/paper-radio-group/paper-radio-group.js';
import '@polymer/paper-radio-button/paper-radio-button.js';
import '@polymer/iron-icons/iron-icons.js';
import { Polymer } from '@polymer/polymer/lib/legacy/polymer-fn.js';
import { html } from '@polymer/polymer/lib/utils/html-tag.js';

const NETWORK_MANUAL_CONFIG_FIELDS = [
  {
    name: 'ip',
    label: 'IP *',
    type: 'text',
    validator: 'ip-validator',
    value: '',
    defaultValue: '',
    show: true,
    required: true,
    errorMessage: 'Invalid IP.',
  },
  {
    name: 'network_id',
    label: 'id',
    type: 'text',
    value: '',
    defaultValue: '',
    show: false,
    required: true,
  },
  {
    name: 'gateway',
    label: 'Gateway *',
    type: 'text',
    validator: 'ip-validator',
    value: '',
    defaultValue: '',
    show: true,
    required: true,
    errorMessage: 'Invalid gateway.',
  },
  {
    name: 'primary',
    label: 'Primary Interface',
    type: 'text',
    value: '',
    defaultValue: '',
    show: true,
    required: false,
  },
];
Polymer({
  _template: html`
    <style include="shared-styles forms">
      .options-box {
        font-size: 0.9em !important;
        display: inline-block;
        vertical-align: top;
      }
      paper-checkbox {
        padding: 12px 0;
        display: inline-block;
        vertical-align: top;
        --paper-checkbox-checked-color: var(--mist-blue) !important;
        --paper-checkbox-checked-ink-color: var(--mist-blue) !important;
      }
      .options {
        margin-left: 8px;
      }
      :host app-form#manual-net-form {
        margin-left: 36px;
      }
      :host app-form#manual-net-form ::slotted(.grid) {
        width: 100% !important;
        max-width: 100% !important;
      }
      :host app-form#manual-net-form ::slotted(paper-input-container) {
        padding: 0;
      }
      :host paper-radio-group.options {
        display: block;
        margin-top: 0 !important;
      }
      paper-checkbox {
        display: block;
      }
    </style>
    <paper-checkbox
      on-change="_updateCheckboxesField"
      id$="[[network.id]]"
      checked="{{checked}}"
    >
      <template is="dom-if" if="[[network.img]]">
        <img
          class="item-img"
          src="[[network.img]]"
          width="24px"
          alt="[[network.name]]"
        />
      </template>
      <span
        class$="item-desc noimg-[[!network.img]]"
        data-prefix$="[[network.prefix]]"
        data-suffix$="[[network.suffix]]"
        >[[network.name]]</span
      >
    </paper-checkbox>
    <template is="dom-if" if="[[canConfigure]]">
      <div class="options-box m12" hidden$="[[!checked]]">
        <paper-radio-group class="options" selected="{{type}}">
          <paper-radio-button name="">dhcp</paper-radio-button>
          <paper-radio-button name="manual"
            >manual configuration</paper-radio-button
          >
        </paper-radio-group>
        <div hidden$="[[!type]]">
          <app-form
            id="manual-net-form"
            form="{{form}}"
            fields="{{fields}}"
            form-ready="{{formValid}}"
            display-buttons="[[_calcDisplayButtons()]]"
            single-column=""
          ></app-form>
        </div>
      </div>
    </template>
  `,

  is: 'mist-networks-item',

  properties: {
    network: {
      type: Object,
      notify: true,
    },
    checked: {
      type: Boolean,
      value: false,
      notify: true,
      reflectToAttribute: true,
    },
    canConfigure: {
      type: Boolean,
    },
    type: {
      type: String,
      value: '',
    },
    form: {
      type: Object,
      value: {},
    },
    fields: {
      type: Array,
      value() {
        return NETWORK_MANUAL_CONFIG_FIELDS;
      },
    },
    formValid: {
      type: Boolean,
      value: false,
    },
    valid: {
      type: Boolean,
      notify: true,
      reflectToAttribute: true,
    },
  },

  listeners: {},

  observers: [
    '_updateValue(type,checked,network,form,formValid)',
    '_networkFieldValueChanged(network.fieldValue, network.fieldValue.*, valid)',
  ],

  ready() {},

  _updateValue(_type, _checked, _network, _form, _formValid) {
    if (this.network && this.fields) {
      if (this.checked) {
        // set net id
        if (this.fields[1].value !== this.network.id) {
          this.set('fields.1.value', this.network.id);
        }
        // make sure required fields have values, fixes initial formValid issue
        const requiredFieldsHaveValues = this.fields
          .filter(f => f.required)
          .every(
            el => this.form && this.form[el.name] && this.form[el.name].length
          );
        this.set(
          'network.fieldValue',
          this.type && this.fields ? this.form : this.network.id
        );
        this.set(
          'valid',
          this.type
            ? requiredFieldsHaveValues && this.formValid
            : this.network.fieldValue === this.network.id
        );
        console.log(
          'requiredFieldsHaveValues',
          requiredFieldsHaveValues,
          this.formValid,
          this.network.fieldValue
        );
      } else {
        this.set('network.fieldValue', null);
        this.set('valid', false);
      }
    }
    this.dispatchEvent(new CustomEvent('item-value-changed'), {
      bubbles: true,
      composed: true,
    });
  },

  _networkFieldValueChanged(_e) {
    this.dispatchEvent(new CustomEvent('item-value-changed'), {
      bubbles: true,
      composed: true,
    });
  },

  _calcDisplayButtons() {
    return false;
  },
});
