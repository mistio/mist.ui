import '../node_modules/@polymer/app-route/app-route.js';
import '../node_modules/@mistio/mist-list/mist-list.js';
import '../node_modules/@polymer/paper-fab/paper-fab.js';
import './images/image-page.js';
import './images/image-actions.js';
import './images/image-provider-search.js';
import { mistListsBehavior } from './helpers/mist-lists-behavior.js';
import { Polymer } from '../node_modules/@polymer/polymer/lib/legacy/polymer-fn.js';
import { html } from '../node_modules/@polymer/polymer/lib/utils/html-tag.js';

Polymer({
    _template: html`
        <style include="shared-styles">
            [hidden] {
                display: none !important;
            }
            paper-button.search-on-providers {
                font-size: .9em;
                cursor: pointer;
                text-transform: none;
                padding: 0;
                line-height: 1.4em;
            }
            h2[slot="header"] {
                margin: 8px;
            }
        </style>
        <app-route route="{{route}}" pattern="/:image"></app-route>
        <template is="dom-if" if="[[_isListActive(route.path)]]" restamp>
            <image-actions actions={{actions}} items=[[selectedItems]]>
                <mist-list selectable resizable column-menu multi-sort 
                    apiurl="/api/v1/images"
                    id="imagesList"
                    name="Images"
                    primary-field-name="id"
                    frozen=[[_getFrozenColumn()]]
                    visible=[[_getVisibleColumns()]]
                    selected-items="{{selectedItems}}"
                    renderers=[[_getRenderers()]]
                    route={{route}}
                    item-map="[[model.images]]"
                    actions=[[actions]]
                    user-filter=[[model.sections.images.q]]
                    filtered-items-length=[[filteredItemsLength]]
                    filter-method="[[_ownerFilter()]]">
                    <h2 slot="header">[[filteredItemsLength]] [[combinedFilter]] Images
                        <paper-button class="search-on-providers blue-link" noink on-tap="searchOnProviders">Search more images.</paper-button>
                    </h2>
                    <p slot="no-items-found">No images found.</p>
                </mist-list>
            </image-actions>
            <div class="absolute-bottom-right">
                <paper-fab id="imageAdd" icon="search" on-tap="_addResource"></paper-fab>
            </div>
        </template>
        <image-page id="imagePage" model="[[model]]" image$="[[_getImage(route, model.images)]]" resource-id="[[_getImageId(route)]]"
            section="[[model.sections.images]]" hidden$=[[!_isDetailsPageActive(route.path)]]></image-page>
        <image-provider-search id="imageprovidersearch" clouds="[[searchableClouds(model.cloudsArray)]]" query-term="[[model.sections.images.q]]"></image-provider-search>
    `,
    is: 'page-images',
    behaviors: [
        mistListsBehavior
    ],
    properties: {
        model: {
            type: Object
        },
        items: {
            type: Array
        },
        filteredItems: {
            type: Array
        },
        combinedFilter: {
            type: String
        },
        filteredItemsLength: {
            type: String
        }
    },
    listeners: {},
    _isDetailsPageActive (path) {
        if (path && this.$.imagePage)
            this.$.imagePage.updateState();
        return path;
    },
    _isListActive (path) {
        return !path;
    },
    _getImage (route) {
        // use route path to locate image so as to include dash containing names ex. mist/debian-wheezy
        if (this.model.images)
            return this.model.images[route.path.slice(1, route.path.length)];
        return "";
    },
    _getImageId (route) {
        if (route.path.slice(1, route.path.length) && this.shadowRoot && this.shadowRoot.querySelector('image-page')) {
            this.shadowRoot.querySelector('image-page').updateState();
        }
        return route.path.slice(1, route.path.length);
    },
    _addResource (_e) {
        this.searchOnProviders();
    },
    _getFrozenColumn () {
        return ['name'];
    },
    _getVisibleColumns () {
        return ['starred', 'cloud', 'created_by', 'id'/* , 'tags' */];
    },
    _getRenderers (_keys) {
        const _this = this;
        return {
            'name': {
                'body': (item, row) => {
                    const name = item === "<none>:<none>" ? row.id : item;
                    if (row.star)
                        return `<strong class="name starred">${  name  }</strong>`;
                    return `<strong class="name unstarred">${  name  }</strong>`;
                },
                'cmp': (row1, row2) => {
                    return row1.name.localeCompare(row2.name, 'en', {sensitivity: 'base'});
                }
            },
            'cloud': {
                'body': (_item, row) => {
                    return row && row.cloud ? row.cloud.title : '';
                },
                'cmp': (row1, row2) => {
                    const item1 = row1 && row1.cloud ? row1.cloud.title : '';
                    const item2 = row2 && row2.cloud ? row2.cloud.title : '';
                    return item1.localeCompare(item2, 'en', {sensitivity: 'base'});
                }
            },
            'starred': {
                'body': (item, _row) => {
                    return item ? '<iron-icon icon="star" class="starred"></iron-icon>' :
                        '<iron-icon icon="star-border" class="unstarred"></iron-icon>';
                }
            },
            'owned_by': {
                'title': (_item, _row) => {
                    return 'owner';
                },
                'body': (item, _row) => {
                    return _this.model.members[item] ? _this.model.members[item].name || _this.model
                        .members[item].email || _this.model.members[item].username : '';
                }
            },
            'created_by': {
                'title': (_item, _row) => {
                    return 'created by';
                },
                'body': (item, _row) => {
                    return _this.model.members[item] ? _this.model.members[item].name || _this.model
                        .members[item].email|| _this.model.members[item].username : '';
                }
            },
            'tags': {
                'body': (item, _row) => {
                    const tags = item;
                        let display = "";
                    Object.keys(tags || {}).forEach((key) => {
                        display += `<span class='tag'>${  key}`;
                        if (tags[key] !== undefined && tags[key] !== "")
                            display += `=${  tags[key]}`;
                        display += "</span>";
                    });
                    return display;
                }
            }
        }
    },
    searchableClouds (clouds) {
        return clouds.filter((c) => {
            return ['ec2', 'docker'].indexOf(c.provider) > -1;
        });
    },
    sortedImages (_images) {
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
    },

    searchOnProviders () {
        if (this.$.imageprovidersearch) {
            this.$.imageprovidersearch._openDialog();
        }
    }

});
