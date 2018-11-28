// Modified version of the default category scale
export default function(Chart) {
  const scaleService = Chart.scaleService

  const defaultConfig = {
    spacing: 2, // space between bars in pixels

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
    getPixelForValue(value, index, datasetIndex) {
      const me = this,
        offset = me.options.offset

      let datumIndex = index

      if (value !== undefined && (typeof datumIndex !== 'number')) {
        // Find datum index by label
        const label = me.getRightValue(value)
        const labels = me.getLabels()
        datumIndex = labels.indexOf(label)
      }

      if (typeof datasetIndex !== 'number') {
        // we're dealing with the scale labels, so any dataset will do
        datasetIndex = 0
      }

      const datum = me.chart.data.datasets[datasetIndex].data[datumIndex]

      const categorySize = me._getCategoryThickness(datum)
      let offsetSize = me._calcOffset(index, datasetIndex)

      if (offset) offsetSize += categorySize / 2
      return this._offsetBase() + offsetSize
    },

    getBarThickness(datum) {
      let thickness = datum.thickness * this._axisSize(),
        spacing = this.options.spacing * 2

      return thickness - spacing
    },

    _offsetBase() {
      return this.isHorizontal() ? this.left : this.top
    },

    _axisSize() {
      return this.isHorizontal() ? this.width : this.height
    },

    _getCategoryThickness(datum) {
      const thickness = this.getBarThickness(datum),
        spacing = this.options.spacing * 2
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

  scaleService.registerScaleType('thickCategory', DatasetScale, defaultConfig)
}
