const assert = require('assert')

const xjs = require('../index.js')
const test = require('../lib/test.js')


let x = { a: 1, b: ['1'], c: { val: ['one'] } }
let y = { a: 1, b: ['1'], c: { val: ['one'] } }
let c1 = (x_a, y_a) => assert.deepStrictEqual(x_a, y_a) || true

module.exports = Promise.all([
	test(`${xjs.Object.is(x, y)    }`, 'false'),
	test(`${xjs.Object.is(x, y, c1)}`, 'true' ),
]).then((arr) => true)
