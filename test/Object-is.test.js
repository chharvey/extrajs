const assert = require('assert')

const xjs = require('../index.js')


/**
 * @summary The master test function for this subject.
 * @see https://nodejs.org/api/assert.html#assert_assert_strictequal_actual_expected_message
 * @param   {string}  actual   the actual value to test
 * @param   {string}  expected the value that `actual` is expected to be
 * @returns {boolean} does `assert.strictEqual(actual, expected)` not throw?
 * @throws  {AssertionError} the error from `assert.strictEqual(actual, expected)`
 */
async function test(actual, expected) {
	return assert.strictEqual(actual, expected, `Got '${actual}', but was expecting '${expected}'.`) || true
}

let x = { a: 1, b: ['1'], c: { val: ['one'] } }
let y = { a: 1, b: ['1'], c: { val: ['one'] } }
let c1 = (x_a, y_a) => assert.deepStrictEqual(x_a, y_a) || true
let c2 = (x_a, y_a) => x_a === y_a

module.exports = Promise.all([
	test(`${xjs.Object.is(x, y)    }`, 'true' ),
	test(`${xjs.Object.is(x, y, c1)}`, 'true' ),
	test(`${xjs.Object.is(x, y, c2)}`, 'false'),
]).then((arr) => true)
