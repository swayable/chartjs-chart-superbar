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
