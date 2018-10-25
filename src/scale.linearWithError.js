export default function(Chart) {
  const scaleService = Chart.scaleService

  const defaultConfig = {
    position: 'left',
  }

  const LinearScale = scaleService.getScaleConstructor('linear')

  const DatasetScale = LinearScale.extend({
    determineDataLimits() {
      const me = this,
        showErrorBars = me.chart.options.errorBars.show

      if (!showErrorBars) CategoryScale.prototype.determineDataLimits.call(this)

      let minValue = 0,
        maxValue = 0
      const { datasets } = me.chart.data

      datasets.forEach(ds => {
        ds.data.forEach(datum => {
          const value = me.getRightValue(datum),
            low = value - datum.error,
            high = value + datum.error
          minValue = Math.min(minValue, low)
          maxValue = Math.max(maxValue, high)
        })
      })

      me.min = minValue
      me.max = maxValue
    },
  })

  scaleService.registerScaleType(
    'linearWithError',
    DatasetScale,
    defaultConfig
  )
}
