import 'chart.js'
import '../src'

import verticalDataset from './fixtures/verticalDataset'
import emptyDataset from './fixtures/emptyDataset'

// Adapated from acquireChart()
// 	https://github.com/chartjs/Chart.js/blob/master/test/utils.js
const buildCanvas = (id = 'testChart') => {
  const wrapper = document.createElement('div')
  const canvas = document.createElement('canvas')

  canvas.id = id
  canvas.width = 800
  canvas.height = 600

  wrapper.appendChild(canvas)
  window.document.body.appendChild(wrapper)

  return canvas
}

const clearDOM = () => {
  window.document.body.innerHTML = ''
}

describe('chart.barPlus', () => {
  let canvas, ctx, makeEmptyChart, makeChart

  beforeEach(() => {
    canvas = buildCanvas()
    ctx = canvas.getContext('2d')

    makeEmptyChart = () =>
      new Chart(ctx, {
        type: 'barPlus',
        data: {
          datasets: [emptyDataset],
          labels: [],
        },
      })

    makeChart = () =>
      new Chart(ctx, {
        type: 'barPlus',
        data: {
          datasets: [verticalDataset],
          labels: ['A', 'B', 'C', 'D'],
        },
      })
  })

  afterEach(clearDOM)

  describe('with an empty dataset and no options', () => {
    it('should be constructed', () => {
      const chart = makeEmptyChart()

      expect(chart).not.toBe(undefined)

      const meta = chart.getDatasetMeta(0)
      expect(meta.type).toEqual('barPlus')
      expect(meta.data).toEqual([])
      expect(meta.hidden).toBe(null)
      expect(meta.controller).not.toBe(undefined)
      expect(meta.controller.index).toBe(0)
      expect(meta.xAxisID).not.toBe(null)
      expect(meta.yAxisID).not.toBe(null)
    })
  })

  describe('by default', () => {
    it('uses the custom scales provided', () => {
      const chart = makeEmptyChart()

      const [xScale, yScale] = Object.values(chart.scales)
      expect(xScale.type).toBe('categoryPlus')
      expect(yScale.type).toBe('linearWithError')
    })

    it('shows and animates error bars', () => {
      const chart = makeEmptyChart()

      const { errorBars } = chart.options
      expect(errorBars.show).toBe(true)
      expect(errorBars.animate).toBe(true)
    })
  })

  describe('with non-empty dataset', () => {
    it('creates the right element types', () => {
      const chart = makeChart()

      const meta = chart.getDatasetMeta(0)
      expect(meta.data.length).toBe(4)
      expect(meta.data[0]).toBeInstanceOf(Chart.elements.Rectangle)
      expect(meta.data[1]).toBeInstanceOf(Chart.elements.Rectangle)
      expect(meta.data[2]).toBeInstanceOf(Chart.elements.Rectangle)
      expect(meta.data[3]).toBeInstanceOf(Chart.elements.Rectangle)
    })

    it('changes bg color when data item is insignificant', () => {
      const chart = makeChart()

      const meta = chart.getDatasetMeta(0)
      expect(meta.data[0]._model.backgroundColor).toBe('#ff0000')
      expect(meta.data[1]._model.backgroundColor).toBe(
        'rgba(200, 200, 200, 0.8)'
      )
    })
  })
})
