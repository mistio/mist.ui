import '../../../../@polymer/polymer/polymer-legacy.js';
import '../../../../@polymer/paper-styles/typography.js';
import '../../../../@polymer/paper-spinner/paper-spinner.js';
import { IronResizableBehavior } from '../../../../@polymer/iron-resizable-behavior/iron-resizable-behavior.js';
import { Polymer } from '../../../../@polymer/polymer/lib/legacy/polymer-fn.js';
import { html } from '../../../../@polymer/polymer/lib/utils/html-tag.js';
import '../../../../echarts/dist/echarts.common.min.js';
GRAPH_OPTIONS = {
    title: {
        text: 'Cores'
    },
    tooltip: {
        trigger: 'axis',
        extraCssText: 'text-align: left'
    },
    grid: {
        left: '3%',
        right: '4%',
        bottom: '3%',
        containLabel: true
    },
    toolbox: {
        show: true,
        feature: {
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
        type: 'value'
    },
    series: [{
        name: 'cores',
        type: 'line',
        data: [],
    }]
};

GRAPH_OPTIONS_2 = {
    title: {
        text: 'Datapoints'
    },
    tooltip: {
        trigger: 'axis',
        extraCssText: 'text-align: left'
    },
    grid: {
        left: '3%',
        right: '4%',
        bottom: '3%',
        containLabel: true
    },
    toolbox: {
        show: true,
        feature: {
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
        type: 'value'
    },
    series: [{
        name: 'datapoints',
        type: 'line',
        data: [],
    }]
};

GRAPH_OPTIONS_3 = {
    title: {
        text: 'Checks'
    },
    tooltip: {
        trigger: 'axis',
        extraCssText: 'text-align: left'
    },
    grid: {
        left: '3%',
        right: '4%',
        bottom: '3%',
        containLabel: true
    },
    toolbox: {
        show: true,
        feature: {
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
        type: 'value'
    },
    series: [{
        name: 'checks',
        type: 'line',
        data: [],
    }]
};

Polymer({
  _template: html`
        <style include="shared-styles">
         :host {
        }

         :host paper-material {
            display: block;
            padding: 0;
        }

        .grid-row {
            padding: 24px;
        }

        .head {
            margin-bottom: 16px;
        }

        h2.title {
            font-weight: 500;
        }

        #coresGraph,
        #datapointsGraph,
        #checksGraph {
            height: 300px;
            margin-top: 40px;
        }

        .padding {
            padding: 24px;
        }
        </style>
        <paper-material>
            <div class="padding">
                <div id="coresGraph" style\$="height:300px; width:[[graphWidth]]px;">
                    <paper-spinner active="[[loading]]"></paper-spinner>
                </div>
                <div id="datapointsGraph" style\$="height:300px; width:[[graphWidth]]px;">
                    <paper-spinner active="[[loading]]"></paper-spinner>
                </div>
                <div id="checksGraph" style\$="height:300px; width:[[graphWidth]]px;">
                    <paper-spinner active="[[loading]]"></paper-spinner>
                </div>
            </div>
        </paper-material>
        <iron-ajax id="getMetering" auto="" url="/api/v1/metering" method="GET" loading="{{loading}}" on-response="_handleResponse" on-error="_handleError"></iron-ajax>
`,

  is: 'metering-graphs',

  behaviors: [
      IronResizableBehavior
  ],

  properties: {
      isOverUsing: {
          type: Boolean
      },
      user: {
          type: Object
      },
      org: {
          type: Object
      },
      plans: {
          type: Array,
          computed: 'computePlans(user, org)'
      },
      responseData: {
          type: Object
      },
      coresGraph: {
          type: Object
      },
      coresGraphOptions: {
          type: Object,
          value: function() {
              return GRAPH_OPTIONS;
          }
      },
      coresDataArray: {
          type: Array,
          computed: '_computeData(responseData, "cores")'
      },

      datapointsGraph: {
          type: Object
      },
      datapointsGraphOptions: {
          type: Object,
          value: function() {
              return GRAPH_OPTIONS_2;
          }
      },
      datapointsDataArray: {
          type: Array,
          computed: '_computeData(responseData, "datapoints")'
      },
      checksGraph: {
          type: Object
      },
      checksGraphOptions: {
          type: Object,
          value: function() {
              return GRAPH_OPTIONS_3;
          }
      },
      checksDataArray: {
          type: Array,
          computed: '_computeData(responseData, "checks")'
      },
      graphWidth: {
          type: Number,
          value: 300
      },
      loading: {
          type: Boolean,
          value: true
      }
  },

  listeners: {
      'iron-resize': 'updateChartWidth'
  },

  attached: function() {},

  initCharts: function() {
      var colorPalette = ['#607D8B', '#d96557', '#3F51B5', '#009688', '#795548', '#8c76d1', '#795548', '#0277BD', '#0099cc', '#424242', '#D48900', '#43A047', '#2F2F3E'];
      echarts.registerTheme('balance', {
          color: colorPalette,
          backgroundColor: 'transparent',
          graph: {
              color: colorPalette
          }
      });
      this.coresGraph = echarts.init(this.$.coresGraph, 'cores');
      this.coresGraph.setOption(this.coresGraphOptions);

      this.datapointsGraph = echarts.init(this.$.datapointsGraph, 'datapoints');
      this.datapointsGraph.setOption(this.datapointsGraphOptions);

      this.checksGraph = echarts.init(this.$.checksGraph, 'checks');
      this.checksGraph.setOption(this.checksGraphOptions);

      this.updateChartWidth();
      console.log('initialized charts');
  },

  updateChartWidth: function() {
      var parentWidth = this.parentNode.offsetWidth;
      // console.log('updateChartWidth', parentWidth);
      if (parentWidth) {
          this.set('graphWidth', parentWidth - 50);
          this.resizeGraph();
      }
  },

  resizeGraph: function() {
      console.log('resizeGraph');
      if (this.coresGraph)
          this.coresGraph.resize();
      if (this.datapointsGraph)
          this.datapointsGraph.resize();
      if (this.checksGraph)
          this.checksGraph.resize();
  },

  _handleResponse: function(e) {
      this.initCharts();
      this.set('responseData', {
          data: e.detail.response
      });
  },

  _handleError: function(e) {
      console.error('Can not get metering data. ',e)
  },

  _computeData: function(responseData, graph) {
      var timeToCores = this.responseData.data.map(function(d) {
          return [d.date, d.usage.cores]
      });
      var timeToDatapoints = this.responseData.data.map(function(d) {
          return [d.date, d.usage.datapoints]
      });
      var timeToChecks = this.responseData.data.map(function(d) {
          return [d.date, d.usage.checks]
      });

      this.set('coresGraphOptions.series.0.data', timeToCores);
      this.coresGraph.setOption(this.coresGraphOptions);

      this.set('datapointsGraphOptions.series.0.data', timeToDatapoints);
      this.datapointsGraph.setOption(this.datapointsGraphOptions);

      this.set('checksGraphOptions.series.0.data', timeToChecks);
      this.checksGraph.setOption(this.checksGraphOptions);

      if (graph == 'cores')
          return timeToCores;
      else if (graph == 'datapoints')
          return timeToDatapoints;
      else if (graph == 'checks')
          return timeToChecks;
  }
});
