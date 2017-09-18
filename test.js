var Util    = require('./index.js').Util
var Element = require('./index.js').Element


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

function element() {
  let x = new Element('span')
  console.log(x)
  console.log(x.html())
  console.log(x.name)
  console.log(x.isVoid)
  console.log(x.attributes)
  console.log(x.styles)
  console.log(x.dataset)
  console.log(x.contents)

  try {
    let y = new Element('meta').addContents('hello world')
    console.log(y.html())
  } catch (e) {
    console.log(`Failed to add contents to a void element.`)
  }

}

function element_attr() {
  let x = new Element('span')
  console.log(`new Element:\t`, x.html())
  x = x.attr('attr1','val1')
  console.log(`set attr1="val1":\t`, x.html())
  let y = x.attr('attr1')
  console.log(`get attr1:\t`, y)
  x = x.attr('attr2','')
  console.log(`set attr2="":\t`, x.html())
  x = x.attr('attr2',null)
  console.log(`remove attr2:\t`, x.html())
  x = x.attr('attr3',function () { return this.attr('attr1') })
  console.log(`set attr3 to value of attr1:\t`, x.html())
  try {
    x = x.attr()
    console.log(`provide no args to #attr():\t`, x.html())
  } catch (e) {
    console.log(`failed to call #attr() with no args: ${e}:\t`)
  }
  x = x.attr({
    attr1withobj: 'string',
    attr2withobj: 42,
    attr3withobj: true,
    attr4withobj: function () { return `${this.name} is ${(!this.isVoid)?'not ':''}void` },
    attr2: null,
  })
  console.log(`set/remove multiple attributes of multiple types:\t`, x.html())
  x = x.attr({})
  console.log(`pass empty object to #attr():\t`, x.html())
  try {
    let myvar; // undefined
    x = x.attr({
      undefinedattriute: myvar
    })
    console.log(`pass undefined as obj value to #attr():\t`, x.html())
  } catch (e) {
    console.log(`failed to pass undefined in object to #attr(): ${e}:\t`)
  }
  try {
    x = x.attr('trying-NaN',NaN)
  } catch (e) {
    console.log(`failed to pass NaN to #attr(): ${e}:\t`, x.html())
  }
  x = x.attr('ternary1', (true) ? 'true' : null)
  console.log(`set attributes with ternary:\t`, x.html())
  x = x.attr('ternary2', (false) ? 'true' : null)
  console.log(`remove attributes with ternary:\t`, x.html())

  console.log(`get all attriutes in object form:\t`, x.attributes)
}

function element_style() {
  let x = new Element('span')
  let y = new Element('strong')
  let z = new Element('em')
  let w = new Element('small')

  let str = 'background:none; font-weight:bold;'
  let obj = {
    background   : 'none',
    'font-weight': 'bold',
  }
  let fn = function () {
    return `content: ${this.name.slice(1)};`
  }

  console.log(x.style(str).html())
  console.log(y.style(obj).html())
  console.log(z.style(fn).html())
  console.log(w.style(str).style(obj).style(fn).style(null).html())
  console.log(z.styles)
}

function element_css() {
  let x = new Element('span')
  let y = new Element('strong')
  let z = new Element('em')
  let w = new Element('small')

  let str = 'background:none; font-weight:bold;'
  let obj = {
    color       : 'blue',
    'font-style': 'itlaic',
  }
  let fn = function () {
    return this.name.slice(1)
  }

  console.log(x.style(str).styles)
  console.log(x.css('opacity', .3).styles)
  console.log(x.css('background',null).styles)
  console.log(x.css('content',fn).styles)
  console.log(x.css('font-weight'))
  console.log(x.css(obj).styles)
  console.log(x.css())
}

function element_data() {
  let x = new Element('span')
  try {
    x = x.data('foo','bar')
    console.log(`x.data('foo','bar'):\t`, x.html())
  } catch (e) {
    console.log(`failed to set #data('foo','bar'): ${e}:\t`)
  }
  try {
    let y = x.data('foo')
    console.log(`x.data('foo'):\t`, y)
  } catch (e) {
    console.log(`failed to get #data('foo'): ${e}:\t`)
  }
  try {
    let u;
    z = x.data('foo',u)
    console.log(`x.data('foo',undefined):\t`, z)
  } catch (e) {
    console.log(`failed to set #data('foo',undefined): ${e}:\t`)
  }
  try {
    x = x.data('baz', function () { return this.data('foo') })
    console.log(`x.data('baz', <function>):\t`, x.html())
  } catch (e) {
    console.log(`failed to set #data('baz',<function>): ${e}:\t`)
  }
  try {
    x = x.data('foo', null)
    console.log(`x.data('foo', null):\t`, x.html())
  } catch (e) {
    console.log(`failed to remove with #data('foo',null): ${e}:\t`)
  }
  try {
    a = x.data()
    console.log(`x.data():\t`, a)
  } catch (e) {
    console.log(`failed to call #data() with no args: ${e}:\t`)
  }
  let s = new Element('span')
  console.log(x.dataset)
  console.log(s.dataset)
}

function element_concat() {
  console.log(
    `concatenate arguments`,
    Element.concat(
      new Element('em'),
      new Element('strong'),
      new Element('mark')
    )
  )
  console.log(
    `concatenate null arguments`,
    Element.concat(
      new Element('em'),
      null,
      new Element('mark')
    )
  )
  console.log(
    `concatenate array`,
    Element.concat([
      new Element('em'),
      new Element('strong'),
      new Element('mark'),
    ])
  )
  console.log(
    `concatenate array with null entry`,
    Element.concat([
      new Element('em'),
      null,
      new Element('mark'),
    ])
  )
}

// util_Object_typeOf();
// util_Object_typeOfNumber();
// util_Object_is();
// util_Object_cloneDeep();
// util_Date_format();
// element();
// element_attr();
// element_style();
// element_css();
// element_data();
// element_concat();
