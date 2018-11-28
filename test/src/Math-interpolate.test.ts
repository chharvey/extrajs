import * as xjs from '../../index'
import test from './test'


export default Promise.all([
	test(`${xjs.Math.interpolateArithmetic(10, 20, 0.7)}`, '17'),
	test(`${xjs.Math.interpolateArithmetic(20, 10, 0.7)}`, '13'),
	test(`${xjs.Math.interpolateArithmetic(10, 20, 0.0)}`, '10'),
	test(`${xjs.Math.interpolateArithmetic(10, 20, 1.0)}`, '20'),
	test(`${xjs.Math.interpolateArithmetic(10, 20, 1.3)}`, '23'),
	test(`${xjs.Math.interpolateArithmetic(10, 20,-0.3)}`,  '7'),
	test((() => { try { return `${xjs.Math.interpolateArithmetic(Infinity, 0)}` } catch (e) { return e.code } })(), 'ERR_ASSERTION'),
	test((() => { try { return `${xjs.Math.interpolateArithmetic(NaN     , 0)}` } catch (e) { return e.name } })(), 'NaNError'     ),
	test(`${Math.round(xjs.Math.interpolateGeometric(10, 20, 0.7) * 1000) / 1000}`, '16.245'),
	test(`${Math.round(xjs.Math.interpolateGeometric(20, 10, 0.7) * 1000) / 1000}`, '12.311'),
	test(`${Math.round(xjs.Math.interpolateGeometric(10, 20, 0.0) * 1000) / 1000}`, '10'),
	test(`${Math.round(xjs.Math.interpolateGeometric(10, 20, 1.0) * 1000) / 1000}`, '20'),
	test(`${Math.round(xjs.Math.interpolateGeometric(10, 20, 1.3) * 1000) / 1000}`, '24.623'),
	test(`${Math.round(xjs.Math.interpolateGeometric(10, 20,-0.3) * 1000) / 1000}`,  '8.123'),
	test((() => { try { return `${xjs.Math.interpolateGeometric(Infinity, 0)}` } catch (e) { return e.code } })(), 'ERR_ASSERTION'),
	test((() => { try { return `${xjs.Math.interpolateGeometric(NaN     , 0)}` } catch (e) { return e.name } })(), 'NaNError'     ),
])
