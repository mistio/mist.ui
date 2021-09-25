import '@polymer/polymer/polymer-legacy.js';
import '@polymer/paper-styles/typography.js';
import '@polymer/paper-button/paper-button.js';
import '@polymer/neon-animation/animations/scale-up-animation.js';
import '@polymer/neon-animation/animations/fade-out-animation.js';
import '@polymer/paper-dialog/paper-dialog.js';
import '@polymer/paper-dialog-scrollable/paper-dialog-scrollable.js';
import '@mistio/mist-form/mist-form.js';
import '@mistio/mist-list/code-viewer.js';
import '../element-for-in/element-for-in.js';
import { Polymer } from '@polymer/polymer/lib/legacy/polymer-fn.js';
import { html } from '@polymer/polymer/lib/utils/html-tag.js';

Polymer({
  _template: html`
    <style include="shared-styles dialogs forms">
      p.margin {
        margin: 16px 0 !important;
      }
      ul {
        padding-left: 18px;
        color: rgba(0, 0, 0, 0.54);
        font-size: 16px;
      }
    </style>

    <vaadin-dialog id="dialogModal" theme="mist-form-dialog" with-backdrop="">
      <style>
        :host paper-checkbox {
          float: left;
          padding-top: 13px;
          margin-right: 0;
          --paper-checkbox-checked-color: var(--mist-blue) !important;
          --paper-checkbox-checked-ink-color: var(--mist-blue) !important;
        }
        code-viewer {
          height: 80vh;
        }
        .title {
          display: flex;
          justify-content: space-between;
          padding: 0 20px;
        }
        paper-icon-button.docs {
          opacity: 0.54;
          width: 36px;
          height: 36px;
          color: #424242;
          margin-left: -8px;
        }
        mist-form::part(mist-form-checkbox) {
          --paper-checkbox-checked-color: var(--mist-blue) !important;
          --paper-checkbox-checked-ink-color: var(--mist-blue) !important;
        }

        mist-form::part(mist-form-checkbox-group) {
          --paper-checkbox-checked-color: var(--mist-blue) !important;
          --paper-checkbox-checked-ink-color: var(--mist-blue) !important;
        }
      </style>
      <template>
        <div class="title">
          <h2>
            [[title]]<a
              href="https://docs.mist.io/article/177-constraints"
              target="new"
              class="helpHref"
            >
              <paper-icon-button
                icon="icons:help"
                alt="Open docs"
                title="Open docs"
                class="docs"
              >
              </paper-icon-button>
            </a>
          </h2>
          <paper-toggle-button
            checked="{{showJSON}}"
            on-checked-changed="_updateInitialValues"
          >
            JSON
          </paper-toggle-button>
        </div>
        <div class="paper-dialog-scrollable">
          <div hidden$="[[hideText]]">
            <p>[[body]]</p>
            <p hidden$="[[!subscript]]">[[subscript]]</p>
          </div>
          <mist-form
            id="[[formId}}"
            hidden$="[[showJSON]]"
            src="[[mistFormFields.src]]"
            dynamic-data-namespace="[[mistFormFields.formData]]"
            initial-values="[[initialValues]]"
            transform-initial-values="[[transformInitialValues]]"
            on-mist-form-request="_closeDialog"
            on-mist-form-cancel="_dismissDialog"
            on-mist-form-value-changed="_updateFormValue"
            exportparts="mist-form-text-field, mist-form-dropdown, mist-form-radio-group, mist-form-checkbox-group, mist-form-text-field, mist-form-text-area, mist-form-checkbox, mist-form-duration-field, mist-form-multi-row, mist-form-multi-row-row, mist-form-custom-field, mist-form-button"
          >
            <div id="mist-form-custom">
              <mist-size-field
                mist-form-type="mistSizeField"
                mist-form-value-change="value-changed"
                mist-form-value-path="detail.value"
              ></mist-size-field>
            </div>
          </mist-form>
          <template is="dom-if" if="[[showJSON]]" restamp="">
            <code-viewer
              language="json"
              theme="vs-light"
              value="[[_stringifyInitialValues(initialValues)]]"
              on-editor-value-changed="_updateJsonValue"
            ></code-viewer>
          </template>
        </div>
      </template>
    </vaadin-dialog>
  `,

  is: 'mist-form-dialog',

  properties: {
    title: {
      type: String,
      value: null,
    },
    body: {
      type: String,
      value: null,
    },
    reason: {
      type: String,
      value: null,
    },
    subscript: {
      type: String,
      value: false,
    },
    mistformfields: {
      type: Object,
    },
    hideText: {
      type: Boolean,
      value: false,
    },
    formId: {
      type: String,
      value: '',
      reflectToAttribute: true,
    },
    showJSON: {
      type: Boolean,
      value: false,
    },
    formValue: {
      type: Object,
    },
    jsonValue: {
      type: String,
    },
  },
  _updateFormValue(e) {
    this.formValue = e.detail.value;
  },
  _updateJsonValue(e) {
    this.jsonValue = e.detail.value;
  },
  _openDialog() {
    this.$.dialogModal.opened = true;
  },
  _dismissDialog() {
    this.$.dialogModal.opened = false;
  },
  _updateInitialValues(e) {
    const checked = e.detail.value;
    if (checked) {
      this.initialValues = this.formValue;
    } else if (this.jsonValue) {
      try {
        this.initialValues = JSON.parse(this.jsonValue);
      } catch (_e) {
        console.error(_e);
      }
    }
  },
  _closeDialog(e) {
    this.$.dialogModal.opened = false;
    this._modalClosed(e);
  },
  _stringifyInitialValues() {
    return JSON.stringify(this.initialValues, undefined, 2);
  },
  _modalClosed(e) {
    this.dispatchEvent(
      new CustomEvent('confirmation', {
        bubbles: true,
        composed: true,
        detail: {
          response: 'confirm',
          confirmed: true,
          reason: this.reason,
          value: e.detail.params,
        },
      })
    );
  },
});
