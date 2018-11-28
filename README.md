# SuperBar Chart for Chart.js

An extended superset of bar charts for [Chart.js](https://www.chartjs.org/) with variable thickness and error bars.

<img width="720" alt="screen shot 2018-11-28 at 2 39 09 pm" src="https://user-images.githubusercontent.com/709100/49187149-69d47d00-f31b-11e8-8f89-c8e1b2208e7c.png">

## Install

```bash
npm install https://github.com/swayable/chartjs-chart-superbar
```

## Usage

### Datasets

Expects datasets with the following format:

```javascript
{
  label: 'My Dataset',
  data: [
    {
      y: 10.5,              // or x for horizontal
      error: 5.3,           // ± value for errors
      thickness: 0.3,       // bar thickness as % of total
      insignificant: false, // statistical significance
    }, // ...
  ]
}
```

### Options

```javascript
{
  errorBars: {
    show: true,                     // show/hide error bars
    color: 'rgba(255, 0, 0, 0.5)',  // stroke color for error bars
    width: 2,                       // error bar width (pixels)
    insignificantColor: 'blue'      // color to use for insignificant bars
  },
}
```


For more use cases, see files in `examples/`.

## Bugs & Issues

When reporting bugs or issues, if you could include a link to a simple [jsbin](http://jsbin.com) or similar demonstrating the issue, that would be really helpful.

## Contributing

We ❤️ open source! See [CONTRIBUTING](.github/CONTRIBUTING.md) for information on how to get started with development.

## License

SuperBar is available under the [MIT license](http://opensource.org/licenses/MIT).
