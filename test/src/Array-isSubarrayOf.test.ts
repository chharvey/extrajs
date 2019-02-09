import * as xjs from '../../index'
import test from './test'


let x: number[] = [3,4]

export default Promise.all([
	test(`${xjs.Array.isSubarrayOf(x, [0,1,2,0,3,4])}`, 'true' ),
	test(`${xjs.Array.isSubarrayOf(x, [3,4,5]      )}`, 'true' ),
	test(`${xjs.Array.isSubarrayOf(x, [3,3,4,4]    )}`, 'true' ),
	test(`${xjs.Array.isSubarrayOf(x, [3,4]        )}`, 'true' ),
	test(`${xjs.Array.isSubarrayOf(x, [3,0,1,4]    )}`, 'true' ),
	test(`${xjs.Array.isSubarrayOf(x, [3,0,4,1]    )}`, 'true' ),
	test(`${xjs.Array.isSubarrayOf(x, [3]          )}`, 'false'),
	test(`${xjs.Array.isSubarrayOf(x, [0,1,3,0,2,5])}`, 'false'),
	test(`${xjs.Array.isSubarrayOf(x, [2,4]        )}`, 'false'),
	test(`${xjs.Array.isSubarrayOf(x, [4,3]        )}`, 'false'),
	test(`${xjs.Array.isSubarrayOf(x, [0]          )}`, 'false'),
])
