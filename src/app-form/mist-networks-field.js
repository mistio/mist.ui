import '../../../../@polymer/polymer/polymer-legacy.js';
import '../../../../@polymer/paper-material/paper-material.js';
import '../../../../@polymer/paper-button/paper-button.js';
import '../../../../@polymer/paper-checkbox/paper-checkbox.js';
import '../../../../@polymer/paper-styles/typography.js';
import '../../../../@polymer/paper-dropdown-menu/paper-dropdown-menu.js';
import '../../../../@polymer/paper-item/paper-item.js';
import '../../../../@polymer/paper-toggle-button/paper-toggle-button.js';
import '../../../../@polymer/iron-icons/iron-icons.js';
import './mist-networks-item.js';
import { Polymer } from '../../../../@polymer/polymer/lib/legacy/polymer-fn.js';
import { html } from '../../../../@polymer/polymer/lib/utils/html-tag.js';
Polymer({
  _template: html`
        <style include="shared-styles forms">
         :host {
            padding: 24px;
            border: 1px solid #eee;
            max-width: 100%;
            background-color: #f2f2f266;
        }

         :host>* {
            width: 100%;
        }

        paper-item.button-true {
            background-color: #2196F3 !important;
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
            opacity: .54;
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
        <div id\$="app-form-[[id]]-[[field.name]]" class\$="dropdown-block xs12 m12 [[field.class]] checkboxes" hidden\$="[[field.hidden]]">
            <div hidden\$="[[field.options.length]]">
                <paper-item disabled="">No networks found</paper-item>
            </div>
            <template id="mist-networks-item-repeater" is="dom-repeat" items="[[field.options]]" as="option">
                <mist-networks-item id\$="[[option.id]]" network="[[option]]" can-configure="[[canConfigure]]" value="{{option.fieldValue}}" type="{{type}}" on-change="_itemChanged"></mist-networks-item>
            </template>
        </div>
`,

  is: 'mist-networks-field',

  properties: {
      field: {
          type: Object,
          notify: true
      },
      selectedOptions: {
          type: Array,
          value: []
      },
      canConfigure: {
          type: Boolean,
          computed: '_computeCanConfigure(field.canConfigure)'
      }
  },

  listeners: {
      'item-value-changed' : '_updateValue'
  },

  observers: [
      '_fieldChanged(field, field.options, field.options.*)'
  ],

  ready: function() {
      this.set('field.valid', !this.field.required);
  },

  _computeCanConfigure: function(fieldCc) {
      if (!this.field)
          return false;
      return this.field.canConfigure;
  },

  _fieldChanged: function(field) {
      this.set('selectedOptions', []);
      this.set('field.value', []);
      this.set('field.valid', !this.field.required);
      this.$['mist-networks-item-repeater'].render();
      this.dispatchEvent(new CustomEvent('item-value-changed'), { bubbles: true, composed: true });
  },

  _itemChanged: function(e) {
      e.stopImmediatePropagation();

      console.log("item changed", e);
      
      var item = e.model.option,
          elementId = e.model.option.id;

      var selectedOptionIndex = this.selectedOptions.findIndex(function(option){return option.id == item.id});

      if (this.shadowRoot.querySelector('mist-networks-item[id="'+elementId+'"]')) {
          var el = this.shadowRoot.querySelector('mist-networks-item[id="'+elementId+'"]'),
              checked = el.checked,
              valid = el.valid;
      }

      // add network
      if (checked && selectedOptionIndex == -1) {
          this.push('selectedOptions', item);
      }
      // update network
      if (checked && selectedOptionIndex > -1) {
          this.splice('selectedOptions', selectedOptionIndex, 1, item);
      }
      // remove network
      if (!checked && selectedOptionIndex == -1) {
          this.splice('selectedOptions', selectedOptionIndex, 1);
      }

      this._updateValue();
  },

  _updateValue: function() {
      this.set('field.value', this.selectedOptions.map(op => op.fieldValue));
      this.set('field.valid', this._checkValidity());
  },

  _checkValidity: function() {
      var checkedItems = this.shadowRoot.querySelectorAll('mist-networks-item[checked]'),
          validItems = this.shadowRoot.querySelectorAll('mist-networks-item[checked][valid]');
      console.log('check valid ', checkedItems.length, validItems.length, this.selectedOptions.length)
      if (!checkedItems){
          return !this.field.required;
      }
      if (checkedItems && !validItems){
          return false;
      }
      if (checkedItems.length == validItems.length == this.selectedOptions.length) {
          return true;
      }
      if (checkedItems.length != validItems.length || validItems.length != this.selectedOptions.length || checkedItems.length != this.selectedOptions.length) {
          return false;
      }            
  }
});
