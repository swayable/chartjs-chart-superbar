// Modified version of the default category scale
export default function(Chart) {
  const scaleService = Chart.scaleService

  const defaultConfig = {
    spacing: 0.01, // space between bars, as a percentage of the chart size

    position: 'bottom',
    categoryPercentage: 1,
    barPercentage: 1,
    offset: true,
    gridLines: {
      display: false,
      offsetGridLines: true,
    },
  }

  const CategoryScale = scaleService.getScaleConstructor('category')

  const DatasetScale = CategoryScale.extend({
    getPixelForValue(_, index, datasetIndex) {
      const me = this
      const offset = me.options.offset

      if (typeof datasetIndex !== 'number') {
        // we're dealing with the scale labels, so any dataset will do
        datasetIndex = 0
      }

      const datum = me.chart.data.datasets[datasetIndex].data[index]

      const categorySize = me._getCategoryThickness(datum)
      let offsetSize = me._calcOffset(index, datasetIndex)

      if (offset) offsetSize += categorySize / 2
      return this._offsetBase() + offsetSize
    },

    getBarThickness(datum) {
      let thickness = datum.thickness * this._axisSize(),
        spacing = this._spacingSize() * 2

      return thickness - spacing
    },

    _spacingSize() {
      return this._axisSize() * this.options.spacing
    },

    _offsetBase() {
      return this.isHorizontal() ? this.left : this.top
    },

    _axisSize() {
      return this.isHorizontal() ? this.width : this.height
    },

    _getCategoryThickness(datum) {
      const thickness = this.getBarThickness(datum),
        spacing = this._spacingSize() * 2
      return thickness + spacing
    },

    _calcOffset(index, datasetIndex) {
      const me = this
      const previousData = me.chart.data.datasets[datasetIndex].data.slice(
        me.minIndex,
        index
      )

      const offset = previousData.reduce((acc, datum) => {
        return acc + me._getCategoryThickness(datum)
      }, 0)

      return offset
    },
  })

  scaleService.registerScaleType('categoryPlus', DatasetScale, defaultConfig)
}
