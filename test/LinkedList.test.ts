/* eslint-disable arrow-body-style */
import * as assert from 'assert';
import {
	LinkedList,
	type ReadonlyLinkedList,
} from '../src/index.js';



const items = ['a', 'b', 'c'] as const;



describe('LinkedList', () => {
	describe('.constructor(...T[])', () => {
		it('creates a linked list prepopulated.', () => {
			const list: ReadonlyLinkedList<string> = new LinkedList<string>(...items);
			assert.strictEqual(list.length, 3);
			return assert.deepStrictEqual([...list], items);
		});
	});


	describe('.get(number)', () => {
		it('returns the item at the given index.', () => {
			return assert.strictEqual(new LinkedList<string>(...items).get(2), items[2]);
		});

		it('throws when the index is out of bounds.', () => {
			return assert.throws(() => new LinkedList<string>(...items).get(3), /Index `3` out of bounds\./);
		});

		it('throws when the list is empty.', () => {
			return assert.throws(() => new LinkedList<number>().get(2), /Index `2` out of bounds\./);
		});
	});


	context('findFirstIndex', () => {
		const list: ReadonlyLinkedList<string> = new LinkedList<string>(...items);

		describe('.findFirstIndex(T)', () => {
			it('finds index by item.', () => {
				return assert.strictEqual(list.findFirstIndex('b'), 1);
			});
		});

		describe('.findFirstIndex(ReadonlySet<T>)', () => {
			it('finds first index of any given item.', () => {
				return assert.strictEqual(list.findFirstIndex(new Set<string>(['d', 'b', 'e'])), 1);
			});
		});

		describe('.findFirstIndex((T, number, this) => boolean)', () => {
			it('finds first index by predicate.', () => {
				assert.strictEqual(list.findFirstIndex((it) => it.codePointAt(0) === items[1].codePointAt(0)), 1);
				return assert.strictEqual(list.findFirstIndex((_, i) => i === 1), 1);
			});

			it('predicate allows mutating list if it’s mutable.', () => {
				return assert.strictEqual(new LinkedList<string>(...items).findFirstIndex((it, _, src) => {
					src.append('d');
					return it === 'd';
				}), 3);
			});
		});
	});


	describe('.prepend()', () => {
		it('returns the original modified list.', () => {
			const list = new LinkedList<string>(...items);
			return assert.strictEqual(list.prepend('d'), list);
		});

		it('puts items at the beginning of the list.', () => {
			const list: ReadonlyLinkedList<string> = new LinkedList<string>(...items).prepend('d');
			assert.strictEqual(list.length, items.length + 1);
			return assert.deepStrictEqual([...list], ['d', ...items]);
		});
	});


	describe('.append()', () => {
		it('returns the original modified list.', () => {
			const list = new LinkedList<string>(...items);
			return assert.strictEqual(list.append('d'), list);
		});

		it('puts items at the end of the list.', () => {
			const list: ReadonlyLinkedList<string> = new LinkedList<string>(...items).append('d');
			assert.strictEqual(list.length, items.length + 1);
			return assert.deepStrictEqual([...list], [...items, 'd']);
		});
	});


	describe('.delete()', () => {
		it('returns the original modified list.', () => {
			const list = new LinkedList<string>(...items);
			return assert.strictEqual(list.delete(1)[0], list);
		});

		it('removes the item at the given index.', () => {
			const [list, removed]: [ReadonlyLinkedList<string>, string] = new LinkedList<string>(...items).delete(1);
			assert.strictEqual(list.length, items.length - 1);
			return assert.deepStrictEqual(
				[[...list],            removed],
				[[items[0], items[2]], items[1]],
			);
		});

		it('throws when the index is out of bounds.', () => {
			return assert.throws(() => new LinkedList<string>(...items).delete(3), /Index `3` out of bounds\./);
		});

		it('throws when the list is empty.', () => {
			return assert.throws(() => new LinkedList<number>().delete(2), /Index `2` out of bounds\./);
		});
	});


	describe('.shift(number)', () => {
		it('returns the original modified list.', () => {
			const list = new LinkedList<string>(...items);
			return assert.strictEqual(list.shift(1)[0], list);
		});

		it('removes items from the beginning of the list and shifts remaining items towards the start.', () => {
			for (let i = 0; i < items.length + 1; i++) {
				const [remaining, removed]: [ReadonlyLinkedList<string>, ReadonlyLinkedList<string>] = new LinkedList<string>(...items).shift(i);
				assert.deepStrictEqual(
					[[...remaining], [...removed]],
					[items.slice(i), items.slice(0, i)],
				);
			}
		});

		it('throws when count is out of range.', () => {
			return assert.throws(() => new LinkedList<string>(...items).shift(4), /Index `4` out of bounds\./);
		});
	});


	describe('.clear()', () => {
		it('returns the original modified list.', () => {
			const list = new LinkedList<string>(...items);
			return assert.strictEqual(list.clear(), list);
		});

		it('removes all items from the list.', () => {
			const list: ReadonlyLinkedList<string> = new LinkedList<string>(...items).clear();
			assert.strictEqual(list.length, 0);
			return assert.deepStrictEqual([...list], []);
		});
	});
});
