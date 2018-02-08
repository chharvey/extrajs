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
   * This method calls `.toString()` on everything else, except `null` and `undefined`,
   * which are converted to the strings `'null'` and `'undefined'` respectively.
   * Useful for JSON objects where the value could be a single string or an array of strings.
   * @param   {*} thing anything to convert
   * @returns {string} a string version of the argument
   */
  static stringify(thing) {
    const returned = {
      'array'    : function (arg) { return arg.join('') },
      'object'   : function (arg) { return JSON.stringify(arg) },
      'string'   : function (arg) { return arg },
      'null'     : function (arg) { return 'null'      },
      'undefined': function (arg) { return 'undefined' },
      default(arg) { return arg.toString() },
    }
    return (returned[xjs.Object.typeOf(thing)] || returned.default).call(null, thing)
  }
}

module.exports = xjs.String
