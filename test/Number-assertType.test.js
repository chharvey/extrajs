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
	// floats
	test(`${xjs.Number.assertType( 42.24, 'float')     }`, 'true'),
	test(`${xjs.Number.assertType(-42.24, 'float')     }`, 'true'),
	test(`${xjs.Number.assertType( 42   , 'float').name}`, 'RangeError'),
	test(`${xjs.Number.assertType(-42   , 'float').name}`, 'RangeError'),
	// integers
	test(`${xjs.Number.assertType( 42   , 'integer')     }`, 'true'),
	test(`${xjs.Number.assertType(-42   , 'integer')     }`, 'true'),
	test(`${xjs.Number.assertType( 0    , 'integer')     }`, 'true'),
	test(`${xjs.Number.assertType(-0    , 'integer')     }`, 'true'),
	test(`${xjs.Number.assertType( 24.00, 'integer')     }`, 'true'),
	test(`${xjs.Number.assertType(-24.00, 'integer')     }`, 'true'),
	test(`${xjs.Number.assertType( 42.24, 'integer').name}`, 'RangeError'),
	test(`${xjs.Number.assertType(-42.24, 'integer').name}`, 'RangeError'),
	// naturals
	test(`${xjs.Number.assertType( 42   , 'natural')     }`, 'true'),
	test(`${xjs.Number.assertType( 0    , 'natural')     }`, 'true'),
	test(`${xjs.Number.assertType(-0    , 'natural')     }`, 'true'),
	test(`${xjs.Number.assertType( 24.00, 'natural')     }`, 'true'),
	test(`${xjs.Number.assertType(-42   , 'natural').name}`, 'RangeError'),
	test(`${xjs.Number.assertType(-24.00, 'natural').name}`, 'RangeError'),
	// wholes
	test(`${xjs.Number.assertType( 42   , 'whole')     }`, 'true'),
	test(`${xjs.Number.assertType( 24.00, 'whole')     }`, 'true'),
	test(`${xjs.Number.assertType(-42   , 'whole').name}`, 'RangeError'),
	test(`${xjs.Number.assertType( 0    , 'whole').name}`, 'RangeError'),
	test(`${xjs.Number.assertType(-0    , 'whole').name}`, 'RangeError'),
	test(`${xjs.Number.assertType(-24.00, 'whole').name}`, 'RangeError'),
	// errors
	test((() => { try { return xjs.Number.assertType(NaN     ) } catch (e) { return e.name } })(), 'RangeError'),
	test((() => { try { return xjs.Number.assertType(Infinity) } catch (e) { return e.name } })(), 'RangeError'),
]).then((arr) => true)
