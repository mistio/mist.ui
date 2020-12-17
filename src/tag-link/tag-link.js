import { Polymer } from '../../node_modules/@polymer/polymer/lib/legacy/polymer-fn.js';
import { html } from '../../node_modules/@polymer/polymer/lib/utils/html-tag.js';

Polymer({
  _template: html`
    <style>
      :host,
      a {
        display: inline-block;
        cursor: pointer;
        color: #606060;
      }

      :host(:hover) span {
        text-decoration: underline;
      }

      span {
        font-size: 12px;
        font-weight: 500;
        color: var(--primary-text-color);
        text-decoration: none;
      }
    </style>
    <span>{{name}}</span>
  `,

  is: 'tag-link',
  enableCustomStyleProperties: true,

  properties: {
    name: {
      type: String,
      notify: true,
      reflectToAttribute: true,
      observer: 'convert',
    },
  },

  convert() {
    if (typeof this.name === 'object') {
      this.name = this.name.valueOf();
    }
  },
});
