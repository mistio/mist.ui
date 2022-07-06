
import { LitElement, html, css } from 'lit';
// import '@vaadin/vaadin-lumo-styles/all-imports';
// import '@vaadin/vaadin-lumo-styles/color';
// import '@vaadin/vaadin-lumo-styles/presets/compact.js';
// // import '@vaadin/polymer-legacy-adapter/style-modules.js';

// import '@vaadin/app-layout/theme/lumo/vaadin-app-layout';
// import '@vaadin/app-layout/theme/lumo/vaadin-drawer-toggle.js';
// import '@vaadin/app-layout/theme/lumo/vaadin-drawer-toggle-styles.js';
// import '@vaadin/tabs';
// import '@vaadin/icons';
// import '@vaadin/avatar';

import { Router } from '@vaadin/router';

// import '@polymer/paper-material/paper-material.js';
// import '@polymer/paper-icon-button/paper-icon-button.js';
// import '@polymer/iron-icons/iron-icons.js';
// import '@polymer/iron-selector/iron-selector.js';
// import '@polymer/iron-media-query/iron-media-query.js';
// import '@polymer/paper-spinner/paper-spinner.js';
// import '@polymer/paper-toast/paper-toast.js';
import '@mistio/mist-form';
// import '@mistio/mist-list/mist-list.js';
// import './styles/shared-styles.js';
// import './mist-header/mist-header.js';
// import './mist-sidebar.js';
// import './app-icons/app-icons.js';
// import './mist-socket.js';
// import './mist-notice.js';
// import './mist-icons.js';
// import './organizations/organization-add.js';
// import { configUpdated } from './redux/slices/config.js';


import { connect } from "pwa-helpers/connect-mixin.js";
import { store } from './redux/store.js';
import { orgsUpdated } from './redux/slices/orgs.js';
import { orgSelected } from './redux/slices/org.js';


const routes = [
  {
    path: '',
    redirect: '/portal',
  }, {
    path: '/portal',
    component: 'portal-orgs',
    action: async () => {
      
      await import('./portal-orgs.js');
    },
    children: [{
      path: ':org',
      component: 'org-dashboard',
      action: async () => {
        await import('./org-dashboard.js');
      },
      children: [{
        path: 'clouds',
        component: 'page-clouds',
        action: async () => {
          await import('./page-clouds.js');
        },
      },
      {
        path: 'machines',
        component: 'page-machines',
        action: async () => {
          await import('./page-machines.js');
        },
      },
      {
        path: 'images',
        component: 'page-images',
        action: async () => {
          await import('./page-images.js');
        },
      }]
    }]
  },
];

document.documentElement.setAttribute("theme", "dark");


export class MistPortal extends connect(store)(LitElement) {
  static get properties() {
    return {
      title: { type: String },
      fullscreen: { type: Boolean },
      currentOrg: { type: String }
    };
  }

  static get styles() {
    return css`
        div.header {
            
        }
        vaadin-app-layout {
            --lumo-base-color: #222;
        }
        vaadin-drawer-toggle {
            --lumo-primary-text-color: #fff;
            margin: 8px;
        }

        a.logo-link > img {
            margin-top: 4px;
        }
    
        /* :host {
            background-color: var(--base-background-color);
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
        } */

    `;
  }

  get state() {
    return store.getState();
  }

  constructor() {
    super();
    this.title = 'Mist portal';
    this.currentOrg = '';
    (async () => {
      const data = await (
        await fetch(`/api/v2/orgs`)
      ).json();
      store.dispatch(orgsUpdated(data));
      if (data.meta.total === 1 && this.state.org.name === undefined) {
        const orgName = data.data[0].name;
        store.dispatch(orgSelected(orgName));
        const targetPath = `/portal/${  orgName}`;
        if (document.location.pathname !== targetPath)
          document.location.pathname = targetPath;
      }
    })();
  }

  
  stateChanged(state) {
    if (!this.currentOrg && state.org.name) {
        this.currentOrg = state.org.name;
    }
  }

  firstUpdated() {
    this.router = new Router(this.shadowRoot.querySelector('div#main'));
    this.router.setRoutes(routes);
  }

  render() {
    return html`
    <vaadin-app-layout class="box m shadow">
      <vaadin-drawer-toggle slot="navbar touch-optimized" role="button"></vaadin-drawer-toggle>
      <div class="header" slot="navbar touch-optimized" ?hidden=${this.fullscreen}>
        <a href="/portal" class="logo-link">
            <img src="/assets/mist-logo-white.svg" alt="" />
        </a>
        <!-- <vaadin-avatar .name="Name Surname"></vaadin-avatar> -->
      </div>
      <vaadin-tabs orientation="vertical" slot="drawer" ?hidden=${!this.currentOrg.length}>
        <vaadin-tab>
          <a href="/portal">
            <vaadin-icon icon="lumo:user"></vaadin-icon>
            Profile
          </a>
        </vaadin-tab>
        <vaadin-tab>
          <a href="/portal/yolo">
            <vaadin-icon icon="lumo:phone"></vaadin-icon>
            Contact
          </a>
        </vaadin-tab>
      </vaadin-tabs>
      <div id="main"></div>
    </vaadin-app-layout>
          <!-- <mist-sidebar id="sidebar" current="{{page}}" drawer=""></mist-sidebar> -->

      <!-- <app-header-layout mode="standard" class="fit" fullbleed="">
        <app-header slot="header" fixed="" shadow="" ?hidden=${this.fullscreen}>
          
        </app-header>
        

        <div id="main">lo</div>
      </app-header-layout> -->
      `;
    //   <!-- <iron-media-query query="(max-width: 1024px)" query-matches="{{smallscreen}}"></iron-media-query>
    //     <iron-media-query query="(max-width: 600px)" query-matches="{{xsmallscreen}}"></iron-media-query>
    //     <app-header-layout mode="standard" class="fit" fullbleed="">
    //         <mist-notice model="[[model]]" class="paper-header"></mist-notice>
    //         <app-header slot="header" fixed="" shadow="" hidden$="[[fullscreen]]">
    //             <mist-header sticky="" model="[[model]]" title="[[page]]" query="{{searchQuery}}" class="paper-header" count="[[count]]" viewing-list="[[viewingList]]" user-menu-opened="{{userMenuOpened}}" ownership="[[model.org.ownership_enabled]]" visible-suggestions="{{visibleSuggestions}}"></mist-header>
    //         </app-header>
    //         <mist-sidebar id="sidebar" model="[[model]]" tag="[[tag]]" current="{{page}}" drawer="" smallscreen="[[smallscreen]]" xsmallscreen="[[xsmallscreen]]" isclosed="{{sidebarIsClosed}}"></mist-sidebar>
    //         <div id="main-loader" class$="is-loading-html active-[[loading]]">
    //             <paper-spinner active="[[loading]]"></paper-spinner>
    //         </div>
    //             <page-dashboard name="dashboard" model="[[model]]" viewing-dashboard="[[_isPage('dashboard', page)]]" xsmallscreen="[[xsmallscreen]]" docs="[[config.features.docs]]"></page-dashboard>
    //             <page-clouds name="clouds" route="{{subroute}}" model="[[model]]" enable-monitoring="[[config.features.monitoring]]" docs="[[config.features.docs]]" portal-name="[[config.portal_name]]" enable-billing="[[config.features.billing]]"></page-clouds>
    //             <page-clusters name="clusters" route="{{subroute}}" model="[[model]]"></page-clusters>
    //             <page-machines name="machines" route="{{subroute}}" model="[[model]]" monitoring="[[config.features.monitoring]]" docs="[[config.features.docs]]" portal-name="[[config.portal_name]]"></page-machines>
    //             <page-images name="images" route="{{subroute}}" model="[[model]]" portal-name="[[config.portal_name]]"></page-images>
    //             <page-keys name="keys" route="{{subroute}}" model="[[model]]" config="[[config]]"></page-keys>
    //             <page-networks name="networks" route="{{subroute}}" model="[[model]]"></page-networks>
    //             <page-volumes name="volumes" route="{{subroute}}" model="[[model]]"></page-volumes>
    //             <page-buckets name="buckets" route="{{subroute}}" model="[[model]]"></page-buckets>
    //             <page-zones name="zones" route="{{subroute}}" model="[[model]]"></page-zones>
    //             <page-secrets name="secrets" route="{{subroute}}" model="[[model]]"></page-secrets>
    //             <page-tunnels name="tunnels" route="{{subroute}}" model="[[model]]" hidden$="[[!config.features.tunnels]]"></page-tunnels>
    //             <page-scripts name="scripts" route="{{subroute}}" model="[[model]]" docs="[[config.features.docs]]"></page-scripts>
    //             <page-schedules name="schedules" route="{{subroute}}" model="[[model]]" docs="[[config.features.docs]]"></page-schedules>
    //             <page-rules name="rules" route="{{subroute}}" model="[[model]]" docs="[[config.features.docs]]" features="[[config.features]]"></page-rules>
    //             <page-templates name="templates" route="{{subroute}}" model="[[model]]" hidden$="[[!config.features.orchestration]]"></page-templates>
    //             <page-stacks name="stacks" route="{{subroute}}" model="[[model]]" hidden$="[[!config.features.orchestration]]"></page-stacks>
    //             <page-teams name="teams" route="{{subroute}}" model="[[model]]" rbac="[[config.features.rbac]]" billing="[[config.features.billing]]" cta="[[config.cta.rbac]]" email="[[config.email]]" docs="[[config.features.docs]]"></page-teams>
    //             <page-members name="members" route="{{subroute}}" model="[[model]]"></page-members>
    //             <page-incidents name="incidents" route="{{subroute}}" model="[[model]]"></page-incidents>
    //             <page-insights name="insights" route="{{subroute}}" model="[[model]]" email="[[config.email]]" insights-enabled="[[model.org.insights_enabled]]" hidden$="[[!config.features.insights]]"></page-insights>
    //             <page-my-account name="my-account" route="{{subroute}}" user="[[model.user]]" org="[[model.org]]" machines="[[model.machines]]" tokens="[[model.tokens]]" sessions="[[model.sessions]]" config="[[config]]"></page-my-account>
    //             <page-not-found name="not-found" route="{{subroute}}"></page-not-found>
    //         <paper-toast id="mist-toast"></paper-toast>
    //     </app-header-layout>
    //     <mist-socket model="{{model}}"></mist-socket>
    //     <app-notifications id="desktop-notifier" on-click="handleDesktopNotificationClick"></app-notifications>
    //     <organization-add id="organizationAdd" current-org="[[model.org]]"></organization-add> -->
    // `;
  }
}

customElements.define('mist-portal', MistPortal);
