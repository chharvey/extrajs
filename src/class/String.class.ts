import xjs_Object from './Object.class'


/**
 * Additional static members for the native String class.
 *
 * Does not extend the native String class.
 */
export default class xjs_String {
  /**
   * Convert a thing into a string.
   *
   * If the argument is an array, it is joined.
   * If it is an object, `JSON.stringify` is called on it.
   * This method calls `.toString()` on everything else, except `null` and `undefined`,
   * which are converted to the strings `'null'` and `'undefined'` respectively.
   * Useful for JSON objects where the value could be a single string or an array of strings.
   * @param   thing anything to convert
   * @returns a string version of the argument
   */
	static stringify(thing: unknown): string {
		return new Map<string, (arg: any) => string>([
			['object'    , (arg: object)    => JSON.stringify(arg)],
			['array'     , (arg: unknown[]) => arg.join('')],
			['function'  , (arg: Function)  => arg.toString()],
			['string'    , (arg: string)    => arg],
			['number'    , (arg: number)    => arg.toString()],
			['boolean'   , (arg: boolean)   => arg.toString()],
			['null'      , (arg: null)      => `${arg}`],
			['undefined' , (arg: void)      => `${arg}`],
			['default'   , (arg: unknown)   => `${arg}`],
		]).get(xjs_Object.typeOf(thing)) !(thing)
	}


  private constructor() {}
}
