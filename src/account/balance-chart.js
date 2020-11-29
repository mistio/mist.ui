import '../../node_modules/@polymer/polymer/polymer-legacy.js';
import '../../node_modules/@polymer/paper-styles/typography.js';
import '../../node_modules/@polymer/paper-spinner/paper-spinner.js';
import * as echarts from  'echarts/echarts.all.js';
import moment from 'moment/src/moment.js';
import { IronResizableBehavior } from '../../node_modules/@polymer/iron-resizable-behavior/iron-resizable-behavior.js';
import { formatMoney } from '../helpers/utils.js'
import '../../node_modules/@polymer/iron-ajax/iron-ajax.js';

import { Polymer } from '../../node_modules/@polymer/polymer/lib/legacy/polymer-fn.js';
import { html } from '../../node_modules/@polymer/polymer/lib/utils/html-tag.js';

const BALANCE_GRAPH_OPTIONS = {
    tooltip: {
        trigger: 'axis',
        extraCssText: 'text-align: left',
        formatter (params, _ticket, _callback) {
            const title = `${(params[0].data[1] ? (`<strong>$${ formatMoney(params[0].data[1],2,'.',',')  } on ` ) : ' ') + moment(params[0].data[0]).format('DD MMM') }</strong><br />`;
                const vcpus = params[0].data[2] ? `${ formatMoney(params[0].data[2],0,'.',',')  } vcpus<br />` : '';
                const datapoints = params[0].data[3] ? `${ formatMoney(params[0].data[3],0,'.',',')  } datapoints<br />` : '';
                const checks = params[0].data[4] ? `${ formatMoney(params[0].data[4],0,'.',',')  } rule checks<br />` : '';
                // requests = params[0].data[5] + ' requests';
            return title + vcpus + datapoints + checks; // + requests;
        }
    },
    grid: {
        left: '0',
        right: '4%',
        bottom: '3%',
        containLabel: true
    },
    toolbox: {
        show: true,
        feature: {
            saveAsImage: {
                title: 'save as image',
                name: 'month-balance',
                backgroundColor: '#ffffff'
            }
        },
    },
    legend: {
        show: true,
    },
    xAxis: {
        type: 'time',
        splitLine: {
            show: false
        },
        data: []
    },
    yAxis: {
        type: 'value',
        axisLabel: {
            formatter: 'value'
        }
    },
    series: [
        {
            name:'cost',
            type:'line',
            data:[],
        }
    ]
};

Polymer({
  _template: html`
        <style include="shared-styles">
        :host {
            display: block;
        }

        :host paper-material {
            display: block;
            padding: 0;
        }
        .balance {
            font-size: 2em;
        }
        .balance sub,
        .balance sup {
            font-size: .6em;
            font-weight: 300;
        }
        .balance sub {
            vertical-align: baseline;
        }
        .navigator {
            display: flex;
        }
        .navigator paper-button {
            font-size: .9em;
            background-color: #eee !important;
            margin: 8px !important;
        }
        .navigator paper-button.active{
            color: var(--accent-color) !important;
        }
        #balanceGraph {
            height: 300px;
            margin-top: -48px;
            margin-left: 0px;
            text-align: center;
        }
        #balanceGraph > paper-spinner {
            margin-top: 48px;
            margin-left: -24px;
        }
        span.burn, span.due {
            font-size: 16px;
            display: block;
            text-align: left;
        }
        </style>
        <span class="due" hidden\$="[[!amountDue]]">Upcoming invoice for <strong>\$[[_formatMoney(amountDue)]]</strong> will be billed at [[periodEnd]]</span>
        <div hidden\$="[[!usageLoaded]]">
            <h2>Pay As You Go Usage</h2>
            <span class="burn" hidden\$="[[!currentPaygRate]]"><strong>Current PAYG rate:</strong> ~ \$[[_formatMoney(currentPaygRate)]]</span>
            <span class="burn" hidden\$="[[!_isWithinPlan(currentPaygRate)]]">Your current usage is within the limits of your plan.</span>
        </div>
        <div id="balanceGraph" style\$="height:300px; width:[[balanceGraphWidth]]px;">
            <paper-spinner active="[[loading]]"></paper-spinner>
        </div>

        <iron-ajax id="getBalance" auto="" url="/api/v1/billing" method="GET" loading="{{loading}}" on-response="_handleResponse" on-error="_handleError"></iron-ajax>
`,

  is: 'balance-chart',

  behaviors: [
      IronResizableBehavior
  ],

  properties: {
      balanceGraph: {
          type: Object
      },
      balanceGraphOptions: {
          type: Object,
          value() {
              return BALANCE_GRAPH_OPTIONS;
          }
      },
      balanceData: {
          type: Object
      },
      data: {
          type: Array,
          computed: '_computeData(balanceData)'
      },
      balanceGraphWidth: {
          type: Number,
          value: 300
      },
      loading: {
          type: Boolean,
          value: true
      },
      currentPaygRate: {
          type: Number,
          value: 0
      },
      amountDue: {
          type: Number,
          value: 0
      },
      usageLoaded: {
          type: Boolean,
          value: false
      },
      plan: {
          type: Boolean,
          value: false
      }
  },

  listeners: {
      'iron-resize': 'updateChartWidth'
  },

  attached(){
  },

  initCharts() {
      const colorPalette = ['#607D8B', '#d96557', '#3F51B5', '#009688', '#795548', '#8c76d1', '#795548', '#0277BD', '#0099cc', '#424242', '#D48900', '#43A047', '#2F2F3E'];
      echarts.registerTheme('balance', {
          color: colorPalette,
          backgroundColor: 'transparent',
          graph: {
              color: colorPalette
          }
      });
      this.balanceGraph = echarts.init(this.$.balanceGraph, 'balance');
      this.balanceGraph.setOption(this.balanceGraphOptions);
      this.updateChartWidth();
      console.log('initialized charts');
  },

  updateChartWidth() {
      const parentWidth = this.parentNode.offsetWidth;
      if (parentWidth) {
          console.log('updateChartWidth',parentWidth);
          this.set('balanceGraphWidth', parentWidth);
          this.resizeGraph();
      }
  },

  resizeGraph() {
      console.log('resizeGraph');
      if (this.balanceGraph) {
          this.balanceGraph.resize();
      }
  },

  _handleError (e) {
      console.error('Cannot get billing data',e);
  },

  _handleResponse(e) {
      this.set('amountDue', e.detail.response.amount_due);
      if (e.detail.response.period_start && e.detail.response.period_end) {
          const start = new Date(e.detail.response.period_start*1000);
              const end = new Date(e.detail.response.period_end*1000);
          this.set('periodStart', start.toISOString().slice(-19, -14));
          this.set('periodEnd', end.toISOString().slice(-19, -14));
      }

      this.set('currentPaygRate', e.detail.response.current_payg_rate);

      if (!e.detail.response.series.length) {
          this.$.balanceGraph.setAttribute('hidden', true);
          return;
      }

      this.initCharts();
      this.set(
          'balanceGraphOptions.series.0.data',
          e.detail.response.series.map(
              (d) => {
                  return [d.date, d.cost, d.usage.cores, d.usage.datapoints, d.usage.checks]
              }
          )
      );
      this.balanceGraph.setOption(this.balanceGraphOptions);
      this.set('usageLoaded', true);
  },

  _formatMoney(i) {
      if (i)
          return formatMoney(i, 2, '.', ',');
      return i;
  },

  _isWithinPlan(paygRate) {
      if (paygRate === 0 && this.plan !== undefined)
          return true;
      return false;
  }
});
