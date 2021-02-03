import '@polymer/polymer/polymer-legacy.js';
import '@polymer/paper-styles/typography.js';
import { Polymer } from '@polymer/polymer/lib/legacy/polymer-fn.js';
import { html } from '@polymer/polymer/lib/utils/html-tag.js';

Polymer({
  _template: html`
    <style include="shared-styles">
      :host {
      }

      :host:hover {
        background-color: #eee;
      }

      .state-indicator {
        width: 16px;
        margin-right: 24px;
        background-color: transparent;
        transition: background-color 0.18s ease-in;
        height: 30px;
      }

      paper-item {
        padding: 0;
      }

      paper-item a > *,
      paper-item .state-indicator {
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

      :host([hasIncident]) .state-indicator {
        background-color: var(--red-color);
      }

      :host([hasIncident]) .name {
        color: var(--red-color) !important;
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
      <div class="state-indicator"></div>
      <div class="icon">
        <iron-icon icon="hardware:computer"></iron-icon>
      </div>
      <a
        class="regular flexchild flex-horizontal-with-ratios"
        href$="/machines/[[machine.id]]"
      >
        <div class="flexchild"><span class="name">[[machine.name]]</span></div>
        <div class="flexchild">
          <span class$="state [[machine.state]]">
            <template is="dom-if" if="[[machine.isDead]]"
              >[[machine.state]]</template
            >
          </span>
        </div>
        <div class="flexchild capitalize">[[cloud.provider]]</div>
      </a>
    </paper-item>
  `,

  is: 'stack-machine-item',

  properties: {
    model: {
      type: Object,
    },
    machine: {
      type: Object,
    },
    cloud: {
      type: Object,
      computed: '_getCloud(machine)',
    },
    hasIncident: {
      type: Boolean,
      value: false,
      reflectToAttribute: true,
    },
    isDead: {
      type: Boolean,
    },
  },

  _getCloud(machine) {
    return this.model && this.model.clouds[machine.cloud];
  },
});
