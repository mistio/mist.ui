import '../../node_modules/@polymer/paper-dropdown-menu/paper-dropdown-menu.js';
import '../../node_modules/@polymer/paper-listbox/paper-listbox.js';
import '../../node_modules/@polymer/paper-item/paper-item.js';
import '../../node_modules/@polymer/paper-input/paper-input.js';
// import '../../node_modules/juicy-jsoneditor/juicy-jsoneditor.js';
import '../element-for-in/element-for-in.js';
import '../helpers/dialog-element.js';
import { Polymer } from '../../node_modules/@polymer/polymer/lib/legacy/polymer-fn.js';
import { html } from '../../node_modules/@polymer/polymer/lib/utils/html-tag.js';

const RBAC_CONSTRAINTS_FIELDS = [
  {
    name: 'constraints',
    label: 'Constraints in JSON',
    type: 'jsoneditor',
    value: {},
    defaultValue: {},
    show: true,
    required: false,
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
        single-column-form="[[singleColumnForm]]"
        inline="[[inline]]"
      ></dialog-element>
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
  },

  listeners: {
    keyup: 'hotkeys',
    confirmation: '_updateRuleConstraints',
  },

  _computeShowConstraints(_prule) {
    // emty strings for ALL
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
    const { reason } = e.detail;
    const { response } = e.detail;
    if (response === 'confirm' && reason === 'edit.constraints') {
      const newConstraints = this.fields[0].value;
      this.dispatchEvent(
        new CustomEvent('update-constraints', {
          bubbles: true,
          composed: true,
          detail: { index: this.index, constraints: newConstraints },
        })
      );
    }
  },

  _mapValuesToFields() {
    // fill in fields with constraints corresponding values
    const constraints = JSON.stringify(this.rule.constraints);
    this.set('fields.0.value', JSON.parse(constraints) || {});
  },
});
