/**
 * Additional static members for the native Date class.
 *
 * Does not extend the native Date class.
 */
export class xjs_Date {
	/**
	 * The list of full month names in English.
	 */
	public static readonly MONTH_NAMES = [
		'January',
		'February',
		'March',
		'April',
		'May',
		'June',
		'July',
		'August',
		'September',
		'October',
		'November',
		'December',
	];

	/**
	 * The list of full day names in English.
	 */
	public static readonly DAY_NAMES = [
		'Sundary',
		'Monday',
		'Tuesday',
		'Wednesday',
		'Thursday',
		'Friday',
		'Saturday',
	];

	/**
	 * Return whether two dates occur on the same 24-hour day.
	 *
	 * That is, if both dates have the same year, same month, *and* same day (date of the month).
	 * @param   date1 the first date
	 * @param   date2 the second date
	 * @returns does 'YYYY-MM-DD' of `date1` equal 'YYYY-MM-DD' of `date2`?
	 */
	public static sameDate(date1: Date, date2: Date): boolean {
		return date1.toISOString().slice(0, 10) === date2.toISOString().slice(0, 10);
	}

	/**
	 * Return the percentage of the day that has passed at the given time.
	 *
	 * For example:
	 * - `00:00` => 0.00
	 * - `06:00` => 0.25
	 * - `12:00` => 0.50
	 * - `18:00` => 0.75
	 * @param   date a Date object
	 * @returns the proportion
	 */
	public static timeProportion(date: Date): number {
		const millis  =  date.getUTCMilliseconds()       / 1000;
		const seconds = (date.getUTCSeconds() + millis)  / 60;
		const minutes = (date.getUTCMinutes() + seconds) / 60;
		const hours   = (date.getUTCHours  () + minutes) / 24;
		return hours;
	}

	/**
	 * Format a date, using PHP-based formatting options.
	 *
	 * The following options are supported (with examples):
	 * - `'Y-m-d'`     : '2017-08-05'
	 * - `'j M Y'`     : '5 Aug 2017'
	 * - `'d F Y'`     : '05 August 2017'
	 * - `'l, j F, Y'` : 'Friday, 5 August, 2017'
	 * - `'j M'`       : '5 Aug'
	 * - `'M Y'`       : 'Aug 2017'
	 * - `'M j'`       : 'Aug 5'
	 * - `'M j, Y'`    : 'Aug 5, 2017'
	 * - `'F j, Y'`    : 'August 5, 2017'
	 * - `'M'`         : 'Aug'
	 * - `'H:i'`       : '21:33'
	 * - `'g:ia'`      : '9:33pm'
	 * - `'default'`   : '2017-08-06T01:33:00.000Z' ({@link https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Date/toISOString|Date#toISOString})
	 * @see http://php.net/manual/en/function.date.php
	 * @param   date the date to format
	 * @param   format one of the enumerated options listed in the description
	 * @returns a string representing the given date in the given format
	 */
	public static format(date: Date, format: string): string {
		const MONTHS           = xjs_Date.MONTH_NAMES;
		const leadingZero      = (n: number, r: number = 10) => `0${ n.toString(r) }`.slice(-2);
		const defaultFormatter = (d: Date) => d.toISOString();
		return (new Map<string, (date: Date) => string>([
			['Y-m-d',     (d: Date) => `${ d.getUTCFullYear() }-${ leadingZero(d.getUTCMonth() + 1) }-${ leadingZero(d.getUTCDate()) }`],
			['j M Y',     (d: Date) => `${ d.getUTCDate() } ${ MONTHS[d.getUTCMonth()].slice(0, 3) } ${ d.getUTCFullYear() }`],
			['d F Y',     (d: Date) => `${ leadingZero(d.getUTCDate()) } ${ MONTHS[d.getUTCMonth()] } ${ d.getUTCFullYear() }`],
			['l, j F, Y', (d: Date) => `${ xjs_Date.DAY_NAMES[d.getUTCDay()] }, ${ d.getUTCDate() } ${ MONTHS[d.getUTCMonth()] }, ${ d.getUTCFullYear() }`],
			['j M',       (d: Date) => `${ d.getUTCDate() } ${ MONTHS[d.getUTCMonth()].slice(0, 3) }`],
			['M Y',       (d: Date) => `${ MONTHS[d.getUTCMonth()].slice(0, 3) } ${ d.getUTCFullYear() }`],
			['M j',       (d: Date) => `${ MONTHS[d.getUTCMonth()].slice(0, 3) } ${ d.getUTCDate() }`],
			['M j, Y',    (d: Date) => `${ MONTHS[d.getUTCMonth()].slice(0, 3) } ${ d.getUTCDate() }, ${ d.getUTCFullYear() }`],
			['F j, Y',    (d: Date) => `${ MONTHS[d.getUTCMonth()] } ${ d.getUTCDate() }, ${ d.getUTCFullYear() }`],
			['M',         (d: Date) => `${ MONTHS[d.getUTCMonth()].slice(0, 3) }`],
			['H:i',       (d: Date) => `${ (d.getUTCHours() < 10) ? '0' : '' }${ d.getUTCHours() }:${ (d.getUTCMinutes() < 10) ? '0' : '' }${ d.getUTCMinutes() }`],
			['g:ia',      (d: Date) => `${ (d.getUTCHours() - 1) % 12 + 1 }:${ (d.getUTCMinutes() < 10) ? '0' : '' }${ d.getUTCMinutes() }${ (d.getUTCHours() < 12) ? 'am' : 'pm' }`],
			['default',   defaultFormatter],
		]).get(format || 'default') || defaultFormatter)(date);
	}


	// eslint-disable-next-line @typescript-eslint/no-empty-function --- we want the constructor to be private
	private constructor() {}
}
