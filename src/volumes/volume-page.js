import '../../node_modules/@polymer/polymer/polymer-legacy.js';
import '../../node_modules/@polymer/paper-button/paper-button.js';
import '../../node_modules/@polymer/paper-styles/typography.js';
import '../../node_modules/@polymer/paper-spinner/paper-spinner.js';
import '../../node_modules/@mistio/mist-list/mist-list.js';
import '../mist-rules/mist-rules.js';
import { mistLogsBehavior } from '../helpers/mist-logs-behavior.js';
import { mistRulesBehavior } from '../helpers/mist-rules-behavior.js';
import '../helpers/dialog-element.js';
import { mistLoadingBehavior } from '../helpers/mist-loading-behavior.js';
import '../element-for-in/element-for-in.js';
import './volume-actions.js';
import { Polymer } from '../../node_modules/@polymer/polymer/lib/legacy/polymer-fn.js';
import { html } from '../../node_modules/@polymer/polymer/lib/utils/html-tag.js';

Polymer({
  _template: html`
    <style include="shared-styles tags-and-labels single-page">
      paper-material {
        display: block;
        padding: 20px;
      }

      .columns {
        @apply --layout-horizontal;
        flex: 1 100%;
      }

      .pad-bot {
        margin-bottom: 16px;
      }

      .columns paper-material > .break {
        word-break: break-all;
      }

      .left,
      .right {
        @apply --layout-vertical;
        align-items: flex-start;
        flex-direction: column;
        flex: 1 100%;
      }

      .left h3,
      .right h3 {
        margin-bottom: 0;
      }

      paper-menu-button paper-button {
        display: block;
      }

      .flex-horizontal-with-ratios {
        @apply --layout-horizontal;
      }

      .flexchild {
        @apply --layout-flex;
      }

      .command-container {
        background-color: #444;
        color: #fff;
        font-family: monospace;
        padding: 10px;
      }

      a {
        color: black;
        text-decoration: none;
      }

      .paper-header [paper-drawer-toggle] {
        margin-left: 10px;
      }

      .paper-header {
        display: flex;
        flex-direction: row;
      }

      .paper-header {
        height: 60px;
        font-size: 24px;
        line-height: 60px;
        padding: 0 10px;
        color: white;
        transition: height 0.2s;
        transition: font-size 0.2s;
      }

      .paper-header.tall {
        height: 320px;
        font-size: 16px;
      }

      .paper-header h2 {
        margin-left: 20px;
        display: flex;
        flex-direction: row;
        text-transform: capitalize;
      }

      .paper-header .toggleViewButton {
        --paper-icon-button-ink-color: transparent;
      }

      .paper-header .cartButton {
        margin-right: 10px;
      }

      #content {
        -webkit-overflow-scrolling: touch;
      }

      paper-icon-button {
        transition: all 200ms;
      }

      .n-info-head {
        text-transform: uppercase;
        font-weight: bold;
        font-size: 0.8em;
        display: inline-block;
        width: 100px;
        opacity: 0.54;
        margin: 0;
      }

      #rightcolumn .n-info-head {
        width: 100%;
      }

      paper-icon-bottom.bottom {
        padding-right: 8px;
      }

      :host .info-item,
      :host ::slotted(.info-item) {
        word-break: break-all;
      }

      .single-head {
        @apply --volume-page-head-mixin;
      }

      volume-actions {
        width: 50%;
      }

      mist-list {
        width: 100%;
        padding: 0;
        margin: 0;
        height: 600px;
        font-size: 75%;
        --row-height: 48px;
      }
    </style>
    <div id="content">
      <paper-material class="single-head layout horizontal">
        <span class="icon">
          <iron-icon icon="[[section.icon]]"></iron-icon>
        </span>
        <div class="title flex">
          <h2>[[_getVolumeNameOrExternalId(volume)]]</h2>
          <div class="subtitle">
            [[volumeCloud.title]],
            [[_computeLocationsName(model,volumeCloud,volume,volume.location)]]
          </div>
        </div>
        <volume-actions
          items="[[itemArray]]"
          user="[[model.user.id]]"
          members="[[model.membersArray]]"
          org="[[model.org]]"
          machines="[[_computeVolumeMachines(volume.attached_to.*,model.machines)]]"
          machines-to-attach-to="[[machinesVolumeCanAttachTo]]"
          provider="[[_computeVolumeProvider(volume,model.clouds)]]"
          in-single-view=""
        ></volume-actions>
      </paper-material>
      <div class="columns pad-bot">
        <paper-material id="leftcolumn resource-description" class="left">
          <div class="missing" hidden$="[[!isMissing]]">Volume not found.</div>
          <div hidden$="[[isMissing]]">
            <div hidden$="[[!volume.state]]">
              <h4 class="id n-info-head">State:</h4>
              <span class="id">[[volume.state]]</span>
            </div>
            <div>
              <h4 class="id n-info-head">Size:</h4>
              <span class="id">[[volume.size]]</span>
            </div>
            <div>
              <h4 class="id n-info-head">Volume ID:</h4>
              <span class="id">[[volume.id]]</span>
            </div>
            <div hidden$="[[!volume.owned_by.length]]">
              <h4 class="id n-info-head">Owner:</h4>
              <span class="id"
                ><a href$="/members/[[volume.owned_by]]"
                  >[[_displayUser(volume.owned_by,model.members)]]</a
                ></span
              >
            </div>
            <div hidden$="[[!volume.created_by.length]]">
              <h4 class="id n-info-head">Created by:</h4>
              <span class="id"
                ><a href$="/members/[[volume.created_by]]"
                  >[[_displayUser(volume.created_by,model.members)]]</a
                ></span
              >
            </div>
          </div>
        </paper-material>
        <paper-material id="rightcolumn" class="right">
          <div>
            <h4 class="n-info-head" hidden$="[[!showVolumeMachines]]">
              Attached to machines:
            </h4>
            <template
              is="dom-repeat"
              items="[[_computeVolumeMachines(volume.attached_to.*,model.machines.*)]]"
              as="machine"
            >
              <a class="blue-link" href$="/machines/[[machine.id]]"
                >[[machine.name]]</a
              >
            </template>
          </div>
          <div hidden$="[[!volumeTags.length]]">
            <h4 class="n-info-head">TAGS:</h4>
            <template is="dom-repeat" items="[[volumeTags]]">
              <span class="tag"
                >[[item.key]]<span hidden$="[[!item.value]]">=</span
                >[[item.value]]</span
              >
            </template>
          </div>
        </paper-material>
      </div>
      <div class="pad-bot">
        <paper-material class="no-pad" hidden$="[[!volume.extra]]">
          <h2 class="id n-info-head">More Info</h2>
          <div class="card-content" hidden$="[[isMissing]]">
            <element-for-in content="[[volume.extra]]"></element-for-in>
          </div>
        </paper-material>
      </div>
      <div class="pad-bot">
        <paper-material class="no-pad">
          <mist-rules
            id="volumeRules"
            cloud="[[volume.cloud]]"
            incidents="[[model.incidentsArray]]"
            rules="[[_rulesApplyOnResource(model.rules, volume, volumeTags.length, 'volume')]]"
            teams="[[model.teamsArray]]"
            users="[[model.membersArray]]"
            resource="[[volume]]"
            resource-type="volume"
            model="[[model]]"
            collapsible=""
          ></mist-rules>
        </paper-material>
      </div>
      <div class="pad-bot">
        <paper-material class="no-pad">
          <template is="dom-if" if="[[volume]]" restamp="">
            <mist-list
              id="volumeLogs"
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
              name="volume logs"
              primary-field-name="time"
              base-filter="[[volume.id]]"
            ></mist-list>
          </template>
        </paper-material>
      </div>
    </div>
    <iron-ajax
      id="volumeDeleteAjaxRequest"
      url="/api/v1/clouds/[[volume.cloud]]/volumes/[[volume.id]]"
      method="DELETE"
      on-response="_handleVolumeDeletekAjaxResponse"
    ></iron-ajax>
    <dialog-element></dialog-element>
  `,

  is: 'volume-page',

  behaviors: [mistLoadingBehavior, mistLogsBehavior, mistRulesBehavior],

  properties: {
    model: {
      type: Object,
    },
    section: {
      type: Object,
    },
    volume: {
      type: Object,
    },
    volumeTags: {
      type: Array,
      computed:
        '_computeVolumeTags(volume, volume.tags, volume.tags.*, model.volumes.*)',
    },
    isLoading: {
      type: Boolean,
      computed: '_computeIsloading(volume)',
      value: true,
    },
    volumeCloud: {
      type: Object,
      computed: '_computeVolumeCloud(volume, model.clouds)',
    },
    machinesVolumeCanAttachTo: {
      type: Array,
      computed: '_computedMachinesVolumeCanAttachTo(volume, model.machines)',
    },
    itemArray: {
      type: Array,
    },
    showVolumeMachines: {
      type: Boolean,
      computed:
        '_computeShowVolumeMachines(volume.attached_to.*,model.machines)',
    },
  },

  observers: ['_change(volume)'],

  _displayUser(id) {
    return this.model && id && this.model.members && this.model.members[id]
      ? this.model.members[id].name ||
          this.model.members[id].email ||
          this.model.members[id].username
      : '';
  },

  _change(item) {
    if (item) this.set('itemArray', [this.volume]);
  },

  _computeLocationsName(model, cloud, vol, loc) {
    if (model && cloud && loc && this.volume && this.volume.location) {
      return (
        this.volume &&
        this.model.clouds &&
        this.model.clouds[this.volume.cloud] &&
        this.model.clouds[this.volume.cloud].locations &&
        this.model.clouds[this.volume.cloud].locations[this.volume.location] &&
        this.model.clouds[this.volume.cloud].locations[this.volume.location]
          .name
      );
    }
    return '';
  },

  _computeShowVolumeMachines() {
    if (this.volume) {
      return this.volume.attached_to && this.volume.attached_to.length > 0;
    }
    return false;
  },

  _computeVolumeMachines() {
    if (this.volume) {
      return this.model &&
        this.model.machines &&
        this.volume.attached_to &&
        this.volume.attached_to.length
        ? this.volume.attached_to.map(
            i => this.model.machines[i] || { name: 'missing', id: '#' }
          )
        : [];
    }
    return [];
  },

  _computeVolumeCloud(volume, clouds) {
    if (volume && clouds) {
      return this.model.clouds[this.volume.cloud];
    }
    return {};
  },

  _computeVolumeProvider() {
    if (this.volume) {
      return this.model.clouds[this.volume.cloud].provider;
    }
    return '';
  },

  _computedMachinesVolumeCanAttachTo() {
    if (this.volume) {
      const that = this;
      const machinesArray = this._toArray(
        this.model.clouds[this.volume.cloud].machines
      );
      return machinesArray.filter(m => {
        return (
          m.cloud === that.volume.cloud &&
          (!that.volume.location || m.location === that.volume.location) &&
          that.volume.attached_to.indexOf(m.id) === -1
        );
      });
    }
    return [];
  },

  _computeVolumeTags() {
    if (this.volume) {
      return Object.entries(this.volume.tags).map(([key, value]) => ({
        key,
        value,
      }));
    }
    return null;
  },

  _editVolume(e) {
    console.log(e);
  },

  _deleteVolume() {
    this._showDialog({
      title: 'Delete Volume?',
      body: `Deleting volumes cannot be undone. You are about to delete volume: '${this.volume.name}'.`,
      danger: true,
      reason: 'volume.delete',
    });
  },

  _handleVolumeDeletekAjaxResponse() {
    this.dispatchEvent(
      new CustomEvent('go-to', {
        bubbles: true,
        composed: true,
        detail: {
          url: '/volumes',
        },
      })
    );
  },

  _showDialog(info) {
    const dialog = this.shadowRoot.querySelector('dialog-element');
    Object.keys(info).forEach(i => {
      dialog[i] = info[i];
    });
    dialog._openDialog();
  },

  _computeIsloading() {
    return !this.volume;
  },

  _toArray(x) {
    if (x) {
      return Object.keys(x).map(y => x[y]);
    }
    return [];
  },

  _getVolumeNameOrExternalId(volume) {
    return volume && (volume.name || volume.external_id);
  },
});
