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
	{ actual: xjs.Object.typeOf(null)                                                       , expected: 'null'      },
	{ actual: xjs.Object.typeOf([])                                                         , expected: 'array'     },
	{ actual: xjs.Object.typeOf([false, 0, NaN, '', null, true, Infinity, 'true', {}, [] ]) , expected: 'array'     },
	{ actual: xjs.Object.typeOf(NaN)                                                        , expected: 'NaN'       },
	{ actual: xjs.Object.typeOf(0 * 'true')                                                 , expected: 'NaN'       },
	{ actual: xjs.Object.typeOf(Infinity)                                                   , expected: 'infinite'  },
	{ actual: xjs.Object.typeOf(-42 / 0)                                                    , expected: 'infinite'  },
	{ actual: xjs.Object.typeOf(42)                                                         , expected: 'number'    },
	{ actual: xjs.Object.typeOf(21 + 21)                                                    , expected: 'number'    },
	{ actual: xjs.Object.typeOf(true)                                                       , expected: 'boolean'   },
	{ actual: xjs.Object.typeOf('true')                                                     , expected: 'string'    },
	{ actual: xjs.Object.typeOf(function () { return 'true' })                              , expected: 'function'  },
	{ actual: xjs.Object.typeOf(() => 'true')                                               , expected: 'function'  },
	{ actual: xjs.Object.typeOf()                                                           , expected: 'undefined' },
	{ actual: xjs.Object.typeOf(undefined)                                                  , expected: 'undefined' },
	{ actual: xjs.Object.typeOf((() => { let x; return x; })())                             , expected: 'undefined' },
].map((obj) => test(obj.actual, obj.expected)).reduce((a, b) => a && b)
