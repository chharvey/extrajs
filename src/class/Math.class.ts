/**
 * @summary Additional static members for the native Math class.
 * @description Does not extend the native Math class.
 */
export default class xjs_Math {
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
    if (n <= 0 || n%1 !== 0) throw new RangeError(`${n} must be a positive integer.`)
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
