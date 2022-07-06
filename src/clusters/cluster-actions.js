import { PolymerElement, html } from '@polymer/polymer/polymer-element.js';
import { mixinBehaviors } from '@polymer/polymer/lib/legacy/class.js';
import { MistListActionsBehavior } from '@mistio/mist-list/mist-list-actions-behavior.js';
import '@polymer/paper-dialog/paper-dialog.js';
import '@polymer/paper-input/paper-input.js';
import '@polymer/paper-input/paper-input-error.js';
import '@polymer/paper-input/paper-textarea.js';
import '@polymer/iron-ajax/iron-ajax.js';
import '@mistio/mist-list/mist-list-actions.js';
import '../tags/tags-form.js';
import '../helpers/transfer-ownership.js';
import { CSRFToken } from '../helpers/utils.js';

const CLUSTER_ACTIONS = {
  tag: {
    name: 'tag',
    icon: 'label',
    confirm: true,
    multi: true,
  },
  delete: {
    name: 'delete',
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
};

/* eslint-disable class-methods-use-this */
export default class ClusterActions extends mixinBehaviors(
  [MistListActionsBehavior],
  PolymerElement
) {
  static get template() {
    return html`
      <style include="shared-styles">
        mist-list-actions {
          width: 100%;
        }
      </style>
      <dialog-element id="confirm"></dialog-element>
      <transfer-ownership
      id="ownershipdialog"
        user="[[user]]"
        members="[[_otherMembers(model.membersArray,items.length)]]"
        items="[[items]]"
        type="cluster"
      ></transfer-ownership>
      <tags-form
        id="tagsdialog"
        model="[[model]]"
        items="[[items]]"
        type="[[type]]"
      ></tags-form>
      <slot>
        <mist-list-actions
          id="actions"
          actions="[[actions]]"
        ></mist-list-actions>
      </slot>
      <iron-ajax
        id="request"
        handle-as="json"
        loading="{{loadingData}}"
        on-response="handleResponse"
        on-error="handleError"
      ></iron-ajax>
    `;
  }

  static get properties() {
    return {
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
      type: {
        type: String,
        value: 'cluster',
      },
      inSingleView: {
        type: Boolean,
        reflectToAttribute: true,
      },
    };
  }

  ready() {
    super.ready();
    this.$.request.headers['Content-Type'] = 'application/json';
    this.$.request.headers['Csrf-Token'] = CSRFToken.value;
    this.$.request.method = 'POST';
    this.addEventListener('update', this._updateVisibleActions);
    this.addEventListener('select-action', this.selectAction);
    this.addEventListener('confirmation', this.confirmAction);
    this.addEventListener('transfer-ownership', this.transferOwnership)
  }

  _updateVisibleActions() {
    if (this.$.actions) this.$.actions._updateVisibleActions();
  }

  computeItemActions(cluster) {
    const arr = ['delete', 'tag'];
    if (
      this.model &&
      this.model.org.ownership_enabled &&
      (cluster.owned_by === this.model.user.id || this.model.org.is_owner)
    ) {
      arr.push('transfer-ownership');
    }
    return arr;
  }

  computeActionListDetails(actions) {
    return actions.map(action => CLUSTER_ACTIONS[action]);
  }

  selectAction(e) {
    if (this.items.length > 0) {
      const action = e.detail.action;
      this.set('action', action);
      if (action.confirm && action.name !== 'tag') {
        // for now we have only delete but more actions may be added
        const property = ['zone'].indexOf(this.type) === -1 ? 'name' : 'domain';
        const plural = this.items.length === 1 ? '' : 's';
        const count = this.items.length > 1 ? `${this.items.length} ` : '';
        this._showDialog({
          title: `${this.action.name} ${count}${this.type}${plural}?`,
          body: `You are about to ${this.action.name} ${this.items.length} ${this.type}${plural}:`,
          list: this._makeList(this.items, property),
          action: action.name,
          danger: true,
          reason: `${this.type}.${this.action.name}`,
        });
      } else if (action.name === 'tag') {
        this.$.tagsdialog._openDialog();
      } else if (action.name === 'transfer ownership') {
        this.$.ownershipdialog._openDialog();
      } else {
        this.performAction(this.action, this.items);
      }
    }
  }

  confirmAction(e) {
    if (e.detail.confirmed) this.performAction(this.action, this.items);
  }

  _showDialog(info) {
    const dialog = this.shadowRoot.querySelector('dialog-element');
    if (info) {
      Object.keys(info || {}).forEach(i => {
        dialog[i] = info[i];
      });
    }
    dialog._openDialog();
  }

  performAction(action) {
    if (action.name === 'delete') {
      this._delete();
    }
  }

  _delete() {
    this.$.request.headers['Content-Type'] = 'application/json';
    this.$.request.headers['Csrf-Token'] = CSRFToken.value;
    this.$.request.method = 'DELETE';
    for (let i = 0; i < this.items.length; i++) {
      this.$.request.url = `/api/v2/clusters/${this.items[i].id}`;
      this.$.request.generateRequest();
      this.dispatchEvent(
        new CustomEvent('toast', {
          bubbles: true,
          composed: true,
          detail: { msg: `Deleting ${this.items[i].name}`, duration: 1000 },
        })
      );
    }
  }

  transferOwnership(e) {
    const payload = {
      user_id: e.detail.user_id, // new owner
      resources: {},
    };
    payload.resources.cluster = this.items.map(i => i.id);
    console.log('transferOwnership', e.detail, payload);
    this.$.request.url = '/api/v1/ownership';
    this.$.request.headers['Content-Type'] = 'application/json';
    this.$.request.headers['Csrf-Token'] = CSRFToken.value;
    this.$.request.method = 'POST';
    this.$.request.body = payload;
    this.$.request.generateRequest();
  }

  handleResponse(e) {
    this.dispatchEvent(
      new CustomEvent('action-finished', {
        bubbles: true,
        composed: true,
        detail: { success: true },
      })
    );

    if (this.$.request && this.$.request.body && this.$.request.body.action) {
      this.dispatchEvent(
        new CustomEvent('toast', {
          bubbles: true,
          composed: true,
          detail: {
            msg: `Action: ${this.$.request.body.action || 'ownership transfer'} successful`,
            duration: 3000,
          },
        })
      );
    } else if (this.$.request && !this.$.request.body) {
      this.dispatchEvent(
        new CustomEvent('go-to', {
          bubbles: true,
          composed: true,
          detail: { url: '/clusters' },
        })
      );
    }
    if (
      e.detail.xhr.responseURL.endsWith('api/v1/ownership') &&
      e.detail.xhr.status === 200
    ) {
      this.$.ownershipdialog._closeDialog();
      this.dispatchEvent(new CustomEvent('action-finished'));
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
  }

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
  }

  _makeList(items, property) {
    return items && items.length && items.map(item => item[property]);
  }

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
  }
}

customElements.define('cluster-actions', ClusterActions);
