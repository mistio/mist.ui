import '@polymer/paper-card/paper-card.js';
import '@polymer/paper-icon-button/paper-icon-button.js';
import '@polymer/iron-icons/iron-icons.js';
import { Polymer } from '@polymer/polymer/lib/legacy/polymer-fn.js';
import { html } from '@polymer/polymer/lib/utils/html-tag.js';
import { ratedCost } from '../helpers/utils.js';

Polymer({
  _template: html`
    <custom-style>
      <style include="shared-styles headings tags-and-labels dialogs">
        :host {
          display: flex;
          transition: var(--material-curve-320);
          transform: translate(0, 60px);
          opacity: 0;
          padding: 0;
          margin: 0;
        }

        :host(.active) {
          transform: translate(0, 0);
          opacity: 1;
        }

        :host([xsmallscreen]) {
          flex-wrap: wrap;
        }

        .main-section {
          width: 100%;
        }

        :host([xsmallscreen]) > paper-material {
          flex-basis: 100%;
        }

        .tabs {
          border-bottom: 1px solid #eee;
          display: flex;
          align-items: center;
          padding-right: 8px;
        }
        .buttons {
          display: flex;
          flex: 1;
        }
        paper-button {
          text-transform: uppercase;
          color: var(--blue-color);
          font-size: 13px;
          padding: 10px;
          margin: 2px;
          font-weight: 400;
        }
        paper-button.active {
          color: rgba(0, 0, 0, 0.54);
        }
        paper-material {
          overflow: hidden !important;
          background-color: var(--light-theme-background-color);
        }
        .list-item {
          border-bottom: 1px solid #eee;
          padding: 6px 10px;
          min-width: 33%;
        }
        .list-item:last-child {
          border-bottom: 0 none;
          padding-top: 16px;
        }
        .flex {
          @apply --layout-flex;
        }
        .flex3child {
          @apply --layout-flex-3;
        }
        :host(.active) .block {
          transform: translate(0, 0);
          opacity: 1;
          height: 100%;
        }
        table {
          table-layout: fixed;
          width: 100%;
          padding: 0 6px;
          margin: 6px 0;
        }
        table tr {
          border-bottom: 1px solid #eee;
        }
        table td {
          padding: 4px 6px;
        }
        .name,
        .cost {
          font-weight: 500;
        }
        .count {
          color: rgba(0, 0, 0, 0.54);
        }
        td.count {
          font-size: 12px;
          line-height: 22px;
        }
        td.count > iron-icon {
          float: left;
        }
        .text-right {
          text-align: right;
        }
        section-tile {
          position: relative;
        }
        .sub {
          padding: 8px;
          font-size: 0.8em;
          color: var(--app-costs-sub-text-color);
          display: block;
          margin-top: -10px;
        }
        .zero-clouds {
          padding: 0 12px 12px;
          font-size: 0.9em;
          opacity: 0.54;
        }
        .zero-cloud:after {
          position: relative;
          content: ', ';
        }
        .zero-cloud:last-of-type:after {
          position: relative;
          content: '.';
        }
        iron-icon#costdocs {
          width: 20px;
          height: 20px;
          opacity: 0.54;
          float: right;
        }
      </style>
    </custom-style>

    <div class="flex">
      <div class="main-section">
        <section-tile
          name="total cost *"
          icon=""
          count="[[currency.sign]][[totalCost]]"
          highlight=""
        >
          <span class="sub">* current monthly rate</span>
        </section-tile>
      </div>
    </div>
    <paper-material class="flex3child">
      <div class="tabs">
        <div class="buttons">
          <paper-button
            id="cloudsBtn"
            class="blue-link active"
            on-tap="changeTab"
            >Monthly cost per cloud</paper-button
          >
          <paper-button
            id="tagsBtn"
            class="blue-link"
            on-tap="changeTab"
            hidden$="[[!tags.length]]"
            >Top [[_pluralTags(tags)]]</paper-button
          >
        </div>
        <a
          href="http://docs.mist.io/article/103-cost-reporting-with-mist-io"
          target="new"
          hidden$="[[!docs]]"
        >
          <iron-icon id="costdocs" icon="help" position="left"></iron-icon
        ></a>
      </div>
      <div id="clouds" hidden$="[[!showClouds]]">
        <table>
          <template is="dom-repeat" items="[[topClouds]]">
            <tr>
              <td colspan="2" class="name">[[item.name]]</td>
              <td class="count">
                [[item.machinesCount]]<iron-icon
                  icon="hardware:computer"
                ></iron-icon>
              </td>
              <td class="text-right cost">
                [[currency.sign]][[_ratedCost(item.cost,currency.rate)]]
              </td>
            </tr>
          </template>
        </table>
        <div class="zero-clouds" hidden$="[[!zeroCostClouds.length]]">
          and [[zeroCostClouds.length]] more clouds of [[currency.sign]]0 cost
        </div>
      </div>
      <div id="tags" hidden$="[[showClouds]]">
        <table>
          <template is="dom-repeat" items="[[tags]]">
            <tr>
              <td colspan="3" class="tag">
                [[item.key]]
                <span hidden$="[[!item.value]]"> = [[item.value]] </span>
              </td>
              <td class="count">[[item.count]] machines</td>
              <td class="text-right cost">
                [[currency.sign]][[_ratedCost(item.cost,currency.rate)]]
              </td>
            </tr>
          </template>
        </table>
      </div>
    </paper-material>
  `,

  is: 'app-costs',

  properties: {
    model: {
      type: Object,
    },
    totalCost: {
      type: Number,
      computed: '_computeTotalCost(model.machines.*,q,currency)',
    },
    topClouds: {
      type: Array,
      computed:
        '_computeTopClouds(model.clouds.*,model.machines.*,q, currency)',
    },
    zeroCostClouds: {
      type: Array,
    },
    tags: {
      type: Array,
    },
    xsmallscreen: {
      type: Boolean,
      reflectToAttribute: true,
    },
    showClouds: {
      type: Boolean,
      value: true,
    },
    docs: {
      type: String,
      value: '',
    },
    currency: {
      type: Object,
    },
    q: {
      type: String,
    },
  },

  observers: ['_computeTags(model.clouds, model.machines,q,currency)'],

  attached() {
    const rows = this.parentNode.querySelectorAll('block');
    const index = Array.prototype.indexOf.call(rows, this);
    setTimeout(() => {
      this.classList.add('active');
    }, (index + 1) * 50);
  },

  _ratedCost(cost, rate) {
    return ratedCost(cost, rate);
  },

  _getFilteredResources(resources, q) {
    let owned;
    if (q === 'owner:$me' && this.model && resources) {
      owned = Object.values(resources).filter(
        item => item && item.owned_by && item.owned_by === this.model.user.id
      );
    }
    return owned || Object.values(resources);
  },

  /* eslint-disable no-param-reassign */
  _computeTotalCost(machines, q, currency) {
    let cost = 0;
    const rate = !currency ? 1 : currency.rate;
    if (Object.keys(this.model.machines).length > 0) {
      // map machines costs in an array
      const machinesWithCost = this._getFilteredResources(
        this.model.machines,
        this.q
      ).map(m => (m && m.cost && m.cost.monthly ? m.cost.monthly : 0));
      // add all cost values
      if (machinesWithCost.length) {
        cost = machinesWithCost.reduce((previous, current, _index) => {
          if (typeof previous !== 'number') {
            previous = parseInt(previous, 10);
          }
          if (typeof current !== 'number') {
            current = parseInt(current, 10);
          }
          return previous + current;
        });
      }
    }
    return this._ratedCost(cost, rate);
  },

  _computeTopClouds(clouds, _machines, _q, _currency) {
    const topCloudsArray = [];
    const zeroCostClouds = [];
    const that = this;
    if (Object.values(clouds).length > 0) {
      clouds = this._getFilteredResources(this.model.clouds, this.q);
      clouds.forEach(c => {
        let cloudCost = 0;
        let machinesCount = 0;
        if (c.machines) {
          const cloudMachines = that._getFilteredResources(c.machines, that.q);
          for (let i = 0; i < cloudMachines.length; i++) {
            if (cloudMachines[i].cost && cloudMachines[i].cost.monthly) {
              let mcost = '';
              if (typeof cloudMachines[i].cost.monthly !== 'number') {
                mcost = parseInt(cloudMachines[i].cost.monthly, 10);
              } else {
                mcost = cloudMachines[i].cost.monthly;
              }
              cloudCost += mcost;
            }
            machinesCount++;
          }
        }
        const cloud = {};
        cloud.name = c.name;
        cloud.cost = cloudCost;
        cloud.machinesCount = machinesCount;
        if (cloudCost > 0) {
          topCloudsArray.push(cloud);
        } else {
          zeroCostClouds.push(cloud);
        }
      });
    }
    this.set('zeroCostClouds', zeroCostClouds);
    // sort by cost
    topCloudsArray.sort((a, b) => {
      if (a.cost > b.cost) {
        return -1;
      }
      if (a.cost < b.cost) {
        return 1;
      }
      return 0;
    });
    // return all clouds instead of topCloudsArray.slice(0,3);
    return topCloudsArray;
  },
  /* eslint-enable no-param-reassign */

  _computeTags(_clouds, _machines, _q, _currency) {
    const tagsArray = [];
    if (this.model && this.model.machines) {
      const that = this;
      const machines = this._getFilteredResources(this.model.machines, this.q);
      machines.forEach(m => {
        let mcost = m && m.cost ? m.cost.monthly : false;
        if (m && m.tags && mcost) {
          mcost =
            parseFloat(mcost) / ((that.currency && that.currency.rate) || 1);
          for (const t of Object.keys(m.tags)) {
            const tagExists = tagsArray.find(
              prevt => prevt.key === t && prevt.value === m.tags[t]
            );
            if (tagExists) {
              tagExists.count++;
              tagExists.cost += Math.round(parseInt(mcost, 10));
            } else {
              const tag = {};
              tag.key = t;
              tag.value = m.tags[t];
              tag.cost = Math.round(parseInt(mcost, 10));
              tag.count = 1;
              tagsArray.push(tag);
            }
          }
        }
      });
    }
    // sort by cost
    tagsArray.sort((a, b) => {
      if (a.cost > b.cost) {
        return -1;
      }
      if (a.cost < b.cost) {
        return 1;
      }
      return 0;
    });

    if (!tagsArray.length) {
      this.set('showClouds', true);
    }

    // return all clouds instead of topCloudsArray.slice(0,3);
    this.set('tags', tagsArray.slice(0, 7));
  },

  changeTab(e) {
    const target = e.target.id;
    if (this.tags && this.tags.length) {
      if (
        (target === 'cloudsBtn' && !this.showClouds) ||
        (target === 'tagsBtn' && this.showClouds)
      ) {
        this.set('showClouds', !this.showClouds);
        this.$.tagsBtn.classList.toggle('active');
        this.$.cloudsBtn.classList.toggle('active');
      }
    }
  },

  _pluralTags(tags) {
    return tags.length > 1 ? `${tags.length} tags` : 'tag';
  },
});
