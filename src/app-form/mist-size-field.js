import '@polymer/polymer/polymer-legacy.js';
import '@polymer/paper-material/paper-material.js';
import '@polymer/paper-button/paper-button.js';
import '@polymer/paper-styles/typography.js';
import '@polymer/paper-dropdown-menu/paper-dropdown-menu.js';
import '@polymer/paper-item/paper-item.js';
import '@polymer/paper-input/paper-input.js';
import '@polymer/iron-icons/iron-icons.js';
import '@polymer/paper-slider/paper-slider.js';
import '@polymer/paper-listbox/paper-listbox.js';
import 'js-md5/src/md5.js';
import { Polymer } from '@polymer/polymer/lib/legacy/polymer-fn.js';
import { html } from '@polymer/polymer/lib/utils/html-tag.js';

Polymer({
  _template: html`
    <style include="shared-styles forms">
      :host > * {
        width: 100%;
      }

      paper-item.button-true {
        text-transform: uppercase;
      }
      paper-item.button-true.iron-selected {
        background-color: #2196f3 !important;
        color: #fff;
      }
      paper-slider {
        --paper-slider-input: {
          width: 90px;
        }
      }
      paper-slider ::slotted(#input) {
        width: 70px;
      }
      paper-input.search {
        padding-left: 16px;
        padding-right: 16px;
      }
      .label:first-of-type {
        margin-top: 24px;
      }
    </style>

    <paper-dropdown-menu
      label="[[field.label]]"
      horizontal-align="left"
      disabled="[[field.disabled]]"
      required="[[field.required]]"
      hidden$="[[_hideDropdown(field.options,field)]]"
      no-animations=""
    >
      <div slot="dropdown-content" class="dropdown-content">
        <paper-input
          class="search"
          label$="Search [[field.name]]s"
          value="{{field.search}}"
          data-options$="[[field.name]]"
        ></paper-input>
        <paper-listbox
          slot="dropdown-content"
          attr-for-selected="value"
          selected="{{field.value}}"
          class="dropdown-content"
        >
          <template
            is="dom-if"
            if="[[_noOptions(field.options.length)]]"
            restamp=""
          >
            <paper-item disabled="">No sizes found</paper-item>
          </template>
          <template is="dom-if" if="[[field.custom]]" restamp="">
            <paper-item value="custom" class="button-true"
              >Custom Size</paper-item
            >
          </template>
          <template
            is="dom-repeat"
            items="[[_filter(allowedSizes, field.search)]]"
            as="option"
          >
            <paper-item value="[[option.id]]" disabled$="[[option.disabled]]">
              <span class="flex">[[showOption(option)]]</span>
            </paper-item>
          </template>
        </paper-listbox>
      </div>
    </paper-dropdown-menu>
    <template
      is="dom-if"
      if="[[_showCustomSizeFields(field.custom, field.value)]]"
      restamp=""
    >
      <template is="dom-repeat" items="{{field.customSizeFields}}">
        <div class="label" hidden="[[item.hidden]]">
          [[item.label]]
          <span class="field-helptext"
            >min [[item.min]], max [[item.max]] [[item.unit]]</span
          >
        </div>
        <paper-slider
          id$="[[id]]-[[field.name]]-[[item.name]]"
          disabled="[[item.disabled]]"
          hidden="[[item.hidden]]"
          min="[[item.min]]"
          max="[[item.max]]"
          value="{{item.value}}"
          step="[[item.step]]"
          pin=""
          snaps=""
          editable=""
        ></paper-slider>
      </template>
    </template>
  `,

  is: 'mist-size-field',

  properties: {
    id: {
      type: String,
    },
    field: {
      type: Object,
      notify: true,
    },
    allowedSizes: {
      type: Array,
    },
  },

  listeners: {
    change: '_updateCustomValue',
  },

  observers: [
    '_updateCustomValue(field.customSizeFields.*, field.value)',
    '_updateAllowedSizes(field.options)',
    '_valueChanged(field.customValue, field.value)',
  ],
  showOption(option) {
    if (option.name) return option.name;
    if (option.id) return option.id;
    return '';
  },

  _showCustomSizeFields(_custom, _value) {
    return (
      this.field.custom && (!this.field.value || this.field.value === 'custom')
    );
  },

  _replaceAsterisk(str) {
    return str.replace(/_/g, ' ').replace('*', '').replace('id', '').trim();
  },

  _hideDropdown(_options, field) {
    return (
      field.custom === true &&
      (!this.field.options || this.field.options.length === 0)
    );
  },

  _noOptions(_options) {
    return !this.field.options || this.field.options.length === 0;
  },

  _allowCustom(field) {
    return (
      field.custom === true || !this.field.options || !this.field.options.length
    );
  },
  _valueChanged() {
    const value =
      this.field.value === 'custom' ? this.field.customValue : this.field.value;
    this.dispatchEvent(
      new CustomEvent('value-changed', {
        bubbles: true,
        composed: true,
        detail: {
          value,
        },
      })
    );
  },
  _updateCustomValue(_e) {
    if (
      this.field &&
      this.field.value &&
      typeof this.field.value === 'string' &&
      this.field.value.includes('customSize')
    ) {
      this.field.custom = true;
      const option = this.field.options.find(
        opt => opt.id === this.field.value
      );
      this.set('field.customValue', option);
    } else if (!this.field.custom && typeof this.field === 'object') {
      this.set('field.customValue', false);
    } else if (this.field.custom && this.field.customSizeFields) {
      const cv = {};
      for (let i = 0; i < this.field.customSizeFields.length; i++) {
        cv[this.field.customSizeFields[i].name] = this.field.customSizeFields[
          i
        ].value;
      }
      this.set('field.customValue', cv);
    }
  },
  _resetField() {
    this.set('field.value', this.field.defaultValue);
  },
  _nameContainsStr(name, string) {
    // Check if name contains any of the values in an array.
    // If second parameter is a single value, convert to array
    const strArray = Array.isArray(string) ? string : [string];
    return strArray.some(
      str => name.toLowerCase().indexOf(str.toLowerCase()) > -1
    );
  },
  _allowedInOption(allowed, option) {
    // A user can only give part of a name in the allowed/not_allowed constraints
    // the way they would do when searching
    return (
      allowed.includes(option.id) ||
      allowed.includes(option.external_id) ||
      this._nameContainsStr(option.name, allowed)
    );
  },
  /* eslint-disable no-param-reassign */
  _updateAllowedSizes(options) {
    if (this.field.allowed == null && this.field.not_allowed == null) {
      this.set('allowedSizes', options);
      return;
    }
    let allowed;
    if (this.field.allowed != null) {
      allowed =
        Object.keys(this.field.allowed).length > 0 ? this.field.allowed : [];
    }
    const notAllowed = this.field.not_allowed ? this.field.not_allowed : null;
    const allowedCustom = [];
    if (allowed) {
      allowed = allowed.filter(size => {
        if (typeof size !== 'string') {
          allowedCustom.push(size);
          return false;
        }
        return true;
      });
    }
    if (allowedCustom.length > 0 && this.field.options.length === 0) {
      allowedCustom.forEach(size => {
        size.name = `CPU: ${size.cpu} cores, RAM: ${size.ram} MB`;
        let toHash = `${size.ram}${size.cpu}`;
        if (size.disk_primary > 0) {
          size.name += `, Disk: ${size.disk_primary} GB`;
          toHash += `${size.disk_primary}`;
        }
        if (size.userFriendlyName) {
          size.name = `${size.userFriendlyName} (${size.name})`;
        }
        // eslint-disable-next-line no-undef
        size.id = `customSize${md5(toHash)}`;
        this.push('field.options', size);
      });
      this.set('allowedSizes', this.field.options);
      return;
    }
    if (allowed) {
      this.set(
        'allowedSizes',
        options.filter(option => this._allowedInOption(allowed, option))
      );
      return;
    }
    if (notAllowed) {
      this.set(
        'allowedSizes',
        options.filter(option => !this._allowedInOption(notAllowed, option))
      );
      return;
    }
    this.set('allowedSizes', options);
  },
  /* eslint-enable no-param-reassign */
  _filter(options, search) {
    return options
      ? this._sort(
          options.filter(
            op => op.name && (!search || this._nameContainsStr(op.name, search))
          )
        )
      : [];
  },

  _sort(arr) {
    if (arr && arr.length)
      return arr.sort((a, b) => {
        if (a.cpus < b.cpus) {
          return -1;
        }
        if (a.cpus > b.cpus) {
          return 1;
        }
        return 0;
      });
    return [];
  },
});
