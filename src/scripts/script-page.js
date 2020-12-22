import '../../node_modules/@polymer/polymer/polymer-legacy.js';
import '../../node_modules/@polymer/paper-button/paper-button.js';
import '../../node_modules/@polymer/paper-styles/typography.js';
import '../../node_modules/@polymer/paper-spinner/paper-spinner.js';
import '../../node_modules/@mistio/mist-list/mist-list.js';
import '../../node_modules/@polymer/paper-tooltip/paper-tooltip.js';
import '../mist-rules/mist-rules.js';
import '../helpers/dialog-element.js';
import { mistRulesBehavior } from '../helpers/mist-rules-behavior.js';
import { mistLoadingBehavior } from '../helpers/mist-loading-behavior.js';
import '../tags/tags-list.js';
import './script-run.js';
import './script-actions.js';
import moment from '../../node_modules/moment/src/moment.js';
import { Polymer } from '../../node_modules/@polymer/polymer/lib/legacy/polymer-fn.js';
import { html } from '../../node_modules/@polymer/polymer/lib/utils/html-tag.js';

Polymer({
  _template: html`
        <style include="shared-styles single-page tags-and-labels">
            [hidden] {
                display: none !important;
            }
            .columns {
                @apply --layout-horizontal;
                flex: 1 100%;
            }
            .left, .right {
                @apply --layout-vertical;
                align-items: flex-start;
                flex-direction: column;
                flex: 1 100%;
                overflow: hidden;
            }
            paper-material {
                display: block;
                padding: 20px;
                overflow: hidden;
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
                width: 100%;
                max-width: 100%;
                overflow-x: scroll;
                box-sizing: border-box;
            }

            a {
                color: var(--mist-blue);
                text-decoration: none;
            }

            paper-icon-button {
                transition: all 200ms;
            }

            [size=xs] > * {
                display: none;
            }

            [size=xs] mist-sidebar {
                min-width: 100%;
                height: auto;
            }

            h4.id {
                display: inline-block;
                text-transform: uppercase;
                font-size: 0.9rem;
                font-weight: 700;
                margin-right: 16px;
            }
            .id {
                display: inline-block;
            }
            /* TODO: better */
            .tag {
                padding: 0.5em;
                display: inline-flex;
                align-self: center;
            }
            .info-table {
                border-top: 1px solid #ddd;
            }
            a.inherit {
                color:inherit;
                font-size: inherit;
                line-height: inherit;
                padding: inherit;
            }

            mist-list {
                width: 100%;
                padding: 0;
                margin: 0;
                max-height: 700px;
                font-size: 75%;
                min-height: 500px;
                --row-height: 48px;
            }
            paper-material.script-logs {
                padding: 0;
                margin-top: 32px;
            }
            .single-head {
                @apply --script-page-head-mixin
            }
            script-actions {
                width: 50%;
            }
            .subtitle {
                text-transform: capitalize;
            }
        </style>

        <div id="content">
            <paper-material class="single-head layout horizontal">
                <span class="icon"><iron-icon icon="[[section.icon]]"></iron-icon></span>
                <div class="title flex">
                    <h2>
                        [[script.name]]
                    </h2>
                    <div class="subtitle">
                    [[script.location.type]] Script
                        <span hidden\$="[[!isInline]]"><a class="inherit" href\$="data:application/octet-stream,[[_encode(script.location.source_code)]]" download\$="script-[[script.name]].sh.txt">Download</a></span>
                        </span>
                    </div>
                </div>
                <script-actions items="[[itemArray]]" actions="{{actions}}" user="[[model.user.id]]" members="[[model.membersArray]]" org="[[model.org]]"></script-actions>
            </paper-material>
            <div class="columns">
                <div id="leftcolumn" class="left command-container" hidden\$="[[!isInline]]">
                    <div class="pad2">
                        <pre><code>[[script.location.source_code]]</code></pre>
                    </div>
                </div>
                <paper-material id="rightcolumn" class="right">
                    <div class="missing" hidden\$="[[!isMissing]]">Script not found.</div>
                    <div class="info-table">
                        <div class="info-body info-group">
                            <template is="dom-if" if="[[scriptTags.length]]">
                                <div class="info-item flex-horizontal-with-ratios">
                                    <h4 class="id tags">Tags</h4>
                                    <template is="dom-repeat" items="[[scriptTags]]">
                                        <span class="id tag">[[item.key]]<span hidden="[[!item.value]]">=[[item.value]]</span></span>
                                    </template>
                                </div>
                            </template>
                            <div class="info-item flex-horizontal-with-ratios" hidden\$="[[!script.owned_by.length]]">
                                <div class="flexchild">Owner </div>
                                <div class="flexchild"><a href\$="/members/[[script.owned_by]]">[[_displayUser(script.owned_by,model.members)]]</a></div>
                            </div>
                            <div class="info-item flex-horizontal-with-ratios" hidden\$="[[!script.created_by.length]]">
                                <div class="flexchild">Created by </div>
                                <div class="flexchild"><a href\$="/members/[[script.created_by]]">[[_displayUser(script.created_by,model.members)]]</a></div>
                            </div>
                            <div class="info-item flex-horizontal-with-ratios">
                                <div class="flexchild">ID</div>
                                <div class="flexchild">[[script.id]]</div>
                            </div>
                            <template is="dom-if" if="[[script.description]]">
                                <div class="info-item flex-horizontal-with-ratios">
                                    <div class="flexchild">Description</div>
                                    <div class="flexchild">[[script.description]]</div>
                                </div>
                            </template>
                            <div class="info-item flex-horizontal-with-ratios">
                                <div class="flexchild">Type</div>
                                <div class="flexchild">[[script.exec_type]]</div>
                            </div>
                            <template is="dom-if" if="[[script.entrypoint]]">
                                <div class="info-item flex-horizontal-with-ratios">
                                    <div class="flexchild">Status</div>
                                    <div class="flexchild">[[script.entrypoint]]</div>
                                </div>
                            </template>
                            <template is="dom-if" if="[[!isInline]]">
                                <div class="info-item flex-horizontal-with-ratios">
                                    <div class="flexchild">Url</div>
                                    <div class="flexchild"><a class="regular" href\$="[[_computeLink(script.location)]]" target="_blank"> [[_computeLink(script.location)]]</a></div>
                                </div>
                            </template>
                        </div>
                    </div>
                </paper-material>
            </div>
            <br>
            <paper-material class="no-pad">
                <mist-rules id="scriptRules" resource-type="script" incidents="[[model.incidentsArray]]" rules="[[_rulesApplyOnResource(model.rules.*, script, script.tags.*, 'script')]]" teams="[[model.teamsArray]]" users="[[model.membersArray]]" resource="[[script]]" model="[[model]]" collapsible=""></mist-rules>
            </paper-material>
            <template is="dom-if" if="[[script.id]]" restamp="">
                <paper-material class="script-logs">
                    <mist-list id="scriptLogs" timeseries="" expands="" column-menu="" resizable="" searchable="" streaming="" infinite="" toolbar="" rest="" apiurl="/api/v1/logs" name="script logs" frozen="[[_getFrozenLogColumn()]]" visible="[[_getVisibleColumns()]]" renderers="[[_getRenderers()]]" primary-field-name="time" base-filter="script_id:[[script.id]]">
                    </mist-list>
                </paper-material>
            </template>
            <div class="absolute-bottom-right">
                <paper-fab icon="av:play-arrow" on-tap="_runScript" id="runScriptFab"></paper-fab>
                <paper-tooltip for="runScriptFab" position="left">Run Script</paper-tooltip>
            </div>
        </div>
        <iron-ajax id="scriptDeleteAjaxRequest" url="/api/v1/scripts/[[script.id]]" method="DELETE" on-response="_handleScriptDeleteAjaxResponse" on-error="_handleScriptDeleteAjaxError"></iron-ajax>
        <dialog-element></dialog-element>
        <tags-list model="[[model]]"></tags-list>
`,

  is: 'script-page',

  behaviors: [mistLoadingBehavior, mistRulesBehavior],

  properties: {
    section: {
      type: Object,
    },
    color: {
      type: String,
      computed: '_getHeaderStyle(section)',
    },
    model: {
      type: Object,
    },
    script: {
      type: Object,
    },
    scriptTags: {
      type: Array,
      computed:
        '_computeScriptTags(script, script.tags, script.tags.*, model.scripts.*)',
    },
    isInline: {
      type: Boolean,
      value: false,
      computed: '_computeIsInline(script.location)',
    },
    isLoading: {
      type: Boolean,
      computed: '_computeIsloading(script)',
      value: true,
    },
    actions: {
      type: Array,
    },
    itemArray: {
      type: Array,
    },
  },

  observers: ['_changed(script)'],

  _getHeaderStyle(section) {
    return `background-color: ${section.color}; color: #fff;`;
  },

  _displayUser(id, _members) {
    return this.model && id && this.model.members && this.model.members[id]
      ? this.model.members[id].name ||
          this.model.members[id].email ||
          this.model.members[id].username
      : '';
  },

  _computeIsInline(location) {
    if (location) return !!location.source_code;
    return false;
  },

  _runScript(e) {
    e.stopImmediatePropagation();
    this.dispatchEvent(
      new CustomEvent('go-to', {
        bubbles: true,
        composed: true,
        detail: { url: `/scripts/${this.script.id}/+run` },
      })
    );
  },

  _handleScriptDeleteAjaxResponse(_e) {
    this.dispatchEvent(
      new CustomEvent('go-to', {
        bubbles: true,
        composed: true,
        detail: { url: '/scripts' },
      })
    );
  },

  _encode(script) {
    return encodeURIComponent(script);
  },

  _computeLink(location) {
    if (location) return location.repo || location.url;
    return null;
  },

  _computeIsloading(_script) {
    return !this.script;
  },

  _computeScriptTags(_script, _scriptTags) {
    if (this.script) {
      return Object.entries(this.script.tags).map(([key, value]) => ({
        key,
        value,
      }));
    }
    return [];
  },

  _getVisibleColumns() {
    return ['type', 'action', 'machine_id', 'user_id'];
  },

  _getFrozenLogColumn() {
    return ['time'];
  },

  _getRenderers() {
    const _this = this;
    return {
      time: {
        body: (item, row) => {
          let ret = `<span title="${moment(item * 1000).format()}">${moment(
            item * 1000
          ).fromNow()}</span>`;
          if (row.error)
            ret += '<iron-icon icon="error" style="float: right"></iron-icon>';
          return ret;
        },
      },
      user_id: {
        title: () => {
          return 'user';
        },
        body: item => {
          if (
            _this.model &&
            _this.model.members &&
            item in _this.model.members &&
            _this.model.members[item] &&
            _this.model.members[item].name &&
            _this.model.members[item].name !== undefined
          ) {
            const displayUser =
              _this.model.members[item].name ||
              _this.model.members[item].email ||
              _this.model.members[item].username;
            const ret = `<a href="/members/${item}">${displayUser}</a>`;
            return ret;
          }
          return item || '';
        },
      },
      machine_id: {
        title: 'machine',
        body: (item, _row) => {
          if (
            _this.model &&
            _this.model.machines &&
            item in _this.model.machines
          ) {
            return `<a href="/machines/${_this.model.machines[item].id}">${_this.model.machines[item].name}</a>`;
          }
          return item || '';
        },
      },
    };
  },

  _changed(_item) {
    if (this.script) this.set('itemArray', [this.script]);
  },
});
