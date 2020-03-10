import * as assert from 'assert'


/**
 * Additional static members for the native BigInt class.
 *
 * Does not extend the native BigInt class.
 */
export default class xjs_BigInt {
	/**
	* Verify the type of bigint given, throwing if it does not match.
	*
	* Given a bigint and a "type", test to see if the argument is of that type.
	* Mainly used for parameter validation, when the type `bigint` is not specific enough.
	* The acceptable "types", which are not mutually exclusive, follow:
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
	* @param   int the argument to test
	* @param   type one of the string literals listed above
	* @throws  {AssertionError} if the argument does not match the described type
	*/
	static assertType(int: bigint, type?: 'float'|'integer'|'natural'|'whole'|'positive'|'negative'|'non-positive'|'non-negative'|'non-zero'|'finite'|'infinite'): void {
		if (!type) return;
		return new Map<string, (n: bigint) => void>([
			['integer'     , (_n: bigint) => {}],
			['natural'     , ( n: bigint) => xjs_BigInt.assertType(n, 'non-negative')],
			['whole'       , ( n: bigint) => xjs_BigInt.assertType(n, 'positive'    )],
			['float'       , ( n: bigint) => assert(false   , `${n} must not be an integer.`    )],
			['positive'    , ( n: bigint) => assert(0n <  n , `${n} must be positive.`          )],
			['negative'    , ( n: bigint) => assert(n  <  0n, `${n} must be negative.`          )],
			['non-positive', ( n: bigint) => assert(n  <= 0n, `${n} must not be positive.`      )],
			['non-negative', ( n: bigint) => assert(0n <= n , `${n} must not be negative.`      )],
			['non-zero'    , ( n: bigint) => assert(n !== 0n, `${n} must not be zero.`          )],
			['finite'      , ( n: bigint) => assert(true    , `${n} must be a finite number.`   )],
			['infinite'    , ( n: bigint) => assert(false   , `${n} must be an infinite number.`)],
		]).get(type) !(int)
	}


  private constructor() {}
}
