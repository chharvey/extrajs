import xjs_Object from './Object.class'


/**
 * @summary Additional static members for the native Array class.
 * @description Does not extend the native Array class.
 */
export default class xjs_Array {
  /**
   * @summary Test whether two arrays are “the same”.
   * @description Shortcut of {@link xjs_Object.is} for arrays.
   * @param   arr1 the first array
   * @param   arr2 the second array
   * @returns Are corresponding elements the same (via `xjs.Object.is()`)?
   */
  static is(arr1: unknown[], arr2: unknown[]): boolean {
    if (arr1 === arr2) return true
    if (arr1.length !== arr2.length) return false
    for (let i = 0; i < arr1.length; i++) {
      if (!xjs_Object.is(arr1[i], arr2[i])) return false
    }
    return true
  }

  /**
   * @summary Deep freeze an array, and return the result.
   * @description Shortcut of {@link xjs_Object.freezeDeep} for arrays.
   * *Note: This function is impure, modifying the given argument.*
   * @param   arr the array to freeze
   * @returns the given array, with everything frozen
   */
  static freezeDeep<T>(arr: T[]): T[] {
    Object.freeze(arr)
    arr.forEach((el) => { if (!Object.isFrozen(el)) xjs_Object.freezeDeep(el) })
    return arr
  }

  /**
   * @summary Deep clone an array, and return the result.
   * @description Shortcut of {@link xjs_Object.cloneDeep} for arrays.
   * @param   arr the array to clone
   * @returns an exact copy of the given array
   */
  static cloneDeep<T>(arr: T[]): T[] {
    return arr.map((el) => xjs_Object.cloneDeep(el))
  }

  /**
   * @summary Test whether an array is a subarray of another array.
   * @description This method acts like {@link String#includes}, testing whether
   * the elements in the smaller array appear consecutively and in the same order as in the larger array.
   * In other words, if `{@link xjs_Array.is}(larger.slice(a,b), smaller)` (for some integers a and b),
   * then this method returns `true`.
   *
   * Examples:
   * ```js
   * 'twofoursix'.includes('wofo')===true
   * xjs.Array.contains([2,'w','o',4,'o','u','r',6,'i','x'], ['w','o',4,'o'])===true
   * xjs.Array.contains([2,'w','o',4,'o','u','r',6,'i','x'], ['o','u'])===true
   * xjs.Array.contains([2,'w','o',4,'o','u','r',6,'i','x'], [6,'o','u','r'])===false // not in the same order
   * xjs.Array.contains([2,'w','o',4,'o','u','r',6,'i','x'], [2,4,6])===false // not consecutive
   * ```
   *
   * @param   larger  the larger array, to test against
   * @param   smaller the smaller array, to test
   * @returns Is `smaller` a subarray of `larger`?
   * @throws  {RangeError} if the second array is larger than the first
   */
  static contains<T, U>(larger: T[], smaller: U[]): boolean {
    if (smaller.length > larger.length) throw new RangeError('Smaller array cannot have a greater length than larger array.')
    if (xjs_Array.is(smaller, [])) return true
    if (xjs_Array.is(smaller, larger)) return true
    return larger.map((el, i) => larger.slice(i, i+smaller.length)).some((sub) => xjs_Array.is(smaller, sub))
  }

  /**
   * @deprecated XXX:DEPRECATED
   * @summary “Convert” an array, number, or string into an array. (Doesn’t really convert.)
   * @description
   * - If the argument is an array, it is returned unchanged.
   * - If the argument is a number `n`, an array of length `n`, filled with increasing integers,
   *   starting with 1, is returned. (E.g. if `n===5` then `[1,2,3,4,5]` is returned.)
   * - If the argument is a string, that string is checked as an **own property** of the given database.
   *   If the value of that property *is* a string, then *that* string is checked, and so on,
   *   until an array or number is found. If no entry is found, an empty array is returned.
   *   The default database is an empty object `{}`.
   * @param   arg the argument to convert
   * @param   database a database to check against
   * @returns an array
   */
  static toArray(arg: any, database: object = {}): any[] {
    const switch_: { [index: string]: () => unknown[] } = {
      'array': () => {
        return arg as any[]
      },
      'number': () => {
        let array = []
        for (let n = 1; n <= arg; n++) { array.push(n) }
        return array
      },
      'string': () => {
        let check = (database as { [index: string]: unknown })[arg]
        return xjs_Array.toArray(check, database)
      },
      default() {
        return []
      },
    }
    return (switch_[xjs_Object.typeOf(arg)] || switch_.default)()
  }

  /**
   * @summary Make a copy of an array, and then remove duplicate entries.
   * @description "Duplicate entries" are entries that considered "the same" by
   * the provided comparator function, or if none is given, `Object.is()`.
   * Only duplicate entries are removed; the order of non-duplicates is preserved.
   * @param   arr an array to use
   * @param   comparator a function comparing elements in the array
   * @returns a new array, with duplicates removed
   */
  static removeDuplicates<T>(arr: T[], comparator: (a: unknown, b: unknown) => boolean = Object.is): T[] {
    const returned = arr.slice()
    for (let i = 0; i < returned.length; i++) {
      for (let j = i+1; j < returned.length; j++) {
        if (comparator(returned[i], returned[j])) returned.splice(j, 1)
      }
    }
    return returned
  }


  private constructor() {}
}
