import {xjs_Object} from './Object.class.js';
import {xjs_Array} from './Array.class.js';


/**
 * Additional static members for the native Set class.
 *
 * Does not extend the native Set class.
 */
export class xjs_Set {
	/**
	 * Test whether two sets have “the same” elements.
	 *
	 * Similar to {@link xjs_Array.is}, but for sets, the order of elements is not important.
	 * @typeparam T - the type of elements in the sets
	 * @param   a the first set
	 * @param   b the second set
	 * @param   predicate check the “sameness” of corresponding elements of `a` and `b`
	 * @returns Are corresponding elements the same, i.e. replaceable?
	 */
	public static is<T>(a: ReadonlySet<T>, b: ReadonlySet<T>, predicate: (x: T, y: T) => boolean = xjs_Object.sameValueZero): boolean {
		if (a === b) {
			return true;
		}
		return a.size === b.size
			&& [...a].every((a_el) => [...b].some((b_el) => xjs_Object.sameValueZero(a_el, b_el) || predicate(a_el, b_el)))
			&& [...b].every((b_el) => [...a].some((a_el) => xjs_Object.sameValueZero(b_el, a_el) || predicate(b_el, a_el)));
	}

	/**
	 * Return a new set with elements that pass the provided predicate function.
	 * @see https://github.com/tc39/proposal-collection-methods
	 * @typeparam T - the type of elements in the set
	 * @param   set the set to filter
	 * @param   predicate function to test each element of the set
	 * @param   this_arg object to use as `this` when executing `predicate`
	 * @returns a new set with the elements that pass the test; if no elements pass, an empty set is returned
	 */
	public static filter<T>(set: Set<T>, predicate: (element: T, index: T, set: Set<T>) => boolean, this_arg: unknown = null): Set<T> {
		return new Set([...set].filter((el) => predicate.call(this_arg, el, el, set)));
	}

	/**
	 * Return a value found in the set that satisfies the predicate, or `null` if none is found.
	 * @see https://github.com/tc39/proposal-collection-methods
	 * @typeparam T - the type of elements in the set
	 * @param   set the set to search
	 * @param   predicate function to test each element of the set
	 * @param   this_arg object to use as `this` when executing `predicate`
	 * @returns the item found, or `null` if none is found
	 */
	public static find<T>(set: Set<T>, predicate: (element: T, index: T, set: Set<T>) => boolean, this_arg: unknown = null): T | null {
		return [...xjs_Set.filter(set, predicate, this_arg)][0] || null;
	}

	/**
	 * Return a new Set with the results of calling a provided function on every element in the given Set.
	 * @see https://github.com/tc39/proposal-collection-methods
	 * @typeparam T - the type of elements in the set
	 * @typeparam U - the type of new elements returned by the callback
	 * @param   set the set to map
	 * @param   callback the function to call on each element of the set
	 * @param   this_arg object to use as `this` when executing `callback`
	 * @returns a new Set with transformed elements obtained from `callback`
	 */
	public static map<T, U>(set: Set<T>, callback: (element: T, index: T, set: Set<T>) => U, this_arg: unknown = null): Set<U> {
		return new Set([...set].map((el) => callback.call(this_arg, el, el, set)));
	}

	/**
	 * Return whether `a` is a subset of `b`: whether all elements of `a` are in `b`.
	 *
	 * Note that if `a` is an empty set, or if `a` and `b` are “the same” (as determined by `predicate`),
	 * this method returns `true`.
	 * @see https://github.com/tc39/proposal-set-methods
	 * @typeparam T - the type of elements in `a`
	 * @typeparam U - the type of elements in `b`
	 * @param   a the smaller set
	 * @param   b the larger set
	 * @param   predicate check the “sameness” of corresponding elements of `a` and `b`
	 * @returns Is `a` a subset of `b`?
	 */
	public static isSubsetOf<U, T extends U>(a: ReadonlySet<T>, b: ReadonlySet<U>, predicate: (x: U, y: U) => boolean = xjs_Object.sameValueZero): boolean {
		return xjs_Array.isSubarrayOf([...a].sort(), [...b].sort(), predicate);
	}

	/**
	 * {@link xjs_Set.isSubsetOf}, but with the parameters switched.
	 * @see https://github.com/tc39/proposal-set-methods
	 * @typeparam T - the type of elements in `a`
	 * @typeparam U - the type of elements in `b`
	 * @param   a the larger set
	 * @param   b the smaller set
	 * @param   predicate check the “sameness” of corresponding elements of `a` and `b`
	 * @returns exactly `xjs.Set.isSubsetOf(b, a, predicate)`
	 */
	public static isSupersetOf<T, U extends T>(a: ReadonlySet<T>, b: ReadonlySet<U>, predicate: (x: T, y: T) => boolean = xjs_Object.sameValueZero): boolean {
		return xjs_Set.isSubsetOf(b, a, predicate);
	}

	/**
	 * Return the union (disjunction) of two sets: the set of elements that are in either set (or both sets).
	 * @see https://github.com/tc39/proposal-set-methods
	 * @typeparam T - the type of elements in the `a`
	 * @typeparam U - the type of elements in the `b`
	 * @param   a the first set
	 * @param   b the second set
	 * @param   comparator a comparator function
	 * @returns a new Set containing the elements present in either `a` or `b` (or both)
	 */
	public static union<T, U>(a: ReadonlySet<T>, b: ReadonlySet<U>, comparator?: (a: T | U, b: T | U) => boolean): Set<T | U> {
		const returned = new Set<T | U>(a);
		b.forEach((el) => {
			if (!comparator) {
				returned.add(el);
			} else {
				xjs_Set.add(returned, el, comparator);
			}
		});
		return returned;
	}

	/**
	 * Return the intersection (conjunction) of two sets: the set of elements that are in both sets.
	 * @see https://github.com/tc39/proposal-set-methods
	 * @typeparam T - the type of elements in `a`
	 * @typeparam U - the type of elements in `b`
	 * @param   a the first set
	 * @param   b the second set
	 * @param   comparator a comparator function
	 * @returns a new Set containing the elements present only in both `a` and `b`
	 */
	public static intersection<T, U>(a: ReadonlySet<T>, b: ReadonlySet<U>, comparator?: (a: T & U, b: T & U) => boolean): Set<T & U>;
	public static intersection<T>(a: ReadonlySet<T>, b: ReadonlySet<T>, comparator?: (a: T, b: T) => boolean): Set<T> {
		const returned = new Set<T>();
		b.forEach((el) => {
			if (!comparator) {
				if (a.has(el)) {
					returned.add(el);
				}
			} else {
				if (xjs_Set.has(a, el, comparator)) {
					xjs_Set.add(returned, el, comparator);
				}
			}
		});
		return returned;
	}

	/**
	 * Return the difference (nonimplication) of two sets: the set of elements in `a`, but not in `b`.
	 * @see https://github.com/tc39/proposal-set-methods
	 * @typeparam T - the type of elements in `a`
	 * @typeparam U - the type of elements in `b`
	 * @param   a the first set
	 * @param   b the second set
	 * @param   comparator a comparator function
	 * @returns a new Set containing the elements present only in `a`
	 */
	public static difference<T, U>(a: ReadonlySet<T>, b: ReadonlySet<U>, comparator?: (a: T | U, b: T | U) => boolean): Set<T>;
	public static difference<T>(a: ReadonlySet<T>, b: ReadonlySet<T>, comparator?: (a: T, b: T) => boolean): Set<T> {
		const returned = new Set<T>();
		a.forEach((el) => {
			if (!comparator) {
				if (!b.has(el)) {
					returned.add(el);
				}
			} else {
				if (!xjs_Set.has(b, el, comparator)) {
					xjs_Set.add(returned, el, comparator);
				}
			}
		});
		return returned;
	}

	/**
	 * Return the symmetric difference (exclusive disjunction) of two sets: the set of elements either in one set, or in the other, but not both.
	 *
	 * Equivalent to:
	 * - `difference( union(a,b) , intersection(a,b) )`
	 * - `union( difference(a,b) , difference(b,a) )`
	 * @see https://github.com/tc39/proposal-set-methods
	 * @typeparam T - the type of elements in `a`
	 * @typeparam U - the type of elements in `b`
	 * @param   a the first set
	 * @param   b the second set
	 * @param   comparator a comparator function
	 * @returns a new Set containing the elements present only in `a` or only in `b`, but not both
	 */
	public static symmetricDifference<T, U>(a: ReadonlySet<T>, b: ReadonlySet<U>, comparator?: (a: T | U, b: T | U) => boolean): Set<T | U> {
		return xjs_Set.difference(
			xjs_Set.union(a, b, comparator),
			xjs_Set.intersection(a, b, comparator),
			comparator,
		);
	}

	/**
	 * Return whether the provided element exists in the set.
	 * @param  set        the set to check
	 * @param  element    the element to check
	 * @param  comparator a comparator function
	 * @return            Does the set have the given element?
	 */
	public static has<T>(set: ReadonlySet<T>, element: T, comparator: (a: T, b: T) => boolean): boolean {
		return [...set].some((e) => comparator.call(null, e, element));
	}

	/**
	 * Add the provided element to the set.
	 * @param  set        the set to mutate
	 * @param  element    the element to add
	 * @param  comparator a comparator function
	 * @return            the mutated set
	 */
	public static add<T>(set: Set<T>, element: T, comparator: (a: T, b: T) => boolean): typeof set {
		return xjs_Set.has<T>(set, element, comparator) ? set : set.add(element);
	}

	/**
	 * Delete the provided element from the set.
	 * @param  set        the set to mutate
	 * @param  element    the element to delete
	 * @param  comparator a comparator function
	 * @return            Was the set mutated?
	 */
	public static delete<T>(set: Set<T>, element: T, comparator: (a: T, b: T) => boolean): boolean {
		const foundel: T | undefined = [...set].find((e) => comparator.call(null, e, element));
		return set.delete((foundel === undefined) ? element : foundel);
	}


	// eslint-disable-next-line @typescript-eslint/no-empty-function --- we want the constructor to be private
	private constructor() {}
}
