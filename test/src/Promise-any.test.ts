import * as xjs from '../../index'
import test from './test'


export default Promise.all([
	test(xjs.Promise.any([
		Promise.resolve('string1'),
		Promise.resolve('string2'),
	]), 'string1'),
	test(xjs.Promise.any([
		Promise.reject(new Error('an error')),
		Promise.resolve('a string'),
	]), 'a string'),
	test((async () => {
		try {
			await xjs.Promise.any([
				Promise.reject(new Error('error1')),
				Promise.reject(new Error('error2')),
			])
			return 'no error'
		} catch (errs) {
			return (errs as Error[]).map((err) => err.message).join(' && ')
		}
	})(), 'error1 && error2'),
])
