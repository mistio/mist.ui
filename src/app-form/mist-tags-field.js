import '../../node_modules/@polymer/polymer/polymer-legacy.js';
import '../../node_modules/@polymer/paper-styles/typography.js';
import '../../node_modules/@polymer/paper-button/paper-button.js';
import '../../node_modules/@polymer/iron-icons/iron-icons.js';
import '../tags/tag-item.js';
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

      .submit-btn.add {
        margin: 0;
        padding: 0;
      }

      iron-icon {
        color: inherit !important;
      }

      paper-button.keyboard-focus {
        font-weight: bold !important;
      }

      .title {
        text-transform: capitalize;
        font-weight: bold;
      }
    </style>
    <div class="title">[[field.label]]</div>
    <div class="tag-list">
      <template is="dom-repeat" items="[[tags]]" as="tag">
        <tag-item tag="[[tag]]" index="[[index]]"></tag-item>
      </template>
    </div>
    <paper-button class="submit-btn add" on-tap="_addTag">
      <iron-icon icon="add"></iron-icon> Add Tag
    </paper-button>
  `,

  is: 'mist-tags-field',

  properties: {
    field: {
      type: Object,
      notify: true,
    },
    tags: {
      type: Array,
      value: [],
    },
  },

  observers: ['_tagsChanged(tags.*)'],

  listeners: {
    input: '_tagsChanged',
    'tag-delete': '_tagDeleteHandler',
  },

  ready() {},

  _addTag() {
    const newTag = {
      key: '',
      value: '',
    };
    this.push('tags', newTag);
  },

  _tagsChanged(_tags) {
    const formattedTags = this.tags
      .filter(m => {
        return m.key.length;
      })
      .map(t => {
        console.log('t', t);
        const tag = {};
        tag[t.key] = t.value || null;
        return tag;
      });
    this.set('field.value', formattedTags);
  },

  _tagDeleteHandler(e) {
    const { tag } = e.detail;
    const index = this.tags.indexOf(tag);
    this.splice('tags', index, 1);
  },
});
