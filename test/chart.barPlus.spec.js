import '../src'

import verticalDataset from './fixtures/verticalDataset'
import emptyDataset from './fixtures/emptyDataset'

// Adapated from acquireChart()
// 	https://github.com/chartjs/Chart.js/blob/master/test/utils.js
const buildCanvas = (id = 'testChart') => {
	const wrapper = document.createElement('div')
	const canvas = document.createElement('canvas')

	canvas.id = id
	canvas.width = 512
	canvas.height = 512

	wrapper.appendChild(canvas)
	window.document.body.appendChild(wrapper)

	return canvas
}

describe('chart.barPlus', () => {
	let canvas, ctx, makeEmptyChart, makeChart

	beforeEach(() => {
		canvas = buildCanvas()
		ctx = canvas.getContext('2d')

		makeEmptyChart = () => new Chart(ctx, {
			type: 'barPlus',
			data: {
				datasets: [emptyDataset],
				labels: [],
			},
		})

		makeChart = () => new Chart(ctx, {
			type: 'barPlus',
			data: {
				datasets: [verticalDataset],
				labels: ['A', 'B', 'C', 'D'],
			},
		})
	})

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

			const [x, y] = Object.values(chart.scales)
			expect(x.type).toBe('categoryPlus')
			expect(y.type).toBe('linearWithError')
		})

		it('shows and animates error bars', () => {
			const chart = makeEmptyChart()

			const { errorBars } = chart.options
			expect(errorBars.show).toBe(true)
			expect(errorBars.animate).toBe(true)
		})

		it('uses a min/max bar thickness of 10px and 100px', () => {
			const chart = makeEmptyChart()

			const { barThickness } = chart.options
			expect(barThickness.min).toBe(10)
			expect(barThickness.max).toBe(100)
		})
	})
})