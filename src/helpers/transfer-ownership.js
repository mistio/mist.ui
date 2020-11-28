import '../../node_modules/@polymer/polymer/polymer-legacy.js';
import '../../node_modules/@polymer/paper-styles/typography.js';
import '../../node_modules/@polymer/paper-button/paper-button.js';
import '../../node_modules/@polymer/paper-dialog/paper-dialog.js';
import '../../node_modules/@polymer/paper-dropdown-menu/paper-dropdown-menu.js';
import '../../node_modules/@polymer/paper-dialog-scrollable/paper-dialog-scrollable.js';
import '../../node_modules/@polymer/paper-listbox/paper-listbox.js';
import { Polymer } from '../../node_modules/@polymer/polymer/lib/legacy/polymer-fn.js';
import { html } from '../../node_modules/@polymer/polymer/lib/utils/html-tag.js';

Polymer({
  _template: html`
    <style include="shared-styles dialogs">
        :host {
            width: 100%;
        }
        paper-dialog {
            width: 310px;
        }
        paper-dialog ::slotted(h2) {
            text-transform: capitalize;
        }
        p.margin {
            margin: 16px 0 !important; 
        }
        ul {
            padding-left: 18px;
            color: rgba(0,0,0,0.54);
            font-size: 16px;
            margin-bottom: 0;
        }
        .btn-group {
            margin-bottom: 24px;
        }
        .progress {
            margin: 32px 0 8px 0;
            width: 100%;
        }

        paper-progress {
            width: 100%;
            margin-left: -24px;
            margin-right: -24px;
        }

        paper-progress#progresserror ::slotted(#primaryProgress) {
            background-color: var(--red-color);
        }

        .errormsg-container {
            color: var(--red-color);
        }

        .errormsg-container iron-icon {
            color: inherit;
            vertical-align: bottom;
            margin-right: 8px;
        }

        paper-input.search {
            padding-left: 16px;
            padding-right: 16px;
        }

    </style>

    <paper-dialog id="dialogModal" with-backdrop="">
        <h2>Transfer Ownership</h2>
        <paper-dialog-scrollable>
            <p>
                Choose a user to transfer ownership to for [[type]][[_plural(items)]]
            </p>
            <ul>
                <template is="dom-repeat" items="[[items]]">
                    <li>[[_displayName(item,type)]]</li>
                </template>
            </ul>
            <template is="dom-if" if="[[!members.length]]" restamp="">
                <p class="margin">No users found. <a href="/teams" class="blue-link" dialog-dismiss="">Add users in teams. </a></p>
            </template>
            <template is="dom-if" if="[[members.length]]" restamp="">
                <paper-dropdown-menu label="Users">
                    <div slot="dropdown-content" class="dropdown-content">
                        <paper-input class="search" type="search" label\$="Search members" value="{{membersFilter}}">
                            <iron-icon icon="search" slot="prefix"></iron-icon>
                        </paper-input>
                        <paper-listbox attr-for-selected="value" selected="{{newOwner}}" verticalalign="top">
                            <template id="membersDomRepeat" is="dom-repeat" items="[[_filteredMembers(members, membersFilter)]]" as="member">
                                <paper-item value="[[member.id]]">[[_displayUser(member)]]</paper-item>
                            </template>
                        </paper-listbox>
                    </div>
                </paper-dropdown-menu>
            </template>
        </paper-dialog-scrollable>
        <div class="progress">
            <paper-progress id="progress" indeterminate="" hidden\$="[[!sendingData]]"></paper-progress>
            <paper-progress id="progresserror" value="100" hidden\$="[[!formError]]"></paper-progress>
            <p class="errormsg-container" hidden\$="[[!formError]]">
                <iron-icon icon="icons:error-outline"></iron-icon>
                <span id="errormsg"></span>
            </p>
        </div>
        <div class="clearfix btn-group">
            <paper-button dialog-dismiss="">Cancel</paper-button>
            <paper-button class="red" disabled\$="[[!newOwner]]" on-tap="confirmTransfer">Transfer Ownership</paper-button>
        </div>
    </paper-dialog>
`,

  is: 'transfer-ownership',

  properties: {
      type: {
          type: String
      },
      members: {
          type: Array
      },
      newOwner: {
          type: String,
          value: false
      },
      items: {
          type: Array
      },
      sendingData: {
          type: Boolean,
          value: false
      },
      formError: {
          type: Boolean,
          value: false
      }
  },

  listeners: {
      'iron-overlay-closed': 'overlayClosed',
      'confirmation': 'confirmationListener'
  },

  ready() {

  },

  _displayName(item, type) {
      return type !== 'zone' ? item.name : item.domain;
  },

  _computeType(type, value) {
      return type === value;
  },

  _openDialog(_e) {
      this.$.dialogModal.open();
  },

  _closeDialog(_e) {
      this.$.dialogModal.close();
      this.set('sendingData', false)
  },

  overlayClosed (e) {
      // console.log('iron-overlay-closed', e);
      e.stopPropagation();
  },

  confirmTransfer (e) {
      // console.log('confirmation', e);
      e.stopPropagation();
      this.dispatchEvent(new CustomEvent('transfer-ownership', { bubbles: true, composed: true, detail: {user_id: this.newOwner} }));

      this.set('sendingData', true)
  },

  _displayUser (member){
      return member && member.name || member.email || member.username;
  },

  _plural (arr) {
      return arr.length && arr.length>1 ? 's' : '';
  },

  _filteredMembers(members, membersFilter) {
      if (!membersFilter) return members;
      return members.filter(member => member.name.indexOf(membersFilter) !== -1)
  }
})
