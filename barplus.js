/*!
 * chartjs-bar-plus
 * Version: 0.0.0
 * Released under the MIT license
 */
(function(){function r(e,n,t){function o(i,f){if(!n[i]){if(!e[i]){var c="function"==typeof require&&require;if(!f&&c)return c(i,!0);if(u)return u(i,!0);var a=new Error("Cannot find module '"+i+"'");throw a.code="MODULE_NOT_FOUND",a}var p=n[i]={exports:{}};e[i][0].call(p.exports,function(r){var n=e[i][1][r];return o(n||r)},p,p.exports,r,e,n,t)}return n[i].exports}for(var u="function"==typeof require&&require,i=0;i<t.length;i++)o(t[i]);return o}return r})()({1:[function(require,module,exports){

},{}],2:[function(require,module,exports){
'use strict';

module.exports = function(Chart) {
	var helpers = Chart.helpers;

	Chart.defaults.errorBar = helpers.extend(Chart.defaults.bar, {
		errorDir: "both",
		errorWidth: 1,
		errorColor: 'red',
		errorShow: true,
		errorAnimate:true,
		errorInsignificantColor:'#aaa',
		minBarThickness : 5,
		maxBarThickness : 50
	});

	Chart.controllers.errorBar = Chart.controllers.bar.extend({
			draw: function(ease) {
					Chart.controllers.bar.prototype.draw.call(this, ease);
					var ctx = this.chart.chart.ctx,
					 	meta = this.getMeta();
				 	this.initializeErrorBar();
		      		var yaxis =  this.chart.scales[meta.yAxisID];
		      		if(this.chart._errorShow)
						this.createElement(ctx,yaxis,meta);
					this.changeBarThickness(meta);
			},

			//update: function(reset) {}, TODO
			
			changeBarThickness : function(meta){
				var self = this;
				var dataset = this.getDataset().data;
				helpers.each(dataset, function(rectangle, index) {
					  meta.data[index]._view.width = meta.data[index]._model.width =self.getThickness(rectangle);
	        	});
			}, 
			createElement : function( ctx, yaxis, meta){
				helpers.each(this.getDataset().data, function(rectangle, index) {
					var	vm = meta.data[index]._view;
					ctx.beginPath();
					ctx.lineWidth = this.chart._errorWidth;
					ctx.strokeStyle = this.chart._errorColor;
            		ctx.moveTo(vm.x, this.calculateErrorBarBottom(this.getDataset(), index , yaxis));
					ctx.lineTo(vm.x, this.calculateErrorBarTop(this.getDataset(), index ,yaxis));
					ctx.stroke();
				}, this);
			},

			calculateErrorBarBottom : function(dataset, index, yaxis){
				var value = dataset.data[index].y-dataset.data[index].error,
					ycordinate  = yaxis.getPixelForValue(value);
					return ycordinate;
			},
			calculateErrorBarTop : function(dataset, index, yaxis){
				var value = dataset.data[index].y+dataset.data[index].error,
					ycordinate  = yaxis.getPixelForValue(value);
					return ycordinate;
			},
			getInsignificantStatus : function(dataset, index){
				return dataset.data[index].insignificant;
			},
			getThickness : function(data){
				var thickness = data.thickness;
				if(data.thickness<this.chart._minBarThickness)
					thickness = this.chart._minBarThickness;
				if(data.thickness > this.chart._maxBarThickness)
					thickness = this.chart._maxBarThickness;
				return thickness;
			},
			initializeErrorBar :  function(){
				helpers.extend(this.chart, {
					_errorDir : this.getMeta().controller.chart.options.errorBars.direction || Chart.defaults.errorBar.errorDir,
				 	_errorWidth : this.getMeta().controller.chart.options.errorBars.width || Chart.defaults.errorBar.errorWidth,
					_errorColor : this.getMeta().controller.chart.options.errorBars.color || Chart.defaults.errorBar.errorColor,
				 	_errorShow : this.getMeta().controller.chart.options.errorBars.show && Chart.defaults.errorBar.errorShow,
				 	_errorAnimate : this.getMeta().controller.chart.options.errorBars.animate && Chart.defaults.errorBar.errorAnimate,
					_errorInsignificantColor : this.getMeta().controller.chart.options.errorBars.insignificantColor|| Chart.defaults.errorBar.errorInsignificantColor,
					_minBarThickness : this.getMeta().controller.chart.options.barThickness.min|| Chart.defaults.errorBar.minBarThickness,
					_maxBarThickness : this.getMeta().controller.chart.options.barThickness.max|| Chart.defaults.errorBar.maxBarThickness
				});
				
			}
	});
};
},{}],3:[function(require,module,exports){
'use strict';

module.exports = function(Chart) {
 	var helpers = Chart.helpers;

	Chart.defaults.horizontalErrorBar = helpers.extend(Chart.defaults.horizontalBar, {
		errorDir: "both",
		errorWidth: 1,
		errorColor: 'red',
		errorShow: true,
		errorAnimate:true,
		errorInsignificantColor:'grey',
		minBarThickness : 5,
		maxBarThickness : 50
	});

	Chart.controllers.horizontalErrorBar = Chart.controllers.horizontalBar.extend({
		    draw: function(ease) {
					Chart.controllers.bar.prototype.draw.call(this, ease);
					var ctx = this.chart.chart.ctx,
					 	meta = this.getMeta();
				 	this.initializeErrorBar();
					var xaxis =  this.chart.scales[meta.xAxisID];
		      		if(this.chart._errorShow)
						this.createElement(ctx,xaxis,meta);
					this.changeBarHeight(meta);
			},

			//update: function(reset) {}, TODO

			changeBarHeight : function(meta){
				var self = this;
				var dataset = this.getDataset().data;
				helpers.each(dataset, function(rectangle, index) {
					  meta.data[index]._view.height = meta.data[index]._model.height =self.getThickness(rectangle);
	        	});
			}, 

			createElement :  function(ctx,xaxis,meta){
				helpers.each(this.getDataset().data, function(rectangle, index) {
						var	vm = meta.data[index]._view;
						ctx.beginPath();
						ctx.lineWidth = this.chart._errorWidth;
						ctx.strokeStyle = this.getInsignificantStatus(this.getDataset(), index) ? this.chart._errorInsignificantColor: this.chart._errorColor;
	            		ctx.moveTo(this.calculateErrorBarLeft(this.getDataset(), index , xaxis),vm.y);
						ctx.lineTo(this.calculateErrorBarRight(this.getDataset(), index ,xaxis),vm.y);					
						ctx.stroke();
				}, this);
			},
			calculateErrorBarRight : function(dataset, index, xaxis){
				var value = dataset.data[index].x+dataset.data[index].error,
					xcordinate  = xaxis.getPixelForValue(value);
					return xcordinate;
			},
			calculateErrorBarLeft : function(dataset, index, xaxis){
				var value = dataset.data[index].x-dataset.data[index].error,
					xcordinate  = xaxis.getPixelForValue(value);
					return xcordinate;
			},
			getInsignificantStatus : function(dataset, index){
				return dataset.data[index].insignificant;
			},
			getThickness : function(data){
				var thickness = data.thickness;
				if(data.thickness<this.chart._minBarThickness)
					thickness = this.chart._minBarThickness;
				if(data.thickness > this.chart._maxBarThickness)
					thickness = this.chart._maxBarThickness;
				return thickness;
			},

			initializeErrorBar :  function(dataset){
				helpers.extend(this.chart, {
					_errorDir : this.getMeta().controller.chart.options.errorBars.direction || Chart.defaults.horizontalErrorBar.errorDir,
				 	_errorWidth : this.getMeta().controller.chart.options.errorBars.width || Chart.defaults.horizontalErrorBar.errorWidth,
					_errorColor : this.getMeta().controller.chart.options.errorBars.color || Chart.defaults.horizontalErrorBar.errorColor,
				 	_errorShow : this.getMeta().controller.chart.options.errorBars.show && Chart.defaults.horizontalErrorBar.errorShow,
				 	_errorAnimate : this.getMeta().controller.chart.options.errorBars.animate && Chart.defaults.horizontalErrorBar.errorAnimate,
					_errorInsignificantColor : this.getMeta().controller.chart.options.errorBars.insignificantColor|| Chart.defaults.horizontalErrorBar.errorInsignificantColor,
					_minBarThickness : this.getMeta().controller.chart.options.barThickness.min|| Chart.defaults.horizontalErrorBar.minBarThickness,
					_maxBarThickness : this.getMeta().controller.chart.options.barThickness.max|| Chart.defaults.horizontalErrorBar.maxBarThickness
				});
			}
	});
};
},{}],4:[function(require,module,exports){
'use strict';

var Chart = require('chart.js');
Chart = typeof Chart === 'function' ? Chart : window.Chart;

require('./chart.errorBar.js')(Chart);
require('./chart.horizontalErrorBar.js')(Chart);

},{"./chart.errorBar.js":2,"./chart.horizontalErrorBar.js":3,"chart.js":1}]},{},[4]);
