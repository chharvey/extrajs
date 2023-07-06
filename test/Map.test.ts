import * as assert from 'assert';
import {xjs_Map} from '../src/class/Map.class.js';

describe('xjs.Map', () => {
	context('Equality Methods', () => {
		type Key = {id: number};
		const comparator = (a: Key, b: Key): boolean => a.id === b.id;

		describe('.has', () => {
			it('tests keys by equality.', () => {
				const key: Key = {id: 42};
				const my_map = new Map<Key, boolean>([
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
				const my_map = new Map<Key, boolean>([
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
				const my_map = new Map<Key, boolean>([
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
				const my_map = new Map<Key, boolean>([
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
