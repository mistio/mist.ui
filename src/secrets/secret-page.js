import '@polymer/paper-button/paper-button.js';
import '@polymer/paper-spinner/paper-spinner.js';
import '@mistio/mist-list/code-viewer.js';
import '../helpers/dialog-element.js';
import './secret-actions.js';
import '@polymer/paper-toggle-button/paper-toggle-button.js';
// import { mistLoadingBehavior } from '../helpers/mist-loading-behavior.js';
import { Polymer } from '@polymer/polymer/lib/legacy/polymer-fn.js';
import { html } from '@polymer/polymer/lib/utils/html-tag.js';
import { CSRFToken } from '../helpers/utils.js';

Polymer({
  _template: html`
    <style include="shared-styles single-page tags-and-labels">
      paper-material {
        padding: 24px;
      }

      paper-menu-button paper-button {
        display: block;
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

      .single-head {
        @apply --secret-page-head-mixin;
      }

      h4.secret {
        @apply --layout-flex;
        text-transform: uppercase;
        font-size: 0.9rem;
        font-weight: 700;
        font-color: #fff;
      }

      h4.id {
        display: inline-block;
        text-transform: uppercase;
        font-size: 0.9rem;
        font-weight: 700;
        margin-right: 16px;
      }
      secret-actions {
        fill: #fff;
        min-width: 50%;
      }
      .id {
        margin-right: 16px;
      }
      #secretContainer {
        text-align: center;
      }
      #showSecretBtn iron-icon {
        width: 20px;
        height: 20px;
        margin-right: 10px;
      }
      #showSecretBtn {
        padding-left: 16px;
        padding-right: 16px;
      }
    </style>
    <div id="content">
      <paper-material class="single-head layout horizontal">
        <span class="icon"
          ><iron-icon icon="[[section.icon]]"></iron-icon
        ></span>
        <div class="title flex">
          <h2>[[secret.name]]</h2>
        </div>
        <secret-actions
          id="secretActions"
          actions="{{actions}}"
          items="[[itemArray]]"
          model="[[model]]"
          org="[[model.org]]"
          path="[[path]]"
          parent-folder-id="[[parentFolderId]]"
          in-single-view=""
        ></secret-actions>
      </paper-material>
      <div id="secret-info">
        <paper-material>
          <h4 class="id">Secret ID:</h4>
          <span class="id">[[secret.id]]</span>
          <h4 class="id" hidden$="[[!secret.owned_by.length]]">Owner:</h4>
          <span class="id"
            >[[_displayUser(secret.owned_by,model.members)]]</span
          >
          <h4 class="id" hidden$="[[!secret.created_by.length]]">
            Created by:
          </h4>
          <span class="id"
            >[[_displayUser(secret.created_by,model.members)]]</span
          >
        </paper-material>
        <paper-material>
          <div class="head">
            <h4 class="secret">Secret</h4>
            <paper-button
              hidden$="[[!visibleSecret]]"
              id="hideSecretbtn"
              on-tap="hideSecret"
              class="right link"
              ><span class="wide">Hide</span>
              <iron-icon icon="icons:visibility-off"></iron-icon>
            </paper-button>
          </div>
          <div id="secretContainer">
            <paper-button
              hidden$="[[visibleSecret]]"
              id="showSecretBtn"
              on-tap="showSecret"
            >
              <iron-icon icon="icons:visibility"></iron-icon> View
              Secret</paper-button
            >
            <template is="dom-if" if="[[visibleSecret]]" restamp="">
              <paper-toggle-button checked="{{!readOnly}}"
                >Edit Secret</paper-toggle-button
              >
              <code-viewer
                id="secretEditor"
                language="json"
                read-only$="[[readOnly]]"
                theme="vs-dark"
                value="[[_jsonValue(secretValue)]]"
                on-editor-value-changed="_codeEditorValueChanged"
              ></code-viewer>
              <paper-button hidden$="[[readOnly]]" on-tap="editSecret">
                Save
              </paper-button>
            </template>
          </div>
        </paper-material>
      </div>
    </div>
    <iron-ajax
      id="getSecretDataRequest"
      url="/api/v1/secrets/[[secret.id]]"
      on-response="handleGetSecretDataResponse"
      on-error="handleError"
    ></iron-ajax>
    <iron-ajax
      id="editSecretRequest"
      method="PUT"
      url="/api/v2/secrets/[[secret.id]]"
      on-response="handleEditSecretResponse"
      on-error="handleError"
    ></iron-ajax>
  `,

  is: 'secret-page',

  // behaviors: [mistLoadingBehavior],

  properties: {
    hidden: {
      type: Boolean,
      reflectToAttribute: true,
    },
    secret: {
      type: Object,
    },
    section: {
      type: Object,
    },
    visibleSecret: {
      type: Boolean,
      value: false,
    },
    secretValue: {
      type: Object,
      value: {},
    },
    newValue: {
      type: Object,
      value: {},
    },
    model: {
      type: Object,
    },
    itemArray: {
      type: Array,
    },
    actions: {
      type: Array,
    },
    readOnly: {
      type: Boolean,
      value: true,
    },
    parentFolderId: {
      type: String,
    },
  },

  observers: ['_secretUpdated(secret)', '_hiddenUpdated(hidden)'],

  _displayUser(id, _members) {
    return this.model && id && this.model.members && this.model.members[id]
      ? this.model.members[id].name ||
          this.model.members[id].email ||
          this.model.members[id].username
      : '';
  },

  _codeEditorValueChanged(e) {
    this.newValue = JSON.parse(e.detail.value);
  },

  showSecret() {
    this.$.getSecretDataRequest.method = 'GET';
    this.$.getSecretDataRequest.headers['Content-Type'] = 'application/json';
    this.$.getSecretDataRequest.headers['Csrf-Token'] = CSRFToken.value;
    this.$.getSecretDataRequest.body = {};
    this.$.getSecretDataRequest.generateRequest();
    this.visibleSecret = true;
  },

  handleGetSecretDataResponse(resp) {
    this.set('secretValue', resp.detail.response);
  },

  editSecret() {
    this.$.editSecretRequest.method = 'PUT';
    this.$.editSecretRequest.headers['Content-Type'] = 'application/json';
    this.$.editSecretRequest.headers['Csrf-Token'] = CSRFToken.value;
    this.$.editSecretRequest.body = {
      secret: this.newValue,
    };
    this.$.editSecretRequest.generateRequest();
  },

  handleEditSecretResponse(_e) {
    this.set('secretValue', this.newValue);
    this.set('readOnly', true);
    this.dispatchEvent(
      new CustomEvent('toast', {
        bubbles: true,
        composed: true,
        detail: { msg: 'Secret Edited Successfully', duration: 3000 },
      })
    );
  },

  handleError(e) {
    console.log('Error during request: ', e);
  },

  hideSecret() {
    this.visibleSecret = false;
  },

  _hiddenUpdated(_hidden) {
    this.$.secretActions.fire('update');
  },

  _secretUpdated(secret) {
    if (secret) {
      this.set('itemArray', [this.secret]);
    } else {
      this.set('itemArray', []);
      this.set('publicKey', '');
    }
    this.set('visibleSecret', false);
  },
  _jsonValue(secretVal) {
    return JSON.stringify(secretVal, undefined, 2);
  },
});
