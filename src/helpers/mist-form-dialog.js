import '@polymer/polymer/polymer-legacy.js';
import '@polymer/paper-styles/typography.js';
import '@polymer/paper-button/paper-button.js';
import '@polymer/neon-animation/animations/scale-up-animation.js';
import '@polymer/neon-animation/animations/fade-out-animation.js';
import '@polymer/paper-dialog/paper-dialog.js';
import '@polymer/paper-dialog-scrollable/paper-dialog-scrollable.js';
import '@mistio/mist-form/mist-form.js';
import { Polymer } from '@polymer/polymer/lib/legacy/polymer-fn.js';
import { html } from '@polymer/polymer/lib/utils/html-tag.js';

Polymer({
  _template: html`
    <style include="shared-styles dialogs forms">
      vaadin-dialog {
        max-width: 450px;
      }
      vaadin-dialog {
        max-width: 450px;
      }
      vaadin-dialog h2 {
        text-transform: capitalize;
      }

      p.margin {
        margin: 16px 0 !important;
      }
      ul {
        padding-left: 18px;
        color: rgba(0, 0, 0, 0.54);
        font-size: 16px;
      }
      :host paper-checkbox {
        float: left;
        padding-top: 13px;
        margin-right: 0;
        --paper-checkbox-checked-color: var(--mist-blue) !important;
        --paper-checkbox-checked-ink-color: var(--mist-blue) !important;
      }
    </style>

    <vaadin-dialog id="dialogModal" theme="mist-form-dialog" with-backdrop="">
      <style>
        h2::first-letter {
          text-transform: capitalize;
        }
        :host [part~='overlay'] {
          padding: 20px;
        }
        :host paper-checkbox {
          float: left;
          padding-top: 13px;
          margin-right: 0;
          --paper-checkbox-checked-color: var(--mist-blue) !important;
          --paper-checkbox-checked-ink-color: var(--mist-blue) !important;
        }
      </style>
      <template>
        <h2>[[title]]</h2>
        <div class="paper-dialog-scrollable">
          <div hidden$="[[hideText]]">
            <p>[[body]]</p>
            <p hidden$="[[!subscript]]">[[subscript]]</p>
          </div>
          <mist-form
            id="[[formId}}"
            src="[[mistFormFields.src]]"
            dynamic-data-namespace="[[mistFormFields.formData]]"
            initial-values="[[initialValues]]"
            on-mist-form-request="_closeDialog"
            on-mist-form-cancel="_dismissDialog"
          >
          </mist-form>
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
    action: {
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
    btnClass: {
      type: String,
      value: '',
    },
  },
  _openDialog() {
    this.$.dialogModal.opened = true;
  },
  _dismissDialog() {
    this.$.dialogModal.opened = false;
  },
  _closeDialog(e) {
    this.$.dialogModal.opened = false;
    this._modalClosed(e);
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
