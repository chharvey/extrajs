import * as assert from 'assert';
import {xjs_Array} from '../src/class/Array.class.js';

describe('xjs.Array', () => {
	describe('.is<T>(readonly T[], readonly T[], ((T, T) -> boolean)?): boolean', () => {
		it('only checks one level of depth.', () => {
			assert.ok(!xjs_Array.is(
				[1, 'two', [3, 'three'], {v: 4, val: 'four'}, [5, 'five']],
				[1, 'two', [3, 'three'], {v: 4, val: 'four'}, [5, 'five']],
			));
			assert.ok(!xjs_Array.is(
				[1, 'two', [3, 'three'], {v: 4, val: 'four'}, [5, 'five']],
				[1, 'two', [3, 'three'], {v: 4, val: 'four'}, [5, 'five'], [6, 'six', [6, 'six'], {six: 6}]],
			));
			assert.ok(!xjs_Array.is(
				[1, 'two', {value: 3}, ['four']],
				[['four'], 1, 'two', {value: 3}],
			));
		});
	});

	describe('.densify<T>(readonly T[]): T[]', () => {
		/* eslint-disable no-sparse-arrays, @typescript-eslint/comma-dangle */
		it('removes empty element slots.', () => {
			const x: readonly (number | void)[] = [, 42, , 48, ,];
			assert.deepStrictEqual(xjs_Array.densify(x), [42, 48]);
		});
		it('does not remove `undefined` elements.', () => {
			const x: readonly (number | void)[] = [void 0, 42, void 0, 48, void 0,];
			assert.notDeepStrictEqual(x,          [      , 42,       , 48,       ,]);
			assert.deepStrictEqual(xjs_Array.densify(x), x);
		});
		/* eslint-enable no-sparse-arrays, @typescript-eslint/comma-dangle */
	});

	describe('.fillHoles<T>(readonly T[], T): T[]', () => {
		/* eslint-disable no-sparse-arrays */
		it('fills empty slots with given value.', () => {
			const x: readonly (number | void)[] = [, 42, , 48, ,];
			assert.deepStrictEqual(xjs_Array.fillHoles(x, 0), [0, 42, 0, 48, 0]);
		});
		/* eslint-enable no-sparse-arrays */
	});

	describe('.isSubarrayOf<U, T extends U>(readonly T[], readonly U[], ((U, U) -> boolean)?): boolean', () => {
		it('is true if elements of the first are in the second, in the same order.', () => {
			const x: number[] = [3, 4];
			assert.ok( xjs_Array.isSubarrayOf(x, [0, 1, 2, 0, 3, 4]));
			assert.ok( xjs_Array.isSubarrayOf(x, [3, 4, 5]));
			assert.ok( xjs_Array.isSubarrayOf(x, [3, 3, 4, 4]));
			assert.ok( xjs_Array.isSubarrayOf(x, [3, 4]));
			assert.ok( xjs_Array.isSubarrayOf(x, [3, 0, 1, 4]));
			assert.ok( xjs_Array.isSubarrayOf(x, [3, 0, 4, 1]));
			assert.ok(!xjs_Array.isSubarrayOf(x, [3]));
			assert.ok(!xjs_Array.isSubarrayOf(x, [0, 1, 3, 0, 2, 5]));
			assert.ok(!xjs_Array.isSubarrayOf(x, [2, 4]));
			assert.ok(!xjs_Array.isSubarrayOf(x, [4, 3]));
			assert.ok(!xjs_Array.isSubarrayOf(x, [0]));
		});
	});

	describe('.isSuperarrayOf<T, U extends T>(readonly T[], readonly U[], ((T, T) -> boolean)?): boolean', () => {
		it('is true if elements of the second are in the first, in the same order.', () => {
			const x: number[] = [0, 1, 2, 0, 3, 4];
			assert.ok( xjs_Array.isSuperarrayOf(x, [3, 4]));
			assert.ok( xjs_Array.isSuperarrayOf(x, [0, 1, 2]));
			assert.ok( xjs_Array.isSuperarrayOf(x, [0, 1, 2, 0, 3, 4]));
			assert.ok( xjs_Array.isSuperarrayOf(x, [0, 3, 4]));
			assert.ok( xjs_Array.isSuperarrayOf(x, [1]));
			assert.ok( xjs_Array.isSuperarrayOf(x, []));
			assert.ok( xjs_Array.isSuperarrayOf(x, [2, 4]));
			assert.ok(!xjs_Array.isSuperarrayOf(x, [2, 5]));
			assert.ok(!xjs_Array.isSuperarrayOf(x, [4, 0]));
			assert.ok(!xjs_Array.isSuperarrayOf(x, [4, 3]));
			assert.ok(!xjs_Array.isSuperarrayOf(x, [0, 1, 2, 0, 3, 4, 5]));
		});
	});

	describe('.isConsecutiveSubarrayOf<U, T extends U>(readonly T[], readonly U[], ((U, U) -> boolean)?): boolean', () => {
		it('is true if the first is consecutively in the second.', () => {
			const x: number[] = [3, 4];
			assert.ok( xjs_Array.isConsecutiveSubarrayOf(x, [0, 1, 2, 0, 3, 4]));
			assert.ok( xjs_Array.isConsecutiveSubarrayOf(x, [3, 4, 5]));
			assert.ok( xjs_Array.isConsecutiveSubarrayOf(x, [3, 3, 4, 4]));
			assert.ok( xjs_Array.isConsecutiveSubarrayOf(x, [3, 4]));
			assert.ok(!xjs_Array.isConsecutiveSubarrayOf(x, [3, 0, 1, 4]));
			assert.ok(!xjs_Array.isConsecutiveSubarrayOf(x, [3, 0, 4, 1]));
			assert.ok(!xjs_Array.isConsecutiveSubarrayOf(x, [3]));
			assert.ok(!xjs_Array.isConsecutiveSubarrayOf(x, [0, 1, 3, 0, 2, 5]));
			assert.ok(!xjs_Array.isConsecutiveSubarrayOf(x, [2, 4]));
			assert.ok(!xjs_Array.isConsecutiveSubarrayOf(x, [4, 3]));
			assert.ok(!xjs_Array.isConsecutiveSubarrayOf(x, [0]));
		});
	});

	describe('.isConsecutiveSuperarrayOf<T, U extends T>(readonly T[], readonly U[], ((T, T) -> boolean)?): boolean', () => {
		it('is true if the second is consecutively in the first.', () => {
			const x: number[] = [0, 1, 2, 0, 3, 4];
			assert.ok( xjs_Array.isConsecutiveSuperarrayOf(x, [3, 4]));
			assert.ok( xjs_Array.isConsecutiveSuperarrayOf(x, [0, 1, 2]));
			assert.ok( xjs_Array.isConsecutiveSuperarrayOf(x, [0, 1, 2, 0, 3, 4]));
			assert.ok( xjs_Array.isConsecutiveSuperarrayOf(x, [0, 3, 4]));
			assert.ok( xjs_Array.isConsecutiveSuperarrayOf(x, [1]));
			assert.ok( xjs_Array.isConsecutiveSuperarrayOf(x, []));
			assert.ok(!xjs_Array.isConsecutiveSuperarrayOf(x, [2, 4]));
			assert.ok(!xjs_Array.isConsecutiveSuperarrayOf(x, [2, 5]));
			assert.ok(!xjs_Array.isConsecutiveSuperarrayOf(x, [4, 0]));
			assert.ok(!xjs_Array.isConsecutiveSuperarrayOf(x, [4, 3]));
			assert.ok(!xjs_Array.isConsecutiveSuperarrayOf(x, [0, 1, 2, 0, 3, 4, 5]));
		});
	});

	describe('.forEachAggregated', () => {
		it('acts like Array#forEach if no errors.', () => {
			let times: number = 0;
			xjs_Array.forEachAggregated([1, 2, 3, 4], (_n) => {
				times++;
			});
			assert.strictEqual(times, 4);
		});
		it('callback params.', () => {
			const results: Record<'n' | 'i' | 's', string[]> = {
				n: [],
				i: [],
				s: [],
			};
			xjs_Array.forEachAggregated([10, 20, 30, 40], (n, i, src) => {
				results.n.push(n.toString());
				results.i.push(i.toString());
				results.s.push(src.toString());
			});
			assert.deepStrictEqual(results, {
				n: ['10', '20', '30', '40'],
				i: ['0', '1', '2', '3'],
				s: ['10,20,30,40', '10,20,30,40', '10,20,30,40', '10,20,30,40'],
			});
		});
		it('rethrows first error if only 1 error.', () => {
			let times: number = 0;
			assert.throws(() => xjs_Array.forEachAggregated([1, 2, 3, 4], (n) => {
				times++;
				if (n === 2) {
					throw new RangeError(`${ n } is even.`);
				}
			}), (err) => {
				assert.ok(err instanceof RangeError);
				assert.strictEqual(err.message, '2 is even.');
				assert.strictEqual(times, 4);
				return true;
			});
		});
		it('aggregates all caught errors if more than 1.', () => {
			assert.throws(() => xjs_Array.forEachAggregated([1, 2, 3, 4], (n) => {
				if (n % 2 === 0) {
					throw new RangeError(`${ n } is even.`);
				}
			}), (err) => {
				assert.ok(err instanceof AggregateError);
				assert.strictEqual(err.errors.length, 2);
				assert.deepStrictEqual(err.errors.map((er) => {
					assert.ok(er instanceof RangeError);
					return er.message;
				}), ['2 is even.', '4 is even.']);
				return true;
			});
		});
		it('preserves any nested AggregateError errors.', () => {
			assert.throws(() => xjs_Array.forEachAggregated([1, 2, 3, 4, 5, 6, 7, 8], (n) => {
				if (n % 2 === 0) {
					throw (n % 4 === 0)
						? new AggregateError([
							new RangeError(`${ n } is even.`),
							new RangeError(`${ n } is a multiple of 4.`),
						])
						: new RangeError(`${ n } is even.`);
				}
			}), (err) => {
				assert.ok(err instanceof AggregateError);
				assert.strictEqual(err.errors.length, 4);
				assert.deepStrictEqual(err.errors.map((er, i) => {
					if ([0, 2].includes(i)) {
						assert.ok(er instanceof RangeError);
						return er.message;
					} else {
						assert.ok(er instanceof AggregateError);
						return er.errors.map((e) => e.message);
					}
				}), [
					'2 is even.',
					['4 is even.', '4 is a multiple of 4.'],
					'6 is even.',
					['8 is even.', '8 is a multiple of 4.'],
				]);
				return true;
			});
		});
	});

	describe('.mapAggregated', () => {
		it('acts like Array#map if no errors.', () => {
			assert.deepStrictEqual(
				xjs_Array.mapAggregated([1, 2, 3, 4], (n) => n * 2),
				[1, 2, 3, 4].map((n) => n * 2),
			);
		});
		it('callback params.', () => {
			const array = [10, 20, 30, 40];
			const mapper = (n: number, i: number, src: readonly number[]): [string, string, string] => [
				n.toString(),
				i.toString(),
				src.toString(),
			];
			assert.deepStrictEqual(
				xjs_Array.mapAggregated(array, mapper),
				array.map(mapper),
			);
		});
		it('rethrows first error if only 1 error.', () => {
			let times: number = 0;
			assert.throws(() => xjs_Array.mapAggregated([1, 2, 3, 4], (n) => {
				times++;
				if (n === 2) {
					throw new RangeError(`${ n } is even.`);
				}
				return n * 2;
			}), (err) => {
				assert.ok(err instanceof RangeError);
				assert.strictEqual(err.message, '2 is even.');
				assert.strictEqual(times, 4);
				return true;
			});
		});
		it('aggregates all caught errors if more than 1.', () => {
			assert.throws(() => xjs_Array.mapAggregated([1, 2, 3, 4], (n) => {
				if (n % 2 === 0) {
					throw new RangeError(`${ n } is even.`);
				}
				return n * 2;
			}), (err) => {
				assert.ok(err instanceof AggregateError);
				assert.strictEqual(err.errors.length, 2);
				assert.deepStrictEqual(err.errors.map((er) => {
					assert.ok(er instanceof RangeError);
					return er.message;
				}), ['2 is even.', '4 is even.']);
				return true;
			});
		});
		it('preserves any nested AggregateError errors.', () => {
			assert.throws(() => xjs_Array.mapAggregated([1, 2, 3, 4, 5, 6, 7, 8], (n) => {
				if (n % 2 === 0) {
					throw (n % 4 === 0)
						? new AggregateError([
							new RangeError(`${ n } is even.`),
							new RangeError(`${ n } is a multiple of 4.`),
						])
						: new RangeError(`${ n } is even.`);
				}
				return n * 2;
			}), (err) => {
				assert.ok(err instanceof AggregateError);
				assert.strictEqual(err.errors.length, 4);
				assert.deepStrictEqual(err.errors.map((er, i) => {
					if ([0, 2].includes(i)) {
						assert.ok(er instanceof RangeError);
						return er.message;
					} else {
						assert.ok(er instanceof AggregateError);
						return er.errors.map((e) => e.message);
					}
				}), [
					'2 is even.',
					['4 is even.', '4 is a multiple of 4.'],
					'6 is even.',
					['8 is even.', '8 is a multiple of 4.'],
				]);
				return true;
			});
		});
		it('does not throw when mapping to Error objects.', () => {
			assert.deepStrictEqual(
				xjs_Array.mapAggregated(['hello', 'world'], (str) => new TypeError(str)),
				['hello', 'world'].map((str) => new TypeError(str)),
			);
		});
	});
});
