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

let x = [0,1,2,0,3,4]

module.exports = Promise.all([
	test(`${xjs.Array.contains(x, [3,4]          )}`, 'true' ),
	test(`${xjs.Array.contains(x, [0,1,2]        )}`, 'true' ),
	test(`${xjs.Array.contains(x, [0,1,2,0,3,4]  )}`, 'true' ),
	test(`${xjs.Array.contains(x, [0,3,4]        )}`, 'true' ),
	test(`${xjs.Array.contains(x, [2,5]          )}`, 'false'),
	test(`${xjs.Array.contains(x, [2,4]          )}`, 'false'),
	test(`${xjs.Array.contains(x, [4,0]          )}`, 'false'),
	test(`${xjs.Array.contains(x, [4,3]          )}`, 'false'),
	test(`${xjs.Array.contains(x, [1]            )}`, 'true' ),
	test(`${xjs.Array.contains(x, [0,1,2,0,3,4,5])}`, 'false'),
]).then((arr) => true)
