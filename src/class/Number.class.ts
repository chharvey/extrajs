import xjs_Object from './Object.class'


/**
 * Additional static members for the native Number class.
 *
 * Does not extend the native Number class.
 */
export default class xjs_Number {
  /**
   * Specify the type of number given.
   *
   * If the number is finite, return one of the following strings:
   * - `'integer'` : the number is an integer, that is, `num % 1 === 0`
   * - `'float'`   : the number is not an integer
   * Else, throw a `RangeError` (the argument is of the correct type but does not qualify).
   * @param   num the given number
   * @returns one of the strings described above
   * @throws  {RangeError} if the given arguemnt was not a finite number
   */
  static typeOf(num: number): string {
    if (['NaN', 'infinite'].includes(xjs_Object.typeOf(num))) {
      throw new RangeError('Argument must be a finite number.')
    }
    return (Number.isInteger(num)) ? 'integer' : 'float'
  }

  /**
   * Verify the type of number given, throwing if it does not match.
   *
   * Given a (finite) number and a "type", test to see if the number is of that type.
   * Mainly used for parameter validation, when the type `number` is not specific enough.
   * The acceptable "types", which are not mutually exclusive, follow:
   *
   * - `'float'   ` : the number is not an integer
   * - `'integer' ` : the number is divisible by 1 (`num % 1 === 0`)
   * - `'natural' ` : the number is a non-negative integer (either positive or 0)
   * - `'whole'   ` : the number is a positive integer
   * - `'positive'` : the number is strictly greater than 0
   * - `'negative'` : the number is strictly less than 0
   *
   * Note that if the given number does not match the given type,
   * then this method will throw an error, instead of returning `false`.
   * This is useful for parameter validation.
   *
   * @param   num the number to test
   * @param   type one of the string literals listed above
   * @returns does the number match the described type?
   * @throws  {RangeError} if the given arguemnt was not a finite number
   * @throws  {RangeError} if the number does not match
   */
  static assertType(num: number, type: 'float'|'integer'|'natural'|'whole'|'positive'|'negative'): boolean {
		xjs_Number.typeOf(num) // re-throw
		const returned = xjs_Object.switch<[boolean, string]>(type, {
			'float'   : (n: number) => [!Number.isInteger(n)          , `${n} may not be an integer.`         ],
			'integer' : (n: number) => [ Number.isInteger(n)          , `${n} must be an integer.`            ],
			'natural' : (n: number) => [ Number.isInteger(n) && 0 <= n, `${n} must be a non-negative integer.`],
			'whole'   : (n: number) => [ Number.isInteger(n) && 0 <  n, `${n} must be a positive integer.`    ],
			'positive': (n: number) => [0 < n                         , `${n} must be a positive number.`     ],
			'negative': (n: number) => [n < 0                         , `${n} must be a negative number.`     ],
		})(num)
    if (returned[0]) return true
    throw new RangeError(returned[1])
  }


  private constructor() {}
}
