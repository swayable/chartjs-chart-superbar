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

  Chart.defaults.barPlus = helpers.extend(
    Chart.defaults.bar,
    Chart.defaults.barplus
  );

  Chart.defaults.horizontalBarPlus = helpers.extend(
    Chart.defaults.horizontalBar,
    Chart.defaults.barplus
  );

  var barPlusController = {
    initialize: function(chart, datasetIndex) {
      Chart.controllers.bar.prototype.initialize.apply(this, arguments);

      var valueScale = this.getValueScale()
      this.isHorizontal = valueScale.isHorizontal()

      var tickOptions = helpers.extend(
        valueScale.options.ticks,
        Chart.defaults.ticks
      );
      var dataset = chart.chart.controller.config.data.datasets[datasetIndex];
      Chart.controllers.barplus.initaliseErrorBar(
        chart.chart.options,
        this.chart
      );
      Chart.controllers.barplus.initInsignificantColor(
        dataset,
        this.chart.barplus._errorInsignificantColor,
        this.chart.barplus._errorAnimate
      );

      this.initScale(dataset, tickOptions);
    },

    update: function(reset) {
      Chart.controllers.bar.prototype.update.call(this, reset);
      this.changeBarThickness(this.getMeta());
    },

    initScale: function(dataset, tickOptions) {
      var prop = this._dataValueProp()

      helpers.each(
        dataset.data,
        function(datum, index) {
          Chart.controllers.barplus.initialiseScale(
            tickOptions,
            datum[prop] - datum.error,
            datum[prop] + datum.error
          );
        },
        this
      );
    },

    draw: function(ease) {
      Chart.controllers.bar.prototype.draw.call(this, ease);
      var ctx = this.chart.chart.ctx,
        meta = this.getMeta();
      var valueScale = this.getValueScale()
      if (this.chart.barplus._errorShow) {
        this.createElement(ctx, valueScale, meta);
      }
      this.changeBarThickness(meta);
    },

    changeBarThickness: function(meta) {
      var dataset = this.getDataset().data;
      var dimension = this.isHorizontal ? 'height' : 'width'
      helpers.each(
        dataset,
        function(rectangle, index) {
          var thickness = Chart.controllers.barplus.getThickness(
            rectangle,
            this.chart
          );

          meta.data[index]._view[dimension] = thickness
          meta.data[index]._model[dimension] = thickness
        },
        this
      );
    },

    createElement: function(ctx, valueScale, meta) {
      var dataValueProp = this._dataValueProp()
      var indexProp = this._indexProp()

      helpers.each(
        this.getDataset().data,
        function(rectangle, index) {
          var vm = meta.data[index]._view;
          var start = Chart.controllers.barplus.calculateErrorStart(
            this.getDataset(),
            index,
            valueScale,
            dataValueProp
          );
          var end = Chart.controllers.barplus.calculateErrorEnd(
            this.getDataset(),
            index,
            valueScale,
            dataValueProp
          );
          var mid = Chart.controllers.barplus.calculateErrorMid(
            this.getDataset(),
            index,
            valueScale,
            dataValueProp
          );
          // if (
          //   rectangle._errorAnimate === true &&
          //   this.chart.barplus._errorShow === true
          // ) {
          //   Chart.controllers.barplus.drawAnimatedLine(
          //     ctx,
          //     this.chart.barplus._errorWidth,
          //     this.chart.barplus._errorColor,
          //     vm[indexProp],
          //     start,
          //     vm[indexProp],
          //     end,
          //     vm[indexProp],
          //     mid,
          //     rectangle
          //   );
          // }
          // if (rectangle._errorAnimate === false) {
          //   Chart.controllers.barplus.drawLine(
          //     ctx,
          //     this.chart.barplus._errorWidth,
          //     this.chart.barplus._errorColor,
          //     vm[indexProp],
          //     start,
          //     vm[indexProp],
          //     end
          //   );
          // }
        },
        this
      );
    },

    _dataValueProp: function() {
      return this.isHorizontal ? 'x' : 'y'
    },

    _indexProp: function() {
      return this.isHorizontal ? 'y' : 'x'
    }
  };

  Chart.controllers.barPlus =
    Chart.controllers.bar.extend(barPlusController)

  Chart.controllers.horizontalBarPlus =
    Chart.controllers.horizontalBar.extend(barPlusController)
};

},{}],3:[function(require,module,exports){
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
      var len = Object.keys(setting).length;
      if (len > 0) {
        config = {
          _errorDir: setting.direction || defaultConfig._errorDir,
          _errorWidth: setting.width || defaultConfig._errorWidth,
          _errorColor: setting.color || defaultConfig._errorColor,
          _errorShow:
            "show" in setting ? setting.show : defaultConfig._errorShow,
          _errorAnimate:
            "animate" in setting
              ? setting.animate
              : defaultConfig._errorAnimate,
          _errorInsignificantColor:
            setting.insignificantColor || defaultConfig._errorInsignificantColor
        };
      }
      helpers.extend(chart.barplus, config);
    },

    initialiseBarThickness: function(setting, defaultConfig, chart) {
      var config = defaultConfig;
      var len = Object.keys(setting).length;
      if (len > 0) {
        config = {
          _minBarThickness: setting.min || defaultConfig.minBarThickness,
          _maxBarThickness: setting.max || defaultConfig.maxBarThickness
        };
      }
      helpers.extend(chart.barplus, config);
    },

    initaliseErrorBar: function(options, chart) {
      chart.barplus = {};
      var errorBarOpt = "errorBars" in options ? options.errorBars : {};
      var barThickness = "barThickness" in options ? options.barThickness : {};
      this.intialiseErrorBarConfig(
        errorBarOpt,
        Chart.defaults.barplusErrorBar,
        chart
      );
      this.initialiseBarThickness(
        barThickness,
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

    initInsignificantColor: function(
      dataset,
      insignificantColor,
      errorAnimate
    ) {
      var backgroundColor = [];
      helpers.each(
        dataset.data,
        function(rectangle, index) {
          rectangle._errorAnimate = errorAnimate;
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
    },

    calculateErrorStart: function(dataset, index, axis, cordinate) {
      var value = dataset.data[index][cordinate] - dataset.data[index].error,
        ycordinate = axis.getPixelForValue(value);
      return ycordinate;
    },

    calculateErrorEnd: function(dataset, index, axis, cordinate) {
      var value = dataset.data[index][cordinate] + dataset.data[index].error,
        ycordinate = axis.getPixelForValue(value);
      return ycordinate;
    },

    calculateErrorMid: function(dataset, index, axis, cordinate) {
      var value = dataset.data[index][cordinate],
        ycordinate = axis.getPixelForValue(value);
      return ycordinate;
    },

    drawLine: function(ctx, width, color, startX, startY, endX, endY) {
      ctx.lineWidth = width;
      ctx.strokeStyle = color;
      ctx.beginPath();
      ctx.moveTo(startX, startY);
      ctx.lineTo(endX, endY);
      ctx.stroke();
    },

    drawAnimatedLine: function(
      ctx,
      width,
      color,
      startX,
      startY,
      endX,
      endY,
      midX,
      midY,
      rect
    ) {
      var diffX = 0,
        diffY = 2,
        type = 0,
        midToStartY = midY,
        midToStartX = midX;

      if (startY == midY) {
        type = 1; // horizontal
        diffX = 2;
        diffY = 0;
      }

      function animate() {
        ctx.beginPath();
        ctx.lineWidth = width;
        ctx.strokeStyle = color;
        ctx.moveTo(midX, midY);
        ctx.lineTo(midX - diffX, midY - diffY);
        ctx.stroke();
        ctx.beginPath();
        ctx.moveTo(midToStartX, midToStartY);
        ctx.lineTo(midToStartX + diffX, midToStartY + diffY);
        ctx.stroke();
        midY = midY - diffY;
        midX = midX - diffX;

        midToStartY = midToStartY + diffY;
        midToStartX = midToStartX + diffX;
        if (midY > endY || midX > startX) {
          window.requestAnimationFrame(animate);
        } else rect._errorAnimate = false;
      }
      setTimeout(function() {
        animate();
      }, 1000);
    }
  };
};

},{}],4:[function(require,module,exports){
"use strict";

var Chart = require("chart.js");
Chart = typeof Chart === "function" ? Chart : window.Chart;

require("./chart.common.js")(Chart);
require("./chart.barPlus.js")(Chart);

},{"./chart.barPlus.js":2,"./chart.common.js":3,"chart.js":1}]},{},[4]);
