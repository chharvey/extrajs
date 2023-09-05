/* eslint-disable arrow-body-style */
import * as assert from 'assert';
import {Heap} from '../src/index.js';



function assert__shallowEqual<T>(arr1: readonly T[], arr2: typeof arr1): void {
	try {
		return assert.strictEqual(arr1, arr2, 'The arguments should be strict-equal.');
	} catch {
		assert.strictEqual(arr1.length, arr2.length, 'The arrays should be the same length.');
		return arr1.forEach((item1, i) => assert.strictEqual(item1, arr2[i], `Index ${ i } should be strict-equal.`));
	}
}



specify('assert__shallowEqual', () => {
	const arr = [1, 2, 3] as const;
	assert__shallowEqual(arr, arr);
	assert__shallowEqual(arr, [...arr]);
	assert__shallowEqual([1, 2, 3], [1, 2, 3]);
	return assert.throws(() => assert__shallowEqual([[1], [2], [3]], [[1], [2], [3]]), /Index 0 should be strict-equal\./);
});



describe('Heap', () => {
	type NodeType = {
		readonly priority: number,
		readonly name:     string,
	};
	const comparator = (a: NodeType, b: NodeType): number => a.priority - b.priority;
	const items      = [
		{priority: 1, name: 'a'},
		{priority: 2, name: 'b'},
		{priority: 3, name: 'c'},
	] as const;
	const comparator_simple = (a: number, b: number): number => a - b;
	const items_simple      = [1, 2, 3] as const;


	describe('.constructor(Comparator<T>, ...T[])', () => {
		it('creates a heap with nodes prepopulated.', () => {
			const h = new Heap<NodeType>(comparator, ...items);
			assert.strictEqual(h.count, 3);
			return assert__shallowEqual(h.inspect(), [items[2], items[1], items[0]]);
		});
	});


	describe('.peek()', () => {
		it('returns the maximal node without removing it.', () => {
			return assert.strictEqual(new Heap<NodeType>(comparator, ...items).peek(), items[2]);
		});

		it('throws when the heap is empty.', () => {
			return assert.throws(() => new Heap<NodeType>(comparator).peek(), /Heap is empty\./);
		});
	});


	describe('.push(...T[])', () => {
		it('sifts up each node after pushing.', () => {
			const h = new Heap<NodeType>(comparator);
			h.push(items[0], items[1]);
			assert__shallowEqual(h.inspect(), [items[1], items[0]]);
			h.push(items[2]);
			return assert__shallowEqual(h.inspect(), [items[2], items[0], items[1]]);
		});
	});


	describe('.pop()', () => {
		it('returns the maximal node while removing it.', () => {
			const h = new Heap<NodeType>(comparator, ...items);
			assert.strictEqual(h.pop()[1], items[2]);
			return assert.strictEqual(h.count, 2);
		});

		it('sifts down after popping.', () => {
			const h = new Heap<NodeType>(comparator, ...items);
			assert__shallowEqual(h.inspect(), [items[2], items[1], items[0]]);
			h.pop();
			return assert__shallowEqual(h.inspect(), [items[1], items[0]]);
		});

		it('throws when the heap is empty.', () => {
			return assert.throws(() => new Heap<NodeType>(comparator).pop(), /Cannot pop from empty Heap\./);
		});
	});


	describe('.remove(T)', () => {
		it('removes the first node (if any) identical to the argument.', () => {
			const h = new Heap<number>(comparator_simple, ...items_simple);
			assert__shallowEqual(h.inspect(), [3, 2, 1]);

			assert.strictEqual(h.remove(2)[1], 2);
			assert.strictEqual(h.count, 2);
			return assert__shallowEqual(h.inspect(), [3, 1]);
		});

		it('throws when no node matches.', () => {
			return assert.throws(() => new Heap<number>(comparator_simple, ...items_simple).remove(4), /No nodes were found to remove\./);
		});

		it('throws when the heap is empty.', () => {
			return assert.throws(() => new Heap<number>(comparator_simple).remove(3), /Cannot remove from empty Heap\./);
		});
	});


	describe('.remove((T) => boolean)', () => {
		it('removes the first node (if any) satisfying the predicate.', () => {
			const h = new Heap<NodeType>(comparator, ...items);
			assert__shallowEqual(h.inspect(), [items[2], items[1], items[0]]);

			assert.strictEqual(h.remove((node) => node.priority < 3)[1], items[1]);
			assert.strictEqual(h.count, 2);
			return assert__shallowEqual(h.inspect(), [items[2], items[0]]);
		});

		it('throws when no node matches.', () => {
			return assert.throws(() => new Heap<NodeType>(comparator, ...items).remove((node) => node.priority > 3), /No nodes were found to remove\./);
		});

		it('throws when the heap is empty.', () => {
			return assert.throws(() => new Heap<NodeType>(comparator).remove((node) => 'priority' in node), /Cannot remove from empty Heap\./);
		});
	});


	describe('.removeAll(readonly T[])', () => {
		it('removes all nodes identical to the arguments.', () => {
			const h = new Heap<number>(comparator_simple, ...items_simple);
			assert__shallowEqual(h.inspect(), [3, 2, 1]);

			assert.deepStrictEqual(h.removeAll([1, 2])[1], [2, 1]); // note difference in order
			assert.strictEqual(h.count, 1);
			return assert__shallowEqual(h.inspect(), [3]);
		});

		it('returns empty array when no node matches.', () => {
			return assert.deepStrictEqual(new Heap<number>(comparator_simple, ...items_simple).removeAll([4])[1], []);
		});

		it('throws when the heap is empty.', () => {
			return assert.throws(() => new Heap<number>(comparator_simple).removeAll([1, 2, 3]), /Cannot remove from empty Heap\./);
		});
	});


	describe('.removeAll((T) => boolean)', () => {
		it('removes all nodes satisfying the predicate.', () => {
			const h = new Heap<NodeType>(comparator, ...items);
			assert__shallowEqual(h.inspect(), [items[2], items[1], items[0]]);

			assert.deepStrictEqual(h.removeAll((node) => node.priority < 3)[1], [items[1], items[0]]);
			assert.strictEqual(h.count, 1);
			return assert__shallowEqual(h.inspect(), [items[2]]);
		});

		it('returns empty array when no node matches.', () => {
			return assert.deepStrictEqual(new Heap<NodeType>(comparator, ...items).removeAll((node) => node.priority > 3)[1], []);
		});

		it('throws when the heap is empty.', () => {
			return assert.throws(() => new Heap<NodeType>(comparator).removeAll((node) => 'priority' in node), /Cannot remove from empty Heap\./);
		});
	});


	describe('.resift()', () => {
		it('reorders the nodes correctly.', () => {
			type MutableNodeType = {-readonly [K in keyof NodeType]: NodeType[K]};
			const mut_items: readonly MutableNodeType[] = items.map((item) => ({...item}));
			const h1 = new Heap<MutableNodeType>(comparator, ...mut_items);
			const h2 = new Heap<MutableNodeType>(comparator).push(...mut_items);
			assert__shallowEqual(h1.inspect(), [mut_items[2], mut_items[1], mut_items[0]]);
			assert__shallowEqual(h2.inspect(), [mut_items[2], mut_items[0], mut_items[1]]);
			mut_items[2].priority = 0;
			       assert__shallowEqual(h1.resift().inspect(), [mut_items[1], mut_items[2], mut_items[0]]);
			return assert__shallowEqual(h2.resift().inspect(), [mut_items[1], mut_items[0], mut_items[2]]);
		});

		it('does not reorder if not necessary.', () => {
			const h = new Heap<NodeType>(comparator, ...items);
			const expected = [items[2], items[1], items[0]];
			assert__shallowEqual(h.inspect(), expected);
			return assert__shallowEqual(h.resift().inspect(), expected);
		});
	});


	describe('.clear()', () => {
		it('removes all nodes in the heap.', () => {
			const h = new Heap<NodeType>(comparator, ...items);
			assert__shallowEqual(h.inspect(), [items[2], items[1], items[0]]);

			assert.strictEqual(h.clear(), h);
			assert.strictEqual(h.count, 0);
			return assert__shallowEqual(h.inspect(), []);
		});

		it('does not throw when the heap is empty.', () => {
			new Heap<NodeType>(comparator).clear(); // assert does not throw
		});
	});
});
