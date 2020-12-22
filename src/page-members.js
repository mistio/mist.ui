import '../node_modules/@polymer/app-route/app-route.js';
import '../node_modules/@mistio/mist-list/mist-list.js';
import './teams/member-page.js';
import { Polymer } from '../node_modules/@polymer/polymer/lib/legacy/polymer-fn.js';
import { html } from '../node_modules/@polymer/polymer/lib/utils/html-tag.js';

Polymer({
  _template: html`
    <style include="shared-styles">
      [hidden] {
        display: none !important;
      }
    </style>
    <app-route route="{{route}}" pattern="/:member" data="{{data}}"></app-route>
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
  `,
  is: 'page-members',

  properties: {
    model: {
      type: Object,
    },
    data: {
      type: Object,
    },
    selectedItems: {
      type: Array,
    },
  },
  listeners: {
    'action-finished': 'clearListSelection',
  },
  clearListSelection() {
    this.set('selectedItems', []);
  },
  _isListActive(path) {
    return !path;
  },
  _getVisibleColumns() {
    return ['name'];
  },

  _getFrozenColumn() {
    return ['email'];
  },
});
