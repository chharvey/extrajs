const xjs = require('../index.js')
const test = require('../lib/test.js')


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
