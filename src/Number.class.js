const xjs = {}
xjs.Object = require('./Object.class.js')

/**
 * Additional static members for the native Number class.
 * Does not extend the native Number class.
 */
xjs.Number = class {
  /** @private */ constructor() {}

  /**
   * Specify the type of number given.
   * If the number is finite, return one of the following strings:
   * - `'integer'` : the number is an integer, that is, `num % 1 === 0`
   * - `'float'`   : the number is not an integer
   * Else, throw a RangeError (the argument is of the correct type but does not qualify).
   * @stability STABLE
   * @param  {number} num the given number
   * @return {string} one of the strings described above
   * @throws {RangeError} if the given arguemnt was not a finite number
   */
  static typeOf(num) {
    if (xjs.Object.typeOf(num) === 'number') {
      return (Number.isInteger(num)) ? 'integer' : 'float'
    } else throw new RangeError('Argument must be a finite number.')
  }
}

module.exports = xjs.Number
