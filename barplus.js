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
      var dimension = this.isHorizontal ? 'height' : 'width';
      var indexScale = this.getIndexScale();
      helpers.each(
        dataset,
        function(datum, index) {
          var frameSize = indexScale[dimension]

          var thickness = Chart.controllers.barplus.getThickness(
            datum,
            this.chart,
            frameSize
          );

          meta.data[index]._view[dimension] = thickness
          meta.data[index]._model[dimension] = thickness
        },
        this
      );
    },

    createElement: function(ctx, valueScale, meta) {
      var me = this;
      var dataValueProp = me._dataValueProp()
      var indexProp = me._indexProp()

      helpers.each(
        me.getDataset().data,
        function(rectangle, index) {
          var vm = meta.data[index]._view;
          var start = Chart.controllers.barplus.calculateErrorStart(
            me.getDataset(),
            index,
            valueScale,
            dataValueProp
          );
          var end = Chart.controllers.barplus.calculateErrorEnd(
            me.getDataset(),
            index,
            valueScale,
            dataValueProp
          );
          var mid = Chart.controllers.barplus.calculateErrorMid(
            me.getDataset(),
            index,
            valueScale,
            dataValueProp
          );

          var indexCoord = vm[indexProp]

          var lineOpts = {
            ctx: ctx,
            rect: rectangle,
            width: me.chart.barplus._errorWidth,
            color: me.chart.barplus._errorColor,
            startX: me.isHorizontal ? start : indexCoord,
            startY: me.isHorizontal ? indexCoord : start,
            endX: me.isHorizontal ? end : indexCoord,
            endY: me.isHorizontal ? indexCoord : end,
            midX: me.isHorizontal ? mid : indexCoord,
            midY: me.isHorizontal ? indexCoord : mid,
          }

          if (
            rectangle._errorAnimate === true &&
            me.chart.barplus._errorShow === true
          ) {
            Chart.controllers.barplus.drawAnimatedLine(lineOpts);
          }
          if (rectangle._errorAnimate === false) {
            Chart.controllers.barplus.drawLine(lineOpts);
          }
        },
        me
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

    getThickness: function(datum, chart, frameSize) {
      var thickness = datum.thickness * frameSize;

      // TODO: use options for min/max value
      // if (thickness < chart.barplus._minBarThickness)
      //   thickness = chart.barplus._minBarThickness;
      // if (thickness > chart.barplus._maxBarThickness)
      //   thickness = chart.barplus._maxBarThickness;

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

    drawLine: function(opts) {
      var ctx = opts.ctx;
      var width = opts.width;
      var color = opts.color;
      var startX = opts.startX;
      var startY = opts.startY;
      var endX = opts.endX;
      var endY = opts.endY;

      ctx.lineWidth = width;
      ctx.strokeStyle = color;
      ctx.beginPath();
      ctx.moveTo(startX, startY);
      ctx.lineTo(endX, endY);
      ctx.stroke();
    },

    drawAnimatedLine: function(opts) {
      var ctx = opts.ctx;
      var width = opts.width;
      var color = opts.color;
      var startX = opts.startX;
      var startY = opts.startY;
      var endX = opts.endX;
      var endY = opts.endY;
      var midX = opts.midX;
      var midY = opts.midY;
      var rect = opts.rect;

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
require("./scale.categoryPlus.js")(Chart);
require("./chart.barPlus.js")(Chart);

},{"./chart.barPlus.js":2,"./chart.common.js":3,"./scale.categoryPlus.js":5,"chart.js":1}],5:[function(require,module,exports){

"use strict";

// Modified version of the default category scale

module.exports = function(Chart) {
  var Scale = Chart.Scale;
  var scaleService = Chart.scaleService;

	// Default config for a category scale
	var defaultConfig = {
		position: 'bottom'
  };

  var CategoryScale = scaleService.getScaleConstructor("category")

	var DatasetScale = CategoryScale.extend({
    _valueWidth: function(datum) {
      var me = this;
      return Chart.controllers.barplus.getThickness(
        datum,
        me.chart,
        me.width
      );
    },

    _valueHeight: function(datum) {
      var me = this;
      return Chart.controllers.barplus.getThickness(
        datum,
        me.chart,
        me.height
      );
    },

    _widthOffset: function(index, datasetIndex) {
      var me = this;
      var previousData =
        me.chart.data.datasets[datasetIndex].data.slice(me.minIndex, index);
      var leftOffset = 0;
      for (var i = 0; i < previousData.length; i++) {
        var datum = previousData[i];
        leftOffset += me._valueWidth(datum);
      }
      return leftOffset
    },

    _heightOffset: function(index, datasetIndex) {
      var me = this;
      var previousData =
        me.chart.data.datasets[datasetIndex].data.slice(me.minIndex, index);
      var topOffset = 0;
      for (var i = 0; i < previousData.length; i++) {
        var datum = previousData[i];
        topOffset += me._valueHeight(datum);
      }
      return topOffset
    },

		// Used to get data value locations.  Value can either be an index or a numerical value
		getPixelForValue: function(value, index, datasetIndex, includeOffset) {
      var me = this;
      var offset = me.options.offset;
			// 1 is added because we need the length but we have the indexes
			var offsetAmt = Math.max((me.maxIndex + 1 - me.minIndex - (offset ? 0 : 1)), 1);

      if (typeof datasetIndex !== "number") {
        datasetIndex = 0 // FIX: this is a hack
      }

      if (typeof index !== "number") {
        return me.bottom // FIX: this is a hack
      }

      var datum = me.chart.data.datasets[datasetIndex].data[index];

			if (me.isHorizontal()) {
        var valueWidth = me._valueWidth(datum);
        var widthOffset = me._widthOffset(index, datasetIndex);

				if (offset) {
          widthOffset += (valueWidth / 2);
				}

        return me.left + Math.round(widthOffset);
      }
      var valueHeight = me._valueHeight(datum);
      var heightOffset = me._heightOffset(index, datasetIndex);

			if (offset) {
				heightOffset += (valueHeight / 2);
			}
      return me.top + Math.round(heightOffset);
		},
	});

	scaleService.registerScaleType('categoryPlus', DatasetScale, defaultConfig);
};

},{}]},{},[4]);
