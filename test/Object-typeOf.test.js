var xjs = require('../index.js')

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
