import * as assert from 'assert'
import xjs_BigInt from '../src/class/BigInt.class.js';
import {NumericType} from '../src/class/Number.class.js';

describe('xjs.BigInt', () => {
	describe('.assertType(bigint, NumericType?): void', () => {
		it('returns `void` if no type is given.', () => {
			assert.ifError(xjs_BigInt.assertType(42n))
		})
		it('returns `void` if correct.', () => {
			new Map<NumericType, readonly bigint[]>([
				[NumericType.NATURAL  , [42n, 0n, -0n]],
				[NumericType.WHOLE    , [42n]],
			]).forEach((numbers, type) => {
				numbers.forEach((n) => {
					assert.ifError(xjs_BigInt.assertType(n, type))
				})
			})
		})
		it('throws if incorrect.', () => {
			new Map<NumericType, readonly bigint[]>([
				[NumericType.NATURAL  , [-42n]],
				[NumericType.WHOLE    , [-42n, 0n, -0n]],
			]).forEach((numbers, type) => {
				numbers.forEach((n) => {
					assert.throws(() => xjs_BigInt.assertType(n, type), assert.AssertionError)
				})
			})
		})
	})
})
