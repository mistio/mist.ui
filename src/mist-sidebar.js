import '@polymer/paper-icon-button/paper-icon-button.js';
import { IronOverlayBehavior } from '@polymer/iron-overlay-behavior/iron-overlay-behavior.js';
import '@polymer/paper-listbox/paper-listbox.js';
import './section-symbol/section-symbol.js';
import './tag-link/tag-link.js';
import './theme-color/theme-color.js';
import { Polymer } from '@polymer/polymer/lib/legacy/polymer-fn.js';
import { html } from '@polymer/polymer/lib/utils/html-tag.js';

Polymer({
  _template: html`
    <style include="shared-styles">
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

      [size='xs'] #section-title {
        margin-bottom: 0;
      }

      [size='xs'] #section-tagline {
        display: none;
      }

      [size='xs'] #section-tagline {
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

      /* <450px logo is hidden */
      @media (min-width: 451px) {
        #section-list a:first-of-type,
        #section-list hr.sidebar-sep:first-of-type {
          display: none;
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

      a#secrets{
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
    </style>
    <div class="content">
      <div id="section-list">
        <nav>
          <template is="dom-repeat" items="[[sectionsArray]]">
            <template is="dom-if" if="[[item.sidebar]]" restamp="">
              <a
                id="[[item.id]]"
                class="section"
                on-tap="clearSearch"
                id$="[[item.id]]"
                href="/[[item.id]]"
                hidden$="[[_isHidden(item,sectionsArray)]]"
                active$="[[_isEqual(current, item.id)]]"
                tabindex="0"
              >
                <div class="flex-1 layout horizontal center">
                  <section-symbol
                    aria-hidden="true"
                    icon="[[item.icon]]"
                  ></section-symbol>
                  <span class="title flex-1">
                    <span class="title-text flex-1"
                      >[[_getSectionName(item.id)]]</span
                    >
                    <span class="count"
                      >[[_getSectionCount(item.id, sectionsArray)]]</span
                    >
                  </span>
                </div>
              </a>
              <template is="dom-if" if="[[item.hr]]">
                <hr class="sidebar-sep" />
              </template>
            </template>
          </template>
        </nav>
      </div>
    </div>
  `,

  is: 'mist-sidebar',

  behaviors: [IronOverlayBehavior, window.rbac],

  properties: {
    model: {
      type: Object,
    },
    smallscreen: {
      type: Boolean,
      reflectToAttribute: true,
    },
    xsmallscreen: {
      type: Boolean,
      reflectToAttribute: true,
    },
    current: {
      type: String,
      value: '',
      notify: true,
    },
    tag: {
      type: String,
      value: '',
    },
    isclosed: {
      type: Boolean,
      reflectToAttribute: true,
      notify: true,
      value: false,
    },
    hasStacks: {
      type: Boolean,
      computed: '_computeHasStacks(model.stacksArray)',
    },
    sectionsArray: {
      type: Array,
      computed:
        '_computeSectionsArray(model.sections.*, model.teams.*, model.org, model.user)',
    },
  },

  style(color) {
    return `color: ${color};`;
  },

  listeners: {
    'iron-overlay-closed': 'closeSidebar',
  },

  attached() {
    this.updateResize();
  },

  updateResize(_e) {
    console.log('updateResize');
    if (this.smallscreen) this.closeSidebar();
    else this.openSidebar();
  },

  closeSidebar() {
    // console.log('close sidebar');
    if (this.smallscreen) this.close(); // control brackdrop
    this.set('isclosed', true);
  },

  openSidebar() {
    // console.log('open sidebar')
    if (this.smallscreen) this.open(); // control brackdrop
    this.set('isclosed', false);
  },

  toggleSidebar() {
    console.log('toggle sidebar', this.isclosed, this.smallscreen);
    if (this.smallscreen) this.toggle(); // control brackdrop
    this.set('isclosed', !this.isclosed);
  },

  _itemCount(item) {
    return this.get(`this.model.${item}Array.length`);
  },

  _sectionLink(name) {
    return `/${name}`;
  },

  _isEqual(a, b) {
    return a === b;
  },

  _computeHasStacks(stacksArray) {
    return stacksArray ? stacksArray.length > 0 : false;
  },

  _isHidden(item) {
    if (item.hideZero && item.count === 0) return true;
    return false;
  },

  clearSearch(_e) {
    this.dispatchEvent(new CustomEvent('preserve-filters'), {
      composed: true,
      bubbles: true,
    });
  },

  _computeSectionsArray(_model) {
    let sects = [];
    if (this.model && this.model.sections) {
      sects = Object.keys(this.model.sections).filter(sect => {
        if (this.model.sections[sect].id === 'dashboard') return true;
        if (
          this.model.sections[sect].id === 'teams' &&
          this.checkPerm('team', 'read', '*')
        )
          return true;
        if (
          this.model.sections[sect].id === 'insights' &&
          this.checkPerm('cloud', 'read_cost', '*')
        )
          return true;
        if (
          this.model.sections[sect].id === 'rules' &&
          this.checkPerm('machine', 'edit_rules', '*')
        )
          return true;
        if (
          ['insights', 'teams', 'rules'].indexOf(
            this.model.sections[sect].id
          ) === -1 &&
          this.checkPerm &&
          this.model.org &&
          this.model.user &&
          this.checkPerm(
            this.model.sections[sect].id,
            'read',
            '*',
            this.model.org,
            this.model.user
          )
        ) {
          return true;
        }
        return false;
      });
      return sects.map(y => this.model.sections[y]);
    }
    return [];
  },

  _getSectionName(sectionId) {
    const { name, id } = this.model.sections[sectionId];
    return name || id;
  },

  _getSectionCount(name, _sections) {
    return this.model.sections[name].count;
  },
});
