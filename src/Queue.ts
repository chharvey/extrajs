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
 * An EditableQueue is a queue from which items may be removed and rearranged outside of the normal `push()` and `pop()` methods.
 * It offers the additonal operations:
 * - `promote{ByIndex}()`:        move an item toward the start/front of the queue by a given number of slots (default 1)
 * - `demote{ByIndex}()`:         move an item toward the end/back    of the queue by a given number of slots (default 1)
 * - `promote{ByIndex}ToStart()`: move an item all the way to the start/front
 * - `demote{ByIndex}ToEnd()`:    move an item all the way to the end/back
 * - `delete()`:                  remove an arbitrary item from the queue by index
 * - `remove()`:                  remove an arbitrary item from the queue
 * - `clear()`:                   remove all items from the queue
 *
 * @typeparam T : the type of items in this EditableQueue
 */
export class EditableQueue<T> extends ReadableQueue<T> {
	public promoteByIndex(index: number, slots: number = 1): this {
		if (slots > index) {
			throw new RangeError('Too many slots; cannot promote beyond the start of the queue.');
		}
		if (slots < 0) {
			throw new RangeError('Negative numbers not accepted; use `demoteByIndex` instead.');
		}

		if (slots > 0) {
			const head:     LinkedList<T> = this.internal.shift(index)[1]; // the front of the queue, before the index to be moved
			const demoted:  LinkedList<T> = head.drop(slots)[1];           // the items ahead of the given index that must be moved back
			const promoted: T             = this.internal.delete(0)[1];    // the given index, which is moved forward // `.delete(0)` is faster than `.shift(1)`

			this.internal.prepend(...head, promoted, ...demoted);
		}
		return this;
	}

	public demoteByIndex(index: number, slots: number = 1): this {
		const n_items_after_index = this.length - (index + 1);
		if (slots > n_items_after_index) {
			throw new RangeError('Too many slots; cannot demote beyond the end of the queue.');
		}
		if (slots < 0) {
			throw new RangeError('Negative numbers not accepted; use `promoteByIndex` instead.');
		}

		if (slots > 0) {
			const tail:     LinkedList<T> = this.internal.drop(n_items_after_index)[1]; // the back of the queue, after the index to be moved
			const promoted: LinkedList<T> = tail.shift(slots)[1];                       // the items behind the given index that must be moved forward
			const demoted:  T             = this.internal.delete(index)[1];             // the given index, which is moved back // `.delete(index)` is faster than `.drop(1)`

			this.internal.append(...promoted, demoted, ...tail);
		}
		return this;
	}

	public promoteByIndexToStart(index: number): this {
		this.internal.prepend(this.delete(index)[1]);
		return this;
	}

	public demoteByIndexToEnd(index: number): this {
		return this.push(this.delete(index)[1]);
	}

	public promote(item:      T,                        slots?: number): this;
	public promote(predicate: (it: T) => boolean,       slots?: number): this;
	public promote(arg:       T | ((it: T) => boolean), slots?: number): this {
		return arg instanceof Function
			? this.promoteByIndex(this.internal.findFirstIndex((it) => arg.call(null, it)), slots)
			: this.promoteByIndex(this.internal.findFirstIndex(arg), slots);
	}

	public demote(item:      T,                        slots?: number): this;
	public demote(predicate: (it: T) => boolean,       slots?: number): this;
	public demote(arg:       T | ((it: T) => boolean), slots?: number): this {
		return arg instanceof Function
			? this.demoteByIndex(this.internal.findFirstIndex((it) => arg.call(null, it)), slots)
			: this.demoteByIndex(this.internal.findFirstIndex(arg), slots);
	}

	public promoteToStart(item:      T):                        this;
	public promoteToStart(predicate: (it: T) => boolean):       this;
	public promoteToStart(arg:       T | ((it: T) => boolean)): this {
		return arg instanceof Function
			? this.promoteByIndexToStart(this.internal.findFirstIndex((it) => arg.call(null, it)))
			: this.promoteByIndexToStart(this.internal.findFirstIndex(arg));
	}

	public demoteToEnd(item:      T):                        this;
	public demoteToEnd(predicate: (it: T) => boolean):       this;
	public demoteToEnd(arg:       T | ((it: T) => boolean)): this {
		return arg instanceof Function
			? this.demoteByIndexToEnd(this.internal.findFirstIndex((it) => arg.call(null, it)))
			: this.demoteByIndexToEnd(this.internal.findFirstIndex(arg));
	}

	public delete(index: number): [this, T] {
		return [this, this.internal.delete(index)[1]];
	}

	public remove(item:      T):                        [this, T];
	public remove(predicate: (it: T) => boolean):       [this, T];
	public remove(arg:       T | ((it: T) => boolean)): [this, T] {
		return arg instanceof Function
			? this.delete(this.internal.findFirstIndex((it) => arg.call(null, it)))
			: this.delete(this.internal.findFirstIndex(arg));
	}

	public clear(): this {
		this.internal.clear();
		return this;
	}
}
