var xjs = require('../index.js')

  console.log(xjs.Array.is(
    [1, 'two', [3, 'three'], { v: 4, val: 'four' }, [5, 'five']],
    [1, 'two', [3, 'three'], { v: 4, val: 'four' }, [5, 'five']]
  ))
  console.log(xjs.Array.is(
    [1, 'two', [3, 'three'], { v: 4, val: 'four' }, [5, 'five']],
    [1, 'two', [3, 'three'], { v: 4, val: 'four' }, [5, 'five'], [6, 'six', [6,'six'], { six: 6 }]]
  ))
  console.log(xjs.Array.is(
    [1, 'two', { value: 3 }, ['four']],
    [['four'], 1, 'two', { value: 3 }]
  ))
