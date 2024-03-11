import {EmptyStructureError} from './EmptyStructureError.js';
import {LinkedList} from './LinkedList.js';
import {throw_error} from './utils-private.js';



/**
 * A First-In-First-Out (FIFO) data structure.
 * The first element added to the queue will be the first one to be removed.
 *
 * This base class only allows the following operations:
 * - `peek()`: inspect the first item without removing it
 * - `push()`: append an item to the queue
 * - `pop()`: remove the first item from the queue
 *
 * @typeparam T : the type of items in this Queue
 */
export class Queue<T> {
	protected readonly internal: LinkedList<T>;

	public constructor(...items: readonly T[]) {
		this.internal = new LinkedList<T>(...items);
	}

	public peek(): T {
		return (!this.internal.length)
			? throw_error(new EmptyStructureError('Queue is empty.'))
			: this.internal.get(0);
	}

	public push(...items: readonly T[]): this {
		this.internal.append(...items);
		return this;
	}

	public pop(): [this, T] {
		return (!this.internal.length)
			? throw_error(new EmptyStructureError('Cannot pop from empty queue.'))
			: [this, this.internal.shift()[1].firstItem];
	}
}



/**
 * A ReadableQueue is a queue that is “transparent”: its items can all be seen at once.
 * It offers the additonal operations:
 * - `length`: the number of items in the queue
 * - `isEmpty`: does the queue have 0 items?
 * - `items`: inspect a copy of the entire queue as an array
 * - `get()`: inspect an arbitrary item in the queue
 *
 * @typeparam T : the type of items in this ReadableQueue
 */
export class ReadableQueue<T> extends Queue<T> {
	public get length(): number {
		return this.internal.length;
	}

	public get isEmpty(): boolean {
		return this.length === 0;
	}

	public get items(): T[] {
		return [...this.internal];
	}

	public get(index: number): T {
		return this.internal.get(index);
	}
}



/**
 * A DeletableQueue is a queue from which items may be removed outside of the normal `pop()` method.
 * It offers the additonal operations:
 * - `delete()`: remove an arbitrary item from the queue by index
 * - `remove()`: remove an arbitrary item from the queue
 * - `clear()`: remove all items from the queue
 *
 * @typeparam T : the type of items in this DeletableQueue
 */
export class DeletableQueue<T> extends ReadableQueue<T> {
	public delete(index: number): [this, T] {
		return [this, this.internal.delete(index)[1]];
	}

	public remove(item: T): [this, T];
	public remove(predicate: (it: T) => boolean): [this, T];
	public remove(arg: T | ((it: T) => boolean)): [this, T] {
		return arg instanceof Function
			? this.delete(this.internal.findFirstIndex((it) => arg.call(null, it)))
			: this.delete(this.internal.findFirstIndex(arg));
	}

	public clear(): this {
		this.internal.clear();
		return this;
	}
}
