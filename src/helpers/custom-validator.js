import '../../node_modules/@polymer/polymer/polymer-legacy.js';
import { IronValidatorBehavior } from '../../node_modules/@polymer/iron-validator-behavior/iron-validator-behavior.js';
import { Polymer } from '../../node_modules/@polymer/polymer/lib/legacy/polymer-fn.js';

Polymer({
  is: 'custom-validator',

  behaviors: [IronValidatorBehavior],
});
