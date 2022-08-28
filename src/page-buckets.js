import dayjs from 'dayjs/esm/index.js';
import utc from 'dayjs/esm/plugin/utc';
import '@polymer/app-route/app-route.js';
import '@mistio/mist-list/mist-list.js';
import { Polymer } from '@polymer/polymer/lib/legacy/polymer-fn.js';
import { html } from '@polymer/polymer/lib/utils/html-tag.js';
import './buckets/bucket-page.js';

dayjs.extend(utc);

Polymer({
  _template: html`
    <style include="shared-styles">
      [hidden] {
        display: none !important;
      }

      mist-list#bucketList {
        max-width: 95%;
      }
    </style>

    <app-route
      route="{{route}}"
      pattern="/:buckets"
      data="{{data}}"
    ></app-route>
    <template is="dom-if" if="[[_isListActive(route.path)]]" restamp>
      <mist-list
        selectable
        resizable
        multi-sort
        apiurl="/api/v1/buckets"
        id="bucketList"
        name="Buckets"
        route="{{route}}"
        visible="[[_getVisibleColumns()]]"
        item-map="[[model.buckets]]"
        user-filter="[[userFilter]]"
        primary-field-name="id"
        renderers="[[_getRenderers()]]"
        actions="[[actions]]"
      >
        <p slot="no-items-found">No buckets found.</p>
      </mist-list>
    </template>
    <template is="dom-if" if="[[_isDetailsPageActive(route.path)]]" restamp>
      <bucket-page
        route="[[route]]"
        path="[[route.path]]"
        model="[[model]]"
        hidden$="[[!_isDetailsPageActive(route.path)]]"
        bucket="[[_getBucket(data.buckets, model.buckets, model.buckets.*)]]"
        resource-id="[[data.bucket]]"
      >
      </bucket-page>
    </template>
  `,
  is: 'page-buckets',

  properties: {
    model: {
      type: Object,
    },
  },
  _getBucket(id) {
    if (id && this.model && this.model.buckets && this.model.buckets[id])
      return this.model.buckets[id];
    return '';
  },
  _isListActive(path) {
    return !path;
  },
  _isDetailsPageActive(path) {
    if (path && path !== '/+create') {
      if (this.shadowRoot && this.shadowRoot.querySelector('buckets-page')) {
        this.shadowRoot.querySelector('buckets-page').updateState();
      }
      return true;
    }
    return false;
  },
  _getVisibleColumns() {
    return ['name', 'region', 'cloud', 'creation_date'];
  },
  _getRenderers(_keys) {
    return {
      name: {
        body: (item, _row) => `<strong class="name">${item}</strong>`,
      },
      icon: {
        body: (_item, row) => {
          if (!row.provider) return '';
          return `./assets/providers/provider-${row.provider
            .replace('_', '')
            .replace(' ', '')}.png`;
        },
      },
      cloud: {
        title: () => 'cloud',
        body: item => this.model.clouds[item].name,
      },
      creation_date: {
        title: () => 'creation date',
        body: (_item, row) => {
          const date = row.extra.creation_date;
          return dayjs.utc(date).local().format() || '';
        },
      },
    };
  },
});
