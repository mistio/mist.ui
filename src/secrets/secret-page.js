import '../../node_modules/@polymer/paper-button/paper-button.js';
import '../../node_modules/@polymer/paper-spinner/paper-spinner.js';
import { CSRFToken } from '../helpers/utils.js';
import { Polymer } from '../../node_modules/@polymer/polymer/lib/legacy/polymer-fn.js';
import { html } from '../../node_modules/@polymer/polymer/lib/utils/html-tag.js';

Polymer({
    _template: html`
        <style>
        </style>
        <div id="content">
            <paper-material class="single-head layout horizontal">
                <span class="icon"><iron-icon icon="[[section.icon]]"></iron-icon></span>
                <div class="title flex">
                    <h2>
                        [[secret.name]]
                    </h2>
                </div>
                <secret-actions></secret-actions>
            </paper-material>
            <div id="secret-info">
                <paper-material>
                    <h4 class="id">Secret ID:</h4><span class="id">[[secret.id]]</span>
                    <h4 class="id" hidden\$="[[!secret.owned_by.length]]">Owner:</h4><span class="id">[[_displayUser(secret.owned_by,model.members)]]</span>
                    <h4 class="id" hidden\$="[[!secret.created_by.length]]">Created by:</h4><span class="id">[[_displayUser(secret.created_by,model.members)]]</span>
                </paper-material>
                <paper-material>
                    <div class="head">
                        <h4 class="key">Secret</h4>
                        <paper-button hidden\$="[[!visibleSecret]]" id="hideSecretbtn" on-tap="hideSecret" class="right link">Hide <span class="wide">Private Key</span>
                            <iron-icon icon="icons:visibility-off"></iron-icon>
                        </paper-button>
                        <paper-button hidden\$="[[!visibleSecret]]" on-tap="copySecret" class="right link">Copy <span class="wide">private key</span>
                            <iron-icon icon="content-copy"></iron-icon>
                        </paper-button>
                    </div>
                    <div id="secretContainer">
                        <paper-button hidden\$="[[visibleSecret]]" id="showSecretbtn" on-tap="showSecret">
                            <iron-icon icon="icons:visibility"></iron-icon> View Secret</paper-button>
                        <div class="textarea" hidden\$="[[!visibleSecret]]" id="secretPrivate">[[secretValue]]</div>
                    </div>
                </paper-material>
            </div>
        </div>
        <iron-ajax id="getSecretDataRequest" url="/api/v1/secrets/[[secret.id]]" on-response="handleGetSecretDataResponse" on-error="handleError"></iron-ajax>
    `,

    is: "secret-page",

    behaviors: [],

    properties: {
        secret: {
            type: Object
        },
        section: {
            type: Object
        },
        visibleSecret: {
            type: Boolean,
            value: false
        },
        secretValue:{
            type: Object,
            value: {}
        }
    },

    _displayUser (id, _members) {
        return this.model && id && this.model.members && this.model.members[id] ? this.model.members[id].name || this.model.members[id].email || this.model.members[id].username: '';
    },

    showSecret(){
      this.$.getSecretDataRequest.headers["Content-Type"] = 'application/json';
      this.$.getSecretDataRequest.headers["Csrf-Token"] = CSRFToken.value;
      this.$.getSecretDataRequest.body = {};
      this.$.getSecretDataRequest.generateRequest();
      this.visibleSecret = true;
    },

    handleGetSecretDataResponse(resp) {
        this.set('secretValue', resp.detail.response);
    },

    hideSecret() {
        this.visibleSecret = false;
    }
});