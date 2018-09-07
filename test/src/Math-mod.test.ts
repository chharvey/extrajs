import * as xjs from '../../index'
import test from './test'


export default Promise.all([
	test(`${xjs.Math.mod(8, 6)}`, '2'),
	test(`${xjs.Math.mod(-8, 6)}`, '4'),
	test((() => { try { return `${xjs.Math.mod(8, 0)}`   } catch (e) { return e.code } })(), 'ERR_ASSERTION'),
	test((() => { try { return `${xjs.Math.mod(8, 0.5)}` } catch (e) { return e.code } })(), 'ERR_ASSERTION'),
])
