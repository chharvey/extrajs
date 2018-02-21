var xjs = require('../index.js')

  console.log([
    ['abc', 'def'],
    'ghi',
    123,
    null,
    undefined,
    { an: 'object' },
    function () { return "a function" },
  ].map((el) => xjs.String.stringify(el)))
