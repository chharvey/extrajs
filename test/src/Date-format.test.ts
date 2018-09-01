const xjs = require('../index.js')
const test = require('../lib/test.js')


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
	test((() => console.log(`Expected warning: "Key 'invalid-format' cannot be found. Using key 'default'…"`) ||
		xjs.Date.format(new Date('1970-01-01T00:00:00Z'), 'invalid-format')
	)(), '1970-01-01T00:00:00.000Z'),
]).then((arr) => true)
