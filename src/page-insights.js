import '../node_modules/@polymer/polymer/polymer-legacy.js';
import '../node_modules/@polymer/app-route/app-route.js';
import '../node_modules/@polymer/paper-material/paper-material.js';
import '../node_modules/@polymer/paper-dropdown-menu/paper-dropdown-menu.js';
import '../node_modules/@polymer/paper-spinner/paper-spinner.js';
import '../node_modules/@polymer/iron-icons/iron-icons.js';
import '../node_modules/@mistio/mist-list/mist-list.js';
import '../node_modules/@polymer/iron-media-query/iron-media-query.js';
import { IronResizableBehavior } from '../node_modules/@polymer/iron-resizable-behavior/iron-resizable-behavior.js';
import '../node_modules/@mistio/mist-insights/mist-insights.js';
import { Polymer } from '../node_modules/@polymer/polymer/lib/legacy/polymer-fn.js';
import { html } from '../node_modules/@polymer/polymer/lib/utils/html-tag.js';

Polymer({
  _template: html`
    <style include="shared-styles forms single-page tags-and-labels">
      :host {
        /*--insights-general-font*/
        --insights-general-font-font-family: 'Roboto', 'Noto', sans-serif;
        --insights-general-font-font-size: 16px;
        --insights-general-font-line-height: 1.8em;
        --insights-general-font-color: rgba(0, 0, 0, 0.87);

        /*--insights-h2*/
        --insights-h2-font-size: 2.4em;
        --insights-h2-margin: 0 !important;
        --insights-h2-font-weight: 400;
        --insights-h2-letter-spacing: 0;
        --insights-h2-line-height: 48px;

        /*--insights-h2-title*/
        --insights-h2-title-font-size: 1.6em;
        --insights-h2-title-margin: 0 !important;

        /*--insights-legends*/
        --insights-legends-text-transform: uppercase;
        --insights-legends-font-size: 0.9em;
        --insights-legends-color: rgba(0, 0, 0, 0.54);

        /*--material-css*/
        --material-css-padding: 24px;
        --material-css-margin-bottom: 16px;

        --red-color: #e82438;
        --green-color: #38b549;
      }
      .opaque {
        opacity: 0.34;
      }
      .error iron-icon {
        opacity: 0.32;
        cursor: pointer;
      }
      .error {
        color: var(--red-color);
      }
      .blue {
        color: var(--mist-blue);
      }
      :host mist-insights ::slotted(#quick-overview-data) {
        flex-wrap: wrap;
        justify-content: space-between;
      }
      :host mist-insights ::slotted(#quick-overview-data > div) {
        min-width: 160px;
      }
      :host mist-insights ::slotted(#quick-overview-data > div .smaller) {
        padding-right: 24px;
      }
      @media screen and (max-width: 560px) {
        :host mist-insights ::slotted(#quick-overview-data > div) {
          margin-bottom: 12px;
          padding-bottom: 12px;
          border-bottom: 1px solid #ddd;
        }
      }
      @media screen and (max-width: 425px) {
        :host mist-insights ::slotted(.head) {
          flex-direction: column;
        }
        :host mist-insights ::slotted(.head > div) {
          text-align: left;
          padding-left: 0;
          margin-top: 12px;
          margin-bottom: 12px;
          padding-bottom: 12px;
          border-bottom: 1px solid #ddd;
        }
      }
      @media screen and (max-width: 634px) {
        :host mist-insights ::slotted(paper-button.clear) {
          padding-left: 0;
          margin-left: 0;
        }
      }
    </style>
    <app-route route="{{route}}"></app-route>
    <iron-media-query
      query="(min-width: 1180px)"
      query-matches="{{largescreen}}"
    ></iron-media-query>

    <div id="content" class="content404" hidden$="[[insightsEnabled]]">
      <h1>404</h1>
      <p>
        Insights is not enabled for this organization account.<br />
        Contact
        <a href$="mailto:[[email.info]]"><span class="info-email"></span></a>
        for more information.
      </p>
    </div>
    <div id="content" hidden="[[!insightsEnabled]]">
      <mist-insights
        model="[[model]]"
        period="week"
        currency="[[currency]]"
      ></mist-insights>
    </div>
  `,
  is: 'page-insights',
  behaviors: [IronResizableBehavior],
  properties: {
    email: {
      type: Object,
    },
    model: {
      type: Object,
    },
    insightsEnabled: {
      type: Boolean,
      value: false,
    },
    largescreen: {
      type: Boolean,
    },
    currency: {
      type: Object,
    },
  },
});
