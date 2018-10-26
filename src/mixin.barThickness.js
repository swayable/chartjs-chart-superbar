const BarThicknessMixin = {
  changeBarThickness() {
    const meta = this.getMeta(),
      data = this.getDataset().data,
      indexScale = this.getIndexScale(),
      dimension = indexScale.isHorizontal() ? 'width' : 'height'

    data.forEach((datum, index) => {
      const thickness = indexScale.getBarThickness(datum)

      meta.data[index]._view[dimension] = thickness
      meta.data[index]._model[dimension] = thickness
    })
  },
}

export default BarThicknessMixin
