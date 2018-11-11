import * as xjs from '../../index'
import test from './test'


export default Promise.all([
	test(`${xjs.Math.average(10, 20, 0.7)}`, '17'),
	test(`${xjs.Math.average(20, 10, 0.7)}`, '13'),
	test(`${xjs.Math.average(10, 20, 0.0)}`, '10'),
	test(`${xjs.Math.average(10, 20, 1.0)}`, '20'),
	test(`${xjs.Math.average(10, 20, 1.3)}`, '23'),
	test(`${xjs.Math.average(10, 20,-0.3)}`,  '7'),
	test((() => { try { return `${xjs.Math.average(Infinity, 0)}` } catch (e) { return e.code } })(), 'ERR_ASSERTION'),
	test((() => { try { return `${xjs.Math.average(NaN     , 0)}` } catch (e) { return e.name } })(), 'RangeError'   ),
])
