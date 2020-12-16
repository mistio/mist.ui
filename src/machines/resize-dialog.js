import '../../node_modules/@polymer/polymer/polymer-legacy.js';
import '../../node_modules/@polymer/paper-dialog/paper-dialog.js';
import '../../node_modules/@polymer/paper-input/paper-input.js';
import '../../node_modules/@polymer/paper-progress/paper-progress.js';
import '../helpers/dialog-element.js';
import { Polymer } from '../../node_modules/@polymer/polymer/lib/legacy/polymer-fn.js';
import { html } from '../../node_modules/@polymer/polymer/lib/utils/html-tag.js';
import { CSRFToken, formatMoney } from '../helpers/utils.js';

Polymer({
  _template: html`
    <style include="shared-styles forms">
      :host {
        display: inline;
        color: rgba(255, 255, 255, 0.87);
      }

      #dialogModal {
        max-width: 500px;
      }

      .helptext {
        align-self: center;
      }

      .sup {
        font-size: 12px;
        font-weight: normal;
        opacity: 0.54;
      }

      .size .sup {
        padding-left: 16px;
      }

      .btn-group {
        display: flex;
        justify-content: flex-end;
      }

      .progress {
        margin: 14px -24px 0 -24px;
        width: 100%;
      }

      .progress paper-progress {
        width: 100%;
      }

      paper-progress.progresserror ::slotted(#primaryProgress) {
        background-color: var(--red-color);
      }

      .error {
        color: var(--red-color);
        align-self: flex-end;
        padding: 8px;
        font-size: 0.9em;
      }

      iron-icon {
        color: inherit;
      }

      .errormsg-container {
        color: var(--red-color);
        padding-left: 24px;
        padding-right: 24px;
        margin-bottom: 0;
      }

      .errormsg-container iron-icon {
        color: inherit;
      }

      p.red {
        padding: 4px;
        margin-top: 0;
      }

      paper-radio-button {
        display: block;
      }
    </style>
    <paper-dialog
      id="dialogModal"
      entry-animation="scale-up-animation"
      exit-animation="fade-out-animation"
      with-backdrop=""
    >
      <h2>Resize Machine <span class="sup">[[size]]</span></h2>
      <paper-dialog-scrollable>
        <p class="red" hidden$="[[!showNotification]]">
          Warning! Resize may cause a reboot to the machine.
        </p>
        <div hidden$="[[!showCustomSizeForm]]">
          <div class="grid-row">
            <div class="xs12 m6 l6">
              <paper-input
                id="cpus"
                label="cpus"
                always-float-label=""
                prevent-invalid-input=""
                auto-validate=""
                allowed-pattern="[0-9]*"
                value="{{cpus}}"
                error-message="Please enter numbers only"
                on-keyup="hotkeys"
              ></paper-input>
            </div>
            <div class="helptext xs12 m6 l6">
              Current machine cpus [[current_cpus]].
            </div>
            <div class="xs12 m6 l6">
              <paper-input
                id="memory"
                label="memory"
                always-float-label=""
                prevent-invalid-input=""
                auto-validate=""
                allowed-pattern="[0-9]*"
                value="{{memory}}"
                error-message="Please enter numbers only"
                on-keyup="hotkeys"
              ></paper-input>
            </div>
            <div class="helptext xs12 m6 l6">
              Current machine memory [[current_memory]].
            </div>
          </div>
        </div>
        <div hidden$="[[showCustomSizeForm]]">
          <paper-radio-group
            attr-for-selected="name"
            selected="{{selectedSize}}"
          >
            <template is="dom-repeat" items="[[sizes]]" as="size">
              <paper-radio-button
                name="[[size.id]]"
                disabled$="[[isCurrent(size,machine.size)]]"
              >
                [[size.name]]
                <span class="sup" hidden$="[[!isCurrent(size,machine.size)]]"
                  >Current machine size</span
                >
                <br />
                <div class="sup">
                  RAM [[size.ram]]<span hidden$="[[!size.disk]]"
                    >, Disk [[size.disk]]</span
                  ><span hidden$="[[!displayPrice(size)]]"
                    >, Price $[[displayPrice(size)]]/hour</span
                  >
                </div>
              </paper-radio-button>
            </template>
          </paper-radio-group>
        </div>
      </paper-dialog-scrollable>
      <div class="progress">
        <paper-progress
          id="progress"
          indeterminate=""
          hidden$="[[!loading]]"
        ></paper-progress>
        <paper-progress
          id="progresserror"
          class="progresserror"
          value="100"
          hidden$="[[!formError]]"
        ></paper-progress>
        <p
          id="progressmessage"
          class="errormsg-container"
          hidden$="[[!formError]]"
        >
          <iron-icon icon="icons:error-outline"></iron-icon
          ><span id="errormsg"></span>
        </p>
      </div>
      <div class="btn-group">
        <paper-button dialog-dismiss="">Cancel</paper-button>
        <paper-button
          class$="[[buttonColor]]"
          on-tap="resizeMachine"
          disabled$="[[!formReady]]"
          >Resize Machine</paper-button
        >
      </div>
    </paper-dialog>
    <dialog-element id="confirm"></dialog-element>
    <iron-ajax
      id="resizeMachine"
      url="/api/v1/machines/[[machine.id]]"
      method="POST"
      on-response="_resizeMachineResponse"
      on-error="_resizeMachineError"
      loading="{{loading}}"
      handle-as="xml"
      on-request="_resizeMachineRequest"
    ></iron-ajax>
  `,

  is: 'resize-dialog',

  properties: {
    clouds: {
      type: Object,
    },
    machine: {
      type: Object,
    },
    showNotification: {
      type: Boolean,
      value: true,
    },
    size: {
      type: String,
    },
    current_cpus: {
      type: Number,
      computed: 'computeCurrentCpus(machine)',
    },
    current_memory: {
      type: Number,
      computed: 'computeCurrentMemory(machine)',
    },
    cpus: {
      type: Number,
    },
    memory: {
      type: Number,
    },
    formReady: {
      type: Boolean,
      value: false,
    },
    loading: {
      type: Boolean,
      value: false,
    },
    formError: {
      type: Boolean,
      value: false,
    },
    buttonColor: {
      type: String,
      value: 'red',
    },
    showCustomSizeForm: {
      type: Boolean,
      computed: 'computeShowCustomSizeForm(machine.cloud, clouds)',
    },
    sizes: {
      type: Array,
    },
    selectedSize: {
      type: String,
    },
  },

  listeners: {
    input: 'clearError',
    'iron-overlay-closed': 'clearSelection',
  },

  observers: [
    '_updateFormReadyOnapp(machine, current_cpus, current_memory, cpus, memory)',
    '_updateFormReady(machine, selectedSize)',
    '_updateShowNotification(machine.extra, memory)',
    '_updateSizes(machine, clouds.*)',
    '_selectedSizeChanged(selectedSize)',
  ],

  ready() {},
  attached() {},

  resizeMachine() {
    if (this.showCustomSizeForm) {
      this.$.resizeMachine.headers['Content-Type'] = 'application/json';
      this.$.resizeMachine.headers['Csrf-Token'] = CSRFToken.value;
      this.$.resizeMachine.body = {
        action: 'resize',
        cpus: this.cpus,
        memory: this.memory,
      };
      this.$.resizeMachine.generateRequest();
    } else if (!this.showCustomSizeForm) {
      this.$.resizeMachine.headers['Content-Type'] = 'application/json';
      this.$.resizeMachine.headers['Csrf-Token'] = CSRFToken.value;
      this.$.resizeMachine.body = { action: 'resize', size: this.selectedSize };
      this.$.resizeMachine.generateRequest();
    }
  },

  _updateShowNotification(_machine, _memory) {
    if (this.machine && this.machine.extra.hypervisor_type) {
      if (
        this.machine.extra.hypervisor_type === 'kvm' &&
        this.current_memory >= this.memory
      ) {
        this.set('showNotification', false);
        this.set('buttonColor', 'blue');
      } else {
        this.set('showNotification', true);
        this.set('buttonColor', 'red');
      }
    }
  },

  updateValues(_machine) {
    if (this.machine) {
      if (this.showCustomSizeForm) {
        this.set('size', `Current ${this.machine.extra.size}`);
      } else {
        const currentSize = this.sizes.find(p => {
          return p.id === this.machine.size;
        });
        const name = currentSize ? currentSize.name : '';
        this.set('size', name.length ? `Current ${name}` : '');
      }
    }
    this.clearError();
  },

  computeCurrentCpus(_machine) {
    if (this.machine && this.machine.extra && this.machine.extra.cpus) {
      this.cpus = this.machine.extra.cpus;
      return this.machine.extra.cpus;
    }
    return '';
  },

  computeCurrentMemory(_machine) {
    if (this.machine && this.machine.extra && this.machine.extra.memory) {
      this.memory = this.machine.extra.memory;
      return this.machine.extra.memory;
    }
    return '';
  },

  computeShowCustomSizeForm(_machineCloud, _clouds) {
    if (
      this.machine &&
      this.machine.cloud &&
      this.clouds &&
      this.clouds[this.machine.cloud] &&
      this.clouds[this.machine.cloud].provider
    )
      return ['onapp'].indexOf(this.clouds[this.machine.cloud].provider) > -1;
    return false;
  },

  _updateSizes(machine, clouds) {
    if (
      this.machine &&
      this.clouds &&
      this.clouds[this.machine.cloud] &&
      (clouds.path === 'clouds' ||
        clouds.path.startsWith(`clouds.${this.machine.cloud}.sizes`))
    ) {
      // console.log('update sizes', clouds.path);
      let sizes = [];
      if (this.clouds[this.machine.cloud].provider.startsWith('aliyun')) {
        const machineLocationID = this.machine.location;
        const machineLocation = this.clouds[this.machine.cloud].locations[
          machineLocationID
        ];
        const availableLocationSizes = this.clouds[
          this.machine.cloud
        ].sizesArray.filter(size => {
          return (
            machineLocation.extra.available_instance_types.indexOf(
              size.external_id
            ) > -1
          );
        });
        sizes = availableLocationSizes || [];
        // console.log("sizes", this.clouds[this.machine.cloud].locations[machineLocationID].extra.available_instance_types.length === this.sizes.length);
      } else {
        sizes = this.clouds[this.machine.cloud].sizesArray || [];
      }
      this.set(
        'sizes',
        sizes.sort((a, b) => {
          if (this.isCurrent(a, machine.size)) return -1;
          if (this.isCurrent(b, machine.size)) return 1;
          return 0;
        })
      );
      this.$.dialogModal.refit();
    }
  },

  _selectedSizeChanged() {
    this.clearError();
  },

  clearError() {
    this.set('formError', false);
    this.$.errormsg.textContent = '';
    this.$.dialogModal.refit();
  },

  _updateFormReadyOnapp(currentCpus, currentMemory, cpus, memory) {
    if (this.showCustomSizeForm) {
      this.set(
        'formReady',
        cpus && memory && (currentCpus !== cpus || currentMemory !== memory)
      );
    }
  },

  _updateFormReady(_machine, _selectedSize) {
    if (!this.showCustomSizeForm && this.selectedSize !== undefined) {
      this.set('formReady', true);
    }
  },

  _openDialog(_e) {
    // reset
    this.updateValues(this.machine);
    this.$.dialogModal.open();
  },

  _resizeMachineResponse(_e) {
    this.$.dialogModal.close();
    this.clearSelection();
    this.dispatchEvent(
      new CustomEvent('action-finished', {
        bubbles: true,
        composed: true,
        detail: { success: true },
      })
    );

    this.dispatchEvent(
      new CustomEvent('toast', {
        bubbles: true,
        composed: true,
        detail: {
          msg: 'Resize request sent successfully. Updating machine..',
          duration: 3000,
        },
      })
    );
  },

  _resizeMachineError(e) {
    this.set('formError', true);
    console.log('error', e);
    this.$.errormsg.textContent = e.detail.request.xhr.responseText;
    this.$.dialogModal.refit();
  },

  _resizeMachineRequest(_e) {},

  isCurrent(size, machineSize) {
    return size.id === machineSize || size.name === machineSize;
  },

  clearSelection() {
    this.set('selectedSize', undefined);
    this.set('formReady', false);
  },

  displayNumber(n) {
    if (!n) {
      return n;
    }
    if (typeof n === 'number') {
      return formatMoney(n, 0, ',', '.');
    }
    return null;
  },

  displayPrice(size) {
    const price = size.price || (size.extra && size.extra.price);
    // console.log('extra.price',price, size.extra.price);
    if (typeof price === 'string') {
      return price;
    }
    if (typeof price === 'number') {
      return formatMoney(price);
    }
    if (
      typeof price === 'object' &&
      this.machine.os_type === 'windows' &&
      price.mswin
    ) {
      return price.mswin;
    }
    if (price && typeof price === 'object' && price.linux) {
      // && this.machine.os_type === 'unix' //show linux price for all other machines
      return price.linux;
    }
    return price ? JSON.stringify(price) : false;
  },

  hotkeys(e) {
    console.log('hotkeys', e);
    if (e.keyCode === 38) {
      // arrow up
      if (e.path.indexOf(this.$.cpus) > -1) {
        this.set('cpus', Math.max(this.cpus + 1, 1));
      }
      if (e.path.indexOf(this.$.memory) > -1) {
        this.set('memory', Math.max(this.memory + 5, 256));
      }
    } else if (e.keyCode === 40) {
      // arrow down
      if (e.path.indexOf(this.$.cpus) > -1) {
        this.set('cpus', Math.max(this.cpus - 1, 1));
      }
      if (e.path.indexOf(this.$.memory) > -1) {
        this.set('memory', Math.max(this.memory - 5, 256));
      }
    }
  },
});
