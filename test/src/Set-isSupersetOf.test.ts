import * as xjs from '../../index'
import test from './test'


let x: Set<number> = new Set([0,1,2,0,3,4])

export default Promise.all([
	test(`${xjs.Set.isSupersetOf(x, new Set([3,4]          ))}`, 'true' ),
	test(`${xjs.Set.isSupersetOf(x, new Set([0,1,2]        ))}`, 'true' ),
	test(`${xjs.Set.isSupersetOf(x, new Set([0,1,2,0,3,4]  ))}`, 'true' ),
	test(`${xjs.Set.isSupersetOf(x, new Set([0,3,4]        ))}`, 'true' ),
	test(`${xjs.Set.isSupersetOf(x, new Set([1]            ))}`, 'true' ),
	test(`${xjs.Set.isSupersetOf(x, new Set([]             ))}`, 'true' ),
	test(`${xjs.Set.isSupersetOf(x, new Set([2,4]          ))}`, 'true' ),
	test(`${xjs.Set.isSupersetOf(x, new Set([2,5]          ))}`, 'false'),
	test(`${xjs.Set.isSupersetOf(x, new Set([4,0]          ))}`, 'true' ),
	test(`${xjs.Set.isSupersetOf(x, new Set([4,3]          ))}`, 'true' ),
	test(`${xjs.Set.isSupersetOf(x, new Set([0,1,2,0,3,4,5]))}`, 'false'),
])
