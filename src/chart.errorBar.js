"use strict";

module.exports = function(Chart) {
  var helpers = Chart.helpers;

  Chart.defaults.errorBar = helpers.extend(Chart.defaults.bar, {
    errorDir: "both",
    errorWidth: 1,
    errorColor: "red",
    errorShow: true,
    errorAnimate: true,
    errorInsignificantColor: "#aaa",
    minBarThickness: 5,
    maxBarThickness: 50
  });

  Chart.controllers.errorBar = Chart.controllers.bar.extend({
    draw: function(ease) {
      Chart.controllers.bar.prototype.draw.call(this, ease);
      var ctx = this.chart.chart.ctx,
        meta = this.getMeta();
      this.initializeErrorBar();
      var yaxis = this.chart.scales[meta.yAxisID];
      if (this.chart._errorShow) this.createElement(ctx, yaxis, meta);
      this.changeBarThickness(meta);
    },

    //update: function(reset) {}, TODO

    changeBarThickness: function(meta) {
      var self = this;
      var dataset = this.getDataset().data;
      helpers.each(dataset, function(rectangle, index) {
        meta.data[index]._view.width = meta.data[
          index
        ]._model.width = self.getThickness(rectangle);
      });
    },
    createElement: function(ctx, yaxis, meta) {
      helpers.each(
        this.getDataset().data,
        function(rectangle, index) {
          var vm = meta.data[index]._view;
          ctx.beginPath();
          ctx.lineWidth = this.chart._errorWidth;
          ctx.strokeStyle = this.chart._errorColor;
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
      var value = dataset.data[index].y - dataset.data[index].error,
        ycordinate = yaxis.getPixelForValue(value);
      return ycordinate;
    },
    calculateErrorBarTop: function(dataset, index, yaxis) {
      var value = dataset.data[index].y + dataset.data[index].error,
        ycordinate = yaxis.getPixelForValue(value);
      return ycordinate;
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
    initializeErrorBar: function() {
      helpers.extend(this.chart, {
        _errorDir:
          this.getMeta().controller.chart.options.errorBars.direction ||
          Chart.defaults.errorBar.errorDir,
        _errorWidth:
          this.getMeta().controller.chart.options.errorBars.width ||
          Chart.defaults.errorBar.errorWidth,
        _errorColor:
          this.getMeta().controller.chart.options.errorBars.color ||
          Chart.defaults.errorBar.errorColor,
        _errorShow:
          this.getMeta().controller.chart.options.errorBars.show &&
          Chart.defaults.errorBar.errorShow,
        _errorAnimate:
          this.getMeta().controller.chart.options.errorBars.animate &&
          Chart.defaults.errorBar.errorAnimate,
        _errorInsignificantColor:
          this.getMeta().controller.chart.options.errorBars
            .insignificantColor ||
          Chart.defaults.errorBar.errorInsignificantColor,
        _minBarThickness:
          this.getMeta().controller.chart.options.barThickness.min ||
          Chart.defaults.errorBar.minBarThickness,
        _maxBarThickness:
          this.getMeta().controller.chart.options.barThickness.max ||
          Chart.defaults.errorBar.maxBarThickness
      });
    }
  });
};
