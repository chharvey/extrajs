console.warn(`
  (${__filename})
  WARNING: \`ObjectString.class\` is OBSOLETE!
  This class will be removed on Version 0.14+.
`)
const xjs = require('../index.js')
module.exports = class ObjectString {
  constructor(data = {}) {
    /** @private */ this._data = (function (d) {
      let returned = {}
      for (let i in d) returned[i.trim()] = d[i].trim()
      return returned
    })(data)
  }
  get data() {
    return xjs.Object.cloneDeep(this._data)
  }
  set(key, value) {
    if (['number','infinite','boolean'].includes(xjs.Object.typeOf(value))) return this.set(key, `${value}`)
    if (xjs.Object.typeOf(value) === 'NaN') throw new TypeError('Provided value cannot be NaN.')
    this._data[key.trim()] = value.trim()
    return this
  }
  setFn(key, valueFn, thisarg = null) {
    this.set(key, valueFn.call(thisarg || this))
  }
  get(key) {
    return this._data[key]
  }
  delete(key) {
    delete this._data[key]
    return this
  }
  toAttrString() {
    let returned = ''
    for (let i in this._data) {
      returned += ` ${i}="${this._data[i]}"`
    }
    return returned
  }
  toCssString() {
    let returned = ''
    for (let i in this._data) {
      returned += `${i}:${this._data[i]};`
    }
    return returned
  }
  static fromAttrString(attr_string) {
    throw new Error('feature not supported yet')
  }
  static fromCssString(css_string) {
    let returned = new ObjectString()
    css_string.split(';').map((rule) => rule.split(':')).forEach(function (rule_arr) {
      rule_arr[0] = rule_arr[0] && rule_arr[0].trim() // css property
      rule_arr[1] = rule_arr[1] && rule_arr[1].trim() // css value
      if (rule_arr[0] && rule_arr[1]) returned.set(rule_arr[0], rule_arr[1])
    })
    return returned
  }
}
