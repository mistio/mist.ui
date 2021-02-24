import '@polymer/iron-ajax/iron-ajax.js';
import '@polymer/paper-material/paper-material.js';
import '../helpers/custom-validator.js';
import '../helpers/code-viewer.js';
import { CSRFToken } from '../helpers/utils.js';
// import { Polymer } from '@polymer/polymer/lib/legacy/polymer-fn.js';
// import { html } from '@polymer/polymer/lib/utils/html-tag.js';
import { PolymerElement, html } from '@polymer/polymer/polymer-element.js';

export class SecretAdd extends PolymerElement{
    constructor() {
        super();
    }
    static get is() {return 'secret-add';}
    static get template() {
        return html`
            <style include="shared-styles forms single-page">
                paper-material {
                    padding: 24px;
                }

                #content {
                    max-width: 900px;
                }
                .single-head {
                    @apply --secret-page-head-mixin;
                  }
                iron-icon {
                    width: 20px;
                    height: 20px;
                    color: inherit;
                    margin-right: 8px;
                    margin-left: -8px;
                }
                .flexchild {
                    display: flex;
                    flex-wrap: wrap;
                    justify-content: center;
                }
            </style>
            <div id="content">
                <paper-material class="single-head layout horizontal">
                    <span class="icon">
                        <iron-icon icon="[[section.icon]]"></iron-icon>
                    </span>
                    <div class="title flex">
                        <h2>Create a New Secret</h2>
                    </div>
                </paper-material>
                <paper-material>
                    <custom-validator validator-name="isUniqueValidator"></custom-validator>
                    <div class="grid-row">
                        <paper-input
                            id="name"
                            class="xs6 m6"
                            label="Name"
                            required=""
                            allowed-pattern="[A-Za-z0-9\/]"
                            validator="isUniqueValidator"
                            auto-validate=""
                            error-message="Please enter a unique secret's name"
                            value="{{secret.name}}"
                        ></paper-input>
                        <paper-progress
                        class="xs12"
                        indeterminate=""
                        hidden$="[[!sendingData]]"
                        ></paper-progress>
                        <hr class="xs12" />
                        <p class="errormsg-container" hidden$="[[!formError]]">
                            <iron-icon icon="icons:error-outline"></iron-icon
                            ><span id="errormsg"></span>
                        </p>
                        <div class="field-helptext xs12">
                            Add your secret in JSON format key-value pairs.
                        </div>
                        <template is="dom-if" if="[[show]]" restamp="">
                            <code-viewer
                            id="secretEditor"
                            language="json"
                            theme="vs-dark"
                            read-only$="[[!show]]"
                            value="[[_getDefaultValue()]]"
                            on-editor-value-changed="_codeEditorValueChanged"
                            ></code-viewer>
                        </template>
                    </div>
                    <div class="bottom-actions xs12">
                        <div class="flexchild">
                            <paper-button
                            class="submit-btn pull-right"
                            disabled$="[[!formReady]]"
                            raised=""
                            on-tap="_submitForm"
                            >Create</paper-button
                            >
                        </div>
                    </div>
                </paper-material>
            </div>
            <iron-ajax
            id="secretCreateAjaxRequest"
            url="/api/v2/secrets"
            method="POST"
            on-response="_handleSecretCreateAjaxResponse"
            on-error="_handleSecretCreateAjaxError"
            handle-as="xml"
            ></iron-ajax>
        `
    }
    static get properties() {
        return {
            secret: {
                type: Object,
                value() {
                    return {
                        name: '',
                        secret: ''
                    };
                },
                notify: true
            },
            section: {
                type: Object,
            },
            model: {
                type: Object,
            },
            show: {
                type: Boolean,
                value: true
            },
            sendingData: {
                type: Boolean,
                value: false
            },
            formError: {
                type: Boolean,
                value: true
            },
            path:{
                type: Array
            }
        }
    }

    _getDefaultValue(){
        return JSON.stringify({"":""}, undefined, 2);
    }

    _codeEditorValueChanged(e){
        this.secret.secret = JSON.parse(e.detail.value);
    }

    _submitForm() {
        this.$.secretCreateAjaxRequest.headers['Content-Type'] = 'application/json';
        this.$.secretCreateAjaxRequest.headers['Csrf-Token'] = CSRFToken.value;
        this.$.secretCreateAjaxRequest.body = {
          name: this._getPath() + this.secret.name,
          secret: this.secret.secret,
        };
        this.$.secretCreateAjaxRequest.generateRequest();
    
        this.set('sendingData', true);
    }

    _handleSecretCreateAjaxResponse(e) {
        this.set('sendingData', false);
        const newId = JSON.parse(e.detail.xhr.response).id
        window.location.href = `/secrets/${newId}`;
    }
    _handleSecretCreateAjaxError(e){
        console.log('secret create error', e);
        this.set('sendingData', false);
        this.set('formError', true);
        this.$.errormsg.textContent = e.detail.request.xhr.responseText;
    }

    _getPath() {
        if(this.path[0].name === "/") this.path.shift();
        let dirPath = "";
        this.path.forEach(pItem => {
            dirPath += `${pItem.name}/`;
        });
        return dirPath;
    }
};

customElements.define(SecretAdd.is, SecretAdd);