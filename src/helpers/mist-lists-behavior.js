import '../../node_modules/@polymer/polymer/polymer-legacy.js';
/**
 * Behavior that empties the list selection.
 *
 * @polymerBehavior
 */
export const mistListsBehavior = {
  properties: {},
  listeners: {
    'action-finished': 'clearListSelection',
  },
  clearListSelection() {
    this.set('selectedItems', []);
  },
};
