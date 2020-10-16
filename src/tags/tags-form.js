import '../../node_modules/@polymer/polymer/polymer-legacy.js';
import '../../node_modules/@polymer/paper-button/paper-button.js';
import '../../node_modules/@polymer/paper-styles/typography.js';
import '../../node_modules/@polymer/neon-animation/animations/scale-up-animation.js';
import '../../node_modules/@polymer/neon-animation/animations/fade-out-animation.js';
import '../../node_modules/@vaadin/vaadin-dialog/vaadin-dialog.js';
import '../../node_modules/@polymer/paper-progress/paper-progress.js';
import '../../node_modules/@polymer/iron-icons/iron-icons.js';
import './tag-item.js';
import { CSRFToken, intersection } from '../helpers/utils.js';
import { Polymer } from '../../node_modules/@polymer/polymer/lib/legacy/polymer-fn.js';
import { html } from '../../node_modules/@polymer/polymer/lib/utils/html-tag.js';

Polymer({
    _template: html`
        <style include="shared-styles dialogs">
            :host {
                padding: 0;
                margin: 0;
            }

            .tag-list {
                padding: 0 0 24px 0;
            }

            :host .tag-list > p {
                margin: 24px 0 0 0;
            }

            .bottom-actions {
                padding-bottom: 2px;
                margin-top: 8px;
                margin-bottom: 8px;
                overflow: hidden;
                vertical-align: middle;
                text-align: right;
                width: 100%;
            }

            vaadin-dialog {
                min-width: 450px;
                max-width: 100%;
            }

            vaadin-button.add {
                margin-left: 16px !important;
            }

            .pull-left {
                float: left;
            }

            .submit-btn.add {
                line-height: 40px;
                margin: 0;
            }

            .submit-btn.save {
                padding-left: 16px;
                padding-right: 16px;
            }
            #progress {
                margin-bottom: 8px;
                margin-top: 0;
                border-bottom: 1px solid #ddd;
            }
            .errorarea {
                padding: 16px 0;
                color: var(--red-color) !important;
            }
            .errorarea iron-icon {
                padding-right: 8px;
            }
            iron-icon {
                color: inherit !important;
            }
            #progress paper-progress {
                width: calc(100% + 48px);
                margin: 0 -24px;
            }
            #progress paper-progress[error]>::slotted(#primaryProgress) {
                background-color: var(--red-color) !important;
            }
            paper-dialog-scrollable {
                margin: 0;
            }
            paper-dialog-scrollable::slotted(#scrollable) {
                padding-right: 4px;
            }
            paper-button.keyboard-focus {
                font-weight: bold !important;
            }
        </style>

        <vaadin-dialog id="tagsModal" theme="mist-dialog" with-backdrop="">
            <template>
                <h2>Tags</h2>
                <div class="paper-dialog-scrollable">
                    <div class="tag-list">
                        <p hidden\$="[[!showEmpty]]"><em>No tags. Save to clear all tags.</em></p>
                        <template is="dom-repeat" items="[[tags]]" as="tag">
                            <tag-item tag="[[tag]]" index="[[index]]" on-tag-delete="_tagDeleteHandler" on-tag-change="_tagUpdate" existing-tag-keys="[[existingTagKeys]]" existing-tag-values="[[existingTagValues]]"></tag-item>
                        </template>
                    </div>
                </div>
                <paper-button class="submit-btn add" on-tap="_addTag">
                    <iron-icon icon="add"></iron-icon> Add Tag
                </paper-button>
                <div id="progress">
                    <paper-progress indeterminate="" hidden\$="[[!showProgress]]"></paper-progress>
                    <paper-progress error="" hidden\$="[[!hasError]]"></paper-progress>
                    <div class="errorarea" hidden\$="[[!hasError]]">
                        <iron-icon icon="icons:error-outline"></iron-icon><span id="errormsg" hidden\$="[[!hasError]]">[[errormsg]]</span>
                    </div>
                </div>
                <div class="clearfix bottom-actions xs12">
                    <paper-button on-tap="_closeDialog">Cancel</paper-button>
                    <paper-button class="submit-btn pull-right blue save" on-tap="_saveTags" dialog-confirm="">Save</paper-button>
                </div>
            </template>
        </vaadin-dialog>
        <iron-ajax id="tagsAjaxRequest" url="/api/v1/tags" method="POST" handle-as="xml" on-response="_handleTagsAjaxResponse" on-error="_handleTagsAjaxError"></iron-ajax>
`,

    is: 'tags-form',

    properties: {
        resource: {
            type: String,
        },
        model: {
            type: Object
        },
        existingTags: {
            type: Array,
            computed: '_computeExistingTags(model.*)'
        },
        existingTagKeys: {
            type: Array,
            computed: '_computeExistingTagKeys(existingTags)'
        },
        existingTagValues: {
            type: Array,
            computed: '_computeExistingTagValues(existingTags)'
        },
        items: {
            type: Array,
            value() { return []; }
        },
        type: {
            type: String
        },
        tags: {
            type: Array,
            value() { return []; },
        },
        tagsToDelete: {
            type: Array,
            value() { return []; },
        },
        hasError: {
            type: Boolean,
            value: false
        },
        showProgress: {
            type: Boolean,
            value: false
        },
        showEmpty: {
            type: Boolean,
            computed: "_computeShowEmpty(tags, tags.length)",
            value: false
        },
        errormsg: {
            type: String
        }
    },

    observers: [
        'selectedItemsChanged(items.*)'
    ],

    listeners: {
        'tag-delete': '_tagDeleteHandler',
        'tag-change': '_tagUpdate'
    },

    ready(){
    },

    _openDialog(e) {
        this.shadowRoot.querySelector('vaadin-dialog').opened = true;
    },

    _closeDialog() {
        this.shadowRoot.querySelector('vaadin-dialog').opened = false;
    },

    _modalReset(e) {
        this.set('tagsToDelete', []);
        this.set('showProgress', false);
        this.set('hasError', false);
        this.errormsg = '';
    },

    _computeExistingTags(model) {
        let existingTags = [];
        if (this.model) {
            // loop in taggable resources
            for (const resources in this.model) {
                if (['machines', 'clouds', 'stacks', 'volumes', 'networks', 'zones', 'keys', 'images', 'scripts', 'templates', 'schedules', 'schedules', 'teams'].indexOf(resources) > -1) {
                    // loop in resources items
                    for (const id in this.model[resources]) {
                        // loop in resources items with tags
                        if (this.model[resources][id] && this.model[resources][id].tags && Object.keys(this.model[resources][id].tags).length > 0) {
                            existingTags = this._addTags(existingTags, this.model[resources][id].tags);
                        }
                    }
                }
            }
        }
        return existingTags;
    },

    _computeExistingTagKeys(existingTags) {
        if (this.existingTags) {
            return this.existingTags.map(t=>Object.keys(t).join()).filter(function(v,i,s){
                return s.indexOf(v) === i;
            });
        }
        return [];
    },

    _computeExistingTagValues(existingTags) {
        if (this.existingTags) {
            return this.existingTags.map(t=>Object.values(t).join()).filter(function(v,i,s){return v && s.indexOf(v) === i;});
        }
        return [];
    },

    _addTags(arr, tags){
        if (arr && tags) {
            const keys = arr.map(tag => Object.keys(tag).join()) || [];
            for (const p in tags) {
                const index = keys.indexOf(p);
                if (index == -1 || (index > -1 && this._nonEqualTagValues(arr[index], tags[p])) ) {
                    const obj = {};
                    obj[p] = tags[p];
                    arr.push( obj );
                }
            }
        }
        return arr;
    },

    _nonEqualTagValues(val1,val2){
        var val1 = val1 || ''; var val2 = val2 || '';
        return val1 != val2;
    },

    selectedItemsChanged(itemsNew){
        // freeze updating of selectedItems when dialog is open
        if (!this.$.tagsModal.opened) {
            this._computeTags();
        }
    },

    _computeShowEmpty(tags, length){
        if (this.tags && this.tags.length>0) {
            return false;
        } 
            return true;
        
    },

    _computeTags(lengths) {
        let tags = this._computeCommonTags(this.items);
        // console.log('_computeTags',tags.length);
        if (!tags.length) {
            tags = [{
                key: '',
                value: ''
            }];
        }
        this.set('tags', tags);
    },

    _computeCommonTags(items) {
        let tagset = new Set();
        let isection = new Set();

        for (let i = 0; i < items.length; i++) {
            var item = items[i];
            if (item && item.tags) {
                if (i == 0) {
                    // console.log('itemObj.tags',item.tags);
                    tagset = new Set(Object.keys(item.tags).map(function(key){
                        return `${key}=${item.tags[key]}`;
                    }));
                } else {
                    isection = intersection(tagset, Object.keys(item.tags).map(function(key){
                            return `${key}=${item.tags[key]}`;
                        }) || []);
                    tagset = new Set(isection);
                }
            }
        }

        return Array.from(tagset).map(function(item){
            return {key: item.split('=')[0],
                    value: item.split('=')[1]};
        }) || [];
    },

    _addTag() {
        const newTag = {
            key: '',
            value: ''
        };
        this.push('tags', newTag);
    },

    _tagDeleteHandler(e) {
        console.log('_tagDeleteHandler');
        const {tag} = e.detail;
            const index = this.tags.indexOf(tag);
            this.splice('tags', index, 1);
        if (tag.key && !this._inArray(tag, this.tagsToDelete)) {
            tag.op = "-";
            this.push('tagsToDelete', tag);
        }
    },

    _tagUpdate(e){
        // this._tagDeleteHandler(e);
        console.log(e.detail);

        const {oldTag} = e.detail;
        const {newTag} = e.detail;

        // move old tag to tags to delete
        if (oldTag.key && oldTag.key != newTag.key && !this._inArray(oldTag, this.tagsToDelete)){
            oldTag.op = "-";
            this.push('tagsToDelete', oldTag);
        }
    },

    _inArray(tag, tagstodelete){
        const tin = this.tagsToDelete.find(function(t){
            return t.key == tag.key;
        })
        // console.log('tin', tin);
        return !!tin;
    },

    _saveTags() {
        // console.log('_saveTags', this.items);
        const newTags = this.tags.filter(function(tag) {
                return tag.key;
            });
            let payload = [];
            let deltags = [];

        if (this.tagsToDelete.length > 0) {
            deltags = this.tagsToDelete.filter(function(tag){
                return tag.key != "";
            });
        }

        payload = this.items.map(function(item) {
            const itemCloudId = item.cloud ? item.cloud || item.cloud_id : '';
                const itemId = item.id;

            const newItem = {};

            if (this.type == "machine") {
                newItem.resource = {
                    type: this.type,
                    item_id: this.model.machines[itemId].machine_id,
                    cloud_id: this.model.machines[itemId].cloud
                };
            } else {
                newItem.resource = {
                    type: this.type,
                    item_id: itemId,
                    cloud_id: ['image', 'network', 'volume', 'zone'].indexOf(this.type) != -1 ? itemCloudId : ''
                };
            }
            newItem.tags = newTags.concat(deltags);
            return newItem;
        }, this);
        // console.log('payload',payload);

        this.$.tagsAjaxRequest.body = payload;
        this.$.tagsAjaxRequest.headers["Content-Type"] = 'application/json';
        this.$.tagsAjaxRequest.headers["Csrf-Token"] = CSRFToken.value;
        this.$.tagsAjaxRequest.generateRequest();

        this.set('showProgress', true);
    },

    _handleTagsAjaxResponse(e) {
        console.log('_handleTagsAjaxResponse');
        this._closeDialog();
        this._modalReset();
        this.dispatchEvent(new CustomEvent('action-finished', { bubbles: true, composed: true, detail: {success: true} }));
        this.dispatchEvent(new CustomEvent('toast', { bubbles: true, composed: true, detail: {msg:'Tags were updated!',duration:3000} }));
    },

    _handleTagsAjaxError(e){
        console.log('Tags Error',e, e.detail.request.xhr.responseText);
        this.set('showProgress', false);
        this.set('hasError', true);
        this.errormsg = e.detail.request.xhr.responseText;
    }
    });
