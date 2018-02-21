var xjs = require('../index.js')

  let x = [0,1,2,0,3,4]
  function test(tested) {
    console.log(`[${x}].contains([${tested}]):\t${xjs.Array.contains(x, tested)}`)
  }
  test([3,4])
  test([0,1,2])
  test([0,1,2,0,3,4])
  test([0,3,4])
  test([2,5])
  test([2,4])
  test([4,0])
  test([4,3])
  test([1])
  test([])
  try {
    test([0,1,2,3,4,5,6])
  } catch (e) {
    console.log('failed to call `contains(x,y)` with `y` larger than `x`')
  }
