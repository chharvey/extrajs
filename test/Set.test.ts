import * as assert from 'assert';
import {xjs_Set} from '../src/class/Set.class.js';

describe('xjs.Set', () => {
	describe('.isSubsetOf<U, T extends U>(ReadonlySet<T>, ReadonlySet<U>, ((U, U) -> boolean)?): boolean', () => {
		it('is true if elements of the first are in the second.', () => {
			const x = new Set<number>([3, 4]);
			assert.ok( xjs_Set.isSubsetOf(x, new Set([0, 1, 2, 0, 3, 4])));
			assert.ok( xjs_Set.isSubsetOf(x, new Set([3, 4, 5])));
			assert.ok( xjs_Set.isSubsetOf(x, new Set([3, 3, 4, 4])));
			assert.ok( xjs_Set.isSubsetOf(x, new Set([3, 4])));
			assert.ok( xjs_Set.isSubsetOf(x, new Set([3, 0, 1, 4])));
			assert.ok( xjs_Set.isSubsetOf(x, new Set([3, 0, 4, 1])));
			assert.ok( xjs_Set.isSubsetOf(x, new Set([4, 3])));
			assert.ok(!xjs_Set.isSubsetOf(x, new Set([3])));
			assert.ok(!xjs_Set.isSubsetOf(x, new Set([0, 1, 3, 0, 2, 5])));
			assert.ok(!xjs_Set.isSubsetOf(x, new Set([2, 4])));
			assert.ok(!xjs_Set.isSubsetOf(x, new Set([0])));
		});
	});

	describe('.isSupersetOf<T, U extends T>(ReadonlySet<T>, ReadonlySet<U>, ((T, T) -> boolean)?): boolean', () => {
		it('is true if elements of the second are in the first.', () => {
			const x = new Set<number>([0, 1, 2, 0, 3, 4]);
			assert.ok( xjs_Set.isSupersetOf(x, new Set([3, 4])));
			assert.ok( xjs_Set.isSupersetOf(x, new Set([0, 1, 2])));
			assert.ok( xjs_Set.isSupersetOf(x, new Set([0, 1, 2, 0, 3, 4])));
			assert.ok( xjs_Set.isSupersetOf(x, new Set([0, 3, 4])));
			assert.ok( xjs_Set.isSupersetOf(x, new Set([1])));
			assert.ok( xjs_Set.isSupersetOf(x, new Set([])));
			assert.ok( xjs_Set.isSupersetOf(x, new Set([2, 4])));
			assert.ok( xjs_Set.isSupersetOf(x, new Set([4, 0])));
			assert.ok( xjs_Set.isSupersetOf(x, new Set([4, 3])));
			assert.ok(!xjs_Set.isSupersetOf(x, new Set([2, 5])));
			assert.ok(!xjs_Set.isSupersetOf(x, new Set([0, 1, 2, 0, 3, 4, 5])));
		});
	});


	context('Equality Methods', () => {
		type El = {id: number};
		const comparator = (a: El, b: El): boolean => a.id === b.id;

		describe('.has', () => {
			it('tests elements by equality.', () => {
				const el: El = {id: 42};
				const my_set = new Set<El>([el]);
				assert.ok(!my_set.has({id: 42}), 'does not contain an equal (but non-identical) element.');
				assert.ok(xjs_Set.has(my_set, {id: 42}, comparator), 'contains an equal element.');
				assert.ok(xjs_Set.has(my_set, el, comparator), 'contains an identical element.');
				assert.ok(!xjs_Set.has(my_set, {id: 43}, comparator), 'does not contain a non-equal and non-identical element.');
			});
		});

		describe('.add', () => {
			it('adds equivalent elements.', () => {
				const el: El = {id: 42};
				const my_set = new Set<El>([el]);
				my_set.add({id: 42});
				assert.strictEqual(my_set.size, 2, 'adds an equal (but non-identical) element.');
				xjs_Set.add(my_set, {id: 42}, comparator);
				assert.strictEqual(my_set.size, 2, 'does not add an equal element.');
				xjs_Set.add(my_set, el, comparator);
				assert.strictEqual(my_set.size, 2, 'does not add an identical element.');
				xjs_Set.add(my_set, {id: 43}, comparator);
				assert.strictEqual(my_set.size, 3, 'adds a non-equal and non-identical element.');
			});
		});

		describe('.delete', () => {
			it('deletes equivalent elements.', () => {
				const el: El = {id: 42};
				const my_set = new Set<El>([el, {id: 43}, {id: 44}]);
				my_set.delete({id: 42});
				assert.strictEqual(my_set.size, 3, 'does not delete an equal (but non-identical) element.');
				xjs_Set.delete(my_set, {id: 43}, comparator);
				assert.strictEqual(my_set.size, 2, 'deletes an equal element.');
				xjs_Set.delete(my_set, el, comparator);
				assert.strictEqual(my_set.size, 1, 'deletes an identical element.');
				xjs_Set.delete(my_set, {id: 45}, comparator);
				assert.strictEqual(my_set.size, 1, 'does not delete a non-equal and non-identical element.');
			});
		});
	});


	context('Operation Methods', () => {
		type Item = {id: number};
		const comparator = (a: Item, b: Item): boolean => a.id === b.id;
		const a: ReadonlySet<Item> = new Set([{id: 1}, {id: 2}, {id: 3}]);
		const b: ReadonlySet<Item> = new Set([{id: 2}, {id: 3}, {id: 4}]);
		specify('.intersection', () => {
			assert.deepStrictEqual(
				xjs_Set.intersection(a, b, comparator),
				new Set([{id: 2}, {id: 3}]),
			);
		});
		specify('.union', () => {
			assert.deepStrictEqual(
				xjs_Set.union(a, b, comparator),
				new Set([{id: 1}, {id: 2}, {id: 3}, {id: 4}]),
			);
		});
		specify('.difference', () => {
			assert.deepStrictEqual(
				xjs_Set.difference(a, b, comparator),
				new Set([{id: 1}]),
			);
			assert.deepStrictEqual(
				xjs_Set.difference(b, a, comparator),
				new Set([{id: 4}]),
			);
		});
		specify('.symmetricDifference', () => {
			assert.deepStrictEqual(
				xjs_Set.symmetricDifference(a, b, comparator),
				new Set([{id: 1}, {id: 4}]),
			);
		});
	});
});
