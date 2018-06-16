const barPlusChart = require('../src/chart.barplus.js')

describe('Chart.BarPlus.js', () => {
  it('does not crash', () => {
    expect(() => barPlusChart()).not.toThrow()
  })
})
