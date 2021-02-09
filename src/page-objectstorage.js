import '@polymer/app-route/app-route.js';
import '@mistio/mist-list/mist-list.js';
import { Polymer } from '@polymer/polymer/lib/legacy/polymer-fn.js';
import { html } from '@polymer/polymer/lib/utils/html-tag.js';
import './objectstorage/objectstorage-page.js';

Polymer({
  _template: html`
    <style include="shared-styles">
      [hidden] {
        display: none !important;
      }

      mist-list#objectStorageList {
        max-width: 95%;
      }
    </style>

    <app-route
      route="{{route}}"
      pattern="/:objectstorage"
      data="{{data}}"
    ></app-route>
    <template is="dom-if" if="[[_isListActive(route.path)]]" restamp>
      <mist-list
        selectable
        resizable
        multi-sort
        apiurl="/api/v1/volumes"
        id="objectStorageList"
        name="ObjectStorage"
        route="{{route}}"
        visible="[[_getVisibleColumns()]]"
        item-map="[[model.objectstorage]]"
        user-filter="[[model.sections.objectstorage.q]]"
        primary-field-name="id"
        renderers="[[_getRenderers()]]"
        actions="[[actions]]"
      >
        <p slot="no-items-found">No volumes found.</p>
      </mist-list>
    </template>
    <template is="dom-if" if="[[_isDetailsPageActive(route.path)]]" restamp>
      <objectstorage-page
        route="[[route]]"
        path="[[route.path]]"
        model="[[model]]"
        section="[[model.sections.objectstorage]]"
        hidden$="[[!_isDetailsPageActive(route.path)]]"
        storage="[[_getStorage(data.objectstorage, model.objectstorage, model.objectstorage.*)]]"
        resource-id="[[data.storage]]"
      >
      </objectstorage-page>
    </template>
  `,
  is: 'page-objectstorage',

  properties: {
    model: {
      type: Object,
    },
  },
  _getStorage(id) {
    if (
      id &&
      this.model &&
      this.model.objectstorage &&
      this.model.objectstorage[id]
    )
      return this.model.objectstorage[id];
    return '';
  },
  _isListActive(path) {
    return !path;
  },
  _isDetailsPageActive(path) {
    if (path && path !== '/+create') {
      if (
        this.shadowRoot &&
        this.shadowRoot.querySelector('objectstorage-page')
      ) {
        this.shadowRoot.querySelector('objectstorage-page').updateState();
      }
      return true;
    }
    return false;
  },
  _getVisibleColumns() {
    return ['name', 'region', 'cloud_title', 'creation_date'];
  },
  _getRenderers(_keys) {
    return {
      name: {
        body: (item, _row) => {
          return `<strong class="name">${item}</strong>`;
        },
      },
      icon: {
        body: (_item, row) => {
          if (!row.provider) return '';
          return `./assets/providers/provider-${row.provider
            .replace('_', '')
            .replace(' ', '')}.png`;
        },
      },
      cloud_title: {
        title: () => 'cloud title',
        body: item => item,
      },
      creation_date: {
        title: () => 'creation date',
        body: (_item, row) => {
          const date = row.extra.creation_date;
          return date || '';
        },
      },
    };
  },
});
