import * as assert from 'assert'
import xjs_Map from '../src/class/Map.class'


describe('xjs.Map', () => {
	describe('.find<K, V>(Map<K, V>, (V, K, Map<K, V>) => boolean, unknown?): V|null', () => {
		it('finds an element satisfying the predicate.', () => {
			assert.ok(xjs_Map)
		})
	})
})
