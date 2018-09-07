import * as xjs from '../../index'
import test from './test'


export default Promise.all([
	test(xjs.String.stringify({ an: 'object' })  , '{"an":"object"}'),
	test(xjs.String.stringify(['abc', 'def'])    , 'abcdef'),
	test(xjs.String.stringify(() => 'a function'), "() => 'a function'"),
	test(xjs.String.stringify('ghi')             , 'ghi'),
	test(xjs.String.stringify(123)               , '123'),
	test(xjs.String.stringify(false)             , 'false'),
	test(xjs.String.stringify(null)              , 'null'),
	test(xjs.String.stringify(undefined)         , 'undefined'),
])
