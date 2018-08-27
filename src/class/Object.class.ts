import xjs_Array from './Array.class'


/**
 * @summary A helper interface for {@link Object.switch}.
 */
interface SwitchFn<T> extends Function {
  (this: unknown, ...args: any[]): T;
  call(this_arg: unknown, ...args: any[]): T;
}

/**
 * @summary Additional static members for the native Object class.
 * @description Does not extend the native Object class.
 */
export default class xjs_Object {
  /**
   * @summary Return the type of a thing.
   * @description Similar to the `typeof` primitive operator, but more refined.
   * Credit to {@link https://github.com/zaggino/|@zaggino}.
   *
   * Note! passing undeclared variables will throw a `ReferenceError`!
   *
   * @example
   * var x;          // declare `x`
   * typeof x;       // 'undefined'
   * typeof y;       // 'undefined'
   * xjs.typeOf(x);  // 'undefined'
   * xjs.typeOf(y);  // Uncaught ReferenceError: y is not defined
   *
   * @see https://github.com/zaggino/z-schema/blob/bddb0b25daa0c96119e84b121d7306b1a7871594/src/Utils.js#L12
   * @param   thing anything
   * @returns the type of the thing
   */
  static typeOf(thing: unknown): string {
    return xjs_Object.switch<string>([
      ['object', (thing: any) => {
        if (thing === null)       return 'null'
        if (Array.isArray(thing)) return 'array'
        return 'object'
      }],
      ['number', (thing: number) => {
        if (Number.isNaN(thing))     return 'NaN'
        if (!Number.isFinite(thing)) return 'infinite'
        return 'number'
      }],
      ['default', (thing: Function|string|boolean|void) => {
        return typeof thing // 'function', 'string', 'boolean', 'undefined'
      }],
    ], typeof thing, [thing])
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
    return (thing as any).__proto__.constructor.name
  }

  /**
   * @summary A structured `switch` statement.
   * @description
   * This method offers a more structured alternative to a standard `switch` statement,
   * using object lookups to find values.
   *
   * The iterable parameter must be an array of pairs, each an array containing
   * a string (the key) followed by a function (the value).
   * This function, when called, should return a value corresponding to its key string.
   * All functions in the iterable must return the same type of value.
   *
   * The next parameters after the iterable are the key whose value to look up,
   * followed by the arguments to pass to the object lookup function, if any.
   * Optionally provide a `'default'` key to handle cases when no written key matches user input.
   * The `'default'` key is analogous to the **`default` clause** of a `switch` statement.
   *
   * The following example calls this method to look up
   * the date of the *nth* Tuesday of each month of 2018,
   * where *n* could be a number 1 through 5.
   * (Note that this example is actually pretty inefficient,
   * but it only serves as a demonstration.)
   *
   * @example
   * // What is the date of the 1st Tuesday of November, 2018?
   * xjs.Object.switch<number>([
   *
   *   ['January'  , (n: number) => [ 2,  9, 16, 23,  30][n - 1]],
   *   ['February' , (n: number) => [ 6. 13. 20, 27, NaN][n - 1]],
   *   ['March'    , (n: number) => [ 6, 13, 20, 27, NaN][n - 1]],
   *   ['April'    , (n: number) => [ 3, 10, 17, 24, NaN][n - 1]],
   *   ['May'      , (n: number) => [ 1,  8, 15, 22,  29][n - 1]],
   *   ['June'     , (n: number) => [ 5, 12, 19, 26, NaN][n - 1]],
   *   ['July'     , (n: number) => [ 3, 10, 17, 24,  31][n - 1]],
   *   ['August'   , (n: number) => [ 7, 14, 21, 28, NaN][n - 1]],
   *   ['September', (n: number) => [ 4, 11, 18, 25, NaN][n - 1]],
   *   ['October'  , (n: number) => [ 2,  9, 16, 23,  30][n - 1]],
   *   ['November' , (n: number) => [ 6, 13, 20, 27, NaN][n - 1]],
   *   ['December' , (n: number) => [ 4, 11, 18, 25, NaN][n - 1]],
   *   ['default', (n: number) => NaN],
   *
   * ], 'November', [1]) // returns the number `6`
   * @param   iterable an argument with which to instantiate a native Map object
   * @param   key the key to provide the lookup, which will result in a function
   * @param   args an array of arguments to provide the looked-up function
   * @param   this_arg the context to use for `this` inside the looked-up function; optional
   * @returns the result of calling the looked-up function with the given arguments
   * @throws  {ReferenceError} when failing to find a lookup value
   */
  static switch<T>(iterable: [string, SwitchFn<T>][], key: string, args: unknown[] = [], this_arg: unknown = null): T {
    let map = new Map(iterable)
    let returned = map.get(key)
    if (!returned) {
      console.warn(`Key '${key}' cannot be found. Using key 'default'.`)
      returned = map.get('default')
      if (!returned) throw new ReferenceError(`No default value found.`)
    }
    return returned.call(this_arg, ...args)
  }
  /**
   * @summary Test whether two things are “the same”.
   * @description
   * This function uses
   * {@link https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/is|Object.is}
   * equality on corresponding entries, testing replaceability.
   *
   * This function acts **recursively** on corresponding object values,
   * where the base case (for non-object values) is `Object.is()`.
   *
   * “The same” means “replaceable”, that is,
   * for any deterministic function: `fn(a)` would return the same result as `fn(b)` if and only if
   * `xjs.Object.is(a, b)`.
   *
   * This function is less strict than
   * {@link https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/is|Object.is}.
   * If both arguments are arrays, it is faster to use {@link xjs_Array.is}.
   *
   * @param   a the first  thing
   * @param   b the second thing
   * @returns Are corresponding elements the same, i.e. replaceable?
   */
  static is<T>(a: T, b: T): boolean {
    const xjs_Array = require('./Array.class.js') // relative to dist
    if (a === b || Object.is(a,b)) return true
    if (xjs_Object.typeOf(a) === 'array' && xjs_Object.typeOf(b) === 'array') return xjs_Array.is(a as unknown as unknown[], b as unknown as unknown[]) // HACK https://stackoverflow.com/a/18736071/
    // both must be objects
    if (xjs_Object.typeOf(a) !== 'object' || xjs_Object.typeOf(b) !== 'object') return false
    // both must have the same number of own properties
    if (Object.getOwnPropertyNames(a).length !== Object.getOwnPropertyNames(b).length) return false
    // `b` must own every property in `a`
    if (!Object.getOwnPropertyNames(a).every((key) => Object.getOwnPropertyNames(b).includes(key))) return false
    // `a` must own every property in `b` // NOTE unnecessary if they have the same length
    // if (!Object.getOwnPropertyNames(b).every((key) => Object.getOwnPropertyNames(a).includes(key))) return false
    for (let i in a as unknown as object) { // HACK https://stackoverflow.com/a/18736071/
      let ai: unknown = (a as { [key: string]: unknown })[i]
      let bi: unknown = (b as { [key: string]: unknown })[i]
      if (!xjs_Object.is(ai, bi)) return false
    }
    return true
  }

  /**
   * @summary Deep freeze an object, and return the result.
   * @description *Note: This function is impure, modifying the given argument.*
   * If an array or object is passed,
   * **Recursively** call
   * {@link https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/freeze|Object.freeze}
   * on every property and sub-property of the given parameter.
   * Else, return the given argument.
   * If the argument is an array, it is faster to use {@link xjs_Array.freezeDeep}.
   * @param   thing any value to freeze
   * @returns the given value, with everything frozen
   */
  static freezeDeep<T>(thing: T): T {
    const xjs_Array = require('./Array.class.js') // relative to dist
    if (xjs_Object.typeOf(thing) === 'array') return xjs_Array.freezeDeep(thing as unknown as unknown[]) as unknown as T // HACK https://stackoverflow.com/a/18736071/
    Object.freeze(thing)
    if (xjs_Object.typeOf(thing) === 'object') {
        for (let key in thing) {
          if (!Object.isFrozen(thing[key])) xjs_Object.freezeDeep(thing[key])
        }
    }
    return thing
  }

  /**
   * @summary Deep clone an object, and return the result.
   * @description If an array or object is passed,
   * This method is **recursively** called, cloning properties and sub-properties of the given parameter.
   * The returned result is an object, that when passed with the original as arguments of
   * {@link https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/is|Object.is},
   * `true` would be returned. The new object would be “replaceable” with its cloner.
   * If a primitive value is passed, the original argument is returned.
   * If the argument is an array, it is faster to use {@link xjs_Array.cloneDeep}.
   *
   * This method provides a deeper clone than `Object.assign()`: whereas `Object.assign()` only
   * copies the top-level properties, this method recursively clones into all sub-levels.
   *
   * @example
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
   *
   * @param   thing any value to clone
   * @returns an exact copy of the given value, but with nothing equal via `===` (unless the value given is primitive)
   */
  static cloneDeep<T>(thing: T): T {
    const xjs_Array = require('./Array.class.js') // relative to dist
    if (xjs_Object.typeOf(thing) === 'array') return xjs_Array.cloneDeep(thing as unknown as unknown[]) as unknown as T // HACK https://stackoverflow.com/a/18736071/
    if (xjs_Object.typeOf(thing) === 'object') {
        const returned: { [index: string]: unknown } = {}
        for (let key in thing) {
          returned[key] = xjs_Object.cloneDeep(thing[key])
        }
      return returned as T
    } else {
        return thing
    }
  }


  private constructor() {}
}
