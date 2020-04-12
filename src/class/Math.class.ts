import xjs_Number from './Number.class'
import xjs_BigInt from './BigInt.class'


/**
 * @summary Additional static members for the native Math class.
 * @description Does not extend the native Math class.
 */
export default class xjs_Math {
	/**
	 * Test whether two numbers are approximately equal: closer together than some given interval of refinement.
	 *
	 * If no interval is given,
	 * {@link https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Number/EPSILON|Number.EPSILON}
	 * is used.
	 * @param   x a number to compare
	 * @param   y a number to compare
	 * @param   epsilon the interval of refinement
	 * @returns are `x` and `y` within `epsilon` distance apart?
	 */
	static approx(x: number, y: number, epsilon: number = Number.EPSILON): boolean {
		xjs_Number.assertType(x)
		xjs_Number.assertType(y)
		xjs_Number.assertType(epsilon)
		return Math.abs(x - y) < epsilon
	}

	/**
	 * Average two numbers, with a weight favoring the 2nd number.
	 * @deprecated This method is an alias of {@link xjs_Math.interpolateArithmetic}.
	 * @param   x 1st finite number
	 * @param   y 2nd finite number
	 * @param   w weight of 2nd number; between 0–1
	 * @returns exactly `interpolateArithmetic(x, y, w)`
	 */
	static average(x: number, y: number, w = 0.5): number {
		return xjs_Math.interpolateArithmetic(x, y, w)
	}

	/**
	 * {@link Math.min}, but for `bigint` types.
	 * @param   ints the bigint arguments
	 * @returns   the minimum argument
	 * @throws    if no arguments are supplied
	 */
	static minBigInt(...ints: bigint[]): bigint {
		if (!ints.length) throw new Error('No arguments supplied.')
		return ints.reduce((a, b) => a < b ? a : b)
	}

	/**
	 * {@link Math.max}, but for `bigint` types.
	 * @param   ints the bigint arguments
	 * @returns   the maximum argument
	 * @throws    if no arguments are supplied
	 */
	static maxBigInt(...ints: bigint[]): bigint {
		if (!ints.length) throw new Error('No arguments supplied.')
		return ints.reduce((a, b) => a < b ? b : a)
	}

	/**
	 * Return the argument, clamped between two bounds.
	 *
	 * This method returns the argument unchanged iff it is loosely between `min` and `max`;
	 * it returns `min` iff the argument is strictly less than `min`;
	 * and `max` iff the argument is strictly greater than `max`.
	 * If `min === max` then this method returns that value.
	 * If `min > max` then this method switches the bounds.
	 * @param   min the lower bound
	 * @param   x the value to clamp between the bounds
	 * @param   max the upper bound
	 * @returns exactly `Math.min(Math.max(min, x), max)`
	 */
	static clamp(min: number, x: number, max: number): number {
		xjs_Number.assertType(min)
		xjs_Number.assertType(x  )
		xjs_Number.assertType(max)
		return (min <= max) ? Math.min(Math.max(min, x), max) : xjs_Math.clamp(max, x, min)
	}

	/**
	 * {@link xjx_Math.clamp}, but for `bigint` types.
	 * @param   a a bigint
	 * @param   b a bigint
	 * @returns   the clamped value
	 */
	static clampBigInt(min: bigint, val: bigint, max: bigint): bigint {
		return min <= max ? xjs_Math.minBigInt(xjs_Math.maxBigInt(min, val), max) : xjs_Math.clampBigInt(max, val, min)
	}

	/**
	 * Return the arithmetic mean of a set of numbers.
	 *
	 * ```js
	 * meanArithmetic(a,b)   == (a + b)     / 2
	 * meanArithmetic(a,b,c) == (a + b + c) / 3
	 * ```
	 * @param   nums finite numbers to average
	 * @returns the arithmetic mean of the given numbers
	 * @throws  {Error} if one of the numbers is not finite
	 * @throws  {NaNError} if one of the numbers is `NaN`
	 */
	static meanArithmetic(...nums: number[]): number {
		nums.forEach((n) => xjs_Number.assertType(n, 'finite')) // NB re-throw
		return nums.reduce((x, y) => x + y) * (1 / nums.length)
	}

	/**
	 * Return the geomeric mean of a set of numbers.
	 *
	 * ```js
	 * meanGeometric(a,b)   == (a * b)     ** (1/2)
	 * meanGeometric(a,b,c) == (a * b * c) ** (1/3)
	 * ```
	 * @param   nums finite numbers to average
	 * @returns the geometric mean of the given numbers
	 * @throws  {Error} if one of the numbers is not finite
	 * @throws  {NaNError} if one of the numbers is `NaN`
	 */
	static meanGeometric(...nums: number[]): number {
		nums.forEach((n) => xjs_Number.assertType(n, 'finite')) // NB re-throw
		return Math.abs(nums.reduce((x, y) => x * y)) ** (1 / nums.length)
	}

	/**
	 * Return the harmonic mean of a set of numbers.
	 *
	 * ```js
	 * meanHarmonic(a,b)   == 1 / ((1/a + 1/b)       / 2)
	 * meanHarmonic(a,b,c) == 1 / ((1/a + 1/b + 1/c) / 3)
	 * ```
	 * @param   nums finite numbers to average
	 * @returns the harmonic mean of the given numbers
	 * @throws  {Error} if one of the numbers is not finite
	 * @throws  {NaNError} if one of the numbers is `NaN`
	 */
	static meanHarmonic(...nums: number[]): number {
		nums.forEach((n) => xjs_Number.assertType(n, 'finite')) // NB re-throw
		return 1 / xjs_Math.meanArithmetic(...nums.map((x) => 1 / x))
	}

	/**
	 * Linearlly interpolate between, or extrapolate from, two numbers.
	 *
	 * If the argument `p` is within the interval [0, 1], the result is an interpolation within the interval [a, b],
	 * such that `p == 0` produces `a` and `p == 1` produces `b`.
	 *
	 * For example, `interpolateArithmetic(10, 20, 0.7)` will return 17, while
	 * `interpolateArithmetic(20, 10, 0.7)` will return 13 (the same result as `interpolateArithmetic(10, 20, 1 - 0.7)`).
	 *
	 * If `p` is outside [0, 1], the result is an extrapolation outside the range of [a, b].
	 * For example, `interpolateArithmetic(10, 20, 1.3)` will return 23, and
	 * `interpolateArithmetic(10, 20, -0.3)` will return 7.
	 *
	 * `p` defaults to 0.5, thus yielding an even average, that is,
	 * the {@link xjs_Math.meanArithmetic|arithmetic mean}, of the two numbers.
	 * @see https://www.desmos.com/calculator/tfuwejqtav
	 * @param   a 1st number
	 * @param   b 2nd number
	 * @param   p the interpolation/extrapolation parameter
	 * @returns exactly `a * (1 - p) + (b * p)`
	 * @throws  {Error} if `a`, `b`, or `p` is not a finite number
	 * @throws  {NaNError} if an argument is `NaN`
	 */
	static interpolateArithmetic(a: number, b: number, p: number = 0.5): number {
		xjs_Number.assertType(a, 'finite')
		xjs_Number.assertType(b, 'finite')
		xjs_Number.assertType(p, 'finite')
		return a * (1 - p) + (b * p) // equally, `(b - a) * p + a`
	}

	/**
	 * Exponentially interpolate between, or extrapolate from, two numbers.
	 *
	 * If the argument `p` is within the interval [0, 1], the result is an interpolation within the interval [a, b],
	 * such that `p == 0` produces `a` and `p == 1` produces `b`.
	 *
	 * For example, `interpolateGeometric(10, 20, 0.7)` will return ~16.245, while
	 * `interpolateGeometric(20, 10, 0.7)` will return ~12.311 (the same result as `interpolateGeometric(10, 20, 1 - 0.7)`).
	 *
	 * If `p` is outside [0, 1], the result is an extrapolation outside the range of [a, b].
	 * For example, `interpolateGeometric(10, 20, 1.3)` will return ~24.623, and
	 * `interpolateGeometric(10, 20, -0.3)` will return ~8.123.
	 *
	 * `p` defaults to 0.5, thus yielding an even average, that is,
	 * the {@link xjs_Math.meanGeometric|geometric mean}, of the two numbers.
	 * @see https://www.desmos.com/calculator/tfuwejqtav
	 * @param   a 1st number
	 * @param   b 2nd number
	 * @param   p the interpolation/extrapolation parameter
	 * @returns exactly `a ** (1 - p) * b ** p`
	 * @throws  {Error} if `a`, `b`, or `p` is not a finite number
	 * @throws  {NaNError} if an argument is `NaN`
	 */
	static interpolateGeometric(a: number, b: number, p: number = 0.5): number {
		xjs_Number.assertType(a, 'finite')
		xjs_Number.assertType(b, 'finite')
		xjs_Number.assertType(p, 'finite')
		return a ** (1 - p) * b ** p // equally, `a * (b / a) ** p`
	}

	/**
	 * Rationally interpolate between, or extrapolate from, two numbers.
	 *
	 * If the argument `p` is within the interval [0, 1], the result is an interpolation within the interval [a, b],
	 * such that `p == 0` produces `a` and `p == 1` produces `b`.
	 *
	 * For example, `interpolateHarmonic(10, 20, 0.7)` will return ~15.385, while
	 * `interpolateHarmonic(20, 10, 0.7)` will return ~11.765 (the same result as `interpolateHarmonic(10, 20, 1 - 0.7)`).
	 *
	 * If `p` is outside [0, 1], the result is an extrapolation outside the range of [a, b].
	 * For example, `interpolateHarmonic(10, 20, 1.3)` will return ~28.571, and
	 * `interpolateHarmonic(10, 20, -0.3)` will return ~8.696.
	 *
	 * `p` defaults to 0.5, thus yielding an even average, that is,
	 * the {@link xjs_Math.meanHarmonic|harmonic mean}, of the two numbers.
	 * @see https://www.desmos.com/calculator/tfuwejqtav
	 * @param   a 1st number
	 * @param   b 2nd number
	 * @param   p the interpolation/extrapolation parameter
	 * @returns exactly `1 / interpolateArithmetic(1/a, 1/b, p)`
	 * @throws  {Error} if `a`, `b`, or `p` is not a finite number
	 * @throws  {NaNError} if an argument is `NaN`
	 */
	static interpolateHarmonic(a: number, b: number, p: number = 0.5): number {
		xjs_Number.assertType(a, 'finite')
		xjs_Number.assertType(b, 'finite')
		xjs_Number.assertType(p, 'finite')
		return 1 / xjs_Math.interpolateArithmetic(1/a, 1/b, p) // equally, `(a * b) / ((a - b) * p + b)`
	}

	/**
	 * Return the remainder of Euclidean division of `x` by `n`.
	 *
	 * This method returns `x % n` when `x` is positive,
	 * but returns a positive result when `x` is negative.
	 * The divisor `n` must be positive.
	 * @param   x the dividend
	 * @param   n the divisor, a positive integer
	 * @returns exactly `((x % n) + n) % n`
	 * @throws  {Error} if `n` is not a positive integer
	 */
	static mod(x: number, n: number|bigint): number {
		xjs_Number.assertType(x, 'finite')
		if (typeof n === 'number') {
			xjs_Number.assertType(n, 'whole')
		} else {
			xjs_BigInt.assertType(n, 'whole')
		}
		n = Number(n)
		return ((x % n) + n) % n
	}

  /**
   * Return the `n`th tetration of `x`.
   *
   * Tetration is considered the next hyperoperation after exponentiation
   * (which follows multiplication, following addition).
   * For example, `tetrate(5, 3)` returns the result of `5 ** 5 ** 5`: repeated exponentiation.
   * (Note that with ambiguous grouping, `a ** b ** c` is equal to `a ** (b ** c)`.)
   * If there were a native JavaScript operator for tetration,
   * it might be a triple-asterisk: `5 *** 3`.
   *
   * Currently, there is only support for non-negative integer hyperexponents.
   * Negative numbers and non-integers are not yet allowed.
   *
   * ```js
   * tetrate(5, 3) // returns 5 ** 5 ** 5 // equal to 5 ** (5 ** 5)
   * tetrate(5, 1) // returns 5
   * tetrate(5, 0) // returns 1
   * ```
   *
   * @param   x the root, any number
   * @param   n the hyper-exponent to which the root is raised, a non-negative integer
   * @returns informally, `x *** n`
   * @throws  {Error} if `n` is not a non-negative integer
   */
  static tetrate(x: number, n: number): number {
    xjs_Number.assertType(x, 'finite')
    xjs_Number.assertType(n, 'natural')
    return (n === 0) ? 1 : x ** xjs_Math.tetrate(x, n - 1)
  }


  private constructor() {}
}
