import * as xjs from '../../index'
import test from './test'


export default Promise.all([
	// floats
	test(`${xjs.Number.assertType( 42.24, 'float')}`, 'true'),
	test(`${xjs.Number.assertType(-42.24, 'float')}`, 'true'),
	test((() => { try { return `${xjs.Number.assertType( 42, 'float')}` } catch (e) { return e.code } })(), 'ERR_ASSERTION'),
	test((() => { try { return `${xjs.Number.assertType(-42, 'float')}` } catch (e) { return e.code } })(), 'ERR_ASSERTION'),
	// integers
	test(`${xjs.Number.assertType( 42   , 'integer')}`, 'true'),
	test(`${xjs.Number.assertType(-42   , 'integer')}`, 'true'),
	test(`${xjs.Number.assertType( 0    , 'integer')}`, 'true'),
	test(`${xjs.Number.assertType(-0    , 'integer')}`, 'true'),
	test(`${xjs.Number.assertType( 24.00, 'integer')}`, 'true'),
	test(`${xjs.Number.assertType(-24.00, 'integer')}`, 'true'),
	test((() => { try { return `${xjs.Number.assertType( 42.24, 'integer')}` } catch (e) { return e.code } })(), 'ERR_ASSERTION'),
	test((() => { try { return `${xjs.Number.assertType(-42.24, 'integer')}` } catch (e) { return e.code } })(), 'ERR_ASSERTION'),
	// naturals
	test(`${xjs.Number.assertType( 42   , 'natural')}`, 'true'),
	test(`${xjs.Number.assertType( 0    , 'natural')}`, 'true'),
	test(`${xjs.Number.assertType(-0    , 'natural')}`, 'true'),
	test(`${xjs.Number.assertType( 24.00, 'natural')}`, 'true'),
	test((() => { try { return `${xjs.Number.assertType(-42   , 'natural')}` } catch (e) { return e.code } })(), 'ERR_ASSERTION'),
	test((() => { try { return `${xjs.Number.assertType(-24.00, 'natural')}` } catch (e) { return e.code } })(), 'ERR_ASSERTION'),
	test((() => { try { return `${xjs.Number.assertType( 42.24, 'natural')}` } catch (e) { return e.code } })(), 'ERR_ASSERTION'),
	test((() => { try { return `${xjs.Number.assertType(-42.24, 'natural')}` } catch (e) { return e.code } })(), 'ERR_ASSERTION'),
	// wholes
	test(`${xjs.Number.assertType( 42   , 'whole')}`, 'true'),
	test(`${xjs.Number.assertType( 24.00, 'whole')}`, 'true'),
	test((() => { try { return `${xjs.Number.assertType(-42   , 'whole')}` } catch (e) { return e.code } })(), 'ERR_ASSERTION'),
	test((() => { try { return `${xjs.Number.assertType( 0    , 'whole')}` } catch (e) { return e.code } })(), 'ERR_ASSERTION'),
	test((() => { try { return `${xjs.Number.assertType(-0    , 'whole')}` } catch (e) { return e.code } })(), 'ERR_ASSERTION'),
	test((() => { try { return `${xjs.Number.assertType(-24.00, 'whole')}` } catch (e) { return e.code } })(), 'ERR_ASSERTION'),
	// infinites
	test(`${xjs.Number.assertType( Infinity, 'infinite')}`, 'true'),
	test(`${xjs.Number.assertType(-Infinity, 'infinite')}`, 'true'),
	test((() => { try { return `${xjs.Number.assertType( 42    , 'infinite')}` } catch (e) { return e.code } })(), 'ERR_ASSERTION'),
	test((() => { try { return `${xjs.Number.assertType(-42    , 'infinite')}` } catch (e) { return e.code } })(), 'ERR_ASSERTION'),
	test((() => { try { return `${xjs.Number.assertType( 0     , 'infinite')}` } catch (e) { return e.code } })(), 'ERR_ASSERTION'),
	test((() => { try { return `${xjs.Number.assertType(-0     , 'infinite')}` } catch (e) { return e.code } })(), 'ERR_ASSERTION'),
	test((() => { try { return `${xjs.Number.assertType( 24.00 , 'infinite')}` } catch (e) { return e.code } })(), 'ERR_ASSERTION'),
	test((() => { try { return `${xjs.Number.assertType(-24.00 , 'infinite')}` } catch (e) { return e.code } })(), 'ERR_ASSERTION'),
	test((() => { try { return `${xjs.Number.assertType( 42.24 , 'infinite')}` } catch (e) { return e.code } })(), 'ERR_ASSERTION'),
	test((() => { try { return `${xjs.Number.assertType(-42.24 , 'infinite')}` } catch (e) { return e.code } })(), 'ERR_ASSERTION'),
	// errors
	test((() => { try { return xjs.Number.assertType(NaN, 'positive') } catch (e) { return e.name } })(), 'RangeError'),
])
