!function(r,t){"object"==typeof exports&&"object"==typeof module?module.exports=t(require("chart.js")):"function"==typeof define&&define.amd?define(["chart.js"],t):"object"==typeof exports?exports["chartjs-chart-bar-plus"]=t(require("chart.js")):r["chartjs-chart-bar-plus"]=t(r["chart.js"])}(window,function(r){return function(r){var t={};function e(a){if(t[a])return t[a].exports;var i=t[a]={i:a,l:!1,exports:{}};return r[a].call(i.exports,i,i.exports,e),i.l=!0,i.exports}return e.m=r,e.c=t,e.d=function(r,t,a){e.o(r,t)||Object.defineProperty(r,t,{enumerable:!0,get:a})},e.r=function(r){"undefined"!=typeof Symbol&&Symbol.toStringTag&&Object.defineProperty(r,Symbol.toStringTag,{value:"Module"}),Object.defineProperty(r,"__esModule",{value:!0})},e.t=function(r,t){if(1&t&&(r=e(r)),8&t)return r;if(4&t&&"object"==typeof r&&r&&r.__esModule)return r;var a=Object.create(null);if(e.r(a),Object.defineProperty(a,"default",{enumerable:!0,value:r}),2&t&&"string"!=typeof r)for(var i in r)e.d(a,i,function(t){return r[t]}.bind(null,i));return a},e.n=function(r){var t=r&&r.__esModule?function(){return r.default}:function(){return r};return e.d(t,"a",t),t},e.o=function(r,t){return Object.prototype.hasOwnProperty.call(r,t)},e.p="",e(e.s=0)}([function(r,t,e){"use strict";var a=e(1);a="function"==typeof a?a:window.Chart,e(2)(a),e(3)(a),e(4)(a)},function(t,e){t.exports=r},function(r,t,e){"use strict";r.exports=function(r){var t=r.helpers;r.defaults.barplusErrorBar={_errorDir:"both",_errorWidth:2,_errorColor:"rgba(255, 20, 20, 0.3)",_errorShow:!0,_errorAnimate:!0,_errorInsignificantColor:"rgba(200, 200, 200, 0.8)"},r.defaults.barplusThickness={_minBarThickness:5,_maxBarThickness:50},r.defaults.ticks={suggestedMin:0,suggestedMax:0},r.controllers.barplus={intialiseErrorBarConfig:function(r,e,a){var i=e;Object.keys(r).length>0&&(i={_errorDir:r.direction||e._errorDir,_errorWidth:r.width||e._errorWidth,_errorColor:r.color||e._errorColor,_errorShow:"show"in r?r.show:e._errorShow,_errorAnimate:"animate"in r?r.animate:e._errorAnimate,_errorInsignificantColor:r.insignificantColor||e._errorInsignificantColor}),t.extend(a.barplus,i)},initialiseBarThickness:function(r,e,a){var i=e;Object.keys(r).length>0&&(i={_minBarThickness:r.min||e.minBarThickness,_maxBarThickness:r.max||e.maxBarThickness}),t.extend(a.barplus,i)},initaliseErrorBar:function(t,e){e.barplus={};var a="errorBars"in t?t.errorBars:{},i="barThickness"in t?t.barThickness:{};this.intialiseErrorBarConfig(a,r.defaults.barplusErrorBar,e),this.initialiseBarThickness(i,r.defaults.barplusThickness,e)},getThickness:function(r,t,e){return r.thickness*e},initialiseScale:function(r,t,e){t<r.suggestedMin&&(r.suggestedMin=t),e>r.suggestedMax&&(r.suggestedMax=e)},initInsignificantColor:function(r,e,a){var i=[];t.each(r.data,function(t,n){t._errorAnimate=a,Array.isArray(r.backgroundColor)?i.push(t.insignificant?e:r.backgroundColor[n]):i.push(t.insignificant?e:r.backgroundColor)},this),r.backgroundColor=i},calculateErrorStart:function(r,t,e,a){var i=r.data[t][a]-r.data[t].error;return e.getPixelForValue(i)},calculateErrorEnd:function(r,t,e,a){var i=r.data[t][a]+r.data[t].error;return e.getPixelForValue(i)},calculateErrorMid:function(r,t,e,a){var i=r.data[t][a];return e.getPixelForValue(i)},drawLine:function(r){var t=r.ctx,e=r.width,a=r.color,i=r.startX,n=r.startY,o=r.endX,s=r.endY;t.lineWidth=e,t.strokeStyle=a,t.beginPath(),t.moveTo(i,n),t.lineTo(o,s),t.stroke()},drawAnimatedLine:function(r){var t=r.ctx,e=r.width,a=r.color,i=r.startX,n=r.startY,o=(r.endX,r.endY),s=r.midX,l=r.midY,c=r.rect,u=0,h=2,d=l,f=s;function p(){t.beginPath(),t.lineWidth=e,t.strokeStyle=a,t.moveTo(s,l),t.lineTo(s-u,l-h),t.stroke(),t.beginPath(),t.moveTo(f,d),t.lineTo(f+u,d+h),t.stroke(),s-=u,d+=h,f+=u,(l-=h)>o||s>i?window.requestAnimationFrame(p):c._errorAnimate=!1}n==l&&(1,u=2,h=0),setTimeout(function(){p()},1e3)}}}},function(r,t,e){"use strict";r.exports=function(r){r.Scale;var t=r.scaleService,e=t.getScaleConstructor("category").extend({_valueWidth:function(t){return r.controllers.barplus.getThickness(t,this.chart,this.width)},_valueHeight:function(t){return r.controllers.barplus.getThickness(t,this.chart,this.height)},_widthOffset:function(r,t){for(var e=this.chart.data.datasets[t].data.slice(this.minIndex,r),a=0,i=0;i<e.length;i++){var n=e[i];a+=this._valueWidth(n)}return a},_heightOffset:function(r,t){for(var e=this.chart.data.datasets[t].data.slice(this.minIndex,r),a=0,i=0;i<e.length;i++){var n=e[i];a+=this._valueHeight(n)}return a},getPixelForValue:function(r,t,e,a){var i=this,n=i.options.offset;Math.max(i.maxIndex+1-i.minIndex-(n?0:1),1);if("number"!=typeof e&&(e=0),"number"!=typeof t)return i.bottom;var o=i.chart.data.datasets[e].data[t];if(i.isHorizontal()){var s=i._valueWidth(o),l=i._widthOffset(t,e);return n&&(l+=s/2),i.left+Math.round(l)}var c=i._valueHeight(o),u=i._heightOffset(t,e);return n&&(u+=c/2),i.top+Math.round(u)}});t.registerScaleType("categoryPlus",e,{position:"bottom"})}},function(r,t,e){"use strict";r.exports=function(r){var t=r.helpers;r.defaults.barPlus=t.extend(r.defaults.bar,r.defaults.barplus),r.defaults.horizontalBarPlus=t.extend(r.defaults.horizontalBar,r.defaults.barplus);var e={initialize:function(e,a){r.controllers.bar.prototype.initialize.apply(this,arguments);var i=this.getValueScale();this.isHorizontal=i.isHorizontal();var n=t.extend(i.options.ticks,r.defaults.ticks),o=e.chart.controller.config.data.datasets[a];r.controllers.barplus.initaliseErrorBar(e.chart.options,this.chart),r.controllers.barplus.initInsignificantColor(o,this.chart.barplus._errorInsignificantColor,this.chart.barplus._errorAnimate),this.initScale(o,n)},update:function(t){r.controllers.bar.prototype.update.call(this,t),this.changeBarThickness(this.getMeta())},initScale:function(e,a){var i=this._dataValueProp();t.each(e.data,function(t,e){r.controllers.barplus.initialiseScale(a,t[i]-t.error,t[i]+t.error)},this)},draw:function(t){r.controllers.bar.prototype.draw.call(this,t);var e=this.chart.chart.ctx,a=this.getMeta(),i=this.getValueScale();this.chart.barplus._errorShow&&this.createElement(e,i,a),this.changeBarThickness(a)},changeBarThickness:function(e){var a=this.getDataset().data,i=this.isHorizontal?"height":"width",n=this.getIndexScale();t.each(a,function(t,a){var o=n[i],s=r.controllers.barplus.getThickness(t,this.chart,o);e.data[a]._view[i]=s,e.data[a]._model[i]=s},this)},createElement:function(e,a,i){var n=this,o=n._dataValueProp(),s=n._indexProp();t.each(n.getDataset().data,function(t,l){var c=i.data[l]._view,u=r.controllers.barplus.calculateErrorStart(n.getDataset(),l,a,o),h=r.controllers.barplus.calculateErrorEnd(n.getDataset(),l,a,o),d=r.controllers.barplus.calculateErrorMid(n.getDataset(),l,a,o),f=c[s],p={ctx:e,rect:t,width:n.chart.barplus._errorWidth,color:n.chart.barplus._errorColor,startX:n.isHorizontal?u:f,startY:n.isHorizontal?f:u,endX:n.isHorizontal?h:f,endY:n.isHorizontal?f:h,midX:n.isHorizontal?d:f,midY:n.isHorizontal?f:d};!0===t._errorAnimate&&!0===n.chart.barplus._errorShow&&r.controllers.barplus.drawAnimatedLine(p),!1===t._errorAnimate&&r.controllers.barplus.drawLine(p)},n)},_dataValueProp:function(){return this.isHorizontal?"x":"y"},_indexProp:function(){return this.isHorizontal?"y":"x"}};r.controllers.barPlus=r.controllers.bar.extend(e),r.controllers.horizontalBarPlus=r.controllers.horizontalBar.extend(e)}}])});