import '../../node_modules/@polymer/polymer/polymer-legacy.js';
import '../../node_modules/@polymer/paper-button/paper-button.js';
import '../../node_modules/@vaadin/vaadin-dialog/vaadin-dialog.js';
import '../../node_modules/@polymer/paper-styles/typography.js';
import { CSRFToken } from '../helpers/utils.js';
import { Polymer } from '../../node_modules/@polymer/polymer/lib/legacy/polymer-fn.js';
import { html } from '../../node_modules/@polymer/polymer/lib/utils/html-tag.js';

Polymer({
  _template: html`
    <style include="shared-styles dialogs">
      :host {
      }

      .submit-btn {
        background-color: var(--mist-blue);
        color: #fff;
      }
    </style>

    <vaadin-dialog id="editTemplateModal" theme="mist-dialog" with-backdrop="">
      <template>
        <h2>Edit Template</h2>
        <div class="paper-dialog-scrollable">
          <p>
            <paper-input
              id="name"
              label="Name"
              error-message="Please enter template's name"
              value="{{newTemplate.name}}"
            ></paper-input>
            <paper-textarea
              id="description"
              label="Description (optional)"
              rows="5"
              max-rows="5"
              error-message="Please enter template's description"
              value="{{newTemplate.description}}"
            ></paper-textarea>
          </p>
          <div class="clearfix btn-group">
            <paper-button
              class="close link"
              icon="clear"
              on-tap="_closeEditTemplateModal"
              >Cancel</paper-button
            >
            <paper-button
              class="submit-btn btn-block blue"
              disabled$="[[!formReady]]"
              raised=""
              on-tap="_submitForm"
              >Submit</paper-button
            >
          </div>
        </div>
      </template>
    </vaadin-dialog>

    <iron-ajax
      id="editTemplateAjax"
      url="/api/v1/templates/[[template._id]]"
      method="PUT"
      on-request="_editTemplateAjax"
      on-response="_ajaxResponse"
    ></iron-ajax>
  `,

  is: 'template-edit',

  properties: {
    template: {
      type: Object,
    },
    newTemplate: {
      type: Object,
      computed: '_computeNewTemplate(template)',
      notify: true,
    },
    sendingData: {
      type: Boolean,
      value: false,
    },
    formReady: {
      type: Boolean,
      computed: '_computeFormReady(newTemplate.name, sendingData)',
    },
  },

  listeners: {
    'iron-overlay-closed': '_modalClosed',
  },

  ready() {},

  _computeNewTemplate(template) {
    if (template) {
      return {
        name: template.name,
        description: template.description,
      };
    }
    return {};
  },

  _computeFormReady(name, sendingData) {
    let formReady = false;

    if (name && name !== '') {
      formReady = true;
    }

    if (sendingData) {
      formReady = false;
    }

    return formReady;
  },

  _openEditTemplateModal() {
    this.$.editTemplateModal.opened = true;
  },

  _closeEditTemplateModal() {
    this.$.editTemplateModal.opened = false;
  },

  _modalClosed() {
    this._formReset();
  },

  _submitForm() {
    this.$.editTemplateAjax.headers['Content-Type'] = 'application/json';
    this.$.editTemplateAjax.headers['Csrf-Token'] = CSRFToken.value;
    this.$.editTemplateAjax.body = {
      name: this.newTemplate.name,
      description: this.newTemplate.description,
    };
    this.$.editTemplateAjax.generateRequest();
    this._closeEditTemplateModal();
  },

  _formReset() {
    this._computeNewTemplate(this.template);
  },

  _editTemplateAjax() {
    console.log('edit', this.$.editTemplateAjax);
  },

  _editTemplateRequest() {
    this.set('sendingData', true);
  },

  _editTemplateResponse() {
    this.set('sendingData', false);
  },
});
