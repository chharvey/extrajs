/**
 * Additional static members for the Number class.
 * Does not extend the native Number class.
 * @namespace
 * @module
 */
module.exports = {
  /**
   * Specify the type of number given.
   * If the number is finite, return one of the following strings:
   * - `'integer'` : the number is an integer, that is, `num % 1 === 0`
   * - `'float'`   : the number is not an integer
   * Else, throw a RangeError (the argument is of the correct type but does not qualify).
   * @param  {number} num the given number
   * @return {string} one of the strings described above
   * @throws {RangeError} if the given arguemnt was not a finite number
   */
  typeOf: function (num) {
    const xjs = { Object: require('./Object.class.js') }
    if (xjs.Object.typeOf(num) === 'number') {
      return (Number.isInteger(num)) ? 'integer' : 'float'
    } else throw new RangeError('Argument must be a finite number.')
  },
}
