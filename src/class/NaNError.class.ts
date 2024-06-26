/**
 * An error that is thrown when the global value `NaN` is received as an argument.
 */
export class NaNError extends RangeError {
	/**
	 * Construct a new NaNError object.
	 * @param message Optional. A human-readable description of the error.
	 */
	public constructor(message: string = 'Unacceptable argument `NaN`.') {
		super(message);
		this.name = 'NaNError';
	}
}
