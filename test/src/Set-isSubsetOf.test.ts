import * as xjs from '../../index'
import test from './test'


let x: Set<number> = new Set([3,4])

export default Promise.all([
	test(`${xjs.Set.isSubsetOf(x, new Set([0,1,2,0,3,4]))}`, 'true' ),
	test(`${xjs.Set.isSubsetOf(x, new Set([3,4,5]      ))}`, 'true' ),
	test(`${xjs.Set.isSubsetOf(x, new Set([3,3,4,4]    ))}`, 'true' ),
	test(`${xjs.Set.isSubsetOf(x, new Set([3,4]        ))}`, 'true' ),
	test(`${xjs.Set.isSubsetOf(x, new Set([3,0,1,4]    ))}`, 'true' ),
	test(`${xjs.Set.isSubsetOf(x, new Set([3,0,4,1]    ))}`, 'true' ),
	test(`${xjs.Set.isSubsetOf(x, new Set([3]          ))}`, 'false'),
	test(`${xjs.Set.isSubsetOf(x, new Set([0,1,3,0,2,5]))}`, 'false'),
	test(`${xjs.Set.isSubsetOf(x, new Set([2,4]        ))}`, 'false'),
	test(`${xjs.Set.isSubsetOf(x, new Set([4,3]        ))}`, 'true' ),
	test(`${xjs.Set.isSubsetOf(x, new Set([0]          ))}`, 'false'),
])
