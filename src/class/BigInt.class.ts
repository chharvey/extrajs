import * as assert from 'assert';

import {NumericType} from './Number.class.js';


/**
 * Additional static members for the native BigInt class.
 *
 * Does not extend the native BigInt class.
 */
export class xjs_BigInt {
	/**
	 * Verify the type of bigint given, throwing if it does not match.
	 *
	 * Given a bigint and a "type", test to see if the argument is of that type.
	 * Mainly used for parameter validation, when the type `bigint` is not specific enough.
	 * The acceptable "types", which are not mutually exclusive, are members of {@link NumericType}:
	 *
	 * - `NumericType.INTEGER`     : always matches: BigInts are always integers
	 * - `NumericType.NATURAL`     : synonym of `NumericType.NONNEGATIVE`
	 * - `NumericType.WHOLE`       : synonym of `NumericType.POSITIVE`
	 * - `NumericType.FLOAT`       : never matches: BigInts are never non-integers
	 * - `NumericType.POSITIVE`    : the bigint is strictly greater than 0n
	 * - `NumericType.NEGATIVE`    : the bigint is strictly less    than 0n
	 * - `NumericType.NONPOSITIVE` : the bigint is less    than or equal to 0n
	 * - `NumericType.NONNEGATIVE` : the bigint is greater than or equal to 0n
	 * - `NumericType.NONZERO`     : the bigint is not equal to 0n
	 * - `NumericType.FINITE`      : always matches: BigInts are always finite
	 * - `NumericType.INFINITE`    : never matches: BigInts are never finite
	 * - no type (`undefiend`): always matches
	 *
	 * If the argument matches the described type, this method returns `void` instead of `true`.
	 * If the argument does not match, this method throws an error instead of returning `false`.
	 * This pattern is helpful where an error message is more descriptive than a boolean.
	 *
	 * @param   int the argument to test
	 * @param   type one of the string literals listed above
	 * @throws  {AssertionError} if the argument does not match the described type
	 */
	public static assertType(int: bigint, type?: NumericType): void {
		if (type === void 0) {
			return;
		}
		return new Map<NumericType, (n: bigint) => void>([
			[NumericType.INTEGER,     (_n) => assert.ok(true, 'BigInts are always integers.')],
			[NumericType.NATURAL,     ( n) => xjs_BigInt.assertType(n, NumericType.NONNEGATIVE)],
			[NumericType.WHOLE,       ( n) => xjs_BigInt.assertType(n, NumericType.POSITIVE)],
			[NumericType.FLOAT,       (_n) => assert.ok(false,    'BigInts cannot be non-integers.')],
			[NumericType.POSITIVE,    ( n) => assert.ok(0n <  n,  `${ n } must be positive.`)],
			[NumericType.NEGATIVE,    ( n) => assert.ok(n  <  0n, `${ n } must be negative.`)],
			[NumericType.NONPOSITIVE, ( n) => assert.ok(n  <= 0n, `${ n } must not be positive.`)],
			[NumericType.NONNEGATIVE, ( n) => assert.ok(0n <= n,  `${ n } must not be negative.`)],
			[NumericType.NONZERO,     ( n) => assert.ok(n !== 0n, `${ n } must not be zero.`)],
			[NumericType.FINITE,      (_n) => assert.ok(true,  'BigInts are always finite.')],
			[NumericType.INFINITE,    (_n) => assert.ok(false, 'BigInts cannot be infinite.')],
		]).get(type)!(int);
	}


	private constructor() {}
}
