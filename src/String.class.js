const xjs = {}
xjs.Object = require('./Object.class.js')

/**
 * @summary Additional static members for the native String class.
 * @description Does not extend the native String class.
 * @namespace
 */
xjs.String = class {
  /**
   * @private
   */
  constructor() {}

  /**
   * @summary Convert a thing into a string.
   * @description If the argument is an array, it is joined.
   * If it is an object, `JSON.stringify` is called on it.
   * This method calls `.toString()` on everything else, except `null` and `undefined` (see param notes below).
   * Useful for JSON objects where the value could be a single string or an array of strings.
   * @param   {*} thing anything to convert
   * @param   {boolean=} truthy defines how to handle `null` and `undefined`:
   *                            if `true`, they are converted to `'null'` and `'undefined'` respectively;
   *                            else, they are converted to the empty string `''`
   * @returns {string} a string version of the argument
   */
  static stringify(thing, truthy = false) {
    const returned = {
      'array'    : function (arg) { return arg.join('') },
      'object'   : function (arg) { return JSON.stringify(arg) },
      'string'   : function (arg) { return arg },
      'null'     : function (arg) { return (truthy) ? 'null'      : '' },
      'undefined': function (arg) { return (truthy) ? 'undefined' : '' },
      default(arg) { return arg.toString() },
    }
    return (returned[xjs.Object.typeOf(thing)] || returned.default).call(null, thing)
  }
}

module.exports = xjs.String
