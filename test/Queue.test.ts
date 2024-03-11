/* eslint-disable arrow-body-style */
import * as assert from 'assert';
import {
	Queue,
	ReadableQueue,
	DeletableQueue,
} from '../src/index.js';



const items = ['a', 'b', 'c'] as const;



describe('Queue', () => {
	describe('.peek()', () => {
		it('does not modify the queue.', () => {
			const queue = new Queue<string>(...items);
			queue.peek();
			return assert.strictEqual(queue.pop()[1], items[0]);
		});

		it('returs the first item in the queue.', () => {
			return assert.strictEqual(new Queue<string>(...items).peek(), items[0]);
		});

		it('throws when the queue is empty.', () => {
			return assert.throws(() => new Queue<string>().peek(), /Queue is empty\./);
		});
	});


	describe('.push()', () => {
		it('returns the original modified queue.', () => {
			const queue = new Queue<string>();
			return assert.strictEqual(queue.push('d'), queue);
		});

		it('puts items at the end of the queue.', () => {
			const queue = new Queue<string>().push('d');
			return assert.strictEqual(queue.pop()[1], 'd');
		});
	});


	describe('.pop()', () => {
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
			return assert.throws(() => new Queue<string>().pop(), /Cannot pop from empty queue\./);
		});
	});
});



describe('ReadableQueue', () => {
	describe('.get(number)', () => {
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



describe('DeletableQueue', () => {
	describe('.delete(number)', () => {
		it('returns the original modified queue.', () => {
			const queue = new DeletableQueue<string>(...items);
			return assert.strictEqual(queue.delete(1)[0], queue);
		});

		it('removes the item at the given index.', () => {
			const [queue, removed]: [DeletableQueue<string>, string] = new DeletableQueue<string>(...items).delete(1);
			assert.strictEqual(queue.length, items.length - 1);
			return assert.deepStrictEqual(
				[queue.items,          removed],
				[[items[0], items[2]], items[1]],
			);
		});

		it('throws when the index is out of bounds.', () => {
			return assert.throws(() => new DeletableQueue<string>(...items).delete(3), /Index `3` out of bounds\./);
		});

		it('throws when the queue is empty.', () => {
			return assert.throws(() => new DeletableQueue<number>().delete(2), /Index `2` out of bounds\./);
		});
	});


	context('remove', () => {
		describe('.remove(T)', () => {
			it('returns the original modified queue.', () => {
				const queue = new DeletableQueue<string>(...items);
				return assert.strictEqual(queue.remove(items[1])[0], queue);
			});

			it('removes the given item.', () => {
				const [queue, removed]: [DeletableQueue<string>, string] = new DeletableQueue<string>(...items).remove(items[1]);
				assert.strictEqual(queue.length, items.length - 1);
				return assert.deepStrictEqual(
					[queue.items,          removed],
					[[items[0], items[2]], items[1]],
				);
			});
		});

		describe('.remove((T) => boolean)', () => {
			it('removes the first item satisfying the predicate.', () => {
				const [queue, removed]: [DeletableQueue<string>, string] = new DeletableQueue<string>(...items).remove((it) => it.codePointAt(0) === items[1].codePointAt(0));
				assert.strictEqual(queue.length, items.length - 1);
				return assert.deepStrictEqual(
					[queue.items,          removed],
					[[items[0], items[2]], items[1]],
				);
			});
		});
	});


	describe('.clear()', () => {
		it('returns the original modified queue.', () => {
			const queue = new DeletableQueue<string>(...items);
			return assert.strictEqual(queue.clear(), queue);
		});

		it('removes all items from the queue.', () => {
			const queue = new DeletableQueue<string>(...items).clear();
			assert.strictEqual(queue.length, 0);
			return assert.deepStrictEqual(queue.items, []);
		});
	});
});
