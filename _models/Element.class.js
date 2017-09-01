var Util = require('./Util.class.js')

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
     * @type {Object<string>}
     */
    this._attributes = {}

    /**
     * The contents of this element.
     * If this is a void element, it must have no contents, and its tag must be self-closing.
     * @private
     * @type {?string}
     */
    this._contents = (this._VOID) ? null : ''
  }



  /**
   * Render this element’s attributes as a string.
   * The string is returned in the following format:
   * ` attr1="val1" attr2="val2" attr3="val3"`
   * @private
   * @return {string} string containing key-value pairs
   */
  _attributeString() {
    let returned = ''
    for (let i in this._attributes) {
      if (this._attributes[i]!==undefined) returned += ` ${i}="${this._attributes[i]}"`
    }
    return returned
  }

  /**
   * Represents a set of CSS rules for an element.
   * Private class for internal computations.
   * @private
   * @type {class}
   */
  static get _Style() { return STYLE }



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
   * Return the contents of this element.
   * @return {?string} this element’s contents, or `null` if this is a void element
   */
  get contents() { return this._contents }



  /**
   * Set or get an attribute of this element.
   *
   * If a key *and* value are provided, then the attribute name (the key)
   * will be created (or modified if it already exists), and it will be assigned the value given.
   *
   * There is one exception: If a key *and* value are provided, and the value is the primitive `null`,
   * then the attribute is removed from this element.
   * (Thus it is impossible to assign the primitive value `null` to an attribute.
   * To approximate this, provide the string `'null'`.)
   *
   * If the attribute is a **boolean attribute** and is present, provide the empty string `''` as the value.
   *
   * If only a key is provided and the value is not provided, then this method will return
   * the value of this element’s attribute named by the given key.
   * If no such attribute exists, `undefined` is returned.
   *
   * Examples:
   * ```
   * my_elem.attr('itemscope', '')  // set the boolean `itemscope` attribute
   * my_elem.attr('itemtype')       // get the value of the `itemtype` attribute (or `undefined` if it had not been set)
   * my_elem.attr('itemprop', null) // remove the `itemprop` attribute
   * ```
   *
   * This method can be chained, e.g.,
   * `my_elem.attr('itemscope', '').attr('itemtype').attr('itemprop', null)`.
   * However, it may be simpler to use the methods
   * {@link Element.attrObj()|attrObj()} and {@link Element.attrStr()|attrStr()}.
   *
   * @param {string} key the name of the attribute to set or get
   * @param {?*=} value the name of the value to set, or `null` to remove the attribute
   * @return {(Element|string=)} `this` if setting an attribute, else the value of the attribute specified
   *                             (or `undefined` if that attribute had not been set)
   */
  attr(key, value) {
    if (value===undefined) return this._attributes[key]
    if (value === null) delete this._attributes[key]
    else                this._attributes[key] = `${value}`.trim()
    return this
  }

  /**
   * Set/remove multiple attributes at once, providing an attributes object.
   *
   * The argument must be an object who has string or null values. No values may be `undefined`.
   * The values of the argument act just like the `value` parameter in {@link Element#attr()}.
   * For example:
   *
   * `my_element.attrObj({ itemprop:'name' })` sets the attribute `[itemprop="name"]` on this element.
   * If the `[itemprop]` attribute already exists, it will be overriden to the value `"name"`.
   *
   * `my_element.attrObj({ itemprop:null })` removes the `[itemprop]` attribute altogether.
   *
   * Examples:
   * ```
   * my_elem.attr('itemprop','name').attr('itemscope','').attr('itemtype':'Person') // old
   * my_elem.attrObj({ itemprop:'name', itemscope:'', itemtype:'Person' })          // new
   * my_elem.attrObj() // do nothing; return `this`
   * ```
   *
   * @param  {Object<?string>=} attr_obj the attributes object given
   * @return {Element} `this`
   */
  attrObj(attr_obj = {}) {
    for (let i in attr_obj) { this.attr(i, attr_obj[i]) }
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
   * my_elem.id(null)       // remove the [id] attribute
   * my_elem.id()           // return the value of [id]
   * ```
   *
   * @param  {?string=} id_str the value to set for the `id` attribute, or `null` to remove it
   * @return {(Element|string)} `this` if setting the id, else the value of the id
   */
  id(id_str) {
    return this.attr('id', id_str)
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
   * @param  {?string=} class_str the value to set for the `class` attribute, or `null` to remove it
   * @return {(Element|string)} `this` if setting the class, else the value of the class
   */
  class(class_str) {
    if (typeof class_str === 'string' && class_str.trim() === '') return this.class(null)
    return this.attr('class', class_str)
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
   * my_elem.style(null)                                      // remove the [style] attribute
   * my_elem.style()                                          // return the value of [style], as a string (or `undefined` if the attribute has not been set)
   * my_elem.style([])                                        // return the value of [style], as an object
   * ```
   *
   * @param  {?(Object<string>|Array|string)=} arg the value to set for the `style` attribute, or `null` to remove it
   * @return {(Element|Object<string>|string=)} `this` if setting the style, else the value of the style
   */
  style(arg) {
    if (arg === undefined || arg === null) return this.attr('style', arg)
    if (Util.Object.is(arg, {}) || arg === '') return this.style(null)
    return ({
      object: () => this.attr('style', new Element._Style(arg).toString()),  // set the style with an object
      string: () => this.style(new Element._Style(arg).toObject()),          // set the style with a string
      array : () => new Element._Style(this.attr('style') || '').toObject(), // get the style as an object
    })[Util.Object.typeOf(arg)]()
  }

  /**
   * Append to this element’s `style` attribute,
   * overwriting duplicate CSS properties.
   *
   * Examples:
   * ```
   * my_elem.addStyle('background:none; font-weight:bold;')      // add to the [style] attribute
   * my_elem.addStyle({background:'none', 'font-weight':'bold'}) // add to the [style] attribute
   * my_elem.addStyle()                                          // do nothing; return `this`
   * ```
   *
   * @param {(Object<string>|string)=} arg the style(s) to add, as valid CSS
   * @return {Element} `this`
   */
  addStyle(arg = '') {
    if (arg === '') return this
    return ({
      object: () => this.style(Object.assign({}, this.style([]), arg)),
      string: () => this.addStyle(new Element._Style(arg).toObject()) ,
    })[Util.Object.typeOf(arg)]()
  }

  /**
   * Remove a single CSS rule from this element’s `style` attribute.
   * @param  {string=} cssprop single CSS property name
   * @return {Element} `this`
   */
  removeStyleProp(cssprop = '') {
    let css_obj = this.style([])
    delete css_obj[cssprop]
    return this.style(css_obj)
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
   * @param {Array<Element>} elems array of Element objects to add
   */
  addElements(elems) {
    return this.addContent(elems.map((el) => el.html()).join(''))
  }

  /**
   * Render this element as an HTML string.
   * @return {string} an HTML string representing this element
   */
  html() {
    if (this.isVoid) return `<${this.name}${this._attributeString()}/>`
    return `<${this.name}${this._attributeString()}>${this.contents}</${this.name}>`
  }



  /**
   * Simple shortcut function to concatenate elements.
   * This method calls `.html()` on each argument and concatenates the strings.
   * @param  {Element} elements one or more elements to output
   * @return {string} the combined HTML output of all the arguments
   */
  static concat(...elements) {
    return elements.map((el) => el.html()).join('')
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
   *   "definitions": {
   *     "{Object<string>}": {
   *       "type": "object",
   *       "additionalProperties": false,
   *       "patternproperties": {
   *         "*": { "type": "string" }
   *       }
   *     }
   *   },
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
   *         "list" : { "allOf": [{ "$ref": "#/definitions/{Object<string>}" }], "description": "attributes of the list (<ul>, <ol>, or <dl>)" },
   *         "value": { "allOf": [{ "$ref": "#/definitions/{Object<string>}" }], "description": "attributes of the item or value (<li> or <dd>)" },
   *         "key"  : { "allOf": [{ "$ref": "#/definitions/{Object<string>}" }], "description": "attributes of the key (<dt>)" }
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
    if (Util.Object.typeOf(thing) !== 'object' && Util.Object.typeOf(thing) !== 'array') return thing.toString()
    if (thing instanceof Element) {
      for (let i in attr.list) {
        if (i !== 'class' && i !== 'style' && !thing.attr(i)) thing.attr(i, attr.list[i])
      }
      return thing
        .class(`${attr.list && attr.list.class || ''} ${thing.class() || ''}`)
        .style(`${attr.list && attr.list.style}; ${thing.style()}`)
        .html()
    }
    return ({
      object: () => {
        let returned = new Element('dl').attrObj(attr.list)
        for (let i in thing) {
          returned.addElements([
            new Element('dt').attrObj(attr.key).addContent(i),
            new Element('dd').attrObj(attr.val).addContent(Element.data(thing[i], options.options)),
          ])
        }
        return returned.html()
      },
      array: () =>
        new Element((options.ordered) ? 'ol' : 'ul').attrObj(attr.list)
          .addElements(thing.map((el) =>
            new Element('li').attrObj(attr.val).addContent(Element.data(el, options.options))
          ))
          .html(),
    })[Util.Object.typeOf(thing)]()
  }
}

const STYLE = class {
  /**
   * Construct a new Style object.
   * @param {(Object<string>|string)=} rules the object or string containing css property-value pairs
   */
  constructor(rules = {}) {
    let css_object = rules
    if (Util.Object.typeOf(rules) === 'string') {
      css_object = {}
      rules.split(';').map((r) => r.split(':')).forEach(function (rule_arr) {
        rule_arr[0] = rule_arr[0] && rule_arr[0].trim() // css property
        rule_arr[1] = rule_arr[1] && rule_arr[1].trim() // css value
        if (rule_arr[0] && rule_arr[1]) css_object[rule_arr[0]] = rule_arr[1]
      })
    }
    /** @private */ this._obj = css_object
  }

  /**
   * Set a CSS property, or override one if it exists.
   * The argument for the value must be a string.
   * @param {string} property the property to set
   * @param {string} value the value to set
   * @return {Style} `this`
   */
  set(property, value) {
    this._obj[property] = value
    return this
  }

  /**
   * Get the value of the given CSS property, or `undefined` if it does not exist.
   * @param  {string} property the property to get
   * @return {string=} the value of the specified property
   */
  get(property) {
    return this._obj[property]
  }

  /**
   * Convert this style into a string.
   * @return {string} a valid CSS string containing property-value pairs.
   */
  toString() {
    let css_string = ''
    for (let i in this._obj) {
      css_string += `${i}:${this._obj[i]};`
    }
    return css_string
  }

  /**
   * Return a shallow clone of this style’s CSS object.
   * The returned value may be modified without affecting this object.
   * Example:
   * ```js
   * let a = new Style({ 'font-weight': 'bold' })
   * let obj = a.toObject
   * obj['font-style'] = 'italic'
   * let b = new Style(obj)
   * a.toString() // 'font-weight:bold;'
   * b.toString() // 'font-weight:bold;font-style:italic;'
   * ```
   * @return {Object<string>} a shallow clone of `this._obj`
   */
  toObject() {
    return Object.assign({}, this._obj)
  }
}
