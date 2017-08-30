module.exports = class OBJECT {
  /**
   * Return the type of a thing.
   * Similar to the `typeof` primitive operator, but more refined.
   *
   * NOTE! passing undeclared variables will throw a `ReferenceError`!
   * ```
   * var x;          // declare `x`
   * typeof x;       // 'undefined'
   * typeof y;       // 'undefined'
   * Util.typeOf(x); // 'undefined'
   * Util.typeOf(y); // Uncaught ReferenceError: y is not defined
   * ```
   * Credit to @zaggino.
   *
   * @see https://github.com/zaggino/z-schema/blob/bddb0b25daa0c96119e84b121d7306b1a7871594/src/Utils.js#L12
   * @param  {*} thing anything
   * @return {string} the type of the thing
   */
  static typeOf(thing) {
    let type = typeof thing
    switch (type) {
      case 'object':
        if (thing === null)       return 'null'
        if (Array.isArray(thing)) return 'array'
        return type // 'object'
      case 'number':
        if (Number.isNaN(thing))     return 'NaN'
        if (!Number.isFinite(thing)) return 'infinite'
        return type // 'number'
      default:
        return type // 'undefined', 'boolean', 'string', 'function'
    }
  }

  /**
   * Specify the type of number given.
   * If the number is finite, return one of the following strings:
   * - `'integer'` : the number is an integer, that is, `num % 1 === 0`
   * - `'float'`   : the number is not an integer
   * Else, throw a RangeError (the argument is of the correct type but does not qualify).
   * @param  {number} num the given number
   * @return {string} one of the strings described above
   */
  static typeOfNumber(num) {
    if (OBJECT.typeOf(num) === 'number') {
      return (Number.isInteger(num)) ? 'integer' : 'float'
    } else throw new RangeError('The number is not finite.')
  }

  /**
   * Test whether two objects are “the same”,
   * using this function recursively on corresponding object values.
   * The base case for non-object values is `Object.is()`.
   *
   * “The same” means “replaceable”, that is,
   * for any deterministic function: `fn(obj1)` would return the same result as `fn(obj2)` if and only if
   * `Util.Object.is(obj1, obj2)`.
   *
   * This function is less strict than `Object.is()`.
   * If both arguments are arrays, it is faster to use {@link Util.Array.is()}.
   *
   * NOTE: WARNING: recursive function. infinite loop possible.
   *
   * @param  {Object}  obj1 the first object
   * @param  {Object}  obj2 the second object
   * @return {boolean} `true` if corresponding elements are the same, or replaceable
   */
  static is(obj1, obj2) {
    var ARRAY = require('./Util.Array.class.js')
    if (Object.is(obj1, obj2) || ARRAY.is(obj1, obj2)) return true
    if (OBJECT.typeOf(obj1) !== 'object' || OBJECT.typeOf(obj2) !== 'object') return false
    if (Object.getOwnPropertyNames(obj1).length !== Object.getOwnPropertyNames(obj2).length) return false
    if (
      Object.getOwnPropertyNames(obj1).some((key) => !Object.getOwnPropertyNames(obj2).includes(key))
      ||
      Object.getOwnPropertyNames(obj2).some((key) => !Object.getOwnPropertyNames(obj1).includes(key))
    ) return false
    let returned = true
    for (let i in obj1) {
      // returned &&= OBJECT.is(obj1[i], obj2[i]) // IDEA
      returned = returned && OBJECT.is(obj1[i], obj2[i])
    }
    return returned
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
    switch (OBJECT.typeOf(thing)) {
      case 'array':
        for (let val of thing) {
          if (!Object.isFrozen(val)) OBJECT.freezeDeep(val)
        }
        break;
      case 'object':
        for (let key in thing) {
          if (!Object.isFrozen(thing[key])) OBJECT.freezeDeep(thing[key])
        }
        break;
    }
    return thing
  }

  /**
   * Deep clone an object, and return the result.
   * If an array or object is passed,
   * This method is recursively called, cloning properties and sub-properties of the given parameter.
   * The returned result is an object seemingly identical to the given parameter, except that
   * corresponding properties are not "equal" in the sense of `==` or `===`, unless they are primitive values.
   * Else, the original argument is returned.
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
   * // Util.cloneDeep x into y:
   * var z = Util.cloneDeep(x) // returns { first: 1, second: { value: 2 }, third: [1, '2', {v:3}] }
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
    let returned;
    switch (OBJECT.typeOf(thing)) {
      case 'array':
        returned = []
        for (let val of thing) {
          result.push(OBJECT.cloneDeep(val))
        }
        break;
      case 'object':
        returned = {}
        for (let key in thing) {
          returned[key] = OBJECT.cloneDeep(thing[key])
        }
        break;
      default:
        returned = thing
    }
    return returned
  }
}
