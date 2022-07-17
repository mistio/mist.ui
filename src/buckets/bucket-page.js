import dayjs from 'dayjs/esm/index.js';
import utc from 'dayjs/esm/plugin/utc';
import { Polymer } from '@polymer/polymer/polymer-legacy';
import '@polymer/paper-material/paper-material.js';
import '@mistio/mist-list/mist-list.js';
import { html } from '@polymer/polymer/lib/utils/html-tag.js';
import bucketsDataProvider from "./buckets-data-provider.js";
import '../teams/team-page.js';
import '@polymer/paper-spinner/paper-spinner.js';

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

      .buckets-page-head {
        @apply --buckets-page-head-mixin;
      }

      iron-icon.icon {
        padding: 3px;
        box-sizing: border-box;
      }
      paper-spinner {
        padding: 5px;
      }
    </style>
    <div id="content">
      <paper-material class="single-head layout horizontal buckets-page-head">
        <span class="icon">
          <iron-icon icon="[[section.icon]]"></iron-icon>
        </span>
        <div class="title flex">
          <h2>[[bucket.name]]</h2>
          <div class="subtitle">[[bucket.cloud_title]] [[bucket.region]]</div>
        </div>
      </paper-material>
      <div class="columns">
        <paper-material id="leftcolumn" class="left resource-description">
          <div class="resource-info">
            <div class="table">
              <div class="row" hidden$="[[!bucket.cloud]]">
                <div class="cell">
                  <h4>Cloud:</h4>
                </div>
                <div class="cell">
                  <iron-icon
                    class="cloud icon"
                    src$="[[_computeCloudIcon(bucket.provider)]]"
                  ></iron-icon>
                  <span>[[bucket.cloud_title]]</span>
                </div>
              </div>
              <div class="row" hidden$="[[!bucket.region]]">
                <div class="cell">
                  <h4>Region:</h4>
                </div>
                <div class="cell">
                  <span>[[bucket.region]]</span>
                </div>
              </div>
              <div class="row" hidden$="[[!bucket.owner]]">
                <div class="cell">
                  <h4>Owner:</h4>
                </div>
                <div class="cell">
                  <span>[[bucket.owner]]</span>
                </div>
              </div>
            </div>
          </div>
        </paper-material>
      </div>
      <paper-material class="layout vertical">
        <mist-list
          selectable
          resizable
          apiurl="/api/v1/buckets"
          id="filesList"
          name="Files"
          frozen="[[_getFrozenColumns()]]"
          visible="[[_getVisibleColumns()]]"
          renderers="[[_getRenderers()]]"
          item-map=""
          primary-field-name="name"
          sorters="[[sorters]]"
          tree-view=""
          data-provider="[[dataProvider]]"
          item-has-children="[[hasChildren]]"
        >
          <p slot="no-items-found">The bucket is empty</p>
        </mist-list>
        <paper-spinner active="[[loading]]" hidden="[[!loading]]"></paper-spinner>
      </paper-material>
    </div>
  `,

  is: 'bucket-page',

  behaviors: [],
  properties: {
    bucket: {
      type: Object,
    },
    section: {
      type: Object,
    },
    sorters: {
      type: Array,
      value() {
        return [['name', 'asc']];
      },
    },
    dataProvider: {
      type: Object,
      value() {
        return bucketsDataProvider.bind(this);
      }
    },
    loading: {
      type: Boolean,
      value: true
    }
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
          return `<strong class="name">${item}</strong>`;
        },
      },
      icon: {
        body: (_item, row) => {
          if(row.name.slice(-1) === '/')
            return '/ui/assets/buckets/bucket-folder.svg';
          return '/ui/assets/buckets/bucket-file.svg'
        },
      },
      size: {
        body: (item, _row) => {
          return item ? `${(item / 1024).toFixed(2)} Kb` : '';
        },
      },
      last_modified: {
        title: () => {
          return 'last modified';
        },
        body: (_item, row) => {
          if (row.type !== 'folder') {
            const date = row.extra.last_modified;
            return dayjs.utc(date).local().format();
          }
          return '';
        },
      }
    };
  },

  _getFrozenColumns() {
    return ['name'];
  },

  _getVisibleColumns() {
    return ['size', 'last_modified'];
  },
  hasChildren(item) {
    return item.name.slice(-1) === "/";
  },

  _computeCloudIcon(cloud) {
    if (!cloud) {
      return '';
    }
    return `./assets/providers/provider-${cloud.replace(/_/g, '')}.png`;
  }
});
