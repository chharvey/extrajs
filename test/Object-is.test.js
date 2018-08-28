const assert = require('assert')

const xjs = require('../index.js')


/**
 * @summary The master test function for this subject.
 * @see https://nodejs.org/api/assert.html#assert_assert_value_message
 * @param   {boolean} value the value to test
 * @returns {boolean} does `assert(value)` not throw?
 * @throws  {AssertionError} the error from `assert(value)`
 */
function test(value) {
	return assert(value, `Got false, but was expecting true.`) || true
}

let x = { a: 1, b: ['1'], c: { val: ['one'] } }
let y = { a: 1, b: ['1'], c: { val: ['one'] } }
let c1 = (x_a, y_a) => assert.deepStrictEqual(x_a, y_a) || true
let c2 = (x_a, y_a) => x_a === y_a

module.exports = [
	test(xjs.Object.is(x, y)     === true),
	test(xjs.Object.is(x, y, c1) === true),
	test(xjs.Object.is(x, y, c2) === false),
].reduce((a, b) => a && b)
