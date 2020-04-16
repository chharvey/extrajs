import * as assert from 'assert'
import xjs_String from '../src/class/String.class'

describe('xjs.String', () => {
	describe('.stringify(unknown): string', () => {
		it('is similar to `#toString()`.', () => {
			assert.strictEqual(xjs_String.stringify({ an: 'object' })  , '{"an":"object"}')
			assert.strictEqual(xjs_String.stringify(['abc', 'def'])    , 'abcdef')
			assert.strictEqual(xjs_String.stringify(() => 'a function'), "() => 'a function'")
			assert.strictEqual(xjs_String.stringify('ghi')             , 'ghi')
			assert.strictEqual(xjs_String.stringify(123)               , '123')
			assert.strictEqual(xjs_String.stringify(false)             , 'false')
			assert.strictEqual(xjs_String.stringify(null)              , 'null')
			assert.strictEqual(xjs_String.stringify(undefined)         , 'undefined')
		})
	})
})
