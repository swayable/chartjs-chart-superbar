Chart = typeof Chart === 'function' ? Chart : window.Chart

import thickCategoryScale from './scale.thickCategory.js'
import linearWithErrorScale from './scale.linearWithError.js'
import superBarController from './chart.superBar.js'

thickCategoryScale(Chart)
linearWithErrorScale(Chart)
superBarController(Chart)
