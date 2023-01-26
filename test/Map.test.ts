import * as assert from 'assert';
import {xjs_Map} from '../src/class/Map.class.js';

describe('xjs.Map', () => {
	context('Equality Methods', () => {
		type Key = {id: number};
		const comparator = (a: Key, b: Key) => a.id === b.id;

		describe('.has', () => {
			it('tests keys by equality.', () => {
				const key: Key = {id: 42};
				const my_map: Map<Key, boolean> = new Map([
					[key, true],
				]);
				assert.ok(!my_map.has({id: 42}), 'does not contain an equal (but non-identical) key.');
				assert.ok(xjs_Map.has(my_map, {id: 42}, comparator), 'contains an equal key.');
				assert.ok(xjs_Map.has(my_map, key, comparator), 'contains an identical key.');
				assert.ok(!xjs_Map.has(my_map, {id: 43}, comparator), 'does not contain a non-equal and non-identical key.');
			});
		});

		describe('.get', () => {
			it('gets equivalent keys.', () => {
				const key: Key = {id: 42};
				const my_map: Map<Key, boolean> = new Map([
					[key, true],
				]);
				assert.strictEqual(my_map.get({id: 42}), undefined, 'does not get equal (but non-identical) keys.');
				assert.strictEqual(xjs_Map.get(my_map, {id: 42}, comparator), true, 'gets an equal key.');
				assert.strictEqual(xjs_Map.get(my_map, key, comparator), true, 'gets an identical key.');
				assert.strictEqual(xjs_Map.get(my_map, {id: 43}, comparator), undefined, 'does not get a non-equal and non-identical key.');
			});
		});

		describe('.set', () => {
			it('sets equivalent keys.', () => {
				const key: Key = {id: 42};
				const my_map: Map<Key, boolean> = new Map([
					[key, true],
				]);
				my_map.set({id: 42}, false);
				assert.strictEqual(my_map.size, 2, 'sets (does not override) an equal (but non-identical) key.');
				xjs_Map.set(my_map, {id: 42}, false, comparator);
				assert.strictEqual(my_map.get(key), false, 'overrides an equal key.');
				xjs_Map.set(my_map, key, true, comparator);
				assert.strictEqual(my_map.get(key), true, 'overrides an identical key.');
				xjs_Map.set(my_map, {id: 43}, true, comparator);
				assert.strictEqual(my_map.size, 3, 'sets (does not override) a non-equal and non-identical key.');
			});
		});

		describe('.delete', () => {
			it('deletes equivalent keys.', () => {
				const key: Key = {id: 42};
				const my_map: Map<Key, boolean> = new Map([
					[key, true],
					[{id: 43}, true],
					[{id: 44}, true],
				]);
				my_map.delete({id: 42});
				assert.strictEqual(my_map.size, 3, 'does not delete an equal (but non-identical) key.');
				xjs_Map.delete(my_map, {id: 43}, comparator);
				assert.strictEqual(my_map.size, 2, 'deletes an equal key.');
				xjs_Map.delete(my_map, key, comparator);
				assert.strictEqual(my_map.size, 1, 'deletes an identical key.');
				xjs_Map.delete(my_map, {id: 45}, comparator);
				assert.strictEqual(my_map.size, 1, 'does not delete a non-equal and non-identical key.');
			});
		});
	});

	describe('.forEachAggregated', () => {
		it('acts like Map#forEach if no errors.', () => {
			let times: number = 0;
			xjs_Map.forEachAggregated(new Map<string, number>([
				['one',   1],
				['two',   2],
				['three', 3],
				['four',  4],
			]), (_n) => {
				times++;
			});
			assert.strictEqual(times, 4);
		});
		it('callback params.', () => {
			const results: Record<string, Set<string>> = {
				v: new Set(),
				k: new Set(),
				s: new Set(),
			};
			xjs_Map.forEachAggregated(new Map<string, number>([
				['ten',    10],
				['twenty', 20],
				['thirty', 30],
				['forty',  40],
			]), (value, key, src) => {
				results.v.add(value.toString());
				results.k.add(key.toString());
				results.s.add([...src].toString());
			});
			assert.deepStrictEqual(results, {
				v: new Set(['10', '20', '30', '40']),
				k: new Set(['ten', 'twenty', 'thirty', 'forty']),
				s: new Set([
					'ten,10,twenty,20,thirty,30,forty,40',
					'ten,10,twenty,20,thirty,30,forty,40',
					'ten,10,twenty,20,thirty,30,forty,40',
					'ten,10,twenty,20,thirty,30,forty,40',
				]),
			});
		});
		it('rethrows first error if only 1 error.', () => {
			let times: number = 0;
			assert.throws(() => xjs_Map.forEachAggregated(new Map<string, number>([
				['one',   1],
				['two',   2],
				['three', 3],
				['four',  4],
			]), (num, name) => {
				times++;
				if (num === 2) {
					throw new RangeError(`${ name } is even.`);
				};
			}), (err) => {
				assert.ok(err instanceof RangeError);
				assert.strictEqual(err.message, 'two is even.');
				assert.strictEqual(times, 4);
				return true;
			});
		});
		it('aggregates all caught errors if more than 1.', () => {
			assert.throws(() => xjs_Map.forEachAggregated(new Map<string, number>([
				['one',   1],
				['two',   2],
				['three', 3],
				['four',  4],
			]), (num, name) => {
				if (num % 2 === 0) {
					throw new RangeError(`${ name } is even.`);
				};
			}), (err) => {
				assert.ok(err instanceof AggregateError);
				assert.strictEqual(err.errors.length, 2);
				assert.deepStrictEqual(err.errors.map((er) => {
					assert.ok(er instanceof RangeError);
					return er.message;
				}), ['two is even.', 'four is even.']);
				return true;
			});
		});
		it('preserves any nested AggregateError errors.', () => {
			assert.throws(() => xjs_Map.forEachAggregated(new Map<string, number>([
				['one',   1],
				['two',   2],
				['three', 3],
				['four',  4],
				['five',  5],
				['six',   6],
				['seven', 7],
				['eight', 8],
			]), (num, name) => {
				if (num % 2 === 0) {
					throw (num % 4 === 0)
						? new AggregateError([
							new RangeError(`${ name } is even.`),
							new RangeError(`${ name } is a multiple of 4.`),
						])
						: new RangeError(`${ name } is even.`);
				};
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
					'two is even.',
					['four is even.', 'four is a multiple of 4.'],
					'six is even.',
					['eight is even.', 'eight is a multiple of 4.'],
				]);
				return true;
			});
		});
	});
});
