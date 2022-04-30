import * as assert from 'assert'
import xjs_Promise from '../src/class/Promise.class.js';

describe('xjs.Promise', () => {
	describe('.any<T>((T | Promise<T>)[]): Promise<T>', () => {
		it('resolves with the first resolved value if any item resolves.', async () => {
			assert.strictEqual(await xjs_Promise.any([
				Promise.resolve('string1'),
				Promise.resolve('string2'),
			]), 'string1')
			assert.strictEqual(await xjs_Promise.any([
				Promise.reject(new Error('an error')),
				Promise.resolve('a string'),
			]), 'a string')
		})
		it('rejects with an array of reasons if all items reject.', async () => {
			await assert.rejects(xjs_Promise.any([
				Promise.reject(new Error('error1')),
				Promise.reject(new Error('error2')),
			]), Array)
		})
	})
})
