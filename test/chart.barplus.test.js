var Chart = require('chart.js')
Chart = typeof Chart === 'function' ? Chart : window.Chart

var commonBarPlus = require('../src/chart.common.js')(Chart)

describe('Chart.common.js', () => {
  it('Bar Thickness', () => {
    var val = Chart.controllers.barplus.getThickness(
      { thickness: 20 },
      {
        barplus: {
          _minBarThickness: 5,
          _maxBarThickness: 10,
        },
      }
    )
    expect(val).toBe(10)
  })

  it('initialiseScale', () => {
    var option = { suggestedMin: -1, suggestedMax: -10 }
    Chart.controllers.barplus.initialiseScale(option, 10, 20)
    expect(option.suggestedMin).toBe(-1)
    expect(option.suggestedMax).toBe(20)
  })

  it('initialiseBarThickness', () => {
    var setting1 = { min: 2, max: 55 }
    var setting2 = { min: 2 }
    var defaultConfig = { minBarThickness: 5, maxBarThickness: 50 }
    var chart = { barplus: {} }

    Chart.controllers.barplus.initialiseBarThickness(
      setting1,
      defaultConfig,
      chart
    )
    expect(chart.barplus._minBarThickness).toBe(2)
    expect(chart.barplus._maxBarThickness).toBe(55)

    Chart.controllers.barplus.initialiseBarThickness(
      setting2,
      defaultConfig,
      chart
    )
    expect(chart.barplus._minBarThickness).toBe(2)
    expect(chart.barplus._maxBarThickness).toBe(50)
  })

  it('Calculate ErrorBar Start and End', () => {
    var dataset = {
      data: [{ y: 20, error: 5 }],
    }
    var index = 0
    var yaxis = {
      getPixelForValue: function(val) {
        return val
      },
    }
    var checkval = Chart.controllers.barplus.calculateErrorStart(
      dataset,
      index,
      yaxis,
      'y'
    )
    expect(checkval).toBe(15)
    var checkval = Chart.controllers.barplus.calculateErrorEnd(
      dataset,
      index,
      yaxis,
      'y'
    )
    expect(checkval).toBe(25)
  })

  it('intialiseErrorBarConfig', () => {
    var setting = {
      width: 20,
      show: false,
    }
    var defaultConfig = Chart.defaults.barplusErrorBar
    var chart = { barplus: {} }
    Chart.controllers.barplus.intialiseErrorBarConfig(
      setting,
      defaultConfig,
      chart
    )
    expect(chart.barplus._errorWidth).toBe(20)
    expect(chart.barplus._errorShow).toBe(false)
    expect(chart.barplus._errorColor).toBe('rgba(255, 20, 20, 0.3)')

    var setting1 = {}
    Chart.controllers.barplus.intialiseErrorBarConfig(
      setting1,
      defaultConfig,
      chart
    )
    expect(chart.barplus._errorWidth).toBe(2)
    expect(chart.barplus._errorShow).toBe(true)
    expect(chart.barplus._errorColor).toBe('rgba(255, 20, 20, 0.3)')

    var setting2 = { width: 20 }
    Chart.controllers.barplus.intialiseErrorBarConfig(
      setting2,
      defaultConfig,
      chart
    )
    expect(chart.barplus._errorWidth).toBe(20)
    expect(chart.barplus._errorShow).toBe(true)

    var setting3 = { show: true }
    Chart.controllers.barplus.intialiseErrorBarConfig(
      setting3,
      defaultConfig,
      chart
    )
    expect(chart.barplus._errorWidth).toBe(2)
    expect(chart.barplus._errorShow).toBe(true)
  })

  it('initInsignificantColor', () => {
    var insignificantColor = 'rgba(200, 200, 200, 0.8)'
    const dataset = {
      label: 'Dataset1',
      data: [
        {
          y: 10.5,
          error: 5.3,
          thickness: 5,
          insignificant: false,
        },
        {
          y: 9.24,
          error: 2.9,
          thickness: 200,
          insignificant: true,
        },
        {
          y: 20,
          error: 3.9,
          thickness: 40,
          insignificant: false,
        },
        {
          y: -29,
          error: 6.9,
          insignificant: false,
          thickness: 20,
        },
        {
          y: 16,
          error: 2.9,
          thickness: 8,
          insignificant: true,
        },
        {
          y: 18,
          error: 4,
          thickness: 8,
          insignificant: false,
        },
      ],
      backgroundColor: 'rgba(151,187,205,0.5)',
    }
    Chart.controllers.barplus.initInsignificantColor(
      dataset,
      insignificantColor
    )
    var arr = [
      'rgba(151,187,205,0.5)',
      'rgba(200, 200, 200, 0.8)',
      'rgba(151,187,205,0.5)',
      'rgba(151,187,205,0.5)',
      'rgba(200, 200, 200, 0.8)',
      'rgba(151,187,205,0.5)',
    ]
    expect(dataset.backgroundColor.sort()).toEqual(arr.sort())
  })
})
