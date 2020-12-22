import '../../node_modules/@polymer/polymer/polymer-legacy.js';
import '../../node_modules/@polymer/paper-button/paper-button.js';
import '../../node_modules/@polymer/paper-styles/typography.js';
import '../../node_modules/@polymer/neon-animation/animations/scale-up-animation.js';
import '../../node_modules/@polymer/neon-animation/animations/fade-out-animation.js';
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
        width: 100%;
      }

      .tag-list {
        padding: 0 0 24px 0;
      }

      .bottom-actions {
        padding-bottom: 2px;
        margin-top: 16px;
        margin-bottom: 16px;
        overflow: hidden;
        vertical-align: middle;
        display: block;
        width: 100%;
      }

      paper-dialog {
        max-width: 450px;
      }

      paper-button {
        display: inline;
      }

      .pull-right {
        float: right;
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
        margin-bottom: 16px;
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
      #progress paper-progress[error] > ::slotted(#primaryProgress) {
        background-color: var(--red-color) !important;
      }
      paper-dialog-scrollable {
        margin: 0;
      }
    </style>

    <paper-dialog
      id="tagsModal"
      entry-animation="scale-up-animation"
      exit-animation="fade-out-animation"
      with-backdrop=""
    >
      <h2>Tags</h2>
      <paper-dialog-scrollable>
        <div class="tag-list">
          <p hidden$="[[!showEmpty]]">
            <em>No tags. Save to clear all tags.</em>
          </p>
          <template is="dom-repeat" items="[[tags]]" as="tag">
            <tag-item tag="[[tag]]" index="[[index]]"></tag-item>
          </template>
        </div>
      </paper-dialog-scrollable>
      <div id="progress">
        <paper-progress
          indeterminate=""
          hidden$="[[!showProgress]]"
        ></paper-progress>
        <paper-progress error="" hidden$="[[!hasError]]"></paper-progress>
        <div class="errorarea" hidden$="[[!hasError]]">
          <iron-icon icon="icons:error-outline"></iron-icon
          ><span id="errormsg" hidden$="[[!hasError]]"></span>
        </div>
      </div>

      <div class="clearfix bottom-actions xs12">
        <paper-button class="submit-btn add" on-tap="_addTag">
          <iron-icon icon="add"></iron-icon> Add Tag</paper-button
        >
        <paper-button class="submit-btn pull-right blue save" on-tap="_saveTags"
          >Save <span hidden$="[[showEmpty]]"> Tags</span></paper-button
        >
        <paper-button class="pull-right blue-link" dialog-dismiss=""
          >Cancel</paper-button
        >
      </div>
    </paper-dialog>
    <iron-ajax
      id="tagsAjaxRequest"
      url="/api/v1/tags"
      method="POST"
      handle-as="xml"
      on-response="_handleTagsAjaxResponse"
      on-error="_handleTagsAjaxError"
    ></iron-ajax>
  `,

  is: 'tags-list',

  properties: {
    resource: {
      type: String,
    },
    model: {
      type: Object,
    },
    items: {
      type: Array,
      notify: true,
    },
    tags: {
      type: Array,
    },
    tagsToDelete: {
      type: Array,
    },
    hasError: {
      type: Boolean,
      value: false,
    },
    showProgress: {
      type: Boolean,
      value: false,
    },
    showEmpty: {
      type: Boolean,
      computed: '_computeShowEmpty(tags, tags.length)',
      value: false,
      notify: true,
    },
  },

  observers: ['selectedItemsChanged(items.splices)'],

  listeners: {
    'iron-overlay-closed': '_modalClosed',
    'tag-delete': '_tagDeleteHandler',
    'tag-change': '_tagUpdate',
  },

  ready() {
    this.set('items', []);
    this.set('tags', []);
    this.set('tagsToDelete', []);
  },

  _openDialog(_e) {
    this.shadowRoot.querySelector('paper-dialog').open();
  },

  _closeDialog() {
    this.shadowRoot.querySelector('paper-dialog').close();
  },

  _modalClosed(_e) {
    this.set('tagsToDelete', []);
    this.set('showProgress', false);
    this.set('hasError', false);
    this.$.errormsg.textContent = '';
  },

  selectedItemsChanged(_splices) {
    // console.log('selectedItemsChanged', splices);
    // freeze updating of selectedItems when dialog is open
    if (!this.$.tagsModal.opened) this._computeTags(this.items);
  },

  _computeShowEmpty(_tags, _length) {
    if (this.tags && this.tags.length > 0) return false;
    return true;
  },

  _computeTags(_lengths) {
    let tags = this._computeCommonTags(this.items);
    // console.log('_computeTags',tags.length);
    if (!tags.length) {
      tags = [
        {
          key: '',
          value: '',
        },
      ];
    }
    this.set('tags', tags);
  },

  _computeCommonTags(items) {
    let tagset = new Set();
    let isection = new Set();

    for (let i = 0; i < items.length; i++) {
      const item = items[i];

      const itemType = item.split(':')[0];
      const itemCloudId = item.split(':')[1];
      const itemId = item.split(':')[2];
      let itemObj = {};
      if (['machine', 'image'].indexOf(itemType) !== -1 && itemCloudId)
        itemObj = this.model.clouds[itemCloudId][`${itemType}s`][itemId];
      else {
        itemObj = this.model[`${itemType}s`][itemId];
      }
      if (itemObj) {
        if (!itemObj.tags) itemObj.tags = [];
        // TO FIX: network tags should not be type 'object', but Array of objects
        // only networks return their tags in such format. Below code patches it.
        else if (itemObj.tags && typeof itemObj.tags === 'object') {
          const foo = [];
          Object.keys(itemObj.tags || {}).forEach(p => {
            foo.push(itemObj.tags[p]);
          });
          itemObj.tags = foo;
        }

        if (i === 0) {
          // console.log('itemObj.tags',itemObj.tags);
          tagset = new Set(
            itemObj.tags.map(tag => {
              return `${tag.key}=${tag.value}`;
            })
          );
        } else {
          isection = intersection(
            tagset,
            itemObj.tags.map(tag => {
              return `${tag.key}=${tag.value}`;
            }) || []
          );
          tagset = new Set(isection);
        }
      }
    }

    return (
      Array.from(tagset).map(item => {
        return { key: item.split('=')[0], value: item.split('=')[1] };
      }) || []
    );
  },

  _addTag() {
    const newTag = {
      key: '',
      value: '',
    };
    this.push('tags', newTag);
  },

  _tagDeleteHandler(e) {
    const { tag } = e.detail;
    const index = this.tags.indexOf(tag);
    this.splice('tags', index, 1);
    if (tag.key && !this._inArray(tag, this.tagsToDelete)) {
      tag.op = '-';
      this.push('tagsToDelete', tag);
    }
  },

  _tagUpdate(e) {
    // this._tagDeleteHandler(e);
    console.log(e.detail);

    const { oldTag } = e.detail;
    const { newTag } = e.detail;

    // move old tag to tags to delete
    if (
      oldTag.key &&
      oldTag.key !== newTag.key &&
      !this._inArray(oldTag, this.tagsToDelete)
    ) {
      oldTag.op = '-';
      this.push('tagsToDelete', oldTag);
    }
  },

  _inArray(tag, _tagstodelete) {
    const tin = this.tagsToDelete.find(t => {
      return t.key === tag.key;
    });
    // console.log('tin', tin);
    return !!tin;
  },

  _saveTags() {
    // console.log('_saveTags', this.items);
    const newTags = this.tags.filter(tag => {
      return tag.key;
    });
    let payload = [];
    let deltags = [];

    if (this.tagsToDelete.length > 0) {
      deltags = this.tagsToDelete.filter(tag => {
        return tag.key !== '';
      });
    }

    payload = this.items.map(item => {
      const itemType = item.split(':')[0];
      const itemCloudId = item.split(':')[1];
      const itemId = item.split(':')[2];

      const newItem = {};

      if (itemType === 'machine') {
        newItem.resource = {
          type: itemType,
          item_id: this.model.machines[itemId].machine_id,
          cloud_id: this.model.machines[itemId].cloud.id,
        };
      } else {
        newItem.resource = {
          type: itemType,
          item_id: itemId,
          cloud_id:
            ['image', 'network'].indexOf(itemType) !== -1 ? itemCloudId : '',
        };
      }
      newItem.tags = newTags.concat(deltags);
      return newItem;
    }, this);
    console.log('payload', payload);

    this.$.tagsAjaxRequest.body = payload;
    this.$.tagsAjaxRequest.headers['Content-Type'] = 'application/json';
    this.$.tagsAjaxRequest.headers['Csrf-Token'] = CSRFToken.value;
    this.$.tagsAjaxRequest.generateRequest();

    this.set('showProgress', true);
  },

  _handleTagsAjaxResponse(_e) {
    this._closeDialog();
    this.dispatchEvent(
      new CustomEvent('toast', {
        bubbles: true,
        composed: true,
        detail: { msg: 'Tags were updated!', duration: 3000 },
      })
    );
  },

  _handleTagsAjaxError(e) {
    console.log('Tags Error', e, e.detail.request.xhr.responseText);
    this.set('showProgress', false);
    this.set('hasError', true);
    this.$.errormsg.textContent = e.detail.request.xhr.responseText;
  },
});
