const assert = require('assert')


/**
 * @summary The master test function for this project.
 * @see https://nodejs.org/api/assert.html#assert_assert_strictequal_actual_expected_message
 * @param   {string}  actual   the actual value to test
 * @param   {string}  expected the value that `actual` is expected to be
 * @returns {true} does `assert.strictEqual(actual, expected)` not throw?
 * @throws  {AssertionError} the error from `assert.strictEqual(actual, expected)`
 */
module.exports = async function test(actual, expected) {
	return assert.strictEqual(actual, expected, `Got '${actual}', but was expecting '${expected}'.`) || true
}
