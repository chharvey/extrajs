import * as assert from 'assert';
import {MapEq} from '../src/MapEq';

describe('MapEq', () => {
	const key: {id: number} = {id: 42};
	let my_map: MapEq<{id: number}, boolean>;
	beforeEach(() => {
		my_map = new MapEq((a, b) => a.id === b.id, [
			[key, true],
		]);
	});
	describe('.constructor', () => {
		it('does not throw when given multiple pairs.', () => {
			const newmap: MapEq<{id: number}, boolean> = new MapEq((a, b) => a.id === b.id, [
				[{id: 42}, true],
				[{id: 42}, false],
			]); // assert does not throw
			assert.strictEqual(newmap.size, 1);
		});
	});
	describe('#has', () => {
		it('checks uniqueness via comparator.', () => {
			assert.ok(my_map.has({id: 42}));
		});
	});
	describe('#get', () => {
		it('checks uniqueness via comparator.', () => {
			assert.strictEqual(my_map.get({id: 42}), true);
		});
	});
	describe('#set', () => {
		it('checks uniqueness via comparator.', () => {
			my_map.set({id: 42}, false);
			assert.strictEqual(my_map.get(key), false);
			assert.strictEqual(my_map.size, 1);
		});
	});
	describe('#delete', () => {
		it('checks uniqueness via comparator.', () => {
			my_map.delete({id: 42});
			assert.ok(!my_map.has(key));
			assert.strictEqual(my_map.size, 0);
		});
	});
});
