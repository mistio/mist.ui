import '@polymer/polymer/polymer-legacy.js';
/**
 * Behavior that validates a rule.
 *
 * @polymerBehavior
 */
export const validateRuleBehavior = {
  _validateRule(rule, actions, queries) {
    this.debounce(
      '_validateRule',
      () => {
        this._actuallyValidateRule(rule, actions, queries);
      },
      100
    );
  },
  _actuallyValidateRule(_rule, _actions, _queries) {
    let valid = true;
    let validActions;
    let validQueries;
    if (!this.rule || !this.rule.actions || !this.rule.queries) {
      valid = false;
    } else {
      Object.keys(this.rule || {}).every(p => {
        // console.log('this.rule[p]', p, this.rule[p])
        // don't break on resource_type or selectors,
        if (
          ['resource_type', 'selectors'].indexOf(p) === -1 &&
          this.rule[p] === undefined
        ) {
          valid = false;
          return false;
        }
        return true;
      });
      for (let i = 0; i < this.rule.actions.length; i++) {
        validActions = this._validateAction(this.rule.actions[i]);
        if (!validActions) {
          break;
        }
      }
      for (let j = 0; j < this.rule.queries.length; j++) {
        validQueries = this._validateQuery(this.rule.queries[j]);
        if (!validQueries) {
          break;
        }
      }
    }
    this.set('isValidRule', valid && validActions && validQueries);
    console.log('isValidRule', valid, validActions, validQueries);
  },
  _validateAction(action) {
    let valid = false;
    if (action.type === 'reboot' || action.type === 'destroy') {
      valid = true;
    } else if (action.type === 'alert') {
      if (
        (action.emails && action.emails.length && !action.emailsInvalid) ||
        (action.teams && action.teams.length) ||
        (action.users && action.users.length)
      ) {
        valid = true;
      }
    } else if (action.type === 'run') {
      if (action.command && action.command.length) {
        valid = true;
      }
    } else if (action.type === 'no_data') {
      valid = true;
    } else if (action.type === 'webhook') {
      if (action.url && action.method) {
        valid = true;
      }
    }
    return valid;
  },
  _validateQuery(query) {
    let valid = false;
    if (query.target && query.operator && query.threshold !== undefined)
      valid = true;
    return valid;
  },
  _validateSelectors(selector) {
    let valid = false;
    if (selector.type && selector.ids && selector.ids.length) valid = true;
    return valid;
  },
};
