import {xjs_Object} from './Object.class.js';
import type {xjs_Set} from './Set.class.js';


/**
 * Additional static members for the native Map class.
 *
 * Does not extend the native Map class.
 */
export class xjs_Map {
	/**
	 * Test whether two maps have “the same” key–value pairs.
	 *
	 * Similar to {@link xjs_Set.is}, where the order is not important,
	 * but also has the option to check equality of keys.
	 * @typeparam K - the type of keys in the maps
	 * @typeparam V - the type of values in the maps
	 * @param   a the first map
	 * @param   b the second map
	 * @returns Are corresponding pairs the same, i.e. replaceable?
	 */
	public static is<K, V>(a: ReadonlyMap<K, V>, b: ReadonlyMap<K, V>, {
		/** check the “sameness” of corresponding keys of `a` and `b` */
		keys = xjs_Object.sameValueZero,
		/** check the “sameness” of corresponding values of `a` and `b` */
		values = xjs_Object.sameValueZero,
	}: {
		keys?:   (x: K, y: K) => boolean,
		values?: (x: V, y: V) => boolean,
	} = {
		keys:   xjs_Object.sameValueZero,
		values: xjs_Object.sameValueZero,
	}): boolean {
		return a === b || a.size === b.size && [...a].every(([a_key, a_val]) => [...b].some(([b_key, b_val]) => (
			   (xjs_Object.sameValueZero(a_key, b_key) || keys  (a_key, b_key))
			&& (xjs_Object.sameValueZero(a_val, b_val) || values(a_val, b_val))
		)));
	}

	/**
	 * Return a new map with entries that pass the provided predicate function.
	 * @see https://github.com/tc39/proposal-collection-methods
	 * @typeparam - K the type of keys in the map
	 * @typeparam - V the type of values in the map
	 * @param   map the map to filter
	 * @param   predicate function to test each entry of the map
	 * @param   this_arg object to use as `this` when executing `predicate`
	 * @returns a new map with the entries that pass the test; if no entries pass, an empty map is returned
	 */
	public static filter<K, V>(map: ReadonlyMap<K, V>, predicate: (value: V, key: K, map: ReadonlyMap<K, V>) => boolean, this_arg: unknown = null): Map<K, V> {
		return new Map([...map].filter((entry) => predicate.call(this_arg, entry[1], entry[0], map)));
	}

	/**
	 * Return a value found in the map that satisfies the predicate, or `null` if none is found.
	 * @see https://github.com/tc39/proposal-collection-methods
	 * @typeparam - K the type of keys in the map
	 * @typeparam - V the type of values in the map
	 * @param   map the map to search
	 * @param   predicate function to test each entry of the map
	 * @param   this_arg object to use as `this` when executing `predicate`
	 * @returns the value found, or `null` if none is found
	 */
	public static find<K, V>(map: ReadonlyMap<K, V>, predicate: (value: V, key: K, map: ReadonlyMap<K, V>) => boolean, this_arg: unknown = null): V | null {
		return [...xjs_Map.filter(map, predicate, this_arg)].map((entry) => entry[1])[0] || null;
	}

	/**
	 * Return a key found in the map that satisfies the predicate, or `null` if none is found.
	 * @see https://github.com/tc39/proposal-collection-methods
	 * @typeparam - K the type of keys in the map
	 * @typeparam - V the type of values in the map
	 * @param   map the map to search
	 * @param   predicate function to test each key of the map
	 * @param   this_arg object to use as `this` when executing `predicate`
	 * @returns the key found, or `null` if none is found
	 */
	public static findKey<K, V>(map: ReadonlyMap<K, V>, predicate: (key: K, index: number, map: ReadonlyMap<K, V>) => boolean, this_arg: unknown = null): K | null {
		return [...map.keys()].find((key, i) => predicate.call(this_arg, key, i, map)) || null;
	}

	/**
	 * Return a new Map with the results of calling a provided function on every value in the given Map.
	 * @see https://github.com/tc39/proposal-collection-methods
	 * @typeparam - K the type of keys in the map
	 * @typeparam - V the type of values in the map
	 * @typeparam - T the type of new values returned by the callback
	 * @param   map the map to map
	 * @param   callback the function to call on each value of the map
	 * @param   this_arg object to use as `this` when executing `callback`
	 * @returns a new Map with the same keys and transformed values obtained from `callback`
	 */
	public static mapValues<K, V, T>(map: ReadonlyMap<K, V>, callback: (value: V, key: K, map: ReadonlyMap<K, V>) => T, this_arg: unknown = null): Map<K, T> {
		return new Map([...map].map(([key, value]) => [key, callback.call(this_arg, value, key, map)] as [K, T]));
	}

	/**
	 * Return a new Map with the results of calling a provided function on every key in the given Map.
	 * @see https://github.com/tc39/proposal-collection-methods
	 * @typeparam - K the type of keys in the map
	 * @typeparam - V the type of values in the map
	 * @typeparam - T the type of new keys returned by the callback
	 * @param   map the map to map
	 * @param   callback the function to call on each key of the map
	 * @param   this_arg object to use as `this` when executing `callback`
	 * @returns a new Map with transformed keys obtained from `callback` and the same values
	 */
	public static mapKeys<K, V, T>(map: ReadonlyMap<K, V>, callback: (value: V, key: K, map: ReadonlyMap<K, V>) => T, this_arg: unknown = null): Map<T, V> {
		return new Map([...map].map(([key, value]) => [callback.call(this_arg, value, key, map), value] as [T, V]));
	}

	/**
	 * Set, then return, a new value.
	 * @param   map   the map to set
	 * @param   key   the key
	 * @param   value the value
	 * @returns       the value
	 */
	public static tee<K, V>(map: Map<K, V>, key: K, value: V): V {
		map.set(key, value);
		return value;
	}

	/**
	 * Return whether the provided key exists in the map.
	 * @param  map        the map to check
	 * @param  key        the key to check
	 * @param  comparator a comparator function of keys
	 * @return            Does the set have the given key?
	 */
	public static has<K, V = K>(map: ReadonlyMap<K, V>, key: K, comparator: (a: K, b: K) => boolean): boolean {
		return [...map.keys()].some((k) => comparator.call(null, k, key));
	}

	/**
	 * Get the value of the provided key from the map.
	 * @param  map        the map to check
	 * @param  key        the key to check
	 * @param  comparator a comparator function of keys
	 * @return            the value corresponding to the key
	 */
	public static get<K, V = K>(map: ReadonlyMap<K, V>, key: K, comparator: (a: K, b: K) => boolean): V | undefined {
		return [...map].find(([k, _]) => comparator.call(null, k, key))?.[1];
	}

	/**
	 * Set a value to the provided key in the map.
	 * @param  map        the map to mutate
	 * @param  key        the key to set
	 * @param  comparator a comparator function of keys
	 * @return            the mutated map
	 */
	public static set<K, V = K>(map: Map<K, V>, key: K, value: V, comparator: (a: K, b: K) => boolean): Map<K, V> {
		const foundkey: K | undefined = [...map.keys()].find((k) => comparator.call(null, k, key));
		return map.set((foundkey === undefined) ? key : foundkey, value);
	}

	/**
	 * Delete the provided key from the map.
	 * @param  map        the map to mutate
	 * @param  key        the key to delete
	 * @param  comparator a comparator function of keys
	 * @return            Was the map mutated?
	 */
	public static delete<K, V = K>(map: Map<K, V>, key: K, comparator: (a: K, b: K) => boolean): boolean {
		const foundkey: K | undefined = [...map.keys()].find((k) => comparator.call(null, k, key));
		return map.delete((foundkey === undefined) ? key : foundkey);
	}

	/**
	 * Perform a callback function on a map, aggregating any errors caught.
	 *
	 * Instead of throwing on the first error and stopping iteration, as {@link Map#forEach} would do,
	 * this method continues performing the callback on the rest of the map until all items are done.
	 * If only one error was caught, then that error is simply rethrown.
	 * However, if more errors were caught, they are collected into a single AggregateError, which is then thrown.
	 * If no errors are caught, this method returns void.
	 *
	 * @example
	 * xjs.Map.forEachAggregated<number>(new Map<string, number>([
	 * 	['one',   1],
	 * 	['two',   2],
	 * 	['three', 3],
	 * 	['four',  4],
	 * ]), (num, name) => {
	 * 	if (num % 2 === 0) {
	 * 		throw new Error(`${ name } is even.`);
	 * 	};
	 * });
	 * // Expected thrown error:
	 * AggregateError {
	 * 	errors: [
	 * 		Error { message: "two is even." },
	 * 		Error { message: "four is even." },
	 * 	]
	 * }
	 * @typeparam K                the type of keys in the map
	 * @typeparam V                the type of values in the map
	 * @param     map              the map of keys and values
	 * @param     callback         the function to call on each key–value pair
	 * @throws    {AggregateError} if two or more iterations throws an error
	 * @throws    {Error}          if one iteration throws an error
	 */
	public static forEachAggregated<K, V>(map: ReadonlyMap<K, V>, callback: (value: V, key: K, src: typeof map) => void): void {
		const errors: readonly Error[] = [...map.entries()].map(([key, value]) => {
			try {
				callback.call(null, value, key, map);
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


	private constructor() {}
}
