import * as assert from 'assert'
import xjs_Set from '../src/class/Set.class.js';

describe('xjs.Set', () => {
	describe('.isSubsetOf<U, T extends U>(ReadonlySet<T>, ReadonlySet<U>, ((U, U) -> boolean)?): boolean', () => {
		it('is true if elements of the first are in the second.', () => {
			const x: Set<number> = new Set([3,4])
			assert.ok( xjs_Set.isSubsetOf(x, new Set([0,1,2,0,3,4])))
			assert.ok( xjs_Set.isSubsetOf(x, new Set([3,4,5]      )))
			assert.ok( xjs_Set.isSubsetOf(x, new Set([3,3,4,4]    )))
			assert.ok( xjs_Set.isSubsetOf(x, new Set([3,4]        )))
			assert.ok( xjs_Set.isSubsetOf(x, new Set([3,0,1,4]    )))
			assert.ok( xjs_Set.isSubsetOf(x, new Set([3,0,4,1]    )))
			assert.ok( xjs_Set.isSubsetOf(x, new Set([4,3]        )))
			assert.ok(!xjs_Set.isSubsetOf(x, new Set([3]          )))
			assert.ok(!xjs_Set.isSubsetOf(x, new Set([0,1,3,0,2,5])))
			assert.ok(!xjs_Set.isSubsetOf(x, new Set([2,4]        )))
			assert.ok(!xjs_Set.isSubsetOf(x, new Set([0]          )))
		})
	})

	describe('.isSupersetOf<T, U extends T>(ReadonlySet<T>, ReadonlySet<U>, ((T, T) -> boolean)?): boolean', () => {
		it('is true if elements of the second are in the first.', () => {
			const x: Set<number> = new Set([0,1,2,0,3,4])
			assert.ok( xjs_Set.isSupersetOf(x, new Set([3,4]          )))
			assert.ok( xjs_Set.isSupersetOf(x, new Set([0,1,2]        )))
			assert.ok( xjs_Set.isSupersetOf(x, new Set([0,1,2,0,3,4]  )))
			assert.ok( xjs_Set.isSupersetOf(x, new Set([0,3,4]        )))
			assert.ok( xjs_Set.isSupersetOf(x, new Set([1]            )))
			assert.ok( xjs_Set.isSupersetOf(x, new Set([]             )))
			assert.ok( xjs_Set.isSupersetOf(x, new Set([2,4]          )))
			assert.ok( xjs_Set.isSupersetOf(x, new Set([4,0]          )))
			assert.ok( xjs_Set.isSupersetOf(x, new Set([4,3]          )))
			assert.ok(!xjs_Set.isSupersetOf(x, new Set([2,5]          )))
			assert.ok(!xjs_Set.isSupersetOf(x, new Set([0,1,2,0,3,4,5])))
		})
	})
})
