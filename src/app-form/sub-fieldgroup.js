import './app-form.js';
import '../../node_modules/@polymer/paper-toggle-button/paper-toggle-button.js';
import { Polymer } from '../../node_modules/@polymer/polymer/lib/legacy/polymer-fn.js';
import { html } from '../../node_modules/@polymer/polymer/lib/utils/html-tag.js';

Polymer({
  _template: html`
    <style include="shared-styles forms">
      :host {
        display: inline-block;
        width: 50%;
      }
      :host([enabled]) {
        background-color: #f6f6f6;
        border-radius: 5px;
      }
      :host([optional]) app-form {
        margin-top: 0;
        padding-bottom: 24px;
      }

      :host([enabled]) span.title {
        font-weight: 500;
      }
      paper-toggle-button {
        margin-top: 16px;
        margin-bottom: 16px;
      }
    </style>
    <template is="dom-if" if="[[field.optional]]" restamp="">
      <paper-toggle-button
        id$="[[id]]-[[field.name]]-toggler"
        checked="{{enabled}}"
        disabled="[[_computeDisabled(field.toggleDisabled)]]"
      >
        <span class="title">[[field.label]]</span>
      </paper-toggle-button>
    </template>
    <template is="dom-if" if="[[_showForm(field.optional,enabled)]]" restamp="">
      <template is="dom-if" if="[[field.loader]]" restamp="">
        <div class="spinner-wrapper">
          <paper-spinner active="[[field.loader]]"></paper-spinner>
        </div>
      </template>
      <app-form
        id$="sub-fieldgroup-[[id]]"
        fields="{{field.subfields}}"
        display-buttons="[[_calcDisplayButtons()]]"
        single-column="[[field.singleColumn]]"
        inline="[[field.inline]]"
        hidden$="[[field.loader]]"
      ></app-form>
    </template>
  `,

  is: 'sub-fieldgroup',

  /**
   * Fired when a response is received.
   *
   * @event response
   */
  /**
   * Fired when a request is made.
   *
   * @event request
   */
  /**
   * Fired when the leadValue is changed.
   *
   * @event leadchange
   */
  properties: {
    id: {
      type: String,
    },
    field: {
      type: Object,
      notify: true,
    },
    optional: {
      type: Boolean,
      reflectToAttribute: true,
    },
    listeners: {
      'subform-fields-changed': '_subfieldsChanged',
    },
    enabled: {
      type: Boolean,
      value: false,
      reflectToAttribute: true,
      observer: '_enabledChanged',
    },
    singleColumnForm: {
      type: Boolean,
      reflectToAttribute: true,
    },
    inline: {
      type: Boolean,
      reflectToAttribute: true,
    },
  },

  observers: ['_fieldChanged(field)', '_subfieldsChanged(field.subfields.*)'],

  _enabledChanged(_enabled) {
    this.set('field.enabled', this.enabled);
    if (!this.enabled) {
      this._resetValue();
    } else {
      this.dispatchEvent(
        new CustomEvent('subfield-enabled', {
          bubbles: true,
          composed: true,
          detail: { field: this.field },
        })
      );
    }
  },

  _resetValue() {
    // console.log('reset field value');
    this.set('field.value', {});
  },

  _computeDisabled(_disabled) {
    return !!this.field.toggleDisabled;
  },

  _fieldChanged(_field) {
    this.set('enabled', this.field.defaultToggleValue);
    this.set('optional', this.field.optional);
    this._fieldsChangedNotifyEvent();
  },

  _subfieldsChanged(_subfields) {
    // console.log('sub fields changed', subfields);
    if (this.field && this.enabled) {
      let fieldValue = {};
      if (!this.field.flatten) {
        for (let i = 0; i < this.field.subfields.length; i++) {
          fieldValue[this.field.subfields[i].name] = this.field.subfields[
            i
          ].value;
          if (this.field.subfields[i].type === 'list') {
            const list = this.field.subfields[i];
            const subformPayload = [];
            if (list && list.items.length) {
              for (let k = 0; k < list.items.length; k++) {
                const o = {};
                for (let j = 0; j < list.items[k].length; j++) {
                  o[list.items[k][j].name] = list.items[k][j].value;
                }
                subformPayload.push(o);
              }
            }
            fieldValue[list.name] = subformPayload;
          }
        }
      } else {
        fieldValue = this.field.subfields[0].value;
      }
      this.set('field.value', fieldValue);
      if (this.shadowRoot.querySelector('app-form') && !this.field.flatten) {
        this.shadowRoot.querySelector('app-form').form = fieldValue;
      }
    } else if (!this.enabled) {
      this.set('field.value', {});
    }

    this.notifyPath('field.value');
    this._fieldsChangedNotifyEvent();
  },

  _fieldsChangedNotifyEvent() {
    this.dispatchEvent(
      new CustomEvent('fields-changed', {
        bubbles: true,
        composed: true,
        detail: { fieldname: this.field.name, file: 'sub-fieldgroup.html' },
      })
    );
  },

  _calcDisplayButtons() {
    return false;
  },

  _showForm(optional, enabled) {
    return optional ? enabled : true;
  },
});
