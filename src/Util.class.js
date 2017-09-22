var OBJECT = require('./Util.Object.class.js')
var ARRAY  = require('./Util.Array.class.js')
var DATE   = require('./Util.Date.class.js')

/**
 * Utilities that extend native Javascript.
 * @module
 */
module.exports = class Util {
  /** @private */ constructor() {}

  /**
   * Additional static members for the Object class.
   * Does not extend the native Object class.
   * @namespace
   */
  static get Object() { return OBJECT }

  /**
   * Additional static members for the Array class.
   * Does not extend the native Array class.
   * @namespace
   */
  static get Array() { return ARRAY }

  /**
   * Additional static members for the Date class.
   * Does not extend the native Date class.
   * @namespace
   */
  static get Date() { return DATE }
}
