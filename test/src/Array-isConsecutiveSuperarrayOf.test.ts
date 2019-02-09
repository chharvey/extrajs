import * as xjs from '../../index'
import test from './test'


let x: number[] = [0,1,2,0,3,4]

export default Promise.all([
	test(`${xjs.Array.isConsecutiveSuperarrayOf(x, [3,4]          )}`, 'true' ),
	test(`${xjs.Array.isConsecutiveSuperarrayOf(x, [0,1,2]        )}`, 'true' ),
	test(`${xjs.Array.isConsecutiveSuperarrayOf(x, [0,1,2,0,3,4]  )}`, 'true' ),
	test(`${xjs.Array.isConsecutiveSuperarrayOf(x, [0,3,4]        )}`, 'true' ),
	test(`${xjs.Array.isConsecutiveSuperarrayOf(x, [1]            )}`, 'true' ),
	test(`${xjs.Array.isConsecutiveSuperarrayOf(x, []             )}`, 'true' ),
	test(`${xjs.Array.isConsecutiveSuperarrayOf(x, [2,4]          )}`, 'false'),
	test(`${xjs.Array.isConsecutiveSuperarrayOf(x, [2,5]          )}`, 'false'),
	test(`${xjs.Array.isConsecutiveSuperarrayOf(x, [4,0]          )}`, 'false'),
	test(`${xjs.Array.isConsecutiveSuperarrayOf(x, [4,3]          )}`, 'false'),
	test(`${xjs.Array.isConsecutiveSuperarrayOf(x, [0,1,2,0,3,4,5])}`, 'false'),
])
