import '../node_modules/@polymer/app-route/app-route.js';
import { Polymer } from '../node_modules/@polymer/polymer/lib/legacy/polymer-fn.js';
import { html } from '../node_modules/@polymer/polymer/lib/utils/html-tag.js';

Polymer({
  _template: html`
    <style include="shared-styles">
      :host {
        padding: 10px 20px;
        text-align: center;
        vertical-align: middle;
        margin-top: 20%;
      }
    </style>
    <div id="content">
      <h1>404</h1>
      <p>Page can not be found.</p>
      <a href="/"><paper-button>Back to home</paper-button></a>
    </div>
  `,
  is: 'page-not-found',
});
