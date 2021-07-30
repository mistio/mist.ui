import '@polymer/polymer/polymer-legacy.js';
import '@polymer/paper-styles/typography.js';
import '@polymer/paper-button/paper-button.js';
import '@polymer/paper-spinner/paper-spinner.js';
import './rule-item.js';
import './rule-edit.js';
import { Polymer } from '@polymer/polymer/lib/legacy/polymer-fn.js';
import { html } from '@polymer/polymer/lib/utils/html-tag.js';

/* eslint-disable lit-a11y/anchor-is-valid */
Polymer({
  _template: html`
    <style include="shared-styles tags-and-labels">
      :host {
        display: block;
      }
      paper-button {
        background-color: transparent !important;
        color: inherit !important;
        padding: 0.7em 0.57em;
        background-color: transparent;
        margin: 0;
      }

      paper-button[disabled] {
        background-color: rgba(0, 0, 0, 0.13) !important;
        color: rgba(0, 0, 0, 0.32) !important;
      }

      paper-material {
        border-top: 2px solid #ddd;
        padding-bottom: 0;
      }

      paper-button.add-rule iron-icon {
        opacity: 0.32;
        padding: 4px;
        font-weight: 500;
      }

      rule-edit {
        padding: 0 24px 16px 24px;
      }

      .rule-actions {
        justify-content: flex-end;
        font-size: 0.9em;
        margin-top: 16px;
      }

      .errormsg-container {
        color: var(--red-color);
        align-self: flex-start;
        flex: 1;
      }

      .errormsg-container iron-icon {
        color: inherit;
      }

      paper-material > h2.title {
        background-color: #eee;
        color: #666;
        padding: 0 24px;
        margin: 0;
        font-size: 12px;
        line-height: 36px;
        font-weight: 500;
      }

      .tag {
        vertical-align: middle;
        line-height: 1.5;
        font-size: 1em;
      }

      .machine-link {
        font-size: inherit;
        font-weight: bold;
      }

      .machine-link:hover {
        text-decoration: underline;
      }

      :host .rules-head {
        color: var(--mist-rules-head-text-color, var(--primary-text-color));
      }

      :host([resource-type='cloud']) .rules-head {
        /* @apply --clouds-page-head-mixin; */
        background-color: var(
          --clouds-section-color,
          var(--base-section-color)
        );
      }

      :host([resource-type='machine']) .rules-head {
        /* @apply --machines-page-head-mixin; */
        background-color: var(
          --machines-section-color,
          var(--base-section-color)
        );
      }

      :host([resource-type='script']) .rules-head {
        /* @apply --scripts-page-head-mixin; */
        background-color: var(
          --scripts-section-color,
          var(--base-section-color)
        );
      }

      :host([resource-type='key']) .rules-head {
        /* @apply --keys-page-head-mixin; */
        background-color: var(--keys-section-color, var(--base-section-color));
      }

      :host([resource-type='stack']) .rules-head {
        /* @apply --stacks-page-head-mixin; */
        background-color: var(
          --stacks-section-color,
          var(--base-section-color)
        );
      }

      :host([resource-type='network']) .rules-head {
        /* @apply --networks-page-head-mixin; */
        background-color: var(
          --networks-section-color,
          var(--base-section-color)
        );
      }

      :host([resource-type='volume']) .rules-head {
        /* @apply --volumes-page-head-mixin; */
        background-color: var(
          --volumes-section-color,
          var(--base-section-color)
        );
      }

      :host([resource-type='tunnel']) .rules-head {
        /* @apply --tunnels-page-head-mixin; */
        background-color: var(
          --tunnels-section-color,
          var(--base-section-color)
        );
      }

      :host([resource-type='zone']) .rules-head {
        /* @apply --zones-page-head-mixin; */
        background-color: var(--zones-section-color, var(--base-section-color));
      }

      :host([resource-type='image']) .rules-head {
        /* @apply --images-page-head-mixin; */
        background-color: var(
          --images-section-color,
          var(--base-section-color)
        );
      }

      :host([resource-type='template']) .rules-head {
        /* @apply --templates-page-head-mixin; */
        background-color: var(
          --templates-section-color,
          var(--base-section-color)
        );
      }

      :host([resource-type='schedule']) .rules-head {
        /* @apply --schedules-page-head-mixin; */
        background-color: var(
          --schedules-section-color,
          var(--base-section-color)
        );
      }

      :host([resource-type='team']) .rules-head {
        /* @apply --teams-page-head-mixin; */
        background-color: var(--teams-section-color, var(--base-section-color));
      }

      :host([resource-type='member']) .rules-head {
        /* @apply --members-page-head-mixin; */
        background-color: var(
          --members-section-color,
          var(--base-section-color)
        );
      }

      .rules-head {
        @apply --mist-monitoring-head-mixin;
      }

      .rules-head > h2 {
        margin: 0;
        line-height: 24px;
      }

      .rules-head paper-button {
        width: 100%;
        text-transform: none;
        justify-content: left;
      }
    </style>
    <div class="horizontal layout rules-head" hidden$="[[!collapsible]]">
      <h2 class="flex flex-1">
        <paper-button toggles="" active="{{expanded}}"
          ><iron-icon
            icon="icons:expand-more"
            style$="margin-right: 8px; [[_computeToggleButtonStyle(expanded)]]"
          ></iron-icon
          >Rules</paper-button
        >
      </h2>
    </div>
    <iron-collapse opened="[[expanded]]">
      <template is="dom-repeat" items="[[ruleCategories]]" as="cat">
        <paper-material elevation="0" id$="[[cat.id]]">
          <h2 class="title">
            [[cat.name]]
            <template is="dom-repeat" items="[[cat.selectors]]" as="selector">
              <template is="dom-if" if="[[isObj(selector)]]">
                <template
                  is="dom-repeat"
                  items="[[arrayTags(selector)]]"
                  as="tag"
                >
                  <span class="tag">[[tag]]</span>
                </template>
              </template>
              <template is="dom-if" if="[[isStr(selector)]]">
                <a
                  class="regural blue-link machine-link"
                  href$="/[[printResourceType(cat.type)]]/[[selector]]"
                >
                  [[printResource(selector, model, cat.type)]]</a
                >
              </template>
            </template>
          </h2>
          <template is="dom-repeat" items="[[cat.rules]]">
            <rule-item
              hidden$="[[item.editing]]"
              editing="{{item.editing}}"
              rule="[[item]]"
              available-metrics="[[availableMetrics]]"
              model="[[model]]"
              users="[[users]]"
              teams="[[teams]]"
              open-incident="[[_hasOpenIncident(item,incidents)]]"
              resource="[[resource]]"
            ></rule-item>
            <rule-edit
              features="[[features]]"
              hidden$="[[!item.editing]]"
              active="{{item.editing}}"
              current-rule="[[item]]"
              resource="[[resource]]"
              resource-type="[[resourceType]]"
              model="[[model]]"
              available-metrics="[[availableMetrics]]"
              machines="[[machines]]"
              users="[[users]]"
              teams="[[teams]]"
            ></rule-edit>
          </template>
        </paper-material>
      </template>
      <paper-material elevation="0" id="add-new-rule-dialog">
        <paper-button
          toggles=""
          active="{{addingRule}}"
          hidden$="[[addingRule]]"
          class="add-rule"
        >
          <iron-icon icon="icons:add-circle"></iron-icon> add new rule
        </paper-button>
        <rule-edit
          features="[[features]]"
          active="{{addingRule}}"
          available-metrics="[[availableMetrics]]"
          resource="[[resource]]"
          resource-type="[[resourceType]]"
          users="[[users]]"
          teams="[[teams]]"
          model="[[model]]"
          hidden$="[[!addingRule]]"
        >
        </rule-edit>
      </paper-material>
    </iron-collapse>
  `,

  is: 'mist-rules',

  properties: {
    model: {
      type: Object,
    },
    features: {
      type: Object,
    },
    incidents: {
      type: Array,
    },
    resource: {
      type: Object, // machine, cloud or other later
      value: false,
    },
    resourceType: {
      type: String,
      value: '',
      reflectToAttribute: true,
    },
    machines: {
      type: Object,
      value: false,
    },
    rules: {
      type: Object,
    },
    ruleCategories: {
      type: Array,
      computed: 'computeRuleCategories(resource, rules, machines)',
    },
    resourceRules: {
      type: Array,
    },
    builtinMetrics: {
      type: Object,
    },
    customMetrics: {
      type: Object,
    },
    availableMetrics: {
      type: Array,
      computed: '_computeMetrics(resource, builtinMetrics, customMetrics)',
    },
    addingRule: {
      type: Boolean,
      value: false,
    },
    teams: {
      type: Array,
    },
    users: {
      type: Array,
    },
    collapsible: {
      type: Boolean,
      value: false,
    },
    expanded: {
      type: Boolean,
      value: true,
    },
  },

  ready() {},

  isObj(tag) {
    return typeof tag === 'object';
  },

  isStr(id) {
    return typeof id === 'string';
  },

  arrayTags(tag) {
    const arr = [];
    let str;
    if (tag) {
      Object.keys(tag).forEach(p => {
        str = p;
        if (tag[p]) {
          str = `${p}=${tag[p]}`;
        }
        arr.push(str);
      });
    }
    return arr;
  },

  printResourceType(type) {
    return type.replace('specific_', '');
  },

  printResource(id, _model, type) {
    const resourceType = type.replace('specific_', '');
    return this.model &&
      this.model[resourceType] &&
      this.model[resourceType][id]
      ? this.model[resourceType][id].title ||
          this.model[resourceType][id].name ||
          this.model[resourceType][id].domain ||
          this.model[resourceType][id].id
      : '';
  },

  _computeResourceRulesArray(_rules, _resource, _category) {
    const rulesArray = [];
    if (this.rules) {
      Object.keys(this.rules || {}).forEach(p => {
        // this.rules[rule].edit = false;
        rulesArray.push(this.rules[p]);
      });
    }
    return rulesArray;
  },

  _ruleInCategory(r, category) {
    if (category.type === 'specific_machines') {
      for (const p of Object.keys(r.selectors || {})) {
        if (
          r.selectors[p].type === 'machines' &&
          r.selectors[p].ids.length === 1
        ) {
          return true;
        }
      }
    } else if (category.type === 'all_machines') {
      if (!r.selectors || !r.selectors.length) {
        return true;
      }
    } else if (category.type === 'tagged_machines') {
      for (const p of Object.keys(r.selectors || {})) {
        if (r.selectors[p].type === 'tags') {
          return true;
        }
      }
    }
    return false;
  },

  _removeBrackets(string) {
    return (
      string &&
      string
        .replace(/{/g, '')
        .replace(/}/g, '')
        .replace(/"/g, '')
        .replace(/:/g, '=')
        .replace(/=null/g, '')
    );
  },

  _categoryHasNoRules(rules, category) {
    for (const p of Object.keys(rules || {})) {
      if (this._ruleInCategory(rules[p], category)) {
        return false;
      }
    }
    return true;
  },

  _ruleAppliesOnResource(r, resource) {
    // FIXME: This is currently unused
    const type = 'machines';
    const that = this;
    const m =
      !r.selectors ||
      !r.selectors.length ||
      (r.selectors &&
        r.selectors.find(
          s =>
            (s.type === type && s.ids.indexOf(that.resource.id) > -1) ||
            (s.type === 'tags' && that._tagsInResource(s.include, resource))
        ));
    return !!m;
  },

  _tagsInResource(tags, resource) {
    for (const t of Object.keys(tags || {})) {
      if (resource.tags[t] && tags[t] && resource.tags[t] !== tags[t]) {
        return false;
      }
    }
    return true;
  },

  computeRuleCategories(resource, rules, _machines) {
    const categories = [];
    const that = this;
    const rulesArray = rules ? Object.values(rules) : [];
    const resourceTypes = [
      'clouds',
      'machines',
      'volumes',
      'networks',
      'subnets',
      'zones',
      'records',
      'keys',
      'images',
      'scripts',
      'templates',
      'schedules',
      'members',
      'arbitrary',
    ];
    rulesArray.forEach(r => {
      const s = r.selectors || [];
      // rule applies on all machines or rule is no-data-rule
      if (r.arbitrary || !r.resource_type) {
        if (!categories.find(c => c.type === 'arbitrary')) {
          categories.push({
            name: 'Organization Rules',
            type: 'arbitrary',
            rules: [r],
            selectors: [],
          });
        } else {
          categories.find(c => c.type === 'arbitrary').rules.push(r);
        }
      }
      if (
        !resource ||
        (r.resource_type &&
          that.model &&
          that.model[`${r.resource_type}s`] &&
          Object.values(that.model[`${r.resource_type}s`])
            .map(x => x.id)
            .indexOf(resource.id) > -1)
      ) {
        // rule is no-data-rule
        if (r.title === 'NoData') {
          const existingCategory = categories.find(
            c => c.type === 'all_machines'
          );
          if (!existingCategory) {
            categories.push({
              name: 'Apply on all machines',
              type: 'all_machines',
              count:
                (that.machines &&
                  Object.keys(that.machines) &&
                  Object.keys(that.machines).length) ||
                0,
              rules: [r],
              selectors: [],
            });
          } else {
            existingCategory.rules.push(r);
          }
        }
        // rule applies on all of a resource_type
        if (s && !s.length && r.resource_type) {
          if (!categories.find(c => c.type === `all_${r.resource_type}s`)) {
            categories.push({
              name: `Apply on all ${r.resource_type}s`,
              type: `all_${r.resource_type}s`,
              // count: that.machines && Object.keys(that.machines) && Object.keys(that.machines).length || 0,
              rules: [r],
              selectors: [],
            });
          } else {
            categories
              .find(c => c.type === `all_${r.resource_type}s`)
              .rules.push(r);
          }
        }
      }
      // rule applies on specific or tagged
      if (s) {
        for (let l = 0; l < s.length; l++) {
          const sl = s[l];
          if (sl.type === 'tags') {
            const stringifiedTags = that._removeBrackets(
              JSON.stringify(sl.include)
            );
            const existingCategory = categories.find(
              c =>
                c.type === `tagged_${r.resource_type}s` &&
                c.stringifiedTags === stringifiedTags
            );
            if (!existingCategory) {
              categories.push({
                id: `apply-on-tags-of-${r.resource_type}s`,
                name: `Apply on ${r.resource_type}s with tags `,
                type: `tagged_${r.resource_type}s`,
                stringifiedTags,
                rules: [r],
                selectors: [sl.include],
              });
            } else {
              existingCategory.rules.push(r);
            }
          }
          if (resourceTypes.indexOf(sl.type) > -1) {
            if (!resource || sl.ids.indexOf(resource.id) > -1) {
              const thisResource = resource ? 'this ' : '';
              const specificCategory = categories.find(c => {
                let allSame = true;
                for (let n = 0; n < c.selectors.length; n++) {
                  if (sl.ids.indexOf(c.selectors[n]) === -1) allSame = false;
                }
                return c.type === `specific_${r.resource_type}s` && allSame;
              });
              if (!specificCategory)
                categories.push({
                  id: `apply-on-${thisResource.trim()}`,
                  name: `Apply on ${thisResource} ${r.resource_type} `,
                  type: `specific_${r.resource_type}s`,
                  rules: [r],
                  count: 1,
                  selectors: sl.ids,
                });
              else {
                specificCategory.rules.push(r);
                specificCategory.count++;
              }
            }
          }
        }
      }
    });

    return categories.sort((a, b) => {
      const atype = a.type.split('_')[1] || 'arbitrary';
      const btype = b.type.split('_')[1] || 'arbitrary';
      if (resourceTypes.indexOf(atype) < resourceTypes.indexOf(btype)) {
        return -1;
      }
      if (resourceTypes.indexOf(atype) > resourceTypes.indexOf(btype)) {
        return 1;
      }
      if (a.name > b.name) return -1;
      if (a.name < b.name) return 1;
      return 0;
    });
  },

  _computeNames(ids, machines, resource) {
    const names = [];
    let missing = 0;

    if (resource) {
      return resource.name;
    }
    if (machines) {
      for (let i = 0; i < ids.length; i++) {
        const m = machines[ids[i]];
        if (m) names.push(m.name);
        else missing++;
      }
      missing = missing ? `${missing} missing` : '';
      return names.join(' ,') + missing;
    }
    return '';
  },

  _computeMetrics(_resource, _builtinMetrics, _customMetrics) {
    const metrics = [];
    Object.keys(this.builtinMetrics || {}).forEach(p => {
      metrics.push(this.builtinMetrics[p]);
    });
    if (this.customMetrics) {
      Object.keys(this.customMetrics).forEach(q => {
        if (this.customMetrics[q].machines) {
          const machineHasCustomMetric =
            this.resource &&
            this.customMetrics[q].machines.find(
              m =>
                m[0] === this.resource.cloud &&
                m[1] === this.resource.external_id,
              this
            );
          if (machineHasCustomMetric || !this.resource)
            metrics.push(this.customMetrics[q]);
        }
      });
    }
    return metrics;
  },

  _hasOpenIncident(rule, incidents) {
    if (!rule || !incidents) {
      return false;
    }
    const find = this.incidents.findIndex(
      inc => !inc.finished_at && inc.rule_id === rule.id
    );
    return find !== -1;
  },

  _computeToggleButtonStyle(expanded) {
    return (!expanded && 'transform: rotate(270deg);') || '';
  },
});
