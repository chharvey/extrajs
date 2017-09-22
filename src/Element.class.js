console.warn(`
  (${__filename})
  WARNING: \`Element.class\` is DEPRECATED!
  It has been moved to another repository. To install, run the following command:
  $ npm install extrajs-element
  This class will be removed on Version 1.0.
`)

var Util = require('./Util.class.js')
var ObjectString = require('./ObjectString.class.js')

/**
 * Represents an HTML element.
 * @module
 */
module.exports = class Element {
  /**
   * Construct a new Element object.
   *
   * By default, the parameter `is_void` is true for “Void Elements” as in
   * the HTML specification (and thus the argument need not be explicilty provided).
   * Otherwise, `is_void` is false by default, unless explicitly specified.
   *
   * @see https://www.w3.org/TR/html/syntax.html#void-elements
   * @param {string} name the immutable name of the tag
   * @param {boolean=} is_void `true` if this element is void (has no closing tag)
   */
  constructor(name, is_void = false) {
    /** @private @final */ this._NAME = name
    /** @private @final */ this._VOID = is_void || [
      'area',
      'base',
      'br',
      'col',
      'embed',
      'hr',
      'img',
      'input',
      'keygen',
      'link',
      'menuitem',
      'meta',
      'param',
      'source',
      'track',
      'wbr',
    ].includes(name)

    /**
     * All the HTML attributes of this element.
     * @private
     * @type {ObjectString}
     */
    this._attributes = new ObjectString()

    /**
     * The contents of this element.
     * If this is a void element, it must have no contents, and its tag must be self-closing.
     * @private
     * @type {?string}
     */
    this._contents = (this._VOID) ? null : ''
  }



  /**
   * Return this element’s name.
   * @return {string} the name of this Element
   */
  get name() { return this._NAME }

  /**
   * Return whether this element is a void element.
   * Void elements have no end tag, and have the
   * **nothing content model** (they must not have any contents).
   * @return {boolean} `true` if this element is void; `false` otherwise
   */
  get isVoid() { return this._VOID }

  /**
   * Return this element’s attributes object.
   * The key-value pairs of the object returned correspond to
   * the attribute-value pairs of this element.
   * @return {Object<string>} an object containing the attribute-value pairs of this element
   */
  get attributes() { return this._attributes.data }

  /**
   * Return the contents of this element.
   * @return {?string} this element’s contents, or `null` if this is a void element
   */
  get contents() { return this._contents }

  /**
   * Return this element’s styles object.
   * The key-value pairs of the object returned correspond to
   * the property-value pairs of this element’s css.
   * @return {Object<string>} an object containing the property-value pairs of this element’s css
   */
  get styles() {
    return ObjectString.fromCssString(this.style() || '').data
  }

  /**
   * Return an object containing all the `[data-*]` attribute-value pairs of this element.
   * Note that the keys of this object do not contain the string `'data-'`.
   * Example:
   * ```js
   * my_elem.html()     // returns '<span data-foo="bar" data-baz="qux" fizz="buzz"></span>'
   * my_elem.attributes // returns { 'data-foo':'bar', 'data-baz':'qux', fizz:'buzz' }
   * my_elem.dataset    // returns { foo:'bar', baz:'qux' }
   * ```
   * @return {Object<string>} an object containing keys and values corresponing to this element’s `[data-*]` custom attributes
   */
  get dataset() {
    let returned = new ObjectString()
    for (let i in this._attributes.data) {
      if (i.slice(0,5) === 'data-') returned.set(i.slice(5), this._attributes.data[i])
    }
    return returned.data
  }



  /**
   * NOTE: TYPE DEFINITION
   * A type to provide as a value argument for setting/removing an attribute.
   * - {string}            - set the attribute to the string value
   * - {number}            - set the attribute to the number converted to a string; may not be `NaN`
   * - {boolean}           - set the attribute to the boolean converted to a string
   * - {function():string} - set the attribute to the result of calling the function on `this`
   * - {null}              - remove the attribute altogether
   * @type {?(string|number|boolean|function():string)} AttrValue
   */
  /**
   * Set or get attributes of this element.
   *
   * If the key given is a string, and the value is a non-null {@link AttrValue} type,
   * then the attribute will be set (or modified) with the result of the value.
   *
   * If the key is a string and the value is `null,`
   * then the attribute identified by the key is removed from this element.
   *
   * If the key is a string and the value is not provided (or `undefined`),
   * then this method returns the value of the attribute identified by the key.
   * If no such attribute exists, `undefined` is returned.
   *
   * If an object key is provided, then no value argument may be provided.
   * The object must have values of the {@link AttrValue} type;
   * thus for each key-value pair in the object, this method assigns corresponding
   * attributes. You may use this method with a single object argument to set and/or remove
   * multiple attributes (using `null` to remove).
   *
   * If no arguments are provided, or if the key is `''`, this method does nothing and returns `this`.
   *
   * Examples:
   * ```
   * my_elem.attr('itemtype', 'HTMLElement')                   // set the `[itemtype]` attribute
   * my_elem.attr('itemscope', '')                             // set the boolean `[itemscope]` attribute
   * my_elem.attr('itemtype')                                  // get the value of the `[itemtype]` attribute (or `undefined` if it had not been set)
   * my_elem.attr('itemprop', null)                            // remove the `[itemprop]` attribute
   * my_elem.attr('data-id', function () { return this.id() }) // set the `[data-id]` attribute to this element’s ID
   * my_elem.attr({                                            // set/remove multiple attributes all at once
   *   itemprop : 'name',
   *   itemscope: '',
   *   itemtype : 'Person',
   *   'data-id': null, // remove the `[data-id]` attribute
   * })
   * my_elem.attr()                                            // do nothing; return `this`
   * ```
   *
   * Notes:
   * - If the attribute is a **boolean attribute** and is present (such as [`checked=""`]), provide the empty string `''` as the value.
   * - Since this method returns `this`, it can be chained, e.g.,
   *   `my_elem.attr('itemscope', '').attr('itemtype','Thing').attr('itemprop', null)`.
   *   However, it may be simpler to use an object argument:
   *   `my_elem.attr({ itemscope:'', itemtype:'Thing', itemprop:null })`.
   *   Note you can also use the method {@link Element#attrStr()|attrStr()}
   *   if you have strings and are not removing any attributes:
   *   `my_elem.attrStr('itemscope=""', 'itemtype="Thing"')`.
   *
   * @param {(string|Object<AttrValue>)=} key the name of the attribute to set or get, or an object with AttrValue type values
   * @param {AttrValue=} value the value to set, or `null` to remove the value, or `undefined` (or not provided) to get it
   * @return {(Element|string=)} `this` if setting an attribute, else the value of the attribute specified
   *                             (or `undefined` if that attribute had not been set)
   */
  attr(key = '', value) {
    // REVIEW: object lookups too complicated here; using standard switches
    switch (Util.Object.typeOf(key)) {
      case 'string':
        if (key.trim() === '') break;
        switch (Util.Object.typeOf(value)) {
          case 'function' : this._attributes.setFn(key, value, this); break;
          case 'null'     : this._attributes.delete(key); break;
          case 'undefined': return this._attributes.get(key);
          default         : this._attributes.set(key, value); break; // string, boolean, number, infinite, NaN
        }
        break;
      case 'object': for (let i in key) this.attr(i, key[i]); break;
      default      : throw new TypeError('Provided key must be a string or object.')
    }
    return this
  }

  /**
   * Add (or modify) one or more attributes, given strings.
   * Strings must take the form `'attribute="attr value"'`.
   * Multiple arguments may be provided.
   * This method does not remove attributes.
   *
   * Examples:
   * ```
   * my_elem.attr('itemprop','name').attr('itemscope','').attr('itemtype':'Person') // old
   * my_elem.attrStr('itemprop="name"', 'itemscope=""', 'itemtype="Person"')        // new
   * my_elem.attrStr() // do nothing; return `this`
   * ```
   * @param  {string=} attr_str a string of the format `'attribute="attr value"'`
   * @return {Element} `this`
   */
  attrStr(...attr_str) {
    attr_str.forEach((str) => this.attr(str.split('=')[0], str.split('=')[1].slice(1,-1)))
    return this
  }

  /**
   * Shortcut method for setting/getting the `id` attribute of this element.
   *
   * Examples:
   * ```
   * my_elem.id('section1') // set the [id] attribute
   * my_elem.id(function () { return this.attr('data-id') }) // set the [id] attribute using a function
   * my_elem.id(null)       // remove the [id] attribute
   * my_elem.id()           // return the value of [id]
   * ```
   *
   * @param  {AttrValue=} id the value to set for the `id` attribute
   * @return {(Element|string=)} `this` if setting the ID, else the value of the ID (or `undefined` if not set)
   */
  id(id) {
    return this.attr('id', id)
  }

  /**
   * Shortcut method for setting/getting the `class` attribute of this element.
   *
   * Examples:
   * ```
   * my_elem.class('o-Object c-Component') // set the [class] attribute
   * my_elem.class(null)                   // remove the [class] attribute
   * my_elem.class()                       // return the value of [class]
   * ```
   *
   * @param  {AttrValue=} classs the value to set for the `class` attribute
   * @return {(Element|string=)} `this` if setting the class, else the value of the class (or `undefined` if not set)
   */
  class(classs) {
    if (typeof classs === 'string' && classs.trim() === '') return this.class(null)
    return this.attr('class', classs)
  }

  /**
   * Append to this element’s `[class]` attribute.
   * When adding classes, use this method instead of {@link Element#class()|Element#class(...)},
   * as the latter will overwrite the `[class]` attribute.
   *
   * Examples:
   * ```
   * my_elem.addClass('o-Object c-Component') // add to the [class] attribute
   * my_elem.addClass()                       // do nothing; return `this`
   * ```
   *
   * @param  {string=} class_str the classname(s) to add, space-separated
   * @return {Element} `this`
   */
  addClass(class_str = '') {
    if (class_str === '') return this
    return this.class(`${this.class() || ''} ${class_str}`)
  }

  /**
   * Remove a single token from this element’s `class` attribute.
   *
   * Examples:
   * ```
   * my_elem.removeClass('o-Object') // remove one class
   * my_elem.removeClass()           // do nothing; return `this`
   * ```
   *
   * @param  {string=} classname classname to remove; must not contain spaces
   * @return {Element} `this`
   */
  removeClass(classname = '') {
    classname = classname.trim()
    if (classname === '') return this
    let classes = (this.class() || '').split(' ')
    let index = classes.indexOf(classname)
    if (index >= 0) classes.splice(index, 1)
    return this.class(classes.join(' '))
  }

  /**
   * Shortcut method for setting/getting the `style` attribute of this element.
   *
   * Examples:
   * ```
   * my_elem.style('background:none; font-weight:bold;')      // set the [style] attribute, with a string
   * my_elem.style({background:'none', 'font-weight':'bold'}) // set the [style] attribute, with an object
   * my_elem.style(function () { return 'background:none; font-weight:bold;' }) // set the [style] attribute, with a function: the function must return a string
   * my_elem.style(null)                                      // remove the [style] attribute
   * my_elem.style()                                          // return the value of [style], as a string (or `undefined` if the attribute has not been set)
   * ```
   *
   * @param  {(AttrValue|Object<string>)=} arg the value to set for the `style` attribute; not a number or boolean though
   * @return {(Element|Object<string>|string=)} `this` if setting the style, else the value of the style (or `undefined` if not set)
   */
  style(arg) {
    if (['number','infinite','boolean'].includes(Util.Object.typeOf(arg))) throw new Error('Provided argument cannot be a number or boolean.')
    if (Util.Object.is(arg, {}) || arg === '') return this.style(null)
    let returned = {
      object: function () {
        return this.attr('style', new ObjectString(arg).toCssString())
      },
      string: function () {
        return this.style(ObjectString.fromCssString(arg).data)
      },
      default: function () { return this.attr('style', arg) }, // function, null, undefined
    }
    return (returned[Util.Object.typeOf(arg)] || returned.default).call(this)
  }

  /**
   * Set or get css properties of this element’s inline styles (`[style]` attribute).
   *
   * If the key given is a string, and the value is a non-null {@link AttrValue} type,
   * then the property will be set (or modified) with the result of the value.
   *
   * If the key is a string and the value is `null,` or if the value is `''` (CHANGED!),
   * then the property identified by the key is removed from this element’s css.
   *
   * If the key is a string and the value is not provided (or `undefined`),
   * then this method returns the value of the property identified by the key.
   * If no such property exists, `undefined` is returned.
   * (NOTE that css properties default to the `unset` value---either `inherit` or `initial`,
   * depending on whether the property is inherited or not.)
   *
   * If an object key is provided, then no value argument may be provided.
   * The object must have values of the {@link AttrValue} type;
   * thus for each key-value pair in the object, this method assigns corresponding
   * css properties. You may use this method with a single object argument to set and/or remove
   * multiple properties (using `null` to remove).
   *
   * If no arguments are provided, or if the key is `''`, this method does nothing and returns `this`.
   *
   * Examples:
   * ```
   * my_elem.css('background', 'red')                       // set the `background` property
   * my_elem.css('font-weight', '')                         // remove the `font-weight` property
   * my_elem.css('text-align')                              // get the value of the `text-align` property (or `undefined` if it had not been set)
   * my_elem.css('font-weight', null)                       // remove the `font-weight` property
   * my_elem.css('color', function () { return this.id() }) // set the `color` property to this element’s ID
   * my_elem.css({                                          // set/remove multiple attributes all at once
   *   background  : 'red',
   *   margin      : '1rem',
   *   opacity     : 0.5,
   *   visibility  : null, // remove the `visibility` property
   *   'text-align': '',   // remove the `text-align` property
   * })
   * my_elem.css()                                          // do nothing; return `this`
   * ```
   *
   * @param {(string|Object<AttrValue>)=} prop the name of the css property to set or get, or an object with AttrValue type values
   * @param {AttrValue=} value the value to set, or `null` to remove the value, or `undefined` (or not provided) to get it
   * @return {(Element|string=)} `this` if setting a property, else the value of the property specified
   *                             (or `undefined` if that property had not been set)
   */
  css(prop = '', value) {
    // REVIEW: object lookups too complicated here; using standard switches
    switch (Util.Object.typeOf(prop)) {
      case 'string':
        if (prop.trim() === '') break;
        let style_obj = ObjectString.fromCssString(this.style())
        switch (Util.Object.typeOf(value)) {
          case 'function' : style_obj.setFn(prop, value, this); break;
          case 'null'     : style_obj.delete(prop); break;
          case 'undefined': return style_obj.get(prop);
          case 'string'   : if (value.trim() === '') return this.css(prop, null);
          default         : style_obj.set(prop, value); break; // boolean, number, infinite, NaN
        }
        return this.attr('style', style_obj.toCssString())
      case 'object': for (let i in prop) this.css(i, prop[i]); break;
      default      : throw new TypeError('Provided property must be a string or object.')
    }
    return this
  }

  /**
   * Set/get/remove a `[data-*]` custom attribute with a name and a value.
   * Shorthand method for <code>this.attr(`data-${name}`, value)</code>.
   * @param  {string} name  the suffix of the `[data-*]` attribute
   * @param  {AttrValue=} value the value to assign to the attribute, or `null` to remove it
   * @return {(Element|string=)} `this` if setting an attribute, else the value of the attribute specified
   *                             (or `undefined` if that attribute had not been set)
   */
  data(name, value) {
    return this.attr(`data-${name}`, value)
  }

  /**
   * Add content to this element.
   * **May not be called on elements that are void!**
   * @param {string} contents the contents to add
   * @return {Element} `this`
   */
  addContent(contents) {
    if (this.isVoid) throw new Error('Cannot add contents to a void element.')
    this._contents += contents
    return this
  }

  /**
   * Add elements as children of this element.
   * @param {Array<?Element>} elems array of Element objects to add
   */
  addElements(elems) {
    return this.addContent(
      elems
        .filter((el) => el !== null)
        .map((el) => el.html()).join('')
    )
  }

  /**
   * Render this element as an HTML string.
   * @return {string} an HTML string representing this element
   */
  html() {
    if (this.isVoid) return `<${this.name}${this._attributes.toAttrString()}/>`
    return `<${this.name}${this._attributes.toAttrString()}>${this.contents}</${this.name}>`
  }



  /**
   * Simple shortcut function to concatenate elements.
   * This method calls `.html()` on each argument and concatenates the strings,
   * or, if a single array is given, does the same to each entry in the array.
   * `null` is allowed as an argument (or as an entry in the array).
   * If an array is given, only one array is allowed.
   * @param  {?Element|Array<?Element>} elements one or more elements to output, or an array of elements
   * @return {string} the combined HTML output of all the arguments/array entries
   */
  static concat(...elements) {
    if (Util.Object.typeOf(elements[0]) === 'array') return Element.concat.call(null, ...elements[0]) // same as Element.concat.apply(null, elements[0])
    return elements
      .filter((el) => el !== null)
      .map((el) => el.html()).join('')
  }

  /**
   * Mark up data using an HTML element.
   * NOTE: recursive function.
   *
   * First and foremost, if the argument is an `Element` object, then this function returns
   * that object’s `.html()` value (with any added attributes specified by the options below).
   * Otherwise,
   * If the argument is an array, then a `<ul>` element is returned, with `<li>` items.
   * If the argument is a (non-array, non-function) object—even an Element object—then a `<dl>` element is returned, with
   * `<dt>` keys and `<dd>` values.
   * Then, each `<li>`, `<dt>`, and `<dd>` contains the result of this function called on that respective datum.
   * If the argument is not an object (or is a function), then it is converted to a string and returned.
   *
   * Optionally, an `options` argument may be supplied to enhance the data.
   * The following template serves as an example:
   * ```js
   * let options = {
   *   ordered: true,
   *   attributes: {
   *     list:  { class: 'o-List', itemscope: '', itemtype: 'Event'},
   *     value: { class: 'o-List__Item o-List__Value', itemprop: ((true) ? 'startTime' : 'endTime') },
   *     key:   { class: `o-List__Key ${(true) ? 'truthy' : 'falsy' }`, itemprop: `${(true) ? 'name' : 'headline'}` },
   *   },
   *   options: {
   *     ordered: false,
   *   },
   * }
   * ```
   *
   * If an Element object is given, that element’s specific attributes take precedence,
   * overwriting those given by the options, with the exception of `[class]` and `[style]`:
   * these attributes are added to those in the options.
   * ```js
   * Element.data(new Element('a').class('c-Link--mod').style({
   *   color: 'blue',
   *   'text-decoration': 'none',
   * }).attr('rel','external'), {
   *   attributes: { list: {
   *     class: 'c-Link',
   *     style: 'background: pink; text-decoration: underline;',
   *     href : '//eg.com',
   *     rel  : 'nofollow',
   *   } }
   * })
   * // returns `<a
   * //   class="c-Link c-Link--mod"
   * //   style="background:pink;text-decoration:none;color:blue"
   * //   rel="external" href="//eg.com"></a>`
   * ```
   *
   * This is the formal schema for the `options` parameter:
   * ```json
   * {
   *   "$schema": "http://json-schema.org/schema#",
   *   "title": "@param options",
   *   "type": "object",
   *   "description": "configurations for the output",
   *   "additionalProperties": false,
   *   "properties": {
   *     "ordered": {
   *       "type": "boolean",
   *       "description": "if the argument is an array, specify `true` to output an <ol> instead of a <ul>"
   *     },
   *     "attributes": {
   *       "type": "object",
   *       "description": "describes how to render the output elements’ attributes",
   *       "additionalProperties": false,
   *       "properties": {
   *         "list" : { "type": "object", "additionalProperties": { "type": "string" }, "description": "attributes of the list (<ul>, <ol>, or <dl>)" },
   *         "value": { "type": "object", "additionalProperties": { "type": "string" }, "description": "attributes of the item or value (<li> or <dd>)" },
   *         "key"  : { "type": "object", "additionalProperties": { "type": "string" }, "description": "attributes of the key (<dt>)" }
   *       }
   *     },
   *     "options": {
   *       "allOf": [{ "$ref": "#" }],
   *       "description": "configurations for nested items/keys/values"
   *     }
   *   }
   * }
   * ```
   *
   * @param  {*} thing the data to mark up
   * @param  {Object=} options configurations for the output
   * @param  {boolean=} options.ordered if the argument is an array, specify `true` to output an <ol> instead of a <ul>
   * @param  {Object<Object<string>>=} options.attributes describes how to render the output elements’ attributes
   * @param  {Object<string>=} options.attributes.list  attributes of the list (<ul>, <ol>, or <dl>)
   * @param  {Object<string>=} options.attributes.value attributes of the item or value (<li> or <dd>)
   * @param  {Object<string>=} options.attributes.key   attributes of the key (<dt>)
   * @param  {Object=} options.options configurations for nested items/keys/values
   * @return {string} the argument rendered as an HTML element
   */
  static data(thing, options = {}) {
    /**
     * Configuration attributes for elements.
     * Avoids TypeErrors (cannot read property of undefined).
     * @type {Object<Object<string>=>}
     */
    let attr = {
      list: options.attributes && options.attributes.list,
      val : options.attributes && options.attributes.value,
      key : options.attributes && options.attributes.key,
    }
    let returned = {
      object: function () {
        // REVIEW indentation
    if (thing instanceof Element) {
      for (let i in attr.list) {
        if (i !== 'class' && i !== 'style' && !thing.attr(i)) thing.attr(i, attr.list[i])
      }
      return thing
        .class(`${attr.list && attr.list.class || ''} ${thing.class() || ''}`)
        .style(`${attr.list && attr.list.style}; ${thing.style()}`)
        .html()
    }
        let returned = new Element('dl').attr(attr.list)
        for (let i in thing) {
          returned.addElements([
            new Element('dt').attr(attr.key).addContent(i),
            new Element('dd').attr(attr.val).addContent(Element.data(thing[i], options.options)),
          ])
        }
        return returned.html()
      },
      array: function () {
        return new Element((options.ordered) ? 'ol' : 'ul').attr(attr.list)
          .addElements(thing.map((el) =>
            new Element('li').attr(attr.val).addContent(Element.data(el, options.options))
          ))
          .html()
      },
      default: function () {
        return thing.toString()
      },
    }
    return (returned[Util.Object.typeOf(thing)] || returned.default).call(null)
  }
}
