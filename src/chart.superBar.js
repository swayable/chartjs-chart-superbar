import ErrorBarMixin from './mixin.errorBar'
import BarThicknessMixin from './mixin.barThickness'

export default function(Chart) {
  const helpers = Chart.helpers

  const defaultOptions = {
    errorBars: {
      show: true,
      animate: true,
      color: 'rgba(255, 20, 20, 0.3)',
      width: 2,
      insignificantColor: 'rgba(200, 200, 200, 0.8)',
    },
  }

  const verticalScales = {
    scales: {
      xAxes: [{ type: 'thickCategory' }],
      yAxes: [{ type: 'linearWithError' }],
    },
  }

  const horizontalScales = {
    scales: {
      xAxes: [{ type: 'linearWithError' }],
      yAxes: [{ type: 'thickCategory' }],
    },
  }

  Chart.defaults.superBar = helpers.extend(
    Chart.defaults.bar,
    defaultOptions,
    verticalScales
  )

  Chart.defaults.horizontalSuperBar = helpers.extend(
    Chart.defaults.horizontalBar,
    defaultOptions,
    horizontalScales
  )

  const SuperBarController = {
    initialize(chart, datasetIndex) {
      Chart.controllers.bar.prototype.initialize.apply(this, arguments)
      if (chart.options.errorBars.show) this.setupErrorStyles()
    },

    update(reset) {
      Chart.controllers.bar.prototype.update.call(this, reset)
      if (this.chart.options.errorBars.show) this.drawErrorBar()
      this.changeBarThickness()
    },

    draw(ease) {
      Chart.controllers.bar.prototype.draw.call(this, ease)
      if (this.chart.options.errorBars.show) this.drawErrorBar()
    },
  }

  helpers.extend(SuperBarController, ErrorBarMixin, BarThicknessMixin)

  Chart.controllers.superBar = Chart.controllers.bar.extend(SuperBarController)

  Chart.controllers.horizontalSuperBar = Chart.controllers.horizontalBar.extend(
    SuperBarController
  )
}
