import * as assert from 'assert'

import xjs_Object from './Object.class'


/**
 * Additional static members for the native Number class.
 *
 * Does not extend the native Number class.
 */
export default class xjs_Number {
  /**
   * Verify the type of number given, throwing if it does not match.
   *
   * Given a number and a "type", test to see if the number is of that type.
   * Mainly used for parameter validation, when the type `number` is not specific enough.
   * The acceptable "types", which are not mutually exclusive, follow:
   *
   * - `'integer'`      : the number is divisible by 1 (`num % 1 === 0`)
   * - `'natural'`      : the number is a non-negative integer (either positive or 0)
   * - `'whole'`        : the number is a positive integer
   * - `'float'`        : the number is not an integer
   * - `'positive'`     : the number is strictly greater than 0
   * - `'negative'`     : the number is strictly less    than 0
   * - `'non-positive'` : the number is less    than or equal to 0
   * - `'non-negative'` : the number is greater than or equal to 0
   * - `'finite'`       : the number is not equal to `Infinity` or `-Infinity`
   * - `'infinite'`     : the number is     equal to `Infinity` or `-Infinity`
   *
   * Note that if the given number does not match the given type,
   * or if the given number is `NaN`,
   * then this method will throw an error, instead of returning `false`.
   * This is useful for parameter validation.
   *
   * @param   num the number to test
   * @param   type one of the string literals listed above
   * @returns the number matches the described type
   * @throws  {Error} if the number does not match the describe type
   * @throws  {RangeError} if the argument is `NaN`
   */
	static assertType(num: number, type: 'float'|'integer'|'natural'|'whole'|'positive'|'negative'|'non-positive'|'non-negative'|'finite'|'infinite'): true {
		if (xjs_Object.typeOf(num) === 'NaN') throw new RangeError('Unacceptable argument `NaN`.')
		return xjs_Object.switch<true>(type, {
			'integer'     : (n: number) => assert( Number.isInteger(n)          , `${n} must be an integer.`            ) || true,
			'natural'     : (n: number) => assert( Number.isInteger(n) && 0 <= n, `${n} must be a non-negative integer.`) || true,
			'whole'       : (n: number) => assert( Number.isInteger(n) && 0 <  n, `${n} must be a positive integer.`    ) || true,
			'float'       : (n: number) => assert(!Number.isInteger(n)          , `${n} must not be an integer.`        ) || true,
			'positive'    : (n: number) => assert(0 < n                         , `${n} must be a positive number.`     ) || true,
			'negative'    : (n: number) => assert(n < 0                         , `${n} must be a negative number.`     ) || true,
			'non-positive': (n: number) => assert(n <= 0                        , `${n} must not be a positive number.` ) || true,
			'non-negative': (n: number) => assert(0 <= n                        , `${n} must not be a negative number.` ) || true,
			'finite'      : (n: number) => assert( Number.isFinite(n)           , `${n} must be a finite number.`       ) || true,
			'infinite'    : (n: number) => assert(!Number.isFinite(n)           , `${n} must be an infinite number.`    ) || true,
		})(num)
	}

	/**
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
		if (['NaN', 'infinite'].includes(xjs_Object.typeOf(num))) {
			throw new RangeError('Argument must be a finite number.')
		}
		return (Number.isInteger(num)) ? 'integer' : 'float'
	}


  private constructor() {}
}
