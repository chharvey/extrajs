import * as assert from 'assert'

import {NaNError} from './NaNError.class.js';
import {xjs_Object} from './Object.class.js';


export enum NumericType {
	INTEGER,
	NATURAL,
	WHOLE,
	FLOAT,
	POSITIVE,
	NEGATIVE,
	NONPOSITIVE,
	NONNEGATIVE,
	NONZERO,
	FINITE,
	INFINITE,
}

/**
 * Additional static members for the native Number class.
 *
 * Does not extend the native Number class.
 */
export class xjs_Number {
	/**
	 * An immutable RegExp instance, representing a string in Number format.
	 */
	static readonly REGEXP: Readonly<RegExp> = /^-?(?:\d+(?:\.\d+)?|\.\d+)$/

	/**
	 * Verify the type of number given, throwing if it does not match.
	 *
	 * Given a number and a "type", test to see if the argument is of that type.
	 * Mainly used for parameter validation, when the type `number` is not specific enough.
	 * The acceptable "types", which are not mutually exclusive, are members of {@link NumericType}:
	 *
	 * - `NumericType.INTEGER`     : the number is divisible by 1 (`num % 1 === 0`)
	 * - `NumericType.NATURAL`     : the number is a non-negative integer (either positive or 0)
	 * - `NumericType.WHOLE`       : the number is a positive integer
	 * - `NumericType.FLOAT`       : the number is not an integer
	 * - `NumericType.POSITIVE`    : the number is strictly greater than 0
	 * - `NumericType.NEGATIVE`    : the number is strictly less    than 0
	 * - `NumericType.NONPOSITIVE` : the number is less    than or equal to 0
	 * - `NumericType.NONNEGATIVE` : the number is greater than or equal to 0
	 * - `NumericType.NONZERO`     : the number is not equal to 0
	 * - `NumericType.FINITE`      : the number is not equal to `Infinity` or `-Infinity`
	 * - `NumericType.INFINITE`    : the number is     equal to `Infinity` or `-Infinity`
	 * - no type (`undefiend`): the number is not `NaN`
	 *
	 * If the argument matches the described type, this method returns `void` instead of `true`.
	 * If the argument does not match, this method throws an error instead of returning `false`.
	 * This pattern is helpful where an error message is more descriptive than a boolean.
	 *
	 * @param   num the argument to test
	 * @param   type one of the enum members listed above
	 * @throws  {AssertionError} if the argument does not match the described type
	 * @throws  {NaNError} if the argument is `NaN`
	 */
	static assertType(num: number, type?: NumericType|'integer'|'natural'|'whole'|'float'|'positive'|'negative'|'non-positive'|'non-negative'|'non-zero'|'finite'|'infinite'): void {
		if (Number.isNaN(num)) throw new NaNError()
		if (type === void 0) return;
		if (typeof type === 'string') {
			console.warn(new Error(`
				WARNING: Argument \`'${type}'\` was sent into \`xjs.Number.assertType\`.
				Sending a string argument is deprecated; use a member of enum \`NumericType\` instead.
			`.trim()))
			return xjs_Number.assertType(num, new Map<string, NumericType>([
				['integer'      , NumericType.INTEGER    ],
				['natural'      , NumericType.NATURAL    ],
				['whole'        , NumericType.WHOLE      ],
				['float'        , NumericType.FLOAT      ],
				['positive'     , NumericType.POSITIVE   ],
				['negative'     , NumericType.NEGATIVE   ],
				['non-positive' , NumericType.NONPOSITIVE],
				['non-negative' , NumericType.NONNEGATIVE],
				['non-zero'     , NumericType.NONZERO    ],
				['finite'       , NumericType.FINITE     ],
				['infinite'     , NumericType.INFINITE   ],
			]).get(type))
		}
		return new Map<NumericType, (n: number) => void>([
			[NumericType.INTEGER     , (n: number) => assert.ok( Number.isInteger(n)          , `${n} must be an integer.`            )],
			[NumericType.NATURAL     , (n: number) => assert.ok( Number.isInteger(n) && 0 <= n, `${n} must be a non-negative integer.`)],
			[NumericType.WHOLE       , (n: number) => assert.ok( Number.isInteger(n) && 0 <  n, `${n} must be a positive integer.`    )],
			[NumericType.FLOAT       , (n: number) => assert.ok(!Number.isInteger(n)          , `${n} must not be an integer.`        )],
			[NumericType.POSITIVE    , (n: number) => assert.ok(0 < n                         , `${n} must be a positive number.`     )],
			[NumericType.NEGATIVE    , (n: number) => assert.ok(n < 0                         , `${n} must be a negative number.`     )],
			[NumericType.NONPOSITIVE , (n: number) => assert.ok(n <= 0                        , `${n} must not be a positive number.` )],
			[NumericType.NONNEGATIVE , (n: number) => assert.ok(0 <= n                        , `${n} must not be a negative number.` )],
			[NumericType.NONZERO     , (n: number) => assert.ok(n !== 0                       , `${n} must not be zero.`              )],
			[NumericType.FINITE      , (n: number) => assert.ok( Number.isFinite(n)           , `${n} must be a finite number.`       )],
			[NumericType.INFINITE    , (n: number) => assert.ok(!Number.isFinite(n)           , `${n} must be an infinite number.`    )],
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
