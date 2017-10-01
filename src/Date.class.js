const xjs = {}

/**
 * Additional static members for the native Date class.
 * Does not extend the native Date class.
 * @namespace
 */
xjs.Date = class {
  /** @private */ constructor() {}

  /**
   * List of full month names in English.
   * @stability LOCKED
   * @type {Array<string>}
   */
  static get MONTH_NAMES() {
    return [
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
    ]
  }

  /**
   * List of full day names in English.
   * @stability LOCKED
   * @type {Array<string>}
   */
  static get DAY_NAMES() {
    return [
      'Sundary',
      'Monday',
      'Tuesday',
      'Wednesday',
      'Thursday',
      'Friday',
      'Saturday',
    ]
  }

  /**
   * Return whether two dates occur on the same day.
   * That is, if 'YYYY-MM-DD' of date1 equals 'YYYY-MM-DD' of date2.
   * @stability STABLE
   * @param  {Date} date1 the first date
   * @param  {Date} date2 the second date
   * @return {boolean} `true` iff both dates have the same year, same month, *and* same day (date of the month)
   */
  static sameDate(date1, date2) {
    return date1.toISOString().slice(0,10) === date2.toISOString().slice(0,10)
  }

  /**
   * Format a date, using PHP-based formatting options.
   * The following options are supported (with examples):
   * - 'Y-m-d'     : '2017-08-05'
   * - 'j M Y'     : '5 Aug 2017'
   * - 'd F Y'     : '05 August 2017'
   * - 'l, j F, Y' : 'Friday, 5 August, 2017'
   * - 'j M'       : '5 Aug'
   * - 'M Y'       : 'Aug 2017'
   * - 'M j'       : 'Aug 5'
   * - 'M j, Y'    : 'Aug 5, 2017'
   * - 'M'         : 'Aug'
   * - 'H:i'       : '21:33'
   * - 'g:ia'      : '9:33pm'
   * - 'default'   : '2017-08-06T01:33:00.000Z' ({@link Date#toISOString})
   * @stability STABLE
   * @see http://php.net/manual/en/function.date.php
   * @param  {Date} date the date to format
   * @param  {string} format one of the enumerated options listed in the description
   * @return {string} a string representing the given date in the given format
   */
  static format(date, format) {
    const MONTHS = xjs.Date.MONTH_NAMES
    /**
     * Convert a positive number to a string, adding a leading zero if and only if it is less than 10.
     * @param  {number} n any positive number
     * @return {string} that number as a string, possibly prepended with '0'
     */
    function leadingZero(n) { return `${(n < 10) ? '0' : ''}${n}` }
    let returned = {
      'Y-m-d'    : (date) => `${date.getFullYear()}-${leadingZero(date.getUTCMonth()+1)}-${leadingZero(date.getUTCDate())}`,
      'j M Y'    : (date) => `${date.getUTCDate()} ${MONTHS[date.getUTCMonth()].slice(0,3)} ${date.getFullYear()}`,
      'd F Y'    : (date) => `${leadingZero(date.getUTCDate())} ${MONTHS[date.getUTCMonth()]} ${date.getFullYear()}`,
      'l, j F, Y': (date) => `${xjs.Date.DAY_NAMES[date.getUTCDay()]}, ${date.getUTCDate()} ${MONTHS[date.getUTCMonth()]}, ${date.getFullYear()}`,
      'j M'      : (date) => `${date.getUTCDate()} ${MONTHS[date.getUTCMonth()].slice(0,3)}`,
      'M Y'      : (date) => `${MONTHS[date.getUTCMonth()].slice(0,3)} ${date.getFullYear()}`,
      'M j'      : (date) => `${MONTHS[date.getUTCMonth()].slice(0,3)} ${date.getUTCDate()}`,
      'M j, Y'   : (date) => `${MONTHS[date.getUTCMonth()].slice(0,3)} ${date.getUTCDate()}, ${date.getFullYear()}`,
      'M'        : (date) => `${MONTHS[date.getUTCMonth()].slice(0,3)}`,
      'H:i'      : (date) => `${(date.getHours() < 10) ? '0' : ''}${date.getHours()}:${(date.getMinutes() < 10) ? '0' : ''}${date.getMinutes()}`,
      'g:ia'     : (date) => `${(date.getHours() - 1)%12 + 1}:${(date.getMinutes() < 10) ? '0' : ''}${date.getMinutes()}${(date.getHours() < 12) ? 'am' : 'pm'}`,
      default    : (date) => date.toISOString(),
    }
    return (returned[format] || returned.default).call(null, date)
  }
}

module.exports = xjs.Date
