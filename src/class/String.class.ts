import {xjs_Object} from './Object.class.js';



/**
 * A template literal ‘tag’.
 * @example
 * ```
 * declare const tag: TemplateTag;
 * declare const template: unknown;
 * tag`This is a ${ template } literal.`;
 * ```
 * @typeparam Return  the return type of the function
 * @typeparam Interps the types of interpolations arguments
 * @param strings        the string literals in the template literal
 * @param interpolations the interpolated expressions in the template literal
 * @returns implementation-defined
 */
export type TemplateTag<Return, Interps extends unknown[] = unknown[]> =
	(strings: TemplateStringsArray, ...interpolations: Interps) => Return;



/**
 * Additional static members for the native String class.
 *
 * Does not extend the native String class.
 */
export class xjs_String {
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
	public static stringify(thing: unknown): string {
		return new Map<string, (arg: unknown) => string>([
			['object',    (arg) => JSON.stringify(arg as object)],
			['array',     (arg) => (arg as unknown[]).join('')],
			['function',  (arg) => (arg as Function).toString()], // eslint-disable-line @typescript-eslint/ban-types
			['string',    (arg) => arg as string],
			['number',    (arg) => (arg as number).toString()],
			['boolean',   (arg) => (arg as boolean).toString()],
			['null',      (arg) => `${ arg as null }`],
			['undefined', (arg) => `${ arg as void }`],
			['default',   (arg) => `${ arg }`],
		]).get(xjs_Object.typeOf(thing))!(thing);
	}

	/**
	 * Dedent a template literal with an auto-determined number of tabs.
	 * Remove up to `n` number of tabs from the beginning of each *literal* line in the template literal.
	 * Does not affect interpolated expressions.
	 * `n` is determined by the number of tabs following the first line break in the literal.
	 * If there are no line breaks, `0` is assumed.
	 * @example
	 * assert.strictEqual(dedent`
	 * 			this will be
	 * 	dedented by
	 * 		up to
	 * 				3 tabs
	 * `, `
	 * this will be
	 * dedented by
	 * up to
	 * 	3 tabs
	 * `);
	 * @returns a string with each line dedented by the determined number of tabs
	 */
	public static dedent(strings: TemplateStringsArray, ...interps: unknown[]): string {
		const matched: RegExpMatchArray | null = strings[0].match(/\n\t*/);
		const num: number = matched && matched[0] ? matched[0].slice(1).length : 0;
		function replace(s: string, n: number): string {
			return (n <= 0) ? s : s.replace(new RegExp(`\\n\\t{0,${ Math.floor(n) }}`, 'g'), '\n');
		}
		return [
			...interps.flatMap((interp, i) => [replace(strings[i], num), interp]),
			replace(strings[strings.length - 1], num), // strings.lastItem
		].join('');
	}


	private constructor() {}
}
