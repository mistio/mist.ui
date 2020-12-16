import '../theme-color/theme-color.js';
import { Polymer } from '../../node_modules/@polymer/polymer/lib/legacy/polymer-fn.js';
import { html } from '../../node_modules/@polymer/polymer/lib/utils/html-tag.js';

Polymer({
  _template: html`
    <style include="shared-styles">
      :host {
        transition: var(--material-curve-320);
        transform: translate(0, 60px);
        opacity: 0;
        width: 100%;
      }

      :host(.active) {
        transform: translate(0, 0);
        opacity: 1;
      }

      :host paper-material {
        background-color: var(--tiles-background-color);
      }

      :host h2 {
        font-weight: 300;
        font-size: 54px;
        padding: 36px 8px;
        margin: 0;
        transform: translate(-50px, 0);
        opacity: 0;
        transition: all 500ms 320ms;
        transition-timing-function: var(--material-curve-320);
        text-align: center;
        min-height: 1em;
        color: var(--tiles-text-color);
      }

      :host(.active) h2 {
        transform: translate(0, 0);
        opacity: 1;
      }

      :host h3 {
        transform: translate(-50px, 0);
        opacity: 0;
        transition: all 600ms 320ms;
        transition-timing-function: var(--material-curve-320);
        text-transform: uppercase;
        display: inline;
        font-size: 16px;
        font-weight: 400;
        line-height: 36px;
        margin-left: 8px;
        color: var(--tiles-title-color);
      }
      :host h3.icon-true {
        margin-left: 40px;
      }
      :host(.active) h3 {
        transform: translate(0, 0);
        opacity: 1;
      }
      :host iron-icon {
        width: 24px;
        height: 24px;
        opacity: 1;
        vertical-align: text-top;
        position: absolute;
        top: 0;
        left: 0;
        background-color: var(--tiles-icon-background-color);
        color: var(--tiles-icon-color);
        padding: 4px;
        margin-right: 8px;
      }
      :host(.active) paper-material {
        overflow: hidden !important;
      }

      :host([incidents]) paper-material {
        background-color: var(--red-color);
      }
      :host([incidents]) iron-icon {
        background-color: var(--red-color);
        color: #fff;
      }
      :host([incidents]) h2,
      :host([incidents]) h3 {
        color: #fff;
      }

      paper-material > h2 {
        font-weight: 300;
      }

      :host([highlight]) paper-material,
      :host([highlight]) ::slotted(paper-material) {
        background-color: var(
          --app-costs-highlight-background-color,
          var(--tiles-background-color)
        );
      }
      :host([highlight]) h2,
      :host([highlight]) h3 {
        color: var(--app-costs-highlight-text-color, rgba(0, 0, 0, 0.54));
      }
    </style>
    <paper-material id="bg">
      <template is="dom-if" if="[[icon]]">
        <iron-icon icon="[[icon]]"></iron-icon>
      </template>
      <h3 class$="title icon-[[hasIcon]]">[[name]]</h3>
      <h2 class="count">[[count]]</h2>
      <!-- <theme-color color="[[statecolor]]" class="vertical layout" themed-reverse>
            </theme-color> -->
      <slot></slot>
    </paper-material>
  `,

  is: 'section-tile',
  enableCustomStyleProperties: true,

  properties: {
    name: {
      type: String,
    },
    count: {
      type: Number,
    },
    color: {
      type: String,
    },
    statecolor: {
      type: String,
      computed: '_computeStateColor(count, color)',
    },
    icon: {
      type: String,
    },
    hasIcon: {
      type: Boolean,
      value: true,
      computed: '_computeHasIcon(icon)',
    },
    highlight: {
      type: Boolean,
      value: false,
      reflectToAttribute: true,
    },
  },

  _computeStateColor(count, color) {
    return count ? color : '#eeeeee';
  },

  attached() {
    const tiles = this.parentNode.querySelectorAll('section-tile');
    const index = Array.prototype.indexOf.call(tiles, this);
    setTimeout(() => {
      this.classList.add('active');
    }, (index + 1) * 500);
  },

  _computeHasIcon(icon) {
    if (icon) return true;
    return false;
  },
});
