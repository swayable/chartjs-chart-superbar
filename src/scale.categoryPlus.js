// Modified version of the default category scale
export default function(Chart) {
  var Scale = Chart.Scale
  var scaleService = Chart.scaleService

  // Default config for a category scale
  var defaultConfig = {
    position: 'bottom',
  }

  var CategoryScale = scaleService.getScaleConstructor('category')

  var DatasetScale = CategoryScale.extend({
    _valueWidth: function(datum) {
      var me = this
      return Chart.controllers.barplus.getThickness(datum, me.chart, me.width)
    },

    _valueHeight: function(datum) {
      var me = this
      return Chart.controllers.barplus.getThickness(datum, me.chart, me.height)
    },

    _widthOffset: function(index, datasetIndex) {
      var me = this
      var previousData = me.chart.data.datasets[datasetIndex].data.slice(
        me.minIndex,
        index
      )
      var leftOffset = 0
      for (var i = 0; i < previousData.length; i++) {
        var datum = previousData[i]
        leftOffset += me._valueWidth(datum)
      }
      return leftOffset
    },

    _heightOffset: function(index, datasetIndex) {
      var me = this
      var previousData = me.chart.data.datasets[datasetIndex].data.slice(
        me.minIndex,
        index
      )
      var topOffset = 0
      for (var i = 0; i < previousData.length; i++) {
        var datum = previousData[i]
        topOffset += me._valueHeight(datum)
      }
      return topOffset
    },

    // Used to get data value locations.  Value can either be an index or a numerical value
    getPixelForValue: function(value, index, datasetIndex, includeOffset) {
      var me = this
      var offset = me.options.offset
      // 1 is added because we need the length but we have the indexes
      var offsetAmt = Math.max(
        me.maxIndex + 1 - me.minIndex - (offset ? 0 : 1),
        1
      )

      if (typeof datasetIndex !== 'number') {
        datasetIndex = 0 // FIX: this is a hack
      }

      if (typeof index !== 'number') {
        return me.bottom // FIX: this is a hack
      }

      var datum = me.chart.data.datasets[datasetIndex].data[index]

      if (me.isHorizontal()) {
        var valueWidth = me._valueWidth(datum)
        var widthOffset = me._widthOffset(index, datasetIndex)

        if (offset) {
          widthOffset += valueWidth / 2
        }

        return me.left + Math.round(widthOffset)
      }
      var valueHeight = me._valueHeight(datum)
      var heightOffset = me._heightOffset(index, datasetIndex)

      if (offset) {
        heightOffset += valueHeight / 2
      }
      return me.top + Math.round(heightOffset)
    },
  })

  scaleService.registerScaleType('categoryPlus', DatasetScale, defaultConfig)
}
