import '@polymer/polymer/polymer-legacy.js';
import '@polymer/iron-ajax/iron-ajax.js';
import '@vaadin/vaadin-dialog/vaadin-dialog.js';
import '@polymer/paper-styles/typography.js';
import '@polymer/paper-button/paper-button.js';
import '@polymer/paper-input/paper-textarea.js';
import '@polymer/paper-progress/paper-progress.js';
import '@polymer/paper-dropdown-menu/paper-dropdown-menu.js';
import '@polymer/paper-listbox/paper-listbox.js';
import '../app-form/app-form.js';
import { Polymer } from '@polymer/polymer/lib/legacy/polymer-fn.js';
import { MACHINE_CREATE_FIELDS } from '../helpers/machine-create-fields.js';

const documentContainer = document.createElement('template');

documentContainer.innerHTML = `<dom-module id="expose-ports">
    <template>
        <style include="shared-styles dialogs">
        :host {
            width: 100%;
        }

        vaadin-dialog {
            min-width: 360px;
        }

        .grey {
            opacity: 0.54;
        }

        iron-icon {
            color: inherit;
        }

        :host mist-ports-field {
            padding-left: 0;
        }
        vaadin-dialog::slotted(app-form paper-button) {
            font-size: 0.9em;
            padding: 1rem;
        }
        </style>
        <vaadin-dialog id="exposePortsDialog" with-backdrop="">
            <template>
                <h2>Expose machine's ports</h2>
                <p class="grey" hidden$="[[!ports.length]]">To remove exposed ports, delete them and save.</p>
                <app-form id="expose-machines-ports" inline="" single-column="" fields="[[fields]]" form="{{form}}" url="/api/v1/machines/[[machine.id]]" on-request="_handleRequest" on-response="_handleResponse" on-error="_handleError" on-service-type-updated="_serviceTypeUpdated" btncontent="Save" show-cancel="" no-auto-update=""></app-form>
                <br>
            </template>
        </vaadin-dialog></template>&gt;


</dom-module>`;

document.head.appendChild(documentContainer.content);

Polymer({
  is: 'expose-ports',

  properties: {
    machine: {
      type: Object,
    },
    form: {
      type: Object,
      value() {
        return { action: 'expose' };
      },
    },
    provider: {
      type: String,
    },
    ports: {
      type: Array,
    },
    service_type: {
      type: String,
    },
    fields: {
      type: Array,
      computed: '_computeFields(machine, provider, ports)',
    },
  },
  listeners: {
    'app-form-cancel': '_updatePorts',
  },
  observers: ['_updatePorts(machine, machine.extra.port_forwards.*)'],
  _serviceTypeUpdated(e) {
    console.log('Service Type Updated: ', e);
    this._updatePorts();
  },
  _updatePorts(_machine, _portForwards) {
    const ports = [];
    if (
      this.machine &&
      this.machine.extra &&
      this.machine.extra.port_forwards
    ) {
      for (let i = 0; i < this.machine.extra.port_forwards.length; i++) {
        const port = this.machine.extra.port_forwards[i];
        const newPort = {
          port: port.public_port,
          target_port: port.local_port,
          protocol: port.protocol,
          params: port.params || '',
          service_type: port.service_type,
        };
        ports.push(newPort);
      }
    }
    this.set('form.action', 'expose');
    this.set('ports', JSON.parse(JSON.stringify(ports)));
  },
  _computeFields(_machine, provider, _ports) {
    const providerFields = MACHINE_CREATE_FIELDS.find(x => {
      return x.provider === provider;
    });
    // locate port fieldgroup definition
    const portFieldGroup =
      providerFields &&
      providerFields.fields.find(f => {
        return f.name === 'port_forwards';
      });

    if (portFieldGroup) {
      // locate ports field
      const fields = portFieldGroup.subfields.filter(f => {
        return f.type === 'list';
      });

      const serviceTypeField = portFieldGroup.subfields.filter(f => {
        return f.type === 'dropdown';
      });
      if (fields) {
        const { allPorts } = this;
        const cleanCopy = JSON.parse(JSON.stringify(fields));
        if (allPorts) {
          for (const port of allPorts) {
            if (
              !serviceTypeField[0] ||
              port.service_type === serviceTypeField[0].value
            ) {
              const toAdd = JSON.parse(JSON.stringify(cleanCopy[0].options));
              toAdd[0].value = port.port;
              toAdd[1].value = port.target_port;
              toAdd[2].value = port.protocol.toUpperCase();
              cleanCopy[0].items.push(toAdd);
            }
          }
        }
        if (serviceTypeField && serviceTypeField.length > 0) {
          cleanCopy.unshift(serviceTypeField[0]);
        }
        return cleanCopy;
      }
    }
    return [];
  },
  _openDialog(_e) {
    // Recompute ports on open to reset when canceled
    this._updatePorts();
    this.$.exposePortsDialog.opened = true;
  },
  _closeDialog(_e) {
    this.$.exposePortsDialog.opened = false;
  },
});
