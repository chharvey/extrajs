
/**
 * A type of Error indicating a feature or option is not yet supported.
 */
export default class UnsupportedError extends Error {
	/**
	 * Construct a new UnsupportedError object.
	 * @param message Optional. A human-readable description of the error.
	 * @param args additional arguments to pass
	 */
	constructor(message?: string, ...args: any[]) {
		super(message)
	}
}
