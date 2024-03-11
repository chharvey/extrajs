
/**
 * An error that is thrown when trying to access items in an empty data structure.
 */
export class EmptyStructureError extends Error {
	/**
	 * Construct a new EmptyStructureError object.
	 * @param message Optional. A human-readable description of the error.
	 */
	public constructor(message: string = 'Empty data struture.') {
		super(message);
		this.name = 'EmptyStructureError';
	}
}
