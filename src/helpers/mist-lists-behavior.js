import '../../../../@polymer/polymer/polymer-legacy.js';
/**
 * Behavior that empties the list selection.
 *
 * @polymerBehavior
 */
mistListsBehavior = {
    properties: {},
    listeners: {
        'action-finished': 'clearListSelection'
    },
    clearListSelection: function(){
        this.set('selectedItems', []);
    },
};
