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

module.exports = Promise.all([
	test(`${xjs.Math.mod(8, 6)}`, '2'),
	test(`${xjs.Math.mod(-8, 6)}`, '4'),
	test((() => { try { return `${xjs.Math.mod(8, 0)}` } catch (e) { return e.name } })(), 'RangeError'),
	test((() => { try { return `${xjs.Math.mod(8, 0.5)}` } catch (e) { return e.name } })(), 'RangeError'),
]).then((arr) => true)
