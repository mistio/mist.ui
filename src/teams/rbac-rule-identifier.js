import '../../../../@polymer/paper-dropdown-menu/paper-dropdown-menu.js';
import '../../../../@polymer/paper-listbox/paper-listbox.js';
import '../../../../@polymer/paper-item/paper-item.js';
import '../../../../@polymer/paper-input/paper-input.js';
import { Polymer } from '../../../../@polymer/polymer/lib/legacy/polymer-fn.js';
import { html } from '../../../../@polymer/polymer/lib/utils/html-tag.js';

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

            ;
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
            <paper-listbox slot="dropdown-content" id="identifierSelector" class="dropdown-content" selected="[[selectedIndetifierType]]">
                <paper-item class="identifier-type" data-value="always">ALWAYS</paper-item>
                <paper-item class="identifier-type" data-value="id" hidden\$="[[!rule.rtype.length]]">WHERE ID</paper-item>
                <paper-item class="identifier-type" data-value="tags">WHERE TAGS</paper-item>
            </paper-listbox>
        </paper-dropdown-menu>
        <span hidden\$="[[!showTags]]">
            <template is="dom-repeat" items="[[tags]]" as="tag">
                <span class="tag" hidden\$="[[showEdit]]">[[tag]]
                    <iron-icon id\$="tag-[[index]]" icon="close" on-tap="_deleteTag"></iron-icon>
                </span>
            </template>
        </span>
        <span hidden\$="[[!showDropDown]]">
            <paper-dropdown-menu no-animations="" hidden\$="[[showTags]]" placeholder="[[placeholder]]" no-label-float="">
                <paper-listbox slot="dropdown-content" class="dropdown-content" attr-for-selected="datavalue" selected="{{rule.rid}}">
                    <template is="dom-repeat" items="[[availableResourceItems]]" as="resource">
                        <paper-item class="rid" id="[[resource.id]]" datavalue="[[resource.id]]">[[_computeResourceCloud(resource)]] [[resource.title]] [[resource.name]] [[resource.domain]]</paper-item>
                    </template>
                </paper-listbox>
            </paper-dropdown-menu>
        </span>
        <span hidden\$="[[!showTags]]">
            <div class="flex">
                <paper-input id="inputField" value\$="{{tagString::input}}" hidden\$="[[!showEdit]]" on-blur="_updateTags" no-label-float=""></paper-input>
                <iron-icon class="edit" icon="editor:mode-edit" on-tap="_toggleShowEdit"></iron-icon>
            </div>
        </span>
`,

  is: 'rbac-rule-identifier',

  properties: {
      model: {
          type: Object,
      },
      rule: {
          type: Object
      },
      index: {
          type: Number,
      },
      selectedIndetifierType: {
          type: Number,
          computed: "_computeSelectedIdentifierType(rule, rule.rtags, rule.rid)"
      },
      availableResourceItems: {
          type: Array,
          value: function () { return []; },
          computed: '_computeAvailableResourceItems(rule.rtype, model.*)'
      },
      showDropDown: {
          type: Boolean,
          value: false
      },
      showTags: {
          type: Boolean,
          value: false
      },
      ruleHasTags: {
          type: Boolean,
          value: false,
          computed: "_ruleHasTags(rule, rule.rtags)"
      },
      showEdit: {
          type: Boolean,
          value: false
      },
      tagString: {
          type: String,
          computed: "_computeTagString(rule, rule.rtags)"
      },
      tags: {
          type: Array,
          computed: '_computeTagsArray(rule.rtags)'
      },
      placeholder: {
          type: String,
      }
  },

  listeners: {
      'iron-select': '_updateIdentifier',
      'keyup': 'hotkeys'
  },

  _computeTagString: function(rule, rtags) {
      return this._computeTagsArray(rtags).join(', ');
  },

  _computeResourceCloud: function (resource) {
      if (!resource || !resource.cloud || !this.model || !this.model.clouds || !this.model.clouds[resource.cloud])
          return '';
      return this.model.clouds[resource.cloud].title + ' ::';
  },

  _updateIdentifier: function(e) {
      // case of changing identifier-type 
      if (e.detail.item.attributes.class.nodeValue.indexOf('identifier-type') > -1) {
          var identifierType = e.detail.item.dataset.value.toLowerCase();
          if (identifierType == 'tags') {
              this.set('showDropDown', false);
              this.set('showTags', true);
              if (this.tags.length == 0) {
                  this.set('showEdit', true);
                  // this.dispatchEvent(new CustomEvent('update-rid', { bubbles: true, composed: true, detail: {'index': this.index, 'rid': ''} }));

              }
          } else if (identifierType == 'id') {
              this.set('showDropDown', true);
              this.set('showTags', false);
              // this.dispatchEvent(new CustomEvent('update-rtags', { bubbles: true, composed: true, detail: {'index': this.index, 'rtags': {}} }));

          } else {
              this.set('showDropDown', false);
              this.set('showTags', false);
              this.dispatchEvent(new CustomEvent('update-rid', { bubbles: true, composed: true, detail: {
                  'index': this.index,
                  'rid': ''
              } }));

              this.dispatchEvent(new CustomEvent('update-rtags', { bubbles: true, composed: true, detail:  {
                  'index': this.index,
                  'rtags': {}
              } }))
          }
      } else if (e.detail.item.attributes.class.nodeValue.indexOf('rid') > -1) { // case of choοsing rid
          var rid = e.detail.item.id;
          this.dispatchEvent(new CustomEvent('update-rid', { bubbles: true, composed: true, detail: {
              'index': this.index,
              'rid': rid
          } }));

      }
  },

  _ruleHasTags: function(rule, tags) {
      if (Object.keys(rule.rtags).length > 0)
          this.showTags = true;
      return Object.keys(rule.rtags).length > 0 ? true : false;
  },

  _ruleHasId: function(rule) {
      return rule.rid.length > 0 ? true : false;
  },

  _computeTagsArray: function(tags) {
      if (tags) {
          var arrTags = Object.keys(tags);
          for (var i = 0; i < arrTags.length; i++) {
              var t = arrTags[i];
              if (tags[t] != null) {
                  arrTags[i] = arrTags[i] + '=' + tags[t];
              }
          }
          return arrTags;
      } else {
          return []
      }
  },

  _computeLink: function(type, id) {
      if (type && id && type != "cloud") {
          return false;
      } else if (type == "cloud" && id) {
          return this.model.clouds[id].title;
      } else if (type == "cloud" && !id) {
          return 'all clouds';
      }
  },

  _computeResourceName: function(type, id) {
      if (type && id) {
          var mod = this.model[type + 's'];
          return mod[id].name;
      }
  },

  _computeSelectedIdentifierType: function(rule, rtags, rid) {
      if (this.rule && this.rule.rid && this.rule.rid.length > 0) {
          return 1;
      } else if (this.rule && this.rule.rtags) {
          return Object.keys(this.rule.rtags).length > 0 ? 2 : 0;
      }
  },

  _computeRecords: function() {
      var allRecords = [];
      Object.values(this.model['zones']).forEach(function(zone) {
          zone.records.forEach(function(record) {
              allRecords.push(record);
          })
      });
      return allRecords;
  },

  _computeAvailableResourceItems: function(rtype, model) {
      if (rtype) {
          if (rtype == 'location') {
              var allLocations = []
              Object.values(this.model.clouds || {}).forEach(function(cloud) {
                 allLocations = allLocations.concat(Object.values(cloud.locations || {}));
              });
              return allLocations;
          } else if (rtype == 'record') {
              var records = this._computeRecords();
              this.set('placeholder', records.length ? "" : "no zones found");
              return records;
          } else if (rtype && Object.keys(this.model).indexOf(rtype + 's') > -1) {
              this.set('placeholder', Object.keys(this.model[rtype + "s"]).length ? "" : "no " + rtype + "s found");
              return Object.values(this.model[rtype + 's']);
          }
      }
  },

  _toggleShowEdit: function() {
      this.set('showEdit', !this.showEdit);
  },

  _updateTags: function() {
      var tagArr = this.$.inputField.value.split(',');
      var newRtags = {};
      tagArr.forEach(function(t) {
          var k = t.split("=")[0].replace(' ', '').trim();
          if (k != '') {
              var v = t.split("=")[1] ? t.split("=")[1].trim() : null;
              newRtags[k] = v;
          }
      }, this);
      this.set('showEdit', false);
      this.dispatchEvent(new CustomEvent('update-rtags', { bubbles: true, composed: true, detail: {
          'index': this.index,
          'rtags': newRtags
      } }));

  },

  _deleteTag: function(e) {
      var tag = e.detail.sourceEvent.path[1].textContent.split('=')[0].trim();
      var index = e.detail.sourceEvent.path[0].id.split('-')[1];
      this.dispatchEvent(new CustomEvent('delete-rtag', { bubbles: true, composed: true, detail: {
          'index': this.index,
          'tag': tag
      } }));

  },

  hotkeys: function(e) {
      // if 'enter'
      if (e.keyCode === 13) {
          this.$.inputField.blur();
          this._updateTags();
      }
  }
});
