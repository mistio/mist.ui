import '@polymer/paper-material/paper-material.js';
import '@polymer/paper-button/paper-button.js';
import '@polymer/paper-progress/paper-progress.js';
import '@polymer/paper-styles/typography.js';
import '@polymer/paper-tabs/paper-tabs.js';
import '@polymer/paper-spinner/paper-spinner.js';
import '@polymer/paper-icon-button/paper-icon-button.js';
import '@mistio/mist-list/mist-list.js';
import '../helpers/dialog-element.js';
import '../mist-rules/mist-rules.js';
import '../app-togglable/app-togglable-list.js';
import '../app-form/app-form.js';
import '../app-icons/app-icons.js';
import '../element-for-in/element-for-in.js';
import '../tags/tags-list.js';
import '../helpers/xterm-dialog.js';
import './stack-actions.js';
import './stack-machine-item.js';
import './stack-network-item.js';
import './stack-key-item.js';
import './orchestration-form.js';
import moment from 'moment/src/moment';
import 'anchorme/dist/browser/anchorme.js';
import { Polymer } from '@polymer/polymer/lib/legacy/polymer-fn.js';
import { html } from '@polymer/polymer/lib/utils/html-tag.js';
import { YAML } from 'yaml/browser/dist/index.js';
import { CSRFToken } from '../helpers/utils.js';
import { mistRulesBehavior } from '../helpers/mist-rules-behavior.js';
import { mistLogsBehavior } from '../helpers/mist-logs-behavior.js';
import { mistLoadingBehavior } from '../helpers/mist-loading-behavior.js';

/* eslint-disable lit-a11y/anchor-is-valid */
Polymer({
  _template: html`
    <style include="lists forms tags-and-labels single-page shared-styles">
      paper-button#minimal:not([disabled]) {
        background-color: #eee;
        text-transform: none;
        font-weight: 400;
        color: inherit;
      }

      paper-button#minimal::slotted(iron-icon) {
        opacity: 0.32;
      }
      paper-material {
        display: block;
        padding: 24px;
      }

      paper-material.no-pad {
        padding: 0;
      }

      paper-material.marg-b {
        margin-bottom: 24px;
      }

      paper-material.marg-t {
        margin-top: 24px;
      }

      paper-material.form-view {
        padding: 20px;
        margin: 36px;
      }

      paper-material.form-view {
        position: relative;
      }
      orchestration-form {
        max-width: 100%;
        position: relative;
      }

      .app-form-title {
        font-size: 24px;
        text-transform: capitalize;
      }

      paper-material.form-view h2 {
        padding: 0;
        line-height: 20px;
      }

      paper-menu-button paper-button {
        display: block;
      }

      .flex-horizontal-with-ratios {
        @apply --layout-horizontal;
        align-content: stretch;
        flex: 100%;
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
        @apply --layout-horizontal;
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
        @apply --layout-flex;
        text-transform: capitalize;
      }

      .paper-header .toggleViewButton {
        --paper-icon-button-ink-color: transparent;
      }

      .paper-header .cartButton {
        margin-right: 10px;
      }

      #content {
        position: relative;
        -webkit-overflow-scrolling: touch;
      }

      paper-icon-button {
        transition: all 200ms;
      }

      paper-icon-button.close {
        float: right;
      }

      [size='xs'] > * {
        display: none;
      }

      [size='xs'] mist-sidebar {
        min-width: 100%;
        height: auto;
      }

      paper-icon-bottom.bottom {
        padding-right: 8px;
      }

      .subhead {
        box-sizing: border-box;
        position: absolute;
        width: 100%;
        left: 0;
        height: 57px;
        bottom: -57px;
        right: 0;
        z-index: 9;
        color: rgba(0, 0, 0, 0.87);
      }

      paper-tabs {
        height: 57px !important;
        text-transform: uppercase;
      }

      paper-tabs::slotted(#selectionBar) {
        background-color: var(--mist-blue);
      }

      paper-tab::slotted(paper-ripple) {
        color: #999;
      }

      #workflowBar {
        padding: 0 0 0 60px;
        line-height: 57px;
      }

      .content {
        margin-top: 57px;
        padding-bottom: 80px;
      }

      #workflows {
        position: relative;
        display: none;
      }

      #workflows.open {
        display: block;
      }

      #closeworkflows {
        position: absolute;
        right: 16px;
        top: 16px;
        z-index: 9;
      }

      #workflows-panel {
        @apply --layout-horizontal;
      }

      #workflowsNavigation {
        background-color: #f2f2f2;
      }

      #workflowsView {
        display: block;
        max-width: 100%;
        overflow: hidden;
        position: relative;
        margin: 0 auto;
      }

      .resource-head {
        font-weight: 500;
        padding: 8px 16px;
        opacity: 0.87;
        background-color: #fff;
        border-bottom: 1px solid #ddd;
        margin-bottom: 0;
      }

      .wf-header {
        background-color: #616161;
        color: #fff;
        padding: 8px;
        text-transform: uppercase;
      }

      .wf-item {
        padding: 24px;
        margin: 40px auto;
        display: none;
      }

      .wf-item[show='true'] {
        display: flex;
        flex-direction: column;
      }

      @media screen and (max-width: 1400px) {
        .wf-item {
          margin: 0 auto;
        }
      }

      @media screen and (max-width: 620px) {
        #workflowsNavigation {
          display: none;
        }
      }

      .resources-list {
        margin-bottom: 0;
      }

      .resources-list h3 {
        margin-top: 0;
        background-color: #f2f2f2;
      }

      .section {
        padding-top: 36px;
      }

      #workflows-navigation paper-item {
        text-transform: capitalize;
        padding: 16px;
        font-weight: 500;
      }

      .grid-row .center {
        text-align: center;
      }

      #quickActions.hidden {
        width: 0;
        padding: 0;
        opacity: 0;
        right: 0;
      }

      paper-fab {
        transition: all 0.18s ease-in;
      }

      paper-fab.hidden {
        width: 0;
        height: 0;
        padding: 0;
      }

      .no-data-message {
        padding: 70px;
      }

      iron-pages {
        margin-bottom: 68px;
      }

      h2.info-title {
        font-size: 20px;
        font-weight: 400;
        line-height: 24px;
        margin: 0;
        padding: 8px 16px;
        font-weight: 500;
        background-color: #f2f2f2;
        border-bottom: 1px solid #ddd;
      }

      #selectworkflow {
        padding: 36px;
      }

      #selectworkflow.hidden {
        display: none;
      }

      .parsing-loader {
        text-align: center;
        margin: 0 auto;
        width: 70%;
      }

      .parsing-loader paper-progress {
        width: 100%;
        margin-bottom: 32px;
      }

      .parsing-loader.error paper-progress ::slotted(#primaryProgress) {
        background-color: var(--red-color);
      }

      #stack_actions paper-button {
        text-align: left !important;
      }

      .single-head paper-button {
        line-height: 24px;
      }

      .delete,
      .retry {
        cursor: pointer;
      }

      paper-spinner {
        display: none;
      }

      paper-spinner[active] {
        display: block;
        position: absolute;
        left: calc(50% - 40px);
        top: 120px;
        z-index: 999;
        padding: 8px;
        border-radius: 50%;
      }

      paper-button[disabled] {
        opacity: 0.87;
      }

      #deploynow.hidden {
        display: none;
      }

      #stackOutputs a,
      .blue-link {
        font-size: 1em;
        color: var(--mist-blue);
      }

      .info-title-id {
        color: rgba(0, 0, 0, 0.54);
        font-size: 0.7em;
        padding-left: 8px;
      }

      .tag {
        padding: 0.5em;
        display: inline;
      }

      .small {
        text-transform: none;
        font-size: 0.9em;
      }

      paper-material#output {
        position: relative;
      }

      #cfyshell {
        width: 100%;
        position: relative;
      }

      paper-button {
        line-height: 1em;
      }

      .output {
        position: relative;
        overflow: hidden;
        background-color: #eee;
      }

      .output paper-button {
        float: right;
        margin: 8px !important;
      }

      .single-head {
        @apply --stack-page-head-mixin;
      }

      .inStartCreationState-true {
        opacity: 0.3;
        pointer-events: none;
      }

      stack-actions {
        width: 50%;
      }
    </style>
    <div id="content">
      <paper-material class="single-head layout horizontal">
        <span class="icon">
          <iron-icon icon="[[section.icon]]"></iron-icon>
        </span>
        <div class="title flex">
          <h2>[[stack.name]]</h2>
          <div class="subtitle">
            Created from
            <a
              class="regular"
              href$="/templates/[[template.id]]"
              hidden$="[[!template.name]]"
            >
              [[template.name]]
              <iron-icon icon="icons:link"></iron-icon>
            </a>
            <span hidden$="[[template.id]]"> missing template</span>
          </div>
        </div>
        <stack-actions
          items="[[itemArray]]"
          actions="{{actions}}"
          workflows="[[workflows]]"
          single=""
          deploy-now="[[!ok]]"
          user="[[model.user.id]]"
          members="[[model.membersArray]]"
          org="[[model.org]]"
        ></stack-actions>
      </paper-material>

      <paper-material>
        <div class="missing" hidden$="[[!isMissing]]">Stack not found.</div>
        <div class="flex-horizontal-with-ratios">
          <div class="page-block" hidden$="[[!stack.description.length]]">
            <span class="smallcaps">Stack Description</span>
            <p>[[stack.description]]</p>
          </div>
          <div class="page-block">
            <span class="smallcaps">Created</span>
            <p>[[_computeReadableDate(stack.created_at)]]</p>
          </div>
          <div class="page-block" hidden$="[[!stack.owned_by.length]]">
            <span class="smallcaps">Owner </span>
            <p>
              <a href$="/members/[[stack.owned_by]]"
                >[[_displayUser(stack.owned_by,model.members)]]</a
              >
            </p>
          </div>
          <div class="page-block" hidden$="[[!stack.created_by.length]]">
            <span class="smallcaps">Created by </span>
            <p>
              <a href$="/members/[[stack.created_by]]"
                >[[_displayUser(stack.created_by,model.members)]]</a
              >
            </p>
          </div>
          <div class="page-block" hidden$="[[isEmpty(stackTags)]]">
            <h3 class="smallcaps">
              Tags
              <template is="dom-if" if="[[stackTags]]">
                <span class="id">([[stackTags.length]])</span>
              </template>
              <template is="dom-if" if="[[!stackTags]]">
                <span class="id">(0)</span>
              </template>
            </h3>
            <template is="dom-if" if="[[stackTags]]">
              <template is="dom-repeat" items="[[stackTags]]">
                <span class="id tag"
                  >[[item.key]]<span hidden$="[[!item.value]]"
                    >=[[item.value]]</span
                  ></span
                >
              </template>
            </template>
          </div>
        </div>
      </paper-material>

      <paper-material
        id="workflows"
        class="no-pad closed"
        hidden$="[[hideWorkflows]]"
      >
        <paper-icon-button
          id="closeworkflows"
          icon="close"
          on-tap="_closeworkflows"
        ></paper-icon-button>
        <div id="workflows-panel">
          <div id="workflowsNavigation">
            <template is="dom-repeat" items="[[workflows]]" as="workflow">
              <paper-item
                id$="[[workflow.name]]"
                on-tap="_quickActionsNavigation"
                >[[workflow.name]]</paper-item
              >
            </template>
          </div>

          <div id="workflowsView" class="pad">
            <template is="dom-repeat" items="[[workflows]]" as="workflow">
              <div
                id$="[[workflow.name]]show"
                class="wf-item"
                show="[[!index]]"
              >
                <template is="dom-if" if="[[workflow.params.length]]">
                  <h2 class="pad app-form-title">[[workflow.name]]</h2>
                  <div class="pad">
                    <orchestration-form
                      id$="[[workflow.name]]"
                      model="[[model]]"
                      fields="{{workflow.params}}"
                      workflow="[[workflow.name]]"
                      url$="/api/v1/stacks/[[stack.id]]"
                      on-request="handleWorkflowRequest"
                      on-response="handleWorkflowResponse"
                      on-error="handleWorkflowError"
                      btncontent="[[workflow.name]]"
                    ></orchestration-form>
                  </div>
                </template>

                <template is="dom-if" if="[[!workflow.params.length]]">
                  <p class="text-center" hidden$="[[!workflow.description]]">
                    [[workflow.description]]
                  </p>
                  <p class="text-center">
                    <paper-button
                      id$="[[workflow.name]]"
                      on-tap="doWorkflow"
                      class="blue"
                      >[[workflow.name]]</paper-button
                    >
                  </p>
                  <h5 class="text-center">*no paremetres required</h5>
                </template>
              </div>
            </template>
          </div>
        </div>
      </paper-material>

      <div hidden$="[[workflowsOpen]]">
        <!-- If status undefined or ok -->
        <paper-material
          id="deploynow"
          class="marg-b marg-t"
          hidden$="[[hideDeployNow]]"
        >
          <div class="parsing-loader">
            <h4>Stack is saved and ready to deploy</h4>
            <paper-button on-tap="deployNowWork">Deploy Now</paper-button>
          </div>
        </paper-material>

        <!-- If stack status error-->
        <paper-material hidden$="[[!inErrorState]]">
          <div class="parsing-loader error">
            <h3>There seems to be an error</h3>
            <paper-progress id="stackpageprogress" value="100"></paper-progress>
            <h4>
              The process failed.
              <br />
              <!-- <span class="retry regular blue-link" id="install" on-tap="doWorkflow">Try again </span>
                        <p id="messages"></p> -->
            </h4>
          </div>
        </paper-material>

        <!-- If stack status start_creation-->
        <paper-material hidden$="[[!inStartCreationState]]">
          <div class="parsing-loader">
            <h3>Creating stack [[stack.name]]</h3>
            <paper-progress
              id="stackpageprogress"
              value="30"
              indeterminate=""
            ></paper-progress>
            <h4>This may take a while.</h4>
            <paper-button on-tap="cancelWorkflow">Cancel</paper-button>
          </div>
        </paper-material>

        <!-- If stack status workflow_started-->
        <paper-material hidden$="[[!inWorkflowStartedState]]">
          <div class="parsing-loader">
            <h3>Started workflow</h3>
            <paper-progress
              id="stackpageprogress"
              value="30"
              indeterminate=""
            ></paper-progress>
            <paper-button class="blue-link" on-tap="cancelWorkflow"
              >Cancel</paper-button
            >
          </div>
        </paper-material>

        <!-- If stack status workflow_started-->
        <paper-material hidden$="[[!delete_request]]">
          <div class="parsing-loader">
            <h3>Deleting Stack</h3>
            <paper-progress
              id="stackpageprogress"
              value="30"
              indeterminate=""
            ></paper-progress>
          </div>
        </paper-material>

        <paper-material id="output" class="no-pad">
          <div class="output">
            <paper-button
              toggles=""
              active="{{showOutput}}"
              hidden$="[[showOutput]]"
              >Show output</paper-button
            >
            <paper-icon-button
              class="close"
              toggles=""
              active="{{showOutput}}"
              hidden$="[[!showOutput]]"
              icon="icons:close"
            ></paper-icon-button>
          </div>
          <div id="cfyshell" hidden$="[[!showOutput]]"></div>
        </paper-material>
      </div>

      <div id="logs" class="page">
        <mist-list
          timeseries=""
          expands=""
          id="stackLogs"
          items="[[_sortByTimestamp(stack.workflows)]]"
          name="logs"
          frozen="[[_getFrozenLogColumn()]]"
          visible="[[_getVisibleColumns()]]"
          renderers="[[_getRenderers()]]"
          primary-field-name="time"
        >
        </mist-list>
      </div>

      <template is="dom-if" if="[[showAll]]">
        <!-- If stack has resources -->
        <div hidden$="[[!hasResources]]">
          <h3 class="smallcaps">Resources list</h3>
          <template is="dom-if" if="[[listMachines.length]]">
            <paper-material class="no-pad resources-list">
              <h3 class="smallcaps resource-head">
                machines [[listMachines.length]]
              </h3>
              <template is="dom-repeat" items="[[listMachines]]" as="machine">
                <stack-machine-item
                  model="[[model]]"
                  machine="[[machine]]"
                ></stack-machine-item>
              </template>
            </paper-material>
          </template>
          <template is="dom-if" if="[[networks.length]]">
            <paper-material class="no-pad resources-list">
              <h3 class="smallcaps resource-head">networks</h3>
              <template is="dom-repeat" items="[[networks]]" as="network">
                <stack-network-item
                  model="[[model]]"
                  network="[[network]]"
                ></stack-network-item>
              </template>
            </paper-material>
          </template>
          <template is="dom-if" if="[[keys.length]]">
            <paper-material class="no-pad resources-list">
              <h3 class="smallcaps resource-head">keys [[keys.length]]</h3>
              <template is="dom-repeat" items="[[keys]]" as="key">
                <stack-key-item
                  model="[[model]]"
                  key="[[key]]"
                ></stack-key-item>
              </template>
            </paper-material>
          </template>
        </div>
      </template>

      <div id="outputs" class="page" hidden$="[[outputsAreEmpty]]">
        <h3 class="smallcaps">Outputs</h3>
        <paper-material>
          <pre id="stackOutputs"></pre>
        </paper-material>
      </div>

      <div id="state" class="page" hidden$="[[!stack.node_instances.length]]">
        <h3 class="smallcaps">Runtime properties</h3>
        <template is="dom-repeat" items="[[stack.node_instances]]">
          <paper-material class="no-pad info-card">
            <h2 class="info-title">
              [[item.name]]
              <span class="info-title-id">id: [[item.id]]</span>
            </h2>
            <element-for-in
              content="[[item.runtime_properties]]"
            ></element-for-in>
            <element-for-in content="[[item]]"></element-for-in>
          </paper-material>
        </template>
      </div>
      <br />
      <div class="absolute-bottom-right">
        <paper-fab
          id="install"
          icon="av:play-arrow"
          on-tap="_quickActionsNavigation"
          hidden$="[[ok]]"
          disabled$="[[disabled]]"
        ></paper-fab>
      </div>
    </div>
    <dialog-element></dialog-element>
    <tags-list model="[[model]]"></tags-list>
    <iron-ajax
      id="workflowRequest"
      method="POST"
      url=""
      on-response="handleWorkflowResponse"
      on-error="handleWorkflowError"
    ></iron-ajax>
    <iron-ajax
      id="cancelJob"
      method="DELETE"
      url="/api/v1/jobs/[[stack.job_id]]"
      on-response="handleCanceled"
      on-error=""
    ></iron-ajax>
  `,

  is: 'stack-page',

  behaviors: [mistLoadingBehavior, mistLogsBehavior, mistRulesBehavior],

  properties: {
    model: {
      type: Object,
    },
    selected: {
      type: Number,
      value: 1,
      notify: true,
    },
    disabled: {
      type: Boolean,
      computed: '_disabledButtons(stack)',
    },
    hideWorkflows: {
      type: Boolean,
      computed: '_hideWorkflows(stack.status)',
      value: true,
    },
    hideDeployNow: {
      type: Boolean,
      computed: '_hideDeployNow(stack)',
    },
    showOutput: {
      type: Boolean,
      value: false,
    },
    showLogs: {
      type: Boolean,
      value: false,
    },
    section: {
      type: Object,
    },
    params: {
      type: Object,
    },
    stack: {
      type: Object,
    },
    template: {
      type: Object,
      computed: '_computeTemplate(stack.template, model.templates)',
      value: false,
    },
    machines: {
      type: Array,
      computed: '_machines(stack)',
    },
    listMachines: {
      type: Array,
      computed:
        '_computeListMachines(stack.node_instances.*, model.machines.*)',
      value() {
        return [];
      },
    },
    networks: {
      type: Array,
      computed:
        '_computeListNetworks(stack.node_instances.*, model.networks.*)',
      value() {
        return [];
      },
    },
    zones: {
      type: Array,
      computed: '_computeListZones(stack.node_instances.*, model.zonesArray.*)',
      value() {
        return [];
      },
    },
    keys: {
      type: Array,
      computed: '_computeListKeys(stack.node_instances.*, model.keys.*)',
      value() {
        return [];
      },
    },
    workflows: {
      type: Array,
      computed: '_computeWorkflows(stack,template)',
    },
    timestamp: {
      type: String,
      computed: '_getFormattedTimestamp(stack)',
    },
    vpHeight: {
      type: String,
    },
    payload: {
      type: Object,
      value: {},
    },
    resourcelist: {
      type: Boolean,
      computed: '_resourcelist(keys, networks, zones, machines)',
      notify: true,
    },
    inStartCreationState: {
      type: Boolean,
      value: false,
    },
    inErrorState: {
      type: Boolean,
      value: false,
    },
    inWorkflowStartedState: {
      type: Boolean,
      value: false,
    },
    inOkState: {
      type: Boolean,
      value: true,
    },
    outputsAreEmpty: {
      type: Boolean,
      computed: '_computeOutputsAreEmpty(stack)',
    },
    showAll: {
      type: Boolean,
      computed: '_showAll(stack)',
    },
    intervalID: {
      type: String,
    },
    hasResources: {
      type: Boolean,
      computed:
        '_computeHasResources(listMachines.*, networks.*, zones.*, keys.*, stack.node_instances.*)',
    },
    isLoading: {
      type: Boolean,
      computed: '_computeIsloading(stack)',
      value: true,
    },
    delete_request: {
      type: Boolean,
      value: false,
    },
    actions: {
      type: Array,
      notify: true,
    },
    itemArray: {
      type: Array,
    },
    workflowsOpen: {
      type: Boolean,
      value: false,
    },
    stackTags: {
      type: Array,
      computed:
        '_computeStackTags(stack, stack.tags, stack.tags.*, model.stacks.*)',
    },
  },

  observers: [
    'newStackPage(stack.id, stack.template)',
    'stackoutputsChanged(stack.outputs)',
    'updateTerm(showOutput)',
    'enhanceWorkflowLogs(stack.workflows)',
    '_stackStateChanged(stack.status)',
  ],

  listeners: {
    'show-workflows': 'openWorkflows',
    workflow: '_quickActionsNavigation',
    'deploy-now': 'deployNowWork',
  },

  ready() {},
  attached() {},

  updateTerm(show) {
    if (show) {
      this.attachTerm();
    } else {
      const xterm = this.shadowRoot.querySelector('xterm-dialog');
      if (xterm) {
        xterm.remove();
      }
    }
  },

  attachTerm() {
    let xterm = this.shadowRoot.querySelector('xterm-dialog');
    if (xterm) xterm.remove();
    xterm = document.createElement('xterm-dialog');
    xterm.target = {
      job_id: this.stack.job_id,
    };
    xterm.height = 500;
    xterm.controls = false;
    xterm.classList.add('inparent');
    const parent = this.shadowRoot.querySelector('div#cfyshell');
    parent.insertBefore(xterm, parent.firstChild);
    console.warn('xterm open', xterm);
  },

  enhanceWorkflowLogs(_workflows) {
    const workflowLogs = this.stack ? this.stack.workflows : [];
    const runitems = this._sortByTimestamp(workflowLogs.slice());

    const run = el => {
      const item = runitems.shift();
      if (item) {
        const uri = `/api/v1/jobs/${item.job_id}`;
        const xhr = new XMLHttpRequest();
        xhr.onreadystatechange = () => {
          if (xhr.readyState === XMLHttpRequest.DONE) {
            if (xhr.status === 200) {
              let response = xhr.response ? xhr.response : [];
              if (response) {
                response = JSON.parse(response);
                // console.log(response);
                Object.keys(response).forEach(p => {
                  item[p] = response[p];
                });
              }
              item.response = response;
            }
            if (runitems.length) {
              run(el);
            }
          }
        };
        xhr.open('GET', uri);
        xhr.setRequestHeader('Content-Type', 'application/json;charset=UTF-8');
        xhr.setRequestHeader('Csrf-Token', CSRFToken.value);
        xhr.send();
      }
    };

    run(this);
  },

  _displayUser(id, _members) {
    return this.model && id && this.model.members && this.model.members[id]
      ? this.model.members[id].name ||
          this.model.members[id].email ||
          this.model.members[id].username
      : '';
  },

  _computeStack(params) {
    let stack = {};
    if (params.id) stack = this.model.stacks[params.id];

    if (stack) {
      // console.log('Stack',stack);
      return stack;
    }
    return {
      name: 'Stack is missing',
    };
  },

  _sortByTimestamp(items) {
    if (items) return items.sort((a, b) => a.timestamp < b.timestamp);
    return items;
  },

  _computeFromNow(timestamp) {
    return moment.utc(timestamp * 1000).fromNow();
  },

  _getVisibleColumns() {
    return ['name', 'error'];
  },

  _getFrozenLogColumn() {
    return ['timestamp'];
  },

  _getRenderers() {
    return {
      timestamp: {
        body: (item, row) => {
          let ret = `<span title="${moment(item * 1000).format()}">${moment(
            item * 1000
          ).fromNow()}</span>`;
          if (row.error)
            ret += '<iron-icon icon="error" style="float: right"></iron-icon>';
          return ret;
        },
      },
      name: {
        title: (_item, _row) => 'workflow',
        body: (item, _row) => item,
      },
    };
  },

  _computeHasResources(_machines, _networks, _keys, _nodeInstances) {
    return this.listMachines.length || this.networks.length || this.keys.length;
  },

  _computeOutputsAreEmpty(stack) {
    if (stack && stack.outputs) Object.keys(stack.outputs).forEach(() => false);
    return true;
  },

  _computeOutputs(outputs) {
    return Object.keys(outputs).map(key => ({
      name: key,
      value: outputs[key],
    }));
  },

  _computeStackTags(_stack, _stackTags) {
    return (
      this.stack &&
      Object.entries(this.stack.tags).map(([key, value]) => ({ key, value }))
    );
  },

  _stackStateChanged(status) {
    this.set('inStartCreationState', false);
    this.set('inErrorState', false);
    this.set('inWorkflowStartedState', false);
    this.set('inOkState', false);
    if (status) {
      if (status === 'start_creation') this.set('inStartCreationState', true);
      if (status === 'error') this.set('inErrorState', true);
      if (status === 'workflow_started')
        this.set('inWorkflowStartedState', true);
      if (status === 'ok') this.set('inOkState', true);
    }
  },

  _showAll(stack) {
    if (stack) return stack.status === 'ok' || stack.status === 'error';
    return false;
  },

  _hideWorkflows(_status) {
    if (this.stack)
      return (
        !this.stack.deploy ||
        this.stack.status === 'workflow_started' ||
        this.stack.status === 'start_creation'
      );
    return false;
  },

  _hideDeployNow(stack) {
    if (stack)
      return (
        stack.deploy ||
        stack.status === 'workflow_started' ||
        stack.status === 'start_creation'
      );
    return false;
  },

  _disabledButtons(stack) {
    if (stack)
      return (
        stack.status === 'workflow_started' || stack.status === 'start_creation'
      );
    return false;
  },

  _closeworkflows() {
    this.$.workflows.classList.remove('open');
    this.set('workflowsOpen', false);
  },

  openWorkflows(_e) {
    this.$.workflows.classList.toggle('open');
    this.set('workflowsOpen', !this.workflowsOpen);
    const pages = this.$.workflowsView.children;
    [].forEach.call(pages, (p, index) => {
      if (index !== 0) {
        p.setAttribute('show', false);
      } else {
        p.setAttribute('show', true);
      }
    });
  },

  handleErrorsResponse(e) {
    console.log('handleErrorsResponse: ', e.detail);
    // get error
  },

  handleErrorsError(e) {
    console.log('handleErrorsResponse: ', e.detail);
    // could not do the request
    this.hasErrors = true;
  },

  _resourcelist(keys, networks, zones, machines) {
    let sum = 0;
    if (keys) sum += keys.length;
    if (networks) sum += networks.length;
    if (zones) sum += zones.length;
    if (machines) sum += machines.length;

    return sum > 0;
  },

  _computeTemplate(_stacktemplate, _templates) {
    if (this.stack && this.model && this.model.templates) {
      return this.model.templates[this.stack.template];
    }
    return null;
  },

  _machines(stack) {
    return stack && stack.machines;
  },

  _computeListMachines(nodeInstances) {
    const machines = [];
    if (nodeInstances && nodeInstances.base) {
      nodeInstances.base.forEach(rtpy => {
        if (rtpy.runtime_properties.mist_type === 'machine') {
          const mac = Object.values(this.model.machines).find(
            mach =>
              rtpy.runtime_properties &&
              rtpy.runtime_properties.info !== null &&
              mach &&
              mach.id === rtpy.runtime_properties.info.id
          );

          if (mac) {
            machines.push(mac);
          } else {
            const deadMachine = {
              name: rtpy.runtime_properties.info.name,
              state: 'missing',
              cloud: {
                provider: `Machine id: ${rtpy.runtime_properties.info.external_id} Cloud id: ${rtpy.runtime_properties.info.cloud}`,
              },
              isDead: true,
            };
            machines.push(deadMachine);
          }
        }
      }, this);
    }
    return machines;
  },

  _computeListNetworks(nodeInstances) {
    const networks = [];
    if (nodeInstances && nodeInstances.base) {
      nodeInstances.base.forEach(rtpy => {
        if (rtpy.runtime_properties.mist_type === 'network') {
          const net = this.model.networks[rtpy.runtime_properties.info.id];
          if (net) {
            networks.push(net);
          }
        }
      }, this);
    }
    return networks;
  },

  _computeListZones(nodeInstances) {
    const zones = [];
    if (nodeInstances && nodeInstances.base) {
      nodeInstances.base.forEach(rtpy => {
        if (rtpy.runtime_properties.mist_type === 'zone') {
          const zone_ = this.model.zonesArray.find(
            zone => zone.id === rtpy.runtime_properties.info.id,
            this
          );
          if (zone_) zones.push(zone_);
        }
      }, this);
    }
    return zones;
  },

  _computeListKeys(nodeInstances) {
    const keys = [];
    if (nodeInstances && nodeInstances.base) {
      nodeInstances.base.forEach(rtpy => {
        if (
          ['keypair', 'key'].indexOf(rtpy.runtime_properties.mist_type) > -1
        ) {
          const key = this.model.keys[rtpy.runtime_properties.key];

          if (key) {
            keys.push(key);
          } else {
            const deadKey = {
              id: rtpy.key_id,
              isDefault: false,
              machines: [],
              isDead: true,
            };
            keys.push(deadKey);
          }
        }
      }, this);
    }
    return keys;
  },

  _computeWorkflows(_stack, _template) {
    console.log('_computeWorkflows');
    let workflows = [];
    if (this.template && this.template.workflows) {
      workflows = this.template.workflows
        .filter(wf => wf.name !== 'scale' && wf.name !== 'execute_operation')
        .slice(0);
    }
    let yamlInputs = '';
    const param1 = {
      name: 'yaml_or_form',
      label: 'YAML or form',
      type: 'radio',
      value: 'form',
      defaultValue: 'form',
      default: 'form',
      helptext: 'Choose the way you want to insert inputs',
      errorMessage: 'Choose an input format',
      show: true,
      required: true,
      options: [
        {
          title: 'YAML',
          val: 'yaml',
        },
        {
          title: 'Form',
          val: 'form',
        },
      ],
    };
    const param2 = {
      name: 'stackinputs',
      label: 'Workflow Inputs YAML',
      type: 'textarea',
      value: yamlInputs,
      defaultValue: yamlInputs,
      placeholder: '',
      helptext: 'Enter the stack inputs in yaml format',
      errorMessage: "Please enter stacks's inputs",
      show: false,
      required: true,
      showIf: {
        fieldName: 'yaml_or_form',
        fieldValues: ['yaml'],
      },
    };
    for (let i = 0; i < workflows.length; i++) {
      const wf = workflows[i];
      const radioField = wf.params.findIndex(p => p.name === 'yaml_or_form');
      if (wf.params && wf.params.length > 0 && radioField === -1) {
        for (let j = 0; j < wf.params.length; j++) {
          const workflowField = wf.params[j];
          yamlInputs += `${workflowField.name}: ${workflowField.default}\n`;
          if (
            ['yaml_or_form', 'stackinputs'].indexOf(workflowField.name) === -1
          ) {
            workflowField.show = true;
            workflowField.showIf = {
              fieldName: 'yaml_or_form',
              fieldValues: ['form'],
            };
            workflowField.label = workflowField.name;
            workflowField.value = workflowField.default;
            workflowField.defaultValue = workflowField.default;
          }
        }
        if (radioField === -1) {
          wf.params.unshift(param1, param2);
        }
      }
    }
    return workflows;
  },

  _computeReadableDate(date) {
    return moment.utc(date).fromNow();
  },

  _showDialog(info) {
    const dialog = this.shadowRoot.querySelector('dialog-element');
    if (info) {
      Object.keys(info).forEach(i => {
        dialog[i] = info[i];
      });
    }
    dialog._openDialog();
  },

  _workflowNavigation(action) {
    this.$.workflows.classList.add('open');
    this.set('workflowsOpen', true);
    const pages = this.$.workflowsView.children;
    [].forEach.call(pages, p => {
      p.setAttribute('show', false);
    });
    const page = this.shadowRoot.querySelector(`#${action}show`);
    if (page) {
      page.setAttribute('show', true);
    }
  },

  _quickActionsNavigation(e) {
    // console.log(e);
    this.selected = 1;
    this._workflowNavigation(e.detail.name || e.target.id);
  },

  doWorkflow(e) {
    const action = e.target.id;
    this.$.workflows.classList.add('open');
    this.set('workflowsOpen', true);
    this.$.workflowRequest.url = `/api/v1/stacks/${this.stack.id}`;
    this.$.workflowRequest.headers = {
      'csrf-token': CSRFToken.value,
      'Content-Type': 'application/json',
    };
    this.$.workflowRequest.body = {
      workflow: action,
    };
    if (action === 'install') {
      this.$.deploynow.classList.add('hidden');
      this.$.workflowRequest.body.inputs = this.stack.inputs.install;
    }
    this.$.workflowRequest.generateRequest();
  },

  deployNowWork() {
    const action = 'install';
    this.$.workflowRequest.url = `/api/v1/stacks/${this.stack.id}`;
    this.$.workflowRequest.headers = {
      'csrf-token': CSRFToken.value,
      'Content-Type': 'application/json',
    };

    this.$.workflowRequest.body = {
      workflow: action,
      inputs: this.stack.inputs.install,
    };

    this.$.deploynow.classList.add('hidden');
    this.$.workflowRequest.generateRequest();
  },

  cancelWorkflow(_e) {
    this.$.cancelJob.headers = {
      'csrf-token': CSRFToken.value,
      'Content-Type': 'application/json',
    };
    this.$.cancelJob.generateRequest();
  },

  handleCanceled(_e) {},
  handleWorkflowRequest(_e) {},

  handleWorkflowResponse(_e) {
    this._closeworkflows();
  },

  handleWorkflowError(_e) {},

  stackoutputsChanged(outputs) {
    this.$.stackOutputs.innerHTML =
      this.stack &&
      outputs &&
      this._makeString(outputs).replace(
        new RegExp('mycontext', 'g'),
        this.stack.name
      );
  },

  _makeString(info) {
    if (info) return anchorme(YAML.stringify(info).replace(/'/g, '')); // eslint-disable-line no-undef
    return '';
  },

  newStackPage(_id) {
    console.log('un setting interval for', this.intervalID);
    window.clearInterval(this.intervalID);
    this.intervalID = null;
    const xterm = this.shadowRoot.querySelector('xterm-dialog');
    if (xterm) xterm.remove();
    this.set('showOutput', false);
    this.set('delete_request', false);
    // this.showLogs = false;

    if (this.stack) {
      this.set('itemArray', [this.stack]);
    }
  },

  _computeIsloading(_stack) {
    return !this.stack;
  },

  getScriptlink(id) {
    if (id && this.model.scripts[id])
      return `/scripts/${this.model.scripts[id].id}`;
    return '';
  },

  getScriptName(id) {
    if (id && this.model.scripts[id]) return this.model.scripts[id].name;
    return '';
  },

  isEmpty(arr) {
    return !arr || arr.length === 0;
  },
});
