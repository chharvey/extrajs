var Util    = require('./index.js').Util


function util_Object_typeOf() {
  console.log(`The following should print 'null':`)
  console.log(
    Util.Object.typeOf(null)
  )
  console.log(`The following should print 'array':`)
  console.log(
    Util.Object.typeOf([]),
    Util.Object.typeOf([false, 0, NaN, '', null, true, Infinity, 'true', {}, [] ])
  )
  console.log(`The following should print 'NaN':`)
  console.log(
    Util.Object.typeOf(NaN),
    Util.Object.typeOf(0 * 'true')
  )
  console.log(`The following should print 'infinite':`)
  console.log(
    Util.Object.typeOf(Infinity),
    Util.Object.typeOf(42 / 0)
  )
  console.log(`The following should print 'number':`)
  console.log(
    Util.Object.typeOf(42),
    Util.Object.typeOf(21 + 21)
  )
  console.log(`The following should print 'boolean':`)
  console.log(
    Util.Object.typeOf(true)
  )
  console.log(`The following should print 'string':`)
  console.log(
    Util.Object.typeOf('true')
  )
  console.log(`The following should print 'function':`)
  console.log(
    Util.Object.typeOf(function () { return 'true' })
  )
  console.log(`The following should print 'undefined':`)
  console.log(
    Util.Object.typeOf(undefined),
    Util.Object.typeOf(),
    Util.Object.typeOf((function () {
      let x;
      return x;
    })())
  )
}

function util_Object_typeOfNumber() {
  console.log(`The following should print 'integer':`)
  console.log(
    Util.Object.typeOfNumber(42)
  )
  console.log(`The following should print 'float':`)
  console.log(
    Util.Object.typeOfNumber(42.21)
  )
  console.log(`The following should throw a RangeError:`)
  try {
    console.log(
      Util.Object.typeOfNumber(Infinity)
    )
  } catch (e) {
    console.log(`an error was thrown: "${e}"`)
  }
  try {
    console.log(
      Util.Object.typeOfNumber(NaN)
    )
  } catch (e) {
    console.log(`an error was thrown: "${e}"`)
  }
}

function util_Object_is() {
  console.log(
    Util.Object.is({ background: 'none', 'font-weight': 'bold' }, {})
  )
}

function util_Object_cloneDeep() {
  let x = { first: 1, second: { value: 2 }, third: [1, '2', { v:3 }] }
  let y = Util.Object.cloneDeep(x)
  console.log(`x: ${x}`)
  console.log(`y: ${y}`)
  console.log(`x===y: ${x===y}`)
  console.log(`Util.Object.is(x,y): ${Util.Object.is(x,y)}`)
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
  ].map((f) => Util.Date.format(new Date(), f)))
}

// util_Object_typeOf();
// util_Object_typeOfNumber();
// util_Object_is();
// util_Object_cloneDeep();
// util_Date_format();
