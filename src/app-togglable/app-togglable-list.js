import '@polymer/polymer/polymer-legacy.js';
import '@polymer/paper-styles/typography.js';
import './app-togglable.js';
import { Polymer } from '@polymer/polymer/lib/legacy/polymer-fn.js';
import { html } from '@polymer/polymer/lib/utils/html-tag.js';

Polymer({
  _template: html`
    <style include="shared-styles">
      .flex-horizontal-with-ratios {
        @apply --layout-horizontal;
        align-content: stretch;
      }

      .flexchild {
        @apply --layout-flex;
      }

      paper-material {
        padding: 8px;
      }

      paper-icon-button {
        transition: transform 180ms ease-in;
      }

      :host([open]) paper-icon-button {
        transform: rotate(-180deg);
      }

      app-togglable:last-of-type ::slotted(paper-item) {
        border-bottom: 0 none !important;
      }
    </style>
    <h3 class="smallcaps">
      [[title]]
      <paper-icon-button
        icon="hardware:keyboard-arrow-down"
        id="toggleAll"
        on-tap="_toggle"
      ></paper-icon-button>
    </h3>
    <paper-tooltip for="toggleAll" position="bottom">Toggle All</paper-tooltip>
    <paper-material id="workflows">
      <template is="dom-repeat" items="[[items]]">
        <app-togglable title="[[item.name]]" info="[[item]]"></app-togglable>
      </template>
    </paper-material>
  `,

  is: 'app-togglable-list',

  properties: {
    title: {
      type: String,
    },
    items: {
      type: Array,
    },
    open: {
      type: Boolean,
      value: false,
      reflectToAttribute: true,
    },
  },
  /* eslint-disable no-param-reassign */
  _toggle(_e) {
    this.open = !this.open;
    const els = this.shadowRoot.querySelectorAll('app-togglable');
    [].forEach.call(
      els,
      (el, _index) => {
        el.open = this.open;
        if (this.open) el.$.infoarea.show();
        else el.$.infoarea.hide();
      },
      this
    );
  },
  /* eslint-enable no-param-reassign */
});
