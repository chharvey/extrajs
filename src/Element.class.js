console.warn(`
  (${__filename})
  WARNING: \`Element.class\` is OBSOLETE!
  This class will be removed on Version 0.14+.
`)
const xjs = require('../index.js')
const ObjectString = require('./ObjectString.class.js')
module.exports = class Element {
  constructor(name, is_void = false) {
    this._NAME = name
    this._VOID = is_void || [
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
    this._attributes = new ObjectString()
    this._contents = (this._VOID) ? null : ''
  }
  get name() { return this._NAME }
  get isVoid() { return this._VOID }
  get attributes() { return this._attributes.data }
  get contents() { return this._contents }
  get styles() {
    return ObjectString.fromCssString(this.style() || '').data
  }
  get dataset() {
    let returned = new ObjectString()
    for (let i in this._attributes.data) {
      if (i.slice(0,5) === 'data-') returned.set(i.slice(5), this._attributes.data[i])
    }
    return returned.data
  }
  attr(key = '', value) {
    switch (xjs.Object.typeOf(key)) {
      case 'string':
        if (key.trim() === '') break;
        switch (xjs.Object.typeOf(value)) {
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
  attrStr(...attr_str) {
    attr_str.forEach((str) => this.attr(str.split('=')[0], str.split('=')[1].slice(1,-1)))
    return this
  }
  id(id) {
    return this.attr('id', id)
  }
  class(classs) {
    if (typeof classs === 'string' && classs.trim() === '') return this.class(null)
    return this.attr('class', classs)
  }
  addClass(class_str = '') {
    if (class_str === '') return this
    return this.class(`${this.class() || ''} ${class_str}`)
  }
  removeClass(classname = '') {
    classname = classname.trim()
    if (classname === '') return this
    let classes = (this.class() || '').split(' ')
    let index = classes.indexOf(classname)
    if (index >= 0) classes.splice(index, 1)
    return this.class(classes.join(' '))
  }
  style(arg) {
    if (['number','infinite','boolean'].includes(xjs.Object.typeOf(arg))) throw new Error('Provided argument cannot be a number or boolean.')
    if (xjs.Object.is(arg, {}) || arg === '') return this.style(null)
    let returned = {
      object: function () {
        return this.attr('style', new ObjectString(arg).toCssString())
      },
      string: function () {
        return this.style(ObjectString.fromCssString(arg).data)
      },
      default: function () { return this.attr('style', arg) }, // function, null, undefined
    }
    return (returned[xjs.Object.typeOf(arg)] || returned.default).call(this)
  }
  css(prop = '', value) {
    // REVIEW: object lookups too complicated here; using standard switches
    switch (xjs.Object.typeOf(prop)) {
      case 'string':
        if (prop.trim() === '') break;
        let style_obj = ObjectString.fromCssString(this.style())
        switch (xjs.Object.typeOf(value)) {
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
  data(name, value) {
    return this.attr(`data-${name}`, value)
  }
  addContent(contents) {
    if (this.isVoid) throw new Error('Cannot add contents to a void element.')
    this._contents += contents
    return this
  }
  addElements(elems) {
    return this.addContent(
      elems
        .filter((el) => el !== null)
        .map((el) => el.html()).join('')
    )
  }
  html() {
    if (this.isVoid) return `<${this.name}${this._attributes.toAttrString()}/>`
    return `<${this.name}${this._attributes.toAttrString()}>${this.contents}</${this.name}>`
  }
  static concat(...elements) {
    if (xjs.Object.typeOf(elements[0]) === 'array') return Element.concat.call(null, ...elements[0]) // same as Element.concat.apply(null, elements[0])
    return elements
      .filter((el) => el !== null)
      .map((el) => el.html()).join('')
  }
  static data(thing, options = {}) {
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
    return (returned[xjs.Object.typeOf(thing)] || returned.default).call(null)
  }
}
