(function webpackUniversalModuleDefinition(root, factory) {
	if(typeof exports === 'object' && typeof module === 'object')
		module.exports = factory(require("chart.js"));
	else if(typeof define === 'function' && define.amd)
		define(["chart.js"], factory);
	else if(typeof exports === 'object')
		exports["chartjs-chart-bar-plus"] = factory(require("chart.js"));
	else
		root["chartjs-chart-bar-plus"] = factory(root["chart.js"]);
})(window, function(__WEBPACK_EXTERNAL_MODULE_chart_js__) {
return /******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, { enumerable: true, get: getter });
/******/ 		}
/******/ 	};
/******/
/******/ 	// define __esModule on exports
/******/ 	__webpack_require__.r = function(exports) {
/******/ 		if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 			Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 		}
/******/ 		Object.defineProperty(exports, '__esModule', { value: true });
/******/ 	};
/******/
/******/ 	// create a fake namespace object
/******/ 	// mode & 1: value is a module id, require it
/******/ 	// mode & 2: merge all properties of value into the ns
/******/ 	// mode & 4: return value when already ns object
/******/ 	// mode & 8|1: behave like require
/******/ 	__webpack_require__.t = function(value, mode) {
/******/ 		if(mode & 1) value = __webpack_require__(value);
/******/ 		if(mode & 8) return value;
/******/ 		if((mode & 4) && typeof value === 'object' && value && value.__esModule) return value;
/******/ 		var ns = Object.create(null);
/******/ 		__webpack_require__.r(ns);
/******/ 		Object.defineProperty(ns, 'default', { enumerable: true, value: value });
/******/ 		if(mode & 2 && typeof value != 'string') for(var key in value) __webpack_require__.d(ns, key, function(key) { return value[key]; }.bind(null, key));
/******/ 		return ns;
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = "./src/index.js");
/******/ })
/************************************************************************/
/******/ ({

/***/ "./src/chart.barPlus.js":
/*!******************************!*\
  !*** ./src/chart.barPlus.js ***!
  \******************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony import */ var _mixin_errorBar__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./mixin.errorBar */ \"./src/mixin.errorBar.js\");\n/* harmony import */ var _mixin_barThickness__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./mixin.barThickness */ \"./src/mixin.barThickness.js\");\n\n\n\n/* harmony default export */ __webpack_exports__[\"default\"] = (function(Chart) {\n  const helpers = Chart.helpers\n\n  const defaultOptions = {\n    errorBars: {\n      show: true,\n      animate: true,\n      color: 'rgba(255, 20, 20, 0.3)',\n      width: 2,\n      insignificantColor: 'rgba(200, 200, 200, 0.8)',\n    },\n    barThickness: {\n      min: 10,\n      max: 50,\n    },\n  }\n\n  const verticalScales = {\n    scales: {\n      xAxes: [\n        {\n          type: 'categoryPlus',\n        },\n      ],\n      yAxes: [\n        {\n          type: 'linearWithError',\n        },\n      ],\n    },\n  }\n\n  const horizontalScales = {\n    scales: {\n      xAxes: [\n        {\n          type: 'linearWithError',\n        },\n      ],\n      yAxes: [\n        {\n          type: 'categoryPlus',\n        },\n      ],\n    },\n  }\n\n  Chart.defaults.barPlus = helpers.extend(\n    Chart.defaults.bar,\n    defaultOptions,\n    verticalScales\n  )\n\n  Chart.defaults.horizontalBarPlus = helpers.extend(\n    Chart.defaults.horizontalBar,\n    defaultOptions,\n    horizontalScales\n  )\n\n  const BarPlusController = {\n    initialize(chart, datasetIndex) {\n      Chart.controllers.bar.prototype.initialize.apply(this, arguments)\n\n      this.isHorizontal = this.getValueScale().isHorizontal()\n\n      if (chart.options.errorBars.show) this.setupErrorStyles()\n    },\n\n    update(reset) {\n      Chart.controllers.bar.prototype.update.call(this, reset)\n      if (this.chart.options.errorBars.show) this.drawErrorBar()\n      this.changeBarThickness()\n    },\n\n    draw(ease) {\n      Chart.controllers.bar.prototype.draw.call(this, ease)\n      if (this.chart.options.errorBars.show) this.drawErrorBar()\n    },\n  }\n\n  helpers.extend(BarPlusController, _mixin_errorBar__WEBPACK_IMPORTED_MODULE_0__[\"default\"], _mixin_barThickness__WEBPACK_IMPORTED_MODULE_1__[\"default\"])\n\n  Chart.controllers.barPlus = Chart.controllers.bar.extend(BarPlusController)\n\n  Chart.controllers.horizontalBarPlus = Chart.controllers.horizontalBar.extend(\n    BarPlusController\n  )\n});\n\n\n//# sourceURL=webpack://chartjs-chart-bar-plus/./src/chart.barPlus.js?");

/***/ }),

/***/ "./src/index.js":
/*!**********************!*\
  !*** ./src/index.js ***!
  \**********************/
/*! no exports provided */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony import */ var chart_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! chart.js */ \"chart.js\");\n/* harmony import */ var chart_js__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(chart_js__WEBPACK_IMPORTED_MODULE_0__);\n/* harmony import */ var _scale_categoryPlus_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./scale.categoryPlus.js */ \"./src/scale.categoryPlus.js\");\n/* harmony import */ var _scale_linearWithError_js__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./scale.linearWithError.js */ \"./src/scale.linearWithError.js\");\n/* harmony import */ var _chart_barPlus_js__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./chart.barPlus.js */ \"./src/chart.barPlus.js\");\n\r\nChart = typeof chart_js__WEBPACK_IMPORTED_MODULE_0___default.a === 'function' ? chart_js__WEBPACK_IMPORTED_MODULE_0___default.a : window.Chart\r\n\r\n\r\n\r\n\r\n\r\nObject(_scale_categoryPlus_js__WEBPACK_IMPORTED_MODULE_1__[\"default\"])(Chart)\r\nObject(_scale_linearWithError_js__WEBPACK_IMPORTED_MODULE_4__[\"default\"])(Chart)\r\nObject(_chart_barPlus_js__WEBPACK_IMPORTED_MODULE_3__[\"default\"])(Chart)\r\n\n\n//# sourceURL=webpack://chartjs-chart-bar-plus/./src/index.js?");

/***/ }),

/***/ "./src/mixin.barThickness.js":
/*!***********************************!*\
  !*** ./src/mixin.barThickness.js ***!
  \***********************************/
/*! exports provided: calcBarThickness, default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, \"calcBarThickness\", function() { return calcBarThickness; });\nconst calcBarThickness = (datum, options, frameSize) => {\n  let thickness = datum.thickness * frameSize\n\n  // TODO: use options for min/max value\n  // if (thickness < options.barThickness.min)\n  //   thickness = options.barThickness.min\n  // if (thickness > options.barThickness.max)\n  //   thickness = options.barThickness.max\n\n  return thickness\n}\n\nconst BarThicknessMixin = {\n  changeBarThickness() {\n    const meta = this.getMeta(),\n      data = this.getDataset().data,\n      indexScale = this.getIndexScale(),\n      dimension = this.isHorizontal ? 'height' : 'width',\n      { options } = this.chart\n\n    data.forEach((datum, index) => {\n      const frameSize = indexScale[dimension],\n        thickness = calcBarThickness(datum, options, frameSize)\n\n      meta.data[index]._view[dimension] = thickness\n      meta.data[index]._model[dimension] = thickness\n    })\n  },\n}\n\n/* harmony default export */ __webpack_exports__[\"default\"] = (BarThicknessMixin);\n\n\n//# sourceURL=webpack://chartjs-chart-bar-plus/./src/mixin.barThickness.js?");

/***/ }),

/***/ "./src/mixin.errorBar.js":
/*!*******************************!*\
  !*** ./src/mixin.errorBar.js ***!
  \*******************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony import */ var _utils_draw__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./utils.draw */ \"./src/utils.draw.js\");\n/* harmony import */ var _utils_dimension__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./utils.dimension */ \"./src/utils.dimension.js\");\n\n\n\nconst findErrorCoordinate = ({ pos, value, error, scale }) => {\n  switch (pos) {\n    case 'start':\n      return scale.getPixelForValue(value - error)\n    case 'end':\n      return scale.getPixelForValue(value + error)\n    case 'mid':\n      return scale.getPixelForValue(value)\n    default:\n      throw new Error('Must supply a `pos` argument')\n  }\n}\n\nconst ErrorBarMixin = {\n  setupErrorStyles() {\n    const dataset = this.getDataset(),\n      data = dataset.data,\n      useColorArray = Array.isArray(dataset.backgroundColor),\n      backgroundColor = [],\n      { insignificantColor, animate } = this.chart.options.errorBars\n\n    data.forEach((datum, index) => {\n      datum._animate = animate\n\n      let color\n      if (datum.insignificant) color = insignificantColor\n      else if (useColorArray) color = dataset.backgroundColor[index]\n      else color = dataset.backgroundColor\n\n      backgroundColor.push(color)\n    })\n\n    dataset.backgroundColor = backgroundColor\n  },\n\n  drawErrorBar() {\n    const me = this,\n      ctx = me.chart.ctx,\n      meta = me.getMeta(),\n      scale = me.getValueScale(),\n      valueD = Object(_utils_dimension__WEBPACK_IMPORTED_MODULE_1__[\"valueDimension\"])(me.isHorizontal),\n      indexD = Object(_utils_dimension__WEBPACK_IMPORTED_MODULE_1__[\"indexDimension\"])(me.isHorizontal),\n      data = me.getDataset().data,\n      { width, color } = me.chart.options.errorBars\n\n    data.forEach((datum, index) => {\n      const vm = meta.data[index]._view,\n        indexCoord = vm[indexD],\n        value = datum[valueD],\n        error = datum.error\n\n      const lineOpts = { ctx, datum, width, color }\n\n      const start = findErrorCoordinate({ pos: 'start', value, error, scale }),\n        end = findErrorCoordinate({ pos: 'end', value, error, scale }),\n        mid = findErrorCoordinate({ pos: 'mid', value, error, scale })\n\n      if (me.isHorizontal) {\n        lineOpts.startX = start\n        lineOpts.endX = end\n        lineOpts.midX = mid\n        lineOpts.startY = lineOpts.endY = lineOpts.midY = indexCoord\n      } else {\n        lineOpts.startY = start\n        lineOpts.endY = end\n        lineOpts.midY = mid\n        lineOpts.startX = lineOpts.endX = lineOpts.midX = indexCoord\n      }\n\n      if (datum._animate) Object(_utils_draw__WEBPACK_IMPORTED_MODULE_0__[\"drawAnimatedLine\"])(lineOpts)\n      else Object(_utils_draw__WEBPACK_IMPORTED_MODULE_0__[\"drawLine\"])(lineOpts)\n    })\n  },\n}\n\n/* harmony default export */ __webpack_exports__[\"default\"] = (ErrorBarMixin);\n\n\n//# sourceURL=webpack://chartjs-chart-bar-plus/./src/mixin.errorBar.js?");

/***/ }),

/***/ "./src/scale.categoryPlus.js":
/*!***********************************!*\
  !*** ./src/scale.categoryPlus.js ***!
  \***********************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony import */ var _mixin_barThickness__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./mixin.barThickness */ \"./src/mixin.barThickness.js\");\n\n\n// Modified version of the default category scale\n/* harmony default export */ __webpack_exports__[\"default\"] = (function(Chart) {\n  const scaleService = Chart.scaleService\n\n  const defaultConfig = {\n    position: 'bottom',\n    categoryPercentage: 1,\n    barPercentage: 1,\n    offset: true,\n    gridLines: {\n      display: false,\n      offsetGridLines: true,\n    },\n  }\n\n  const CategoryScale = scaleService.getScaleConstructor('category')\n\n  const DatasetScale = CategoryScale.extend({\n    // Used to get data value locations.  Value can either be an index or a numerical value\n    getPixelForValue(value, index, datasetIndex, includeOffset) {\n      const me = this\n      const offset = me.options.offset\n      // 1 is added because we need the length but we have the indexes\n      const offsetAmt = Math.max(\n        me.maxIndex + 1 - me.minIndex - (offset ? 0 : 1),\n        1\n      )\n\n      if (typeof datasetIndex !== 'number') {\n        datasetIndex = 0 // FIX: this is a hack\n      }\n\n      if (typeof index !== 'number') {\n        return me.bottom // FIX: this is a hack\n      }\n\n      const datum = me.chart.data.datasets[datasetIndex].data[index]\n\n      const valueSize = me._getValueSize(datum)\n      let offsetSize = me._calcOffset(index, datasetIndex)\n\n      if (offset) offsetSize += valueSize / 2\n      return this._offsetBase() + offsetSize\n    },\n\n    _offsetBase() {\n      return this.isHorizontal() ? this.left : this.top\n    },\n\n    _axisSize() {\n      return this.isHorizontal() ? this.width : this.height\n    },\n\n    _getValueSize(datum) {\n      return Object(_mixin_barThickness__WEBPACK_IMPORTED_MODULE_0__[\"calcBarThickness\"])(datum, this.chart.options, this._axisSize())\n    },\n\n    _calcOffset(index, datasetIndex) {\n      const me = this\n      const previousData = me.chart.data.datasets[datasetIndex].data.slice(\n        me.minIndex,\n        index\n      )\n\n      const offset = previousData.reduce((acc, datum) => {\n        return acc + me._getValueSize(datum)\n      }, 0)\n\n      return offset\n    },\n  })\n\n  scaleService.registerScaleType('categoryPlus', DatasetScale, defaultConfig)\n});\n\n\n//# sourceURL=webpack://chartjs-chart-bar-plus/./src/scale.categoryPlus.js?");

/***/ }),

/***/ "./src/scale.linearWithError.js":
/*!**************************************!*\
  !*** ./src/scale.linearWithError.js ***!
  \**************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony default export */ __webpack_exports__[\"default\"] = (function(Chart) {\n  const scaleService = Chart.scaleService\n\n  const defaultConfig = {\n    position: 'left',\n  }\n\n  const LinearScale = scaleService.getScaleConstructor('linear')\n\n  const DatasetScale = LinearScale.extend({\n    determineDataLimits() {\n      const me = this,\n        showErrorBars = me.chart.options.errorBars.show\n\n      if (!showErrorBars) CategoryScale.prototype.determineDataLimits.call(this)\n\n      let minValue = 0,\n        maxValue = 0\n      const { datasets } = me.chart.data\n\n      datasets.forEach(ds => {\n        ds.data.forEach(datum => {\n          const value = me.getRightValue(datum),\n            low = value - datum.error,\n            high = value + datum.error\n          minValue = Math.min(minValue, low)\n          maxValue = Math.max(maxValue, high)\n        })\n      })\n\n      me.min = minValue\n      me.max = maxValue\n    },\n  })\n\n  scaleService.registerScaleType(\n    'linearWithError',\n    DatasetScale,\n    defaultConfig\n  )\n});\n\n\n//# sourceURL=webpack://chartjs-chart-bar-plus/./src/scale.linearWithError.js?");

/***/ }),

/***/ "./src/utils.dimension.js":
/*!********************************!*\
  !*** ./src/utils.dimension.js ***!
  \********************************/
/*! exports provided: valueDimension, indexDimension */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, \"valueDimension\", function() { return valueDimension; });\n/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, \"indexDimension\", function() { return indexDimension; });\nconst valueDimension = isHorizontal => (isHorizontal ? 'x' : 'y')\nconst indexDimension = isHorizontal => (isHorizontal ? 'y' : 'x')\n\n\n\n\n//# sourceURL=webpack://chartjs-chart-bar-plus/./src/utils.dimension.js?");

/***/ }),

/***/ "./src/utils.draw.js":
/*!***************************!*\
  !*** ./src/utils.draw.js ***!
  \***************************/
/*! exports provided: drawLine, drawAnimatedLine */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, \"drawLine\", function() { return drawLine; });\n/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, \"drawAnimatedLine\", function() { return drawAnimatedLine; });\nconst drawLine = ({ ctx, width, color, startX, startY, endX, endY }) => {\n  ctx.lineWidth = width\n  ctx.strokeStyle = color\n  ctx.beginPath()\n  ctx.moveTo(startX, startY)\n  ctx.lineTo(endX, endY)\n  ctx.stroke()\n}\n\nconst drawAnimatedLine = ({\n  ctx,\n  width,\n  color,\n  startX,\n  startY,\n  endX,\n  endY,\n  midX,\n  midY,\n  datum,\n}) => {\n  let diffX = 0,\n    diffY = 2,\n    midToStartY = midY,\n    midToStartX = midX\n\n  if (startY == midY) {\n    diffX = 2\n    diffY = 0\n  }\n\n  const animate = () => {\n    ctx.beginPath()\n    ctx.lineWidth = width\n    ctx.strokeStyle = color\n    ctx.moveTo(midX, midY)\n    ctx.lineTo(midX - diffX, midY - diffY)\n    ctx.stroke()\n    ctx.moveTo(midToStartX, midToStartY)\n    ctx.lineTo(midToStartX + diffX, midToStartY + diffY)\n    ctx.stroke()\n    midY = midY - diffY\n    midX = midX - diffX\n\n    midToStartY = midToStartY + diffY\n    midToStartX = midToStartX + diffX\n    if (midY > endY || midX > startX) {\n      window.requestAnimationFrame(animate)\n    } else datum._animate = false // disable further animations\n  }\n\n  setTimeout(animate, 1000)\n}\n\n\n//# sourceURL=webpack://chartjs-chart-bar-plus/./src/utils.draw.js?");

/***/ }),

/***/ "chart.js":
/*!**************************************************************************************************!*\
  !*** external {"commonjs":"chart.js","commonjs2":"chart.js","amd":"chart.js","root":"chart.js"} ***!
  \**************************************************************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

eval("module.exports = __WEBPACK_EXTERNAL_MODULE_chart_js__;\n\n//# sourceURL=webpack://chartjs-chart-bar-plus/external_%7B%22commonjs%22:%22chart.js%22,%22commonjs2%22:%22chart.js%22,%22amd%22:%22chart.js%22,%22root%22:%22chart.js%22%7D?");

/***/ })

/******/ });
});