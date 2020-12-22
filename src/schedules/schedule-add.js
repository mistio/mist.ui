import '../../node_modules/@polymer/paper-material/paper-material.js';
import '../../node_modules/@polymer/paper-button/paper-button.js';
import '../../node_modules/@polymer/paper-progress/paper-progress.js';
import '../../node_modules/@polymer/paper-styles/typography.js';
import '../app-form/app-form.js';
import moment from '../../node_modules/moment/src/moment.js';
import { YAML } from '../../node_modules/yaml/browser/dist/index.js';
import { Polymer } from '../../node_modules/@polymer/polymer/lib/legacy/polymer-fn.js';
import { html } from '../../node_modules/@polymer/polymer/lib/utils/html-tag.js';

const SCHEDULEACTIONS = {
  reboot: {
    name: 'reboot',
    icon: 'av:replay',
    confirm: true,
    multi: true,
  },
  start: {
    name: 'start',
    icon: 'av:replay',
    confirm: true,
    multi: true,
  },
  stop: {
    name: 'stop',
    icon: 'av:stop',
    confirm: true,
    multi: true,
  },
  suspend: {
    name: 'suspend',
    icon: 'av:stop',
    confirm: true,
    multi: true,
  },
  resume: {
    name: 'resume',
    icon: 'av:replay',
    confirm: true,
    multi: true,
  },
  undefine: {
    name: 'undefine',
    icon: 'image:panorama-fish-eye',
    confirm: true,
    multi: true,
  },
  destroy: {
    name: 'destroy',
    icon: 'delete',
    confirm: true,
    multi: true,
  },
  'run-script': {
    name: 'run script',
    icon: 'image:movie-creation',
    confirm: true,
    multi: false,
  },
};

Polymer({
  _template: html`
    <style include="shared-styles forms single-page">
      #content {
        max-width: 900px;
      }

      paper-material {
        display: block;
        padding: 24px;
      }

      paper-progress {
        position: absolute;
        bottom: 85px;
        width: 100%;
        left: 0;
        right: 0;
      }

      app-form::slotted(#schedule_entry_interval_period) {
        width: 70px;
      }

      .single-head {
        @apply --schedule-page-head-mixin;
      }
    </style>
    <div id="content">
      <paper-material class="single-head layout horizontal">
        <span class="icon">
          <iron-icon icon="[[section.icon]]"></iron-icon>
        </span>
        <div class="title flex">
          <h2>Add Schedule</h2>
          <div class="subtitle"></div>
        </div>
      </paper-material>
      <paper-material>
        <app-form
          id="scheduleAddForm"
          fields="{{fields}}"
          form="[[schedule]]"
          url="/api/v1/schedules"
          on-response="_handleAddScheduleResponse"
          on-error="_handleError"
        ></app-form>
      </paper-material>
    </div>
  `,

  is: 'schedule-add',

  properties: {
    section: {
      type: Object,
    },
    model: {
      type: Object,
    },
    schedule: {
      type: Object,
    },
    currency: {
      type: Object,
    },
    fields: {
      type: Array,
      computed: '_computeFields(currency)',
      notify: true,
    },
    actions: {
      type: Array,
      computed: '_computeActions(model.machines)',
    },
    docs: {
      type: String,
      value: '',
    },
  },

  observers: ['_fieldsChanged(fields.*)', '_updateFields(fields, model.*)'],

  listeners: {
    'add-input': 'addInput',
  },

  ready() {
    if (!this.docs && this.fields) {
      for (let i = 0; i < this.fields.length; i++) {
        this.fields[i].helpHref = '';
      }
    }
  },

  _computeFields(currency) {
    if (currency) {
      return [
        {
          name: 'name',
          label: 'Name *',
          type: 'text',
          value: '',
          defaultValue: '',
          placeholder: '',
          errorMessage: "Please enter schedule's name.",
          show: true,
          required: true,
          helptext: '',
        },
        {
          name: 'description',
          label: 'Description',
          type: 'text',
          value: '',
          defaultValue: '',
          show: true,
          required: false,
          helptext:
            "Optional. Helpful descriptions improve a team's workflows.",
        },
        {
          name: 'task_enabled',
          label: 'Enabled',
          type: 'toggle',
          value: true,
          defaultValue: true,
          show: true,
          required: false,
          helptext: 'You can save your schedule and enable it later.',
        },
        {
          name: 'action',
          label: 'Task',
          type: 'dropdown',
          value: '',
          defaultValue: '',
          show: true,
          required: true,
          helptext: 'Choose one from the available tasks to schedule.',
          options: [],
        },
        {
          name: 'script_id',
          label: 'Script',
          type: 'mist_dropdown',
          value: '',
          defaultValue: '',
          add: true,
          show: false,
          required: true,
          helptext: 'Schedule an existing script to run.',
          options: [],
          showIf: {
            fieldName: 'action',
            fieldValues: ['run script'],
          },
        },
        {
          name: 'params',
          label: 'Parameters',
          type: 'textarea',
          value: '',
          defaultValue: '',
          helptext: '',
          show: false,
          required: false,
          showIf: {
            fieldName: 'action',
            fieldValues: ['run script'],
          },
        },
        {
          name: 'ids_or_tags',
          label: 'Specific machines or machines with tags',
          type: 'radio',
          value: 'tags',
          defaultValue: 'tags',
          show: true,
          required: false,
          excludeFromPayload: true,
          helptext:
            'The scheduled task can run either on specific machines, or on machines with the specified tags at the scheduled time',
          class: 'bind-bottom radio-highight',
          options: [
            {
              title: 'Specific Machines',
              val: 'ids',
            },
            {
              title: 'Machines with tags',
              val: 'tags',
            },
          ],
        },
        {
          name: 'machines_uuids',
          label: 'Machines',
          // type: "mist_dropdown",
          type: 'checkboxes',
          value: '',
          defaultValue: '',
          show: true,
          required: true,
          excludeFromPayload: true,
          helptext: 'Select specific machines to be included in scheduler.',
          options: [],
          class: 'bind-both background',
          showIf: {
            fieldName: 'ids_or_tags',
            fieldValues: ['ids'],
          },
        },
        {
          name: 'machines_tags',
          label: 'Machines with tags',
          type: 'textarea',
          value: '',
          defaultValue: '',
          show: true,
          required: true,
          excludeFromPayload: true,
          helptext:
            'Scheduler will include all machines with the specified tags. Alphanumerical only.',
          class: 'bind-both background',
          showIf: {
            fieldName: 'ids_or_tags',
            fieldValues: ['tags'],
          },
        },
        {
          name: 'machines_selectors_age_more_value',
          label: 'which are older than',
          type: 'text',
          value: '',
          defaultValue: '',
          show: true,
          required: false,
          pattern: '[0-9]*',
          errorMessage: 'Please enter numbers only!',
          excludeFromPayload: true,
          helptext: '',
          class: 'bind-both background',
        },
        {
          name: 'machines_selectors_age_more_unit',
          label: '',
          type: 'radio',
          value: 'days',
          defaultValue: 'days',
          show: true,
          required: false,
          excludeFromPayload: true,
          helptext:
            'Apply an extra filter to apply the schedule to machines having been created longer than a time period ago',
          options: [
            {
              val: 'minutes',
              title: 'minutes',
            },
            {
              val: 'hours',
              title: 'hours',
            },
            {
              val: 'days',
              title: 'days',
            },
          ],
          class: 'bind-both background',
        },
        {
          name: 'machines_selectors_cost',
          label: 'and cost more than',
          type: 'text',
          value: null,
          defaultValue: '',
          show: true,
          required: false,
          suffix: `${this.currency.sign}/month`,
          pattern: '[0-9]*',
          errorMessage: 'Please enter numbers only!',
          excludeFromPayload: true,
          helptext: `Apply an extra filter of costing more than a certain amount of ${this.currency.sign} per month`,
          class: 'bind-top background',
        },
        {
          name: 'selectors',
          label: 'machines selectors',
          type: 'text',
          value: [],
          defaultValue: [],
          show: false,
          required: true,
          excludeFromPayload: false,
        },
        {
          name: 'schedule_type',
          label: 'Schedule Type',
          type: 'radio',
          value: 'one_off',
          defaultValue: 'one_off',
          helptext: 'The scheduler type. Visit the docs ',
          helpHref: 'http://docs.mist.io/article/151-scheduler',
          show: true,
          required: true,
          class: 'bind-bottom radio-highight',
          options: [
            {
              title: 'Once',
              val: 'one_off',
            },
            {
              title: 'Repeat',
              val: 'interval',
            },
            {
              title: 'Crontab',
              val: 'crontab',
            },
          ],
        },
        {
          name: 'schedule_entry',
          label: 'Schedule time',
          type: 'text',
          value: null,
          defaultValue: '',
          helptext: '',
          show: false,
          required: true,
        },
        {
          name: 'schedule_entry_interval_every',
          label: 'Interval',
          type: 'text',
          value: '10',
          defaultValue: '',
          excludeFromPayload: true,
          pattern: '[0-9]*',
          errorMessage: 'Please enter numbers only!',
          class: 'bind-both background',
          show: true,
          required: true,
          helptext: 'Example, every 10 minutes',
          showIf: {
            fieldName: 'schedule_type',
            fieldValues: ['interval'],
          },
        },
        {
          name: 'schedule_entry_interval_period',
          type: 'radio',
          value: 'minutes',
          defaultValue: 'minutes',
          excludeFromPayload: true,
          class: 'bind-top background',
          show: true,
          required: false,
          showIf: {
            fieldName: 'schedule_type',
            fieldValues: ['interval'],
          },
          options: [
            {
              // days, hours, minutes, seconds, microseconds
              title: 'days',
              val: 'days',
            },
            {
              title: 'hours',
              val: 'hours',
            },
            {
              title: 'mins',
              val: 'minutes',
            },
          ],
        },
        {
          name: 'schedule_entry_crontab',
          label: 'Crontab',
          type: 'text',
          value: '*/10 * * * *',
          defaultValue: '',
          excludeFromPayload: true,
          class: 'bind-top background',
          show: true,
          required: false,
          helptext:
            'UTC Time only. Example: */10 * * 1 *, is every 10 minutes on the 1st of each month. Relative periods: Minute, Hour, Day of the Month, Month of the Year, Day of the Week.',
          helpHref:
            'http://docs.celeryproject.org/en/latest/userguide/periodic-tasks.html#crontab-schedules',
          showIf: {
            fieldName: 'schedule_type',
            fieldValues: ['crontab'],
          },
        },
        {
          name: 'schedule_entry_one_off',
          label: '',
          type: 'date',
          value: '',
          defaultValue: '',
          validate: 'inFuture',
          class: 'bind-top background',
          icon: 'schedule',
          excludeFromPayload: true,
          show: true,
          required: false,
          showIf: {
            fieldName: 'schedule_type',
            fieldValues: ['one_off'],
          },
        },
        {
          name: 'start_after',
          label: 'Starts',
          type: 'date',
          value: '',
          placeholder: 'now',
          defaultValue: '',
          validate: 'inFuture',
          helptext: '',
          icon: 'schedule',
          show: false,
          required: false,
          disabled: false,
          showIf: {
            fieldName: 'schedule_type',
            fieldValues: ['interval', 'crontab'],
          },
        },
        {
          name: 'expires',
          label: 'Expires',
          type: 'date',
          value: '',
          placeholder: 'never',
          excludeFromPayload: true,
          defaultValue: '',
          validate: 'inFuture',
          helptext: '',
          icon: 'schedule',
          show: true,
          required: false,
          disabled: true,
          showIf: {
            fieldName: 'schedule_type',
            fieldValues: ['interval', 'crontab'],
          },
        },
        {
          name: 'max_run_count',
          label: 'Maximum Run Count',
          type: 'text',
          value: '',
          defaultValue: '',
          excludeFromPayload: true,
          disabled: true,
          show: true,
          required: false,
          helptext:
            "Optional. Integers only. Define a maximum run count, unless it's a one_of schedule.",
          showIf: {
            fieldName: 'schedule_type',
            fieldValues: ['interval', 'crontab'],
          },
        },
        {
          name: 'run_immediately',
          label: 'Run once immediately',
          type: 'toggle',
          value: false,
          defaultValue: false,
          show: true,
          required: false,
          helptext:
            'Set to true to run the scheduled task once upon creation and then as scheduled.',
          showIf: {
            fieldName: 'schedule_type',
            fieldValues: ['interval', 'crontab'],
          },
        },
      ];
    }
    return [];
  },

  _computeActions(_machines) {
    const ret = ['start', 'stop', 'reboot', 'destroy', 'run-script']; // 'suspend', 'resume',

    const actions = [];
    for (let i = 0; i < ret.length; i++) {
      const act = SCHEDULEACTIONS[ret[i]];
      const transformRet = {
        title: act.name.toUpperCase(),
        val: act.name,
        icon: act.icon,
      };
      actions.push(transformRet);
    }

    return actions;
  },
  /* eslint-disable no-param-reassign */
  _updateFields(_fields, _model) {
    if (this.model && this.fields) {
      const _this = this;
      this.fields.forEach(f => {
        if (f.name === 'script_id') {
          f.options = this.model.scriptsArray || [];
        }

        if (f.name === 'machines_uuids') {
          f.options =
            (this.model &&
              this.model.machines &&
              Object.keys(this.model.machines).map(m => {
                const machine = _this.model.machines[m];
                if (machine && _this.model.clouds[machine.cloud]) {
                  return {
                    id: m,
                    name: machine.name,
                    img: `assets/providers/provider-${_this.model.clouds[
                      machine.cloud
                    ].provider.replace('_', '')}.png`,
                  };
                }
                return {};
              })) ||
            [];
          this._updateCheckboxes();
        }

        if (f.name.startsWith('action')) {
          f.options = this.actions;
        }
      }, this);
    }
  },

  _updateCheckboxes() {
    // check if any checkboxes are selected
    const checkedMachines = this.get(
      `fields.${this._fieldIndexByName('machines_uuids')}.value`
    );
    // if there are selected checkboxes, keep selection on update
    if (checkedMachines && checkedMachines.length) {
      const checkboxes = this.$.scheduleAddForm.shadowRoot.querySelectorAll(
        'paper-checkbox[name="machines_uuids"]'
      );
      [].forEach.call(checkboxes, el => {
        if (checkedMachines.indexOf(el.id) > -1) el.checked = true;
        else el.checked = false;
      });
    }
  },

  _fieldsChanged(changeRecord) {
    // console.log('changeRecord', changeRecord);
    if (
      changeRecord.path.endsWith('.value') &&
      changeRecord.path.split('.value').length < 3
    ) {
      // selecting action
      if (this.get(changeRecord.path.replace('.value', '')).name === 'action') {
        const actionInd = this._fieldIndexByName('action');
        const scriptInd = this._fieldIndexByName('script_id');
        if (changeRecord.value === 'run script') {
          this.set(`fields.${actionInd}.excludeFromPayload`, true);
          this.set(`fields.${scriptInd}.excludeFromPayload`, false);
        }
        if (changeRecord.value !== 'run script') {
          this.set(`fields.${actionInd}.excludeFromPayload`, false);
          this.set(`fields.${scriptInd}.excludeFromPayload`, true);
        }
      }

      // selecting uuids or tags
      if (
        this.get(changeRecord.path.replace('.value', '')).name === 'ids_or_tags'
      ) {
        const uuidsInd = this._fieldIndexByName('machines_uuids');

        if (changeRecord.value === 'ids') {
          this._removeObjectFromSelectors('tags');
        } else if (changeRecord.value === 'tags') {
          this._removeObjectFromSelectors('machines');

          // clear checkbox selection
          this.set(`fields.${uuidsInd}.value`, []);
          const checkboxes = this.$.scheduleAddForm.querySelectorAll(
            'paper-checkbox'
          );
          [].forEach.call(checkboxes, el => {
            el.checked = false;
          });
        }
      }

      // changing uuids
      if (
        this.get(changeRecord.path.replace('.value', '')).name.startsWith(
          'machines_uuids'
        )
      ) {
        // console.log('changeRecord.value', changeRecord.value);
        this._updateObjectInSelectors('machines', 'ids', changeRecord.value);
        this._removeObjectFromSelectors('tags');
      }

      // changing tags
      if (
        this.get(changeRecord.path.replace('.value', '')).name.startsWith(
          'machines_tags'
        )
      ) {
        const textToArray = changeRecord.value.split(',');
        this._updateObjectInSelectors(
          'tags',
          'include',
          this._constructTagsValue(textToArray)
        );
        this._removeObjectFromSelectors('machines');
      }

      // changing age selectors
      if (
        this.get(changeRecord.path.replace('.value', '')).name.startsWith(
          'machines_selectors_age_more_'
        )
      ) {
        const condsInd = this._fieldIndexByName('selectors');
        const perInd = this._fieldIndexByName(
          'machines_selectors_age_more_unit'
        );
        const numInd = this._fieldIndexByName(
          'machines_selectors_age_more_value'
        );
        const key = this.get(`fields.${perInd}.value`);
        const num = parseInt(this.get(`fields.${numInd}.value`), 10);

        if (!changeRecord.value.length || !key.length || !parseInt(num, 10)) {
          // clear selectors
          this._removeObjectFromSelectors('age');
        } else {
          this._updateAgeSelector(condsInd, key, num);
        }
      }

      // changing cost selectors
      if (
        this.get(changeRecord.path.replace('.value', '')).name.startsWith(
          'machines_selectors_cost'
        )
      ) {
        if (!changeRecord.value.length || !parseInt(changeRecord.value, 10)) {
          // clear cost selector
          this._removeObjectFromSelectors('cost__monthly');
        } else {
          this._updateObjectInSelectors(
            'cost__monthly',
            'value',
            parseInt(changeRecord.value, 10),
            'gt'
          );
        }
      }
      let entryInd;
      // initial values in shedule entry
      if (
        this.get(changeRecord.path.replace('.value', '')).name ===
        'schedule_type'
      ) {
        entryInd = this._fieldIndexByName('schedule_entry');
        const expInd = this._fieldIndexByName('expires');
        const entryCronTabInd = this._fieldIndexByName(
          'schedule_entry_crontab'
        );
        const maxcountInd = this._fieldIndexByName('max_run_count');
        const runImmediatelyInd = this._fieldIndexByName('run_immediately');
        let entry;

        if (changeRecord.value === 'interval') {
          entry = this._processInterval();
          this.set(`fields.${expInd}.disabled`, false);
          this.set(`fields.${maxcountInd}.disabled`, false);
          this.set(`fields.${maxcountInd}.value`, '');
        } else if (changeRecord.value === 'crontab') {
          entry = this._processCrontab(
            this.get(`fields.${entryCronTabInd}.value`)
          );
          this.set(`fields.${expInd}.disabled`, false);
          this.set(`fields.${maxcountInd}.disabled`, false);
          this.set(`fields.${maxcountInd}.value`, '');
        } else if (changeRecord.value === 'one_off') {
          entry = this.get(`fields.${entryInd}.value`);
          this.set(`fields.${expInd}.disabled`, true);
          this.set(`fields.${maxcountInd}.value`, 1);
          this.set(`fields.${maxcountInd}.disabled`, true);
          this.set(`fields.${runImmediatelyInd}.value`, false);
          entry = moment
            .unix(entry / 1000)
            .utc()
            .format('MM/DD/YYYY HH:MM');
        }
        this.set(`fields.${entryInd}.value`, entry);
      }

      // date in shedule entry
      if (
        this.get(changeRecord.path.replace('.value', '')).name ===
        'schedule_entry_one_off'
      ) {
        entryInd = this._fieldIndexByName('schedule_entry');
        this.set(
          `fields.${entryInd}.value`,
          moment
            .unix(changeRecord.value / 1000)
            .utc()
            .format('YYYY-MM-DD HH:mm:ss')
        );
      }

      // crontab in schedule entry
      if (
        this.get(changeRecord.path.replace('.value', '')).name ===
        'schedule_entry_crontab'
      ) {
        entryInd = this._fieldIndexByName('schedule_entry');
        this.set(
          `fields.${entryInd}.value`,
          this._processCrontab(changeRecord.value)
        );
      }

      // interval changes in schedule entry
      if (
        this.get(changeRecord.path.replace('.value', '')).name.startsWith(
          'schedule_entry_interval_'
        )
      ) {
        entryInd = this._fieldIndexByName('schedule_entry');
        this.set(`fields.${entryInd}.value`, this._processInterval());
      }
      //   const expiresInd = this._fieldIndexByName("expires");
      //   if (this.get(changeRecord.path.replace('.value', '')).name === "expires") {
      //       const excludeFromPayload = changeRecord.value === "" && true || false;
      //       this.set(`fields.${  expiresInd  }.excludeFromPayload`, excludeFromPayload);
      //       if (!excludeFromPayload) {
      //           this.set(`fields.${  expiresInd  }.value`, moment.unix(changeRecord.value/1000).utc().format("YYYY-MM-DD HH:mm:ss"));
      //       }
      //   }

      //   if (this.get(changeRecord.path.replace('.value', '')).name === "start_after") {
      //       const startAfterInd = this._fieldIndexByName("start_after");
      //       const excludeFromPayload = changeRecord.value === "" && true || false;
      //       this.set(`fields.${  startAfterInd  }.excludeFromPayload`, excludeFromPayload);
      //       if (!excludeFromPayload) {
      //           this.set(`fields.${  expiresInd  }.value`, moment.unix(changeRecord.value/1000).utc().format("YYYY-MM-DD HH:mm:ss"));
      //       }
      //   }

      if (
        this.get(changeRecord.path.replace('.value', '')).name ===
        'max_run_count'
      ) {
        const maxcountInd = this._fieldIndexByName('max_run_count');
        if (typeof this.get(`fields.${maxcountInd}.value`) !== 'number') {
          if (Number.isNan(parseInt(changeRecord.value, 10))) {
            this.set(`fields.${maxcountInd}.excludeFromPayload`, true);
            this.set(`fields.${maxcountInd}.value`, '');
          } else {
            this.set(`fields.${maxcountInd}.excludeFromPayload`, false);
            this.set(
              `fields.${maxcountInd}.value`,
              parseInt(changeRecord.value, 10)
            );
          }
        }
      }
    }
  },
  /* eslint-enable no-param-reassign */

  _updateAgeSelector(index, key, value) {
    let minutes;
    if (key === 'minutes') minutes = value;
    else if (key === 'hours') minutes = value * 60;
    else if (key === 'days') minutes = value * 60 * 24;

    if (minutes) this._updateObjectInSelectors('age', 'minutes', minutes);
    // this.set('fields.'+ index +'.value', [{'type': 'age', 'field': 'age', 'minutes': minutes}]);
  },

  _updateObjectInSelectors(field, attr, value, operator) {
    // console.log('_updateObjectInSelectors', field, attr, value, operator);
    const selectors = this.get(
      `fields.${this._fieldIndexByName('selectors')}.value`
    );
    const selectorsField = selectors.find(con => {
      return ['age', 'machines', 'tags'].indexOf(field) === -1
        ? con.field === field
        : con.type === field;
    });
    const index = selectors.indexOf(selectorsField);
    // console.log('index', index);
    if (index > -1) {
      this.set(
        `fields.${this._fieldIndexByName('selectors')}.value.${index}.${attr}`,
        value
      );
    } else {
      this._addObjectInSelectors(field, value, operator);
    }
  },

  _addObjectInSelectors(field, value, operator) {
    let newSelector;
    if (field === 'age') {
      newSelector = {
        type: 'age',
        minutes: value,
      };
    } else if (field === 'machines') {
      newSelector = {
        type: 'machines',
        ids: value,
      };
    } else if (field === 'tags') {
      newSelector = {
        type: 'tags',
        include: value,
      };
    } else {
      newSelector = {
        type: 'field',
        field,
        value,
      };
      if (operator) newSelector.operator = operator;
    }
    this.push(
      `fields.${this._fieldIndexByName('selectors')}.value`,
      newSelector
    );
  },

  _removeObjectFromSelectors(field) {
    const selectors = this.get(
      `fields.${this._fieldIndexByName('selectors')}.value`
    );
    const field_ = selectors.find(con => {
      return ['age', 'machines', 'tags'].indexOf(field) === -1
        ? con.field === field
        : con.type === field;
    });
    const index = selectors.indexOf(field_);

    if (index > -1)
      this.splice(
        `fields.${this._fieldIndexByName('selectors')}.value`,
        index,
        1
      );
  },

  _processInterval() {
    const everyInd = this._fieldIndexByName('schedule_entry_interval_every');
    const periodInd = this._fieldIndexByName('schedule_entry_interval_period');

    const interval = {
      every: this.get(`fields.${everyInd}.value`),
      period: this.get(`fields.${periodInd}.value`),
    };

    return interval;
  },

  _processCrontab(entry) {
    const chunchs = entry.split(' ');
    // "minute" : "30", "hour" : "2", "day_of_week" : "*", "day_of_month" : "*", "month_of_year" : "*"
    // fill in missing
    for (let i = 0; i < 5; i++) {
      if (!chunchs[i]) chunchs[i] = '*';
    }
    const diff = moment().utcOffset() / 60;
    const construct = {
      minute: chunchs[0],
      hour: chunchs[1],
      day_of_month: chunchs[2],
      month_of_year: chunchs[3],
      day_of_week: chunchs[4],
    };
    if (construct.hour !== '*' && parseInt(chunchs[1], 10) && diff) {
      construct.hour = ((parseInt(chunchs[1], 10) - diff) % 24).toString();
    }
    return construct;
  },

  _constructTagsValue(tagStringsArray) {
    const arr = {};
    tagStringsArray.forEach(string => {
      const chunks = string.split('=');
      if (chunks.length > 0 && chunks[0].trim().length > 0) {
        const key = chunks[0].trim();
        arr[key] = '';
        if (chunks.length > 1) arr[key] = chunks[1].trim();
      }
    });
    return arr;
  },

  _handleAddScheduleResponse(e) {
    const response = YAML.parse(e.detail.xhr.response);
    this.async(() => {
      this.dispatchEvent(
        new CustomEvent('go-to', {
          bubbles: true,
          composed: true,
          detail: {
            url: `/schedules/${response.id}`,
          },
        })
      );
    }, 500);
  },

  _handleError(e) {
    // console.log(e);
    this.$.errormsg.textContent = e.detail.request.xhr.responseText;
    this.set('formError', true);
  },

  _fieldIndexByName(name) {
    return this.fields.findIndex(f => {
      return f.name === name;
    });
  },

  _goBack() {
    window.history.back();
  },

  updateScripts(e) {
    // console.log('updateScripts', e)
    const scriptInd = this._fieldIndexByName('script_id');
    this.async(() => {
      this.set(`fields.${scriptInd}.options`, this.model.scriptsArray);
      this.set(`fields.${scriptInd}.value`, e.detail.script);
    }, 1000);
  },

  addInput(e) {
    if (e.detail.fieldname === 'script_id') {
      // set attribute origin
      const origin = window.location.pathname;
      const qParams = {
        origin,
      };
      this.dispatchEvent(
        new CustomEvent('go-to', {
          bubbles: true,
          composed: true,
          detail: {
            url: '/scripts/+add',
            params: qParams,
          },
        })
      );
    }
  },
});
