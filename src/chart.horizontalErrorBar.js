"use strict";

module.exports = function(Chart) {
  var helpers = Chart.helpers;

  Chart.defaults.horizontalErrorBar = helpers.extend(
    Chart.defaults.horizontalBar,
    {
      errorDir: "both",
      errorWidth: 1,
      errorColor: "red",
      errorShow: true,
      errorAnimate: true,
      errorInsignificantColor: "grey",
      minBarThickness: 5,
      maxBarThickness: 50
    }
  );

  Chart.controllers.horizontalErrorBar = Chart.controllers.horizontalBar.extend(
    {
      draw: function(ease) {
        Chart.controllers.bar.prototype.draw.call(this, ease);
        var ctx = this.chart.chart.ctx,
          meta = this.getMeta();
        this.initializeErrorBar();
        var xaxis = this.chart.scales[meta.xAxisID];
        if (this.chart._errorShow) this.createElement(ctx, xaxis, meta);
        this.changeBarHeight(meta);
      },

      //update: function(reset) {}, TODO

      changeBarHeight: function(meta) {
        var self = this;
        var dataset = this.getDataset().data;
        helpers.each(dataset, function(rectangle, index) {
          meta.data[index]._view.height =
            meta.data[index]._model.height = self.getThickness(rectangle);
        });
      },

      createElement: function(ctx, xaxis, meta) {
        helpers.each(
          this.getDataset().data,
          function(rectangle, index) {
            var vm = meta.data[index]._view;
            ctx.beginPath();
            ctx.lineWidth = this.chart._errorWidth;
            ctx.strokeStyle = this.getInsignificantStatus(
              this.getDataset(),
              index
            )
              ? this.chart._errorInsignificantColor
              : this.chart._errorColor;
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
        var value = dataset.data[index].x - dataset.data[index].error,
          xcordinate = xaxis.getPixelForValue(value);
        return xcordinate;
      },
      getInsignificantStatus: function(dataset, index) {
        return dataset.data[index].insignificant;
      },
      getThickness: function(data) {
        var thickness = data.thickness;
        if (data.thickness < this.chart._minBarThickness)
          thickness = this.chart._minBarThickness;
        if (data.thickness > this.chart._maxBarThickness)
          thickness = this.chart._maxBarThickness;
        return thickness;
      },

      initializeErrorBar: function(dataset) {
        helpers.extend(this.chart, {
          _errorDir:
            this.getMeta().controller.chart.options.errorBars.direction ||
            Chart.defaults.horizontalErrorBar.errorDir,
          _errorWidth:
            this.getMeta().controller.chart.options.errorBars.width ||
            Chart.defaults.horizontalErrorBar.errorWidth,
          _errorColor:
            this.getMeta().controller.chart.options.errorBars.color ||
            Chart.defaults.horizontalErrorBar.errorColor,
          _errorShow:
            this.getMeta().controller.chart.options.errorBars.show &&
            Chart.defaults.horizontalErrorBar.errorShow,
          _errorAnimate:
            this.getMeta().controller.chart.options.errorBars.animate &&
            Chart.defaults.horizontalErrorBar.errorAnimate,
          _errorInsignificantColor:
            this.getMeta().controller.chart.options.errorBars
              .insignificantColor ||
            Chart.defaults.horizontalErrorBar.errorInsignificantColor,
          _minBarThickness:
            this.getMeta().controller.chart.options.barThickness.min ||
            Chart.defaults.horizontalErrorBar.minBarThickness,
          _maxBarThickness:
            this.getMeta().controller.chart.options.barThickness.max ||
            Chart.defaults.horizontalErrorBar.maxBarThickness
        });
      }
    }
  );
};
