import '../../node_modules/@polymer/polymer/polymer-legacy.js';
import '../../node_modules/@polymer/paper-styles/typography.js';
import '../../node_modules/@polymer/paper-button/paper-button.js';
import '../../node_modules/@polymer/paper-input/paper-input.js';
import '../../node_modules/@polymer/paper-input/paper-textarea.js';
import '../../node_modules/@polymer/iron-icons/iron-icons.js';
import '../helpers/dialog-element.js';
import { Polymer } from '../../node_modules/@polymer/polymer/lib/legacy/polymer-fn.js';
import { html } from '../../node_modules/@polymer/polymer/lib/utils/html-tag.js';

Polymer({
  _template: html`
    <style include="shared-styles forms">
      :host {
        margin-bottom: 40px;
      }
      paper-input {
        width: 30%;
        display: inline-block;
      }
      paper-button,
      .remove {
        display: inline-block;
      }
      .remove paper-button {
        padding: 0;
        font-size: 0.87em;
        opacity: 0.54;
      }
      .sub {
        padding-top: 24px;
        font-size: 0.9em;
        color: rgba(0, 0, 0, 0.54);
        font-style: italic;
      }
      #inputs {
        margin-bottom: 24px;
      }
      iron-icon {
        margin-top: -3px;
      }
      paper-button {
        margin-bottom: 4px !important;
        margin-right: 8px !important;
      }
    </style>
    <template is="dom-if" if="[[!inputsArray.length]]">
      <p class="sub">No whitelisted IPs. Access your account from any IP.</p>
    </template>
    <div id="inputs">
      <template is="dom-repeat" items="[[inputsArray]]">
        <div class="input">
          <paper-input
            label="[[inputLabel]]"
            value="{{item.cidr}}"
          ></paper-input>
          <paper-input
            label="description"
            value="{{item.description}}"
            hidden$="[[!withDescription]]"
          ></paper-input>
          <div class="remove">
            <paper-button on-tap="removeInput"
              ><iron-icon icon="clear"></iron-icon>remove</paper-button
            >
          </div>
        </div>
      </template>
    </div>
    <paper-button class="blue smaller" on-tap="addInput"
      ><iron-icon icon="add"></iron-icon> Add [[inputLabel]]</paper-button
    >
    <paper-button
      id="add_current_ip"
      class="blue smaller"
      on-tap="addCurrentIP"
      hidden$="[[!showAddDefaultInput]]"
      >Add your current IP: [[defaultInput]]</paper-button
    >

    <dialog-element id="confirmRemove"></dialog-element>
  `,

  is: 'multi-inputs',

  properties: {
    defaultInput: {
      type: Object,
    },
    showAddDefaultInput: {
      type: Boolean,
      reflectToAttribute: true,
    },
    inputsArray: {
      type: Array,
      notify: true,
    },
    inputLabel: {
      type: String,
    },
    withDescription: {
      type: Boolean,
      reflectToAttribute: true,
    },
    withConfirmRemove: {
      type: Boolean,
      reflectToAttribute: true,
    },
    eventName: {
      type: String,
    },
    toRemove: {
      type: Number,
    },
  },

  listeners: {
    confirmation: '_confirmRemove',
  },

  observers: ['inputsArrayChanged(inputsArray)'],

  inputsArrayChanged(_inputsArray) {
    // console.log('inputsArray',inputsArray);
  },

  addInput(_e) {
    const obj = {};
    obj[this.inputLabel] = '';
    if (this.withDescription) obj.description = '';
    this.push('inputsArray', obj);
  },

  removeInput(e) {
    // console.log('removeInput',e.model.index);
    const inputValue = this.get(
      `inputsArray.${e.model.index}.${this.inputLabel}`
    );
    if (this.withConfirmRemove !== true || inputValue === '') {
      this.splice('inputsArray', e.model.index, 1);
    } else {
      this.set('toRemove', e.model.index);
      this._showDialog({
        title: `Remove ${this.inputLabel}`,
        body: `This cannot be undone. You will need to manually re-add ${inputValue} if you need so.`,
        reason: 'input.remove',
        action: `Remove ${this.inputLabel}`,
      });
    }
  },

  _showDialog(info) {
    const dialog = this.shadowRoot.querySelector('#confirmRemove');
    if (info) {
      Object.keys(info).forEach(i => {
        dialog[i] = info[i];
      });
    }
    dialog._openDialog();
  },

  _confirmRemove(e) {
    // console.log('_confirmRemove',e);
    const { reason } = e.detail;
    const { response } = e.detail;

    if (response.confirmed === 'confirm' && reason === 'input.remove') {
      this.splice('inputsArray', this.toRemove, 1);
      this.set('toRemove', null);
    }
  },

  saveInputs(_e) {
    this.dispatchEvent(
      new CustomEvent(this.eventName, {
        bubbles: true,
        composed: true,
        detail: { inputs: this.inputsArray },
      })
    );
  },

  addCurrentIP(_e) {
    this.dispatchEvent(
      new CustomEvent('add-current', { bubbles: true, composed: true })
    );
  },
});
