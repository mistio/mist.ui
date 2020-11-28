import '../../node_modules/@polymer/polymer/polymer-legacy.js';
import '../../node_modules/@polymer/iron-ajax/iron-ajax.js';
import '../../node_modules/@polymer/paper-styles/typography.js';
import '../../node_modules/@polymer/iron-collapse/iron-collapse.js';
import '../../node_modules/@polymer/paper-button/paper-button.js';
import '../../node_modules/@polymer/neon-animation/animations/scale-up-animation.js';
import '../../node_modules/@polymer/neon-animation/animations/fade-out-animation.js';
import '../../node_modules/@polymer/paper-listbox/paper-listbox.js';
import '../../node_modules/@vaadin/vaadin-dialog/vaadin-dialog.js';
import moment from '../../node_modules/moment/src/moment.js';
import { rbacBehavior } from '../rbac-behavior.js';
import { Polymer } from '../../node_modules/@polymer/polymer/lib/legacy/polymer-fn.js';
import { html } from '../../node_modules/@polymer/polymer/lib/utils/html-tag.js';

Polymer({
  _template: html`
        <style include="shared-styles dialogs">
        :host {
            width: 100%;
        }

        .paper-dialog-scrollable {
            padding-bottom: 24px;
        }

        .collapsible {
            height: 0;
            overflow: hidden;
            transition: height 300ms ease-in-out 100ms;
        }

        .collapsible[open] {
            height: auto;
        }

        @media screen and (max-width: 450px) {
            :host paper-dropdown-menu ::slotted(.dropdown-content) {
                top: 0 !important;
            }
        }
        </style>
        <vaadin-dialog id="dialogModal" theme="mist-dialog" with-backdrop="">
            <template>
                <h2>Edit expiration date</h2>
                <div class="paper-dialog-scrollable">
                    <app-form id="machine-expiration-edit" fields="{{fields}}" single-column="" indialog="" no-horizontal-margins="" on-request="_expirationRequest" show-cancel="" btncontent="Save" url="/api/v1/machines/[[machine.id]]" method="PUT" btn-class="smaller"></app-form>
                </div>
            </template>
        </vaadin-dialog>
`,

  is: 'machine-expiration-edit',
  behaviors: [rbacBehavior],

  properties: {
      model: {
          type: Object
      },
      machine: {
          type: Object
      },
      permissions: {
          type: Object
      },
      fields: {
          type: Array,
          value () {
              return [
              {
                  name: 'expiration',
                  label: 'Expiration Date',
                  type: 'fieldgroup',
                  value: {},
                  defaultValue: {},
                  defaultToggleValue: true,
                  show: true,
                  required: false,
                  optional: false,
                  singleColumnForm: true,
                  inline: true,
                  subfields: [
                      {
                          name: 'action',
                          type: 'dropdown',
                          value: 'stop',
                          defaultValue: 'stop',
                          helptext: '',
                          show: true,
                          required: false,
                          class: 'bind-both width-150 inline-block',
                          options: [
                              {val: 'stop', title: 'STOP'},
                              {val: 'destroy', title: 'DESTROY'}
                          ]
                      }, {
                          name: 'date',
                          type: 'duration_field',
                          class: 'bind-both m8',
                          value: '',
                          defaultValue: '',
                          valueType: 'date',
                          helptext: '',
                          show: true,
                          required: false,
                          prefixText: 'in ',
                          options: [
                              {val: 'months', title: 'months'},
                              {val: 'weeks', title: 'weeks'},
                              {val: 'days', title: 'days'},
                              {val: 'hours', title: 'hours'},
                              {val: 'minutes', title: 'minutes'}
                          ]
                      }, {
                          name: 'notify',
                          type: 'duration_field',
                          valueType: 'secs',
                          value: 3600,
                          defaultValue: 3600,
                          defaultCheck: true,
                          class: 'bind-both',
                          helptext: '',
                          show: true,
                          required: false,
                          prefixText: 'Notify me ',
                          suffixText: 'before',
                          optional: true,
                          options: [
                              {val: 'months', title: 'months'},
                              {val: 'weeks', title: 'weeks'},
                              {val: 'days', title: 'days'},
                              {val: 'hours', title: 'hours'},
                              {val: 'minutes', title: 'minutes'}
                          ]
                      }
                  ]
              }
              ]
          }
      }
  },

  listeners: {
      'change': 'updateInputs',
      // 'open-and-select' : 'openAndSelect'
  },

  observers: [
      '_checkPermissions(model.org, machine.id)',
      '_expirationDateChanged(fields.0.subfields.1.value)'
  ],

  attached() {
  },

  ready() {
  },

  _checkPermissions(org, machine) {
      if (!org || !machine)
          return;
      const perm = this.check_perm('edit','machine', machine, org, this.model.user);
      this.set('permissions', perm);
      console.log('permissions', 'edit','machine', machine, perm);
  },

  _expirationRequest(_e) {
      this.dispatchEvent(new CustomEvent('pending-expiration-request', { bubbles: true, composed: true, detail: 'edit' }));
  },

  _openDialog(_e) {
      if (this.permissions === false) {
          this.dispatchEvent(new CustomEvent('toast', { bubbles: true, composed: true, detail: {msg:"You are not authorized to edit the expiration date.",duration:3000} }));
      } else {
          if (this.permissions === true) {
              this._initialiseValues(this.machine)
          } else { 
              this._applyPermissions(this.machine, this.permissions);
          }
          this.$.dialogModal.opened = true;
      }
  },

  _closeDialog(_e) {
      this.$.dialogModal.opened = false;
  },
  /* eslint-disable no-param-reassign */
  _applyPermissions(machine,permissions) {
      if (!this.machine || !permissions) 
          return;
      // Get current machine expiration values
      this._initialiseValues(this.machine);

      const currentExpiration = this.machine.expiration;
      const permissionsExpiration = this.permissions.expiration;

      const expirationPath = 'fields.0.subfields.1.'; // expiration date
      const actionPath = 'fields.0.subfields.0.';
      const notifyPath = 'fields.0.subfields.2.';
      // Apply either current values or permission forced values
      // Current values overweigh permission defaults but not max, and permission defaults overweight field defaults 
      if (currentExpiration || permissionsExpiration) {
          // EXPIRATION
          const {date} = currentExpiration;
          const fromNow = this._dateToDurationFromNow(date);
          const notify = currentExpiration.notify || 0;
          this.set(`${expirationPath  }defaultValue`, currentExpiration ? fromNow : permissionsExpiration.default);
          this.set(`${expirationPath  }max`, permissionsExpiration.max);
          this.notifyPath(`${expirationPath  }defaultValue`);
          this.notifyPath(`${expirationPath  }max`);
          
          // ACTIONS
          let action = this.get(`${actionPath  }defaultValue`);
              const options = this.get(`${actionPath  }options`) || [];
              let available;
          // override if permissions dictate
          if (permissionsExpiration.actions) {
              action = permissionsExpiration.actions.default ? permissionsExpiration.actions.default : action;
              if (permissionsExpiration.actions.available) {
                  // construct dropdown of actions, allow the selection of only available by permissions
                  const permAvailable = this._toOptionsFormat(permissionsExpiration.actions.available);
                  available = options.filter((a) => {
                          return permissionsExpiration.actions.available.indexOf(a.val) === -1;
                      });
                  available.forEach((a) => {
                          a.disabled = true;
                      });
                  available = available.concat(permAvailable);
              }
          }
          // override if current value exist
          this.set(`${actionPath  }value`, currentExpiration && currentExpiration.action ? currentExpiration.action : action);
          this.set(`${actionPath  }options`, available || options);

          // NOTIFY
          let defCheck = this.get(`${notifyPath  }defaultCheck`);
              let notValue = this.get(`${notifyPath  }defaultValue`);

          // override if permissions dictate
          if (permissionsExpiration.notify) {
              if (permissionsExpiration.notify.require !== undefined)
                  defCheck = permissionsExpiration.notify.require;
              if (permissionsExpiration.notify.default)
                  notValue = permissionsExpiration.notify.default;
          }
          // override if current value exist
          this.set(`${notifyPath  }defaultCheck`, currentExpiration ? notify : defCheck);
          this.set(`${notifyPath  }defaultValue`, currentExpiration ? notify : notValue);

          if (permissionsExpiration.notify.require) {
              this.set(`${notifyPath  }optional`, false);
          }

          if (!notify) {
              this.set(`${notifyPath  }disabled`, true);
          } else if (notify) {
              this.set(`${notifyPath  }defaultValue`, notify);
          }

          // set max
          // this.set(notifyPath + 'max', this.set(expirationPath + 'value'));
          this._expirationDateChanged();
      }
  },
    /* eslint-enable no-param-reassign */
  _toOptionsFormat(arr) {
      if (!arr)
          return [];
      return arr.map((x) => {
          return {"val": x, "title": x.toUpperCase()}
      })
  },

  _initialiseValues(_machine) {
      if (!this.machine) return;
      const date = (this.machine && this.machine.expiration) ? this.machine.expiration.date : '';
          const fromNow = this._dateToDurationFromNow(date);
      const notify = (this.machine && this.machine.expiration) ? this.machine.expiration.notify : 0;

      this.set('fields.0.subfields.0.value',  this.machine.expiration ? this.machine.expiration.action : this.fields[0].subfields[0].defaultValue);
      this.notifyPath('fields.0.subfields.0.value');
      
      if (date && fromNow) {
          this.set('fields.0.subfields.1.defaultValue', fromNow);
          this.notifyPath('fields.0.subfields.1.defaultValue');
      }
      this.set('fields.0.subfields.2.defaultCheck', !!notify);
      if (notify) {
          this.set('fields.0.subfields.2.defaultValue', notify);
          this.notifyPath('fields.0.subfields.2.defaultValue');
      }
  },

  _expirationDateChanged(_date) {
      // update notify max
      const notifyPath = 'fields.0.subfields.2.';
          const expirationPath = 'fields.0.subfields.1.';
      this.set(`${notifyPath  }max`, this.get(`${expirationPath  }value`));
      console.log("_expirationDateChanged", this.get(`${expirationPath  }value`));
      this.notifyPath(`${notifyPath  }max`);
  },

  _dateToDurationFromNow(date) {
      if (moment(date).isValid()){
          let span; let unit;
          const fromNow = moment.utc(date).fromNow(true);
          const chunks = fromNow.split(' ');
          [span] = chunks;
          [, unit] = chunks;
          if (['a','an'].indexOf(span)>-1) {
              span = '1';
          }
          if (['month','months'].indexOf(unit)>-1) {
              unit = 'mo';
          } else {
              [unit] = unit;
          }
          return span+unit;
      }
      return  false;
  },

  _secondsToDuration(seconds) {
      if (seconds) {
          let span; let unit;
          if (seconds % (3600*24*28) === 0 || seconds % (3600*24*29) === 0 || seconds % (3600*24*30) === 0 || seconds % (3600*24*31) === 0) {
              if (seconds % (3600*24*28) === 0) span = seconds / (3600*24*28);
              if (seconds % (3600*24*29) === 0) span = seconds / (3600*24*29);
              if (seconds % (3600*24*30) === 0) span = seconds / (3600*24*30);
              if (seconds % (3600*24*31) === 0) span = seconds / (3600*24*31);
              unit = 'mo';
          } else if (seconds % (3600*24*7) === 0) {
              span = seconds / (3600*24*7);
              unit = 'w';
          } else if (seconds % (3600*24) === 0) {
              span = seconds / (3600*24);
              unit = 'd';
          } else if (seconds % 3600 === 0) {
              span = seconds / 3600;
              unit = 'h';
          } else if (seconds % 60 === 0) {
              span = seconds / 60;
              unit = 'm';
          } else { 
              if (seconds > 3600*24*28) {
                  span =  Math.floor(seconds / 3600*24*28);
                  unit = 'mo';
              } else if (seconds > 3600*24*7) {
                  span =  Math.floor(seconds / 3600*24*7);
                  unit = 'w';
              } else if (seconds > 3600*24) {
                  span =  Math.floor(seconds / 3600*24);
                  unit = 'd';
              } else if (seconds > 3600) {
                  span = Math.floor(seconds / 3600);
                  unit = 'h';
              } else if (seconds > 60) {
                  span =  Math.floor(seconds / 60);
                  unit = 'm';
              } else {
                  span = seconds;
                  unit = 's';
              }
              return span+unit;
          }
      }
      return false;
  }
});
