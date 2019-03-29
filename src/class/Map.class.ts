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
