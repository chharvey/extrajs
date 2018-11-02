import xjs_Object from './Object.class'


/**
 * Additional static members for the native Array class.
 *
 * Does not extend the native Array class.
 */
export default class xjs_Array {
	/**
	 * Test whether an array is a subarray of another array.
	 *
	 * This method acts like
	 * {@link https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String/includes|String#includes},
	 * testing whether
	 * the elements in the smaller array appear consecutively and in the same order as in the larger array.
	 * In other words, if `{@link xjs_Array.is}(larger.slice(a,b), smaller)` (for some integers a and b),
	 * then this method returns `true`.
	 *
	 * Elements are compared via the provided comparator predicate.
	 * If no predicate is provided, this method uses the default predicate {@link xjs_Object._sameValueZero}.
	 *
	 * ```js
	 * 'twofoursix'.includes('wofo')===true
	 * xjs.Array.contains([2,'w','o',4,'o','u','r',6,'i','x'], ['w','o',4,'o'])===true
	 * xjs.Array.contains([2,'w','o',4,'o','u','r',6,'i','x'], ['o','u'])===true
	 * xjs.Array.contains([2,'w','o',4,'o','u','r',6,'i','x'], [6,'o','u','r'])===false // not in the same order
	 * xjs.Array.contains([2,'w','o',4,'o','u','r',6,'i','x'], [2,4,6])===false // not consecutive
	 * xjs.Array.contains([2,4,6], [2,4,6,8]) // throws a RangeError: first array is smaller than second
	 * ```
	 *
	 * @param   larger  the larger array, to test against
	 * @param   smaller the smaller array, to test
	 * @param   comparator a predicate checking the “sameness” of corresponding elements of `larger` and `smaller`
	 * @returns is `smaller` a subarray of `larger`?
	 * @throws  {RangeError} if the second array is larger than the first
	 */
	static contains<T>(larger: T[], smaller: T[], comparator: (x: T, y: T) => boolean = xjs_Object.sameValueZero): boolean {
		if (smaller.length > larger.length) {
			throw new RangeError('First argument cannot be smaller than the second. Try switching the arguments.')
		}
		if (xjs_Array.is(smaller, []    , comparator)) return true
		if (xjs_Array.is(smaller, larger, comparator)) return true
		return larger.map((_el, i) => larger.slice(i, i+smaller.length)).some((sub) => xjs_Array.is(smaller, sub, comparator))
	}

  /**
   * Test whether two arrays have “the same” elements.
   *
   * Shortcut of {@link xjs_Object.is}, but for arrays.
   * @param   a the first array
   * @param   b the second array
   * @param   comparator a predicate checking the “sameness” of corresponding elements of `a` and `b`
   * @returns Are corresponding elements the same, i.e. replaceable??
   */
  static is<T>(a: T[], b: T[], comparator: (x: T, y: T) => boolean = xjs_Object.sameValueZero): boolean {
    return a === b || (a.length === b.length) && a.every((el, i) => comparator(el, b[i]))
  }

	/**
	 * Look at the top of a stack, without affecting the stack.
	 * @param   arr the stack to peek
	 * @returns the last entry of the array, if the array is nonempty
	 * @throws  {RangeError} if the array is empty
	 */
	static peek<T>(arr: T[]): T {
		if (!arr.length) throw new RangeError('Cannot peek an empty array.')
		return arr[arr.length - 1]
		// return arr.slice(-1)[0]
	}

  /**
   * WARNING{EXPERIMENTAL}
   * Deep freeze an array, and return the result.
   *
   * Shortcut of {@link xjs_Object.freezeDeep}, but for arrays.
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
   * WARNING{EXPERIMENTAL}
   * Deep clone an array, and return the result.
   *
   * Shortcut of {@link xjs_Object.cloneDeep}, but for arrays.
   * @param   arr the array to clone
   * @returns an exact copy of the given array
   */
  static cloneDeep<T>(arr: T[]): T[] {
    return arr.map((el) => xjs_Object.cloneDeep(el))
  }

  /**
   * WARNING{EXPERIMENTAL}
   * Make a copy of an array, and then remove duplicate entries.
   *
   * "Duplicate entries" are entries that considered "the same" by
   * the provided comparator function, or if none is given,
   * {@link xjs_Object.sameValueZero}.
   * Only duplicate entries are removed; the order of non-duplicates is preserved.
   * @param   arr an array to use
   * @param   comparator a function comparing elements in the array
   * @returns a new array, with duplicates removed
   */
  static removeDuplicates<T>(arr: T[], comparator: (x: T, y: T) => boolean = xjs_Object.sameValueZero): T[] {
    const returned: T[] = arr.slice()
    for (let i = 0; i < returned.length; i++) {
      for (let j = i + 1; j < returned.length; j++) {
        if (comparator(returned[i], returned[j])) returned.splice(j, 1)
      }
    }
    return returned
  }


  private constructor() {}
}
