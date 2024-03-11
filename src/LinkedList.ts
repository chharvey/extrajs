import {xjs_Math} from './class/Math.class.js';
import {IndexOutOfBoundsError} from './class/IndexOutOfBoundsError.class.js';



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
		if (this.length) {
			return this.#first!.value;
		} else {
			throw new IndexOutOfBoundsError(0);
		}
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
			throw new Error(`No indices in ${ this }} satisfy predicate ${ arg }}.`);
		} else if (arg instanceof Set) {
			return this.findFirstIndex((it) => arg.has(it));
		} else {
			return this.findFirstIndex(new Set<T>([arg as T]));
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
		if (this.length && xjs_Math.isInRange(index, 0, this.length - 1)) {
			let removed: Readonly<LLItem<T>> = this.#first!;
			if (index === 0) {
				this.#first = removed.next;
			} else {
				const prev: LLItem<T> = this.#getLLItem(index - 1);
				removed = prev.next!;
				prev.next = removed.next;
			}
			this.#length -= 1;
			return [this, removed.value];
		} else {
			throw new IndexOutOfBoundsError(index);
		}
	}

	public shift(n: number = 1): [this, LinkedList<T>] {
		const removed = new LinkedList<T>();
		if (xjs_Math.isInRange(n, 0, this.length)) {
			if (n > 0) {
				let current: Readonly<LLItem<T>> = this.#first!;
				for (let i = 0; i < n; i++) {
					removed.append(current.value);
					if (i < n - 1) {
						current = current.next!;
					}
				}
				if (current.next) {
					this.#first = current.next;
					this.#length -= n;
				} else {
					this.clear();
				}
			}
			return [this, removed];
		} else {
			throw new IndexOutOfBoundsError(n);
		}
	}

	public clear(): this {
		this.#first = null;
		this.#length = 0;
		return this;
	}
}
