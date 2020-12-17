import '../node_modules/@polymer/polymer/polymer-legacy.js';
import '../node_modules/@polymer/paper-styles/typography.js';
import '../node_modules/@polymer/paper-icon-button/paper-icon-button.js';
import { Polymer } from '../node_modules/@polymer/polymer/lib/legacy/polymer-fn.js';
import { html } from '../node_modules/@polymer/polymer/lib/utils/html-tag.js';

Polymer({
  _template: html`
    <style include="shared-styles">
      .notice {
        background-color: #ffff8d;
        padding: 2px 16px;
        z-index: 9;
        position: relative;
        width: 100%;
        text-align: center;
      }

      a {
        width: 100%;
      }

      paper-icon-button {
        float: right;
        margin: -8px 24px 0px 0;
      }
    </style>
    <a
      href$="https://github.com/mistio/mist.io/releases/[[upgrade]]"
      hidden$="[[!upgrade]]"
      target="_new"
    >
      <div class="notice">
        <p>
          <strong>Update available:</strong> [[upgrade]]
          <paper-icon-button icon="close" on-tap="_dismiss"></paper-icon-button>
        </p>
      </div>
    </a>
  `,

  is: 'mist-notice',

  properties: {
    model: {
      type: Object,
    },
    upgrade: {
      type: String,
      computed: '_computeUpgrade(model.user.available_upgrades.splices)',
      value: '',
    },
  },

  _computeUpgrade() {
    if (
      !this.model ||
      !this.model.user ||
      !this.model.user.available_upgrades ||
      !this.model.user.available_upgrades.length
    )
      return '';
    if (
      localStorage.getItem(
        `dismiss-${this.model.user.available_upgrades[0].name}`
      )
    )
      return '';
    return this.model.user.available_upgrades[0].name;
  },

  _dismiss(e) {
    localStorage.setItem(`dismiss-${this.upgrade}`, true);
    this.pop('model.user.available_upgrades');
    e.preventDefault();
  },
});
