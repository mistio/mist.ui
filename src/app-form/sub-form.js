import '@polymer/paper-icon-button/paper-icon-button.js';
import { Polymer } from '@polymer/polymer/lib/legacy/polymer-fn.js';
import { html } from '@polymer/polymer/lib/utils/html-tag.js';

Polymer({
  _template: html`
    <style include="shared-styles forms">
      :host app-form {
        margin-left: 24px;
        margin-top: -80px !important;
        margin-bottom: 32px;
      }

      :host([moderate-top]) app-form {
        margin-top: -50px !important;
        margin-bottom: 0 !important;
      }

      .title {
        margin-top: 16px;
        margin-bottom: 8px;
      }

      paper-icon-button {
        margin-left: -12px;
      }

      paper-icon-button.remove {
        margin-top: -35px;
        right: -38px;
        position: absolute;
      }
    </style>
    <template is="dom-repeat" items="{{items}}">
      <div class="title">
        <strong>[[indexPlusOne(index)]].</strong>
      </div>
      <paper-icon-button
        class="remove"
        icon="delete"
        on-tap="deleteItem"
        hidden$="[[_computeShowDelete(index)]]"
        >-</paper-icon-button
      >
      <app-form
        id$="sub-form-[[index]]"
        fields="{{item}}"
        display-buttons="[[_calcDisplayButtons()]]"
        horizontal-layout="[[horizontal]]"
        form-ready="{{formReady}}"
      ></app-form>
      <br />
    </template>
    <paper-icon-button
      class="add"
      icon="add"
      on-tap="addItem"
      hidden$="[[hideAddButton(min,max,items.length)]]"
      >+</paper-icon-button
    >
  `,

  is: 'sub-form',

  /**
   * Fired when a response is received.
   *
   * @event response
   */
  /**
   * Fired when a request is made.
   *
   * @event request
   */
  /**
   * Fired when the leadValue is changed.
   *
   * @event leadchange
   */
  properties: {
    id: {
      type: String,
    },
    options: {
      type: Array,
      value() {
        return [];
      },
    },
    itemName: {
      type: String,
    },
    items: {
      type: Array,
      value() {
        return [];
      },
      notify: true,
    },
    fieldName: {
      type: String,
    },
    min: {
      type: Number,
      value: 1,
    },
    max: {
      type: Number,
    },
    activeItem: {
      type: String,
    },
    formReady: {
      type: Boolean,
      value: false,
      notify: true,
    },
    show: {
      type: Boolean,
    },
    horizontal: {
      type: Boolean,
      value: false,
    },
    moderateTop: {
      type: Boolean,
      value: true,
      reflectToAttribute: true,
    },
  },

  observers: [
    '_optionsChanged(options.*)',
    '_itemsChanged(items.splices, items.*)',
    '_minChanged(min, items)',
    '_showChanged(show)',
  ],

  listeners: {
    keyup: '_itemsChanged',
    tap: '_setActiveItem',
  },

  hideAddButton(min, max, itemslength) {
    return (
      min !== undefined && max !== undefined && (min === max) === itemslength
    );
  },

  _minChanged(_min) {
    for (let i = 1; i <= this.min; i++) {
      if (!this.items[i - 1]) this.addItem();
    }
  },

  _setActiveItem(e) {
    // set changing item
    const parent = e.path.find(p => p.tagName === 'APP-FORM');
    if (parent && parent.id)
      this.set('activeItem', parent.id.split('sub-form-')[1]);
    else this.set('activeItem', null);
  },

  _itemsChanged() {
    this.dispatchEvent(
      new CustomEvent('fields-changed', {
        bubbles: true,
        composed: true,
        file: 'sub-form.html : _itemsChanged()',
      })
    );
  },

  _optionsChanged(options) {
    const index = options.path.split('.')[1];
    if (this.activeItem && index) {
      // update specific item value
      if (options.path.endsWith('value')) {
        this.set(
          `items.${this.activeItem}.${index.replace('#', '')}.value`,
          options.value
        );
      }
      // update all items options
      else if (options.path.endsWith('options')) {
        for (let i = 0; i < this.items.length; i++) {
          this.set(
            `items.${i}.${index.replace('#', '')}.options`,
            options.value
          );
        }
      }
    }
  },

  _calcDisplayButtons() {
    return false;
  },

  _showChanged(show) {
    if (!show) {
      this.clear();
    }
  },

  clear() {
    this.set('items', []);
  },
  /* eslint-disable no-param-reassign */
  addItem() {
    function copy(o) {
      // deep copy an array of objects
      const output = Array.isArray(o) ? [] : {};
      if (o) {
        Object.keys(o).forEach(key => {
          const v = o[key];
          output[key] = typeof v === 'object' ? copy(v) : v;
        });
      }
      return output;
    }

    if (this.options) {
      if (!this.max || this.items.length < this.max) {
        const opts = copy(this.options); // deep copy options
        opts.forEach(o => {
          o.value = o.defaultValue;
        });
        this.push('items', opts);
      } else {
        this.dispatchEvent(
          new CustomEvent('toast', {
            bubbles: true,
            composed: true,
            detail: {
              msg: `Only up to ${this.max} ${this.itemName}s are allowed.`,
              duration: 3000,
            },
          })
        );

        this.shadowRoot.querySelector('.add').setAttribute('disabled', true);
      }
      this.dispatchEvent(
        new CustomEvent('fields-changed', {
          bubbles: true,
          composed: true,
          file: 'sub-form.html : addItem()',
        })
      );
    }
  },
  /* eslint-enable no-param-reassign */
  deleteItem(e) {
    // console.log('deleteItem', e.model.__data__.index);
    if (!this.min || this.items.length > this.min) {
      this.splice('items', e.model.__data.index, 1);
      this.shadowRoot.querySelector('.add').removeAttribute('disabled');
      this.async(() => {
        this.dispatchEvent(
          new CustomEvent('fields-changed', {
            bubbles: true,
            composed: true,
            file: 'sub-form.html : deleteItem()',
          })
        );
      }, 200);
    } else {
      this.dispatchEvent(
        new CustomEvent('toast', {
          bubbles: true,
          composed: true,
          detail: {
            msg: `Minimun ${this.max} ${this.itemName}s are required.`,
            duration: 3000,
          },
        })
      );
    }
  },

  indexPlusOne(i) {
    return i + 1;
  },

  _computeShowDelete(index) {
    return this.min ? index < this.min : true;
  },
});
