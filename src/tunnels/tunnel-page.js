import '@polymer/polymer/polymer-legacy.js';
import '@polymer/paper-button/paper-button.js';
import '@polymer/paper-styles/typography.js';
import '@polymer/paper-material/paper-material.js';
import '@polymer/paper-menu-button/paper-menu-button.js';

import '@polymer/paper-spinner/paper-spinner.js';
import '../helpers/dialog-element.js';
import { Polymer } from '@polymer/polymer/lib/legacy/polymer-fn.js';
import { html } from '@polymer/polymer/lib/utils/html-tag.js';
import { mistLogsBehavior } from '../helpers/mist-logs-behavior.js';
import { mistRulesBehavior } from '../helpers/mist-rules-behavior.js';
import { mistLoadingBehavior } from '../helpers/mist-loading-behavior.js';
import '../tags/tags-list.js';
import './tunnel-edit.js';
import './tunnel-actions.js';
import { CSRFToken, itemUid } from '../helpers/utils.js';

Polymer({
  _template: html`
    <style include="shared-styles single-page tags-and-labels">
      .columns {
        @apply --layout-horizontal;
        flex: 1 100%;
      }
      .left,
      .right {
        @apply --layout-vertical;
        align-items: flex-start;
        flex-direction: column;
        flex: 1 100%;
        overflow: hidden;
      }
      .left {
        flex: 1 60%;
      }
      .right {
        flex: 1 40%;
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
        color: black;
        text-decoration: none;
      }

      paper-icon-button {
        transition: all 200ms;
      }

      [size='xs'] > * {
        display: none;
      }

      [size='xs'] mist-sidebar {
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
      .break {
        word-break: break-all;
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
      #leftcolumn {
        position: relative;
      }
      #getcurl,
      #getscript,
      #copycurl,
      #copyscript {
        display: none;
        background-color: rgba(255, 255, 255, 0.15);
        color: inherit;
        font-size: 13px;
      }
      #getcurl iron-icon,
      #getscript iron-icon,
      #copycurl iron-icon,
      #copyscript iron-icon {
        color: inherit;
        margin-right: 8px;
      }
      #getcurl,
      #getscript {
        display: inline-block;
      }
      #copycurl[show],
      #copyscript[show] {
        display: inline-block;
      }
      .single-head {
        @apply --tunnel-page-head-mixin;
      }
      tunnel-actions {
        width: 50%;
        fill: #fff;
      }
    </style>

    <div id="content">
      <!-- <div class="is-loading" hidden$="[[!isLoading]]">
                <paper-spinner active hidden$="[[!isLoading]]"></paper-spinner>
            </div> -->
      <paper-material class="single-head layout horizontal">
        <span class="icon"
          ><iron-icon icon="[[section.icon]]"></iron-icon
        ></span>
        <div class="title flex">
          <h2>[[tunnel.name]]</h2>
          <div class="subtitle">
            <span>[[tunnel.description]]</span>
          </div>
        </div>
        <tunnel-actions
          items="[[itemArray]]"
          actions="{{actions}}"
          user="[[model.user.id]]"
          members="[[model.membersArray]]"
          org="[[model.org]]"
          in-single-view=""
        ></tunnel-actions>
      </paper-material>
      <div class="columns">
        <div class="missing" hidden$="[[!isMissing]]">Key not found.</div>
        <div id="leftcolumn" class="left command-container">
          <div class="pad2">
            <pre><code>
Options for installing your VPN client:

1.  Via \`curl\`: Hit the button below in order to be provided with
    a simple \`curl\` command, which you can directly run in your shell
    and will take care of installing the VPN client. This is the
    recommended option, especially if you are not planning on modifying
    the configuration script provided.

2.  Alternatively, you can request and then copy &amp; paste the configuration
    script in your shell, make it executable, and run it. This option is
    useful in case you want to make any changes to the configuration provided.
</code></pre>
            <pre><code>
==============================================================================
CURL Command:</code></pre>
            <pre><code id="tunnelcommand"></code></pre>
            <paper-button
              id="copycurl"
              on-tap="copyCurl"
              class="pull-right link"
            >
              <iron-icon icon="content-copy"> </iron-icon>Copy
              command</paper-button
            >
            <paper-button
              id="getcurl"
              on-tap="_requestCommand"
              class="pull-right link"
            >
              <iron-icon icon="content-copy"> </iron-icon>Request
              command</paper-button
            >
            <pre><code>
==============================================================================
Script:</code></pre>
            <pre><code id="tunnelscript"></code></pre>
            <paper-button
              id="getscript"
              handle-as="json"
              on-tap="_requestScript"
              class="pull-right link"
              ><iron-icon icon="content-copy"></iron-icon> Request
              Script</paper-button
            >
            <paper-button
              id="copyscript"
              on-tap="copyScript"
              class="pull-right link"
              ><iron-icon icon="content-copy"></iron-icon> Copy Script
            </paper-button>
            <pre><code>

                        </code></pre>
          </div>
        </div>
        <paper-material id="rightcolumn" class="right">
          <div class="info-table">
            <div class="info-body info-group">
              <div
                class="info-item flex-horizontal-with-ratios"
                hidden$="[[!tunnel.owned_by.length]]"
              >
                <div class="flexchild">Owner</div>
                <div class="flexchild break">
                  <a href$="/members/[[tunnel.owned_by]]"
                    >[[_displayUser(tunnel.owned_by,model.members)]]</a
                  >
                </div>
              </div>
              <div
                class="info-item flex-horizontal-with-ratios"
                hidden$="[[!tunnel.created_by.length]]"
              >
                <div class="flexchild">Created by</div>
                <div class="flexchild break">
                  <a href$="/members/[[tunnel.created_by]]"
                    >[[_displayUser(tunnel.created_by,model.members)]]</a
                  >
                </div>
              </div>
              <div class="info-item flex-horizontal-with-ratios">
                <div class="flexchild">ID</div>
                <div class="flexchild break">[[tunnel.id]]</div>
              </div>
              <div class="info-item flex-horizontal-with-ratios">
                <div class="flexchild">TUNNEL ID</div>
                <div class="flexchild">[[tunnel.tunnel_id]]</div>
              </div>
              <template is="dom-if" if="[[tunnelTags]]">
                <div class="info-item flex-horizontal-with-ratios">
                  <div class="flexchild">TAGS</div>
                  <div class="flexchild">
                    <template is="dom-repeat" items="[[tunnelTags]]">
                      <span class="id tag"
                        >[[item.key]]<span hidden="[[!item.value]]"
                          >=[[item.value]]</span
                        ></span
                      >
                    </template>
                  </div>
                </div>
              </template>
              <div class="info-item flex-horizontal-with-ratios">
                <div class="flexchild">CIDRS</div>
                <div class="flexchild">
                  <template is="dom-repeat" items="[[tunnel.cidrs]]">
                    [[item]]<br />
                  </template>
                </div>
              </div>
              <div class="info-item flex-horizontal-with-ratios">
                <div class="flexchild">PORT</div>
                <div class="flexchild">[[tunnel.port]]</div>
              </div>
              <div class="info-item flex-horizontal-with-ratios">
                <div class="flexchild">Enabled</div>
                <div class="flexchild">[[tunnel.active]]</div>
              </div>
            </div>
          </div>
        </paper-material>
      </div>
      <br />
      <paper-material class="no-pad">
        <mist-rules
          id="tunnelRules"
          resource-type="tunnel"
          incidents="[[model.incidentsArray]]"
          rules="[[_rulesApplyOnResource(model.rules, tunnel, tunnel.tags.*, 'tunnel')]]"
          teams="[[model.teamsArray]]"
          users="[[model.membersArray]]"
          resource="[[tunnel]]"
          model="[[model]]"
          collapsible=""
        ></mist-rules>
      </paper-material>
      <br />
      <paper-material class="no-pad">
        <template is="dom-if" if="[[tunnel]]" restamp="">
          <mist-list
            id="tunnelLogs"
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
            name="tunnel logs"
            primary-field-name="time"
            base-filter="[[tunnel.id]]"
          ></mist-list>
        </template>
      </paper-material>
      <!-- <div class="absolute-bottom-right">
                <paper-fab icon="av:play-arrow" on-tap="_runScript" id="runScriptFab"></paper-fab>
                <paper-tooltip for="runScriptFab" position="top">Run Script</paper-tooltip>
            </div> -->
    </div>
    <tunnel-edit tunnel="[[tunnel]]"></tunnel-edit>
    <iron-ajax
      id="scriptAjaxRequest"
      url="/api/v1/tunnels/[[tunnel.id]]/script"
      method="GET"
      on-response="_handleScriptAjaxRequest"
      on-error="_handleScriptAjaxError"
    ></iron-ajax>
    <iron-ajax
      id="commandAjaxRequest"
      url="/api/v1/tunnels/[[tunnel.id]]/command"
      method="GET"
      on-response="_handleCommandAjaxRequest"
      handle-as="xml"
      on-error="_handleCommandAjaxError"
    ></iron-ajax>
    <dialog-element></dialog-element>
    <tags-list model="[[model]]"></tags-list>
  `,

  is: 'tunnel-page',

  behaviors: [mistLoadingBehavior, mistLogsBehavior, mistRulesBehavior],

  properties: {
    user: String,
    members: Array,
    sections: {
      type: Object,
    },
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
    tunnel: {
      type: Object,
    },
    tunnelTags: {
      type: Array,
      computed:
        '_computeTunnelTags(tunnel, tunnel.tags, tunnel.tags.*, model.tunnels.*)',
    },
    isInline: {
      type: Boolean,
      value: true,
    },
    isLoading: {
      type: Boolean,
      computed: '_computeIsloading(tunnel)',
      value: true,
    },
    itemArray: Array,
  },

  observers: ['_clearCommandArea(tunnel.id)'],

  listeners: {
    updateSelectedScript: '_updateScript',
    edit: '_editTunnel',
  },

  _clearCommandArea() {
    if (this.shadowRoot.querySelector('#tunnelscommand'))
      this.shadowRoot.querySelector('#tunnelscommand').textContent = '';
    if (this.shadowRoot.querySelector('#tunnelscript'))
      this.shadowRoot.querySelector('#tunnelscript').textContent = '';
    this.$.copyscript.removeAttribute('show');
    this.$.copycurl.removeAttribute('show');

    if (this.tunnel) this.set('itemArray', [this.tunnel]);
  },

  _getHeaderStyle(section) {
    return `background-color: ${section.color}; color: #fff;`;
  },

  _computeIsInline(locationType) {
    if (locationType) return locationType === 'inline';
    return true;
  },

  _computeTunnelTags() {
    return (
      this.tunnel &&
      Object.entries(this.tunnel.tags).map(([key, value]) => ({ key, value }))
    );
  },

  _displayUser(id) {
    return this.model && id && this.model.members && this.model.members[id]
      ? this.model.members[id].name ||
          this.model.members[id].email ||
          this.model.members[id].username
      : '';
  },

  _editTags() {
    const el = this.shadowRoot.querySelector('tags-list');
    const items = [];
    items.push(itemUid(this.tunnel, this.section));
    el.items = items;
    el._openDialog();
  },

  _editTunnel() {
    const el = this.shadowRoot.querySelector('tunnel-edit');
    el._openEditTunnelModal();
  },

  _updateScript(e) {
    const { tunnel } = e.detail;
    this.set('tunnel.name', tunnel.name);
    // this.set('script.description', script.description);
  },

  // script
  _requestScript() {
    this.$.scriptAjaxRequest.body = {};
    this.$.scriptAjaxRequest.headers['Content-Type'] = 'application/json';
    this.$.scriptAjaxRequest.headers['Csrf-Token'] = CSRFToken.value;
    this.$.scriptAjaxRequest.generateRequest();
  },

  _handleScriptAjaxRequest(e) {
    console.log(e);
    const { response } = e.detail;
    if (e.detail.xhr.status === 200) {
      this.$.tunnelscript.textContent = response;
      this.$.copyscript.setAttribute('show', true);
    }
  },

  _handleScriptAjaxError() {},

  // command
  _requestCommand() {
    this.$.commandAjaxRequest.body = {};
    this.$.commandAjaxRequest.headers['Content-Type'] = 'application/json';
    this.$.commandAjaxRequest.headers['Csrf-Token'] = CSRFToken.value;
    this.$.commandAjaxRequest.generateRequest();
  },

  _handleCommandAjaxRequest(e) {
    console.log(e);
    const response = e.detail.xhr.responseText;
    if (e.detail.type !== 'error') {
      this.$.tunnelcommand.textContent = response;
      this.$.copycurl.setAttribute('show', true);
    }
  },

  _handleCommandAjaxError(e) {
    console.log(e);
    const response = e.detail.error;
    this.$.tunnelcommand.textContent = response;
  },

  _showDialog(info) {
    const dialog = this.shadowRoot.querySelector('dialog-element');
    Object.keys(info).forEach(i => {
      dialog[i] = info[i];
    });
    dialog._openDialog();
  },

  copyScript() {
    this.clearSelection();
    const el = this.$.tunnelscript;
    this.setSelection(el);
    const successful = document.execCommand('copy');
    const message = successful
      ? 'Content copied to clipboard'
      : 'There was an error copying to clipboard!';
    this.dispatchEvent(
      new CustomEvent('toast', {
        bubbles: true,
        composed: true,
        detail: { msg: message, duration: 3000 },
      })
    );
  },

  copyCurl() {
    this.clearSelection();
    const el = this.$.tunnelcommand;
    this.setSelection(el);
    const successful = document.execCommand('copy');
    const message = successful
      ? 'The command was copied to clipboard!'
      : 'There was an error copying to clipboard!';
    this.dispatchEvent(
      new CustomEvent('toast', {
        bubbles: true,
        composed: true,
        detail: { msg: message, duration: 3000 },
      })
    );
  },

  _enableTunnel() {},

  _disableTunnel() {},

  clearSelection() {
    if (window.getSelection) {
      if (window.getSelection().empty) {
        // Chrome
        window.getSelection().empty();
      } else if (window.getSelection().removeAllRanges) {
        // Firefox
        window.getSelection().removeAllRanges();
      }
    } else if (document.selection) {
      // IE?
      document.selection.empty();
    }
  },

  setSelection(el) {
    let range;
    if (document.selection) {
      range = document.body.createTextRange();
      range.moveToElementText(el);
      range.select();
    } else if (window.getSelection) {
      range = document.createRange();
      range.selectNode(el);
      window.getSelection().addRange(range);
    }
  },

  _computeIsloading() {
    return !this.tunnel;
  },
});
