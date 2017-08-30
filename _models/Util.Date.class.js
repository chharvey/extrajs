module.exports = class DATE {
  /**
   * List of full month names in English.
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
   * Date formatting functions.
   *
   * Readable examples:
   * ```
   * FORMATS['Y-m-d'    ](new Date()) // returns '2017-08-05'
   * FORMATS['j M Y'    ](new Date()) // returns '5 Aug 2017'
   * FORMATS['d F Y'    ](new Date()) // returns '05 August 2017'
   * FORMATS['l, j F, Y'](new Date()) // returns 'Friday, 5 August, 2017'
   * FORMATS['j M'      ](new Date()) // returns '5 Aug'
   * FORMATS['M Y'      ](new Date()) // returns 'Aug 2017'
   * FORMATS['M j'      ](new Date()) // returns 'Aug 5'
   * FORMATS['M j, Y'   ](new Date()) // returns 'Aug 5, 2017'
   * FORMATS['M'        ](new Date()) // returns 'Aug'
   * FORMATS['H:i'      ](new Date()) // returns '21:33'
   * FORMATS['g:ia'     ](new Date()) // returns '9:33pm'
   * ```
   * @type {Object<function(Date):string>}
   */
  static get FORMATS() {
    const MONTHS = DATE.MONTH_NAMES
    /**
     * Convert a positive number to a string, adding a leading zero if and only if it is less than 10.
     * @param  {number} n any positive number
     * @return {string} that number as a string, possibly prepended with '0'
     */
    function leadingZero(n) { return `${(n < 10) ? '0' : ''}${n}` }
    return {
      'Y-m-d'    : (date) => `${date.getFullYear()}-${leadingZero(date.getUTCMonth()+1)}-${leadingZero(date.getUTCDate())}`,
      'j M Y'    : (date) => `${date.getUTCDate()} ${MONTHS[date.getUTCMonth()].slice(0,3)} ${date.getFullYear()}`,
      'd F Y'    : (date) => `${leadingZero(date.getUTCDate())} ${MONTHS[date.getUTCMonth()]} ${date.getFullYear()}`,
      'l, j F, Y': (date) => `${DATE.DAY_NAMES[date.getUTCDay()]}, ${date.getUTCDate()} ${MONTHS[date.getUTCMonth()]}, ${date.getFullYear()}`,
      'j M'      : (date) => `${date.getUTCDate()} ${MONTHS[date.getUTCMonth()].slice(0,3)}`,
      'M Y'      : (date) => `${MONTHS[date.getUTCMonth()].slice(0,3)} ${date.getFullYear()}`,
      'M j'      : (date) => `${MONTHS[date.getUTCMonth()].slice(0,3)} ${date.getUTCDate()}`,
      'M j, Y'   : (date) => `${MONTHS[date.getUTCMonth()].slice(0,3)} ${date.getUTCDate()}, ${date.getFullYear()}`,
      'M'        : (date) => `${MONTHS[date.getUTCMonth()].slice(0,3)}`,
      'H:i'      : (date) => `${(date.getHours() < 10) ? '0' : ''}${date.getHours()}:${(date.getMinutes() < 10) ? '0' : ''}${date.getMinutes()}`,
      'g:ia'     : (date) => `${(date.getHours() - 1)%12 + 1}:${(date.getMinutes() < 10) ? '0' : ''}${date.getMinutes()}${(date.getHours() < 12) ? 'am' : 'pm'}`,
    }
  }
}
