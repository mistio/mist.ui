import '@polymer/iron-icons/hardware-icons.js';
import '@polymer/iron-icons/communication-icons.js';
import '@polymer/iron-icons/image-icons.js';
import { Polymer } from '@polymer/polymer/lib/legacy/polymer-fn.js';
import { html } from '@polymer/polymer/lib/utils/html-tag.js';

Polymer({
  _template: html`
    <style>
      :host {
        display: inline-block;
        line-height: 34px;
        width: 34px;
        height: 34px;
        text-align: center;
        font-weight: 500;
        font-size: 18px;
        outline: none;
        padding: 0 5px 0 4px;
      }
      :host(.large) {
        line-height: 64px;
        width: 64px;
        height: 64px;
        font-size: 30px;
      }
      iron-icon {
        opacity: 0.8;
      }
    </style>
    <iron-icon icon="[[icon]]"></iron-icon>
  `,

  is: 'section-symbol',

  properties: {
    icon: {
      type: String,
    },
  },
});
