var xjs = require('./index.js')


function object_typeOf() {
  console.log(`The following should print 'null':`)
  console.log(
    xjs.Object.typeOf(null)
  )
  console.log(`The following should print 'array':`)
  console.log(
    xjs.Object.typeOf([]),
    xjs.Object.typeOf([false, 0, NaN, '', null, true, Infinity, 'true', {}, [] ])
  )
  console.log(`The following should print 'NaN':`)
  console.log(
    xjs.Object.typeOf(NaN),
    xjs.Object.typeOf(0 * 'true')
  )
  console.log(`The following should print 'infinite':`)
  console.log(
    xjs.Object.typeOf(Infinity),
    xjs.Object.typeOf(42 / 0)
  )
  console.log(`The following should print 'number':`)
  console.log(
    xjs.Object.typeOf(42),
    xjs.Object.typeOf(21 + 21)
  )
  console.log(`The following should print 'boolean':`)
  console.log(
    xjs.Object.typeOf(true)
  )
  console.log(`The following should print 'string':`)
  console.log(
    xjs.Object.typeOf('true')
  )
  console.log(`The following should print 'function':`)
  console.log(
    xjs.Object.typeOf(function () { return 'true' })
  )
  console.log(`The following should print 'undefined':`)
  console.log(
    xjs.Object.typeOf(undefined),
    xjs.Object.typeOf(),
    xjs.Object.typeOf((function () {
      let x;
      return x;
    })())
  )
}

function object_is() {
  console.log(
    xjs.Object.is({ background: 'none', 'font-weight': 'bold' }, {})
  )
}

function object_freezeDeep() {
  let x = { first: 1, second: { value: 2 }, third: [1, '2', { v:3 }] }
  let y = xjs.Object.freezeDeep(x)
  console.log(`x: ${x}`)
  console.log(`y: ${y}`)
  console.log(`x===y: ${x===y}`)
  console.log(`xjs.Object.is(x,y): ${xjs.Object.is(x,y)}`)
}

function object_cloneDeep() {
  let x = { first: 1, second: { value: 2 }, third: [1, '2', { v:3 }] }
  let y = xjs.Object.cloneDeep(x)
  console.log(`x: ${x}`)
  console.log(`y: ${y}`)
  console.log(`x===y: ${x===y}`)
  console.log(`xjs.Object.is(x,y): ${xjs.Object.is(x,y)}`)
}

function number_typeOf() {
  console.log(`The following should print 'integer':`)
  console.log(
    xjs.Number.typeOf(42),
    xjs.Number.typeOf(-42),
    xjs.Number.typeOf(0),
    xjs.Number.typeOf(-0),
    xjs.Number.typeOf(24.00),
    xjs.Number.typeOf(-24.00)
  )
  console.log(`The following should print 'float':`)
  console.log(
    xjs.Number.typeOf(42.24),
    xjs.Number.typeOf(-42.24)
  )
  console.log(`The following should throw a RangeError:`)
  try {
    console.log(
      xjs.Number.typeOf(Infinity)
    )
  } catch (e) {
    console.log(`an error was thrown: "${e}"`)
  }
  try {
    console.log(
      xjs.Number.typeOf(NaN)
    )
  } catch (e) {
    console.log(`an error was thrown: "${e}"`)
  }
}

function array_is() {
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
}

function array_contains() {
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
}

function date_format() {
  console.log([
    'Y-m-d'    ,
    'j M Y'    ,
    'd F Y'    ,
    'l, j F, Y',
    'j M'      ,
    'M Y'      ,
    'M j'      ,
    'M j, Y'   ,
    'M'        ,
    'H:i'      ,
    'g:ia'     ,
    'default'  ,
  ].map((f) => xjs.Date.format(new Date(), f)))
}

// object_typeOf();
// object_is();
// object_freezeDeep();
// object_cloneDeep();
// number_typeOf();
// array_is();
// array_contains();
// date_format();
