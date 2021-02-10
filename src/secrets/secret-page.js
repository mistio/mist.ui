import '../../node_modules/@polymer/paper-button/paper-button.js';
import '../../node_modules/@polymer/paper-spinner/paper-spinner.js';
import { CSRFToken } from '../helpers/utils.js';
import { Polymer } from '../../node_modules/@polymer/polymer/lib/legacy/polymer-fn.js';
import { html } from '../../node_modules/@polymer/polymer/lib/utils/html-tag.js';

Polymer({
    _template: html`
        <style>
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
            #showSecretbtn iron-icon {
                color: var(--paper-button-text) !important;
                width: 20px;
                height: 20px;
            }
            secret-actions {
                fill: #fff;
                min-width: 50%;
            }        
            .secret-info > paper-material > span {
            margin-right: 16px;
            }
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
                <paper-material class="single-head layout horizontal">
                    <h4 class="id">Secret ID:</h4><span class="id">[[secret.id]]</span>
                    <h4 class="id" hidden\$="[[!secret.owned_by.length]]">Owner:</h4><span class="id">[[_displayUser(secret.owned_by,model.members)]]</span>
                    <h4 class="id" hidden\$="[[!secret.created_by.length]]">Created by:</h4><span class="id">[[_displayUser(secret.created_by,model.members)]]</span>
                </paper-material>
                <paper-material>
                    <div class="head">
                        <h4 class="secret">Secret</h4>
                        <paper-button hidden\$="[[!visibleSecret]]" id="hideSecretbtn" on-tap="hideSecret" class="right link">Hide <span class="wide">Secret</span>
                            <iron-icon icon="icons:visibility-off"></iron-icon>
                        </paper-button>
                        <paper-button hidden\$="[[!visibleSecret]]" on-tap="copySecret" class="right link">Copy <span class="wide">Secret</span>
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
        },
        model:{
            type: Object
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