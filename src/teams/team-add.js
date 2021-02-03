import '@polymer/paper-button/paper-button.js';
import '@polymer/paper-toggle-button/paper-toggle-button.js';
import '@vaadin/vaadin-dialog/vaadin-dialog.js';
import '@polymer/paper-input/paper-textarea.js';
import '@polymer/iron-ajax/iron-ajax.js';
import './team-add-element.js';
import { Polymer } from '@polymer/polymer/lib/legacy/polymer-fn.js';
import { html } from '@polymer/polymer/lib/utils/html-tag.js';

Polymer({
  _template: html`
    <style include="shared-styles dialogs">
      :host {
        width: 100%;
        position: relative;
      }
    </style>
    <vaadin-dialog id="teamAddModal" theme="mist-dialog" with-backdrop="">
      <template>
        <team-add-element
          organization="[[organization]]"
          rbac="[[rbac]]"
          referral="[[referral]]"
        ></team-add-element>
      </template>
    </vaadin-dialog>
  `,

  is: 'team-add',

  properties: {
    organization: {
      type: Object,
    },
    referral: {
      type: String,
      value: null,
    },
    rbac: {
      type: Boolean,
      value: false,
    },
  },

  openDialog() {
    this.$.teamAddModal.opened = true;
  },
});
