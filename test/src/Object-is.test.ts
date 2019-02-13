import * as assert from 'assert'

import * as xjs from '../../index'
import test from './test'


let x = { a: 1, b: ['1'], c: { val: ['one'] } }
let y = { a: 1, b: ['1'], c: { val: ['one'] } }
let c1 = (x_a: unknown, y_a: unknown) => (assert.deepStrictEqual(x_a, y_a), true)
let c2 = (x_a: {val:string[]}|string[]|number, y_a: {val:string[]}|string[]|number ) => (assert.deepStrictEqual(x_a, y_a), true)

export default Promise.all([
	test(`${xjs.Object.is(x, y)    }`, 'false'),
	test(`${xjs.Object.is(x, y, c1)}`, 'true' ),
	test(`${xjs.Object.is(x, y, c2)}`, 'true' ),
])
