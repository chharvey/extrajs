import * as assert from 'assert';
import {xjs_Object} from '../src/class/Object.class.js';

describe('xjs.Object', () => {
	describe('.is<T>(T, T, ((any, any) => boolean)?): boolean', () => {
		it('only checks one level of depth.', () => {
			type T = {val: string[]} | string[] | number;
			const x: {[s: string]: T} = {a: 1, b: ['1'], c: {val: ['one']}};
			const y: {[s: string]: T} = {a: 1, b: ['1'], c: {val: ['one']}};
			assert.strictEqual(xjs_Object.is(x, y), false);
			assert.strictEqual(xjs_Object.is(x, y, (x_a: unknown, y_a: unknown) => (assert.deepStrictEqual(x_a, y_a), true)), true);
			assert.strictEqual(xjs_Object.is(x, y, (x_a: T,       y_a: T)       => (assert.deepStrictEqual(x_a, y_a), true)), true);
		});
	});

	describe('.typeOf(unknown): string', () => {
		it('returns a more refined result than `typeof` operator.', () => {
			assert.strictEqual(xjs_Object.typeOf(null),                                                      'null');
			assert.strictEqual(xjs_Object.typeOf([]),                                                        'array');
			assert.strictEqual(xjs_Object.typeOf([false, 0, NaN, '', null, true, Infinity, 'true', {}, []]), 'array');
			assert.strictEqual(xjs_Object.typeOf(NaN),                                                       'NaN');
			assert.strictEqual(xjs_Object.typeOf(Infinity),                                                  'infinite');
			assert.strictEqual(xjs_Object.typeOf(-42 / 0),                                                   'infinite');
			assert.strictEqual(xjs_Object.typeOf(42),                                                        'number');
			assert.strictEqual(xjs_Object.typeOf(21 + 21),                                                   'number');
			assert.strictEqual(xjs_Object.typeOf(true),                                                      'boolean');
			assert.strictEqual(xjs_Object.typeOf('true'),                                                    'string');
			assert.strictEqual(xjs_Object.typeOf(class { public constructor() {} }),                         'function'); // eslint-disable-line @typescript-eslint/brace-style
			assert.strictEqual(xjs_Object.typeOf(function () { return 'true'; }),                            'function'); // eslint-disable-line prefer-arrow-callback, @typescript-eslint/brace-style
			assert.strictEqual(xjs_Object.typeOf(() => 'true'),                                              'function');
			assert.strictEqual(xjs_Object.typeOf(undefined),                                                 'undefined');
			assert.strictEqual(xjs_Object.typeOf((() => { let x; return x; })()),                            'undefined'); // eslint-disable-line @typescript-eslint/brace-style
		});
	});

	describe('.freezeDeep<T>(Readonly<T>): Readonly<T>', () => {
		it('freezes an object and its properties, recursively.', () => {
			const x: any = {first: 1, second: {value: 2}, third: [1, '2', {val: 3}]};
			xjs_Object.freezeDeep(x);
			assert.throws(() => {
				x.fourth = {v: ['4']};
			}, TypeError);
			assert.throws(() => {
				x.third.push(['4']);
			}, TypeError);
			assert.throws(() => {
				x.third[2].val = 'three';
			}, TypeError);
		});
		it('returns the same argument.', () => {
			const x = {first: 1, second: {value: 2}, third: [1, '2', {val: 3}]};
			const y = xjs_Object.freezeDeep(x);
			assert.strictEqual(x, y);
		});
	});

	describe('.cloneDeep<T>(T): T', () => {
		it('returns a cloned object.', () => {
			const x = {first: 1, second: {value: 2}, third: [1, '2', {val: 3}]};
			const y = xjs_Object.cloneDeep(x);
			assert.notStrictEqual(x, y);
			assert.deepStrictEqual(x, y);
		});
	});
});
