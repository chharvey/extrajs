/**
 * @summary Additional static members for the native Object class.
 * @description Does not extend the native Object class.
 */
export default class xjs_Object {
  /**
   * @summary Return the type of a thing.
   * @description Similar to the `typeof` primitive operator, but more refined.
   *
   * NOTE! passing undeclared variables will throw a `ReferenceError`!
   * ```js
   * var x;          // declare `x`
   * typeof x;       // 'undefined'
   * typeof y;       // 'undefined'
   * xjs.typeOf(x);  // 'undefined'
   * xjs.typeOf(y);  // Uncaught ReferenceError: y is not defined
   * ```
   * Credit to @zaggino.
   *
   * @see https://github.com/zaggino/z-schema/blob/bddb0b25daa0c96119e84b121d7306b1a7871594/src/Utils.js#L12
   * @param   thing anything
   * @returns the type of the thing
   */
  static typeOf(thing: unknown): string {
    let type: string = typeof thing
    const switch_: { [index: string]: () => string } = {
      'object': () => {
        if (thing === null)       return 'null'
        if (Array.isArray(thing)) return 'array'
        return type // 'object'
      },
      'number': () => {
        if (Number.isNaN(thing))     return 'NaN'
        if (!Number.isFinite(thing)) return 'infinite'
        return type // 'number'
      },
      default() {
        return type // 'undefined', 'boolean', 'string', 'function'
      },
    }
    return (switch_[type] || switch_.default)()
  }

  /**
   * @summary Return the name of an object’s constructing class or function.
   * @description This method reveals the most specific class that the native `instanceof` operator would reveal.
   * This method can be passed either complex values (objects, arrays, functions) or primitive values.
   * Technically, primitives do not have constructing functions, but they can be wrapped with object constructors.
   * For example, calling `instanceOf(3)` will return `Number`, even though `3` was not constructed via the `Number` class.
   * @param   thing anything except `null` or `undefined`
   * @returns the name of the constructing function
   * @throws  {TypeError} if `null` or `undefined` is passed
   */
  static instanceOf(thing: unknown): string {
    if (thing === null || thing === undefined) throw new TypeError(`\`${thing}\` does not have a construtor.`)
    return thing.__proto__.constructor.name
  }

  /**
   * @summary Test whether two things are “the same”.
   * @description This function acts **recursively** on corresponding object values,
   * where the base case (for non-object values) is `Object.is()`.
   *
   * “The same” means “replaceable”, that is,
   * for any deterministic function: `fn(a)` would return the same result as `fn(b)` if and only if
   * `xjs.Object.is(a, b)`.
   *
   * This function is less strict than {@link Object.is}.
   * If both arguments are arrays, it is faster to use {@link xjs_Array.is}.
   *
   * @param   a the first  thing
   * @param   b the second thing
   * @returns Are corresponding elements the same, i.e. replaceable?
   */
  static is(a: unknown, b: unknown): boolean {
    const xjs_Array = require('./Array.class.js') // relative to dist
    if (a === b || Object.is(a,b)) return true
    if (xjs_Object.typeOf(a) === 'array' && xjs_Object.typeOf(b) === 'array') return xjs_Array.is(a, b)
    // both must be objects
    if (xjs_Object.typeOf(a) !== 'object' || xjs_Object.typeOf(b) !== 'object') return false
    // both must have the same number of own properties
    if (Object.getOwnPropertyNames(a).length !== Object.getOwnPropertyNames(b).length) return false
    // `b` must own every property in `a`
    if (!Object.getOwnPropertyNames(a).every((key) => Object.getOwnPropertyNames(b).includes(key))) return false
    // `a` must own every property in `b` // NOTE unnecessary if they have the same length
    // if (!Object.getOwnPropertyNames(b).every((key) => Object.getOwnPropertyNames(a).includes(key))) return false
    for (let i in a) {
      if (!xjs_Object.is(a[i], b[i])) return false
    }
    return true
  }

  /**
   * @summary Deep freeze an object, and return the result.
   * @description If an array or object is passed,
   * **Recursively** call {@link Object.freeze} on every property and sub-property of the given parameter.
   * Else, return the given argument.
   * @param   thing any value to freeze
   * @returns the given value, with everything frozen
   */
  static freezeDeep<T>(thing: T): T {
    Object.freeze(thing)
    const action: { [index: string]: () => void } = {
      'array': () => {
        thing.forEach((val) => {
          if (!Object.isFrozen(val)) xjs_Object.freezeDeep(val)
        })
      },
      'object': () => {
        for (let key in thing) {
          if (!Object.isFrozen(thing[key])) xjs_Object.freezeDeep(thing[key])
        }
      },
      default() {},
    }
    ;(action[xjs_Object.typeOf(thing)] || action.default)()
    return thing
  }

  /**
   * @summary Deep clone an object, and return the result.
   * @description If an array or object is passed,
   * This method is **recursively** called, cloning properties and sub-properties of the given parameter.
   * The returned result is an object, that when passed with the original as arguments of {@link xjs_Object.is},
   * `true` would be returned. The new object would be “replaceable” with its cloner.
   * If a primitive value is passed, the original argument is returned.
   *
   * This method provides a deeper clone than `Object.assign()`: whereas `Object.assign()` only
   * copies the top-level properties, this method recursively clones into all sub-levels.
   *
   * ```js
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
   * // xjs.Object.cloneDeep x into y:
   * var z = xjs.Object.cloneDeep(x) // returns { first: 1, second: { value: 2 }, third: [1, '2', {v:3}] }
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
   * ```
   *
   * @param   thing any value to clone
   * @returns an exact copy of the given value, but with nothing equal via `==` (unless the value given is primitive)
   */
  static cloneDeep<T>(thing: T): T {
    const switch_: { [index: string]: () => T } = {
      'array': () => {
        const returned: T = []
        thing.forEach((val) => {
          returned.push(xjs_Object.cloneDeep(val))
        })
        return returned
      },
      'object': () => {
        const returned: T = {}
        for (let key in thing) {
          returned[key] = xjs_Object.cloneDeep(thing[key])
        }
        return returned
      },
      default() {
        return thing
      },
    }
    return (switch_[xjs_Object.typeOf(thing)] || switch_.default)()
  }


  private constructor() {}
}
