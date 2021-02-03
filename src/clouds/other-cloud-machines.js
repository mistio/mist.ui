import '@polymer/polymer/polymer-legacy.js';
import '@polymer/paper-styles/typography.js';
import '@mistio/mist-list/mist-list.js';
import './other-cloud-machine-actions.js';
import { Polymer } from '@polymer/polymer/lib/legacy/polymer-fn.js';
import { html } from '@polymer/polymer/lib/utils/html-tag.js';

Polymer({
  _template: html`
    <h3>Hosts</h3>
    <p>Select any host to remove it from this cloud.</p>
    <other-cloud-machine-actions
      items="[[selectedMachineItems]]"
      actions="{{machineActions}}"
    >
      <mist-list
        id$="otherServerMachinesList_[[cloud.id]]"
        selectable=""
        column-menu=""
        multi-sort=""
        resizable=""
        searchable=""
        item-map="[[machines]]"
        name="Machines"
        selected-items="{{selectedMachineItems}}"
        frozen="[[_getFrozenLogColumn()]]"
        visible="[[_getVisibleColumns()]]"
        renderers="[[_getRenderers()]]"
        actions="[[machineActions]]"
      >
      </mist-list>
    </other-cloud-machine-actions>
  `,

  is: 'other-cloud-machines',

  properties: {
    cloud: {
      type: Object,
    },
    model: {
      type: Object,
    },
    machines: {
      type: Array,
      computed: '_computeMachines(cloud, model.machines, model.machines.*)',
    },
    machineActions: {
      type: Array,
    },
    selectedMachineItems: {
      type: Array,
      value() {
        return [];
      },
    },
  },

  listeners: {
    'select-action': 'selectAction',
  },

  observers: ['machinesChanged(cloud.*, cloud.machines.*)'],

  machinesChanged(_c, _m) {
    if (this.shadowRoot.querySelector('mist-list'))
      this.shadowRoot.querySelector('mist-list').fire('resize');
  },

  _computeMachines(cloud) {
    if (typeof this.cloud.machines === 'undefined') {
      return {};
    }
    if (cloud.provider !== 'libvirt') {
      return this.cloud.machines || {};
    }
    // filter kvm hosts and push back to object
    const ms = Object.values(this.cloud.machines).filter(m => {
      return (
        m.extra &&
        m.extra.tags &&
        m.extra.tags.type &&
        m.extra.tags.type === 'hypervisor'
      );
    });
    const ret = {};
    for (let i = 0; i < ms.length; i++) {
      ret[ms[i].id] = ms[i];
    }
    return ret;
  },

  _getFrozenLogColumn() {
    return ['name'];
  },

  _getVisibleColumns() {
    return ['state', 'id', 'missing_since', 'public_ips', 'tags'];
  },

  _getRenderers() {
    return {
      name: {
        body: item => {
          return `<strong class="name">${item}</strong>`;
        },
        cmp: (row1, row2) => {
          return row1.name.localeCompare(row2.name, 'en', {
            sensitivity: 'base',
          });
        },
      },
      missing_since: {
        title: (_item, _row) => {
          return 'missing since';
        },
        body: (item, _row) => {
          return item;
        },
      },
      public_ips: {
        title: (_item, _row) => {
          return 'public IP';
        },
        body: (item, _row) => {
          return item[0];
        },
      },
      tags: {
        body: (item, _row) => {
          const tags = item;
          let display = '';
          for (let i = 0; i < tags.length; i++) {
            display += `<span class='tag'>${tags[i].key}`;
            if (tags[i].value !== undefined && tags[i].value !== '')
              display += `=${tags[i].value}`;
            display += '</span>';
          }
          return display;
        },
      },
    };
  },

  // redirect events
  selectAction(e) {
    e.stopImmediatePropagation();
    if (this.shadowRoot.querySelector('other-cloud-machine-actions')) {
      this.shadowRoot
        .querySelector('other-cloud-machine-actions')
        .selectAction(e);
    }
  },
});
