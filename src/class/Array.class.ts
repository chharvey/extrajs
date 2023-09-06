import {xjs_Object} from './Object.class.js';
import {xjs_Number} from './Number.class.js';
import {IndexOutOfBoundsError} from './IndexOutOfBoundsError.class.js';


/**
 * Additional static members for the native Array class.
 *
 * Does not extend the native Array class.
 */
export class xjs_Array {
	/**
	 * Get a value of an array, given an index.
	 *
	 * Same as `arr[index]`, but more robust.
	 * @param   arr the array to search
	 * @param   index the index of the returned value
	 * @returns the value in `arr` found at `index`
	 * @throws  {NaNError} if the given index is `NaN`
	 * @throws  {IndexOutOfBoundsError} if the index is out of bounds (or if the returned value is `undefined`)
	 */
	public static get<T>(arr: T[], index: number): T {
		xjs_Number.assertType(index);
		if (arr[index] === void 0) {
			throw new IndexOutOfBoundsError(index);
		}
		return arr[index];
	}

	/**
	 * Test whether an array is a subarray of another array.
	 *
	 * This method acts like
	 * {@link String#includes},
	 * testing whether
	 * the elements in the smaller array appear consecutively and in the same order as in the larger array.
	 * In other words, if `{@link xjs_Array.is}(larger.slice(a,b), smaller)` (for some integers a and b),
	 * then this method returns `true`.
	 * Warning: passing in sparse arrays can yield unexpected results.
	 *
	 * Elements are compared via the provided predicate.
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
	 * @typeparam T - the type of elements in `larger` and `smaller`
	 * @param   larger  the larger array, to test against
	 * @param   smaller the smaller array, to test
	 * @param   predicate check the “sameness” of corresponding elements of `larger` and `smaller`
	 * @returns is `smaller` a subarray of `larger`?
	 * @throws  {RangeError} if the second array is larger than the first
	 * @deprecated use {@link xjs_Array.isConsecutiveSuperarrayOf} instead.
	 */
	public static contains<T>(larger: readonly T[], smaller: readonly T[], predicate: (x: T, y: T) => boolean = xjs_Object.sameValueZero): boolean {
		if (smaller.length > larger.length) {
			throw new RangeError('First argument cannot be smaller than the second. Try switching the arguments.');
		}
		if (xjs_Array.is(smaller, [], predicate)) {
			return true;
		}
		if (xjs_Array.is(smaller, larger, predicate)) {
			return true;
		}
		return larger.map((_el, i) => larger.slice(i, i + smaller.length)).some((sub) => xjs_Array.is(smaller, sub, predicate));
	}

	/**
	 * Test whether two arrays have “the same” elements.
	 *
	 * Note: Use this method only if providing a predicate.
	 * If testing for “same-value-zero” equality (the default predicate), use
	 * Node.js’s built-in `assert.deepStrictEqual()` instead.
	 *
	 * Shortcut of {@link xjs_Object.is}, but for arrays.
	 * Warning: passing in sparse arrays can yield unexpected results.
	 * @typeparam T - the type of elements in `a` and `b`
	 * @param   a the first array
	 * @param   b the second array
	 * @param   predicate check the “sameness” of corresponding elements of `a` and `b`
	 * @returns Are corresponding elements the same, i.e. replaceable?
	 */
	public static is<T>(a: readonly T[], b: readonly T[], predicate: (x: T, y: T) => boolean = xjs_Object.sameValueZero): boolean {
		if (a === b) {
			return true;
		}
		return a.length === b.length && a.every((el, i) => xjs_Object.sameValueZero(el, b[i]) || predicate(el, b[i]));
	}

	/**
	 * Return whether `a` is a subarray of `b`.
	 *
	 * If and only if `a` is a subarray of `b`, all of the following must be true:
	 * - `a` cannot be larger than `b`
	 * - every element of `a` must appear somewhere in `b`,
	 * 	where comparison is determined by the `predicate` parameter
	 * - the elements of `a` that are in `b` must appear in the same order in which they appear in `a`
	 *
	 * Note that if `a` is an empty array `[]`, or if `a` and `b` are “the same” (as determined by `predicate`),
	 * this method returns `true`.
	 * @typeparam T - the type of elements in `a`
	 * @typeparam U - the type of elements in `b`
	 * @param   a the smaller array
	 * @param   b the larger array
	 * @param   predicate check the “sameness” of corresponding elements of `a` and `b`
	 * @returns Is `a` a subarray of `b`?
	 */
	public static isSubarrayOf<U, T extends U>(a: readonly T[], b: readonly U[], predicate: (x: U, y: U) => boolean = xjs_Object.sameValueZero): boolean {
		return a.length <= b.length && (
			   a.length === 0
			|| xjs_Array.is(a, b, predicate)
			|| a
				.map((t) => b.findIndex((u) => predicate(u, t))) // indices of `b`’s elements in the order in which they appear in `a`
				.every((n, i, indices) => n >= 0 && (i === 0 || indices[i] > indices[i - 1])) // indices must all be 0+ and increasing (all of `a`’s elements are present in `b` and in the right order)
		);
	}

	/**
	 * {@link xjs_Array.isSubarrayOf}, but with the parameters switched.
	 * @typeparam T - the type of elements in `a`
	 * @typeparam U - the type of elements in `b`
	 * @param   a the larger array
	 * @param   b the smaller array
	 * @param   predicate check the “sameness” of corresponding elements of `a` and `b`
	 * @returns exactly `xjs_Array.isSubarrayOf(b, a, predicate)`
	 */
	public static isSuperarrayOf<T, U extends T>(a: readonly T[], b: readonly U[], predicate: (x: T, y: T) => boolean = xjs_Object.sameValueZero): boolean {
		return xjs_Array.isSubarrayOf(b, a, predicate);
	}

	/**
	 * {@link xjs_Array.isSubarrayOf}, but the elements of `a` must appear consecutively in `b`.
	 * @typeparam T - the type of elements in `a`
	 * @typeparam U - the type of elements in `b`
	 * @param   a the smaller array
	 * @param   b the larger array
	 * @param   predicate check the “sameness” of corresponding elements of `a` and `b`
	 * @returns Is `a` a consecutive subarray of `b`?
	 */
	public static isConsecutiveSubarrayOf<U, T extends U>(a: readonly T[], b: readonly U[], predicate: (x: U, y: U) => boolean = xjs_Object.sameValueZero): boolean {
		return xjs_Array.isSubarrayOf(a, b, predicate) && b.map((_el, i) => b.slice(i, i + a.length)).some((sub) => xjs_Array.is(a, sub, predicate));
	}

	/**
	 * {@link xjs_Array.isConsecutiveSubarrayOf} but with the parameters switched.
	 * @typeparam T - the type of elements in `a`
	 * @typeparam U - the type of elements in `b`
	 * @param   a the larger array
	 * @param   b the smaller array
	 * @param   predicate check the “sameness” of corresponding elements of `a` and `b`
	 * @returns exactly `xjs_Array.isConsecutiveSubarrayOf(b, a, predicate)`
	 */
	public static isConsecutiveSuperarrayOf<T, U extends T>(a: readonly T[], b: readonly U[], predicate: (x: T, y: T) => boolean = xjs_Object.sameValueZero): boolean {
		return xjs_Array.isConsecutiveSubarrayOf(b, a, predicate);
	}

	/**
	 * Look at the top of a stack, without affecting the stack.
	 * @typeparam T - the type of elements in `arr`
	 * @param   arr the stack to peek
	 * @returns the last entry of the array, if the array is nonempty
	 * @throws  {RangeError} if the array is empty
	 */
	public static peek<T>(arr: readonly T[]): T {
		if (!arr.length) {
			throw new RangeError('Cannot peek an empty array.');
		}
		return arr[arr.length - 1];
		// return arr.slice(-1)[0];
	}

	/**
	 * Asynchronous {@link Array#filter}.
	 * @typeparam T - the type of elements in the array
	 * @param   arr the array to filter
	 * @param   predicate function to test each element of the array
	 * @param   this_arg object to use as `this` when executing `predicate`
	 * @returns a new array with the elements that pass the test; if no elements pass, an empty array is returned
	 */
	public static async filterAsync<T>(arr: T[], predicate: (ele: T, idx: number, ary: T[]) => Promise<boolean> | boolean, this_arg: unknown = null): Promise<T[]> {
		const tests: boolean[] = await Promise.all(arr.map((el, i) => predicate.call(this_arg, el, i, arr)));
		return arr.filter((_, i) => tests[i]);
	}

	/**
	 * Asynchronous {@link Array#find}.
	 * @typeparam T - the type of elements in the array
	 * @param   arr the array to search
	 * @param   predicate function to test each element of the array
	 * @param   this_arg object to use as `this` when executing `predicate`
	 * @returns the item found, or `null` if none is found
	 */
	public static async findAsync<T>(arr: T[], predicate: (ele: T, idx: number, ary: T[]) => Promise<boolean> | boolean, this_arg: unknown = null): Promise<T | null> {
		return (await xjs_Array.filterAsync(arr, predicate, this_arg))[0] || null;
	}

	/**
	 * Perform a callback function on an array, aggregating any errors caught.
	 *
	 * Instead of throwing on the first error and stopping iteration, as {@link Array#forEach} would do,
	 * this method continues performing the callback on the rest of the array until all items are done.
	 * If only one error was caught, then that error is simply rethrown.
	 * However, if more errors were caught, they are collected into a single AggregateError, which is then thrown.
	 * If no errors are caught, this method returns void.
	 *
	 * @example
	 * xjs.Array.forEachAggregated<number>([1, 2, 3, 4], (n) => {
	 * 	if (n % 2 === 0) {
	 * 		throw new Error(`${ n } is even.`);
	 * 	};
	 * });
	 * // Expected thrown error:
	 * AggregateError {
	 * 	errors: [
	 * 		Error { message: "2 is even." },
	 * 		Error { message: "4 is even." },
	 * 	]
	 * }
	 * @typeparam T                the type of items in the array
	 * @param     array            the array of items
	 * @param     callback         the function to call on each item
	 * @throws    {AggregateError} if two or more iterations throws an error
	 * @throws    {Error}          if one iteration throws an error
	 */
	public static forEachAggregated<T>(array: readonly T[], callback: (item: T, i: number, src: typeof array) => void): void {
		const errors: readonly Error[] = array.map((it, i, src) => {
			try {
				callback.call(null, it, i, src);
				return null;
			} catch (err) {
				return (err instanceof Error) ? err : new Error(`${ err }`);
			}
		}).filter((e): e is Error => e instanceof Error);
		if (errors.length) {
			throw (errors.length === 1)
				? errors[0]
				: new AggregateError(errors, errors.map((err) => err.message).join('\n'));
		}
	}

	/**
	 * Map an array using a callback, aggregating any errors caught.
	 *
	 * Instead of throwing on the first error and stopping iteration, as {@link Array#map} would do,
	 * this method continues performing the callback on the rest of the array until all items are done.
	 * If only one error was caught, then that error is simply rethrown.
	 * However, if more errors were caught, they are collected into a single AggregateError, which is then thrown.
	 * If no errors are caught, this method returns the usual map.
	 *
	 * @example
	 * xjs.Array.mapAggregated<number>([1, 2, 3, 4], (n) => {
	 * 	if (n % 2 === 1) {
	 * 		throw new Error(`${ n } is odd.`);
	 * 	} else {
	 * 		return n / 2;
	 * 	};
	 * });
	 * // Expected thrown error:
	 * AggregateError {
	 * 	errors: [
	 * 		Error { message: "1 is odd." },
	 * 		Error { message: "3 is odd." },
	 * 	]
	 * }
	 *
	 * xjs.Array.mapAggregated<number>([2, 4, 6], (n) => {
	 * 	if (n % 2 === 1) {
	 * 		throw new Error(`${ n } is odd.`);
	 * 	} else {
	 * 		return n / 2;
	 * 	};
	 * });
	 * // Expected return value:
	 * [1, 2, 3]
	 * @typeparam T                the type of items in the array
	 * @typeparam U                the type of items returned by the mapping callback
	 * @param     array            the array of items
	 * @param     callback         the function to call on each item
	 * @returns                    the array of mapped items
	 * @throws    {AggregateError} if two or more iterations throws an error
	 * @throws    {Error}          if one iteration throws an error
	 */
	public static mapAggregated<T, U>(array: readonly T[], callback: (item: T, i: number, src: typeof array) => U): U[] {
		const results: readonly ([U, true] | [Error, false])[] = array.map((it, i, src) => {
			try {
				return [callback(it, i, src), true];
			} catch (err) {
				return [(err instanceof Error) ? err : new Error(`${ err }`), false];
			}
		});
		const errors: Error[] = results.filter((pair): pair is [Error, false] => !pair[1]).map(([err]) => err);
		if (errors.length) {
			throw (errors.length === 1)
				? errors[0]
				: new AggregateError(errors, errors.map((err) => err.message).join('\n'));
		} else {
			return results.filter((pair): pair is [U, true] => pair[1]).map(([val]) => val);
		}
	}

	/**
	 * Deep freeze an array, and return the result.
	 *
	 * Shortcut of {@link xjs_Object.freezeDeep}, but for arrays.
	 * Warning: passing in a sparse array can yield unexpected results.
	 * *Note: This function is impure, modifying the given argument.*
	 * @param   arr the array to freeze
	 * @returns the given array, with everything frozen
	 * @deprecated use interface `readonly T[]` instead
	 */
	public static freezeDeep<T>(arr: readonly T[]): readonly T[] {
		Object.freeze(arr);
		arr.forEach((el) => {
			if (!Object.isFrozen(el)) {
				xjs_Object.freezeDeep<T>(el);
			}
		});
		return arr;
	}

	/**
	 * WARNING:EXPERIMENTAL
	 * Deep clone an array, and return the result.
	 *
	 * Shortcut of {@link xjs_Object.cloneDeep}, but for arrays.
	 * Warning: passing in a sparse array can yield unexpected results.
	 * @typeparam T - the type of elements in `arr`
	 * @param   arr the array to clone
	 * @returns an exact copy of the given array
	 */
	public static cloneDeep<T>(arr: readonly T[]): T[] {
		return arr.map((el) => xjs_Object.cloneDeep(el));
	}

	/**
	 * Make a copy of an array, and then remove duplicate entries.
	 *
	 * "Duplicate entries" are entries that considered "the same" by
	 * the provided predicate, or if none is given,
	 * {@link xjs_Object.sameValueZero}.
	 * Only duplicate entries are removed; the order of non-duplicates is preserved.
	 * @typeparam T - the type of elements in `arr`
	 * @param   arr an array to use
	 * @param   predicate check the “sameness” of elements in the array
	 * @returns a new array, with duplicates removed
	 * @deprecated use `[...new Set(arr)]` instead
	 */
	public static removeDuplicates<T>(arr: readonly T[], predicate: (x: T, y: T) => boolean = xjs_Object.sameValueZero): T[] {
		const returned: T[] = arr.slice();
		for (let i = 0; i < returned.length; i++) {
			for (let j = i + 1; j < returned.length; j++) {
				if (predicate(returned[i], returned[j])) {
					returned.splice(j, 1);
				}
			}
		}
		return returned;
	}

	/**
	 * Remove the ‘holes’ in an array.
	 *
	 * (Make a sparse array dense, or keep a dense array dense).
	 * This method is **Pure** — it does not modify the given argument.
	 *
	 * A **sparse array** is an array whose length is greater than the number of elements its contains.
	 * For example, `new Array(4)` is a sparse array: it has a length of 4 but no elements.
	 * Sparse arrays are said to have a ‘hole’ where there is an index but no element.
	 * A **dense array** is an array whose length is equal to its number of elements.
	 *
	 * Note that accessor notation is not sufficient to detect sparseness: calling `new Array(4)[0]`
	 * will return `undefined`, even though `undefined` is not an element in the array.
	 *
	 * For example, `const arr = ['a', 'b', , 'd']` is a sparse array because `arr[2]` has not been defined.
	 * Evaluating `arr[2]` will yield `undefined`, even though it has not been explicitly declared so.
	 *
	 * @typeparam T - the type of elements in `arr`
	 * @param   arr an array to make dense
	 * @returns a copy of the given array, but with no ‘holes’;
	 *          the returned array might have a smaller `length` than the argument
	 */
	public static densify<T>(arr: readonly T[]): T[] {
		const newarr: T[] = [];
		arr.forEach((el) => { // `Array#forEach` does not iterate over holes in sparse arrays
			newarr.push(el);
		});
		return newarr;
	}

	/**
	 * Fill the ‘holes’ in an array with a given value.
	 *
	 * This method is **Pure** — it does not modify the given argument.
	 *
	 * Similar to {@link xjs_Array.densify}, but instead of removing the holes of a sparse array
	 * (thus decreasing the length), this method fills the holes with a given value,
	 * thus maintaining the original array’s length.
	 *
	 * **Warning: This method has an important side-effect:
	 * It treats entries of `undefined` as ‘holes’, even if they were intentionally declared.**
	 * Therefore this method is not well-suited for arrays with intentional entries of `undefined`.
	 * Suggestion: replace all intentional entries of `undefined` with `null`.
	 *
	 * @typeparam T - the type of elements in `arr`
	 * @param   arr an array whose ‘holes’ and `undefined`s to fill, if it has any
	 * @param   value the value to fill in the holes
	 * @returns a copy of the given array, but with all holes and `undefined`s filled;
	 *          the returned array will have the same length as the argument
	 */
	public static fillHoles<T>(arr: readonly T[], value: T): T[] {
		const newarr: T[] = arr.slice();
		for (let i = 0; i < newarr.length; i++) { // `Array#forEach` does not iterate over holes in sparse arrays
			if (newarr[i] === void 0) {
				newarr[i] = value;
			}
		}
		return newarr;
	}


	// eslint-disable-next-line @typescript-eslint/no-empty-function --- we want the constructor to be private
	private constructor() {}
}
