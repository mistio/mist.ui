import '../../../../@polymer/polymer/polymer-legacy.js';
import '../../../../@polymer/iron-ajax/iron-ajax.js';
import '../../../../@polymer/paper-styles/typography.js';
import '../../../../@polymer/iron-collapse/iron-collapse.js';
import '../../../../@polymer/paper-button/paper-button.js';
import '../../../../@polymer/neon-animation/animations/scale-up-animation.js';
import '../../../../@polymer/neon-animation/animations/fade-out-animation.js';
import '../../../../@polymer/paper-listbox/paper-listbox.js';
import '../../../../vaadin-dialog/vaadin-dialog.js';
import '../../../../mist-list/mist-list-actions-behavior.js';
import { Polymer } from '../../../../@polymer/polymer/lib/legacy/polymer-fn.js';
import { html } from '../../../../@polymer/polymer/lib/utils/html-tag.js';
Polymer({
  _template: html`
        <style include="shared-styles dialogs">
        :host {
            width: 100%;
        }

        :host .btn-group {
            margin: 0 0 24px 0;
        }

        .grey {
            opacity: 0.54;
        }

        .trigger {
            cursor: pointer;
            padding: 16px 0;
        }

        .trigger iron-icon {
            transition: transform 300ms ease-in;
        }

        .trigger[open] iron-icon {
            transform: rotate(180deg);
        }

        .collapsible {
            height: 0;
            overflow: hidden;
            transition: height 300ms ease-in-out 100ms;
        }

        .collapsible[open] {
            height: auto;
        }

        paper-button.wide.blue {
            margin: 8px;
            width: calc(100% - 16px);
            text-align: center;
        }

        .btn-group {
            margin: 16px 0;
        }

        @media screen and (max-width: 450px) {
            :host paper-dropdown-menu ::slotted(.dropdown-content) {
                top: 0 !important;
            }
        }
        </style>
        <vaadin-dialog id="dialogModal" theme="mist-dialog" with-backdrop="">
            <template>
                <h2>Associate a key</h2>
                <div class="paper-dialog-scrollable">
                    <p>
                        <span class="grey"> Choose from your existing keys. </span>
                        <paper-dropdown-menu label="Select key" horizontal-align="left" vertical-offset="55">
                            <paper-listbox slot="dropdown-content" id="keys" attr-for-selected="value" selected="{{selectedKeyId}}" class="dropdown-content">
                                <template is="dom-repeat" items="[[keys]]" as="key">
                                    <paper-item value="[[key.id]]" disabled\$="[[itemsHaveThisKey(key.id,items,model)]]">[[key.name]]</paper-item>
                                </template>
                                <paper-button class="blue wide" on-tap="_addKey">Add key</paper-button>
                            </paper-listbox>
                        </paper-dropdown-menu>
                    </p>
                    <p>
                        </p><div id="trigger">Advanced Options <paper-icon-button icon="icons:arrow-drop-down" toggles="" active="{{collapse}}"></paper-icon-button>
                        </div>
                        <iron-collapse id="collapse" opened="{{collapse}}">
                            <paper-input id="user" label="ssh user" value="{{user}}" placeholder="root"></paper-input>
                            <paper-input id="port" label="ssh port" value="{{port}}" placeholder="22"></paper-input>
                        </iron-collapse>
                    <p></p>
                </div>
                <div class="clearfix btn-group">
                    <paper-button on-tap="_dismissDialog">
                        Cancel
                    </paper-button>
                    <paper-button class="blue" on-tap="associateKey" dialog-confirm="" disabled\$="[[!selectedKeyId]]">
                        Associate
                    </paper-button>
                </div>
            </template>
        </vaadin-dialog>
        <iron-ajax id="associateKeyRequest" method="PUT" on-response="_associateKeyResponse" on-error="_associateKeyError" on-request="_associateKeyRequest" handle-as="xml"></iron-ajax>
`,

  is: 'associate-key',

  properties: {
      model: {
          type: Object
      },
      keys: {
          type: Array,
          computed: "computeKeys(model.keysArray)"
      },
      items: {
          type: Array
      },
      user: {
          type: String
      },
      port: {
          type: String
      },
      cloudId: {
          type: String
      },
      selected: {
          type: String
      },
      selectedKeyId: {
          type: String
      }
  },

  listeners: {
      'change': 'updateInputs',
      // 'open-and-select' : 'openAndSelect'
  },

  attached: function() {
      if (this.shadowRoot.querySelector("iron-dropdown")) {
          this.shadowRoot.querySelector("iron-dropdown").setAttribute("vertical-offset", 55);
      }
  },

  _openDialog: function(e) {
      this.$.dialogModal.opened = true;
  },

  _closeDialog: function(e) {
      this.$.dialogModal.opened = false;
  },

  openAndSelect: function(e) {
      console.log('openAndSelect', e);
      //select
      this.set('selected', e.detail.key);
      this.set('selectedKeyId', e.detail.key);

      this.$.dialogModal.opened = true;
  },

  _addKey: function(e) {
      this.$.dialogModal.opened = false;
      //set attribute origin
      var origin = window.location.pathname;
      var qParams = {
          'origin': origin
      }
      this.dispatchEvent(new CustomEvent('go-to', { bubbles: true, composed: true, detail: { url: '/keys/+add', params: qParams } }));
  },

  associateKey: function(e) {
      var user = this.user || 'root',
          port = this.port || '22',
          request = this.$.associateKeyRequest,
          keyId = this.selectedKeyId;

      var items = this.items.slice(0);
      console.log('associateKey', this.items);

      var run = function(el, model) {
          var item = items.shift(),
              itemType,
              itemCloud,
              itemId;
          if (item.length) {
              itemType = item.split(':')[0];
              itemCloud = item.split(':')[1];
              itemId = item.split(':')[2];
          } else {
              itemCloud = item.cloud.id;
              itemId = item.id
          }
          var machineHost = model.machines[itemId].public_ips ? model.machines[itemId].public_ips[0] : '',
              uri = "/api/v1/machines/" + itemId + "/keys/" + keyId;

          // console.log('machineHost', machineHost, model.machines[itemId]);

          request.url = uri;
          request.headers["Content-Type"] = 'application/json';
          request.headers["Csrf-Token"] = CSRF_TOKEN;
          request.body = { host: machineHost, user: user, port: port };
          request.generateRequest();

          if (items.length) {
              run(el, model);
          }
      }
      run(this, this.computeModel());
      this.$.dialogModal.opened = false;
      e.stopImmediatePropagation();
  },

  _associateKeyRequest: function() {
      var logMessage = 'Sending request to associate key with machine.';
      this.dispatchEvent(new CustomEvent('performing-action', { bubbles: true, composed: true, detail: { log: logMessage } }));

  },

  _associateKeyResponse: function() {
      this.dispatchEvent(new CustomEvent('action-finished', { bubbles: true, composed: true, detail: { success: true } }));
      this.dispatchEvent(new CustomEvent('toast', { bubbles: true, composed: true, detail: { msg: 'Key association request sent successfully', duration: 3000 } }));
  },

  _associateKeyError: function(e) {
      this.dispatchEvent(new CustomEvent('action-finished', { bubbles: true, composed: true, detail: { success: true } }));
      this.dispatchEvent(new CustomEvent('toast', { bubbles: true, composed: true, detail: { msg: e.detail.request.xhr.responseText, duration: 5000 } }));
  },

  updateInputs: function(e) {
      var target = e.target.id;
  },

  computeKeys: function(model) {
      return (this.model && this.model.keysArray) ? this.model.keysArray : [];
  },

  computeModel: function() {
      return document.querySelector("app-main") ? document.querySelector("app-main").model : document.querySelector("mist-app").model;
  },

  itemsHaveThisKey: function(key, items, model) {
      // test if all items have this key and if so disable
      var count = 0;
      var model = this.model;
      for (var i = 0; i < this.items.length; i++) {
          var itemCloud,
              itemId;
          if (this.items[i].length) {
              itemCloud = this.items[i].split(':')[1];
              itemId = this.items[i].split(':')[2];
          } else {
              itemCloud = this.items[i].cloud.id;
              itemId = this.items[i].machine_id;
          }
          for (var j = 0; j < model.keys[key].machines.length; j++) {
              if (model.keys[key].machines[j][0] == itemCloud && model.keys[key].machines[j][1] == itemId) {
                  count++;
              }
          }
      }
      if (count == this.items.length){
          return true;
      } else {
          return false;
      }
  }
});
