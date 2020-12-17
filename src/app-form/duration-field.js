import '../../node_modules/@polymer/polymer/polymer-legacy.js';
import '../../node_modules/@polymer/paper-styles/typography.js';
import '../../node_modules/@polymer/paper-button/paper-button.js';
import '../../node_modules/@polymer/iron-icons/iron-icons.js';
import moment from '../../node_modules/moment/src/moment.js';
import { Polymer } from '../../node_modules/@polymer/polymer/lib/legacy/polymer-fn.js';
import { html } from '../../node_modules/@polymer/polymer/lib/utils/html-tag.js';

Polymer({
  _template: html`
    <style include="shared-styles dialogs">
      :host {
        padding: 0;
        margin: 0;
        display: block;
        overflow: visible;
      }
      iron-icon {
        color: inherit !important;
      }
      paper-input,
      paper-dropdown-menu {
        width: 50%;
        float: left;
      }
      paper-button.keyboard-focus {
        font-weight: bold !important;
      }
      paper-radio-button {
        display: inline;
      }
      paper-input {
        text-align: center;
        width: 40px;
      }
      paper-dropdown-menu {
        text-align: center;
        width: 130px;
      }

      .prefix,
      .suffix {
        float: left;
        position: relative;
        top: 10px;
        bot: 10px;
      }
      paper-checkbox {
        float: left;
        padding-top: 13px;
        margin-right: 0;
        --paper-checkbox-checked-color: var(--mist-blue) !important;
        --paper-checkbox-checked-ink-color: var(--mist-blue) !important;
      }
      :host([optional]) {
        padding-left: 16px;
      }
      .prefix {
        padding-right: 16px;
      }
    </style>

    <template is="dom-if" if="[[field.optional]]">
      <paper-checkbox
        id="checkbox"
        checked="{{field.defaultCheck}}"
        disabled="[[field.disabledCheck]]"
      ></paper-checkbox>
    </template>
    <template is="dom-if" if="[[field.prefixText]]">
      <span class="prefix">[[field.prefixText]]</span>
    </template>
    <paper-input
      id$="app-form-[[id]]-[[field.name]]-duration"
      placeholder="[[field.placeholder]]"
      label="[[field.label]]"
      validator="[[field.validator]]"
      value="{{span}}"
      auto-validate=""
      pattern="[[field.pattern]]"
      required="[[field.required]]"
      error-message="[[field.errorMessage]]"
      disabled="[[field.disabled]]"
      hidden$="[[field.hidden]]"
      type="number"
      min="1"
      max="[[_computeMax(field.max,unit,span)]]"
      no-label-float=""
    >
      <div suffix="" hidden$="[[!field.suffix]]" slot="suffix">
        [[field.suffix]]
      </div>
      <div prefix="" hidden$="[[!field.prefix]]" slot="prefix">
        [[field.prefix]]
      </div>
    </paper-input>
    <paper-dropdown-menu
      id$="app-form-[[id]]-[[field.name]]"
      class$="dropdown-block xs12 m6 [[field.class]]"
      auto-validate=""
      horizontal-align="left"
      disabled="[[field.disabled]]"
      hidden="[[field.hidden]]"
      required="[[field.required]]"
      no-label-float=""
    >
      <paper-listbox
        slot="dropdown-content"
        id$="app-form-[[id]]-[[field.name]]-duration-unit"
        attr-for-selected="value"
        selected="{{unit}}"
        class="dropdown-content"
      >
        <template
          id="durationRepeater"
          is="dom-repeat"
          items="[[field.options]]"
          as="option"
        >
          <paper-item
            value="[[option.val]]"
            disabled="[[_computeOptionDisabled(field.max,option)]]"
            >[[option.title]]</paper-item
          >
        </template>
      </paper-listbox>
    </paper-dropdown-menu>
    <template is="dom-if" if="[[field.suffixText]]">
      <span class="suffix">[[field.suffixText]].</span>
    </template>
  `,

  is: 'duration-field',

  properties: {
    id: {
      type: String,
      value: '',
    },
    field: {
      type: Object,
      notify: true,
    },
    span: {
      type: Number,
    },
    unit: {
      type: String,
    },
    showPlural: {
      type: Boolean,
    },
    checked: {
      type: Boolean,
      value: true,
      reflectToAttribute: true,
    },
    optional: {
      type: Boolean,
      value: false,
      reflectToAttribute: true,
    },
  },

  observers: [
    '_initialise(field)',
    '_checkedChanged(field.defaultCheck)',
    '_durationChanged(span, unit, field.valueType)',
    '_maxChanged(field.max)',
    '_optionalChanged(field.optional)',
  ],

  listeners: {},

  ready() {},

  _optionalChanged(optional) {
    this.set('optional', optional);
  },

  _maxChanged(fieldMax) {
    if (!fieldMax) return;
    if (fieldMax) {
      const max = this._secondsToDuration(this._computeMax(fieldMax));
      const unitsArr = [
        'seconds',
        'minutes',
        'hours',
        'days',
        'weeks',
        'months',
        'years',
      ];
      const threshold = unitsArr.indexOf(max.unit);
      if (unitsArr.indexOf(this.unit) < threshold) return;
      if (unitsArr.indexOf(this.unit) > threshold) {
        if (this.span < max.span) {
          this.set('unit', max.unit);
        } else if (threshold > 0) this.set('unit', unitsArr[threshold - 1]);
        else {
          this.span(1);
        }
      }
    }
  },

  _computeOptionDisabled(fieldMax, option) {
    if (fieldMax) {
      // allow max to also be a date
      const max = this._secondsToDuration(this._computeMax(fieldMax));
      const unitsArr = [
        'seconds',
        'minutes',
        'hours',
        'days',
        'weeks',
        'months',
        'years',
      ];
      // allow only smaller options than the maximum unit
      const threshold = unitsArr.indexOf(max.unit);
      return threshold < unitsArr.indexOf(option.val);
    }
    return false;
  },

  /* eslint-disable no-param-reassign */
  _computeMax(fieldMax, unit) {
    if (!fieldMax) return '';
    if (!unit) {
      unit = 'seconds';
    }
    // compute the max number allowed for each unit
    if (typeof fieldMax === 'number') {
      return this._secondsToUnitDuration(fieldMax, unit);
    }
    if (typeof fieldMax === 'string' && moment(fieldMax).isValid()) {
      // TODO: compute and set value if max is a date
      return this._secondsToUnitDuration(
        moment.utc(fieldMax).diff(moment(), 'seconds'),
        unit
      );
    }
    const duration = this._valueIsRelativeDuration(fieldMax);
    if (duration) {
      const durSpan = duration.span;
      const durUnit = duration.unit;
      return this._secondsToUnitDuration(
        this._durationToSeconds(durSpan, durUnit),
        unit
      );
    }
    return '';
  },
  /* eslint-enable no-param-reassign */

  _checkedChanged(defaultCheck) {
    // console.log('_checkedChanged',defaultCheck);
    if (defaultCheck) {
      this.set('field.disabled', false);
    } else if (defaultCheck === false) {
      this.set('field.disabled', true);
    }
    this._durationChanged();
  },

  _initialise(field) {
    // if default value exists, apply
    if (field.defaultValue) {
      let span;
      let unit;
      if (typeof field.defaultValue === 'number') {
        // is seconds
        span = this._secondsToDuration(field.defaultValue).span;
        unit = this._secondsToDuration(field.defaultValue).unit;
      } else if (typeof field.defaultValue === 'object') {
        // is period
        span = field.defaultValue.every;
        unit = field.defaultValue.period;
      } else if (typeof field.defaultValue === 'string') {
        if (moment(field.defaultValue).isValid()) {
          // is date
          // TODO: compute and set value if default is a date
          span = this._secondsToDuration(
            moment.utc(field.defaultValue).diff(moment(), 'seconds')
          ).span;
          unit = this._secondsToDuration(
            moment.utc(field.defaultValue).diff(moment(), 'seconds')
          ).unit;
        } else {
          // is relative duration
          const duration = this._valueIsRelativeDuration(field.defaultValue);
          if (duration) {
            span = duration.span;
            unit = duration.unit;
          }
        }
      }
      this.set('span', span);
      this.set('unit', unit);
    }
    this._durationChanged();
  },

  _valueIsRelativeDuration(value) {
    let span;
    let unit;
    const durationRegex = /([0-9]+)([mohdwy]{1,2})/;
    if (durationRegex.exec(value).length === 3) {
      [, span] = durationRegex.exec(value);
      [, , unit] = durationRegex.exec(value);

      if (unit === 'm') unit = 'minutes';
      if (unit === 'h') unit = 'hours';
      if (unit === 'd') unit = 'days';
      if (unit === 'w') unit = 'weeks';
      if (unit === 'mo') unit = 'months';
      if (unit === 'y') unit = 'years';

      return { span, unit };
    }
    return false;
  },

  /* eslint-disable no-param-reassign */
  _durationChanged(span, unit, type) {
    this.shadowRoot.querySelector('paper-input').validate();
    // this._computePlurals(span);
    const emptyValue = this.field.optional && !this.field.defaultCheck;
    if (this.span && this.unit && this.field.valueType) {
      let newValue = '';
      span = span || this.span;
      unit = unit || this.unit;
      type = type || this.field.valueType;
      if (type === 'secs') {
        newValue = emptyValue ? 0 : this._durationToSeconds(span, unit);
      } else if (type === 'period') {
        newValue = { every: span, period: unit };
      } else if (type === 'date') {
        newValue = emptyValue
          ? ''
          : moment().add(span, unit).utc().format('YYYY-MM-DD HH:mm:ss');
      } else if (type === 'relative') {
        const relativeUnit =
          ['mo'].indexOf(unit) >= -1
            ? unit.substring(0, 2)
            : unit.substring(0, 1);
        newValue = emptyValue ? '' : `${span}${relativeUnit}`;
      }
      this.set('field.value', newValue);
      this.notifyPath('field.value');
      this.dispatchEvent(
        new CustomEvent('fields-changed', {
          bubbles: true,
          composed: true,
          detail: {
            fieldname: this.field.name,
            parentfield: this.field.parentfield,
            file: 'duration-field.html',
          },
        })
      );

      this.validate();
    } else {
      this.set('field.valid', false);
    }
  },
  /* eslint-enable no-param-reassign */

  validate() {
    const valid = !this.shadowRoot.querySelector('paper-input').invalid;
    this.set('field.valid', valid);
  },

  _durationToSeconds(span, unit) {
    let step = 1;
    if (unit === 'months') {
      // special case
      return moment().add(span, unit).diff(moment(), 'seconds');
    }
    if (unit === 'minutes') {
      step = 60;
    } else if (unit === 'hours') {
      step = 3600;
    } else if (unit === 'days') {
      step = 3600 * 24;
    } else if (unit === 'weeks') {
      step = 3600 * 24 * 7;
    }
    return span * step;
  },

  _secondsToDuration(seconds) {
    // turn seconds to duration
    // TODO: duration in seconds is always a product of 60 (*60 (*24 (*7))) for minutes hours days and weeks,
    // but amount of months in secs is not directly tracable because of differentiations in month days.
    let span;
    let unit;
    if (
      seconds % (3600 * 24 * 28) === 0 ||
      seconds % (3600 * 24 * 29) === 0 ||
      seconds % (3600 * 24 * 30) === 0 ||
      seconds % (3600 * 24 * 31) === 0
    ) {
      if (seconds % (3600 * 24 * 28) === 0) span = seconds / (3600 * 24 * 28);
      if (seconds % (3600 * 24 * 29) === 0) span = seconds / (3600 * 24 * 29);
      if (seconds % (3600 * 24 * 30) === 0) span = seconds / (3600 * 24 * 30);
      if (seconds % (3600 * 24 * 31) === 0) span = seconds / (3600 * 24 * 31);
      unit = 'months';
    } else if (seconds % (3600 * 24 * 7) === 0) {
      span = seconds / (3600 * 24 * 7);
      unit = 'weeks';
    } else if (seconds % (3600 * 24) === 0) {
      span = seconds / (3600 * 24);
      unit = 'days';
    } else if (seconds % 3600 === 0) {
      span = seconds / 3600;
      unit = 'hours';
    } else if (seconds % 60 === 0) {
      span = seconds / 60;
      unit = 'minutes';
    } // if nothing divides exactly, try an approximation
    if (seconds > 3600 * 24 * 28) {
      span = Math.floor(seconds / (3600 * 24 * 28));
      unit = 'months';
    } else if (seconds > 3600 * 24 * 7) {
      span = Math.floor(seconds / (3600 * 24 * 7));
      unit = 'weeks';
    } else if (seconds > 3600 * 24) {
      span = Math.floor(seconds / (3600 * 24));
      unit = 'days';
    } else if (seconds > 3600) {
      span = Math.floor(seconds / 3600);
      unit = 'hours';
    } else if (seconds > 60) {
      span = Math.floor(seconds / 60);
      unit = 'minutes';
    } else {
      span = seconds;
      unit = 'seconds';
    }
    return { span, unit };
  },

  _secondsToUnitDuration(seconds, unit) {
    // turn seconds to amount of set units (months, weeks, days, hours, minutes)
    // TODO: as above, amount of seconds depends on monthdays, which differentiate accross months
    let step = 1;
    if (unit === 'months') {
      step = 3600 * 24 * moment().daysInMonth();
    } else if (unit === 'weeks') {
      step = 3600 * 24 * 7;
    } else if (unit === 'days') {
      step = 3600 * 24;
    } else if (unit === 'hours') {
      step = 3600;
    } else if (unit === 'minutes') {
      step = 60;
    } else if (unit === 'seconds') {
      step = 1;
    }
    const span = Math.floor(seconds / step);
    return span;
  },

  _computePlurals(valueSpan) {
    if (
      (valueSpan === 1 && this.showPlural) ||
      (valueSpan > 1 && !this.showPlural)
    ) {
      this.set('showPlural', valueSpan > 1);
      this._updateOptionTitles(this.showPlural);
    }
  },

  _updateOptionTitles(plurals) {
    const newOptions = [];
    let newTitle;
    for (let i = 0; i < this.field.options.length; i++) {
      const option = this.field.options[i];
      if (plurals) {
        newTitle = option.val;
      } else {
        newTitle = option.val.substring(0, option.val.length - 1);
      }
      newOptions.push({ val: option.val, title: newTitle });
    }
    this.set('field.options', newOptions);
    // this.notifyPath('field.options');
    // this.shadowRoot.querySelector('#durationRepeater').render();
  },
});
