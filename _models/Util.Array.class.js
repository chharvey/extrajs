var OBJECT = require('./Util.Object.class.js')

module.exports = class ARRAY {
  /**
   * Test whether two arrays are “the same”,
   * using {@link Util.Object.is()} equality on corresponding entries.
   *
   * “The same” means “replaceable”, that is,
   * for any deterministic function: `fn(arr1)` would return the same result as `fn(arr2)`
   * if and only if `Util.Array.is(arr1, arr2)`.
   *
   * This method returns the same result as `Util.Object.is()`, but is simply faster for arrays.
   *
   * @param  {Array} arr1 the first array
   * @param  {Array} arr2 the second array
   * @return {boolean} `true` if corresponding elements are the same (via `Util.Object.is()`)
   */
  static is(arr1, arr2) {
    if (Object.is(arr1, arr2)) return true
    if (arr1.length !== arr2.length) return false
    let returned = true
    for (let i = 0; (i < arr1.length && returned === true); i++) {
      returned = OBJECT.is(arr1[i], arr2[i])
    }
    return returned
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
   * @param  {*} arg the argument to convert
   * @param  {!Object=} database a database to check against
   * @return {Array} an array
   */
  static toArray(arg, database = {}) {
    let returned = {
      array: function () {
        return arg
      },
      number: function () {
        let array = []
        for (let n = 1; n <= arg; n++) { array.push(n) }
        return array
      },
      string: function () {
        return ARRAY.toArray(database[arg], database)
      },
      default: function () {
        return []
      },
    }
    return (returned[OBJECT.typeOf(arg)] || returned.default).call(null)
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
