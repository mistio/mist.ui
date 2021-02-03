import '@polymer/iron-icons/maps-icons.js';
import '@polymer/paper-material/paper-material.js';
import '../section-symbol/section-symbol.js';
import { Polymer } from '@polymer/polymer/lib/legacy/polymer-fn.js';
import { html } from '@polymer/polymer/lib/utils/html-tag.js';
import { dom } from '@polymer/polymer/lib/legacy/polymer.dom.js';

let sharedActionMenu = null;
let activeCard = null;

function mouseEnter() {
  if (activeCard) {
    activeCard.showActions();
  }
}

function mouseLeave() {
  if (activeCard) {
    activeCard.hideActions();
  }
}

Polymer({
  _template: html`
    <style>
      :host {
        margin: 10px 10px 10px 0;
        cursor: pointer;
        border-radius: 4px;
        border: 1px solid #d0d0d0;
        background: white;
        flex: 1 250px;
        max-width: calc(33% - 10px);
        transition-properties: opacity, box-shadow;
        transition-duration: 0.4s;
        -webkit-transition-properties: opacity, box-shadow;
        -webkit-transition-duration: 0.4s;
      }

      @media (max-width: 1070px) {
        :host {
          max-width: calc(50% - 10px);
        }
      }

      @media (max-width: 530px) {
        :host {
          max-width: calc(100% - 10px);
        }
      }

      :host(:hover),
      :host(.hover) {
        @apply --shadow-elevation-2dp;
      }

      h3 {
        font-size: 16px;
        font-weight: 500;
        margin: 0;
        padding: 10px 16px 0;
      }

      p {
        margin: 0;
      }

      #el {
        cursor: pointer;
      }

      #hero {
        width: 100%;
        height: 120px;
        background: #ccc;
        border-radius: 3px 3px 0 0;
        overflow: hidden;
        border-bottom: 1px solid #e5e5e5;
      }

      #hero > img {
        width: 100%;
        height: 100%;
      }

      .meta {
        border-top: 1px solid;
        border-bottom: 1px solid;
        border-color: var(--divider-color);
        padding: 10px 16px;
      }

      .meta + .meta {
        border-top: 0;
      }

      .meta:last-child {
        border-bottom: 0;
      }

      #el-desc {
        @apply --paper-font-body1;
        color: var(--secondary-text-color);
        margin: 0;
        padding: 10px 16px;
        height: 75px;
      }

      .section {
        font-size: 12px;
        font-weight: 500;
      }

      .section section-symbol {
        margin: 0 15px 0 0;
      }

      .section > a:hover {
        text-decoration: underline;
      }

      .tags iron-icon {
        margin: 0 15px 0 0;
        padding: 5px;
        color: var(--secondary-text-color);
        --iron-icon-size: 18px;
      }

      .tag {
        margin-right: 4px;
        font-size: 12px;
      }

      .tag:hover {
        text-decoration: underline;
      }

      .tag:after {
        margin-left: -3px;
        content: ' ,';
      }

      .tag:last-of-type:after {
        content: '';
      }
    </style>
    <a href="[[_getitemLink(item.id)]]"> </a>
    <div id="content" class="vertical layout">
      <a href="[[_getitemLink(item.id)]]">
        <div id="el" view="docs">
          <div
            id="hero"
            on-mouseenter="_mouseEnter"
            on-mouseleave="_mouseLeave"
            style$="[[_computeStyle(color)]]"
          >
            <img src="[[_getImageSrc(item.hero)]]" />
          </div>
          <h3>[[item.name]]</h3>
        </div>
        <p id="el-desc">[[item.description]]</p>
      </a>
      <div class="horizontal layout center meta section">
        <a href="[[_getitemLink(item.id)]]">
          <section-symbol
            icon="[[section.icon]]"
            color="[[section.color]]"
          ></section-symbol> </a
        ><a href="[[_getSectionLink(item.section)]]">[[section.id]]</a>
      </div>
      <div class="meta tags">
        <iron-icon icon="maps:local-offer" class="flex-none"></iron-icon>
        <template is="dom-repeat" items="[[item.tags]]" as="tag">
          <a href="[[_getTagLink(item.section, tag)]]" class="tag">[[tag]]</a>
        </template>
      </div>
    </div>
  `,

  is: 'item-card',
  enableCustomStyleProperties: true,

  properties: {
    item: {
      type: Object,
    },
    color: {
      type: String,
    },
    section: {
      type: Object,
    },
  },

  observers: ['_updateSection(_item)'],

  attached() {
    this.style.opacity = 0;

    this.async(() => {
      this.style.opacity = 1;
    }, 1);
  },

  detached() {
    if (activeCard === this) {
      activeCard = null;
      if (sharedActionMenu) {
        dom(this.parentNode).removeChild(sharedActionMenu);
        sharedActionMenu = null;
      }
    }
  },

  _tagClicked(e) {
    e.stopPropagation();
    this.dispatchEvent(
      new CustomEvent('update-params', {
        bubbles: true,
        composed: true,
        detail: {
          tag: e.currentTarget.name,
        },
      })
    );
  },

  _computeStyle(color) {
    return `background-color:${color}`;
  },

  _getItemLink(id) {
    return `./${id}`;
  },

  _getImageSrc(src) {
    return src && src.length
      ? src
      : `../../assets/hero/random-${Math.ceil(Math.random() * 4)}.svg`;
  },

  _getSectionLink(sectionName) {
    return `/browse?section=${sectionName}&view=cards`;
  },

  _getTagLink(sectionName, tag) {
    return `/browse?tag=${tag}&view=cards`;
  },

  showActions() {
    let top = this.$.hero.offsetTop;
    const left = this.$.hero.offsetLeft;
    const width = this.$.hero.offsetWidth;

    if (!sharedActionMenu) {
      sharedActionMenu = document.createElement('item-action-menu');
      sharedActionMenu.classList.add('cards');
      sharedActionMenu.classList.add('hidden');
      sharedActionMenu.addEventListener('mouseenter', mouseEnter, {
        passive: true,
      });
      sharedActionMenu.addEventListener('mouseleave', mouseLeave, {
        passive: true,
      });
    }
    if (!sharedActionMenu.parentNode) {
      dom(this.parentNode).appendChild(sharedActionMenu);
    }

    top += this.$.hero.offsetHeight - sharedActionMenu.offsetHeight;

    sharedActionMenu.element = this.item.name;
    sharedActionMenu.style.top = `${top}px`;
    sharedActionMenu.style.left = `${left}px`;
    sharedActionMenu.style.width = `${width}px`;

    this._layoutIfNeeded(sharedActionMenu);
    sharedActionMenu.classList.remove('hidden');
    this.classList.add('hover');
    sharedActionMenu.cancelDebouncer('hide');
  },

  hideActions() {
    if (sharedActionMenu && sharedActionMenu.element === this.item.name) {
      sharedActionMenu.debounce(
        'hide',
        () => {
          sharedActionMenu.classList.add('hidden');
        },
        10
      );
      this.classList.remove('hover');
    }
  },

  _mouseEnter() {
    activeCard = this;
    mouseEnter();
  },

  _mouseLeave(_e) {
    mouseLeave();
  },

  _layoutIfNeeded(el) {
    return el.offsetTop;
  },
});
