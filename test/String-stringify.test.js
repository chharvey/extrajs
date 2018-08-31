const xjs = require('../index.js')
const test = require('../lib/test.js')


module.exports = Promise.all([
	test(xjs.String.stringify({ an: 'object' })  , '{"an":"object"}'),
	test(xjs.String.stringify(['abc', 'def'])    , 'abcdef'),
	test(xjs.String.stringify(() => 'a function'), "() => 'a function'"),
	test(xjs.String.stringify('ghi')             , 'ghi'),
	test(xjs.String.stringify(123)               , '123'),
	test(xjs.String.stringify(false)             , 'false'),
	test(xjs.String.stringify(null)              , 'null'),
	test(xjs.String.stringify(undefined)         , 'undefined'),
]).then((arr) => true)
