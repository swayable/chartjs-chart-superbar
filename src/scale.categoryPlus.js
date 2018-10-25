import { calcBarThickness } from './mixin.barThickness'

// Modified version of the default category scale
export default function(Chart) {
  const scaleService = Chart.scaleService

  const defaultConfig = {
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
    // Used to get data value locations.  Value can either be an index or a numerical value
    getPixelForValue(value, index, datasetIndex, includeOffset) {
      const me = this
      const offset = me.options.offset
      // 1 is added because we need the length but we have the indexes
      const offsetAmt = Math.max(
        me.maxIndex + 1 - me.minIndex - (offset ? 0 : 1),
        1
      )

      if (typeof datasetIndex !== 'number') {
        datasetIndex = 0 // FIX: this is a hack
      }

      if (typeof index !== 'number') {
        return me.bottom // FIX: this is a hack
      }

      const datum = me.chart.data.datasets[datasetIndex].data[index]

      const valueSize = me._getValueSize(datum)
      let offsetSize = me._calcOffset(index, datasetIndex)

      if (offset) offsetSize += valueSize / 2
      return this._offsetBase() + offsetSize
    },

    _offsetBase() {
      return this.isHorizontal() ? this.left : this.top
    },

    _axisSize() {
      return this.isHorizontal() ? this.width : this.height
    },

    _getValueSize(datum) {
      return calcBarThickness(datum, this.chart.options, this._axisSize())
    },

    _calcOffset(index, datasetIndex) {
      const me = this
      const previousData = me.chart.data.datasets[datasetIndex].data.slice(
        me.minIndex,
        index
      )

      const offset = previousData.reduce((acc, datum) => {
        return acc + me._getValueSize(datum)
      }, 0)

      return offset
    },
  })

  scaleService.registerScaleType('categoryPlus', DatasetScale, defaultConfig)
}
