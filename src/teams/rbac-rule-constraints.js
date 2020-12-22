import '@polymer/paper-dropdown-menu/paper-dropdown-menu.js';
import '@polymer/paper-listbox/paper-listbox.js';
import '@polymer/paper-item/paper-item.js';
import '@polymer/paper-input/paper-input.js';
import '@polymer/paper-input/paper-textarea.js';
// import 'juicy-jsoneditor/juicy-jsoneditor.js';
import '../element-for-in/element-for-in.js';
import '../helpers/dialog-element.js';
import { Polymer } from '@polymer/polymer/lib/legacy/polymer-fn.js';
import { html } from '@polymer/polymer/lib/utils/html-tag.js';

const RBAC_CONSTRAINTS_FIELDS = [
  {
    name: 'constraints',
    label: '',
    type: 'textarea',
    value: '',
    defaultValue: '',
    class: 'script',
    show: true,
    required: true,
    helptext: 'Add/edit constraints in JSON format',
  },
];
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
      :host iron-icon {
        cursor: pointer;
      }
    </style>
    <span hidden$="[[!showConstraints]]">
      <span hidden$="[[!error]]" class="error">[[error]]</span>
      <iron-icon
        icon="icons:settings"
        on-tap="editConstraints"
        class="edit"
        title="Edit constraints"
      ></iron-icon>
    </span>
    <template is="dom-if" if="[[showConstraints]]">
      <dialog-element
        id="editConstraints"
        modal="true"
        formid="editConstraints-[[index]]"
        fields="{{fields}}"
        form="{{form}}"
        form-valid="{{formValid}}"
        single-column-form="[[singleColumnForm]]"
        inline="[[inline]]"
      >
      </dialog-element>
    </template>
  `,

  is: 'rbac-rule-constraints',

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
    showConstraints: {
      type: Boolean,
      value: false,
      computed: '_computeShowConstraints(rule.*)',
    },
    fields: {
      type: Array,
      value() {
        return RBAC_CONSTRAINTS_FIELDS;
      },
    },
    singleColumnForm: {
      type: Boolean,
      value: true,
    },
    inline: {
      type: Boolean,
      value: false,
    },
    error: {
      type: String,
      value: '',
    },
    modal: {
      type: Boolean,
      value: true,
    },
    formValid: {
      type: Boolean,
    },
  },

  listeners: {
    keyup: 'hotkeys',
    confirmation: '_updateRuleConstraints',
    'fields-changed': '_fieldsChanged',
  },
  _computeShowConstraints(_prule) {
    // empty strings for ALL
    return (
      ['machine', ''].indexOf(this.rule.rtype) > -1 &&
      ['create', 'edit', 'resize', ''].indexOf(this.rule.action) > -1
    );
  },

  hotkeys(e) {
    // if 'enter'
    if (e.keyCode === 13) {
      this.$.inputField.blur();
    }
  },

  hasConstraints(constraints) {
    return !!(constraints && Object.keys(constraints).length);
  },

  editConstraints(_e) {
    this.error = '';
    this._mapValuesToFields();
    this._showDialog({
      title: 'Edit constraints',
      reason: 'edit.constraints',
      hideText: true,
      fields: this.fields,
      action: 'save',
    });
  },

  _showDialog(info) {
    const dialog = this.shadowRoot.querySelector(
      'dialog-element#editConstraints'
    );
    if (info) {
      Object.keys(info || {}).forEach(i => {
        dialog[i] = info[i];
      });
    }
    dialog._openDialog();
  },

  _updateRuleConstraints(e) {
    // update rule.constraints
    const { reason, response } = e.detail;

    if (response === 'confirm' && reason === 'edit.constraints') {
      const newConstraints = JSON.parse(this.fields[0].value);
      this.dispatchEvent(
        new CustomEvent('update-constraints', {
          bubbles: true,
          composed: true,
          detail: {
            index: this.index,
            constraints: newConstraints,
          },
        })
      );
    }
  },
  _fieldsChanged(e) {
    // change notify values if expiration date changes
    const { value } = e.detail;
    try {
      JSON.parse(value);
    } catch (error) {
      this.formValid = false;
      return false;
    }
    this.formValid = true;
    return false;
  },
  _mapValuesToFields() {
    // console.log("in map ", this.rule)
    // fill in fields with constraints corresponding values
    const constraints = JSON.stringify(this.rule.constraints);
    console.log('constraints in map ', constraints);
    this.set('fields.0.value', constraints || '{}');
  },
});
