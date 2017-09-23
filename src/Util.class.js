/**
 * Extra JS utilites and helpers.
 * @namespace
 * @module
 */
module.exports = {
  /**
   * Additional static members for the Object class.
   * Does not extend the native Object class.
   * @namespace
   */
  Object: require('./Util.Object.class.js'),

  /**
   * Additional static members for the Array class.
   * Does not extend the native Array class.
   * @namespace
   */
  Array: require('./Util.Array.class.js'),

  /**
   * Additional static members for the Date class.
   * Does not extend the native Date class.
   * @namespace
   */
  Date: require('./Util.Date.class.js'),
}
