/**
 * Extra JS utilites and helpers.
 * @namespace xjs
 */
module.exports = {
  /**
   * @see xjs.Object
   */
  Object: require('./src/Object.class.js'),

  /**
   * @see xjs.Number
   */
  Number: require('./src/Number.class.js'),

  /**
   * @see xjs.Array
   */
  Array: require('./src/Array.class.js'),

  /**
   * @see xjs.Date
   */
  Date: require('./src/Date.class.js'),

  Element: require('./src/Element.class.js'), // CHANGED DEPRECATED
  Mapp   : require('./src/Mapp.class.js'), // CHANGED OBSOLETE
  Tree   : require('./src/Tree.class.js'), // CHANGED OBSOLETE
}
