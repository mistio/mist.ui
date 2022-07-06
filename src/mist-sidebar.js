import { LitElement, html, css } from "lit";

import "@polymer/paper-icon-button/paper-icon-button.js";
// import { IronOverlayBehavior } from "@polymer/iron-overlay-behavior/iron-overlay-behavior.js";
import "@polymer/paper-listbox/paper-listbox.js";
import "./section-symbol/section-symbol.js";
import "./tag-link/tag-link.js";
import "./theme-color/theme-color.js";
import { connect } from "pwa-helpers/connect-mixin.js";
import { store } from "./redux/store.js";

/* eslint-disable class-methods-use-this */
export default class MistSidebar extends connect(store)(LitElement) {
  static get styles() {
    return css`
      :host {
        width: 210px;
        box-sizing: border-box;
        z-index: 100;
        background: transparent;
        display: flex;
        flex-direction: column;
        overflow-x: hidden;
        overflow-y: auto;
        -webkit-overflow-scrolling: touch;
        outline: none;
        position: fixed;
        margin-right: 24px;
        left: 0;
        top: 64px;
        transition: left 350ms ease-in-out;
        height: 90vh;
      }

      :host([smallscreen]) {
        left: 0;
        padding-top: 16px;
        background: #fff;
        @apply --shadow-elevation-4dp;
        z-index: 103;
        height: calc(100vh - 64px);
      }

      :host([smallscreen])[isclosed],
      :host([isclosed]) {
        left: -210px;
      }

      :host([smallscreen]):not([isclosed]),
      :host(:not([isclosed])) {
        left: 0;
      }

      ::slotted(app-toolbar) {
        --paper-toolbar-background: #eee;
        /*var(--base-background-color);*/
      }

      ::slotted(.content) {
        /*@apply --layout-vertical;*/
        display: flex;
        flex-direction: column;
        height: auto;
      }

      mist-sidebar app-toolbar {
        --paper-toolbar-background: #eee;

        /*var(--base-background-color);*/
        --paper-toolbar: {
          box-sizing: border-box;
        }
      }

      #section-tag {
        display: none;
      }

      #section-info {
        position: relative;
      }

      #section-header {
        position: relative;
        padding: 16px 24px 0 24px;
        overflow: hidden;
      }

      #section-header iron-icon {
        cursor: pointer;
      }

      #section-header section-symbol {
        display: inline-block;
        margin: 0;
        transform: translate(-50px, 0);
        opacity: 0;
        transition: var(--material-curve-320);
      }

      #section-title {
        @apply --paper-font-title;
        margin: 0 0 20px;
        transform: translate(-50px, 0);
        opacity: 0;
        transition: var(--material-curve-320);
      }

      #section-tagline {
        margin: 0;
        padding-right: 80px;
        transform: translate(-50px, 0);
        opacity: 0;
        font-size: 13px;
        line-height: 20px;
      }

      #section-desc {
        margin: 0;
      }

      [size="xs"] #section-title {
        margin-bottom: 0;
      }

      [size="xs"] #section-tagline {
        display: none;
      }

      [size="xs"] #section-tagline {
        margin-top: 0;
      }

      #section-list {
        padding: 20px 0 0px;
      }

      :host([smallscreen]) #section-list {
        padding: 0 0 10px;
      }

      #section-list h5 {
        margin: 10px 0;
        padding: 0 16px;
        color: rgba(0, 0, 0, 0.54);
        font-weight: 500;
      }

      #section-list .section {
        display: flex;
        padding: 8px 16px;
        font-weight: 500;
        text-transform: capitalize;
        cursor: pointer;
        border-width: 1px 0 1px 4px;
        border-left: 4px solid transparent;
        text-decoration: none;
      }

      #section-list .section[active] {
        background: rgba(0, 0, 0, 0.03);
        border-left: 5px solid;
      }

      #section-list .section[active] ::slotted(iron-icon) {
        color: inherit;
      }

      #section-list .section .all-symbol {
        padding: 5px;
      }

      #section-list .section section-symbol,
      #section-list .section .all-symbol {
        margin-right: 12px;
      }

      #section-list a:not([active]) {
        color: rgba(0, 0, 0, 0.54);
      }

      #section-list a:not([active]) span {
        color: rgba(0, 0, 0, 0.87);
      }

      #section-list a:not([active]) ::slotted(iron-icon) {
        opacity: 0.32;
      }

      #section-list span.count {
        flex: none;
        opacity: 0.54;
      }

      #current-tag {
        background: #2196f3;
        color: rgba(255, 255, 255, 0.87);
        padding: 12px;
        font-size: 16px;
      }

      #current-tag b {
        margin-right: 6px;
      }

      #current-tag span {
        text-transform: uppercase;
      }

      .tags tag-link:last-of-type + span {
        display: none;
      }

      a {
        font-size: 14px;
        font-weight: 500;
        letter-spacing: 0.018em;
        line-height: 24px;
      }

      a.section:focus {
        outline: 0;
      }

      .sidebar-sep {
        opacity: 0.32;
      }

      @media (max-width: 400px) {
        :host([smallscreen]) {
          height: calc(100vh - 56px);
        }
      }

      a#machines {
        color: var(--machines-sidebar-link-color);
      }

      a#images {
        color: var(--images-sidebar-link-color);
      }

      a#dashboard {
        color: var(--dashboard-sidebar-link-color);
      }

      a#stacks {
        color: var(--stacks-sidebar-link-color);
      }

      a#keys {
        color: var(--keys-sidebar-link-color);
      }

      a#networks {
        color: var(--networks-sidebar-link-color);
      }

      a#volumes {
        color: var(--volumes-sidebar-link-color);
      }

      a#tunnels {
        color: var(--tunnels-sidebar-link-color);
      }

      a#zones {
        color: var(--zones-sidebar-link-color);
      }

      a#scripts {
        color: var(--scripts-sidebar-link-color);
      }

      a#schedules {
        color: var(--schedules-sidebar-link-color);
      }

      a#templates {
        color: var(--templates-sidebar-link-color);
      }

      a#secrets {
        color: var(--secrets-sidebar-link-color);
      }

      a#incidents {
        color: var(--incidents-sidebar-link-color);
      }

      a#clouds {
        color: var(--clouds-sidebar-link-color);
      }

      a#clusters {
        color: var(--clusters-sidebar-link-color);
      }

      a#teams {
        color: var(--teams-sidebar-link-color);
      }

      a#members {
        color: var(--members-sidebar-link-color);
      }

      a#my-account {
        color: var(--my-account-sidebar-link-color);
      }

      a#insights {
        color: var(--insights-sidebar-link-color);
      }

      .flex-1 {
        display: flex;
        flex: 1 100%;
      }
      .layout.horizontal.center {
        align-items: center;
      }
      .flex,
      .layout.horizontal {
        display: flex;
        flex-direction: row;
      }
    `;
  }

  static get properties() {
    return {
      model: {
        type: Object
      },
      smallscreen: {
        type: Boolean,
        reflectToAttribute: true
      },
      xsmallscreen: {
        type: Boolean,
        reflectToAttribute: true
      },
      current: {
        type: String,
        value: "",
        notify: true
      },
      tag: {
        type: String,
        value: ""
      },
      isclosed: {
        type: Boolean,
        reflectToAttribute: true,
        notify: true,
        value: false
      },
      sectionsArray: {
        type: Array
      },
      sectionCounters: {
        type: Object,
        value() {
          return {};
        }
      }
    };
  }

  render() {
    return html` <div class="content">
      <div id="section-list">
        <nav>
          ${this.sectionsArray.map(
            (item) => html`
              <a
                id="${item.id}"
                class="section"
                on-tap="clearSearch"
                href="/portal/${item.id}"
                ?hidden="${item.hideZero && item.count === 0}"
                ?active="${this.current === item.id}"
                tabindex="0"
              >
                <div class="flex-1 layout horizontal center">
                  <section-symbol
                    aria-hidden="true"
                    icon="${item.icon}"
                  ></section-symbol>
                  <span class="title flex-1">
                    <span class="title-text flex-1"
                      >${item.name || item.id}</span
                    >
                    <span class="count"
                      >${(this.sectionCounters &&
                        this.sectionCounters[item.id]) ||
                      0}</span
                    >
                  </span>
                </div>
              </a>
              ${item.hr ? html`<hr class="sidebar-sep" />` : ""}
            `
          )}
        </nav>
      </div>
    </div>`;
  }

  constructor() {
    super();
    this.sectionCounters = {};
    // this.updateResize();
    // this.addEventListener('iron-overlay-closed', this.closeSidebar);
    const { sections } = store.getState();
    this.sectionsArray = sections.order
      .map((i) => sections.map[i])
      .filter((i) => i && i.sidebar);
  }

  stateChanged(state) {
    // debugger;
    if (
      !this.sectionsArray ||
      !this.sectionsArray.length ||
      !this.sectionCounters
    )
      return;
    this.sectionsArray.forEach((s) => {
      if (!Object.keys(state.org).length) return;
      if (
        s &&
        state.org[s.id] &&
        state.org[s.id].meta &&
        state.org[s.id].meta.total !== this.sectionCounters[s.id]
      ) {
        this.sectionCounters[s.id] = state.org[s.id].meta.total;
        this.requestUpdate();
      }
    });
  }

  style(color) {
    return `color: ${color};`;
  }

  // async updateSectionsCount(id) {
  //   if (id) {
  //     const data = await (
  //       await fetch(`/api/v2/orgs/${id}?summary=true`)
  //     ).json();
  //     store.dispatch({
  //       type: 'Set-Sections-Count',
  //       payload: data.data.resources_count,
  //     });
  //     this.set('sectionsCount', data.data.resources_count);
  //   }
  // }

  updateResize(_e) {
    console.log("updateResize");
    // if (this.smallscreen) this.closeSidebar();
    // else this.openSidebar();
  }

  closeSidebar() {
    // console.log('close sidebar');
    if (this.smallscreen) this.close(); // control brackdrop
    this.isclosed = true;
  }

  openSidebar() {
    // console.log('open sidebar')
    if (this.smallscreen) this.open(); // control brackdrop
    this.isclosed = false;
  }

  toggleSidebar() {
    console.log("toggle sidebar", this.isclosed, this.smallscreen);
    if (this.smallscreen) this.toggle(); // control brackdrop
    this.isclosed = !this.isclosed;
  }

  clearSearch(_e) {
    this.dispatchEvent(new CustomEvent("preserve-filters"), {
      composed: true,
      bubbles: true
    });
  }

  _getSectionCount(name) {
    if (name === "clouds") debugger;
    return this.sectionCounters[name] || 0;
  }
}

customElements.define("mist-sidebar", MistSidebar);
