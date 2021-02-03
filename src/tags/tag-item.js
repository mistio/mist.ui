import '@polymer/polymer/polymer-legacy.js';
import '@polymer/paper-icon-button/paper-icon-button.js';
import '@vaadin/vaadin-combo-box/vaadin-combo-box.js';
import { Polymer } from '@polymer/polymer/lib/legacy/polymer-fn.js';
import { html } from '@polymer/polymer/lib/utils/html-tag.js';

Polymer({
  _template: html`
    <style include="shared-styles tags-and-labels">
      :host {
        position: relative;
      }

      .input-box {
        @apply --layout-horizontal;
        align-items: flex-start;
      }

      strong {
        margin: 8px;
        font-size: 16px;
      }

      vaadin-combo-box {
        margin-right: 8px;
      }
    </style>

    <div class="input-box">
      <strong>[[newIndex]].</strong>
      <vaadin-combo-box
        class="key"
        value="{{tag.key}}"
        items="[[existingTagKeys]]"
        filter="[[tag.key]]"
        allow-custom-value=""
      >
        <template> [[item]] </template>
      </vaadin-combo-box>
      <vaadin-combo-box
        class="value"
        value="{{tag.value}}"
        items="[[existingTagValues]]"
        filter="[[tag.value]]"
        allow-custom-value=""
      >
        <template> [[item]] </template>
      </vaadin-combo-box>
      <paper-icon-button
        icon="delete"
        on-tap="_deleteTag"
        style="padding: 0"
      ></paper-icon-button>
    </div>
  `,

  is: 'tag-item',

  properties: {
    tag: {
      type: Object,
      notify: true,
    },
    existingTagKeys: {
      type: Array,
    },
    existingTagValues: {
      type: Array,
    },
    oldTag: {
      type: Object,
      value() {
        return {};
      },
      computed: 'storeOldTag(tag)',
    },
    index: {
      type: Number,
    },
    newIndex: {
      type: Number,
      computed: '_computeNewIndex(index)',
    },
  },

  listeners: {
    change: '_tagChange',
  },

  storeOldTag(_tag) {
    // store tag
    const oldTag = {};
    oldTag.key = this.tag.key;
    oldTag.value = this.tag.value;

    return oldTag;
  },

  _computeNewIndex(index) {
    return index + 1;
  },

  _deleteTag(_e) {
    const that = this;
    this.dispatchEvent(
      new CustomEvent('tag-delete', {
        bubbles: true,
        composed: true,
        detail: {
          tag: that.tag,
        },
      })
    );
  },

  _tagChange(_e) {
    const that = this;
    this.dispatchEvent(
      new CustomEvent('tag-change', {
        bubbles: true,
        composed: true,
        detail: {
          oldTag: that.oldTag,
          newTag: that.tag,
          index: that.index,
        },
      })
    );
  },
});
