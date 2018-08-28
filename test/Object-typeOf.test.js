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
function test(actual, expected) {
	return assert.strictEqual(actual, expected, `Got '${actual}', but was expecting '${expected}'.`) || true
}

module.exports = [
	test(xjs.Object.typeOf(null)                                                       , 'null'     ),
	test(xjs.Object.typeOf([])                                                         , 'array'    ),
	test(xjs.Object.typeOf([false, 0, NaN, '', null, true, Infinity, 'true', {}, [] ]) , 'array'    ),
	test(xjs.Object.typeOf(NaN)                                                        , 'NaN'      ),
	test(xjs.Object.typeOf(0 * 'true')                                                 , 'NaN'      ),
	test(xjs.Object.typeOf(Infinity)                                                   , 'infinite' ),
	test(xjs.Object.typeOf(-42 / 0)                                                    , 'infinite' ),
	test(xjs.Object.typeOf(42)                                                         , 'number'   ),
	test(xjs.Object.typeOf(21 + 21)                                                    , 'number'   ),
	test(xjs.Object.typeOf(true)                                                       , 'boolean'  ),
	test(xjs.Object.typeOf('true')                                                     , 'string'   ),
	test(xjs.Object.typeOf(function () { return 'true' })                              , 'function' ),
	test(xjs.Object.typeOf(() => 'true')                                               , 'function' ),
	test(xjs.Object.typeOf()                                                           , 'undefined'),
	test(xjs.Object.typeOf(undefined)                                                  , 'undefined'),
	test(xjs.Object.typeOf((() => { let x; return x; })())                             , 'undefined'),
].reduce((a, b) => a && b)
