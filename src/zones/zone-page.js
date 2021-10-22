import '@polymer/polymer/polymer-legacy.js';
import '@polymer/paper-button/paper-button.js';
import '@polymer/paper-styles/typography.js';
import '@polymer/paper-spinner/paper-spinner.js';
import '@polymer/paper-fab/paper-fab.js';
import '@polymer/app-route/app-location.js';
import '@mistio/mist-list/mist-list.js';
import '../tags/tags-list.js';
import '../mist-rules/mist-rules.js';
import { mistRulesBehavior } from '../helpers/mist-rules-behavior.js';
import { mistLogsBehavior } from '../helpers/mist-logs-behavior.js';
import '../helpers/dialog-element.js';
import { mistLoadingBehavior } from '../helpers/mist-loading-behavior.js';
import { mistListsBehavior } from '../helpers/mist-lists-behavior.js';
import './zone-actions.js';
import './record-create.js';
import './record-actions.js';
import { CSRFToken, itemUid } from '../helpers/utils.js';
import { Polymer } from '@polymer/polymer/lib/legacy/polymer-fn.js';
import { html } from '@polymer/polymer/lib/utils/html-tag.js';

Polymer({
  _template: html`
    <style include="shared-styles single-page tags-and-labels">
      [hidden] {
        display: none !important;
      }

      paper-material {
        display: block;
        padding: 20px;
      }

      .flex-horizontal-with-ratios {
        @apply --layout-horizontal;
      }

      .flexchild {
        @apply --layout-flex;
      }

      #content {
        -webkit-overflow-scrolling: touch;
      }
      .id {
        word-break: break-all;
      }

      h4.id {
        display: inline-block;
        text-transform: uppercase;
        font-size: 0.9rem;
        font-weight: 700;
        margin-top: 8px;
        margin-bottom: 8px;
      }
      span.id {
        word-break: break-all;
      }
      .resource-info {
        padding-right: 36px;
        display: inline-block;
        padding-bottom: 24px;
      }

      .tag {
        padding: 0.5em;
        display: inline-block;
        vertical-align: middle;
      }

      .notify {
        text-align: center;
        margin: auto;
      }

      mist-list {
        padding: 0;
        width: 100%;
        min-height: 200px;
      }
      .single-head {
        @apply --zone-page-head-mixin;
      }
      zone-actions {
        width: 50%;
      }
    </style>
    <app-location route="{{route}}"></app-location>
    <div id="content">
      <div hidden$="[[_computeAddRecordPageActive(route.path)]]">
        <paper-material class="single-head layout horizontal">
          <span class="icon"
            ><iron-icon icon="[[section.icon]]"></iron-icon
          ></span>
          <div class="title flex">
            <h2>[[zone.domain]]</h2>
            <div class="subtitle">[[zoneCloud]]</div>
          </div>
          <zone-actions
            items="[[itemArray]]"
            actions="{{actions}}"
            members="[[model.membersArray]]"
            user="[[model.user.id]]"
            org="[[model.org]]"
          ></zone-actions>
        </paper-material>
        <paper-material>
          <div class="missing" hidden$="[[!isMissing]]">Zone not found.</div>
          <div class="resource-info">
            <h4 class="id">Zone ID:</h4>
            <span class="id">[[zone.id]]</span>
          </div>
          <div class="resource-info" hidden$="[[!zone.owned_by.length]]">
            <h4 class="id">Owner:</h4>
            <span class="id">
              <a href$="/members/[[zone.owned_by]]"
                >[[_displayUser(zone.owned_by,model.members)]]</a
              ></span
            >
          </div>
          <div class="resource-info" hidden$="[[!zone.created_by.length]]">
            <h4 class="id">Created by:</h4>
            <span class="id">
              <a href$="/members/[[zone.owned_by]]"
                >[[_displayUser(zone.created_by,model.members)]]</a
              ></span
            >
          </div>
          <template is="dom-if" if="[[zoneTags.length]]">
            <div class="resource-info">
              <h4 class="id tags">Tags</h4>
              <template is="dom-repeat" items="[[zoneTags]]">
                <span class="id tag"
                  >[[item.key]]<span hidden="[[!item.value]]"
                    >=[[item.value]]</span
                  ></span
                >
              </template>
            </div>
          </template>
        </paper-material>
        <paper-material>
          <h4 class="id">Zone Info</h4>
          <div class="info-table">
            <div class="info-body info-group">
              <div class="info-item flex-horizontal-with-ratios">
                <div class="flexchild">Domain</div>
                <div id="domain-name" class="flexchild">[[zone.domain]]</div>
              </div>
              <div class="info-item flex-horizontal-with-ratios">
                <div class="flexchild">ID</div>
                <div class="flexchild id">[[zone.id]]</div>
              </div>
              <div class="info-item flex-horizontal-with-ratios">
                <div class="flexchild">Provider</div>
                <div class="flexchild">[[zone.provider]]</div>
              </div>
              <div class="info-item flex-horizontal-with-ratios">
                <div class="flexchild">Type</div>
                <div class="flexchild">[[zone.zone_type]]</div>
              </div>
              <div class="info-item flex-horizontal-with-ratios">
                <div class="flexchild">TTL</div>
                <div class="flexchild">[[zone.ttl]]</div>
              </div>
              <div class="info-item flex-horizontal-with-ratios">
                <div class="flexchild">Records</div>
                <div class="flexchild">
                  [[_computeRecordsLength(zone.records)]]
                </div>
              </div>
            </div>
          </div>
        </paper-material>
        <paper-material hidden$="[[!hasRecords]]">
          <h4 class="id">Records</h4>
          <template is="dom-if" if="[[renderRecordsList]]" restamp="">
            <record-actions
              id="actions"
              items="[[selectedRecordItems]]"
              actions="{{recordActions}}"
              cloud="[[zone.cloud]]"
            >
              <mist-list
                id="recordsList"
                selectable=""
                column-menu=""
                multi-sort=""
                resizable=""
                items="[[zoneRecords]]"
                name="Records"
                selected-items="{{selectedRecordItems}}"
                frozen="[[_getFrozenLogColumn()]]"
                visible="[[_getVisibleColumns()]]"
                renderers="[[_getRenderers()]]"
                actions="[[recordActions]]"
              >
              </mist-list>
            </record-actions>
          </template>
        </paper-material>
        <br />
        <paper-material class="no-pad">
          <mist-rules
            id="zoneRules"
            resource-type="zone"
            incidents="[[model.incidentsArray]]"
            rules="[[_rulesApplyOnResource(model.rules, zone, zone.tags.*, 'zone')]]"
            teams="[[model.teamsArray]]"
            users="[[model.membersArray]]"
            resource="[[zone]]"
            model="[[model]]"
            collapsible=""
          ></mist-rules>
        </paper-material>
        <br />
        <paper-material class="no-pad">
          <template is="dom-if" if="[[zone]]" restamp="">
            <mist-list
              id="zoneLogs"
              frozen="[[_getFrozenLogColumn()]]"
              visible="[[_getVisibleColumns()]]"
              renderers="[[_getRenderers(model.members)]]"
              auto-hide=""
              timeseries=""
              expands=""
              column-menu=""
              searchable=""
              streaming=""
              infinite=""
              toolbar=""
              rest=""
              apiurl="/api/v1/logs"
              name="zone logs"
              primary-field-name="time"
              base-filter="[[zone.id]]"
            ></mist-list>
          </template>
        </paper-material>
        <div class="absolute-bottom-right">
          <paper-fab
            id="addRecord"
            icon="add"
            on-tap="_fabAction"
            hidden$="[[!section.add]]"
          ></paper-fab>
        </div>
      </div>
      <record-create
        model="[[model]]"
        section="[[recordsSections]]"
        zone="[[zone]]"
        hidden$="[[!_computeAddRecordPageActive(route.path)]]"
      ></record-create>
    </div>
    <iron-ajax
      id="zoneDeleteAjaxRequest"
      url="/api/v1/clouds/[[zone.cloud]]/zones/[[zone.id]]"
      method="DELETE"
      on-response="_handleZoneDeleteAjaxResponse"
      on-error="_handleZoneDeleteAjaxError"
    ></iron-ajax>
    <dialog-element class="zone-dialog"></dialog-element>
    <tags-list model="[[model]]"></tags-list>
  `,

  is: 'zone-page',

  behaviors: [
    mistListsBehavior,
    mistLoadingBehavior,
    mistLogsBehavior,
    mistRulesBehavior,
  ],

  properties: {
    model: {
      type: Object,
      notify: true,
    },
    section: {
      type: Object,
    },
    zone: {
      type: Object,
    },
    recordsSections: {
      type: Object,
      value() {
        return {
          id: 'records',
          color: '#3F51B5',
          icon: 'icons:dns',
          q: '',
        };
      },
    },
    hasRecords: {
      type: Boolean,
      computed: '_computeHasRecords(zone.records)',
    },
    isLoading: {
      type: Boolean,
      computed: '_computeIsloading(zone)',
      value: true,
    },
    zoneCloud: {
      type: String,
      computed: '_computeZoneCloud(zone, model.clouds)',
    },
    zoneTags: {
      type: Array,
      computed: '_computeZoneTags(zone, zone.tags, zone.tags.*, model.zones.*)',
    },
    zoneRecords: {
      type: Array,
      computed:
        '_computeRecords(zone, zone.records, zone.records.*, model.zones, model.zones.*)',
    },
    tagsExist: {
      type: Boolean,
      computed: '_computeTagsExist(zone, zone.tags.*)',
      value: false,
    },
    itemsfortags: {
      type: Array,
      computed: 'computeTagItems(zone)',
    },
    actions: {
      type: Array,
      notify: true,
    },
    recordActions: {
      type: Array,
      notify: true,
    },
    selectedRecordItems: {
      type: Array,
      notify: true,
    },
    itemArray: Array,
    renderRecordsList: {
      type: Boolean,
      value: false,
    },
  },

  observers: ['_changed(zone.*)'],

  listeners: {
    'action-finished': 'clearListSelection',
  },

  _changed() {
    if (this.zone) {
      this.set('itemArray', [this.zone]);
      this.set('renderRecordsList', this.zone.id && this.zone.records);
    }
  },

  clearListSelection() {
    this.set('selectedItems', []);
  },

  attached() {
    this.async(() => {
      if (this.$.recordsList) this.$.recordsList.fire('resize');
    }, 500);
  },

  _computeHasRecords(records) {
    if (this.$.recordsList) this.$.recordsList.fire('resize');
    return records && Object.keys(records).length;
  },

  _computeZoneCloud(zone) {
    if (zone) return this.model.clouds[this.zone.cloud].title;
    return null;
  },

  _computeZoneTags() {
    if (this.zone) {
      return Object.entries(this.zone.tags).map(([key, value]) => ({
        key,
        value,
      }));
    }
    return null;
  },

  _computeRecordsLength(records) {
    return records ? Object.keys(records).length : 0;
  },

  _computeRecords() {
    if (this.zone) {
      return Object.values(this.zone.records);
    }
    return null;
  },

  _editZone(e) {
    console.log(e);
  },

  _displayUser(id, members) {
    if (id && members) {
      return this.model && this.model.members && this.model.members[id]
        ? this.model.members[id].name ||
            this.model.members[id].email ||
            this.model.members[id].username
        : '';
    }
    return null;
  },

  // _editTags: function() {
  //     var el = this.shadowRoot.querySelector('tags-list'),
  //     items = [];
  //     items.push(itemUid(this.zone, this.section));
  //     el.items = items;
  //     el._openDialog();
  // },
  // _deleteZone: function(e) {
  //     if (['Route53','Google'].indexOf(this.zone.provider) > -1 && this.zone.records.length > 2) {
  //         this._showDialog({
  //             title: 'Zone can not be deleted.',
  //             body: "This zone cannot be deleted because it contains non-required (A, AAAA, CNAME, MX, TXT) records. Please delete these records in order to proceed.",
  //             type: 'not',
  //         })
  //     } else {
  //         this._showDialog({
  //             title: 'Delete Zone?',
  //             body: "Deleting zones cannot be undone. You are about to delete zone: '" + this.zone.domain + "'.",
  //             danger: true,
  //             type: 'isYesNo',
  //             reason: "zone.delete"
  //         });
  //     }
  // },
  _fabAction() {
    if (this.zone) {
      this.dispatchEvent(
        new CustomEvent('go-to', {
          bubbles: true,
          composed: true,
          detail: { url: `zones/${this.zone.id}/+create` },
        })
      );
    }
  },

  _handleZoneDeleteAjaxResponse() {
    this.dispatchEvent(
      new CustomEvent('toast', {
        bubbles: true,
        composed: true,
        detail: { msg: 'Delete was successful.', duration: 3000 },
      })
    );

    this.dispatchEvent(
      new CustomEvent('go-to', {
        bubbles: true,
        composed: true,
        detail: { url: '/zones' },
      })
    );
  },

  _handleZoneDeleteAjaxError(e) {
    this.dispatchEvent(
      new CustomEvent('toast', {
        bubbles: true,
        composed: true,
        detail: { msg: e.detail.response, duration: 3000 },
      })
    );
  },

  _computeTagsExist() {
    if (
      this.zone &&
      this.zone.tags &&
      this.zone.tags.length > 0 &&
      this.zone.tags[0] &&
      this.zone.tags[0].key &&
      this.zone.tags[0].key !== ''
    ) {
      return true;
    }
    return false;
  },

  computeTagItems(zone) {
    if (zone) {
      const arr = [];
      const item = itemUid(zone, this.section);
      arr.push(item);
      return arr;
    }
    return null;
  },

  _addResource() {
    this.dispatchEvent(
      new CustomEvent('go-to', {
        bubbles: true,
        composed: true,
        detail: { url: this.model.sections.zones.add },
      })
    );
  },

  _getFrozenLogColumn() {
    return ['name'];
  },

  _getVisibleColumns() {
    return ['type', 'id', 'ttl', 'rdata'];
  },

  _getRenderers() {
    return {
      name: {
        body: item => {
          return `<strong class="name">${item}</strong>`;
        },
      },
      rdata: {
        body: item => {
          return item && Array.isArray(item) ? item.join(', ') : item;
        },
      },
      type: {
        title: 'record type',
        body: item => {
          return item;
        },
      },
      tags: {
        body: item => {
          const tags = item;
          let display = '';
          if (tags) {
            Object.keys(tags).forEach(key => {
              display += `<span class='tag'>${key}`;
              if (tags[key] !== undefined && tags[key] !== '')
                display += `=${tags[key]}`;
              display += '</span>';
            });
          }
          return display;
        },
      },
    };
  },

  _showDialog(info) {
    const dialog = this.shadowRoot.querySelector('.zone-dialog');
    Object.keys(info).forEach(i => {
      dialog[i] = info[i];
    });
    dialog._openDialog();
  },

  _computeIsloading() {
    return !this.zone;
  },

  _computeAddRecordPageActive(path) {
    return path.endsWith('/+create');
  },
});
