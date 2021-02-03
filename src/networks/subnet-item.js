import '@polymer/polymer/polymer-legacy.js';
import '@polymer/paper-styles/typography.js';
import { Polymer } from '@polymer/polymer/lib/legacy/polymer-fn.js';
import { html } from '@polymer/polymer/lib/utils/html-tag.js';

Polymer({
  _template: html`
    <style include="shared-styles single-page">
      :host {
        border: 1px solid #eee;
        margin: 10px 0;
        display: block;
      }

      .flex-horizontal-with-ratios {
        @apply --layout-horizontal;
      }

      .flexchild {
        @apply --layout-flex;
      }

      .flexchild:first-of-type {
        font-weight: 700;
      }
      .xs11 {
        padding-left: 0 !important;
      }
      .numbers,
      .index {
        text-align: center;
        padding-right: 0 !important;
      }
    </style>
    <div class="grid-row info-group">
      <div class="xs1 numbers">
        <div class="info-item index">[[manindex]]</div>
      </div>
      <div class="xs11">
        <template is="dom-if" if="[[subnet.name]]" restamp="">
          <div class="info-item flex-horizontal-with-ratios">
            <div class="flexchild">Name</div>
            <div class="flexchild">[[subnet.name]]</div>
          </div>
        </template>
        <template is="dom-if" if="[[subnet.id]]" restamp="">
          <div class="info-item flex-horizontal-with-ratios">
            <div class="flexchild">ID</div>
            <div class="flexchild">[[subnet.id]]</div>
          </div>
        </template>
        <template is="dom-if" if="[[subnet.zone]]" restamp="">
          <div class="info-item flex-horizontal-with-ratios">
            <div class="flexchild">Zone</div>
            <div class="flexchild">[[subnet.zone.name]]</div>
          </div>
        </template>
        <template is="dom-if" if="[[subnet.cidr]]" restamp="">
          <div class="info-item flex-horizontal-with-ratios">
            <div class="flexchild">Cidr</div>
            <div class="flexchild">[[subnet.cidr]]</div>
          </div>
        </template>
        <template is="dom-if" if="[[subnet.enable_dhcp]]" restamp="">
          <div class="info-item flex-horizontal-with-ratios">
            <div class="flexchild">DHCP Enabled</div>
            <div class="flexchild">[[subnet.enable_dhcp]]</div>
          </div>
        </template>
        <template is="dom-if" if="[[subnet.gateway_ip]]" restamp="">
          <div class="info-item flex-horizontal-with-ratios">
            <div class="flexchild">Gateway IP</div>
            <div class="flexchild">[[subnet.gateway_ip]]</div>
          </div>
        </template>
        <template is="dom-if" if="[[subnet.dns_nameservers.length]]" restamp="">
          <div class="info-item flex-horizontal-with-ratios">
            <div class="flexchild">DNS Nameservers</div>
            <div class="flexchild">
              <template
                is="dom-repeat"
                items="[[subnet.dns_nameservers]]"
                as="nameserver"
              >
                <div class="ip">[[nameserver]]</div>
              </template>
            </div>
          </div>
        </template>
      </div>
    </div>
  `,

  is: 'subnet-item',

  properties: {
    subnet: {
      type: Object,
    },
    itemindex: {
      type: Number,
    },
    manindex: {
      type: Number,
      computed: '_computeman(itemindex)',
    },
  },

  _computeman(index) {
    return index + 1;
  },
});
