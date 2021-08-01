import '@polymer/polymer/polymer-legacy.js';
import '@polymer/paper-styles/typography.js';
import '@polymer/paper-button/paper-button.js';
import '@polymer/paper-toggle-button/paper-toggle-button.js';
import '@polymer/paper-checkbox/paper-checkbox.js';
import '../app-icons/app-icons.js';
import '../app-form/app-form.js';
import { Polymer } from '@polymer/polymer/lib/legacy/polymer-fn.js';
import { html } from '@polymer/polymer/lib/utils/html-tag.js';

Polymer({
  _template: html`
    <style include="shared-styles forms single-page">
      p {
        padding: 0 !important;
      }
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

      .error {
        color: var(--red-color);
      }
      .error iron-icon {
        color: inherit;
      }
    </style>

    <div id="content">
      <paper-material
        class="single-head layout horizontal"
        style$="background-color: [[section.color]]"
      >
        <span class="icon"
          ><iron-icon icon="[[section.icon]]"></iron-icon
        ></span>
        <div class="title flex">
          <h2>Run [[script.name]]</h2>
          <div class="subtitle">
            Run scripts on one machine per time. Create schedules for batch
            tasks.
          </div>
        </div>
      </paper-material>
      <paper-material>
        <p>
          Heads up! Make sure you select a machine you have already associated a
          key with. Otherwise the request may be accepted but the script will
          never finish running.
        </p>
        <p class="error" hidden$="{{machineHasKeys}}">
          <iron-icon icon="icons:warning"></iron-icon> Machine [[machine.name]]
          has no associated keys.
        </p>
        <app-form
          fields="[[fields]]"
          url="/api/v1/scripts/[[script.id]]"
          on-response="_runScriptResponse"
          btncontent="run"
        ></app-form>
      </paper-material>
    </div>
  `,

  is: 'script-run',

  properties: {
    model: {
      type: Object,
    },
    script: {
      type: Object,
    },
    section: {
      type: Object,
    },
    fields: {
      type: Array,
    },
    parameters: {
      type: String,
      value: null,
    },
    machinesOptions: {
      type: Array,
      value() {
        return [];
      },
    },
    hasMachines: {
      type: Boolean,
      computed: '_computeHasMachines(machinesOptions.*)',
    },
    cardTitleText: {
      type: String,
      computed: '_computeCardTitleText(script.name, runScript.machine)',
    },
    machine: {
      type: Object,
    },
    machineHasKeys: {
      type: Boolean,
      value: true,
      computed: '_machineChanged(machine)',
    },
  },

  observers: [
    '_cloudsChanged(fields.length, model.cloudsArray.*, model.machines.*, model.keysArray.*)',
  ],

  listeners: {
    'iron-select': '_fieldsChanged',
  },

  ready() {
    const arr = this.machinesOptions || [];
    const fields = [
      {
        name: 'machine_id',
        label: 'Select Machine *',
        type: 'mist_dropdown',
        value: '',
        defaultValue: '',
        placeholder: '',
        helptext: 'Choose the machine on which the script will run',
        show: true,
        required: true,
        options: arr,
      },
      {
        name: 'cloud_id',
        label: 'Cloud ID',
        type: 'text',
        value: '',
        defaultValue: '',
        placeholder: '',
        helptext: 'The cloud ID of the machine.',
        show: false,
        showIf: {
          fieldName: 'machine_id',
          fieldExists: true,
        },
        required: true,
        disabled: true,
      },
      {
        name: 'params',
        label: 'Parameters',
        type: 'textarea',
        value: '',
        defaultValue: '',
        placeholder: '',
        helptext: 'Optional. Fill in the script parameters.',
        show: true,
        required: false,
      },
      {
        name: 'env',
        label: 'Enviroment variables',
        type: 'textarea',
        value: '',
        defaultValue: '',
        placeholder: '',
        helptext: 'Optional. Fill in env vars, one per line',
        show: true,
        required: false,
      },
    ];
    this.set('fields', fields);
  },

  _computeMachinesOptions(_clouds) {
    return Object.values(this.model.machines).filter(cloud => cloud.enabled);
  },

  _computeHasMachines(machinesOptions) {
    return machinesOptions.base.length > 0;
  },

  _computeFieldType(field, value, _show) {
    if (!(field.showIf && !field.show)) {
      return field.type === value;
    }
    return false;
  },

  _computeCardTitleText(name, machine) {
    return machine
      ? `Run Script "${name}" on "${machine.name}"`
      : `Run Script "${name}"`;
  },

  _fieldsChanged(event) {
    const machine = event.detail.item;
    if (machine && machine.value) {
      const machineId = machine.value;
      this.set('machine', this.model.machines[machineId]);
      this.set('fields.1.value', this.model.machines[machineId].cloud);
    }
  },

  _machineChanged(machine) {
    return !!(
      machine.key_associations &&
      Object.keys(machine.key_associations).length > 0
    );
  },

  _cloudsChanged(_fieldsLength, _clouds, _machines, _keys) {
    this.set('fields.0.options', Object.values(this.model.machines));

    if (this.fields && this.fields[0] && this.fields[0].options) {
      this.fields[0].options.forEach((o, index) => {
        if (o && o.key_associations && o.key_associations.length > 0) {
          this.set(`fields.0.options.${index}.icon`, 'communication:vpn-key');
        } else {
          this.set(`fields.0.options.${index}.icon`, 'nokey');
        }
      }, this);
    }
  },

  _runScriptResponse(_e) {
    this.dispatchEvent(
      new CustomEvent('toast', {
        bubbles: true,
        composed: true,
        detail: {
          msg: 'Run script request was successful. Redirecting to script...',
          duration: 3000,
        },
      })
    );

    this.async(() => {
      this.dispatchEvent(
        new CustomEvent('go-to', {
          bubbles: true,
          composed: true,
          detail: { url: `/scripts/${this.script.id}` },
        })
      );
    }, 3300);
  },
});
