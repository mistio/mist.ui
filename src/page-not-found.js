import '@polymer/app-route/app-route.js';
import { html } from '@polymer/polymer/lib/utils/html-tag.js';
import { PolymerElement } from '@polymer/polymer/polymer-element.js';

export default class PageNotFound extends PolymerElement {
  static get template() {
    return html`
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
    `;
  }

  static get is() {
    return 'page-not-found';
  }
}

customElements.define('page-not-found', PageNotFound);
