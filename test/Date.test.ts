import * as assert from 'assert';
import {xjs_Date} from '../src/class/Date.class.js';

describe('xjs.Date', () => {
	describe('.format(Date, string): string', () => {
		it('formats a date in the given format.', () => {
			assert.strictEqual(xjs_Date.format(new Date('1970-01-01T00:00:00Z'), 'Y-m-d'),          '1970-01-01');
			assert.strictEqual(xjs_Date.format(new Date('1970-01-01T00:00:00Z'), 'j M Y'),          '1 Jan 1970');
			assert.strictEqual(xjs_Date.format(new Date('1970-01-01T00:00:00Z'), 'd F Y'),          '01 January 1970');
			assert.strictEqual(xjs_Date.format(new Date('1970-01-01T00:00:00Z'), 'l, j F, Y'),      'Thursday, 1 January, 1970');
			assert.strictEqual(xjs_Date.format(new Date('1970-01-01T00:00:00Z'), 'j M'),            '1 Jan');
			assert.strictEqual(xjs_Date.format(new Date('1970-01-01T00:00:00Z'), 'M Y'),            'Jan 1970');
			assert.strictEqual(xjs_Date.format(new Date('1970-01-01T00:00:00Z'), 'M j'),            'Jan 1');
			assert.strictEqual(xjs_Date.format(new Date('1970-01-01T00:00:00Z'), 'M j, Y'),         'Jan 1, 1970');
			assert.strictEqual(xjs_Date.format(new Date('1970-01-01T00:00:00Z'), 'F j, Y'),         'January 1, 1970');
			assert.strictEqual(xjs_Date.format(new Date('1970-01-01T00:00:00Z'), 'M'),              'Jan');
			assert.strictEqual(xjs_Date.format(new Date('1970-01-01T00:00:00Z'), 'H:i'),            '00:00');
			assert.strictEqual(xjs_Date.format(new Date('1970-01-01T00:00:00Z'), 'g:ia'),           '0:00am');
			assert.strictEqual(xjs_Date.format(new Date('1970-01-01T00:00:00Z'), 'default'),        '1970-01-01T00:00:00.000Z');
			assert.strictEqual(xjs_Date.format(new Date('1970-01-01T00:00:00Z'), 'invalid-format'), '1970-01-01T00:00:00.000Z');
			assert.strictEqual(xjs_Date.format(new Date('1970-01-01T00:00:00Z'), ''),               '1970-01-01T00:00:00.000Z');
		});
	});
});
