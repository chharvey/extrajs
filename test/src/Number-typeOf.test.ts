import * as xjs from '../../index'
import test from './test'


export default Promise.all([
	test(xjs.Number.typeOf(42)    , 'integer'),
	test(xjs.Number.typeOf(-42)   , 'integer'),
	test(xjs.Number.typeOf(0)     , 'integer'),
	test(xjs.Number.typeOf(-0)    , 'integer'),
	test(xjs.Number.typeOf(24.00) , 'integer'),
	test(xjs.Number.typeOf(-24.00), 'integer'),
	test(xjs.Number.typeOf(42.24) , 'float'  ),
	test(xjs.Number.typeOf(-42.24), 'float'  ),
	test((() => { try { return xjs.Number.typeOf(NaN     ) } catch (e) { return e.name } })(), 'RangeError'),
	test((() => { try { return xjs.Number.typeOf(Infinity) } catch (e) { return e.name } })(), 'RangeError'),
])
