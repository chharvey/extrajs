import {xjs_Math} from './class/Math.class.js';
import {IndexOutOfBoundsError} from './class/IndexOutOfBoundsError.class.js';
import {throw_error} from './utils-private.js';



class LLItem<T> {
	public next: LLItem<T> | null = null;
	public constructor(public readonly value: T) {}
}



export interface ReadonlyLinkedList<T> {
	readonly length: number;

	readonly firstItem: T;

	[Symbol.iterator](): IterableIterator<T>;

	get(index: number): T;

	findFirstIndex(item: T): number;
	findFirstIndex(items: ReadonlySet<T>): number;
	findFirstIndex(predicate: (it: T, i: number, this_: this) => boolean): number;
}



export class LinkedList<T> implements ReadonlyLinkedList<T> {
	#length: number = 0;
	#first: LLItem<T> | null = null;


	public constructor(...items: readonly T[]) {
		if (items.length) {
			this.#first = new LLItem<T>(items[0]);
			let current: LLItem<T> = this.#first;
			items.slice(1).forEach((it) => {
				current.next = new LLItem<T>(it);
				current = current.next;
			});
			this.#length = items.length;
		}
	}


	public get length(): number {
		return this.#length;
	}

	public get firstItem(): T {
		return this.length
			? this.#first!.value
			: throw_error(new IndexOutOfBoundsError(0));
	}


	* #entries(): IterableIterator<[number, T]> {
		let current: Readonly<LLItem<T>> | null = this.#first;
		for (let i = 0; i < this.length; i++) {
			yield [i, current!.value];
			if (i < this.length - 1) {
				current = current!.next;
			}
		}
	}

	public * [Symbol.iterator](): IterableIterator<T> {
		return yield * [...this.#entries()].map((entry) => entry[1]);
		// TODO: once `Iterator.prototype.map` is standardized:
		// return yield * this.#entries().map((entry) => entry[1]);
	}

	#normalizeIndex(index: number): number {
		return index >= 0 ? index : index + this.length;
	}

	#getLLItem(index: number): LLItem<T> {
		index = this.#normalizeIndex(index);
		if (this.length && xjs_Math.isInRange(index, 0, this.length - 1)) {
			let current: Readonly<LLItem<T>> = this.#first!;
			for (let i = 0; i < this.length; i++) {
				if (i === index) {
					return current;
				}
				if (i < this.length - 1) {
					current = current.next!;
				}
			}
		}
		throw new IndexOutOfBoundsError(index);
	}

	public get(index: number): T {
		return this.#getLLItem(index).value;
	}

	public findFirstIndex(item: T): number;
	public findFirstIndex(items: ReadonlySet<T>): number;
	public findFirstIndex(predicate: (it: T, i: number, this_: this) => boolean): number;
	public findFirstIndex(arg: T | ReadonlySet<T> | ((it: T, i: number, this_: this) => boolean)): number {
		if (arg instanceof Function) {
			for (const [i, it] of this.#entries()) {
				if (arg.call(null, it, i, this)) {
					return i;
				}
			}
			throw new Error(`No items satisfy predicate \`${ arg }\`}.`);
		} else if (arg instanceof Set) {
			try {
				return this.findFirstIndex((it) => arg.has(it));
			} catch (err) {
				return throw_error(((err as Error).message.startsWith('No items satisfy predicate')
					? new Error(`No elements in Set \`${ arg }\` were found.`)
					: err as Error
				));
			}
		} else {
			try {
				return this.findFirstIndex(new Set<T>([arg as T]));
			} catch (err) {
				return throw_error(((err as Error).message.startsWith('No elements in Set')
					? new Error(`Item \`${ arg }\` was not found.`)
					: err as Error
				));
			}
		}
	}

	public prepend(...items: T[]): this {
		if (items.length) {
			const new_ = new LinkedList<T>(...items);
			const new_first: Readonly<LLItem<T>> = new_.#first!;
			if (this.length) {
				new_.#getLLItem(new_.length - 1).next = this.#first;
			}
			this.#first = new_first;
			this.#length += items.length;
		}
		return this;
	}

	public append(...items: T[]): this {
		if (items.length) {
			const new_first: Readonly<LLItem<T>> = new LinkedList<T>(...items).#first!;
			if (this.length) {
				this.#getLLItem(this.length - 1).next = new_first;
			} else {
				this.#first = new_first;
			}
			this.#length += items.length;
		}
		return this;
	}

	public delete(index: number): [this, T] {
		index = this.#normalizeIndex(index);
		if (!this.length || !xjs_Math.isInRange(index, 0, this.length - 1)) {
			throw new IndexOutOfBoundsError(index);
		}

		let removed: Readonly<LLItem<T>> | null = null;
		if (index === 0) {
			removed     = this.#first!;
			this.#first = removed.next;
		} else {
			const prev: LLItem<T> = this.#getLLItem(index - 1);
			removed   = prev.next!;
			prev.next = removed.next;
		}
		this.#length -= 1;
		return [this, removed.value];
	}

	public shift(n: number = 1): [this, LinkedList<T>] {
		if (!xjs_Math.isInRange(n, 0, this.length)) {
			throw new IndexOutOfBoundsError(n);
		}
		const removed = new LinkedList<T>();
		if (n > 0) {
			removed.#first = this.#first;
			const removed_last: LLItem<T> = this.#getLLItem(n - 1);
			this.#first        = removed_last.next;
			removed_last.next  = null;
			this.#length      -= n;
			removed.#length    = n;
		}
		return [this, removed];
	}

	public drop(n: number = 1): [this, LinkedList<T>] {
		if (!xjs_Math.isInRange(n, 0, this.length)) {
			throw new IndexOutOfBoundsError(n);
		}
		const removed = new LinkedList<T>();
		if (n > 0) {
			const this_last_index: number = this.length - 1 - n;
			if (n === this.length) {
				removed.#first = this.#first;
				this.clear();
			} else {
				const this_last: LLItem<T> = this.#getLLItem(this_last_index);
				removed.#first   = this_last.next;
				this_last.next   = null;
				this.#length    -= n;
			}
			removed.#length = n;
		}
		return [this, removed];
	}

	public clear(): this {
		this.#first = null;
		this.#length = 0;
		return this;
	}
}
