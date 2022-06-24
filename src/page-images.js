import '@polymer/app-route/app-route.js';
import '@mistio/mist-list/mist-list.js';
import '@polymer/paper-fab/paper-fab.js';
import './images/image-page.js';
import './images/image-actions.js';
import './images/image-provider-search.js';
// import { Polymer } from '@polymer/polymer/lib/legacy/polymer-fn.js';
import { html } from '@polymer/polymer/lib/utils/html-tag.js';
import { PolymerElement } from '@polymer/polymer/polymer-element.js';
import { mixinBehaviors } from '@polymer/polymer/lib/legacy/class.js';
import { mistListsBehavior } from './helpers/mist-lists-behavior.js';

/* eslint-disable class-methods-use-this */
export default class PageImages extends mixinBehaviors(
  [mistListsBehavior],
  PolymerElement
) {
  static get template() {
    return html`
      <style include="shared-styles">
        [hidden] {
          display: none !important;
        }
        paper-button.search-on-providers {
          font-size: 0.9em;
          cursor: pointer;
          text-transform: none;
          padding: 0;
          line-height: 1.4em;
        }
        h2[slot='header'] {
          margin: 8px;
        }
      </style>
      <app-route route="{{route}}" pattern="/:image"></app-route>
      <template is="dom-if" if="[[_isListActive(route.path)]]" restamp>
        <image-actions actions="{{actions}}" items="[[selectedItems]]">
          <mist-list
            selectable
            resizable
            column-menu
            multi-sort
            apiurl="/api/v1/images"
            id="imagesList"
            name="Images"
            primary-field-name="id"
            frozen="[[_getFrozenColumn()]]"
            visible="[[_getVisibleColumns()]]"
            selected-items="{{selectedItems}}"
            renderers="[[_getRenderers()]]"
            route="{{route}}"
            item-map="[[model.images]]"
            actions="[[actions]]"
            user-filter="[[model.sections.images.q]]"
            filtered-items-length="[[filteredItemsLength]]"
            filter-method="[[_ownerFilter()]]"
          >
            <h2 slot="header">
              [[filteredItemsLength]] [[combinedFilter]] Images
              <paper-button
                class="search-on-providers blue-link"
                noink
                on-tap="searchOnProviders"
                >Search more images.</paper-button
              >
            </h2>
            <p slot="no-items-found">No images found.</p>
          </mist-list>
        </image-actions>
        <div class="absolute-bottom-right">
          <paper-fab
            id="imageAdd"
            icon="search"
            on-tap="_addResource"
          ></paper-fab>
        </div>
      </template>
      <image-page
        id="imagePage"
        model="[[model]]"
        image="[[_getImage(route, model.images)]]"
        resource-id="[[_getImageId(route)]]"
        section="[[model.sections.images]]"
        hidden$="[[!_isDetailsPageActive(route.path)]]"
      ></image-page>
      <image-provider-search
        id="imageprovidersearch"
        clouds="[[searchableClouds(model.cloudsArray)]]"
        query-term="[[model.sections.images.q]]"
      ></image-provider-search>
    `;
  }

  static get is() {
    return 'page-images';
  }

  static get properties() {
    return {
      model: {
        type: Object,
      },
      items: {
        type: Array,
      },
      filteredItems: {
        type: Array,
      },
      combinedFilter: {
        type: String,
      },
      filteredItemsLength: {
        type: String,
      },
      renderers: {
        type: Object,
        computed: '_getRenderers(model.scripts)',
      },
    };
  }

  _isDetailsPageActive(path) {
    if (path && this.$.imagePage) this.$.imagePage.updateState();
    return path;
  }

  _isListActive(_path) {
    return !this.route.path;
  }

  _getImage(route) {
    // use route path to locate image so as to include dash containing names ex. mist/debian-wheezy
    if (this.model.images)
      return this.model.images[route.path.slice(1, route.path.length)];
    return '';
  }

  _getImageId(route) {
    if (
      route.path.slice(1, route.path.length) &&
      this.shadowRoot &&
      this.shadowRoot.querySelector('image-page')
    ) {
      this.shadowRoot.querySelector('image-page').updateState();
    }
    return route.path.slice(1, route.path.length);
  }

  _addResource(_e) {
    this.searchOnProviders();
  }

  _getFrozenColumn() {
    return ['name'];
  }

  _getVisibleColumns() {
    return ['starred', 'cloud', 'created_by', 'id' /* , 'tags' */];
  }

  _getRenderers(_keys) {
    const _this = this;
    return {
      name: {
        body: (item, row) => {
          const name = item === '<none>:<none>' ? row.id : item;
          if (row.star) return `<strong class="name starred">${name}</strong>`;
          return `<strong class="name unstarred">${name}</strong>`;
        },
        cmp: (row1, row2) =>
          row1.name.localeCompare(row2.name, 'en', {
            sensitivity: 'base',
          }),
      },
      cloud: {
        body: (_item, row) => (row && row.cloud ? row.cloud.name : ''),
        cmp: (row1, row2) => {
          const item1 = this.renderers.cloud.body(row1.cloud);
          const item2 = this.renderers.cloud.body(row2.cloud);
          return item1.localeCompare(item2, 'en', { sensitivity: 'base' });
        },
      },
      starred: {
        body: (item, _row) =>
          item
            ? '<iron-icon icon="star" class="starred"></iron-icon>'
            : '<iron-icon icon="star-border" class="unstarred"></iron-icon>',
      },
      owned_by: {
        title: (_item, _row) => 'owner',
        body: (item, _row) =>
          _this.model.members[item]
            ? _this.model.members[item].name ||
              _this.model.members[item].email ||
              _this.model.members[item].username
            : '',
        cmp: (row1, row2) => {
          const item1 = this.renderers.owned_by.body(row1.owned_by);
          const item2 = this.renderers.owned_by.body(row2.owned_by);
          return item1.localeCompare(item2, 'en', { sensitivity: 'base' });
        },
      },
      created_by: {
        title: (_item, _row) => 'created by',
        body: (item, _row) =>
          _this.model.members[item]
            ? _this.model.members[item].name ||
              _this.model.members[item].email ||
              _this.model.members[item].username
            : '',
        cmp: (row1, row2) => {
          const item1 = this.renderers.created_by.body(row1.created_by);
          const item2 = this.renderers.created_by.body(row2.created_by);
          return item1.localeCompare(item2, 'en', { sensitivity: 'base' });
        },
      },
      tags: {
        body: (item, _row) => {
          const tags = item;
          let display = '';
          Object.keys(tags || {})
            .sort()
            .forEach(key => {
              display += `<span class='tag'>${key}`;
              if (tags[key] != null && tags[key] !== '')
                display += `=${tags[key]}`;
              display += '</span>';
            });
          return display;
        },
        // sort by number of tags, resources with more tags come first
        // if two resources have the same number of tags show them in alphabetic order
        cmp: (row1, row2) => {
          const keys1 = Object.keys(row1.tags).sort();
          const keys2 = Object.keys(row2.tags).sort();
          if (keys1.length > keys2.length) return -1;
          if (keys1.length < keys2.length) return 1;
          const item1 = keys1.length > 0 ? keys1[0] : '';
          const item2 = keys2.length > 0 ? keys2[0] : '';
          return item1.localeCompare(item2, 'en', { sensitivity: 'base' });
        },
      },
    };
  }

  searchableClouds(clouds) {
    return clouds.filter(c => ['ec2', 'docker'].indexOf(c.provider) > -1);
  }

  sortedImages(_images) {
    return this.model.imagesArray.sort((a, b) => {
      // if both properties exist
      if (a.star > b.star) {
        return -1;
      }
      if (a.star < b.star) {
        return 1;
      }
      return 0;
    });
  }

  searchOnProviders() {
    if (this.$.imageprovidersearch) {
      this.$.imageprovidersearch._openDialog();
    }
  }
}

customElements.define('page-images', PageImages);
