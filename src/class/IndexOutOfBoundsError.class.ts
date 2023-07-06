import {xjs_Number} from './Number.class.js';

/**
 * An error that is thrown when trying to access an object’s member
 * with an index that has not been set or is outside the domain of the object.
 */
export class IndexOutOfBoundsError extends RangeError {
	/**
	 * Construct a new IndexOutOfBoundsError object.
	 * @param message Optional. A human-readable description of the error.
	 */
	constructor(message?: string);
	/**
	 * Construct a new IndexOutOfBoundsError object.
	 * @param index the index that is out of bounds
	 */
	constructor(index: number);
	constructor(i: string | number = 'Index out of bounds.') {
		super((typeof i === 'string') ? i : `Index \`${ (xjs_Number.assertType(i), i) }\` out of bounds.`);
		this.name = 'IndexOutOfBoundsError';
	}
}
