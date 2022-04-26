import '@polymer/iron-behaviors/iron-button-state.js';
import '@polymer/iron-icons/iron-icons.js';
import '@polymer/paper-icon-button/paper-icon-button.js';
import '@polymer/paper-material/paper-material.js';
import { Polymer } from '@polymer/polymer/lib/legacy/polymer-fn.js';
import { html } from '@polymer/polymer/lib/utils/html-tag.js';

Polymer({
  _template: html`
    <style>
      :host {
        display: inline-block;
        vertical-align: top;
        position: relative;
        outline: none;
        font-size: 14px;
        cursor: default;
        margin: 8px 4px;
        height: 32px;
        overflow: visible;

        -webkit-touch-callout: none;
        /* iOS Safari */
        -webkit-user-select: none;
        /* Chrome/Safari/Opera */
        -khtml-user-select: none;
        /* Konqueror */
        -moz-user-select: none;
        /* Firefox */
        -ms-user-select: none;
        /* Internet Explorer/Edge */
        user-select: none;
      }

      #main,
      #chip {
        border-radius: 16px;
      }

      #main {
        background-color: var(
          --paper-chip-background-color,
          var(--paper-grey-200)
        );
        position: relative;
        color: var(
          --paper-chip-secondary-text-color,
          var(--secondary-text-color)
        );
        @apply --layout-vertical;
      }

      #chip {
        box-sizing: border-box;
        height: 32px;
        background-color: #ddd;
        @apply --layout-horizontal;
        @apply --layout-center;
      }

      paper-material {
        border-radius: 16px;
      }

      #icon {
        @apply --layout-horizontal;
        @apply --layout-center;
        @apply --layout-center-justified;
      }

      #icon ::slotted(.icon) {
        margin-right: -4px;
        width: 32px;
        height: 32px;
        line-height: 32px;
        border-radius: 100%;
        overflow: hidden;
        text-align: center;
        vertical-align: middle;
        font-size: 16px;
        font-weight: bold;
        background-color: var(
          --paper-chip-icon-background-color,
          var(--paper-grey-500)
        );
        color: var(--paper-chip-icon-text-color, var(--text-primary-color));
        /*@apply --layout-flex;*/
        display: block;
      }

      #icon ::slotted(iron-icon),
      #icon ::slotted(iron-icon svg),
      iron-icon,
      iron-icon svg {
        width: 32px;
        height: 32px;
      }

      #icon ::slotted(iron-icon.icon) {
        vertical-align: bottom;
      }

      #label {
        padding: 0 12px;
        @apply --layout-flex-auto;
        @apply --layout-self-center;
      }

      #label ::slotted(h1),
      #label ::slotted(h2) {
        white-space: nowrap;
        margin: 0;
        font-weight: normal;
        font-size: 14px;
      }

      .icon-btn-wrapper {
        @apply --layout-self-center;
      }

      /* retain width on opened state, while having padding */
      :host #chip {
        box-sizing: border-box;
      }
    </style>
    <paper-material id="shadow" elevation="0">
      <div id="main">
        <div id="chip">
          <div id="icon">
            <slot name="icon"></slot>
          </div>
          <div id="label">
            <slot name="cloud-name"></slot>
          </div>
        </div>
      </div>
    </paper-material>
  `,

  is: 'cloud-chip',

  properties: {
    cloud: {
      type: Object,
      notify: true,
    },
    online: {
      type: Boolean,
      reflectToAttribute: true,
      notify: true,
      value: true,
    },
    offline: {
      type: Boolean,
      reflectToAttribute: true,
      notify: true,
      value: false,
    },
  },

  observers: ['_computeIsOnline(cloud.enabled,cloud.state)'],

  ready() {
    this.cloud = {};
    if (this.$.removeBtn) {
      // disable tabindex on remove button so that tabindex can be used for chips
      this.$.removeBtn.removeAttribute('tabindex');
    }
  },

  _computeIsOnline(_enabled, _state) {
    if (this.cloud) {
      if (this.cloud.state === 'online') {
        this.set('online', true);
        this.set('offline', false);
      } else if (this.cloud.state !== 'online') {
        this.set('online', false);
        this.set('offline', true);
      }
    }
  },

  /**
   * Fired before the element is removed. This event is cancelable.
   *
   * @event remove
   */
  remove() {
    const e = this.dispatchEvent(
      new CustomEvent('remove', {}, this, false, true)
    );
    if (!e.defaultPrevented) {
      this.parentNode.removeChild(this);
    }
  },
});
