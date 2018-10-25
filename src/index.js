"use strict";

var Chart = require("chart.js");
Chart = typeof Chart === "function" ? Chart : window.Chart;

require("./chart.common.js")(Chart);
require("./chart.barPlus.js")(Chart);
