const labels = ['Jan', 'Feb', 'Mar', 'Apr']

const backgroundColor = 'rgba(151,187,205,0.5)'

const sourceData = [
  {
    _value: 10.5,
    error: 5.3,
    thickness: 0.3,
    insignificant: false,
  }, {
    _value: 9.24,
    error: 2.9,
    thickness: 0.1,
    insignificant: true
  }, {
    _value: 20,
    error: 3.9,
    thickness: 0.4,
    insignificant: false,
  }, {
    _value: -29,
    error: 6.9,
    thickness: 0.2,
    insignificant: false,
  }
]

const verticalDataset = {
  label: 'Example Vertical',
  data: sourceData.map((datum) => {
    datum.y = datum._value
    return datum
  }),
  backgroundColor,
}

const horizontalDataset = {
  label: 'Example Horizontal',
  data: sourceData.map((datum) => {
    datum.x = datum._value
    return datum
  }),
  backgroundColor,
}