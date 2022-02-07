import '@polymer/app-route/app-route.js';
import '@mistio/mist-list/mist-list.js';
import './teams/member-page.js';
// import { Polymer } from '@polymer/polymer/lib/legacy/polymer-fn.js';
import { html } from '@polymer/polymer/lib/utils/html-tag.js';
import { PolymerElement } from '@polymer/polymer/polymer-element.js';
import { mixinBehaviors } from '@polymer/polymer/lib/legacy/class.js';

/* eslint-disable class-methods-use-this */
export default class PageMembers extends mixinBehaviors([], PolymerElement) {
  static get template() {
    return html`
      <style include="shared-styles">
        [hidden] {
          display: none !important;
        }
      </style>
      <app-route
        route="{{route}}"
        pattern="/:member"
        data="{{data}}"
      ></app-route>
      <template is="dom-if" if="[[_isListActive(route.path)]]" restamp>
        <mist-list
          selectable
          resizable
          column-menu
          multi-sort
          items="[[model.membersArray]]"
          selected-items="{{selectedItems}}"
          frozen="[[_getFrozenColumn()]]"
          visible="[[_getVisibleColumns()]]"
        >
          <p slot="no-items-found">No members found.</p>
        </mist-list>
      </template>
      <member-page
        model="[[model]]"
        params="[[data]]"
        section="[[model.sections.teams]]"
        resource-id="[[data.member]]"
        hidden$="[[_isListActive(route.path)]]"
      ></member-page>
    `;
  }

  static get is() {
    return 'page-members';
  }

  static get properties() {
    return {
      model: {
        type: Object,
      },
      data: {
        type: Object,
      },
      selectedItems: {
        type: Array,
      },
    };
  }

  ready() {
    super.ready();
    this.addEventListener('action-finished', this.clearListSelection);
  }

  clearListSelection() {
    this.set('selectedItems', []);
  }

  _isListActive(_path) {
    return !this.route.path;
  }

  _getVisibleColumns() {
    return ['name'];
  }

  _getFrozenColumn() {
    return ['email'];
  }
}

customElements.define('page-members', PageMembers);
