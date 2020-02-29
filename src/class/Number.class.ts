import * as assert from 'assert'

import NaNError from './NaNError.class'
import xjs_Object from './Object.class'


/**
 * Additional static members for the native Number class.
 *
 * Does not extend the native Number class.
 */
export default class xjs_Number {
	/**
	 * An immutable RegExp instance, representing a string in Number format.
	 */
	static readonly REGEXP: Readonly<RegExp> = /^-?(?:\d+(?:\.\d+)?|\.\d+)$/

  /**
   * Verify the type of number or bigint given, throwing if it does not match.
   *
   * Given a number or bigint and a "type", test to see if the argument is of that type.
   * Mainly used for parameter validation, when the type `number` is not specific enough.
   * The acceptable "types", which are not mutually exclusive, follow:
   *
   * Types for numbers:
   *
   * - `'integer'`      : the number is divisible by 1 (`num % 1 === 0`)
   * - `'natural'`      : the number is a non-negative integer (either positive or 0)
   * - `'whole'`        : the number is a positive integer
   * - `'float'`        : the number is not an integer
   * - `'positive'`     : the number is strictly greater than 0
   * - `'negative'`     : the number is strictly less    than 0
   * - `'non-positive'` : the number is less    than or equal to 0
   * - `'non-negative'` : the number is greater than or equal to 0
   * - `'non-zero'`     : the number is not equal to 0
   * - `'finite'`       : the number is not equal to `Infinity` or `-Infinity`
   * - `'infinite'`     : the number is     equal to `Infinity` or `-Infinity`
   * - no type (`undefiend`): the number is not `NaN`
   *
   * Types for bigints:
   *
   * - `'integer'`      : always matches
   * - `'natural'`      : synonym of `'non-negative'`
   * - `'whole'`        : synonym of `'positive'`
   * - `'float'`        : never matches
   * - `'positive'`     : the bigint is strictly greater than 0n
   * - `'negative'`     : the bigint is strictly less    than 0n
   * - `'non-positive'` : the bigint is less    than or equal to 0n
   * - `'non-negative'` : the bigint is greater than or equal to 0n
   * - `'non-zero'`     : the bigint is not equal to 0n
   * - `'finite'`       : always matches
   * - `'infinite'`     : never matches
   * - no type (`undefiend`): always matches
   *
   * If the argument matches the described type, this method returns `void` instead of `true`.
   * If the argument does not match, this method throws an error instead of returning `false`.
   * This pattern is helpful where an error message is more descriptive than a boolean.
   *
   * @param   num the argument to test
   * @param   type one of the string literals listed above
   * @throws  {AssertionError} if the argument does not match the described type
   * @throws  {NaNError} if the argument is `NaN`
   */
	static assertType(num: number|bigint, type?: 'float'|'integer'|'natural'|'whole'|'positive'|'negative'|'non-positive'|'non-negative'|'non-zero'|'finite'|'infinite'): void {
		if (typeof num === 'number' && Number.isNaN(num)) throw new NaNError()
		if (!type) return;
		return (typeof num === 'number') ? new Map<string, (n: number) => void>([
			['integer'     , (n: number) => assert( Number.isInteger(n)          , `${n} must be an integer.`            )],
			['natural'     , (n: number) => assert( Number.isInteger(n) && 0 <= n, `${n} must be a non-negative integer.`)],
			['whole'       , (n: number) => assert( Number.isInteger(n) && 0 <  n, `${n} must be a positive integer.`    )],
			['float'       , (n: number) => assert(!Number.isInteger(n)          , `${n} must not be an integer.`        )],
			['positive'    , (n: number) => assert(0 < n                         , `${n} must be a positive number.`     )],
			['negative'    , (n: number) => assert(n < 0                         , `${n} must be a negative number.`     )],
			['non-positive', (n: number) => assert(n <= 0                        , `${n} must not be a positive number.` )],
			['non-negative', (n: number) => assert(0 <= n                        , `${n} must not be a negative number.` )],
			['non-zero'    , (n: number) => assert(n !== 0                       , `${n} must not be zero.`              )],
			['finite'      , (n: number) => assert( Number.isFinite(n)           , `${n} must be a finite number.`       )],
			['infinite'    , (n: number) => assert(!Number.isFinite(n)           , `${n} must be an infinite number.`    )],
		]).get(type) !(num) : new Map<string, (n: bigint) => void>([
			['integer'     , (_n: bigint) => {}],
			['natural'     , ( n: bigint) => xjs_Number.assertType(n, 'non-negative')],
			['whole'       , ( n: bigint) => xjs_Number.assertType(n, 'positive'    )],
			['float'       , ( n: bigint) => assert(false   , `${n} must not be an integer.`    )],
			['positive'    , ( n: bigint) => assert(0n <  n , `${n} must be positive.`          )],
			['negative'    , ( n: bigint) => assert(n  <  0n, `${n} must be negative.`          )],
			['non-positive', ( n: bigint) => assert(n  <= 0n, `${n} must not be positive.`      )],
			['non-negative', ( n: bigint) => assert(0n <= n , `${n} must not be negative.`      )],
			['non-zero'    , ( n: bigint) => assert(n !== 0n, `${n} must not be zero.`          )],
			['finite'      , ( n: bigint) => assert(true    , `${n} must be a finite number.`   )],
			['infinite'    , ( n: bigint) => assert(false   , `${n} must be an infinite number.`)],
		]).get(type) !(num)
	}

	/**
	 * @deprecated use {@link xjs_Number.assertType}
	 * Specify the type of number given.
	 *
	 * If the number is finite, return one of the following strings:
	 *
	 * - `'integer'` : the number is an integer, that is, `num % 1 === 0`
	 * - `'float'`   : the number is not an integer
	 *
	 * Else, throw a `RangeError` (the argument is of the correct type but does not qualify).
	 * @param   num the given number
	 * @returns one of the strings described above
	 * @throws  {RangeError} if the given arguemnt was not a finite number
	 */
	static typeOf(num: number): 'integer'|'float' {
		console.warn('`xjs.Number.typeOf` is DEPRECATED: use `xjs.Number.assertType` instead.')
		if (['NaN', 'infinite'].includes(xjs_Object.typeOf(num))) {
			throw new RangeError('Argument must be a finite number.')
		}
		return (Number.isInteger(num)) ? 'integer' : 'float'
	}


  private constructor() {}
}
