import * as xjs from '../../index'
import test from './test'


let x: number[] = [0,1,2,0,3,4]

export default Promise.all([
	test(`${xjs.Array.contains(x, [3,4]          )}`, 'true' ),
	test(`${xjs.Array.contains(x, [0,1,2]        )}`, 'true' ),
	test(`${xjs.Array.contains(x, [0,1,2,0,3,4]  )}`, 'true' ),
	test(`${xjs.Array.contains(x, [0,3,4]        )}`, 'true' ),
	test(`${xjs.Array.contains(x, [2,5]          )}`, 'false'),
	test(`${xjs.Array.contains(x, [2,4]          )}`, 'false'),
	test(`${xjs.Array.contains(x, [4,0]          )}`, 'false'),
	test(`${xjs.Array.contains(x, [4,3]          )}`, 'false'),
	test(`${xjs.Array.contains(x, [1]            )}`, 'true' ),
	test((() => { try { return `${xjs.Array.contains(x, [0,1,2,0,3,4,5])}` } catch (e) { return e.name } })(), 'RangeError'),
])
