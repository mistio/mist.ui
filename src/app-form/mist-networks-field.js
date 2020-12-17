import '../../node_modules/@polymer/polymer/polymer-legacy.js';
import '../../node_modules/@polymer/paper-material/paper-material.js';
import '../../node_modules/@polymer/paper-button/paper-button.js';
import '../../node_modules/@polymer/paper-checkbox/paper-checkbox.js';
import '../../node_modules/@polymer/paper-styles/typography.js';
import '../../node_modules/@polymer/paper-dropdown-menu/paper-dropdown-menu.js';
import '../../node_modules/@polymer/paper-item/paper-item.js';
import '../../node_modules/@polymer/paper-toggle-button/paper-toggle-button.js';
import '../../node_modules/@polymer/iron-icons/iron-icons.js';
import './mist-networks-item.js';
import { Polymer } from '../../node_modules/@polymer/polymer/lib/legacy/polymer-fn.js';
import { html } from '../../node_modules/@polymer/polymer/lib/utils/html-tag.js';

Polymer({
  _template: html`
    <style include="shared-styles forms">
      :host {
        padding: 24px;
        border: 1px solid #eee;
        max-width: 100%;
        background-color: #f2f2f266;
      }

      :host > * {
        width: 100%;
      }

      paper-item.button-true {
        background-color: #2196f3 !important;
        font-weight: 500 !important;
        color: #fff !important;
        text-transform: uppercase;
      }

      paper-item.iron-selected {
        font-weight: normal;
      }

      paper-listbox {
        background: transparent;
        display: inline-block;
        vertical-align: top;
        max-height: 600px;
      }

      paper-input.search {
        padding-left: 16px;
        padding-right: 16px;
      }

      paper-checkbox {
        --paper-checkbox-checked-color: var(--mist-blue) !important;
        --paper-checkbox-checked-ink-color: var(--mist-blue) !important;
      }

      .fullwidth {
        width: 100%;
      }

      .title {
        text-transform: capitalize;
        font-weight: bold;
        margin-bottom: 16px;
      }

      *[secondary] {
        opacity: 0.54;
      }

      .selected {
        margin-top: 24px;
      }

      @media (max-width: 991px) {
        paper-listbox {
          padding: 38px 16px 16px 16px;
        }
      }
    </style>
    <div class="title">[[field.label]]</div>
    <div
      id$="app-form-[[id]]-[[field.name]]"
      class$="dropdown-block xs12 m12 [[field.class]] checkboxes"
      hidden$="[[field.hidden]]"
    >
      <div hidden$="[[field.options.length]]">
        <paper-item disabled="">No networks found</paper-item>
      </div>
      <template
        id="mist-networks-item-repeater"
        is="dom-repeat"
        items="[[field.options]]"
        as="option"
      >
        <mist-networks-item
          id$="[[option.id]]"
          network="[[option]]"
          can-configure="[[canConfigure]]"
          value="{{option.fieldValue}}"
          type="{{type}}"
          on-change="_itemChanged"
        ></mist-networks-item>
      </template>
    </div>
  `,

  is: 'mist-networks-field',

  properties: {
    field: {
      type: Object,
      notify: true,
    },
    selectedOptions: {
      type: Array,
      value: [],
    },
    canConfigure: {
      type: Boolean,
      computed: '_computeCanConfigure(field.canConfigure)',
    },
  },

  listeners: {
    'item-value-changed': '_updateValue',
  },

  observers: ['_fieldChanged(field, field.options, field.options.*)'],

  ready() {
    this.set('field.valid', !this.field.required);
  },

  _computeCanConfigure(_fieldCc) {
    if (!this.field) return false;
    return this.field.canConfigure;
  },

  _fieldChanged(_field) {
    this.set('selectedOptions', []);
    this.set('field.value', []);
    this.set('field.valid', !this.field.required);
    this.$['mist-networks-item-repeater'].render();
    this.dispatchEvent(new CustomEvent('item-value-changed'), {
      bubbles: true,
      composed: true,
    });
  },

  _itemChanged(e) {
    e.stopImmediatePropagation();

    console.log('item changed', e);

    const item = e.model.option;
    const elementId = e.model.option.id;
    const selectedOptionIndex = this.selectedOptions.findIndex(option => {
      return option.id === item.id;
    });
    let checked = '';
    if (
      this.shadowRoot.querySelector(`mist-networks-item[id="${elementId}"]`)
    ) {
      const el = this.shadowRoot.querySelector(
        `mist-networks-item[id="${elementId}"]`
      );
      ({ checked } = el);
    }

    // add network
    if (checked && selectedOptionIndex === -1) {
      this.push('selectedOptions', item);
    }
    // update network
    if (checked && selectedOptionIndex > -1) {
      this.splice('selectedOptions', selectedOptionIndex, 1, item);
    }
    // remove network
    if (!checked && selectedOptionIndex === -1) {
      this.splice('selectedOptions', selectedOptionIndex, 1);
    }

    this._updateValue();
  },

  _updateValue() {
    this.set(
      'field.value',
      this.selectedOptions.map(op => op.fieldValue)
    );
    this.set('field.valid', this._checkValidity());
  },

  _checkValidity() {
    const checkedItems = this.shadowRoot.querySelectorAll(
      'mist-networks-item[checked]'
    );
    const validItems = this.shadowRoot.querySelectorAll(
      'mist-networks-item[checked][valid]'
    );
    console.log(
      'check valid ',
      checkedItems.length,
      validItems.length,
      this.selectedOptions.length
    );
    if (!checkedItems) {
      return !this.field.required;
    }
    if (checkedItems && !validItems) {
      return false;
    }
    if (
      (checkedItems.length === validItems.length) ===
      this.selectedOptions.length
    ) {
      return true;
    }
    if (
      checkedItems.length !== validItems.length ||
      validItems.length !== this.selectedOptions.length ||
      checkedItems.length !== this.selectedOptions.length
    ) {
      return false;
    }
    return false;
  },
});
