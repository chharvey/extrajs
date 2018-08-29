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
	test(xjs.String.stringify({ an: 'object' })  , '{"an":"object"}'),
	test(xjs.String.stringify(['abc', 'def'])    , 'abcdef'),
	test(xjs.String.stringify(() => 'a function'), "() => 'a function'"),
	test(xjs.String.stringify('ghi')             , 'ghi'),
	test(xjs.String.stringify(123)               , '123'),
	test(xjs.String.stringify(false)             , 'false'),
	test(xjs.String.stringify(null)              , 'null'),
	test(xjs.String.stringify(undefined)         , 'undefined'),
]).then((arr) => true)
