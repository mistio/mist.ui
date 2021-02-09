import dayjs from 'dayjs/esm/index.js';
import utc from 'dayjs/esm/plugin/utc';
import { Polymer } from '@polymer/polymer/polymer-legacy';
import '@polymer/paper-material/paper-material.js';
import '@mistio/mist-list/mist-list.js';
import { html } from '@polymer/polymer/lib/utils/html-tag.js';
import '../teams/team-page.js';

dayjs.extend(utc);

Polymer({
  _template: html`
    <style include="shared-styles tags-and-labels info-table-style single-page">
      .left,
      .right {
        @apply --layout-vertical;
        align-items: flex-start;
        flex-direction: column;
        flex: 1 100%;
      }

      .row {
        display: table-row;
      }

      .cell {
        display: table-cell;
        font-size: 0.9em;
      }

      .cell h4 {
        text-transform: uppercase;
        font-weight: bold;
        font-size: 0.8em;
        display: inline-block;
        width: 90px;
        opacity: 0.54;
        margin: 0;
      }

      #rightcolumn .m-info-head {
        width: 100%;
      }

      paper-material {
        padding: 24px;
        box-sizing: border-box;
        width: 100%;
      }

      paper-material > h2 {
        line-height: initial !important;
        margin-bottom: 5px;
        cursor: pointer;
      }

      .objectstorage-page-head {
        @apply --objectstorage-page-head-mixin;
      }

      iron-icon.icon {
        padding: 3px;
        box-sizing: border-box;
      }
    </style>
    <div id="content">
      <paper-material
        class="single-head layout horizontal objectstorage-page-head"
      >
        <span class="icon">
          <iron-icon icon="[[section.icon]]"></iron-icon>
        </span>
        <div class="title flex">
          <h2>[[storage.name]]</h2>
          <div class="subtitle">[[storage.cloud_title]] [[storage.region]]</div>
        </div>
      </paper-material>
      <div class="columns">
        <paper-material id="leftcolumn" class="left resource-description">
          <div class="resource-info">
            <div class="table">
              <div class="row" hidden$="[[!storage.cloud]]">
                <div class="cell">
                  <h4>Cloud:</h4>
                </div>
                <div class="cell">
                  <iron-icon
                    class="cloud icon"
                    src$="[[_computeCloudIcon(storage.provider)]]"
                  ></iron-icon>
                  <span>[[storage.cloud_title]]</span>
                </div>
              </div>
              <div class="row" hidden$="[[!storage.region]]">
                <div class="cell">
                  <h4>Region:</h4>
                </div>
                <div class="cell">
                  <span>[[storage.region]]</span>
                </div>
              </div>
              <div class="row" hidden$="[[!storage.owner]]">
                <div class="cell">
                  <h4>Owner:</h4>
                </div>
                <div class="cell">
                  <span>[[storage.owner]]</span>
                </div>
              </div>
            </div>
          </div>
        </paper-material>
      </div>
      <paper-material>
        <mist-list
          selectable
          resizable
          apiurl="/api/v1/objectstorage"
          id="filesList"
          name="Files"
          visible="[[_getVisibleColumns()]]"
          renderers="[[_getRenderers()]]"
          item-map="[[currentDirContent]]"
          primary-field-name="id"
          sorters="[[sorters]]"
          on-active-item-changed="_activeItemChanged"
        >
          <p slot="no-items-found">The storage is empty</p>
        </mist-list>
      </paper-material>
    </div>
    <iron-ajax
      auto
      id="getStorageDataRequest"
      url="/api/v1/objectstorage/[[storage.id]]"
      on-response="handleGetStorageDataResponse"
      on-error="handleError"
    ></iron-ajax>
  `,

  is: 'objectstorage-page',

  behaviors: [],
  properties: {
    storage: {
      type: Object,
    },
    section: {
      type: Object,
    },
    currentPath: {
      type: String,
      value: '',
    },
    currentDirContent: {
      type: Object,
      value: {},
    },
    data: {
      type: Object,
      value: {},
    },
    clickedItem: {
      type: String,
    },
    sorters: {
      type: Array,
      value() {
        return [['name', 'asc']];
      },
    },
  },

  ready() {
    this.$.filesList.$.grid.addEventListener('active-item-changed', e =>
      this._activeItemChanged(e)
    );
  },

  observers: ['_currentPathChanged(currentPath, data)'],

  handleGetStorageDataResponse(response) {
    const data = response.detail.response;
    this.set('data', data.content);
  },

  _activeItemChanged(e) {
    const grid = e.target;
    this.clickedItem =
      grid && grid.activeItem ? grid.activeItem : this.clickedItem;

    if (this.clickedItem.type === 'folder') {
      if (this.clickedItem.name === '..') {
        const path = this.currentPath.split(/(?<=\/)/); // split into array where the items have trailing slash e.g: ['aaa/', 'bbb/', 'ccc/']
        path.pop();
        this.currentPath = path.join('');
      } else {
        this.currentPath += `${this.clickedItem.name}/`;
      }
    }
  },

  handleError(error) {
    console.error('error while getting object storage content', error);
  },

  _currentPathChanged(newPath) {
    const content = {};

    if (newPath) {
      content['..'] = {
        name: '..',
        type: 'folder',
      };
    }
    for (const [path, details] of Object.entries(this.data)) {
      if (path.startsWith(this.currentPath) && path !== this.currentPath) {
        const name = path.replace(newPath, '').split('/')[0];
        if (!content[name]) {
          details.name = name;
          content[name] = details;
        }
      }
    }

    this.set('currentDirContent', content);
  },

  _computeItemImage(item) {
    if (item && item.provider) {
      const provider = item.provider.replace('_', '');
      return `assets/providers-large/provider-${provider}.png`;
    }
    return '';
  },

  _getRenderers(_keys) {
    return {
      name: {
        body: (item, _row) => {
          return `<strong class="name">${item.split('/')[0]}</strong>`;
        },
      },
      icon: {
        body: (_item, row) => {
          if (!row.name) return '';
          return `./assets/objectstorage/storage-${row.type}.svg`;
        },
      },
      size: {
        body: (item, _row) => {
          return item ? `${(item / 1024).toFixed(2)} Kb` : '';
        },
      },
      'last modified': {
        body: (_item, row) => {
          if (row.name !== '..') {
            const date = row.extra.last_modified;
            return dayjs.utc(date).local().format();
          }
          return '';
        },
      },
    };
  },

  _getVisibleColumns() {
    return ['name', 'last modified', 'size'];
  },

  _computeCloudIcon(cloud) {
    if (!cloud) {
      return '';
    }
    return `./assets/providers/provider-${cloud.replace(/_/g, '')}.png`;
  },
});
