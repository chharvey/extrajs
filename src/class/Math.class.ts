import xjs_Number from './Number.class'


/**
 * @summary Additional static members for the native Math class.
 * @description Does not extend the native Math class.
 */
export default class xjs_Math {
  /**
   * @summary Return the `n`th tetration of `x`.
   * @description
   * Tetration is considered the next hyperoperation after exponentiation
   * (which follows multiplication, following addition).
   * For example, `tetrate(5, 3)` returns the result of `5 ** 5 ** 5`: repeated exponentiation.
   * (Note that with ambiguous grouping, `a ** b ** c` is equal to `a ** (b ** c)`.)
   * If there were a native JavaScript operator for tetration,
   * it might be a triple-asterisk: `5 *** 3`.
   *
   * Currently, there is only support for `n` being a non-negagive integer.
   * Negative numbers and non-integers are not yet allowed.
   * @example
   * tetrateLeft(5, 3) // returns 5 ** 5 ** 5 // equal to 5 ** (5 ** 5)
   * tetrateLeft(5, 1) // returns 5
   * tetrateLeft(5, 0) // returns 1
   * @param   x the root, any number
   * @param   n the hyper-exponent to which the root is raised, a non-negative integer
   * @returns informally, `x *** n`
   * @throws  {RangeError} when `n` is not a non-negative integer
   */
  static tetrate(x: number, n: number): number {
    xjs_Number.checkType(n, 'natural')
    if (n === 0) return 1
    return x ** xjs_Math.tetrate(x, n-1)
  }

  /**
   * @summary Return the remainder of Euclidean division of `x` by `n`.
   * @description This method returns `x % n` when `x` is positive,
   * but returns a positive result when `x` is negative.
   * The divisor `n` must be positive.
   * @param   x the dividend
   * @param   n the divisor, a positive integer
   * @returns exactly `((x % n) + n) % n`
   * @throws  {RangeError} when `n` is not a positive integer
   */
  static mod(x: number, n: number): number {
    xjs_Number.checkType(n, 'whole')
    return ((x % n) + n) % n
  }

  /**
   * @summary Return the argument, clamped between two bounds.
   * @description
   * This method returns the argument unchanged iff it is loosely between `min` and `max`;
   * it returns `min` iff the argument is strictly less than `min`;
   * and `max` iff the argument is strictly greater than `max`.
   * If `min === max` then this method returns that value.
   * If `min >= max` then this method switches the bounds.
   * @param   min the lower bound
   * @param   x the value to clamp between the bounds
   * @param   max the upper bound
   * @returns exactly `Math.min(Math.max(min, x), max)`
   */
  static clamp(min: number, x: number, max: number): number {
    return (min <= max) ? Math.min(Math.max(min, x), max) : xjs_Math.clamp(max, x, min)
  }


  private constructor() {}
}
