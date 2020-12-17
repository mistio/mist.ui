import '../../node_modules/@polymer/paper-material/paper-material.js';
import '../../node_modules/@polymer/paper-button/paper-button.js';
import '../../node_modules/@polymer/paper-spinner/paper-spinner.js';
import { mistLoadingBehavior } from '../helpers/mist-loading-behavior.js';
import '../element-for-in/element-for-in.js';
import '../tags/tags-list.js';
import '../mist-rules/mist-rules.js';
import { mistLogsBehavior } from '../helpers/mist-logs-behavior.js';
import './image-actions.js';
import { CSRFToken, itemUid } from '../helpers/utils.js';
import { Polymer } from '../../node_modules/@polymer/polymer/lib/legacy/polymer-fn.js';
import { html } from '../../node_modules/@polymer/polymer/lib/utils/html-tag.js';

Polymer({
  _template: html`
    <style include="shared-styles single-page">
      paper-material {
        display: block;
        padding: 20px;
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

      paper-icon-bottom.bottom {
        padding-right: 8px;
      }
      h4.id {
        display: inline-block;
        text-transform: uppercase;
        font-size: 0.9rem;
        font-weight: 700;
        margin-right: 16px;
      }
      span.id {
        padding-right: 36px;
        word-break: break-all;
      }

      .tag {
        padding: 0.5em;
        display: inline;
      }
      paper-material.no-pad {
        padding: 0;
      }
      .is-loading {
        top: 15px;
        left: 200px;
        position: fixed;
        right: 0;
        bottom: 0;
        display: block;
        height: 100vh;
        background-color: #eee;
      }
      .is-loading paper-spinner {
        width: 80px;
        height: 80px;
        margin: 10% auto;
        display: block;
      }
      .single-head {
        @apply --image-page-head-mixin;
      }
      image-actions {
        width: 50%;
      }
    </style>
    <div id="content">
      <paper-material class="single-head layout horizontal">
        <span class="icon"
          ><iron-icon icon="[[section.icon]]"></iron-icon
        ></span>
        <div class="title flex">
          <h2>
            [[_computeImageName(image.name)]]
            <iron-icon icon="star" hidden$="{{!image.starred}}"></iron-icon>
          </h2>
          <div class="subtitle">on [[image.cloud.title]]</div>
        </div>
        <image-actions
          actions="{{actions}}"
          items="[[itemArray]]"
        ></image-actions>
      </paper-material>
      <paper-material>
        <div class="missing" hidden$="[[!isMissing]]">Image not found.</div>
        <h4 class="id">Image ID:</h4>
        <span class="id">[[image.id]]</span>
        <h4 class="id" hidden$="[[!image.owned_by.length]]">Owner:</h4>
        <span class="id"
          ><a href$="/members/[[image.owned_by]]"
            >[[_displayUser(image.owned_by,model.members)]]</a
          ></span
        >
        <h4 class="id" hidden$="[[!image.created_by.length]]">Created by:</h4>
        <span class="id"
          ><a href$="/members/[[image.created_by]]"
            >[[_displayUser(image.created_by,model.members)]]</a
          ></span
        >
        <h4 class="id tags" hidden$="[[_isEmpty(image.tags)]]">Tags:</h4>
        <template is="dom-if" if="[[image.tags]]">
          <template is="dom-repeat" items="[[image.tags]]">
            <span class="id tag"
              >[[item.key]]
              <span hidden="[[!item.value]]">= [[item.value]]</span></span
            >
          </template>
        </template>
      </paper-material>
      <paper-material class="no-pad">
        <div class="info-table">
          <div class="info-body info-group">
            <element-for-in content="[[image.extra]]"></element-for-in>
          </div>
        </div>
      </paper-material>
      <br />
      <paper-material class="no-pad">
        <template is="dom-if" if="[[image]]" restamp="">
          <mist-list
            id="imageLogs"
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
            name="image logs"
            primary-field-name="time"
            base-filter="[[image.id]]"
          ></mist-list>
        </template>
      </paper-material>
      <div class="absolute-bottom-right" hidden$="[[isMissing]]">
        <paper-fab
          icon="star-border"
          on-tap="_starImage"
          id="starImageFab"
          hidden$="[[!image.starred]]"
        ></paper-fab>
        <paper-fab
          icon="star"
          on-tap="_starImage"
          id="starImageFab"
          hidden$="[[image.starred]]"
        ></paper-fab>
      </div>
    </div>
    <iron-ajax
      id="imageStarAjaxRequest"
      url="/api/v1/clouds/{{image.cloud.id}}/images/{{image.id}}"
      method="POST"
      on-response="_handleImageStarAjaxResponse"
      on-error="_handleImageStarAjaxError"
    ></iron-ajax>
    <tags-list model="[[model]]"></tags-list>
  `,

  is: 'image-page',

  behaviors: [mistLoadingBehavior, mistLogsBehavior],

  properties: {
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
    params: {
      type: Object,
    },
    model: {
      type: Object,
    },
    image: {
      type: Object,
      notify: true,
    },
    isLoading: {
      type: Boolean,
      computed: '_computeIsloading(image)',
      value: true,
    },
  },

  observers: ['_changed(image)'],

  ready() {},

  _displayUser(id, _members) {
    return this.model && id && this.model.members && this.model.members[id]
      ? this.model.members[id].name ||
          this.model.members[id].email ||
          this.model.members[id].username
      : '';
  },

  _changed(image) {
    if (image) this.set('itemArray', [this.image]);
  },

  _getHeaderStyle(section) {
    return `background-color: ${section.color}; color: #fff;`;
  },

  _computeImageName(name) {
    return name === '<none>:<none>' ? this.image.id : name;
  },

  _editTags() {
    const el = this.shadowRoot.querySelector('tags-list');
    const items = [];
    items.push(itemUid(this.image, this.section));
    el.items = items;
    el._openDialog();
  },

  _starImage(_e) {
    this.$.imageStarAjaxRequest.headers['Content-Type'] = 'application/json';
    this.$.imageStarAjaxRequest.headers['Csrf-Token'] = CSRFToken.value;
    this.$.imageStarAjaxRequest.body = {};
    this.$.imageStarAjaxRequest.generateRequest();
  },

  _handleImageStarAjaxResponse(_e) {
    const starred = !this.image.star;
    const message = starred
      ? 'Updating image as starred. It will now appear on top when creating machines'
      : 'Updating image as unstarred. It will no longer appear on top when creating machines';
    // this.set('image.star', starred);
    this.dispatchEvent(
      new CustomEvent('toast', {
        bubbles: true,
        composed: true,
        detail: { msg: message, duration: 5000 },
      })
    );
  },

  _handleImageStarAjaxError(_e) {
    // TODO: Show a toast after request response. Toast text:
    // "There was a problem starring image IMAGE_NAME. It can not yet appear as an option when creating machines"
    // or
    // "There was a problem unstarring image IMAGE_NAME. It will still appear as an option when creating machines"
    this.dispatchEvent(
      new CustomEvent('toast', {
        bubbles: true,
        composed: true,
        detail: {
          msg: `There was a problem unstarring image ${this.image.name}. It will still appear as an option when creating machines`,
          duration: 5000,
        },
      })
    );
  },

  _computeIsloading(_image) {
    return !this.image;
  },

  _isEmpty(arr) {
    return !arr || arr.length === 0;
  },
});
