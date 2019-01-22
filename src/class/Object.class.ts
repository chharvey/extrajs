import xjs_Array_module from './Array.class'


/**
 * A helper for {@link xjs_Object.switch}.
 * @param args a list of arguments to be passed to the function
 */
type SwitchFn<T> = (this: any, ...args: any[]) => T;

/**
 * Additional static members for the native Object class.
 *
 * Does not extend the native Object class.
 */
export default class xjs_Object {
	/**
	 * Test whether two things have “the same” properties.
	 *
	 * This function tests the properties of two arguemnts, using the provided comparator predicate.
	 * Arguments must be of the same type.
	 * If both are primitives, this method checks
	 * {@link xjs_Object._sameValueZero|Same-Value-Zero Equality}.
	 * If both are functions, this method throws an TypeError — functions are not supported at this time.
	 * If both arguments are arrays, it is faster and more robust to use {@link xjs_Array.is}.
	 * If both are objects or arrays, this method checks the properties (or elements) of each,
	 * comparing them with the provided comparator predicate.
	 *
	 * If no predicate is provided, this method uses the default predicate {@link xjs_Object._sameValueZero}.
	 *
	 * Note: This method does not deep-check equality within the objects’ properties (or arrays’ elements).
	 * To check deeper, I suggest using Node.js’s native
	 * {@link https://nodejs.org/dist/latest/docs/api/assert.html#assert_assert_deepstrictequal_actual_expected_message|assert.deepStrictEqual}.
	 * You may also specify this behavior in your custom comparator.
	 *
	 * This method is based on the
	 * {@link https://en.wikipedia.org/wiki/Liskov_substitution_principle|Liskov Substitution Principle}.
	 * Values that are considered “the same” should semantically mean they are “replaceable”
	 * with one another. This is demonstrated rigorously below.
	 *
	 * Let us define a “replaceability” relation `R` as thus: a value `x` can be replaced with a value `y`
	 * exactly when, given any deterministic (that is, **well-defined**, or **right-unique**)
	 * function `fn`, the value `fn(x)` equals the value `fn(y)`.
	 * Then this replaceability relation `R` is **symmetric**, because `x R y` implies `y R x`.
	 * We want `xjs.Object.is(x, y)` to emulate this relation.
	 *
	 * @param   a the first  thing
	 * @param   b the second thing
	 * @param   comparator a predicate checking the “sameness” of corresponding properties of `a` and `b`
	 * @returns Are corresponding properties the same, i.e. replaceable?
	 * @throws  {TypeError} if either `a` or `b` is a function (not supported)
	 */
	static is<T>(a: T, b: T, comparator: (x: any, y: any) => boolean = xjs_Object.sameValueZero): boolean {
		if (['string', 'number', 'boolean', 'null', 'undefined'].includes(xjs_Object.typeOf(a))) {
			return xjs_Object.sameValueZero(a, b)
		}
		if (xjs_Object.typeOf(a) === 'function') throw new TypeError('Function arguments to xjs.Object.is are not yet supported.')
		// else, it will be 'object' or 'array'
		return a === b || Object.entries(a).every((a_entry) =>
			Object.entries(b).some((b_entry) => a_entry[0] === b_entry[0] && comparator(a_entry[1], b_entry[1]))
		)
	}

	/**
	 * Test whether two things are equal vis-à-vis the Same-Value-Zero algorithm.
	 *
	 * This method is less strict than
	 * {@link https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/is|Object.is},
	 * only in that `.sameValueZero(0, -0)` will return `true`.
	 * @see https://developer.mozilla.org/en-US/docs/Web/JavaScript/Equality_comparisons_and_sameness#Same-value-zero_equality
	 * @param   a the first  thing
	 * @param   b the second thing
	 * @returns exactly `a === b || Object.is(a, b)`
	 */
	static sameValueZero(a: unknown, b: unknown): boolean {
		return a === b || Object.is(a, b)
	}

	/**
	 * A structured `switch` statement.
	 *
	 * This method offers a more structured alternative to a standard `switch` statement,
	 * using object lookups to find values.
	 * It takes two arguments: a key and a dictionary.
	 *
	 * The first argument is the key in the dictionary whose value to look up.
	 * The dictionary argument must be an object with string keys and {@link SwitchFn} values.
	 * Each of these functions, when called, should return a value corresponding to its key string.
	 * All functions in the dictionary must return the same type of value.
	 *
	 * You may optionally define a `'default'` key in your dictionary,
	 * in order to handle cases when caller input matches none of the keys.
	 * *The `'default'` key is analogous to the **`default` clause** of a `switch` statement.*
	 * You may omit a `'default'` key if you are certain that you’ve accounted for all the inputs,
	 * such as when the inputs are Enum values.
	 *
	 * Note that this method looks for `'default'` when it cannot find any other key,
	 * and in doing so it logs a warning.
	 * To suppress this warning, it is best to provide keys for all known possible inputs,
	 * even if that means duplicating `SwitchFn` values.
	 * (Though it’s easy to define a `SwitchFn` before calling this method.)
	 * Best practice is to write a `'default'` case only for unknown key inputs.
	 *
	 * The following example calls this method to look up
	 * the date of the *nth* Tuesday of each month of 2018,
	 * where *n* could be a number 1 through 5.
	 * (Note that this example is actually pretty inefficient,
	 * but it only serves as a demonstration.)
	 *
	 * ```js
	 * // What is the date of the 1st Tuesday of November, 2018?
	 * let call_me = xjs.Object.switch<number>('November', {
	 *   'January'  : (n: number) => [ 2,  9, 16, 23,  30][n - 1],
	 *   'February' : (n: number) => [ 6. 13. 20, 27, NaN][n - 1],
	 *   'March'    : (n: number) => [ 6, 13, 20, 27, NaN][n - 1],
	 *   'April'    : (n: number) => [ 3, 10, 17, 24, NaN][n - 1],
	 *   'May'      : (n: number) => [ 1,  8, 15, 22,  29][n - 1],
	 *   'June'     : (n: number) => [ 5, 12, 19, 26, NaN][n - 1],
	 *   'July'     : (n: number) => [ 3, 10, 17, 24,  31][n - 1],
	 *   'August'   : (n: number) => [ 7, 14, 21, 28, NaN][n - 1],
	 *   'September': (n: number) => [ 4, 11, 18, 25, NaN][n - 1],
	 *   'October'  : (n: number) => [ 2,  9, 16, 23,  30][n - 1],
	 *   'November' : (n: number) => [ 6, 13, 20, 27, NaN][n - 1],
	 *   'December' : (n: number) => [ 4, 11, 18, 25, NaN][n - 1],
	 *   'default'  : (n: number) => NaN,
	 * }) // returns a function taking `n` and returning one of `[6,13,20,27,NaN]`
	 * call_me(1) // returns the number `6`
	 * ```
	 *
	 * @param   key the key to provide the lookup, which will give a function
	 * @param   dictionary an object with {@link SwitchFn} values
	 * @returns the looked-up function
	 * @throws  {ReferenceError} when failing to find a lookup value
	 */
	static switch<T>(key: string, dictionary: { [index: string]: SwitchFn<T> }): SwitchFn<T> {
		let returned = dictionary[key]
		if (!returned) {
			console.warn(`Key '${key}' cannot be found. Using key 'default'…`)
			returned = dictionary['default']
			if (!returned) throw new ReferenceError(`No default key found.`)
		}
		return returned
	}

  /**
   * Return the type of a thing.
   *
   * Similar to the `typeof` primitive operator, but more refined.
   * Note: this method should only be used at runtime —
   * TypeScript is much better at checking types, and can do so at compile time.
   *
   * Warning! passing undeclared variables will throw a `ReferenceError`!
   *
   * ```js
   * typeof null     // 'object' :(
   * typeof []       // 'object'
   * typeof NaN      // 'number'
   * typeof Infinity // 'number'
   * xjs.typeOf(null)     // 'null'
   * xjs.typeOf([])       // 'array'
   * xjs.typeOf(NaN)      // 'NaN'
   * xjs.typeOf(Infinity) // 'infinite'
   *
   * var x;
   * typeof x;       // 'undefined'
   * typeof y;       // 'undefined'
   * xjs.typeOf(x);  // 'undefined'
   * xjs.typeOf(y);  // Uncaught ReferenceError: y is not defined
   * ```
   *
   * @see {@link https://github.com/zaggino/z-schema/blob/bddb0b25daa0c96119e84b121d7306b1a7871594/src/Utils.js#L12|Credit to @zaggino}
   * @param   thing anything
   * @returns the type of the thing
   */
	static typeOf(thing: unknown): string {
		return xjs_Object.switch<string>(typeof thing, {
			'object': (arg: unknown) => {
				if (arg === null)       return 'null'
				if (Array.isArray(arg)) return 'array'
				return 'object'
			},
			'number': (arg: number) => {
				if (Number.isNaN(arg))     return 'NaN'
				if (!Number.isFinite(arg)) return 'infinite'
				return 'number'
			},
			'function' : () => 'function',
			'string'   : () => 'string',
			'boolean'  : () => 'boolean',
			'undefined': () => 'undefined',
			'default'  : (arg: unknown) => typeof arg,
		})(thing)
	}

  /**
   * WARNING{EXPERIMENTAL}
   * Return the name of an object’s constructing class or function.
   *
   * This method reveals the most specific class that the native `instanceof` operator would reveal.
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
   * WARNING{EXPERIMENTAL}
   * Deep freeze an object, and return the result.
   *
   * *Note: This function is impure, modifying the given argument.*
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
		const xjs_Array: typeof xjs_Array_module = require('./Array.class.js').default // NB relative to dist
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
   * WARNING{EXPERIMENTAL}
   * Deep clone an object, and return the result.
   *
   * If an array or object is passed,
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
   * @returns an exact copy of the given value, but with nothing equal via `===` (unless the value given is primitive)
   */
  static cloneDeep<T>(thing: T): T {
		const xjs_Array: typeof xjs_Array_module = require('./Array.class.js').default // NB relative to dist
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
