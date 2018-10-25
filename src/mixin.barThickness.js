export const calcBarThickness = (datum, options, frameSize) => {
  let thickness = datum.thickness * frameSize

  // TODO: use options for min/max value
  // if (thickness < options.barThickness.min)
  //   thickness = options.barThickness.min
  // if (thickness > options.barThickness.max)
  //   thickness = options.barThickness.max

  return thickness
}

const BarThicknessMixin = {
  changeBarThickness() {
    const meta = this.getMeta(),
      data = this.getDataset().data,
      indexScale = this.getIndexScale(),
      dimension = this.isHorizontal ? 'height' : 'width',
      { options } = this.chart

    data.forEach((datum, index) => {
      const frameSize = indexScale[dimension],
        thickness = calcBarThickness(datum, options, frameSize)

      meta.data[index]._view[dimension] = thickness
      meta.data[index]._model[dimension] = thickness
    })
  },
}

export default BarThicknessMixin
