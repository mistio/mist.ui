/* eslint-disable lit-a11y/anchor-is-valid */
import '@polymer/paper-button/paper-button.js';
import '@polymer/paper-input/paper-input.js';
import '@polymer/paper-spinner/paper-spinner.js';
import '@polymer/paper-fab/paper-fab.js';
import './section-tile/section-tile.js';
import './app-incidents/app-incidents.js';
import './app-costs/app-costs.js';
import '@polymer/paper-card/paper-card.js';
import '@polymer/paper-icon-button/paper-icon-button.js';
import '@polymer/iron-icons/iron-icons.js';
import '@polymer/paper-item/paper-item.js';
import '@polymer/paper-menu-button/paper-menu-button.js';
import '@polymer/paper-input/paper-textarea.js';
import '@polymer/paper-input/paper-input-behavior.js';
import '@polymer/paper-input/paper-input-addon-behavior.js';
import '@polymer/paper-dropdown-menu/paper-dropdown-menu.js';
import '@mistio/mist-list/mist-list.js';
import './onb-element/onb-element.js';
import './clouds/cloud-chip.js';
import moment from 'moment/src/moment.js';
import { PolymerElement } from '@polymer/polymer/polymer-element.js';
import { html } from '@polymer/polymer/lib/utils/html-tag.js';
import { mixinBehaviors } from '@polymer/polymer/lib/legacy/class.js';
import { timeOut } from '@polymer/polymer/lib/utils/async.js';

/* eslint-disable class-methods-use-this */
export default class PageDashboard extends mixinBehaviors(
  [window.rbac],
  PolymerElement
) {
  static get is() {
    return 'page-dashboard';
  }

  static get template() {
    return html`
      <style include="headings shared-styles">
        :host {
          --layout-margin: 16px;
          background-color: #eee;
          position: relative;
        }

        #content {
          background-color: var(--base-background-color);
          display: block;
        }

        paper-material.logs {
          overflow: visible !important;
          padding: 0;
        }

        /* layout helper classes */
        #content {
          @apply --page-dashboard-content-mixin;
          padding: var(--page-dashboard-content-padding);
        }

        .flexchild {
          /*@apply --layout-flex;*/
          display: flex;
          flex-direction: row;
          flex: 1 100%;
        }

        .flex2child {
          /*@apply --layout-flex-2;*/
          display: flex;
          flex-direction: row;
          flex: 2 100%;
        }

        .search.active {
          left: 15px;
        }

        .clouds {
          min-height: 48px;
          transition: all 200ms ease-in;
          margin: -2px 8px 12px !important;
        }

        .clouds cloud-chip {
          cursor: pointer;
        }

        .clouds cloud-chip.online .icon {
          background-color: var(--green-color) !important;
          width: 32px;
          height: 32px;
          border-radius: 50%;
        }

        .clouds cloud-chip.offline .icon {
          background-color: var(--red-color) !important;
          width: 32px;
          height: 32px;
          border-radius: 50%;
        }

        paper-button.blue {
          line-height: 30px;
          font-weight: 500;
        }

        .sections {
          align-items: flex-start;
          /*margin-bottom: 1em;*/
          margin-bottom: 32px;
          width: 100%;
        }

        .costs,
        .incidents {
          /*margin-bottom: 1em;*/
          display: block;
          width: 100%;
        }

        .costs {
          margin-bottom: 32px;
        }

        a.main-section {
          min-width: 144px;
          flex-basis: 25%;
          max-width: 170px;
          flex-grow: initial;
        }

        .columns {
          /*@apply --layout-horizontal;*/
          display: flex;
          flex-direction: row;
          flex: 1 100%;
        }

        .left,
        .right,
        .top {
          margin: var(--layout-margin);
        }

        .left,
        .right {
          /*@apply --layout-vertical;*/
          display: flex;
          flex-direction: column;
          min-width: 400px;
          align-items: flex-start;
          flex-direction: column;
          flex: 1 50%;
        }

        .logs {
          width: 100%;
          height: auto;
        }

        .logs mist-list {
          margin: 0;
          padding: 0;
          width: 100%;
          font-size: 75%;
          min-height: 500px;
          --row-height: 48px;
        }

        .graphs {
          margin-bottom: 1em;
          width: 100%;
          padding: 16px;
          box-sizing: border-box;
          background-color: #fafafa;
        }

        @media screen and (max-width: 370px) {
          .left,
          .right,
          .top {
            margin: 8px;
          }

          .graphs {
            padding: 0;
          }
        }

        @media (max-width: 489px) {
          a.main-section {
            width: calc(100% - 1em);
          }
        }

        @media (max-width: 639px) {
          a.main-section:first-child {
            min-width: calc(100% - 1em);
          }
        }

        @media (max-width: 1186px) {
          .columns {
            /*@apply --layout-vertical;*/
            display: block;
          }
        }

        @media (min-width: 1900px) {
          .flex-horizontal-wide {
            /*@apply --layout-horizontal;*/
            display: flex;
            flex-direction: row;
            flex-wrap: wrap;
          }

          .onb-true.flex-horizontal-wide {
            /*@apply --layout-none;*/
            flex: none;
            display: block;
          }

          .flexchild-wide-top {
            flex: 1 100%;
          }
        }

        polyana-dashboard ::slotted(h3) {
          text-transform: uppercase;
          font-size: 16px;
          font-weight: 500;
          line-height: 36px;
        }

        polyana-dashboard {
          display: block;
          height: auto;
          overflow: hidden;
        }

        #content.onb-true {
          background: url('assets/onboarding/mount.svg') center bottom #eee
            no-repeat;
          padding-bottom: 0;
          min-height: 90vh;
          margin-right: -24px;
          margin-left: -24px;
          padding-left: 24px;
          padding-right: 24px;
        }

        .ovhid {
          overflow: hidden;
        }

        .onb.ovhid {
          height: calc(100vh + 184px);
          box-sizing: border-box;
          position: relative;
        }

        .wide {
          padding: 0.7em 1.5em;
        }

        .notice {
          background-color: #ffff8d;
          padding: 2px 16px;
          margin: 0 16px;
          z-index: 9;
          position: relative;
        }

        onb-element {
          position: relative;
          z-index: auto;
        }

        .is-loading {
          top: 70px;
          left: 0;
          position: fixed;
          right: 0;
          bottom: 0;
          display: block;
          height: 100vh;
          width: 100vw;
          background-color: #eee;
          z-index: 1;
        }

        .is-loading paper-spinner {
          width: 80px;
          height: 80px;
          margin: 10% auto;
          display: block;
        }

        .viewMore[closed='true'] {
          height: 0;
        }

        .viewMore[closed='false'] {
          height: auto;
        }

        #viewMore {
          opacity: 0.54;
        }

        .monitoring-on-missing-machines {
          padding-bottom: 16px;
        }

        /* iphone 6 plus*/
        @media screen and (max-width: 450px) {
          a.main-section {
            flex-basis: 50%;
          }

          .left,
          .right,
          .top {
            min-width: 100px;
          }
        }
      </style>
      <div
        id="content"
        class$="flex-horizontal-wide onb-[[!showDashboard]]"
        main
      >
        <template is="dom-if" if="[[showDashboard]]">
          <div class="clouds top flexchild-wide-top">
            <div id="cloudslist">
              <template
                is="dom-repeat"
                items="[[_getFilteredResources(model.clouds,q)]]"
              >
                <a class="cloud-chip" href="/clouds/[[item.id]]">
                  <cloud-chip
                    class$="link [[isOnline(item)]] [[isOffline(item)]]"
                    index$="[[index]]"
                    id$="[[item.id]]"
                  >
                    <div class="icon" slot="icon"></div>
                    <div class="cloud-name" slot="cloud-name">
                      [[item.name]]
                    </div>
                  </cloud-chip>
                </a>
              </template>
            </div>
          </div>
          <div class="columns">
            <div id="leftcolumn" class="left">
              <div class="incidents">
                <app-incidents
                  model="[[model]]"
                  xsmallscreen="[[xsmallscreen]]"
                >
                </app-incidents>
              </div>
              <div class="sections layout horizontal wrap">
                <template is="dom-repeat" items="{{sectionsArray}}">
                  <template is="dom-if" if="[[item.tile]]">
                    <a
                      href$="/[[item.id]]"
                      on-tap="clearSearch"
                      class="main-section flex"
                      hidden$="[[_isHidden(item, item.count, sectionsArray)]]"
                    >
                      <section-tile
                        name$="[[item.id]]"
                        color="[[item.color]]"
                        icon="[[item.icon]]"
                        count="[[_getSectionCount(item.id,sectionsArray,q)]]"
                      >
                      </section-tile>
                    </a>
                  </template>
                </template>
              </div>
              <template is="dom-if" if="[[monitoredResources.length]]" restamp>
                <paper-material class="graphs">
                  <polyana-dashboard
                    id="dashboard"
                    uri="/api/v1/dashboard"
                    datasources="[[datasources]]"
                    replace-targets="[[replaceTargets]]"
                  ></polyana-dashboard>
                </paper-material>
              </template>
            </div>
            <div class="left">
              <div class="costs">
                <app-costs
                  model="[[model]]"
                  xsmallscreen="[[xsmallscreen]]"
                  docs="[[docs]]"
                  currency="[[currency]]"
                  q="[[q]]"
                  hidden$="[[!checkPerm('cloud', 'read_cost')]]"
                >
                </app-costs>
              </div>
              <template is="dom-if" if="[[model.org]]" restamp>
                <paper-material id="rightcolumn" class="logs">
                  <mist-list
                    id="logs"
                    timeseries
                    expands
                    searchable
                    toolbar
                    column-menu
                    resizable
                    streaming
                    infinite
                    rest
                    apiurl="/api/v1/logs"
                    name="all logs"
                    frozen="[[_getFrozenLogColumn()]]"
                    visible="[[_getVisibleLogColumns()]]"
                    renderers="[[_getLogRenderers()]]"
                    base-filter="owner_id:[[model.org.id]]"
                    primary-field-name="time"
                    frozen-width="100"
                  ></mist-list>
                </paper-material>
              </template>
            </div>
          </div>
        </template>
        <template is="dom-if" if="[[!showDashboard]]">
          <onb-element model="[[model]]"></onb-element>
        </template>
        <template is="dom-if" if="[[model.org]]" restamp>
          <div
            class="absolute-bottom-right"
            hidden$="[[!checkPerm('cloud', 'add')]]"
          >
            <a href="/clouds/+add" on-tap="_fabTap">
              <paper-fab id="addBtn" icon="cloud"></paper-fab>
            </a>
          </div>
        </template>
        <div class="is-loading" hidden$="[[!model.onboarding.isLoadingClouds]]">
          <paper-spinner
            active$="[[model.onboarding.isLoadingClouds]]"
          ></paper-spinner>
        </div>
      </div>
      <iron-ajax
        id="monitoringRequest"
        method="POST"
        on-response="_monitoringResponse"
        on-error="_monitoringError"
        on-request="_monitoringRequest"
        handle-as="xml"
      ></iron-ajax>
    `;
  }

  // enableCustomStyleProperties: true,
  // behaviors: [window.rbac],
  static get properties() {
    return {
      model: {
        type: Object,
      },
      q: {
        type: String,
        notify: true,
      },
      dashboard: {
        type: Object,
      },
      replaceTargets: {
        type: Object,
        computed: '_computeReplaceTargets(monitoredResources.length)',
      },
      openedCloud: {
        type: String,
      },
      showDashboard: {
        type: Boolean,
        // value: true,
        computed:
          '_computeshowDashboard(model.cloudsArray.length, model.onboarding.isLoadingClouds)',
        notify: true,
      },
      datasources: {
        type: Array,
        value() {
          return [
            {
              id: 1,
              orgId: 1,
              name: 'mist.monitor',
              type: 'mist.monitor',
              uri: '/api/v1/stats',
            },
          ];
        },
      },
      sidebarIsOpen: {
        type: Boolean,
        value: true,
      },
      matrix: {
        type: Array,
      },
      xsmallscreen: {
        type: Boolean,
      },
      sectionsArray: {
        type: Array,
        computed: '_toArray(model.sections, model.sections.*)',
      },
      docs: {
        type: String,
        value: '',
      },
      currency: {
        type: Object,
      },
      monitoredResources: {
        type: Array,
        computed: '_computeMonitoredResources(model.machines.*)',
      },
    };
  }

  static get observers() {
    return [
      'cloudLayoutMatrix(model.clouds.*, sidebarIsOpen)',
      '_importPolyana(monitoredResources.length)',
    ];
  }

  ready() {
    super.ready();
    this.addEventListener('close-cloud-info', this._closeCloudChips);
    console.log('ready dashboard');
    // initialise chips position matrix
    const that = this;
    timeOut.run(() => {
      that.cloudLayoutMatrix(that.model.clouds, that.sidebarIsOpen);
    }, 50);
  }

  _computeMonitoredResources(_machines) {
    return Object.values(this.model.machines).filter(
      m => m && m.monitoring.hasmonitoring
    );
  }

  _importPolyana(resourceCount) {
    if (resourceCount) {
      import('@mistio/polyana-dashboard/polyana-dashboard.js').then(
        () => {
          console.log('imported polyana-dashboard');
        },
        reason => {
          console.error('Failed to import polyana-dashboard:', reason);
        }
      );
      const that = this;
      setTimeout(() => {
        const panel = that.shadowRoot
          .querySelector('.graphs')
          .querySelector('#dashboard')
          .shadowRoot.querySelector('#panel-0');
        if (panel && panel.loading) {
          panel._generateDataRequest();
        }
      }, 10000);
    }
  }

  isOnline(cloud) {
    return cloud.state === 'online' && 'online';
  }

  isOffline(cloud) {
    return cloud.state === 'offline' && 'offline';
  }

  _computeHasIncidents(_incidents) {
    // incidents must be unresolved to count
    return !!(
      this.model.incidents &&
      Object.values(this.model.incidents).filter(
        incident => !incident.finished_at,
        this
      ).length
    );
  }

  _computeshowDashboard(cloudslength, isLoadingClouds) {
    let show;
    if (cloudslength > 0 && isLoadingClouds === false) {
      show = true;
    } else {
      show = false;
      // TODO: does not work. hides no matter
      // this.hideSidebar();
    }
    return show;
  }

  hideSidebar() {
    // if we are on boarding, close sidebar for focus
    window.setTimeout(() => {
      const sidebar = document.querySelector('mist-sidebar');
      const content = document.querySelector('iron-pages');
      sidebar.classList.add('close');
      content.classList.add('center');
    }, 2400);
    this.set('sidebarIsOpen', false);
  }

  _computeReplaceTargets(_resourceCount) {
    const ret = {};
    for (let i = 0; i < this.monitoredResources.length; i++) {
      ret[this.monitoredResources[i].id] = this.monitoredResources[i].name;
    }
    return ret;
  }

  _closeCloudChips() {
    const cloudChips = this.shadowRoot.querySelectorAll('cloud-chip');
    [].forEach.call(cloudChips, (el, _index) => {
      el.removeAttribute('opened');
    });
    this.set('openedCloud', '');
  }

  showSidebar() {
    // show sidebar for navigation
    window.setTimeout(() => {
      const sidebar = document.querySelector('mist-sidebar');
      const content = document.querySelector('iron-pages');
      sidebar.classList.remove('close');
      content.classList.remove('center');
    }, 200);
    this.set('sidebarIsOpen', true);
  }

  cloudLayoutMatrix(_clouds, _sidebarOpen) {
    // construct a reference matrix of the chips offsetTops
    const chips = document.querySelectorAll('cloud-chip');
    const matrix = [];
    if (chips) {
      [].forEach.call(chips, c => {
        matrix.push(c.offsetTop);
      });
      this.set('matrix', matrix);
    }
  }

  indexOfLast(index) {
    // calculate the index of the first chip of the next row
    const ref = this.matrix[index];
    let targetIndex;
    const nextInd = this.matrix.find((n, ind) => {
      targetIndex = ind;
      return n > ref;
    });
    // or if the first chip of the next row does not exist, set index to the last chip
    if (!nextInd) {
      targetIndex = this.matrix.length;
    }
    return targetIndex;
  }

  showLoadOnAll(machines) {
    // show load on all if at least one machine has activated monitoring
    let show = false;
    if (machines) {
      Object.keys(machines).forEach(p => {
        if (machines[p].installation_status.activated_at) {
          show = true;
        }
      });
    }
    return show;
  }

  _computeName(item) {
    if (this.model && this.model.clouds && this.model.clouds[item])
      return this.model.clouds[item].name;
    return item;
  }

  _fabTap() {
    this.dispatchEvent(
      new CustomEvent('user-action', {
        bubbles: true,
        composed: true,
        detail: 'add cloud fab click',
      })
    );
  }

  _isHidden(item, _count) {
    if (item.hideZero && item.count === 0) return true;
    return false;
  }

  _getLogRenderers() {
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
        title: 'user',
        body: item => {
          if (
            _this.model &&
            _this.model.members &&
            item in _this.model.members &&
            _this.model.members[item]
          ) {
            let name = '';
            const m = _this.model.members[item];
            if (m.first_name) name += m.first_name;
            if (m.last_name) name += ` ${m.last_name}`;
            if (!name.length) name += m.email || m.username;
            return `<a href="/members/${item}">${name}</a>`;
          }
          if (item) return item;
          return '';
        },
      },
    };
  }

  _getVisibleLogColumns() {
    return ['type', 'action', 'user_id'];
  }

  _getFrozenLogColumn() {
    return ['time'];
  }

  clearSearch(_e) {
    this.dispatchEvent(
      new CustomEvent('clear-search-on-nav', { bubbles: true, composed: true })
    );
  }

  _toArray(x, _z) {
    if (x) {
      return Object.keys(x).map(y => x[y]);
    }
    return [];
  }

  _getFilteredResources(resources, q) {
    let owned;
    if (q === 'owner:$me' && this.model && resources) {
      owned = Object.values(resources).filter(
        item => item.owned_by === this.model.user.id
      );
    }
    return owned !== undefined ? owned : Object.values(resources);
  }

  _getSectionCount(name, _sections, q) {
    let count;
    if (q === 'owner:$me' && this.model && this.model[name]) {
      count = Object.values(this.model[name]).filter(
        item => item.owned_by === this.model.user.id
      ).length;
    }
    return count !== undefined ? count : this.model.sections[name].count;
  }
}

customElements.define('page-dashboard', PageDashboard);
