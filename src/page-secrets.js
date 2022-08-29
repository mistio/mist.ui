import './secrets/secret-page.js';
import './secrets/secret-add.js';
import '@polymer/paper-fab/paper-fab.js';
import { Polymer } from '../node_modules/@polymer/polymer/lib/legacy/polymer-fn.js';
import { html } from '../node_modules/@polymer/polymer/lib/utils/html-tag.js';

Polymer({
  _template: html`
    <style include="shared-styles">
      :host {
        display: block;
      }
      paper-dialog {
        position: fixed !important;
      }
      .pathButtons {
        border: 2px solid transparent;
        font-size: 18px;
        outline: none;
        font: inherit;
        margin-bottom: 9px;
      }
      .pathButtons:hover {
        color: #0275d8;
        text-decoration: underline;
        cursor: pointer;
      }
      #path-container button + button:before {
        content: '▸';
        padding-right: 12px;
        padding-bottom: 4px;
        display: inline-block;
        vertical-align: middle;
      }
    </style>
    <app-route route="{{route}}" pattern="/:secret" data="{{data}}"></app-route>

    <template is="dom-if" if="[[_isListActive(route.path)]]">
      <mist-list
        selectable
        resizable
        column-menu
        multi-sort
        id="secretsList"
        apiurl="/api/v2/secrets"
        data-provider="[[dataProvider]]"
        name="Secrets"
        visible="[[_getVisibleColumns()]]"
        frozen="[[_getFrozenColumn()]]"
        route="{{route}}"
        tree-view
        primary-field-name="id"
        renderers="[[_getRenderers()]]"
        filter-method="[[_ownerFilter()]]"
        actions="[[actions]]"
        item-has-children="[[secretHasChildren]]"
      >
        <p slot="no-items-found">No secrets found.</p>
      </mist-list>
      <div class="absolute-bottom-right">
        <paper-fab id="secretAdd" icon="add" on-tap="_addResource"></paper-fab>
      </div>
    </template>
    <secret-add
      model="[[model]]"
      section="[[model.sections.secrets]]"
      hidden$="[[!_isAddPageActive(route.path)]]"
      path="[[pathItems]]"
    ></secret-add>
    <secret-page
      id="secretPage"
      resource-id="[[_getSecretId(route)]]"
      model="[[model]]"
      section="[[model.sections.secrets]]"
      hidden$="[[!_isSecretPageActive(route.path)]]"
      parent-folder-id="[[parentFolderId]]"
    ></secret-page>
  `,
  is: 'page-secrets',
  behaviors: [],

  properties: {
    model: {
      type: Object,
    },
    secrets: {
      type: Object,
    },
    itemMap: {
      type: Object,
      value: {},
    },
    actions: {
      type: Array,
      value: () => [],
    },
    isListActive: {
      type: Boolean,
      value: true,
    },
    issecretPageActive: {
      type: Boolean,
      value: false,
    },
    isAddPageActive: {
      type: Boolean,
      value: false,
    },
    activeSecret: {
      type: Object,
      value: () => {},
    },
    parentFolderId: {
      type: String,
      value: '0',
    },
    pathItems: {
      type: Array,
      value: [],
    },
    secretHasChildren: {
      type: Object,
      value() {
        return item => item && item.is_dir;
      },
    },
  },
  /* eslint-disable func-names */
  ready() {
    this.dataProvider = function (params, callback) {
      const parentName = params.parentItem ? params.parentItem.name : null;
      const xhr = new XMLHttpRequest();
      let url = '/api/v2/secrets';
      if (!parentName) {
        url += `?search=${encodeURIComponent('name=r"^[^/]*/{0,1}$"')}`;
      } else {
        url += `?search=${encodeURIComponent(
          `name=r"^${parentName}[^/]+/{0,1}$"`
        )}`;
      }
      xhr.open('GET', url);
      xhr.onreadystatechange = function () {
        let items = [];
        let count = 0;
        if (xhr.readyState === 4 && xhr.status === 200) {
          const response = JSON.parse(xhr.responseText);
          items = response.data;
          items.forEach(i => {
            // eslint-disable-next-line no-param-reassign
            i.is_dir = i.name.endsWith('/');
            this.itemMap[i.id] = i;
          });
          count = response.meta.returned;
          callback(items, count);
          window.dispatchEvent(new Event('resize'));
          this.async(() => {
            window.dispatchEvent(new Event('resize'));
          }, 500);
        }
      }.bind(this);
      xhr.send();
    }.bind(this);
  },
  /* eslint-enable func-names */

  _getFrozenColumn() {
    return ['name'];
  },

  _getVisibleColumns() {
    return ['created_by', 'owned_by'];
  },

  /* eslint-disable no-param-reassign */
  _isListActive(path) {
    if (typeof path !== 'string') path = path.path;
    if (path === '' || path.endsWith('/')) return true;
    return false;
  },

  _getSecretId(route) {
    let id = '';
    const grid =
      this.shadowRoot &&
      this.shadowRoot.querySelector('mist-list') &&
      this.shadowRoot.querySelector('mist-list').$.grid;
    if (grid && grid.activeItem) {
      id = grid.activeItem.id;
      this._setSecret(grid.activeItem, null);
    } else {
      id = route.path.slice(1, route.path.length);
      this._setSecret(null, id);
    }
    return id;
  },
  async _setSecret(secret, id) {
    if (!this.$.secretPage) return;
    if (secret) {
      this.$.secretPage.set('secret', secret);
    } else if (id) {
      const response = await (await fetch(`/api/v2/secrets/${id}`)).json();
      secret = response.data;
      this.$.secretPage.set('secret', secret);
    }
  },
  /* eslint-enable no-param-reassign */

  _isSecretPageActive(path) {
    const itemId = path.startsWith('/') ? path.slice(1) : path;
    const ret = itemId && itemId !== '-1' && itemId !== '+add'; // && this.itemMap[itemId] && !this.itemMap[itemId].is_dir;
    if (ret) {
      // this.parentFolderId = this.pathItems[this.pathItems.length-1].id;
    }
    return ret;
  },

  _isAddPageActive(path) {
    return path === '/+add';
  },

  _addResource() {
    this.dispatchEvent(
      new CustomEvent('go-to', {
        bubbles: true,
        composed: true,
        detail: {
          url: this.model.sections.secrets.add,
        },
      })
    );
  },

  _getRenderers() {
    return {
      name: {
        body: (item, _row) => {
          const path = item.split('/');
          const name =
            path.slice(-1)[0] === ''
              ? `${path.slice(-2)[0]}/`
              : path.slice(-1)[0];
          return `<strong class="name">${name}</strong>`;
        },
        cmp: (row1, row2) => {
          if (row1.is_dir && !row2.is_dir) return -1;
          if (!row1.is_dir && row2.is_dir) return 1;
          return row1.name.localeCompare(row2.name, 'en', {
            sensitivity: 'base',
          });
        },
      },
      id: {
        body: (item, _row) => {
          if (item === '-1') return '';
          return item;
        },
      },
      icon: {
        body: (item, _row) => {
          if (item.id === '-1') return '';
          if (item.is_dir) return 'folder';
          return 'lock';
        },
      },
      owned_by: {
        title: (_item, _row) => 'owner',
        body: (item, _row) =>
          this.model.members[item]
            ? this.model.members[item].name ||
              this.model.members[item].email ||
              this.model.members[item].username
            : '',
      },
      created_by: {
        title: (_item, _row) => 'created by',
        body: (item, _row) =>
          this.model.members[item]
            ? this.model.members[item].name ||
              this.model.members[item].email ||
              this.model.members[item].username
            : '',
      },
    };
  },
});
