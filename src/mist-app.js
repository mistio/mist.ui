/* <script type="text/javascript" src="../bower_components/web-animations-js/web-animations-next-lite.min.js"></script> */
/*
  FIXME(polymer-modulizer): the above comments were extracted
  from HTML and may be out of place here. Review them and
  then delete this comment!
*/
import '@polymer/polymer/polymer-legacy.js';
import '@polymer/app-route/app-location.js';
import '@polymer/app-route/app-route.js';
import '@polymer/app-layout/app-layout.js';
import '@polymer/app-layout/app-drawer-layout/app-drawer-layout.js';
import '@polymer/app-layout/app-drawer/app-drawer.js';
import '@polymer/app-layout/app-header/app-header.js';
import '@polymer/app-layout/app-toolbar/app-toolbar.js';
import '@polymer/app-layout/app-header-layout/app-header-layout.js';
import '@polymer/paper-material/paper-material.js';
import '@polymer/paper-icon-button/paper-icon-button.js';
import '@polymer/iron-icons/iron-icons.js';
import '@polymer/iron-pages/iron-pages.js';
import '@polymer/iron-selector/iron-selector.js';
import '@polymer/iron-media-query/iron-media-query.js';
import '@polymer/paper-spinner/paper-spinner.js';
import '@polymer/paper-toast/paper-toast.js';
// import '../../../app-notifications/app-notifications.js';
import { IronResizableBehavior } from '@polymer/iron-resizable-behavior/iron-resizable-behavior.js';
import '@vaadin/vaadin-dialog/vaadin-dialog.js';
import '@vaadin/vaadin-icons/vaadin-icons.js';
import '@mistio/mist-list/mist-list.js';
// import '../../../web-animations-js/web-animations-next.min.js';
import './styles/shared-styles.js';
import './mist-header/mist-header.js';
import './mist-sidebar.js';
import './app-icons/app-icons.js';
import './mist-socket.js';
import './mist-notice.js';
import './mist-icons.js';
import './organizations/organization-add.js';
import './account/plan-purchase.js';
import { setPassiveTouchGestures } from '@polymer/polymer/lib/utils/settings.js';
import { Polymer } from '@polymer/polymer/lib/legacy/polymer-fn.js';
import { dom } from '@polymer/polymer/lib/legacy/polymer.dom.js';
import { _generateMap } from './helpers/utils.js'
import PROVIDERS from './helpers/providers.js';

const documentContainer = document.createElement('template');
documentContainer.innerHTML = `<dom-module id="mist-app">
    <template>
        <style include="custom-style">
        :host [hidden] {
            display: none !important;
        }
        :host {
            background-color: var(--base-background-color);
        }

        app-header-layout {
            background-color: var(--base-background-color);
        }

        iron-pages {
            margin: 24px 24px  0 234px;
            transition: margin-left 350ms ease-in-out;
        }

        :host([center-content]) iron-pages {
            margin-left: 24px;
        }

        :host([center-content]) iron-pages::slotted(#content) {
            padding: 0;
        }

        iron-pages::slotted(>*) {
            background-color: var(--base-background-color);
            position: relative;
        }

        page-dashboard,
        page-clouds,
        page-incidents,
        page-insights,
        page-keys,
        page-machines,
        page-members,
        page-my-account,
        page-networks,
        page-not-found,
        page-rules,
        page-schedules,
        page-scripts,
        page-stacks,
        page-teams,
        page-templates,
        page-tunnels,
        page-volumes,
        page-zones {
            min-height: calc(94vh - 64px);
        }

        iron-pages::slotted(mist-list) {
            font-size: 14px;
        }

        iron-pages::slotted(mist-list paper-button[dialog-confirm]) {
            background-color: var(--mist-blue);
            font-weight: 500;
            color: #fff;
        }

        iron-pages::slotted(mist-list::slotted(.tag)) {
            display: inline;
            background-color: #888;
            color: #fff;
            padding: 2px 0.5em;
            margin: 0 1px;
            border-radius: 2px;
            letter-spacing: .4px;
            font-weight: 500 !important;
            word-break: break-all;
            max-width: 250px;
            white-space: nowrap;
            overflow: hidden;
            text-overflow: ellipsis;
        }

        .is-loading-html {
            top: 70px;
            left: 234px;
            right: 0;
            bottom: 0;
            position: absolute;
            height: 93%;
            background-color: var(--base-background-color);
            display: block;
            z-index: 0;
        }

        :host([center-content]) #main-loader.is-loading-html {
            left: 0;
        }

        #main-loader {
            overflow: hidden;
            display: none;
        }

        #main-loader.active-true {
            display: block;
        }

        paper-spinner {
            width: 80px;
            height: 80px;
            margin: 20% auto;
            display: block;
        }

        @media screen and (max-width: 650px) {
            iron-pages::slotted(#content) {
                padding: 0;
            }
        }

        @media screen and (max-width: 768px) {
            iron-pages {
                padding: 0;
            }

            iron-pages::slotted(.columns) {
                display: block;
            }
        }
        </style>
        <style include="shared-styles"></style>
        <iron-media-query query="(max-width: 1024px)" query-matches="{{smallscreen}}"></iron-media-query>
        <iron-media-query query="(max-width: 600px)" query-matches="{{xsmallscreen}}"></iron-media-query>
        <app-location id="appLocation" route="{{route}}"></app-location>
        <app-route route="{{route}}" pattern="/:page" data="{{routeData}}" tail="{{subroute}}"></app-route>
        <app-header-layout mode="standard" class="fit" fullbleed="">
            <mist-notice model="[[model]]" class="paper-header"></mist-notice>
            <app-header slot="header" fixed="" shadow="" hidden$="[[fullscreen]]">
                <mist-header sticky="" model="[[model]]" title="[[page]]" query="{{q}}" class="paper-header" count="[[count]]" viewing-list="[[viewingList]]" user-menu-opened="{{userMenuOpened}}" ownership="[[model.org.ownership_enabled]]" visible-suggestions="{{visibleSuggestions}}"></mist-header>
            </app-header>
            <mist-sidebar id="sidebar" model="[[model]]" tag="[[tag]]" current="{{page}}" drawer="" smallscreen="[[smallscreen]]" xsmallscreen="[[xsmallscreen]]" isclosed="{{sidebarIsClosed}}"></mist-sidebar>
            <div id="main-loader" class$="is-loading-html active-[[loading]]">
                <paper-spinner active="[[loading]]"></paper-spinner>
            </div>
            <iron-pages id="iron-pages" role="main" selected="[[page]]" attr-for-selected="name" fallback-selection="not-found">
                <page-dashboard name="dashboard" model="[[model]]" q="[[model.sections.dashboard.q]]" viewing-dashboard="[[_isPage('dashboard', page)]]" xsmallscreen="[[xsmallscreen]]" docs="[[config.features.docs]]" currency="[[config.features.currency]]"></page-dashboard>
                <template is="dom-if" restamp="" if="[[model.sections]]">
                    <page-clouds name="clouds" route="{{subroute}}" model="[[model]]" enable-monitoring="[[config.features.monitoring]]" docs="[[config.features.docs]]" portal-name="[[config.portal_name]]" enable-billing="[[config.features.billing]]"></page-clouds>
                    <page-machines name="machines" route="{{subroute}}" model="[[model]]" monitoring="[[config.features.monitoring]]" docs="[[config.features.docs]]" portal-name="[[config.portal_name]]" currency="[[config.features.currency]]"></page-machines>
                    <page-images name="images" route="{{subroute}}" model="[[model]]" portal-name="[[config.portal_name]]"></page-images>
                    <page-keys name="keys" route="{{subroute}}" model="[[model]]" config="[[config]]"></page-keys>
                    <page-networks name="networks" route="{{subroute}}" model="[[model]]"></page-networks>
                    <page-volumes name="volumes" route="{{subroute}}" model="[[model]]"></page-volumes>
                    <page-zones name="zones" route="{{subroute}}" model="[[model]]"></page-zones>
                    <page-tunnels name="tunnels" route="{{subroute}}" model="[[model]]" hidden$="[[!config.features.tunnels]]"></page-tunnels>
                    <page-scripts name="scripts" route="{{subroute}}" model="[[model]]" docs="[[config.features.docs]]"></page-scripts>
                    <page-schedules name="schedules" route="{{subroute}}" model="[[model]]" docs="[[config.features.docs]]" currency="[[config.features.currency]]"></page-schedules>
                    <page-rules name="rules" route="{{subroute}}" model="[[model]]" docs="[[config.features.docs]]" features="[[config.features]]"></page-rules>
                    <page-templates name="templates" route="{{subroute}}" model="[[model]]" hidden$="[[!config.features.orchestration]]"></page-templates>
                    <page-stacks name="stacks" route="{{subroute}}" model="[[model]]" hidden$="[[!config.features.orchestration]]"></page-stacks>
                    <page-teams name="teams" route="{{subroute}}" model="[[model]]" rbac="[[config.features.rbac]]" billing="[[config.features.billing]]" cta="[[config.cta.rbac]]" email="[[config.email]]" docs="[[config.features.docs]]"></page-teams>
                    <page-members name="members" route="{{subroute}}" model="[[model]]"></page-members>
                    <page-incidents name="incidents" route="{{subroute}}" model="[[model]]"></page-incidents>
                    <page-insights name="insights" route="{{subroute}}" model="[[model]]" email="[[config.email]]" currency="[[config.features.currency]]" insights-enabled="[[model.org.insights_enabled]]" hidden$="[[!config.features.insights]]"></page-insights>
                </template>
                <page-my-account name="my-account" route="{{subroute}}" user="[[model.user]]" org="[[model.org]]" machines="[[model.machines]]" tokens="[[model.tokens]]" sessions="[[model.sessions]]" config="[[config]]"></page-my-account>
                <page-not-found name="not-found" route="{{subroute}}"></page-not-found>
            </iron-pages>
            <paper-toast id="mist-toast"></paper-toast>
        </app-header-layout>
        <mist-socket model="{{model}}"></mist-socket>
        <!--app-notifications id="desktop-notifier" on-click="handleDesktopNotificationClick"></app-notifications-->
        <organization-add id="organizationAdd" current-org="[[model.org]]"></organization-add>
        <plan-purchase id="mistAppCcRequired" org="[[model.org]]" button-text="Enable"></plan-purchase>
    </template>
    
</dom-module>`;

document.head.appendChild(documentContainer.content);

/*
  FIXME(polymer-modulizer): the above comments were extracted
  from HTML and may be out of place here. Review them and
  then delete this comment!
*/
setPassiveTouchGestures(true);
Polymer({
    is: 'mist-app',
    behaviors: [
        IronResizableBehavior // , rbacBehavior
    ],

    properties: {
        page: {
            type: String,
            reflectToAttribute: true,
            observer: '_pageChanged'
        },
        smallscreen: {
            type: Boolean
        },
        xsmallscreen: {
            type: Boolean
        },
        sidebarIsClosed: {
            type: Boolean
        },
        centerContent: {
            type: Boolean,
            value: false,
            computed: '_computeCenterContent(sidebarIsClosed, smallscreen)',
            reflectToAttribute: true
        },
        model: {
            type: Object,
            observer: '_observeModel',
            notify: true
        },
        title: {
            type: String,
            value: "",
        },
        q: { // search query
            type: String,
            value: ''
        },
        tag: {
            type: String
        },
        routeData: {
            type: Object
        },
        subroute: {
            type: Object
        },
        viewingList: {
            type: Boolean,
            computed: '_computeViewingList(subroute)'
        },
        fingerprint: {
            type: String,
            value: ''
        },
        loading: {
            type: Boolean,
            value: true
        },
        count: {
            type: Number
        },
        config: {
            type: Object,
            value () { return {} }
        },
        userMenuOpened: {
            type: Boolean
        },
        ccRequired: {
            type: Boolean,
            value: false,
            computed: '_computeCcRequired(config.features.*, model.org.*, model.cloudsArray.length)'
        },
        visibleSuggestions: {
            type: Boolean,
            value: false
        },
        fullscreen: {
            type: Boolean,
            value: false
        },
        streamingTargets: {
            type: Array,
            value () { return [] }
        }
    },

    listeners: {
        'mist-sidebar-toggle': 'mistSidebarToggle',
        'toast': 'showToast',
        'desktop-notification': 'showDesktopNotification',
        'search': 'updateSearchQuery',
        'open-and-select': 'openAndSelect',
        'cloud-edit-key': 'openCloudEdit',
        'update-keys': 'updateKeys',
        'update-scripts': 'updateScripts',
        'user-action': '_onUserAction',
        'add-new-images': 'addImages',
        'go-to': 'setLocationPath',
        // 'mist-list-filtered-items-length-changed': 'setHeaderCount', // disable header count and sections count updates
        'export-list-csv': '_exportCsvMessage',
        'add-org': '_addOrg',
        'tap': 'closeIfClickedElsewhere',
        'enter-fullscreen': 'enterFullscreen',
        'exit-fullscreen': 'exitFullscreen',
        'streaming-list-attached': '_registerStreamingTarget',
        'streaming-list-detached': '_unregisterStreamingTarget',
        'forward-log': '_logReceived',
        'cc-dismiss': '_ccDismissed',
        'panel-added': 'panelAdded',
        'update-dashboard': '_forwardEvent',
        'import-script': '_importScript',
        'list-attached': '_listAttached',
        'resize': '_stopPropagation',
        'cloud-delete': '_cleanUpModelFromCloudResources'
    },

    observers: [
        '_observeKeys(model.keys.splices)',
        '_observeScripts(model.scripts.splices)',
        '_routePageChanged(routeData.page, subroute.path)',
        '_sizeChanged(smallscreen)',
        '_configUpdated(config)',
        '_ccRequiredChanged(ccRequired)',
        // '_qChanged(q)' // disable sections count updates
    ],

    _cleanUpModelFromCloudResources(e) {
        if (this.shadowRoot.querySelector('mist-socket') && e.detail.cloud)
            this.shadowRoot.querySelector('mist-socket').cleanUpResources(e.detail.cloud)
    },

    _listAttached(e) {
        if (e.detail && e.detail.id) {
            const key = e.detail.id.replace("List", "");
            if (this.model.sections[key]) {
                let local = localStorage.getItem(`mist-filter#topFilter/all-${key}/userFilter`);
                if (!local) {
                    local = localStorage.getItem('mist-filter#topFilter/all-resources/userFilter');
                }
                if (!local) {
                    local = this.model.sections[key].q
                }
                if (!local) {
                    local = '';
                }
                this.set(`model.sections.${key}.q`, `${local} `);
            }
        }
    },

    attached() {
        if (this.ccRequired) {
            this._ccDismissed();
        }
        if (!this.config.theme) {
            import('./styles/app-theme.js').then(
                console.log('Loaded default theme')
            );
        }
    },

    _observeKeys(_keysSplices) {
        this.fire('update-keys');
    },

    _observeScripts(_scriptsSplices) {
        this.fire('update-scripts');
    },

    _forwardEvent (_e) {
        this.shadowRoot.querySelector('page-machines').shadowRoot.querySelector('machine-page').shadowRoot.querySelector('mist-monitoring').fire('update-dashboard');
    },

    mistSidebarToggle () {
        if (this.shadowRoot.querySelector('mist-sidebar')) {
            this.shadowRoot.querySelector('mist-sidebar').toggleSidebar(); // update classes
        }  
    },

    _computeCcRequired(_org, _clouds) {
        if (!this.config || !this.config.features || !this.config.features.billing || !this.model.org || this.model.org.card || this.model.org.current_plan)
            return false;
        return !!this.model.cloudsArray.length;
    },

    _ccRequiredChanged(required) {
        if (required)
            this.$.mistAppCcRequired.open();
    },

    _ccDismissed() {
        if (this.ccRequired)
            this.async(() => {
                if (this.ccRequired)
                    this.$.mistAppCcRequired.open();
            }, 1000 * 60);
    },

    _sizeChanged(_smallscreen) {
        if (this.$.sidebar) {
            if (this.smallscreen) {
                this.$.sidebar.closeSidebar();
            } else {
                this.$.sidebar.openSidebar();
            }
        }
    },

    _computeCenterContent(_sidebarIsClosed, _smallscreen) {
        return this.sidebarIsClosed || this.smallscreen;
    },

    setHeaderCount(e) {
        if (!this._isPage('dashboard') && !this._isPage('my-account') && !this._isPage('insights')) {
            this.set('count', e.detail.length);
        } else {
            this.set('count', '');
        }
        this.set(`model.sections.${this.page}.count`, e.detail.length);
    },

    setLocationPath(e) {
        if (e.detail.url && this.$.appLocation) {
            this.$.appLocation.set('path', e.detail.url);
            if (e.detail.params) {
                this.$.appLocation.set('queryParams', e.detail.params);
            }
            // use in redirects to filtered lists, ex from ec2 cloud page to ec2 filtered machine list
            if (e.detail.search) {
                this.async(() => {
                    this.dispatchEvent(new CustomEvent('search', { bubbles: true, composed: true, detail: {page: e.detail.url.replace('/',''), q:e.detail.search} }));
                }, 400);
            }
        } else {
            console.error('redirect url could not be found...');
        }
    },

    showDesktopNotification(e) {
        const notifier = document.getElementById('desktop-notifier');
        notifier.show(e.detail.title, {
            "body": e.detail.body,
            "data": {
                "url": e.detail.url
            }
        });
    },

    handleDesktopNotificationClick(e) {
        if (e.detail.data.url) {
            window.history.pushState({}, null, e.detail.data.url);
            window.dispatchEvent(new CustomEvent('location-changed'));
            e.stopPropagation();
        }
    },

    showToast(e) {
        const toast = this.shadowRoot.querySelector('paper-toast#mist-toast')
        toast.show({
            text: e.detail.msg,
            duration: e.detail.duration
        });
    },

    addImages(e) {
        const {images} = e.detail;
        for (let i = 0; i < images.length; i++) {
            images[i].cloud = {
                'id': e.detail.cloud.id,
                'title': e.detail.cloud.title,
                'provider': e.detail.cloud.provider
            };
            this.push('model.imagesArray', images[i]);
            this.model.images[images[i].id] = images[i];
        }
    },

    openAndSelect(_e) {
        document.addEventListener('open-and-select', (e) => {
            this.shadowRoot.querySelector('machine-page machine-actions associate-key').openAndSelect(
                e);
        }, {passive: true});
    },

    openCloudEdit(_e) {
        document.addEventListener('cloud-edit-key', (e) => {
            this.shadowRoot.querySelector('cloud-page cloud-actions').openEditDialog(e);
        }, {passive: true});
    },

    updateKeys(e) {
        const pagesElement = this.shadowRoot.querySelector('app-header-layout').querySelector('iron-pages');
        if (pagesElement.querySelector('page-stacks') && pagesElement.querySelector('page-stacks').shadowRoot &&
            pagesElement.querySelector('page-stacks').shadowRoot.querySelector('stack-create')) {
            pagesElement.querySelector('page-stacks').shadowRoot.querySelector('stack-create').updateKeys(e);
        }
        if (pagesElement.querySelector('page-machines') && pagesElement.querySelector('page-machines').shadowRoot &&
            pagesElement.querySelector('page-machines').shadowRoot.querySelector('machine-create')) {
            pagesElement.querySelector('page-machines').shadowRoot.querySelector('machine-create').updateKeys(e);
        }
        if (pagesElement.querySelector('page-clouds') && pagesElement.querySelector('page-clouds').shadowRoot &&
            pagesElement.querySelector('page-clouds').shadowRoot.querySelector('cloud-add')) {
            pagesElement.querySelector('page-clouds').shadowRoot.querySelector('cloud-add').updateKeys(e);
        }
        if (pagesElement.querySelector('page-clouds') && pagesElement.querySelector('page-clouds').shadowRoot &&
            pagesElement.querySelector('page-clouds').shadowRoot.querySelector('cloud-edit')) {
            pagesElement.querySelector('page-clouds').shadowRoot.querySelector('cloud-edit').updateKeys(e);
        }
        if (pagesElement.querySelector('page-clouds') && pagesElement.querySelector('page-clouds').shadowRoot &&
            pagesElement.querySelector('page-clouds').shadowRoot.querySelector('other-cloud-add-machine')){
            pagesElement.querySelector('page-clouds').shadowRoot.querySelector('other-cloud-add-machine').updateKeys(e);
        }
    },

    updateScripts(e) {
        const pagesElement = this.shadowRoot.querySelector('app-header-layout').querySelector('iron-pages');
        if (pagesElement.querySelector('page-machines') && pagesElement.querySelector('page-machines').shadowRoot &&
            pagesElement.querySelector('page-machines').shadowRoot.querySelector('machine-create')) {
            pagesElement.querySelector('page-machines').shadowRoot.querySelector('machine-create').updateScripts(e);
        }
        if (pagesElement.querySelector('page-schedules') && pagesElement.querySelector('page-schedules').shadowRoot &&
            pagesElement.querySelector('page-schedules').shadowRoot.querySelector('schedule-add')) {
            pagesElement.querySelector('page-schedules').shadowRoot.querySelector('schedule-add').updateScripts(e);
        }
    },
    /* eslint-disable no-param-reassign */
    _routePageChanged(page, _subpath) {
        this.set('count','');
        if (this.smallscreen) {
            this.$.sidebar.closeSidebar();
        }
        if (['index.html', 'sign-up', 'sign-in'].indexOf(page) > -1)
            page = 'dashboard';
        this.page = page || 'dashboard';
        this.set('visibleSuggestions', false);
    },
    /* eslint-enable no-param-reassign */ 
    clearSearch() {
        document.querySelector('top-search').clearSearch();
        this.set('q', '');
        if (this.model && this.model.sections) {
            Object.keys(this.model.sections || {}).forEach((sec) => {
                this.set(`model.sections.${  sec  }.q`, '');
            });
        }
    },

    clearSearchPreservingFilters(_e) {
        let q = this.q || '';
            const filterOwner = q.indexOf('owner:') > -1;
            const ownerRegex = /owner:(\S*)\s?/;
            const owner = ownerRegex.exec(q) && ownerRegex.exec(q)[1];

        if (filterOwner && owner && owner.length) {
            q = q.replace('owner:', '').replace(`${owner  }`, '');
        }
        this.set('q', this.q.replace(q, ''));
        if (this.model && this.model.sections) {
            Object.keys(this.model.sections || {}).forEach((sec) => {
                this.set(`model.sections.${  sec  }.q`, this.q.replace(q, ''));
            });
        }
        this.dispatchEvent(new CustomEvent('search', { bubbles: true, composed: true, detail:  this.q.replace(q, '') }));
    },

    _pageChanged(page) {
        this.set('count','');
        this.set('loading', true);
        // Load page import on demand. Show 404 page if fails

        import(`./page-${page}.js`).then(this._hideLoader.bind(this),(reason)=>{console.log("FAILURE!! ", reason); this._showPage404();});
    },

    _hideLoader() {
        console.log("success");
        this.set('loading', false);
        this.$['iron-pages'].selected = this.page;
    },

    _showPage404() {
        // this.importHref(this.resolveUrl('page-not-found.html'), null, null, true);
        // this.page = 'not-found';
        this._hideLoader();
        import('./page-not-found.js').then(null);
    },

    _isPage(page) {
        return this.page === page;
    },

    updateSearchQuery(e) {
        if (e.detail !== undefined && e.detail.q !== undefined) {
            console.log('search: update Search Query', e.detail);
            if (e.detail.page && this.page === e.detail.page) {
                this.set(`model.sections.${  this.page  }.q`, e.detail.q || '');
            }
            this.set('q', e.detail.q);
        }
    },

    ready() {
        const model = {
            machines: {},
            clouds: {},
            cloudsArray: [],
            imagesArray: [],
            keysArray: [],
            networks: {},
            volumes: {},
            zones: {},
            tunnelsArray: [],
            scriptsArray: [],
            schedulesArray: [],
            stacksArray: [],
            templatesArray: [],
            teamsArray: [],
            teams: [],
            incidents: {},
            incidentsArray: [],
            jobs: {},
            shells: {},
            sessions: {},
            notificationsArray: [],
            pending: {
                clouds: true,
                monitoring: true
            },
            probes: {},
            monitoring: {},
            sections: {},
            onboarding: {
                isLoadingClouds: true,
                isLoadingMachines: true,
                isLoadingImages: true,
                isLoadingKeys: true,
                isLoadingNetworks: true,
                isLoadingZones: true,
                isLoadingTunnels: true,
                isLoadingScripts: true,
                isLoadingSchedules: true,
                isLoadingTemplates: true,
                isLoadingStacks: true,
                isLoadingTeams: true,
                isLoadingIncidents: true
            },
            permissions: {
                'cloud': [
                    'add',
                    'read',
                    'edit',
                    'remove',
                    'create_resources',
                    'edit_tags',
                    'read_logs',
                ],
                'location': [
                    'read',
                    'create_resources',
                ],
                'machine': [
                    'read',
                    'edit',
                    'create',
                    'edit_tags',
                    'edit_rules',
                    'edit_graphs',
                    'edit_custom_metrics',
                    'start',
                    'stop',
                    'reboot',
                    'destroy',
                    'resize',
                    'run_script',
                    'open_shell',
                    'associate_key',
                    'disassociate_key',
                    'read_logs',
                ],
                'network': [
                    'add',
                    'read',
                    'remove',
                    'edit_tags',
                    'edit_subnets',
                    'read_logs',
                ],
                'volume': [
                    'add',
                    'read',
                    'remove',
                    'attach',
                    'detach',
                    'read_logs',
                    'edit_tags'
                ],
                'script': [
                    'add',
                    'read',
                    'edit',
                    'run',
                    'remove',
                    'edit_tags',
                    'read_logs',
                ],
                'key': [
                    'add',
                    'read',
                    'read_private',
                    'edit',
                    'remove',
                    'edit_tags',
                    'read_logs',
                ],
                'template': [
                    'add',
                    'read',
                    'edit',
                    'remove',
                    'apply',
                    'edit_tags',
                    'read_logs',
                ],
                'stack': [
                    'create',
                    'read',
                    'edit',
                    'remove',
                    'run_workflow',
                    'edit_tags',
                    'read_logs',
                ],
                'zone': [
                    'add',
                    'read',
                    'remove',
                    'edit_tags',
                    'create_records',
                    'read_logs',
                ],
                'record': [
                    'add',
                    'read',
                    'remove',
                    'edit_tags',
                    'read_logs',
                ],
                'tunnel': [
                    'add',
                    'remove',
                    'edit',
                    'read',
                    'edit_tags',
                    'read_logs',
                ],
                'schedule': [
                    'add',
                    'read',
                    'edit',
                    'run',
                    'remove',
                    'edit_tags',
                    'read_logs',
                ],
                'image': [
                    'read',
                    'create_resources',
                    'edit_tags'
                ]
                // 'team': [
                //     'add',
                //     'read',
                //     'edit',
                //     'remove',
                //     'edit_tags',
                //     'read_logs',
                // ],
            }
        };

        for (let i = 1; i <= model.teamsArray.length; i++) {
            model.teams = model.teamsArray[i].teams[i].id;
        };
        this.set('model', model);
    },

    _configUpdated(config) {
        if (!Object.keys(config).length) return;
        const orchestration = this.config && this.config.features && this.config.features.orchestration ? this.config.features.orchestration : false;
        const tunnels = this.config && this.config.features && this.config.features.tunnels ? this.config.features.tunnels : false;
        const insights = this.config && this.config.features && this.config.features.insights ? this.config.features.insights : false;
        const currency = this.config && this.config.features && this.config.features.currency ? this.config.features.currency : {sign: '$', rate: 1};
            // currency =  {sign: '$', rate: 1}; 
            // test {sign: '₹', rate:0.014}
            // currency = {sign:'Rp', rate: 68.73};

        const cloudsCount = this.model.clouds ? Object.keys(this.model.clouds).length : 0;
        const stacksCount = this.model.stacks ? Object.keys(this.model.stacks).length : 0;
        const machinesCount = this.model.machines ? Object.keys(this.model.machines).length : 0;
        const volumesCount = this.model.volumes ? Object.keys(this.model.volumes).length : 0;
        const networksCount = this.model.networks ? Object.keys(this.model.networks).length : 0;
        const zonesCount = this.model.zones ? Object.keys(this.model.zones).length : 0;
        const keysCount = this.model.keys ? Object.keys(this.model.keys).length : 0;
        const imagesCount = this.model.images ? Object.keys(this.model.images).length : 0;
        const scriptsCount = this.model.scripts ? Object.keys(this.model.scripts).length : 0;
        const templatesCount = this.model.templates ? Object.keys(this.model.templates).length : 0;
        const tunnelsCount = this.model.tunnels ? Object.keys(this.model.tunnels).length : 0;
        const schedulesCount = this.model.schedules ? Object.keys(this.model.schedules).length : 0;
        const rulesCount = this.model.rules ? Object.keys(this.model.rules).length : 0;
        const teamsCount = this.model.teams ? Object.keys(this.model.teams).length : 0;
        const membersCount = this.model.members ? Object.keys(this.model.members).length : 0;

        const sectionsArray = [{
            id: 'dashboard',
            icon: 'icons:dashboard',
            color: '#424242',
            sidebar: true,
            tile: false,
            hr: true,
        }, {
            id: 'incidents',
            color: '#d96557',
            sidebar: false,
            tile: false,
            count: 0
        }, {
            id: 'clouds',
            color: '#424242',
            icon: 'cloud',
            add: '/clouds/+add',
            sidebar: true,
            tile: false,
            count: cloudsCount,
            hr: !orchestration
        }, {
            id: 'stacks',
            color: '#0277BD',
            icon: 'maps:layers',
            sidebar: orchestration,
            tile: orchestration,
            count: stacksCount,
            hr: true,
            hideZero: true,
            hideTileIfZero: true
        }, {
            id: 'machines',
            color: '#8c76d1',
            icon: 'hardware:computer',
            add: '/machines/+create',
            sidebar: true,
            tile: true,
            count: machinesCount
        }, {
            id: 'volumes',
            color: '#795548',
            icon: 'device:storage',
            add: '/volumes/+add',
            sidebar: true,
            tile: true,
            count: volumesCount,
            hideTileIfZero: true
        }, {
            id: 'networks',
            color: '#795548',
            icon: 'hardware:device-hub',
            add: '/networks/+add',
            sidebar: true,
            tile: true,
            count: networksCount,
            hideTileIfZero: true
        }, {
            id: 'zones',
            color: '#3F51B5',
            icon: 'icons:dns',
            add: '/zones/+add',
            sidebar: true,
            tile: true,
            count: zonesCount,
            hideTileIfZero: true
        }, {
            id: 'keys',
            color: '#009688',
            icon: 'communication:vpn-key',
            add: '/keys/+add',
            sidebar: true,
            tile: true,
            hr: true,
            count: keysCount,
            hideTileIfZero: true
        }, {
            id: 'images',
            color: '#0099cc',
            icon: 'image:collections',
            sidebar: true,
            tile: false,
            count: imagesCount,
            q: ''
        }, {
            id: 'scripts',
            color: '#D48900',
            icon: 'icons:code',
            add: '/scripts/+add',
            sidebar: true,
            tile: true,
            hr: !orchestration,
            count: scriptsCount,
            hideTileIfZero: true
        }, {
            id: 'templates',
            color: '#0097A7',
            icon: 'icons:extension',
            add: '/templates/+add',
            sidebar: orchestration,
            tile: orchestration,
            hr: true,
            count: templatesCount,
            hideTileIfZero: true
        }, {
            id: 'tunnels',
            color: '#795548',
            icon: 'editor:merge-type',
            add: '/tunnels/+add',
            sidebar: tunnels,
            tile: false,
            count: tunnelsCount,
            hideTileIfZero: true
        }, {
            id: 'schedules',
            color: '#43A047',
            icon: 'event',
            add: '/schedules/+add',
            sidebar: true,
            tile: true,
            count: schedulesCount
        }, {
            id: 'rules',
            color: '#42424242',
            icon: 'vaadin:scale-unbalance',
            add: '/rules/+add',
            sidebar: true,
            tile: true,
            count: rulesCount
        }, {
            id: 'teams',
            color: '#607D8B',
            icon: 'social:people',
            sidebar: true,
            tile: true,
            count: teamsCount,
            hr: insights
        }, {
            id: 'my-account',
            color: '#2F2F3E',
            icon: 'account-circle',
            count: null
        }, {
            id: 'members',
            color: '#607D8B',
            icon: 'social:people',
            count: membersCount
        }, {
            id: 'insights',
            color: '#2F2F3E',
            icon: 'icons:trending-up',
            sidebar: insights,
            tile: false
        }];

        this.set('config.features.currency', currency);
        this.set('model.sections', _generateMap(sectionsArray));
        console.log('config updated', this.model.sections)
        if (!this.config || !this.config.features || !this.config.features.docs) {
            for (let i = 0; i < PROVIDERS.length; i++) {
                for (let j = 0; j < PROVIDERS[i].options.length; j++) {
                    PROVIDERS[i].options[j].helpHref = '';
                }
            }
        }
    },

    _onUserAction(event) {
        // console.log('user-action', event);
        if (typeof gtag === 'function') { // eslint-disable-line no-undef
            gtag('event', event.detail, { // eslint-disable-line no-undef
                'event_category': 'ui'
            });
        }
        if (!this.config || !this.config.features || !this.config.features.ab)
            return;
        const xhr = new XMLHttpRequest();
        if (!this.fingerprint) {
            (async () => {
                const obj_ = await import('../node_modules/@fingerprintjs/fingerprintjs');
                const FingerprintJS = obj_.default;
                const fp = await FingerprintJS.load();
                const result = await fp.get();
                // this will use all available fingerprinting sources
                this.fingerprint = result.visitorId;
                const componentMap = result.components;
                const payload = {
                    'action': event.detail,
                    'fingerprint': result.visitorId,
                    'resolution': componentMap.screenResolution,
                    'platform': componentMap.platform,
                    'browser': this._getBrowser(),
                    'tz': componentMap.timezone_offset
                };
                if (document.referrer)
                    payload.referrer = document.referrer;
                xhr.open('GET', `/api/v1/logs/ui?b=${  btoa(JSON.stringify(payload))}`);
                xhr.send();
            })();
        } else {
            const payload = {
                'action': event.detail,
                'fingerprint': this.fingerprint
            };
            xhr.open('GET', `/api/v1/logs/ui?b=${  btoa(JSON.stringify(payload))}`);
            xhr.send();
        }
    },

    _getBrowser() {
        const userAgent = navigator.userAgent.toLowerCase();
        // we extract the browser from the user agent (respect the order of the tests)
        let browser;
        if (userAgent.indexOf("firefox") >= 0) {
            browser = "Firefox";
        } else if (userAgent.indexOf("opera") >= 0 || userAgent.indexOf("opr") >= 0) {
            browser = "Opera";
        } else if (userAgent.indexOf("chrome") >= 0) {
            browser = "Chrome";
        } else if (userAgent.indexOf("safari") >= 0) {
            browser = "Safari";
        } else if (userAgent.indexOf("trident") >= 0) {
            browser = "Internet Explorer";
        } else {
            browser = "Other";
        }
        return browser;
    },

    _computeViewingList(subroute) {
        return ["/", "/dashboard", "/my-account", "/insights"].indexOf(subroute.prefix) === -1 &&
            subroute.path === "";
    },

    _exportCsvMessage(e) {
        this.dispatchEvent(new CustomEvent('toast', { bubbles: true, composed: true, detail: {
            msg: e.detail.message,
            duration: 3000
        } }));

    },

    _addOrg() {
        const dialog = this.$.organizationAdd; // shadowRoot.querySelector('organization-add');
        console.log('dialog',dialog);
        dialog.openDialog();
    },

    closeIfClickedElsewhere(e) {
        if (this.visibleSuggestions && e.path.indexOf(this.shadowRoot.querySelector('mist-header')) === -1)
            this.set('visibleSuggestions', false);
    },

    _observeModel(oldmodel, newmodel) {
        console.log('model Changes', oldmodel, newmodel);
    },

    enterFullscreen () {
        this.fullscreen = true;
    },

    exitFullscreen () {
        this.fullscreen = false;
    },

    _registerStreamingTarget (e) {
        if (this.streamingTargets.indexOf(e.detail) === -1) {
            this.streamingTargets.push(e.detail);
        }
    },

    _unregisterStreamingTarget (e) {
        const i = this.streamingTargets.indexOf(e.detail);
        if (i > -1) {
            this.streamingTargets.splice(i, 1);
        }
    },

    _logReceived (e) {
        this.streamingTargets.forEach((stream) => {
            stream.fire('receive-log', e.detail);
        });
    },

    panelAdded(e) {
        console.log('panelAdded', e);
    },

    _importScript (e) {
        const script = document.createElement('script');
        script.type = 'text/javascript';
        script.src = e.detail.url;
        script.async = false;
        script.onreadystatechange = e.detail.cb;
        script.onload = e.detail.cb;
        document.body.appendChild(script);
    },
    _qChanged(q) {
        if (this._isPage('dashboard')) {
            if (!q || !q.trim || !q.trim()) {
                // restore section counts
                this._restoreSectionsCounts();
            } else {
                // update section counts according to q
                this._updateSectionsCounts(q);
            }
        } else {
            // update section counts according to stored default
            // this._updateSectionsCounts(localStorage.getItem('mist-filter#topFilter/all-resources/userFilter'));
        }
    },
    _restoreSectionsCounts() {
        Object.keys(this.model || {}).forEach((prop) => {
            if (this.model.sections[prop] && this.model[prop]) {
                // set counts to full model resources length
                this.set(`model.sections.${prop}.count`, Object.values(this.model[prop]).length);
            }
        });
    },
    _updateSectionsCounts(q) {
        const that = this;
        Object.keys(this.model || {}).forEach((prop) => {
            if (this.model.sections[prop] && this.model[prop]) {
                // set counts to filtered model resources length
                this.set(`model.sections.${prop}.count`, Object.values(this.model[prop]).filter((r) => {
                    return that._filterModel(r, q);
                }).length);
            }
        });
    },
    /* eslint-disable no-param-reassign */
    _filterModel(item,q) {
        q = q || '';
        const filterOwner = q.indexOf('owner:') > -1;
        const ownerRegex = /owner:(\S*)\s?/;
        const owner = ownerRegex.exec(q) && ownerRegex.exec(q)[1];
        let str;

        if (filterOwner && owner && owner.length) {
            q = q.replace('owner:', '').replace(`${owner  }`, '');

            if (owner === "$me") {
                if (!item.owned_by || item.owned_by !== this.model.user.id)
                    return false;
            } else {
                const ownerObj = this.model && this.model.membersArray && this.model.membersArray.find((m) => {
                    return [m.name, m.email, m.username, m.id].indexOf(owner) > -1;
                });
                if (!ownerObj || !item.owned_by || item.owned_by !== ownerObj.id)
                    return false;
            }
        }

        const queryTerms = q.split(' ');
        str = JSON.stringify(item);
        if (this.model && this.model.clouds && item && item.cloud && this.model.clouds[item.cloud]) {
            str += `${this.model.clouds[item.cloud].provider  }${  this.model.clouds[item.cloud].title}`;
        }

        if (q && q.trim().length > 0) {
            // Check if all terms exist in stringified item
            for (let i = 0; i < queryTerms.length; i++) {
                if (queryTerms[i] && queryTerms[i].length &&
                    str.toLowerCase().indexOf(queryTerms[i].toLowerCase()) < 0) {
                    return false;
                }
            }
        }
        return true;
    },
    /* eslint-enable no-param-reassign */
    _stopPropagation(e) {
        e.stopPropagation();
    }
});

document.addEventListener('iron-overlay-opened', function moveBackdrop(event) {
  const dialog = dom(event).rootTarget;
  if (dialog.withBackdrop) {
    dialog.parentNode.insertBefore(dialog.backdropElement, dialog);
  }
}, {passive: true});
