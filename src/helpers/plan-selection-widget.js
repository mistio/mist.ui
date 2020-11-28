import '../../node_modules/@polymer/polymer/polymer-legacy.js';
import '../../node_modules/@polymer/paper-styles/typography.js';
import '../../node_modules/@polymer/paper-icon-button/paper-icon-button.js';
import '../../node_modules/@polymer/iron-icons/iron-icons.js';
import '../../node_modules/@polymer/iron-flex-layout/iron-flex-layout-classes.js';
import { Polymer } from '../../node_modules/@polymer/polymer/lib/legacy/polymer-fn.js';
import { html } from '../../node_modules/@polymer/polymer/lib/utils/html-tag.js';

Polymer({
  _template: html`
        <style include="shared-styles">
        :host {
            max-width: 400px;
            overflow: hidden;
        }
        .plan-item {
            background-color: #eee;
            margin: 4px 0;
            padding: 4px 8px;
            text-transform: uppercase;
            text-align: center;
            cursor: pointer;
            border-radius: 3px;
            position: relative;
            z-index: 1;
        }
        .plans-list .plan-item {
            margin: 4px;
        }
        .plan-item.selected {
            background-color: green;
            color: #fff;
        }
        .check {
            opacity: 0;
        }
        .plan-item.selected  .check {
            opacity: 1;
        }
        .plan-item paper-icon-button ::slotted(iron-icon) {
            transform: rotate(0);
            transition: transform 200ms ease-in;
        }
        .plan-item paper-icon-button.open ::slotted(iron-icon) {
            transform: rotate(-180deg);
        }
        .plan-item.selected paper-icon-button ::slotted(iron-icon),
        .plan-item.selected iron-icon {
            color: #fff !important;
        }
        .plan-title {
            padding: 8px;
        }
        .plan-title > sub {
            text-transform: none;
            border-bottom: 1px solid;
            padding-bottom: 5px;
            width: 100%;
            display: block;
        }
        .details {
            padding: 0;
            text-transform: none;
            font-size: 0.9em;
            transform: translate(0, -10px);
            transition: opacity 100ms ease-in, height 100ms ease-in, transform 200ms ease-in;
            opacity: 0;
            height: 0;
            z-index: -1;
        }
        .details.open {
            padding-bottom: 4px;
            opacity: 1;
            height: 100px;
            transform: translate(0, 0);
            transition: opacity 100ms ease-in, height 200ms ease-in, transform 200ms ease-in;
            overflow-y: scroll;
        }
        #paygDetails {
            position: relative;
            z-index: 0;
        }
        .view {
            height: auto;
            width: auto;
            overflow: hidden;
            transform: translate(0, 0);
            transition: all 200ms ease-out;
        }
        .view.slideleft {
            height: 0;
            width: 0;
            transform: translate(-100%, 0);
            transition: all 100ms ease-out;
        }
        .view.slideright {
            height: 0;
            width: 0;
            transform: translate(100%, 0);
            transition: all 100ms ease-out;
        }
        </style>

        <div id="widget" class="layout horizontal">

            <div id="viewMethod" class="view">
                Subscription type
                <div class\$="plan-item [[_computeIsSelected('payg',selected)]]" on-tap="_selectPayg">
                    <span class="check"><iron-icon icon="icons:check"></iron-icon></span>
                    Pay as you go 
                    <paper-icon-button id="paygIcon" icon="icons:expand-more" on-tap="_expand"></paper-icon-button>
                    <div id="paygDetails" class="details">
                        Free for up to 10 cpu cores, 100 datapoints/sec, 1000 rule checks/day, 10k API requests/day, 1 month retention
                        <br>
                        <strong>Over limits:</strong>
                        <br>
                        + \$2 per cpu core/mo, 
                        + \$5 per 1k datapoints/sec, 
                        + \$5 per 100k rule checks/day, 
                        + \$5 per 1M API requests/day
                    </div>
                </div>
                <div class\$="plan-item [[prepaidIsSelected]]" on-tap="_togglePrepaid"> 
                    <span class="check"><iron-icon icon="icons:check"></iron-icon></span> Prepaid 
                    <span hidden\$="[[!prepaidIsSelected]]">[[selected]] [[_computePrice(selected)]]</span>
                    <paper-icon-button icon="icons:chevron-right"></paper-icon-button>
                </div>
            </div>

            <div id="viewPrepaid" class="view slideright">
                <paper-icon-button icon="icons:arrow-back" on-tap="_togglePrepaid"></paper-icon-button>
                Prepaid Plans:
                <div class="plans-list layout horizontal">
                    <div class\$="plan-item [[_computeIsSelected('Small',selected)]]" on-tap="_selectSmall"> 
                        <div class="plan-title"><strong>Small</strong><br><sub>\$200/mo</sub></div>
                        <div class="details open">
                            200 cpu cores<br> 2k datapts/sec<br> 100k rule checks/day<br> 3 month retention
                        </div>
                    </div> 
                    <div class\$="plan-item [[_computeIsSelected('Medium',selected)]]" on-tap="_selectMedium"> 
                        <div class="plan-title"><strong>Medium</strong><br><sub>\$700/mo</sub></div>
                        <div class="details open">
                            1k cpu cores<br> 10k datapts/sec<br> 1M rule checks/day<br> 1 year retention
                        </div>
                    </div> 
                    <div class\$="plan-item [[_computeIsSelected('Large',selected)]]" on-tap="_selectLarge"> 
                        <div class="plan-title"><strong>Large</strong><br><sub>\$3,000/mo</sub></div>
                        <div class="details open">
                            10k cpu cores<br> 100k datapts/sec<br> 10M rule checks/day<br> 3 year retention
                        </div>
                    </div>
                </div>
            </div>

        </div>
`,

  is: 'plan-selection-widget',

  properties: {
      selected: {
          type: String,
          notify: true
      },
      prepaidIsSelected: {
          type: Boolean,
          computed: '_computePrepaidIsSelected(selected)'
      },
      plans: {
          type: Array
      }
  },

  _expand(e){
      e.stopImmediatePropagation();
      this.$.paygDetails.classList.toggle('open');
      this.$.paygIcon.classList.toggle('open');
  },

  _togglePrepaid(_e){
      this.$.viewMethod.classList.toggle('slideleft');
      this.$.viewPrepaid.classList.toggle('slideright');

      this.dispatchEvent(new CustomEvent('refit'));
  },

  _selectPayg(_e){
      this.set('selected', 'payg');
  },

  _computePrepaidIsSelected(selected){
      return ['Small','Medium','Large'].indexOf(selected) > -1 ? 'selected' : '';
  },

  _selectSmall(_e){
      this.set('selected', 'Small');
  },

  _selectMedium(_e){
      this.set('selected', 'Medium');
  },

  _selectLarge(_e){
      this.set('selected', 'Large');
  },

  _computeIsSelected(name, selected){
      return name === selected ? 'selected' : '';
  },

  _computePrice(selected) {
      switch (selected){
          case "Small":
              return '$200/mo';
          case "Medium":
              return '$700/mo';
          case "Large":
              return '$3,000/mo';
          default:
              return '$200/mo';
      }
  }
});
