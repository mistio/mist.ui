import '../../node_modules/@polymer/polymer/polymer-legacy.js';
import '../../node_modules/@polymer/paper-styles/typography.js';
import '../../node_modules/@polymer/paper-button/paper-button.js';
import '../../node_modules/@polymer/paper-input/paper-input.js';
import '../../node_modules/@polymer/paper-dropdown-menu/paper-dropdown-menu.js';
import '../../node_modules/@polymer/paper-input/paper-textarea.js';
import { Polymer } from '../../node_modules/@polymer/polymer/lib/legacy/polymer-fn.js';
import { html } from '../../node_modules/@polymer/polymer/lib/utils/html-tag.js';
Polymer({
  _template: html`
        <style>
        :host {
            margin: 8px;
        }

        paper-checkbox {
            padding: 15px;
        }

        #dummy {
            display: none;
        }

        paper-dropdown-menu,
        paper-input {
            --paper-dropdown-menu-input: {
                font-family: monospace;
                text-transform: lowercase;
            }

            ;

            --paper-dropdown-menu-label: {
                font-family: monospace;
                text-transform: lowercase;
            }

            ;

            --paper-input-container-input: {
                font-family: monospace;
                text-align: center;
                text-transform: lowercase;
            }

            ;

            --paper-input-container-label: {
                font-family: monospace;
                text-transform: lowercase;
            }
        }
        </style>
        <paper-dropdown-menu label="[[label]]" id="dropdownMenu" required="[[required]]" on-paper-dropdown-close="_closingWindow" on-paper-dropdown-open="_openingWindow">
            <div class="dropdown-content" slot="dropdown-content">
                <template is="dom-repeat" items="[[selections]]">
                    <div>
                        <paper-checkbox checked="[[computeChecked(item.id)]]" on-change="_updateValue">[[item.name]]</paper-checkbox>
                    </div>
                </template>
                <iron-selector id="selected">
                    <div id="dummy">[[displayValue]]</div>
                </iron-selector>
            </div>
        </paper-dropdown-menu>
`,

  is: 'mist-dropdown-multi',

  properties: {
      label: {
          type: String
      },
      required: {
          type: Boolean
      },
      selections: {
          type: Array,
          observer: '_selectionChanged'
      },
      value: {
          type: Array,
          value: function () { return []; }
      },
      _value: {
          type: Array,
          value: []
      },
      maxDisplay: {
          type: Number,
          value: 5
      },
      displayValue: {
          type: String,
          value: ''
      }
  },

  attached: function() {
      this.init();
  },

  init: function() {
      if (this.value && this.selections) {
          this.set('_value', this.value.map(function (item) {
              var selectedItem = this.selections.find(function (s) {
                  return s.id == item
              }.bind(this));
              return selectedItem ? selectedItem.name : '';
          }.bind(this)));

          this.setDisplayValue(this._value);
          this.$.selected.selected = '0';
      }
  },

  clear: function() {
      console.log('clear');
      this.set('value', [])
      this.set('_value', []);
      this.set('displayValue', '');
      this.shadowRoot.querySelectorAll('paper-checkbox').forEach(function(item) {
          item.checked = false
      });
      this.$.selected.selected = null;
  },

  setDisplayValue: function(arr) {
      if (arr && arr.length)
          var str = arr.length <= this.maxDisplay ? arr.join(', ') : arr.length + " selected";
      this.set('displayValue', str || '');
  },

  _selectionChanged: function() {
      this.init();
  },

  _openingWindow: function() {
      this.$.selected.selected = null;
  },

  _closingWindow: function() {
      this.setDisplayValue(this._value);
      this.$.selected.selected = '0';
      this.dispatchEvent(new CustomEvent('value-changed', { bubbles: true, composed: true, detail: this.value }));
      this.dispatchEvent(new CustomEvent('change',  { bubbles: true, composed: true}));
  },

  _updateValue: function(e) {
      var that = this;
      var val = [];
      this.shadowRoot.querySelectorAll('paper-checkbox').forEach(function(item) {
          if (item.checked) {
              val.push(item.textContent.trim())
          }
      })
      this.set('_value', val);

      this.set('value', this._value.map(function(item) {
          return this.selections.find(function(s) {
              return s.name == item
          }.bind(this)).id;
      }.bind(this)));
  },

  computeChecked: function(id) {
      return this.value ? this.value.indexOf(id) > -1 : false;
  }
});
