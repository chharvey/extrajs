const OBJ = class {
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
    if (OBJ.typeOf(num) === 'number') {
      return (Number.isInteger(num)) ? 'integer' : 'float'
    } else throw new RangeError('The number is not finite.')
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
    switch (OBJ.typeOf(thing)) {
      case 'array':
      for (let val of thing) {
        if (!Object.isFrozen(val)) OBJ.freezeDeep(val)
      }
      break;
      case 'object':
      for (let key in thing) {
        if (!Object.isFrozen(thing[key])) OBJ.freezeDeep(thing[key])
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
    let result;
    switch (OBJ.typeOf(thing)) {
      case 'array':
      result = []
      for (let val of thing) {
        result.push(OBJ.cloneDeep(val))
      }
      break;
      case 'object':
      result = {}
      for (let key in thing) {
        result[key] = OBJ.cloneDeep(thing[key])
      }
      break;
      default:
      result = thing
    }
    return result
  }
}



const ARR = class {
  /**
   * Test whether two arrays are the same,
   * using `Object.is()` equality on corresponding entries.
   * @param  {Array} arr1 the first array
   * @param  {Array} arr2 the second array
   * @return {boolean} `true` if corresponding elements are the same (via `Object.is()`)
   */
  static is(arr1, arr2) {
    if (Util.Object.typeOf(arr1) !== 'array' || Util.Object.typeOf(arr2) !== 'array') return false
    if (arr1.length !== arr2.length) return false
    let result = true
    for (let i = 0; i < arr1.length; i++) {
      // result &&= Object.is(arr1[i], arr2[i]) // IDEA
      result = result && Object.is(arr1[i], arr2[i])
    }
    return result
  }

  /**
   * “Convert” an array, number, or string into an array. (Doesn’t really convert.)
   * - If the argument is an array, it is returned unchanged.
   * - If the argument is a number `n`, an array of length `n`, filled with increasing integers,
   *   starting with 1, is returned. (E.g. if `n===5` then `[1,2,3,4,5]` is returned.)
   * - If the argument is a string, that string is checked as an **own property** of the given database.
   *   If the value of that property *is* a string, then *that* string is checked, and so on,
   *   until an array or number is found. If no entry is found, an empty array is returned.
   *   The default database is an empty object `{}`.
   * @param  {(number|Array|string)} arg the argument to convert
   * @param  {!Object=} database a database to check against
   * @return {Array} an array
   */
  static toArray(arg, database={}) {
    switch (Util.Object.typeOf(arg)) {
      case 'array':
      return arg
      case 'number':
      let array = []
      for (let n = 1; n <= arg; n++) { array.push(n) }
      return array
      case 'string':
      return Util.Array.toArray(database[arg], database)
      default:
      return []
    }
  }

  /**
   * Make a copy of an array, and then remove duplicate entries.
   * "Duplicate entries" are entries that considered "the same" by
   * the provided comparator function, or if none is given, `Object.is()`.
   * Only duplicate entries are removed; the order of non-duplicates is preserved.
   * @param  {Array} arr an array to use
   * @param  {function(*,*):boolean=} comparator a function comparing elements in the array
   * @return {Array} a new array, with duplicates removed
   */
  static removeDuplicates(arr, comparator = Object.is) {
    let returned = arr.slice()
    for (let i = 0; i < returned.length; i++) {
      for (let j = i+1; j < returned.length; j++) {
        if (comparator.call(null, returned[i], returned[j])) returned.splice(j, 1)
      }
    }
    return returned
  }
}



const DTE = class {
  /**
   * List of full month names in English.
   * @type {Array<string>}
   */
  static get MONTH_NAMES() {
    return [
      'January',
      'February',
      'March',
      'April',
      'May',
      'June',
      'July',
      'August',
      'September',
      'October',
      'November',
      'December',
    ]
  }

  /**
   * List of full day names in English.
   * @type {Array<string>}
   */
  static get DAY_NAMES() {
    return [
      'Sundary',
      'Monday',
      'Tuesday',
      'Wednesday',
      'Thursday',
      'Friday',
      'Saturday',
    ]
  }

  /**
   * Date formatting functions.
   *
   * Readable examples:
   * ```
   * FORMATS['Y-m-d'    ](new Date()) // returns '2017-08-05'
   * FORMATS['j M Y'    ](new Date()) // returns '5 Aug 2017'
   * FORMATS['d F Y'    ](new Date()) // returns '05 August 2017'
   * FORMATS['l, j F, Y'](new Date()) // returns 'Friday, 5 August, 2017'
   * FORMATS['j M'      ](new Date()) // returns '5 Aug'
   * FORMATS['M Y'      ](new Date()) // returns 'Aug 2017'
   * FORMATS['M j'      ](new Date()) // returns 'Aug 5'
   * FORMATS['M j, Y'   ](new Date()) // returns 'Aug 5, 2017'
   * FORMATS['M'        ](new Date()) // returns 'Aug'
   * FORMATS['H:i'      ](new Date()) // returns '21:33'
   * FORMATS['g:ia'     ](new Date()) // returns '9:33pm'
   * ```
   * @type {Object<function(Date):string>}
   */
  static get FORMATS() {
    /**
     * Convert a positive number to a string, adding a leading zero if and only if it is less than 10.
     * @param  {number} n any positive number
     * @return {string} that number as a string, possibly prepended with '0'
     */
    function leadingZero(n) { return `${(n < 10) ? '0' : ''}${n}` }
    return {
      'Y-m-d'    : (date) => `${date.getFullYear()}-${date.getUTCMonth()+1}-${leadingZero(date.getUTCDate())}`,
      'j M Y'    : (date) => `${date.getUTCDate()} ${Util.Date.MONTH_NAMES[date.getUTCMonth()].slice(0,3)} ${date.getFullYear()}`,
      'd F Y'    : (date) => `${leadingZero(date.getUTCDate())} ${Util.Date.MONTH_NAMES[date.getUTCMonth()]} ${date.getFullYear()}`,
      'l, j F, Y': (date) => `${Util.Date.DAY_NAMES[date.getUTCDay()]}, ${date.getUTCDate()} ${Util.Date.MONTH_NAMES[date.getUTCMonth()]}, ${date.getFullYear()}`,
      'j M'      : (date) => `${date.getUTCDate()} ${Util.Date.MONTH_NAMES[date.getUTCMonth()].slice(0,3)}`,
      'M Y'      : (date) => `${Util.Date.MONTH_NAMES[date.getUTCMonth()].slice(0,3)} ${date.getFullYear()}`,
      'M j'      : (date) => `${Util.Date.MONTH_NAMES[date.getUTCMonth()].slice(0,3)} ${date.getUTCDate()}`,
      'M j, Y'   : (date) => `${Util.Date.MONTH_NAMES[date.getUTCMonth()].slice(0,3)} ${date.getUTCDate()}, ${date.getFullYear()}`,
      'M'        : (date) => `${Util.Date.MONTH_NAMES[date.getUTCMonth()].slice(0,3)}`,
      'H:i'      : (date) => `${(date.getHours() < 10) ? '0' : ''}${date.getHours()}:${(date.getMinutes() < 10) ? '0' : ''}${date.getMinutes()}`,
      'g:ia'     : (date) => `${(date.getHours() - 1)%12 + 1}:${(date.getMinutes() < 10) ? '0' : ''}${date.getMinutes()}${(date.getHours() < 12) ? 'am' : 'pm'}`,
    }
  }
}



/**
 * Utilities that extend native Javascript.
 * @module
 */
class Util {
  /** @private */ constructor() {}

  /**
   * Additional static members for the Object class.
   * Does not extend the native Object class.
   * @namespace
   */
  static get Object() { return OBJ }

  /**
   * Additional static members for the Array class.
   * Does not extend the native Array class.
   * @namespace
   */
  static get Array() { return ARR }

  /**
   * Additional static members for the Date class.
   * Does not extend the native Date class.
   * @namespace
   */
  static get Date() { return DTE }
}



module.exports = Util
