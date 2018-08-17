import xjs_Object from './Object.class'


/**
 * @summary Additional static members for the native String class.
 * @description Does not extend the native String class.
 */
export default class xjs_String {
  /**
   * @summary Convert a thing into a string.
   * @description If the argument is an array, it is joined.
   * If it is an object, `JSON.stringify` is called on it.
   * This method calls `.toString()` on everything else, except `null` and `undefined`,
   * which are converted to the strings `'null'` and `'undefined'` respectively.
   * Useful for JSON objects where the value could be a single string or an array of strings.
   * @param   thing anything to convert
   * @returns a string version of the argument
   */
  static stringify(thing: unknown): string {
    const switch_: { [index: string]: (arg: unknown) => string } = {
      'array'    : (arg) => (arg as unknown[]).join(''),
      'object'   : (arg) => JSON.stringify(arg),
      'string'   : (arg) => arg as string,
      'null'     : (arg) => 'null',
      'undefined': (arg) => 'undefined',
      default(arg) { return (arg as any).toString() },
    }
    return (switch_[xjs_Object.typeOf(thing)] || switch_.default)(thing)
  }


  private constructor() {}
}
