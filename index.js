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
  Object: require('./src/Object.class.js'),

  /**
   * Additional static members for the Number class.
   * Does not extend the native Number class.
   * @namespace
   */
  Number: require('./src/Number.class.js'),

  /**
   * Additional static members for the Array class.
   * Does not extend the native Array class.
   * @namespace
   */
  Array: require('./src/Array.class.js'),

  /**
   * Additional static members for the Date class.
   * Does not extend the native Date class.
   * @namespace
   */
  Date: require('./src/Date.class.js'),

  Element: require('./src/Element.class.js'), // CHANGED DEPRECATED
  Mapp   : require('./src/Mapp.class.js'), // CHANGED OBSOLETE
  Tree   : require('./src/Tree.class.js'), // CHANGED OBSOLETE
}
