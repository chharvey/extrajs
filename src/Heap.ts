import {
	NumericType,
	xjs_Number,
} from './class/Number.class.js';

/**
 * A comparator function takes two values and returns a number indicating their “order”.
 *
 * - If the returned value is less    than 0, the left-hand value is “less than” the right-hand value.
 * - If the returned value is greater than 0, the left-hand value is “greater than” the right-hand value.
 * - If the returned value is equal   to   0, the two values are “equal”.
 *
 * @typeParam U     the type of value to compare
 * @param     left  the left-hand  value
 * @param     right the right-hand value
 * @return          a number listed above
 */
type Comparator<U> = (left: U, right: U) => number;

/**
 * Return the indices of the left- and right-hand children of a given node’s index.
 * @param index the given node’s index
 * @return      the children indices
 */
function child_indices_of(index: number): [number, number] {
	xjs_Number.assertType(index, NumericType.NATURAL);
	return [index * 2 + 1, index * 2 + 2];
}

/**
 * Return the parent index of the given node’s index.
 * @param index the given node’s index
 * @return      the parent index
 */
function parent_index_of(index: number): number {
	xjs_Number.assertType(index, NumericType.WHOLE);
	return Math.floor((index - 1) / 2);
}

/**
 * A max binary heap.
 *
 * A heap data structure is a tree with the property that every parent node’s value is
 * greater than or equal to (for a max heap) the values of its children nodes.
 * (For a min heap, parents would be less than or equal to each of their children.)
 * Every node in a binary heap has 2 children or less.
 * Being a tree, every node in a heap has exactly one parent,
 * with the exception of the root node, which has no parent.
 *
 * @see https://en.wikipedia.org/wiki/Heap_(data_structure)
 * @typeparam T the type of node value in this Heap
 */
export class Heap<T> {
	/**
	 * Internal implementation of this Heap.
	 *
	 * This class is implemented with a JS Array, defining node relationships implicitly.
	 * Specifically, given a parent node with index `i`,
	 * its two child nodes have indices `2 * i + 1` and `2 * i + 2`.
	 * Using an array is more performant than having nodes hold explicit references to their children.
	 */
	readonly #internal: T[] = [];

	/**
	 * Construct a new Heap object.
	 * @param comparator    a {@link Comparator} function comparing nodes’ values
	 * @param initial_items any optional items to start with
	 */
	public constructor(
		private readonly comparator: Comparator<T>,
		...initial_items: readonly T[]
	) {
		if (initial_items.length > 0) {
			if (initial_items.length === 1) {
				this.push(initial_items[0]);
			} else {
				// see https://en.wikipedia.org/wiki/Binary_heap
				// This takes `O(n * log n)` time. It’s slow!
				false && initial_items.forEach((item) => this.push(item)); // eslint-disable-line @typescript-eslint/no-unnecessary-condition
				// This takes `O(n)` time. A little faster.
				this.#internal = [...initial_items];
				this.resift();
			}
		}
	}

	/** The number of nodes in this Heap. */
	public get count(): number {
		return this.#internal.length;
	}

	/**
	 * Return a shallow copy of this Heap’s internal implementation.
	 * The returned array is only a copy, so mutating it will not mutate this Heap.
	 * However, the array’s items are the same references as this Heap’s nodes,
	 * so any mutations of them will be observed.
	 * @return a copy of this Heap’s array
	 */
	public inspect(): T[] {
		return [...this.#internal];
	}

	/**
	 * Return the maximal node in this Heap, without modifying the Heap.
	 * @returns         the maximal node
	 * @throws  {Error} if this Heap is empty
	 */
	public peek(): T {
		if (this.#internal.length > 0) {
			return this.#internal[0];
		} else {
			throw new Error('Heap is empty.');
		}
	}

	/**
	 * Add the given items to this Heap and return this Heap.
	 * @param   nodes the items to add
	 * @returns       `this`
	 */
	public push(...nodes: readonly T[]): this {
		nodes.forEach((node) => {
			this.#internal.push(node);
			this.#siftUp(this.#internal.length - 1); // TODO: this.#internal.lastIndex
		});
		return this;
	}

	/**
	 * Remove the maximal node from this Heap.
	 * @returns         `[this, node]`, where `node` is the maximal node
	 * @throws  {Error} if this Heap is empty
	 */
	public pop(): [this, T] {
		if (this.#internal.length > 0) {
			this.#internalSwap(0, this.#internal.length - 1); // TODO: this.#internal.lastIndex
			const popped: T = this.#internal.pop()!;
			this.#siftDown(0);
			return [this, popped];
		} else {
			throw new Error('Cannot pop from empty Heap.');
		}
	}

	/**
	 * Remove the first node that satisfies the given predicate.
	 * @param   predicate a function to find nodes
	 * @returns           `[this, node]`, where `node` is the removed node
	 * @throws  {Error}   if no node satisfies the predicate
	 */
	public remove(predicate: (node: T, src: this) => boolean): [this, T] {
		if (this.#internal.length > 0) {
			const found_node: T | undefined = this.#internal.find((item) => predicate(item, this));
			if (found_node !== undefined) {
				const found_index: number = this.#internal.indexOf(found_node);
				if (found_index >= 0) {
					this.#internalDelete(found_index);
					return [this, found_node];
				}
			}
			throw new Error('No nodes were found to remove.');
		} else {
			throw new Error('Cannot remove from empty Heap.');
		}
	}

	/**
	 * Remove all nodes that satisfy the given predicate.
	 * @param   predicate a function to find nodes
	 * @returns           `[this, nodes]`, where `nodes` is a list of the removed nodes
	 */
	public removeAll(predicate: (node: T, src: this) => boolean): [this, T[]] {
		if (this.#internal.length > 0) {
			const found_node_entries: readonly [number, T][] = [...this.#internal.entries()].filter(([_, item]) => predicate(item, this));
			[...found_node_entries].reverse().forEach(([found_index]) => this.#internalDelete(found_index));
			return [this, found_node_entries.map(([_, found_node]) => found_node)];
		} else {
			throw new Error('Cannot remove from empty Heap.');
		}
	}

	/**
	 * Reorders the nodes in this Heap to a valid arrangement.
	 * Should be called whenever one or more nodes have changed/mutated
	 * in a way that affects this Heap’s “max heap” property
	 * (that is, that every node should be greater than its children).
	 * If the nodes are already in a valid order, nothing is changed.
	 * @return `this`
	 */
	public resift(): this {
		for (let i = Math.floor(this.#internal.length / 2) - 1; i >= 0; i--) {
			this.#siftDown(i);
		}
		return this;
	}

	/**
	 * Remove all nodes from this Heap.
	 * @returns `this`
	 */
	public clear(): this {
		this.#internal.length = 0;
		return this;
	}

	#internalSwap(index_a: number, index_b: number): void {
		[this.#internal[index_a], this.#internal[index_b]] = [this.#internal[index_b], this.#internal[index_a]];
	}

	#internalDelete(index: number): void {
		xjs_Number.assertType(index, NumericType.NATURAL);
		if (index >= this.#internal.length) {
			throw new RangeError(`Index out of bounds. Got: ${ index } but expected less than ${ this.#internal.length }`);
		}
		const found_node: T      = this.#internal[index];
		const last_index: number = this.#internal.length - 1;
		if (index !== last_index) {
			const replacement_node: T = this.#internal[last_index];
			this.#internalSwap(index, last_index);
			this.#internal.pop();
			if (this.comparator(replacement_node, found_node) > 0) {
				this.#siftUp(index);
			} else if (this.comparator(replacement_node, found_node) < 0) {
				this.#siftDown(index);
			}
		} else {
			this.#internal.pop();
		}
	}

	#siftUp(index: number): void {
		xjs_Number.assertType(index, NumericType.NATURAL);
		if (index >= this.#internal.length) {
			throw new RangeError(`Index out of bounds. Got: ${ index } but expected less than ${ this.#internal.length }`);
		}
		if (index === 0) {
			// the root node cannot be sifted
			return;
		}

		const parent_index: number = parent_index_of(index);
		if (this.comparator(this.#internal[parent_index], this.#internal[index]) < 0) {
			// the parameter does not satisfy the heap property
			this.#internalSwap(parent_index, index);
			return this.#siftUp(parent_index);
		}
	}

	#siftDown(index: number): void {
		xjs_Number.assertType(index, NumericType.NATURAL);
		if (index >= this.#internal.length) {
			throw new RangeError(`Index out of bounds. Got: ${ index } but expected less than ${ this.#internal.length }`);
		}
		if (index === this.#internal.length - 1) {
			// the last node cannot be sifted
			return;
		}

		const [left_child_index, right_child_index]: [number, number] = child_indices_of(index);
		const left_child:  T | undefined = this.#internal[left_child_index];
		const right_child: T | undefined = this.#internal[right_child_index];

		// find the largest child node
		let largest_index: number = index;
		if (left_child && this.comparator(left_child, this.#internal[largest_index]) > 0) {
			largest_index = left_child_index;
		}
		if (right_child && this.comparator(right_child, this.#internal[largest_index]) > 0) {
			largest_index = right_child_index;
		}

		if (largest_index !== index) {
			// the parameter does not satisfy the heap property
			this.#internalSwap(index, largest_index);
			return this.#siftDown(largest_index);
		}
	}
}
