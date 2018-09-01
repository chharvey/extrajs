import * as xjs from '../../index'
import test from './test'


export default Promise.all([
	test(`${xjs.Math.clamp(1, 3, 5)}`, '3'),
	test(`${xjs.Math.clamp(3, 1, 5)}`, '3'),
	test(`${xjs.Math.clamp(1, 5, 3)}`, '3'),
	test(`${xjs.Math.clamp(5, 3, 1)}`, '3'),
])
