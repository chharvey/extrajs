import * as xjs from '../../index'
import test from './test'


export default Promise.all([
	// naturals
	test(`${xjs.BigInt.assertType( 42n , xjs.NumericType.NATURAL)}`, 'undefined'),
	test(`${xjs.BigInt.assertType( 0n  , xjs.NumericType.NATURAL)}`, 'undefined'),
	test(`${xjs.BigInt.assertType(-0n  , xjs.NumericType.NATURAL)}`, 'undefined'),
	test((() => { try { return `${xjs.BigInt.assertType(-42n, xjs.NumericType.NATURAL)}` } catch (e) { return e.code } })(), 'ERR_ASSERTION'),
	// wholes
	test(`${xjs.BigInt.assertType(42n, xjs.NumericType.WHOLE)}`, 'undefined'),
	test((() => { try { return `${xjs.BigInt.assertType(-42n , xjs.NumericType.WHOLE)}` } catch (e) { return e.code } })(), 'ERR_ASSERTION'),
	test((() => { try { return `${xjs.BigInt.assertType( 0n  , xjs.NumericType.WHOLE)}` } catch (e) { return e.code } })(), 'ERR_ASSERTION'),
	test((() => { try { return `${xjs.BigInt.assertType(-0n  , xjs.NumericType.WHOLE)}` } catch (e) { return e.code } })(), 'ERR_ASSERTION'),
])
