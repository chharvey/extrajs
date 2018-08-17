/**
 * @summary Additional static members for the native Date class.
 * @description Does not extend the native Date class.
 */
export default class xjs_Date {
  /**
   * @summary List of full month names in English.
   */
  static readonly MONTH_NAMES = [
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

  /**
   * @summary List of full day names in English.
   */
  static readonly DAY_NAMES = [
      'Sundary',
      'Monday',
      'Tuesday',
      'Wednesday',
      'Thursday',
      'Friday',
      'Saturday',
    ]

  /**
   * @summary Return whether two dates occur on the same day.
   * @description That is, if 'YYYY-MM-DD' of date1 equals 'YYYY-MM-DD' of date2.
   * @param   {Date} date1 the first date
   * @param   {Date} date2 the second date
   * @returns {boolean} `true` iff both dates have the same year, same month, *and* same day (date of the month)
   */
  static sameDate(date1, date2) {
    return date1.toISOString().slice(0,10) === date2.toISOString().slice(0,10)
  }

  /**
   * @summary Return the percentage of the day that has passed at the given time.
   * @description For example:
   * - `00:00` => 0.00
   * - `06:00` => 0.25
   * - `12:00` => 0.50
   * - `18:00` => 0.75
   * @param   {Date} date a Date object
   * @returns {number} the proportion
   */
  static timeProportion(date) {
    let millis  =  date.getUTCMilliseconds()       / 1000
    let seconds = (date.getUTCSeconds() + millis)  / 60
    let minutes = (date.getUTCMinutes() + seconds) / 60
    let hours   = (date.getUTCHours  () + minutes) / 24
    return hours
  }

  /**
   * @summary Format a date, using PHP-based formatting options.
   * @description The following options are supported (with examples):
   * - 'Y-m-d'     : '2017-08-05'
   * - 'j M Y'     : '5 Aug 2017'
   * - 'd F Y'     : '05 August 2017'
   * - 'l, j F, Y' : 'Friday, 5 August, 2017'
   * - 'j M'       : '5 Aug'
   * - 'M Y'       : 'Aug 2017'
   * - 'M j'       : 'Aug 5'
   * - 'M j, Y'    : 'Aug 5, 2017'
   * - 'F j, Y'    : 'August 5, 2017'
   * - 'M'         : 'Aug'
   * - 'H:i'       : '21:33'
   * - 'g:ia'      : '9:33pm'
   * - 'default'   : '2017-08-06T01:33:00.000Z' ({@link Date#toISOString})
   * @see http://php.net/manual/en/function.date.php
   * @param   {Date} date the date to format
   * @param   {string} format one of the enumerated options listed in the description
   * @returns {string} a string representing the given date in the given format
   */
  static format(date, format) {
    const MONTHS = xjs_Date.MONTH_NAMES
    /**
     * Convert a positive number to a string, adding a leading zero if and only if it is less than 10.
     * @param  {number} n any positive number
     * @return {string} that number as a string, possibly prepended with '0'
     */
    function leadingZero(n) { return `${(n < 10) ? '0' : ''}${n}` }
    const returned = {
      'Y-m-d'    : (date) => `${date.getFullYear()}-${leadingZero(date.getUTCMonth()+1)}-${leadingZero(date.getUTCDate())}`,
      'j M Y'    : (date) => `${date.getUTCDate()} ${MONTHS[date.getUTCMonth()].slice(0,3)} ${date.getFullYear()}`,
      'd F Y'    : (date) => `${leadingZero(date.getUTCDate())} ${MONTHS[date.getUTCMonth()]} ${date.getFullYear()}`,
      'l, j F, Y': (date) => `${xjs_Date.DAY_NAMES[date.getUTCDay()]}, ${date.getUTCDate()} ${MONTHS[date.getUTCMonth()]}, ${date.getFullYear()}`,
      'j M'      : (date) => `${date.getUTCDate()} ${MONTHS[date.getUTCMonth()].slice(0,3)}`,
      'M Y'      : (date) => `${MONTHS[date.getUTCMonth()].slice(0,3)} ${date.getFullYear()}`,
      'M j'      : (date) => `${MONTHS[date.getUTCMonth()].slice(0,3)} ${date.getUTCDate()}`,
      'M j, Y'   : (date) => `${MONTHS[date.getUTCMonth()].slice(0,3)} ${date.getUTCDate()}, ${date.getFullYear()}`,
      'F j, Y'   : (date) => `${MONTHS[date.getUTCMonth()]} ${date.getUTCDate()}, ${date.getFullYear()}`,
      'M'        : (date) => `${MONTHS[date.getUTCMonth()].slice(0,3)}`,
      'H:i'      : (date) => `${(date.getUTCHours() < 10) ? '0' : ''}${date.getUTCHours()}:${(date.getUTCMinutes() < 10) ? '0' : ''}${date.getUTCMinutes()}`,
      'g:ia'     : (date) => `${(date.getUTCHours() - 1)%12 + 1}:${(date.getUTCMinutes() < 10) ? '0' : ''}${date.getUTCMinutes()}${(date.getUTCHours() < 12) ? 'am' : 'pm'}`,
      default(date) { return date.toISOString() },
    }
    if (!returned[format]) console.warn(new ReferenceError(`Warning: Date format \`${format}\` not supported.`))
    return (returned[format] || returned.default).call(null, date)
  }


  private constructor() {}
}
