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
