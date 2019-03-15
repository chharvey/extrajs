/**
 * Additional static members for the native Map class.
 *
 * Does not extend the native Map class.
 */
export default class xjs_Map {
	/**
	 * Return a value found in the map that satisfies the predicate, or `null` if none is found.
	 * @see https://github.com/tc39/proposal-collection-methods
	 * @param   <K> the type of keys in the map
	 * @param   <V> the type of values in the map
	 * @param   map the map to search
	 * @param   predicate the testing function
	 * @param   this_arg object to use as `this` when executing `predicate`
	 * @returns the value found, or `null` if none is found
	 */
	static find<K, V>(map: Map<K, V>, predicate: (value: V, key: K, map: Map<K, V>) => boolean, this_arg: unknown = null): V|null {
		const returned: [K, V]|null = [...map].find((entry) => predicate.call(this_arg, entry[1], entry[0], map)) || null
		return (returned) ? returned[1] : null
	}

	/**
	 * Return a key found in the map that satisfies the predicate, or `null` if none is found.
	 * @see https://github.com/tc39/proposal-collection-methods
	 * @param   <K> the type of keys in the map
	 * @param   <V> the type of values in the map
	 * @param   map the map to search
	 * @param   predicate the testing function
	 * @param   this_arg object to use as `this` when executing `predicate`
	 * @returns the key found, or `null` if none is found
	 */
	static findKey<K, V>(map: Map<K, V>, predicate: (key: K, index: number, map: Map<K, V>) => boolean, this_arg: unknown = null): K|null {
		return [...map.keys()].find((key, i) => predicate.call(this_arg, key, i, map)) || null
	}



	private constructor() {}
}
