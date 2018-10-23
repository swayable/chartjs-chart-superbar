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
