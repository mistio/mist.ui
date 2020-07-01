import '../../../../@polymer/polymer/polymer-legacy.js';
import '../../../../@polymer/paper-styles/typography.js';
import '../../../../@polymer/paper-button/paper-button.js';
import '../../../../@polymer/paper-input/paper-input.js';
import '../../../../@polymer/paper-input/paper-textarea.js';
import '../../../../@polymer/iron-icons/iron-icons.js';
import '../helpers/dialog-element.js';
import { Polymer } from '../../../../@polymer/polymer/lib/legacy/polymer-fn.js';
import { html } from '../../../../@polymer/polymer/lib/utils/html-tag.js';
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
            paper-button, .remove {
                display: inline-block;   
            }
            .remove paper-button {
                padding: 0;
                font-size: 0.87em;
                opacity: .54;
            }
            .sub {
                padding-top: 24px;
                font-size: 0.9em;
                color: rgba(0,0,0,0.54);
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
                    <paper-input label="[[inputLabel]]" value="{{item.cidr}}"></paper-input>
                    <paper-input label="description" value="{{item.description}}" hidden\$="[[!withDescription]]"></paper-input>
                    <div class="remove"><paper-button on-tap="removeInput"><iron-icon icon="clear"></iron-icon>remove</paper-button></div>
                </div>
            </template>
        </div>
        <paper-button class="blue smaller" on-tap="addInput"><iron-icon icon="add"></iron-icon> Add [[inputLabel]]</paper-button>
        <paper-button id="add_current_ip" class="blue smaller" on-tap="addCurrentIP" hidden\$="[[!showAddDefaultInput]]">Add your current IP: [[defaultInput]]</paper-button>

        <dialog-element id="confirmRemove"></dialog-element>
`,

  is: 'multi-inputs',

  properties: {
      defaultInput: {
          type: Object
      },
      showAddDefaultInput: {
          type: Boolean,
          reflectToAttribute: true
      },
      inputsArray: {
          type: Array,
          notify: true
      },
      inputLabel: {
          type: String
      },
      withDescription: {
          type: Boolean,
          reflectToAttribute: true
      },
      withConfirmRemove: {
          type: Boolean,
          reflectToAttribute: true
      },
      eventName: {
          type: String
      },
      toRemove: {
          type: Number
      }
  },

  listeners: {
      'confirmation': '_confirmRemove',
  },

  observers:[
      'inputsArrayChanged(inputsArray)'
  ],

  inputsArrayChanged: function(inputsArray){
      // console.log('inputsArray',inputsArray);
  },

  addInput: function(e){
      var obj = {};
      obj[this.inputLabel] = '';
      if (this.withDescription)
          obj['description'] = '';
      this.push('inputsArray', obj);
  },

  removeInput: function(e){
      // console.log('removeInput',e.model.index);
      var inputValue = this.get('inputsArray.'+e.model.index+'.'+this.inputLabel);
      if (this.withConfirmRemove != true || inputValue == '') {
          this.splice('inputsArray', e.model.index, 1);
      }
      else {
          this.set('toRemove', e.model.index);
          this._showDialog({
              title: 'Remove '+this.inputLabel,
              body: "This cannot be undone. You will need to manually re-add "+ inputValue +" if you need so." ,
              reason: "input.remove",
              action: "Remove "+this.inputLabel
          });
      }
  },

  _showDialog: function(info) {
      var dialog = this.shadowRoot.querySelector("#confirmRemove");
      if (info) {
          for (var i in info) {
              dialog[i] = info[i];
          }
      }
      dialog._openDialog();
  },

  _confirmRemove: function(e){
      // console.log('_confirmRemove',e);
      var reason = e.detail.reason,
          response = e.detail.response;

      if (response.confirmed == 'confirm' && reason == "input.remove") {
          this.splice('inputsArray', this.toRemove, 1);
          this.set('toRemove', null);
      }
  },

  saveInputs: function(e){
      this.dispatchEvent(new CustomEvent(this.eventName, { bubbles: true, composed: true, detail:  {inputs: this.inputsArray} }));
  },

  addCurrentIP: function(e){
      this.dispatchEvent(new CustomEvent('add-current', { bubbles: true, composed: true}));
  }
});
