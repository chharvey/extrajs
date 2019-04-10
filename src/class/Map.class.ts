import xjs_Object from './Object.class'


/**
 * Additional static members for the native Map class.
 *
 * Does not extend the native Map class.
 */
export default class xjs_Map {
	/**
	 * Test whether two maps have “the same” key–value pairs.
	 *
	 * Similar to {@link xjs_Set.is}, where the order is not important,
	 * but also has the option to check equality of keys.
	 * @param   <K> the type of keys in the maps
	 * @param   <V> the type of values in the maps
	 * @param   a the first map
	 * @param   b the second map
	 * @returns Are corresponding pairs the same, i.e. replaceable?
	 */
	static is<K, V>(a: ReadonlyMap<K, V>, b: ReadonlyMap<K, V>, {
		/** check the “sameness” of corresponding keys of `a` and `b` */
		keys = xjs_Object.sameValueZero,
		/** check the “sameness” of corresponding values of `a` and `b` */
		values = xjs_Object.sameValueZero,
	}: {
		keys   ?: (x: K, y: K) => boolean,
		values ?: (x: V, y: V) => boolean,
	} = {
		keys   : xjs_Object.sameValueZero,
		values : xjs_Object.sameValueZero,
	}): boolean {
		if (a === b) return true
		return a.size === b.size && [...a].every(([a_key, a_value]) =>
			[...b].some(([b_key, b_value]) => keys(a_key, b_key) && values(a_value, b_value))
		)
	}

	/**
	 * Return a new map with entries that pass the provided predicate function.
	 * @see https://github.com/tc39/proposal-collection-methods
	 * @param   <K> the type of keys in the map
	 * @param   <V> the type of values in the map
	 * @param   map the map to filter
	 * @param   predicate function to test each entry of the map
	 * @param   this_arg object to use as `this` when executing `predicate`
	 * @returns a new map with the entries that pass the test; if no entries pass, an empty map is returned
	 */
	static filter<K, V>(map: Map<K, V>, predicate: (value: V, key: K, map: Map<K, V>) => boolean, this_arg: unknown = null): Map<K, V> {
		return new Map([...map].filter((entry) => predicate.call(this_arg, entry[1], entry[0], map)))
	}

	/**
	 * Return a value found in the map that satisfies the predicate, or `null` if none is found.
	 * @see https://github.com/tc39/proposal-collection-methods
	 * @param   <K> the type of keys in the map
	 * @param   <V> the type of values in the map
	 * @param   map the map to search
	 * @param   predicate function to test each entry of the map
	 * @param   this_arg object to use as `this` when executing `predicate`
	 * @returns the value found, or `null` if none is found
	 */
	static find<K, V>(map: Map<K, V>, predicate: (value: V, key: K, map: Map<K, V>) => boolean, this_arg: unknown = null): V|null {
		return [...xjs_Map.filter(map, predicate, this_arg)].map((entry) => entry[1])[0] || null
	}

	/**
	 * Return a key found in the map that satisfies the predicate, or `null` if none is found.
	 * @see https://github.com/tc39/proposal-collection-methods
	 * @param   <K> the type of keys in the map
	 * @param   <V> the type of values in the map
	 * @param   map the map to search
	 * @param   predicate function to test each key of the map
	 * @param   this_arg object to use as `this` when executing `predicate`
	 * @returns the key found, or `null` if none is found
	 */
	static findKey<K, V>(map: Map<K, V>, predicate: (key: K, index: number, map: Map<K, V>) => boolean, this_arg: unknown = null): K|null {
		return [...map.keys()].find((key, i) => predicate.call(this_arg, key, i, map)) || null
	}

	/**
	 * Return a new Map with the results of calling a provided function on every value in the given Map.
	 * @see https://github.com/tc39/proposal-collection-methods
	 * @param   <K> the type of keys in the map
	 * @param   <V> the type of values in the map
	 * @param   <T> the type of new values returned by the callback
	 * @param   map the map to map
	 * @param   callback the function to call on each value of the map
	 * @param   this_arg object to use as `this` when executing `callback`
	 * @returns a new Map with the same keys and transformed values obtained from `callback`
	 */
	static mapValues<K, V, T>(map: Map<K, V>, callback: (value: V, key: K, map: Map<K, V>) => T, this_arg: unknown = null): Map<K, T> {
		return new Map([...map].map(([key, value]) => [key, callback.call(this_arg, value, key, map)] as [K, T]))
	}

	/**
	 * Return a new Map with the results of calling a provided function on every key in the given Map.
	 * @see https://github.com/tc39/proposal-collection-methods
	 * @param   <K> the type of keys in the map
	 * @param   <V> the type of values in the map
	 * @param   <T> the type of new keys returned by the callback
	 * @param   map the map to map
	 * @param   callback the function to call on each key of the map
	 * @param   this_arg object to use as `this` when executing `callback`
	 * @returns a new Map with transformed keys obtained from `callback` and the same values
	 */
	static mapKeys<K, V, T>(map: Map<K, V>, callback: (value: V, key: K, map: Map<K, V>) => T, this_arg: unknown = null): Map<T, V> {
		return new Map([...map].map(([key, value]) => [callback.call(this_arg, value, key, map), value] as [T, V]))
	}



	private constructor() {}
}
