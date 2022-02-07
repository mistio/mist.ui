import '@polymer/polymer/polymer-legacy.js';
import '@mistio/mist-list/code-viewer.js';
import { Polymer } from '@polymer/polymer/lib/legacy/polymer-fn.js';
import { html } from '@polymer/polymer/lib/utils/html-tag.js';

Polymer({
  _template: html`
    <style include="shared-styles info-table-style">
      :host {
        font-size: 14px;
        --code-viewer-toolbar-height: 36px;
        --code-viewer-fullscreen-padding: 8px;
        --code-viewer-fullscreen-margin-left: 0;
        --code-viewer-copyBtn-size: 36px;
      }

      .flex-horizontal-with-ratios {
        @apply --layout-horizontal;
      }

      .flexchild {
        @apply --layout-flex;
        padding: 16px;
      }

      .resizable {
        overflow: auto;
        resize: both;
      }

      code-viewer {
        height: 100%;
        width: 100%;
        box-shadow: rgb(255 255 255 / 20%) 0px 0px 0px 1px inset,
          rgb(222 222 222 / 90%) 0px 0px 0px 1px;
      }

      code-viewer {
        --code-viewer-toolbar-background-color: #fff;
      }

      .flexchild.key {
        font-weight: 500;
      }

      .flex-horizontal-with-ratios:nth-child(even) {
        background-color: #f2f2f2;
      }

      :host div {
        word-break: break-all;
      }
    </style>
    <div id="infobody" class="info-body">
      <template is="dom-repeat" items="[[_removeIgnored(sortedContent)]]">
        <div class="info-item flex-horizontal-with-ratios">
          <div class="flexchild key">[[processKeys(item.key)]]</div>
          <div
            class$="flexchild [[_isResizable(item, index)]]"
            style$="[[_getWidth(item)]]"
          >
            <template is="dom-if" if="[[_isArrayOrObject(item)]]" restamp="">
              <code-viewer
                language="json"
                theme="vs-light"
                read-only
                value="[[_jsonValue(item)]]"
              ></code-viewer>
            </template>

            <template is="dom-if" if="[[_isPassword(item)]]" restamp="">
              [[_replaceForPassword(item.value)]]
            </template>

            <template is="dom-if" if="[[_isPowerState(item)]]" restamp=""
              >running</template
            >

            <template
              is="dom-if"
              if="[[_notStatePasswordArray(item)]]"
              restamp=""
            >
              <template
                is="dom-if"
                if="[[!_displayXmlViewer(item, parserOutputType, index)]]"
                restamp=""
              >
                [[replaceURLWithHTMLLinks(item.value)]]
              </template>

              <template
                is="dom-if"
                if="[[_displayXmlViewer(item, parserOutputType, index)]]"
                restamp=""
              >
                <code-viewer
                  language="xml"
                  theme="vs-light"
                  read-only
                  value="[[_replaceForXML(item)]]"
                ></code-viewer>
              </template>
            </template>
          </div>
        </div>
      </template>
    </div>
  `,

  is: 'element-for-in',

  properties: {
    content: {
      type: Object,
      value: {},
      observer: '_contentChanged',
    },
    sortedContent: {
      type: Array,
      value() {
        return [];
      },
    },
    tabSize: {
      value: 2,
    },
    ignore: {
      type: String,
    },
    parserOutputType: {
      type: Array,
      value() {
        return [];
      },
    },
  },
  _removeIgnored(content) {
    if (!content || !(content instanceof Array)) {
      return [];
    }
    return content.filter(
      item => !(this.ignore && item.key.indexOf(this.ignore) > -1)
    );
  },
  _jsonValue(item) {
    return JSON.stringify(item.value, undefined, this.tabSize);
  },
  _contentChanged(newValue, _oldValue) {
    const newObj = [];
    const obj = newValue;

    // check if not empty the container object
    if (obj && Object.keys(obj).length > 0) {
      // loop through pairs
      Object.keys(obj).forEach(el => {
        if (obj[el]) {
          newObj.push({
            key: el,
            value: obj[el],
          });
        }
      });

      this.sortArr(newObj);
      const arr = [];
      newObj.forEach((item, index) => {
        try {
          arr[index] = new window.DOMParser().parseFromString(
            this.unescapeHtml(item.value),
            'text/xml'
          ).documentElement.nodeName;
        } catch (e) {
          console.log('e ', e);
          arr[index] = null;
        }
      });
      this.set('parserOutputType', arr);
      this.set('sortedContent', newObj);
    }
  },

  sortArr(array) {
    array.sort((a, b) => {
      const x = a.key;
      const y = b.key;
      const res = x > y ? 1 : 0;
      return x < y ? -1 : res;
    });
  },
  replaceURLWithHTMLLinks(text) {
    if (!text.replace) return text;
    const exp = /(\b(https?|ftp|file):\/\/[-A-Z0-9+&@#/%?=~_|!:,.;]*[-A-Z0-9+&@#/%=~_|])/i;
    return text.replace(exp, "<a href='$1' target='new'>$1</a>");
  },
  unescapeHtml(unsafe) {
    return (
      unsafe &&
      unsafe
        .replace(/&amp;/g, '&')
        .replace(/&lt;/g, '<')
        .replace(/&gt;/g, '>')
        .replace(/&quot;/g, '"')
        .replace(/&#039;/g, "'")
    );
  },
  _isArrayOrObject(item) {
    return item.value instanceof Object || item.value instanceof Array;
  },
  _isPassword(item) {
    return !this._isArrayOrObject(item) && item.key.indexOf('password') > -1;
  },
  _isPowerState(item) {
    return (
      !this._isArrayOrObject(item) &&
      item.key.indexOf('power_state') > -1 &&
      item.value === 1
    );
  },
  _notStatePasswordArray(item) {
    return (
      !this._isArrayOrObject(item) &&
      (!this._isPassword(item) || !this._isPowerState(item))
    );
  },
  _isResizable(item, index) {
    return this._isArrayOrObject(item) ||
      (!this._notStatePasswordArray(item) &&
        this._parserOutputNotError(this.parserOutputType[index]))
      ? 'resizable'
      : '';
  },
  _getWidth(item) {
    return this._isArrayOrObject(item) ? 'width: 70%' : '';
  },
  _parserOutputHtml(parserOutputType, index) {
    return this.parserOutputType[index] === 'html';
  },
  _parserOutputNotError(parserOutputType, index) {
    return this.parserOutputType[index] !== 'parsererror';
  },
  _replaceForPassword(value) {
    return value.replace('<', '&lt;').replace('>', '&gt;');
  },
  _replaceForXML(item) {
    return this.unescapeHtml(item.value).replace(/'/g, '"');
  },
  _displayXmlViewer(item, parserOutputType, index) {
    return (
      this.parserOutputType[index] &&
      this.parserOutputType[index] !== 'parsererror' &&
      this.parserOutputType[index] !== 'html'
    );
  },
  processKeys(str) {
    const words = str.split('_');
    let result = '';
    let gap;
    let word;
    for (let i = 0, len = words.length; i < len; i++) {
      gap = i === 0 ? '' : ' ';
      word = words[i]; // this.toTitleCase(words[i]);
      result += gap.concat(word);
    }
    return result;
  },
  toTitleCase(str) {
    return str.replace(
      /\w\S*/g,
      txt => txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase()
    );
  },
});
