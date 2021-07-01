/**
 * A Map that compares keys via the provided comparator function.
 * Keys that are “equal” (as defined by the comparator) are considered the same key.
 * @typeParam K the type of the keys in this Map
 * @typeParam V the type of the values in this Map
 * @example
 * const my_map: MapEq<{id: number}, boolean> = new MapEq((a, b) => a.id === b.id);
 * const key: {id: number} = {id: 42};
 * my_map.set(key,      true);  assert.strictEqual(my_map.get({id: 42}), true);
 * my_map.set({id: 42}, false); assert.strictEqual(my_map.get(key),      false);
 * assert(my_map.size === 1);
 */
export class MapEq<K, V> extends Map<K, V> {
	/**
	 * Construct a new MapEq object given a comparator.
	 * The comparator function compares keys in this MapEq.
	 * Keys for which the function returns `true` are considered ”equal” and unique.
	 * If no comparator function is provided, the `SameValueZero` algorithm is used.
	 * @param comparator a function comparing keys in this map
	 * @param items      the items to add to this map
	 */
	constructor (
		private readonly comparator: (a: K, b: K) => boolean = (a, b) => a === b || Object.is(a, b),
		items: readonly (readonly [K, V])[] = [],
	) {
		super(items);
	}

	/**
	 * @inheritdoc
	 */
	override has(key: K): boolean {
		return super.has(key) || [...this.keys()].some((k) => this.comparator.call(null, k, key));
	}

	/**
	 * @inheritdoc
	 */
	override get(key: K): V | undefined {
		return super.get(key) || [...this].find(([k, _]) => this.comparator.call(null, k, key))?.[1];
	}

	/**
	 * @inheritdoc
	 */
	override set(key: K, value: V): this {
		const foundkey: K | undefined = [...this.keys()].find((k) => this.comparator.call(null, k, key));
		return super.set((foundkey === void 0) ? key : foundkey, value);
	}

	/**
	 * @inheritdoc
	 */
	override delete(key: K): boolean {
		const foundkey: K | undefined = [...this.keys()].find((k) => this.comparator.call(null, k, key));
		return super.delete((foundkey === void 0) ? key : foundkey);
	}
}
