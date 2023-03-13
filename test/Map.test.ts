import * as assert from 'assert';
import {xjs_Map} from '../src/class/Map.class.js';

describe('xjs.Map', () => {
	describe('.is', () => {
		it('tests keys and values by equality predicate.', () => {
			type Key = {id: number};
			type Val = {name: string};
			const comparator_keys = (a: Key, b: Key) => a.id   === b.id;
			const comparator_vals = (a: Val, b: Val) => a.name === b.name;
			const key: Key = {id: 42};
			const val: Val = {name: 'alice'};
			const map1 = new Map<Key, Val>([[key, val]]);
			const map2 = new Map<Key, Val>([[key, val]]);
			const map3 = new Map<Key, Val>([[{id: 42}, {name: 'alice'}]]);
			const map4 = new Map<Key, Val>([[{id: 43}, {name: 'bob'}]]);
			assert.notStrictEqual(map1, map2, 'different maps with identical pairs are not identical.');
			assert.ok(xjs_Map.is<Key, Val>(map1, map2), 'maps with identical pairs pass with the default predicate.');
			assert.ok(!xjs_Map.is<Key, Val>(map2, map3), 'maps with equal (but non-identical) pairs fail with the default predicate.');
			assert.ok(xjs_Map.is<Key, Val>(map1, map2, {
				keys:   comparator_keys,
				values: comparator_vals,
			}), 'maps with identical pairs pass with both the provided predicates.');
			assert.ok(xjs_Map.is<Key, Val>(map2, map3, {
				keys:   comparator_keys,
				values: comparator_vals,
			}), 'maps with equal (but non-identical) pairs pass with both the provided predicates.');
			assert.ok(!xjs_Map.is<Key, Val>(map3, map4, {
				keys:   comparator_keys,
				values: comparator_vals,
			}), 'maps with non-equal and non-identical pairs fail.');
		});
	});


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
});
