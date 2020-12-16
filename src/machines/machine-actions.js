import '../../node_modules/@polymer/polymer/polymer-legacy.js';
import '../../node_modules/@polymer/paper-input/paper-input.js';
import '../../node_modules/@polymer/paper-input/paper-input-error.js';
import '../../node_modules/@polymer/paper-input/paper-textarea.js';
import '../../node_modules/@polymer/iron-ajax/iron-ajax.js';
import '../../node_modules/@polymer/iron-icons/iron-icons.js';
import '../../node_modules/@vaadin/vaadin-icons/vaadin-icons.js';
import '../../node_modules/@mistio/mist-list/mist-list-actions.js';
import { MistListActionsBehavior } from '../../node_modules/@mistio/mist-list/mist-list-actions-behavior.js';
import '../tags/tags-form.js';
import '../helpers/xterm-dialog.js';
import '../helpers/dialog-element.js';
import '../helpers/transfer-ownership.js';
import '../mist-icons.js';
import './associate-key.js';
import './run-script-on-machine.js';
import './resize-dialog.js';
import './machine-edit.js';
import './attach-volume-on-machine.js';
import './machine-snapshots.js';
import './expose-ports.js';
import { CSRFToken } from '../helpers/utils.js';
import { VOLUME_CREATE_FIELDS } from '../helpers/volume-create-fields.js';
import { Polymer } from '../../node_modules/@polymer/polymer/lib/legacy/polymer-fn.js';
import { html } from '../../node_modules/@polymer/polymer/lib/utils/html-tag.js';

const MACHINE_ACTIONS = {
  'attach-volume': {
    name: 'attach volume',
    icon: 'device:storage',
    confirm: false,
    multi: false,
    single: true,
  },
  create_snapshot: {
    name: 'create snapshot',
    icon: 'image:add-a-photo',
    confirm: true,
    multi: false,
  },
  remove_snapshot: {
    name: 'remove snapshot',
    icon: 'image:monochrome-photos',
    confirm: true,
    multi: false,
  },
  revert_to_snapshot: {
    name: 'revert to snapshot',
    icon: 'social:party-mode',
    confirm: true,
    multi: false,
  },
  shell: {
    name: 'shell',
    icon: 'vaadin:terminal',
    confirm: false,
    multi: false,
  },
  console: {
    name: 'console',
    icon: 'vaadin:terminal',
    confirm: false,
    multi: false,
  },
  tag: {
    name: 'tag',
    icon: 'label',
    confirm: true,
    multi: true,
  },
  'associate-key': {
    name: 'associate key',
    icon: 'communication:vpn-key',
    confirm: true,
    multi: false,
  },
  'run-script': {
    name: 'run script',
    icon: 'image:movie-creation',
    confirm: true,
    multi: false,
  },
  reboot: {
    name: 'reboot',
    icon: 'av:replay',
    confirm: true,
    multi: true,
  },
  start: {
    name: 'start',
    icon: 'av:play-arrow',
    confirm: true,
    multi: true,
  },
  stop: {
    name: 'stop',
    icon: 'av:stop',
    confirm: true,
    multi: true,
  },
  clone: {
    name: 'clone',
    icon: 'content-copy',
    confirm: true,
    multi: false,
    fields: [
      {
        type: 'text',
        name: 'name',
        label: "Clone's Name",
        value: '',
        defaultValue: '',
        show: true,
        required: false,
      },
    ],
  },
  suspend: {
    name: 'suspend',
    icon: 'av:stop',
    confirm: true,
    multi: true,
  },
  rename: {
    name: 'rename',
    icon: 'editor:mode-edit',
    confirm: true,
    multi: false,
  },
  resize: {
    name: 'resize',
    icon: 'image:photo-size-select-small',
    confirm: true,
    multi: false,
  },
  resume: {
    name: 'resume',
    icon: 'av:replay',
    confirm: true,
    multi: true,
  },
  undefine: {
    name: 'undefine',
    icon: 'image:panorama-fish-eye',
    confirm: true,
    multi: true,
  },
  remove: {
    name: 'remove',
    icon: 'remove',
    confirm: true,
    multi: true,
  },
  destroy: {
    name: 'destroy',
    icon: 'delete',
    confirm: true,
    multi: true,
  },
  'transfer-ownership': {
    name: 'transfer ownership',
    icon: 'icons:redo',
    confirm: false,
    multi: true,
  },
  webconfig: {
    name: 'webconfig',
    icon: 'mist-icons:menu',
    confirm: true,
    multi: false,
  },
  delete: {
    name: 'delete',
    icon: 'delete',
    confirm: true,
    multi: true,
  },
  expose: {
    name: 'expose',
    icon: 'icons:forward',
    confirm: true,
    multi: false,
  },
};

Polymer({
  _template: html`
    <style include="shared-styles">
      mist-list-actions {
        width: 100%;
      }
    </style>
    <machine-edit id="renamedialog" items="[[items]]"></machine-edit>
    <run-script-on-machine
      id="runscriptdialog"
      items="[[items]]"
      scripts="[[model.scriptsArray]]"
    ></run-script-on-machine>
    <expose-ports
      id="exposePortsdialog"
      machine="[[items.0]]"
      provider="[[getProvider(items.0)]]"
    ></expose-ports>
    <associate-key
      id="associatekeydialog"
      items="[[items]]"
      model="[[model]]"
    ></associate-key>
    <machine-snapshots
      id="snapshotdialog"
      machine="[[items.0]]"
      snapshots=""
      action=""
    ></machine-snapshots>
    <attach-volume-on-machine
      id="attachvolumedialog"
      machine="[[items.0]]"
      model="[[model]]"
    ></attach-volume-on-machine>
    <dialog-element id="confirm" fields="{{action.fields}}"></dialog-element>
    <tags-form
      id="tagsdialog"
      model="[[model]]"
      items="[[items]]"
      type="machine"
    ></tags-form>
    <transfer-ownership
      id="ownershipdialog"
      user="[[user]]"
      members="[[_otherMembers(model.membersArray,items.length)]]"
      items="[[items]]"
      type="[[type]]"
    ></transfer-ownership>
    <resize-dialog
      id="resizedialog"
      machine="[[_getMachine(items.length)]]"
      clouds="[[model.clouds]]"
    ></resize-dialog>
    <iron-ajax
      id="request"
      handle-as="json"
      loading="{{loadingData}}"
      on-response="handleResponse"
      on-error="handleError"
    ></iron-ajax>
    <slot>
      <mist-list-actions actions="[[actions]]"></mist-list-actions>
    </slot>
  `,

  is: 'machine-actions',
  behaviors: [MistListActionsBehavior],

  properties: {
    model: {
      type: Object,
    },
    items: {
      type: Array,
      value() {
        return [];
      },
    },
    actions: {
      type: Array,
      value() {
        return [];
      },
      notify: true,
    },
    inSinglePage: {
      type: Boolean,
      value: false,
      reflectToAttribute: true,
    },
    action: {
      type: Object,
    },
    providersWithVolumes: {
      type: Array,
      value() {
        return VOLUME_CREATE_FIELDS.map(i => i.provider);
      },
    },
  },

  listeners: {
    'rename-machine': 'renameAction',
    'transfer-ownership': 'transferOwnership',
    'perform-action': 'performAction',
    confirmation: 'confirmAction',
    'select-action': 'selectAction',
  },

  ready() {},

  attached() {
    this.$.request.headers['Content-Type'] = 'application/json';
    this.$.request.headers['Csrf-Token'] = CSRFToken.value;
    this.$.request.method = 'POST';
  },

  getProviders(machines) {
    const providers = [];
    for (let i = 0; i < machines.length; i++) {
      providers.push(this.getProvider(machines[i]));
    }
    return providers;
  },

  getProvider(machine) {
    if (
      machine &&
      this.model &&
      this.model.clouds &&
      this.model.clouds[machine.cloud]
    ) {
      return this.model.clouds[machine.cloud].provider;
    }
    return false;
  },

  computeItemActions(machine) {
    const arr = [];
    if (
      this.model &&
      this.model.clouds &&
      ['vsphere', 'openstack', 'libvirt'].indexOf(
        this.model.clouds[machine.cloud].provider
      ) > -1
    ) {
      if (
        machine.state === 'running' &&
        (this.model.clouds[machine.cloud].provider !== 'libvirt' ||
          machine.parent)
      ) {
        arr.push('console');
      }
    }
    if (machine) {
      if (
        machine.os_type !== 'windows' &&
        machine.machine_type !== 'ilo-host' &&
        ['terminated', 'stopped'].indexOf(machine.state) === -1
      ) {
        arr.push('shell');
        arr.push('associate-key');
      }
      if (
        this.inSinglePage &&
        this.providersWithVolumes.indexOf(
          this.model.clouds[machine.cloud].provider
        ) > -1
      ) {
        arr.push('attach-volume');
      }
    }
    if (machine && machine.actions) {
      Object.keys(machine.actions || {}).forEach(action => {
        if (machine.actions[action]) arr.push(action);
      });
    }
    if (machine.key_associations && machine.key_associations.length) {
      arr.push('run-script');
    }
    if (
      this.model &&
      this.model.org.ownership_enabled &&
      (machine.owned_by === this.model.user.id || this.model.org.is_owner)
    ) {
      arr.push('transfer-ownership');
    }
    return arr.sort(this._sortActions.bind(this));
  },

  _sortActions(a, b) {
    const sortOrder = [
      'console',
      'shell',
      'webconfig',
      'expose',
      'start',
      'stop',
      'clone',
      'suspend',
      'resume',
      'reboot',
      'resize',
      'undefine',
      'remove',
      'destroy',
      'delete',
      'attach-volume',
      'create_snapshot',
      'revert_to_snapshot',
      'remove_snapshot',
      'associate-key',
      'rename',
      'run-script',
      'transfer-ownership',
      'tag',
    ];
    if (sortOrder.indexOf(a) < sortOrder.indexOf(b)) {
      return -1;
    }
    if (sortOrder.indexOf(a) > sortOrder.indexOf(b)) {
      return 1;
    }
    // a must be equal to b
    return 0;
  },

  _otherMembers(members) {
    if (this.items && members) {
      const owners = this.items
        .map(i => i.owned_by)
        .filter((value, index, self) => self.indexOf(value) === index);
      // filter out pending users and the single owner of the item-set if that is the case
      return members.filter(m =>
        owners.length === 1 ? m.id !== owners[0] && !m.pending : !m.pending
      );
    }
    return [];
  },

  _getMachine() {
    if (this.items.length) return this.get('items.0');
    return undefined;
  },

  computeActionListDetails(actions) {
    const ret = [];
    for (let i = 0; i < actions.length; i++) {
      ret.push(MACHINE_ACTIONS[actions[i]]);
    }
    return ret;
  },

  _delete() {
    // set up iron ajax
    this.$.request.headers['Content-Type'] = 'application/json';
    this.$.request.headers['Csrf-Token'] = CSRFToken.value;
    this.$.request.method = 'DELETE';

    for (let i = 0; i < this.items.length; i++) {
      this.$.request.url = `/api/v1/machines/${this.items[i].id}`;
      this.$.request.generateRequest();
      this.dispatchEvent(
        new CustomEvent('toast', {
          bubbles: true,
          composed: true,
          detail: {
            msg: `Deleting ${this.items[i].name}`,
            duration: 1000,
          },
        })
      );
    }
  },

  _showDialog(info) {
    const dialog = this.shadowRoot.querySelector('dialog-element');
    if (info) {
      Object.keys(info || {}).forEach(i => {
        dialog[i] = info[i];
      });
    }
    dialog._openDialog();
  },

  selectAction(e) {
    console.log('selectAction machine-actions');
    if (this.items.length) {
      const { action } = e.detail;
      this.set('action', action);
      // console.log('perform action mist-action', this.items);
      if (
        action.confirm &&
        [
          'tag',
          'rename',
          'expose',
          'run script',
          'associate key',
          'resize',
          'webconfig',
          'create snapshot',
          'remove snapshot',
          'revert to snapshot',
        ].indexOf(action.name) === -1
      ) {
        const plural = this.items.length === 1 ? '' : 's';
        const count = this.items.length > 1 ? `${this.items.length} ` : '';
        if (action.name === 'clone' && this.action.fields) {
          this.set(
            'action.fields.0.value',
            this.items[0].value || `${this.items[0].name}-clone`
          );
        }
        this._showDialog({
          title: `${this.action.name} ${count}machine${plural}?`,
          body: `You are about to ${this.action.name} ${this.items.length} machine${plural}:`,
          list: this._makeList(this.items, 'name'),
          action: action.name,
          danger: true,
          hideText: !!this.action.fields,
          reason: `machine.${this.action.name}`,
        });
      } else if (action.name === 'delete') {
        this._delete(this.items);
      } else if (action.name === 'resize') {
        this.$.resizedialog._openDialog();
      } else if (action.name === 'tag') {
        this.$.tagsdialog._openDialog();
      } else if (action.name === 'attach volume') {
        this.$.attachvolumedialog._openDialog();
      } else if (action.name === 'transfer ownership') {
        this.$.ownershipdialog._openDialog();
      } else if (action.name === 'create snapshot') {
        this.$.snapshotdialog.action = action.name;
        this.$.snapshotdialog._openDialog();
      } else if (action.name === 'remove snapshot') {
        this.$.snapshotdialog.snapshots = this.items[0].extra.snapshots;
        this.$.snapshotdialog.action = action.name;
        this.$.snapshotdialog._openDialog();
      } else if (action.name === 'revert to snapshot') {
        this.$.snapshotdialog.snapshots = this.items[0].extra.snapshots;
        this.$.snapshotdialog.action = action.name;
        this.$.snapshotdialog._openDialog();
      } else if (action.name === 'rename') {
        this.$.renamedialog._openDialog();
      } else if (action.name === 'webconfig') {
        this._openWebconfig(this.items);
      } else if (action.name === 'run script') {
        this.$.runscriptdialog._openDialog();
      } else if (action.name === 'associate key') {
        this.$.associatekeydialog._openDialog();
      } else if (action.name === 'expose') {
        this.$.exposePortsdialog._openDialog();
      } else if (!action.confirm) {
        this.performMachineAction(action, this.items);
      }
    }
  },

  _openWebconfig() {
    const machine = this.items[0];
    const url = `https://${machine.hostname}:81`;
    window.open(url, 'view');
  },

  confirmAction(e) {
    if (e.detail.confirmed) this.performMachineAction(this.action, this.items);
  },

  renameAction(e) {
    console.log('renameAction', e.detail);
    this.performMachineAction(e.detail.action, this.items, e.detail.name);
  },

  transferOwnership(e) {
    const payload = {
      user_id: e.detail.user_id, // new owner
      resources: {},
    };
    payload.resources.machine = this.items.map(i => i.id);
    console.log('transferOwnership', e.detail, payload);
    this.$.request.url = '/api/v1/ownership';
    this.$.request.headers['Content-Type'] = 'application/json';
    this.$.request.headers['Csrf-Token'] = CSRFToken.value;
    this.$.request.method = 'POST';
    this.$.request.body = payload;
    this.$.request.generateRequest();
  },

  performMachineAction(action, items, name) {
    const runitems = items.slice();
    // console.log('perform action machine',items);
    const run = el => {
      let uri;
      let payload;
      const item = runitems.shift();
      const method = 'POST';
      // console.log('renameAction', item.name, action.name, name);
      // machines
      if (action.name === 'shell') {
        console.warn('opening shell');
        // load page import on demand.
        // el.importHref(el.resolveUrl('/elements/helpers/xterm-dialog.html'), null, null, true);
        // remove existing terminals from DOM
        let xterm = document.querySelector('xterm-dialog');
        if (xterm) {
          xterm.remove();
          // console.log('xterm removed', this.items);
        }

        xterm = el.querySelector('xterm-dialog');
        if (!xterm) {
          xterm = document.createElement('xterm-dialog');
          xterm.target = item;
          const app = document.querySelector('mist-app');
          app.shadowRoot.insertBefore(xterm, app.shadowRoot.firstChild);
        }
        // console.log('perform action shell', item);
        return;
      }
      if (
        [
          'reboot',
          'start',
          'stop',
          'suspend',
          'resume',
          'undefine',
          'destroy',
          'remove',
        ].indexOf(action.name) > -1
      ) {
        uri = `/api/v1/machines/${item.id}`;
        payload = {
          action: action.name,
        };
      } else if (action.name === 'rename') {
        uri = `/api/v1/machines/${item.id}`;
        payload = {
          action: action.name,
          name,
        };
      } else if (action.name === 'clone') {
        uri = `/api/v1/machines/${item.id}`;
        payload = {
          action: action.name,
          name: action.fields[0].value,
        };
      } else if (action.name === 'probe') {
        uri = `/api/v1/machines/${item.id}/probe`;
        payload = {
          host: item.public_ips[0],
          key: item.key_associations[0],
        };
      } else if (action.name === 'console') {
        uri = `/api/v1/machines/${item.id}/console`;
        // window.open(uri, 'view');
        const form = document.createElement('form');
        form.setAttribute('method', 'post');
        form.setAttribute('action', uri);
        form.setAttribute('target', 'view');
        const hiddenField = document.createElement('input');
        hiddenField.setAttribute('type', 'hidden');
        hiddenField.setAttribute('name', 'Csrf-Token');
        hiddenField.setAttribute('value', CSRFToken.value);
        form.appendChild(hiddenField);
        document.body.appendChild(form);

        window.open('', 'view');

        form.submit();
        return;
      } else if (action.name === 'transfer ownership') {
        return;
      } else {
        console.error('unknown action', action, 'on item', item);
        return;
      }

      const xhr = new XMLHttpRequest();
      xhr.onreadystatechange = () => {
        if (xhr.readyState === XMLHttpRequest.DONE) {
          let message = '';
          if (xhr.status === 200) {
            console.log(action, 'success');
            message = `Successfully ${this.inPast(
              action.name
            )} machine. Updating...`;
            this.dispatchEvent(
              new CustomEvent('action-finished', {
                bubbles: true,
                composed: true,
                detail: {
                  success: true,
                },
              })
            );

            // for machines destroy only and only if in machine page
            if (
              ['destroy', 'remove'].indexOf(action.name) > -1 &&
              document.location.pathname &&
              document.location.pathname.split('/machines/')[1] === item.id
            ) {
              this.dispatchEvent(
                new CustomEvent('go-to', {
                  bubbles: true,
                  composed: true,
                  detail: {
                    url: '/machines',
                  },
                })
              );
            }
            if (item.provider === 'libvirt' && action.name === 'undefine') {
              this.dispatchEvent(
                new CustomEvent('go-to', {
                  bubbles: true,
                  composed: true,
                  detail: {
                    url: '/machines',
                  },
                })
              );
            }
          } else {
            console.error(action, 'failed');
            console.log(xhr);
            const responsetext = xhr.responseText ? xhr.responseText : '';
            message = `${action.name.toUpperCase()} failed.${responsetext}`;
            this.dispatchEvent(
              new CustomEvent('action-finished', {
                bubbles: true,
                composed: true,
                detail: {
                  success: false,
                },
              })
            );
          }
          this.dispatchEvent(
            new CustomEvent('toast', {
              bubbles: true,
              composed: true,
              detail: {
                msg: message,
                duration: 5000,
              },
            })
          );

          if (runitems.length) {
            run(el);
          } else {
            this.dispatchEvent(new CustomEvent('action-finished'));
          }
        }
      };

      xhr.open(method, uri);
      xhr.setRequestHeader('Content-Type', 'application/json;charset=UTF-8');
      xhr.setRequestHeader('Csrf-Token', CSRFToken.value);
      xhr.send(JSON.stringify(payload));

      const logMessage = `Performing action ${action.name.toUpperCase()} on machine ${
        this.model.machines[item.id].name
      }`;
      this.dispatchEvent(
        new CustomEvent('performing-action', {
          bubbles: true,
          composed: true,
          detail: {
            log: logMessage,
          },
        })
      );
    };

    run(this);
  },

  handleResponse(e) {
    console.log('handle response', e, this.$.request.body);
    if (this.$.request && this.$.request.body && this.$.request.body.action)
      this.dispatchEvent(
        new CustomEvent('toast', {
          bubbles: true,
          composed: true,
          detail: {
            msg: `Action: ${
              this.$.request.body.action || 'ownership transfer'
            } successful`,
            duration: 3000,
          },
        })
      );

    if (
      e.detail.xhr.responseURL.endsWith('api/v1/ownership') &&
      e.detail.xhr.status === 200
    ) {
      this.$.ownershipdialog._closeDialog();
      this.dispatchEvent(new CustomEvent('action-finished'));

      if (this.querySelector('mist-list-actions')) {
        this.querySelector('mist-list-actions').fire('action-finished');
      }

      this.dispatchEvent(
        new CustomEvent('toast', {
          bubbles: true,
          composed: true,
          detail: {
            msg: 'Successful ownership transfer',
            duration: 3000,
          },
        })
      );
    }
  },

  handleError(e) {
    // console.log(e.detail.request.xhr.statusText);
    this.dispatchEvent(
      new CustomEvent('toast', {
        bubbles: true,
        composed: true,
        detail: {
          msg: `Error: ${e.detail.request.xhr.status} ${e.detail.request.xhr.statusText}`,
          duration: 5000,
        },
      })
    );

    if (e.detail.request.xhr.responseURL.endsWith('api/v1/ownership')) {
      this.$.ownershipdialog._closeDialog();
    }
  },

  _makeList(items, property) {
    return items && items.length && items.map(item => item[property]);
  },

  inPast(action) {
    if (action === 'shell') return 'opened shell';
    if (action === 'expose') return 'exposed';
    if (action === 'tag') return 'tagged';
    if (action === 'associate key') return 'associated key';
    if (action === 'run-script') return 'run script';
    if (action === 'reboot') return 'rebooted';
    if (action === 'start') return 'started';
    if (action === 'stop') return 'stopped';
    if (action === 'suspend') return 'suspended';
    if (action === 'rename') return 'renamed';
    if (action === 'resume') return 'resumed';
    if (action === 'clone') return 'cloned';
    if (action === 'undefine') return 'undefined';
    if (action === 'suspend') return 'suspended';
    if (action === 'destroy') return 'destroyed';
    if (action === 'remove') return 'removed';
    if (action === 'star') return 'starred';
    if (action === 'unstar') return 'unstarred';
    if (action === 'destroy') return 'destroyed';
    if (action === 'make default') return 'made default';
    if (action === 'run') return 'run';
    if (action === 'enable') return 'enabled';
    if (action === 'disable') return 'disabled';
    if (action === 'disable') return 'disabled';
    if (action === 'delete') return 'deleted';
    return '';
  },
});
