import '@polymer/polymer/polymer-legacy.js';
import '@polymer/paper-styles/typography.js';
import '@polymer/paper-button/paper-button.js';
import '@polymer/paper-toggle-button/paper-toggle-button.js';
import '@polymer/paper-tooltip/paper-tooltip.js';
import '@polymer/paper-material/paper-material.js';
import '@polymer/paper-listbox/paper-listbox.js';
import '../account/plan-purchase.js';
import '../app-form/app-form.js';
import { Polymer } from '@polymer/polymer/lib/legacy/polymer-fn.js';
import { html } from '@polymer/polymer/lib/utils/html-tag.js';

Polymer({
  _template: html`
    <style include="shared-styles forms single-page">
      :host {
      }

      paper-material {
        display: block;
        padding: 1em;
        transition: all 0.2 ease-in;
      }

      paper-material.selected-true {
        padding-bottom: 120px;
      }

      #content {
        max-width: 900px;
        padding-bottom: 30px;
      }

      @media screen and (min-width: 1200px) {
        .provider-container > div:nth-child(3) {
          padding-left: 13px;
        }
        .provider-container > div:nth-child(4) {
          padding-left: 5px;
        }
        .provider-container > div:nth-child(5) {
          padding-left: 2px;
        }
      }

      paper-card,
      paper-checkbox {
        display: block;
      }

      paper-card {
        margin-bottom: 40px;
      }

      paper-toggle-button,
      paper-checkbox {
        margin-top: 20px;
      }

      .progress {
        position: relative;
        width: 100%;
        left: 0;
        right: 0;
        margin-left: -24px;
      }

      .dropdown-with-logos paper-item img {
        margin-right: 16px;
      }

      .dropdown-with-logos paper-item {
        text-transform: capitalize;
        opacity: 0.87;
      }

      paper-dropdown-menu ::slotted(.dropdown-content) {
        max-height: 400px !important;
      }

      :host div.l12 paper-listbox.providers {
        display: flex;
        flex-wrap: wrap;
        margin: 0 -20px 0 0;
        background-color: transparent;
      }

      :host div.l12 paper-listbox.providers paper-item {
        width: 20%;
        min-width: 188px;
      }

      :host paper-listbox.providers paper-item {
        display: flex;
        min-width: max-content;
        line-height: 1.2em;
        align-self: center;
        flex-wrap: wrap;
        font-size: 0.9em;
      }

      :host paper-listbox.providers img {
        margin-right: 6px;
        vertical-align: middle;
      }

      .help {
        align-self: flex-end;
      }

      @media screen and (max-width: 870px) {
        :host paper-listbox.providers paper-item {
          /* width: 40%; */
        }
      }

      @media screen and (max-width: 1125px) and (min-width: 1024px) {
        :host paper-listbox.providers paper-item {
          /* width: 28%; */
        }
      }
      .cloud-page-head {
        @apply --cloud-page-head-mixin;
      }
      .category {
        border-bottom: 1px solid #ddd;
      }
    </style>

    <div id="content">
      <paper-material class="single-head cloud-page-head layout horizontal">
        <span class="icon">
          <iron-icon icon="cloud"></iron-icon>
        </span>
        <div class="title flex">
          <h2>Add Cloud</h2>
          <div class="subtitle">
            [[portalName]] supports public &amp; private cloud platforms,
            hypervisors, containers and bare metal servers.
          </div>
        </div>
        <!-- <span class="help" hidden$=[[!selectedProvider]]><iron-icon icon="help"></iron-icon></span> -->
      </paper-material>
      <paper-material>
        <div class="grid-row">
          <h3 class="xs12 smallcaps">Choose a Provider</h3>
        </div>
        <div class="grid">
          <div class="grid-row provider-container">
            <template is="dom-repeat" items="[[cols]]" as="item">
              <div class$="[[item.class]]">
                <template
                  is="dom-repeat"
                  items="[[item.categories]]"
                  as="category"
                >
                  <!-- <div class$="[[category.class]]">-->
                  <h3 class="xs12 smallcaps category">[[category.name]]</h3>
                  <paper-listbox
                    class="providers"
                    attr-for-selected="value"
                    selected="{{selectedProvider}}"
                  >
                    <template
                      is="dom-repeat"
                      items="[[category.providers]]"
                      as="provider"
                    >
                      <paper-item value="[[provider.val]]">
                        <img
                          src="[[_computeProviderLogo(provider.className)]]"
                          alt="[[provider.title]]"
                          width="24px"
                        />
                        <span>[[provider.title]]</span>
                      </paper-item>
                    </template>
                  </paper-listbox>
                </template>
              </div>
            </template>
          </div>
        </div>
      </paper-material>
      <paper-material class$="selected-[[!selectedProvider]]">
        <div hidden$="[[selectedProvider]]">
          <p>
            After adding a cloud, you will be redirected to your dashboard where
            you can monitor your cost and usage statistics, enabling you to
            manage permissions and reduce costs.
          </p>
          <p hidden$="[[!docs]]">
            <a
              href="http://docs.mist.io/category/75-adding-clouds-bare-metal-and-containers"
              target="new"
              class="regular blue-link"
              >Need help with the process?</a
            >
          </p>
        </div>
        <div id="cloudFields" hidden$="[[!selectedProvider]]">
          <h3 class="smallcaps">
            Adding [[_computeTitle(selectedProvider)]] cloud
          </h3>
          <app-form
            fields="[[providerFields]]"
            method="POST"
            url="/api/v1/clouds"
            on-response="_cloudAddAjaxResponse"
            on-error="_cloudAddAjaxError"
            btncontent="Add Cloud"
          ></app-form>
        </div>
      </paper-material>
    </div>
    <plan-purchase id="ccRequired" org="[[org]]" persist=""></plan-purchase>
  `,

  is: 'cloud-add',

  properties: {
    section: {
      type: Object,
    },
    color: {
      type: String,
      computed: '_getHeaderStyle(section)',
    },
    selectedProvider: {
      type: String,
      value: null,
      notify: true,
    },
    providerFields: {
      type: Array,
      value: [],
    },
    cols: {
      type: Array,
      computed: '_computeCategories(providers)',
    },
    providers: {
      type: Array,
    },
    keys: {
      type: Array,
    },
    sendingData: {
      type: Boolean,
      value: false,
    },
    formReady: {
      type: Boolean,
      value: false,
    },
    clouds: {
      type: String,
    },
    enableMonitoring: {
      type: Boolean,
    },
    enableBilling: {
      type: Boolean,
    },
    disableAddCloud: {
      type: Boolean,
      computed: '_computeDisableAddCloud(enableBilling, org.*)',
      value: false,
    },
    portalName: {
      type: String,
      value: 'Mist',
    },
    docs: {
      type: String,
      value: '',
    },
    org: {
      type: Object,
    },
    selectedPlan: {
      type: String,
    },
    hidden: {
      type: Boolean,
    },
  },

  observers: [
    '_providerChanged(selectedProvider, providers)',
    '_keysChanged(keys.*, providerFields)',
    '_hiddenChanged(hidden)',
    '_providerFieldsChanged(providerFields)',
  ],

  listeners: {
    'iron-select': '_updateCloudTitle',
    'reset-form': '_resetProvider',
    'open-cc-required': '_openCcRequired',
    'close-cc-required': '_closeCcRequired',
  },

  ready() {},

  attached() {
    if (this.disableAddCloud) this._openCcRequired();
  },

  _hiddenChanged(hidden) {
    if (this.disableAddCloud) {
      if (!hidden) this.$.ccRequired.open();
      else if (hidden) this.$.ccRequired.close();
    }
  },

  _computeCategories(providers) {
    const categories = [
      {
        name: 'Public clouds',
        type: 'public',
        class: 'xs12 s12 m6 l6',
        providers: [],
      },
      { name: 'Private clouds', type: 'private', class: '', providers: [] },
      { name: 'Hypervisors', type: 'hypervisor', class: '', providers: [] },
      { name: 'Containers', type: 'containers', class: '', providers: [] },
      { name: 'Other', type: 'baremetal', class: '', providers: [] },
    ];
    for (let i = 0; i < providers.length; i++) {
      const provider = providers[i];
      if (
        [
          'azure_arm',
          'digitalocean',
          'ec2',
          'gce',
          'linode',
          'equinixmetal',
          'rackspace',
          'softlayer',
          'aliyun_ecs',
          'vultr',
          'maxihost',
          'cloudsigma',
          'vexxhost',
        ].indexOf(provider.val) > -1
      ) {
        categories[0].providers.push(provider);
      }
      if (['openstack', 'onapp', 'vsphere'].indexOf(provider.val) > -1) {
        categories[1].providers.push(provider);
      }
      if (['libvirt'].indexOf(provider.val) > -1) {
        categories[2].providers.push(provider);
      }
      if (
        ['docker', 'kubevirt', 'lxd', 'kubernetes', 'openshift'].indexOf(
          provider.val
        ) > -1
      ) {
        categories[3].providers.push(provider);
      }
      if (['other'].indexOf(provider.val) > -1) {
        categories[4].providers.push(provider);
      }
    }
    const cols = [
      { categories: [], class: 'xs12 s12 m12 l12' },
      { categories: [], class: 'xs12 s12 m12 l3' },
      { categories: [], class: 'xs12 s12 m12 l3' },
      { categories: [], class: 'xs12 s12 m12 l3' },
      { categories: [], class: 'xs12 s12 m12 l3' },
    ];
    // Arrange categories in columns
    cols[0].categories.push(categories[0]);
    cols[1].categories.push(categories[1]);
    cols[2].categories.push(categories[2]);
    cols[3].categories.push(categories[3]);
    cols[4].categories.push(categories[4]);

    return cols;
  },

  _computeDisableAddCloud(enableBilling, _org) {
    return (
      enableBilling && this.org && !this.org.card && !this.org.current_plan
    );
  },

  _openCcRequired() {
    // e.target.parentNode.insertBefore(e.target.backdropElement, e.target);
    this.$.ccRequired.open();
  },

  _closeCcRequired() {
    this.$.ccRequired.close();
  },

  _cloudAddAjaxResponse(_response) {
    this._unsetProvider();
    this.dispatchEvent(
      new CustomEvent('go-to', {
        bubbles: true,
        composed: true,
        detail: {
          url: '/',
        },
      })
    );
    this.dispatchEvent(
      new CustomEvent('toast', {
        bubbles: true,
        composed: true,
        detail: {
          msg: 'Cloud added successfully!',
          duration: 3000,
        },
      })
    );
  },

  _cloudAddAjaxError(response) {
    console.error('add-cloud error', response);
  },

  _computeProviderLogo(className) {
    return `assets/providers/${className}.png`;
  },

  _computeTitle(selectedProvider) {
    if (this.providers) {
      const p = this.providers.find(f => f.val === selectedProvider);

      return p ? p.title : '';
    }
    return '';
  },

  _providerChanged(selectedProvider, providers) {
    if (selectedProvider)
      this.dispatchEvent(
        new CustomEvent('user-action', {
          bubbles: true,
          composed: true,
          detail: `select provider ${selectedProvider}`,
        })
      );

    this._resetForm();
    const selectedProviderDetails = providers.filter(
      fields => fields.val === selectedProvider
    );
    const providerFields = selectedProviderDetails.length
      ? selectedProviderDetails.shift().options
      : [];
    this.set(
      'providerFields',
      [
        {
          name: 'provider',
          type: 'text',
          show: false,
          value: selectedProvider,
        },
      ].concat(providerFields)
    );

    // replaces _providerFieldsChanged observer and skips provider reset
    // while reseting the other fields
    this.providerFields.forEach((el, index) => {
      if (el.name !== 'provider') {
        this.set(`providerFields.${index}.show`, el.show);
        this._resetField(el, index);
      }
    }, this);

    if (selectedProvider && !this.enableMonitoring) {
      const indexm = this.fieldIndexByName('monitoring');
      if (indexm) {
        this.set(`providerFields.${indexm}.show`, false);
      }
    }

    this.fillInKnownData(selectedProvider, this.clouds);
  },

  _providerFieldsChanged(fields) {
    const that = this;
    // Scroll down to #cloudFields
    if (this.selectedProvider && fields) {
      this.async(() => {
        that.$.content.scrollIntoView({ block: 'end', behavior: 'smooth' });
      }, 100);
    }
  },

  _keysChanged(_keys, _providerFields) {
    // Set list of keys in providerFields when model keys change
    const indexSshKey = this.providerFields.findIndex(
      field => field.type === 'ssh_key',
      this
    );

    if (indexSshKey)
      this.set(`providerFields.${indexSshKey}.options`, this.keys);

    // Check for nested subforms and update ssh_key fields
    this.providerFields.forEach((field, index) => {
      if (field.type === 'list') {
        field.options.forEach((subfield, subindex) => {
          if (subfield.type === 'ssh_key') {
            this.set(
              `providerFields.${index}.options.${subindex}.options`,
              this.keys
            );
          }
        });
      }
    });
  },

  _unsetProvider() {
    this.set('selectedProvider', false);
  },

  _resetForm(_e) {
    // Reset Form Fields
    this.providerFields.forEach((el, index) => {
      if (el.showIf) {
        this.set(`providerFields.${index}.show`, false);
      }

      // Reset Form Fields Validation
      this._resetField(el, index);
    }, this);
  },

  _resetField(el, index) {
    this.set(`providerFields.${index}.value`, el.defaultValue);

    const input = this.shadowRoot.querySelector(`#${el.name}`);
    if (input) {
      input.invalid = false;
    }
  },

  _goBack() {
    window.history.back();
  },

  _updateCloudTitle(e) {
    // console.log('_updateCloudTitle',e);
    if (
      e.target.id.startsWith('app-form-') &&
      e.target.id.endsWith('-region')
    ) {
      const region = e.detail.item.textContent.trim();
      let index;
      let title = '';
      const titleField = this.providerFields.find((f, ind) => {
        index = ind;
        return f.name === 'title';
      });
      title = titleField.defaultValue;
      this.set(`providerFields.${index}.value`, `${title} ${region}`);
    }
  },

  fillInKnownData(provider, _clouds) {
    if (provider) {
      const cloudInSameProvider = this.clouds.find(
        c => c.provider === provider
      );
      if (cloudInSameProvider) {
        // if there is an apikey we can fill in
        const { apikey } = cloudInSameProvider;
        const index = this.fieldIndexByName('apikey');
        if (apikey && index) {
          this.set(`providerFields.${index}.value`, apikey);
          // if there is apikey and an apisecret we can 'getsecretfromdb'
          const indexp = this.fieldIndexByName('apisecret');
          if (indexp) {
            this.set(`providerFields.${indexp}.value`, 'getsecretfromdb');
          }
        }
      }
    }
  },

  _resetProvider() {
    const indexp = this.fieldIndexByName('provider');
    if (indexp !== undefined) {
      this.set(`providerFields.${indexp}.value`, this.selectedProvider);
    }
  },

  fieldIndexByName(name) {
    const passField = this.providerFields.findIndex(f => f.name === name);
    return passField;
  },

  fieldsOfType(data, type) {
    const typeIndexes = [];
    data.forEach((f, ind) => {
      if (f.type === type) typeIndexes.push(ind);
    });
    return typeIndexes;
  },

  updateKeys(e) {
    const keyFieldsIndexes = this.fieldsOfType(this.providerFields, 'ssh_key');
    this.async(() => {
      for (let i = 0; i < keyFieldsIndexes.length; i++) {
        this.set(`providerFields.${keyFieldsIndexes[i]}.options`, this.keys);
        this.set(`providerFields.${keyFieldsIndexes[i]}.value`, e.detail.key);
      }
      if (this.fieldsOfType(this.providerFields, 'list')) {
        this.updateKeysInLists(
          e,
          this.fieldsOfType(this.providerFields, 'list')
        );
      }
    }, 500);
  },

  updateKeysInLists(e, lists) {
    for (let j = 0; j < lists.length; j++) {
      const keyFieldsIndexes = this.fieldsOfType(
        this.providerFields[lists[j]].options,
        'ssh_key'
      );

      this.async(() => {
        for (let i = 0; i < keyFieldsIndexes.length; i++) {
          this.set(
            `providerFields.${lists[i]}.options.${keyFieldsIndexes[i]}.options`,
            this.keys
          );
          this.set(
            `providerFields.${lists[i]}.options.${keyFieldsIndexes[i]}.value`,
            e.detail.key
          );
        }
      }, 10);
    }
  },
});
