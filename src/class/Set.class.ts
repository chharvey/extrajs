import xjs_Object from './Object.class'
import xjs_Array from './Array.class'


/**
 * Additional static members for the native Set class.
 *
 * Does not extend the native Set class.
 */
export default class xjs_Set {
	/**
	 * Test whether two sets have “the same” elements.
	 *
	 * Similar to {@link xjs_Array.is}, but for sets, the order of elements is not important.
	 * @param   <T> the type of elements in the sets
	 * @param   a the first set
	 * @param   b the second set
	 * @param   comparator a predicate checking the “sameness” of corresponding elements of `a` and `b`
	 * @returns Are corresponding elements the same, i.e. replaceable??
	 */
	static is<T>(a: ReadonlySet<T>, b: ReadonlySet<T>, comparator: (x: any, y: any) => boolean = xjs_Object.sameValueZero): boolean {
		if (a === b) return true
		return a.size === b.size &&
			[...a].every((a_el) => [...b].some((b_el) => comparator(a_el, b_el))) &&
			[...b].every((b_el) => [...a].some((a_el) => comparator(b_el, a_el)))
	}

	/**
	 * Return whether `a` is a subset of `b`: whether all elements of `a` are in `b`.
	 *
	 * Note that if `a` is an empty set, or if `a` and `b` are “the same” (as determined by `comparator`),
	 * this method returns `true`.
	 * @param   <T> the type of elements in `a`
	 * @param   <U> the type of elements in `b`
	 * @param   a the smaller set
	 * @param   b the larger set
	 * @param   comparator a predicate checking the “sameness” of corresponding elements of `a` and `b`
	 * @returns Is `a` a subarray of `b`?
	 */
	static isSubsetOf<U, T extends U>(a: ReadonlySet<T>, b: ReadonlySet<U>, comparator: (x: any, y: any) => boolean = xjs_Object.sameValueZero): boolean {
		return xjs_Array.isSubarrayOf([...a], [...b], comparator)
	}

	/**
	 * {@link xjs_Set.isSubsetOf}, but with the parameters switched.
	 * @param   <T> the type of elements in `a`
	 * @param   <U> the type of elements in `b`
	 * @param   a the larger set
	 * @param   b the smaller set
	 * @param   comparator a predicate checking the “sameness” of corresponding elements of `a` and `b`
	 * @returns exactly `xjs_Set.isSubsetOf(b, a, comparator)`
	 */
	static isSupersetOf<T, U extends T>(a: ReadonlySet<T>, b: ReadonlySet<U>, comparator: (x: any, y: any) => boolean = xjs_Object.sameValueZero): boolean {
		return xjs_Set.isSubsetOf(b, a, comparator)
	}

	/**
	 * Return the union (disjunction) of two sets: the set of elements that are in either set (or both sets).
	 * @param   <T> the type of elements in the `a`
	 * @param   <U> the type of elements in the `b`
	 * @param   a the first set
	 * @param   b the second set
	 * @returns a new Set containing the elements present in either `a` or `b` (or both)
	 */
	static union<T, U>(a: ReadonlySet<T>, b: ReadonlySet<U>): Set<T|U> {
		const returned: Set<T|U> = new Set(a)
		b.forEach((el) => { returned.add(el) })
		return returned
	}

	/**
	 * Return the intersection (conjunction) of two sets: the set of elements that are in both sets.
	 * @param   <T> the type of elements in `a`
	 * @param   <U> the type of elements in `b`
	 * @param   a the first set
	 * @param   b the second set
	 * @returns a new Set containing the elements present only in both `a` and `b`
	 */
	static intersection<T, U>(a: ReadonlySet<T>, b: ReadonlySet<U>): Set<T&U>;
	static intersection<T>(a: ReadonlySet<T>, b: ReadonlySet<T>): Set<T> {
		const returned: Set<T> = new Set(a)
		a.forEach((el) => { if (!b.has(el)) returned.delete(el) })
		return returned
	}

	/**
	 * Return the difference (nonimplication) of two sets: the set of elements in `a`, but not in `b`.
	 * @param   <T> the type of elements in `a`
	 * @param   <U> the type of elements in `b`
	 * @param   a the first set
	 * @param   b the second set
	 * @returns a new Set containing the elements present only in `a`
	 */
	static difference<T, U>(a: ReadonlySet<T>, b: ReadonlySet<U>): Set<T>;
	static difference<T>(a: ReadonlySet<T>, b: ReadonlySet<T>): Set<T> {
		const returned: Set<T> = new Set(a)
		a.forEach((el) => { if (b.has(el)) returned.delete(el) })
		return returned
	}

	/**
	 * Return the symmetric difference (exclusive disjunction) of two sets: the set of elements either in one set, or in the other, but not both.
	 * @param   <T> the type of elements in `a`
	 * @param   <U> the type of elements in `b`
	 * @param   a the first set
	 * @param   b the second set
	 * @returns a new Set containing the elements present only in `a` or only in `b`, but not both
	 */
	static symmetricDifference<T, U>(a: ReadonlySet<T>, b: ReadonlySet<U>): Set<T|U> {
		return xjs_Set.union(xjs_Set.difference(a, b), xjs_Set.difference(b, a))
	}


	private constructor() {}
}
