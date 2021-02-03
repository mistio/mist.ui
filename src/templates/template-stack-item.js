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

      paper-item {
        padding: 0 0 0 20px;
        height: 48px;
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
        margin-right: 16px;
      }

      .capitalize {
        text-transform: capitalize;
      }
      .flexchild.error {
        color: var(--red-color);
      }
    </style>
    <paper-item class="flex-horizontal-with-ratios">
      <div class="icon">
        <iron-icon icon="maps:layers"></iron-icon>
      </div>
      <a
        class="regular flexchild flex-horizontal-with-ratios"
        href$="/stacks/[[stack.id]]"
      >
        <div class="flexchild"><span class="name">[[stack.name]]</span></div>
        <div class="flexchild">[[stack.description]]</div>
        <div class$="flexchild [[stack.status]]">[[stack.status]]</div>
        <!-- <div class="flexchild">[[resources]]</div> -->
      </a>
    </paper-item>
  `,

  is: 'template-stack-item',

  properties: {
    model: {
      type: Object,
    },
    stack: {
      type: Object,
    },
    resources: {
      type: String,
      computed: '_resources(stack)',
    },
  },

  _resources(stack) {
    let res = '';
    if (stack.machines) {
      res += `${stack.machines.lenght} machines`;
    }
    if (stack.networks) {
      res += `${stack.networks.lenght} networks`;
    }
    if (stack.keys) {
      res += `${stack.keys.lenght} keys`;
    }
    return res;
  },
});
