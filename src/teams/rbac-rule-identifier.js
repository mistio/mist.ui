import '../../node_modules/@polymer/paper-dropdown-menu/paper-dropdown-menu.js';
import '../../node_modules/@polymer/paper-listbox/paper-listbox.js';
import '../../node_modules/@polymer/paper-item/paper-item.js';
import '../../node_modules/@polymer/paper-input/paper-input.js';
import { Polymer } from '../../node_modules/@polymer/polymer/lib/legacy/polymer-fn.js';
import { html } from '../../node_modules/@polymer/polymer/lib/utils/html-tag.js';

Polymer({
  _template: html`
    <style include="shared-styles tags-and-labels">
      :host {
        display: flex;
        align-items: center;
      }

      paper-dropdown-menu {
        width: 150px;

        --paper-dropdown-menu-input: {
          text-transform: uppercase;
        }

        --paper-input-container-underline: {
          /*display: none;*/
          opacity: 0.32;
        }
      }

      paper-dropdown-menu.short {
        /*width: 80px;*/
        margin-right: 16px;
      }

      paper-input {
        vertical-align: middle;
      }

      .flex {
        display: inline-flex;
      }

      .tag {
        vertical-align: middle;
      }

      paper-input {
        --paper-input-container-underline {
          opacity: 0.32;
        }
      }

      .tag iron-icon {
        color: #fff;
        width: 13px;
        height: 13px;
        cursor: pointer;
      }

      iron-icon.edit {
        color: inherit;
        padding: 8px;
        opacity: 0.32;
      }
    </style>
    <paper-dropdown-menu class="short" no-animations="" no-label-float="">
      <paper-listbox
        slot="dropdown-content"
        id="identifierSelector"
        class="dropdown-content"
        selected="[[selectedIndetifierType]]"
      >
        <paper-item class="identifier-type" data-value="always"
          >ALWAYS</paper-item
        >
        <paper-item
          class="identifier-type"
          data-value="id"
          hidden$="[[!rule.rtype.length]]"
          >WHERE ID</paper-item
        >
        <paper-item class="identifier-type" data-value="tags"
          >WHERE TAGS</paper-item
        >
      </paper-listbox>
    </paper-dropdown-menu>
    <span hidden$="[[!showTags]]">
      <template is="dom-repeat" items="[[tags]]" as="tag">
        <span class="tag" hidden$="[[showEdit]]"
          >[[tag]]
          <iron-icon
            id$="tag-[[index]]"
            icon="close"
            on-tap="_deleteTag"
          ></iron-icon>
        </span>
      </template>
    </span>
    <span hidden$="[[!showDropDown]]">
      <paper-dropdown-menu
        no-animations=""
        hidden$="[[showTags]]"
        placeholder="[[placeholder]]"
        no-label-float=""
      >
        <paper-listbox
          slot="dropdown-content"
          class="dropdown-content"
          attr-for-selected="datavalue"
          selected="{{rule.rid}}"
        >
          <template
            is="dom-repeat"
            items="[[availableResourceItems]]"
            as="resource"
          >
            <paper-item
              class="rid"
              id="[[resource.id]]"
              datavalue="[[resource.id]]"
              >[[_computeResourceCloud(resource)]] [[resource.title]]
              [[resource.name]] [[resource.domain]]</paper-item
            >
          </template>
        </paper-listbox>
      </paper-dropdown-menu>
    </span>
    <span hidden$="[[!showTags]]">
      <div class="flex">
        <paper-input
          id="inputField"
          value$="{{tagString::input}}"
          hidden$="[[!showEdit]]"
          on-blur="_updateTags"
          no-label-float=""
        ></paper-input>
        <iron-icon
          class="edit"
          icon="editor:mode-edit"
          on-tap="_toggleShowEdit"
        ></iron-icon>
      </div>
    </span>
  `,

  is: 'rbac-rule-identifier',

  properties: {
    model: {
      type: Object,
    },
    rule: {
      type: Object,
    },
    index: {
      type: Number,
    },
    selectedIndetifierType: {
      type: Number,
      computed: '_computeSelectedIdentifierType(rule, rule.rtags, rule.rid)',
    },
    availableResourceItems: {
      type: Array,
      value() {
        return [];
      },
      computed: '_computeAvailableResourceItems(rule.rtype, model.*)',
    },
    showDropDown: {
      type: Boolean,
      value: false,
    },
    showTags: {
      type: Boolean,
      value: false,
    },
    ruleHasTags: {
      type: Boolean,
      value: false,
      computed: '_ruleHasTags(rule, rule.rtags)',
    },
    showEdit: {
      type: Boolean,
      value: false,
    },
    tagString: {
      type: String,
      computed: '_computeTagString(rule, rule.rtags)',
    },
    tags: {
      type: Array,
      computed: '_computeTagsArray(rule.rtags)',
    },
    placeholder: {
      type: String,
    },
  },

  listeners: {
    'iron-select': '_updateIdentifier',
    keyup: 'hotkeys',
  },

  _computeTagString(rule, rtags) {
    return this._computeTagsArray(rtags).join(', ');
  },

  _computeResourceCloud(resource) {
    if (
      !resource ||
      !resource.cloud ||
      !this.model ||
      !this.model.clouds ||
      !this.model.clouds[resource.cloud]
    )
      return '';
    return `${this.model.clouds[resource.cloud].title} ::`;
  },

  _updateIdentifier(e) {
    // case of changing identifier-type
    if (
      e.detail.item.attributes.class.nodeValue.indexOf('identifier-type') > -1
    ) {
      const identifierType = e.detail.item.dataset.value.toLowerCase();
      if (identifierType === 'tags') {
        this.set('showDropDown', false);
        this.set('showTags', true);
        if (this.tags.length === 0) {
          this.set('showEdit', true);
          // this.dispatchEvent(new CustomEvent('update-rid', { bubbles: true, composed: true, detail: {'index': this.index, 'rid': ''} }));
        }
      } else if (identifierType === 'id') {
        this.set('showDropDown', true);
        this.set('showTags', false);
        // this.dispatchEvent(new CustomEvent('update-rtags', { bubbles: true, composed: true, detail: {'index': this.index, 'rtags': {}} }));
      } else {
        this.set('showDropDown', false);
        this.set('showTags', false);
        this.dispatchEvent(
          new CustomEvent('update-rid', {
            bubbles: true,
            composed: true,
            detail: {
              index: this.index,
              rid: '',
            },
          })
        );

        this.dispatchEvent(
          new CustomEvent('update-rtags', {
            bubbles: true,
            composed: true,
            detail: {
              index: this.index,
              rtags: {},
            },
          })
        );
      }
    } else if (e.detail.item.attributes.class.nodeValue.indexOf('rid') > -1) {
      // case of choοsing rid
      const rid = e.detail.item.id;
      this.dispatchEvent(
        new CustomEvent('update-rid', {
          bubbles: true,
          composed: true,
          detail: {
            index: this.index,
            rid,
          },
        })
      );
    }
  },

  _ruleHasTags(rule, _tags) {
    if (Object.keys(rule.rtags).length > 0) this.showTags = true;
    return Object.keys(rule.rtags).length > 0;
  },

  _ruleHasId(rule) {
    return rule.rid.length > 0;
  },

  _computeTagsArray(tags) {
    if (tags) {
      const arrTags = Object.keys(tags);
      for (let i = 0; i < arrTags.length; i++) {
        const t = arrTags[i];
        if (tags[t] != null) {
          arrTags[i] = `${arrTags[i]}=${tags[t]}`;
        }
      }
      return arrTags;
    }
    return [];
  },

  _computeLink(type, id) {
    if (type && id && type !== 'cloud') {
      return false;
    }
    if (type === 'cloud' && id) {
      return this.model.clouds[id].title;
    }
    if (type === 'cloud' && !id) {
      return 'all clouds';
    }
    return false;
  },

  _computeResourceName(type, id) {
    if (type && id) {
      const mod = this.model[`${type}s`];
      return mod[id].name;
    }
    return '';
  },

  _computeSelectedIdentifierType(_rule, _rtags, _rid) {
    if (this.rule && this.rule.rid && this.rule.rid.length > 0) {
      return 1;
    }
    if (this.rule && this.rule.rtags) {
      return Object.keys(this.rule.rtags).length > 0 ? 2 : 0;
    }
    return 0;
  },

  _computeRecords() {
    const allRecords = [];
    Object.values(this.model.zones).forEach(zone => {
      zone.records.forEach(record => {
        allRecords.push(record);
      });
    });
    return allRecords;
  },

  _computeAvailableResourceItems(rtype, _model) {
    if (rtype) {
      if (rtype === 'location') {
        let allLocations = [];
        Object.values(this.model.clouds || {}).forEach(cloud => {
          allLocations = allLocations.concat(
            Object.values(cloud.locations || {})
          );
        });
        return allLocations;
      }
      if (rtype === 'record') {
        const records = this._computeRecords();
        this.set('placeholder', records.length ? '' : 'no zones found');
        return records;
      }
      if (rtype && Object.keys(this.model).indexOf(`${rtype}s`) > -1) {
        this.set(
          'placeholder',
          Object.keys(this.model[`${rtype}s`]).length
            ? ''
            : `no ${rtype}s found`
        );
        return Object.values(this.model[`${rtype}s`]);
      }
    }
    return [];
  },

  _toggleShowEdit() {
    this.set('showEdit', !this.showEdit);
  },

  _updateTags() {
    const tagArr = this.$.inputField.value.split(',');
    const newRtags = {};
    tagArr.forEach(t => {
      const k = t.split('=')[0].replace(' ', '').trim();
      if (k !== '') {
        const v = t.split('=')[1] ? t.split('=')[1].trim() : null;
        newRtags[k] = v;
      }
    }, this);
    this.set('showEdit', false);
    this.dispatchEvent(
      new CustomEvent('update-rtags', {
        bubbles: true,
        composed: true,
        detail: {
          index: this.index,
          rtags: newRtags,
        },
      })
    );
  },

  _deleteTag(e) {
    const tag = e.detail.sourceEvent.path[1].textContent.split('=')[0].trim();
    // const index = e.detail.sourceEvent.path[0].id.split('-')[1];
    this.dispatchEvent(
      new CustomEvent('delete-rtag', {
        bubbles: true,
        composed: true,
        detail: {
          index: this.index,
          tag,
        },
      })
    );
  },

  hotkeys(e) {
    // if 'enter'
    if (e.keyCode === 13) {
      this.$.inputField.blur();
      this._updateTags();
    }
  },
});
