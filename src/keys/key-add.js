import '../../node_modules/@polymer/paper-material/paper-material.js';
import '../../node_modules/@polymer/paper-button/paper-button.js';
import '../../node_modules/@polymer/paper-progress/paper-progress.js';
import '../../node_modules/@polymer/paper-input/paper-input.js';
import '../../node_modules/@polymer/paper-input/paper-textarea.js';
import '../../node_modules/@polymer/paper-spinner/paper-spinner.js';
import '../../node_modules/@polymer/iron-ajax/iron-ajax.js';
import '../helpers/custom-validator.js';
import '../helpers/file-upload.js';
import { CSRFToken } from '../helpers/utils.js';
import { Polymer } from '../../node_modules/@polymer/polymer/lib/legacy/polymer-fn.js';
import { html } from '../../node_modules/@polymer/polymer/lib/utils/html-tag.js';

Polymer({
  _template: html`
    <style include="shared-styles forms single-page">
      paper-material {
        padding: 24px;
      }

      #content {
        max-width: 900px;
      }

      paper-progress {
        position: absolute;
        bottom: 113px;
        width: 100%;
        left: 0;
        right: 0;
        padding: 0 !important;
      }
      .bottom-actions {
        display: flex;
        flex-wrap: nowrap;
      }
      .flexchild {
        flex: 1;
        flex-wrap: wrap;
      }
      .bottom-actions paper-button {
        display: inline-flex;
        white-space: nowrap;
        margin-right: 8px !important;
        margin-top: 8px;
      }
      paper-button.submit-btn {
        align-self: flex-start;
        flex: none;
      }
      .pull-right {
        float: right;
      }
      iron-icon {
        width: 20px;
        height: 20px;
        color: inherit;
        margin-right: 8px;
        margin-left: -8px;
      }
      paper-progress#progresserror ::slotted(#primaryProgress) {
        background-color: var(--red-color);
      }
      .errormsg-container {
        color: var(--red-color);
      }
      .errormsg-container iron-icon {
        color: inherit;
      }
      paper-icon-button.docs {
        opacity: 0.54;
        width: 36px;
        height: 36px;
      }
      .single-head {
        @apply --key-page-head-mixin;
      }
      paper-textarea {
        --paper-input-container-shared-input-style_-_font-family: monospace;
      }
    </style>
    <div id="content">
      <paper-material class="single-head layout horizontal">
        <span class="icon">
          <iron-icon icon="[[section.icon]]"></iron-icon>
        </span>
        <div class="title flex">
          <h2>Add Key</h2>
          <div class="subtitle">You can generate or upload a key.</div>
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
            allowed-pattern="[A-Za-z0-9]"
            validator="isUniqueValidator"
            auto-validate=""
            error-message="Please enter a unique key's name"
            value="{{key.name}}"
          ></paper-input>
          <hr class="xs12" />
          <div class="field-helptext xs12">
            Add your private key in openssh format, or use the generator to
            create one for you.
            <a
              href="http://docs.mist.io/article/34-importing-your-ssh-keys-in-mist-io"
              target="new"
              hidden$="[[!docs]]"
            >
              <paper-icon-button
                suffix=""
                icon="icons:help"
                alt="Open docs"
                title="Open docs"
                class="docs"
              >
              </paper-icon-button>
            </a>
          </div>
          <paper-textarea
            id="privateKey"
            class="xs12"
            label="Private Key"
            rows="5"
            required=""
            auto-validate=""
            error-message="Please enter private key"
            value="{{key.privateKey}}"
            max-rows="5"
          ></paper-textarea>
          <paper-textarea
            id="publicKey"
            class="xs12"
            hidden$="[[!showPublicKey]]"
            label="Public Key"
            rows="5"
            value="{{key.publicKey}}"
            max-rows="5"
          ></paper-textarea>

          <paper-progress
            class="xs12"
            indeterminate=""
            hidden$="[[!showProgress]]"
          ></paper-progress>
          <hr class="xs12" />
          <p class="errormsg-container" hidden$="[[!formError]]">
            <iron-icon icon="icons:error-outline"></iron-icon
            ><span id="errormsg"></span>
          </p>

          <div class="bottom-actions xs12">
            <div class="flexchild">
              <paper-button class="pull-left" raised="" on-tap="_generateKey">
                <iron-icon icon="communication:vpn-key"></iron-icon> Generate
              </paper-button>
              <paper-button class="pull-left" raised="" on-tap="_uploadKey">
                <iron-icon icon="icons:file-upload"></iron-icon> Upload
              </paper-button>
            </div>

            <paper-button
              class="submit-btn pull-right"
              disabled$="[[!formReady]]"
              raised=""
              on-tap="_submitForm"
              >Add</paper-button
            >
          </div>
        </div>
        <input
          type="file"
          name="file"
          value="{{key.file}}"
          on-change="_uploadFile"
          hidden=""
          id="keyUpload"
        />
      </paper-material>
    </div>

    <file-upload></file-upload>

    <iron-ajax
      id="keyGenerateAjaxRequest"
      url="/api/v1/keys"
      method="POST"
      on-response="_handleKeyGenerateAjaxResponse"
      on-error="_handleKeyGenerateAjaxError"
    ></iron-ajax>
    <iron-ajax
      id="keyAddAjaxRequest"
      url="/api/v1/keys"
      method="PUT"
      on-response="_handleKeyAddAjaxResponse"
      on-error="_handleKeyAddAjaxError"
      handle-as="xml"
    ></iron-ajax>
  `,

  is: 'key-add',

  properties: {
    key: {
      type: Object,
      value() {
        return {
          name: '',
          publicKey: '',
          privateKey: '',
        };
      },
      notify: true,
    },
    model: {
      type: Object,
    },
    section: {
      type: Object,
    },
    showPublicKey: {
      type: Boolean,
      value: false,
    },
    sendingData: {
      type: Boolean,
      value: false,
    },
    formReady: {
      type: Boolean,
      value: false,
    },
    showProgress: {
      type: Boolean,
      computed: '_computeShowProgress(sendingData)',
    },
    origin: {
      type: String,
    },
    formError: {
      type: Boolean,
      value: false,
    },
  },

  listeners: {
    'iron-overlay-closed': '_modalClosed',
    'file-uploaded': '_fileUploadedResponse',
  },

  observers: ['_fieldsChanged(key.*, sendingData)'],

  ready() {
    if (this.shadowRoot.querySelector('custom-validator')) {
      this.shadowRoot.querySelector(
        'custom-validator'
      ).validate = this.isUniqueValidator.bind(this);
    }
    if (
      document
        .querySelector('mist-app')
        .shadowRoot.querySelector('app-location')
    ) {
      this.set(
        'origin',
        document
          .querySelector('mist-app')
          .shadowRoot.querySelector('app-location').queryParams.origin
      );
    }
  },

  _fieldsChanged(key, sendingData) {
    this.set('formError', false);
    this.async(() => {
      const inputs = this.shadowRoot.querySelectorAll(
        'paper-input, paper-textarea'
      );
      const valid = [].every.call(inputs, el => {
        return !((el.required && !el.value) || el.invalid);
      });

      this.set('formReady', valid && !sendingData);
    });
  },

  _computeShowProgress(sendingData) {
    return sendingData;
  },

  isUniqueValidator(value) {
    const isUnique = this.model.keysArray.every(key => {
      return key.name !== value;
    });
    return isUnique;
  },

  _openAddKeyModal() {
    this.$.addKeyModal.open();
  },

  _closeAddKeyModal() {
    this.$.addKeyModal.close();
  },

  _uploadKey(_e) {
    this.$.keyUpload.click();
  },

  _uploadFile(e) {
    this.shadowRoot.querySelector('file-upload').upload({
      e,
      type: 'ssh_key',
    });
  },

  _fileUploadedResponse(e) {
    const { file } = e.detail;
    if (file.type === 'ssh_key') {
      this.set('key.privateKey', file.value);
    }
  },

  _modalClosed() {
    this._formReset();
  },

  _submitForm() {
    this.$.keyAddAjaxRequest.headers['Content-Type'] = 'application/json';
    this.$.keyAddAjaxRequest.headers['Csrf-Token'] = CSRFToken.value;
    this.$.keyAddAjaxRequest.body = {
      name: this.key.name,
      priv: this.key.privateKey,
    };
    this.$.keyAddAjaxRequest.generateRequest();

    this.set('sendingData', true);
  },

  _handleKeyAddAjaxResponse(e) {
    this.set('sendingData', false);
    const keyID = JSON.parse(e.detail.xhr.response).id;
    if (!this.origin) {
      this.dispatchEvent(
        new CustomEvent('go-to', {
          bubbles: true,
          composed: true,
          detail: {
            url: `/keys/${keyID}`,
          },
        })
      );
    } else {
      // if origin machines/machine_id reopen associate key dialog
      if (
        this.origin.startsWith('/machines/') &&
        this.origin !== '/machines/+create'
      ) {
        this.dispatchEvent(
          new CustomEvent('open-and-select', {
            bubbles: true,
            composed: true,
            detail: {
              key: keyID,
            },
          })
        );
      } else if (
        this.origin === '/machines/+create' ||
        this.origin === '/clouds/+add' ||
        this.origin.startsWith('/stacks/') ||
        this.origin.startsWith('/clouds/')
      ) {
        this.dispatchEvent(
          new CustomEvent('update-keys', {
            bubbles: true,
            composed: true,
            detail: {
              key: keyID,
            },
          })
        );
        if (
          this.origin.startsWith('/clouds/') &&
          this.origin !== '/clouds/+add'
        )
          this.dispatchEvent(
            new CustomEvent('cloud-edit-key', {
              bubbles: true,
              composed: true,
              detail: {
                key: keyID,
              },
            })
          );
      }
      window.history.back();
    }

    this.debounce(
      'formReset',
      () => {
        this._formReset();
      },
      500
    );
  },

  _handleKeyAddAjaxError(e) {
    console.log('_handleKeyAddAjaxError', e);
    this.set('sendingData', false);
    this.set('formError', true);
    this.$.errormsg.textContent = e.detail.request.xhr.responseText;
    // this.$.errormsg.textContent = e.detail.response;
  },

  _formReset() {
    this.set('key.name', '');
    this.set('key.publicKey', '');
    this.set('key.privateKey', '');
    this.set('showPublicKey', false);

    // reset form validation
    ['name', 'publicKey', 'privateKey'].forEach(el => {
      const input = this.shadowRoot.querySelector(`#${el}`);
      if (input) {
        input.invalid = false;
      }
    }, this);
  },

  _generateKey(_e) {
    this.$.keyGenerateAjaxRequest.headers['Content-Type'] = 'application/json';
    this.$.keyGenerateAjaxRequest.headers['Csrf-Token'] = CSRFToken.value;
    this.$.keyGenerateAjaxRequest.body = {};
    this.$.keyGenerateAjaxRequest.generateRequest();

    this.set('sendingData', true);
  },

  _generateKeyAjaxRequest(_e) {
    this.set('sendingData', true);
  },

  _handleKeyGenerateAjaxResponse(e) {
    this.set('sendingData', false);
    const { response } = e.detail;
    this.set('key.publicKey', response.public);
    this.set('key.privateKey', response.priv);
    this.set('sendingData', false);
    this.set('showPublicKey', true);
  },

  _handleKeyGenerateAjaxError(_e) {
    this.set('sendingData', false);
  },
});
