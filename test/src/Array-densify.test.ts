import * as xjs from '../../index'
import test from './test'


let x: number[] = new Array(5)
x[1] = 42
x[3] = 48

export default Promise.all([
	test(x                   .join(), ',42,,48,'),
	test(xjs.Array.densify(x).join(), '42,48'   ),
])
