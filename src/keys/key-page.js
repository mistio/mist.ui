import '@polymer/paper-button/paper-button.js';
import '@polymer/paper-spinner/paper-spinner.js';
import '@mistio/mist-list/mist-list.js';
import { html } from '@polymer/polymer/lib/utils/html-tag.js';
import { Polymer } from '@polymer/polymer/lib/legacy/polymer-fn.js';
import { mistLogsBehavior } from '../helpers/mist-logs-behavior.js';
import '../helpers/dialog-element.js';
import { mistLoadingBehavior } from '../helpers/mist-loading-behavior.js';
import { mistRulesBehavior } from '../helpers/mist-rules-behavior.js';
import '../tags/tags-list.js';
import { itemUid, CSRFToken } from '../helpers/utils.js';

Polymer({
  _template: html`
    <style include="shared-styles single-page tags-and-labels">
      paper-material {
        display: block;
        padding: 24px;
      }

      paper-menu-button paper-button {
        display: block;
      }

      a.machine {
        color: var(--mist-blue) !important;
      }

      .machine-info {
        font-size: 0.9rem;
        color: rgba(0, 0, 0, 0.54);
      }

      [size='xs'] > * {
        display: none;
      }

      [size='xs'] mist-sidebar {
        min-width: 100%;
        height: auto;
      }

      iron-icon.bottom {
        padding-right: 8px;
      }

      #keyPublicContainer .textarea,
      #keyPrivateContainer .textarea {
        height: 120px;
        overflow: auto;
        font-family: monospace;
        width: 100%;
        font-size: 14px;
        line-height: 1.4em;
        padding: 10px 15px;
        box-sizing: border-box;
        background-color: #f8f8f8;
        border-color: #eeedeb;
        color: rgba(0, 0, 0, 0.54);
        white-space: pre-line;
        word-wrap: break-word;
        text-align: left;
      }

      #keyPublicContainer .textarea {
        height: 120px;
      }

      #keyPrivateContainer {
        text-align: center;
      }

      #keyPrivateContainer .textarea {
        height: 440px;
      }

      #keyPrivateContainer #showPrivateKeybtn {
        margin: 20px 0;
      }

      paper-button.right {
        text-align: right;
      }

      paper-button.link,
      paper-button.link iron-icon {
        background-color: transparent !important;
        color: var(--mist-blue) !important;
      }

      .head {
        @apply --layout-horizontal;
        align-items: center;
      }

      h4.key {
        @apply --layout-flex;
        text-transform: uppercase;
        font-size: 0.9rem;
        font-weight: 700;
      }

      h4.id {
        display: inline-block;
        text-transform: uppercase;
        font-size: 0.9rem;
        font-weight: 700;
        margin-right: 16px;
      }
      /* TODO: better */
      h4.id.tags {
        padding-left: 36px;
      }

      .tag {
        padding: 0.5em;
        display: inline-block;
        vertical-align: middle;
      }
      /**/
      .head paper-button {
        flex: none !important;
        display: inline-block;
      }

      paper-button iron-icon {
        margin-right: 8px;
      }

      paper-button.right,
      #showPrivateKeybtn {
        font-size: 0.9rem;
      }

      #showPrivateKeybtn {
        padding-left: 16px;
        padding-right: 16px;
        font-weight: 500;
      }

      #showPrivateKeybtn iron-icon {
        color: var(--paper-button-text) !important;
        width: 20px;
        height: 20px;
      }

      ul {
        padding: 0;
      }

      ul li {
        list-style: none;
      }

      .wide {
        display: none;
      }

      .machines-list iron-icon {
        opacity: 0.32;
      }

      @media (min-width: 1339px) {
        .wide {
          display: inline;
        }
      }

      .single-head {
        @apply --key-page-head-mixin;
      }

      key-actions {
        fill: #fff;
        min-width: 50%;
      }

      .key-info > paper-material > span {
        margin-right: 16px;
      }
    </style>
    <div id="content">
      <paper-material class="single-head layout horizontal">
        <span class="icon"
          ><iron-icon icon="[[section.icon]]"></iron-icon
        ></span>
        <div class="title flex">
          <h2>
            [[key.name]]
            <iron-icon icon="star" hidden$="[[!isDefault]]"></iron-icon>
          </h2>
          <div class="subtitle">
            <span hidden$="[[keyHasMachines]]">
              No machines are using this key
            </span>
            <span hidden$="[[!keyHasMachines]]">
              [[keyMachines.length]] machine<span
                hidden$="[[!keyHasMachinesMoreThanOne]]"
                >s</span
              >
              associated with this key
            </span>
          </div>
        </div>
        <key-actions
          id="keyActions"
          actions="{{actions}}"
          items="[[itemArray]]"
          user="[[model.user.id]]"
          members="[[model.membersArray]]"
          org="[[model.org]]"
          in-single-view=""
        ></key-actions>
      </paper-material>

      <div class="key-info">
        <paper-material>
          <div class="missing" hidden$="[[!isMissing]]">Key not found.</div>
          <h4 class="id">Key ID:</h4>
          <span class="id">[[key.id]]</span>
          <h4 class="id" hidden$="[[!key.owned_by.length]]">Owner:</h4>
          <span class="id">[[_displayUser(key.owned_by,model.members)]]</span>
          <h4 class="id" hidden$="[[!key.created_by.length]]">Created by:</h4>
          <span class="id">[[_displayUser(key.created_by,model.members)]]</span>
          <template is="dom-if" if="[[keyTags.length]]">
            <h4 class="id tags">Tags</h4>
            <template is="dom-repeat" items="[[keyTags]]">
              <span class="id tag"
                >[[item.key]]<span hidden="[[!item.value]]"
                  >=[[item.value]]</span
                ></span
              >
            </template>
          </template>
        </paper-material>
        <paper-material>
          <div class="head">
            <h4 class="key">Public Key</h4>
            <paper-button
              hidden$="[[!publicKey]]"
              on-tap="copyPublicKey"
              class="right link"
              >Copy <span class="wide">public key</span>
              <iron-icon icon="content-copy"></iron-icon>
            </paper-button>
          </div>
          <div id="keyPublicContainer">
            <div class="textarea" id="keyPublic">[[publicKey]]</div>
          </div>
        </paper-material>
        <paper-material>
          <div class="head">
            <h4 class="key">Private Key</h4>
            <paper-button
              hidden$="[[!visiblePrivateKey]]"
              id="hidePrivateKeybtn"
              on-tap="hidePrivateKey"
              class="right link"
              >Hide <span class="wide">Private Key</span>
              <iron-icon icon="icons:visibility-off"></iron-icon>
            </paper-button>
            <paper-button
              hidden$="[[!visiblePrivateKey]]"
              on-tap="copyPrivateKey"
              class="right link"
              >Copy <span class="wide">private key</span>
              <iron-icon icon="content-copy"></iron-icon>
            </paper-button>
          </div>
          <div id="keyPrivateContainer">
            <paper-button
              hidden$="[[visiblePrivateKey]]"
              id="showPrivateKeybtn"
              on-tap="showPrivateKey"
            >
              <iron-icon icon="icons:visibility"></iron-icon> View Private
              Key</paper-button
            >
            <div
              class="textarea"
              hidden$="[[!visiblePrivateKey]]"
              id="keyPrivate"
            >
              [[privateKey]]
            </div>
          </div>
        </paper-material>
        <br />
        <paper-material class="machines-list" hidden$="[[!keyHasMachines]]">
          <h4 class="key">
            <span>([[keyMachines.length]])</span> Machine<span
              hidden$="[[!keyHasMachinesMoreThanOne]]"
              >s</span
            >
            associated with this key
          </h4>
          <ul>
            <template is="dom-repeat" items="{{keyMachines}}">
              <li>
                <iron-icon icon="hardware:laptop"></iron-icon>
                <span class="machine-info">
                  <span hidden$="[[!item.3]]">[[item.3]] @</span>
                  <a
                    hidden$="[[!getMachineUrl(item,model.machines.*)]]"
                    href="[[getMachineUrl(item,model.machines.*)]]"
                    class="machine"
                    >[[getMachineName(item, model.machines.*)]]</a
                  >
                  <template
                    is="dom-if"
                    if="[[!getMachineName(item,model.machines.*)]]"
                    restamp=""
                    ><abbr title$="[[item.1]]">missing machine</abbr></template
                  >
                  <span>([[getCloudTitle(item)]])</span>
                  <span hidden="[[!item.5]]">: [[item.5]]</span>
                </span>
              </li>
            </template>
          </ul>
        </paper-material>
        <br />
        <paper-material class="no-pad">
          <mist-rules
            id="keyRules"
            resource-type="key"
            incidents="[[model.incidentsArray]]"
            rules="[[_rulesApplyOnResource(model.rules, key, keyTags.length, 'key')]]"
            teams="[[model.teamsArray]]"
            users="[[model.membersArray]]"
            resource="[[key]]"
            model="[[model]]"
            collapsible=""
          ></mist-rules>
        </paper-material>
        <br />
        <paper-material class="no-pad">
          <template is="dom-if" if="[[key]]" restamp="">
            <mist-list
              id="keyLogs"
              frozen="[[_getFrozenLogColumn()]]"
              visible="[[_getVisibleColumns()]]"
              renderers="[[_getRenderers(model.members)]]"
              auto-hide=""
              timeseries=""
              expands=""
              column-menu=""
              searchable=""
              streaming=""
              infinite=""
              toolbar=""
              rest=""
              apiurl="/api/v1/logs"
              name="key logs"
              primary-field-name="time"
              base-filter="[[key.id]]"
            ></mist-list>
          </template>
        </paper-material>
      </div>
    </div>

    <iron-ajax
      id="keyPublicRequest"
      url="/api/v1/keys/[[key.id]]/public"
      on-response="handlePublicResponse"
      on-error="handleError"
    ></iron-ajax>
    <iron-ajax
      id="keyPrivateRequest"
      url="/api/v1/keys/[[key.id]]/private"
      on-response="handlePrivateResponse"
      on-error="handleError"
    ></iron-ajax>
    <dialog-element></dialog-element>
    <tags-list model="[[model]]"></tags-list>
  `,

  is: 'key-page',

  behaviors: [mistLoadingBehavior, mistLogsBehavior, mistRulesBehavior],

  properties: {
    hidden: {
      type: Boolean,
      reflectToAttribute: true,
    },
    ownership: {
      type: Boolean,
    },
    section: {
      type: Object,
    },
    model: {
      type: Object,
    },
    color: {
      type: String,
      computed: '_getHeaderStyle(section)',
    },
    key: {
      type: Object,
    },
    isDefault: {
      type: String,
      computed: '_computeIsDefault(key.isDefault)',
    },
    publicKey: {
      type: String,
      value: null,
    },
    privateKey: {
      type: String,
      value: null,
    },
    keyMachines: {
      type: Array,
      computed: '_computeKeyMachines(key, model.machines.*)',
    },
    keyHasMachines: {
      type: Boolean,
      computed: '_keyHasMachines(keyMachines)',
    },
    keyHasMachinesMoreThanOne: {
      type: Boolean,
      computed: '_keyHasMachinesMoreThanOne(keyMachines)',
    },
    visiblePrivateKey: {
      type: Boolean,
      value: false,
    },
    keyTags: {
      type: Array,
      computed: '_computeKeyTags(key, key.tags, key.tags.*, model.keys)',
    },
    itemsfortags: {
      type: Array,
      computed: 'computeTagItems(key)',
    },
    itemArray: {
      type: Array,
    },
    actions: {
      type: Array,
    },
  },

  observers: ['_keyUpdated(key)', '_hiddenUpdated(hidden)'],

  resourceHasTags(key, selectors) {
    // CAUTION: Selectors' format is as follows
    //      selectors = [{type:'tags',tags:{test:null,xtest:true}}, {type:'key',ids:[]}]
    // whereas key tags are in the format
    //      key.tags = {test:"", xtest:true, ...}
    // A selector-tag tupple where value is null, equals to the corresponding key-tag tupple where value is "" empty string.
    //      i.e. selectors[0].tags["test"] = null 'EQUALS' volume.tags["test"] = "".
    // The following returns true if the volume has at least one of the selectors tags
    if (!key || !selectors) return false;
    const bool =
      selectors
        .filter(t => t.type === 'tags')
        .map(x => x.tags)
        .findIndex(s => {
          for (const p of Object.keys(s)) {
            if (key.tags[p] === s[p] || (key.tags[p] === '' && s[p] === null)) {
              return true;
            }
          }
          return false;
        }) > -1;
    return bool;
  },

  _hiddenUpdated(_hidden) {
    this.$.keyActions.fire('update');
  },

  _keyUpdated(key) {
    if (key) {
      this.$.keyPublicRequest.headers['Content-Type'] = 'application/json';
      this.$.keyPublicRequest.headers['Csrf-Token'] = CSRFToken.value;
      this.$.keyPublicRequest.body = {};
      this.$.keyPublicRequest.generateRequest();

      this.set('itemArray', [this.key]);
    } else {
      this.set('itemArray', []);
      this.set('publicKey', '');
    }
    this.set('visiblePrivateKey', false);
  },

  _displayUser(id, _members) {
    return this.model && id && this.model.members && this.model.members[id]
      ? this.model.members[id].name ||
          this.model.members[id].email ||
          this.model.members[id].username
      : '';
  },

  _getHeaderStyle(section) {
    return `background-color: ${section.color}; color: #fff;`;
  },

  _computeKeyTags(_key, _tags) {
    if (this.key) {
      return Object.entries(this.key.tags).map(([key, value]) => ({
        key,
        value,
      }));
    }
    return [];
  },

  computeTagItems(key) {
    if (key) {
      const arr = [];
      const item = itemUid(key, this.section);
      arr.push(item);
      return arr;
    }
    return [];
  },

  _computeKeyMachines(key) {
    if (key) return key.machines;
    return [];
  },

  _keyHasMachines(keyMachines) {
    if (keyMachines) return keyMachines.length > 0;
    return false;
  },

  _keyHasMachinesMoreThanOne(keyMachines) {
    if (keyMachines) return keyMachines.length > 1;
    return false;
  },

  getMachineUrl(keymachine) {
    const cloud = this.model.clouds[keymachine[0]];
    if (!cloud) return false;
    const machine = cloud.machines && cloud.machines[keymachine[1]];
    return machine && `/machines/${machine.id}`;
  },

  getCloudTitle(keymachine) {
    const cloud = this.model.clouds[keymachine[0]];
    if (!cloud) return '';
    return cloud.name;
  },

  getMachineName(keymachine, _machines) {
    const cloud = this.model.clouds[keymachine[0]];
    if (!cloud) return '';
    const machine = cloud.machines && cloud.machines[keymachine[1]];
    return machine && machine.name;
  },

  _computeIsDefault(isDefault) {
    return isDefault;
  },

  copyPublicKey() {
    this.clearSelection();
    const el = this.$.keyPublic;
    this.setSelection(el);
    const successful = document.execCommand('copy');
    const message = successful
      ? 'The Public Key was copied to clipboard!'
      : 'There was an error copying to clipboard!';
    this.dispatchEvent(
      new CustomEvent('toast', {
        bubbles: true,
        composed: true,
        detail: { msg: message, duration: 3000 },
      })
    );
  },

  copyPrivateKey() {
    this.clearSelection();
    const el = this.$.keyPrivate;
    this.setSelection(el);
    const successful = document.execCommand('copy');
    const message = successful
      ? 'The Private Key was copied to clipboard!'
      : 'There was an error copying to clipboard!';
    this.dispatchEvent(
      new CustomEvent('toast', {
        bubbles: true,
        composed: true,
        detail: { msg: message, duration: 3000 },
      })
    );
  },

  handlePublicResponse(data) {
    // console.log(data);
    this.set('publicKey', data.detail.response);
  },

  showPrivateKey() {
    this.$.keyPrivateRequest.headers['Content-Type'] = 'application/json';
    this.$.keyPrivateRequest.headers['Csrf-Token'] = CSRFToken.value;
    this.$.keyPrivateRequest.body = {};
    this.$.keyPrivateRequest.generateRequest();
    this.visiblePrivateKey = true;
  },

  hidePrivateKey() {
    this.visiblePrivateKey = false;
  },

  handlePrivateResponse(data) {
    this.set('privateKey', data.detail.response);
  },

  _editTags() {
    const el = this.shadowRoot.querySelector('tags-list');
    const items = [];
    items.push(itemUid(this.key, this.section));
    el.items = items;
    el._openDialog();
  },

  _deleteKey(_e) {
    this._showDialog({
      title: 'Delete Key?',
      body: `Deleting a key can not be undone. You are about to delete key '${this.key.name}'.`,
      danger: true,
      reason: 'key.delete',
    });
  },

  _handleKeyDeleteAjaxResponse(_e) {
    this.dispatchEvent(
      new CustomEvent('go-to', {
        bubbles: true,
        composed: true,
        detail: { url: '/keys' },
      })
    );
  },

  _showDialog(info) {
    const dialog = this.shadowRoot.querySelector('dialog-element');
    if (info) {
      Object.keys(info).forEach(i => {
        dialog[i] = info[i];
      });
    }
    dialog._openDialog();
  },

  clearSelection() {
    if (window.getSelection) {
      if (window.getSelection().empty) {
        // Chrome
        window.getSelection().empty();
      } else if (window.getSelection().removeAllRanges) {
        // Firefox
        window.getSelection().removeAllRanges();
      }
    } else if (document.selection) {
      // IE?
      document.selection.empty();
    }
  },

  setSelection(el) {
    let range;
    if (document.selection) {
      range = document.body.createTextRange();
      range.moveToElementText(el);
      range.select();
    } else if (window.getSelection) {
      range = document.createRange();
      range.selectNode(el);
      window.getSelection().addRange(range);
    }
  },
});
