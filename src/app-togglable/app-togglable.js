import '../../node_modules/@polymer/polymer/polymer-legacy.js';
import '../../node_modules/@polymer/paper-styles/typography.js';
import '../../node_modules/@polymer/iron-collapse/iron-collapse.js';
import { YAML } from '../../node_modules/yaml/browser/dist/index.js';
import { Polymer } from '../../node_modules/@polymer/polymer/lib/legacy/polymer-fn.js';
import { html } from '../../node_modules/@polymer/polymer/lib/utils/html-tag.js';

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

      .command-container {
        background-color: #444;
        color: #fff;
        font-family: monospace;
        padding: 0;
      }

      pre {
        padding: 20px;
        margin: 0;
      }

      paper-icon-button {
        transition: transform 180ms ease-in;
      }

      :host #infoarea {
        /*height: 0;*/
        overflow: hidden;
        transition: height 180ms ease-in;
      }

      :host([open]) paper-item:before {
        position: absolute;
        top: 0;
        right: 0;
        bottom: 0;
        left: 0;
        background: currentColor;
        content: '';
        opacity: 0.12;
        pointer-events: none;
      }

      :host([open]) paper-icon-button {
        transform: rotate(-180deg);
      }
    </style>
    <paper-item
      id="toggle"
      class="flex-horizontal-with-ratios"
      on-tap="_toggle"
    >
      <span class="flexchild">[[title]]</span>
      <paper-icon-button
        icon="hardware:keyboard-arrow-down"
      ></paper-icon-button>
    </paper-item>
    <iron-collapse id="infoarea">
      <div class="command-container">
        <pre>[[infoString]]</pre>
      </div>
    </iron-collapse>
  `,

  is: 'app-togglable',

  properties: {
    title: {
      type: String,
    },
    infoLines: {
      type: Array,
      computed: '_makeInfoLines(info)',
    },
    info: {
      type: Object,
    },
    infoString: {
      type: String,
      computed: '_makeString(info)',
    },
    open: {
      type: Boolean,
      value: false,
      reflectToAttribute: true,
    },
  },

  _makeString(info) {
    return YAML.dump(info);
  },

  _toggle() {
    this.open = !this.open;
    this.$.infoarea.toggle();
  },
});
