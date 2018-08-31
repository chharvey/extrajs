console.warn(`
  (${__filename})
  WARNING: \`Mapp.class\` is OBSOLETE!
  This class will be removed on Version 0.14+.
`)

/**
 * `Mapp` is a slightly different implementation of the ES6 `Map` class.
 * It encapsulates an array of variable length, whose elements are each
 * arrays of length two.
 * Each two-entry array represents a "key-value" pair, where
 * the first entry is the "key", and the second entry is the "value".
 *
 * The "key" may be any primitive type EXCEPT `null`, `undefined`, or `NaN`,
 * or it may be any object. (This is different from ES6 `Map` but is much easier to code.)
 * On the other hand, the "value" may be any type whatsoever, even `null`, `undefined`, or `NaN`.
 * NOTE: it is advised not to use `undefined` as values, due to implementations of methods.
 *
 * Mapps contain elements with unique keys.
 * No two elements may have the same "key", in the sense of strict equality (`===`).
 * Alternatively, if strict equality is not desired, keys may be compared via some
 * provided comparator function (which may be specified as `Object.is`).
 * (If a comparator function is not provided, strict equality is used.)
 * The comparator function is used only to compare keys, not values.
 * Examples follow.
 *
 * 1. If a mapp contains `[0, 'hello']`, then it may not also contain `[0, 'world']`,
 *    because `0 === 0`. However, it may contain both `['hello', 0]` and `['world', 0]`,
 *    because 'hello' !== 'world'.
 * 2. If `Object.is` is provided as a comparator, then a mapp may contain
 *    both `[0, 'hello']` and `[-0, 'world']`, because `Object.is(0,-0)` is false.
 * 3. If the comparator `function compare(a,b) { return a.length===b.length && a[0]===b[0] }`
 *    is provided, then a Mapp object may not contain both `[['hello'], 'world']` and `[['hello'], 'today']`,
 *    because `compare(['hello'],['hello'])` is true.
 *    (However, this is a bad comparator function, since for example
 *    `compare('hello', 'haiku')` and `compare(12, 42)` are true.)
 *
 * @see https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Map
 * @see https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array
 * @module
 */
module.exports = class Mapp {
  /**
   * Construct a new Mapp object.
   * @param {function(*,*):boolean=} equalityComparator an optional comparator function, comparing keys in this Mapp object
   */
  constructor(equalityComparator = ((a,b) => a===b)) {
    /** @private @final */ this._IS = equalityComparator
    /** @private */ this._entries = []
  }

  /**
   * Return whether the provided key is valid for entry or deletion.
   * @private
   * @param  {*} key the key to test
   * @return {boolean} `true` if the key can be successfully added or deleted from this map
   */
  static _isValidKey(key) {
    return ['null', 'NaN', 'undefined'].includes(Util.Object.typeof(key))
  }

  /**
   * Return a specified element of this Mapp.
   * This method returns `undefined` if the given key can’t be found;
   * otherwise, it returns an array of length 2.
   * @private
   * @param  {*} key the key of the element to return; must not be `null`, `NaN`, nor `undefined`
   * @return {*} element with the with the specified key, or `undefined` if the key cannot be found
   */
  _getEntry(key) {
    if (Mapp._isValidKey(key)) throw new TypeError('Argument must not be `null`, `NaN`, nor `undefined`.')
    return this._entries.find((item) => this._IS(item[0],key)) || null
  }

  /**
   * The size of (number of elements in) this mapp.
   * @return {number} the number of elements in this mapp
   */
  get size() {
    return this._entries.length
  }

  /**
   * Add a new element to this Mapp.
   * If an element with the specified key already exists, then it will be overridden.
   * If not, the new element will be added to this Mapp.
   * @param  {*} key   the name of the element; must not be `null`, `NaN`, nor `undefined`
   * @param  {*} value the description of the element; may be of any type (`undefined` not recommended)
   * @return {Mapp} this Mapp object
   */
  set(key, value) {
    if (this.has(key)) {
      this._getEntry(key)[1] = value
    } else {
      this._entries.push([key, value])
    }
    return this
  }

  /**
   * Return a specified value of this mapp.
   * NOTE: WARNING: This method will return `undefined` in two cases: if the given key can’t be found,
   * or if `undefined` is the actual value of the key given. Thus it is advised never to use `undefined`
   * as values in a Mapp object. However, the result of {@link Mapp#has()|`this.has(key)`} will make the case clear.
   * @param  {*} key the key whose value return; must not be `null`, `NaN`, nor `undefined`
   * @return {*} value associated with the specified key, or `undefined` if the key cannot be found
   */
  get(key) {
    if (this.has(key)) {
      return this._getEntry(key)[1]
    } else return;
  }

  /**
   * Return whether a value has been associated to the specified key.
   * @param  {*} key the key of the element to test for presence
   * @return {boolean} true if an element with the specified key exists; else false
   */
  has(key) {
    return !!this._getEntry(key)
  }

  /**
   * Find the first key that satisfies the condition provided, and return it.
   * Here, "first" is defined in order of {@link Mapp#set()} calls in your program.
   * Once the key is "found", you may pass it to {@link Mapp#has()}, {@link Mapp#get()}, etc.
   * Example:
   * ```js
   * my_map.find((key) => typeof key === 'object') // returns the first key that is an object
   * ```
   * @param  {function(?):boolean} fn condition to test for each key in this map
   * @return {?*} the first key that passes the test, else `null`
   */
  find(fn) {
    let result = this._entries.find((item) => fn.call(null, item[0]))
    return (result) ? result[0] : null
  }

  /**
   * Remove the specified element.
   * @param  {object} key the key of the element to remove
   * @return {Mapp} this Mapp object
   */
  delete(key) {
    if (Mapp._isValidKey(key)) throw new TypeError('Argument must not be `null`, `NaN`, nor `undefined`')
    this._entries.forEach(function (item, index) {
      if (this._IS(item[0],key)) this._entries.splice(index, 1)
    }, this)
    return this
  }

  /**
   * Remove all elements.
   * @return {Mapp} this Mapp object
   */
  clear() {
    this._entries.splice(0, this._entries.length)
    return this
  }

  /**
   * Return an array containing all keys in this mapp.
   * @return {Array} an array that contains all keys in this Mapp
   */
  keys() {
    return this._entries.map((item) => item[0])
  }

  /**
   * Return an array containing all values in this mapp.
   * @return {Array} an array that contains all values in this Mapp
   */
  values() {
    return this._entries.map((item) => item[1])
  }

  /**
   * Sort the elements in this mapp and put them into an array.
   *
   * The returned array contains this mapp’s elements, each being a two-length array
   * representing the key-value pair.
   * The returned result will not affect this mapp’s original data.
   * (That is, mutating the returned result will not change this mapp.)
   *
   * The elements are sorted by the provided comparator function.
   * The function signature is identical to that required by `Array#sort()`;
   * see the example below:
   *
   * ```js
   * function compare(a, b) {
   *   if (a is less than b by some ordering criterion) return -42
   *   if (a is greater than b by the ordering criterion) return 6.28
   *   return 0 // a must be "equal" to b per the criterion
   * }
   * ```
   *
   * @param  {function(*,*):number} comparator defines the sort order
   * @return {Array<Array>} an array of the elements of this mapp
   */
  sort(comparator) {
    throw new Error('Feature not yet supported.')
  }

  // NOTE this method does not protect the elements of this mapp.
  // /**
  //  * Returns a copy of the entries in this Mapp.
  //  * The ES6 `Map.prototype.entries()` method is a bit more complicated.
  //  * @return {Mapp} this
  //  */
  // entries() {
  //   return this._entries.slice()
  // }
}
