import * as xjs from '../../index'
import test from './test'


export default Promise.all([
	test(xjs.Object.typeOf(null)                                                       , 'null'     ),
	test(xjs.Object.typeOf([])                                                         , 'array'    ),
	test(xjs.Object.typeOf([false, 0, NaN, '', null, true, Infinity, 'true', {}, [] ]) , 'array'    ),
	test(xjs.Object.typeOf(NaN)                                                        , 'NaN'      ),
	test(xjs.Object.typeOf(Infinity)                                                   , 'infinite' ),
	test(xjs.Object.typeOf(-42 / 0)                                                    , 'infinite' ),
	test(xjs.Object.typeOf(42)                                                         , 'number'   ),
	test(xjs.Object.typeOf(21 + 21)                                                    , 'number'   ),
	test(xjs.Object.typeOf(true)                                                       , 'boolean'  ),
	test(xjs.Object.typeOf('true')                                                     , 'string'   ),
	test(xjs.Object.typeOf(function () { return 'true' })                              , 'function' ),
	test(xjs.Object.typeOf(() => 'true')                                               , 'function' ),
	test(xjs.Object.typeOf(undefined)                                                  , 'undefined'),
	test(xjs.Object.typeOf(undefined)                                                  , 'undefined'),
	test(xjs.Object.typeOf((() => { let x; return x; })())                             , 'undefined'),
])
