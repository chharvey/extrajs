const xjs = require('../index.js')
const test = require('../lib/test.js')


module.exports = Promise.all([
	test(`${xjs.Math.mod(8, 6)}`, '2'),
	test(`${xjs.Math.mod(-8, 6)}`, '4'),
	test((() => { try { return `${xjs.Math.mod(8, 0)}` } catch (e) { return e.name } })(), 'RangeError'),
	test((() => { try { return `${xjs.Math.mod(8, 0.5)}` } catch (e) { return e.name } })(), 'RangeError'),
]).then((arr) => true)
