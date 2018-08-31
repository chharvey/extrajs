import xjs_Object from './Object.class'


/**
 * Additional static members for the native Number class.
 *
 * Does not extend the native Number class.
 */
export default class xjs_Number {
  /**
   * Verify the type of number given.
   *
   * If the number matches the given type, this method returns `true`.
   * If the number does not match, this method *returns* a `RangeError` object — it does not throw it.
   * This method throws an error if the argument is `NaN`.
   *
   * Given a number and a "type", test to see if the number is of that type.
   * Mainly used for parameter validation, when the type `number` is not specific enough.
   * The acceptable "types", which are not mutually exclusive, follow:
   *
   * - `'float'   ` : the number is not an integer
   * - `'integer' ` : the number is divisible by 1 (`num % 1 === 0`)
   * - `'natural' ` : the number is a non-negative integer (either positive or 0)
   * - `'whole'   ` : the number is a positive integer
   * - `'positive'` : the number is strictly greater than 0
   * - `'negative'` : the number is strictly less than 0
   * - `'finite'`   : the number is not equal to `Infinity` or `-Infinity`
   * - `'infinite'` : the number is     equal to `Infinity` or `-Infinity`
   *
   * @param   num the number to test
   * @param   type one of the string literals listed above
   * @returns does the number match the described type? | if false, a `RangeError` object
   * @throws  {RangeError} if `NaN` is given
   */
	static assertType(num: number, type: 'float'|'integer'|'natural'|'whole'|'positive'|'negative'|'finite'|'infinite'): true|RangeError {
		if (xjs_Object.typeOf(num) === 'NaN') throw new RangeError('Unacceptable argument `NaN`.')
		const returned = xjs_Object.switch<[boolean, string]>(type, {
			'float'   : (n: number) => [!Number.isInteger(n)          , `${n} must not be an integer.`        ],
			'integer' : (n: number) => [ Number.isInteger(n)          , `${n} must be an integer.`            ],
			'natural' : (n: number) => [ Number.isInteger(n) && 0 <= n, `${n} must be a non-negative integer.`],
			'whole'   : (n: number) => [ Number.isInteger(n) && 0 <  n, `${n} must be a positive integer.`    ],
			'positive': (n: number) => [0 < n                         , `${n} must be a positive number.`     ],
			'negative': (n: number) => [n < 0                         , `${n} must be a negative number.`     ],
			'finite'  : (n: number) => [ Number.isFinite(n)           , `${n} must be a finite number.`       ],
			'infinite': (n: number) => [!Number.isFinite(n)           , `${n} must be an infinite number.`    ],
		})(num)
		return (returned[0]) ? true : new RangeError(returned[1])
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
