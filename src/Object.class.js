const xjs = {}

/**
 * Additional static members for the native Object class.
 * Does not extend the native Object class.
 * @class xjs.Object
 */
module.exports = xjs.Object = class {
  /** @private */ constructor() {}

  /**
   * Return the type of a thing.
   * Similar to the `typeof` primitive operator, but more refined.
   *
   * NOTE! passing undeclared variables will throw a `ReferenceError`!
   * ```
   * var x;          // declare `x`
   * typeof x;       // 'undefined'
   * typeof y;       // 'undefined'
   * xjs.typeOf(x);  // 'undefined'
   * xjs.typeOf(y);  // Uncaught ReferenceError: y is not defined
   * ```
   * Credit to @zaggino.
   *
   * @see https://github.com/zaggino/z-schema/blob/bddb0b25daa0c96119e84b121d7306b1a7871594/src/Utils.js#L12
   * @param  {*} thing anything
   * @return {string} the type of the thing
   */
  static typeOf(thing) {
    let type = typeof thing
    let returned = {
      object: function () {
        if (thing === null)       return 'null'
        if (Array.isArray(thing)) return 'array'
        return type // 'object'
      },
      number: function () {
        if (Number.isNaN(thing))     return 'NaN'
        if (!Number.isFinite(thing)) return 'infinite'
        return type // 'number'
      },
      default: function () {
        return type // 'undefined', 'boolean', 'string', 'function'
      },
    }
    return (returned[type] || returned.default).call(null)
  }

  /**
   * Test whether two things are “the same”,
   * using this function recursively on corresponding object values.
   * The base case for non-object values is `Object.is()`.
   *
   * “The same” means “replaceable”, that is,
   * for any deterministic function: `fn(a)` would return the same result as `fn(b)` if and only if
   * `xjs.Object.is(a, b)`.
   *
   * This function is less strict than `Object.is()`.
   * If both arguments are arrays, it is faster to use {@link xjs.Array.is()}.
   *
   * NOTE: WARNING: recursive function. infinite loop possible.
   *
   * @param  {*} a the first  thing
   * @param  {*} b the second thing
   * @return {boolean} `true` if corresponding elements are the same, or replaceable
   */
  static is(a, b) {
    // const xjs = { Array: require('./Array.class.js') }
    xjs.Array = require('./Array.class.js')
    if (Object.is(a, b)) return true
    if (xjs.Object.typeOf(a) === 'array' && xjs.Object.typeOf(b) === 'array') return xjs.Array.is(a, b)
    return (
      xjs.Object.typeOf(a) === 'object' && xjs.Object.typeOf(b) === 'object' // both must be objects
      && Object.getOwnPropertyNames(a).length === Object.getOwnPropertyNames(b).length // both must have the same number of own properties
      && Object.getOwnPropertyNames(a).every((key) => Object.getOwnPropertyNames(b).includes(key)) // `b` must own every property in `a`
      // && Object.getOwnPropertyNames(b).every((key) => Object.getOwnPropertyNames(a).includes(key)) // `a` must own every property in `b` // unnecessary if they have the same length
      // finally, compare all the values
      && (function () {
        let r = true
        for (let i in a) {
          // r &&= xjs.Object.is(a[i], b[i]) // IDEA
          r = r && xjs.Object.is(a[i], b[i])
        }
        return r
      })()
    )
  }

  /**
   * Deep freeze an object, and return the result.
   * If an array or object is passed,
   * Recursively call `Object.freeze()` on every property and sub-property of the given parameter.
   * Else, return the given argument.
   * @param  {*} thing any value to freeze
   * @return {*} the returned value, with everything frozen
   */
  static freezeDeep(thing) {
    Object.freeze(thing)
    let action = {
      array: function () {
        thing.forEach(function (val) {
          if (!Object.isFrozen(val)) xjs.Object.freezeDeep(val)
        })
      },
      object: function () {
        for (let key in thing) {
          if (!Object.isFrozen(thing[key])) xjs.Object.freezeDeep(thing[key])
        }
      },
      default: function () {},
    }
    ;(action[xjs.Object.typeOf(thing)] || action.default).call(null)
    return thing
  }

  /**
   * Deep clone an object, and return the result.
   * If an array or object is passed,
   * This method is recursively called, cloning properties and sub-properties of the given parameter.
   * The returned result is an object seemingly identical to the given parameter, except that
   * corresponding properties are not "equal" in the sense of `==` or `===`, unless they are primitive values.
   * Else, the original argument is returned.
   * In other words,a clone deep is “replaceable” with its original object, and thus would be
   * “the same” in the sense of `xjs.Object.is()`.
   *
   * **NOTE WARNING: infinite loop possible!**
   *
   * This method provides a deeper clone than `Object.assign()`: whereas `Object.assign()` only
   * copies the top-level properties, this method recursively clones into all sub-levels.
   *
   * // ==== Example ====
   * var x = { first: 1, second: { value: 2 }, third: [1, '2', { v:3 }] }
   *
   * // Object.assign x into y:
   * var y = Object.assign({}, x) // returns { first: x.first, second: x.second, third: x.third }
   *
   * // you can reassign properties of `y` without affecting `x`:
   * y.first  = 'one'
   * y.second = 2
   * console.log(y) // returns { first: 'one', second: 2, third: x.third }
   * console.log(x) // returns { first: 1, second: { value: 2 }, third: [1, '2', { v:3 }] }
   *
   * // however you cannot mutate properties of `y` without affecting `x`:
   * y.third[0]    = 'one'
   * y.third[1]    = 2
   * y.third[2].v  = [3]
   * console.log(y) // returns { first: 'one', second: 2, third: ['one', 2, { v:[3] }] }
   * console.log(x) // returns { first: 1, second: { value: 2 }, third: ['one', 2, { v:[3] }] }
   *
   * // xjs.cloneDeep x into y:
   * var z = xjs.cloneDeep(x) // returns { first: 1, second: { value: 2 }, third: [1, '2', {v:3}] }
   *
   * // as with Object.assign, you can reassign properties of `z` without affecting `x`:
   * z.first  = 'one'
   * z.second = 2
   * console.log(z) // returns { first: 'one', second: 2, third: [1, '2', {v:3}] }
   * console.log(x) // returns { first: 1, second: { value: 2 }, third: [1, '2', { v:3 }] }
   *
   * // but unlike Object.assign, you can mutate properties of `z` without affecting `x`:
   * z.third[0]    = 'one'
   * z.third[1]    = 2
   * z.third[2].v  = [3]
   * console.log(z) // returns { first: 'one', second: 2, third: ['one', 2, { v:[3] }] }
   * console.log(x) // returns { first: 1, second: { value: 2 }, third: [1, '2', { v:3 }] }
   *
   * @param  {*} obj any value to clone
   * @return {*} an exact copy of the given value, but with nothing equal via `==` (unless the value given is primitive)
   */
  static cloneDeep(thing) {
    let returned = {
      array: function () {
        let returned = []
        thing.forEach(function (val) {
          returned.push(xjs.Object.cloneDeep(val))
        })
        return returned
      },
      object: function () {
        let returned = {}
        for (let key in thing) {
          returned[key] = xjs.Object.cloneDeep(thing[key])
        }
        return returned
      },
      default: function () {
        return thing
      },
    }
    return (returned[xjs.Object.typeOf(thing)] || returned.default).call(null)
  }
}
