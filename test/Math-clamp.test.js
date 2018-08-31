const xjs = require('../index.js')
const test = require('../lib/test.js')


module.exports = Promise.all([
	test(`${xjs.Math.clamp(1, 3, 5)}`, '3'),
	test(`${xjs.Math.clamp(3, 1, 5)}`, '3'),
	test(`${xjs.Math.clamp(1, 5, 3)}`, '3'),
	test(`${xjs.Math.clamp(5, 3, 1)}`, '3'),
]).then((arr) => true)
