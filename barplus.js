/*!
 * chartjs-bar-plus
 * Version: 0.0.0
 * Released under the MIT license
 */
(function(){function r(e,n,t){function o(i,f){if(!n[i]){if(!e[i]){var c="function"==typeof require&&require;if(!f&&c)return c(i,!0);if(u)return u(i,!0);var a=new Error("Cannot find module '"+i+"'");throw a.code="MODULE_NOT_FOUND",a}var p=n[i]={exports:{}};e[i][0].call(p.exports,function(r){var n=e[i][1][r];return o(n||r)},p,p.exports,r,e,n,t)}return n[i].exports}for(var u="function"==typeof require&&require,i=0;i<t.length;i++)o(t[i]);return o}return r})()({1:[function(require,module,exports){

},{}],2:[function(require,module,exports){
"use strict";

module.exports = function(Chart) {
  var helpers = Chart.helpers;

  Chart.defaults.barplusErrorBar = {
    _errorDir: "both",
    _errorWidth: 2,
    _errorColor: "rgba(255, 20, 20, 0.3)",
    _errorShow: true,
    _errorAnimate: true,
    _errorInsignificantColor: "rgba(200, 200, 200, 0.8)"
  };

  Chart.defaults.barplusThickness = {
    _minBarThickness: 5,
    _maxBarThickness: 50
  };

  Chart.defaults.ticks = {
    suggestedMin: 0,
    suggestedMax: 0
  };

  Chart.controllers.barplus = {
    intialiseErrorBarConfig: function(setting, defaultConfig, chart) {
      var config = defaultConfig;
      if (setting) {
        config = {
          _errorDir: setting.direction || defaultConfig._errorDir,
          _errorWidth: setting.width || defaultConfig._errorWidth,
          _errorColor: setting.color || defaultConfig._errorColor,
          _errorShow: setting.show && defaultConfig._errorShow,
          _errorAnimate: setting.animate && defaultConfig._errorAnimate,
          _errorInsignificantColor:
            setting.insignificantColor || defaultConfig._errorInsignificantColor
        };
      }
      helpers.extend(chart.barplus, config);
    },
    initialiseBarThickness: function(setting, defaultConfig, chart) {
      var config = defaultConfig;
      if (setting) {
        config = {
          _minBarThickness: setting.min || defaultConfig.minBarThickness,
          _maxBarThickness: setting.max || defaultConfig.maxBarThickness
        };
      }
      helpers.extend(chart.barplus, config);
    },
    initaliseErrorBar: function(options, chart) {
      chart.barplus = {};
      this.intialiseErrorBarConfig(
        options.errorBars,
        Chart.defaults.barplusErrorBar,
        chart
      );
      this.initialiseBarThickness(
        options.barThickness,
        Chart.defaults.barplusThickness,
        chart
      );
    },
    getThickness: function(data, chart) {
      var thickness = data.thickness;
      if (data.thickness < chart.barplus._minBarThickness)
        thickness = chart.barplus._minBarThickness;
      if (data.thickness > chart.barplus._maxBarThickness)
        thickness = chart.barplus._maxBarThickness;
      return thickness;
    },

    initialiseScale: function(options, min, max) {
      if (min < options.suggestedMin) options.suggestedMin = min;
      if (max > options.suggestedMax) options.suggestedMax = max;
    },

    initInsignificantColor: function(dataset, insignificantColor) {
      var backgroundColor = [];
      helpers.each(
        dataset.data,
        function(rectangle, index) {
          if (Array.isArray(dataset.backgroundColor)) {
            backgroundColor.push(
              rectangle.insignificant
                ? insignificantColor
                : dataset.backgroundColor[index]
            );
          } else {
            backgroundColor.push(
              rectangle.insignificant
                ? insignificantColor
                : dataset.backgroundColor
            );
          }
        },
        this
      );
      dataset.backgroundColor = backgroundColor;
    }
  };
};

},{}],3:[function(require,module,exports){
"use strict";

module.exports = function(Chart) {
  var helpers = Chart.helpers;

  Chart.defaults.errorBar = helpers.extend(
    Chart.defaults.bar,
    Chart.defaults.barplus
  );

  Chart.controllers.errorBar = Chart.controllers.bar.extend({
    initialize: function(chart, datasetIndex) {
      Chart.controllers.bar.prototype.initialize.apply(this, arguments);
      var arg = arguments;
      var tickOptions = helpers.extend(
        arg[0].chart.options.scales.yAxes[0].ticks,
        Chart.defaults.ticks
      );
      var dataset = arguments[0].chart.controller.config.data.datasets[0];
      Chart.controllers.barplus.initaliseErrorBar(
        arg[0].chart.options,
        this.chart
      );
      Chart.controllers.barplus.initInsignificantColor(
        dataset,
        this.chart.barplus._errorInsignificantColor
      );
      this.initScale(dataset, tickOptions);
    },

    update: function(reset) {
      Chart.controllers.bar.prototype.update.call(this, reset);
      this.changeBarThickness(this.getMeta());
    },

    initScale: function(dataset, tickOptions) {
      helpers.each(
        dataset.data,
        function(rectangle, index) {
          Chart.controllers.barplus.initialiseScale(
            tickOptions,
            rectangle.y - rectangle.error,
            rectangle.y + rectangle.error
          );
        },
        this
      );
    },

    draw: function(ease) {
      Chart.controllers.bar.prototype.draw.call(this, ease);
      var ctx = this.chart.chart.ctx,
        meta = this.getMeta();
      var yaxis = this.chart.scales[meta.yAxisID];
      if (this.chart.barplus._errorShow) this.createElement(ctx, yaxis, meta);
      this.changeBarThickness(meta);
    },

    changeBarThickness: function(meta) {
      var dataset = this.getDataset().data;
      helpers.each(
        dataset,
        function(rectangle, index) {
          meta.data[index]._view.width = meta.data[
            index
          ]._model.width = Chart.controllers.barplus.getThickness(
            rectangle,
            this.chart
          );
        },
        this
      );
    },

    createElement: function(ctx, yaxis, meta) {
      helpers.each(
        this.getDataset().data,
        function(rectangle, index) {
          var vm = meta.data[index]._view;
          ctx.beginPath();
          ctx.lineWidth = this.chart.barplus._errorWidth;
          ctx.strokeStyle = this.chart.barplus._errorColor;
          ctx.moveTo(
            vm.x,
            this.calculateErrorBarBottom(this.getDataset(), index, yaxis)
          );
          ctx.lineTo(
            vm.x,
            this.calculateErrorBarTop(this.getDataset(), index, yaxis)
          );
          ctx.stroke();
        },
        this
      );
    },

    calculateErrorBarBottom: function(dataset, index, yaxis) {
      var value =
        dataset.data[index].y - dataset.data[index].error < yaxis.min
          ? yaxis.min
          : dataset.data[index].y - dataset.data[index].error;
      var ycordinate = yaxis.getPixelForValue(value);
      return ycordinate;
    },

    calculateErrorBarTop: function(dataset, index, yaxis) {
      var value =
        dataset.data[index].y + dataset.data[index].error > yaxis.max
          ? yaxis.max
          : dataset.data[index].y + dataset.data[index].error;
      var ycordinate = yaxis.getPixelForValue(value);
      return ycordinate;
    }
  });
};

},{}],4:[function(require,module,exports){
"use strict";

module.exports = function(Chart) {
  var helpers = Chart.helpers;

  Chart.defaults.horizontalErrorBar = helpers.extend(
    Chart.defaults.horizontalBar,
    Chart.defaults.barplus
  );

  Chart.controllers.horizontalErrorBar = Chart.controllers.horizontalBar.extend(
    {
      initialize: function(chart, datasetIndex) {
        Chart.controllers.bar.prototype.initialize.apply(this, arguments);
        var arg = arguments;
        var tickOptions = helpers.extend(
          arg[0].chart.options.scales.xAxes[0].ticks,
          Chart.defaults.ticks
        );
        var dataset = arguments[0].chart.controller.config.data.datasets[0];
        Chart.controllers.barplus.initaliseErrorBar(
          arg[0].chart.options,
          this.chart
        );
        Chart.controllers.barplus.initInsignificantColor(
          dataset,
          this.chart.barplus._errorInsignificantColor
        );
        this.initScale(dataset, tickOptions);
      },

      update: function(reset) {
        Chart.controllers.bar.prototype.update.call(this, reset);
        this.changeBarHeight(this.getMeta());
      },

      initScale: function(dataset, tickOptions) {
        helpers.each(
          dataset.data,
          function(rectangle, index) {
            Chart.controllers.barplus.initialiseScale(
              tickOptions,
              rectangle.x - rectangle.error,
              rectangle.x + rectangle.error
            );
          },
          this
        );
      },

      draw: function(ease) {
        Chart.controllers.bar.prototype.draw.call(this, ease);
        var ctx = this.chart.chart.ctx,
          meta = this.getMeta();
        var xaxis = this.chart.scales[meta.xAxisID];
        if (this.chart.barplus._errorShow) this.createElement(ctx, xaxis, meta);
        this.changeBarHeight(meta);
      },

      changeBarHeight: function(meta) {
        var dataset = this.getDataset().data;
        helpers.each(
          dataset,
          function(rectangle, index) {
            meta.data[index]._view.height = meta.data[
              index
            ]._model.height = Chart.controllers.barplus.getThickness(
              rectangle,
              this.chart
            );
          },
          this
        );
      },

      createElement: function(ctx, xaxis, meta) {
        helpers.each(
          this.getDataset().data,
          function(rectangle, index) {
            var vm = meta.data[index]._view;
            ctx.beginPath();
            ctx.lineWidth = this.chart.barplus._errorWidth;
            ctx.strokeStyle = this.chart.barplus._errorColor;
            ctx.moveTo(
              this.calculateErrorBarLeft(this.getDataset(), index, xaxis),
              vm.y
            );
            ctx.lineTo(
              this.calculateErrorBarRight(this.getDataset(), index, xaxis),
              vm.y
            );
            ctx.stroke();
          },
          this
        );
      },
      calculateErrorBarRight: function(dataset, index, xaxis) {
        var value = dataset.data[index].x + dataset.data[index].error,
          xcordinate = xaxis.getPixelForValue(value);
        return xcordinate;
      },
      calculateErrorBarLeft: function(dataset, index, xaxis) {
        var value =
            dataset.data[index].x - dataset.data[index].error < xaxis.min
              ? xaxis.min
              : dataset.data[index].x - dataset.data[index].error,
          xcordinate = xaxis.getPixelForValue(value);
        return xcordinate;
      }
    }
  );
};

},{}],5:[function(require,module,exports){
"use strict";

var Chart = require("chart.js");
Chart = typeof Chart === "function" ? Chart : window.Chart;

require("./chart.common.js")(Chart);
require("./chart.errorBar.js")(Chart);
require("./chart.horizontalErrorBar.js")(Chart);

},{"./chart.common.js":2,"./chart.errorBar.js":3,"./chart.horizontalErrorBar.js":4,"chart.js":1}]},{},[5]);
