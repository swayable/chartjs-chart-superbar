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
          var startY = Chart.controllers.barplus.calculateErrorStart(
            this.getDataset(),
            index,
            yaxis,
            "y"
          );
          var endY = Chart.controllers.barplus.calculateErrorEnd(
            this.getDataset(),
            index,
            yaxis,
            "y"
          );

          var midY = Chart.controllers.barplus.calculateErrorMid(
            this.getDataset(),
            index,
            yaxis,
            "y"
          );
          if (
            rectangle._errorAnimate === true &&
            this.chart.barplus._errorShow === true
          ) {
            Chart.controllers.barplus.drawAnimatedLine(
              ctx,
              this.chart.barplus._errorWidth,
              this.chart.barplus._errorColor,
              vm.x,
              startY,
              vm.x,
              endY,
              vm.x,
              midY,
              rectangle
            );
          }
          if (rectangle._errorAnimate === false) {
            Chart.controllers.barplus.drawLine(
              ctx,
              this.chart.barplus._errorWidth,
              this.chart.barplus._errorColor,
              vm.x,
              startY,
              vm.x,
              endY
            );
          }
        },
        this
      );
    }
  });
};
