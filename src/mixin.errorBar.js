import { drawLine, drawAnimatedLine } from './utils.draw'
import { indexDimension } from './utils.dimension'

const findErrorCoordinate = ({ pos, value, error, scale }) => {
  switch (pos) {
    case 'start':
      return scale.getPixelForValue(value - error)
    case 'end':
      return scale.getPixelForValue(value + error)
    case 'mid':
      return scale.getPixelForValue(value)
    default:
      throw new Error('Must supply a `pos` argument')
  }
}

const ErrorBarMixin = {
  setupErrorStyles() {
    const dataset = this.getDataset(),
      data = dataset.data,
      useColorArray = Array.isArray(dataset.backgroundColor),
      backgroundColor = [],
      { insignificantColor, animate } = this.chart.options.errorBars

    data.forEach((datum, index) => {
      datum._animate = animate

      let color
      if (datum.insignificant) color = insignificantColor
      else if (useColorArray) color = dataset.backgroundColor[index]
      else color = dataset.backgroundColor

      backgroundColor.push(color)
    })

    dataset.backgroundColor = backgroundColor
  },

  drawErrorBar() {
    const me = this,
      datasetIndex = me.index,
      { datasets } = me.chart.data,
      ctx = me.chart.ctx,
      meta = me.getMeta(),
      scale = me.getValueScale(),
      isHorizontal = scale.isHorizontal(),
      indexD = indexDimension(isHorizontal),
      data = me.getDataset().data,
      { width, color } = me.chart.options.errorBars

    data.forEach((datum, index) => {
      const vm = meta.data[index]._view,
        indexCoord = vm[indexD],
        error = datum.error,
        lineOpts = { ctx, datum, width, color }

      if (!error) return // don't draw if error is missing or 0

      let startValue = 0

      if (scale.options.stacked || meta.stack !== undefined) {
        for (let i = 0; i < datasetIndex; i++) {
          const prevMeta = me.chart.getDatasetMeta(i)
          if (prevMeta.stack !== meta.stack) continue

          const stackedDatum = datasets[i].data[index]
          startValue += scale.getRightValue(stackedDatum)
        }
      }

      const value = startValue + scale.getRightValue(datum),
        start = findErrorCoordinate({ pos: 'start', value, error, scale }),
        end = findErrorCoordinate({ pos: 'end', value, error, scale }),
        mid = findErrorCoordinate({ pos: 'mid', value, error, scale })

      if (isHorizontal) {
        lineOpts.startX = start
        lineOpts.endX = end
        lineOpts.midX = mid
        lineOpts.startY = lineOpts.endY = lineOpts.midY = indexCoord
      } else {
        lineOpts.startY = start
        lineOpts.endY = end
        lineOpts.midY = mid
        lineOpts.startX = lineOpts.endX = lineOpts.midX = indexCoord
      }

      if (datum._animate) drawAnimatedLine(lineOpts)
      else drawLine(lineOpts)
    })
  },
}

export default ErrorBarMixin
