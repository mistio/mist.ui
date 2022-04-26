import '@polymer/polymer/polymer-legacy.js';
import '@vaadin/vaadin-dialog/vaadin-dialog.js';
import '@polymer/paper-input/paper-input.js';
import '@polymer/paper-input/paper-input-error.js';
import '@polymer/paper-input/paper-textarea.js';
import '@polymer/iron-ajax/iron-ajax.js';
import '@polymer/iron-icons/iron-icons.js';
import '@vaadin/vaadin-icons/vaadin-icons.js';
import '@mistio/mist-list/mist-list-actions.js';
import { MistListActionsBehavior } from '@mistio/mist-list/mist-list-actions-behavior.js';
import './cloud-edit.js';
import './other-cloud-add-machine.js';
import '../tags/tags-form.js';
import '../helpers/xterm-dialog.js';
import '../helpers/dialog-element.js';
import { Polymer } from '@polymer/polymer/lib/legacy/polymer-fn.js';
import { html } from '@polymer/polymer/lib/utils/html-tag.js';
import { CSRFToken } from '../helpers/utils.js';

const CLOUD_ACTIONS = {
  tag: {
    name: 'tag',
    icon: 'label',
    confirm: true,
    multi: true,
  },
  rename: {
    name: 'rename',
    icon: 'editor:mode-edit',
    confirm: false,
    multi: true,
  },
  edit_credentials: {
    name: 'edit credentials',
    icon: 'icons:lock-outline',
    confirm: false,
    multi: true,
  },
  add_hosts: {
    name: 'add host',
    icon: 'hardware:computer',
    confirm: false,
    multi: false,
  },
  remove: {
    name: 'remove',
    icon: 'delete',
    confirm: true,
    multi: true,
  },
};

Polymer({
  _template: html`
    <style include="shared-styles">
      mist-list-actions {
        width: 100%;
      }

      vaadin-dialog#renameDialog {
        max-width: 350px;
      }

      vaadin-dialog#credentialsDialog,
      vaadin-dialog#addhostsDialog,
      vaadin-dialog#dnsDialog {
        max-width: 650px;
      }

      div.buttons {
        margin: 24px 0 0 0;
        display: flex;
        justify-content: flex-end;
      }
    </style>

    <iron-ajax
      id="cloudEditAjaxRequest"
      url="/api/v1/clouds/[[cloud.id]]"
      method="PUT"
      on-response="_handleCloudEditAjaxResponse"
      on-error="_handleCloudEditAjaxError"
    ></iron-ajax>
    <iron-ajax
      id="cloudRemoveAjaxRequest"
      url="/api/v1/clouds/[[cloud.id]]"
      method="DELETE"
      on-response="_handleCloudRemovalAjaxResponse"
      on-error="_handleCloudRemovalAjaxError"
    ></iron-ajax>

    <vaadin-dialog id="renameDialog" theme="mist-dialog" with-backdrop="">
      <template>
        <h3>Rename Cloud</h3>
        <div style="margin-bottom: 16px;">
          <paper-input
            label="Name"
            value="{{newCloud.name}}"
            tabindex="0"
          ></paper-input>
          <div class="buttons">
            <paper-button on-tap="closeRenameDialog">Cancel</paper-button>
            <paper-button
              id="rename-cloud"
              dialog-confirm=""
              disabled$="[[!formReady]]"
              on-tap="_changeName"
              class="blue"
              >Save</paper-button
            >
          </div>
          <div></div></div
      ></template>
    </vaadin-dialog>

    <vaadin-dialog id="credentialsDialog" theme="mist-dialog" with-backdrop="">
      <template>
        <h3>Edit Credentials</h3>
        <div style="margin-bottom: 16px;">
          <cloud-edit
            cloud="[[cloud]]"
            clouds="[[model.clouds]]"
            keys="[[model.keysArray]]"
          ></cloud-edit>
        </div>
      </template>
    </vaadin-dialog>

    <vaadin-dialog id="addhostsDialog" theme="mist-dialog" with-backdrop="">
      <template>
        <h3>Add Host</h3>
        <div>
          <other-cloud-add-machine
            cloud="[[cloud]]"
            keys="[[model.keysArray]]"
            providers="[[providers]]"
          ></other-cloud-add-machine>
        </div>
      </template>
    </vaadin-dialog>

    <iron-ajax
      id="cloudRemoveAjaxRequest"
      url="/api/v1/clouds/[[cloud.id]]"
      method="DELETE"
      on-response="_handleCloudRemovalAjaxResponse"
      on-error="_handleCloudRemovalAjaxError"
    ></iron-ajax>
    <dialog-element id="confirm"></dialog-element>
    <tags-form
      id="tagsdialog"
      model="[[model]]"
      items="[[items]]"
      type="[[resourceType]]"
    ></tags-form>
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

  is: 'cloud-actions',
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
    cloud: {
      type: Object,
      computed: '_computeCloud(items, items.length)',
    },
    actions: {
      type: Array,
      value() {
        return [];
      },
      notify: true,
    },
    resourceType: {
      type: String,
      value: 'cloud',
    },
    portalName: {
      type: String,
    },
    inSingleView: {
      type: Boolean,
      reflectToAttribute: true,
    },
    newCloud: {
      type: Object,
      computed: '_computeNewCloud(cloud)',
    },
    sendingData: {
      type: Boolean,
      value: false,
    },
    formReady: {
      type: Boolean,
      computed: '_computeFormReady(cloud.name, newCloud.name, sendingData)',
    },
    providers: {
      type: Array,
    },
  },

  listeners: {
    'select-action': 'selectAction',
    confirmation: 'confirmAction',
    'close-rename-dialog': 'closeRenameDialog',
    'add-input': 'closeDialog',
    response: 'closeDialogs',
    cancel: 'closeDialogs',
  },

  attached() {
    this.$.request.headers['Content-Type'] = 'application/json';
    this.$.request.headers['Csrf-Token'] = CSRFToken.value;
    this.$.request.method = 'POST';
  },

  closeRenameDialog() {
    this.$.renameDialog.opened = false;
  },

  computeItemActions(cloud) {
    const arr = [];
    if (cloud) {
      arr.push('tag');
      arr.push('rename');
      if (
        this._isBareMetal(cloud.provider) ||
        this._isKvmLibvirt(cloud.provider)
      )
        arr.push('add_hosts');
      if (!this._isBareMetal(cloud.provider)) arr.push('edit_credentials');
      arr.push('remove');
    }
    return arr;
  },

  _isBareMetal(provider) {
    return provider === 'other';
  },

  _isKvmLibvirt(provider) {
    return provider === 'libvirt';
  },

  computeActionListDetails(actions) {
    const ret = [];
    for (let i = 0; i < actions.length; i++) {
      ret.push(CLOUD_ACTIONS[actions[i]]);
    }
    return ret;
  },

  confirmAction(e) {
    if (e.detail.confirmed) this.performAction(this.action, this.items);
  },

  selectAction(e) {
    if (this.items.length) {
      const { action } = e.detail;
      const removeExplanation = `Removing clouds will not affect your resources, but you will no longer be able to manage them with ${this.portalName}.`;
      this.set('action', action);
      // console.log('perform action mist-action', this.items);
      if (
        action.confirm &&
        action.name === 'remove' &&
        this.items.length === 1
      ) {
        this._showDialog({
          title: 'Remove cloud?',
          body: 'Removing a cloud can not be undone.',
          subscript: removeExplanation,
          danger: true,
          action: 'REMOVE',
          list: this._makeList(this.items, 'name'),
          reason: 'cloud.remove',
        });
      } else if (action.confirm && action.name !== 'tag') {
        const plural = this.items.length === 1 ? '' : 's';
        const count = this.items.length > 1 ? `${this.items.length} ` : '';
        // this.tense(this.action.name) + " " + this.resourceType + "s can not be undone.
        this._showDialog({
          title: `${this.action.name} ${count}${this.resourceType}${plural}?`,
          body: `You are about to ${this.action.name} ${this.items.length} ${this.resourceType}${plural}:`,
          subscript: `${
            this.action.name === 'remove' ? removeExplanation : null
          }`,
          list: this._makeList(this.items, 'name'),
          action: action.name,
          danger: true,
          reason: `${this.resourceType}.${this.action.name}`,
        });
      } else if (action.name === 'tag') {
        this.$.tagsdialog._openDialog();
      } else if (action.name === 'edit credentials') {
        this.$.credentialsDialog.opened = true;
      } else if (action.name === 'add host') {
        this.$.addhostsDialog.opened = true;
      } else {
        this.performAction(this.action, this.items);
      }
    }
  },

  openEditDialog() {
    this.$.credentialsDialog.opened = true;
  },

  closeDialog() {
    // console.log('closeDialog');
    this.$.credentialsDialog.opened = false;
  },

  closeDialogs() {
    this.$.renameDialog.opened = false;
    this.$.credentialsDialog.opened = false;
    this.$.addhostsDialog.opened = false;
    this.$.cloudRemoveAjaxRequest.opened = false;
  },

  _showDialog(info) {
    const dialog = this.shadowRoot.querySelector('dialog-element');
    if (info) {
      Object.keys(info).forEach(key => {
        dialog[key] = info[key];
      });
    }
    dialog._openDialog();
  },

  performAction(action, items) {
    if (action.name === 'rename') {
      this.$.renameDialog.opened = true;
    } else if (action.name === 'remove') {
      const l = items.length;
      for (let i = 0; i < l; i++) {
        this._removeCloud();
        this.set('items', this.splice('items', 1));
      }
    }
  },

  _removeCloud() {
    const cid = this.cloud.id;
    this.dispatchEvent(
      new CustomEvent('cloud-remove', {
        bubbles: true,
        composed: true,
        detail: {
          cloud: cid,
        },
      })
    );
    this.$.cloudRemoveAjaxRequest.headers['Content-Type'] = 'application/json';
    this.$.cloudRemoveAjaxRequest.headers['Csrf-Token'] = CSRFToken.value;
    this.$.cloudRemoveAjaxRequest.generateRequest();
  },

  handleResponse() {
    this.dispatchEvent(
      new CustomEvent('action-finished', {
        bubbles: true,
        composed: true,
        detail: {
          success: true,
        },
      })
    );

    if (this.$.request && this.$.request.body && this.$.request.body.action)
      this.dispatchEvent(
        new CustomEvent('toast', {
          bubbles: true,
          composed: true,
          detail: {
            msg: `Action: ${this.$.request.body.action} successful`,
            duration: 3000,
          },
        })
      );
  },

  _handleCloudRemovalAjaxResponse() {
    let name = '';
    if (this.cloud && this.cloud.name) name = this.cloud.name;

    if (this.__dataHost.tagName === 'CLOUD-PAGE')
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
          msg: `Cloud ${name} was removed`,
          duration: 3000,
        },
      })
    );
  },

  _handleCloudRemovalAjaxError() {
    this.dispatchEvent(
      new CustomEvent('toast', {
        bubbles: true,
        composed: true,
        detail: {
          msg: `There was an error removing ${this.cloud.name}.`,
          duration: 3000,
        },
      })
    );
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
  },

  _makeList(items, property) {
    return items && items.length ? items.map(item => item[property]) : false;
  },

  _computeCloud() {
    return this.items.length > 0 ? this.items[0] : false;
  },

  _computeNewCloud(cloud) {
    return cloud
      ? {
          name: this.cloud.name,
        }
      : false;
  },

  _computeIsEnabled(enabled) {
    return enabled;
  },

  _computeFormReady(name, newName, sendingData) {
    let formReady = false;
    if (newName && newName !== name) {
      formReady = true;
    }

    if (sendingData) {
      formReady = false;
    }
    return formReady;
  },

  _changeName() {
    this.$.cloudEditAjaxRequest.headers['Content-Type'] = 'application/json';
    this.$.cloudEditAjaxRequest.headers['Csrf-Token'] = CSRFToken.value;
    this.$.cloudEditAjaxRequest.body = {
      new_name: this.newCloud.name,
    };
    this.$.cloudEditAjaxRequest.generateRequest();
    this.set('sendingData', true);
    this.set('opened', false);
  },

  _handleCloudEditAjaxResponse() {
    this.set('sendingData', false);
  },
});
