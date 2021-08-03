import '@polymer/polymer/polymer-legacy.js';
import '@polymer/paper-button/paper-button.js';
import '@polymer/paper-styles/typography.js';
import '@polymer/paper-spinner/paper-spinner.js';
import '@polymer/paper-listbox/paper-listbox.js';
import '@polymer/app-route/app-location.js';
import '../helpers/dialog-element.js';
import '../app-form/app-form.js';
import { Polymer } from '@polymer/polymer/lib/legacy/polymer-fn.js';
import { html } from '@polymer/polymer/lib/utils/html-tag.js';

Polymer({
  _template: html`
    <style include="shared-styles forms single-page">
      #content {
        max-width: 900px;
      }

      paper-material {
        display: block;
        padding: 24px;
      }

      paper-progress {
        position: absolute;
        bottom: 85px;
        width: 100%;
        left: 0;
        right: 0;
      }

      :host > ::slotted(paper-input-container) {
        padding-top: 16px;
        padding-bottom: 16px;
      }
    </style>
    <app-location route="{{route}}"></app-location>
    <div id="content">
      <paper-material
        class="single-head layout horizontal"
        style$="background-color: [[section.color]]"
      >
        <span class="icon"
          ><iron-icon icon="[[section.icon]]"></iron-icon
        ></span>
        <div class="title flex">
          <h2>Create Record</h2>
          <div class="subtitle"></div>
        </div>
      </paper-material>
      <paper-material>
        <div class="grid-row">
          <paper-dropdown-menu
            class="dropdown-block l6 xs12"
            label="Choose Record Type"
            horizontal-align="left"
            no-animations=""
          >
            <paper-listbox
              slot="dropdown-content"
              attr-for-selected="value"
              selected="{{selectedRecordType}}"
              class="dropdown-content"
            >
              <template is="dom-repeat" items="[[recordTypes]]" as="recordType">
                <paper-item value="[[recordType]]">[[recordType]]</paper-item>
              </template>
            </paper-listbox>
          </paper-dropdown-menu>
        </div>
      </paper-material>
      <paper-material class$="selected-[[!selectedRecordType]]">
        <div hidden$="[[selectedRecordType]]">
          <p>
            Depending on the record type there maybe needed parameters. Choose a
            record type to continue.
          </p>
        </div>
        <div hidden$="[[!selectedRecordType]]">
          <app-form
            fields="[[fields]]"
            form="[[record]]"
            url="/api/v1/clouds/[[zone.cloud]]/zones/[[zone.id]]/records"
            on-response="_handleCreateRecordResponse"
            on-error="_handleError"
          ></app-form>
        </div>
      </paper-material>
    </div>
  `,

  is: 'record-create',

  properties: {
    section: {
      type: Object,
    },
    model: {
      type: Object,
    },
    zone: {
      type: Object,
    },
    recordTypes: {
      type: Array,
      value: ['A', 'AAAA', 'CNAME', 'MX', 'NS', 'SOA', 'TXT'],
    },
    selectedRecordType: {
      type: String,
      value: false,
    },
    record: {
      type: Object,
      value() {
        return {
          name: '',
          type: '',
          rdata: '',
          ttl: 3600,
        };
      },
    },
    fields: {
      type: Array,
      value() {
        return [];
      },
    },
    fieldsA: {
      type: Array,
      value: [
        {
          name: 'name',
          label: 'Name *',
          type: 'text',
          value: '',
          defaultValue: '',
          placeholder: '',
          suffix: '',
          errorMessage: 'The subdomain for this A record is required',
          helptext:
            'Please provide the subdomain for this A record (e.g. machine1.mist.io). The domain is already provided',
          show: true,
          required: true,
          options: [],
        },
        {
          name: 'rdata',
          label: 'Rdata *',
          type: 'text',
          value: '',
          defaultValue: '',
          placeholder: '',
          excludeFromPayload: true,
          errorMessage: 'The rdata are required for this record',
          helptext:
            'Please provide an IPv4 for this record (e.g. 172.16.254.1)',
          show: true,
          required: true,
        },
        {
          name: 'ttl',
          label: 'TTL',
          type: 'text',
          pattern: '[0-9]*',
          errorMessage: 'Please enter a numerical value.',
          value: 3600,
          defaultValue: 3600,
          placeholder: '',
          show: true,
          required: false,
        },
      ],
    },
    fieldsAAAA: {
      type: Array,
      value: [
        {
          name: 'name',
          label: 'Name *',
          type: 'text',
          value: '',
          defaultValue: '',
          placeholder: '',
          suffix: '',
          errorMessage: 'The subdomain for this AAAA record is required',
          helptext:
            'Please provide the subdomain for this AAAA record (e.g. machine1.mist.io). The domain is already provided',
          show: true,
          required: true,
          options: [],
        },
        {
          name: 'rdata',
          label: 'Rdata *',
          type: 'text',
          value: '',
          defaultValue: '',
          placeholder: '',
          excludeFromPayload: true,
          errorMessage: 'The rdata are required for this record',
          helptext:
            'Please provide an IPv6 for this AAAA record (e.g. 2001:db8:0:1234:0:567:8:1)',
          show: true,
          required: true,
        },
        {
          name: 'ttl',
          label: 'TTL',
          type: 'text',
          pattern: '[0-9]*',
          errorMessage: 'Please enter a numerical value.',
          value: 3600,
          defaultValue: 3600,
          placeholder: '',
          show: true,
          required: false,
        },
      ],
    },
    fieldsCNAME: {
      type: Array,
      value: [
        {
          name: 'name',
          label: 'Name *',
          type: 'text',
          value: '',
          defaultValue: '',
          placeholder: '',
          suffix: '',
          errorMessage:
            'The subdomain for this CNAME record is required (e.g. machine1.mist.io). The domain is already provided',
          helptext: 'Please provide the subdomain for the record',
          show: true,
          required: true,
          options: [],
        },
        {
          name: 'rdata',
          label: 'Rdata *',
          type: 'text',
          value: '',
          defaultValue: '',
          placeholder: '',
          excludeFromPayload: true,
          errorMessage: 'The rdata are required for this record',
          helptext:
            'Please provide a hostname for this CNAME record (e.g. subdomain.example.com)',
          show: true,
          required: true,
        },
        {
          name: 'ttl',
          label: 'TTL',
          type: 'text',
          pattern: '[0-9]*',
          errorMessage: 'Please enter a numerical value.',
          value: 3600,
          defaultValue: 3600,
          placeholder: '',
          show: true,
          required: false,
        },
      ],
    },
    fieldsMX: {
      type: Array,
      value: [
        {
          name: 'name',
          label: 'Name *',
          type: 'text',
          value: '',
          defaultValue: '',
          placeholder: '',
          suffix: '',
          errorMessage: 'The name for this MX record is required',
          helptext:
            'Please provide the name for the MX record (e.g. mailserver.mist.io)',
          show: true,
          required: true,
          options: [],
        },
        {
          name: 'rdata',
          label: 'Rdata *',
          type: 'text',
          value: '',
          defaultValue: '',
          placeholder: '',
          excludeFromPayload: true,
          errorMessage: 'The rdata are required for this MX record',
          helptext:
            "Please provide the required rdata for this MX record in the following format: 'MX_level mailserver_hostname' (e.g. '10 mailserver.mist.io'), quotes not required",
          show: true,
          required: true,
        },
        {
          name: 'ttl',
          label: 'TTL',
          type: 'text',
          pattern: '[0-9]*',
          errorMessage: 'Please enter a numerical value.',
          value: 3600,
          defaultValue: 3600,
          placeholder: '',
          show: true,
          required: false,
        },
      ],
    },
    fieldsNS: {
      type: Array,
      value: [
        {
          name: 'name',
          label: 'Name *',
          type: 'text',
          value: '',
          defaultValue: '',
          placeholder: '',
          suffix: '',
          errorMessage: 'The name for this NS record is required',
          helptext: 'Please provide the NS record name',
          show: true,
          required: true,
          options: [],
        },
        {
          name: 'rdata',
          label: 'Rdata *',
          type: 'text',
          value: '',
          defaultValue: '',
          placeholder: '',
          excludeFromPayload: true,
          errorMessage: 'The rdata are required for this record',
          helptext: 'Please provide the nameserver rdata for this NS record',
          show: true,
          required: true,
        },
        {
          name: 'ttl',
          label: 'TTL',
          type: 'text',
          pattern: '[0-9]*',
          errorMessage: 'Please enter a numerical value.',
          value: 3600,
          defaultValue: 3600,
          placeholder: '',
          show: true,
          required: false,
        },
      ],
    },
    fieldsSOA: {
      type: Array,
      value: [
        {
          name: 'name',
          label: 'Name *',
          type: 'text',
          value: '',
          defaultValue: '',
          placeholder: '',
          suffix: '',
          errorMessage: 'The name for this SOA record is required',
          helptext: 'Please provide the name for this SOA record',
          show: true,
          required: false,
          options: [],
        },
        {
          name: 'rdata',
          label: 'Rdata *',
          type: 'text',
          value: '',
          defaultValue: '',
          placeholder: '',
          excludeFromPayload: true,
          errorMessage: 'The rdata are required for this record',
          helptext: 'Please provide a hostname for this record',
          show: true,
          required: true,
        },
        {
          name: 'ttl',
          label: 'TTL',
          type: 'text',
          pattern: '[0-9]*',
          errorMessage: 'Please enter a numerical value.',
          value: 3600,
          defaultValue: 3600,
          placeholder: '',
          show: true,
          required: false,
        },
      ],
    },
    fieldsTXT: {
      type: Array,
      value: [
        {
          name: 'name',
          label: 'Name *',
          type: 'text',
          value: '',
          defaultValue: '',
          placeholder: '',
          suffix: '',
          errorMessage: 'The subdomain for this TXT record is required',
          helptext:
            'Please provide the name for this TXT record (e.g. txt.mist.io). The domain is already provided',
          show: true,
          required: true,
          options: [],
        },
        {
          name: 'rdata',
          label: 'Rdata *',
          type: 'text',
          value: '',
          defaultValue: '',
          placeholder: '',
          excludeFromPayload: true,
          errorMessage: 'The rdata are required for this record',
          helptext:
            "Please provide the relevant rdata for this TXT record (e.g. 'This is an example txt')",
          show: true,
          required: true,
        },
        {
          name: 'ttl',
          label: 'TTL',
          type: 'text',
          pattern: '[0-9]*',
          errorMessage: 'Please enter a numerical value.',
          value: 3600,
          defaultValue: 3600,
          placeholder: '',
          show: true,
          required: false,
        },
      ],
    },
  },

  observers: [
    '_typeChanged(selectedRecordType, fields)',
    '_zoneChanged(zone.id)',
  ],

  listeners: {
    change: 'updateFields',
  },

  updateFields() {
    this.set('formError', false);
    this.updatePayload();
  },

  updatePayload() {
    if (this.fields.length && this.zone) {
      // update payload
      const payload = {};

      payload.type = this.selectedRecordType;

      const name = this.fields.findIndex(field => field.name === 'name', this);
      payload.name = `${this.fields[name].value + this.fields[name].suffix}.`;

      const rdata = this.fields.findIndex(
        field => field.name === 'rdata',
        this
      );
      payload.data = this.fields[rdata].value;

      const ttl = this.fields.findIndex(field => field.name === 'ttl', this);
      payload.ttl = this.fields[ttl].value;

      this.set('record', payload);
      console.warn(`Update Payload:${payload}`);
    }
  },

  _zoneChanged(zoneId) {
    if (this.zoneId !== zoneId) {
      this.zoneId = zoneId;
      this.selectedRecordType = false;
      this.set('fields', []);
      this.updateFields();
    }
  },

  _typeChanged() {
    if (this.selectedRecordType === 'A') {
      this.fieldsA[0].suffix = `.${this.zone.domain.slice(0, -1)}`;
      this.set('fields', this.fieldsA);
    } else if (this.selectedRecordType === 'AAAA') {
      this.fieldsAAAA[0].suffix = `.${this.zone.domain.slice(0, -1)}`;
      this.set('fields', this.fieldsAAAA);
    } else if (this.selectedRecordType === 'CNAME') {
      this.fieldsCNAME[0].suffix = `.${this.zone.domain.slice(0, -1)}`;
      this.set('fields', this.fieldsCNAME);
    } else if (this.selectedRecordType === 'MX') {
      this.fieldsMX[0].suffix = `.${this.zone.domain.slice(0, -1)}`;
      this.set('fields', this.fieldsMX);
    } else if (this.selectedRecordType === 'NS') {
      this.fieldsNS[0].suffix = `.${this.zone.domain.slice(0, -1)}`;
      this.set('fields', this.fieldsNS);
    } else if (this.selectedRecordType === 'SOA') {
      this.fieldsSOA[0].suffix = `.${this.zone.domain.slice(0, -1)}`;
      this.set('fields', this.fieldsSOA);
    } else if (this.selectedRecordType === 'TXT') {
      this.fieldsTXT[0].suffix = `.${this.zone.domain.slice(0, -1)}`;
      this.set('fields', this.fieldsTXT);
    }
    this.updateFields();
  },

  _handleCreateRecordResponse() {
    // const response = YAML.parse(e.detail.xhr.response);
    this.dispatchEvent(
      new CustomEvent('toast', {
        bubbles: true,
        composed: true,
        detail: { msg: 'Record was created successfully.', duration: 3000 },
      })
    );

    const url = document.location.pathname;
    this.dispatchEvent(
      new CustomEvent('go-to', {
        bubbles: true,
        composed: true,
        detail: { url: url.substring(0, url.indexOf('/+create')) },
      })
    );
  },

  _handleError(e) {
    // console.log(e);
    this.$.errormsg.textContent = e.detail.request.xhr.responseText;
    this.set('formError', true);
  },

  _goBack() {
    window.history.back();
  },
});
