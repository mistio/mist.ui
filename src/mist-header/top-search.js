import '../../node_modules/@polymer/polymer/polymer-legacy.js';
import '../../node_modules/@polymer/paper-styles/typography.js';
import '../../node_modules/@polymer/paper-icon-button/paper-icon-button.js';
import '../../node_modules/@polymer/paper-menu-button/paper-menu-button.js';
import '../../node_modules/@polymer/paper-listbox/paper-listbox.js';
import '../../node_modules/@polymer/paper-item/paper-item.js';
import '../../node_modules/@mistio/mist-list/mist-filter.js';
import { IronResizableBehavior } from '../../node_modules/@polymer/iron-resizable-behavior/iron-resizable-behavior.js';
import './search-suggestions.js';
import { Polymer } from '../../node_modules/@polymer/polymer/lib/legacy/polymer-fn.js';
import { html } from '../../node_modules/@polymer/polymer/lib/utils/html-tag.js';

Polymer({
  _template: html`
    <style include="shared-styles">
      :host * {
        box-sizing: border-box;
        outline: none;
      }

      :host {
        outline: none;
        max-width: 800px;
        display: block;
        align-items: center;
        background-color: rgba(255, 255, 255, 0.15);
        height: 48px;
        border-radius: 4px;
        width: 100%;
        min-width: 48px;
        transition: all 10ms ease-in;

        --mist-filter-paper-menu-button-padding: 4px 0px 0 16px;
        --mist-filter-paper-menu-button-background-color: rgba(
          255,
          255,
          255,
          0.2
        );
        --mist-filter-paper-menu-button-paper-button-margin: 0;
        --mist-filter-paper-menu-button-paper-button-padding-left: 24px;
        --mist-filter-paper-menu-button-paper-button-text-transform: none;
        --mist-filter-paper-menu-button-paper-button-font-size: 16px;
        --mist-filter-h2-title-margin: 4px;
        --paper-input-container-underline: {
          display: none;
          height: 0;
        }
        --paper-input-container-underline-focus: {
          display: none;
          height: 0;
        }
        --paper-input-container-underline-disabled: {
          display: none;
          height: 0;
        }
        --paper-input-container-color: transparent;
        --paper-input-container-focus-color: transparent;
        --paper-input-container-invalid-color: transparent;
      }

      :host::slotted(iron-icon) {
        cursor: pointer;
        color: inherit;
      }

      mist-filter {
        width: 100%;
        display: contents;
      }

      #search input:focus {
        outline: 0;
      }

      ::-webkit-input-placeholder {
        color: #fff !important;
      }

      ::-webkit-search-cancel-button {
        display: none;
      }
      paper-icon-button {
        display: none;
      }

      @media screen and (max-width: 800px) {
        :host {
          background-color: transparent;
        }

        :host([overflow]) {
          background-color: rgba(255, 255, 255, 1);
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          height: 64px;
          z-index: 99;
          border-radius: 0;
          transition: all 150ms ease-in;

          --paper-input-container-input: {
            font-size: 16px;
            color: inherit;
            width: 100%;
            padding: 22px 0 0 0;
          }
          --mist-filter-paper-buttons-margin-top: 5px;
          --paper-input-container-input_-_padding: 14px 0 0 8px;
        }

        :host([overflow]) mist-filter {
          display: flex;
          padding: 8px;
        }

        paper-icon-button {
          display: block;
          margin: 4px;
          float: right;
        }

        :host([overflow]) paper-icon-button {
          display: none;
          margin: 0;
          float: none;
        }

        #search {
          display: none;
          color: rgba(0, 0, 0, 0.87);
          transform: translate(0, -30px);
          transition: all 10ms ease-in;
        }

        #search input {
          color: rgba(0, 0, 0, 0.87);
        }

        :host([overflow]) #search {
          display: flex;
          height: 56px;
          transition: all 150ms ease-in;
          transform: translate(0, 0);
        }
      }
      @media screen and (min-width: 600px) and (max-width: 800px) {
        :host([overflow]) {
          height: 64px;
        }
        :host([overflow]) #search {
          height: 64px;
        }
      }
    </style>
    <paper-icon-button icon="search" on-tap="revealSearch"></paper-icon-button>
    <div id="search" class="horizontal layout">
      <mist-filter
        id="topFilter"
        user-filter="{{userFilter}}"
        display-name="{{displayName}}"
        preset-filters="[[presetFilters]]"
        name$="[[_computeFilterPlaceholder(title)]]"
      >
      </mist-filter>
    </div>
    <search-suggestions
      query="[[userFilter]]"
      model="[[model]]"
      hide$="[[viewingList]]"
      width="[[width]]"
      visible="{{visibleSuggestions}}"
    ></search-suggestions>
  `,

  is: 'top-search',

  behaviors: [IronResizableBehavior],

  properties: {
    id: {
      type: String,
    },
    title: {
      type: String,
    },
    userFilter: {
      type: String,
      notify: true,
    },
    model: {
      type: Object,
    },
    viewingList: {
      type: Boolean,
    },
    showClear: {
      type: Boolean,
      value: false,
    },
    overflow: {
      type: Boolean,
      value: false,
      reflectToAttribute: true,
    },
    width: {
      type: Number,
    },
    selectedPresetFilter: {
      type: String,
    },
    ownership: {
      type: Boolean,
      value: false,
    },
    visibleSuggestions: {
      type: Boolean,
      value: false,
      notify: true,
    },
    userSavedFilters: {
      type: Array,
      value() {
        return [];
      },
    },
    presetFilters: {
      type: Array,
      computed: '_computePresetFilters(title)',
    },
    displayName: {
      type: String,
      notify: true,
    },
  },

  observers: ['overflowChanged(overflow)', '_updateSearch(userFilter, title)'],

  listeners: {
    keyup: 'hotkeys',
    'escape-pressed': 'hotkeys',
    'iron-resize': 'updateWidth',
  },

  attached() {},

  updateWidth() {
    this.debounce(
      'windowResize',
      () => {
        this.set('width', this.getBoundingClientRect().width);
      },
      100
    );
  },

  _updateSearch(userFilter, title) {
    console.log('filter _updateSearch', this.userFilter, title);
    this.dispatchEvent(
      new CustomEvent('search', {
        bubbles: true,
        composed: true,
        detail: { q: this.userFilter, page: title },
      })
    );
  },

  hotkeys(e) {
    console.log('hotkeys', e);
    // ESC
    if (e.type === 'escape-pressed' || e.keyCode === 27) {
      this.set('overflow', false);
      this.set('visibleSuggestions', false);
    }
    // ENTER
    if (
      e.keyCode === 13 &&
      e.path &&
      e.path.indexOf(this) > -1 &&
      this.userFilter.length
    ) {
      // pass
    }
  },

  revealSearch(_e) {
    this.set('overflow', true);
    this.set('showClear', true);
  },

  overflowChanged(overflow) {
    if (overflow) {
      this.updateWidth();
    }
    this.set('showClear', this.overflow);
  },

  _computeFilterPlaceholder(title) {
    if (!title) return '';
    if (
      [
        'clouds',
        'stacks',
        'machines',
        'volumes',
        'networks',
        'zones',
        'keys',
        'images',
        'scripts',
        'schedules',
        'templates',
        'tunnels',
        'teams',
      ].indexOf(title) > -1
    ) {
      return `All ${title}`;
    }
    return 'All resources';
  },

  _computePresetFilters(title) {
    let resourceType;
    if (!title) {
      return [];
    }
    if (
      [
        'clouds',
        'stacks',
        'machines',
        'volumes',
        'networks',
        'zones',
        ' keys',
        'images',
        'scripts',
        'schedules',
        'teams',
      ].indexOf(title) > -1
    ) {
      resourceType = title;
    } else {
      resourceType = 'resources';
    }
    return [
      { name: `Your ${resourceType}`, filter: 'owner:$me', default: true },
    ];
  },
});
