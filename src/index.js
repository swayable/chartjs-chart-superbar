import Chart from 'chart.js'
Chart = typeof Chart === 'function' ? Chart : window.Chart

import categoryPlusScale from './scale.categoryPlus.js'
import linearWithErrorScale from './scale.linearWithError.js'
import barPlusController from './chart.barPlus.js'

categoryPlusScale(Chart)
linearWithErrorScale(Chart)
barPlusController(Chart)
