const path = require('path')

module.exports = {
  entry: path.resolve(__dirname, 'src/index.js'),
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: 'barplus.js',
    library: 'chartjs-chart-bar-plus',
    libraryTarget: 'umd'
  },
  externals: {
    'chart.js': {
      commonjs: 'chart.js',
      commonjs2: 'chart.js',
      amd: 'chart.js',
      root: 'chart.js'
    }
  }
}
