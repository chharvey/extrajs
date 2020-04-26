import * as assert from 'assert'
import xjs_Object from '../src/class/Object.class'

describe('xjs.Object', () => {
	describe('.sameValueZero(unknown, unknown): boolean', () => {
		it('checks same-value-zeroness on arguments.', () => {
			assert.ok(xjs_Object.sameValueZero( void 0  , void 1  ), 'undefined should be SVZ to undefined')
			assert.ok(xjs_Object.sameValueZero( null    , null    ), 'null should be SVZ to null')
			assert.ok(xjs_Object.sameValueZero( false   , false   ), 'false should be SVZ to false')
			assert.ok(xjs_Object.sameValueZero( true    , true    ), 'true should be SVZ to true')
			assert.ok(xjs_Object.sameValueZero( NaN     , NaN     ), 'NaN should be SVZ to NaN')
			assert.ok(xjs_Object.sameValueZero( 0       , -0      ), '0 should be SVZ to -0')
			assert.ok(xjs_Object.sameValueZero( 0.123   , 0.123   ), 'equal numbers should be SVZ')
			assert.ok(xjs_Object.sameValueZero( 123n    , 123n    ), 'equal bigints should be SVZ')
			assert.ok(xjs_Object.sameValueZero( 'z.abc' , 'z.abc' ), 'equal strings should be SVZ')
			;[void 0, null, false, true, NaN, 0, 0.123, 123n, 'z.abc'].forEach((vi, i, arr) => {
				;[...arr.slice(0, i), ...arr.slice(i + 1)].forEach((vj) => {
					assert.ok(!xjs_Object.sameValueZero(vi, vj), `primitive values should only be SVZ if they are equal: ${vi}, ${vj}`)
				})
			})
			const a: object = {}
			const b: [] = []
			assert.ok(xjs_Object.sameValueZero(a, a), 'a reference to an object should be SVZ to itself')
			assert.ok(xjs_Object.sameValueZero(b, b), 'a reference to an array should be SVZ to itself')
			assert.ok(!xjs_Object.sameValueZero({}, {}), 'different references to objects should not be SVZ even when containing same properties')
			assert.ok(!xjs_Object.sameValueZero([], []), 'different references to arrays should not be SVZ even when containing same properties')
		})
	})

	describe('.is<T>(T, T, ((any, any) => boolean)?): boolean', () => {
		it('only checks one level of depth.', () => {
			type T = {val: string[]}|string[]|number
			const x: {[s: string]: T} = { a: 1, b: ['1'], c: { val: ['one'] } }
			const y: {[s: string]: T} = { a: 1, b: ['1'], c: { val: ['one'] } }
			assert.strictEqual(xjs_Object.is(x, y), false)
			assert.strictEqual(xjs_Object.is(x, y, (x_a: unknown, y_a: unknown) => (assert.deepStrictEqual(x_a, y_a), true)), true)
			assert.strictEqual(xjs_Object.is(x, y, (x_a: T      , y_a: T      ) => (assert.deepStrictEqual(x_a, y_a), true)), true)
		})
	})

	describe('.typeOf(unknown): string', () => {
		it('returns a more refined result than `typeof` operator.', () => {
			assert.strictEqual(xjs_Object.typeOf(null)                                                       , 'null'     )
			assert.strictEqual(xjs_Object.typeOf([])                                                         , 'array'    )
			assert.strictEqual(xjs_Object.typeOf([false, 0, NaN, '', null, true, Infinity, 'true', {}, [] ]) , 'array'    )
			assert.strictEqual(xjs_Object.typeOf(NaN)                                                        , 'NaN'      )
			assert.strictEqual(xjs_Object.typeOf(Infinity)                                                   , 'infinite' )
			assert.strictEqual(xjs_Object.typeOf(-42 / 0)                                                    , 'infinite' )
			assert.strictEqual(xjs_Object.typeOf(42)                                                         , 'number'   )
			assert.strictEqual(xjs_Object.typeOf(21 + 21)                                                    , 'number'   )
			assert.strictEqual(xjs_Object.typeOf(true)                                                       , 'boolean'  )
			assert.strictEqual(xjs_Object.typeOf('true')                                                     , 'string'   )
			assert.strictEqual(xjs_Object.typeOf(class { constructor() {} })                                 , 'function' )
			assert.strictEqual(xjs_Object.typeOf(function () { return 'true' })                              , 'function' )
			assert.strictEqual(xjs_Object.typeOf(() => 'true')                                               , 'function' )
			assert.strictEqual(xjs_Object.typeOf(undefined)                                                  , 'undefined')
			assert.strictEqual(xjs_Object.typeOf((() => { let x; return x; })())                             , 'undefined')
		})
	})

	describe('.freezeDeep<T>(Readonly<T>): Readonly<T>', () => {
		it('freezes an object and its properties, recursively.', () => {
			const x: any = {first: 1, second: {value: 2}, third: [1, '2', {val: 3}]}
			xjs_Object.freezeDeep(x);
			assert.throws(() => { x.fourth = {v: ['4']}    }, TypeError)
			assert.throws(() => { x.third.push(['4'])      }, TypeError)
			assert.throws(() => { x.third[2].val = 'three' }, TypeError)
		})
		it('returns the same argument.', () => {
			const x = {first: 1, second: {value: 2}, third: [1, '2', {val: 3}]}
			const y = xjs_Object.freezeDeep(x)
			assert.strictEqual(x, y)
		})
	})

	describe('.cloneDeep<T>(T): T', () => {
		it('returns a cloned object.', () => {
			const x = {first: 1, second: {value: 2}, third: [1, '2', {val: 3}]}
			const y = xjs_Object.cloneDeep(x)
			assert.notStrictEqual(x, y)
			assert.deepStrictEqual(x, y)
		})
	})
})
