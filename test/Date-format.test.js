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
	test(xjs.Date.format(new Date('1970-01-01T00:00:00Z'), 'Y-m-d'    ), '1970-01-01'),
	test(xjs.Date.format(new Date('1970-01-01T00:00:00Z'), 'j M Y'    ), '1 Jan 1970'),
	test(xjs.Date.format(new Date('1970-01-01T00:00:00Z'), 'd F Y'    ), '01 January 1970'),
	test(xjs.Date.format(new Date('1970-01-01T00:00:00Z'), 'l, j F, Y'), 'Thursday, 1 January, 1970'),
	test(xjs.Date.format(new Date('1970-01-01T00:00:00Z'), 'j M'      ), '1 Jan'),
	test(xjs.Date.format(new Date('1970-01-01T00:00:00Z'), 'M Y'      ), 'Jan 1970'),
	test(xjs.Date.format(new Date('1970-01-01T00:00:00Z'), 'M j'      ), 'Jan 1'),
	test(xjs.Date.format(new Date('1970-01-01T00:00:00Z'), 'M j, Y'   ), 'Jan 1, 1970'),
	test(xjs.Date.format(new Date('1970-01-01T00:00:00Z'), 'F j, Y'   ), 'January 1, 1970'),
	test(xjs.Date.format(new Date('1970-01-01T00:00:00Z'), 'M'        ), 'Jan'),
	test(xjs.Date.format(new Date('1970-01-01T00:00:00Z'), 'H:i'      ), '00:00'),
	test(xjs.Date.format(new Date('1970-01-01T00:00:00Z'), 'g:ia'     ), '0:00am'),
	test(xjs.Date.format(new Date('1970-01-01T00:00:00Z'), 'default'  ), '1970-01-01T00:00:00.000Z'),
]).then((arr) => true)
