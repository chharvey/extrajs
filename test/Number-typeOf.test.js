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
	test(xjs.Number.typeOf(42)    , 'integer'),
	test(xjs.Number.typeOf(-42)   , 'integer'),
	test(xjs.Number.typeOf(0)     , 'integer'),
	test(xjs.Number.typeOf(-0)    , 'integer'),
	test(xjs.Number.typeOf(24.00) , 'integer'),
	test(xjs.Number.typeOf(-24.00), 'integer'),
	test(xjs.Number.typeOf(42.24) , 'float'  ),
	test(xjs.Number.typeOf(-42.24), 'float'  ),
	test((() => { try { return xjs.Number.typeOf(NaN     ) } catch (e) { return e.name } })(), 'RangeError'),
	test((() => { try { return xjs.Number.typeOf(Infinity) } catch (e) { return e.name } })(), 'RangeError'),
]).then((arr) => true)
