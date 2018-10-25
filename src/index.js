import Chart from 'chart.js'
Chart = typeof Chart === 'function' ? Chart : window.Chart

import common from './chart.common.js'
import categoryPlus from './scale.categoryPlus.js'
import barPlus from './chart.barPlus.js'

common(Chart)
categoryPlus(Chart)
barPlus(Chart)
