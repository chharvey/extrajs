import * as xjs from '../../index'
import test from './test'

function round(x: number): number {
	return Math.round(1000 * x) / 1000
}

export default Promise.all([
	test(`${round(xjs.Math.meanArithmetic(10, 15, 20))}`, `15`), // (10 + 15 + 20) / 3
	test(`${round(xjs.Math.meanGeometric ( 3,  4, 18))}`,  `6`), // ( 3 *  4 * 18) ** (1/3)
	test(`${round(xjs.Math.meanHarmonic  ( 9, 27, 54))}`, `18`), // 3 / (1/9 + 1/27 + 1/54)
	test((() => { try { return `${xjs.Math.meanArithmetic(10, 18, 20, Infinity)}` } catch (e) { return e.code } })(), 'ERR_ASSERTION'),
	test((() => { try { return `${xjs.Math.meanGeometric (10, 18, 20, Infinity)}` } catch (e) { return e.code } })(), 'ERR_ASSERTION'),
	test((() => { try { return `${xjs.Math.meanHarmonic  (10, 18, 20, Infinity)}` } catch (e) { return e.code } })(), 'ERR_ASSERTION'),
	test((() => { try { return `${xjs.Math.meanArithmetic(10, 18, 20, NaN     )}` } catch (e) { return e.name } })(), 'NaNError'     ),
	test((() => { try { return `${xjs.Math.meanGeometric (10, 18, 20, NaN     )}` } catch (e) { return e.name } })(), 'NaNError'     ),
	test((() => { try { return `${xjs.Math.meanHarmonic  (10, 18, 20, NaN     )}` } catch (e) { return e.name } })(), 'NaNError'     ),
])
