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
