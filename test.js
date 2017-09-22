var xjs = require('./index.js')


function util_Object_typeOf() {
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

function util_Object_typeOfNumber() {
  console.log(`The following should print 'integer':`)
  console.log(
    xjs.Object.typeOfNumber(42)
  )
  console.log(`The following should print 'float':`)
  console.log(
    xjs.Object.typeOfNumber(42.21)
  )
  console.log(`The following should throw a RangeError:`)
  try {
    console.log(
      xjs.Object.typeOfNumber(Infinity)
    )
  } catch (e) {
    console.log(`an error was thrown: "${e}"`)
  }
  try {
    console.log(
      xjs.Object.typeOfNumber(NaN)
    )
  } catch (e) {
    console.log(`an error was thrown: "${e}"`)
  }
}

function util_Object_is() {
  console.log(
    xjs.Object.is({ background: 'none', 'font-weight': 'bold' }, {})
  )
}

function util_Object_cloneDeep() {
  let x = { first: 1, second: { value: 2 }, third: [1, '2', { v:3 }] }
  let y = xjs.Object.cloneDeep(x)
  console.log(`x: ${x}`)
  console.log(`y: ${y}`)
  console.log(`x===y: ${x===y}`)
  console.log(`xjs.Object.is(x,y): ${xjs.Object.is(x,y)}`)
}

function util_Date_format() {
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

// util_Object_typeOf();
// util_Object_typeOfNumber();
// util_Object_is();
// util_Object_cloneDeep();
// util_Date_format();
