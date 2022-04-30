import * as assert from 'assert'
import xjs_Number, {NumericType} from '../src/class/Number.class.js';
import NaNError from '../src/class/NaNError.class.js';

describe('xjs.Number', () => {
	describe('.assertType(number, NumericType?): void', () => {
		it('returns `void` if no type is given.', () => {
			assert.ifError(xjs_Number.assertType(42.24))
		})
		it('returns `void` if correct.', () => {
			new Map<NumericType, readonly number[]>([
				[NumericType.INTEGER  , [42, -42, 0, -0, 24.00, -24.00]],
				[NumericType.NATURAL  , [42, 0, -0, 24.00]],
				[NumericType.WHOLE    , [42, 24.00]],
				[NumericType.FLOAT    , [42.24, -42.24]],
				[NumericType.INFINITE , [Infinity, -Infinity]],
			]).forEach((numbers, type) => {
				numbers.forEach((n) => {
					assert.ifError(xjs_Number.assertType(n, type))
				})
			})
		})
		it('throws if incorrect.', () => {
			new Map<NumericType, readonly number[]>([
				[NumericType.INTEGER  , [42.24, -42.24]],
				[NumericType.NATURAL  , [-42, -24.00, 42.24, -42.24]],
				[NumericType.WHOLE    , [-42, 0, -0, -24.00]],
				[NumericType.FLOAT    , [42, -42]],
				[NumericType.INFINITE , [42, -42, 0, -0, 24.00, -24.00, 42.24, -42.24]],
			]).forEach((numbers, type) => {
				numbers.forEach((n) => {
					assert.throws(() => xjs_Number.assertType(n, type), assert.AssertionError)
				})
			})
		})
		it('throws if `NaN` is received.', () => {
			assert.throws(() => xjs_Number.assertType(NaN, NumericType.POSITIVE), NaNError)
		})
	})
})
