import '../../node_modules/@polymer/polymer/polymer-legacy.js';
import '../../node_modules/@polymer/paper-styles/typography.js';
import { Polymer } from '../../node_modules/@polymer/polymer/lib/legacy/polymer-fn.js';
import { html } from '../../node_modules/@polymer/polymer/lib/utils/html-tag.js';

Polymer({
  _template: html`
    <style include="shared-styles">
      :host {
      }

      :host:hover {
        background-color: #eee;
      }

      paper-item {
        padding: 0 0 0 40px;
      }

      paper-item a > * {
        padding: 8px 0;
      }

      .flex-horizontal-with-ratios {
        @apply --layout-horizontal;
        align-items: center;
        flex: 1 100%;
      }

      .flexchild {
        @apply --layout-flex;
      }

      .icon {
        border-radius: 100px;
        width: 32px;
        height: 32px;
        line-height: 32px;
        color: #fff;
        overflow: hidden;
        text-align: center;
        color: #ddd;
        opacity: 0.32;
        margin-right: 32px;
      }

      .capitalize {
        text-transform: capitalize;
      }

      .state {
        display: inline-block;
        width: 8px;
        height: 8px;
        border-radius: 50%;
      }

      .state.error {
        background-color: var(--red-color);
      }

      .state.running {
        background-color: var(--green-color);
      }
    </style>
    <paper-item class="flex-horizontal-with-ratios">
      <div class="icon">
        <iron-icon icon="hardware:device-hub"></iron-icon>
      </div>
      <a
        class="regular flexchild flex-horizontal-with-ratios"
        href$="/networks/[[network.id]]"
      >
        <div class="flexchild"><span class="name">[[network.name]]</span></div>
        <div class="flexchild">[[network.subnets.length]] subnets</div>
        <div class="flexchild capitalize">[[network.cloud.title]]</div>
      </a>
    </paper-item>
  `,

  is: 'stack-network-item',

  properties: {
    model: {
      type: Object,
    },
    network: {
      type: Object,
    },
  },
});
