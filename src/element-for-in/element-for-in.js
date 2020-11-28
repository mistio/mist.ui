import '../../node_modules/@polymer/polymer/polymer-legacy.js';
import '../../node_modules/@advanced-rest-client/json-viewer/json-viewer.js';
import '../../node_modules/@advanced-rest-client/xml-viewer/xml-viewer.js';
import { Polymer } from '../../node_modules/@polymer/polymer/lib/legacy/polymer-fn.js';
import { html } from '../../node_modules/@polymer/polymer/lib/utils/html-tag.js';
import { YAML } from '../../node_modules/yaml/browser/dist/index.js';

Polymer({
  _template: html`
        <style include="shared-styles info-table-style">
        :host {
            font-size: 14px;
        }

        .flex-horizontal-with-ratios {
            @apply --layout-horizontal;
        }

        .flexchild {
            @apply --layout-flex;
            padding: 16px;
        }

        .flexchild.key {
            font-weight: 500;
        }

        .flex-horizontal-with-ratios:nth-child(even){
            background-color: #f2f2f2;
        }

        :host div {
            word-break: break-all;
        }
        </style>
        <div id="infobody" class="info-body"></div>
`,

  is: 'element-for-in',

  properties: {
      content: {
          type: Object,
          value: {},
          observer: '_contentChanged'
      },
      ignore: {
          type: String
      }
  },

  _contentChanged(newValue, _oldValue) {
      const newObj = [];
      const obj = newValue;

      // check if not empty the container object
      if (obj && Object.keys(obj).length > 0) {
          // loop through pairs
          Object.keys(obj).forEach((el) => {
              if (obj[el]) {
                  newObj.push({
                      key: el,
                      value: obj[el]
                  });
              }
          });

          this.sortArr(newObj);
      }

      this.$.infobody.innerHTML = this.createTpl(newObj);
  },

  sortArr(array) {
      array.sort((a, b) => {
          const x = a.key;
          const y = b.key;
          const res = (x > y) ? 1 : 0;
          return (x < y) ? -1 : res;
      });
  },

  createTpl(content) {
      function replaceURLWithHTMLLinks(text) {
          // console.log('createTpl',text);
          if (!text.replace)
              return text;
          const exp = /(\b(https?|ftp|file):\/\/[-A-Z0-9+&@#/%?=~_|!:,.;]*[-A-Z0-9+&@#/%=~_|])/i;
          return text.replace(exp, "<a href='$1' target='new'>$1</a>");
      }
      function unescapeHtml(unsafe) {
          return unsafe
              .replace(/&amp;/g, "&")
              .replace(/&lt;/g, "<")
              .replace(/&gt;/g, ">")
              .replace(/&quot;/g, "\"")
              .replace(/&#039;/g, "'");
      }
      let tpl = '';

      for (let i = 0, len = content.length; i < len; i++) {
          if (this.ignore && content[i].key.indexOf(this.ignore) > -1) {
              continue; // eslint-disable-line no-continue
          }
          tpl += "<div class='info-item flex-horizontal-with-ratios'>";
          tpl += `<div class='flexchild key'>${  this.processKeys(content[i].key)  }</div>`;
          // if value is an array
          if (content[i].value instanceof Object || content[i].value instanceof Array) {
              tpl += `<div class='flexchild' style='width: 70%'><json-viewer json='${  JSON.stringify(content[i].value)  }'></json-viewer></div>`;
          }
          // if key is password
          else if (content[i].key.indexOf("password") > -1) {
              tpl += `<div class='flexchild'>${  content[i].value.replace('<', '&lt;').replace('>', '&gt;')  }</div>`;
          }
          // if key is state
          else if (content[i].key.indexOf("power_state") > -1 && content[i].value === 1) {
              tpl += "<div class='flexchild'>running</div>";
          }
          else {
              try {
                  const parserOutputType = new window.DOMParser().parseFromString(unescapeHtml(content[i].value), "text/xml").documentElement.nodeName;
                  if (parserOutputType === 'html') {
                      tpl += `<div class='flexchild'>${  replaceURLWithHTMLLinks(content[i].value)  }</div>`;
                  } else if (parserOutputType !== 'parsererror'){
                      tpl += `<div class='flexchild'><xml-viewer xml='${  content[i].value.replace(/'/g, '"')  }'></xml-viewer></div>`;
                  } else {
                      tpl += `<div class='flexchild'>${  replaceURLWithHTMLLinks(content[i].value)  }</div>`;    
                  }
              } catch (e) {
                  tpl += `<div class='flexchild'>${  replaceURLWithHTMLLinks(content[i].value)  }</div>`;
              }
          }
          tpl += "</div>";
      }

      return tpl;
  },

  createObjTpl(obj) {
      let tpl = '';
      // console.log(obj)
      if (obj) {
          Object.keys(obj).forEach((p) => {
              tpl += `<div class='info-item'><pre><code>${  YAML.dump(obj[p])  }</code></pre></div>`;
          });
      }
      return tpl;
  },

  processKeys(str) {
      const words = str.split('_');
      let result = '';
      let gap; let word;
      for (let i = 0, len = words.length; i < len; i++) {
          gap = i === 0 ? '' : ' ';
          word = this.toTitleCase(words[i]);
          result += gap.concat(word);
      }
      return result;
  },

  toTitleCase(str) {
      return str.replace(/\w\S*/g, (txt) => {
          return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();
      });
  }
});
