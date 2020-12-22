import '../../node_modules/@polymer/polymer/polymer-legacy.js';
import '../../node_modules/@polymer/paper-styles/typography.js';
import '../../node_modules/@polymer/paper-button/paper-button.js';
import '../../node_modules/@polymer/neon-animation/animations/scale-up-animation.js';
import '../../node_modules/@polymer/neon-animation/animations/fade-out-animation.js';
import '../../node_modules/@polymer/paper-dialog/paper-dialog.js';
import '../../node_modules/@polymer/paper-dialog-scrollable/paper-dialog-scrollable.js';
import { MistListActionsBehavior } from '../../node_modules/@mistio/mist-list/mist-list-actions-behavior.js';
import '../app-form/app-form.js';
import { Polymer } from '../../node_modules/@polymer/polymer/lib/legacy/polymer-fn.js';
import { html } from '../../node_modules/@polymer/polymer/lib/utils/html-tag.js';

Polymer({
  _template: html`
    <style include="shared-styles dialogs forms">
      vaadin-dialog {
        max-width: 450px;
      }
      vaadin-dialog h2 {
        text-transform: capitalize;
      }
      p.margin {
        margin: 16px 0 !important;
      }
      ul {
        padding-left: 18px;
        color: rgba(0, 0, 0, 0.54);
        font-size: 16px;
      }
    </style>

    <vaadin-dialog id="dialogModal" theme="mist-dialog" with-backdrop="">
      <style>
        h2::first-letter {
          text-transform: capitalize;
        }
      </style>
      <template>
        <h2>[[title]]</h2>
        <div class="paper-dialog-scrollable">
          <div hidden$="[[hideText]]">
            <p>[[body]]</p>
            <ul hidden$="[[!list]]">
              <template is="dom-repeat" items="[[list]]">
                <li>[[item]]</li>
              </template>
            </ul>
            <p hidden$="[[!alert]]" class="margin">
              <strong>[[alert]]</strong>
            </p>
            <p hidden$="[[!subscript]]">[[subscript]]</p>
          </div>
          <template is="dom-if" if="[[fields]]" restamp="">
            <app-form
              id="{{formId}}"
              form="{{form}}"
              fields="{{fields}}"
              display-buttons="[[_calcDisplayButtons()]]"
              single-column="[[singleColumnForm]]"
              inline="[[inline]]"
            ></app-form>
          </template>
        </div>
        <div
          hidden$="[[!_computeType(type, 'isYesNo')]]"
          class="clearfix btn-group"
        >
          <paper-button
            hidden$="[[danger]]"
            class$="link [[btnClass]]"
            on-tap="_dismissDialog"
          >
            <span hidden$="[[!undo]]"> [[undo]] </span>
            <span hidden$="[[undo]]"> Cancel </span>
          </paper-button>
          <paper-button
            hidden$="[[danger]]"
            disabled$="[[!formValid]]"
            class$="blue [[btnClass]]"
            dialog-confirm=""
            on-tap="_closeDialog"
          >
            <span hidden$="[[action]]"> Proceed </span>
            <span hidden$="[[!action]]">[[action]]</span>
          </paper-button>
          <paper-button
            hidden$="[[!danger]]"
            class$="[[btnClass]]"
            on-tap="_dismissDialog"
          >
            <span hidden$="[[!undo]]"> [[undo]] </span>
            <span hidden$="[[undo]]"> Cancel </span>
          </paper-button>
          <paper-button
            hidden$="[[!danger]]"
            class$="red [[btnClass]]"
            dialog-confirm=""
            on-tap="_closeDialog"
          >
            <span hidden$="[[action]]"> Delete </span>
            <span hidden$="[[!action]]">[[action]]</span>
          </paper-button>
        </div>
      </template>
    </vaadin-dialog>
  `,

  is: 'dialog-element',
  behaviors: [MistListActionsBehavior],

  properties: {
    title: {
      type: String,
      value: null,
    },
    body: {
      type: String,
      value: null,
    },
    type: {
      type: String,
      value: 'isYesNo',
    },
    danger: {
      type: Boolean,
      value: false,
    },
    reason: {
      type: String,
      value: null,
    },
    action: {
      type: String,
      value: null,
    },
    alert: {
      type: String,
      value: false,
    },
    subscript: {
      type: String,
      value: false,
    },
    undo: {
      type: String,
      value: false,
    },
    list: {
      type: Array,
    },
    fields: {
      type: Array,
    },
    hideText: {
      type: Boolean,
      value: false,
    },
    modal: {
      type: Boolean,
    },
    singleColumnForm: {
      type: Boolean,
      value: true,
      reflectToAttribute: true,
    },
    inline: {
      type: Boolean,
      reflectToAttribute: true,
    },
    formId: {
      type: String,
      value: '',
      reflectToAttribute: true,
    },
    btnClass: {
      type: String,
      value: '',
    },
    formValid: {
      type: Boolean,
      value: true,
    },
  },

  _computeType(type, value) {
    return type === value;
  },

  _openDialog(_e) {
    this.$.dialogModal.opened = true;
  },

  _closeDialog(e) {
    this.$.dialogModal.opened = false;
    this._modalClosed(e);
  },

  _modalClosed(_e) {
    // var normalizedEvent = Polymer.dom(e);
    // if (e.target.id == 'dialogModal') {
    // console.log(this.$.dialogModal.closingReason);
    this.dispatchEvent(
      new CustomEvent('confirmation', {
        bubbles: true,
        composed: true,
        detail: {
          response: 'confirm',
          confirmed: true,
          reason: this.reason,
        },
      })
    );
    // }
  },

  _calcDisplayButtons() {
    return false;
  },
});
