var xjs = require('../index.js')

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
