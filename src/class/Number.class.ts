const xjs = {
  Object: require('./Object.class.js'),
}

/**
 * @summary Additional static members for the native Number class.
 * @description Does not extend the native Number class.
 * @namespace
 */
xjs.Number = class {
  /**
   * @private
   */
  constructor() {}

  /**
   * @summary Specify the type of number given.
   * @description If the number is finite, return one of the following strings:
   * - `'integer'` : the number is an integer, that is, `num % 1 === 0`
   * - `'float'`   : the number is not an integer
   * Else, throw a `RangeError` (the argument is of the correct type but does not qualify).
   * @version STABLE
   * @param   {number} num the given number
   * @returns {string} one of the strings described above
   * @throws  {RangeError} if the given arguemnt was not a finite number
   */
  static typeOf(num) {
    if (xjs.Object.typeOf(num) === 'number') {
      return (Number.isInteger(num)) ? 'integer' : 'float'
    } else throw new RangeError('Argument must be a finite number.')
  }
}

module.exports = xjs.Number
