/* eslint-disable arrow-body-style */
import * as assert from 'assert';
import {
	EmptyStructureError,
	Queue,
	ReadableQueue,
	EditableQueue,
} from '../src/index.js';



const items = ['a', 'b', 'c'] as const;



describe('Queue', () => {
	describe('#peek()', () => {
		it('does not modify the queue.', () => {
			const queue = new Queue<string>(...items);
			queue.peek();
			return assert.strictEqual(queue.pop()[1], items[0]);
		});

		it('returs the first item in the queue.', () => {
			return assert.strictEqual(new Queue<string>(...items).peek(), items[0]);
		});

		it('throws when the queue is empty.', () => {
			return assert.throws(() => new Queue<string>().peek(), EmptyStructureError);
		});
	});


	describe('#push()', () => {
		it('returns the original modified queue.', () => {
			const queue = new Queue<string>();
			return assert.strictEqual(queue.push('d'), queue);
		});

		it('puts items at the end of the queue.', () => {
			const queue = new Queue<string>().push('d');
			return assert.strictEqual(queue.pop()[1], 'd');
		});
	});


	describe('#pop()', () => {
		it('returns the original modified queue.', () => {
			const queue = new Queue<string>(...items);
			return assert.strictEqual(queue.pop()[0], queue);
		});

		it('removes the first item.', () => {
			const [queue, removed]: [Queue<string>, string] = new Queue<string>(...items).pop();
			const remaining = [queue.pop()[1], queue.pop()[1]];
			return assert.deepStrictEqual(
				[removed,  remaining],
				[items[0], [items[1], items[2]]],
			);
		});

		it('throws when the queue is empty.', () => {
			return assert.throws(() => new Queue<string>().pop(), EmptyStructureError);
		});
	});
});



describe('ReadableQueue', () => {
	describe('#get(number)', () => {
		it('returns the item at the given index.', () => {
			return assert.strictEqual(new ReadableQueue<string>(...items).get(1), items[1]);
		});

		it('throws when the index is out of bounds.', () => {
			return assert.throws(() => new ReadableQueue<string>(...items).get(3), /Index `3` out of bounds\./);
		});

		it('throws when the queue is empty.', () => {
			return assert.throws(() => new ReadableQueue<number>().get(2), /Index `2` out of bounds\./);
		});
	});
});



describe('EditableQueue', () => {
	const CARDS = ['10', 'J', 'Q', 'K', 'A'] as const;


	describe('#promoteByIndex(number, number)', () => {
		it('returns the original modified queue.', () => {
			const queue = new EditableQueue<string>(...CARDS);
			return assert.strictEqual(queue.promoteByIndex(3, 2), queue);
		});

		it('promotes the item at the given index by the given number of slots.', () => {
			const index = 3;
			const slots = 2;
			return assert.deepStrictEqual(
				new EditableQueue<string>(...CARDS).promoteByIndex(index, slots).items,
				[...CARDS.slice(0, index - slots), CARDS[index], ...CARDS.slice(index - slots, index), ...CARDS.slice(index + 1)],
				[CARDS[0],                         CARDS[3],     CARDS[1], CARDS[2],                   CARDS[4]].join(', '),
			);
		});

		it('specifying zero slots doesn’t change the queue.', () => {
			assert.deepStrictEqual(new EditableQueue<string>(...CARDS).promoteByIndex(2, 0).items, CARDS);
		});

		it('throws when trying to promote an item beyond the front.', () => {
			assert.throws(() => new EditableQueue<string>(...CARDS).promoteByIndex(3, 4), /Too many slots; cannot promote beyond the start of the queue\./);
			assert.throws(() => new EditableQueue<string>(...CARDS).promoteByIndex(0),    /Too many slots; cannot promote beyond the start of the queue\./);
		});

		it('throws when given a negative slot count.', () => {
			assert.throws(() => new EditableQueue<string>(...CARDS).promoteByIndex(3, -1), /Negative numbers not accepted; use `demoteByIndex` instead\./);
		});
	});


	describe('#demoteByIndex(number, number)', () => {
		it('returns the original modified queue.', () => {
			const queue = new EditableQueue<string>(...CARDS);
			return assert.strictEqual(queue.demoteByIndex(1, 2), queue);
		});

		it('demotes the item at the given index by the given number of slots.', () => {
			const index = 1;
			const slots = 2;
			return assert.deepStrictEqual(
				new EditableQueue<string>(...CARDS).demoteByIndex(index, slots).items,
				[...CARDS.slice(0, index), ...CARDS.slice(index + 1, index + 1 + slots), CARDS[index], ...CARDS.slice(index + 1 + slots)],
				[CARDS[0],                 CARDS[2], CARDS[3],                           CARDS[1],     CARDS[4]].join(', '),
			);
		});

		it('specifying zero slots doesn’t change the queue.', () => {
			assert.deepStrictEqual(new EditableQueue<string>(...CARDS).demoteByIndex(2, 0).items, CARDS);
		});

		it('throws when trying to demote an item beyond the back.', () => {
			assert.throws(() => new EditableQueue<string>(...CARDS).demoteByIndex(1, 4), /Too many slots; cannot demote beyond the end of the queue\./);
			assert.throws(() => new EditableQueue<string>(...CARDS).demoteByIndex(4),    /Too many slots; cannot demote beyond the end of the queue\./);
		});

		it('throws when given a negative slot count.', () => {
			assert.throws(() => new EditableQueue<string>(...CARDS).demoteByIndex(3, -1), /Negative numbers not accepted; use `promoteByIndex` instead\./);
		});
	});


	describe('#promoteByIndexToStart(number)', () => {
		it('returns the original modified queue.', () => {
			const queue = new EditableQueue<string>(...CARDS);
			return assert.strictEqual(queue.promoteByIndexToStart(3), queue);
		});

		it('promotes the item at the given index all the way to the front.', () => {
			const index = 3;
			return assert.deepStrictEqual(
				new EditableQueue<string>(...CARDS).promoteByIndexToStart(index).items,
				[CARDS[index], ...CARDS.slice(0, index),     ...CARDS.slice(index + 1)],
				[CARDS[3],     CARDS[0], CARDS[1], CARDS[2], CARDS[4]].join(', '),
			);
		});
	});


	describe('#demoteByIndexToEnd(number)', () => {
		it('returns the original modified queue.', () => {
			const queue = new EditableQueue<string>(...CARDS);
			return assert.strictEqual(queue.demoteByIndexToEnd(3), queue);
		});

		it('demotes the item at the given index all the way to the back.', () => {
			const index = 1;
			return assert.deepStrictEqual(
				new EditableQueue<string>(...CARDS).demoteByIndexToEnd(index).items,
				[...CARDS.slice(0, index), ...CARDS.slice(index + 1),    CARDS[index]],
				[CARDS[0],                 CARDS[2], CARDS[3], CARDS[4], CARDS[1]].join(', '),
			);
		});
	});


	context('promote', () => {
		describe('#promote(T, number)', () => {
			it('returns the original modified queue.', () => {
				const queue = new EditableQueue<string>(...CARDS);
				return assert.strictEqual(queue.promote(CARDS[3], 2), queue);
			});

			it('promotes the given item by the given number of slots.', () => {
				assert.deepStrictEqual(
					new EditableQueue<string>(...CARDS).promote(CARDS[3], 2).items,
					[CARDS[0], CARDS[3], CARDS[1], CARDS[2], CARDS[4]],
				);
			});

			it('throws if the given item is not in the queue.', () => {
				assert.throws(() => new EditableQueue<string>(...items).promote('9'), /Item `9` was not found\./);
			});
		});

		describe('#promote((T) => boolean, number)', () => {
			it('promotes the first item satisfying the predicate.', () => {
				assert.deepStrictEqual(
					new EditableQueue<string>(...CARDS).promote((it) => it.length === 1).items,
					['J', '10', 'Q', 'K', 'A'],
				);
			});

			it('throws if none of the queue’s items satisfy the predicate.', () => {
				assert.throws(() => new EditableQueue<string>(...items).promote((it) => it.length === 3), /No items satisfy predicate/);
			});
		});
	});


	context('demote', () => {
		describe('#demote(T, number)', () => {
			it('returns the original modified queue.', () => {
				const queue = new EditableQueue<string>(...CARDS);
				return assert.strictEqual(queue.demote(CARDS[1], 2), queue);
			});

			it('demotes the given item by the given number of slots.', () => {
				assert.deepStrictEqual(
					new EditableQueue<string>(...CARDS).demote(CARDS[1], 2).items,
					[CARDS[0], CARDS[2], CARDS[3], CARDS[1], CARDS[4]],
				);
			});

			it('throws if the given item is not in the queue.', () => {
				assert.throws(() => new EditableQueue<string>(...items).demote('9'), /Item `9` was not found\./);
			});
		});

		describe('#demote((T) => boolean, number)', () => {
			it('demotes the first item satisfying the predicate.', () => {
				assert.deepStrictEqual(
					new EditableQueue<string>(...CARDS).demote((it) => it.length === 1).items,
					['10', 'Q', 'J', 'K', 'A'],
				);
			});

			it('throws if none of the queue’s items satisfy the predicate.', () => {
				assert.throws(() => new EditableQueue<string>(...items).demote((it) => it.length === 3), /No items satisfy predicate/);
			});
		});
	});


	context('promoteToStart', () => {
		describe('#promoteToStart(T)', () => {
			it('returns the original modified queue.', () => {
				const queue = new EditableQueue<string>(...CARDS);
				return assert.strictEqual(queue.promoteToStart(CARDS[3]), queue);
			});

			it('promotes the given item all the way to the front.', () => {
				assert.deepStrictEqual(
					new EditableQueue<string>(...CARDS).promoteToStart(CARDS[3]).items,
					[CARDS[3], CARDS[0], CARDS[1], CARDS[2], CARDS[4]],
				);
			});
		});

		describe('#promoteToStart((T) => boolean)', () => {
			it('promotes the first item satisfying the predicate.', () => {
				assert.deepStrictEqual(
					new EditableQueue<string>(...CARDS).promoteToStart((it) => it.length === 1).items,
					['J', '10', 'Q', 'K', 'A'],
				);
			});
		});
	});


	context('demoteToEnd', () => {
		describe('#demoteToEnd(T)', () => {
			it('returns the original modified queue.', () => {
				const queue = new EditableQueue<string>(...CARDS);
				return assert.strictEqual(queue.demoteToEnd(CARDS[3]), queue);
			});

			it('demotes the given item all the way to the back.', () => {
				assert.deepStrictEqual(
					new EditableQueue<string>(...CARDS).demoteToEnd(CARDS[3]).items,
					[CARDS[0], CARDS[1], CARDS[2], CARDS[4], CARDS[3]],
				);
			});
		});

		describe('#demoteToEnd((T) => boolean)', () => {
			it('demotes the first item satisfying the predicate.', () => {
				assert.deepStrictEqual(
					new EditableQueue<string>(...CARDS).demoteToEnd((it) => it.length === 1).items,
					['10', 'Q', 'K', 'A', 'J'],
				);
			});
		});
	});


	describe('#delete(number)', () => {
		it('returns the original modified queue.', () => {
			const queue = new EditableQueue<string>(...items);
			return assert.strictEqual(queue.delete(1)[0], queue);
		});

		it('removes the item at the given index.', () => {
			const [queue, removed]: [EditableQueue<string>, string] = new EditableQueue<string>(...items).delete(1);
			assert.strictEqual(queue.length, items.length - 1);
			return assert.deepStrictEqual(
				[queue.items,          removed],
				[[items[0], items[2]], items[1]],
			);
		});

		it('throws when the index is out of bounds.', () => {
			return assert.throws(() => new EditableQueue<string>(...items).delete(3), /Index `3` out of bounds\./);
		});

		it('throws when the queue is empty.', () => {
			return assert.throws(() => new EditableQueue<number>().delete(2), /Index `2` out of bounds\./);
		});
	});


	context('remove', () => {
		describe('#remove(T)', () => {
			it('returns the original modified queue.', () => {
				const queue = new EditableQueue<string>(...items);
				return assert.strictEqual(queue.remove(items[1])[0], queue);
			});

			it('removes the given item.', () => {
				const [queue, removed]: [EditableQueue<string>, string] = new EditableQueue<string>(...items).remove(items[1]);
				assert.strictEqual(queue.length, items.length - 1);
				return assert.deepStrictEqual(
					[queue.items,          removed],
					[[items[0], items[2]], items[1]],
				);
			});

			it('throws if the given item is not in the queue.', () => {
				return assert.throws(() => new EditableQueue<string>(...items).remove('d'), /Item `d` was not found\./);
			});
		});

		describe('#remove((T) => boolean)', () => {
			it('removes the first item satisfying the predicate.', () => {
				const [queue, removed]: [EditableQueue<string>, string] = new EditableQueue<string>(...items).remove((it) => it.codePointAt(0) === items[1].codePointAt(0));
				assert.strictEqual(queue.length, items.length - 1);
				return assert.deepStrictEqual(
					[queue.items,          removed],
					[[items[0], items[2]], items[1]],
				);
			});

			it('throws if none of the queue’s items satisfy the predicate.', () => {
				return assert.throws(() => new EditableQueue<string>(...items).remove((it) => it.codePointAt(0) === 'd'.codePointAt(0)), /No items satisfy predicate/);
			});
		});
	});


	describe('#clear()', () => {
		it('returns the original modified queue.', () => {
			const queue = new EditableQueue<string>(...items);
			return assert.strictEqual(queue.clear(), queue);
		});

		it('removes all items from the queue.', () => {
			const queue = new EditableQueue<string>(...items).clear();
			assert.strictEqual(queue.length, 0);
			return assert.deepStrictEqual(queue.items, []);
		});
	});
});
