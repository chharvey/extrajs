import * as assert from 'assert'
import {xjs_Math} from '../src/class/Math.class.js';
import {NaNError} from '../src/class/NaNError.class.js';

describe('xjs.Math', () => {
	describe('.mod(number, number|bigint): number', () => {
		it('acts like `x % y` for positive `x`.', () => {
			assert.strictEqual(xjs_Math.mod( 8, 6), 2)
		})
		it('acts like `x % y + y` for negative `x`.', () => {
			assert.strictEqual(xjs_Math.mod(-8, 6), 4)
		})
		it('throws when `b` is `0`.', () => {
			assert.throws(() => xjs_Math.mod(8, 0), assert.AssertionError)
		})
		it('throws when `b` is a non-integer.', ()=> {
			assert.throws(() => xjs_Math.mod(8, 0.5), assert.AssertionError)
		})
	})

	describe('.clamp(number, number, number): number', () => {
		it('clamps a number between bounds.', () => {
			assert.strictEqual(xjs_Math.clamp(1, 3, 5), 3)
			assert.strictEqual(xjs_Math.clamp(3, 1, 5), 3)
			assert.strictEqual(xjs_Math.clamp(1, 5, 3), 3)
			assert.strictEqual(xjs_Math.clamp(5, 3, 1), 3)
		})
	})

	describe('.meanArithmetic(...number[]): number', () => {
		it('returs the arithmetic mean of all arguments.', () => {
			assert.strictEqual(xjs_Math.meanArithmetic(10, 15, 20), 15) // (10 + 15 + 20) / 3
		})
		it('throws when ±`Infinity` or `NaN` is received.', () => {
			assert.throws(() => xjs_Math.meanArithmetic(10, 18, 20, Infinity), assert.AssertionError)
			assert.throws(() => xjs_Math.meanArithmetic(10, 18, 20, NaN     ), NaNError)
		})
	})

	describe('.meanGeometric(...number[]): number', () => {
		it('returs the geometric mean of all arguments.', () => {
			assert.strictEqual(xjs_Math.meanGeometric(3, 4, 18), 6) // (3 * 4 * 18) ** (1/3)
		})
		it('throws when ±`Infinity` or `NaN` is received.', () => {
			assert.throws(() => xjs_Math.meanGeometric(10, 18, 20, Infinity), assert.AssertionError)
			assert.throws(() => xjs_Math.meanGeometric(10, 18, 20, NaN     ), NaNError)
		})
	})

	describe('.meanHarmonic(...number[]): number', () => {
		it('returs the harmonic mean of all arguments.', () => {
			assert.strictEqual(xjs_Math.meanHarmonic(9, 27, 54), 18) // 3 / (1/9 + 1/27 + 1/54)
		})
		it('throws when ±`Infinity` or `NaN` is received.', () => {
			assert.throws(() => xjs_Math.meanHarmonic(10, 18, 20, Infinity), assert.AssertionError)
			assert.throws(() => xjs_Math.meanHarmonic(10, 18, 20, NaN     ), NaNError)
		})
	})

	describe('.interpolateArithmetic(number, number, number?): number', () => {
		it('computes arithmetic interpolation.', () => {
			assert.strictEqual(xjs_Math.interpolateArithmetic(10, 20,  0.7), 17)
			assert.strictEqual(xjs_Math.interpolateArithmetic(20, 10,  0.7), 13)
			assert.strictEqual(xjs_Math.interpolateArithmetic(10, 20,  0.0), 10)
			assert.strictEqual(xjs_Math.interpolateArithmetic(10, 20,  1.0), 20)
			assert.strictEqual(xjs_Math.interpolateArithmetic(10, 20,  1.3), 23)
			assert.strictEqual(xjs_Math.interpolateArithmetic(10, 20, -0.3),  7)
		})
		it('throws when ±`Infinity` or `NaN` is received.', () => {
			assert.throws(() => xjs_Math.interpolateArithmetic(Infinity, 0), assert.AssertionError)
			assert.throws(() => xjs_Math.interpolateArithmetic(NaN     , 0), NaNError)
		})
	})

	describe('.interpolateGeometric(number, number, number?): number', () => {
		it('computes geometric interpolation.', () => {
			assert.strictEqual(Math.round(xjs_Math.interpolateGeometric(10, 20,  0.7) * 1000) / 1000, 16.245)
			assert.strictEqual(Math.round(xjs_Math.interpolateGeometric(20, 10,  0.7) * 1000) / 1000, 12.311)
			assert.strictEqual(Math.round(xjs_Math.interpolateGeometric(10, 20,  0.0) * 1000) / 1000, 10    )
			assert.strictEqual(Math.round(xjs_Math.interpolateGeometric(10, 20,  1.0) * 1000) / 1000, 20    )
			assert.strictEqual(Math.round(xjs_Math.interpolateGeometric(10, 20,  1.3) * 1000) / 1000, 24.623)
			assert.strictEqual(Math.round(xjs_Math.interpolateGeometric(10, 20, -0.3) * 1000) / 1000,  8.123)
		})
		it('throws when ±`Infinity` or `NaN` is received.', () => {
			assert.throws(() => xjs_Math.interpolateGeometric(Infinity, 0), assert.AssertionError)
			assert.throws(() => xjs_Math.interpolateGeometric(NaN     , 0), NaNError)
		})
	})
})
